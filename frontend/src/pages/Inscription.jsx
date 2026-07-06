import { useSiteData } from "../context/SiteDataContext";
import { resolveImageUrl } from "../services/api";

export default function Inscription() {
  const { data, loading, error } = useSiteData();

  if (loading) return <div className="pt-32 text-center text-gray-400">Chargement…</div>;
  if (error) return <div className="pt-32 text-center text-red-500">Erreur : {error}</div>;

  return (
    <div className="pt-16">
      <div className="relative py-24 px-6 text-center overflow-hidden">
        <img
          src={resolveImageUrl(data.banners?.inscription_header?.image) || "/photos/portailizy.jpg"}
          alt={data.banners?.inscription_header?.alt || "Inscription EGNA"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(11,31,58,0.78), rgba(11,31,58,0.93))" }} />
        <div className="relative z-10">
          <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2">Rejoindre l'EGNA</p>
          <h1 className="font-cinzel text-white font-bold text-3xl md:text-4xl">Mode d'Inscription au Concours</h1>
          <div className="gold-line mx-auto mt-4" />
        </div>
      </div>

      <section className="section max-w-4xl mx-auto">
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          Le concours d'entrée est ouvert chaque année aux citoyens malgaches remplissant les conditions requises.
        </p>

        {/* Conditions */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Masculin */}
          <div className="card p-7">
            <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] flex items-center justify-center mb-4 text-lg">👨</div>
            <h3 className="font-cinzel font-bold text-[#0B1F3A] mb-4">Candidats masculins</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Être de nationalité malagasy",
                "Être âgé de 20 à 30 ans (35 ans pour anciens militaires)",
                "Mesurer au minimum 1,68 m",
                "Être physiquement apte",
                "Être titulaire du baccalauréat",
                "Aucune condamnation incompatible avec le service militaire",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Féminin */}
          <div className="card p-7">
            <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] flex items-center justify-center mb-4 text-lg">👩</div>
            <h3 className="font-cinzel font-bold text-[#0B1F3A] mb-4">Candidates féminines</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Être de nationalité malagasy",
                "Être âgée de 20 à 28 ans",
                "Mesurer au minimum 1,63 m",
                "Être physiquement apte",
                "Être titulaire du baccalauréat",
                "Ne pas être enceinte au moment des contrôles médicaux",
                "Présenter une bonne moralité",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conditions communes */}
        <div className="card p-7 mb-8">
          <h3 className="font-cinzel font-bold text-[#0B1F3A] mb-4 flex items-center gap-2">
            <span className="text-xl">🛡</span> Conditions communes
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Jouir de ses droits civiques",
              "Être reconnu apte lors de la visite médicale",
              "Réussir les épreuves sportives, écrites et les phases de sélection",
              "Ne pas être titulaire d'une pension de retraite militaire",
            ].map((item, i) => (
              <p key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-[#C9A84C] font-bold mt-0.5">✓</span>{item}
              </p>
            ))}
          </div>
        </div>

        {/* Dossier */}
        <div className="card p-7 mb-10">
          <h3 className="font-cinzel font-bold text-[#0B1F3A] mb-4 flex items-center gap-2">
            <span className="text-xl">📁</span> Dossier à fournir
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Demande manuscrite de candidature",
              "Extrait d'acte de naissance récent",
              "Copie certifiée du baccalauréat (ou attestation)",
              "Certificat de résidence récent",
              "Casier judiciaire (bulletin n°3) — moins de 3 mois",
              "Certificat médical d'aptitude physique et mentale",
              "4 photos d'identité récentes (4×4 cm)",
              "Quittance de paiement des frais d'inscription",
              "Pour candidates : test de grossesse négatif",
            ].map((item, i) => (
              <p key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-[#C9A84C] font-bold mt-0.5">•</span>{item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="section-sm" style={{ background: "#EEF3FA" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-cinzel font-bold text-2xl text-[#0B1F3A] text-center mb-10">Étapes du concours</h2>
          <div className="space-y-6">
            {[
              { n: "01", title: "Épreuves écrites", desc: "Culture générale, français, mathématiques" },
              { n: "02", title: "Épreuves sportives", desc: "1 000 m pour les hommes, 800 m pour les femmes" },
              { n: "03", title: "Entretien oral", desc: "Jury devant lequel chaque candidat se présente" },
              { n: "04", title: "Visite médicale", desc: "Aptitude physique et mentale certifiée" },
            ].map((step) => (
              <div key={step.n} className="card p-5 flex items-center gap-5">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-cinzel font-bold text-white text-lg"
                  style={{ background: "linear-gradient(135deg,#0B1F3A,#1a3a5c)" }}
                >
                  {step.n}
                </div>
                <div>
                  <p className="font-bold text-[#0B1F3A]">{step.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
