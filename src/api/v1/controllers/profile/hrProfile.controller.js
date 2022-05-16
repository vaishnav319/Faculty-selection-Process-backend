const express = require("express");
const router = express.Router();
var createError = require("http-errors");
const { HrProfile, Applications, AdminProfile } = require("../../models/index");
const { uploadToCloudinary } = require("../../../../middleware/cloudinary");

exports.createHrProfile = async (req, res, next) => {
  const {
    skills,
    location,
    gender,
    currentPosition,
    maxQualification,
    websiteLink,
    isWorking,
  } = req.body;

  // build a profile
  const profileFields = {};
  profileFields.user = req.user._id;
  if (gender) profileFields.gender = gender;
  if (location) profileFields.location = location;
  if (currentPosition) profileFields.currentPosition = currentPosition;
  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }

  if (maxQualification) profileFields.maxQualification = maxQualification;
  if (websiteLink) profileFields.websiteLink = websiteLink;
  if (isWorking) profileFields.isWorking = isWorking;

  try {
    let profile = await HrProfile.findOne({ user: req.user._id });

    if (profile) {
      //update
      profile = await HrProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({
        statusCode: 200,
        message: "Profile Updated Successfully",
        profile,
      });
    }

    profile = new HrProfile(profileFields);
    await profile.save().then((profile) => {
      res.status(200).json({
        statusCode: 200,
        message: "Profile Created Successfully",
        data: profile,
      });
    });
  } catch (err) {
    console.error(err.message);
    next(createError(401, "Error in server"));
  }
};
exports.createAdminProfile = async (req, res, next) => {
  const {
    skills,
    location,
    gender,
    currentPosition,
    maxQualification,
    websiteLink,
    isWorking,
  } = req.body;

  // build a profile
  const profileFields = {};
  profileFields.user = req.user._id;
  if (gender) profileFields.gender = gender;
  if (location) profileFields.location = location;
  if (currentPosition) profileFields.currentPosition = currentPosition;
  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }

  if (maxQualification) profileFields.maxQualification = maxQualification;
  if (websiteLink) profileFields.websiteLink = websiteLink;
  if (isWorking) profileFields.isWorking = isWorking;

  try {
    let profile = await AdminProfile.findOne({ user: req.user._id });

    if (profile) {
      //update
      profile = await AdminProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({
        statusCode: 200,
        message: "Profile Updated Successfully",
        profile,
      });
    }

    profile = new AdminProfile(profileFields);
    await profile.save().then((profile) => {
      res.status(200).json({
        statusCode: 200,
        message: "Profile Created Successfully",
        data: profile,
      });
    });
  } catch (err) {
    console.error(err.message);
    next(createError(401, "Error in server"));
  }
};

exports.updateHrProfilePic = async (req, res, next) => {
  if (!req.file) {
    return next(createError(404, "Please upload profile picture"));
  }
  const result = await uploadToCloudinary(req.file, "hr", "profile-pictures");
  const profile = await HrProfile.findOneAndUpdate({ id: req.user._id });

  profile.profilePicture = result.url;

  console.log(profile);
  profile
    .save()
    .then((profile) => {
      res.status(200).json({
        statusCode: 200,
        message: "Profile Updated",
        data: profile,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateExperience = async (req, res, next) => {
  try {
    const profile = await HrProfile.findOne({
      user: req.user._id,
    });
    if (!profile) {
      throw createError(404, "Experience not found");
    }
    profile.experience.unshift(req.body);

    await profile.save().then((profile) => {
      res.json({
        statusCode: 200,
        message: "Experience Credentials Added",
        data: profile,
      });
    });
  } catch (err) {
    next(createError(401, "Error in server"));
  }
};

exports.deleteExperience = async (req, res, next) => {
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

exports.getMyProfile = async (req, res, next) => {
  HrProfile.find({ user: req.user._id }).then(async (doc) => {
    if (doc[0]) {
      console.log("inside profile", doc);
      return res.json({
        statusCode: 200,
        message: "Successful",
        data: doc,
      });
    } else {
      next(createError(401, "No Profile Found"));
    }
  });
};
exports.getHRPostedApplications = async (req, res, next) => {
  Applications.find({ postedBy: req.user._id }).then(async (doc) => {
    if (doc) {
      return res.json({
        statusCode: 200,
        message: "Successful",
        data: doc,
      });
    }
  });
};
