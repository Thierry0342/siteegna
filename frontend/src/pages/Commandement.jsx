import { useSiteData } from "../context/SiteDataContext";
import { resolveImageUrl } from "../services/api";

const OFFICER_PHOTOS = ["/photos/COMECOLE.jpg", "/photos/OA.JPG", "/photos/DI.JPG"];

export default function Commandement() {
  const { data, loading, error } = useSiteData();

  if (loading) return <div className="pt-32 text-center text-gray-400">Chargement…</div>;
  if (error) return <div className="pt-32 text-center text-red-500">Erreur : {error}</div>;

  const { commandement } = data;

  return (
    <div className="pt-16">

      <div className="relative py-24 px-6 text-center overflow-hidden">
        <img
          src={resolveImageUrl(data.banners?.commandement_header?.image) || "/photos/portailvrai.jpg"}
          alt={data.banners?.commandement_header?.alt || "Commandement EGNA"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(11,31,58,0.78), rgba(11,31,58,0.93))" }}
        />
        <div className="relative z-10">
          <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3 font-medium">Direction</p>
          <h1 className="font-cinzel text-white font-bold text-3xl md:text-4xl mb-2">
            Commandement de l'École
          </h1>
          <p className="text-blue-200 text-sm mt-3 max-w-xl mx-auto">
            Les officiers supérieurs qui assurent la direction et le rayonnement de l'EGNA
          </p>
          <div className="gold-line mx-auto mt-5" />
        </div>
      </div>

      <div className="section max-w-5xl mx-auto space-y-6">
        {commandement.map((officer, i) => (
          <div
            key={officer.id ?? i}
            className="rounded-2xl overflow-hidden shadow-md border border-gray-100"
            style={{ background: "#fff" }}
          >
            <div className="grid md:grid-cols-3">

              <div className="relative md:col-span-1 overflow-hidden" style={{ minHeight: 320 }}>
                <img
                  src={resolveImageUrl(officer.img) || OFFICER_PHOTOS[i] || "/photos/cercle.jpg"}
                  alt={officer.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(11,31,58,0.92) 0%, rgba(11,31,58,0.3) 60%, transparent 100%)",
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: "rgba(201,168,76,0.18)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)" }}
                  >
                    #{i + 1} STAFF
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-cinzel font-bold text-white text-base leading-tight">{officer.name}</p>
                  <p className="text-[#C9A84C] text-xs font-medium mt-1">{officer.role}</p>
                  {officer.since && (
                    <p className="text-blue-300 text-xs mt-1 opacity-80">En poste depuis {officer.since}</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 p-8 flex flex-col justify-between">

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-cinzel font-bold text-[#C9A84C] text-sm flex-shrink-0"
                      style={{ background: "rgba(11,31,58,0.07)", border: "1px solid rgba(201,168,76,0.3)" }}
                    >
                      {officer.name.split(" ").filter((w) => w.length > 2).pop()?.slice(0, 2).toUpperCase() || "OF"}
                    </div>
                    <div>
                      <p className="font-cinzel font-bold text-[#0B1F3A] text-base">{officer.name}</p>
                      <p className="text-[#C9A84C] text-xs font-medium">{officer.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/60 to-transparent" />
                    <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold">Biographie</p>
                    <div className="h-px w-8 bg-[#C9A84C]/30" />
                  </div>

                  <p className="text-gray-600 leading-relaxed text-sm">{officer.bio}</p>
                </div>

                <div className="flex items-center gap-4 mt-8 pt-5 border-t border-gray-100">
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, s) => (
                      <div
                        key={s}
                        className="w-6 h-6 rounded-full border-2 border-[#C9A84C]/30 flex items-center justify-center"
                        style={{ background: "rgba(201,168,76,0.07)" }}
                      >
                        <svg className="w-3 h-3 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">
                    École de Gendarmerie Nationale d'Antananarivo
                  </p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-16 overflow-hidden" style={{ height: 220 }}>
        <img
          src={resolveImageUrl(data.banners?.commandement_footer?.image) || "/photos/sousdrapeau3.jpg"}
          alt={data.banners?.commandement_footer?.alt || "Cérémonie EGNA"}
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(11,31,58,0.72)" }}
        >
          <div className="text-center">
          <p className="font-cinzel text-white font-bold text-xl mb-2">
  {data.commandementFooterText || "Au service de Madagascar depuis 1976"}
</p>
            <div className="gold-line mx-auto" />
          </div>
        </div>
      </div>

    </div>
  );
}
