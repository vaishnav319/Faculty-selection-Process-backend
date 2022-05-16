const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MailSchema = new Schema({
  userEmail: {
    type: String,
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

module.exports = mongoose.model("ForgotPassword", MailSchema);
