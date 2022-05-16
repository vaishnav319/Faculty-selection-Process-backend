const express = require("express");
const router = express.Router();
const {
  createHrProfile,
  createAdminProfile,
  updateHrProfilePic,
  updateExperience,
  deleteExperience,
  getMyProfile,
  getHRPostedApplications,
} = require("../../controllers/profile/hrProfile.controller");
const {
  protect,
  hrprotect,
  adminprotect,
} = require("../../../../middleware/auth.middleware");
const upload = require("../../../../middleware/multer");
router.route("/profile").post(hrprotect, createHrProfile);
router.route("/admin/profile").post(adminprotect, createHrProfile);

router
  .route("/profilepic")
  .patch(hrprotect, upload.single("file"), updateHrProfilePic);
router.route("/experience").post(hrprotect, updateExperience);
router.route("/experience/:id").delete(hrprotect, deleteExperience);
router.route("/me").get(protect, getMyProfile);
router.route("/myapplications").get(hrprotect, getHRPostedApplications);
module.exports = router;
