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

/* Projets clients, dans l'ordre de mise en avant (voir FEATURED_ORDER). Textes
   tirés des dépôts et des sites en ligne de chaque projet ; captures réelles
   dans /public/realisations/<projet>/. */
const PROJECTS: Record<Lang, Project[]> = {
  fr: [
    {
      title: "Case Formations",
      client: "Centre d'accompagnement pédagogique · Cameroun",
      category: "Éducation & EdTech",
      desc: "Plateforme complète d'un centre de formation : préparation au TCF et à l'examen civique, allemand (Goethe A1 à C2), cours de répétition. Site bilingue avec catalogue et inscription en ligne payable par Mobile Money, back-office de gestion (agenda, devoirs, échéances, messagerie) et application Android de pilotage pour la direction.",
      tags: ["Next.js", "Django", "Flutter", "Mobile Money", "FR / EN"],
      result: "En ligne · inscription et paiement en ligne",
      iconKey: "eye",
      gradient: "from-brand-700 via-brand-500 to-amber-400",
      role: "Conception, développement & hébergement",
      scope: "Site, back-office et application de pilotage",
      url: "https://caseformations.com",
      logo: "/logo/logo-caseformations.png",
      cover: "/realisations/caseformation/desktop.webp",
    },
    {
      title: "EnMKit",
      client: "2ME Technologies SARL · Énergie",
      category: "Énergie & Industrie",
      desc: "Pilotage et suivi de la consommation électrique : des kits équipés d'un module GSM se commandent par SMS depuis l'application mobile, même sans Internet. Un tableau de bord web centralise les relevés et un banc d'essais pédagogique accompagne la formation (7 TP).",
      tags: ["Flutter", "SMS / GSM", "FastAPI", "Next.js", "IoT"],
      result: "En production · pilotage sans Internet",
      iconKey: "cog",
      gradient: "from-brand-600 via-sky to-brand-400",
      role: "Conception & développement",
      scope: "Applications mobiles, passerelle SMS, API et tableau de bord",
      url: "https://www.2metechsarl.org",
      logo: "/logo/logo-enmkit.png",
      cover: "/realisations/enmkit/desktop.webp",
    },
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
      client: "Coopérative GATHE Finance · Broad Range Consulting Group",
      category: "Fintech & Gestion",
      desc: "Plateforme de la coopérative d'épargne et de crédit GATHE Finance : site public bilingue, portail des membres, back-office et application mobile. Les membres suivent leur épargne et leurs collectes journalières, demandent un crédit et le remboursent depuis leur téléphone.",
      tags: ["Next.js", "Django", "Wagtail", "Flutter", "PWA"],
      result: "En production chez la coopérative",
      iconKey: "layers",
      gradient: GRADIENTS[1],
      role: "Conception, développement & mise en production",
      scope: "Site, portail membre, back-office et app mobile",
      url: "https://gathe-finance.com",
      logo: "/logo/logo-GATHE_FINANCE.png",
      cover: "/realisations/gathe/desktop.webp",
    },
    {
      title: "CGA BRCG",
      client: "Centre de Gestion Agréé Broad Range Consulting Group",
      category: "Comptabilité & Fiscalité",
      desc: "Plateforme de suivi fiscal et comptable d'un centre de gestion agréé : chaque pièce est contrôlée dès sa réception, et l'impact d'une anomalie est chiffré avant qu'il ne devienne une perte. Comptabilité SYSCOHADA, échéancier fiscal et TVA, espace adhérent, application mobile hors ligne pour transmettre les justificatifs, et site public avec estimation et souscription en ligne.",
      tags: ["FastAPI", "Next.js", "Flutter", "SYSCOHADA", "Mobile Money"],
      result: "En cours de déploiement",
      iconKey: "check",
      gradient: "from-[#3b1f5c] via-[#6b2d8f] to-brand-500",
      role: "Conception & développement",
      scope: "Console du cabinet, espace adhérent, app mobile et site public",
      url: "https://cga-brcg.horus-lab.com",
      logo: "/logo/logo-cga-brcg.png",
      cover: "/realisations/cga/desktop.webp",
    },
    {
      title: "Plateforme e-Learning",
      client: "CFP Broad Range Consulting · Apprenants IT",
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
  ],
  en: [
    {
      title: "Case Formations",
      client: "Tutoring and exam-prep centre · Cameroon",
      category: "Education & EdTech",
      desc: "A complete platform for a training centre: TCF and civic-exam preparation, German (Goethe A1 to C2) and tutoring. A bilingual website with an online catalogue and sign-up payable by Mobile Money, a management back-office (schedule, homework, instalments, messaging) and an Android management app for the directors.",
      tags: ["Next.js", "Django", "Flutter", "Mobile Money", "FR / EN"],
      result: "Live · online sign-up and payment",
      iconKey: "eye",
      gradient: "from-brand-700 via-brand-500 to-amber-400",
      role: "Design, development & hosting",
      scope: "Website, back-office and management app",
      url: "https://caseformations.com",
      logo: "/logo/logo-caseformations.png",
      cover: "/realisations/caseformation/desktop.webp",
    },
    {
      title: "EnMKit",
      client: "2ME Technologies SARL · Energy",
      category: "Energy & Industry",
      desc: "Control and monitoring of electricity use: kits fitted with a GSM module are switched by SMS from the mobile app, even without Internet. A web dashboard centralises the readings, and an educational test bench supports training (7 lab sessions).",
      tags: ["Flutter", "SMS / GSM", "FastAPI", "Next.js", "IoT"],
      result: "In production · control without Internet",
      iconKey: "cog",
      gradient: "from-brand-600 via-sky to-brand-400",
      role: "Design & development",
      scope: "Mobile apps, SMS gateway, API and dashboard",
      url: "https://www.2metechsarl.org",
      logo: "/logo/logo-enmkit.png",
      cover: "/realisations/enmkit/desktop.webp",
    },
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
      client: "GATHE Finance cooperative · Broad Range Consulting Group",
      category: "Fintech & Management",
      desc: "The platform of the GATHE Finance savings and credit cooperative: a bilingual public website, a member portal, a back-office and a mobile app. Members follow their savings and daily collections, apply for credit and repay it from their phone.",
      tags: ["Next.js", "Django", "Wagtail", "Flutter", "PWA"],
      result: "In production at the cooperative",
      iconKey: "layers",
      gradient: GRADIENTS[1],
      role: "Design, development & go-live",
      scope: "Website, member portal, back-office and mobile app",
      url: "https://gathe-finance.com",
      logo: "/logo/logo-GATHE_FINANCE.png",
      cover: "/realisations/gathe/desktop.webp",
    },
    {
      title: "CGA BRCG",
      client: "Broad Range Consulting Group approved management centre",
      category: "Accounting & Tax",
      desc: "A tax and accounting platform for an approved management centre (CGA): every document is checked on arrival, and the cost of an anomaly is quantified before it becomes a loss. SYSCOHADA accounting, tax calendar and VAT, member area, an offline mobile app to send receipts, and a public website with online estimates and sign-up.",
      tags: ["FastAPI", "Next.js", "Flutter", "SYSCOHADA", "Mobile Money"],
      result: "Being rolled out",
      iconKey: "check",
      gradient: "from-[#3b1f5c] via-[#6b2d8f] to-brand-500",
      role: "Design & development",
      scope: "Firm console, member area, mobile app and public website",
      url: "https://cga-brcg.horus-lab.com",
      logo: "/logo/logo-cga-brcg.png",
      cover: "/realisations/cga/desktop.webp",
    },
    {
      title: "e-Learning platform",
      client: "CFP Broad Range Consulting · IT learners",
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

/** Ordre de mise en avant des réalisations (titres FR et EN). */
export const FEATURED_ORDER = [
  "Case Formations", "EnMKit",
  "Zayra Drive", "Zayra School", "Zayra Agro", "Zayra Nkap",
  "Afrikamode", "Gathe Finance", "CGA BRCG",
  "Plateforme e-Learning", "e-Learning platform",
];

/** Anciens titres encore présents dans l'admin, remplacés dans le code. */
export const RENAMED_TITLES: Record<string, string> = { "Elec One": "EnMKit" };

export function sortFeatured(projects: Project[]): Project[] {
  const rank = (t: string) => {
    const i = FEATURED_ORDER.indexOf(t);
    return i === -1 ? FEATURED_ORDER.length : i;
  };
  return projects.slice().sort((a, b) => rank(a.title) - rank(b.title));
}

export function getProjects(lang: Lang): Project[] {
  return sortFeatured([...PROJECTS[lang], ...ZAYRA_PROJECTS[lang]]);
}

export const PARTNERS = ["Gathe Finance", "Afrikamode", "EnMKit"];
