const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
  },
  userEmail: {
    type: String,

    unique: true,
  },
  phoneNumber: {
    type: Number,

    unique: true,
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
  },

  resume: {
    type: String,
  },
  qualification: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "HR", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
  },
  notifications: [
    {
      sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

      message: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("users", userSchema);
