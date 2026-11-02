import type { Lang } from "@/i18n/dictionaries";

/**
 * Marque du build. Le même code produit deux sites :
 *  - "horus" (défaut) : horus-lab.com ;
 *  - "zayra" : zayra-technologies.com (NEXT_PUBLIC_BRAND=zayra au build).
 * Fixée au build pour que titres, balises canoniques, sitemap et JSON-LD soient
 * propres à chaque site : c'est ce qui permet à Google de référencer Zayra.
 */
export type Brand = "horus" | "zayra";

export const BRAND: Brand = process.env.NEXT_PUBLIC_BRAND === "zayra" ? "zayra" : "horus";
export const IS_ZAYRA = BRAND === "zayra";

export const BRAND_NAME = IS_ZAYRA ? "Zayra Technologies" : "Horus-Lab";

/** Adresses publiques des deux sites (liens croisés, JSON-LD). */
export const HORUS_SITE_URL = "https://horus-lab.com";
export const ZAYRA_SITE_URL = "https://zayra-technologies.com";

/** E-mail pro affiché sur les deux sites. */
export const CONTACT_EMAIL = "contact@zayra-technologies.com";

/** Titre de la page d'accueil (balise <title> et carte de partage). */
export function brandHomeTitle(lang: Lang): string {
  if (IS_ZAYRA) {
    return lang === "fr"
      ? "Zayra Technologies · Transition numérique, digitalisation et IA"
      : "Zayra Technologies · Digital transformation, digitalisation & AI";
  }
  return lang === "fr"
    ? "Horus-Lab · Digitalisation et IA sur mesure"
    : "Horus-Lab · Custom digitalisation & AI";
}

/** Description de la carte de partage et des moteurs de recherche. */
export function brandShareDescription(lang: Lang): string {
  if (IS_ZAYRA) {
    return lang === "fr"
      ? "Transition numérique des entreprises et institutions africaines : digitalisation des métiers, applications web et mobiles, et intelligence artificielle utile, de la conception à l'hébergement."
      : "Digital transformation for African businesses and institutions: process digitalisation, web and mobile apps, and useful artificial intelligence, from design to hosting.";
  }
  return lang === "fr"
    ? "Le laboratoire de Zayra Technologies accompagne la transition numérique des organisations africaines : digitalisation des métiers, applications web et mobiles sur mesure et intégration de l'IA."
    : "The lab of Zayra Technologies drives the digital transformation of African organisations: process digitalisation, custom web and mobile apps, and AI integration.";
}

/** Image de la carte de partage (1200 × 630), par site et par langue. */
export function brandShareImage(lang: Lang): { url: string; width: number; height: number; alt: string } {
  const alt = lang === "fr"
    ? "Transition numérique, digitalisation et intelligence artificielle"
    : "Digital transformation, digitalisation and artificial intelligence";
  return { url: `/og/og-${IS_ZAYRA ? "zayra" : "horus"}-${lang}.png`, width: 1200, height: 630, alt };
}

/** Accroche de l'accueil propre à Zayra (le site Horus garde celle du CMS). */
export const ZAYRA_HERO: Record<Lang, { eyebrow: string; titleLead: string; titleHighlight: string; subtitle: string }> = {
  fr: {
    eyebrow: "Zayra Technologies · Douala, Cameroun",
    titleLead: "Des solutions numériques pensées pour",
    titleHighlight: "le quotidien africain",
    subtitle:
      "Zayra Drive, Zayra School, Zayra Agro et Zayra Nkap : des applications web et mobiles conçues, développées et exploitées par notre laboratoire, Horus Lab.",
  },
  en: {
    eyebrow: "Zayra Technologies · Douala, Cameroon",
    titleLead: "Digital solutions built for",
    titleHighlight: "everyday Africa",
    subtitle:
      "Zayra Drive, Zayra School, Zayra Agro and Zayra Nkap: web and mobile apps designed, built and run by our lab, Horus Lab.",
  },
};

/** Présentation courte du pied de page, version Zayra. */
export const ZAYRA_ABOUT: Record<Lang, string> = {
  fr: "Zayra Technologies conçoit et exploite des solutions numériques africaines : Zayra Drive, School, Agro et Nkap. Horus Lab est son laboratoire de développement.",
  en: "Zayra Technologies designs and runs African digital solutions: Zayra Drive, School, Agro and Nkap. Horus Lab is its development lab.",
};
