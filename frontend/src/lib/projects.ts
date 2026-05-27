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
};

const GRADIENTS = [
  "from-brand-700 via-brand-500 to-sky", // Pre-Douane — multinational tech
  "from-rose-500 via-orange-500 to-amber-400", // Afrikamode — fashion warmth
  "from-emerald-500 via-teal-500 to-sky", // e-Learning — growth/knowledge
  "from-brand-800 via-brand-600 to-brand-400", // SFX eVAT
  "from-brand-600 via-sky to-brand-300", // SFX RelanceAuto
  "from-brand-900 via-brand-700 to-brand-500", // SOFTRONIC INNOVING
];

const PROJECTS: Record<Lang, Project[]> = {
  fr: [
    {
      title: "SFX Pre-Douane",
      client: "OMA Group · 11 pays africains",
      category: "Logistique & Transit",
      desc:
        "Application web multinationale de gestion de transitaire pour le groupe OMA et ses filiales — un outil central utilisé quotidiennement à travers 11 pays africains. Cahier des charges, modélisation des données, interfaces, intégration frontend/backend.",
      tags: ["Next.js", "TypeScript", "Prisma", "SQL Server", "Tailwind"],
      result: "11 pays · production",
      iconKey: "globe",
      gradient: GRADIENTS[0],
      role: "Développeur full-stack",
      scope: "Application web métier multi-pays",
    },
    {
      title: "Afrikamode",
      client: "Marque de mode africaine",
      category: "Mode & e-commerce",
      desc:
        "L'Afrique de la mode ne se résume pas au folklore. Des ateliers de Lagos à Dakar, de Bamako à Abidjan, des créateurs réinventent chaque saison une esthétique précise, exigeante, contemporaine. Afrikamode les porte au regard du public — et porte une petite ligne maison pour pousser plus loin certaines pièces. Plateforme e-commerce complète : catalogue, fiches, panier, paiement.",
      tags: ["Next.js", "React", "Tailwind", "TypeScript", "e-commerce"],
      result: "afrikamode.store · en ligne",
      iconKey: "spark",
      gradient: GRADIENTS[1],
      role: "Conception & développement",
      scope: "Boutique en ligne · marque maison + créateurs invités",
      url: "https://afrikamode.store",
    },
    {
      title: "Plateforme e-Learning",
      client: "Apprenants & professionnels IT",
      category: "Éducation & EdTech",
      desc:
        "Plateforme de formation aux métiers de l'informatique : développement web, Python, cybersécurité et plus encore. Parcours structurés, ressources progressives et suivi des apprenants — pensée pour rendre la tech accessible à tous, partout en Afrique.",
      tags: ["Next.js", "TypeScript", "Tailwind", "Vidéo", "PWA"],
      result: "Catalogue tech complet",
      iconKey: "eye",
      gradient: GRADIENTS[2],
      role: "Conception & développement",
      scope: "Plateforme de formation IT en ligne",
    },
    {
      title: "SFX eVAT",
      client: "OMA · FMG · CAPEWEST",
      category: "Finance & Fiscalité",
      desc:
        "Plateforme multinationale de normalisation des factures, conforme aux exigences fiscales locales. Conception de la base de données, des interfaces et de la chaîne d'intégration backend.",
      tags: ["Next.js", "TypeScript", "Prisma", "SQL Server"],
      result: "3 groupes · multi-pays",
      iconKey: "layers",
      gradient: GRADIENTS[3],
      role: "Développeur full-stack",
      scope: "SaaS de normalisation fiscale",
    },
    {
      title: "SFX RelanceAuto",
      client: "OMA Group",
      category: "Automatisation",
      desc:
        "Application web de relances automatiques des clients : pipeline d'envoi, suivi des statuts, tableaux de bord temps réel. Gain de temps significatif pour les équipes de recouvrement.",
      tags: ["Next.js", "TypeScript", "Prisma", "SQL Server"],
      result: "Pipeline automatisé",
      iconKey: "cog",
      gradient: GRADIENTS[4],
      role: "Développeur",
      scope: "Automatisation des relances clients",
    },
    {
      title: "SOFTRONIC INNOVING — site corporate",
      client: "SOFTRONIC INNOVING",
      category: "Site corporate",
      desc:
        "Conception et réalisation du site institutionnel de SOFTRONIC INNOVING : identité, contenus, performance et SEO de bout en bout.",
      tags: ["Next.js", "React", "Tailwind", "TypeScript"],
      result: "En production",
      iconKey: "code",
      gradient: GRADIENTS[5],
      role: "Développeur frontend",
      scope: "Site institutionnel responsive",
    },
  ],
  en: [
    {
      title: "SFX Pre-Douane",
      client: "OMA Group · 11 African countries",
      category: "Logistics & Transit",
      desc:
        "Multinational web application for customs and freight forwarding for the OMA group and its subsidiaries — a daily-driver tool used across 11 African countries. Requirements, data modelling, UI, frontend/backend integration.",
      tags: ["Next.js", "TypeScript", "Prisma", "SQL Server", "Tailwind"],
      result: "11 countries · live",
      iconKey: "globe",
      gradient: GRADIENTS[0],
      role: "Full-stack developer",
      scope: "Multi-country business web app",
    },
    {
      title: "Afrikamode",
      client: "African fashion brand",
      category: "Fashion & e-commerce",
      desc:
        "African fashion is not folklore. From Lagos to Dakar, Bamako to Abidjan, designers reinvent a precise, demanding, contemporary aesthetic every season. Afrikamode brings them to your eye — and ships a small in-house line to push the pieces we wanted to see exist. Full e-commerce: catalogue, product pages, cart, checkout.",
      tags: ["Next.js", "React", "Tailwind", "TypeScript", "e-commerce"],
      result: "afrikamode.store · live",
      iconKey: "spark",
      gradient: GRADIENTS[1],
      role: "Design & development",
      scope: "Online shop · house line + guest designers",
      url: "https://afrikamode.store",
    },
    {
      title: "e-Learning platform",
      client: "IT learners & professionals",
      category: "Education & EdTech",
      desc:
        "Training platform covering IT careers: web development, Python, cybersecurity and more. Structured tracks, progressive resources and learner tracking — built to make tech accessible everywhere across Africa.",
      tags: ["Next.js", "TypeScript", "Tailwind", "Video", "PWA"],
      result: "Full tech catalogue",
      iconKey: "eye",
      gradient: GRADIENTS[2],
      role: "Design & development",
      scope: "Online IT training platform",
    },
    {
      title: "SFX eVAT",
      client: "OMA · FMG · CAPEWEST",
      category: "Finance & Tax",
      desc:
        "Multinational platform for invoice normalisation, compliant with local tax requirements. Database, UI and backend integration designed and built end-to-end.",
      tags: ["Next.js", "TypeScript", "Prisma", "SQL Server"],
      result: "3 groups · multi-country",
      iconKey: "layers",
      gradient: GRADIENTS[3],
      role: "Full-stack developer",
      scope: "Tax-normalisation SaaS",
    },
    {
      title: "SFX RelanceAuto",
      client: "OMA Group",
      category: "Automation",
      desc:
        "Automated customer follow-up web app: send pipeline, status tracking, real-time dashboards. Significant time savings for collections teams.",
      tags: ["Next.js", "TypeScript", "Prisma", "SQL Server"],
      result: "Automated pipeline",
      iconKey: "cog",
      gradient: GRADIENTS[4],
      role: "Developer",
      scope: "Customer follow-up automation",
    },
    {
      title: "SOFTRONIC INNOVING — corporate site",
      client: "SOFTRONIC INNOVING",
      category: "Corporate site",
      desc:
        "Design and build of the SOFTRONIC INNOVING corporate website: identity, content, performance and SEO end-to-end.",
      tags: ["Next.js", "React", "Tailwind", "TypeScript"],
      result: "Live in production",
      iconKey: "code",
      gradient: GRADIENTS[5],
      role: "Frontend developer",
      scope: "Responsive corporate site",
    },
  ],
};

export function getProjects(lang: Lang): Project[] {
  return PROJECTS[lang];
}

export const PARTNERS = [
  "OMA Group",
  "FMG",
  "CAPEWEST",
  "SOFTRONIC INNOVING",
  "Afrikamode",
];
