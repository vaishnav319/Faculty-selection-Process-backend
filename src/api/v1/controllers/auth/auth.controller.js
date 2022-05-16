const express = require("express");
const router = express.Router();
var createError = require("http-errors");
var bcrypt = require("bcryptjs");
const { Users, Otp, AdminPer, Mail } = require("../../models/index");
const { signAccessToken } = require("../../../../middleware/jwt_helper");
const { uploadToCloudinary } = require("../../../../middleware/cloudinary");
const sendEmail = require("../../../../middleware/sendMail");
const { fasttosms } = require("../../../../middleware/sendOtp");
exports.registerUser = (req, res, next) => {
  let accessToken;
  console.log(req.body);
  Users.findOne({ userEmail: req.body.email })
    .then(async (doc) => {
      if (!doc) {
        if (!req.file) {
          return next(createError(404, "Please upload resume"));
        }
        console.log("Body:", req.body);
        const result = await uploadToCloudinary(req.file, "users", "resume");

        const salt = await bcrypt.genSalt(10);
        const HashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new Users({
          userName: req.body.userName,
          userEmail: req.body.userEmail,
          phoneNumber: req.body.phoneNumber,
          password: HashedPassword,
          resume: result.url,
          qualification: req.body.qualification,
        });
        accessToken = await signAccessToken(user.id, req.body.role);
        console.log(user);
        user
          .save()
          .then((data) => {
            res.status(200).json({
              statusCode: 200,
              message: "success",
              accessToken,
              data,
            });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        createError.Conflict("USER ALREADY EXISTS");
      }
    })
    .catch((err) => {
      next(err);
    });
};
exports.registerHr = (req, res, next) => {
  let accessToken;
  console.log(req.body);
  AdminPer.findOne({ userEmail: req.body.email })
    .then(async (doc) => {
      console.log(doc);
      Users.findOne({ userEmail: req.body.email }).then(async (doc) => {
        if (!doc) {
          if (!req.file) {
            return next(createError(404, "Please upload resume"));
          }
          console.log("Body:", req.body);
          const result = await uploadToCloudinary(req.file, "hrs", "resume");
          const salt = await bcrypt.genSalt(10);
          const HashedPassword = await bcrypt.hash(req.body.password, salt);
          const user = new Users({
            userEmail: req.body.email,
            userName: req.body.userName,
            password: HashedPassword,
            phoneNumber: req.body.phoneNumber,
            resume: result.url,
            role: "HR",
            qualification: req.body.qualification,
          });
          accessToken = await signAccessToken(user.id, "HR");
          console.log(user);
          user
            .save()
            .then((data) => {
              res.status(200).json({
                statusCode: 200,
                message: "success",
                accessToken,
                data,
              });
            })
            .catch((err) => {
              next(err);
            });
        } else {
          createError.Conflict("USER ALREADY EXISTS");
        }
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.checkAdminPer = (req, res, next) => {
  console.log(req.body);
  AdminPer.findOne({ userEmail: req.body.userEmail })
    .then(async (doc) => {
      if (doc) {
        res.status(200).json({
          statusCode: 200,
          isAdded: true,
          message: "success",
        });
      } else {
        next(createError(401, "Admin not added your email,Contact Admin"));
      }
    })
    .catch((err) => {
      next(err);
    });
};
exports.loginUser = (req, res, next) => {
  var user;
  let accessToken;
  console.log(req.body);
  Users.find({ userEmail: req.body.email })
    .then(async (users) => {
      if (users.length > 0) {
        user = users[0];
        console.log("in users");
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }
        accessToken = await signAccessToken(user.id, user.role);
        console.log(user);
        res.status(200).json({
          statusCode: 200,
          message: "Login Successfull",
          accessToken,
          role: user.role,
          data: user,
        });
      } else {
        next(createError(401, "USER not found"));
      }
    })
    .catch((err) => {
      next(err);
    });
};
exports.getLoggedinUser = async (req, res) => {
  const id = req.user._id;
  console.log(id);
  Users.findById(id)
    .select("-password")
    .then((doc) => {
      if (!doc) {
        res.status(400).json({ errors: [{ msg: "User doesn't exist" }] });
      }
      res.status(200).json({
        statusCode: 200,
        message: "User Found",
        role: req.user.role,
        data: doc,
      });
    });
};
exports.getOtp = async (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  const newData = new Otp({
    number: req.body.number,
    otp: otp,
  });
  console.log(newData);
  const result = await fasttosms(req.body.number, parseInt(otp));
  // const result = fasttosms(req.body.parentPhoneNumber, parseInt(otp));
  newData.save().then((doc) => {
    res.status(200).json({
      statusCode: 200,
      message: "Data stored",
      data: doc,
    });
  });
};
exports.verifyUser = async (req, res, next) => {
  var user = await Otp.findOne({ number: req.body.number });

  if (user) {
    if (parseInt(user.otp) !== parseInt(req.body.userOtp)) {
      return next(createError(401, "OTP IS NOT VALID"));
    }
    let VerifiedUser = {
      number: req.body.number,
      Verified: true,
    };
    Users.findById(req.user._id)
      .select("-password")
      .then((doc) => {
        console.log("In Verify OTP", doc);
        console.log(doc.isVerified);
        doc.isVerified = true;
        doc.save();
      });

    res.status(200).json({
      statusCode: 200,
      message: "Verification successful",
      data: VerifiedUser,
    });
  } else {
    next(createError(404, "OTP expired try to resend it"));
  }
};
exports.getForgotOTP = async (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  const newData = new Mail({
    userEmail: req.body.userEmail,
    otp: otp,
  });
  console.log(newData);

  sendEmail(
    req.body.userEmail,
    "OTP for forgot Password",
    `Your OTP for resetting password is ${otp}`
  );
  newData.save().then((doc) => {
    res.status(200).json({
      statusCode: 200,
      message: "Data stored",
      data: doc,
    });
  });
};
exports.verifyUserForgotPassword = async (req, res, next) => {
  console.log(req.body);
  var user = await Mail.find();
  console.log(Object.keys(user).length);
  console.log(user[0].otp);
  if (user) {
    if (parseInt(user[0].otp) !== parseInt(req.body.userOtp)) {
      return next(createError(401, "OTP IS NOT VALID"));
    }
    let VerifiedUser = {
      userEmail: req.body.userEmail,
      Verified: true,
    };

    res.status(200).json({
      statusCode: 200,
      message: "Verification successful",
      data: VerifiedUser,
    });
  } else {
    next(createError(404, "OTP expired try to resend it"));
  }
};
exports.updatePassword = async (req, res, next) => {
  const user = await Users.find({ userEmail: req.body.userEmail });
  let accessToken;
  const salt = await bcrypt.genSalt(10);
  const HashedPassword = await bcrypt.hash(req.body.password, salt);
  accessToken = await signAccessToken(user[0].id, user[0].role);
  user[0].password = HashedPassword;
  console.log(user[0]);
  user[0].save().then((data) => {
    res.status(200).json({
      statusCode: 200,
      message: "success",
      accessToken,
      data,
    });
  });
};
exports.updateProfilePic = async (req, res, next) => {
  const id = req.user._id;
  console.log(id);
  if (!req.file) {
    return next(createError(404, "Please upload profile picture"));
  }
  const result = await uploadToCloudinary(req.file, "user", "profile-pictures");
  const profile = await Users.findById(req.user._id);

  profile.profilePicture = result.url;
  profile
    .save()
    .then((profile) => {
      res.json({
        statusCode: 200,
        message: "Profile Picssss Updated",
        data: profile,
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.updateUserInfo = async (req, res, next) => {};
