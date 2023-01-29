const confessionController = require("../controllers/confessionController");
const homeController = require("../controllers/homeController");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const guest = require("../middlewares/guest");
const router = require("express").Router();

router.get("/", auth, homeController.home);
router.get("/add/confession", auth, confessionController.add);
router.get("/forgot/password", guest, homeController.forgotPassword);
router.get("/reset/password", guest, homeController.resetPassword);
router.get("/signup", guest, homeController.register);
router.get("/signin", guest, homeController.login);
router.get("/confession/:id", auth, confessionController.singleConfession);
router.get(
  "/confession/edit/:id",
  auth,
  confessionController.getEditConfession
);
router.get("/profile", auth, homeController.profile);
router.get("/confessions", auth, confessionController.allConfessions);
router.get("/notification", homeController.notification);
router.get("/update/email", homeController.updateEmail);
router.get("/verify/otp", homeController.verifyOTP);
router.get("/avatars", homeController.avatar);

router.post("/confess/delete/:id", auth, confessionController.deleteConfession);
router.post(
  "/confession_edit/:id",
  auth,
  confessionController.postEditConfession
);
router.post("/user/signup", userController.postRegister);
router.post("/user/signin", userController.postLogin);
router.post("/logout", userController.postLogout);
router.post("/add/confession", auth, confessionController.postConfession);
router.post("/update/name", userController.updateName);
router.post("/update/email", userController.postUpdateEmail);
router.post("/delete_account", auth, userController.deactiveAccount);
router.post("/send_mail", userController.postForgotEmail);
router.post("/verify_otp", userController.verifyOtp);
router.post("/reset_password", userController.resetPassword);
router.post("/report_post", confessionController.reportPost);
router.post("/avatar", userController.selectAvatar);
router.get("*", homeController.notFound);

module.exports = router;
