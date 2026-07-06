// Central data store — back-office reads/writes here via localStorage
export const defaultData = {
  hero: {
    title: "École de la Gendarmerie Nationale",
    subtitle: "Ambositra",
    motto: "Fahaizana · Fahendrena",
    ctaLabel: "Découvrir l'école",
  },
  apropos: {
    mission: "L'École de la Gendarmerie Nationale d'Ambositra forme les futurs gendarmes de Madagascar dans les domaines militaire, juridique et éthique. Notre institution prépare des hommes et des femmes au service de la nation, de la sécurité publique et de l'état de droit.",
    campus: "Situé à Ankorombe Ambositra, notre camp offre des infrastructures modernes : salles de cours, terrains de sport, stand de tir et hébergements. Les élèves bénéficient d'un cadre propice à l'apprentissage et à la cohésion de troupe.",
  },
  formations: [
    {
      icon: "shield",
      title: "FETTA",
      desc: "Formation Élémentaire et Tactique et Technique de toutes Armes — instruction militaire et professionnelle de base assurée par l'école.",
    },
    {
      icon: "flag",
      title: "Présentation au drapeau",
      desc: "Cérémonie marquant l'intégration officielle des élèves-gendarmes dans le corps des gendarmes de Madagascar.",
    },
    {
      icon: "book",
      title: "Formation spécifique",
      desc: "Formation spécifique à la Gendarmerie d'environ 9 mois couvrant toutes les techniques essentielles du métier de gendarme.",
    },
  ],
  historique: {
    intro: "L'École de la Gendarmerie Nationale d'Ambositra (EGNA) est le principal centre de formation des élèves-gendarmes de Madagascar, situé à Ankorombe dans la région Amoron'i Mania.",
    body: "Fondée le 15 avril 1976 sous le nom de Sekoly Zandarimariam-pirenena Ambositra (SZPA), l'école a été commandée à ses débuts par le Capitaine Hemercellin Andriamahefa. À l'occasion de son 20e anniversaire en 1996, la SZPA devient officiellement l'EGNA. En 2020, l'école reçoit officiellement le nom du Général Hemercellin Andriamahefa. En 2021, l'école avait déjà formé environ 20 000 élèves-gendarmes, dont près de 600 femmes.",
    dates: [
      { year: "1976", event: "Création de la SZPA — premier commandant : Capitaine Hemercellin Andriamahefa" },
      { year: "1996", event: "La SZPA devient officiellement l'EGNA" },
      { year: "2012", event: "Premier recrutement féminin — 69e cours de formation" },
      { year: "2020", event: "Réhabilitation avec l'appui du PNUD & rebaptisation au nom du Général Andriamahefa" },
      { year: "2025", event: "Modernisation de la place d'armes et installation d'un système de biogaz" },
    ],
  },
  commandement: [
    {
      role: "Commandant de l'École",
      name: "Colonel Jean Michel RASOLOFONIARY",
      since: "2025 – Présent",
      bio: "Officier supérieur diplômé de l'Académie Militaire d'Antsirabe, plus de 25 années de service. Ancien Directeur des Instruction de l'EGNA et Officier Adjoint du Commandant de la CIRGN Toliara. Sa vision repose sur l'excellence académique, l'intégrité morale et le rapprochement avec la population civile.",
      img: null,
    },
    {
      role: "Officier Adjoint au Commandant",
      name: "Lieutenant Colonel Léon RANDRIMANANTENA",
      since: "2026",
      bio: "Officier de la Gendarmerie Nationale depuis 2005, spécialisé en gestion des opérations. Supervise les opérations pédagogiques et la coordination entre les différents départements de l'école . En tant qu'Adjoint, il supervise les opérations pédagogiques et assure la coordination entre les différents départements de l'école. Il est responsable du bien-être des élèves-gendarmes et du maintien des standards disciplinaires.",
      img: null,
    },
    {
      role: "Directeur de l'Instruction",
      name: "Lieutenant Colonel Rajo ANDRIANTSIRANOMENA",
      since: "2026",
      bio: "Militaire émérite avec plus de 30 années de service, titulaire de plusieurs diplômes en pédagogie militaire. Conçoit et supervise l'ensemble des programmes de formation.  En charge de la direction pédagogique, il conçoit et supervise l'ensemble des programmes de formation. Il s'efforce de garantir que chaque élève reçoit une éducation complète et de qualité, conforme aux standards internationaux.",
      img: null,
    },
  ],
  anciensCmdts: [
    { name: "Colonel Rémy RABETOKOTANY", period: "1976 – 1982" },
    { name: "Général Jean RAKOTOMANGA", period: "1982 – 1991" },
    { name: "Colonel François ANDRIAMPOINIMERINA", period: "1991 – 2001" },
    { name: "Colonel Léopold RAKOTOARIMANANA", period: "2001 – 2008" },
    { name: "Général Hervé RATSIRAKA", period: "2008 – 2015" },
    { name: "Colonel Christophe RASOLOFONJATOVA", period: "2015 – 2021" },
    { name: "Lieutenant Colonel Marcel RAZAFINDRAIBE", period: "2021 – 2025" },
  ],
  actualites: [
    {
      id: 1,
      date: "19 Décembre 2025",
      title: "Sortie de la promotion 2024",
      excerpt: "La 79e promotion « FIARO » a officiellement achevé sa formation avec une cérémonie présidée par le Ministre chargé de la Gendarmerie Nationale.",
      body: "La 79e promotion « FIARO » a officiellement achevé sa formation avec une cérémonie présidée par Monsieur le Ministre Chargé de la Gendarmerie Nationale. En parallèle, la passation de commandement entre le Général Fetra (sortant) et le Colonel Jean Michel RASOLOFONIARY (entrant) s'est tenue le même jour, marquant un tournant important dans la direction de l'école.",
      img: null,
    },
    {
      id: 2,
      date: "28 Février 2026",
      title: "Journée reboisement de l'EGNA",
      excerpt: "Ankofa a été l'endroit choisi pour la journée de reboisement annuel sous la conduite du Colonel RASOLOFONIARY.",
      body: "Ankofa a été l'endroit choisi par l'école pour la journée de reboisement annuel. Le Colonel Jean Michel RASOLOFONIARY a mentionné qu'il ne suffit pas seulement de planter les jeunes arbres mais aussi de les surveiller de près — une responsabilité environnementale que l'EGNA prend très au sérieux.",
      img: null,
    },
    {
      id: 3,
      date: "07 Avril 2026",
      title: "Tournoi Coupe Commandant de l'école",
      excerpt: "Ouverture officielle du tournoi couvrant football, basket-ball, volley-ball et pétanque sur cinq jours.",
      body: "L'ouverture officielle du Tournoi Coupe Commandant s'est déroulée le 7 avril 2026. Les disciplines retenues sont le football, le basket-ball, le volley-ball et la pétanque. Le tournoi s'est étalé sur cinq jours, la finale ayant eu lieu le 11 avril, dans une ambiance de cohésion et de fair-play entre les promotions.",
      img: null,
    },
    {
      id: 4,
      date: "10 Mai 2026",
      title: "Entrée officielle de la 80e promotion",
      excerpt: "1 500 élèves-gendarmes issus de toutes les régions de Madagascar ont rejoint l'EGNA au stade Manarapenitra.",
      body: "La cérémonie d'entrée officielle de la 80e promotion s'est déroulée au stade Manarapenitra d'Ankorobe, en présence du Général Jean Hubert ZIPA (Secrétaire Général de la Gendarmerie Nationale) et du Général Nonos Mbina MAMELISOA (Commandant de la Gendarmerie Nationale). Cette promotion regroupe 1 500 élèves-gendarmes recrutés de toutes les régions de Madagascar.",
      img: null,
    },
  ],
  contact: {
    address: "Ankorombe Ambositra 306, Amoron'i Mania, Madagascar",
    phone: "+261 20 000 00",
    email: "egn.ambositra@gendarmerie.mg",
  },
};

export function loadData() {
  try {
    const saved = localStorage.getItem("egna_data");
    return saved ? JSON.parse(saved) : defaultData;
  } catch {
    return defaultData;
  }
}

export function saveData(data) {
  localStorage.setItem("egna_data", JSON.stringify(data));
}
