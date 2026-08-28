import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import rakhiRoutes from "./routes/rakhiRoutes.js";

dotenv.config();

const app = express();

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: [
      "https://rakhi-surprise-frontend.vercel.app",
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    ],
    methods: [
      "GET",
      "POST",
      "OPTIONS"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

// ===============================
// BODY
// ===============================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// ===============================
// API
// ===============================

app.use(
  "/api/rakhi",
  rakhiRoutes
);

// ===============================
// HEALTH
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rakhi Surprise API is LIVE ❤️"
  });
});

// ===============================
// ERROR
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error"
  });
});

// ===============================
// LOCAL ONLY
// ===============================

const PORT =
  process.env.PORT || 5000;

if (
  process.env.NODE_ENV !== "production"
) {
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
}

export default app;