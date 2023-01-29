const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const router = require("./routes/web");

// asset path
const staticPath = path.join(__dirname, "public");
const templatePath = path.join(__dirname, "views");

require("dotenv").config({ path: "config/config.env" });

const init = require("./config/passport");

// session store
const store = new MongoDbStore({
  uri: process.env.DB_URI,
  collection: "mySessions",
});
store.on("error", () => {
  console.log(error);
});

// cookie-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
// session store
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 24 hrs
    },
  })
);
// express flash
app.use(flash());

// passport config
init(passport);
app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// setting up views engine
app.set("view engine", "ejs");
app.set("views", templatePath);

// global variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// asset
app.use(express.static(staticPath));

// routes
app.use(router);

module.exports = app;
