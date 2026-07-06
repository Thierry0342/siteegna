import { useState, useEffect } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { resolveImageUrl } from "../services/api";

export default function Accueil({ navigate }) {
  const [slide, setSlide] = useState(0);
  const { data, loading, error } = useSiteData();
  const slides = data?.heroSlides?.length ? data.heroSlides : [];

  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (loading) return <div className="pt-32 text-center text-gray-400">Chargement…</div>;
  if (error) return <div className="pt-32 text-center text-red-500">Erreur : {error}</div>;

  return (
    <div>
      {/* Hero */}
      <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh" }}>

        {slides.map((s, i) => (
          <div
            key={s.id ?? i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0, zIndex: 0 }}
          >
            <img src={resolveImageUrl(s.image)} alt={s.alt} className="absolute inset-0 w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(11,31,58,0.55), rgba(11,31,58,0.82))" }}
            />
          </div>
        ))}

        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(201,168,76,0.6) 20px, rgba(201,168,76,0.6) 21px)`,
          zIndex: 1,
        }} />

        <div className="absolute top-0 right-0 overflow-hidden" style={{ width: 220, height: 220, zIndex: 2 }}>
          <div style={{ position: "absolute", top: 60, right: -30, width: 240, height: 18, transform: "rotate(45deg)", display: "flex" }}>
            <span style={{ flex: 1, background: "#FC3D1B" }} />
            <span style={{ flex: 1, background: "#fff" }} />
            <span style={{ flex: 1, background: "#007749" }} />
          </div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#C9A84C] flex items-center justify-center"
              style={{ background: "rgba(201,168,76,0.15)" }}>
              <span className="font-cinzel text-[#C9A84C] font-bold text-2xl">EG</span>
            </div>
          </div>
          <h1 className="font-cinzel text-white font-bold leading-tight mb-2"
            style={{ fontSize: "clamp(28px, 5vw, 56px)" }}>
            {data.hero.title}
          </h1>
          <h2 className="font-cinzel font-bold mb-6" style={{ color: "#C9A84C", fontSize: "clamp(22px, 3.5vw, 38px)" }}>
            {data.hero.subtitle}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-12 bg-[#C9A84C]/50" />
            <p className="text-blue-100 font-medium tracking-widest text-sm uppercase">{data.hero.motto}</p>
            <div className="h-px w-12 bg-[#C9A84C]/50" />
          </div>
          <button onClick={() => navigate("apropos")}
            className="px-10 py-4 rounded-lg font-bold text-[#0B1F3A] hover:scale-105 transition-transform shadow-xl"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)" }}>
            {data.hero.ctaLabel}
          </button>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? "w-8 h-2 bg-[#C9A84C]" : "w-2 h-2 bg-white/40"}`} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#0B1F3A" }} className="py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: "1976", label: "Année de fondation" },
            { n: "80e", label: "Promotion en cours" },
            { n: "20 000+", label: "Gendarmes formés" },
            { n: "600+", label: "Femmes diplômées" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-cinzel text-[#C9A84C] font-bold text-3xl mb-1">{s.n}</p>
              <p className="text-blue-300 text-xs uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cartes */}
      <section className="section max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-cinzel font-bold text-2xl text-[#0B1F3A] mb-3">Découvrir l'EGNA</p>
          <div className="gold-line mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { id: "apropos", icon: "🎯", title: "Notre mission", desc: "Formation militaire, juridique et éthique des gendarmes de Madagascar." },
            { id: "historique", icon: "📜", title: "Historique", desc: "Depuis 1976, l'EGNA bâtit l'excellence au service de la nation." },
            { id: "inscription", icon: "📋", title: "Concours", desc: "Conditions d'admission, dossier requis et étapes du recrutement." },
            { id: "actualites", icon: "📰", title: "Actualités", desc: "Promotions, événements et initiatives de l'école." },
          ].map((c) => (
            <button key={c.id} onClick={() => navigate(c.id)} className="card p-6 text-left w-full">
              <span className="text-3xl mb-3 block">{c.icon}</span>
              <p className="font-cinzel font-bold text-[#0B1F3A] mb-2">{c.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
