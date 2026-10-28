import type { Lang } from "@/i18n/dictionaries";

/**
 * Études de cas : la page de présentation complète de chaque réalisation
 * (/[lang]/portfolio/[slug]) et le dossier PDF des réalisations.
 *
 * Contenu factuel uniquement : stacks relevées dans les dépôts des projets,
 * fonctionnalités visibles en production, témoignages publiés sur horus-lab.com.
 * La clé `titles` doit correspondre au titre du projet (CMS / projects.ts).
 */

export type TechItem = { name: string; icon?: string };
export type CaseLink = { label: string; href: string };

export type CaseStudy = {
  slug: string;
  /** Titres du projet par langue, tels qu'affichés dans les cartes Réalisations. */
  titles: Record<Lang, string>;
  kind: "solution" | "client";
  logo: string;
  cover?: string;
  /** Couleurs de marque du dégradé (classes Tailwind), pour les accents. */
  gradient: string;
  stack: TechItem[];
  links: Record<Lang, CaseLink[]>;
  testimonial?: { photo: string; name: string; role: Record<Lang, string>; quote: Record<Lang, string> };
  content: Record<Lang, {
    client: string;
    sector: string;
    tagline: string;
    intro: string;
    challenge: string;
    approach: string;
    services: string[];
    features: { title: string; desc: string }[];
    results: string[];
  }>;
};

const T = (name: string, icon?: string): TechItem => ({ name, icon: icon ? `/tech/${icon}.svg` : undefined });

const ZAYRA_WEB = [T("Next.js", "nextjs"), T("TypeScript", "typescript"), T("Tailwind CSS", "tailwindcss"), T("FastAPI", "fastapi"), T("PostgreSQL", "postgresql")];
const ZAYRA_OPS = [T("Redis"), T("MinIO"), T("Docker", "docker")];
const CLIENT_WEB = [T("Next.js", "nextjs"), T("Tailwind CSS", "tailwindcss"), T("FastAPI", "fastapi"), T("Django", "django"), T("PostgreSQL", "postgresql"), T("Docker", "docker"), T("nginx", "nginx")];
const CLIENT_MOBILE = [T("Dart", "dart"), T("Flutter", "flutter"), T("Firebase", "firebase")];

const zayraLinks = (slug: string, fr: string, en: string): Record<Lang, CaseLink[]> => ({
  fr: [{ label: fr, href: `https://zayra.${slug}.horus-lab.com` }],
  en: [{ label: en, href: `https://zayra.${slug}.horus-lab.com` }],
});

const ZAYRA_SERVICES_FR = [
  "Conception produit et parcours utilisateurs",
  "Site web et espaces de gestion (Next.js)",
  "API et base de données (FastAPI, PostgreSQL)",
  "Paiement Mobile Money",
  "Hébergement, mises à jour et exploitation",
];
const ZAYRA_SERVICES_EN = [
  "Product design and user journeys",
  "Website and management spaces (Next.js)",
  "API and database (FastAPI, PostgreSQL)",
  "Mobile Money payments",
  "Hosting, updates and operation",
];

export const CASE_STUDIES: CaseStudy[] = [
  /* ═══════════════════════════ Solutions Zayra ═══════════════════════════ */
  {
    slug: "zayra-drive",
    titles: { fr: "Zayra Drive", en: "Zayra Drive" },
    kind: "solution",
    logo: "/zayra/solutions/drive/logo.png",
    cover: "/zayra/solutions/drive/desktop.webp",
    gradient: "from-brand-700 via-brand-500 to-sky",
    stack: [...ZAYRA_WEB, T("Flutter", "flutter"), T("Claude (IA)"), T("ReportLab (PDF)"), ...ZAYRA_OPS],
    links: zayraLinks("drive", "Le site : zayra.drive.horus-lab.com", "The site: zayra.drive.horus-lab.com"),
    content: {
      fr: {
        client: "Solution Zayra · candidats et auto-écoles",
        sector: "Éducation & EdTech",
        tagline: "Le code de la route, appris, pratiqué et réussi.",
        intro: "Zayra Drive prépare les candidats à l'épreuve théorique du permis de conduire au Cameroun : cours illustrés, QCM d'images, examens blancs chronométrés et corrections expliquées, en français et en anglais. Les auto-écoles partenaires suivent la préparation de chaque élève.",
        challenge: "Les candidats révisaient sur des supports dispersés, sans visibilité sur leur niveau réel, et les auto-écoles n'avaient aucun moyen de suivre la préparation de leurs élèves entre deux séances.",
        approach: "Une plateforme web et une application Android qui couvrent tout le parcours, de la fiche de cours à l'examen blanc, avec un tuteur IA qui répond à partir des fiches Zayra Drive, un score de préparation par thème et un espace dédié aux auto-écoles.",
        services: ZAYRA_SERVICES_FR.concat(["Application Android (Flutter) avec révision hors ligne", "Tuteur IA par module"]),
        features: [
          { title: "Examens blancs réels", desc: "40 questions chronométrées, partie A sans image et partie B sur photos, comme le jour J." },
          { title: "Score de préparation", desc: "Thème par thème, il indique au candidat quand se présenter." },
          { title: "Corrections sourcées", desc: "Chaque réponse est expliquée et justifiée par l'article du code concerné." },
          { title: "Tuteur IA par module", desc: "Il répond aux questions en s'appuyant sur les fiches de cours." },
          { title: "Révision hors ligne", desc: "Modules téléchargeables, séances synchronisées au retour du réseau." },
          { title: "Zayra Drive Schools", desc: "Tableau de bord des auto-écoles : suivi des élèves, invitations par code DRV, résultats officiels." },
        ],
        results: [
          "En ligne : web et application Android",
          "686 questions corrigées, 288 QCM d'images, 17 modules du programme",
          "Offre Essentiel à 10 000 FCFA pour 90 jours, payée par Mobile Money",
          "60 % de chaque abonnement Essentiel reversés à l'auto-école partenaire",
        ],
      },
      en: {
        client: "Zayra solution · learners and driving schools",
        sector: "Education & EdTech",
        tagline: "The highway code, learned, practised and passed.",
        intro: "Zayra Drive prepares candidates for the theory part of the Cameroonian driving test: illustrated lessons, picture quizzes, timed mock exams and explained corrections, in French and English. Partner driving schools follow each learner's preparation.",
        challenge: "Candidates revised from scattered material with no view of their real level, and driving schools had no way to follow their learners between lessons.",
        approach: "A web platform and an Android app covering the whole journey, from lesson sheet to mock exam, with an AI tutor answering from the Zayra Drive sheets, a readiness score per topic and a dedicated driving-school space.",
        services: ZAYRA_SERVICES_EN.concat(["Android app (Flutter) with offline revision", "AI tutor per module"]),
        features: [
          { title: "Real mock exams", desc: "40 timed questions, part A text-only and part B on photos, just like the real day." },
          { title: "Readiness score", desc: "Topic by topic, it tells the candidate when to sit the exam." },
          { title: "Sourced corrections", desc: "Every answer is explained and backed by the relevant article of the code." },
          { title: "AI tutor per module", desc: "It answers questions using the lesson sheets." },
          { title: "Offline revision", desc: "Downloadable modules, sessions synced when the network returns." },
          { title: "Zayra Drive Schools", desc: "Driving-school dashboard: learner follow-up, DRV-code invitations, official results." },
        ],
        results: [
          "Live: web and Android app",
          "686 corrected questions, 288 picture quizzes, 17 syllabus modules",
          "Essential plan: 10,000 FCFA for 90 days, paid via Mobile Money",
          "60% of each Essential subscription shared with the partner driving school",
        ],
      },
    },
  },
  {
    slug: "zayra-school",
    titles: { fr: "Zayra School", en: "Zayra School" },
    kind: "solution",
    logo: "/zayra/solutions/school/logo.png",
    cover: "/zayra/solutions/school/desktop.webp",
    gradient: "from-sky via-brand-500 to-brand-700",
    stack: [...ZAYRA_WEB, T("Flutter", "flutter"), T("ReportLab (PDF)"), T("MinIO"), T("Docker", "docker")],
    links: zayraLinks("school", "Le site : zayra.school.horus-lab.com", "The site: zayra.school.horus-lab.com"),
    content: {
      fr: {
        client: "Solution Zayra · établissements scolaires",
        sector: "Éducation & EdTech",
        tagline: "Votre établissement, géré simplement et sûrement.",
        intro: "Zayra School gère un établissement de l'inscription au bulletin : les enseignants saisissent leurs notes, la direction valide, les familles paient par Mobile Money et chaque document délivré se vérifie en ligne. De la maternelle à l'université, en français et en anglais.",
        challenge: "Beaucoup d'établissements gèrent encore sur papier ou sur Excel : caisses difficiles à rapprocher, bulletins falsifiables, familles informées tardivement des absences et des paiements.",
        approach: "Un seul outil réglé pour chaque type d'établissement (primaire, secondaire francophone et anglophone, LMD, formation), avec un circuit de validation des notes, des documents vérifiables par QR code et des paiements Mobile Money rapprochés automatiquement.",
        services: ZAYRA_SERVICES_FR.concat(["Bulletins et certificats vérifiables par QR code", "Site web propre à chaque établissement"]),
        features: [
          { title: "Inscriptions et scolarité", desc: "Dossiers élèves, réinscriptions et paiements par tranches, reçus officiels." },
          { title: "Notes et bulletins", desc: "Saisie par l'enseignant, validation par la direction, bulletin daté et vérifiable." },
          { title: "Mobile Money intégré", desc: "MTN MoMo et Orange Money, confirmation automatique, jamais de double paiement." },
          { title: "Vie de classe", desc: "Émargement par QR code, emploi du temps partagé sur WhatsApp, alertes aux familles." },
          { title: "Pilotage de la direction", desc: "Effectifs, caisse, impayés et résultats au même endroit, selon le rôle de chacun." },
          { title: "Sécurité", desc: "Chaque établissement isolé dans la base, rôles sur mesure et journal de toutes les actions." },
        ],
        results: [
          "En ligne, accessible depuis un simple navigateur",
          "11 modules, 3 modèles de bulletin (primaire, secondaire, formation)",
          "100 % des actions inscrites au journal",
          "Mise en place dès 200 000 FCFA, avec le site de l'établissement",
        ],
      },
      en: {
        client: "Zayra solution · schools",
        sector: "Education & EdTech",
        tagline: "Your school, run simply and securely.",
        intro: "Zayra School runs a school from enrolment to report card: teachers enter grades, management validates, families pay by Mobile Money and every issued document can be verified online. From nursery to university, in French and English.",
        challenge: "Many schools still run on paper or Excel: hard-to-reconcile cash desks, forgeable report cards, families told late about absences and payments.",
        approach: "A single tool tuned for each type of school (primary, French- and English-speaking secondary, LMD, training), with a grade-approval flow, QR-verifiable documents and automatically reconciled Mobile Money payments.",
        services: ZAYRA_SERVICES_EN.concat(["QR-verifiable report cards and certificates", "A website for each school"]),
        features: [
          { title: "Enrolment and fees", desc: "Student records, re-enrolment and instalment payments, official receipts." },
          { title: "Grades and report cards", desc: "Entered by teachers, approved by management, dated and verifiable." },
          { title: "Built-in Mobile Money", desc: "MTN MoMo and Orange Money, automatic confirmation, never a double payment." },
          { title: "Class life", desc: "QR-code attendance, timetable shared on WhatsApp, alerts to families." },
          { title: "Management dashboard", desc: "Headcount, cash desk, arrears and results in one place, by role." },
          { title: "Security", desc: "Each school isolated in the database, custom roles and a log of every action." },
        ],
        results: [
          "Live, accessible from any browser",
          "11 modules, 3 report-card templates (primary, secondary, training)",
          "100% of actions logged",
          "Set-up from 200,000 FCFA, including the school's website",
        ],
      },
    },
  },
  {
    slug: "zayra-agro",
    titles: { fr: "Zayra Agro", en: "Zayra Agro" },
    kind: "solution",
    logo: "/zayra/solutions/agro/logo.png",
    cover: "/zayra/solutions/agro/desktop.webp",
    gradient: "from-emerald-500 via-teal-500 to-sky",
    stack: [...ZAYRA_WEB, T("pgvector"), T("Flutter", "flutter"), T("Claude (IA)"), ...ZAYRA_OPS],
    links: zayraLinks("agro", "Le site : zayra.agro.horus-lab.com", "The site: zayra.agro.horus-lab.com"),
    content: {
      fr: {
        client: "Solution Zayra · agriculteurs et coopératives",
        sector: "Agriculture & AgriTech",
        tagline: "De la semence au marché, un conseiller dans la poche.",
        intro: "Zayra Agro accompagne l'agriculteur de la semence au marché : il apprend, produit mieux, protège sa récolte et trouve les bons interlocuteurs pour acheter et vendre. Revendeurs d'intrants, experts, stockeurs et acheteurs y travaillent sur la même information.",
        challenge: "Le conseil agricole arrive souvent trop tard, faute d'agents de terrain ; les intrants sont chers et parfois douteux ; sans stockage ni acheteur sûr, la récolte se brade.",
        approach: "Un conseiller IA qui s'appuie sur une base agronomique indexée et cite ses sources, des formations relues par des agronomes, un catalogue d'intrants homologués et la mise en relation avec des experts vérifiés quand l'IA ne suffit pas.",
        services: ZAYRA_SERVICES_FR.concat(["Conseiller IA avec recherche sémantique (pgvector)", "Application Android légère, leçons hors ligne"]),
        features: [
          { title: "Conseiller agricole IA", desc: "« Mes feuilles jaunissent » suffit : il comprend la culture, le problème, et cite la référence." },
          { title: "Formations validées", desc: "Leçons courtes et quiz relus par des agronomes, lisibles sans réseau." },
          { title: "Intrants homologués", desc: "Seuls des produits validés et disponibles près de chez soi sont proposés." },
          { title: "Experts et missions", desc: "Agronomes, vétérinaires, pédologues : la mission va à l'expert vérifié le plus proche." },
          { title: "Vendre en confiance", desc: "Prix repères datés et sourcés, acheteurs et stockeurs à contacter directement." },
          { title: "Aucun intermédiaire financier", desc: "L'agriculteur règle directement le vendeur ou l'expert." },
        ],
        results: [
          "En ligne : web et application Android",
          "Plus de 1 500 fiches agronomiques indexées",
          "10 régions du Cameroun couvertes",
          "Gratuit pour les agriculteurs pendant le lancement",
        ],
      },
      en: {
        client: "Zayra solution · farmers and cooperatives",
        sector: "Agriculture & AgriTech",
        tagline: "From seed to market, an adviser in your pocket.",
        intro: "Zayra Agro supports farmers from seed to market: they learn, produce better, protect their harvest and find the right people to buy from and sell to. Input dealers, experts, storage operators and buyers work on the same information.",
        challenge: "Farm advice often comes too late for lack of field agents; inputs are costly and sometimes dubious; without storage or a reliable buyer, harvests are sold off cheaply.",
        approach: "An AI adviser built on an indexed agronomy base that cites its sources, training reviewed by agronomists, a catalogue of approved inputs, and links to verified experts when AI is not enough.",
        services: ZAYRA_SERVICES_EN.concat(["AI adviser with semantic search (pgvector)", "Light Android app, offline lessons"]),
        features: [
          { title: "AI farm adviser", desc: "\"My leaves are turning yellow\" is enough: it understands the crop, the problem, and cites the reference." },
          { title: "Validated training", desc: "Short lessons and quizzes reviewed by agronomists, readable offline." },
          { title: "Approved inputs", desc: "Only validated products available close to home are suggested." },
          { title: "Experts and missions", desc: "Agronomists, vets, soil scientists: each mission goes to the nearest verified expert." },
          { title: "Selling with confidence", desc: "Dated, sourced reference prices; buyers and storage operators to contact directly." },
          { title: "No financial middleman", desc: "Farmers pay the seller or expert directly." },
        ],
        results: [
          "Live: web and Android app",
          "Over 1,500 indexed agronomy sheets",
          "10 regions of Cameroon covered",
          "Free for farmers during launch",
        ],
      },
    },
  },
  {
    slug: "zayra-nkap",
    titles: { fr: "Zayra Nkap", en: "Zayra Nkap" },
    kind: "solution",
    logo: "/zayra/solutions/nkap/logo.png",
    cover: "/zayra/solutions/nkap/desktop.webp",
    gradient: "from-slate-800 via-brand-700 to-brand-500",
    stack: [...ZAYRA_WEB, T("Flutter", "flutter"), T("Drift (hors ligne)"), T("ReportLab (PDF)"), ...ZAYRA_OPS],
    links: zayraLinks("nkap", "Le site : zayra.nkap.horus-lab.com", "The site: zayra.nkap.horus-lab.com"),
    content: {
      fr: {
        client: "Solution Zayra · tontines et associations",
        sector: "Fintech & Gestion",
        tagline: "Les cahiers de votre réunion, sans papier.",
        intro: "Zayra Nkap tient les comptes d'une réunion en temps réel : cotisations, tontines, épargne, pénalités et preuves de versement, même hors ligne sur le téléphone du trésorier. Pensé pour les réunions bamiléké et toutes les tontines du Cameroun.",
        challenge: "Les réunions tiennent leurs comptes dans des cahiers : calculs à la main, pénalités oubliées, litiges sur les soldes et sur les sorties d'argent, peu de transparence pour les membres.",
        approach: "Une application qui reprend ce que les statuts prévoient déjà (noms et demi-noms, enchères, avaliseurs, secours, cassation), avec une saisie en séance hors ligne, une double approbation des sorties et des états financiers en PDF.",
        services: ZAYRA_SERVICES_FR.concat(["Application Android hors ligne (Flutter, Drift)", "États financiers et cassation en PDF"]),
        features: [
          { title: "Saisie en séance", desc: "Le trésorier note chaque versement nom par nom, même sans réseau dans la salle." },
          { title: "Tontines multiples", desc: "Plusieurs tontines, noms et demi-noms, enchères plafonnées et tirage au sort journalisé." },
          { title: "Prêts et secours", desc: "Avaliseurs, échéanciers et barème du secours de la réunion." },
          { title: "Double contrôle", desc: "Chaque sortie d'argent est approuvée par deux membres du bureau." },
          { title: "États financiers PDF", desc: "Comptes rendus, situation des membres et cassation, prêts à partager sur WhatsApp." },
          { title: "L'argent reste à la réunion", desc: "Les cotisations ne transitent jamais par l'outil." },
        ],
        results: [
          "En ligne : web et application Android",
          "Jusqu'à 100 membres par réunion",
          "Essai gratuit de 30 jours, puis 5 000 XAF par mois ou 50 000 XAF par an",
          "Chaque réunion a son adresse et ses données, isolées des autres",
        ],
      },
      en: {
        client: "Zayra solution · tontines and associations",
        sector: "Fintech & Management",
        tagline: "Your meeting's ledgers, paper-free.",
        intro: "Zayra Nkap keeps a meeting's accounts in real time: contributions, tontines, savings, penalties and proof of payment, even offline on the treasurer's phone. Designed for Bamileke meetings and every tontine in Cameroon.",
        challenge: "Meetings keep their accounts in paper ledgers: manual sums, forgotten penalties, disputes over balances and withdrawals, little transparency for members.",
        approach: "An app that follows what the bylaws already provide (shares and half-shares, auctions, guarantors, relief, year-end split), with offline live entry, two-person approval of withdrawals and PDF financial statements.",
        services: ZAYRA_SERVICES_EN.concat(["Offline Android app (Flutter, Drift)", "PDF financial statements and year-end split"]),
        features: [
          { title: "Live session entry", desc: "The treasurer records each payment name by name, even with no network in the room." },
          { title: "Multiple tontines", desc: "Several tontines, shares and half-shares, capped auctions and logged random draws." },
          { title: "Loans and relief", desc: "Guarantors, schedules and the meeting's relief scale." },
          { title: "Two-person approval", desc: "Every withdrawal is approved by two board members." },
          { title: "PDF statements", desc: "Minutes, member positions and year-end split, ready to share on WhatsApp." },
          { title: "Money stays with the meeting", desc: "Contributions never pass through the tool." },
        ],
        results: [
          "Live: web and Android app",
          "Up to 100 members per meeting",
          "30-day free trial, then 5,000 XAF a month or 50,000 XAF a year",
          "Each meeting has its own address and isolated data",
        ],
      },
    },
  },

  /* ═══════════════════════════ Projets clients ═══════════════════════════ */
  {
    slug: "afrikamode",
    titles: { fr: "Afrikamode", en: "Afrikamode" },
    kind: "client",
    logo: "/logo/logo-Afrikamode.png",
    cover: "/afrikamode-realisations/01-site-accueil.png",
    gradient: "from-sky via-brand-500 to-brand-700",
    stack: CLIENT_WEB,
    links: {
      fr: [{ label: "La boutique : afrikamode.store", href: "https://afrikamode.store" }],
      en: [{ label: "The store: afrikamode.store", href: "https://afrikamode.store" }],
    },
    testimonial: {
      photo: "/Temoignages/Mme-pagop-Tchouansi-aurelie.png",
      name: "Pagop Tchouansi Aurélie",
      role: { fr: "Responsable · AfrikaMode", en: "Manager · AfrikaMode" },
      quote: {
        fr: "Notre boutique en ligne Afrikamode est fluide, rapide et fidèle à notre image. Horus-Lab a traduit notre univers mode en une vraie expérience e-commerce africaine.",
        en: "Our Afrikamode online store is smooth, fast and true to our image. Horus-Lab turned our fashion world into a genuine African e-commerce experience.",
      },
    },
    content: {
      fr: {
        client: "Afrikamode · Italie et Cameroun",
        sector: "Mode & e-commerce",
        tagline: "La boutique en ligne d'une marque de mode africaine, dans deux pays.",
        intro: "Afrikamode est une marque de mode africaine présente en Italie et au Cameroun : une ligne maison et des créateurs invités, une esthétique contemporaine. Nous avons conçu et développé sa boutique en ligne multilingue et le back-office qui la pilote.",
        challenge: "Vendre dans deux pays et plusieurs langues avec une image de marque exigeante, tout en gardant la main au quotidien sur le catalogue, le stock, la livraison et le marketing, sans dépendre d'un prestataire.",
        approach: "Une boutique rapide et éditoriale côté client, et un back-office complet côté marque : produits et variantes, marques, catégories, stock, tarifs de livraison, marketing et contenus multilingues, gérés en autonomie.",
        services: [
          "Conception UX/UI de la boutique",
          "Développement web (Next.js) et API",
          "Back-office d'administration sur mesure",
          "Catalogue et contenus multilingues",
          "Paiement sécurisé",
          "Mise en production",
        ],
        features: [
          { title: "Boutique multilingue", desc: "Catalogue, fiches produits, panier et paiement sécurisé, dans plusieurs langues." },
          { title: "Catalogue filtrable", desc: "Filtres par taille, marque, catégorie et prix." },
          { title: "Journal éditorial", desc: "Des contenus mode et lifestyle pour porter l'image de la marque." },
          { title: "Produits et variantes", desc: "Axes de variantes (tailles, couleurs), marques et catégories." },
          { title: "Stock et livraison", desc: "Suivi du stock et tarifs de livraison gérés depuis le back-office." },
          { title: "Marketing et CMS", desc: "Vue d'ensemble marketing et contenus multilingues pilotés par la marque." },
        ],
        results: [
          "En ligne en Italie et au Cameroun",
          "Une boutique et un back-office complets, gérés en autonomie par la marque",
        ],
      },
      en: {
        client: "Afrikamode · Italy and Cameroon",
        sector: "Fashion & e-commerce",
        tagline: "The online store of an African fashion brand, in two countries.",
        intro: "Afrikamode is an African fashion brand present in Italy and Cameroon: an in-house line and guest designers, a contemporary aesthetic. We designed and built its multilingual online store and the back-office that runs it.",
        challenge: "Selling in two countries and several languages with a demanding brand image, while keeping day-to-day control of catalogue, stock, shipping and marketing without depending on a provider.",
        approach: "A fast, editorial store for customers, and a full back-office for the brand: products and variants, brands, categories, stock, shipping rates, marketing and multilingual content, all self-managed.",
        services: [
          "Store UX/UI design",
          "Web development (Next.js) and API",
          "Custom administration back-office",
          "Multilingual catalogue and content",
          "Secure payment",
          "Go-live",
        ],
        features: [
          { title: "Multilingual store", desc: "Catalogue, product pages, cart and secure checkout, in several languages." },
          { title: "Filterable catalogue", desc: "Filters by size, brand, category and price." },
          { title: "Editorial journal", desc: "Fashion and lifestyle content to carry the brand image." },
          { title: "Products and variants", desc: "Variant options (sizes, colours), brands and categories." },
          { title: "Stock and shipping", desc: "Stock tracking and shipping rates managed from the back-office." },
          { title: "Marketing and CMS", desc: "Marketing overview and multilingual content run by the brand." },
        ],
        results: [
          "Live in Italy and Cameroon",
          "A complete store and back-office, self-managed by the brand",
        ],
      },
    },
  },
  {
    slug: "elec-one",
    titles: { fr: "Elec One", en: "Elec One" },
    kind: "client",
    logo: "/logo/logo-Elec_One.png",
    gradient: "from-brand-600 via-sky to-brand-400",
    stack: CLIENT_MOBILE,
    links: {
      fr: [{ label: "2MeTech Sarl : 2metechsarl.org", href: "https://www.2metechsarl.org" }],
      en: [{ label: "2MeTech Sarl: 2metechsarl.org", href: "https://www.2metechsarl.org" }],
    },
    testimonial: {
      photo: "/Temoignages/Dr-Agnes-Virgine-TJAHE.png",
      name: "Dr Agnès Virginie TJAHE",
      role: { fr: "Présidente Directrice · 2MeTech Sarl", en: "Chief Executive · 2MeTech Sarl" },
      quote: {
        fr: "Avec Elec One et EnMKit, Horus-Lab a transformé notre vision en une application mobile concrète : nos utilisateurs pilotent et réduisent leur consommation d'électricité à distance. Un travail remarquable.",
        en: "With Elec One and EnMKit, Horus-Lab turned our vision into a concrete mobile app: our users control and reduce their electricity consumption remotely. Remarkable work.",
      },
    },
    content: {
      fr: {
        client: "2MeTech Sarl · Énergie",
        sector: "Énergie & IoT",
        tagline: "Piloter et réduire sa consommation d'électricité depuis son téléphone.",
        intro: "Elec One est l'application mobile qui pilote EnMKit, le dispositif intelligent de maîtrise de l'énergie conçu par 2MeTech. Depuis son téléphone, l'utilisateur coupe à distance les équipements restés allumés.",
        challenge: "Fer à repasser, climatiseur, téléviseur oubliés : le gaspillage d'électricité pèse sur la facture, et le boîtier EnMKit avait besoin d'une interface simple pour être piloté au quotidien.",
        approach: "Une application mobile claire qui relie l'utilisateur à son boîtier EnMKit et lui permet de suivre et de couper ses équipements à distance, en temps réel.",
        services: [
          "Conception UX/UI mobile",
          "Développement de l'application (Flutter)",
          "Intégration avec le boîtier EnMKit",
          "Mise en production",
        ],
        features: [
          { title: "Pilotage à distance", desc: "Couper depuis le téléphone les équipements restés allumés." },
          { title: "Temps réel", desc: "L'état des équipements suivi en direct." },
          { title: "Maîtrise de la facture", desc: "Supprimer les gaspillages pour réduire durablement la consommation." },
          { title: "Pensé pour le quotidien", desc: "Une interface simple, utilisable par tous les membres du foyer." },
        ],
        results: [
          "En production",
          "Consommation d'électricité pilotée et réduite à distance",
        ],
      },
      en: {
        client: "2MeTech Sarl · Energy",
        sector: "Energy & IoT",
        tagline: "Control and reduce your electricity use from your phone.",
        intro: "Elec One is the mobile app that drives EnMKit, the smart energy-control device designed by 2MeTech. From their phone, users remotely switch off equipment left running.",
        challenge: "An iron, an air-conditioner, a TV left on: wasted electricity weighs on the bill, and the EnMKit box needed a simple interface to be used every day.",
        approach: "A clear mobile app that connects users to their EnMKit box and lets them follow and switch off their equipment remotely, in real time.",
        services: [
          "Mobile UX/UI design",
          "App development (Flutter)",
          "Integration with the EnMKit box",
          "Go-live",
        ],
        features: [
          { title: "Remote control", desc: "Switch off equipment left running, from your phone." },
          { title: "Real time", desc: "Equipment status followed live." },
          { title: "Lower bills", desc: "Cut waste to durably reduce consumption." },
          { title: "Built for daily use", desc: "A simple interface every member of the household can use." },
        ],
        results: [
          "In production",
          "Electricity consumption controlled and reduced remotely",
        ],
      },
    },
  },
  {
    slug: "gathe-finance",
    titles: { fr: "Gathe Finance", en: "Gathe Finance" },
    kind: "client",
    logo: "/logo/logo-GATHE_FINANCE.png",
    gradient: "from-slate-800 via-brand-700 to-brand-500",
    stack: CLIENT_WEB,
    links: { fr: [], en: [] },
    content: {
      fr: {
        client: "PME et indépendants africains",
        sector: "Fintech & Gestion",
        tagline: "La trésorerie des PME et des indépendants, sous contrôle.",
        intro: "Gathe Finance est une plateforme de gestion financière pensée pour les indépendants et les PME africaines : suivi de tous les comptes, catégorisation des opérations, budgets et tableaux de bord.",
        challenge: "L'argent d'une petite entreprise africaine circule entre espèces, Mobile Money et banque : sans outil adapté, la trésorerie et la rentabilité restent floues.",
        approach: "Une plateforme qui réunit tous les comptes au même endroit, catégorise automatiquement les opérations et restitue la trésorerie et le compte de résultat dans des tableaux de bord lisibles.",
        services: [
          "Conception UX/UI",
          "Développement web et API",
          "Tableaux de bord et reporting",
          "Mise en production",
        ],
        features: [
          { title: "Multi-comptes", desc: "Espèces, Mobile Money et banque suivis au même endroit." },
          { title: "Catégorisation automatique", desc: "Les opérations sont classées sans saisie fastidieuse." },
          { title: "Budgets et objectifs", desc: "Fixer des limites et suivre ses objectifs financiers." },
          { title: "Reporting", desc: "Tableaux de bord de trésorerie et compte de résultat (P&L)." },
        ],
        results: [
          "Une vue claire de la trésorerie, tous comptes confondus",
        ],
      },
      en: {
        client: "African SMEs and freelancers",
        sector: "Fintech & Management",
        tagline: "Cash flow under control for SMEs and freelancers.",
        intro: "Gathe Finance is a financial management platform for African freelancers and SMEs: tracking of every account, categorised transactions, budgets and dashboards.",
        challenge: "A small African business's money moves between cash, Mobile Money and bank: without a suitable tool, cash flow and profitability stay unclear.",
        approach: "A platform that brings every account together, auto-categorises transactions and presents cash flow and P&L in readable dashboards.",
        services: [
          "UX/UI design",
          "Web development and API",
          "Dashboards and reporting",
          "Go-live",
        ],
        features: [
          { title: "Multi-account", desc: "Cash, Mobile Money and bank tracked in one place." },
          { title: "Auto-categorisation", desc: "Transactions classified without tedious data entry." },
          { title: "Budgets and goals", desc: "Set limits and track financial goals." },
          { title: "Reporting", desc: "Cash-flow and P&L dashboards." },
        ],
        results: [
          "A clear view of cash flow across every account",
        ],
      },
    },
  },
  {
    slug: "elearning",
    titles: { fr: "Plateforme e-Learning", en: "e-Learning platform" },
    kind: "client",
    logo: "/logo/logo-Edlearning.png",
    gradient: "from-emerald-500 via-teal-500 to-sky",
    stack: CLIENT_MOBILE,
    links: {
      fr: [{ label: "Edlearning sur Google Play", href: "https://play.google.com/store/search?q=Edlearning&c=apps" }],
      en: [{ label: "Edlearning on Google Play", href: "https://play.google.com/store/search?q=Edlearning&c=apps" }],
    },
    content: {
      fr: {
        client: "Apprenants et professionnels IT",
        sector: "Éducation & EdTech",
        tagline: "Rendre les métiers de l'informatique accessibles, partout en Afrique.",
        intro: "Edlearning est une plateforme de formation aux métiers de l'informatique : développement web, Python, cybersécurité et plus, avec des parcours structurés et le suivi des apprenants.",
        challenge: "Se former sérieusement à l'informatique reste difficile sans parcours clair ni ressources adaptées, surtout loin des grands centres de formation.",
        approach: "Des parcours progressifs, des ressources organisées et un suivi de l'apprenant, dans une application mobile accessible partout.",
        services: [
          "Conception UX/UI",
          "Développement de l'application (Flutter)",
          "Parcours et suivi des apprenants",
          "Mise en production",
        ],
        features: [
          { title: "Catalogue IT", desc: "Développement web, Python, cybersécurité et plus." },
          { title: "Parcours structurés", desc: "Des étapes claires, du niveau débutant aux compétences avancées." },
          { title: "Ressources progressives", desc: "Des contenus organisés pour avancer à son rythme." },
          { title: "Suivi des apprenants", desc: "La progression de chacun, visible à tout moment." },
        ],
        results: [
          "Un catalogue complet de formations tech",
        ],
      },
      en: {
        client: "IT learners and professionals",
        sector: "Education & EdTech",
        tagline: "Making IT careers accessible everywhere in Africa.",
        intro: "Edlearning is a training platform for IT careers: web development, Python, cybersecurity and more, with structured tracks and learner follow-up.",
        challenge: "Training seriously in IT is hard without a clear path or suitable resources, especially far from the big training centres.",
        approach: "Progressive tracks, organised resources and learner follow-up, in a mobile app accessible anywhere.",
        services: [
          "UX/UI design",
          "App development (Flutter)",
          "Learning tracks and learner follow-up",
          "Go-live",
        ],
        features: [
          { title: "IT catalogue", desc: "Web development, Python, cybersecurity and more." },
          { title: "Structured tracks", desc: "Clear steps from beginner to advanced skills." },
          { title: "Progressive resources", desc: "Organised content to learn at your own pace." },
          { title: "Learner follow-up", desc: "Each learner's progress, visible at any time." },
        ],
        results: [
          "A complete catalogue of tech training",
        ],
      },
    },
  },
];

export const CASE_SLUGS = CASE_STUDIES.map((c) => c.slug);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** Étude de cas d'un projet à partir de son titre affiché (FR ou EN). */
export function caseSlugForTitle(title: string): string | undefined {
  return CASE_STUDIES.find((c) => c.titles.fr === title || c.titles.en === title)?.slug;
}
