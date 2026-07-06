export default function Footer({ navigate }) {
  return (
    <footer style={{ background: "#0B1F3A" }} className="text-blue-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center font-cinzel font-bold text-[#0B1F3A] text-sm">
              EG
            </div>
            <span className="font-cinzel text-white font-bold text-lg">EGNA</span>
          </div>
          <p className="text-sm leading-relaxed text-blue-300">
            École de la Gendarmerie Nationale Ambositra — former, protéger, servir.
          </p>
          {/* Madagascar ribbon */}
          <div className="flex gap-0 mt-4 h-1.5 w-16 overflow-hidden rounded">
            <span className="flex-1 bg-white" />
            <span className="flex-1 bg-[#FC3D1B]" />
            
            <span className="flex-1 bg-[#007749]" />
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Navigation</p>
          {[
            ["apropos","À propos"],
            ["historique","Historique"],
            ["commandement","Commandement"],
            ["inscription","Inscription"],
            ["actualites","Actualités"],
          ].map(([id,label]) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className="block text-sm text-blue-300 hover:text-[#C9A84C] transition-colors mb-2"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contact</p>
          <p className="text-sm mb-2">📍 Ankorombe Ambositra 306, Amoron'i Mania</p>
          <p className="text-sm mb-2">📞 +261 20 000 00</p>
          <p className="text-sm">✉️ egn.ambositra@gendarmerie.mg</p>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 text-xs text-blue-400">
        © 2026 École de la Gendarmerie Nationale — Ambositra. Tous droits réservés.
      </div>
    </footer>
  );
}
