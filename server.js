const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load env variables

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB URI (use env variable in production)
const URI =
  process.env.MONGODB_URI ||
  "mongodb://saurabh07mahi:100Rabh07@ac-a2obg35-shard-00-00.54gw1ki.mongodb.net:27017,ac-a2obg35-shard-00-01.54gw1ki.mongodb.net:27017,ac-a2obg35-shard-00-02.54gw1ki.mongodb.net:27017/?replicaSet=atlas-l9fg23-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to MongoDB
mongoose
  .connect(URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import routes
const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");

// Mount routes
app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Finance Controller Server is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
