const express = require("express");
const router = express.Router();
const {
  createUserProfile,
  updateEducation,
  updateExperience,
  deleteEducation,
  deleteExperience,
  getMyProfile,
} = require("../../controllers/profile/userProfile.controller");
const { protect } = require("../../../../middleware/auth.middleware");
const upload = require("../../../../middleware/multer");
router.route("/profile").post(protect, createUserProfile);

router.route("/education").post(protect, updateEducation);
router.route("/experience").post(protect, updateExperience);
router.route("/education/:id").delete(protect, deleteEducation);
router.route("/experience/:id").delete(protect, deleteExperience);
router.route("/me").get(protect, getMyProfile);
module.exports = router;
