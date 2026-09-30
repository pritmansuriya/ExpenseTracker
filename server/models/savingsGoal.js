const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requried: true,
    },

    targetAmount: {
      type: Number,
      requried: true,
    },

    savedAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);
