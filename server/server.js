import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import rakhiRoutes from "./routes/rakhiRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientPath = path.join(__dirname, "../client");

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// API ROUTES
// ===============================

app.use("/api/rakhi", rakhiRoutes);

// ===============================
// STATIC FRONTEND
// ===============================

app.use(express.static(clientPath));

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.sendFile(
    path.join(clientPath, "index.html")
  );
});

// ===============================
// SURPRISE PAGE
// ===============================

app.get("/rakhi/:slug", (req, res) => {
  res.sendFile(
    path.join(clientPath, "surprise.html")
  );
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
      "Internal Server Error",
  });
});

// ===============================
// SERVER
// ===============================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});