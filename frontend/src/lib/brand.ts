import type { Lang } from "@/i18n/dictionaries";

/**
 * Marque du build. Le même code produit deux sites :
 *  - "horus" (défaut) : horus-lab.com ;
 *  - "zayra" : zayra.technologies.horus-lab.com (NEXT_PUBLIC_BRAND=zayra au build).
 * Fixée au build pour que titres, balises canoniques, sitemap et JSON-LD soient
 * propres à chaque site : c'est ce qui permet à Google de référencer Zayra.
 */
export type Brand = "horus" | "zayra";

export const BRAND: Brand = process.env.NEXT_PUBLIC_BRAND === "zayra" ? "zayra" : "horus";
export const IS_ZAYRA = BRAND === "zayra";

export const BRAND_NAME = IS_ZAYRA ? "Zayra Technologies" : "Horus-Lab";

/** Titre de la page d'accueil (balise <title> et partage). */
export function brandHomeTitle(lang: Lang): string {
  if (IS_ZAYRA) {
    return lang === "fr"
      ? "Zayra Technologies · Solutions numériques pour l'Afrique"
      : "Zayra Technologies · Digital solutions for Africa";
  }
  return lang === "fr"
    ? "Horus-Lab · Solutions technologiques intelligentes"
    : "Horus-Lab · Intelligent technology solutions";
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
