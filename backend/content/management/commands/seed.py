"""
Données par défaut du site Horus-Lab.

Idempotent : on peut relancer `python manage.py seed` sans dupliquer
(update_or_create sur une clé stable). Lancé automatiquement au démarrage
du conteneur (voir entrypoint.sh).
"""
from datetime import date

from django.core.management.base import BaseCommand

from blog.models import Category, Post
from content.models import (
    Achievement,
    HeroContent,
    HeroStat,
    Partner,
    ProcessStep,
    Sector,
    Service,
    SiteSettings,
    TeamMember,
    TechStackItem,
    Testimonial,
    Value,
)
from news.models import News
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
        self.seed_partners()
        self.seed_achievements()
        self.seed_stack()
        self.seed_team()
        self.seed_blog()
        self.seed_portfolio()
        self.seed_news()
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
        # Important : aligné avec le frontend (8+, 4, 24/7 — pas de "98%").
        HeroStat.objects.all().delete()
        for i, (value, fr, en) in enumerate(
            [
                ("8+", "projets livrés", "projects delivered"),
                ("4", "pôles d'expertise", "areas of expertise"),
                ("24/7", "accompagnement", "support"),
            ]
        ):
            HeroStat.objects.create(value=value, label_fr=fr, label_en=en, order=i)

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
             "Horus-Lab delivered our platform on time with flawless quality. A truly skilled team that listens.",
             True),
            ("Kwame O.", "Fondateur, AgriConnect", "Founder, AgriConnect",
             "Leur ERP sur-mesure a transformé notre gestion quotidienne. Nous gagnons un temps précieux chaque semaine.",
             "Their custom ERP transformed our daily operations. We save precious time every single week.",
             False),
            ("Sandrine M.", "Responsable Support, MediCare", "Support Lead, MediCare",
             "Le chatbot IA qu'ils ont conçu gère 70% de nos demandes clients. Un vrai bond en avant pour notre service.",
             "The AI chatbot they built handles 70% of our customer requests. A real leap forward for our support.",
             False),
        ]
        for i, (name, rfr, ren, qfr, qen, featured) in enumerate(items):
            Testimonial.objects.update_or_create(
                name=name,
                defaults=dict(role_fr=rfr, role_en=ren, quote_fr=qfr, quote_en=qen,
                              is_featured=featured, order=i, is_active=True),
            )

    def seed_partners(self):
        names = ["OMA Group", "FMG", "CAPEWEST", "SOFTRONIC INNOVING", "Gathe Finance", "Afrikamode"]
        for i, name in enumerate(names):
            Partner.objects.update_or_create(
                name=name, defaults=dict(order=i, is_active=True)
            )

    def seed_achievements(self):
        items = [
            ("−30%", "temps de chargement", "page load time"),
            ("+25%", "stabilité des applications", "application stability"),
            ("11", "pays couverts (Afrique)", "African countries reached"),
            ("3", "groupes multinationaux servis", "multinational groups served"),
        ]
        Achievement.objects.all().delete()
        for i, (value, fr, en) in enumerate(items):
            Achievement.objects.create(value=value, label_fr=fr, label_en=en, order=i)

    def seed_stack(self):
        names = [
            "Next.js", "React", "TypeScript", "JavaScript",
            "HTML5 · CSS3", "Tailwind CSS", "Prisma", "SQL Server", "JIRA",
        ]
        for i, name in enumerate(names):
            TechStackItem.objects.update_or_create(
                name=name, defaults=dict(order=i, is_active=True)
            )

    def seed_team(self):
        members = [
            dict(
                name="Brailain Loic TONBA",
                role_fr="Ingénieur logiciel · Co-fondateur Horus-Lab",
                role_en="Software engineer · Horus-Lab co-founder",
                bio_fr="Développeur full-stack, je conçois des produits numériques de bout en bout pour des groupes multinationaux et des marques africaines.",
                bio_en="Full-stack developer building digital products end-to-end for multinational groups and African brands.",
                email="tonbaloic@gmail.com",
                linkedin_url="https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
                github_url="https://github.com/LoicTonba",
                is_lead=True, order=0,
            ),
            dict(
                name="Armel SIME",
                role_fr="PDG, SOFTRONIC INNOVING — partenaire technique",
                role_en="CEO, SOFTRONIC INNOVING — technical partner",
                bio_fr="Direction technique et stratégique des projets SFX déployés à travers 11 pays africains.",
                bio_en="Technical and strategic lead of the SFX products deployed across 11 African countries.",
                is_lead=True, order=1,
            ),
        ]
        for m in members:
            TeamMember.objects.update_or_create(name=m["name"], defaults=m)

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
        # Vraie portfolio Horus-Lab (alignée avec frontend/src/lib/projects.ts).
        # gradient = classes Tailwind sans le préfixe bg-gradient-to-br
        items = [
            dict(
                title_fr="SFX Pre-Douane", title_en="SFX Pre-Douane",
                client_fr="OMA Group · 11 pays africains",
                client_en="OMA Group · 11 African countries",
                category_fr="Logistique & Transit",
                category_en="Logistics & Transit",
                description_fr="Application web multinationale de gestion de transitaire pour le groupe OMA et ses filiales — un outil central utilisé quotidiennement à travers 11 pays africains.",
                description_en="Multinational web application for customs and freight forwarding for the OMA group and its subsidiaries — used daily across 11 African countries.",
                role_fr="Développeur full-stack", role_en="Full-stack developer",
                scope_fr="Application web métier multi-pays",
                scope_en="Multi-country business web app",
                tags=["Next.js", "TypeScript", "Prisma", "SQL Server", "Tailwind"],
                result_fr="11 pays · production", result_en="11 countries · live",
                icon="globe",
                gradient="from-brand-700 via-brand-500 to-sky",
                is_featured=True,
            ),
            dict(
                title_fr="Gathe Finance", title_en="Gathe Finance",
                client_fr="PME & freelances africains",
                client_en="African SMEs & freelancers",
                category_fr="Fintech & Gestion", category_en="Fintech & Management",
                description_fr="Plateforme de gestion financière pour indépendants et PME africaines : suivi multi-comptes (espèces, mobile money, banque), catégorisation, budgets, reporting.",
                description_en="Financial management platform for African freelancers and SMEs: multi-account tracking (cash, mobile money, bank), categorisation, budgets, reporting.",
                role_fr="Conception & développement", role_en="Design & development",
                scope_fr="Gestion financière PME · multi-comptes & reporting",
                scope_en="SME financial management · multi-account & reporting",
                tags=["Next.js", "TypeScript", "Prisma", "Postgres", "PWA"],
                result_fr="Trésorerie sous contrôle", result_en="Cash flow under control",
                icon="layers",
                gradient="from-slate-800 via-brand-700 to-amber-500",
            ),
            dict(
                title_fr="Afrikamode", title_en="Afrikamode",
                client_fr="Marque de mode africaine",
                client_en="African fashion brand",
                category_fr="Mode & e-commerce", category_en="Fashion & e-commerce",
                description_fr="L'Afrique de la mode ne se résume pas au folklore. Des ateliers de Lagos à Dakar, de Bamako à Abidjan, des créateurs réinventent chaque saison une esthétique précise, exigeante, contemporaine. Afrikamode les porte au regard du public — et porte une petite ligne maison.",
                description_en="African fashion is not folklore. From Lagos to Dakar, Bamako to Abidjan, designers reinvent a precise, demanding, contemporary aesthetic every season. Afrikamode brings them to your eye — and ships a small in-house line.",
                role_fr="Conception & développement", role_en="Design & development",
                scope_fr="Boutique en ligne · marque maison + créateurs invités",
                scope_en="Online shop · house line + guest designers",
                tags=["Next.js", "React", "Tailwind", "TypeScript", "e-commerce"],
                result_fr="afrikamode.store · en ligne",
                result_en="afrikamode.store · live",
                icon="spark",
                gradient="from-rose-500 via-orange-500 to-amber-400",
                url="https://afrikamode.store",
            ),
            dict(
                title_fr="Plateforme e-Learning", title_en="e-Learning platform",
                client_fr="Apprenants & professionnels IT",
                client_en="IT learners & professionals",
                category_fr="Éducation & EdTech", category_en="Education & EdTech",
                description_fr="Plateforme de formation aux métiers de l'informatique : développement web, Python, cybersécurité et plus encore. Parcours structurés et suivi des apprenants — pensée pour rendre la tech accessible partout en Afrique.",
                description_en="Training platform covering IT careers: web development, Python, cybersecurity and more. Structured tracks and learner tracking — built to make tech accessible everywhere across Africa.",
                role_fr="Conception & développement", role_en="Design & development",
                scope_fr="Plateforme de formation IT en ligne",
                scope_en="Online IT training platform",
                tags=["Next.js", "TypeScript", "Tailwind", "Vidéo", "PWA"],
                result_fr="Catalogue tech complet", result_en="Full tech catalogue",
                icon="eye",
                gradient="from-emerald-500 via-teal-500 to-sky",
            ),
            dict(
                title_fr="SFX eVAT", title_en="SFX eVAT",
                client_fr="OMA · FMG · CAPEWEST", client_en="OMA · FMG · CAPEWEST",
                category_fr="Finance & Fiscalité", category_en="Finance & Tax",
                description_fr="Plateforme multinationale de normalisation des factures, conforme aux exigences fiscales locales. Conception base de données + interfaces + chaîne d'intégration backend.",
                description_en="Multinational platform for invoice normalisation, compliant with local tax requirements. Database, UI and backend integration designed and built end-to-end.",
                role_fr="Développeur full-stack", role_en="Full-stack developer",
                scope_fr="SaaS de normalisation fiscale",
                scope_en="Tax-normalisation SaaS",
                tags=["Next.js", "TypeScript", "Prisma", "SQL Server"],
                result_fr="3 groupes · multi-pays",
                result_en="3 groups · multi-country",
                icon="layers",
                gradient="from-brand-800 via-brand-600 to-brand-400",
            ),
            dict(
                title_fr="SFX RelanceAuto", title_en="SFX RelanceAuto",
                client_fr="OMA Group", client_en="OMA Group",
                category_fr="Automatisation", category_en="Automation",
                description_fr="Application web de relances automatiques des clients : pipeline d'envoi, suivi des statuts, tableaux de bord temps réel.",
                description_en="Automated customer follow-up web app: send pipeline, status tracking, real-time dashboards.",
                role_fr="Développeur", role_en="Developer",
                scope_fr="Automatisation des relances clients",
                scope_en="Customer follow-up automation",
                tags=["Next.js", "TypeScript", "Prisma", "SQL Server"],
                result_fr="Pipeline automatisé", result_en="Automated pipeline",
                icon="cog",
                gradient="from-brand-600 via-sky to-brand-300",
            ),
            dict(
                title_fr="SOFTRONIC INNOVING — site corporate",
                title_en="SOFTRONIC INNOVING — corporate site",
                client_fr="SOFTRONIC INNOVING", client_en="SOFTRONIC INNOVING",
                category_fr="Site corporate", category_en="Corporate site",
                description_fr="Conception et réalisation du site institutionnel de SOFTRONIC INNOVING : identité, contenus, performance et SEO de bout en bout.",
                description_en="Design and build of the SOFTRONIC INNOVING corporate website: identity, content, performance and SEO end-to-end.",
                role_fr="Développeur frontend", role_en="Frontend developer",
                scope_fr="Site institutionnel responsive",
                scope_en="Responsive corporate site",
                tags=["Next.js", "React", "Tailwind", "TypeScript"],
                result_fr="En production", result_en="Live in production",
                icon="code",
                gradient="from-brand-900 via-brand-700 to-brand-500",
            ),
        ]
        # Reset puis recréation propre, parce qu'on a changé d'ensemble de projets.
        Project.objects.all().delete()
        for i, p in enumerate(items):
            Project.objects.create(order=i, is_active=True, **p)

    def seed_news(self):
        items = [
            dict(
                title_fr="Gathe Finance ouvre en bêta privée",
                title_en="Gathe Finance enters private beta",
                body_fr="Notre plateforme de gestion financière pour PME et freelances entre en bêta : suivi multi-comptes, budgets, reporting trésorerie. Les premiers utilisateurs rejoignent la liste d'attente.",
                body_en="Our financial management platform for SMEs and freelancers opens its private beta: multi-account tracking, budgets, cash-flow reporting. First users joining the waitlist.",
                tag_fr="Produit", tag_en="Product",
                published_at=date(2026, 5, 25),
            ),
            dict(
                title_fr="Afrikamode est en ligne sur afrikamode.store",
                title_en="Afrikamode is live on afrikamode.store",
                body_fr="La boutique en ligne d'Afrikamode ouvre ses portes : créateurs invités de Lagos à Abidjan + ligne maison. Catalogue, panier et paiement bout-en-bout.",
                body_en="Afrikamode opens its online store: guest designers from Lagos to Abidjan + the house line. Catalogue, cart and checkout end-to-end.",
                tag_fr="Lancement", tag_en="Launch",
                url="https://afrikamode.store",
                published_at=date(2026, 5, 12),
            ),
            dict(
                title_fr="Plateforme e-Learning — nouveau parcours Cybersécurité",
                title_en="e-Learning platform — new Cybersecurity track",
                body_fr="Le cycle Cybersécurité rejoint le développement web et Python. Modules progressifs, exercices guidés et certificats à la clé.",
                body_en="The Cybersecurity track joins web development and Python. Progressive modules, guided exercises and certificates.",
                tag_fr="Roadmap", tag_en="Roadmap",
                published_at=date(2026, 4, 10),
            ),
            dict(
                title_fr="SFX Pre-Douane étendu à 2 nouveaux pays",
                title_en="SFX Pre-Douane extended to 2 new countries",
                body_fr="Le déploiement multinational atteint désormais 11 filiales OMA à travers l'Afrique. Stabilité et performances confirmées en production.",
                body_en="Multinational rollout now reaches 11 OMA subsidiaries across Africa. Stability and performance confirmed in production.",
                tag_fr="Déploiement", tag_en="Rollout",
                published_at=date(2026, 3, 8),
            ),
            dict(
                title_fr="Partenariat renforcé avec SOFTRONIC INNOVING",
                title_en="Deepened partnership with SOFTRONIC INNOVING",
                body_fr="Aux côtés d'Armel SIME et de son équipe, nous prolongeons notre collaboration autour des produits SFX et de nouveaux projets africains.",
                body_en="Together with Armel SIME and his team, we are extending our collaboration on the SFX products and new African initiatives.",
                tag_fr="Partenariat", tag_en="Partnership",
                published_at=date(2026, 2, 14),
            ),
        ]
        for it in items:
            News.objects.update_or_create(
                title_fr=it["title_fr"], defaults=dict(**it, is_published=True),
            )
