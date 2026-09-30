const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const savingsRoutes = require("./routes/savingsRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API is working!",
  });
});

// Savings Goals API
app.use("/api/savings-goal", savingsRoutes);

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
