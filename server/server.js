const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Server Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
