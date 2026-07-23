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
    news: "Actualités",
    formations: "Formations",
    contact: "Contact",
    cta: "Démarrer un projet",
  },
  hero: {
    eyebrow: "Entreprise technologique africaine",
    titleLead: "Nous transformons vos idées en",
    titleHighlight: "solutions numériques durables",
    subtitle:
      "Vos idées, nos solutions, du concept au déploiement.",
    ctaPrimary: "Démarrer un projet",
    ctaSecondary: "Découvrir nos services",
    stats: [
      { value: "5", label: "projets livrés" },
      { value: "4", label: "pôles d'expertise" },
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
        title: "Applications sur mesure",
        desc: "Sites vitrines, plateformes, applications iOS / Android et PWA performantes, pensées pour vos utilisateurs.",
        tags: ["React", "Next.js", "Flutter", "PWA"],
      },
      {
        title: "Systèmes d'information",
        desc: "Analyse, conception et architecture de vos SI avec rigueur : méthode RUP, UML, audit de l'existant.",
        tags: ["UML", "RUP", "Architecture", "API"],
      },
      {
        title: "Digitalisation d'entreprise",
        desc: "Dématérialisation, automatisation des workflows et outils de gestion adaptés à votre contexte.",
        tags: ["Automatisation", "CRM", "GED", "Cloud"],
      },
      {
        title: "Formation & Audit IT",
        desc: "Formations techniques, ateliers pratiques, audit de code et de sécurité pour vos équipes.",
        tags: ["Formation", "Cybersécurité", "Audit", "Certification"],
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
    title: "Quel que soit votre secteur",
    subtitle:
      "Nous concevons la solution adaptée à votre métier. Ces domaines ne sont que des exemples : votre besoin définit le projet, sans aucune limite de secteur.",
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
  realisations: {
    eyebrow: "Réalisations",
    title: "Des produits déjà en production",
    subtitle:
      "Des applications conçues et livrées pour des clients africains, du concept au déploiement.",
    featuredLabel: "Projet phare",
    viewAll: "Voir toutes les réalisations",
    detailsLabel: "Détails",
  },
  achievements: {
    eyebrow: "Notre impact",
    title: "Des résultats concrets",
    subtitle: "Ce que nos produits changent, en chiffres.",
  },
  stack: {
    eyebrow: "Notre stack",
    title: "Les technologies que nous maîtrisons",
  },
  news: {
    eyebrow: "Actualités",
    title: "Les nouvelles du studio",
    subtitle:
      "Lancements, mises à jour, partenariats : les actualités fraîches de Horus-Lab et de nos produits.",
    viewAll: "Voir toutes les actualités",
    readMore: "En savoir plus",
    backToNews: "Retour aux actualités",
    empty: "Aucune actualité pour le moment.",
    pageTitle: "Actualités",
  },
  testimonials: {
    eyebrow: "Témoignages",
    title: "Ils nous font confiance",
    items: [
      {
        quote:
          "Horus-Lab a conçu notre application sur mesure de bout en bout. Livraison dans les délais, qualité irréprochable et une équipe terriblement à l'écoute.",
        name: "Aïcha N.",
        role: "Directrice Générale, FinPay",
      },
      {
        quote:
          "Ils ont modélisé et architecturé notre système d'information avec une rigueur remarquable. Une base solide, documentée et évolutive sur laquelle nous construisons sereinement.",
        name: "Kwame O.",
        role: "Fondateur, AgriConnect",
      },
      {
        quote:
          "La digitalisation de nos processus nous fait gagner un temps précieux chaque semaine. Workflows automatisés, validations dématérialisées : le papier a quasiment disparu.",
        name: "Sandrine M.",
        role: "Responsable des opérations, MediCare",
      },
      {
        quote:
          "Leur audit a révélé des failles que nous ignorions, et la formation a fait monter toute notre équipe en compétences. Un accompagnement concret et durable.",
        name: "David K.",
        role: "Directeur des SI, LogiTrans",
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
    title: "Actualités tech & ressources",
    subtitle:
      "Les dernières nouvelles de la tech mondiale et des conseils concrets pour les entreprises africaines.",
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
        links: ["Applications sur mesure", "Systèmes d'information", "Digitalisation", "Formation & Audit IT"],
      },
      {
        title: "Entreprise",
        links: ["À propos", "Réalisations", "Actualités", "Carrières"],
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
    news: "News",
    formations: "Courses",
    contact: "Contact",
    cta: "Start a project",
  },
  hero: {
    eyebrow: "African technology company",
    titleLead: "We turn your ideas into",
    titleHighlight: "lasting digital solutions",
    subtitle:
      "Your ideas, our solutions, from concept to deployment.",
    ctaPrimary: "Start a project",
    ctaSecondary: "Explore our services",
    stats: [
      { value: "5", label: "projects delivered" },
      { value: "4", label: "areas of expertise" },
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
        title: "Custom Applications",
        desc: "Websites, platforms, iOS / Android apps and high-performance PWAs, built around your users.",
        tags: ["React", "Next.js", "Flutter", "PWA"],
      },
      {
        title: "Information Systems",
        desc: "Analysis, design and IS architecture with rigour: RUP method, UML, existing system audit.",
        tags: ["UML", "RUP", "Architecture", "API"],
      },
      {
        title: "Business Digitalisation",
        desc: "Dematerialisation, workflow automation and management tools adapted to your context.",
        tags: ["Automation", "CRM", "DMS", "Cloud"],
      },
      {
        title: "Training & IT Audit",
        desc: "Technical training, hands-on workshops, code and security audits for your teams.",
        tags: ["Training", "Cybersecurity", "Audit", "Certification"],
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
    title: "Whatever your industry",
    subtitle:
      "We build the solution that fits your business. These fields are only examples: your need defines the project, with no industry limits.",
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
  realisations: {
    eyebrow: "Work",
    title: "Products already live in production",
    subtitle:
      "Applications designed and delivered for African clients, from concept to deployment.",
    featuredLabel: "Featured project",
    viewAll: "See all our work",
    detailsLabel: "Details",
  },
  achievements: {
    eyebrow: "Our impact",
    title: "Concrete results",
    subtitle: "What our products change, in numbers.",
  },
  stack: {
    eyebrow: "Our stack",
    title: "The technologies we master",
  },
  news: {
    eyebrow: "News",
    title: "What's happening at the studio",
    subtitle:
      "Launches, updates, partnerships: fresh news from Horus-Lab and our products.",
    viewAll: "See all news",
    readMore: "Read more",
    backToNews: "Back to news",
    empty: "No news yet.",
    pageTitle: "News",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Trusted by our clients",
    items: [
      {
        quote:
          "Horus-Lab built our custom application end to end. On-time delivery, flawless quality and a team that genuinely listens.",
        name: "Aïcha N.",
        role: "CEO, FinPay",
      },
      {
        quote:
          "They modelled and architected our information system with remarkable rigour. A solid, documented and scalable foundation we build on with confidence.",
        name: "Kwame O.",
        role: "Founder, AgriConnect",
      },
      {
        quote:
          "Digitalising our processes saves us precious time every single week. Automated workflows, paperless approvals, the paper has all but disappeared.",
        name: "Sandrine M.",
        role: "Operations Lead, MediCare",
      },
      {
        quote:
          "Their audit uncovered gaps we didn't know we had, and the training levelled up our whole team. Hands-on, lasting support.",
        name: "David K.",
        role: "Head of IT, LogiTrans",
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
    title: "Tech news & resources",
    subtitle:
      "The latest from global tech and practical insights for African businesses.",
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
        links: ["Custom Applications", "Information Systems", "Business Digitalisation", "Training & IT Audit"],
      },
      {
        title: "Company",
        links: ["About", "Our work", "News", "Careers"],
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
