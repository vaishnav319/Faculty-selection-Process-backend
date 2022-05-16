const mongoose = require("mongoose");

const appliedUsersSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "applications",
  },
  userAnswers: [
    {
      ans1: {
        type: String,
      },
      ans2: {
        type: String,
      },
    },
  ],
  appliedDate: {
    type: Date,
  },
  description: {
    type: String,
  },
  currentNumber: {
    type: Number,
    default: 1,
    enum: [1, 2, 3],
  },
  status: {
    type: String,
    default: "onGoing",
    enum: ["selected", "notSelected", "onGoing"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("appliedUsers", appliedUsersSchema);
