import express from "express";
import multer from "multer";
import {
  createRakhi,
  getRakhi,
} from "../controllers/rakhiController.js";

const router = express.Router();

// Memory storage — files RAM me temporarily rahengi
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// IMPORTANT:
// FormData ke text fields req.body me
// aur uploaded files req.files me milenge.

router.post(
  "/create",
  upload.fields([
    {
      name: "sisterPhoto",
      maxCount: 1,
    },
    {
      name: "rakhiPhoto",
      maxCount: 1,
    },
    {
      name: "qrPhoto",
      maxCount: 1,
    },
  ]),
  createRakhi
);

router.get("/:slug", getRakhi);

export default router;