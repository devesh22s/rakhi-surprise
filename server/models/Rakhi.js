import mongoose from "mongoose";

const rakhiSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    sisterName: {
      type: String,
      required: true,
      trim: true,
    },

    brotherName: {
      type: String,
      default: "",
      trim: true,
    },

    brotherPhone: {
      type: String,
      required: true,
      trim: true,
    },

    sisterPhoto: {
      type: String,
      default: "",
    },

    rakhiPhoto: {
      type: String,
      default: "",
    },

    qrPhoto: {
      type: String,
      default: "",
    },

    upiId: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const Rakhi = mongoose.model("Rakhi", rakhiSchema);

export default Rakhi;