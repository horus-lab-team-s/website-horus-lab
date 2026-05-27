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
};

const GRADIENTS = [
  "from-brand-700 via-brand-500 to-sky",
  "from-brand-800 via-brand-600 to-brand-400",
  "from-brand-600 via-sky to-brand-300",
  "from-brand-900 via-brand-700 to-brand-500",
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
      title: "SFX eVAT",
      client: "OMA · FMG · CAPEWEST",
      category: "Finance & Fiscalité",
      desc:
        "Plateforme multinationale de normalisation des factures, conforme aux exigences fiscales locales. Conception de la base de données, des interfaces et de la chaîne d'intégration backend.",
      tags: ["Next.js", "TypeScript", "Prisma", "SQL Server"],
      result: "3 groupes · multi-pays",
      iconKey: "layers",
      gradient: GRADIENTS[1],
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
      gradient: GRADIENTS[2],
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
      gradient: GRADIENTS[3],
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
      title: "SFX eVAT",
      client: "OMA · FMG · CAPEWEST",
      category: "Finance & Tax",
      desc:
        "Multinational platform for invoice normalisation, compliant with local tax requirements. Database, UI and backend integration designed and built end-to-end.",
      tags: ["Next.js", "TypeScript", "Prisma", "SQL Server"],
      result: "3 groups · multi-country",
      iconKey: "layers",
      gradient: GRADIENTS[1],
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
      gradient: GRADIENTS[2],
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
      gradient: GRADIENTS[3],
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
  "11 pays africains",
];
