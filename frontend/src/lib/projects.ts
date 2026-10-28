import type { Lang } from "@/i18n/dictionaries";

export type Project = {
  title: string;
  category: string;
  desc: string;
  tags: string[];
  result: string;
  iconKey: string;
  gradient: string;
  client?: string;
  role?: string;
  scope?: string;
  url?: string;
  /** Logo local dans /public (prioritaire) */
  logo?: string;
  /** Capture RÉELLE de la solution, utilisée en fond de couverture (logo par-dessus). */
  cover?: string;
  /** Vidéo de couverture (boucle muette) — prioritaire sur cover/logo. */
  video?: string;
  /** Screenshots Unsplash simulant l'app */
  screenshots?: string[];
};

const GRADIENTS = [
  "from-sky via-brand-500 to-brand-700",  // Afrikamode (bleu ciel dégradé)
  "from-slate-800 via-brand-700 to-brand-500",  // Gathe Finance
  "from-emerald-500 via-teal-500 to-sky",       // e-Learning
  "from-brand-700 via-brand-500 to-sky",        // Formation
  "from-brand-600 via-sky to-brand-400",        // Elec One — bleu ciel (charte)
];

const PROJECTS: Record<Lang, Project[]> = {
  fr: [
    {
      title: "Afrikamode",
      client: "Italie · Cameroun",
      category: "Mode & e-commerce",
      desc: "Plateforme e-commerce pour une marque de mode africaine présente en Italie et au Cameroun. Catalogue multilingue, fiches produits, panier, paiement sécurisé. Une ligne maison et des créateurs invités, une esthétique contemporaine, disponible dans 2 pays.",
      tags: ["Next.js", "React", "Tailwind", "TypeScript", "e-commerce"],
      result: "En ligne en Italie & au Cameroun",
      iconKey: "spark",
      gradient: GRADIENTS[0],
      role: "Conception & développement",
      scope: "Boutique e-commerce internationale",
      url: "https://afrikamode.store",
      logo: "/logo/logo-Afrikamode.png",
      cover: "/afrikamode-realisations/01-site-accueil.png",
      video: "/Realisations/projet-Afrikamode-realisation.mp4",      screenshots: [
        "/img/photo-1558618666-fcd25c85cd64-w1200.jpg",
        "/img/photo-1441984904996-e0b6ba687e04-w1200.jpg",
        "/img/photo-1483985988355-763728e1935b-w1200.jpg",
        "/img/photo-1445205170230-053b83016050-w1200.jpg",
      ],
    },
    {
      title: "Gathe Finance",
      client: "PME & freelances africains",
      category: "Fintech & Gestion",
      desc: "Plateforme de gestion financière pensée pour les indépendants et les PME africaines : suivi multi-comptes (espèces, mobile money, banque), catégorisation automatique des opérations, budgets et objectifs, tableaux de bord et reporting (trésorerie, P&L).",
      tags: ["Next.js", "TypeScript", "Prisma", "Postgres", "PWA"],
      result: "Trésorerie sous contrôle",
      iconKey: "layers",
      gradient: GRADIENTS[1],
      role: "Conception & développement",
      scope: "Gestion financière PME · multi-comptes & reporting",
      logo: "/logo/logo-GATHE_FINANCE.png",
      screenshots: [
        "/img/photo-1551288049-bebda4e38f71-w1200.jpg",
        "/img/photo-1460925895917-afdab827c52f-w1200.jpg",
        "/img/photo-1611974789855-9c2a0a7236a3-w1200.jpg",
        "/img/photo-1579621970563-ebec7560ff3e-w1200.jpg",
      ],
    },
    {
      title: "Plateforme e-Learning",
      client: "Apprenants & professionnels IT",
      category: "Éducation & EdTech",
      desc: "Plateforme de formation aux métiers de l'informatique : développement web, Python, cybersécurité et plus. Parcours structurés, ressources progressives et suivi des apprenants, pour rendre la tech accessible à tous, partout en Afrique.",
      tags: ["Next.js", "TypeScript", "Tailwind", "Vidéo", "PWA"],
      result: "Catalogue tech complet",
      iconKey: "eye",
      gradient: GRADIENTS[2],
      role: "Conception & développement",
      scope: "Plateforme de formation IT en ligne",
      logo: "/logo/logo-Edlearning.png",
      screenshots: [
        "/img/photo-1501504905252-473c47e087f8-w1200.jpg",
        "/img/photo-1588196749597-9ff075ee6b5b-w1200.jpg",
        "/img/photo-1516321318423-f06f85e504b3-w1200.jpg",
        "/img/photo-1522202176988-66273c2fd55f-w1200.jpg",
      ],
    },
    {
      title: "Elec One",
      client: "2MeTech Sarl · Énergie",
      category: "Énergie & IoT",
      desc: "Application mobile de pilotage d'EnMKit, le dispositif intelligent de maîtrise de l'énergie de 2MeTech. Depuis votre téléphone, coupez à distance les équipements restés allumés, fer à repasser, climatiseur, téléviseur, pour supprimer les gaspillages et réduire durablement votre facture d'électricité.",
      tags: ["Flutter", "Mobile", "IoT", "Temps réel", "Énergie"],
      result: "En production · consommation maîtrisée à distance",
      iconKey: "cog",
      gradient: GRADIENTS[4],
      role: "Conception & développement",
      scope: "Application mobile de pilotage énergétique (EnMKit)",
      url: "https://www.2metechsarl.org",
      logo: "/logo/logo-Elec_One.png",
      screenshots: [
        "/img/photo-1473341304170-971dccb5ac1e-w1200.jpg",
        "/img/photo-1518770660439-4636190af475-w1200.jpg",
        "/img/photo-1518770660439-4636190af475-w1200.jpg",
        "/img/photo-1451187580459-43490279c0fa-w1200.jpg",
      ],
    },
  ],
  en: [
    {
      title: "Afrikamode",
      client: "Italy · Cameroon",
      category: "Fashion & e-commerce",
      desc: "E-commerce platform for an African fashion brand present in Italy and Cameroon. Multilingual catalogue, product pages, cart, secure checkout. An in-house line and guest designers, a contemporary aesthetic, live in 2 countries.",
      tags: ["Next.js", "React", "Tailwind", "TypeScript", "e-commerce"],
      result: "Live in Italy & Cameroon",
      iconKey: "spark",
      gradient: GRADIENTS[0],
      role: "Design & development",
      scope: "International e-commerce store",
      url: "https://afrikamode.store",
      logo: "/logo/logo-Afrikamode.png",
      cover: "/afrikamode-realisations/01-site-accueil.png",
      video: "/Realisations/projet-Afrikamode-realisation.mp4",      screenshots: [
        "/img/photo-1558618666-fcd25c85cd64-w1200.jpg",
        "/img/photo-1441984904996-e0b6ba687e04-w1200.jpg",
        "/img/photo-1483985988355-763728e1935b-w1200.jpg",
        "/img/photo-1445205170230-053b83016050-w1200.jpg",
      ],
    },
    {
      title: "Gathe Finance",
      client: "African SMEs & freelancers",
      category: "Fintech & Management",
      desc: "Financial management platform for African freelancers and SMEs: multi-account tracking (cash, mobile money, bank), auto-categorisation, budgets and goals, dashboards and reporting (cash flow, P&L).",
      tags: ["Next.js", "TypeScript", "Prisma", "Postgres", "PWA"],
      result: "Cash flow under control",
      iconKey: "layers",
      gradient: GRADIENTS[1],
      role: "Design & development",
      scope: "SME financial management · multi-account & reporting",
      logo: "/logo/logo-GATHE_FINANCE.png",
      screenshots: [
        "/img/photo-1551288049-bebda4e38f71-w1200.jpg",
        "/img/photo-1460925895917-afdab827c52f-w1200.jpg",
        "/img/photo-1611974789855-9c2a0a7236a3-w1200.jpg",
        "/img/photo-1579621970563-ebec7560ff3e-w1200.jpg",
      ],
    },
    {
      title: "e-Learning platform",
      client: "IT learners & professionals",
      category: "Education & EdTech",
      desc: "Training platform covering IT careers: web development, Python, cybersecurity and more. Structured tracks, progressive resources and learner tracking, built to make tech accessible everywhere across Africa.",
      tags: ["Next.js", "TypeScript", "Tailwind", "Video", "PWA"],
      result: "Full tech catalogue",
      iconKey: "eye",
      gradient: GRADIENTS[2],
      role: "Design & development",
      scope: "Online IT training platform",
      logo: "/logo/logo-Edlearning.png",
      screenshots: [
        "/img/photo-1501504905252-473c47e087f8-w1200.jpg",
        "/img/photo-1588196749597-9ff075ee6b5b-w1200.jpg",
        "/img/photo-1516321318423-f06f85e504b3-w1200.jpg",
        "/img/photo-1522202176988-66273c2fd55f-w1200.jpg",
      ],
    },
    {
      title: "Elec One",
      client: "2MeTech Sarl · Energy",
      category: "Energy & IoT",
      desc: "Mobile app that drives EnMKit, 2MeTech's smart energy-control device. From your phone, remotely switch off equipment left running, iron, air-conditioner, TV, cutting waste and durably lowering your electricity bill.",
      tags: ["Flutter", "Mobile", "IoT", "Real-time", "Energy"],
      result: "Live · consumption controlled remotely",
      iconKey: "cog",
      gradient: GRADIENTS[4],
      role: "Design & development",
      scope: "Mobile energy-control app (EnMKit)",
      url: "https://www.2metechsarl.org",
      logo: "/logo/logo-Elec_One.png",
      screenshots: [
        "/img/photo-1473341304170-971dccb5ac1e-w1200.jpg",
        "/img/photo-1518770660439-4636190af475-w1200.jpg",
        "/img/photo-1518770660439-4636190af475-w1200.jpg",
        "/img/photo-1451187580459-43490279c0fa-w1200.jpg",
      ],
    },
  ],
};

/* ── Solutions Zayra : les produits de l'écosystème, conçus et exploités en
   interne. Captures réelles dans /public/zayra/solutions/<slug>/. Elles sont
   ajoutées à la rubrique Réalisations même quand la liste vient du CMS
   (voir getCmsProjects), tant que l'admin ne les a pas créées lui-même. ── */
const zayraAssets = (slug: string) => ({
  url: `https://zayra.${slug}.horus-lab.com`,
  logo: `/zayra/solutions/${slug}/logo.png`,
  cover: `/zayra/solutions/${slug}/desktop.webp`,
});

const ZAYRA_PROJECTS: Record<Lang, Project[]> = {
  fr: [
    {
      title: "Zayra Drive",
      client: "Zayra Technologies · Candidats & auto-écoles",
      category: "Éducation & EdTech",
      desc: "Plateforme de préparation au code de la route : cours illustrés, QCM d'images, examens blancs chronométrés, tuteur IA par module et révision hors ligne, en français et en anglais. Les auto-écoles suivent la préparation de chaque élève depuis leur tableau de bord.",
      tags: ["IA", "Hors ligne", "Mobile Money", "Android", "FR / EN"],
      result: "En ligne · 686 questions corrigées",
      iconKey: "eye",
      gradient: GRADIENTS[3],
      role: "Conception, développement & exploitation",
      scope: "Préparation au code de la route + espace auto-écoles",
      ...zayraAssets("drive"),
    },
    {
      title: "Zayra School",
      client: "Zayra Technologies · Établissements scolaires",
      category: "Éducation & EdTech",
      desc: "Gestion complète d'un établissement, de la maternelle à l'université : inscriptions, scolarité par tranches, notes et bulletins vérifiables par QR code, paiements Mobile Money, emploi du temps partagé sur WhatsApp et émargement par QR. Chaque établissement est isolé des autres.",
      tags: ["Mobile Money", "Bulletins QR", "WhatsApp", "Multi-établissements", "FR / EN"],
      result: "En ligne · de la maternelle à l'université",
      iconKey: "layers",
      gradient: GRADIENTS[0],
      role: "Conception, développement & exploitation",
      scope: "Gestion scolaire SaaS (inscriptions, notes, caisse)",
      ...zayraAssets("school"),
    },
    {
      title: "Zayra Agro",
      client: "Zayra Technologies · Agriculteurs & coopératives",
      category: "Agriculture & AgriTech",
      desc: "Un conseiller agricole dans la poche, de la semence au marché : conseiller IA qui cite ses sources, formations validées par des agronomes, intrants homologués près de chez soi, experts sur le terrain et prix repères pour vendre en confiance.",
      tags: ["IA sourcée", "Android", "Hors ligne", "Experts terrain", "10 régions"],
      result: "En ligne · 1 500+ fiches agronomiques",
      iconKey: "spark",
      gradient: GRADIENTS[2],
      role: "Conception, développement & exploitation",
      scope: "Conseil agricole, formation et mise en relation",
      ...zayraAssets("agro"),
    },
    {
      title: "Zayra Nkap",
      client: "Zayra Technologies · Tontines & associations",
      category: "Fintech & Gestion",
      desc: "Les cahiers de la réunion, sans papier : cotisations, tontines, noms et demi-noms, enchères, prêts, secours et pénalités tenus en temps réel, même hors ligne sur le téléphone du trésorier. Double approbation des sorties d'argent et états financiers en PDF.",
      tags: ["Tontines", "Hors ligne", "Mobile Money", "États PDF", "Double contrôle"],
      result: "En ligne · essai gratuit 30 jours",
      iconKey: "check",
      gradient: GRADIENTS[1],
      role: "Conception, développement & exploitation",
      scope: "Gestion de tontines et d'associations",
      ...zayraAssets("nkap"),
    },
  ],
  en: [
    {
      title: "Zayra Drive",
      client: "Zayra Technologies · Learners & driving schools",
      category: "Education & EdTech",
      desc: "Highway-code preparation platform: illustrated lessons, picture quizzes, timed mock exams, an AI tutor per module and offline revision, in French and English. Driving schools follow each learner's readiness from their dashboard.",
      tags: ["AI", "Offline", "Mobile Money", "Android", "FR / EN"],
      result: "Live · 686 corrected questions",
      iconKey: "eye",
      gradient: GRADIENTS[3],
      role: "Design, development & operation",
      scope: "Highway-code preparation + driving-school space",
      ...zayraAssets("drive"),
    },
    {
      title: "Zayra School",
      client: "Zayra Technologies · Schools",
      category: "Education & EdTech",
      desc: "End-to-end school management, from nursery to university: enrolment, instalment fees, grades and QR-verifiable report cards, Mobile Money payments, timetable shared on WhatsApp and QR-code attendance. Each school is isolated from the others.",
      tags: ["Mobile Money", "QR report cards", "WhatsApp", "Multi-school", "FR / EN"],
      result: "Live · from nursery to university",
      iconKey: "layers",
      gradient: GRADIENTS[0],
      role: "Design, development & operation",
      scope: "School management SaaS (enrolment, grades, fees)",
      ...zayraAssets("school"),
    },
    {
      title: "Zayra Agro",
      client: "Zayra Technologies · Farmers & cooperatives",
      category: "Agriculture & AgriTech",
      desc: "A farm adviser in your pocket, from seed to market: an AI adviser that cites its sources, training validated by agronomists, approved inputs close to home, experts in the field and reference prices to sell with confidence.",
      tags: ["Sourced AI", "Android", "Offline", "Field experts", "10 regions"],
      result: "Live · 1,500+ agronomy sheets",
      iconKey: "spark",
      gradient: GRADIENTS[2],
      role: "Design, development & operation",
      scope: "Farm advice, training and market linkage",
      ...zayraAssets("agro"),
    },
    {
      title: "Zayra Nkap",
      client: "Zayra Technologies · Tontines & associations",
      category: "Fintech & Management",
      desc: "Your meeting's ledgers, paper-free: contributions, tontines, shares and half-shares, auctions, loans, relief and penalties kept in real time, even offline on the treasurer's phone. Two-person approval of withdrawals and PDF financial statements.",
      tags: ["Tontines", "Offline", "Mobile Money", "PDF statements", "Two-person approval"],
      result: "Live · 30-day free trial",
      iconKey: "check",
      gradient: GRADIENTS[1],
      role: "Design, development & operation",
      scope: "Tontine and association management",
      ...zayraAssets("nkap"),
    },
  ],
};

export const ZAYRA_TITLES = ZAYRA_PROJECTS.fr.map((p) => p.title);

export function getZayraProjects(lang: Lang): Project[] {
  return ZAYRA_PROJECTS[lang];
}

export function getProjects(lang: Lang): Project[] {
  return [...PROJECTS[lang], ...ZAYRA_PROJECTS[lang]];
}

export const PARTNERS = ["Gathe Finance", "Afrikamode", "Elec One"];
