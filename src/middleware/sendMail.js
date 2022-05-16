// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// const { mailId } = require("../core/config");
// require("dotenv").config();

// // let toMail = 'gnbaviskar2@gmail.com,gnbaviskar3@gmail.com';

// exports.sendEmail = () => {
//   let fromMail = "events.amritacbe@gmail.com";
//   let toMail = "kv.sridharsai@gmail.com";
//   let subject = "An email using nodejs app";
//   let text =
//     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
//   // auth
//   console.log("called");
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "events.amritacbe@gmail.com",
//       pass: "amritaevents2022",
//     },
//   });

//   // email options
//   let mailOptions = {
//     from: fromMail,
//     to: toMail,
//     subject: subject,
//     text: text,
//     secure: true,
//   };

//   // send email
//   transporter.sendMail(mailOptions, (error, response) => {
//     if (error) {
//       console.log(error);
//     }
//     console.log(response);
//   });
// };

const nodemailer = require("nodemailer");
const { countDocuments } = require("../api/v1/models/auth/userDetails.model");

module.exports = function sendEmail(email, subject, message) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return false;
    } else {
      //response to the user that mail is successfully sent
      console.log("sent");
      return true;
    }
  });
};
