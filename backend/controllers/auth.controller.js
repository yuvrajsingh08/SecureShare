// controllers/auth.controller.js
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "✅ User created successfully" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "✅ Login successful", token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
