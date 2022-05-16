const express = require("express");
const router = express.Router();
const {
  addNotification,
  getAllNotifications,
} = require("../../controllers/admin/admin.controller");
const {
  hrprotect,
  protect,
} = require("../../../../middleware/auth.middleware");
// const upload = require("../../../../middleware/multer");
router.route("/notification/add").post(protect, addNotification);
router.route("/notification/all").get(protect, getAllNotifications);
module.exports = router;
