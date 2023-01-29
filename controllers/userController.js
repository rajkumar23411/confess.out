const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Confession = require("../models/confession");
const { generateOtp } = require("../config/functions");
const sendMail = require("../config/sendMail");

const userController = {
  async postRegister(req, res) {
    const { firstname, lastname, email, password, repeat_password } = req.body;

    if (!firstname || !lastname || !email || !password || !repeat_password) {
      req.flash("error", "All fields are required");
      req.flash("firstname", firstname);
      req.flash("lastname", lastname);
      req.flash("email", email);

      return res.redirect("/signup");
    }

    // check password length
    if (password.length < 6) {
      req.flash("error", "Password must be of 6 or more than 6 characters");
      req.flash("firstname", firstname);
      req.flash("lastname", lastname);
      req.flash("email", email);
      return res.redirect("/signup");
    }

    // check both passwords are matched or not
    if (repeat_password != password) {
      req.flash("error", "Password does not match");
      req.flash("firstname", firstname);
      req.flash("lastname", lastname);
      req.flash("email", email);
      return res.redirect("/signup");
    }

    // check email exists or not
    const isExists = await User.findOne({ email: req.body.email });

    if (isExists) {
      req.flash("error", "This email is already taken");
      req.flash("firstname", firstname);
      req.flash("lastname", lastname);
      req.flash("email", email);

      return res.redirect("/signup");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    await user
      .save()
      .then((user) => {
        return res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        req.flash("error", "Something went wrong");
        req.flash("firstname", firstname);
        req.flash("lastname", lastname);
        req.flash("email", email);

        return res.redirect("/signup");
      });
  },

  postLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "All fields are required");
      req.flash("email", email);

      return res.redirect("/signin");
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        req.flash("error", err);
        return next(err);
      }

      if (!user) {
        req.flash("error", info.message);
        return res.redirect("/signin");
      }

      req.logIn(user, (err) => {
        if (err) {
          req.flash("error", info.message);
        }
        return res.redirect("/");
      });
    })(req, res, next);
  },

  postLogout(req, res) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/signin");
    });
  },
  async postUpdateEmail(req, res) {
    const { email, password } = req.body;
    const user = await User.findById(req.user._id);
    console.log(email, password);

    // check entered email already exists or not
    const isExists = await User.findOne({ email: req.body.email });

    if (isExists) {
      req.flash("error", "This email is already taken");
      req.flash("email", email);
      return res.redirect("/update/email");
    }

    // check entered password matched or not
    const macthPassword = await bcrypt.compare(password, user.password);

    if (!macthPassword) {
      req.flash("error", "Password does not matched");
      req.flash("email", email);
      return res.redirect("/update/email");
    }

    // if everything is ok then change email
    user.email = email;

    // save user to database
    await user.save();

    // after saving redirect user to profile page
    req.flash("success", "Your email has been updated");
    return res.redirect("/profile");
  },
  async updateName(req, res) {
    const { firstname, lastname } = req.body;
    const user = await User.findById(req.user._id);

    if (!firstname || !lastname) {
      return res.redirect("/profile");
    }

    user.firstname = firstname;
    user.lastname = lastname;

    await user.save();

    req.flash("success", "Your name has been updated");
    return res.redirect("/profile");
  },
  async deactiveAccount(req, res, next) {
    await Confession.deleteMany({ user: req.user._id }, (err) => {
      if (err) {
        req.flash("error", "Something went wrong");
        return res.redirect("/profile");
      } else {
        req.flash("success", "Confessions has been deleted");
      }
    });

    await User.findByIdAndDelete(req.user._id, function (err, user) {
      if (err) {
        req.flash("error", "Something went wrong");
        return res.redirect("/profile");
      } else {
        req.flash("success", "User deleted successfully");
      }
    });

    req.flash("success", "Account deleted");
    return res.redirect("/");
  },
  async postForgotEmail(req, res) {
    const { email } = req.body;

    if (!email) {
      req.flash("error", "Please enter your registerd email id");
      return res.redirect("/forgot/password");
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "No user found with this email");
      return res.redirect("/forgot/password");
    }

    const resetToken = generateOtp();

    user.resetPasswordToken = resetToken;
    user.resetPasswordExp = Date.now() + 15 * 60 * 1000;

    req.session.email = email;
    req.session.otp = resetToken;
    console.log(req.session.email);
    await user.save({ validateBeforeSave: false });

    const OtpMessage = `Your OTP is ${resetToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: `Confess Password Recovery`,
        message: OtpMessage,
      });

      req.flash("success", `OTP has been send to ${user.email}`);
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExp = undefined;
    }

    return res.redirect("/verify/otp");
  },
  async verifyOtp(req, res) {
    try {
      const { otp } = req.body;

      if (!otp) {
        req.flash("error", "OTP is required");
        return res.redirect("/verify/otp");
      }
      const email = req.session.email;

      console.log(email);
      const user = await User.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExp: { $gt: Date.now() },
      });

      if (!user) {
        req.flash("error", "Invalid OTP or OTP has been expired");
        return res.redirect("/verify/otp");
      }

      user.resetPasswordToken = undefined;
      user.resetPasswordExp = undefined;

      await user.save();

      return res.redirect("/reset/password");
    } catch (Err) {
      console.log(Err);
      return req.flash("err", "Something went wrong");
    }
  },
  async resetPassword(req, res) {
    const user = req.session.email;
    const { password, repeatPassword } = req.body;

    if (!password || !repeatPassword) {
      req.flash("error", "All fields are require");
      return res.redirect("/reset/password");
    }

    if (password.length < 6 || password.length > 10) {
      req.flash("error", "Password length must be in between 6-10 digits.");
      return res.redirect("/reset/password");
    }

    if (password !== repeatPassword) {
      req.flash("error", "Password does not mathced");
      return res.redirect("/reset/password");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate({ email: user }, { password: hashedPassword });

    req.session.destroy();

    return res.redirect("/");
  },
  async selectAvatar(req, res) {
    try {
      const { avatar } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.redirect("/");
      }

      user.avatar = avatar;

      await user.save();

      req.flash("success", "Your avatar has been updated");
      return res.redirect("/profile");
    } catch (error) {
      console.log(error);
      return req.flash("success", "something went wrong");
    }
  },
};

module.exports = userController;
