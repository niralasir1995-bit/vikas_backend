const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const Gallery = require("../models/Gallery"); // or use existing gallery model if present

// Public notifications (latest 20)
router.get("/notifications", async (req, res) => {
  try {
    const notes = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public gallery listing
router.get("/gallery", async (req, res) => {
  try {
    // Adjust depending on your gallery model; fallback mock if not present
    const list = await Gallery ? await Gallery.find() : [
      { id: "teachers-day-2024", title: "Teachers Day 2024", cover: "/uploads/gallery/td1.jpg", count: 12 }
    ];
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Event photos (replace with your actual photos storage logic)
router.get("/gallery/:id", async (req,res) => {
  try {
    // Example: find by slug or id
    const ev = await Gallery.findOne({ slug: req.params.id });
    if (!ev) return res.json({ photos: [] });
    res.json({ photos: ev.photos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
