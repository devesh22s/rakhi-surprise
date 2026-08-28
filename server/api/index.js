import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import rakhiRoutes from "../routes/rakhiRoutes.js";

dotenv.config();

const app = express();

// =====================================
// CORS
// =====================================

app.use(
  cors({
    origin: [
      "https://rakhi-surprise-frontend.vercel.app",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =====================================
// BODY
// =====================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================
// DATABASE
// =====================================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB Error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =====================================
// TEST
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rakhi Surprise Backend is LIVE ❤️",
  });
});

// =====================================
// RAKHI API
// =====================================

app.use("/api/rakhi", rakhiRoutes);

// =====================================
// 404
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================
// ERROR
// =====================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;