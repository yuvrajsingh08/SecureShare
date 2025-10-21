// routes/index.js

const express = require("express");

// Import all route modules
const authRoutes = require("./auth.route");
const fileRoutes = require("./file.route");
const linkRoutes = require("./link.routes");

const router = express.Router();

// Group all API routes
router.use("/auth", authRoutes);   // e.g., /api/auth/signup, /api/auth/login
router.use("/files", fileRoutes);  // e.g., /api/files/upload
router.use("/links", linkRoutes);  // e.g., /api/links/generate

// Default API health check route
router.get("/", (req, res) => {
  res.json({
    message: "✅ SecureShare API routes are working!",
    // endpoints: {
    //   auth: "/api/auth",
    // //   files: "/api/files",
    // //   links: "/api/links",
    // },
  });
});

module.exports = router;
