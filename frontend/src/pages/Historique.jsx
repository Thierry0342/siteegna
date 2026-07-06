import { useEffect, useRef } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { resolveImageUrl } from "../services/api";
export default function Historique() {
  const { data, loading, error } = useSiteData();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current || loading) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = window.L;

      // Coordonnées exactes OSM node 11880867794 — EGNA, Pont d'Ankorombe, Ambositra
      const coords = [-20.54865, 47.24897];

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView(coords, 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#0B1F3A;border:2px solid #C9A84C;border-radius:50%;width:14px;height:14px;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.marker(coords, { icon })
        .addTo(map)
        .bindPopup(
          `<b style="color:#0B1F3A;font-size:13px;">EGNA</b><br>
           <span style="font-size:12px;color:#555;">Pont d'Ankorombe, Ambositra</span>`,
          { maxWidth: 200 }
        )
        .openPopup();

      mapInstanceRef.current = map;
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading]);

  if (loading) return <div className="pt-32 text-center text-gray-400">Chargement…</div>;
  if (error) return <div className="pt-32 text-center text-red-500">Erreur : {error}</div>;

  const { historique, anciensCmdts } = data;

  return (
    <div className="pt-16">
     <div className="relative py-24 px-6 text-center overflow-hidden">
  <img
    src={resolveImageUrl(data.banners?.historique_header?.image) || "/photos/portailizy.jpg"}
    alt={data.banners?.historique_header?.alt || "Historique EGNA"}
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(11,31,58,0.78), rgba(11,31,58,0.93))" }} />
  <div className="relative z-10">
    <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2">Depuis 1976</p>
    <h1 className="font-cinzel text-white font-bold text-3xl md:text-4xl">Historique de l'EGNA</h1>
    <div className="gold-line mx-auto mt-4" />
  </div>
</div>

      <section className="section max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div
            className="rounded-2xl flex items-center justify-center shadow-lg"
            style={{ height: 260, background: "linear-gradient(135deg,#0B1F3A,#1a3a5c)" }}
          >
            <div className="text-center text-white px-8">
              <p className="font-cinzel font-bold text-5xl text-[#C9A84C] mb-2">EGNA</p>
              <p className="text-sm text-blue-200">Fondée le 15 Avril 1976</p>
              <div className="flex justify-center gap-0 mt-4 h-1.5 w-16 mx-auto overflow-hidden rounded">
                <span className="flex-1 bg-[#FC3D1B]" />
                <span className="flex-1 bg-white" />
                <span className="flex-1 bg-[#007749]" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2">Origines</p>
            <h2 className="font-cinzel font-bold text-xl text-[#0B1F3A] mb-4">L'École à travers les âges</h2>
            <p className="text-gray-600 leading-relaxed text-sm mb-3">{historique.intro}</p>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">{historique.body}</p>

            <div
              ref={mapRef}
              className="rounded-xl overflow-hidden border border-gray-200"
              style={{ height: 200 }}
            />
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: "#EEF3FA" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-cinzel font-bold text-2xl text-[#0B1F3A] mb-10 text-center">Dates clés</h2>
          <div>
            {historique.dates.map((d, i) => (
              <div key={d.id ?? i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="card p-4">
                  <p className="font-cinzel font-bold text-[#C9A84C] text-lg mb-1">{d.year}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{d.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-cinzel font-bold text-2xl text-[#0B1F3A] mb-3">Anciens Commandants</h2>
          <div className="gold-line mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {anciensCmdts.map((c, i) => (
            <div key={c.id ?? i} className="card p-4 text-center">
              <div
                className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center font-cinzel font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg,#0B1F3A,#1a3a5c)" }}
              >
                {c.name.split(" ").pop().slice(0, 2).toUpperCase()}
              </div>
              <p className="font-semibold text-[#0B1F3A] text-sm mb-1">{c.name}</p>
              <p className="text-[#C9A84C] text-xs font-medium">{c.period}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
