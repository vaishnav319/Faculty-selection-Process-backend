const mongoose = require("mongoose");

const adminPer = mongoose.Schema({
  userEmail: {
    type: String,

    unique: true,
  },
  phoneNumber: {
    type: Number,

    unique: true,
  },

  status: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("adminPer", adminPer);
