const express = require("express");
const cors = require("cors");

const app = express();

const savingsRoutes = require("./routes/savingsRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API is working!",
  });
});

app.use("/api/savings-goal", savingsRoutes);
app.use("/api/savings-goals", savingsRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
