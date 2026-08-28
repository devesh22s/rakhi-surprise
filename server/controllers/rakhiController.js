import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import Rakhi from "../models/Rakhi.js";

// -----------------------------------------
// CLOUDINARY CONFIG
// -----------------------------------------

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -----------------------------------------
// GENERATE RANDOM SLUG
// -----------------------------------------

function generateSlug() {
  return crypto.randomBytes(7).toString("base64url");
}

// -----------------------------------------
// UPLOAD BUFFER TO CLOUDINARY
// -----------------------------------------

function uploadToCloudinary(fileBuffer, folder = "rakhi-surprise") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(fileBuffer);
  });
}

// -----------------------------------------
// CREATE RAKHI
// -----------------------------------------

export const createRakhi = async (req, res) => {
  try {
    console.log("Creating Rakhi surprise...");

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    // -----------------------------------------
    // SAFETY CHECK
    // -----------------------------------------

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Form data receive nahi hua.",
      });
    }

    // -----------------------------------------
    // GET TEXT FIELDS
    // -----------------------------------------

    const {
      sisterName,
      brotherName,
      brotherPhone,
      upiId,
      message,
    } = req.body;

    // -----------------------------------------
    // REQUIRED FIELD
    // -----------------------------------------

    if (!sisterName || !sisterName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Sister name required hai.",
      });
    }

    if (!brotherPhone || !brotherPhone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brother WhatsApp number required hai.",
      });
    }

    // -----------------------------------------
    // CLEAN PHONE NUMBER
    // -----------------------------------------

    let cleanPhone = brotherPhone.replace(/\D/g, "");

    // India number ke liye
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    // -----------------------------------------
    // UPLOAD OPTIONAL IMAGES
    // -----------------------------------------

    let sisterPhotoUrl = "";
    let rakhiPhotoUrl = "";
    let qrPhotoUrl = "";

    // Sister photo optional
    if (req.files?.sisterPhoto?.[0]) {
      sisterPhotoUrl = await uploadToCloudinary(
        req.files.sisterPhoto[0].buffer,
        "rakhi-surprise/sisters"
      );
    }

    // Rakhi photo optional
    if (req.files?.rakhiPhoto?.[0]) {
      rakhiPhotoUrl = await uploadToCloudinary(
        req.files.rakhiPhoto[0].buffer,
        "rakhi-surprise/rakhi"
      );
    }

    // QR photo optional
    if (req.files?.qrPhoto?.[0]) {
      qrPhotoUrl = await uploadToCloudinary(
        req.files.qrPhoto[0].buffer,
        "rakhi-surprise/qr"
      );
    }

    // -----------------------------------------
    // GENERATE SLUG
    // -----------------------------------------

    const slug = generateSlug();

    // -----------------------------------------
    // SAVE TO MONGODB
    // -----------------------------------------

    const rakhi = await Rakhi.create({
      slug,

      sisterName: sisterName.trim(),

      brotherName: brotherName?.trim() || "",

      brotherPhone: cleanPhone,

      sisterPhoto: sisterPhotoUrl,

      rakhiPhoto: rakhiPhotoUrl,

      qrPhoto: qrPhotoUrl,

      upiId: upiId?.trim() || "",

      message: message?.trim() || "",

    });

    console.log("Rakhi created:", rakhi.slug);

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    const publicUrl =
  process.env.PUBLIC_URL ||
  "http://localhost:5000";

   const surpriseUrl =
  `${publicUrl}/rakhi/${rakhi.slug}`;

    return res.status(201).json({
      success: true,

      message: "Rakhi surprise created successfully ❤️",

      slug,

      surpriseUrl,

      whatsappPhone: cleanPhone,
    });

  } catch (error) {
    console.error("Create Rakhi Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Rakhi surprise create nahi ho paya.",
    });
  }
};

// -----------------------------------------
// GET RAKHI
// -----------------------------------------

export const getRakhi = async (req, res) => {
  try {
    const { slug } = req.params;

    console.log("Fetching Rakhi:", slug);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug missing hai.",
      });
    }

    const rakhi = await Rakhi.findOne({
      slug,
    }).lean();

    if (!rakhi) {
      return res.status(404).json({
        success: false,
        message: "Rakhi surprise nahi mila.",
      });
    }

    return res.status(200).json({
      success: true,
      data: rakhi,
    });

  } catch (error) {
    console.error("Get Rakhi Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

