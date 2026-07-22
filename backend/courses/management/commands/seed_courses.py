# -*- coding: utf-8 -*-
"""Seed du catalogue de formations.

Aligné sur le programme réel Horus-Lab (bootcamp « Devenez développeur web ») :
Développement Web, Développement Mobile, Génie logiciel (analyse & conception)
et IA & Productivité (Claude & Claude Code). Chaque cours pointe vers une VRAIE
vidéo gratuite (YouTube). Reflète le catalogue frontend (frontend/src/lib/courses.ts).
Idempotent (update_or_create sur le slug). Lancer : python manage.py seed_courses
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from courses.models import Category, Course, Module

TEAM = {
    "loic": ("Loïc DJIMGOU TONBA", "Mentor du parcours", "Course mentor"),
    "edwin": ("Edwin TCHAMBA", "Mentor du parcours", "Course mentor"),
    "team": ("Équipe Horus-Lab", "Mentors Horus-Lab", "Horus-Lab mentors"),
}

IMG = {
    "react": "/img/photo-1607706189992-eae578626c86-w700.jpg",
    "js": "/img/photo-1461749280684-dccba630e2f6-w700.jpg",
    "next": "/img/photo-1454165804606-c3d57bc86b40-w700.jpg",
    "fastapi": "/img/photo-1516321318423-f06f85e504b3-w1200.jpg",
    "flutter": "/img/photo-1512941937669-90a1b58e7e9c-w700.jpg",
    "rn": "/img/photo-1558494949-ef010cbdcc31-w700.jpg",
    "uml": "/img/photo-1522202176988-66273c2fd55f-w1200.jpg",
    "archi": "/img/photo-1531482615713-2afd69097998-w700.jpg",
    "ia": "/img/photo-1518770660439-4636190af475-w700.jpg",
}

# Vraies vidéos gratuites (YouTube) — vérifiées via oEmbed.
# Une vidéo par langue : FR = chaînes francophones, EN = chaînes anglophones.
VIDEO_FR = {
    "react": "https://www.youtube.com/watch?v=NT0s0aOHu0Q",     # Grafikart.fr
    "js": "https://www.youtube.com/watch?v=ldxt9FNUc50",        # Comment Coder
    "next": "https://www.youtube.com/watch?v=wTFThzLcrOk",      # Grafikart.fr
    "fastapi": "https://www.youtube.com/watch?v=7D_0JTeaKWg",   # YoungDevps
    "flutter": "https://www.youtube.com/watch?v=IK_oPkmQFSw",   # Ralph Développeur
    "rn": "https://www.youtube.com/watch?v=Y7rbJRjaYCY",        # Grafikart.fr
    "uml": "https://www.youtube.com/watch?v=CxqbwWKi6jg",       # Julien Code
    "archi": "https://www.youtube.com/watch?v=RTRMXxBn0A0",     # HectorCure (Merise)
    "claude": "https://www.youtube.com/watch?v=5T0irFpaa1U",    # Ludo Salenne (IA / prompt)
    "htmlcss": "https://www.youtube.com/watch?v=oEAuNzWXRjM",   # Grafikart
    "python": "https://www.youtube.com/watch?v=oUJolR5bX6g",    # CodeAvecJonathan
    "dartlang": "https://www.youtube.com/watch?v=cyXWqriiMbY",  # Alex Mercier
}
VIDEO_EN = {
    "react": "https://www.youtube.com/watch?v=4UZrsTqkcW4",
    "js": "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    "next": "https://www.youtube.com/watch?v=1WmNXEVia8I",
    "fastapi": "https://www.youtube.com/watch?v=Yw4LmMQXXFs",
    "flutter": "https://www.youtube.com/watch?v=VPvVD8t02U8",
    "rn": "https://www.youtube.com/watch?v=sm5Y7Vtuihg",
    "uml": "https://www.youtube.com/watch?v=CxqbwWKi6jg",
    "archi": "https://www.youtube.com/watch?v=ztHopE5Wnpc",
    "claude": "https://www.youtube.com/watch?v=IlqJqcl8ONE",
    "htmlcss": "https://www.youtube.com/watch?v=a_iQb1lnAEQ",   # freeCodeCamp
    "python": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",    # Programming with Mosh
    "dartlang": "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q",  # freeCodeCamp
}

CATEGORIES = [
    ("web", "Développement Web", "Web Development", "Du frontend au backend, notre stack", "From frontend to backend, our stack", "code"),
    ("mobile", "Développement Mobile", "Mobile Development", "Apps iOS & Android", "iOS & Android apps", "layers"),
    ("genie-logiciel", "Génie logiciel", "Software Engineering", "Analyser & concevoir avant de coder", "Analyse & design before coding", "cog"),
    ("ia", "IA & Productivité", "AI & Productivity", "Coder avec Claude & Claude Code", "Code with Claude & Claude Code", "spark"),
]

COURSES = [
    {
        "slug": "html-css-fondations", "category": "web", "instructor": "team",
        "title_fr": "HTML5 & CSS3 — les fondations du web", "title_en": "HTML5 & CSS3 — web foundations",
        "subtitle_fr": "Structurer et styliser vos premières pages", "subtitle_en": "Structure and style your first pages",
        "level_fr": "Débutant", "level_en": "Beginner", "duration_hours": 10, "lessons_count": 28,
        "price_fr": "Gratuit", "price_en": "Free", "is_free": True,
        "tags": ["HTML5", "CSS3", "Web", "Responsive"], "image": IMG["js"], "video_url_fr": VIDEO_FR["htmlcss"], "video_url_en": VIDEO_EN["htmlcss"],
        "intro_fr": "Le point de départ de tout développeur web : structurer une page avec HTML5 et la mettre en forme avec CSS3. Des fondations solides avant d'aborder React ou tout framework.",
        "intro_en": "The starting point for every web developer: structure a page with HTML5 and style it with CSS3. Solid foundations before tackling React or any framework.",
        "learn_fr": ["Structurer une page avec les balises HTML5", "Mettre en forme avec CSS3 (couleurs, typographie, box model)", "Créer des mises en page avec Flexbox et Grid", "Rendre un site responsive (mobile-first)"],
        "learn_en": ["Structure a page with HTML5 tags", "Style with CSS3 (colours, typography, box model)", "Build layouts with Flexbox and Grid", "Make a site responsive (mobile-first)"],
        "curriculum": [
            ("HTML5", "HTML5", ["La structure d'une page", "Textes, liens et images", "Listes et tableaux", "Formulaires"], ["Page structure", "Text, links and images", "Lists and tables", "Forms"]),
            ("CSS3", "CSS3", ["Sélecteurs et cascade", "Le box model", "Couleurs et typographie", "Transitions"], ["Selectors and cascade", "The box model", "Colours and typography", "Transitions"]),
            ("Mise en page", "Layout", ["Flexbox", "CSS Grid", "Responsive & media queries", "Projet : une page complète"], ["Flexbox", "CSS Grid", "Responsive & media queries", "Project: a full page"]),
        ],
    },
    {
        "slug": "python-les-bases", "category": "web", "instructor": "edwin",
        "title_fr": "Python : les bases", "title_en": "Python: the basics",
        "subtitle_fr": "Le langage polyvalent, avant le backend", "subtitle_en": "The versatile language, before the backend",
        "level_fr": "Débutant", "level_en": "Beginner", "duration_hours": 12, "lessons_count": 30,
        "price_fr": "Gratuit", "price_en": "Free", "is_free": True,
        "tags": ["Python", "Bases", "Algorithmes", "POO"], "image": IMG["fastapi"], "video_url_fr": VIDEO_FR["python"], "video_url_en": VIDEO_EN["python"],
        "intro_fr": "Python est la porte d'entrée idéale vers la programmation et le backend. Maîtrisez les bases du langage avant d'aborder Django et FastAPI : variables, boucles, fonctions et objets.",
        "intro_en": "Python is the ideal gateway to programming and the backend. Master the basics before tackling Django and FastAPI: variables, loops, functions and objects.",
        "learn_fr": ["Écrire vos premiers programmes Python", "Manipuler variables, conditions et boucles", "Structurer avec fonctions et modules", "Découvrir la programmation orientée objet"],
        "learn_en": ["Write your first Python programs", "Work with variables, conditions and loops", "Structure with functions and modules", "Discover object-oriented programming"],
        "curriculum": [
            ("Premiers pas", "First steps", ["Installer Python", "Variables et types", "Entrées / sorties", "Opérateurs"], ["Install Python", "Variables and types", "Input / output", "Operators"]),
            ("Structures", "Structures", ["Conditions", "Boucles", "Listes et dictionnaires", "Fonctions"], ["Conditions", "Loops", "Lists and dictionaries", "Functions"]),
            ("Aller plus loin", "Going further", ["Modules", "Gestion des erreurs", "Introduction à la POO", "Mini-projet"], ["Modules", "Error handling", "Intro to OOP", "Mini project"]),
        ],
    },
    {
        "slug": "debuter-avec-react", "category": "web", "instructor": "loic",
        "title_fr": "Débutez avec React", "title_en": "Get started with React",
        "subtitle_fr": "Construisez vos premières interfaces modernes", "subtitle_en": "Build your first modern interfaces",
        "level_fr": "Débutant", "level_en": "Beginner", "duration_hours": 12, "lessons_count": 32,
        "price_fr": "Gratuit", "price_en": "Free", "is_free": True,
        "tags": ["React", "JSX", "Composants", "Hooks"], "image": IMG["react"], "video_url_fr": VIDEO_FR["react"], "video_url_en": VIDEO_EN["react"],
        "intro_fr": "Apprenez React de zéro : composants, props, état et hooks. À la fin, vous saurez construire une interface interactive complète, prête pour la production.",
        "intro_en": "Learn React from scratch: components, props, state and hooks. By the end, you'll be able to build a complete interactive interface, production-ready.",
        "learn_fr": ["Créer des composants réutilisables en JSX", "Gérer l'état avec useState et useEffect", "Communiquer entre composants via les props", "Structurer une petite application React"],
        "learn_en": ["Create reusable components in JSX", "Manage state with useState and useEffect", "Pass data between components via props", "Structure a small React application"],
        "curriculum": [
            ("Les fondations", "Foundations", ["Pourquoi React ?", "Installer l'environnement", "Votre premier composant", "Comprendre le JSX"], ["Why React?", "Set up the environment", "Your first component", "Understanding JSX"]),
            ("Composants & état", "Components & state", ["Props et composition", "L'état avec useState", "Les événements", "Listes et clés"], ["Props and composition", "State with useState", "Events", "Lists and keys"]),
            ("Aller plus loin", "Going further", ["Effets avec useEffect", "Appeler une API", "Bonnes pratiques", "Projet fil rouge"], ["Effects with useEffect", "Calling an API", "Best practices", "Capstone project"]),
        ],
    },
    {
        "slug": "javascript-moderne", "category": "web", "instructor": "team",
        "title_fr": "JavaScript moderne (ES6+)", "title_en": "Modern JavaScript (ES6+)",
        "subtitle_fr": "Le langage du web, en profondeur", "subtitle_en": "The language of the web, in depth",
        "level_fr": "Intermédiaire", "level_en": "Intermediate", "duration_hours": 15, "lessons_count": 40,
        "price_fr": "Premium", "price_en": "Premium", "is_free": False,
        "tags": ["JavaScript", "ES6", "Async", "DOM"], "image": IMG["js"], "video_url_fr": VIDEO_FR["js"], "video_url_en": VIDEO_EN["js"],
        "intro_fr": "Maîtrisez le JavaScript moderne : fonctions fléchées, promesses, async/await, modules et manipulation du DOM, pour écrire un code clair et robuste.",
        "intro_en": "Master modern JavaScript: arrow functions, promises, async/await, modules and DOM manipulation, to write clear and robust code.",
        "learn_fr": ["Écrire du code ES6+ propre et lisible", "Manipuler le DOM et les événements", "Gérer l'asynchrone avec async/await", "Organiser son code en modules"],
        "learn_en": ["Write clean, readable ES6+ code", "Manipulate the DOM and events", "Handle async code with async/await", "Organise code into modules"],
        "curriculum": [
            ("Les bases solides", "Solid basics", ["Variables et portée", "Fonctions fléchées", "Déstructuration", "Modules import/export"], ["Variables and scope", "Arrow functions", "Destructuring", "import/export modules"]),
            ("Le navigateur", "The browser", ["Sélectionner le DOM", "Événements", "Fetch et JSON", "Stockage local"], ["Selecting the DOM", "Events", "Fetch and JSON", "Local storage"]),
            ("Asynchrone", "Async", ["Callbacks et promesses", "async / await", "Gestion des erreurs", "Mini-projet"], ["Callbacks and promises", "async / await", "Error handling", "Mini project"]),
        ],
    },
    {
        "slug": "nextjs-en-production", "category": "web", "instructor": "edwin",
        "title_fr": "Next.js en production", "title_en": "Next.js in production",
        "subtitle_fr": "Des applications rapides et référencées", "subtitle_en": "Fast, well-ranked applications",
        "level_fr": "Avancé", "level_en": "Advanced", "duration_hours": 18, "lessons_count": 44,
        "price_fr": "Premium", "price_en": "Premium", "is_free": False,
        "tags": ["Next.js", "SSR", "SEO", "TypeScript"], "image": IMG["next"], "video_url_fr": VIDEO_FR["next"], "video_url_en": VIDEO_EN["next"],
        "intro_fr": "Passez de React à Next.js : rendu serveur, routage, optimisation des images, SEO et déploiement. Le framework que nous utilisons pour nos propres produits.",
        "intro_en": "Move from React to Next.js: server rendering, routing, image optimisation, SEO and deployment. The framework we use for our own products.",
        "learn_fr": ["Structurer une app avec l'App Router", "Choisir entre rendu serveur et statique", "Optimiser performances et SEO", "Déployer une application Next.js"],
        "learn_en": ["Structure an app with the App Router", "Choose between server and static rendering", "Optimise performance and SEO", "Deploy a Next.js application"],
        "curriculum": [
            ("Prise en main", "Getting started", ["App Router", "Pages et layouts", "Composants serveur", "Données et fetch"], ["App Router", "Pages and layouts", "Server components", "Data and fetch"]),
            ("Performance & SEO", "Performance & SEO", ["Rendu statique / dynamique", "Optimisation des images", "Métadonnées et SEO", "Cache et revalidation"], ["Static / dynamic rendering", "Image optimisation", "Metadata and SEO", "Cache and revalidation"]),
            ("Mise en production", "Going live", ["Variables d'environnement", "Build et déploiement", "Monitoring", "Projet complet"], ["Environment variables", "Build and deploy", "Monitoring", "Full project"]),
        ],
    },
    {
        "slug": "backend-fastapi", "category": "web", "instructor": "edwin",
        "title_fr": "Backend avec FastAPI & PostgreSQL", "title_en": "Backend with FastAPI & PostgreSQL",
        "subtitle_fr": "Construisez des API robustes en Python", "subtitle_en": "Build robust APIs in Python",
        "level_fr": "Intermédiaire", "level_en": "Intermediate", "duration_hours": 16, "lessons_count": 36,
        "price_fr": "Premium", "price_en": "Premium", "is_free": False,
        "tags": ["FastAPI", "Python", "PostgreSQL", "API REST"], "image": IMG["fastapi"], "video_url_fr": VIDEO_FR["fastapi"], "video_url_en": VIDEO_EN["fastapi"],
        "intro_fr": "Construisez le backend de vos applications avec FastAPI et PostgreSQL : routes, validation, base de données, authentification et tests — la stack de nos projets clients.",
        "intro_en": "Build the backend of your applications with FastAPI and PostgreSQL: routes, validation, database, authentication and tests — the stack of our client projects.",
        "learn_fr": ["Créer une API REST avec FastAPI", "Valider les données avec Pydantic", "Connecter et interroger PostgreSQL", "Sécuriser et tester votre API"],
        "learn_en": ["Create a REST API with FastAPI", "Validate data with Pydantic", "Connect and query PostgreSQL", "Secure and test your API"],
        "curriculum": [
            ("Démarrer avec FastAPI", "Start with FastAPI", ["Routes et méthodes HTTP", "Paramètres et requêtes", "Validation avec Pydantic", "Documentation automatique"], ["Routes and HTTP methods", "Parameters and queries", "Validation with Pydantic", "Automatic documentation"]),
            ("Données & base", "Data & database", ["Modéliser avec SQL", "PostgreSQL & SQLAlchemy", "CRUD complet", "Migrations"], ["Modelling with SQL", "PostgreSQL & SQLAlchemy", "Full CRUD", "Migrations"]),
            ("Fiabiliser", "Make it reliable", ["Authentification JWT", "Gestion des erreurs", "Tests avec pytest & Postman", "Projet d'API"], ["JWT authentication", "Error handling", "Testing with pytest & Postman", "API project"]),
        ],
    },
    {
        "slug": "dart-les-bases", "category": "mobile", "instructor": "loic",
        "title_fr": "Dart : les bases", "title_en": "Dart: the basics",
        "subtitle_fr": "Le langage de Flutter, avant de créer une app", "subtitle_en": "Flutter's language, before building an app",
        "level_fr": "Débutant", "level_en": "Beginner", "duration_hours": 8, "lessons_count": 22,
        "price_fr": "Gratuit", "price_en": "Free", "is_free": True,
        "tags": ["Dart", "Bases", "POO", "Mobile"], "image": IMG["flutter"], "video_url_fr": VIDEO_FR["dartlang"], "video_url_en": VIDEO_EN["dartlang"],
        "intro_fr": "Avant de construire une application Flutter, il faut connaître Dart. Apprenez les bases du langage : variables, fonctions, classes et asynchronisme, pour aborder Flutter en confiance.",
        "intro_en": "Before building a Flutter app, you need to know Dart. Learn the language basics: variables, functions, classes and async, to approach Flutter with confidence.",
        "learn_fr": ["Comprendre la syntaxe de Dart", "Utiliser variables, fonctions et collections", "Écrire des classes et objets", "Gérer l'asynchrone (Future, async/await)"],
        "learn_en": ["Understand Dart syntax", "Use variables, functions and collections", "Write classes and objects", "Handle async (Future, async/await)"],
        "curriculum": [
            ("Bases du langage", "Language basics", ["Variables et types", "Opérateurs", "Conditions et boucles", "Fonctions"], ["Variables and types", "Operators", "Conditions and loops", "Functions"]),
            ("Structures", "Structures", ["Listes et Map", "Classes et objets", "Héritage", "Null safety"], ["Lists and Map", "Classes and objects", "Inheritance", "Null safety"]),
            ("Asynchrone", "Async", ["Future", "async / await", "Streams", "Mini-projet Dart"], ["Future", "async / await", "Streams", "Dart mini project"]),
        ],
    },
    {
        "slug": "app-mobile-flutter", "category": "mobile", "instructor": "loic",
        "title_fr": "Créez une app mobile avec Flutter", "title_en": "Build a mobile app with Flutter",
        "subtitle_fr": "Une base de code, iOS et Android", "subtitle_en": "One codebase, iOS and Android",
        "level_fr": "Débutant", "level_en": "Beginner", "duration_hours": 16, "lessons_count": 38,
        "price_fr": "Premium", "price_en": "Premium", "is_free": False,
        "tags": ["Flutter", "Dart", "Mobile", "UI"], "image": IMG["flutter"], "video_url_fr": VIDEO_FR["flutter"], "video_url_en": VIDEO_EN["flutter"],
        "intro_fr": "Développez une application mobile complète avec Flutter et Dart : interfaces, navigation, appels réseau et publication sur les stores.",
        "intro_en": "Build a complete mobile application with Flutter and Dart: interfaces, navigation, network calls and store publishing.",
        "learn_fr": ["Comprendre les widgets Flutter", "Construire une navigation multi-écrans", "Consommer une API REST", "Préparer la publication sur les stores"],
        "learn_en": ["Understand Flutter widgets", "Build multi-screen navigation", "Consume a REST API", "Prepare store publishing"],
        "curriculum": [
            ("Démarrer avec Flutter", "Start with Flutter", ["Installer Flutter & Dart", "Le concept de widget", "Layouts de base", "Thème et styles"], ["Install Flutter & Dart", "The widget concept", "Basic layouts", "Theme and styles"]),
            ("Une vraie app", "A real app", ["Navigation", "État et formulaires", "Appels réseau", "Stockage local"], ["Navigation", "State and forms", "Network calls", "Local storage"]),
            ("Finaliser", "Finalise", ["Icônes et splash", "Tests", "Build iOS/Android", "Publication"], ["Icons and splash", "Tests", "iOS/Android build", "Publishing"]),
        ],
    },
    {
        "slug": "react-native-de-zero", "category": "mobile", "instructor": "team",
        "title_fr": "React Native de zéro", "title_en": "React Native from scratch",
        "subtitle_fr": "Le mobile avec vos compétences React", "subtitle_en": "Mobile with your React skills",
        "level_fr": "Intermédiaire", "level_en": "Intermediate", "duration_hours": 14, "lessons_count": 34,
        "price_fr": "Premium", "price_en": "Premium", "is_free": False,
        "tags": ["React Native", "Expo", "Mobile", "JavaScript"], "image": IMG["rn"], "video_url_fr": VIDEO_FR["rn"], "video_url_en": VIDEO_EN["rn"],
        "intro_fr": "Réutilisez vos connaissances React pour créer des applications mobiles natives avec React Native et Expo.",
        "intro_en": "Reuse your React knowledge to build native mobile apps with React Native and Expo.",
        "learn_fr": ["Mettre en place un projet Expo", "Utiliser les composants natifs", "Naviguer entre les écrans", "Publier une première version"],
        "learn_en": ["Set up an Expo project", "Use native components", "Navigate between screens", "Ship a first version"],
        "curriculum": [
            ("Bases", "Basics", ["Expo et outillage", "Composants natifs", "Style et Flexbox", "Listes performantes"], ["Expo and tooling", "Native components", "Style and Flexbox", "Performant lists"]),
            ("Fonctionnalités", "Features", ["Navigation", "Formulaires", "API et données", "Notifications"], ["Navigation", "Forms", "API and data", "Notifications"]),
            ("Livraison", "Delivery", ["Permissions", "Build", "Tests sur appareil", "Projet final"], ["Permissions", "Build", "Device testing", "Final project"]),
        ],
    },
    {
        "slug": "analyse-modelisation-uml", "category": "genie-logiciel", "instructor": "edwin",
        "title_fr": "Analyse & modélisation UML", "title_en": "Analysis & UML modelling",
        "subtitle_fr": "Comprendre le besoin avant de coder", "subtitle_en": "Understand the need before coding",
        "level_fr": "Débutant", "level_en": "Beginner", "duration_hours": 10, "lessons_count": 26,
        "price_fr": "Gratuit", "price_en": "Free", "is_free": True,
        "tags": ["UML", "Analyse", "RUP", "Agile"], "image": IMG["uml"], "video_url_fr": VIDEO_FR["uml"], "video_url_en": VIDEO_EN["uml"],
        "intro_fr": "Transformez un besoin client en spécifications claires, avec les méthodes utilisées en entreprise : recueil des besoins, cas d'utilisation, RUP/Agile et diagrammes UML.",
        "intro_en": "Turn a client need into clear specifications, with the methods used in the industry: requirements gathering, use cases, RUP/Agile and UML diagrams.",
        "learn_fr": ["Recueillir et cadrer un besoin client", "Écrire des cas d'utilisation et user stories", "Choisir une méthode (RUP, UP7, Agile/Scrum)", "Modéliser en UML (cas d'utilisation & activité)"],
        "learn_en": ["Gather and frame a client need", "Write use cases and user stories", "Choose a method (RUP, UP7, Agile/Scrum)", "Model in UML (use case & activity)"],
        "curriculum": [
            ("Recueil des besoins", "Requirements gathering", ["Interviews client", "Cahier des charges", "Exigences fonctionnelles", "Périmètre du projet"], ["Client interviews", "Requirements document", "Functional requirements", "Project scope"]),
            ("Cas d'utilisation", "Use cases", ["Acteurs", "User stories", "Backlog produit", "Priorisation"], ["Actors", "User stories", "Product backlog", "Prioritisation"]),
            ("Méthodes & UML", "Methods & UML", ["RUP, UP7", "Agile & Scrum", "Diagramme de cas d'utilisation", "Diagramme d'activité"], ["RUP, UP7", "Agile & Scrum", "Use case diagram", "Activity diagram"]),
        ],
    },
    {
        "slug": "conception-architecture-bdd", "category": "genie-logiciel", "instructor": "edwin",
        "title_fr": "Conception : architecture & base de données", "title_en": "Design: architecture & database",
        "subtitle_fr": "Poser des fondations solides", "subtitle_en": "Lay solid foundations",
        "level_fr": "Intermédiaire", "level_en": "Intermediate", "duration_hours": 12, "lessons_count": 28,
        "price_fr": "Premium", "price_en": "Premium", "is_free": False,
        "tags": ["Architecture", "Base de données", "Modélisation", "Maquettes"], "image": IMG["archi"], "video_url_fr": VIDEO_FR["archi"], "video_url_en": VIDEO_EN["archi"],
        "intro_fr": "Concevez une application avant de la coder : architecture logicielle, modélisation de la base de données et maquettes. Les décisions qui font tenir un projet dans la durée.",
        "intro_en": "Design an application before coding it: software architecture, database modelling and wireframes. The decisions that make a project last.",
        "learn_fr": ["Choisir une architecture adaptée", "Modéliser une base de données relationnelle", "Normaliser et éviter les pièges", "Réaliser des maquettes (wireframes)"],
        "learn_en": ["Choose a suitable architecture", "Model a relational database", "Normalise and avoid pitfalls", "Create wireframes"],
        "curriculum": [
            ("Architecture", "Architecture", ["Séparer les responsabilités", "Client / serveur / API", "Choix technologiques", "Diagrammes de conception"], ["Separate responsibilities", "Client / server / API", "Technology choices", "Design diagrams"]),
            ("Base de données", "Database", ["Modèle entité-association", "Schéma relationnel", "Normalisation", "Clés et relations"], ["Entity-relationship model", "Relational schema", "Normalisation", "Keys and relations"]),
            ("Maquettes", "Wireframes", ["Wireframes", "Parcours utilisateur", "Du besoin à l'écran", "Revue de conception"], ["Wireframes", "User journeys", "From need to screen", "Design review"]),
        ],
    },
    {
        "slug": "developper-avec-ia-claude", "category": "ia", "instructor": "loic",
        "title_fr": "Développer avec l'IA — Claude & Claude Code", "title_en": "Develop with AI — Claude & Claude Code",
        "subtitle_fr": "L'IA comme accélérateur, en toute maîtrise", "subtitle_en": "AI as an accelerator, fully in control",
        "level_fr": "Débutant", "level_en": "Beginner", "duration_hours": 8, "lessons_count": 22,
        "price_fr": "Gratuit", "price_en": "Free", "is_free": True,
        "tags": ["Claude", "Claude Code", "LLM", "Prompt engineering"], "image": IMG["ia"], "video_url_fr": VIDEO_FR["claude"], "video_url_en": VIDEO_EN["claude"],
        "intro_fr": "Les fondamentaux acquis, l'IA devient un accélérateur : comprendre les LLM, écrire de bons prompts et coder, déboguer et refactorer avec Claude & Claude Code — les workflows que nous utilisons chez Horus-Lab.",
        "intro_en": "With the fundamentals in hand, AI becomes an accelerator: understand LLMs, write good prompts, and code, debug and refactor with Claude & Claude Code — the workflows we use at Horus-Lab.",
        "learn_fr": ["Comprendre les forces et limites des LLM", "Écrire des prompts précis et fiables", "Coder, déboguer et refactorer avec Claude Code", "Mener un projet de bout en bout avec l'IA"],
        "learn_en": ["Understand the strengths and limits of LLMs", "Write precise, reliable prompts", "Code, debug and refactor with Claude Code", "Run a project end to end with AI"],
        "curriculum": [
            ("Comprendre l'IA", "Understanding AI", ["Qu'est-ce qu'un LLM ?", "Forces, limites, bon usage", "L'IA dans un vrai workflow", "Éthique & vérification"], ["What is an LLM?", "Strengths, limits, good use", "AI in a real workflow", "Ethics & verification"]),
            ("Prompt engineering", "Prompt engineering", ["Des instructions précises", "Contexte et exemples", "Itérer vers du code fiable", "Éviter les hallucinations"], ["Precise instructions", "Context and examples", "Iterate to reliable code", "Avoiding hallucinations"]),
            ("Claude & Claude Code", "Claude & Claude Code", ["Coder avec Claude Code", "Déboguer avec l'IA", "Refactorer en confiance", "Projet final assisté par l'IA"], ["Code with Claude Code", "Debug with AI", "Refactor with confidence", "AI-assisted final project"]),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed du catalogue de formations (domaines + cours + programme + vidéos), idempotent."

    @transaction.atomic
    def handle(self, *args, **options):
        # Retire les anciens domaines/cours qui ne sont plus au programme
        # (cybersécurité, cloud & devops, data/ML) — nettoyage idempotent.
        keep_cats = [c[0] for c in CATEGORIES]
        keep_courses = [c["slug"] for c in COURSES]
        Course.objects.exclude(slug__in=keep_courses).delete()
        Category.objects.exclude(slug__in=keep_cats).delete()

        cats = {}
        for order, (slug, name_fr, name_en, tag_fr, tag_en, icon) in enumerate(CATEGORIES):
            cat, _ = Category.objects.update_or_create(
                slug=slug,
                defaults={
                    "name_fr": name_fr, "name_en": name_en,
                    "tagline_fr": tag_fr, "tagline_en": tag_en,
                    "icon_key": icon, "order": order, "is_active": True,
                },
            )
            cats[slug] = cat

        for order, data in enumerate(COURSES):
            name, role_fr, role_en = TEAM[data["instructor"]]
            course, _ = Course.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "category": cats[data["category"]],
                    "title_fr": data["title_fr"], "title_en": data["title_en"],
                    "subtitle_fr": data["subtitle_fr"], "subtitle_en": data["subtitle_en"],
                    "level_fr": data["level_fr"], "level_en": data["level_en"],
                    "duration_hours": data["duration_hours"], "lessons_count": data["lessons_count"],
                    "price_fr": data["price_fr"], "price_en": data["price_en"], "is_free": data["is_free"],
                    "tags": data["tags"], "image": data["image"],
                    "video_url_fr": data["video_url_fr"], "video_url_en": data["video_url_en"],
                    "instructor_name": name, "instructor_role_fr": role_fr, "instructor_role_en": role_en,
                    "intro_fr": data["intro_fr"], "intro_en": data["intro_en"],
                    "learn_fr": data["learn_fr"], "learn_en": data["learn_en"],
                    "order": order, "is_active": True,
                },
            )
            course.curriculum.all().delete()
            for mod_order, (t_fr, t_en, l_fr, l_en) in enumerate(data["curriculum"]):
                Module.objects.create(
                    course=course, title_fr=t_fr, title_en=t_en,
                    lessons_fr=l_fr, lessons_en=l_en, order=mod_order,
                )

        self.stdout.write(self.style.SUCCESS(
            f"Seed OK : {len(CATEGORIES)} domaines, {len(COURSES)} formations."
        ))
