const express = require("express");
const router = express.Router();

const AuthRoute = require("./auth/auth.route");
const UserProfileRoute = require("./profile/userProfile.route");
const HrProfileRoute = require("./profile/hrProfile.route");
const ContactRoute = require("./contact/contact.route");
const ApplicationRoute = require("./application/application.route");
const DashboardRoute = require("./dashboard/dashboard.route");
const AdminRoutes = require("./admin/admin.route");

router.use("/auth", AuthRoute);
router.use("/user", UserProfileRoute);
router.use("/hr", HrProfileRoute);
router.use("/contact", ContactRoute);
router.use("/application", ApplicationRoute);
router.use("/dashboard", DashboardRoute);
router.use("/admin", AdminRoutes);
module.exports = router;
