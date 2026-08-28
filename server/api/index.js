import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import rakhiRoutes from "../routes/rakhiRoutes.js";

dotenv.config();

const app = express();

// =====================================
// DATABASE
// =====================================

let dbConnected = false;

async function initDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
}

// =====================================
// CORS
// =====================================

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://rakhi-surprise-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      // (Postman, server-side requests etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: false,
  })
);

// =====================================
// BODY PARSERS
// =====================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================
// HEALTH CHECK
// =====================================

app.get("/", async (req, res) => {
  try {
    await initDB();

    res.status(200).json({
      success: true,
      message: "Rakhi Surprise Backend is running ❤️",
    });
  } catch (error) {
    console.error("Health Check Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================
// API ROUTES
// =====================================

app.use("/api/rakhi", async (req, res, next) => {
  try {
    await initDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
}, rakhiRoutes);

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
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =====================================
// EXPORT FOR VERCEL
// =====================================

export default app;