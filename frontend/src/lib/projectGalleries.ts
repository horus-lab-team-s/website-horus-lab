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

/* ── Solutions Zayra : captures réelles des plateformes (bureau + mobile) ── */
const zs = (slug: string, file: string, fr: string, en: string): GalleryShot => ({
  src: `/zayra/solutions/${slug}/${file}.webp`,
  fr,
  en,
});

const zayraMobile = (slug: string, name: string): GalleryGroup => ({
  id: "mobile",
  labelFr: "Sur mobile",
  labelEn: "On mobile",
  noteFr: `${name} sur téléphone : la même expérience, pensée pour les petits écrans et les petits forfaits.`,
  noteEn: `${name} on a phone: the same experience, built for small screens and small data plans.`,
  portrait: true,
  shots: [zs(slug, "mobile", "Page d'accueil sur mobile", "Homepage on mobile")],
});

const ZAYRA_DRIVE: GalleryGroup[] = [
  {
    id: "plateforme",
    labelFr: "La plateforme",
    labelEn: "The platform",
    noteFr: "Apprendre, s'entraîner et se présenter au bon moment, avec l'auto-école à ses côtés.",
    noteEn: "Learn, practise and sit the exam at the right time, with the driving school alongside.",
    shots: [
      zs("drive", "desktop", "Page d'accueil", "Homepage"),
      zs("drive", "application", "L'application, écran par écran : cours, tuteur IA, révision hors ligne", "The app, screen by screen: lessons, AI tutor, offline revision"),
      zs("drive", "auto-ecoles", "Zayra Drive Schools : le tableau de bord des auto-écoles", "Zayra Drive Schools: the driving-school dashboard"),
      zs("drive", "hors-ligne", "Réviser sans connexion, synchroniser au retour du réseau", "Revise offline, sync when the network is back"),
    ],
  },
  zayraMobile("drive", "Zayra Drive"),
];

const ZAYRA_SCHOOL: GalleryGroup[] = [
  {
    id: "plateforme",
    labelFr: "La plateforme",
    labelEn: "The platform",
    noteFr: "De l'inscription au bulletin : toute la gestion de l'établissement dans un navigateur.",
    noteEn: "From enrolment to report card: the whole school run from a browser.",
    shots: [
      zs("school", "desktop", "Page d'accueil", "Homepage"),
      zs("school", "modules", "Les modules du quotidien : inscriptions, caisse, notes, documents", "Everyday modules: enrolment, cash desk, grades, documents"),
      zs("school", "bulletins", "De l'enseignant au bulletin, un circuit de validation clair", "From teacher to report card, a clear approval flow"),
      zs("school", "vie-de-classe", "Emploi du temps sur WhatsApp et émargement par QR code", "Timetable on WhatsApp and QR-code attendance"),
      zs("school", "pilotage", "Le tableau de bord de la direction", "The management dashboard"),
    ],
  },
  zayraMobile("school", "Zayra School"),
];

const ZAYRA_AGRO: GalleryGroup[] = [
  {
    id: "plateforme",
    labelFr: "La plateforme",
    labelEn: "The platform",
    noteFr: "L'agriculteur apprend, produit mieux, protège sa récolte et trouve les bons interlocuteurs.",
    noteEn: "Farmers learn, produce better, protect their harvest and find the right people to deal with.",
    shots: [
      zs("agro", "desktop", "Page d'accueil", "Homepage"),
      zs("agro", "promesses", "Quatre promesses, de la houe au marché", "Four promises, from hoe to market"),
      zs("agro", "conseiller", "Le conseiller agricole : il comprend, il cite ses sources", "The farm adviser: it understands, and cites its sources"),
      zs("agro", "pour-qui", "Agriculteurs, coopératives, revendeurs, experts et acheteurs réunis", "Farmers, cooperatives, dealers, experts and buyers together"),
      zs("agro", "application", "L'application Android, pensée pour les petits forfaits", "The Android app, built for small data plans"),
    ],
  },
  zayraMobile("agro", "Zayra Agro"),
];

const ZAYRA_NKAP: GalleryGroup[] = [
  {
    id: "plateforme",
    labelFr: "La plateforme",
    labelEn: "The platform",
    noteFr: "Avant, pendant et après la séance : les comptes de la réunion, justes et transparents.",
    noteEn: "Before, during and after the session: the meeting's accounts, accurate and transparent.",
    shots: [
      zs("nkap", "desktop", "Page d'accueil", "Homepage"),
      zs("nkap", "fonctionnement", "Avant, pendant et après la séance", "Before, during and after the session"),
      zs("nkap", "fonctionnalites", "Tout ce que le cahier faisait, en mieux", "Everything the ledger did, done better"),
      zs("nkap", "etats-financiers", "Des comptes clairs, sur une feuille propre", "Clear accounts, on a clean sheet"),
      zs("nkap", "application", "Le cahier du trésorier, dans la poche", "The treasurer's ledger, in your pocket"),
    ],
  },
  zayraMobile("nkap", "Zayra Nkap"),
];

export const PROJECT_GALLERIES: Record<string, GalleryGroup[]> = {
  Afrikamode: AFRIKAMODE,
  "Zayra Drive": ZAYRA_DRIVE,
  "Zayra School": ZAYRA_SCHOOL,
  "Zayra Agro": ZAYRA_AGRO,
  "Zayra Nkap": ZAYRA_NKAP,
};

export function galleryFor(title: string): GalleryGroup[] | null {
  return PROJECT_GALLERIES[title] ?? null;
}
