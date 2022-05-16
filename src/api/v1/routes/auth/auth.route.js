const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getOtp,
  verifyUser,
  getLoggedinUser,
  updateProfilePic,
  getForgotOTP,
  verifyUserForgotPassword,
  registerHr,
  checkAdminPer,
} = require("../../controllers/auth/auth.controller");
const upload = require("../../../../middleware/multer");
const { protect } = require("../../../../middleware/auth.middleware");
router.post("/register", upload.single("file"), registerUser);
router.post("/register/hr", upload.single("file"), registerHr);
router.post("/check", checkAdminPer);
router
  .route("/profilepic")
  .patch(upload.single("file"), protect, updateProfilePic);
router.post("/login", loginUser);
router.route("/verify").post(protect, verifyUser);
router.post("/otp", getOtp);
router.route("/forgot/verify").post(protect, verifyUserForgotPassword);
router.post("/forgot/otp", getForgotOTP);
router.route("/user").get(protect, getLoggedinUser);
module.exports = router;
