const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const ALLOWED = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 Mo
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.includes(ext)) return cb(new Error("Format d'image non autorisé"));
    cb(null, true);
  },
});

// POST /api/upload  (champ multipart "image")
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
});

// Gestion des erreurs multer (taille/format)
router.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

module.exports = router;
