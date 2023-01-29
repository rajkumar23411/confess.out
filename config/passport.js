const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

const init = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, {
            message: "Invalid email id or password",
          });
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
          return done(null, false, { message: "Invalid email id or password" });
        }

        return done(null, user, { message: "logged in successfully" });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const userData = await User.findById(id);
    done(null, userData);
  });
};

module.exports = init;
