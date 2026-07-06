const express = require("express");
const pool = require("../config/db");

/**
 * Crée un routeur CRUD standard pour une table simple.
 * @param {string} table - nom de la table SQL
 * @param {string[]} fields - colonnes autorisées en écriture (POST/PUT)
 * @param {string} orderBy - colonne de tri par défaut
 */
function crudFactory(table, fields, orderBy = "ordre ASC, id ASC") {
  const router = express.Router();

  // GET /  -> liste complète
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /:id -> un élément
  router.get("/:id", async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: "Introuvable" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST / -> création
  router.post("/", async (req, res) => {
    const cols = fields.filter((f) => req.body[f] !== undefined);
    if (!cols.length) return res.status(400).json({ error: "Aucune donnée fournie" });

    const placeholders = cols.map(() => "?").join(", ");
    const values = cols.map((f) => req.body[f]);

    try {
      const [result] = await pool.query(
        `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders})`,
        values
      );
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /:id -> mise à jour partielle
  router.put("/:id", async (req, res) => {
    const cols = fields.filter((f) => req.body[f] !== undefined);
    if (!cols.length) return res.status(400).json({ error: "Aucune donnée à mettre à jour" });

    const setClause = cols.map((f) => `${f} = ?`).join(", ");
    const values = [...cols.map((f) => req.body[f]), req.params.id];

    try {
      const [result] = await pool.query(`UPDATE ${table} SET ${setClause} WHERE id = ?`, values);
      if (!result.affectedRows) return res.status(404).json({ error: "Introuvable" });
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /:id
  router.delete("/:id", async (req, res) => {
    try {
      const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ error: "Introuvable" });
      res.json({ success: true, id: Number(req.params.id) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = crudFactory;
