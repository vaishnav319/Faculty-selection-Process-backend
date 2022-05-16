const express = require("express");
const router = express.Router();
var createError = require("http-errors");
const { UserProfile, AppliedUsers } = require("../../models/index");
const { uploadToCloudinary } = require("../../../../middleware/cloudinary");

exports.createUserProfile = async (req, res, next) => {
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
    let profile = await UserProfile.findOne({ user: req.user._id });

    if (profile) {
      //update
      profile = await UserProfile.findOneAndUpdate(
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

    profile = new UserProfile(profileFields);
    await profile.save().then((profile) => {
      res.json({
        statusCode: 200,
        message: "Profile created successfully",
        data: profile,
      });
    });
  } catch (err) {
    console.error(err.message);
    next(createError(401, "Error in server"));
  }
};

exports.updateEducation = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user._id,
    });

    await profile.education.unshift(req.body);

    await profile.save().then((profile) => {
      res.json({
        statusCode: 200,
        message: "Education Credentials Added",
        data: profile,
      });
    });
  } catch (err) {
    next(createError(401, "Error in server"));
  }
};

exports.updateExperience = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user._id,
    });

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

exports.deleteEducation = async (req, res, next) => {
  try {
    const foundProfile = await UserProfile.findOne({ user: req.user._id });
    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.id
    );
    await foundProfile.save().then((profile) => {
      res.json({
        statusCode: 200,
        message: "Education Credentials removed",
        data: profile,
      });
    });
  } catch (error) {
    next(createError(401, "Error in server"));
  }
};
exports.deleteExperience = async (req, res, next) => {
  try {
    const foundProfile = await UserProfile.findOne({ user: req.user._id });
    foundProfile.experience = foundProfile.experience.filter(
      (edu) => edu._id.toString() !== req.params.id
    );
    await foundProfile.save().then((profile) => {
      res.json({
        statusCode: 200,
        message: "Experience Credentials removed",
        data: profile,
      });
    });
  } catch (error) {
    next(createError(401, "Error in server"));
  }
};

exports.getMyProfile = async (req, res, next) => {
  console.log("In Get my profile", req.user);
  UserProfile.find({ user: req.user._id }).then(async (doc) => {
    if (doc[0]) {
      console.log(doc[0]);
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
