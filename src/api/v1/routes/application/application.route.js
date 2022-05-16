const express = require("express");
const router = express.Router();
const {
  addApplication,
  updateApplication,
  apply,
  updateAppliedApplication,
  deleteApplication,
  deleteAppliedApplication,
  getAllApplications,
  getApplicationById,
  getAppliedUsers,
  getUsersAppliedApplications,
} = require("../../controllers/application/application.controller");
const {
  hrprotect,
  protect,
} = require("../../../../middleware/auth.middleware");
// const upload = require("../../../../middleware/multer");
router.route("/add").post(addApplication);
router.route("/update/:id").patch(hrprotect, updateApplication);
router.route("/apply/:id").post(protect, apply);
router.route("/status/:id").patch(hrprotect, updateAppliedApplication);
router.route("/delete/:id").delete(protect, deleteApplication);
router.route("/user/application/:id").delete(protect, deleteAppliedApplication);
router.route("/get/all").get(protect, getAllApplications);
router.route("/get/:id").get(protect, getApplicationById);
router.route("/get/applied/users/:id").get(protect, getAppliedUsers);
router.route("/myapplications").get(protect, getUsersAppliedApplications);

module.exports = router;
