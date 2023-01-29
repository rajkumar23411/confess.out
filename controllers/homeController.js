const moment = require("moment");
const Confession = require("../models/confession");
const User = require("../models/user");
const homeController = {
  async home(req, res) {
    const confess = await Confession.find({ user: { $ne: req.user._id } })
      .sort({ createdAt: -1 })
      .populate("user", "avatar");
    return res.render("index", {
      title: "Home",
      confess: confess,
      moment,
    });
  },
  register(req, res) {
    res.render("signUp", {
      title: "sign up",
    });
  },
  login(req, res) {
    res.render("signIn", {
      title: "sign in",
    });
  },
  async profile(req, res) {
    const user = await User.findById(req.user._id);
    // const confessions = await Confession.find({ user: req.user._id });
    console.log(user);
    return res.render("profile", {
      title: "Profile",
      user,
      moment,
    });
  },

  updateEmail(req, res) {
    return res.render("updateEmail", {
      title: "Update Email",
    });
  },

  forgotPassword(req, res) {
    res.render("forgotPassword", {
      title: "Forgot password",
    });
  },

  resetPassword(req, res) {
    res.render("resetPassword", {
      title: "Reset Password",
    });
  },
  notification(req, res) {
    res.render("notification", {
      title: "Notifications",
    });
  },
  verifyOTP(req, res) {
    res.render("verifyOTP", {
      title: "Verify OTP",
    });
  },
  avatar(req, res) {
    res.render("avatars", {
      title: "Select avatar",
    });
  },
  notFound(req, res) {
    res.render("notFound", {
      title: "Not found",
    });
  },
};

module.exports = homeController;
