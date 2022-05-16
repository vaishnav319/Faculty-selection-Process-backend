const express = require("express");
const router = express.Router();
var createError = require("http-errors");
const sendEmail = require("../../../../middleware/sendMail");
const async = require("async");
const {
  Applications,
  AppliedUsers,
  Users,
  AdminPer,
} = require("../../models/index");

exports.addNotification = async (req, res, next) => {
  const adminID = "6266a2f8bdb246ddc8b3fd8d";
  console.log(adminID, req.user);
  try {
    const profile = await Users.findOne({
      _id: adminID,
    });
    console.log(profile);
    if (!profile) {
      throw createError(404, "Profile not found");
    }
    profile.notifications.unshift(req.body);

    await profile.save().then((profile) => {
      res.json({
        statusCode: 200,
        message: "notofication Added",
        data: profile,
      });
    });
  } catch (err) {
    next(createError(401, "Error in server"));
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const foundProfile = await HrProfile.findOne({ user: req.user._id });
    let val = foundProfile.experience;
    foundProfile.experience = foundProfile.experience.filter(
      (edu) => edu._id.toString() !== req.params.id
    );
    if (val === foundProfile.experience) {
      return createError(501, "Id not found");
    }
    await foundProfile.save().then((profile) => {
      res.json({
        statusCode: 200,
        message: "Experience Credentials removed",
        data: profile,
      });
    });
  } catch (error) {
    next(createError(401, "Sorry error in server"));
  }
};

exports.getAllNotifications = async (req, res, next) => {
  var AllNotifications = await Users.find({ role: "admin" });
  console.log(AllNotifications[0].notifications);
  return res.json({
    statusCode: 200,
    data: AllNotifications[0].notifications,
  });
};
