# 🔐 SecureShare (VanishShare) – Encrypted File Sharing Backend

A **secure, expiring file-sharing API** built with **Node.js**, **Express**, **MongoDB**, **Supabase Storage**, **Redis**, and **JWT** authentication.  
This project encrypts files before uploading, stores them privately, and generates **temporary download links** that automatically **expire** after a defined time.

---

## 🚀 Features

✅ **JWT Authentication** – Signup, login, and protect routes  
✅ **AES-256 Encryption** – Files are encrypted before upload  
✅ **Supabase Storage Integration** – Private file storage  
✅ **Redis-based Expiry** – Temporary links auto-expire  
✅ **MongoDB Metadata** – Track file info, expiry, and downloads  
✅ **Multer Uploads** – Easy file handling  
✅ **Row Level Security Safe** – Uses `service_role` key for backend-only access  
✅ **Cron Job Ready** – Auto-cleanup for expired files (optional)

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend Framework** | Node.js + Express |
| **Database** | MongoDB (Mongoose) |
| **Storage** | Supabase Storage (Private Bucket) |
| **Cache / TTL** | Redis Cloud |
| **Auth** | JWT (JSON Web Token) |
| **Encryption** | AES-256 (Node Crypto) |
| **File Uploads** | Multer |
| **Env Management** | dotenv |

---

## 🧱 Folder Structure

```
secureshare-backend/
│
├── config/
│   ├── db.js               # MongoDB connection
│   ├── redis.js            # Redis client setup
│   └── supabase.js         # Supabase connection
│
├── controllers/
│   ├── auth.controller.js  # Signup/Login
│   ├── file.controller.js  # File upload logic
│   └── link.controller.js  # Link generation & download
│
├── middleware/
│   ├── auth.middleware.js  # JWT verification
│   └── rateLimit.js        # (optional)
│
├── models/
│   ├── user.model.js       # User schema
│   └── file.model.js       # File schema
│
├── routes/
│   ├── auth.routes.js
│   ├── file.routes.js
│   ├── link.routes.js
│   └── index.js            # Master router
│
├── utils/
│   ├── crypto.js           # AES encryption/decryption
│   ├── jwt.js              # JWT helpers (optional)
│   └── cron.js             # Cleanup expired files (optional)
│
├── server.js               # Main app entry
├── .env                    # Environment variables
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/secureshare-backend.git
cd secureshare-backend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the project root:

```env
PORT=4000

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/secureshare

# Supabase (use service_role key for backend)
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=your_service_role_key

# Redis (Redis Cloud)
REDIS_HOST=redis-xxxxxx.upstash.io
REDIS_PORT=14911
REDIS_USER=default
REDIS_PASS=your_redis_password

# Auth
JWT_SECRET=your_jwt_secret

# File Encryption
ENCRYPTION_SECRET=your_encryption_secret

# Base URL
BASE_URL=http://localhost:4000
```

---

## ☁️ Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a **bucket** named `secure-files`
3. Set it to **Private**
4. Get your **Project URL** and **service_role key** from  
   `Project → Settings → API`

---

## 🧰 Redis Setup

1. Create a free account at [Redis Cloud](https://redis.com/try-free/)
2. Get your:
   - **Host**
   - **Port**
   - **User (default)**
   - **Password**
3. Add them to `.env` as shown above.  
4. You don’t need to install Redis locally.

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Login & receive JWT token |

**Signup Example:**
```json
{
  "name": "Yuvraj Singh",
  "email": "usingh9999@gmail.com",
  "password": "123456"
}
```

**Login Example:**
```json
{
  "email": "usingh9999@gmail.com",
  "password": "123456"
}
```

✅ Response:
```json
{
  "message": "✅ Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 📁 File Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/files/upload` | Upload + encrypt + store in Supabase (JWT required) |

**Headers:**
```
Authorization: Bearer <your_token>
```

**Body (form-data):**
```
file: [Choose File]
```

✅ Response:
```json
{
  "message": "✅ File uploaded securely",
  "file": {
    "id": "6710baf9e...",
    "name": "report.pdf",
    "path": "uploads/1728654123-report.pdf",
    "expiresAt": "2025-10-13T13:45:23.219Z"
  }
}
```

---

## 🔗 Link Routes (Redis + JWT)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/links/generate` | Create temporary expiring download link |
| `GET` | `/api/links/download/:token` | Download + decrypt file |

**Generate Example:**
```json
{
  "fileId": "6710baf9e...",
  "expiresIn": 3600
}
```

✅ Response:
```json
{
  "message": "✅ Link generated successfully",
  "downloadUrl": "http://localhost:4000/api/links/download/eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🧹 Optional: Cron Cleanup

A background cron job (`utils/cron.js`) can automatically:
- Delete expired files from Supabase
- Remove expired metadata from MongoDB

Example schedule:
```js
// utils/cron.js
const cron = require("node-cron");
const File = require("../models/file.model");
const { supabase } = require("../config/supabase");

cron.schedule("0 0 * * *", async () => {
  console.log("🧹 Running cleanup job...");
  const expiredFiles = await File.find({ expiresAt: { $lt: new Date() } });

  for (const file of expiredFiles) {
    await supabase.storage.from("secure-files").remove([file.supabasePath]);
    await file.deleteOne();
  }
  console.log(`🗑️ Deleted ${expiredFiles.length} expired files`);
});
```

---

## 🧠 Key Concepts

| Feature | Description |
|----------|-------------|
| **AES Encryption** | Protects file data with symmetric key encryption |
| **Redis TTL** | Stores and expires download tokens automatically |
| **Supabase Storage** | Private file storage with Row Level Security |
| **JWT Auth** | Validates and protects API endpoints |
| **MongoDB Metadata** | Keeps track of file expiry and ownership |

---

## 🧪 Run the Server

```bash
npm start
# or
node server.js
```

Server will run at:  
👉 `http://localhost:4000`

---

## 📦 API Flow Summary

```
Signup/Login → Upload (Encrypt + Store) → Generate Link → Redis TTL → Auto-Expire
```

---

## 👨‍💻 Author

**Yuvraj Singh**  
📧 usingh9999@gmail.com  
🚀 Passionate Full Stack Developer  
🧩 Building Secure, Scalable, Real-World Systems  

---

## 🧾 License

This project is licensed under the **MIT License** – you’re free to use, modify, and distribute it.

---

### ⭐ If you like this project, give it a star on GitHub!
