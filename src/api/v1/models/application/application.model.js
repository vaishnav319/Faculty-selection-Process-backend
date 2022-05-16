const mongoose = require("mongoose");

const applicationSchema = mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  jobPosition: {
    type: String,
    require: true,
  },
  requirements: {
    type: [String],
    required: true,
  },
  numberOfVacancies: {
    type: Number,
    require: true,
  },

  minRange: {
    type: Number,
  },
  maxRange: {
    type: Number,
  },
  preferredQualification: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  questions: [
    {
      que1: {
        type: String,
      },
      que2: {
        type: String,
      },
    },
  ],
  preferredSkills: {
    type: String,
  },
  postedOn: {
    type: Date,
    required: true,
  },
  endsOn: {
    type: Date,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("application", applicationSchema);
