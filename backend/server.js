// server.js
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");

const routes = require("./routes");
const { connectDB } = require("./config/db");
const { redisClient } = require("./config/redis");


console.log("🔗 Connecting to Server...", process.env.PORT);

const app = express();

// 🧰 Middleware
app.use(cors());
// app.use(helmet());        =
app.use(express.json());
// app.use(morgan("dev"));

// 🗄️ Connect to MongoDB
connectDB();

// ⚡ Connect to Redis
// redisClient.connect().catch(console.error);

// 🛣️ Routes
app.use("/api", routes);

// 🧾 Default route
app.get("/", (req, res) => {
  res.send("✅ SecureShare API is running...");
});

// ⚠️ Error handler (optional)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
