const express = require("express");
const router = express.Router();
var createError = require("http-errors");
const { Users, AdminPer } = require("../../models/index");

exports.getHrs = async (req, res, next) => {
  Users.find()
    .select("-password")
    .then(async (doc) => {
      if (doc[0]) {
        const docs = doc;

        const hrs = docs.filter((d) => d.role == "HR");
        return res.json({
          statusCode: 200,
          message: "Successful",
          data: hrs,
        });
      } else {
        next(createError(401, "No Hr's Found"));
      }
    });
};
exports.getPendingHrs = async (req, res, next) => {
  AdminPer.find().then(async (doc) => {
    console.log(doc);
    if (doc) {
      return res.json({
        statusCode: 200,
        message: "Successful",
        data: doc,
      });
    } else {
      next(createError(401, "No Hr's Found"));
    }
  });
};

exports.addHr = async (req, res, next) => {
  AdminPer.findOne({ userEmail: req.body.email })
    .then(async (doc) => {
      if (!doc) {
        console.log("Body:", req.body);

        const user = new AdminPer({
          userEmail: req.body.userEmail,
          phoneNumber: req.body.phoneNumber,
        });

        user
          .save()
          .then((data) => {
            res.status(200).json({
              statusCode: 200,
              message: "success",
              data,
            });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        createError.Conflict("USER ALREADY IN PENDING");
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeHr = async (req, res, next) => {
  Users.findOne({ userEmail: req.body.email })
    .then(async (doc) => {
      if (!doc) {
        console.log("Body:", req.body);

        doc
          .remove()
          .then((data) => {
            res.status(200).json({
              statusCode: 200,
              message: "success",
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
