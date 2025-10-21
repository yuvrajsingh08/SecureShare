// utils/crypto.js
const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // AES uses 16-byte IV

// Encrypt buffer
function encryptBuffer(buffer, secret) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.createHash("sha256").update(secret).digest(); // derive key
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { iv: iv.toString("hex"), data: encrypted.toString("base64") };
}

// Decrypt buffer
function decryptBuffer(encryptedBase64, ivHex, secret) {
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.createHash("sha256").update(secret).digest();
  const encryptedBuffer = Buffer.from(encryptedBase64, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted;
}

module.exports = { encryptBuffer, decryptBuffer };
