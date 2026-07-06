const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/settings
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM site_settings WHERE id = 1");
    if (!rows.length) return res.status(404).json({ error: "Paramètres introuvables" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings  (mise à jour partielle ou complète)
router.put("/", async (req, res) => {
  const fields = [
  "hero_title", "hero_subtitle", "hero_motto", "hero_cta_label",
  "apropos_mission", "apropos_campus", "apropos_video_url",
  "historique_intro", "historique_body",
  "contact_address", "contact_phone", "contact_email", "contact_facebook",
];
  const updates = fields.filter((f) => req.body[f] !== undefined);
  if (!updates.length) return res.status(400).json({ error: "Aucune donnée à mettre à jour" });

  const setClause = updates.map((f) => `${f} = ?`).join(", ");
  const values = updates.map((f) => req.body[f]);

  try {
    await pool.query(`UPDATE site_settings SET ${setClause} WHERE id = 1`, values);
    const [rows] = await pool.query("SELECT * FROM site_settings WHERE id = 1");
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
