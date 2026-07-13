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
        self.seed_team()
        self.seed_blog()
        self.seed_portfolio()
        self.seed_achievements()
        self.seed_stack()
        self.seed_news()
        self.stdout.write(self.style.SUCCESS("Seed terminé."))

    # ──────────────────────────────────────────────────────────

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
                subtitle_fr="Vos idées, nos solutions — du concept au déploiement.",
                subtitle_en="Your ideas, our solutions — from concept to deployment.",
                cta_primary_fr="Démarrer un projet",
                cta_primary_en="Start a project",
                cta_secondary_fr="Découvrir nos services",
                cta_secondary_en="Explore our services",
            ),
        )
        HeroStat.objects.all().delete()
        for i, (value, fr, en) in enumerate([
            ("8+",  "projets livrés",     "projects delivered"),
            ("4",   "pôles d'expertise",  "areas of expertise"),
            ("24/7","accompagnement",     "support"),
        ]):
            HeroStat.objects.create(value=value, label_fr=fr, label_en=en, order=i)

    def seed_services(self):
        # 4 services — sans ERP & Gestion
        items = [
            ("code", "Applications sur mesure", "Custom Applications",
             "Sites vitrines, plateformes, applications iOS / Android et PWA performantes, pensées pour vos utilisateurs.",
             "Websites, platforms, iOS / Android apps and high-performance PWAs, built around your users.",
             ["React", "Next.js", "Flutter", "PWA"]),
            ("eye", "Systèmes d'information", "Information Systems",
             "Analyse, conception et architecture de vos SI avec rigueur — méthode RUP, UML, audit de l'existant.",
             "Analysis, design and IS architecture with rigour — RUP method, UML, existing system audit.",
             ["UML", "RUP", "Architecture", "API"]),
            ("cog", "Digitalisation d'entreprise", "Business Digitalisation",
             "Dématérialisation, automatisation des workflows et outils de gestion adaptés à votre contexte africain.",
             "Dematerialisation, workflow automation and management tools adapted to your African context.",
             ["Automatisation", "CRM", "GED", "Cloud"]),
            ("spark", "Formation & Audit IT", "Training & IT Audit",
             "Formations techniques, ateliers pratiques, audit de code et de sécurité pour vos équipes.",
             "Technical training, hands-on workshops, code and security audits for your teams.",
             ["Formation", "Cybersécurité", "Audit", "Certification"]),
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
            ("Santé & e-Santé",    "Health & e-Health"),
            ("Éducation & EdTech", "Education & EdTech"),
            ("Agriculture & AgriTech", "Agriculture & AgriTech"),
            ("Commerce & e-Commerce",  "Commerce & e-Commerce"),
            ("Logistique & Transport", "Logistics & Transport"),
            ("Administration publique","Public administration"),
            ("Énergie & Environnement","Energy & Environment"),
        ]
        for i, (fr, en) in enumerate(items):
            Sector.objects.update_or_create(
                name_fr=fr, defaults=dict(name_en=en, order=i, is_active=True)
            )

    def seed_testimonials(self):
        # Doit refléter le dictionnaire frontend (src/i18n/dictionaries.ts) :
        # au 1er seed, la home reste identique, puis l'admin prend la main.
        items = [
            ("Aïcha N.", "Directrice Générale, FinPay", "CEO, FinPay",
             "Horus-Lab a conçu notre application sur mesure de bout en bout. Livraison dans les délais, qualité irréprochable et une équipe terriblement à l'écoute.",
             "Horus-Lab built our custom application end to end. On-time delivery, flawless quality and a team that genuinely listens.",
             True),
            ("Kwame O.", "Fondateur, AgriConnect", "Founder, AgriConnect",
             "Ils ont modélisé et architecturé notre système d'information avec une rigueur remarquable. Une base solide, documentée et évolutive sur laquelle nous construisons sereinement.",
             "They modelled and architected our information system with remarkable rigour. A solid, documented and scalable foundation we build on with confidence.",
             False),
            ("Sandrine M.", "Responsable des opérations, MediCare", "Operations Lead, MediCare",
             "La digitalisation de nos processus nous fait gagner un temps précieux chaque semaine. Workflows automatisés, validations dématérialisées : le papier a quasiment disparu.",
             "Digitalising our processes saves us precious time every single week. Automated workflows, paperless approvals — the paper has all but disappeared.",
             False),
            ("David K.", "Directeur des SI, LogiTrans", "Head of IT, LogiTrans",
             "Leur audit a révélé des failles que nous ignorions, et la formation a fait monter toute notre équipe en compétences. Un accompagnement concret et durable.",
             "Their audit uncovered gaps we didn't know we had, and the training levelled up our whole team. Hands-on, lasting support.",
             False),
        ]
        for i, (name, rfr, ren, qfr, qen, featured) in enumerate(items):
            Testimonial.objects.update_or_create(
                name=name,
                defaults=dict(role_fr=rfr, role_en=ren, quote_fr=qfr, quote_en=qen,
                              is_featured=featured, order=i, is_active=True),
            )

    def seed_partners(self):
        # Uniquement les partenaires/clients réels de Horus-Lab
        names = ["Gathe Finance", "Afrikamode"]
        for i, name in enumerate(names):
            Partner.objects.update_or_create(
                name=name, defaults=dict(order=i, is_active=True)
            )

    def seed_team(self):
        # Doit refléter la page « À propos » du frontend (about/page.tsx) : au 1er
        # seed les cartes fondateurs restent identiques, puis l'admin prend la main.
        # La photo (/public) est ré-associée par nom côté front ; un éditeur peut
        # aussi uploader une photo depuis l'admin.
        members = [
            dict(
                name="Brailain Loïc TONBA",
                role_fr="Ingénieur logiciel · Co-fondateur",
                role_en="Software engineer · Co-founder",
                bio_fr="Développeur full-stack et entrepreneur tech, je pilote la vision produit de Horus-Lab et conçois des solutions numériques de bout en bout pour des entreprises africaines et internationales. Passionné par l'impact de la technologie sur le continent.",
                bio_en="Full-stack developer and tech entrepreneur, I drive the product vision at Horus-Lab and build end-to-end digital solutions for African and international businesses. Passionate about technology's impact across the continent.",
                email="tonbaloic@gmail.com",
                linkedin_url="https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
                github_url="https://github.com/LoicTonba",
                is_lead=True, order=0,
            ),
            dict(
                name="Edwin TCHAMBA TCHAKOUNTE",
                role_fr="Architecte logiciel · Co-fondateur",
                role_en="Software architect · Co-founder",
                bio_fr="Senior Software Engineer & Architecte logiciel, passionné par la résolution de problèmes complexes et l'innovation technologique. Avec plus de 3 ans d'expérience en développement full-stack (web & mobile), conception d'APIs REST et déploiement cloud, je livre des solutions performantes et adaptées aux besoins réels. Maîtrise de la méthode RUP et de la modélisation UML. Formation IUT-FV & ENSPD. Lauréat du Prix du Meilleur Projet de Fin d'Études — IUT-FV Bandjoun (2024).",
                bio_en="Senior Software Engineer & Software Architect, driven by complex problem-solving and technological innovation. With 3+ years of hands-on experience in full-stack web & mobile development, REST API design and cloud deployment, I deliver high-performance solutions tailored to real-world needs. Expert in RUP methodology and UML modelling, trained at IUT-FV and ENSPD. Winner of the Best Final Year Project Award — IUT-FV Bandjoun (2024).",
                is_lead=True, order=1,
            ),
        ]
        # Supprimer Armel SIME s'il existe
        TeamMember.objects.filter(name="Armel SIME").delete()
        for m in members:
            TeamMember.objects.update_or_create(name=m["name"], defaults=m)

    def seed_blog(self):
        # Catégories orientées tech/tendances — sans ERP ni IA seule
        cats = {
            "dev":      ("Développement",          "Development"),
            "tech":     ("Actualités Tech",         "Tech News"),
            "digital":  ("Transformation Digitale", "Digital Transformation"),
            "africa":   ("Tech Afrique",            "Tech Africa"),
            "training": ("Formation IT",            "IT Training"),
        }
        cat_obj = {}
        for slug, (fr, en) in cats.items():
            cat_obj[slug], _ = Category.objects.update_or_create(
                slug=slug, defaults=dict(name_fr=fr, name_en=en)
            )

        posts = [
            # ── Actualités tech mondiales ──
            dict(
                slug="nvidia-blackwell-revolution-ia", cat="tech",
                tfr="NVIDIA Blackwell : la révolution silencieuse qui accélère l'IA mondiale",
                ten="NVIDIA Blackwell: the silent revolution accelerating global AI",
                efr="L'architecture Blackwell de NVIDIA redéfinit ce que les data centers peuvent faire. Voici pourquoi cela change tout pour les développeurs africains.",
                een="NVIDIA's Blackwell architecture redefines what data centres can do. Here's why it changes everything for African developers.",
                bfr="NVIDIA a dévoilé Blackwell, sa nouvelle architecture GPU, avec des performances doublées par rapport à Hopper sur les charges de travail LLM. Pour les startups et entreprises africaines qui veulent intégrer l'IA dans leurs produits, cela signifie des coûts de cloud inférence en baisse constante.\n\nConcrètement : des assistants clients alimentés par de grands modèles de langage deviennent accessibles à des budgets PME. Horus-Lab suit ces évolutions de près pour vous proposer les bonnes architectures au bon moment.",
                ben="NVIDIA unveiled Blackwell, its new GPU architecture, with doubled performance over Hopper on LLM workloads. For African startups and businesses integrating AI, this means consistently falling cloud inference costs.\n\nIn practice: customer assistants powered by large language models become accessible on SME budgets. Horus-Lab tracks these developments closely to offer you the right architectures at the right time.",
                tags=["NVIDIA", "IA", "GPU", "Tech"], date="2026-06-01",
            ),
            dict(
                slug="google-io-2026-annonces-cles", cat="tech",
                tfr="Google I/O 2026 : les annonces qui vont impacter votre business",
                ten="Google I/O 2026: the announcements that will impact your business",
                efr="Gemini Ultra 2, Project Astra, Android XR — Google a frappé fort. Décryptage des annonces avec un impact réel sur les entreprises africaines.",
                een="Gemini Ultra 2, Project Astra, Android XR — Google hit hard. Breaking down the announcements with real impact on African businesses.",
                bfr="Le Google I/O 2026 a marqué un tournant avec l'intégration de Gemini directement dans les outils de productivité (Workspace, Android). Pour les entreprises africaines, les implications sont concrètes : automatisation des workflows, génération de documents, traduction multilingue en temps réel.\n\nAndroid XR ouvre également un nouveau terrain pour les applications mobiles immersives.",
                ben="Google I/O 2026 marked a turning point with Gemini integration directly into productivity tools (Workspace, Android). For African businesses, the implications are tangible: workflow automation, document generation, real-time multilingual translation.\n\nAndroid XR also opens new ground for immersive mobile applications.",
                tags=["Google", "Gemini", "Android", "IA"], date="2026-05-28",
            ),
            dict(
                slug="anthropic-claude-4-africa", cat="tech",
                tfr="Claude 4 d'Anthropic : ce que les développeurs africains doivent savoir",
                ten="Anthropic Claude 4: what African developers need to know",
                efr="Anthropic continue de pousser les limites de la sécurité et des capacités des LLM. Claude 4 introduit des fonctionnalités qui intéressent directement les équipes tech.",
                een="Anthropic keeps pushing the limits of LLM safety and capabilities. Claude 4 introduces features that directly interest tech teams.",
                bfr="Claude 4 se distingue par sa capacité à raisonner sur de longs documents (200K tokens de contexte) et ses améliorations en code generation. Pour les équipes qui construisent des outils de traitement documentaire ou d'assistance au développement, c'est un bond significatif.\n\nL'API reste accessible et les tarifs compétitifs font de Claude 4 un candidat sérieux pour les intégrations en Afrique.",
                ben="Claude 4 stands out for its ability to reason over long documents (200K token context) and improvements in code generation. For teams building document processing tools or development assistance, this is a significant leap.\n\nThe API remains accessible and competitive pricing makes Claude 4 a serious candidate for African integrations.",
                tags=["Anthropic", "Claude", "LLM", "Dev"], date="2026-05-20",
            ),
            # ── Tech Afrique ──
            dict(
                slug="orange-mtn-5g-afrique-2026", cat="africa",
                tfr="5G en Afrique : Orange et MTN accélèrent, les opportunités s'ouvrent",
                ten="5G in Africa: Orange and MTN accelerate, opportunities open up",
                efr="Le déploiement 5G d'Orange et MTN dans plusieurs pays africains crée un nouveau terrain pour les applications mobiles et IoT. Voici ce que cela signifie pour les développeurs.",
                een="Orange and MTN's 5G rollout across multiple African countries creates new ground for mobile and IoT applications. Here's what it means for developers.",
                bfr="Orange a confirmé le déploiement commercial de la 5G au Maroc, en Côte d'Ivoire et au Cameroun. MTN accélère également en Afrique du Sud, Nigeria et Ghana. Ces déploiements ouvrent des opportunités concrètes : applications temps réel, télémédecine haute définition, agriculture connectée.\n\nPour les développeurs africains, maîtriser les architectures optimisées pour la 5G devient un avantage compétitif.",
                ben="Orange confirmed commercial 5G deployment in Morocco, Côte d'Ivoire and Cameroon. MTN is also accelerating in South Africa, Nigeria and Ghana. These rollouts open concrete opportunities: real-time applications, HD telemedicine, connected agriculture.\n\nFor African developers, mastering 5G-optimised architectures is becoming a competitive advantage.",
                tags=["Orange", "MTN", "5G", "Afrique"], date="2026-05-15",
            ),
            # ── Développement ──
            dict(
                slug="web-ou-mobile-par-ou-commencer", cat="dev",
                tfr="Web ou mobile : par où commencer pour votre produit numérique ?",
                ten="Web or mobile: where to start for your digital product?",
                efr="Site web, application mobile, PWA… Le choix de la plateforme conditionne votre budget, votre portée et votre vitesse de lancement.",
                een="Website, mobile app, PWA… Your platform choice drives your budget, reach and time-to-launch.",
                bfr="Commencez par vos utilisateurs. Une PWA offre souvent le meilleur des deux mondes : un seul code, pas de friction d'installation, des coûts maîtrisés.\n\nValidez votre idée vite, puis investissez dans le natif une fois la traction prouvée.",
                ben="Start with your users. A PWA often offers the best of both worlds: a single codebase, no install friction, controlled costs.\n\nValidate your idea fast, then invest in native once traction is proven.",
                tags=["Web", "Mobile", "PWA", "Stratégie"], date="2026-04-28",
            ),
            # ── Transformation digitale ──
            dict(
                slug="digitalisation-pme-africaines-guide", cat="digital",
                tfr="Comment digitaliser une PME africaine sans exploser son budget",
                ten="How to digitalise an African SME without blowing the budget",
                efr="La transformation digitale n'est pas réservée aux grandes entreprises. Voici un guide pratique pour les PME africaines qui veulent passer à l'action.",
                een="Digital transformation isn't reserved for large companies. Here's a practical guide for African SMEs ready to take action.",
                bfr="La clé est de commencer par les processus qui coûtent le plus cher en temps : facturation, suivi des stocks, communication client. Des outils SaaS modernes permettent d'automatiser ces tâches à des coûts mensuels accessibles.\n\nChez Horus-Lab, nous proposons une approche progressive : on commence par un audit de vos processus, puis on déploie par phases pour mesurer le ROI à chaque étape.",
                ben="The key is to start with the processes that cost the most time: invoicing, inventory tracking, customer communication. Modern SaaS tools automate these tasks at accessible monthly costs.\n\nAt Horus-Lab, we offer a phased approach: we start with a process audit, then deploy in stages to measure ROI at each step.",
                tags=["Digitalisation", "PME", "Afrique", "Automatisation"], date="2026-04-10",
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
        # Doit refléter le catalogue frontend (src/lib/projects.ts), même ordre :
        # au 1er seed la home/portfolio restent identiques, puis l'admin pilote.
        # Les logos (/public) et captures sont ré-associés par titre côté front ;
        # un éditeur peut aussi uploader un logo / des captures depuis l'admin.
        items = [
            dict(
                title_fr="Afrikamode", title_en="Afrikamode",
                client_fr="Italie · France · Belgique · Cameroun",
                client_en="Italy · France · Belgium · Cameroon",
                category_fr="Mode & e-commerce", category_en="Fashion & e-commerce",
                description_fr="Plateforme e-commerce internationale pour une marque de mode africaine présente en Europe et en Afrique. Catalogue multilingue, fiches produits, panier, paiement sécurisé. Des créateurs de Lagos à Abidjan, une ligne maison, une esthétique contemporaine — portée sur 4 pays.",
                description_en="International e-commerce platform for an African fashion brand present across Europe and Africa. Multilingual catalogue, product pages, cart, secure checkout. Designers from Lagos to Abidjan, an in-house line — live in 4 countries.",
                role_fr="Conception & développement", role_en="Design & development",
                scope_fr="Boutique e-commerce internationale",
                scope_en="International e-commerce store",
                tags=["Next.js", "React", "Tailwind", "TypeScript", "e-commerce"],
                result_fr="Live en Europe & Afrique", result_en="Live in Europe & Africa",
                icon="spark",
                gradient="from-rose-500 via-orange-500 to-amber-400",
                url="https://afrikamode.store",
                is_featured=True,
            ),
            dict(
                title_fr="Gathe Finance", title_en="Gathe Finance",
                client_fr="PME & freelances africains",
                client_en="African SMEs & freelancers",
                category_fr="Fintech & Gestion", category_en="Fintech & Management",
                description_fr="Plateforme de gestion financière pensée pour les indépendants et les PME africaines : suivi multi-comptes (espèces, mobile money, banque), catégorisation automatique des opérations, budgets et objectifs, tableaux de bord et reporting (trésorerie, P&L).",
                description_en="Financial management platform for African freelancers and SMEs: multi-account tracking (cash, mobile money, bank), auto-categorisation, budgets and goals, dashboards and reporting (cash flow, P&L).",
                role_fr="Conception & développement", role_en="Design & development",
                scope_fr="Gestion financière PME · multi-comptes & reporting",
                scope_en="SME financial management",
                tags=["Next.js", "TypeScript", "Prisma", "Postgres", "PWA"],
                result_fr="Trésorerie sous contrôle", result_en="Cash flow under control",
                icon="layers",
                gradient="from-slate-800 via-brand-700 to-amber-500",
            ),
            dict(
                title_fr="Plateforme e-Learning", title_en="e-Learning platform",
                client_fr="Apprenants & professionnels IT",
                client_en="IT learners & professionals",
                category_fr="Éducation & EdTech", category_en="Education & EdTech",
                description_fr="Plateforme de formation aux métiers de l'informatique : développement web, Python, cybersécurité et plus. Parcours structurés, ressources progressives et suivi des apprenants — pour rendre la tech accessible à tous, partout en Afrique.",
                description_en="Training platform covering IT careers: web development, Python, cybersecurity and more. Structured tracks, progressive resources and learner tracking — built to make tech accessible everywhere across Africa.",
                role_fr="Conception & développement", role_en="Design & development",
                scope_fr="Plateforme de formation IT en ligne",
                scope_en="Online IT training platform",
                tags=["Next.js", "TypeScript", "Tailwind", "Vidéo", "PWA"],
                result_fr="Catalogue tech complet", result_en="Full tech catalogue",
                icon="eye",
                gradient="from-emerald-500 via-teal-500 to-sky",
            ),
            dict(
                title_fr="Elec One", title_en="Elec One",
                client_fr="Secteur Énergie & Industrie",
                client_en="Energy & Industry sector",
                category_fr="Énergie & Industrie", category_en="Energy & Industry",
                description_fr="Application web de gestion et de supervision pour le secteur électrique et industriel : suivi des équipements, tableaux de bord temps réel, alertes et reporting. Conçue pour les professionnels de l'énergie qui veulent piloter leur infrastructure avec précision.",
                description_en="Web application for management and supervision in the electrical and industrial sector: equipment monitoring, real-time dashboards, alerts and reporting. Built for energy professionals who want to drive their infrastructure with precision.",
                role_fr="Conception & développement", role_en="Design & development",
                scope_fr="Application de gestion énergétique",
                scope_en="Energy management application",
                tags=["Next.js", "TypeScript", "Dashboard", "IoT", "Cloud"],
                result_fr="Supervision en temps réel", result_en="Real-time supervision",
                icon="cog",
                gradient="from-yellow-500 via-orange-400 to-red-500",
            ),
            dict(
                title_fr="Programme Formation IT", title_en="IT Training Programme",
                client_fr="Professionnels & entreprises",
                client_en="Professionals & businesses",
                category_fr="Formation", category_en="Training",
                description_fr="Programme de formation aux technologies modernes : développement web, mobile, cybersécurité, gestion de projet IT. Sessions pratiques adaptées au niveau des équipes et aux outils de l'entreprise.",
                description_en="Training programme on modern technologies: web & mobile development, cybersecurity, IT project management. Hands-on sessions adapted to team levels and company tools.",
                role_fr="Formation & accompagnement", role_en="Training & coaching",
                scope_fr="Formation IT sur mesure",
                scope_en="Custom IT training",
                tags=["Formation", "Cybersécurité", "Développement", "Certification"],
                result_fr="Équipes opérationnelles", result_en="Operational teams",
                icon="spark",
                gradient="from-brand-700 via-brand-500 to-sky",
            ),
        ]
        Project.objects.all().delete()
        for i, p in enumerate(items):
            Project.objects.create(order=i, is_active=True, **p)

    def seed_achievements(self):
        items = [
            ("8+",   "projets livrés",     "projects delivered"),
            ("4",    "pays couverts",      "countries covered"),
            ("11",   "filiales déployées", "subsidiaries deployed"),
            ("24/7", "accompagnement",     "support"),
        ]
        Achievement.objects.all().delete()
        for i, (value, fr, en) in enumerate(items):
            Achievement.objects.create(value=value, label_fr=fr, label_en=en, order=i)

    def seed_stack(self):
        names = [
            "React", "Next.js", "TypeScript", "Flutter", "Python", "Django",
            "PostgreSQL", "Docker", "REST API", "Tailwind CSS", "Node.js",
            "Cybersécurité",
        ]
        TechStackItem.objects.all().delete()
        for i, name in enumerate(names):
            TechStackItem.objects.create(name=name, order=i, is_active=True)

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
                body_fr="La boutique en ligne d'Afrikamode ouvre ses portes : créateurs invités de Lagos à Abidjan et ligne maison. Catalogue, panier et paiement bout-en-bout.",
                body_en="Afrikamode opens its online store: guest designers from Lagos to Abidjan and the house line. Catalogue, cart and checkout end-to-end.",
                tag_fr="Lancement", tag_en="Launch",
                url="https://afrikamode.store",
                published_at=date(2026, 5, 12),
            ),
            dict(
                title_fr="Plateforme e-Learning : nouveau parcours Cybersécurité",
                title_en="e-Learning platform: new Cybersecurity track",
                body_fr="Le cycle Cybersécurité rejoint le développement web et Python. Modules progressifs, exercices guidés et certificats à la clé.",
                body_en="The Cybersecurity track joins web development and Python. Progressive modules, guided exercises and certificates.",
                tag_fr="Roadmap", tag_en="Roadmap",
                published_at=date(2026, 4, 10),
            ),
            dict(
                title_fr="SFX Pre-Douane étendu à 2 nouveaux pays",
                title_en="SFX Pre-Douane extended to 2 new countries",
                body_fr="Le déploiement multinational atteint désormais 11 filiales à travers l'Afrique. Stabilité et performances confirmées en production.",
                body_en="The multinational rollout now reaches 11 subsidiaries across Africa. Stability and performance confirmed in production.",
                tag_fr="Déploiement", tag_en="Rollout",
                published_at=date(2026, 3, 8),
            ),
        ]
        News.objects.all().delete()
        for p in items:
            News.objects.create(is_published=True, **p)
