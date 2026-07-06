import { useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { resolveImageUrl } from "../services/api";

export default function Actualites() {
  const { data, loading, error } = useSiteData();
  const [selected, setSelected] = useState(null);

  if (loading) return <div className="pt-32 text-center text-gray-400">Chargement…</div>;
  if (error) return <div className="pt-32 text-center text-red-500">Erreur : {error}</div>;

  const { actualites } = data;

  if (selected) {
    return (
      <div className="pt-16">
        <div style={{ background: "#0B1F3A" }} className="py-10 px-6">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-[#C9A84C] text-sm font-semibold hover:text-[#E8C96A] mb-4">
              ← Retour aux actualités
            </button>
            <p className="text-blue-300 text-xs uppercase tracking-widest">{selected.date}</p>
            <h1 className="font-cinzel text-white font-bold text-2xl md:text-3xl mt-2">{selected.title}</h1>
          </div>
        </div>
        <section className="section max-w-4xl mx-auto">
          {selected.img ? (
            <img
              src={resolveImageUrl(selected.img)}
              alt={selected.title}
              className="w-full rounded-2xl object-cover mb-8 shadow-lg"
              style={{ height: 320 }}
            />
          ) : (
            <div className="w-full rounded-2xl flex items-center justify-center mb-8 shadow-lg"
              style={{ height: 240, background: "linear-gradient(135deg,#0B1F3A,#1a3a5c)" }}>
              <p className="text-white/30 font-cinzel text-lg">EGNA · {selected.date}</p>
            </div>
          )}
          <p className="text-gray-600 leading-relaxed text-base">{selected.body}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div style={{ background: "#0B1F3A" }} className="py-14 px-6 text-center">
        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2">Vie de l'école</p>
        <h1 className="font-cinzel text-white font-bold text-3xl md:text-4xl">Actualités</h1>
        <div className="gold-line mx-auto mt-4" />
      </div>
      <section className="section max-w-6xl mx-auto">
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          Découvrez les dernières informations, événements et réalisations de l'EGNA.
        </p>
        <div className="grid md:grid-cols-2 gap-7">
          {actualites.map((a) => (
            <button key={a.id} onClick={() => setSelected(a)}
              className="card text-left group w-full overflow-hidden">
              {a.img ? (
                <img
                  src={resolveImageUrl(a.img)}
                  alt={a.title}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ height: 180 }}
                />
              ) : (
                <div className="w-full flex items-center justify-center"
                  style={{ height: 180, background: "linear-gradient(135deg, #0B1F3A, #1a3a5c)" }}>
                  <p className="font-cinzel text-[#C9A84C] font-bold text-base opacity-60 group-hover:opacity-100 transition-opacity">
                    {a.date}
                  </p>
                </div>
              )}
              <div className="p-6">
                <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-2">{a.date}</p>
                <h3 className="font-cinzel font-bold text-[#0B1F3A] text-lg mb-3 leading-snug">{a.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.excerpt}</p>
                <p className="mt-4 text-[#C9A84C] text-xs font-semibold flex items-center gap-1">
                  Lire l'article <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
