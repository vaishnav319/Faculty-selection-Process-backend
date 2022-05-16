const mongoose = require("mongoose");

const userProfileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  location: {
    type: String,
  },
  skills: {
    type: [String],
    required: true,
  },
  gender: {
    type: String,
    require: true,
  },

  currentPosition: {
    type: String,
  },
  maxQualification: {
    type: String,
    require: true,
  },
  websiteLink: {
    type: String,
  },
  isWorking: {
    type: Boolean,
  },
  education: [
    {
      institutionName: {
        type: String,
        required: true,
      },
      percentage: {
        type: Number,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  experience: [
    {
      position: {
        type: String,
        required: true,
      },
      workPlace: {
        type: String,
        required: true,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      subject: {
        type: String,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("user-profile", userProfileSchema);
