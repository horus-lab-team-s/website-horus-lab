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
  "from-rose-500 via-orange-500 to-amber-400",  // Afrikamode
  "from-slate-800 via-brand-700 to-amber-500",  // Gathe Finance
  "from-emerald-500 via-teal-500 to-sky",       // e-Learning
  "from-brand-700 via-brand-500 to-sky",        // Formation
  "from-yellow-500 via-orange-400 to-red-500",  // Elec One, énergie
];

const PROJECTS: Record<Lang, Project[]> = {
  fr: [
    {
      title: "Afrikamode",
      client: "Italie · France · Belgique · Cameroun",
      category: "Mode & e-commerce",
      desc: "Plateforme e-commerce internationale pour une marque de mode africaine présente en Europe et en Afrique. Catalogue multilingue, fiches produits, panier, paiement sécurisé. Des créateurs de Lagos à Abidjan, une ligne maison, une esthétique contemporaine, portée sur 4 pays.",
      tags: ["Next.js", "React", "Tailwind", "TypeScript", "e-commerce"],
      result: "Live en Europe & Afrique",
      iconKey: "spark",
      gradient: GRADIENTS[0],
      role: "Conception & développement",
      scope: "Boutique e-commerce internationale",
      url: "https://afrikamode.store",
      logo: "/logo-Afrikamode.jpeg",
      screenshots: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
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
      logo: "/logo-Edlearning.jpeg",
      screenshots: [
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      title: "Elec One",
      client: "Secteur Énergie & Industrie",
      category: "Énergie & Industrie",
      desc: "Application web de gestion et de supervision pour le secteur électrique et industriel : suivi des équipements, tableaux de bord temps réel, alertes et reporting. Conçue pour les professionnels de l'énergie qui veulent piloter leur infrastructure avec précision.",
      tags: ["Next.js", "TypeScript", "Dashboard", "IoT", "Cloud"],
      result: "Supervision en temps réel",
      iconKey: "cog",
      gradient: GRADIENTS[4],
      role: "Conception & développement",
      scope: "Application de gestion énergétique",
      logo: "/logo-Elec One.jpeg",
      screenshots: [
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1581092334651-ddf19d571708?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ],
  en: [
    {
      title: "Afrikamode",
      client: "Italy · France · Belgium · Cameroon",
      category: "Fashion & e-commerce",
      desc: "International e-commerce platform for an African fashion brand present across Europe and Africa. Multilingual catalogue, product pages, cart, secure checkout. Designers from Lagos to Abidjan, an in-house line, live in 4 countries.",
      tags: ["Next.js", "React", "Tailwind", "TypeScript", "e-commerce"],
      result: "Live in Europe & Africa",
      iconKey: "spark",
      gradient: GRADIENTS[0],
      role: "Design & development",
      scope: "International e-commerce store",
      url: "https://afrikamode.store",
      logo: "/logo-Afrikamode.jpeg",
      screenshots: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
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
      logo: "/logo-Edlearning.jpeg",
      screenshots: [
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      title: "Elec One",
      client: "Energy & Industry sector",
      category: "Energy & Industry",
      desc: "Web application for management and supervision in the electrical and industrial sector: equipment monitoring, real-time dashboards, alerts and reporting. Built for energy professionals who want to drive their infrastructure with precision.",
      tags: ["Next.js", "TypeScript", "Dashboard", "IoT", "Cloud"],
      result: "Real-time supervision",
      iconKey: "cog",
      gradient: GRADIENTS[4],
      role: "Design & development",
      scope: "Energy management application",
      logo: "/logo-Elec One.jpeg",
      screenshots: [
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1581092334651-ddf19d571708?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ],
};

export function getProjects(lang: Lang): Project[] {
  return PROJECTS[lang];
}

export const PARTNERS = ["Gathe Finance", "Afrikamode", "Elec One"];
