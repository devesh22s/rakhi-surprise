import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import rakhiRoutes from "./routes/rakhiRoutes.js";

dotenv.config();

const app = express();

// =====================================
// CORS
// =====================================

const allowedOrigins = [
  "https://rakhi-surprise-frontend.vercel.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / server-to-server / same-origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

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

// =====================================
// BODY PARSERS
// =====================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// =====================================
// DATABASE
// =====================================

connectDB();

// =====================================
// HEALTH CHECK
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rakhi Surprise API is LIVE ❤️"
  });
});

// =====================================
// API ROUTES
// =====================================

app.use(
  "/api/rakhi",
  rakhiRoutes
);

// =====================================
// 404
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl
  });
});

// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error"
  });
});

// =====================================
// LOCAL DEVELOPMENT ONLY
// =====================================

if (process.env.NODE_ENV !== "production") {
  const PORT =
    process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
}

// =====================================
// EXPORT FOR VERCEL
// =====================================

export default app;