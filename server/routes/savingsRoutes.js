const express = require("express");

const router = express.Router();

let savingsGoals = [];

// GET all goals
router.get("/", (req, res) => {
  console.log("GET goals:", savingsGoals);
  res.json(savingsGoals);
});

// GET single goal by ID
router.get("/:id", (req, res) => {
  const goal = savingsGoals.find((g) => g.id === req.params.id);

  if (!goal) {
    return res.status(404).json({ message: "Savings goal not found" });
  }

  res.json(goal);
});

// POST new goal
router.post("/", (req, res) => {
  console.log("POST body:", req.body);

  const { name, targetAmount } = req.body;

  if (!name || targetAmount === undefined) {
    return res
      .status(400)
      .json({ message: "name and targetAmount are required" });
  }

  const newGoal = {
    id: Date.now().toString(),
    name: name,
    targetAmount: Number(targetAmount),
    savedAmount: 0,
    createdAt: new Date().toISOString(),
  };

  savingsGoals.unshift(newGoal);

  console.log("Goals after POST:", savingsGoals);

  res.status(201).json({
    ...newGoal,
    message: "Savings goal created successfully",
    data: newGoal,
  });
});

// PATCH add money to goal
router.patch("/:id/add-money", (req, res) => {
  const { amount } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res
      .status(400)
      .json({ message: "A valid positive amount is required" });
  }

  const goalIndex = savingsGoals.findIndex((g) => g.id === req.params.id);

  if (goalIndex === -1) {
    return res.status(404).json({ message: "Savings goal not found" });
  }

  savingsGoals[goalIndex].savedAmount += Number(amount);

  res.json(savingsGoals[goalIndex]);
});

// DELETE goal
router.delete("/:id", (req, res) => {
  const initialLength = savingsGoals.length;
  savingsGoals = savingsGoals.filter((g) => g.id !== req.params.id);

  if (savingsGoals.length === initialLength) {
    return res.status(404).json({ message: "Savings goal not found" });
  }

  res.json({ message: "Savings goal deleted successfully" });
});

module.exports = router;
