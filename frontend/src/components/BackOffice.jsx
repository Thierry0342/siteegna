import { useState, useEffect } from "react";
import {
  fetchSettings, updateSettings,
  formationsApi, historiqueDatesApi, commandementApi, actualitesApi,
  bannersApi, heroSlidesApi, galleryApi, campusImagesApi, formationImagesApi,
  uploadImage, resolveImageUrl,
} from "../services/api";
const ADMIN_PASS = "egna2026";

const emptyActualite = () => ({
  date_pub: new Date().toLocaleDateString("fr-FR"),
  title: "Nouveau titre",
  excerpt: "",
  body: "",
  img: null,
});
function FormationEditor({ formation: f, index: i, inputCls, textaCls, labelCls, uploadingFormation, replaceFormationImage, updateArrayField, setFormations }) {
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(null);

  useEffect(() => {
    if (loaded) return;
    formationImagesApi.list(f.id).then(setImages).catch(() => {}).finally(() => setLoaded(true));
  }, [f.id, loaded]);

  const addImg = async (file) => {
    if (!file) return;
    setUploadingImg("new");
    try {
      const { url } = await uploadImage(file);
      const created = await formationImagesApi.create(f.id, { image: url, alt: f.title, ordre: images.length });
      setImages((prev) => [...prev, created]);
    } catch (e) { console.error(e); }
    finally { setUploadingImg(null); }
  };

  const removeImg = async (id) => {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await formationImagesApi.remove(f.id, id);
      setImages((prev) => prev.filter((x) => x.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="border border-gray-100 rounded-xl p-3 space-y-3">
      <p className="text-xs font-bold text-[#C9A84C] uppercase">Carte {i + 1}</p>
      <img
        src={resolveImageUrl(f.image) || `/photos/formation${i + 1}.jpg`}
        alt={f.title}
        className="w-full h-32 object-cover rounded-lg border border-gray-200"
      />
      <label className="text-xs bg-gray-100 text-[#0B1F3A] px-3 py-1.5 rounded-lg hover:bg-gray-200 cursor-pointer inline-block">
        {uploadingFormation === f.id ? "Envoi…" : "Changer la photo principale"}
        <input type="file" accept="image/*" className="hidden" disabled={uploadingFormation === f.id}
          onChange={(e) => { replaceFormationImage(f.id, i, e.target.files[0]); e.target.value = ""; }} />
      </label>
      <div>
        <label className={labelCls}>Titre</label>
        <input className={inputCls} value={f.title} onChange={(e) => updateArrayField(setFormations, i, "title", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Résumé (carte)</label>
        <textarea className={textaCls} value={f.description} onChange={(e) => updateArrayField(setFormations, i, "description", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Détails complets (page détail)</label>
        <textarea className={textaCls + " min-h-[120px]"} value={f.details || ""} onChange={(e) => updateArrayField(setFormations, i, "details", e.target.value)} />
      </div>

      <div className="pt-2 border-t border-gray-100 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-semibold text-[#0B1F3A]">Galerie ({images.length})</p>
          <label className="text-xs bg-[#0B1F3A] text-white px-2 py-1 rounded-lg hover:bg-[#122848] cursor-pointer">
            {uploadingImg === "new" ? "Envoi…" : "+ Ajouter"}
            <input type="file" accept="image/*" className="hidden" disabled={uploadingImg === "new"}
              onChange={(e) => { addImg(e.target.files[0]); e.target.value = ""; }} />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img src={resolveImageUrl(img.image)} alt={img.alt} className="w-full h-16 object-cover rounded-lg border border-gray-200" />
              <button
                onClick={() => removeImg(img.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BackOffice({ onClose }) {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("actualites");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState(null);
  const [formations, setFormations] = useState([]);
  const [commandement, setCommandement] = useState([]);
  const [historiqueDates, setHistoriqueDates] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [banners, setBanners] = useState({});
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [uploadingSlide, setUploadingSlide] = useState(null);
  const [campusImages, setCampusImages] = useState([]);
const [gallery, setGallery] = useState([]);
const [uploadingCampus, setUploadingCampus] = useState(null);
const [uploadingGallery, setUploadingGallery] = useState(null);
const [uploadingFormation, setUploadingFormation] = useState(null);
  const BANNER_SLOTS = [
  { key: "apropos_header", label: "À propos" },
  { key: "historique_header", label: "Historique" },
  { key: "commandement_header", label: "Commandement (en-tête)" },
  { key: "commandement_footer", label: "Commandement (pied de page)" },
  { key: "actualites_header", label: "Actualités" },
  { key: "inscription_header", label: "Inscription" },
];
const handleBannerUpload = async (slotKey, file) => {
  if (!file) return;
  setUploadingSlot(slotKey);
  setErr("");
  try {
    const { url } = await uploadImage(file);
    const currentAlt = banners[slotKey]?.alt || "";
    const updated = await bannersApi.set(slotKey, { image: url, alt: currentAlt });
    setBanners((prev) => ({ ...prev, [slotKey]: { image: updated.image, alt: updated.alt } }));
  } catch (e) {
    setErr(e.message);
  } finally {
    setUploadingSlot(null);
  }
};

const handleBannerAltChange = (slotKey, alt) => {
  setBanners((prev) => ({ ...prev, [slotKey]: { ...prev[slotKey], alt } }));
};

const saveBannerAlt = async (slotKey) => {
  try {
    const b = banners[slotKey];
    await bannersApi.set(slotKey, { image: b.image, alt: b.alt });
    flashSaved();
  } catch (e) {
    setErr(e.message);
  }
};

  const login = () => {
    if (pass === ADMIN_PASS) { setAuthed(true); setErr(""); }
    else setErr("Mot de passe incorrect.");
  };

  // Chargement initial de toutes les données une fois authentifié
useEffect(() => {
  if (!authed) return;
  setLoading(true);
  Promise.all([
    fetchSettings(),
    formationsApi.list(),
    commandementApi.list(),
    historiqueDatesApi.list(),
    actualitesApi.list(),
    bannersApi.list(),
    heroSlidesApi.list(),
    campusImagesApi.list(),
    galleryApi.list(),
  ])
    .then(([s, f, c, hd, a, b, hs, ci, g]) => {
      setSettings(s);
      setFormations(f);
      setCommandement(c);
      setHistoriqueDates(hd);
      setActualites(a);
      setBanners(b);
      setHeroSlides(hs);
      setCampusImages(ci);
      setGallery(g);
    })
    .catch((e) => setErr(e.message))
    .finally(() => setLoading(false));
}, [authed]);
const addHeroSlide = async (file) => {
  if (!file) return;
  setUploadingSlide("new");
  setErr("");
  try {
    const { url } = await uploadImage(file);
    const created = await heroSlidesApi.create({
      image: url,
      alt: "École de la Gendarmerie Nationale",
      ordre: heroSlides.length,
    });
    setHeroSlides((prev) => [...prev, created]);
  } catch (e) {
    setErr(e.message);
  } finally {
    setUploadingSlide(null);
  }
};
const replaceFormationImage = async (id, idx, file) => {
  if (!file) return;
  setUploadingFormation(id);
  setErr("");
  try {
    const { url } = await uploadImage(file);
    updateArrayField(setFormations, idx, "image", url);
  } catch (e) {
    setErr(e.message);
  } finally {
    setUploadingFormation(null);
  }
};
const addImage = async (api, setter, list, file, altDefault) => {
  if (!file) return "new";
  try {
    const { url } = await uploadImage(file);
    const created = await api.create({ image: url, alt: altDefault, ordre: list.length });
    setter((prev) => [...prev, created]);
  } catch (e) {
    setErr(e.message);
  }
};

const replaceImage = async (api, setter, id, file) => {
  if (!file) return;
  try {
    const { url } = await uploadImage(file);
    const updated = await api.update(id, { image: url });
    setter((prev) => prev.map((x) => (x.id === id ? updated : x)));
  } catch (e) {
    setErr(e.message);
  }
};

const updateImageAlt = (setter, id, alt) => {
  setter((prev) => prev.map((x) => (x.id === id ? { ...x, alt } : x)));
};

const saveImageAlt = async (api, list, setter, id) => {
  try {
    const item = list.find((x) => x.id === id);
    const updated = await api.update(id, { alt: item.alt });
    setter((prev) => prev.map((x) => (x.id === id ? updated : x)));
    flashSaved();
  } catch (e) {
    setErr(e.message);
  }
};

const removeImage = async (api, setter, id, label) => {
  if (!confirm(`Supprimer ${label} ?`)) return;
  try {
    await api.remove(id);
    setter((prev) => prev.filter((x) => x.id !== id));
  } catch (e) {
    setErr(e.message);
  }
};

// Wrappers spécifiques pour chaque ressource
const addCampusImage = (file) => { setUploadingCampus("new"); addImage(campusImagesApi, setCampusImages, campusImages, file, "Photo du campus EGNA").finally(() => setUploadingCampus(null)); };
const replaceCampusImage = (id, file) => { setUploadingCampus(id); replaceImage(campusImagesApi, setCampusImages, id, file).finally(() => setUploadingCampus(null)); };
const removeCampusImage = (id) => removeImage(campusImagesApi, setCampusImages, id, "cette photo du campus");

const addGalleryImage = (file) => { setUploadingGallery("new"); addImage(galleryApi, setGallery, gallery, file, "Photo EGNA").finally(() => setUploadingGallery(null)); };
const replaceGalleryImage = (id, file) => { setUploadingGallery(id); replaceImage(galleryApi, setGallery, id, file).finally(() => setUploadingGallery(null)); };
const removeGalleryImage = (id) => removeImage(galleryApi, setGallery, id, "cette photo de la galerie");
const replaceHeroSlideImage = async (id, file) => {
  if (!file) return;
  setUploadingSlide(id);
  setErr("");
  try {
    const { url } = await uploadImage(file);
    const updated = await heroSlidesApi.update(id, { image: url });
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? updated : s)));
  } catch (e) {
    setErr(e.message);
  } finally {
    setUploadingSlide(null);
  }
};

const updateHeroSlideAlt = (id, alt) => {
  setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, alt } : s)));
};

const saveHeroSlideAlt = async (id) => {
  try {
    const slide = heroSlides.find((s) => s.id === id);
    const updated = await heroSlidesApi.update(id, { alt: slide.alt });
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? updated : s)));
    flashSaved();
  } catch (e) {
    setErr(e.message);
  }
};

const removeHeroSlide = async (id) => {
  if (!confirm("Supprimer cette photo de couverture ?")) return;
  try {
    await heroSlidesApi.remove(id);
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  } catch (e) {
    setErr(e.message);
  }
};

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // ---- Actualités : add/remove immédiats, edits en mémoire ----
  const updateActualite = (idx, field, value) => {
    setActualites((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addActualite = async () => {
    try {
      const created = await actualitesApi.create(emptyActualite());
      setActualites((prev) => [...prev, created]);
    } catch (e) { setErr(e.message); }
  };

  const removeActualite = async (idx) => {
    const item = actualites[idx];
    try {
      if (item.id) await actualitesApi.remove(item.id);
      setActualites((prev) => prev.filter((_, i) => i !== idx));
    } catch (e) { setErr(e.message); }
  };

  // ---- Formations / Commandement / Historique : édition en mémoire ----
  const updateArrayField = (setter, idx, field, value) => {
    setter((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  // ---- Settings (hero / apropos / historique intro-body / contact) ----
  const updateSetting = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // ---- Enregistrement selon l'onglet actif ----
  const handleSave = async () => {
    setSaving(true);
    setErr("");
    try {
      if (tab === "actualites") {
        await Promise.all(
          actualites
            .filter((a) => a.id)
            .map((a) => actualitesApi.update(a.id, a))
        );
      } else if (tab === "apropos") {
  await Promise.all([
    updateSettings({
      apropos_mission: settings.apropos_mission,
      apropos_campus: settings.apropos_campus,
      apropos_video_url: settings.apropos_video_url,
    }),
    ...formations.map((f) => formationsApi.update(f.id, f)),
  ]);
}
      else if (tab === "hero") {
        await updateSettings({
          hero_title: settings.hero_title,
          hero_subtitle: settings.hero_subtitle,
          hero_motto: settings.hero_motto,
          hero_cta_label: settings.hero_cta_label,
        });
      } else if (tab === "commandement") {
        await Promise.all(commandement.map((c) => commandementApi.update(c.id, c)));
      } else if (tab === "historique") {
        await Promise.all([
          updateSettings({
            historique_intro: settings.historique_intro,
            historique_body: settings.historique_body,
          }),
          ...historiqueDates.map((d) => historiqueDatesApi.update(d.id, d)),
        ]);
        } else if (tab === "contact") {
          await updateSettings({
            contact_address: settings.contact_address,
            contact_phone: settings.contact_phone,
            contact_email: settings.contact_email,
            contact_facebook: settings.contact_facebook,
          });
        }
      flashSaved();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

 const tabs = [
  { id: "actualites", label: "Actualités" },
  { id: "hero", label: "Hero" },
  { id: "apropos", label: "À propos" },
  { id: "commandement", label: "Commandement" },
  { id: "historique", label: "Historique" },
  { id: "banners", label: "Bannières" },
  { id: "contact", label: "Contact" },
];

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] bg-white";
  const textaCls = inputCls + " resize-y min-h-[80px]";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase mb-1";

  return (
    <div className="bo-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bo-panel">
        {/* Header */}
        <div className="bg-[#0B1F3A] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="font-cinzel font-bold text-base">Administration EGNA</p>
            {authed && <p className="text-xs text-blue-300 mt-0.5">Gestion du contenu</p>}
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {!authed ? (
          <div className="flex flex-col items-center justify-center px-8 py-16 gap-6">
            <div className="w-16 h-16 rounded-full bg-[#0B1F3A] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="font-cinzel font-bold text-xl text-[#0B1F3A]">Accès réservé</p>
              <p className="text-sm text-gray-500 mt-1">Entrez le mot de passe administrateur</p>
            </div>
            <div className="w-full max-w-xs flex flex-col gap-3">
              <input
                type="password"
                className={inputCls}
                placeholder="Mot de passe"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
              {err && <p className="text-red-500 text-xs text-center">{err}</p>}
              <button onClick={login} className="w-full py-2.5 bg-[#0B1F3A] text-white rounded-lg font-semibold text-sm hover:bg-[#122848] transition-colors">
                Connexion
              </button>
            </div>
            <p className="text-xs text-gray-400">Accès réservé au personnel autorisé</p>
          </div>
        ) : loading || !settings ? (
          <div className="px-8 py-16 text-center text-gray-500 text-sm">Chargement des données…</div>
        ) : (
          <div>
            <div className="flex gap-1 px-4 pt-4 pb-0 flex-wrap">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-t text-xs font-semibold transition-colors ${
                    tab === t.id
                      ? "bg-white border border-b-0 border-gray-200 text-[#0B1F3A]"
                      : "text-gray-500 hover:text-[#0B1F3A]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="bg-white border border-gray-200 mx-4 rounded-b rounded-tr p-5 space-y-5">
              {err && <p className="text-red-500 text-xs">{err}</p>}

              {/* ACTUALITÉS */}
              {tab === "actualites" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-[#0B1F3A]">Actualités ({actualites.length})</p>
                    <button onClick={addActualite} className="text-xs bg-[#0B1F3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#122848]">
                      + Ajouter
                    </button>
                  </div>
                  {actualites.map((a, i) => (
                    <div key={a.id ?? i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-[#C9A84C] uppercase">Article {i + 1}</span>
                        <button onClick={() => removeActualite(i)} className="text-xs text-red-400 hover:text-red-600">Supprimer</button>
                      </div>
                      <div>
                        <label className={labelCls}>Date</label>
                        <input className={inputCls} value={a.date_pub} onChange={(e) => updateActualite(i, "date_pub", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Titre</label>
                        <input className={inputCls} value={a.title} onChange={(e) => updateActualite(i, "title", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Résumé (carte)</label>
                        <textarea className={textaCls} value={a.excerpt} onChange={(e) => updateActualite(i, "excerpt", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Corps de l'article</label>
                        <textarea className={textaCls + " min-h-[120px]"} value={a.body} onChange={(e) => updateActualite(i, "body", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* HERO */}
              {tab === "hero" && (
  <div className="space-y-8">
    <div className="space-y-4">
      <p className="font-bold text-[#0B1F3A]">Textes de la section Hero</p>
      {[
        ["hero_title", "Titre principal"],
        ["hero_subtitle", "Sous-titre"],
        ["hero_motto", "Devise"],
        ["hero_cta_label", "Bouton CTA"],
      ].map(([field, label]) => (
        <div key={field}>
          <label className={labelCls}>{label}</label>
          <input className={inputCls} value={settings[field] || ""} onChange={(e) => updateSetting(field, e.target.value)} />
        </div>
      ))}
    </div>

    <div className="space-y-4 pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center">
        <p className="font-bold text-[#0B1F3A]">Photos de couverture ({heroSlides.length})</p>
        <label className="text-xs bg-[#0B1F3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#122848] cursor-pointer">
          {uploadingSlide === "new" ? "Envoi…" : "+ Ajouter une photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploadingSlide === "new"}
            onChange={(e) => { addHeroSlide(e.target.files[0]); e.target.value = ""; }}
          />
        </label>
      </div>

      {heroSlides.map((s) => (
        <div key={s.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
          <img
            src={resolveImageUrl(s.image)}
            alt={s.alt}
            className="w-full h-40 object-cover rounded-lg border border-gray-200"
          />
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className={labelCls}>Texte alternatif</label>
              <input
                className={inputCls}
                value={s.alt || ""}
                onChange={(e) => updateHeroSlideAlt(s.id, e.target.value)}
                onBlur={() => saveHeroSlideAlt(s.id)}
              />
            </div>
            <label className="text-xs bg-gray-100 text-[#0B1F3A] px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap">
              {uploadingSlide === s.id ? "Envoi…" : "Remplacer"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingSlide === s.id}
                onChange={(e) => { replaceHeroSlideImage(s.id, e.target.files[0]); e.target.value = ""; }}
              />
            </label>
            <button
              onClick={() => removeHeroSlide(s.id)}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-2"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
      {!heroSlides.length && (
        <p className="text-sm text-gray-400 text-center py-6">Aucune photo de couverture — ajoutez-en une ci-dessus.</p>
      )}
    </div>
  </div>
)}
              {tab === "banners" && (
  <div className="space-y-6">
    <p className="font-bold text-[#0B1F3A]">Bannières des pages</p>
    {BANNER_SLOTS.map(({ key, label }) => {
      const b = banners[key] || { image: null, alt: "" };
      return (
        <div key={key} className="border border-gray-100 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-[#C9A84C] uppercase">{label}</p>
          {b.image && (
            <img
              src={resolveImageUrl(b.image)}
              alt={b.alt}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
          )}
          <div>
            <label className={labelCls}>Changer l'image</label>
            <input
              type="file"
              accept="image/*"
              className={inputCls}
              disabled={uploadingSlot === key}
              onChange={(e) => handleBannerUpload(key, e.target.files[0])}
            />
            {uploadingSlot === key && (
              <p className="text-xs text-gray-400 mt-1">Envoi en cours…</p>
            )}
          </div>
          <div>
            <label className={labelCls}>Texte alternatif (accessibilité)</label>
            <input
              className={inputCls}
              value={b.alt || ""}
              onChange={(e) => handleBannerAltChange(key, e.target.value)}
              onBlur={() => saveBannerAlt(key)}
            />
          </div>
        </div>
      );
    })}
  </div>
)}

              {/* À PROPOS */}
              {tab === "apropos" && (
  <div className="space-y-8">
    <div className="space-y-4">
      <p className="font-bold text-[#0B1F3A]">À propos</p>
      <div>
        <label className={labelCls}>Mission</label>
        <textarea className={textaCls} value={settings.apropos_mission || ""} onChange={(e) => updateSetting("apropos_mission", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Vie au campus (texte)</label>
        <textarea className={textaCls} value={settings.apropos_campus || ""} onChange={(e) => updateSetting("apropos_campus", e.target.value)} />
      </div>
      <div>
    <label className={labelCls}>Vidéo de présentation (URL embed)</label>
    <input
      className={inputCls}
      placeholder="https://www.youtube.com/embed/VIDEO_ID"
      value={settings.apropos_video_url || ""}
      onChange={(e) => updateSetting("apropos_video_url", e.target.value)}
    />
    <p className="text-xs text-gray-400 mt-1">
      Utilisez un lien "embed" YouTube (ex: youtube.com/embed/xxxx) ou Vimeo (player.vimeo.com/video/xxxx). Laissez vide pour ne rien afficher.
    </p>
  </div>

    </div>

   <div className="space-y-4 pt-4 border-t border-gray-100">
  <p className="font-semibold text-sm text-[#0B1F3A]">Formations (texte + photo)</p>
  {formations.map((f, i) => (
    <FormationEditor
      key={f.id}
      formation={f}
      index={i}
      inputCls={inputCls}
      textaCls={textaCls}
      labelCls={labelCls}
      uploadingFormation={uploadingFormation}
      replaceFormationImage={replaceFormationImage}
      updateArrayField={updateArrayField}
      setFormations={setFormations}
    />
  ))}
  <p className="text-xs text-gray-400">La photo principale et le texte sont enregistrés avec le bouton « Enregistrer » ci-dessous. La galerie et son texte alternatif sont enregistrés immédiatement.</p>
</div>

    <div className="space-y-4 pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-sm text-[#0B1F3A]">Photos "Vie au campus" ({campusImages.length})</p>
        <label className="text-xs bg-[#0B1F3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#122848] cursor-pointer">
          {uploadingCampus === "new" ? "Envoi…" : "+ Ajouter"}
          <input type="file" accept="image/*" className="hidden" disabled={uploadingCampus === "new"}
            onChange={(e) => { addCampusImage(e.target.files[0]); e.target.value = ""; }} />
        </label>
      </div>
      <p className="text-xs text-gray-400">La 1ère photo occupe la grande case, les 2 suivantes les petites cases.</p>
      {campusImages.map((c) => (
        <div key={c.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
          <img src={resolveImageUrl(c.image)} alt={c.alt} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className={labelCls}>Texte alternatif</label>
              <input className={inputCls} value={c.alt || ""} onChange={(e) => updateImageAlt(setCampusImages, c.id, e.target.value)}
                onBlur={() => saveImageAlt(campusImagesApi, campusImages, setCampusImages, c.id)} />
            </div>
            <label className="text-xs bg-gray-100 text-[#0B1F3A] px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap">
              {uploadingCampus === c.id ? "Envoi…" : "Remplacer"}
              <input type="file" accept="image/*" className="hidden" disabled={uploadingCampus === c.id}
                onChange={(e) => { replaceCampusImage(c.id, e.target.files[0]); e.target.value = ""; }} />
            </label>
            <button onClick={() => removeCampusImage(c.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-2">Supprimer</button>
          </div>
        </div>
      ))}
      {!campusImages.length && <p className="text-sm text-gray-400 text-center py-4">Aucune photo — les images par défaut du site seront utilisées.</p>}
    </div>

    <div className="space-y-4 pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-sm text-[#0B1F3A]">Galerie "En Images" ({gallery.length})</p>
        <label className="text-xs bg-[#0B1F3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#122848] cursor-pointer">
          {uploadingGallery === "new" ? "Envoi…" : "+ Ajouter"}
          <input type="file" accept="image/*" className="hidden" disabled={uploadingGallery === "new"}
            onChange={(e) => { addGalleryImage(e.target.files[0]); e.target.value = ""; }} />
        </label>
      </div>
      {gallery.map((g) => (
        <div key={g.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
          <img src={resolveImageUrl(g.image)} alt={g.alt} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className={labelCls}>Texte alternatif</label>
              <input className={inputCls} value={g.alt || ""} onChange={(e) => updateImageAlt(setGallery, g.id, e.target.value)}
                onBlur={() => saveImageAlt(galleryApi, gallery, setGallery, g.id)} />
            </div>
            <label className="text-xs bg-gray-100 text-[#0B1F3A] px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap">
              {uploadingGallery === g.id ? "Envoi…" : "Remplacer"}
              <input type="file" accept="image/*" className="hidden" disabled={uploadingGallery === g.id}
                onChange={(e) => { replaceGalleryImage(g.id, e.target.files[0]); e.target.value = ""; }} />
            </label>
            <button onClick={() => removeGalleryImage(g.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-2">Supprimer</button>
          </div>
        </div>
      ))}
      {!gallery.length && <p className="text-sm text-gray-400 text-center py-4">Aucune photo — les images par défaut du site seront utilisées.</p>}
    </div>
  </div>
)}

              {/* COMMANDEMENT */}
              {tab === "commandement" && (
                <div className="space-y-5">
                  <p className="font-bold text-[#0B1F3A]">Officiers de commandement</p>
                  {commandement.map((c, i) => (
                    <div key={c.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-bold text-[#C9A84C] uppercase">{c.role}</p>
                      <div>
                        <label className={labelCls}>Nom</label>
                        <input className={inputCls} value={c.name} onChange={(e) => updateArrayField(setCommandement, i, "name", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Depuis</label>
                        <input className={inputCls} value={c.since_label || ""} onChange={(e) => updateArrayField(setCommandement, i, "since_label", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Biographie</label>
                        <textarea className={textaCls} value={c.bio} onChange={(e) => updateArrayField(setCommandement, i, "bio", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* HISTORIQUE */}
              {tab === "historique" && (
                <div className="space-y-4">
                  <p className="font-bold text-[#0B1F3A]">Historique</p>
                  <div>
                    <label className={labelCls}>Introduction</label>
                    <textarea className={textaCls} value={settings.historique_intro || ""} onChange={(e) => updateSetting("historique_intro", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Corps du texte</label>
                    <textarea className={textaCls + " min-h-[140px]"} value={settings.historique_body || ""} onChange={(e) => updateSetting("historique_body", e.target.value)} />
                  </div>
                  <p className="font-semibold text-sm text-[#0B1F3A] pt-2">Dates clés</p>
                  {historiqueDates.map((d, i) => (
                    <div key={d.id} className="flex gap-3">
                      <input className={inputCls + " w-20"} value={d.annee} onChange={(e) => updateArrayField(setHistoriqueDates, i, "annee", e.target.value)} />
                      <input className={inputCls} value={d.evenement} onChange={(e) => updateArrayField(setHistoriqueDates, i, "evenement", e.target.value)} />
                    </div>
                  ))}
                </div>
              )}

              {/* CONTACT */}
              {tab === "contact" && (
  <div className="space-y-4">
    <p className="font-bold text-[#0B1F3A]">Informations de contact</p>
    {[
      ["contact_address", "Adresse"],
      ["contact_phone", "Téléphone"],
      ["contact_email", "Email"],
      ["contact_facebook", "Lien page Facebook"],
    ].map(([field, label]) => (
      <div key={field}>
        <label className={labelCls}>{label}</label>
        <input
          className={inputCls}
          placeholder={field === "contact_facebook" ? "https://facebook.com/votrepage" : ""}
          value={settings[field] || ""}
          onChange={(e) => updateSetting(field, e.target.value)}
        />
      </div>
    ))}
  </div>
)}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  saved ? "bg-green-600 text-white" : "bg-[#0B1F3A] text-white hover:bg-[#122848]"
                } ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {saving ? "Enregistrement…" : saved ? "✓ Enregistré !" : "Enregistrer les modifications"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}