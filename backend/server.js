const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const pool = require("./config/db");
const crudFactory = require("./routes/crudFactory");
const settingsRouter = require("./routes/settings");
const uploadRouter = require("./routes/upload");
const bannersRouter = require("./routes/banners");
const formationImagesRouter = require("./routes/formationImages");

const app = express();
app.use(cors());
app.use(express.json());

// --- Fichiers uploadés (photos) servis statiquement ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Upload d'images (renvoie une URL /uploads/xxx.jpg à stocker ailleurs) ---
app.use("/api/upload", uploadRouter);

// --- Routes CRUD par section ---
app.use("/api/settings", settingsRouter);
app.use("/api/banners", bannersRouter);

app.use(
  "/api/formations",
  crudFactory("formations", ["icon", "title", "description", "details", "image", "ordre"])
);
app.use("/api/formations", formationImagesRouter);

app.use(
  "/api/historique-dates",
  crudFactory("historique_dates", ["annee", "evenement", "ordre"])
);

app.use(
  "/api/commandement",
  crudFactory("commandement", ["role", "name", "since_label", "bio", "img", "ordre"])
);

app.use(
  "/api/anciens-commandants",
  crudFactory("anciens_commandants", ["name", "period", "ordre"])
);

app.use(
  "/api/actualites",
  crudFactory("actualites", ["date_pub", "title", "excerpt", "body", "img"], "created_at DESC")
);

app.use(
  "/api/hero-slides",
  crudFactory("hero_slides", ["image", "alt", "ordre"])
);

app.use(
  "/api/gallery",
  crudFactory("gallery_images", ["image", "alt", "ordre"])
);

app.use(
  "/api/campus-images",
  crudFactory("campus_images", ["image", "alt", "ordre"])
);

// --- Route agrégée : tout le site en un seul appel (utilisée par le front public) ---
app.get("/api/site", async (req, res) => {
  try {
    const [settings] = await pool.query("SELECT * FROM site_settings WHERE id = 1");
    const [formations] = await pool.query("SELECT * FROM formations ORDER BY ordre ASC, id ASC");
    const [historiqueDates] = await pool.query("SELECT * FROM historique_dates ORDER BY ordre ASC, id ASC");
    const [commandement] = await pool.query("SELECT * FROM commandement ORDER BY ordre ASC, id ASC");
    const [anciensCmdts] = await pool.query("SELECT * FROM anciens_commandants ORDER BY ordre ASC, id ASC");
    const [actualites] = await pool.query("SELECT * FROM actualites ORDER BY created_at DESC");
    const [heroSlides] = await pool.query("SELECT * FROM hero_slides ORDER BY ordre ASC, id ASC");
    const [gallery] = await pool.query("SELECT * FROM gallery_images ORDER BY ordre ASC, id ASC");
    const [campusImages] = await pool.query("SELECT * FROM campus_images ORDER BY ordre ASC, id ASC");
    const [banners] = await pool.query("SELECT slot_key, image, alt FROM page_banners");

    const s = settings[0] || {};
    const bannerMap = {};
    banners.forEach((b) => (bannerMap[b.slot_key] = { image: b.image, alt: b.alt }));

    res.json({
      hero: {
        title: s.hero_title,
        subtitle: s.hero_subtitle,
        motto: s.hero_motto,
        ctaLabel: s.hero_cta_label,
      },
      heroSlides: heroSlides.map((h) => ({ id: h.id, image: h.image, alt: h.alt })),
      apropos: {
        mission: s.apropos_mission,
        campus: s.apropos_campus,
        videoUrl: s.apropos_video_url,
      },
      formations: formations.map((f) => ({
        id: f.id,
        icon: f.icon,
        title: f.title,
        desc: f.description,
         details: f.details,
        image: f.image,
      })),
      historique: {
        intro: s.historique_intro,
        body: s.historique_body,
        dates: historiqueDates.map((d) => ({ id: d.id, year: d.annee, event: d.evenement })),
      },
      commandement: commandement.map((c) => ({
        id: c.id,
        role: c.role,
        name: c.name,
        since: c.since_label,
        bio: c.bio,
        img: c.img,
      })),
      anciensCmdts: anciensCmdts.map((c) => ({ id: c.id, name: c.name, period: c.period })),
      actualites: actualites.map((a) => ({
        id: a.id,
        date: a.date_pub,
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        img: a.img,
      })),
      gallery: gallery.map((g) => ({ id: g.id, image: g.image, alt: g.alt })),
      campusImages: campusImages.map((c) => ({ id: c.id, image: c.image, alt: c.alt })),
      banners: bannerMap,
      contact: {
        address: s.contact_address,
        phone: s.contact_phone,
        email: s.contact_email,
         facebook: s.contact_facebook,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Health check ---
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// --- Gestion d'erreurs génériques ---
app.use((req, res) => res.status(404).json({ error: "Route non trouvée" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API EGNA démarrée sur http://localhost:${PORT}`));
