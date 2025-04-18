const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Customer = require("../models/customerModel");


const otpStore = new Map();
const SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// ✅ Request OTP using name & mobileNumber
router.post("/request-otp", async (req, res) => {
  const { name, mobileNumber } = req.body;

  if (!name || !mobileNumber) {
    return res.status(400).json({ error: "Name and mobile number are required" });
  }

  try {
    const customer = await Customer.findOne({ name, mobileNumber });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(mobileNumber, otp);

    // Auto-expire OTP after 2 minutes
    setTimeout(() => {
      otpStore.delete(mobileNumber);
    }, 2 * 60 * 1000);

    console.log(`🔐 OTP for ${mobileNumber}: ${otp}`);
    res.json({ message: "OTP sent successfully", otp }); // only for dev
  } catch (error) {
    console.error("OTP request error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Verify OTP & return JWT and customer
router.post("/verify-otp", async (req, res) => {
  const { name, mobileNumber, otp } = req.body;

  if (!name || !mobileNumber || !otp) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const storedOtp = otpStore.get(mobileNumber);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({ error: "Invalid OTP or expired" });
  }

  try {
    const customer = await Customer.findOne({ name, mobileNumber });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const token = jwt.sign(
      {
        name: customer.name,
        isHost: customer.isHost,
        id: customer._id,
      },
      SECRET,
      { expiresIn: "1h" }
    );

    otpStore.delete(mobileNumber);

    res.json({ token, customer });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Protected route: Get customer by Aadhaar number

module.exports = router;
