/**
 * Galeries « étude de cas » par projet : captures réelles hébergées en local
 * (frontend/public). Chaque projet peut exposer plusieurs volets (ex. la
 * boutique côté client + le back-office d'administration), pour montrer qu'on
 * livre des plateformes complètes de gestion, pas seulement des vitrines.
 *
 * Clé = titre du projet (doit correspondre au titre CMS / projects.ts).
 */

export type GalleryShot = {
  src: string;
  /** Légende FR / EN */
  fr: string;
  en: string;
};

export type GalleryGroup = {
  id: string;
  /** Intitulé du volet */
  labelFr: string;
  labelEn: string;
  /** Courte accroche du volet */
  noteFr: string;
  noteEn: string;
  /** true si les captures sont en portrait (page complète) ; sinon paysage */
  portrait?: boolean;
  shots: GalleryShot[];
};

const AFRIKAMODE: GalleryGroup[] = [
  {
    id: "site",
    labelFr: "La boutique en ligne",
    labelEn: "The online store",
    noteFr: "L'expérience côté client : catalogue, fiches produits et journal éditorial.",
    noteEn: "The customer-facing experience: catalogue, product pages and editorial journal.",
    portrait: true,
    shots: [
      { src: "/afrikamode-realisations/01-site-accueil.png", fr: "Page d'accueil de la boutique", en: "Store homepage" },
      { src: "/afrikamode-realisations/02-site-catalogue.png", fr: "Catalogue avec filtres (taille, marque, catégorie, prix)", en: "Catalogue with filters (size, brand, category, price)" },
      { src: "/afrikamode-realisations/03-site-produit.png", fr: "Fiche produit détaillée", en: "Detailed product page" },
      { src: "/afrikamode-realisations/04-site-journal.png", fr: "Journal éditorial (mode & lifestyle)", en: "Editorial journal (fashion & lifestyle)" },
    ],
  },
  {
    id: "admin",
    labelFr: "Le back-office (administration)",
    labelEn: "The back-office (administration)",
    noteFr: "Le SaaS de gestion complet : catalogue, stock, logistique, marketing et CMS multilingue, pilotés en autonomie.",
    noteEn: "The full management SaaS: catalogue, stock, logistics, marketing and multilingual CMS, all self-managed.",
    portrait: false,
    shots: [
      { src: "/afrikamode-realisations/11-admin-produits.png", fr: "Gestion des produits", en: "Product management" },
      { src: "/afrikamode-realisations/33-admin-produit-detail.png", fr: "Fiche produit : édition détaillée", en: "Product sheet: detailed editing" },
      { src: "/afrikamode-realisations/12-admin-marques.png", fr: "Gestion des marques", en: "Brand management" },
      { src: "/afrikamode-realisations/13-admin-categories.png", fr: "Catégories", en: "Categories" },
      { src: "/afrikamode-realisations/14-admin-axes-variantes.png", fr: "Axes & variantes (tailles, couleurs)", en: "Options & variants (sizes, colours)" },
      { src: "/afrikamode-realisations/17-admin-stock.png", fr: "Suivi du stock", en: "Stock tracking" },
      { src: "/afrikamode-realisations/19-admin-tarifs-livraison.png", fr: "Tarifs de livraison", en: "Shipping rates" },
      { src: "/afrikamode-realisations/24-admin-marketing-overview.png", fr: "Marketing : vue d'ensemble", en: "Marketing: overview" },
      { src: "/afrikamode-realisations/25-admin-promotions.png", fr: "Promotions", en: "Promotions" },
      { src: "/afrikamode-realisations/26-admin-campagnes.png", fr: "Campagnes", en: "Campaigns" },
      { src: "/afrikamode-realisations/20-admin-cms-overview.png", fr: "CMS : contenu éditorial", en: "CMS: editorial content" },
      { src: "/afrikamode-realisations/21-admin-cms-hero.png", fr: "CMS : bannières d'accueil", en: "CMS: homepage banners" },
      { src: "/afrikamode-realisations/22-admin-cms-journal.png", fr: "CMS : journal", en: "CMS: journal" },
      { src: "/afrikamode-realisations/23-admin-cms-lookbook.png", fr: "CMS : lookbook", en: "CMS: lookbook" },
    ],
  },
];

export const PROJECT_GALLERIES: Record<string, GalleryGroup[]> = {
  Afrikamode: AFRIKAMODE,
};

export function galleryFor(title: string): GalleryGroup[] | null {
  return PROJECT_GALLERIES[title] ?? null;
}
