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
                subtitle_fr="Vos idées, nos solutions, du concept au déploiement.",
                subtitle_en="Your ideas, our solutions, from concept to deployment.",
                cta_primary_fr="Démarrer un projet",
                cta_primary_en="Start a project",
                cta_secondary_fr="Découvrir nos services",
                cta_secondary_en="Explore our services",
            ),
        )
        HeroStat.objects.all().delete()
        for i, (value, fr, en) in enumerate([
            ("5",   "projets livrés",     "projects delivered"),
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
             "Analyse, conception et architecture de vos SI avec rigueur : méthode RUP, UML, audit de l'existant.",
             "Analysis, design and IS architecture with rigour: RUP method, UML, existing system audit.",
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
        # Reflète la section Témoignages du frontend (5 clients réels + photos).
        items = [
            ("Paule Diane Himsta",
             "Présidente Directrice · Broad Range Consulting (CFP-BRC)",
             "Managing Director · Broad Range Consulting (CFP-BRC)",
             "Horus-Lab a digitalisé notre centre de formation avec un vrai sens du détail. Une plateforme claire, fiable et pensée pour nos apprenants, du début à la fin.",
             "Horus-Lab digitalised our training centre with a real eye for detail. A clear, reliable platform built for our learners, from start to finish.",
             "/Temoignages/Mme-paul-diane-himsta.png", False, True),
            ("Paule Diane Himsta",
             "Présidente Directrice · CGA Broad Range Consulting",
             "Managing Director · CGA Broad Range Consulting",
             "Nos outils de gestion sont enfin à la hauteur de nos ambitions. Une équipe sérieuse, disponible, et un accompagnement impeccable à chaque étape.",
             "Our management tools finally match our ambitions. A serious, available team, with flawless support at every step.",
             "/Temoignages/Mme-paul-diane-himsta.png", False, False),
            ("Pagop Tchouansi Aurélie", "Responsable · AfrikaMode", "Manager · AfrikaMode",
             "Notre boutique en ligne Afrikamode est fluide, rapide et fidèle à notre image. Horus-Lab a traduit notre univers mode en une vraie expérience e-commerce africaine.",
             "Our Afrikamode online store is smooth, fast and true to our brand. Horus-Lab turned our fashion universe into a real African e-commerce experience.",
             "/Temoignages/Mme-pagop-Tchouansi-aurelie.png", False, False),
            ("Dr Agnès Virginie TJAHE", "Présidente Directrice · 2MeTech Sarl", "Managing Director · 2MeTech Sarl",
             "Avec Elec One et EnMKit, Horus-Lab a transformé notre vision en une application mobile concrète : nos utilisateurs pilotent et réduisent leur consommation d'électricité à distance. Un travail remarquable.",
             "With Elec One and EnMKit, Horus-Lab turned our vision into a real mobile app: our users control and reduce their electricity consumption remotely. Remarkable work.",
             "/Temoignages/Dr-Agnes-Virgine-TJAHE.png", False, False),
            ("Département Informatique", "IUT-FV de Bandjoun · Université de Dschang", "IUT-FV Bandjoun · University of Dschang",
             "Un accompagnement technique de qualité pour notre département informatique : rigueur, pédagogie et des solutions adaptées à nos réalités académiques.",
             "Quality technical support for our computer science department: rigour, teaching skill and solutions tailored to our academic realities.",
             "/Temoignages/iut-fv-university-of-dschang.jpg", True, False),
        ]
        Testimonial.objects.all().delete()
        for i, (name, rfr, ren, qfr, qen, img, is_logo, featured) in enumerate(items):
            Testimonial.objects.create(
                name=name, role_fr=rfr, role_en=ren, quote_fr=qfr, quote_en=qen,
                image_path=img, is_logo=is_logo, is_featured=featured, order=i, is_active=True,
            )

    def seed_partners(self):
        # Partenaires/clients réels (reflète components/sections/Partners.tsx).
        items = [
            ("Broad Range Consulting · CFP-BRC", "/Nos-partenaires/CFP-Broad-Range-Consulting-logo.jpg", "https://www.cfp-brcgroup.com/"),
            ("CGA Broad Range Consulting", "/Nos-partenaires/CGA-Broad-Range-Consulting-logo.jpg", "https://www.cga-brcgroup.com/"),
            ("2MeTech Sarl", "/Nos-partenaires/logo-2MeTech-bgWHITE.png", "https://www.2metechsarl.org/"),
            ("Afrikamode", "/Nos-partenaires/logo-Afrikamode.jpeg", "https://www.afrikamode.store/"),
            ("IUT-FV de Bandjoun · Université de Dschang", "/Nos-partenaires/iut-fv-university-of-dschang.jpg", "https://www.univ-dschang.org/iutfv/"),
        ]
        Partner.objects.all().delete()
        for i, (name, logo_path, url) in enumerate(items):
            Partner.objects.create(name=name, logo_path=logo_path, url=url, order=i, is_active=True)

    def seed_team(self):
        # Doit refléter la page « À propos » du frontend (about/page.tsx) : au 1er
        # seed les cartes fondateurs restent identiques, puis l'admin prend la main.
        # La photo (/public) est ré-associée par nom côté front ; un éditeur peut
        # aussi uploader une photo depuis l'admin.
        members = [
            dict(
                name="Edwin TCHAMBA TCHAKOUNTE",
                role_fr="Architecte logiciel · Co-fondateur",
                role_en="Software architect · Co-founder",
                bio_fr="Architecte logiciel et ingénieur senior. J'assemble des applications web et mobiles robustes — APIs REST, cloud, méthodes RUP & UML — pensées pour durer et passer à l'échelle. Lauréat du Prix du Meilleur Projet de Fin d'Études, IUT-FV Bandjoun (2024).",
                bio_en="Software architect and senior engineer. I build robust web and mobile applications — REST APIs, cloud, RUP & UML methods — designed to last and scale. Winner of the Best Final Year Project Award, IUT-FV Bandjoun (2024).",
                photo_path="/A-propos/photo-Edwin-co-founder.png",
                github_url="https://github.com/EdwinTchakounte",
                whatsapp_url="https://wa.me/237673398046",
                email="tchambaedwin@gmail.com",
                badge_fr="Co-fondateur", badge_en="Co-founder",
                gradient="from-slate-800 via-brand-700 to-amber-500",
                is_lead=True, order=0,
            ),
            dict(
                name="Loïc DJIMGOU TONBA",
                role_fr="Ingénieur logiciel · Co-fondateur",
                role_en="Software engineer · Co-founder",
                bio_fr="Ingénieur full-stack et entrepreneur, je transforme des idées en produits numériques qui marchent — du web au mobile, du concept au déploiement. Je pilote la vision produit de Horus-Lab pour des clients africains et internationaux, convaincu que la tech est un vrai levier de croissance pour le continent.",
                bio_en="Full-stack engineer and entrepreneur, I turn ideas into digital products that ship — web and mobile, from concept to deployment. I lead Horus-Lab's product vision for African and international clients, convinced that technology is a real growth engine for the continent.",
                photo_path="/A-propos/photo-loic-tonba-cofounder.png",
                linkedin_url="https://www.linkedin.com/in/brailain-loic-tonba-djimgou-483215259",
                github_url="https://github.com/LoicTonba",
                whatsapp_url="https://wa.me/237699173771",
                email="tonbaloic@gmail.com",
                badge_fr="Co-fondateur", badge_en="Co-founder",
                gradient="from-brand-700 via-brand-500 to-sky",
                is_lead=True, order=1,
            ),
        ]
        TeamMember.objects.all().delete()
        for m in members:
            TeamMember.objects.create(**m)

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
                efr="Gemini Ultra 2, Project Astra, Android XR : Google a frappé fort. Décryptage des annonces avec un impact réel sur les entreprises africaines.",
                een="Gemini Ultra 2, Project Astra, Android XR: Google hit hard. Breaking down the announcements with real impact on African businesses.",
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
                client_fr="Italie · Cameroun",
                client_en="Italy · Cameroon",
                category_fr="Mode & e-commerce", category_en="Fashion & e-commerce",
                description_fr="Plateforme e-commerce pour une marque de mode africaine présente en Italie et au Cameroun. Catalogue multilingue, fiches produits, panier, paiement sécurisé. Une ligne maison et des créateurs invités, une esthétique contemporaine, disponible dans 2 pays.",
                description_en="E-commerce platform for an African fashion brand present in Italy and Cameroon. Multilingual catalogue, product pages, cart, secure checkout. An in-house line and guest designers, a contemporary aesthetic, live in 2 countries.",
                role_fr="Conception & développement", role_en="Design & development",
                scope_fr="Boutique e-commerce internationale",
                scope_en="International e-commerce store",
                tags=["Next.js", "React", "Tailwind", "TypeScript", "e-commerce"],
                result_fr="En ligne en Italie & au Cameroun", result_en="Live in Italy & Cameroon",
                icon="spark",
                gradient="from-sky via-brand-500 to-brand-700",
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
                description_fr="Plateforme de formation aux métiers de l'informatique : développement web, Python, cybersécurité et plus. Parcours structurés, ressources progressives et suivi des apprenants, pour rendre la tech accessible à tous, partout en Afrique.",
                description_en="Training platform covering IT careers: web development, Python, cybersecurity and more. Structured tracks, progressive resources and learner tracking, built to make tech accessible everywhere across Africa.",
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
        ]
        Project.objects.all().delete()
        for i, p in enumerate(items):
            Project.objects.create(order=i, is_active=True, **p)

    def seed_achievements(self):
        items = [
            ("5",    "projets livrés",     "projects delivered"),
            ("4",    "pôles d'expertise",  "areas of expertise"),
            ("2",    "pays couverts",      "countries covered"),
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
                body_fr="La boutique en ligne d'Afrikamode ouvre ses portes, avec une ligne maison et des créateurs invités. Catalogue, panier et paiement de bout en bout.",
                body_en="Afrikamode opens its online store, with an in-house line and guest designers. Catalogue, cart and checkout end to end.",
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
        ]
        News.objects.all().delete()
        for p in items:
            News.objects.create(is_published=True, **p)
