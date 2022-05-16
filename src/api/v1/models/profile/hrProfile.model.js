const mongoose = require("mongoose");

const hrProfileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  location: {
    type: String,
    require: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  gender: {
    type: String,
    require: true,
  },

  maxQualification: {
    type: String,
    require: true,
  },
  websiteLink: {
    type: String,
  },

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

module.exports = mongoose.model("hr-profile", hrProfileSchema);
