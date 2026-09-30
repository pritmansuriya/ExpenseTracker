const express = require("express");
const SavingsGoal = require("../models/savingsGoal");

const router = express.Router();

// GET all savings goals
router.get("/", async (req, res) => {
  try {
    const goals = await SavingsGoal.find().sort({ createdAt: -1 });

    const formattedGoals = goals.map((goal) => ({
      id: goal._id.toString(),
      name: goal.name,
      targetAmount: goal.targetAmount,
      savedAmount: goal.savedAmount,
      createdAt: goal.createdAt,
    }));

    console.log("GET goals:", formattedGoals);

    res.json(formattedGoals);
  } catch (error) {
    console.error("GET goals error:", error);

    res.status(500).json({
      message: "Failed to get savings goals",
    });
  }
});

// GET single savings goal
router.get("/:id", async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    res.json({
      id: goal._id.toString(),
      name: goal.name,
      targetAmount: goal.targetAmount,
      savedAmount: goal.savedAmount,
      createdAt: goal.createdAt,
    });
  } catch (error) {
    console.error("GET single goal error:", error);

    res.status(500).json({
      message: "Failed to get savings goal",
    });
  }
});

// POST new savings goal
router.post("/", async (req, res) => {
  try {
    console.log("POST body:", req.body);

    const { name, targetAmount } = req.body;

    if (!name || targetAmount === undefined) {
      return res.status(400).json({
        message: "name and targetAmount are required",
      });
    }

    const newGoal = await SavingsGoal.create({
      name: name,
      targetAmount: Number(targetAmount),
      savedAmount: 0,
    });

    const formattedGoal = {
      id: newGoal._id.toString(),
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      savedAmount: newGoal.savedAmount,
      createdAt: newGoal.createdAt,
    };

    console.log("Goal saved:", formattedGoal);

    res.status(201).json({
      message: "Savings goal created successfully",
      data: formattedGoal,
    });
  } catch (error) {
    console.error("POST goal error:", error);

    res.status(500).json({
      message: "Failed to create savings goal",
    });
  }
});

// PATCH - add money to savings goal
router.patch("/:id/add-money", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "A valid positive amount is required",
      });
    }

    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    goal.savedAmount += Number(amount);

    await goal.save();

    res.json({
      id: goal._id.toString(),
      name: goal.name,
      targetAmount: goal.targetAmount,
      savedAmount: goal.savedAmount,
      createdAt: goal.createdAt,
    });
  } catch (error) {
    console.error("Add money error:", error);

    res.status(500).json({
      message: "Failed to add money",
    });
  }
});

// DELETE savings goal
router.delete("/:id", async (req, res) => {
  try {
    const goal = await SavingsGoal.findByIdAndDelete(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    res.json({
      message: "Savings goal deleted successfully",
    });
  } catch (error) {
    console.error("DELETE goal error:", error);

    res.status(500).json({
      message: "Failed to delete savings goal",
    });
  }
});

module.exports = router;
