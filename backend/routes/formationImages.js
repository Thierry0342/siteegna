const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/:formationId/images", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM formation_images WHERE formation_id = ? ORDER BY ordre ASC, id ASC",
      [req.params.formationId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:formationId/images", async (req, res) => {
  const { image, alt, ordre } = req.body;
  if (!image) return res.status(400).json({ error: "Le champ image est requis" });
  try {
    const [result] = await pool.query(
      "INSERT INTO formation_images (formation_id, image, alt, ordre) VALUES (?, ?, ?, ?)",
      [req.params.formationId, image, alt || "", ordre || 0]
    );
    const [rows] = await pool.query("SELECT * FROM formation_images WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:formationId/images/:id", async (req, res) => {
  const fields = ["image", "alt", "ordre"];
  const cols = fields.filter((f) => req.body[f] !== undefined);
  if (!cols.length) return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
  const setClause = cols.map((f) => `${f} = ?`).join(", ");
  const values = [...cols.map((f) => req.body[f]), req.params.id, req.params.formationId];
  try {
    const [result] = await pool.query(
      `UPDATE formation_images SET ${setClause} WHERE id = ? AND formation_id = ?`,
      values
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Introuvable" });
    const [rows] = await pool.query("SELECT * FROM formation_images WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:formationId/images/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM formation_images WHERE id = ? AND formation_id = ?",
      [req.params.id, req.params.formationId]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Introuvable" });
    res.json({ success: true, id: Number(req.params.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;