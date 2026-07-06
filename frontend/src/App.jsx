import { useState, useEffect } from "react";
import Accueil from "./pages/Accueil";
import Apropos from "./pages/Apropos";
import Historique from "./pages/Historique";
import Commandement from "./pages/Commandement";
import Inscription from "./pages/Inscription";
import Actualites from "./pages/Actualites";
import BackOffice from "./components/BackOffice";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { SiteDataProvider } from "./context/SiteDataContext";
const PAGES = ["accueil","apropos","historique","commandement","inscription","actualites"];

export default function App() {
  const [page, setPage] = useState("accueil");
  const [backOpen, setBackOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "accueil":      return <Accueil navigate={navigate} />;
      case "apropos":      return <Apropos />;
      case "historique":   return <Historique />;
      case "commandement": return <Commandement />;
      case "inscription":  return <Inscription />;
      case "actualites":   return <Actualites />;
      default:             return <Accueil navigate={navigate} />;
    }
  };

  return (
    <SiteDataProvider>
      <div className="min-h-screen bg-[#F5F7FA] font-inter">
        <NavBar
          page={page}
          navigate={navigate}
          scrolled={scrolled}
          onAdmin={() => setBackOpen(true)}
        />
        <main>{renderPage()}</main>
        <Footer navigate={navigate} />
        {backOpen && <BackOffice onClose={() => setBackOpen(false)} />}
      </div>
    </SiteDataProvider>
  );
}