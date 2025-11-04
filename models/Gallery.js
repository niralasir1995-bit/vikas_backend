// models/Gallery.js
const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    cover: { type: String },
    photos: [{ type: String }], // array of image URLs or file paths
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
