const fast2sms = require("fast-two-sms");
const { FAST_TO_SMS } = require("../core/config");

require("dotenv").config();
console.log(process.env.FAST_TO_SMS);
module.exports = {
  fasttosms(number, otp) {
    var options = {
      authorization: process.env.FAST_TO_SMS,
      message: `Your OTP for Verification is  ${otp}`,
      numbers: [number],
    };
    console.log(options);
    console.log(otp);
    fast2sms.sendMessage(options).then((response) => {
      console.log(response);
    });
  },
};
