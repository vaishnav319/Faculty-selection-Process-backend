const assert = require("assert");
const userModel = require("./auth/userDetails.model");
const otpModel = require("./auth/otp.model");

const userProfileModel = require("./profile/userProfile.model");
const hrProfileModel = require("./profile/hrProfile.model");
const adminProfileModel = require("./profile/adminProfile.model");

const contactModel = require("./contact/contact.model");

const applicationsModel = require("./application/application.model");
const appliedUsersModel = require("./application/appliedUsers.model");
const adminPerModel = require("./auth/adminPer.model");
const MailModel = require("./auth/Mail.model");

assert(userModel, "User Model is required");
assert(otpModel, "Otp model required");

assert(userProfileModel, "User Profile Model is required");
assert(hrProfileModel, "hr Profile Model is required");
assert(adminProfileModel, "admin Profile Model is required");

assert(contactModel, "contact Profile Model is required");

assert(applicationsModel, "Application model is required");
assert(appliedUsersModel, "Applied users model is required");
assert(adminPerModel, "Admin Per model is required");
assert(MailModel, "Mail is required");

module.exports = {
  Users: userModel,
  Otp: otpModel,
  Mail: MailModel,
  UserProfile: userProfileModel,
  HrProfile: hrProfileModel,
  AdminProfile: adminProfileModel,
  Contact: contactModel,
  Applications: applicationsModel,
  AppliedUsers: appliedUsersModel,
  AdminPer: adminPerModel,
};
