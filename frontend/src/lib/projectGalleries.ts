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


/* ── Références clients : captures réelles dans /public/realisations/<projet>/ ── */
const rs = (dir: string, file: string, fr: string, en: string): GalleryShot => ({
  src: `/realisations/${dir}/${file}.webp`,
  fr,
  en,
});

const CASE_FORMATIONS: GalleryGroup[] = [
  {
    id: "site",
    labelFr: "Le site et l'inscription en ligne",
    labelEn: "The website and online sign-up",
    noteFr: "L'offre du centre, le catalogue et l'inscription payable par Mobile Money.",
    noteEn: "The centre's offer, the catalogue and sign-up payable by Mobile Money.",
    shots: [
      rs("caseformation", "desktop", "Page d'accueil", "Homepage"),
      rs("caseformation", "formations", "Catalogue des formations, avec filtres et prix", "Course catalogue, with filters and prices"),
      rs("caseformation", "tcf", "Ressources : tout comprendre du TCF", "Resources: understanding the TCF"),
      rs("caseformation", "a-propos", "Le centre et son engagement", "The centre and its commitment"),
    ],
  },
  {
    id: "mobile",
    labelFr: "Sur mobile",
    labelEn: "On mobile",
    noteFr: "La même expérience sur téléphone, où se font la plupart des inscriptions.",
    noteEn: "The same experience on a phone, where most sign-ups happen.",
    portrait: true,
    shots: [
      rs("caseformation", "mobile", "Page d'accueil sur mobile", "Homepage on mobile"),
      rs("caseformation", "mobile-formations", "Catalogue sur mobile", "Catalogue on mobile"),
    ],
  },
];

const ENMKIT: GalleryGroup[] = [
  {
    id: "plateforme",
    labelFr: "Le banc et la plateforme",
    labelEn: "The bench and the platform",
    noteFr: "Le banc d'essais pédagogique et le tableau de bord qui centralise les relevés.",
    noteEn: "The educational test bench and the dashboard that centralises readings.",
    shots: [
      rs("enmkit", "desktop", "Le banc d'essais EnMKit", "The EnMKit test bench"),
      rs("enmkit", "dashboard-connexion", "Le tableau de bord de supervision", "The supervision dashboard"),
    ],
  },
  {
    id: "app",
    labelFr: "L'application mobile",
    labelEn: "The mobile app",
    noteFr: "Piloter ses kits par SMS, suivre sa consommation et partager une configuration.",
    noteEn: "Drive kits by SMS, track consumption and share a configuration.",
    portrait: true,
    shots: [
      rs("enmkit", "parc", "Un parc de logements, un seul téléphone", "A housing stock, one phone"),
      rs("enmkit", "lignes", "Allumer et couper chaque ligne", "Switch each line on and off"),
      rs("enmkit", "relais", "Le détail d'un relais", "Relay details"),
      rs("enmkit", "conso", "La consommation en kWh", "Consumption in kWh"),
      rs("enmkit", "accuses", "L'historique des accusés de réception", "Acknowledgement history"),
      rs("enmkit", "qr", "Partager un kit par QR Code", "Share a kit by QR Code"),
    ],
  },
];

const GATHE: GalleryGroup[] = [
  {
    id: "site",
    labelFr: "Le site et le portail des membres",
    labelEn: "The website and member portal",
    noteFr: "Captures de la plateforme en production.",
    noteEn: "Screenshots of the platform in production.",
    shots: [
      rs("gathe", "desktop", "Page d'accueil", "Homepage"),
      rs("gathe", "services", "Les services financiers", "Financial services"),
      rs("gathe", "campagnes", "Les campagnes de la coopérative", "Cooperative campaigns"),
      rs("gathe", "portail", "Le portail des membres", "The member portal"),
    ],
  },
  {
    id: "mobile",
    labelFr: "Sur mobile",
    labelEn: "On mobile",
    noteFr: "Le site sur téléphone, pour rejoindre la coopérative en quelques étapes.",
    noteEn: "The website on a phone, to join the cooperative in a few steps.",
    portrait: true,
    shots: [
      rs("gathe", "mobile", "Page d'accueil sur mobile", "Homepage on mobile"),
      rs("gathe", "mobile-membre", "Devenir membre", "Becoming a member"),
    ],
  },
];

const CGA: GalleryGroup[] = [
  {
    id: "site",
    labelFr: "Le site public et la console",
    labelEn: "The public website and the console",
    noteFr: "Estimation, souscription et création d'entreprise en ligne, puis la console du cabinet.",
    noteEn: "Online estimates, sign-up and company creation, then the firm's console.",
    shots: [
      rs("cga", "desktop", "Page d'accueil du cabinet", "The firm's homepage"),
      rs("cga", "estimation", "Estimer le coût de sa création d'entreprise", "Estimate the cost of creating a company"),
      rs("cga", "adhesion", "Devenir adhérent", "Becoming a member"),
      rs("cga", "creation", "Créer son entreprise : les pièces du dossier", "Creating a company: the required documents"),
      rs("cga", "application", "L'application mobile des adhérents", "The members' mobile app"),
      rs("cga", "console-connexion", "La console du cabinet et l'espace adhérent", "The firm console and member area"),
    ],
  },
  {
    id: "mobile",
    labelFr: "Sur mobile",
    labelEn: "On mobile",
    noteFr: "Le site du cabinet sur téléphone.",
    noteEn: "The firm's website on a phone.",
    portrait: true,
    shots: [
      rs("cga", "mobile", "Page d'accueil sur mobile", "Homepage on mobile"),
      rs("cga", "mobile-estimation", "L'estimateur sur mobile", "The estimator on mobile"),
    ],
  },
];

export const PROJECT_GALLERIES: Record<string, GalleryGroup[]> = {
  "Case Formations": CASE_FORMATIONS,
  EnMKit: ENMKIT,
  Afrikamode: AFRIKAMODE,
  "Gathe Finance": GATHE,
  "CGA BRCG": CGA,
  "Zayra Drive": ZAYRA_DRIVE,
  "Zayra School": ZAYRA_SCHOOL,
  "Zayra Agro": ZAYRA_AGRO,
  "Zayra Nkap": ZAYRA_NKAP,
};

export function galleryFor(title: string): GalleryGroup[] | null {
  return PROJECT_GALLERIES[title] ?? null;
}
