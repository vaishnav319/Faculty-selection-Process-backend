const { Contact } = require("../../models/index");
const async = require("async");
const sendEmail = require("../../../../middleware/sendMail");

exports.contactUs = async (req, res, next) => {
  try {
    let application = new Contact({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      message: req.body.message,
    });
    sendEmail(
      req.body.email,
      "Contact Form for Job Crack",
      `Your Contact Id: ${application._id} Thanks for contacting us we will get back to you.`
    );
    application
      .save()
      .then((application) => {
        res.status(200).json({
          statusCode: 200,
          message: "Contact Form Submitted",
          data: application,
        });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};
exports.updateForm = async (req, res, next) => {
  const id = req.params.id;
  const contact = await Contact.findByIdAndUpdate(id);
  let firstName = req.body.firstName ? req.body.firstName : contact.firstName;
  let secondName = req.body.secondName
    ? req.body.secondName
    : contact.secondName;

  let phoneNumber = req.body.phoneNumber
    ? req.body.phoneNumber
    : contact.phoneNumber;
  let email = req.body.email ? req.body.email : contact.email;
  let message = req.body.message ? req.body.message : contact.message;
  contact.firstName = firstName;
  contact.secondName = secondName;
  contact.phoneNumber = phoneNumber;
  contact.email = email;
  contact.message = message;

  console.log(contact);
  contact
    .save()
    .then((contact) => {
      res.status(200).json({
        statusCode: 200,
        message: "Contact Updated",
        data: contact,
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.deleteForm = async (req, res, next) => {
  const form = await Contact.findById(req.params.id);
  form
    .remove()
    .then(() => {
      res.status(200).json({
        statusCode: 200,
        message: "form Removed",
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getForm = async (req, res, next) => {
  Contact.findById(req.params.id)
    .then((doc) => {
      res.status(200).json({
        statusCode: 200,
        message: "Form Found",
        data: doc,
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getAllForms = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit * 1 || 20;
  const search = req.query.search || "";
  var query = {};

  if (search) {
    query["$or"] = [
      {
        email: { $regex: search.toLowerCase(), $options: "i" },
      },
    ];
  }
  async.parallel(
    [
      function (callback) {
        Contact.countDocuments((err, count) => {
          let total = count;
          callback(err, total);
        });
      },
      function (callback) {
        Contact.countDocuments(query, (err, count) => {
          let total = count;
          callback(err, total);
        });
      },
      function (callback) {
        Contact.find(query)
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
      let allForms = result[2];
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
        data: allForms,
      });
    }
  );
};
