// Base URL de l'API — adapte via une variable d'environnement Vite/CRA si besoin
const API_URL = import.meta?.env?.VITE_API_URL || "http://192.168.1.47:4000/api";

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erreur ${res.status}`);
  }
  return res.json();
}

// --- Vue publique agrégée ---
export function fetchSite() {
  return fetch(`${API_URL}/site`).then(handleResponse);
}

// --- Paramètres généraux ---
export function fetchSettings() {
  return fetch(`${API_URL}/settings`).then(handleResponse);
}
export function updateSettings(data) {
  return fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

// --- Fabrique générique pour les ressources CRUD ---
function crudApi(resource) {
  return {
    list: () => fetch(`${API_URL}/${resource}`).then(handleResponse),
    get: (id) => fetch(`${API_URL}/${resource}/${id}`).then(handleResponse),
    create: (data) =>
      fetch(`${API_URL}/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id, data) =>
      fetch(`${API_URL}/${resource}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    remove: (id) =>
      fetch(`${API_URL}/${resource}/${id}`, { method: "DELETE" }).then(handleResponse),
  };
}

export const formationsApi = crudApi("formations");
export const historiqueDatesApi = crudApi("historique-dates");
export const commandementApi = crudApi("commandement");
export const anciensCmdtsApi = crudApi("anciens-commandants");
export const actualitesApi = crudApi("actualites");
export const heroSlidesApi = crudApi("hero-slides");
export const galleryApi = crudApi("gallery");
export const campusImagesApi = crudApi("campus-images");

// --- Bannières de page (une image par emplacement, ex: "apropos_header") ---
export const bannersApi = {
  list: () => fetch(`${API_URL}/banners`).then(handleResponse),
  set: (slotKey, { image, alt }) =>
    fetch(`${API_URL}/banners/${slotKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, alt }),
    }).then(handleResponse),
};

// --- Upload d'un fichier image (utilisé par le back-office) ---
// Retourne { url: "/uploads/xxxx.jpg" } — cette URL est ensuite stockée
// dans le champ concerné (formations.image, commandement.img, hero_slides.image, etc.)
export function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return fetch(`${API_URL}/upload`, { method: "POST", body: formData }).then(handleResponse);
}

// Convertit une URL relative /uploads/... ou /photos/... en URL absolue utilisable
// dans un <img src>, en tenant compte du fait que le front et l'API tournent
// souvent sur des ports différents en développement.
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
export function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith("/uploads/")) return `${API_ORIGIN}${pathOrUrl}`;
  return pathOrUrl; // ex: /photos/xxx.jpg servi statiquement par le frontend
}
// --- Galerie photo propre à chaque formation ---
export const formationImagesApi = {
  list: (formationId) => fetch(`${API_URL}/formations/${formationId}/images`).then(handleResponse),
  create: (formationId, data) =>
    fetch(`${API_URL}/formations/${formationId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),
  update: (formationId, id, data) =>
    fetch(`${API_URL}/formations/${formationId}/images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),
  remove: (formationId, id) =>
    fetch(`${API_URL}/formations/${formationId}/images/${id}`, { method: "DELETE" }).then(handleResponse),
};