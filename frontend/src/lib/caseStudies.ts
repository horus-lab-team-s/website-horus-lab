import type { Lang } from "@/i18n/dictionaries";

/**
 * Études de cas : la page de présentation complète de chaque réalisation
 * (/[lang]/portfolio/[slug]) et le dossier PDF des réalisations.
 *
 * Contenu factuel uniquement : stacks relevées dans les dépôts des projets,
 * fonctionnalités visibles en production, témoignages publiés sur le site.
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

const ALL_CASE_STUDIES: CaseStudy[] = [
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
    slug: "caseformation",
    titles: { fr: "Case Formations", en: "Case Formations" },
    kind: "client",
    logo: "/logo/logo-caseformations.png",
    cover: "/realisations/caseformation/desktop.webp",
    gradient: "from-brand-700 via-brand-500 to-amber-400",
    stack: [T("Next.js", "nextjs"), T("TypeScript", "typescript"), T("Tailwind CSS", "tailwindcss"), T("Django", "django"), T("PostgreSQL", "postgresql"), T("Flutter", "flutter"), T("Docker", "docker"), T("nginx", "nginx")],
    links: {
      fr: [{ label: "Le site : caseformations.com", href: "https://caseformations.com" }],
      en: [{ label: "Website: caseformations.com", href: "https://caseformations.com" }],
    },
    content: {
      fr: {
        client: "Centre d'accompagnement pédagogique · Cameroun",
        sector: "Éducation & EdTech",
        tagline: "Un centre de formation entièrement digitalisé, de l'inscription au suivi.",
        intro: "Case Formations prépare au TCF et à l'examen civique, à l'allemand (Goethe-Zertifikat, A1 à C2) et propose des cours de répétition, à domicile ou en ligne. Nous avons livré toute sa plateforme : le site, le back-office et l'application de pilotage.",
        challenge: "Inscriptions, paiements, plannings des enseignants, devoirs et échéances se géraient à la main. Le centre voulait vendre ses formations en ligne et piloter son activité sans multiplier les outils.",
        approach: "Un site bilingue qui présente l'offre et encaisse les inscriptions par Mobile Money, un back-office qui organise toute la vie du centre, et une application Android qui donne à la direction une vue d'ensemble en temps réel.",
        services: [
          "Site vitrine bilingue avec catalogue, panier et paiement",
          "Back-office de gestion du centre",
          "Application Android de pilotage pour la direction",
          "API et base de données",
          "Hébergement, nom de domaine et mise en production",
        ],
        features: [
          { title: "Inscription et paiement en ligne", desc: "Catalogue, panier et paiement par Mobile Money." },
          { title: "Espace apprenant", desc: "Chaque élève retrouve ses formations et ses séances." },
          { title: "Agenda et séances", desc: "Cours en présentiel ou en ligne, planifiés par les enseignants." },
          { title: "Devoirs et suivi", desc: "L'enseignant suit ses élèves et reçoit leurs devoirs." },
          { title: "Échéances et paiements", desc: "Le back-office suit ce que chacun a réglé et ce qui reste dû." },
          { title: "Pilotage mobile", desc: "Agenda, finances et intervenants dans la poche de la direction." },
          { title: "Contenus en autonomie", desc: "Pages, articles et ressources (TCF, Goethe) gérés sans développeur." },
          { title: "Rôles et journal d'audit", desc: "Chacun n'accède qu'à ce qui le concerne, tout est tracé." },
        ],
        results: [
          "En ligne sur caseformations.com",
          "Inscriptions et paiements en ligne, sans déplacement",
          "Un seul outil pour toute la gestion du centre",
        ],
      },
      en: {
        client: "Tutoring and exam-prep centre · Cameroon",
        sector: "Education & EdTech",
        tagline: "A fully digital training centre, from sign-up to follow-up.",
        intro: "Case Formations prepares learners for the TCF and the civic exam, for German (Goethe-Zertifikat, A1 to C2) and offers tutoring, at home or online. We delivered its whole platform: the website, the back-office and the management app.",
        challenge: "Sign-ups, payments, teacher schedules, homework and instalments were handled by hand. The centre wanted to sell its courses online and run its business without juggling tools.",
        approach: "A bilingual website that presents the offer and takes sign-ups by Mobile Money, a back-office that organises the centre's whole activity, and an Android app that gives the directors a real-time overview.",
        services: [
          "Bilingual website with catalogue, cart and payment",
          "Centre management back-office",
          "Android management app for the directors",
          "API and database",
          "Hosting, domain and go-live",
        ],
        features: [
          { title: "Online sign-up and payment", desc: "Catalogue, cart and Mobile Money payment." },
          { title: "Learner area", desc: "Each learner finds their courses and sessions." },
          { title: "Schedule and sessions", desc: "In-person or online classes, planned by teachers." },
          { title: "Homework and follow-up", desc: "Teachers follow their learners and receive their homework." },
          { title: "Instalments and payments", desc: "The back-office tracks what has been paid and what is due." },
          { title: "Mobile management", desc: "Schedule, finances and staff in the directors' pocket." },
          { title: "Self-managed content", desc: "Pages, articles and resources (TCF, Goethe) without a developer." },
          { title: "Roles and audit log", desc: "Everyone only sees what concerns them; everything is logged." },
        ],
        results: [
          "Live at caseformations.com",
          "Sign-ups and payments online, no travel needed",
          "One tool for the centre's whole management",
        ],
      },
    },
  },
  {
    slug: "enmkit",
    titles: { fr: "EnMKit", en: "EnMKit" },
    kind: "client",
    logo: "/logo/logo-enmkit.png",
    cover: "/realisations/enmkit/desktop.webp",
    gradient: "from-brand-600 via-sky to-brand-400",
    stack: [T("Flutter", "flutter"), T("Dart", "dart"), T("Kotlin"), T("Python", "python"), T("FastAPI", "fastapi"), T("Next.js", "nextjs"), T("React", "react"), T("Docker", "docker")],
    links: {
      fr: [{ label: "2ME Technologies : 2metechsarl.org", href: "https://www.2metechsarl.org" }],
      en: [{ label: "2ME Technologies: 2metechsarl.org", href: "https://www.2metechsarl.org" }],
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
        client: "2ME Technologies SARL · Énergie",
        sector: "Énergie & Industrie",
        tagline: "Piloter l'électricité de tout un parc de logements, même sans Internet.",
        intro: "EnMKit est la solution de maîtrise de l'énergie de 2ME Technologies : des kits électriques équipés d'un module GSM, pilotés par SMS depuis une application mobile, et une plateforme web qui centralise les relevés. Nous avons conçu l'ensemble du logiciel.",
        challenge: "Couper à distance un équipement oublié et suivre sa consommation suppose souvent une connexion Internet permanente, que beaucoup de foyers n'ont pas. Il fallait une solution fiable avec une couverture réseau variable.",
        approach: "Le SMS comme canal de commande, pour sa robustesse : l'application envoie les ordres, le kit les confirme par accusé de réception. Un téléphone passerelle relaie les relevés vers l'API, sans qu'aucun SMS ne se perde, et le tableau de bord les met en forme.",
        services: [
          "Application mobile client (Flutter)",
          "Application « banc d'essais » pour la formation (7 TP)",
          "Passerelle SMS Android vers l'API",
          "API et tableau de bord web",
          "Protocole de commande et d'accusés de réception",
        ],
        features: [
          { title: "Commande par SMS", desc: "Allumer et couper chaque ligne, sans Internet." },
          { title: "Tout un parc de logements", desc: "Un seul téléphone pilote plusieurs kits." },
          { title: "Relevés de consommation", desc: "La consommation en kWh, avec son historique." },
          { title: "Accusés de réception", desc: "Chaque ordre est confirmé par le kit." },
          { title: "Partage par QR Code", desc: "La configuration d'un kit se transmet en un scan." },
          { title: "Sécurité", desc: "Code PIN et numéros autorisés uniquement." },
          { title: "Assistant IA", desc: "Analyse et conseils sur la consommation, côté plateforme." },
          { title: "Bilingue", desc: "Français et anglais." },
        ],
        results: [
          "En production chez 2ME Technologies",
          "Pilotage à distance, même sans connexion Internet",
          "Un banc pédagogique pour former à la maîtrise de l'énergie",
        ],
      },
      en: {
        client: "2ME Technologies SARL · Energy",
        sector: "Energy & Industry",
        tagline: "Control the electricity of a whole housing stock, even without Internet.",
        intro: "EnMKit is 2ME Technologies' energy-control solution: electrical kits fitted with a GSM module, driven by SMS from a mobile app, and a web platform that centralises the readings. We designed the whole software stack.",
        challenge: "Switching off a forgotten appliance remotely and tracking consumption usually needs a permanent Internet connection, which many households lack. The solution had to be reliable on a patchy network.",
        approach: "SMS as the command channel, for its robustness: the app sends orders and the kit confirms them with an acknowledgement. A gateway phone relays readings to the API without losing a single SMS, and the dashboard presents them.",
        services: [
          "Client mobile app (Flutter)",
          "Test-bench app for training (7 lab sessions)",
          "Android SMS gateway to the API",
          "API and web dashboard",
          "Command and acknowledgement protocol",
        ],
        features: [
          { title: "SMS control", desc: "Switch each line on and off, without Internet." },
          { title: "A whole housing stock", desc: "One phone drives several kits." },
          { title: "Consumption readings", desc: "Consumption in kWh, with its history." },
          { title: "Acknowledgements", desc: "The kit confirms every order." },
          { title: "QR Code sharing", desc: "A kit's configuration is shared with one scan." },
          { title: "Security", desc: "PIN code and authorised numbers only." },
          { title: "AI assistant", desc: "Consumption analysis and advice on the platform." },
          { title: "Bilingual", desc: "French and English." },
        ],
        results: [
          "In production at 2ME Technologies",
          "Remote control, even without an Internet connection",
          "An educational bench to teach energy management",
        ],
      },
    },
  },
  {
    slug: "gathe-finance",
    titles: { fr: "Gathe Finance", en: "Gathe Finance" },
    kind: "client",
    logo: "/logo/logo-GATHE_FINANCE.png",
    cover: "/realisations/gathe/desktop.webp",
    gradient: "from-slate-800 via-brand-700 to-brand-500",
    stack: [T("Next.js", "nextjs"), T("TypeScript", "typescript"), T("Tailwind CSS", "tailwindcss"), T("Django", "django"), T("Wagtail"), T("PostgreSQL", "postgresql"), T("Flutter", "flutter"), T("Docker", "docker")],
    links: {
      fr: [{ label: "Le site : gathe-finance.com", href: "https://gathe-finance.com" }],
      en: [{ label: "Website: gathe-finance.com", href: "https://gathe-finance.com" }],
    },
    content: {
      fr: {
        client: "Coopérative GATHE Finance · Broad Range Consulting Group",
        sector: "Fintech & Gestion",
        tagline: "Une coopérative d'épargne et de crédit, dans la poche de ses membres.",
        intro: "GATHE Finance est une coopérative d'épargne et de crédit de Douala, initiative de Broad Range Consulting Group. Nous avons remplacé son ancien site et livré toute sa plateforme : site public, portail des membres, back-office et application mobile.",
        challenge: "Les membres devaient se déplacer pour connaître leur solde, déposer, suivre leurs collectes ou demander un crédit, et l'ancien site ne permettait aucune opération.",
        approach: "Un parcours membre complet sur le web et sur mobile : épargne, collectes journalières, demande de crédit et remboursements, avec un back-office pour les équipes et un site public géré en autonomie.",
        services: [
          "Site public bilingue (FR / EN) géré par CMS",
          "Portail des membres et back-office",
          "Application mobile (Flutter)",
          "API et base de données",
          "Hébergement et mise en production",
        ],
        features: [
          { title: "Épargne", desc: "Solde en direct, dépôts et retraits sur l'épargne libre." },
          { title: "Collectes journalières", desc: "Un carnet de collecte avec son propre solde." },
          { title: "Crédit", desc: "Demande dans l'application et suivi de l'étude par le comité." },
          { title: "Remboursements", desc: "Rembourser librement, en une ou plusieurs fois." },
          { title: "Reçus et notifications", desc: "Chaque opération est confirmée et retrouvable." },
          { title: "Annonces et campagnes", desc: "La coopérative informe ses membres directement." },
        ],
        results: [
          "En production chez la coopérative",
          "Les opérations courantes accessibles depuis le téléphone",
          "Un site public que l'équipe met à jour seule",
        ],
      },
      en: {
        client: "GATHE Finance cooperative · Broad Range Consulting Group",
        sector: "Fintech & Management",
        tagline: "A savings and credit cooperative, in its members' pockets.",
        intro: "GATHE Finance is a savings and credit cooperative in Douala, an initiative of Broad Range Consulting Group. We replaced its old website and delivered its whole platform: public website, member portal, back-office and mobile app.",
        challenge: "Members had to travel to check their balance, deposit, follow their collections or apply for credit, and the old website allowed no transactions.",
        approach: "A complete member journey on web and mobile: savings, daily collections, credit applications and repayments, with a back-office for staff and a self-managed public website.",
        services: [
          "Bilingual (FR / EN) CMS-managed public website",
          "Member portal and back-office",
          "Mobile app (Flutter)",
          "API and database",
          "Hosting and go-live",
        ],
        features: [
          { title: "Savings", desc: "Live balance, deposits and withdrawals from free savings." },
          { title: "Daily collections", desc: "A collection booklet with its own balance." },
          { title: "Credit", desc: "Apply in the app and follow the committee's review." },
          { title: "Repayments", desc: "Repay freely, in one or several payments." },
          { title: "Receipts and notifications", desc: "Every transaction is confirmed and kept." },
          { title: "News and campaigns", desc: "The cooperative informs its members directly." },
        ],
        results: [
          "In production at the cooperative",
          "Everyday transactions available from the phone",
          "A public website the team updates on its own",
        ],
      },
    },
  },
  {
    slug: "cga-brcg",
    titles: { fr: "CGA BRCG", en: "CGA BRCG" },
    kind: "client",
    logo: "/logo/logo-cga-brcg.png",
    cover: "/realisations/cga/desktop.webp",
    gradient: "from-[#3b1f5c] via-[#6b2d8f] to-brand-500",
    stack: [T("FastAPI", "fastapi"), T("Python", "python"), T("Next.js", "nextjs"), T("React", "react"), T("Tailwind CSS", "tailwindcss"), T("PostgreSQL", "postgresql"), T("Flutter", "flutter"), T("Docker", "docker")],
    links: {
      fr: [{ label: "Le site : cga-brcg.horus-lab.com", href: "https://cga-brcg.horus-lab.com" }],
      en: [{ label: "Website: cga-brcg.horus-lab.com", href: "https://cga-brcg.horus-lab.com" }],
    },
    testimonial: {
      photo: "/Temoignages/Mme-paul-diane-himsta.png",
      name: "Paule Diane Himsta",
      role: { fr: "Présidente-Directrice Générale · CGA Broad Range Consulting", en: "Managing Director · CGA Broad Range Consulting" },
      quote: {
        fr: "Nos outils de gestion sont enfin à la hauteur de nos ambitions. Une équipe sérieuse, disponible, et un accompagnement impeccable à chaque étape.",
        en: "Our management tools finally match our ambitions. A dedicated, responsive team, with flawless support at every step.",
      },
    },
    content: {
      fr: {
        client: "Centre de Gestion Agréé Broad Range Consulting Group · Douala, Yaoundé, Bafoussam",
        sector: "Comptabilité & Fiscalité",
        tagline: "Le contrôle fiscal en amont : une anomalie repérée à temps n'est pas une perte.",
        intro: "Le CGA Broad Range Consulting Group, agréé par le ministère des Finances, tient la comptabilité et la fiscalité de ses adhérents. Nous avons conçu sa plateforme : site public, console du cabinet, espace adhérent et application mobile.",
        challenge: "Une facture non conforme repérée à sa réception peut encore être régularisée auprès du fournisseur ; découverte trois mois plus tard, elle devient une perte fiscale. Le cabinet voulait déplacer ce contrôle en amont.",
        approach: "Chaque pièce est vérifiée dès son arrivée et la conséquence d'une anomalie est chiffrée (par exemple la TVA non déductible), puis reportée dans les déclarations. Les adhérents transmettent leurs justificatifs depuis leur téléphone, même hors ligne.",
        services: [
          "Site public avec estimation et souscription en ligne",
          "Console du cabinet et espace adhérent",
          "Application mobile hors ligne pour les justificatifs",
          "API métier (13 domaines fonctionnels)",
          "Courriels, paiement mobile et déploiement",
        ],
        features: [
          { title: "Conformité des pièces", desc: "Chaque justificatif est contrôlé dès sa réception." },
          { title: "Impact chiffré", desc: "La conséquence fiscale d'une anomalie est calculée en FCFA." },
          { title: "Comptabilité SYSCOHADA", desc: "Écritures, balance et grand livre." },
          { title: "Échéancier fiscal", desc: "Obligations, relances, pénalités et déclaration de TVA." },
          { title: "Portefeuille adhérents", desc: "Statuts, exercices et seuils de chaque entreprise." },
          { title: "Collecte de pièces", desc: "Doublons et complétude vérifiés automatiquement." },
          { title: "Application de terrain", desc: "Photographier un justificatif ; il part au retour du réseau." },
          { title: "Souscription en ligne", desc: "Barème, devis, paiement mobile et ouverture d'accès." },
        ],
        results: [
          "En cours de déploiement chez le cabinet",
          "Un parcours complet, de la souscription à la déclaration",
          "Plus de 1 000 tests automatisés sur le cœur métier",
        ],
      },
      en: {
        client: "Broad Range Consulting Group approved management centre · Douala, Yaoundé, Bafoussam",
        sector: "Accounting & Tax",
        tagline: "Tax control upstream: an anomaly caught in time is not a loss.",
        intro: "The Broad Range Consulting Group approved management centre (CGA), licensed by the Ministry of Finance, keeps its members' books and handles their tax. We designed its platform: public website, firm console, member area and mobile app.",
        challenge: "A non-compliant invoice caught on arrival can still be fixed with the supplier; found three months later, it becomes a tax loss. The firm wanted to move that control upstream.",
        approach: "Every document is checked on arrival and the cost of an anomaly is quantified (for example non-deductible VAT), then carried into the returns. Members send their receipts from their phone, even offline.",
        services: [
          "Public website with online estimates and sign-up",
          "Firm console and member area",
          "Offline mobile app for receipts",
          "Business API (13 functional domains)",
          "Emails, mobile payment and deployment",
        ],
        features: [
          { title: "Document compliance", desc: "Every receipt is checked as soon as it arrives." },
          { title: "Quantified impact", desc: "The tax cost of an anomaly is calculated in FCFA." },
          { title: "SYSCOHADA accounting", desc: "Entries, trial balance and general ledger." },
          { title: "Tax calendar", desc: "Obligations, reminders, penalties and VAT returns." },
          { title: "Member portfolio", desc: "Status, financial years and thresholds for each company." },
          { title: "Document collection", desc: "Duplicates and completeness checked automatically." },
          { title: "Field app", desc: "Photograph a receipt; it is sent when the network returns." },
          { title: "Online sign-up", desc: "Pricing, quote, mobile payment and account opening." },
        ],
        results: [
          "Being rolled out at the firm",
          "A complete journey, from sign-up to tax return",
          "Over 1,000 automated tests on the core business",
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
    testimonial: {
      photo: "/Temoignages/Mme-paul-diane-himsta.png",
      name: "Paule Diane Himsta",
      role: { fr: "Présidente-Directrice Générale · Broad Range Consulting (CFP-BRC)", en: "Managing Director · Broad Range Consulting (CFP-BRC)" },
      quote: {
        fr: "Horus-Lab a digitalisé notre centre de formation avec un vrai sens du détail. Une plateforme claire, fiable et pensée pour nos apprenants, du début à la fin.",
        en: "Horus-Lab digitalised our training centre with a real eye for detail. A clear, reliable platform built for our learners, from start to finish.",
      },
    },
    links: {
      fr: [{ label: "Edlearning sur Google Play", href: "https://play.google.com/store/search?q=Edlearning&c=apps" }],
      en: [{ label: "Edlearning on Google Play", href: "https://play.google.com/store/search?q=Edlearning&c=apps" }],
    },
    content: {
      fr: {
        client: "CFP Broad Range Consulting · apprenants IT",
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
        client: "CFP Broad Range Consulting · IT learners",
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

/** Ordre de mise en avant (identique à FEATURED_ORDER dans projects.ts). */
const CASE_ORDER = ["caseformation", "enmkit", "zayra-drive", "zayra-school", "zayra-agro", "zayra-nkap", "afrikamode", "gathe-finance", "cga-brcg", "elearning"];

export const CASE_STUDIES: CaseStudy[] = ALL_CASE_STUDIES.slice().sort(
  (a, b) => CASE_ORDER.indexOf(a.slug) - CASE_ORDER.indexOf(b.slug),
);

export const CASE_SLUGS = CASE_STUDIES.map((c) => c.slug);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** Étude de cas d'un projet à partir de son titre affiché (FR ou EN). */
export function caseSlugForTitle(title: string): string | undefined {
  return CASE_STUDIES.find((c) => c.titles.fr === title || c.titles.en === title)?.slug;
}
