import { useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { resolveImageUrl, formationImagesApi } from "../services/api";

const iconMap = {
  shield: (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
    </svg>
  ),
  flag: (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
    </svg>
  ),
  book: (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>
  ),
};

export default function Apropos() {
  const { data, loading, error } = useSiteData();
   const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null); // { src, alt } | null
    const [selectedFormation, setSelectedFormation] = useState(null);
  const [formationImages, setFormationImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  if (loading) return <div className="pt-32 text-center text-gray-400">Chargement…</div>;
  if (error) return <div className="pt-32 text-center text-red-500">Erreur : {error}</div>;

  const openLightbox = (src, alt) => setLightbox({ src, alt });
  const closeLightbox = () => setLightbox(null);
const openFormation = async (f, i) => {
  setSelectedFormation(f);
  setSelectedIndex(i ?? 0);
  setFormationImages([]);
  setLoadingImages(true);
  try {
    const imgs = await formationImagesApi.list(f.id);
    setFormationImages(imgs);
  } catch (e) {
    setFormationImages([]);
  } finally {
    setLoadingImages(false);
  }
};
  const closeFormation = () => setSelectedFormation(null);

  return (
    <div className="pt-16">

      {/* Page header avec photo de fond */}
      <div className="relative py-24 px-6 text-center overflow-hidden">
        <img
          src={resolveImageUrl(data.banners?.apropos_header?.image) || "/photos/portailizy.jpg"}
          alt={data.banners?.apropos_header?.alt || "EGNA - École de Gendarmerie"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(11,31,58,0.75), rgba(11,31,58,0.90))" }} />
        <div className="relative z-10">
          <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2">L'École</p>
          <h1 className="font-cinzel text-white font-bold text-3xl md:text-4xl">À propos de l'EGNA</h1>
          <div className="gold-line mx-auto mt-4" />
        </div>
      </div>

      {/* Mission */}
      <section className="section max-w-3xl mx-auto text-center">
        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Raison d'être</p>
        <h2 className="font-cinzel font-bold text-2xl text-[#0B1F3A] mb-6">Notre Mission</h2>
        <p className="text-gray-600 leading-relaxed text-base">{data.apropos.mission}</p>
      </section>
      {/* Vidéo de présentation */}
     {data.apropos.videoUrl && (
          <section className="section max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2">Découvrir l'école</p>
              <h2 className="font-cinzel font-bold text-2xl text-[#0B1F3A]">Vidéo de Présentation</h2>
              <div className="gold-line mx-auto mt-4" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                src={data.apropos.videoUrl}
                title="Vidéo de présentation EGNA"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

      {/* Formations */}
     <section className="section-sm" style={{ background: "#EEF3FA" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinzel font-bold text-2xl text-[#0B1F3A] mb-3">Nos Formations</h2>
            <div className="gold-line mx-auto" />
            <p className="text-gray-400 text-xs mt-3">Cliquez sur une formation pour en savoir plus</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
           {data.formations.map((f, i) => {
            const src = resolveImageUrl(f.image) || `/photos/formation${i + 1}.jpg`;
            return (
              <button
                key={f.id ?? i}
                type="button"
                onClick={() => openFormation(f, i)}   // <-- ajoute i
                className="card overflow-hidden p-0 text-left w-full cursor-pointer"
              >
                  <div className="relative h-44 overflow-hidden group">
                    <img
                      src={src}
                      alt={f.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,31,58,0.7), transparent)" }} />
                    <div className="absolute bottom-3 left-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0B1F3A]/80 border border-[#C9A84C]/40 flex items-center justify-center">
                        {iconMap[f.icon] || iconMap.shield}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-cinzel font-bold text-[#0B1F3A] mb-3 text-base">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                    <p className="mt-4 text-[#C9A84C] text-xs font-semibold flex items-center gap-1">
                      Voir les détails <span>→</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      
      {/* Vie au campus */}
      <section className="section max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2">Infrastructures</p>
            <h2 className="font-cinzel font-bold text-2xl text-[#0B1F3A] mb-5">La Vie à l'École</h2>
            <p className="text-gray-600 leading-relaxed">{data.apropos.campus}</p>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-3" style={{ height: 280 }}>
            {(data.campusImages?.length
              ? data.campusImages.slice(0, 4)
              : [
                  { image: "/photos/cercle.jpg", alt: "Campus EGNA" },
                  { image: "/photos/placearme.jpg", alt: "Infrastructures EGNA" },
                  { image: "/photos/sakafo.jpg", alt: "Vie à l'école" },
                  { image: "/photos/portailizy.jpg", alt: "Entrée de l'EGNA" },
                ]
            ).map((c, i) => (
              <button
                key={c.id ?? i}
                type="button"
                onClick={() => openLightbox(resolveImageUrl(c.image), c.alt)}
                className="rounded-xl overflow-hidden w-full h-full cursor-zoom-in group"
              >
                <img
                  src={resolveImageUrl(c.image)}
                  alt={c.alt}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Galerie rapide */}
      <section className="section-sm" style={{ background: "#0B1F3A" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-cinzel font-bold text-2xl text-white mb-2">En Images</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(data.gallery?.length
              ? data.gallery
              : [1, 2, 3, 4].map((n) => ({ id: n, image: `/photos/galerie${n}.jpg`, alt: `Photo EGNA ${n}` }))
            ).map((g) => (
              <button
                type="button"
                key={g.id}
                onClick={() => openLightbox(resolveImageUrl(g.image), g.alt)}
                className="relative overflow-hidden rounded-xl group cursor-zoom-in"
                style={{ height: 160 }}
              >
                <img
                  src={resolveImageUrl(g.image)}
                  alt={g.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#0B1F3A]/30 group-hover:bg-[#0B1F3A]/10 transition-colors duration-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
     {/* Contact */}
<section className="section-sm" style={{ background: "#EEF3FA" }}>
  <div className="max-w-4xl mx-auto">
    <h2 className="font-cinzel font-bold text-2xl text-[#0B1F3A] text-center mb-10">Nous Contacter</h2>

    <div className="grid sm:grid-cols-3 gap-6">
      {[
        { icon: "📍", label: "Adresse", val: data.contact.address },
        { icon: "📞", label: "Téléphone", val: data.contact.phone },
        { icon: "✉️", label: "Email", val: data.contact.email },
      ].map((c) => (
        <div key={c.label} className="card p-6 text-center">
          <p className="text-3xl mb-3">{c.icon}</p>
          <p className="font-semibold text-[#0B1F3A] mb-1 text-sm uppercase tracking-wide">{c.label}</p>
          <p className="text-gray-500 text-sm">{c.val}</p>
        </div>
      ))}
    </div>

  {data.contact.facebook && (
  <div className="text-center mt-8">
    
       <a href={data.contact.facebook}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white px-6 py-3 rounded-full hover:bg-[#0B1F3A]/90 transition-colors"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12.06C22 6.53 17.52 2.04 12 2.04S2 6.53 2 12.06c0 5 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99C18.34 21.19 22 17.06 22 12.06z"/>
      </svg>
      Suivez-nous sur Facebook
    </a>
  </div>
)}
  </div>
</section>

{selectedFormation && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(11,31,58,0.85)" }}
  >
    <div
      className="bg-white rounded-2xl max-w-3xl md:max-w-4xl lg:max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <img
          key={selectedFormation.id ?? selectedIndex}
          src={
            resolveImageUrl(selectedFormation.image) ||
            `/photos/formation${selectedIndex + 1}.jpg`
          }
          alt={selectedFormation.title}
          className="w-full object-cover"
          style={{ height: 320, objectPosition: "center 30%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(11,31,58,0.75), transparent 55%)" }}
        />
        <button
          onClick={closeFormation}
          className="absolute top-4 right-4 text-white/90 hover:text-white bg-black/20 rounded-full p-1.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="absolute bottom-4 left-6">
          <h3 className="font-cinzel font-bold text-white text-2xl">{selectedFormation.title}</h3>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-8">
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {selectedFormation.details || selectedFormation.desc}
        </p>

        <div>
          <p className="font-semibold text-sm text-[#0B1F3A] mb-3">Photos</p>
          {loadingImages ? (
            <p className="text-sm text-gray-400">Chargement des photos…</p>
          ) : formationImages.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {formationImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => openLightbox(resolveImageUrl(img.image), img.alt)}
                  className="rounded-lg overflow-hidden cursor-zoom-in group"
                  style={{ height: 130 }}
                >
                  <img
                    src={resolveImageUrl(img.image)}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Aucune photo supplémentaire pour cette formation.</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(11,31,58,0.92)" }}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/80 hover:text-white z-10"
            aria-label="Fermer"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt || ""}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          {lightbox.alt && (
            <p
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm px-6"
            >
              {lightbox.alt}
            </p>
          )}
        </div>
      )}
    </div>
    
  );
  
}
