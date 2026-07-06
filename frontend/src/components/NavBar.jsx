import { useState } from "react";

const links = [
  { id: "apropos",      label: "À propos" },
  { id: "historique",   label: "Historique" },
  { id: "commandement", label: "Commandement" },
  { id: "inscription",  label: "Inscription" },
  { id: "actualites",   label: "Actualités" },
];

export default function NavBar({ page, navigate, scrolled, onAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0B1F3A] shadow-xl" : "bg-[#0B1F3A]/90 backdrop-blur"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-6">
        {/* Logo / Brand */}
        <button
          onClick={() => navigate("accueil")}
          className="flex items-center gap-3 flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center font-cinzel font-bold text-[#0B1F3A] text-sm select-none">
            EG
          </div>
          <span
            className="font-cinzel text-white font-bold text-lg leading-tight hidden sm:block"
            style={{ letterSpacing: ".04em" }}
          >
            EGNA<span className="text-[#C9A84C]"> Ambositra</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex gap-1 flex-1 justify-center">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => navigate(l.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                page === l.id
                  ? "text-[#C9A84C] border-b-2 border-[#C9A84C]"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Admin button */}
        <button
          onClick={onAdmin}
          className="ml-auto hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-semibold hover:bg-[#C9A84C]/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Admin
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0B1F3A] border-t border-white/10 px-5 pb-4 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { navigate(l.id); setMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded text-sm font-medium ${
                page === l.id ? "text-[#C9A84C]" : "text-blue-100"
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { onAdmin(); setMenuOpen(false); }}
            className="mt-2 text-left px-3 py-2 text-[#C9A84C] text-sm font-semibold"
          >
            ⚙ Administration
          </button>
        </div>
      )}
    </nav>
  );
}
