"""
Données par défaut du site Horus-Lab.

Idempotent : on peut relancer `python manage.py seed` sans dupliquer
(update_or_create sur une clé stable). Lancé automatiquement au démarrage
du conteneur (voir entrypoint.sh).
"""
from django.core.management.base import BaseCommand

from blog.models import Category, Post
from content.models import (
    HeroContent,
    HeroStat,
    ProcessStep,
    Sector,
    Service,
    SiteSettings,
    Testimonial,
    Value,
)
from portfolio.models import Project


class Command(BaseCommand):
    help = "Insère/actualise les données par défaut du site."

    def handle(self, *args, **options):
        self.seed_site_settings()
        self.seed_hero()
        self.seed_services()
        self.seed_process()
        self.seed_values()
        self.seed_sectors()
        self.seed_testimonials()
        self.seed_blog()
        self.seed_portfolio()
        self.stdout.write(self.style.SUCCESS("Seed termine."))

    # ------------------------------------------------------------------
    def seed_site_settings(self):
        SiteSettings.objects.update_or_create(
            pk=1,
            defaults=dict(
                brand_name="Horus-Lab",
                tagline_fr="Solutions technologiques intelligentes • Impact durable",
                tagline_en="Intelligent technology solutions • Lasting impact",
                about_fr="Horus-Lab est une entreprise technologique africaine qui conçoit des produits numériques durables.",
                about_en="Horus-Lab is an African technology company building lasting digital products.",
                email="contact@horus-lab.com",
                phone_primary="+237 673 39 80 46",
                phone_secondary="+237 699 17 37 71",
                location_fr="Douala, Cameroun · Afrique",
                location_en="Douala, Cameroon · Africa",
                linkedin_url="https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
                x_url="https://x.com/horuslabafrik",
                facebook_url="https://www.facebook.com/HorusLab",
                github_url="https://github.com/horus-lab-team-s",
                whatsapp_url="https://wa.me/237699173771",
                telegram_url="https://t.me/tonbacm",
            ),
        )

    def seed_hero(self):
        HeroContent.objects.update_or_create(
            pk=1,
            defaults=dict(
                eyebrow_fr="Entreprise technologique africaine",
                eyebrow_en="African technology company",
                title_lead_fr="Nous transformons vos idées en",
                title_lead_en="We turn your ideas into",
                title_highlight_fr="solutions numériques durables",
                title_highlight_en="lasting digital solutions",
                subtitle_fr="Développement web & mobile, ERP, logiciels sur-mesure et solutions d'intelligence artificielle. Une expertise locale au service de votre croissance.",
                subtitle_en="Web & mobile development, ERPs, custom software and artificial intelligence solutions. Local expertise driving your growth.",
                cta_primary_fr="Démarrer un projet",
                cta_primary_en="Start a project",
                cta_secondary_fr="Découvrir nos services",
                cta_secondary_en="Explore our services",
            ),
        )
        stats = [
            ("50+", "projets livrés", "projects delivered"),
            ("4", "pôles d'expertise", "areas of expertise"),
            ("98%", "clients satisfaits", "happy clients"),
            ("24/7", "accompagnement", "support"),
        ]
        for i, (value, fr, en) in enumerate(stats):
            HeroStat.objects.update_or_create(
                label_fr=fr, defaults=dict(value=value, label_en=en, order=i)
            )

    def seed_services(self):
        items = [
            ("code", "Développement Web & Mobile", "Web & Mobile Development",
             "Sites vitrines, plateformes, applications iOS / Android et PWA performantes, pensées pour vos utilisateurs.",
             "Websites, platforms, iOS / Android apps and high-performance PWAs, built around your users.",
             ["React", "Next.js", "Flutter", "PWA"]),
            ("layers", "ERP & Systèmes de gestion", "ERP & Management Systems",
             "Pilotez votre activité avec des outils intégrés : finances, RH, stocks, ventes — centralisés et fiables.",
             "Run your business with integrated tools: finance, HR, inventory, sales — centralized and reliable.",
             ["Gestion", "Finance", "RH", "Stocks"]),
            ("cog", "Logiciels sur-mesure", "Custom Software",
             "Des applications métier conçues autour de vos processus réels, évolutives et faciles à maintenir.",
             "Business applications designed around your real processes — scalable and easy to maintain.",
             ["SaaS", "API", "Cloud", "Automatisation"]),
            ("spark", "Solutions d'Intelligence Artificielle", "AI Solutions",
             "Chatbots, analyse de données, automatisation intelligente et modèles prédictifs adaptés à vos besoins.",
             "Chatbots, data analytics, smart automation and predictive models tailored to your needs.",
             ["IA", "Data", "NLP", "Vision"]),
        ]
        for i, (icon, tfr, ten, dfr, den, tags) in enumerate(items):
            Service.objects.update_or_create(
                title_fr=tfr,
                defaults=dict(title_en=ten, description_fr=dfr, description_en=den,
                              tags=tags, icon=icon, order=i, is_active=True),
            )

    def seed_process(self):
        steps = [
            ("Écoute & cadrage", "Listen & scope",
             "Nous analysons vos besoins, votre marché et vos contraintes pour définir une vision commune.",
             "We analyze your needs, market and constraints to define a shared vision."),
            ("Conception & design", "Design & prototype",
             "Architecture technique, maquettes et prototypes validés ensemble avant la moindre ligne de code.",
             "Technical architecture, mockups and prototypes validated together before a single line of code."),
            ("Développement agile", "Agile development",
             "Des livraisons régulières et testées, avec une visibilité totale sur l'avancement du projet.",
             "Regular, tested releases with full visibility on project progress."),
            ("Livraison & accompagnement", "Delivery & support",
             "Mise en production, formation de vos équipes et support continu pour faire durer l'impact.",
             "Go-live, team training and ongoing support to make the impact last."),
        ]
        for i, (tfr, ten, dfr, den) in enumerate(steps):
            ProcessStep.objects.update_or_create(
                title_fr=tfr,
                defaults=dict(title_en=ten, description_fr=dfr, description_en=den, order=i),
            )

    def seed_values(self):
        items = [
            ("Expertise locale africaine", "Local African expertise",
             "Des solutions ancrées dans votre contexte, vos usages et vos contraintes terrain.",
             "Solutions rooted in your context, your usage patterns and field constraints."),
            ("Technologies modernes", "Modern technologies",
             "Nous travaillons avec des stacks éprouvées et récentes pour des produits rapides et fiables.",
             "We work with proven, modern stacks for fast and reliable products."),
            ("Impact durable", "Lasting impact",
             "Nous construisons pour durer : code maintenable, documentation et transfert de compétences.",
             "We build to last: maintainable code, documentation and skills transfer."),
            ("Accompagnement de proximité", "Close partnership",
             "Une équipe disponible, réactive et impliquée à chaque phase de votre projet.",
             "An available, responsive team involved at every phase of your project."),
        ]
        for i, (tfr, ten, dfr, den) in enumerate(items):
            Value.objects.update_or_create(
                title_fr=tfr,
                defaults=dict(title_en=ten, description_fr=dfr, description_en=den, order=i),
            )

    def seed_sectors(self):
        items = [
            ("Fintech & Paiement", "Fintech & Payments"),
            ("Santé & e-Santé", "Health & e-Health"),
            ("Éducation & EdTech", "Education & EdTech"),
            ("Agriculture & AgriTech", "Agriculture & AgriTech"),
            ("Commerce & e-Commerce", "Commerce & e-Commerce"),
            ("Logistique & Transport", "Logistics & Transport"),
            ("Administration publique", "Public administration"),
            ("Énergie & Environnement", "Energy & Environment"),
        ]
        for i, (fr, en) in enumerate(items):
            Sector.objects.update_or_create(
                name_fr=fr, defaults=dict(name_en=en, order=i, is_active=True)
            )

    def seed_testimonials(self):
        items = [
            ("Aïcha N.", "Directrice Générale, FinPay", "CEO, FinPay",
             "Horus-Lab a livré notre plateforme dans les délais et avec une qualité irréprochable. Une équipe à l'écoute et terriblement compétente.",
             "Horus-Lab delivered our platform on time with flawless quality. A truly skilled team that listens."),
            ("Kwame O.", "Fondateur, AgriConnect", "Founder, AgriConnect",
             "Leur ERP sur-mesure a transformé notre gestion quotidienne. Nous gagnons un temps précieux chaque semaine.",
             "Their custom ERP transformed our daily operations. We save precious time every single week."),
            ("Sandrine M.", "Responsable Support, MediCare", "Support Lead, MediCare",
             "Le chatbot IA qu'ils ont conçu gère 70% de nos demandes clients. Un vrai bond en avant pour notre service.",
             "The AI chatbot they built handles 70% of our customer requests. A real leap forward for our support."),
        ]
        for i, (name, rfr, ren, qfr, qen) in enumerate(items):
            Testimonial.objects.update_or_create(
                name=name,
                defaults=dict(role_fr=rfr, role_en=ren, quote_fr=qfr, quote_en=qen,
                              order=i, is_active=True),
            )

    def seed_blog(self):
        cats = {
            "erp": ("ERP & Gestion", "ERP & Management"),
            "ia": ("Intelligence Artificielle", "Artificial Intelligence"),
            "dev": ("Développement", "Development"),
        }
        cat_obj = {}
        for slug, (fr, en) in cats.items():
            cat_obj[slug], _ = Category.objects.update_or_create(
                slug=slug, defaults=dict(name_fr=fr, name_en=en)
            )

        posts = [
            dict(
                slug="erp-sur-mesure-pme-africaines", cat="erp",
                tfr="Pourquoi les ERP sur-mesure transforment les PME africaines",
                ten="Why custom ERPs are transforming African SMEs",
                efr="Les solutions de gestion génériques montrent vite leurs limites. Voici comment un ERP pensé pour votre réalité change la donne.",
                een="Generic management software quickly shows its limits. Here's how an ERP designed for your reality changes the game.",
                bfr="Beaucoup de PME africaines pilotent encore leur activité sur des tableurs éparpillés. Un ERP sur-mesure centralise ventes, stocks, finances et RH dans une seule source de vérité, automatise les tâches répétitives et accélère la décision.\n\nChez Horus-Lab, nous procédons par incréments : on démarre par le module qui crée le plus de valeur, puis on étend.",
                ben="Many African SMEs still run their business on scattered spreadsheets. A custom ERP centralizes sales, inventory, finance and HR into a single source of truth, automates repetitive tasks and speeds up decisions.\n\nAt Horus-Lab we work in increments: start with the module that creates the most value, then expand.",
                tags=["ERP", "Gestion", "PME"], date="2026-05-12",
            ),
            dict(
                slug="cas-usage-ia-entreprises-afrique", cat="ia",
                tfr="5 cas d'usage concrets de l'IA pour les entreprises en Afrique",
                ten="5 concrete AI use cases for businesses in Africa",
                efr="L'intelligence artificielle n'est pas réservée aux géants de la tech. Voici cinq applications immédiatement utiles.",
                een="Artificial intelligence isn't reserved for tech giants. Here are five immediately useful applications.",
                bfr="Service client automatisé, détection de fraude, prévision de la demande, analyse documentaire et personnalisation : autant d'usages déjà accessibles.\n\nLe secret n'est pas d'utiliser « de l'IA » pour le principe, mais de résoudre un problème métier précis avec le bon outil.",
                ben="Automated customer service, fraud detection, demand forecasting, document analysis and personalization: all already accessible.\n\nThe secret isn't to use 'AI' for its own sake, but to solve a specific business problem with the right tool.",
                tags=["IA", "Automatisation", "Data"], date="2026-05-05",
            ),
            dict(
                slug="web-ou-mobile-par-ou-commencer", cat="dev",
                tfr="Web ou mobile : par où commencer pour votre produit numérique ?",
                ten="Web or mobile: where to start for your digital product?",
                efr="Site web, application mobile, PWA… Le choix de la plateforme conditionne votre budget, votre portée et votre vitesse de lancement.",
                een="Website, mobile app, PWA… Your platform choice drives your budget, reach and time-to-launch.",
                bfr="Commencez par vos utilisateurs. Une PWA offre souvent le meilleur des deux mondes : un seul code, pas de friction d'installation, des coûts maîtrisés.\n\nValidez votre idée vite, puis investissez dans le natif une fois la traction prouvée.",
                ben="Start with your users. A PWA often offers the best of both worlds: a single codebase, no install friction, controlled costs.\n\nValidate your idea fast, then invest in native once traction is proven.",
                tags=["Web", "Mobile", "Stratégie produit"], date="2026-04-28",
            ),
        ]
        for p in posts:
            Post.objects.update_or_create(
                slug=p["slug"],
                defaults=dict(
                    title_fr=p["tfr"], title_en=p["ten"],
                    excerpt_fr=p["efr"], excerpt_en=p["een"],
                    body_fr=p["bfr"], body_en=p["ben"],
                    category=cat_obj[p["cat"]], author="Équipe Horus-Lab",
                    tags=p["tags"], is_published=True, published_at=p["date"],
                ),
            )

    def seed_portfolio(self):
        items = [
            ("globe", "Plateforme de paiement mobile", "Mobile payment platform", "Fintech", "Fintech",
             "Application de transferts et paiements mobile money, sécurisée et temps réel.",
             "Secure, real-time mobile-money transfer and payment app.",
             ["Mobile", "API", "Sécurité"], "+40% de transactions", "+40% transactions"),
            ("layers", "ERP agricole intégré", "Integrated agri ERP", "AgriTech", "AgriTech",
             "Gestion des stocks, des coopératives et de la traçabilité, du champ jusqu'à la vente.",
             "Inventory, cooperative and traceability management, from field to sale.",
             ["ERP", "Cloud", "Data"], "−30% de pertes", "−30% losses"),
            ("spark", "Téléconsultation médicale", "Medical teleconsultation", "Santé", "Health",
             "Application de prise de rendez-vous et de consultation à distance, avec dossier patient.",
             "Appointment booking and remote consultation app, with patient records.",
             ["Mobile", "Web", "IA"], "10k+ patients", "10k+ patients"),
            ("code", "Marketplace e-commerce", "E-commerce marketplace", "Commerce", "Commerce",
             "Place de marché multi-vendeurs avec paiements intégrés et logistique de livraison.",
             "Multi-vendor marketplace with integrated payments and delivery logistics.",
             ["Next.js", "Paiement"], "x3 ventes", "3x sales"),
            ("eye", "Plateforme e-learning", "E-learning platform", "Éducation", "Education",
             "Cours en ligne, suivi de progression et certifications, optimisée pour faible bande passante.",
             "Online courses, progress tracking and certifications, optimized for low bandwidth.",
             ["PWA", "Vidéo"], "25k apprenants", "25k learners"),
            ("cog", "Suivi logistique temps réel", "Real-time logistics tracking", "Logistique", "Logistics",
             "Tableau de bord de géolocalisation et d'optimisation des tournées de livraison.",
             "Geolocation dashboard and delivery-route optimization.",
             ["IoT", "Cartographie"], "−20% de délais", "−20% delays"),
        ]
        for i, (icon, tfr, ten, cfr, cen, dfr, den, tags, rfr, ren) in enumerate(items):
            Project.objects.update_or_create(
                title_fr=tfr,
                defaults=dict(title_en=ten, category_fr=cfr, category_en=cen,
                              description_fr=dfr, description_en=den, tags=tags,
                              result_fr=rfr, result_en=ren, icon=icon, order=i, is_active=True),
            )
