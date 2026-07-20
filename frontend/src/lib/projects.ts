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
      logo: "/logo-Afrikamode.jpeg",
      screenshots: [
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
      logo: "/logo-GATHE FINANCE.jpeg",
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
      desc: "Plateforme de formation aux métiers de l'informatique : développement web, Python, cybersécurité et plus. Parcours structurés, ressources progressives et suivi des apprenants — pour rendre la tech accessible à tous, partout en Afrique.",
      tags: ["Next.js", "TypeScript", "Tailwind", "Vidéo", "PWA"],
      result: "Catalogue tech complet",
      iconKey: "eye",
      gradient: GRADIENTS[2],
      role: "Conception & développement",
      scope: "Plateforme de formation IT en ligne",
      logo: "/logo-Edlearning.jpeg",
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
      desc: "Application mobile de pilotage d'EnMKit, le dispositif intelligent de maîtrise de l'énergie de 2MeTech. Depuis votre téléphone, coupez à distance les équipements restés allumés — fer à repasser, climatiseur, téléviseur — pour supprimer les gaspillages et réduire durablement votre facture d'électricité.",
      tags: ["Flutter", "Mobile", "IoT", "Temps réel", "Énergie"],
      result: "En production · consommation maîtrisée à distance",
      iconKey: "cog",
      gradient: GRADIENTS[4],
      role: "Conception & développement",
      scope: "Application mobile de pilotage énergétique (EnMKit)",
      url: "https://www.2metechsarl.org",
      logo: "/logo-Elec One.jpeg",
      screenshots: [
        "/img/photo-1473341304170-971dccb5ac1e-w1200.jpg",
        "/img/photo-1518770660439-4636190af475-w1200.jpg",
        "/img/photo-1518770660439-4636190af475-w1200.jpg",
        "/img/photo-1451187580459-43490279c0fa-w1200.jpg",
      ],
    },
    {
      title: "Programme Formation IT",
      client: "Professionnels & entreprises",
      category: "Formation",
      desc: "Programme de formation aux technologies modernes : développement web, mobile, cybersécurité, gestion de projet IT. Sessions pratiques adaptées au niveau des équipes et aux outils de l'entreprise.",
      tags: ["Formation", "Cybersécurité", "Développement", "Certification"],
      result: "Équipes opérationnelles",
      iconKey: "spark",
      gradient: GRADIENTS[3],
      role: "Formation & accompagnement",
      scope: "Formation IT sur mesure",
      logo: "/logo-formation.svg",
      screenshots: [
        "/img/photo-1573164713988-8665fc963095-w1200.jpg",
        "/img/photo-1524178232363-1fb2b075b655-w1200.jpg",
        "/img/photo-1531482615713-2afd69097998-w1200.jpg",
        "/img/photo-1515187029135-18ee286d815b-w1200.jpg",
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
      logo: "/logo-Afrikamode.jpeg",
      screenshots: [
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
      scope: "SME financial management",
      logo: "/logo-GATHE FINANCE.jpeg",
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
      desc: "Training platform covering IT careers: web development, Python, cybersecurity and more. Structured tracks, progressive resources and learner tracking — built to make tech accessible everywhere across Africa.",
      tags: ["Next.js", "TypeScript", "Tailwind", "Video", "PWA"],
      result: "Full tech catalogue",
      iconKey: "eye",
      gradient: GRADIENTS[2],
      role: "Design & development",
      scope: "Online IT training platform",
      logo: "/logo-Edlearning.jpeg",
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
      desc: "Mobile app that drives EnMKit, 2MeTech's smart energy-control device. From your phone, remotely switch off equipment left running — iron, air-conditioner, TV — cutting waste and durably lowering your electricity bill.",
      tags: ["Flutter", "Mobile", "IoT", "Real-time", "Energy"],
      result: "Live · consumption controlled remotely",
      iconKey: "cog",
      gradient: GRADIENTS[4],
      role: "Design & development",
      scope: "Mobile energy-control app (EnMKit)",
      url: "https://www.2metechsarl.org",
      logo: "/logo-Elec One.jpeg",
      screenshots: [
        "/img/photo-1473341304170-971dccb5ac1e-w1200.jpg",
        "/img/photo-1518770660439-4636190af475-w1200.jpg",
        "/img/photo-1518770660439-4636190af475-w1200.jpg",
        "/img/photo-1451187580459-43490279c0fa-w1200.jpg",
      ],
    },
    {
      title: "IT Training Programme",
      client: "Professionals & businesses",
      category: "Training",
      desc: "Training programme on modern technologies: web & mobile development, cybersecurity, IT project management. Hands-on sessions adapted to team levels and company tools.",
      tags: ["Training", "Cybersecurity", "Development", "Certification"],
      result: "Operational teams",
      iconKey: "spark",
      gradient: GRADIENTS[3],
      role: "Training & coaching",
      scope: "Custom IT training",
      logo: "/logo-formation.svg",
      screenshots: [
        "/img/photo-1573164713988-8665fc963095-w1200.jpg",
        "/img/photo-1524178232363-1fb2b075b655-w1200.jpg",
        "/img/photo-1531482615713-2afd69097998-w1200.jpg",
        "/img/photo-1515187029135-18ee286d815b-w1200.jpg",
      ],
    },
  ],
};

export function getProjects(lang: Lang): Project[] {
  return PROJECTS[lang];
}

export const PARTNERS = ["Gathe Finance", "Afrikamode", "Elec One"];
