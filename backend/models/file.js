// models/file.model.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    supabasePath: { type: String, required: true },
    encryptedKey: { type: String }, // AES key (if you encrypt files)
    expiresAt: { type: Date, required: true },
    maxDownloads: { type: Number, default: 1 },
    downloadCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "expired"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
