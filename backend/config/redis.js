// config/redis.js
require("dotenv").config();
const { createClient } = require("redis");

const redisClient = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("⚠️ Redis connection failed:", err.message);
  }
})();

module.exports = { redisClient };
