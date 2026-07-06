const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/banners -> { apropos_header: {image, alt}, commandement_header: {...}, ... }
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT slot_key, image, alt FROM page_banners");
    const map = {};
    rows.forEach((r) => (map[r.slot_key] = { image: r.image, alt: r.alt }));
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/banners/:slot_key -> crée ou met à jour la bannière de cet emplacement
router.put("/:slot_key", async (req, res) => {
  const { image, alt } = req.body;
  if (!image) return res.status(400).json({ error: "Le champ image est requis" });

  try {
    await pool.query(
      `INSERT INTO page_banners (slot_key, image, alt)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE image = VALUES(image), alt = VALUES(alt)`,
      [req.params.slot_key, image, alt || ""]
    );
    const [rows] = await pool.query(
      "SELECT slot_key, image, alt FROM page_banners WHERE slot_key = ?",
      [req.params.slot_key]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
