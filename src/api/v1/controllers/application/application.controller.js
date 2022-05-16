const express = require("express");
const router = express.Router();
var createError = require("http-errors");
const sendEmail = require("../../../../middleware/sendMail");

const { Applications, AppliedUsers, Users } = require("../../models/index");
const async = require("async");
exports.addApplication = async (req, res, next) => {
  console.log(req.body);
  const {
    jobPosition,
    requirements,
    numberOfVacancies,
    minRange,
    maxRange,
    preferredQualification,
    description,
    que1,
    que2,
    preferredSkills,
    endsOn,
  } = req.body;
  console.log(req.body);
  // build an applicatiion
  const applicationFields = {};
  applicationFields.postedBy = "622f3afc51824af88a74625f";
  //applicationFields.postedBy = req.user_id;

  if (jobPosition) applicationFields.jobPosition = jobPosition;
  if (numberOfVacancies)
    applicationFields.numberOfVacancies = numberOfVacancies;
  if (preferredQualification)
    applicationFields.preferredQualification = preferredQualification;
  if (requirements) {
    applicationFields.requirements = requirements
      .split(",")
      .map((skill) => skill.trim());
  }
  if (minRange) {
    applicationFields.minRange = minRange;
  }
  if (maxRange) {
    applicationFields.maxRange = maxRange;
  }
  if (preferredQualification)
    applicationFields.preferredQualification = preferredQualification;
  applicationFields.questions = {};
  if (que1) applicationFields.questions.que1 = que1;
  if (que2) applicationFields.questions.que2 = que2;

  if (preferredSkills) applicationFields.preferredSkills = preferredSkills;
  if (description) applicationFields.description = description;
  applicationFields.postedOn = Date.now();
  if (endsOn) applicationFields.endsOn = endsOn;

  let application = new Applications(applicationFields);
  await application.save().then((app) => {
    res.status(200).json({
      statusCode: 200,
      message: "application Created Successfully",
      data: app,
    });
  });
};

exports.updateApplication = async (req, res, next) => {
  const body = req.body || {};
  const id = req.params.id;
  try {
    if (!id) throw createError.NotFound("Id Is Required");
    if (Object.keys(body).length == 0)
      throw createError.NotAcceptable("Body Is Empty");
    var exist = await Applications.findOne({ _id: id });
    console.log(exist);
    if (!exist) throw createError.NotFound("NOT FOUND");
    Applications.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { returnDocument: "after" },
      (err, doc) => {
        if (err) throw createError.NotFound("NOT FOUND");

        res.status(200).json({
          message: "Updated Successfully",
          data: doc,
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.apply = (req, res, next) => {
  let appId = req.params.id;
  let id = req.user._id;
  console.log(id);
  AppliedUsers.findOne({
    $and: [
      { applicationId: appId },
      { userId: id },
      // {'userId':id}
    ],
  }).then(async (doc) => {
    if (!doc) {
      let userAns = {};
      userAns.ans1 = req.body.ans1;
      userAns.ans2 = req.body.ans2;
      console.log(id);
      const apply = new AppliedUsers({
        userId: id,
        applicationId: appId,
        userAnswers: userAns,
        description: req.body.description,
        appliedDate: Date.now(),
      });
      const user = await Users.findById(req.user._id);
      console.log("User", user);
      sendEmail(
        user.userEmail,
        "Job Crack Application Received ✅",
        `Your Application Id: ${apply._id} . Thanks for applying to this job position we will get back to you`
      );
      apply
        .save()
        .then((data) => {
          res.status(200).json({
            statusCode: 200,
            message: "Applied Successfully",
            data,
          });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      createError(409, { message: "Already applied" });
    }
  });
};

exports.updateAppliedApplication = async (req, res, next) => {
  const body = req.body || {};
  const appId = req.params.id;
  try {
    if (!appId) throw createError.NotFound("Id Is Required");
    if (Object.keys(body).length == 0)
      throw createError.NotAcceptable("Body Is Empty");
    var exist = await AppliedUsers.findOne({ _id: appId });
    if (!exist) throw createError.NotFound("NOT FOUND");
    AppliedUsers.findOneAndUpdate(
      { _id: appId },
      { $set: body },
      { returnDocument: "after" },
      async (err, doc) => {
        if (err) throw createError.NotFound("NOT FOUND");
        console.log(doc.userId);
        const user = await Users.findById(doc.userId);
        console.log(user.userEmail);
        console.log(
          `Your Application Id: ${doc._id} . is Updated to Round ${doc.currentNumber} and status ${doc.status}`
        );
        sendEmail(
          user.userEmail,
          "Job Crack Application Status Updated ✅",
          `Your Application Id: ${doc._id} . is Updated to Round ${doc.currentNumber} and status ${doc.status}`
        );
        res.status(200).json({
          message: "Application Updated Successfully",
          data: doc,
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.deleteApplication = async (req, res, next) => {
  const application = await Applications.findById(req.params.id);
  if (!application) {
    return next(createError(404, "Application not found"));
  }

  application
    .remove()
    .then(() => {
      res.status(200).json({
        statusCode: 200,
        message: "application Removed",
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.deleteAppliedApplication = async (req, res, next) => {
  const application = await AppliedUsers.findById(req.params.id);
  if (!application) {
    return next(createError(404, "Application not found"));
  }
  const user = await Users.findById(req.user._id);
  sendEmail(
    user.userEmail,
    "Job Crack Application Withdrawl ✅",
    `Hii ${user.userName} Your Application Id: ${application._id} . Withdrawl completed successfully`
  );
  application
    .remove()
    .then(() => {
      res.status(200).json({
        statusCode: 200,
        message: "User application Removed",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllApplications = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit * 1 || 20;
  const search = req.query.search || "";
  var query = {};

  if (search) {
    query["$or"] = [
      {
        jobPosition: { $regex: search.toLowerCase(), $options: "i" },
      },
      {
        preferredQualification: { $regex: search.toLowerCase(), $options: "i" },
      },
    ];
  }
  async.parallel(
    [
      function (callback) {
        Applications.countDocuments((err, count) => {
          let total = count;
          callback(err, total);
        });
      },
      function (callback) {
        Applications.countDocuments(query, (err, count) => {
          let total = count;
          callback(err, total);
        });
      },
      function (callback) {
        Applications.find(query)
          .skip(limit * (page - 1))
          .limit(limit)
          .exec((err, all) => {
            if (err) return next(err);
            callback(err, all);
          });
      },
    ],
    function (err, result) {
      if (err) return next(err);
      let total = result[0];
      querytotal = result[1];
      let allApplications = result[2];
      res.status(200).json({
        statusCode: 200,
        message: "success",
        parameters: {
          page: page,
          limit: limit,
          search: search,
        },
        total: total,
        pages: Math.ceil(querytotal / limit),
        data: allApplications,
      });
    }
  );
};

exports.getApplicationById = async (req, res, next) => {
  Applications.findById(req.params.id)
    .then((doc) => {
      res.status(200).json({
        statusCode: 200,
        message: "Application Found",
        data: doc,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAppliedUsers = async (req, res, next) => {
  AppliedUsers.find({ applicationId: req.params.id })
    .then((doc) => {
      res.status(200).json({
        statusCode: 200,
        message: "Applications Found",
        data: doc,
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getUsersAppliedApplications = async (req, res, next) => {
  console.log(req.user._id);
  let id = req.user._id;
  AppliedUsers.find({ userId: id })
    //.populate("users", ["userEmail", "phoneNumber"])

    .then(async (doc) => {
      if (doc) {
        console.log(doc);
        return res.json({
          statusCode: 200,
          message: "Successfull",
          data: doc,
        });
      } else {
        return res.json({
          statusCode: 500,
          message: "No applications foun",
          data: doc,
        });
      }
    });
};
