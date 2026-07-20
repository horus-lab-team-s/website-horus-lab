import type { Lang } from "@/i18n/dictionaries";

export type NewsItem = {
  date: string; // ISO YYYY-MM-DD
  title: string;
  body: string;
  tag: string;
  /** Optionnel : lien externe à explorer (site, communiqué, etc.) */
  url?: string;
};

const NEWS: Record<Lang, NewsItem[]> = {
  fr: [
    {
      date: "2026-05-25",
      title: "Gathe Finance ouvre en bêta privée",
      body:
        "Notre plateforme de gestion financière pour PME et freelances entre en bêta : suivi multi-comptes, budgets, reporting trésorerie. Les premiers utilisateurs rejoignent la liste d'attente.",
      tag: "Produit",
    },
    {
      date: "2026-05-12",
      title: "Afrikamode est en ligne sur afrikamode.store",
      body:
        "La boutique en ligne d'Afrikamode ouvre ses portes, avec une ligne maison et des créateurs invités. Catalogue, panier et paiement de bout en bout.",
      tag: "Lancement",
      url: "https://afrikamode.store",
    },
    {
      date: "2026-04-10",
      title: "Plateforme e-Learning : nouveau parcours Cybersécurité",
      body:
        "Le cycle Cybersécurité rejoint le développement web et Python. Modules progressifs, exercices guidés et certificats à la clé.",
      tag: "Roadmap",
    },
  ],
  en: [
    {
      date: "2026-05-25",
      title: "Gathe Finance enters private beta",
      body:
        "Our financial management platform for SMEs and freelancers opens its private beta: multi-account tracking, budgets, cash-flow reporting. First users joining the waitlist.",
      tag: "Product",
    },
    {
      date: "2026-05-12",
      title: "Afrikamode is live on afrikamode.store",
      body:
        "Afrikamode opens its online store, with an in-house line and guest designers. Catalogue, cart and checkout end to end.",
      tag: "Launch",
      url: "https://afrikamode.store",
    },
    {
      date: "2026-04-10",
      title: "e-Learning platform: new Cybersecurity track",
      body:
        "The Cybersecurity track joins web development and Python. Progressive modules, guided exercises and certificates.",
      tag: "Roadmap",
    },
  ],
};

export function getNews(lang: Lang): NewsItem[] {
  return [...NEWS[lang]].sort((a, b) => (a.date < b.date ? 1 : -1));
}
