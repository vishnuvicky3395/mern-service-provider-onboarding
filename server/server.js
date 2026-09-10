const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Load .env from the server folder
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

// Check JWT secret
console.log(
  "JWT SECRET STATUS:",
  process.env.JWT_SECRET ? "LOADED" : "MISSING"
);

const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "Service Provider Portal API is running",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});