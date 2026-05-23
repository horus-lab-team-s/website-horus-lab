export type Lang = "fr" | "en";

/* La structure française fait référence : `en` doit la respecter (typé via Dict). */
const fr = {
  langName: "FR",
  nav: {
    services: "Services",
    process: "Méthode",
    why: "Pourquoi nous",
    sectors: "Secteurs",
    portfolio: "Réalisations",
    about: "À propos",
    blog: "Blog",
    contact: "Contact",
    cta: "Démarrer un projet",
  },
  hero: {
    eyebrow: "Entreprise technologique africaine",
    titleLead: "Nous transformons vos idées en",
    titleHighlight: "solutions numériques durables",
    subtitle:
      "Développement web & mobile, ERP, logiciels sur-mesure et solutions d'intelligence artificielle. Une expertise locale au service de votre croissance.",
    ctaPrimary: "Démarrer un projet",
    ctaSecondary: "Découvrir nos services",
    stats: [
      { value: "50+", label: "projets livrés" },
      { value: "4", label: "pôles d'expertise" },
      { value: "98%", label: "clients satisfaits" },
      { value: "24/7", label: "accompagnement" },
    ],
  },
  services: {
    eyebrow: "Nos services",
    title: "Une expertise complète, du concept au déploiement",
    subtitle:
      "Nous couvrons l'ensemble de votre chaîne de valeur numérique avec des équipes pluridisciplinaires.",
    items: [
      {
        title: "Développement Web & Mobile",
        desc: "Sites vitrines, plateformes, applications iOS / Android et PWA performantes, pensées pour vos utilisateurs.",
        tags: ["React", "Next.js", "Flutter", "PWA"],
      },
      {
        title: "ERP & Systèmes de gestion",
        desc: "Pilotez votre activité avec des outils intégrés : finances, RH, stocks, ventes — centralisés et fiables.",
        tags: ["Gestion", "Finance", "RH", "Stocks"],
      },
      {
        title: "Logiciels sur-mesure",
        desc: "Des applications métier conçues autour de vos processus réels, évolutives et faciles à maintenir.",
        tags: ["SaaS", "API", "Cloud", "Automatisation"],
      },
      {
        title: "Solutions d'Intelligence Artificielle",
        desc: "Chatbots, analyse de données, automatisation intelligente et modèles prédictifs adaptés à vos besoins.",
        tags: ["IA", "Data", "NLP", "Vision"],
      },
    ],
  },
  process: {
    eyebrow: "Notre méthode",
    title: "Un processus clair, à chaque étape",
    subtitle:
      "Une approche agile et transparente qui vous garde aux commandes du début à la fin.",
    steps: [
      {
        title: "Écoute & cadrage",
        desc: "Nous analysons vos besoins, votre marché et vos contraintes pour définir une vision commune.",
      },
      {
        title: "Conception & design",
        desc: "Architecture technique, maquettes et prototypes validés ensemble avant la moindre ligne de code.",
      },
      {
        title: "Développement agile",
        desc: "Des livraisons régulières et testées, avec une visibilité totale sur l'avancement du projet.",
      },
      {
        title: "Livraison & accompagnement",
        desc: "Mise en production, formation de vos équipes et support continu pour faire durer l'impact.",
      },
    ],
  },
  why: {
    eyebrow: "Pourquoi Horus-Lab",
    title: "Une technologie intelligente, un impact durable",
    subtitle:
      "Nous combinons savoir-faire technique et compréhension profonde des réalités africaines.",
    items: [
      {
        title: "Expertise locale africaine",
        desc: "Des solutions ancrées dans votre contexte, vos usages et vos contraintes terrain.",
      },
      {
        title: "Technologies modernes",
        desc: "Nous travaillons avec des stacks éprouvées et récentes pour des produits rapides et fiables.",
      },
      {
        title: "Impact durable",
        desc: "Nous construisons pour durer : code maintenable, documentation et transfert de compétences.",
      },
      {
        title: "Accompagnement de proximité",
        desc: "Une équipe disponible, réactive et impliquée à chaque phase de votre projet.",
      },
    ],
  },
  sectors: {
    eyebrow: "Secteurs",
    title: "Nous accompagnons tous les secteurs",
    subtitle:
      "De la fintech à l'agriculture, nous adaptons nos solutions à votre domaine d'activité.",
    items: [
      "Fintech & Paiement",
      "Santé & e-Santé",
      "Éducation & EdTech",
      "Agriculture & AgriTech",
      "Commerce & e-Commerce",
      "Logistique & Transport",
      "Administration publique",
      "Énergie & Environnement",
    ],
  },
  testimonials: {
    eyebrow: "Témoignages",
    title: "Ils nous font confiance",
    items: [
      {
        quote:
          "Horus-Lab a livré notre plateforme dans les délais et avec une qualité irréprochable. Une équipe à l'écoute et terriblement compétente.",
        name: "Aïcha N.",
        role: "Directrice Générale, FinPay",
      },
      {
        quote:
          "Leur ERP sur-mesure a transformé notre gestion quotidienne. Nous gagnons un temps précieux chaque semaine.",
        name: "Kwame O.",
        role: "Fondateur, AgriConnect",
      },
      {
        quote:
          "Le chatbot IA qu'ils ont conçu gère 70% de nos demandes clients. Un vrai bond en avant pour notre service.",
        name: "Sandrine M.",
        role: "Responsable Support, MediCare",
      },
    ],
  },
  cta: {
    title: "Prêt à lancer votre projet ?",
    subtitle:
      "Parlons de vos objectifs. Nous vous répondons sous 24h avec une première proposition.",
    button: "Contactez-nous",
    secondary: "Demander un devis",
  },
  contactForm: {
    eyebrow: "Contact",
    title: "Démarrons la conversation",
    subtitle:
      "Décrivez votre projet en quelques lignes. Nous revenons vers vous sous 24h.",
    name: "Nom complet",
    namePlaceholder: "Votre nom",
    email: "E-mail",
    emailPlaceholder: "vous@entreprise.com",
    subject: "Sujet",
    subjectPlaceholder: "Le sujet de votre demande",
    message: "Message",
    messagePlaceholder: "Parlez-nous de votre projet…",
    send: "Envoyer le message",
    sending: "Envoi en cours…",
    success: "Merci ! Votre message a bien été envoyé. Nous vous répondons vite.",
    error: "Une erreur est survenue. Réessayez ou écrivez-nous directement.",
    invalid: "Veuillez vérifier les champs du formulaire.",
  },
  newsletter: {
    title: "Restez informé",
    subtitle:
      "Nos articles, conseils et actualités tech, directement dans votre boîte mail. Pas de spam.",
    placeholder: "vous@entreprise.com",
    button: "S'abonner",
    sending: "Inscription…",
    success: "Inscription réussie ! Merci de votre confiance.",
    error: "Inscription impossible pour le moment. Réessayez.",
    invalid: "Adresse e-mail invalide.",
  },
  blog: {
    eyebrow: "Blog",
    title: "Nos articles & ressources",
    subtitle:
      "Conseils, retours d'expérience et décryptages tech pour les entreprises africaines.",
    readMore: "Lire l'article",
    readTime: "min de lecture",
    backToBlog: "Retour au blog",
    allArticles: "Tous les articles",
    by: "Par",
    latfrom: "À lire aussi",
    empty: "Aucun article pour le moment.",
  },
  ai: {
    title: "Horus AI",
    subtitle: "Assistant virtuel",
    greeting:
      "Bonjour 👋 Je suis Horus AI, l'assistant de Horus-Lab. Posez-moi vos questions sur nos services, notre méthode ou comment démarrer un projet.",
    placeholder: "Écrivez votre message…",
    send: "Envoyer",
    open: "Discuter avec Horus AI",
    close: "Fermer",
    error:
      "Désolé, une erreur est survenue. Réessayez ou écrivez-nous à contact@horus-lab.com.",
    disclaimer: "Horus AI peut faire des erreurs. Vérifiez les infos importantes.",
    offline: "Mode hors-ligne (réponses limitées)",
    suggestions: [
      "Quels services proposez-vous ?",
      "Comment démarrer un projet ?",
      "Où êtes-vous situés ?",
    ],
  },
  footer: {
    tagline: "Solutions technologiques intelligentes • Impact durable",
    about:
      "Horus-Lab est une entreprise technologique africaine qui conçoit des produits numériques durables.",
    columns: [
      {
        title: "Services",
        links: ["Développement Web & Mobile", "ERP & Gestion", "Logiciels sur-mesure", "Solutions IA"],
      },
      {
        title: "Entreprise",
        links: ["À propos", "Notre méthode", "Secteurs", "Carrières"],
      },
    ],
    contactTitle: "Contact",
    email: "contact@horus-lab.com",
    phones: ["+237 673 39 80 46", "+237 699 17 37 71"],
    location: "Douala, Cameroun · Afrique",
    rights: "Tous droits réservés.",
    legal: "Mentions légales",
  },
};

export type Dict = typeof fr;

const en: Dict = {
  langName: "EN",
  nav: {
    services: "Services",
    process: "Method",
    why: "Why us",
    sectors: "Industries",
    portfolio: "Work",
    about: "About",
    blog: "Blog",
    contact: "Contact",
    cta: "Start a project",
  },
  hero: {
    eyebrow: "African technology company",
    titleLead: "We turn your ideas into",
    titleHighlight: "lasting digital solutions",
    subtitle:
      "Web & mobile development, ERPs, custom software and artificial intelligence solutions. Local expertise driving your growth.",
    ctaPrimary: "Start a project",
    ctaSecondary: "Explore our services",
    stats: [
      { value: "50+", label: "projects delivered" },
      { value: "4", label: "areas of expertise" },
      { value: "98%", label: "happy clients" },
      { value: "24/7", label: "support" },
    ],
  },
  services: {
    eyebrow: "Our services",
    title: "End-to-end expertise, from concept to deployment",
    subtitle:
      "We cover your entire digital value chain with cross-functional teams.",
    items: [
      {
        title: "Web & Mobile Development",
        desc: "Websites, platforms, iOS / Android apps and high-performance PWAs, built around your users.",
        tags: ["React", "Next.js", "Flutter", "PWA"],
      },
      {
        title: "ERP & Management Systems",
        desc: "Run your business with integrated tools: finance, HR, inventory, sales — centralized and reliable.",
        tags: ["Management", "Finance", "HR", "Inventory"],
      },
      {
        title: "Custom Software",
        desc: "Business applications designed around your real processes — scalable and easy to maintain.",
        tags: ["SaaS", "API", "Cloud", "Automation"],
      },
      {
        title: "Artificial Intelligence Solutions",
        desc: "Chatbots, data analytics, smart automation and predictive models tailored to your needs.",
        tags: ["AI", "Data", "NLP", "Vision"],
      },
    ],
  },
  process: {
    eyebrow: "Our method",
    title: "A clear process, every step of the way",
    subtitle:
      "An agile, transparent approach that keeps you in control from start to finish.",
    steps: [
      {
        title: "Listen & scope",
        desc: "We analyze your needs, market and constraints to define a shared vision.",
      },
      {
        title: "Design & prototype",
        desc: "Technical architecture, mockups and prototypes validated together before a single line of code.",
      },
      {
        title: "Agile development",
        desc: "Regular, tested releases with full visibility on project progress.",
      },
      {
        title: "Delivery & support",
        desc: "Go-live, team training and ongoing support to make the impact last.",
      },
    ],
  },
  why: {
    eyebrow: "Why Horus-Lab",
    title: "Intelligent technology, lasting impact",
    subtitle:
      "We blend technical craft with a deep understanding of African realities.",
    items: [
      {
        title: "Local African expertise",
        desc: "Solutions rooted in your context, your usage patterns and field constraints.",
      },
      {
        title: "Modern technologies",
        desc: "We work with proven, modern stacks for fast and reliable products.",
      },
      {
        title: "Lasting impact",
        desc: "We build to last: maintainable code, documentation and skills transfer.",
      },
      {
        title: "Close partnership",
        desc: "An available, responsive team involved at every phase of your project.",
      },
    ],
  },
  sectors: {
    eyebrow: "Industries",
    title: "We serve every industry",
    subtitle:
      "From fintech to agriculture, we adapt our solutions to your field.",
    items: [
      "Fintech & Payments",
      "Health & e-Health",
      "Education & EdTech",
      "Agriculture & AgriTech",
      "Commerce & e-Commerce",
      "Logistics & Transport",
      "Public administration",
      "Energy & Environment",
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Trusted by our clients",
    items: [
      {
        quote:
          "Horus-Lab delivered our platform on time with flawless quality. A truly skilled team that listens.",
        name: "Aïcha N.",
        role: "CEO, FinPay",
      },
      {
        quote:
          "Their custom ERP transformed our daily operations. We save precious time every single week.",
        name: "Kwame O.",
        role: "Founder, AgriConnect",
      },
      {
        quote:
          "The AI chatbot they built handles 70% of our customer requests. A real leap forward for our support.",
        name: "Sandrine M.",
        role: "Support Lead, MediCare",
      },
    ],
  },
  cta: {
    title: "Ready to launch your project?",
    subtitle:
      "Let's talk about your goals. We reply within 24h with a first proposal.",
    button: "Get in touch",
    secondary: "Request a quote",
  },
  contactForm: {
    eyebrow: "Contact",
    title: "Let's start the conversation",
    subtitle:
      "Describe your project in a few lines. We'll get back to you within 24h.",
    name: "Full name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@company.com",
    subject: "Subject",
    subjectPlaceholder: "What is your request about?",
    message: "Message",
    messagePlaceholder: "Tell us about your project…",
    send: "Send message",
    sending: "Sending…",
    success: "Thank you! Your message has been sent. We'll reply soon.",
    error: "Something went wrong. Try again or email us directly.",
    invalid: "Please check the form fields.",
  },
  newsletter: {
    title: "Stay in the loop",
    subtitle:
      "Our articles, tips and tech news, straight to your inbox. No spam.",
    placeholder: "you@company.com",
    button: "Subscribe",
    sending: "Subscribing…",
    success: "You're in! Thanks for subscribing.",
    error: "Couldn't subscribe right now. Please try again.",
    invalid: "Invalid email address.",
  },
  blog: {
    eyebrow: "Blog",
    title: "Articles & resources",
    subtitle:
      "Tips, lessons learned and tech insights for African businesses.",
    readMore: "Read article",
    readTime: "min read",
    backToBlog: "Back to blog",
    allArticles: "All articles",
    by: "By",
    latfrom: "Read next",
    empty: "No articles yet.",
  },
  ai: {
    title: "Horus AI",
    subtitle: "Virtual assistant",
    greeting:
      "Hi 👋 I'm Horus AI, Horus-Lab's assistant. Ask me about our services, our method, or how to start a project.",
    placeholder: "Type your message…",
    send: "Send",
    open: "Chat with Horus AI",
    close: "Close",
    error:
      "Sorry, something went wrong. Try again or email us at contact@horus-lab.com.",
    disclaimer: "Horus AI can make mistakes. Verify important information.",
    offline: "Offline mode (limited answers)",
    suggestions: [
      "What services do you offer?",
      "How do I start a project?",
      "Where are you located?",
    ],
  },
  footer: {
    tagline: "Intelligent technology solutions • Lasting impact",
    about:
      "Horus-Lab is an African technology company building lasting digital products.",
    columns: [
      {
        title: "Services",
        links: ["Web & Mobile Development", "ERP & Management", "Custom Software", "AI Solutions"],
      },
      {
        title: "Company",
        links: ["About", "Our method", "Industries", "Careers"],
      },
    ],
    contactTitle: "Contact",
    email: "contact@horus-lab.com",
    phones: ["+237 673 39 80 46", "+237 699 17 37 71"],
    location: "Douala, Cameroon · Africa",
    rights: "All rights reserved.",
    legal: "Legal notice",
  },
};

export const dictionaries: Record<Lang, Dict> = { fr, en };

export const locales: Lang[] = ["fr", "en"];
export const defaultLocale: Lang = "fr";

export function isLocale(value: unknown): value is Lang {
  return value === "fr" || value === "en";
}

export function getDictionary(lang: Lang): Dict {
  return dictionaries[lang];
}
