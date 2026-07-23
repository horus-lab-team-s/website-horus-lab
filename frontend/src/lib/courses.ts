import type { Lang } from "@/i18n/dictionaries";

/* ────────────────────────────────────────────────────────────────
   Catalogue de formations Horus-Lab (concepts, cours & vidéos).
   Aligné sur le programme réel (bootcamp « Devenez développeur web ») :
   Développement Web, Développement Mobile, Génie logiciel (analyse &
   conception) et IA & Productivité (Claude & Claude Code).
   Chaque cours pointe vers une VRAIE vidéo gratuite (YouTube) pour débuter.
   Modèle statique côté frontend = repli si le CMS Django est indisponible.
   Bilingue FR/EN.
   ──────────────────────────────────────────────────────────────── */

export type CourseCategory = {
  slug: string;
  name: string;
  tagline: string;
  iconKey: "code" | "layers" | "spark" | "eye" | "cog";
};

export type CourseModule = { title: string; lessons: string[] };

export type Course = {
  slug: string;
  category: string; // slug de catégorie
  title: string;
  subtitle: string;
  level: string; // Débutant · Intermédiaire · Avancé
  durationHours: number;
  lessonsCount: number;
  price: string; // "Gratuit" | "Premium"
  free: boolean;
  tags: string[];
  image: string;
  /** Vraie vidéo de cours (YouTube) — lecteur intégré sur la page du cours. */
  videoUrl?: string;
  instructor: { name: string; role: string };
  intro: string;
  learn: string[];
  curriculum: CourseModule[];
};

type Catalog = { categories: CourseCategory[]; courses: Course[] };

const TEAM = {
  loic: { name: "Loïc DJIMGOU TONBA", roleFr: "Mentor du parcours", roleEn: "Course mentor" },
  edwin: { name: "Edwin TCHAMBA", roleFr: "Mentor du parcours", roleEn: "Course mentor" },
  team: { name: "Équipe Horus-Lab", roleFr: "Mentors Horus-Lab", roleEn: "Horus-Lab mentors" },
};

const IMG = {
  react: "/img/photo-1607706189992-eae578626c86-w700.jpg",
  js: "/img/photo-1461749280684-dccba630e2f6-w700.jpg",
  next: "/img/photo-1454165804606-c3d57bc86b40-w700.jpg",
  fastapi: "/img/photo-1516321318423-f06f85e504b3-w1200.jpg",
  flutter: "/img/photo-1512941937669-90a1b58e7e9c-w700.jpg",
  rn: "/img/photo-1558494949-ef010cbdcc31-w700.jpg",
  uml: "/img/photo-1522202176988-66273c2fd55f-w1200.jpg",
  archi: "/img/photo-1531482615713-2afd69097998-w700.jpg",
  ia: "/img/photo-1518770660439-4636190af475-w700.jpg",
};

/** Vraies vidéos gratuites (YouTube) — vérifiées via oEmbed.
   Une vidéo par langue : FR = chaînes francophones, EN = chaînes anglophones. */
const VIDEO_FR = {
  react: "https://www.youtube.com/watch?v=NT0s0aOHu0Q",       // Grafikart.fr
  js: "https://www.youtube.com/watch?v=ldxt9FNUc50",          // Comment Coder
  next: "https://www.youtube.com/watch?v=wTFThzLcrOk",        // Grafikart.fr
  fastapi: "https://www.youtube.com/watch?v=7D_0JTeaKWg",     // YoungDevps
  flutter: "https://www.youtube.com/watch?v=IK_oPkmQFSw",     // Ralph Développeur
  rn: "https://www.youtube.com/watch?v=Y7rbJRjaYCY",          // Grafikart.fr
  uml: "https://www.youtube.com/watch?v=CxqbwWKi6jg",         // Julien Code
  archi: "https://www.youtube.com/watch?v=RTRMXxBn0A0",       // HectorCure (Merise)
  claude: "https://www.youtube.com/watch?v=5T0irFpaa1U",      // Ludo Salenne (IA / prompt)
  htmlcss: "https://www.youtube.com/watch?v=oEAuNzWXRjM",     // Grafikart (HTML/CSS)
  python: "https://www.youtube.com/watch?v=oUJolR5bX6g",      // CodeAvecJonathan
  dartlang: "https://www.youtube.com/watch?v=cyXWqriiMbY",    // Alex Mercier (Dart)
};
const VIDEO_EN = {
  react: "https://www.youtube.com/watch?v=4UZrsTqkcW4",       // freeCodeCamp
  js: "https://www.youtube.com/watch?v=PkZNo7MFNFg",          // freeCodeCamp
  next: "https://www.youtube.com/watch?v=1WmNXEVia8I",        // freeCodeCamp
  fastapi: "https://www.youtube.com/watch?v=Yw4LmMQXXFs",     // freeCodeCamp / Sanjeev T.
  flutter: "https://www.youtube.com/watch?v=VPvVD8t02U8",     // freeCodeCamp
  rn: "https://www.youtube.com/watch?v=sm5Y7Vtuihg",          // freeCodeCamp
  uml: "https://www.youtube.com/watch?v=CxqbwWKi6jg",         // Julien Code (FR — pas d'équivalent EN retenu)
  archi: "https://www.youtube.com/watch?v=ztHopE5Wnpc",       // freeCodeCamp (Database Design)
  claude: "https://www.youtube.com/watch?v=IlqJqcl8ONE",      // chaîne officielle Claude
  htmlcss: "https://www.youtube.com/watch?v=a_iQb1lnAEQ",     // freeCodeCamp (HTML/CSS)
  python: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",      // Programming with Mosh
  dartlang: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q",    // freeCodeCamp (Dart)
};

const CATALOG: Record<Lang, Catalog> = {
  fr: {
    categories: [
      { slug: "web",            name: "Développement Web",     tagline: "Du frontend au backend, notre stack",   iconKey: "code" },
      { slug: "mobile",         name: "Développement Mobile",  tagline: "Apps iOS & Android",                    iconKey: "layers" },
      { slug: "genie-logiciel", name: "Génie logiciel",        tagline: "Analyser & concevoir avant de coder",   iconKey: "cog" },
      { slug: "ia",             name: "IA & Productivité",     tagline: "Coder avec Claude & Claude Code",       iconKey: "spark" },
    ],
    courses: [
      {
        slug: "html-css-fondations", category: "web",
        title: "HTML5 & CSS3 — les fondations du web", subtitle: "Structurer et styliser vos premières pages",
        level: "Débutant", durationHours: 10, lessonsCount: 28, price: "Gratuit", free: true,
        tags: ["HTML5", "CSS3", "Web", "Responsive"], image: IMG.js, videoUrl: VIDEO_FR.htmlcss,
        instructor: { name: TEAM.team.name, role: TEAM.team.roleFr },
        intro: "Le point de départ de tout développeur web : structurer une page avec HTML5 et la mettre en forme avec CSS3. Des fondations solides avant d'aborder React ou tout framework.",
        learn: [
          "Structurer une page avec les balises HTML5",
          "Mettre en forme avec CSS3 (couleurs, typographie, box model)",
          "Créer des mises en page avec Flexbox et Grid",
          "Rendre un site responsive (mobile-first)",
        ],
        curriculum: [
          { title: "HTML5", lessons: ["La structure d'une page", "Textes, liens et images", "Listes et tableaux", "Formulaires"] },
          { title: "CSS3", lessons: ["Sélecteurs et cascade", "Le box model", "Couleurs et typographie", "Transitions"] },
          { title: "Mise en page", lessons: ["Flexbox", "CSS Grid", "Responsive & media queries", "Projet : une page complète"] },
        ],
      },
      {
        slug: "python-les-bases", category: "web",
        title: "Python : les bases", subtitle: "Le langage polyvalent, avant le backend",
        level: "Débutant", durationHours: 12, lessonsCount: 30, price: "Gratuit", free: true,
        tags: ["Python", "Bases", "Algorithmes", "POO"], image: IMG.fastapi, videoUrl: VIDEO_FR.python,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleFr },
        intro: "Python est la porte d'entrée idéale vers la programmation et le backend. Maîtrisez les bases du langage avant d'aborder Django et FastAPI : variables, boucles, fonctions et objets.",
        learn: [
          "Écrire vos premiers programmes Python",
          "Manipuler variables, conditions et boucles",
          "Structurer avec fonctions et modules",
          "Découvrir la programmation orientée objet",
        ],
        curriculum: [
          { title: "Premiers pas", lessons: ["Installer Python", "Variables et types", "Entrées / sorties", "Opérateurs"] },
          { title: "Structures", lessons: ["Conditions", "Boucles", "Listes et dictionnaires", "Fonctions"] },
          { title: "Aller plus loin", lessons: ["Modules", "Gestion des erreurs", "Introduction à la POO", "Mini-projet"] },
        ],
      },
      {
        slug: "debuter-avec-react", category: "web",
        title: "Débutez avec React", subtitle: "Construisez vos premières interfaces modernes",
        level: "Débutant", durationHours: 12, lessonsCount: 32, price: "Gratuit", free: true,
        tags: ["React", "JSX", "Composants", "Hooks"], image: IMG.react, videoUrl: VIDEO_FR.react,
        instructor: { name: TEAM.loic.name, role: TEAM.loic.roleFr },
        intro: "Apprenez React de zéro : composants, props, état et hooks. À la fin, vous saurez construire une interface interactive complète, prête pour la production.",
        learn: [
          "Créer des composants réutilisables en JSX",
          "Gérer l'état avec useState et useEffect",
          "Communiquer entre composants via les props",
          "Structurer une petite application React",
        ],
        curriculum: [
          { title: "Les fondations", lessons: ["Pourquoi React ?", "Installer l'environnement", "Votre premier composant", "Comprendre le JSX"] },
          { title: "Composants & état", lessons: ["Props et composition", "L'état avec useState", "Les événements", "Listes et clés"] },
          { title: "Aller plus loin", lessons: ["Effets avec useEffect", "Appeler une API", "Bonnes pratiques", "Projet fil rouge"] },
        ],
      },
      {
        slug: "javascript-moderne", category: "web",
        title: "JavaScript moderne (ES6+)", subtitle: "Le langage du web, en profondeur",
        level: "Intermédiaire", durationHours: 15, lessonsCount: 40, price: "Premium", free: false,
        tags: ["JavaScript", "ES6", "Async", "DOM"], image: IMG.js, videoUrl: VIDEO_FR.js,
        instructor: { name: TEAM.team.name, role: TEAM.team.roleFr },
        intro: "Maîtrisez le JavaScript moderne : fonctions fléchées, promesses, async/await, modules et manipulation du DOM, pour écrire un code clair et robuste.",
        learn: [
          "Écrire du code ES6+ propre et lisible",
          "Manipuler le DOM et les événements",
          "Gérer l'asynchrone avec async/await",
          "Organiser son code en modules",
        ],
        curriculum: [
          { title: "Les bases solides", lessons: ["Variables et portée", "Fonctions fléchées", "Déstructuration", "Modules import/export"] },
          { title: "Le navigateur", lessons: ["Sélectionner le DOM", "Événements", "Fetch et JSON", "Stockage local"] },
          { title: "Asynchrone", lessons: ["Callbacks et promesses", "async / await", "Gestion des erreurs", "Mini-projet"] },
        ],
      },
      {
        slug: "nextjs-en-production", category: "web",
        title: "Next.js en production", subtitle: "Des applications rapides et référencées",
        level: "Avancé", durationHours: 18, lessonsCount: 44, price: "Premium", free: false,
        tags: ["Next.js", "SSR", "SEO", "TypeScript"], image: IMG.next, videoUrl: VIDEO_FR.next,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleFr },
        intro: "Passez de React à Next.js : rendu serveur, routage, optimisation des images, SEO et déploiement. Le framework que nous utilisons pour nos propres produits.",
        learn: [
          "Structurer une app avec l'App Router",
          "Choisir entre rendu serveur et statique",
          "Optimiser performances et SEO",
          "Déployer une application Next.js",
        ],
        curriculum: [
          { title: "Prise en main", lessons: ["App Router", "Pages et layouts", "Composants serveur", "Données et fetch"] },
          { title: "Performance & SEO", lessons: ["Rendu statique / dynamique", "Optimisation des images", "Métadonnées et SEO", "Cache et revalidation"] },
          { title: "Mise en production", lessons: ["Variables d'environnement", "Build et déploiement", "Monitoring", "Projet complet"] },
        ],
      },
      {
        slug: "backend-fastapi", category: "web",
        title: "Backend avec FastAPI & PostgreSQL", subtitle: "Construisez des API robustes en Python",
        level: "Intermédiaire", durationHours: 16, lessonsCount: 36, price: "Premium", free: false,
        tags: ["FastAPI", "Python", "PostgreSQL", "API REST"], image: IMG.fastapi, videoUrl: VIDEO_FR.fastapi,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleFr },
        intro: "Construisez le backend de vos applications avec FastAPI et PostgreSQL : routes, validation, base de données, authentification et tests — la stack de nos projets clients.",
        learn: [
          "Créer une API REST avec FastAPI",
          "Valider les données avec Pydantic",
          "Connecter et interroger PostgreSQL",
          "Sécuriser et tester votre API",
        ],
        curriculum: [
          { title: "Démarrer avec FastAPI", lessons: ["Routes et méthodes HTTP", "Paramètres et requêtes", "Validation avec Pydantic", "Documentation automatique"] },
          { title: "Données & base", lessons: ["Modéliser avec SQL", "PostgreSQL & SQLAlchemy", "CRUD complet", "Migrations"] },
          { title: "Fiabiliser", lessons: ["Authentification JWT", "Gestion des erreurs", "Tests avec pytest & Postman", "Projet d'API"] },
        ],
      },
      {
        slug: "dart-les-bases", category: "mobile",
        title: "Dart : les bases", subtitle: "Le langage de Flutter, avant de créer une app",
        level: "Débutant", durationHours: 8, lessonsCount: 22, price: "Gratuit", free: true,
        tags: ["Dart", "Bases", "POO", "Mobile"], image: IMG.flutter, videoUrl: VIDEO_FR.dartlang,
        instructor: { name: TEAM.loic.name, role: TEAM.loic.roleFr },
        intro: "Avant de construire une application Flutter, il faut connaître Dart. Apprenez les bases du langage : variables, fonctions, classes et asynchronisme, pour aborder Flutter en confiance.",
        learn: [
          "Comprendre la syntaxe de Dart",
          "Utiliser variables, fonctions et collections",
          "Écrire des classes et objets",
          "Gérer l'asynchrone (Future, async/await)",
        ],
        curriculum: [
          { title: "Bases du langage", lessons: ["Variables et types", "Opérateurs", "Conditions et boucles", "Fonctions"] },
          { title: "Structures", lessons: ["Listes et Map", "Classes et objets", "Héritage", "Null safety"] },
          { title: "Asynchrone", lessons: ["Future", "async / await", "Streams", "Mini-projet Dart"] },
        ],
      },
      {
        slug: "app-mobile-flutter", category: "mobile",
        title: "Créez une app mobile avec Flutter", subtitle: "Une base de code, iOS et Android",
        level: "Débutant", durationHours: 16, lessonsCount: 38, price: "Premium", free: false,
        tags: ["Flutter", "Dart", "Mobile", "UI"], image: IMG.flutter, videoUrl: VIDEO_FR.flutter,
        instructor: { name: TEAM.loic.name, role: TEAM.loic.roleFr },
        intro: "Développez une application mobile complète avec Flutter et Dart : interfaces, navigation, appels réseau et publication sur les stores.",
        learn: [
          "Comprendre les widgets Flutter",
          "Construire une navigation multi-écrans",
          "Consommer une API REST",
          "Préparer la publication sur les stores",
        ],
        curriculum: [
          { title: "Démarrer avec Flutter", lessons: ["Installer Flutter & Dart", "Le concept de widget", "Layouts de base", "Thème et styles"] },
          { title: "Une vraie app", lessons: ["Navigation", "État et formulaires", "Appels réseau", "Stockage local"] },
          { title: "Finaliser", lessons: ["Icônes et splash", "Tests", "Build iOS/Android", "Publication"] },
        ],
      },
      {
        slug: "react-native-de-zero", category: "mobile",
        title: "React Native de zéro", subtitle: "Le mobile avec vos compétences React",
        level: "Intermédiaire", durationHours: 14, lessonsCount: 34, price: "Premium", free: false,
        tags: ["React Native", "Expo", "Mobile", "JavaScript"], image: IMG.rn, videoUrl: VIDEO_FR.rn,
        instructor: { name: TEAM.team.name, role: TEAM.team.roleFr },
        intro: "Réutilisez vos connaissances React pour créer des applications mobiles natives avec React Native et Expo.",
        learn: [
          "Mettre en place un projet Expo",
          "Utiliser les composants natifs",
          "Naviguer entre les écrans",
          "Publier une première version",
        ],
        curriculum: [
          { title: "Bases", lessons: ["Expo et outillage", "Composants natifs", "Style et Flexbox", "Listes performantes"] },
          { title: "Fonctionnalités", lessons: ["Navigation", "Formulaires", "API et données", "Notifications"] },
          { title: "Livraison", lessons: ["Permissions", "Build", "Tests sur appareil", "Projet final"] },
        ],
      },
      {
        slug: "analyse-modelisation-uml", category: "genie-logiciel",
        title: "Analyse & modélisation UML", subtitle: "Comprendre le besoin avant de coder",
        level: "Débutant", durationHours: 10, lessonsCount: 26, price: "Gratuit", free: true,
        tags: ["UML", "Analyse", "RUP", "Agile"], image: IMG.uml, videoUrl: VIDEO_FR.uml,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleFr },
        intro: "Transformez un besoin client en spécifications claires, avec les méthodes utilisées en entreprise : recueil des besoins, cas d'utilisation, RUP/Agile et diagrammes UML.",
        learn: [
          "Recueillir et cadrer un besoin client",
          "Écrire des cas d'utilisation et user stories",
          "Choisir une méthode (RUP, UP7, Agile/Scrum)",
          "Modéliser en UML (cas d'utilisation & activité)",
        ],
        curriculum: [
          { title: "Recueil des besoins", lessons: ["Interviews client", "Cahier des charges", "Exigences fonctionnelles", "Périmètre du projet"] },
          { title: "Cas d'utilisation", lessons: ["Acteurs", "User stories", "Backlog produit", "Priorisation"] },
          { title: "Méthodes & UML", lessons: ["RUP, UP7", "Agile & Scrum", "Diagramme de cas d'utilisation", "Diagramme d'activité"] },
        ],
      },
      {
        slug: "conception-architecture-bdd", category: "genie-logiciel",
        title: "Conception : architecture & base de données", subtitle: "Poser des fondations solides",
        level: "Intermédiaire", durationHours: 12, lessonsCount: 28, price: "Premium", free: false,
        tags: ["Architecture", "Base de données", "Modélisation", "Maquettes"], image: IMG.archi, videoUrl: VIDEO_FR.archi,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleFr },
        intro: "Concevez une application avant de la coder : architecture logicielle, modélisation de la base de données et maquettes. Les décisions qui font tenir un projet dans la durée.",
        learn: [
          "Choisir une architecture adaptée",
          "Modéliser une base de données relationnelle",
          "Normaliser et éviter les pièges",
          "Réaliser des maquettes (wireframes)",
        ],
        curriculum: [
          { title: "Architecture", lessons: ["Séparer les responsabilités", "Client / serveur / API", "Choix technologiques", "Diagrammes de conception"] },
          { title: "Base de données", lessons: ["Modèle entité-association", "Schéma relationnel", "Normalisation", "Clés et relations"] },
          { title: "Maquettes", lessons: ["Wireframes", "Parcours utilisateur", "Du besoin à l'écran", "Revue de conception"] },
        ],
      },
      {
        slug: "developper-avec-ia-claude", category: "ia",
        title: "Développer avec l'IA — Claude & Claude Code", subtitle: "L'IA comme accélérateur, en toute maîtrise",
        level: "Débutant", durationHours: 8, lessonsCount: 22, price: "Gratuit", free: true,
        tags: ["Claude", "Claude Code", "LLM", "Prompt engineering"], image: IMG.ia, videoUrl: VIDEO_FR.claude,
        instructor: { name: TEAM.loic.name, role: TEAM.loic.roleFr },
        intro: "Les fondamentaux acquis, l'IA devient un accélérateur : comprendre les LLM, écrire de bons prompts et coder, déboguer et refactorer avec Claude & Claude Code — les workflows que nous utilisons chez Horus-Lab.",
        learn: [
          "Comprendre les forces et limites des LLM",
          "Écrire des prompts précis et fiables",
          "Coder, déboguer et refactorer avec Claude Code",
          "Mener un projet de bout en bout avec l'IA",
        ],
        curriculum: [
          { title: "Comprendre l'IA", lessons: ["Qu'est-ce qu'un LLM ?", "Forces, limites, bon usage", "L'IA dans un vrai workflow", "Éthique & vérification"] },
          { title: "Prompt engineering", lessons: ["Des instructions précises", "Contexte et exemples", "Itérer vers du code fiable", "Éviter les hallucinations"] },
          { title: "Claude & Claude Code", lessons: ["Coder avec Claude Code", "Déboguer avec l'IA", "Refactorer en confiance", "Projet final assisté par l'IA"] },
        ],
      },
    ],
  },
  en: {
    categories: [
      { slug: "web",            name: "Web Development",       tagline: "From frontend to backend, our stack",   iconKey: "code" },
      { slug: "mobile",         name: "Mobile Development",    tagline: "iOS & Android apps",                    iconKey: "layers" },
      { slug: "genie-logiciel", name: "Software Engineering",  tagline: "Analyse & design before coding",        iconKey: "cog" },
      { slug: "ia",             name: "AI & Productivity",     tagline: "Code with Claude & Claude Code",        iconKey: "spark" },
    ],
    courses: [
      {
        slug: "html-css-fondations", category: "web",
        title: "HTML5 & CSS3 — web foundations", subtitle: "Structure and style your first pages",
        level: "Beginner", durationHours: 10, lessonsCount: 28, price: "Free", free: true,
        tags: ["HTML5", "CSS3", "Web", "Responsive"], image: IMG.js, videoUrl: VIDEO_EN.htmlcss,
        instructor: { name: TEAM.team.name, role: TEAM.team.roleEn },
        intro: "The starting point for every web developer: structure a page with HTML5 and style it with CSS3. Solid foundations before tackling React or any framework.",
        learn: [
          "Structure a page with HTML5 tags",
          "Style with CSS3 (colours, typography, box model)",
          "Build layouts with Flexbox and Grid",
          "Make a site responsive (mobile-first)",
        ],
        curriculum: [
          { title: "HTML5", lessons: ["Page structure", "Text, links and images", "Lists and tables", "Forms"] },
          { title: "CSS3", lessons: ["Selectors and cascade", "The box model", "Colours and typography", "Transitions"] },
          { title: "Layout", lessons: ["Flexbox", "CSS Grid", "Responsive & media queries", "Project: a full page"] },
        ],
      },
      {
        slug: "python-les-bases", category: "web",
        title: "Python: the basics", subtitle: "The versatile language, before the backend",
        level: "Beginner", durationHours: 12, lessonsCount: 30, price: "Free", free: true,
        tags: ["Python", "Basics", "Algorithms", "OOP"], image: IMG.fastapi, videoUrl: VIDEO_EN.python,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleEn },
        intro: "Python is the ideal gateway to programming and the backend. Master the basics before tackling Django and FastAPI: variables, loops, functions and objects.",
        learn: [
          "Write your first Python programs",
          "Work with variables, conditions and loops",
          "Structure with functions and modules",
          "Discover object-oriented programming",
        ],
        curriculum: [
          { title: "First steps", lessons: ["Install Python", "Variables and types", "Input / output", "Operators"] },
          { title: "Structures", lessons: ["Conditions", "Loops", "Lists and dictionaries", "Functions"] },
          { title: "Going further", lessons: ["Modules", "Error handling", "Intro to OOP", "Mini project"] },
        ],
      },
      {
        slug: "debuter-avec-react", category: "web",
        title: "Get started with React", subtitle: "Build your first modern interfaces",
        level: "Beginner", durationHours: 12, lessonsCount: 32, price: "Free", free: true,
        tags: ["React", "JSX", "Components", "Hooks"], image: IMG.react, videoUrl: VIDEO_EN.react,
        instructor: { name: TEAM.loic.name, role: TEAM.loic.roleEn },
        intro: "Learn React from scratch: components, props, state and hooks. By the end, you'll be able to build a complete interactive interface, production-ready.",
        learn: [
          "Create reusable components in JSX",
          "Manage state with useState and useEffect",
          "Pass data between components via props",
          "Structure a small React application",
        ],
        curriculum: [
          { title: "Foundations", lessons: ["Why React?", "Set up the environment", "Your first component", "Understanding JSX"] },
          { title: "Components & state", lessons: ["Props and composition", "State with useState", "Events", "Lists and keys"] },
          { title: "Going further", lessons: ["Effects with useEffect", "Calling an API", "Best practices", "Capstone project"] },
        ],
      },
      {
        slug: "javascript-moderne", category: "web",
        title: "Modern JavaScript (ES6+)", subtitle: "The language of the web, in depth",
        level: "Intermediate", durationHours: 15, lessonsCount: 40, price: "Premium", free: false,
        tags: ["JavaScript", "ES6", "Async", "DOM"], image: IMG.js, videoUrl: VIDEO_EN.js,
        instructor: { name: TEAM.team.name, role: TEAM.team.roleEn },
        intro: "Master modern JavaScript: arrow functions, promises, async/await, modules and DOM manipulation, to write clear and robust code.",
        learn: [
          "Write clean, readable ES6+ code",
          "Manipulate the DOM and events",
          "Handle async code with async/await",
          "Organise code into modules",
        ],
        curriculum: [
          { title: "Solid basics", lessons: ["Variables and scope", "Arrow functions", "Destructuring", "import/export modules"] },
          { title: "The browser", lessons: ["Selecting the DOM", "Events", "Fetch and JSON", "Local storage"] },
          { title: "Async", lessons: ["Callbacks and promises", "async / await", "Error handling", "Mini project"] },
        ],
      },
      {
        slug: "nextjs-en-production", category: "web",
        title: "Next.js in production", subtitle: "Fast, well-ranked applications",
        level: "Advanced", durationHours: 18, lessonsCount: 44, price: "Premium", free: false,
        tags: ["Next.js", "SSR", "SEO", "TypeScript"], image: IMG.next, videoUrl: VIDEO_EN.next,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleEn },
        intro: "Move from React to Next.js: server rendering, routing, image optimisation, SEO and deployment. The framework we use for our own products.",
        learn: [
          "Structure an app with the App Router",
          "Choose between server and static rendering",
          "Optimise performance and SEO",
          "Deploy a Next.js application",
        ],
        curriculum: [
          { title: "Getting started", lessons: ["App Router", "Pages and layouts", "Server components", "Data and fetch"] },
          { title: "Performance & SEO", lessons: ["Static / dynamic rendering", "Image optimisation", "Metadata and SEO", "Cache and revalidation"] },
          { title: "Going live", lessons: ["Environment variables", "Build and deploy", "Monitoring", "Full project"] },
        ],
      },
      {
        slug: "backend-fastapi", category: "web",
        title: "Backend with FastAPI & PostgreSQL", subtitle: "Build robust APIs in Python",
        level: "Intermediate", durationHours: 16, lessonsCount: 36, price: "Premium", free: false,
        tags: ["FastAPI", "Python", "PostgreSQL", "REST API"], image: IMG.fastapi, videoUrl: VIDEO_EN.fastapi,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleEn },
        intro: "Build the backend of your applications with FastAPI and PostgreSQL: routes, validation, database, authentication and tests — the stack of our client projects.",
        learn: [
          "Create a REST API with FastAPI",
          "Validate data with Pydantic",
          "Connect and query PostgreSQL",
          "Secure and test your API",
        ],
        curriculum: [
          { title: "Start with FastAPI", lessons: ["Routes and HTTP methods", "Parameters and queries", "Validation with Pydantic", "Automatic documentation"] },
          { title: "Data & database", lessons: ["Modelling with SQL", "PostgreSQL & SQLAlchemy", "Full CRUD", "Migrations"] },
          { title: "Make it reliable", lessons: ["JWT authentication", "Error handling", "Testing with pytest & Postman", "API project"] },
        ],
      },
      {
        slug: "dart-les-bases", category: "mobile",
        title: "Dart: the basics", subtitle: "Flutter's language, before building an app",
        level: "Beginner", durationHours: 8, lessonsCount: 22, price: "Free", free: true,
        tags: ["Dart", "Basics", "OOP", "Mobile"], image: IMG.flutter, videoUrl: VIDEO_EN.dartlang,
        instructor: { name: TEAM.loic.name, role: TEAM.loic.roleEn },
        intro: "Before building a Flutter app, you need to know Dart. Learn the language basics: variables, functions, classes and async, to approach Flutter with confidence.",
        learn: [
          "Understand Dart syntax",
          "Use variables, functions and collections",
          "Write classes and objects",
          "Handle async (Future, async/await)",
        ],
        curriculum: [
          { title: "Language basics", lessons: ["Variables and types", "Operators", "Conditions and loops", "Functions"] },
          { title: "Structures", lessons: ["Lists and Map", "Classes and objects", "Inheritance", "Null safety"] },
          { title: "Async", lessons: ["Future", "async / await", "Streams", "Dart mini project"] },
        ],
      },
      {
        slug: "app-mobile-flutter", category: "mobile",
        title: "Build a mobile app with Flutter", subtitle: "One codebase, iOS and Android",
        level: "Beginner", durationHours: 16, lessonsCount: 38, price: "Premium", free: false,
        tags: ["Flutter", "Dart", "Mobile", "UI"], image: IMG.flutter, videoUrl: VIDEO_EN.flutter,
        instructor: { name: TEAM.loic.name, role: TEAM.loic.roleEn },
        intro: "Build a complete mobile application with Flutter and Dart: interfaces, navigation, network calls and store publishing.",
        learn: [
          "Understand Flutter widgets",
          "Build multi-screen navigation",
          "Consume a REST API",
          "Prepare store publishing",
        ],
        curriculum: [
          { title: "Start with Flutter", lessons: ["Install Flutter & Dart", "The widget concept", "Basic layouts", "Theme and styles"] },
          { title: "A real app", lessons: ["Navigation", "State and forms", "Network calls", "Local storage"] },
          { title: "Finalise", lessons: ["Icons and splash", "Tests", "iOS/Android build", "Publishing"] },
        ],
      },
      {
        slug: "react-native-de-zero", category: "mobile",
        title: "React Native from scratch", subtitle: "Mobile with your React skills",
        level: "Intermediate", durationHours: 14, lessonsCount: 34, price: "Premium", free: false,
        tags: ["React Native", "Expo", "Mobile", "JavaScript"], image: IMG.rn, videoUrl: VIDEO_EN.rn,
        instructor: { name: TEAM.team.name, role: TEAM.team.roleEn },
        intro: "Reuse your React knowledge to build native mobile apps with React Native and Expo.",
        learn: [
          "Set up an Expo project",
          "Use native components",
          "Navigate between screens",
          "Ship a first version",
        ],
        curriculum: [
          { title: "Basics", lessons: ["Expo and tooling", "Native components", "Style and Flexbox", "Performant lists"] },
          { title: "Features", lessons: ["Navigation", "Forms", "API and data", "Notifications"] },
          { title: "Delivery", lessons: ["Permissions", "Build", "Device testing", "Final project"] },
        ],
      },
      {
        slug: "analyse-modelisation-uml", category: "genie-logiciel",
        title: "Analysis & UML modelling", subtitle: "Understand the need before coding",
        level: "Beginner", durationHours: 10, lessonsCount: 26, price: "Free", free: true,
        tags: ["UML", "Analysis", "RUP", "Agile"], image: IMG.uml, videoUrl: VIDEO_EN.uml,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleEn },
        intro: "Turn a client need into clear specifications, with the methods used in the industry: requirements gathering, use cases, RUP/Agile and UML diagrams.",
        learn: [
          "Gather and frame a client need",
          "Write use cases and user stories",
          "Choose a method (RUP, UP7, Agile/Scrum)",
          "Model in UML (use case & activity)",
        ],
        curriculum: [
          { title: "Requirements gathering", lessons: ["Client interviews", "Requirements document", "Functional requirements", "Project scope"] },
          { title: "Use cases", lessons: ["Actors", "User stories", "Product backlog", "Prioritisation"] },
          { title: "Methods & UML", lessons: ["RUP, UP7", "Agile & Scrum", "Use case diagram", "Activity diagram"] },
        ],
      },
      {
        slug: "conception-architecture-bdd", category: "genie-logiciel",
        title: "Design: architecture & database", subtitle: "Lay solid foundations",
        level: "Intermediate", durationHours: 12, lessonsCount: 28, price: "Premium", free: false,
        tags: ["Architecture", "Database", "Modelling", "Wireframes"], image: IMG.archi, videoUrl: VIDEO_EN.archi,
        instructor: { name: TEAM.edwin.name, role: TEAM.edwin.roleEn },
        intro: "Design an application before coding it: software architecture, database modelling and wireframes. The decisions that make a project last.",
        learn: [
          "Choose a suitable architecture",
          "Model a relational database",
          "Normalise and avoid pitfalls",
          "Create wireframes",
        ],
        curriculum: [
          { title: "Architecture", lessons: ["Separate responsibilities", "Client / server / API", "Technology choices", "Design diagrams"] },
          { title: "Database", lessons: ["Entity-relationship model", "Relational schema", "Normalisation", "Keys and relations"] },
          { title: "Wireframes", lessons: ["Wireframes", "User journeys", "From need to screen", "Design review"] },
        ],
      },
      {
        slug: "developper-avec-ia-claude", category: "ia",
        title: "Develop with AI — Claude & Claude Code", subtitle: "AI as an accelerator, fully in control",
        level: "Beginner", durationHours: 8, lessonsCount: 22, price: "Free", free: true,
        tags: ["Claude", "Claude Code", "LLM", "Prompt engineering"], image: IMG.ia, videoUrl: VIDEO_EN.claude,
        instructor: { name: TEAM.loic.name, role: TEAM.loic.roleEn },
        intro: "With the fundamentals in hand, AI becomes an accelerator: understand LLMs, write good prompts, and code, debug and refactor with Claude & Claude Code — the workflows we use at Horus-Lab.",
        learn: [
          "Understand the strengths and limits of LLMs",
          "Write precise, reliable prompts",
          "Code, debug and refactor with Claude Code",
          "Run a project end to end with AI",
        ],
        curriculum: [
          { title: "Understanding AI", lessons: ["What is an LLM?", "Strengths, limits, good use", "AI in a real workflow", "Ethics & verification"] },
          { title: "Prompt engineering", lessons: ["Precise instructions", "Context and examples", "Iterate to reliable code", "Avoiding hallucinations"] },
          { title: "Claude & Claude Code", lessons: ["Code with Claude Code", "Debug with AI", "Refactor with confidence", "AI-assisted final project"] },
        ],
      },
    ],
  },
};

export function getFormations(lang: Lang): Catalog {
  return CATALOG[lang];
}

export function getCourse(lang: Lang, slug: string): Course | undefined {
  return CATALOG[lang].courses.find((c) => c.slug === slug);
}

/** Slugs uniques (identiques FR/EN) — pour generateStaticParams / sitemap. */
export function getCourseSlugs(): string[] {
  return CATALOG.fr.courses.map((c) => c.slug);
}
