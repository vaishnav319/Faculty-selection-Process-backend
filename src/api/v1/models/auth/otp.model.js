const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  number: {
    type: Number,
  },
  otp: {
    type: Number,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  expire_at: {
    type: Date,
    default: Date.now(),
    expires: 60,
  },
});

module.exports = mongoose.model("OTP", otpSchema);
