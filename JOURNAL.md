# JOURNAL — Horus-Lab

> Fichier de suivi de l'état du projet et de ce qui a été fait / reste à faire.
> Tenu à jour par l'assistant (Claude) après chaque session d'analyse ou de travail.
> **Convention** : entrée la plus récente en haut. Dates au format AAAA-MM-JJ.

---

## 2026-07-24 — 📣 Bannière Edlearning + anonymisation formateurs + retrait tirets (NON commité)

Demande client : rendre l'annonce « ce site n'est qu'un aperçu, la vraie
formation est sur l'app Edlearning » **accrochante mais non agressive**, masquer
l'identité des formateurs dans le catalogue, et retirer les tirets cadratins (—)
du site (tell d'écriture IA).

**1. Bannière Edlearning (nouveau `components/EdlearningPromo.tsx`)** — carte
flottante **bas-gauche** (le bas-droite est pris par le chat + back-to-top),
**non bloquante** (pas un modal). Logo Edlearning, titre accrochant, message
d'aperçu, **badge « Google Play »** (SVG inline, triangle dégradé
bleu→vert→jaune→rouge). Fermable (× ), choix **mémorisé**
(`localStorage: edlearning-promo-dismissed`) → ne réapparaît pas. Slide-in doux
après 700 ms. Bilingue FR/EN. Montée **site entier** dans `app/[lang]/layout.tsx`.
Le paragraphe « aperçu » a été **retiré du hero** de `formations/page.tsx` (il
vit désormais dans la bannière).

**1bis. Bannière pilotée par le CMS (comme le reste du contenu).** Nouveau modèle
singleton **`content.FormationsPromo`** (badge/titre/corps FR+EN, label store,
`play_url`, `logo_path`, **`is_active` = interrupteur d'affichage**). Chaîne
complète alignée sur le pattern existant : serializer + **endpoint
`/api/formations-promo/`** (APIView) + admin (`Bannière Formations (Edlearning)`)
+ **migration `content/0004_formationspromo.py`** (écrite à la main, Django tourne
via Docker) + seed. Côté front : **`getCmsFormationsPromo(lang)`** dans `cms.ts`
(repli `null` → textes intégrés au composant), fetch dans le layout (parallélisé
avec `getCmsSiteSettings`) → passé en prop. L'admin peut **modifier le texte, le
lien Play Store, et masquer la bannière** sans toucher au code.
- ⚠️ **Lien Play Store = placeholder par défaut** (`play.google.com/store/search?q=Edlearning`),
  désormais **modifiable dans l'admin** → Bannière Formations. À remplacer par
  l'URL exacte `.../details?id=<package>` quand connue.
- ⚠️ **Prod** : appliquer la **migration** (`manage.py migrate content`) puis
  re-seed si voulu (`manage.py seed`).

**2. Formateurs anonymisés (catalogue)** — dans `lib/courses.ts` **et**
`courses/management/commands/seed_courses.py`, les 3 entrées `TEAM`
(Loïc DJIMGOU TONBA, Edwin TCHAMBA, « Mentors Horus-Lab ») pointent maintenant
toutes vers **« Équipe Horus-Lab »**, **sans rôle** (choix client : nom seul).
Fiche cours (`formations/[slug]/page.tsx`) : la ligne du rôle ne s'affiche plus
si vide. → Les apprenants découvriront leurs formateurs pendant la formation.
- ⚠️ **Re-seed requis** côté serveur pour la prod (CMS) : `python manage.py seed_courses`.
- Note : la page **À propos** garde Edwin & Loïc (équipe réelle de l'entreprise,
  hors périmètre de la demande qui visait le catalogue).

**3. Tirets cadratins (—) retirés du texte visible** (17 remplacements via
sous-agent + fichiers catalogue faits à la main) : titres `A — B` → `A : B`,
incises → virgules. Fichiers : `courses.ts`, `seed_courses.py`, `projects.ts`,
`about/page.tsx`, `content/.../seed.py`, `portfolio/page.tsx`, `ProjectGallery.tsx`,
`api/chat/route.ts`. **Non touchés** : commentaires de code, séparateurs
décoratifs `── ──`, migrations Django, prompts système / e-mails sortants (non affichés).

**Ajustements (suite retours client) :**
- **La bannière réapparaît au rechargement** : retrait de la persistance
  `localStorage` (elle ne « disparaissait » plus jamais après une fermeture).
  Désormais fermeture = masquée pendant la navigation SPA, mais **réaffichée au
  refresh** (état React en mémoire, pas de storage).
- **Deux messages selon la page** (détection via `usePathname`) : pages
  **/formations** → aperçu Edlearning + Play Store ; **autres pages** → annonce
  « Nos formations gratuites démarrent le **mardi 1er septembre 2026** » + CTA
  interne vers `/formations`. Les DEUX variantes sont **éditables au CMS** :
  8 nouveaux champs `teaser_*` sur `FormationsPromo` (+ **migration
  `0005_formationspromo_teaser`**, admin, seed) ; `CmsPromo` restructuré en
  `{ preview, teaser }`.
- **Libellé formateur = « Formateurs Horus-Lab »** (au lieu de « Équipe
  Horus-Lab »), toujours **sans rôle**, dans `courses.ts` **et** `seed_courses.py`.
  Tous les cours (Dart, Flutter, Python, etc.) pointent vers cette unique entrée →
  aucun nom individuel. ⚠️ Rappel : re-seed (`seed_courses`) requis pour que la
  base CMS reflète le changement (la donnée live vient de Django).

**Ajustements (suite 2) :**
- **Noms formateurs vraiment retirés du catalogue, sans dépendre du re-seed** :
  le catalogue affichait le formateur **directement depuis la base CMS**
  (`cms.ts mapCourseListItem` → cartes `CourseCatalog` + fiche cours), donc les
  anciens noms restaient tant que la base n'était pas re-seedée. Désormais le
  frontend **force** `instructor = { name: "Formateurs Horus-Lab", role: "" }`
  quelles que soient les valeurs en base → plus aucun nom individuel, base à jour
  ou non. Ligne du rôle masquée si vide sur les cartes (`CourseCatalog`).
- **Bannière : réapparition aussi au changement de page** (pas seulement au
  refresh). `EdlearningPromo` enveloppe désormais un `PromoCard` **monté avec
  `key={pathname}`** → remontage à chaque navigation → l'animation d'entrée se
  rejoue même si la bannière avait été fermée sur la page précédente.

**Vérifs** : `tsc --noEmit` OK, ESLint OK, `py_compile` OK, `next build` OK (75 pages).
⚠️ Prod : appliquer `migrate content` (migrations **0004 + 0005**) ; le re-seed
`seed_courses` reste conseillé pour nettoyer la base, mais **n'est plus requis**
pour masquer les noms (le frontend les force).
⏳ **Pas encore fait** (demande à venir) : rendre la **durée/période de l'annonce
paramétrable au CMS** (date de début + durée → fin, ex. 1 sept + 1 mois = 1 oct,
avec auto-expiration de la bannière).

---

## 2026-07-23 — 🔌 Alignement CMS Phase 1 + retrait Google OAuth (NON commité)

Audit frontend↔backend (via sous-agent) : le backend est plus complet que ce que
le frontend consommait. **Témoignages, Partenaires, Équipe** avaient des modèles
mais n'étaient PAS câblés (codés en dur). 3 zones n'ont aucun modèle (pages
Services détail, contenu À propos, annonce Formations) = Phase 2.

**Retrait Google OAuth** (plus nécessaire) : endpoint `/api/auth/google/`, réglage
`GOOGLE_CLIENT_ID`, dépendance `google-auth`, test et guide supprimés. Reste
l'auth e-mail + JWT. `manage.py check` 0, tests accounts 4/4.

**Phase 1 — câblage CMS (fait, vérifié) :**
- **Modèles `content`** (+ migration `0003`) : `Testimonial.image_path`+`is_logo` ;
  `Partner.logo_path` ; `TeamMember.photo_path`+`whatsapp_url`+`badge_fr/_en`+`gradient`.
  Pattern `*_path` = chemin `/public` (comme `courses.image`), l'upload admin reste
  prioritaire.
- **Serializers** : nouveaux champs exposés.
- **seed** : 5 témoignages réels (photos `/Temoignages`, 1 featured), 5 partenaires
  (logos `/Nos-partenaires` + URLs), équipe Edwin & Loïc DJIMGOU TONBA (photos
  `/A-propos`, badges, WhatsApp, gradients, bios réécrites).
- **`cms.ts`** : `getCmsTestimonials` (→ image+logo, repli []), **nouveau
  `getCmsPartners`**, `getCmsTeam` enrichi (photo_path/badge/gradient/whatsapp).
- **Front câblé** : `page.tsx` fetch témoignages+partenaires → props ;
  `Testimonials`/`Partners` acceptent une prop (repli statique si vide) ;
  `about/page.tsx` réactive `getCmsTeam` (repli statique). tsc OK.
- **Vérifié** : `/api/testimonials/`=5, `/api/partners/`=5, `/api/team/`=2 avec les
  bons champs.

**Reste (Phase 2 — nouveaux modèles)** : `CoursesPageSettings` (annonce Formations
« 100% gratuit · 1er sept 2026 » + note Edlearning + hero), `AboutPage` (mission/
vision/valeurs/approche), `ServiceDetail`+sous-modèles (pages Services détail).

---

## 2026-07-23 — 🎨 Vidéos héros (africaines) + Blog (sous-menus, logos) + slides (NON commité)

- **6 vidéos** téléchargées (Pexels, libres) : **4 services** re-téléchargées avec des
  **personnes africaines** (dev, ingénieurs data, équipe bureau, formateur) →
  `public/services/*.mp4` (déjà câblées) ; **About** hero = vidéo jeunesse tech
  africaine (`public/A-propos/about-hero.mp4`) ; **Blog** hero = vidéo actu/data
  (`public/blog/blog-hero.mp4`). Heros About & Blog passés en `HeroBackground`
  (vidéo + poster de repli), vague retirée.
- **Blog — sous-menus navbar par catégorie** : `Header` a désormais un **dropdown
  Blog** (desktop + mobile) → `/blog?cat=<catégorie>`. `BlogIndex` filtre via
  `initialCategory` (lu depuis `searchParams` dans `blog/page.tsx`).
- **Blog — logos des boîtes citées** : détecteur `lib/blogCompanies.ts` (Google,
  Gemini, NVIDIA, Meta/Facebook, Apple, Anthropic/Claude, Orange — SVG simple-icons
  dans `public/logo/companies/`, casse-sensible pour éviter les faux positifs) ;
  **miniatures** (18-20px) affichées sur les cartes (`PostCard` + article à la une).
  Cartes blog sans bordure.
- **Formations — hero en slides d'images par domaine** : nouveau composant
  `DomainSlides` (fondu enchaîné web/mobile/génie-logiciel/IA, repli statique).
  Plus de vidéo sur ce hero (un aperçu vidéo est déjà sur chaque cours).

tsc OK. **⚠️ Logos manquants** : amazon/openai/microsoft absents de simple-icons
(develop) → non inclus (ajoutables si besoin).

---

## 2026-07-22 — 🎨 Réalisations (logos tech) + 3 nouveaux cours (NON commité)

- **Logos tech** téléchargés (devicon, dans `public/tech/`) : firebase, nginx, dart,
  html5, css3 (+ les 12 déjà présents).
- **Réalisations (PortfolioGrid)** : tags texte → **logos tech compacts** (24px,
  gris→couleur au survol) par projet — Web : Next/Tailwind/FastAPI/Django/Postgres/
  Docker/nginx ; Mobile : Dart/Flutter/Firebase. **Afrikamode** : vidéo
  `Realisations/Afrikamode-realisations.mp4` en couverture (boucle). Cartes sans
  bordure. Espaces grille + CTA réduits.
- **3 nouveaux cours** (courses.ts + seed, FR/EN, vidéos vérifiées oEmbed) :
  **HTML5 & CSS3** (web, Grafikart/freeCodeCamp), **Python : les bases** (web,
  CodeAvecJonathan/Mosh), **Dart : les bases** (mobile, Alex Mercier/freeCodeCamp).
  Placés comme fondations (avant React / avant Flutter). Seed OK = **12 formations**.
  tsc OK.

**⏳ Encore en cours** : agent vidéo (services africains + About + Blog). **Reste** :
Formations hero en slides d'images par domaine ; Blog (hero vidéo, sous-menus navbar
par catégorie, logos boîtes citées).

---

## 2026-07-22 — 🎨 Sweep multi-pages (Formations/About/Contact/Réalisations) (NON commité)

Grande passe multi-pages (tsc OK). Dossiers réorganisés par l'utilisateur :
logos → `public/logo/`, photos équipe → `public/A-propos/`, témoins → `public/Temoignages/`,
vidéo Afrikamode → `public/Realisations/Afrikamode-realisations.mp4`.

**Fait cette session**
- **Footer** : mention légale **retirée** (pas encore de forme juridique).
- **Formations** : **mur e-mail SUPPRIMÉ** (CoursePlayer = accès libre/gratuit) ;
  **note « aperçu → formation complète sur l'app Edlearning (Play Store) »** dans le
  hero ; titres unifiés centrés (Explorez par domaine, Notre catalogue) sans tirets ;
  **4 domaines sur une ligne** (`lg:grid-cols-4`) ; espacements réduits ; cartes sans
  bordure ; hero aligné sur l'accueil (titre/sous-titre réduits, chip sans bordure).
- **Catalogue cours** (courses.ts + seed) : rôle formateur **« Co-fondateur » →
  « Mentor du parcours »** ; **« Loïc TONBA » → « Loïc DJIMGOU TONBA »**.
- **À propos** : nom **« Brailain Loïc TONBA » → « Loïc DJIMGOU TONBA »** partout ;
  **ordre inversé** (Edwin à gauche, Loïc à droite) + titre commun ; **bios réécrites**
  (plus vendeuses) ; photos → `/A-propos/` ; « Notre approche » centré ; « Nos valeurs »
  réduit (taille+espacement) ; sections resserrées ; cartes sans bordure.
- **Contact** : titre **centré** (SectionHeading, sans tiret), « Démarrons la
  conversation » + sous-titre réduits/sur une ligne, **colonnes de même hauteur**
  (`items-stretch`), cartes sans bordure, espacement réduit.
- **Réalisations** (projects.ts) : projet **« Formation IT » supprimé** ; chemins
  logo corrigés → `/logo/*.png`.

**⚠️ Reste à faire (media/contenu — à enchaîner)**
- **Vidéos à télécharger** (2 agents ont échoué sur ECONNRESET, à relancer) :
  vidéos services avec **personnes noires/africaines** (alternance) ; **vidéo vision
  Afrique** pour hero About ; **vidéo actu tech** pour hero Blog (+ image de repli).
- **Formations** : hero en **slides d'images par domaine** (au lieu d'une vidéo) —
  besoin d'un petit composant client + images.
- **Nouveaux cours** : HTML5 & CSS3 (web) ; bases **Dart/Flutter** (mobile) ; bases
  **Python** (avant Django) — à ajouter dans courses.ts + seed + vidéos.
- **Réalisations** : intégrer la vidéo Afrikamode ; remplacer les tags texte par des
  **logos tech** (Next/Tailwind/FastAPI/Django/Postgres/Docker/nginx ; Dart/Flutter/
  Firebase) sans épaissir les cartes (manque logos firebase/nginx) ; réduire l'écart
  « Votre projet sera le prochain ? ».
- **Blog** : hero vidéo actu ; **sous-menus navbar par catégorie** ; logos miniatures
  des boîtes citées (Google, Orange, Gemini, NVIDIA…) dans les cartes.

---

## 2026-07-22 — 🎨 Pages Services + héros autres pages harmonisés (NON commité)

Report des critères de l'accueil sur les **4 pages Services** (composant partagé
`services/[slug]/page.tsx` → un seul fix couvre les 4 sous-menus) :
- **Hero** façon accueil : **vidéo en boucle par service** (`HeroBackground`),
  hauteur `54vh`, titre/sous-titre plus petits, **vague retirée**, chip sans
  bordure, rectangle net. 4 vidéos Pexels (libres, sans attribution) dans
  `public/services/{applications,systemes-information,digitalisation,formation-audit}.mp4`
  (720p, 2.6–8.3 Mo). Poster = image du service en repli.
- **Intro** compacte (~2 lignes, police réduite) ; écart réduit avec la suite.
- **« Nos domaines d'intervention »** : `SectionHeading` unifié centré ; **4 cartes
  sur une ligne** (`lg:grid-cols-4`), images réduites, sans bordures.
- **« Notre démarche »** (`ServiceProcessSection`) : titre unifié centré (light),
  compact, cartes sans bordure.
- **« Ce que vous recevez »** : **centré, icône au-dessus** du titre, sans encadré.
- **« Nos autres services »** : titre centré, compact.
- **« Prêt à lancer votre projet ? »** (`ServiceContactSection`) : titre plus
  petit, sous-titre sur une ligne, rectangle et espacements réduits.
- Espacements inter-sections resserrés partout ; bordures retirées des cartes.

**Héros harmonisés aussi** (vague retirée, hauteur `52-54vh`, titres réduits,
chips/cartes sans bordure) sur : **About**, **Portfolio**, **Formations**.

tsc OK. **Reste (autres pages)** : unifier les titres internes (mission/vision
d'About, sections Portfolio) encore en ancien style à tirets, et héros Blog/Contact
— à faire au prochain passage.

---

## 2026-07-22 — 🎨 Accueil (itération 2) : logos, vidéo, témoignages, navbar (NON commité)

- **Nouveaux logos** (l'utilisateur a remplacé les fichiers dans `public/`) :
  `logo-light-bg-full.png` (fond clair), `logo-dark-bg-full.png` (fond sombre),
  `logo-dark-bg-horizontal.png` (horizontal, fond sombre). Anciens `logo-HORUS-LAB-*`
  **supprimés** → **toutes** les refs corrigées (Header light/dark, Footer =
  horizontal, watermarks CTA/Témoignages = dark-bg-full, not-found swap light/dark,
  manifest/layout/JSON-LD/blog = light-bg-full).
- **Hero** : hauteur encore réduite (`min-h-[54vh]`), titre/sous-titre plus petits,
  **chips services retirés** (désencombrement). **Vidéo remplacée** : homme **noir
  qui code** (Pexels #6330773, libre, sans attribution).
- **Bandeau tech** : label « Technologies que nous maîtrisons » → **« Les
  technologies que nous utilisons »** (affirmatif) ; badges texte → **vrais logos
  qui défilent** (12 SVG devicon dans `public/tech/`, marquee).
- **Témoignages : 5** (au lieu de 4), attributions corrigées : **Paule Diane
  Himsta = PD de CFP-BRC ET de CGA** (2 témoignages), **Pagop Tchouansi Aurélie =
  Responsable AfrikaMode** (plus CGA). Photos déplacées → chemins `/Temoignages/`.
- **Navbar réordonnée** (logique de vente) : Services → Formations → Réalisations →
  À propos → Blog → Contact.

tsc OK · aucune référence d'image cassée.

---

## 2026-07-22 — 🎨 Refonte page d'Accueil (sérieux & compact) (NON commité)

Grosse passe design sur l'accueil (inspiration humanbcorp.com), tsc OK.

- **Hero** : hauteur réduite (`min-h-[66vh]`), **vague supprimée**, **fond VIDÉO
  en boucle** (`/hero-video.mp4`, Mixkit « ingénieur qui programme », libre de
  droits, 4,6 Mo, muette/autoplay/loop, poster `hero-1.jpg`) à la place du
  diaporama d'images. Particules/formes retirées → **rectangle net**. Chips sans
  bordure. `HeroBackground` réécrit (vidéo + voile de marque).
- **Logos** : refs `logo-HORUS-LAB-white.jpeg` → **`.png` transparent** (Header,
  Testimonials, CTA) ; JSON-LD → `-black.png`. Noir en clair / blanc en sombre
  (visible partout). Filigranes Horus rendus **plus visibles** (opacity 0.10-0.12,
  sans mix-blend).
- **Titres de section** : `SectionHeading` unifié, **tous centrés**, même forme,
  **suppression des tirets décoratifs** (« tirets IA »), sous-titre compact (15px,
  tient sur une ligne en desktop). Appliqué à Services/Process/WhyUs/Sectors/
  Realisations/Testimonials/Partners/Blog.
- **Services** : bento volumineux → **4 services sur une ligne** (compact) +
  **bandeau des technologies** en dessous (badges texte React/Next/Django/Flutter…
  faute d'assets logos — à remplacer par de vrais logos si fournis).
- **Réalisations** : image de la carte phare = **vraie capture Afrikamode**
  (`/afrikamode-realisations/01-site-accueil.png`) + logo par-dessus (comme la
  page Portfolio). Titre centré + bouton dessous. Cartes **sans bordure**.
- **Pourquoi Horus-Lab** & **Secteurs** : refonte en **une ligne** (4 valeurs /
  chips pleine largeur), colonnes latérales + gros chiffres supprimés → **moins de
  hauteur**, sans bordures.
- **Témoignages** / **CTA** : fond Horus (filigrane logo transparent) plus visible ;
  encadré témoignage sans bordure.
- **Espacements inter-sections réduits** partout (py resserrés).
- **Bordures** : retirées de toutes les cartes de l'accueil ; **conservées
  uniquement sur les boutons** d'action/redirection (règle demandée). Coins carrés
  déjà globaux.

**Reste / à valider visuellement** : vérifier le rendu (vidéo hero, « une ligne »
selon largeur), fournir de vrais **logos de technologies** si souhaité, confirmer
l'interprétation du fond Afrikamode (carte phare vs fond de section).

---

## 2026-07-21 — 🎓 LMS Formations : bugs corrigés + Phase 1 auth (NON commité)

Passage d'un simple mur e-mail à une vraie **plateforme de formation (LMS)** :
comptes, progression, quiz, certificat. **Décisions utilisateur** : connexion
**e-mail + Google** (Facebook/Apple plus tard) ; pilote complet d'abord sur les
**3 cours gratuits** (React, UML, IA) ; **certificat PDF à la marque + page de
vérification publique**. Feuille de route : (1) auth, (2) modèles LMS, (3) pages
front, (4) certificat PDF, (5) contenu quiz.

**Bugs corrigés cette session (frontend, tsc OK)**
- **Sous-menu Formations « ne renvoyait pas »** : `CourseCatalog` synchronise
  désormais le filtre quand la catégorie change via l'URL alors qu'on est déjà sur
  la page (`useEffect` sur `initialCategory`). Le libellé **Formations** du menu
  mène à `/formations` (survol = sous-menu), + entrée **« Toutes les formations »**
  en tête des sous-menus desktop & mobile.
- **Formulaire vidéo « figé/écrasé »** : `CoursePlayer` passe l'overlay en
  **modale plein écran** (`fixed inset-0`, fermeture au clic extérieur) au lieu
  d'être confiné dans la petite fenêtre vidéo. (Deviendra la vraie page
  d'inscription en Phase 3.)

**Phase 1 — Fondation auth (backend, ✅ testée)**
- Nouvelle app Django **`accounts`** (pas de modèle User custom — trop intrusif
  sur base existante ; on aligne `username = email`).
- Endpoints `/api/auth/` : **register** (email+nom+mdp), **login** (par e-mail),
  **me** (jeton requis), **google** (vérifie l'ID token via `google-auth` +
  `GOOGLE_CLIENT_ID`), **refresh**. Jetons **JWT** (`djangorestframework-simplejwt`,
  access 12 h / refresh 30 j).
- `settings.py` : `DEFAULT_AUTHENTICATION_CLASSES` = JWT + session ; `SIMPLE_JWT` ;
  throttles `auth_register` 10/h, `auth_login` 40/h ; `GOOGLE_CLIENT_ID` (env).
- `requirements.txt` : + `djangorestframework-simplejwt`, `google-auth` (installés
  dans `.venv`).
- **Tests** `accounts/tests.py` : **5/5 OK** (register/login/me, doublon refusé,
  mdp faible refusé, /me exige un jeton, google 401/503). `manage.py check` 0.

**⚠️ Prérequis Google (utilisateur)** : créer un **OAuth Client ID** (Google Cloud
Console) et poser `GOOGLE_CLIENT_ID` dans `backend/.env` + le même côté frontend
pour le bouton « Continuer avec Google ». Tant que vide → `/api/auth/google/` = 503.

**Reste (prochaines phases)** : modèles LMS (enrollment, progression, quiz,
certificat) ; pages front `/inscription` `/connexion` `/mon-compte` + bouton Google
+ garde vidéo branchée sur les comptes ; certificat PDF + `/verifier/<id>` ;
rédaction des quiz (React/UML/IA). + retouche design : **légères bordures sur les
boutons** (demandée, à faire).

---

## 2026-07-21 — 🔐 Formations : mur e-mail + vidéos FR/EN + tout carré (NON commité)

Trois demandes utilisateur sur les Formations (branche `feat/refonte-site-pro`,
**modifications LOCALES non commitées**, à livrer avec la refonte + Formations) :

**1. Vidéos aussi en FRANÇAIS (avant : seulement anglais/freeCodeCamp)**
- Vidéo désormais **bilingue** : URL séparée par langue. FR = chaînes francophones
  (Grafikart : React/Next/React-Native ; Comment Coder : JS ; YoungDevps : FastAPI ;
  Ralph Développeur : Flutter ; Julien Code : UML ; HectorCure : Merise/BDD ;
  Ludo Salenne : IA/prompt). EN = les freeCodeCamp existantes. **8 vidéos FR
  vérifiées via oEmbed** (existent + publiques).
- Frontend statique `lib/courses.ts` : `VIDEO_FR` + `VIDEO_EN`, `videoUrl` par langue.
- Backend `courses` : champ `video_url` → **`video_url_fr` + `video_url_en`**
  (modèle, migration **`0004_course_video_bilingue`** = rename + add, serializer,
  admin, `seed_courses` FR/EN). `cms.ts` : mapper choisit la vidéo selon `lang`.

**2. Mur d'accès e-mail avant lecture (façon OpenClassrooms)**
- `components/formations/CoursePlayer.tsx` : au clic « lecture », si le visiteur n'a
  pas encore donné son e-mail → **formulaire (nom + e-mail + honeypot)**. À la
  soumission → enregistré comme **lead newsletter** (Brevo, liste 5, attribut
  FIRSTNAME) → **accès mémorisé en `localStorage`** (`horus:formations-access`) →
  la vraie vidéo YouTube (nocookie) se charge. Plus de re-saisie ensuite. Bilingue.
- Nouvelle route `app/api/formations-access/route.ts` (email valide + honeypot →
  `saveLead("newsletter", {email, name, source:"formations"})`).
- `lib/leads.ts` : `brevoAddContact` accepte un **prénom** (attribut FIRSTNAME).

**3. « Tout carré, pas d'arrondis » sur tout le site**
- `globals.css` : **règle globale unique** `*,*::before,*::after{border-radius:0!important}`
  → neutralise TOUS les arrondis (utilitaires `rounded-*`, pilules `rounded-full`,
  valeurs inline) sur toutes les pages. Réversible (retirer le bloc).

**Vérifs (tout ✅)** : `tsc --noEmit` **0 erreur** · `manage.py check` **0** ·
`makemigrations --check` = *No changes detected* · `migrate` + `seed_courses` OK
(4 domaines, 9 formations) · base : `video_url_fr` (Grafikart) ≠ `video_url_en`
(freeCodeCamp) confirmé sur `debuter-avec-react`.

**Reste à faire** : commit + PR (avec la refonte + Formations). ⚠️ En prod, `migrate`
appliquera `0004` (rename `video_url`→`video_url_fr` + add `video_url_en`) ; re-`seed_courses`
pour remplir les vidéos FR/EN. Piège cache `.next` en dev si contenu figé.

---

## 2026-07-21 — 🎓 Page Formations + retrait Candidature (frontend & backend) (NON commité)

Remplacement de la page **Candidature** (retirée) par une page **Formations** façon
OpenClassrooms / Udemy, avec **synchronisation frontend ↔ backend ↔ BD**.
**⚠️ Modifications LOCALES non commitées** (branche `feat/refonte-site-pro`).

**Frontend — Formations (fait avant cette session, vérifié OK)**
- `src/app/[lang]/formations/page.tsx` : hero + stats, **grille de domaines** (sous-parcours),
  **catalogue filtrable** (`components/formations/CourseCatalog.tsx`, client), CTA sur-mesure.
- `src/app/[lang]/formations/[slug]/page.tsx` : page cours détaillée (aperçu vidéo,
  « Ce que vous allez apprendre », **programme modules/leçons**, formateur, autres cours).
- `src/lib/courses.ts` : catalogue statique **bilingue FR/EN** — 5 domaines, 10 cours
  (Web, Mobile, Data & IA, Cybersécurité, Cloud & DevOps). `getFormations/getCourse/getCourseSlugs`.
- Header/Footer/sitemap/dictionaries/icons mis à jour (lien Formations, icônes Book/Play/Clock…).
- Page **Candidature supprimée** : `app/[lang]/candidature/`, `app/api/applications/`,
  `components/candidature/*`.

**Frontend — nettoyage fait cette session**
- `src/lib/leads.ts` : suppression du **code candidature orphelin** (type `ApplicationPayload`,
  `brevoSendApplicationEmail`, `saveApplication`, `APPLICATIONS_DIR`) — son consommateur
  (`api/applications`) n'existait plus. `saveLead` (newsletter/contact) intact.
- ✅ `npx tsc --noEmit` : **aucune erreur**.

**Backend — synchronisation faite cette session**
- ❌ App **`applications` supprimée** (modèle `Application`/candidature, views, serializers,
  notifications, urls). Retirée de `INSTALLED_APPS`, de `config/urls.py`, et du throttle
  `application` (settings).
- ✅ Nouvelle app **`courses`** (mirroir du catalogue frontend, éditable en admin = CMS) :
  - Modèles : `Category` (domaine), `Course`, `Module` (programme). Bilingue FR/EN.
  - Admin : `CategoryAdmin`, `CourseAdmin` (+ `ModuleInline`), slugs prépeuplés.
  - API REST **lecture seule** sous `/api/courses/` : `CourseViewSet` (list léger /
    detail complet avec programme, filtre `?category=<slug>`) + `CategoryViewSet`
    (`/api/courses/categories/`). Lookup par `slug`.
  - Commande **`seed_courses`** (idempotente) reproduisant le catalogue frontend :
    **5 domaines, 10 formations, 30 modules**.
- **BD adaptée** : migrations `courses/0001_initial` + `0002_drop_legacy_applications`
  (DROP TABLE `applications_application` + purge des lignes `django_migrations` orphelines,
  portable SQLite/PostgreSQL). ⚠️ **En prod** (Postgres `horuslab`) : appliquer `migrate`
  pour que le drop de la table héritée s'exécute aussi.

**Vérifications de fin de session (tout ✅)**
- `manage.py check` : 0 issue. Table `applications_application` **absente**, tables
  `courses_*` créées. API `/api/courses/` = 200 (catalogue 10), detail avec 3 modules.
- Serveurs lancés : **Django :8000** OK, **Next :3001** (3000 occupé) OK.
  `/fr/formations` = 200, `/fr/formations/debuter-avec-react` = 200,
  `/fr/candidature` = **404** (retirée), `/api/applications/` = **404**.

**Branchement CMS du frontend Formations (fait cette session, vérifié end-to-end)**
- `src/lib/cms.ts` : nouvelle section **Formations** suivant le patron existant
  (types `ApiCourseCategory`/`ApiCourseListItem`/`ApiCourseDetail`/`ApiCourseModule`,
  mappers, **ISR 60s + repli total** sur `lib/courses.ts`). Getters :
  `getCmsFormations(lang)` (catalogue : domaines + cours légers),
  `getCmsCourse(lang, slug)` (cours + programme), `getCmsCourseSlugs()`
  (union CMS + statique pour `generateStaticParams`).
- Pages branchées : `formations/page.tsx` → `getCmsFormations` ;
  `formations/[slug]/page.tsx` → `getCmsCourse` + `getCmsFormations`, et
  `generateStaticParams` désormais **async** via `getCmsCourseSlugs()`.
  `lib/courses.ts` reste le **fallback** (repli si API vide/indispo). tsc OK.
- **Preuve end-to-end** : insertion d'un cours sentinelle en base (absent du
  statique) → après purge du cache, il apparaît dans le catalogue FR/EN et sa
  page détail répond 200 ; puis retiré. Le programme détaillé (curriculum +
  objectifs), qui ne vient QUE de l'endpoint detail, s'affiche bien.
- ⚠️ **Piège cache** : le **Data Cache persistant de Next** (`.next/cache`,
  `revalidate=60`) masque les changements récents après un rebranchement — si le
  contenu semble figé, **purger `.next`** (dev) et recharger. En prod, l'ISR se
  rafraîchit tout seul à la minute (ou re-seed / édition admin).
- Endpoints consommés : `GET /api/courses/`, `/api/courses/categories/`,
  `/api/courses/<slug>/` (+ filtre `?category=`). Requiert `BACKEND_API_URL`
  (déjà dans `.env.local` = http://127.0.0.1:8000).

**Reste à faire** : **commit + nouvelle PR** pour livrer refonte + Formations
(frontend, backend, migrations). Optionnel : uploader les images de cours via
l'admin (aujourd'hui `image` = chemin statique frontend).

---

## 2026-07-20 — 🎨 Refonte « carré & pro » + cohérence multi-pages (NON commité)

Grosse passe design sur le site vitrine (frontend). **⚠️ Tout est en modifications
LOCALES non commitées** — rien n'est poussé ni en ligne (la PR #4 de la branche
`chore/local-run-and-github-guide` est déjà mergée ; il faut une **nouvelle branche + PR**
pour livrer ce qui suit).

**Direction validée** : petit rayon `rounded-md` partout (cartes/navbar/contact/inputs),
CTA principaux gardés en pilule, boutons secondaires carrés. Inspirations : cadyst.com,
inov-consulting.com/fr, 2metechsarl.org.

**Navbar / Footer**
- 🐞 **Bug logo corrigé** : les 2 variantes étaient inversées → le logo `-white`
  s'affichait sur fond blanc (invisible) et `-black` sur fond sombre. Remis dans le bon
  sens (noir en clair, blanc en sombre) + agrandi. Footer (fond navy) : passé en `-white`.
- Sous-menu Services : tirets de séparation. Navbar en coins carrés.
- **Newsletter déplacée DANS le footer** (bandeau) ; `sections/Newsletter.tsx` inutilisé.

**Accueil**
- Hero : vague **statique** (fin de l'anim `waveX`) ; espaces hero→Services et
  Services→Réalisations réduits ; Services & WhyUs compactés.
- Secteurs : puces uniformes (fin des couleurs/tailles aléatoires).
- Réalisations : **Afrikamode + Elec One = projets phares** ; Elec One **passé de
  l'orange au bleu ciel** (charte) + desc réécrite (**appli MOBILE EnMKit**, 2MeTech).
- **Témoignages** → carrousel auto-défilant avec **photos** (Paule Diane Himsta,
  Pagop Tchouansi Aurélie, Dr Agnès Virginie TJAHE / 2MeTech, dépt info IUT-FV Bandjoun).
- **Nouvelle section Partenaires** (`sections/Partners.tsx`) : logos **défilants +
  cliquables** vers cfp-brcgroup / cga-brcgroup / 2metechsarl / afrikamode.store /
  univ-dschang.org/iutfv.
- **Blog** : suppression du carrousel défilant (doublon) + filigrane défilant.
- **Section formulaire Contact SUPPRIMÉE de l'accueil** → la section CTA « Prêt à lancer
  votre projet » redirige vers la page `/contact` (source unique).

**Multi-pages**
- Composant réutilisable **`components/WaveDivider.tsx`** : vague statique appliquée aux
  héros de blog/about/candidature/services/portfolio (remplace l'« effet blanc » et la
  vague animée du portfolio).
- **Pages Services** : `ServiceContactSection` ne duplique plus le formulaire → bande CTA
  vers `/contact` (garde `id="contact"`). Ancres `#contact` de l'accueil (Hero, CTA,
  Footer, About, Portfolio) redirigées vers la page `/contact`.

**Boutons flottants** : les 4 icônes de droite regroupées en **1 seule** (Horus AI) qui
déplie support/telegram/whatsapp au survol/focus ; **BackToTop passé à droite**, s'efface
quand le chat est ouvert. Filigrane logo en fond (Témoignages + CTA).

**Qualité** : `tsc --noEmit` OK · `next build` OK (exit 0). NB : le build exige le réseau
(police Google Geist) — un sandbox hors-ligne échoue uniquement sur la police.

**Reste à faire** : assainir le fond animé de la **grille Portfolio** (formes+particules) ;
valider les **citations témoignages** (provisoires) ; les logos `-white.jpeg` sont des JPEG
(sans transparence) → fournir un PNG blanc transparent si un liseré apparaît sur fond sombre.

---

## 2026-07-13 — 🚀 MISE EN LIGNE PROD réussie (horus-lab.com en HTTPS) ✅

Le site est **officiellement en ligne** sur le VPS Contabo, en **mode manuel/root**
(pas d'auto-déploiement CI). Vérifié en direct : `https://horus-lab.com/fr` → **200**
(site Next.js complet) et `https://api.horus-lab.com/api/site/` → **JSON Django**.

**Architecture retenue (se branche sur le projet AFRIKAMODE, ne le touche jamais) :**
- Images **privées** `ghcr.io/horus-lab-team-s/horus-{backend,frontend}` → `docker login
  ghcr.io` en root avec un **PAT `read:packages`**, puis `pull` + `up -d` à la main.
- Stack `docker-compose.prod.yml` : conteneurs **`horus_web`** (Django :8000) +
  **`horus_frontend`** (Next :3000), exposés en `127.0.0.1:8082/8081`, rejoignant le
  réseau **`backend_default`** (celui d'afrikamode) via `PROXY_NETWORK`.
- **Proxy** = `backend-nginx-1` (afrikamode). Config horus **copiée dans le conteneur**
  (`docker cp horus.conf → /etc/nginx/conf.d/`) — comme gathe/tchokos, **PAS** un
  bind-mount → ⚠️ **non persistant** si afrikamode recrée nginx. Motif `resolver
  127.0.0.11` + `set $up` (le `up -d` recrée les conteneurs → nginx re-résout, pas de 502).
- **TLS** : certbot `backend-certbot-1`, webroot `/var/www/certbot`, cert
  `/etc/letsencrypt/live/horus-lab.com/` (3 noms). Émission en **2 temps** (conf port 80
  ACME → cert → conf 443).
- **Base réutilisée** : `backend-db-1` (postgres afrikamode), rôle + base dédiés
  **`horuslab`**. `DATABASE_URL` → `POSTGRES_HOST=backend-db-1`.
- VPS IPv4 : **81.0.246.144**. Dossier : `/opt/horus-lab/` (à plat : `.env` +
  `docker-compose.prod.yml` + `horus.conf`).

**🐞 Pièges rencontrés & corrigés (à retenir pour un redéploiement) :**
1. **`.env` `PROXY_NETWORK=backend_defaut`** (faute de frappe, manque le « l ») → le
   réseau externe n'existait pas → `up -d` **échouait silencieusement** → **aucun**
   conteneur horus → 502. Corrigé en `backend_default`.
2. **`POSTGRES_USER=horus`** dans le `.env` alors que le rôle créé est **`horuslab`**
   → `password authentication failed for user "horus"`, `horus_web` en crash-loop.
   Corrigé : `POSTGRES_USER=horuslab` + `POSTGRES_DB=horuslab` + `ALTER ROLE horuslab
   PASSWORD …` (réaligné sur le `.env`). Ensuite : migrations + seed + superuser + Gunicorn OK.
3. **DNS LWS** : `api` **sans enregistrement A** (NXDOMAIN) + **AAAA parasites** sur
   apex/`www` (`2a00:7ee0:…`) → Let's Encrypt **ET** le navigateur partaient en IPv6
   sur LWS (404 / page parking). Corrigé chez LWS : **A `api`** ajouté, **tous les AAAA
   supprimés** (`www` = CNAME → apex). MX/SPF/DKIM Brevo intacts.
4. **`certbot certonly` interactif** via `docker exec` → `EOFError` inoffensif quand le
   cert existe déjà (pas de TTY). Le cert était bien créé.
5. **Terminal qui tronque les gros collages** (heredoc `cat >`) → on est passé par un
   **vrai fichier** (`scp` du repo → `docker cp`).

**Reste à faire (important) :** `RUN_SEED=0` **avant** de saisir du vrai contenu (sinon
le seed écrase à chaque `up -d`) · **changer le mot de passe admin** (celui du `.env`
est connu) · **régénérer le PAT GHCR** (collé en clair pendant la session) · rendre la
conf nginx **durable** (montage plutôt que `docker cp`) · côté user : **vider le cache
DNS/navigateur** local (montrait encore LWS alors que le serveur sert le site).

**Fichiers** : `deploy/nginx-horus.conf` mis à jour (valeurs réelles : webroot
`/var/www/certbot`, motif resolver). `RESTE-A-FAIRE.md` déjà annoté « mode manuel/root ».

---

## 2026-07-05 — Purge du backend chat privé (code + tables) ✅

Suite du retrait : nettoyage complet du backend, **le forum intact**.
- **Supprimés** : modèles `Conversation`/`ChatMessage` ; vues `ConversationCreateView`/
  `MessageListCreateView` ; routes `/api/chat/conversations…` ; `ConversationAdmin`/
  `ChatMessageInline` ; serializers `ChatMessageSerializer`/`ConversationCreateSerializer` ;
  fonctions `notify_new_message`/`notify_visitor_reply`/`_admin_link` ; throttle
  `chat_create`.
- **Migration `0004_delete_chatmessage_delete_conversation`** → tables droppées.
  Tables `chat_*` restantes : **`chat_forumthread` + `chat_forumpost`** uniquement.
- **Conservé** : tout le forum (modèles, API `/api/chat/forum/<slug>/`, admin de
  modération, notif `notify_new_forum_post`, helpers `_send_email`/`_fire`/`_send_telegram`).
- **Validé** : `manage.py check` 0 · forum POST 201 / GET 200 · `/api/chat/conversations/`
  → **404** · nettoyé. Aucune régression. (`/api/chat` = assistant IA Groq, intact.)

---

## 2026-07-05 — Retrait du chat privé : seul le forum reste ✅

Décision utilisateur : « retire le widget privé, on garde que le forum ».
- **Frontend supprimé** : composant `LiveChat.tsx` + routes proxy `/api/blog-chat`
  et `/api/blog-chat/messages` ; usages `<LiveChat />` retirés de `blog/page.tsx`
  et `blog/[slug]/page.tsx`. `tsc --noEmit` = 0, pages blog 200, plus aucune réf.
- **Conservé** (autre feature, non visée) : l'assistant IA **Horus AI** (Groq,
  `/api/chat`, composant `HorusAI`, bouton « Discuter avec Horus AI »).
- **Backend privé désormais DORMANT** : modèles `Conversation`/`ChatMessage`, vues
  `/api/chat/conversations…`, `ConversationAdmin`, e-mail-au-visiteur — plus aucun
  point d'entrée depuis le site (le widget qui les créait est parti). Code inoffensif
  mais mort. **À purger** si on veut un backend 100% propre (models + migration DROP
  + admin + urls) — non fait (destructif), à confirmer.

Le blog n'a donc plus qu'**un forum public** comme espace de discussion.

---

## 2026-07-05 — FORUM PUBLIC par article ✅ (nouvelle feature majeure)

Demande utilisateur : le « chat » du blog doit devenir un **vrai forum public pro**
— plusieurs personnes interagissent, les réponses sont **visibles par tous** (le
chat privé 1:1 ne résolvait pas le cas « visiteur sans e-mail »). Construit en
réutilisant l'app `chat`, testé de bout en bout.

**Modèle** (`chat/models.py`) : `ForumThread` (1 fil PUBLIC par article, clé =
`slug`) + `ForumPost` (`author_name`, `author_email` *privé, jamais exposé*, `text`,
`is_staff` = badge équipe, `is_hidden` = modération). Migration `0003`.

**API** (`/api/chat/forum/<slug>/`, `views.ForumThreadView`) :
- `GET ?after=<id>` → fil public (messages non masqués), lecture **libre**.
- `POST {author_name?, author_email?, text, thread_title?}` → poste public,
  throttlé (`forum_post` 20/h) + honeypot côté proxy. Notif équipe à chaque post
  (`notify_new_forum_post` → e-mail Brevo « 🗣️ Forum : message de … »).
- Serializer public **n'expose pas** l'e-mail.

**Admin modération** (`chat/admin.py`) : `ForumThreadAdmin` — liste des fils
(titre, nb messages, activité) ; détail = **fil public en bulles** (masqués grisés)
+ inline pour **répondre** (case « Équipe » cochée par défaut → badge) et **modérer**
(case « Masqué » ou suppression).

**Frontend** : proxy `/api/forum/[slug]/route.ts` (GET/POST + honeypot) ;
composant public `BlogForum.tsx` (fil + formulaire nom optionnel + polling 10 s +
badge équipe, bilingue) ; intégré **sous chaque article** (`blog/[slug]/page.tsx`),
en plus du widget privé flottant conservé.

**Tests bout-en-bout** (nettoyés) : post visiteur (201, e-mail non exposé), réponse
équipe (badge), **modération** (masquer → disparaît du GET), **polling** (`after`),
**notif Brevo délivrée**, post via proxy frontend, section rendue dans l'article.
`tsc --noEmit` 0 · `manage.py check` 0 · migration appliquée.

**Choix d'archi** : post-modération (visible tout de suite, l'équipe masque/supprime
si besoin) — un forum pré-modéré paraît mort. Fils **par article** (contextuel, SEO).
Le chat privé 1:1 + son e-mail-au-visiteur restent en place (support/leads privés).

---

## 2026-07-05 — Chat : e-mail de réponse au visiteur + admin « inbox forum » ✅ (feature)

Deux ajouts pour la messagerie, suite retour utilisateur (« comment répondre ? »
+ « il faut le manuel, façon forum où on voit tout le monde »).

**1. E-mail de réponse au visiteur** (le « répondre même s'il est parti ») :
- Quand l'équipe répond (message `sender=team` créé via l'admin) → le visiteur
  **reçoit la réponse par e-mail** *s'il a laissé son adresse*. Ce n'est **pas un
  bot** : ça transmet la réponse **manuelle** de l'équipe (utile si le visiteur a
  fermé l'onglet).
- Bilingue (langue déduite de `page` `/en…`), `Reply-To` = boîte équipe
  (`contact@`) pour que sa réponse revienne côté Horus, non bloquant (thread
  daemon), ignoré si pas d'e-mail visiteur ou pas de `BREVO_API_KEY`.
- Code : `chat/notifications.py` → `notify_visitor_reply()` + refactor
  `_send_email(to, reply_to)` ; hook `ChatMessage.save()` (déclenche sur nouveau
  message équipe). **Testé** : FR + EN **délivrés** (events Brevo) ; cas sans
  e-mail = **aucun envoi**.

**2. Admin « boîte de réception forum »** (`chat/admin.py`) :
- Liste = vraie inbox : visiteur + e-mail, **aperçu du dernier message** (qui/quoi),
  nb messages, dernière activité, tri par activité récente.
- Détail = **fil complet en bulles** (visiteur à gauche, équipe à droite, horodaté)
  + zone de réponse (inline, expéditeur pré-réglé « Équipe »). `manage.py check` OK.

**Flux complet** : visiteur écrit → équipe notifiée par e-mail → équipe ouvre
l'admin (fil lisible), répond → visiteur voit dans le widget (polling) **ET** par
e-mail s'il est parti.

---

## 2026-07-05 — Chat : mécanisme de réponse équipe vérifié + lien notif ✅

Question utilisateur : « quand un visiteur écrit, comment l'équipe répond ? ».
**Le mécanisme fonctionne** (testé de bout en bout) :
1. Visiteur écrit (widget `LiveChat`) → `ChatMessage(sender=visitor)`.
2. `notify_new_message` → **e-mail à `contact@horus-lab.com`** (Brevo) [+ Telegram si
   configuré]. **Vérifié** : event Brevo « 💬 Message de … » *delivered*.
3. Équipe répond dans **l'admin Django** : *Chat › Conversations (chat)* → ouvrir →
   inline « Message » (expéditeur pré-réglé = **Équipe Horus-Lab**) → Enregistrer.
4. Le widget visiteur *poll* (3,5 s) → la réponse s'affiche. **Vérifié** : le poll
   renvoie bien le message `sender:team`.

**Correctif appliqué** : `ADMIN_BASE_URL=http://localhost:8000` (était vide) →
l'e-mail de notif contient désormais un **lien direct « Répondre dans l'admin »**.
Prod : mettre l'URL publique du backend.

**Liens Telegram/WhatsApp du chat** (cohérents dans LiveChat/Footer/HorusAI) :
- WhatsApp `wa.me/237699173771` (format OK — à confirmer que ce n° est bien
  actif sur WhatsApp).
- Telegram `t.me/tonbacm` → **profil réel « Loïc TONBA » (compte PERSO)**. Marche,
  mais = identifiant personnel (cf. volonté de sortir du perso). À décider :
  garder, ou créer un compte/bot Telegram Horus-Lab dédié.

**Limite produit connue** : si un visiteur ferme l'onglet après avoir écrit, il ne
verra la réponse que s'il **revient avec le même navigateur** (conversation en
localStorage) — pas de push. S'il a laissé un e-mail, l'équipe peut le relancer à
la main. Amélioration possible (non faite) : **e-mailer automatiquement le visiteur**
quand l'équipe répond (si e-mail fourni).

---

## 2026-07-05 — Sweep complet : toutes les pages + intégrations OK ✅

Serveurs laissés tournants. Test exhaustif :
- **Pages FR+EN = 200** : home, about, portfolio, blog + articles **static & backend**
  (dual-source), 4 services (`applications`, `digitalisation`, `formation-audit`,
  `systemes-information`), candidature, legal. **Redirections** `/`→`/fr`,
  `*/news`→`*/blog` (307). `sitemap.xml` / `robots.txt` / `manifest.webmanifest` OK.
- **Backend API** : `site, hero, services(4), process(4), values(4), sectors(8),
  testimonials(4), partners(2), team(2), portfolio(5)` + blog = 200. `achievements`,
  `stack`, `news` = 0 (non seedés → fallback statique côté site, normal).
- **`/api/health`** : Groq `ok`, Brevo `ok` (liste configurée).
- **Chunks JS** servis 200 + valides → pas de bug de bundle. Les erreurs `[browser]`
  (« Router action dispatched before initialization » + un `SyntaxError`) = artefacts
  **dev** d'un onglet resté ouvert pendant mes redémarrages serveur → un hard-refresh
  les efface. **Pas un bug de code.**
- **404 attendus** (non bloquants) : `/api/blog/posts/<slug-static>/` (dual-source :
  Django d'abord puis markdown local) ; `/favicon.ico` côté backend.

**Conclusion : tout le site fonctionne** — CMS, blog dual-source, 4 services, i18n
FR/EN, SEO (sitemap/robots/manifest), Groq, chat live, et les 3 formulaires Brevo.

---

## 2026-07-05 — Brevo débloqué : TOUS les formulaires validés en réel ✅

L'utilisateur a **autorisé l'IP** dans Brevo → l'API répond. Diagnostic complet
(API lecture seule) puis tests réels de bout en bout, données de test nettoyées.

**Découvertes Brevo (compte horus8391) :**
- **Expéditeurs validés** : `horus8391@gmail.com` **et** `contact@horus-lab.com`
  (tous deux actifs). `noreply@` n'est PAS un expéditeur validé…
- …MAIS le **domaine `horus-lab.com` est déjà AUTHENTIFIÉ** (DKIM/SPF, DNS,
  depuis le 2026-05-17) → **n'importe quelle adresse `@horus-lab.com` peut
  envoyer** avec bonne délivrabilité. La « checklist B » est donc **déjà faite**.
- **Liste `5` = « Newsletter-website-horus »** confirmée dans ce compte.

**Re-correction `frontend/.env.local`** (le fichier avait été rétabli : `BACKEND_API_URL`
vide + sender `noreply@`) → remis `http://127.0.0.1:8000` + `BREVO_SENDER_EMAIL=contact@horus-lab.com`
(validé). Redémarrage frontend. ⚠️ Si l'éditeur re-rétablit ce fichier, ces 2 lignes sautent.

**Tests réels (puis nettoyés) :**
- **Newsletter** → contact ajouté à la **liste 5** (vérifié via API Brevo, puis supprimé).
- **Contact** → e-mail transactionnel **délivré ET ouvert** dans `contact@horus-lab.com`
  (events Brevo `requests`→`opened`, from/to `contact@`). Aucun warning `[brevo]`.
- **Candidature** → Django enregistre le candidat **+ ZIP** (multipart) ; notif backend.
- Nettoyage : contact Brevo supprimé (204), candidature + 2 conversations chat de test supprimées.

**Sender retenu = `contact@horus-lab.com`** (validé + réponses des visiteurs dans une
vraie boîte). `noreply@` aussi possible (domaine authentifié) si préféré plus tard.

**Prod** : penser à autoriser l'**IP du serveur** dans Brevo (ou désactiver la
restriction « IP autorisées » si IP dynamique), sinon les e-mails échoueront en 401.

---

## 2026-07-05 — Validation end-to-end en local ✅ (2 bugs corrigés + blocage Brevo IP)

Backend (`runserver :8000`, SQLite seedée) + frontend (`next dev :3000`) lancés.
Superuser local créé : **`admin` / `HorusLab2026!`** (à changer).

**✅ Ce qui fonctionne (testé) :**
- **CMS pilote le site** : modif d'un champ en base (ex. `HeroContent.subtitle_fr`)
  → apparaît sur `/fr` (via ISR, ~≤60 s ; immédiat une fois le cache expiré).
  Le backend log confirme que le SSR fetch **tous** les endpoints CMS (hero,
  services, testimonials, portfolio, process, values, sectors, site, blog).
- **Groq (Horus AI)** : `POST /api/chat` → vraie réponse LLM (clé valide).
- **Chat live** : `POST /api/blog-chat` (création) + `/messages` (envoi) + polling
  GET → aller-retour complet via le proxy Next → Django.

**🐞 2 bugs trouvés & corrigés (sinon rien ne démarre) :**
1. **`DATABASE_URL=` vide** interprété par `dj_database_url.config()` comme moteur
   « dummy » → `manage.py` plantait (*DATABASES improperly configured*). Corrigé
   dans `settings.py` : `os.environ.get("DATABASE_URL") or "sqlite:///…"` puis
   `parse()`. Une URL vide se comporte enfin comme absente (repli SQLite).
2. **`localhost` → IPv6 `::1` sous Windows** alors que `runserver` écoute en
   `127.0.0.1` : chaque fetch CMS traînait ~90 s puis fallback. Corrigé :
   `BACKEND_API_URL=http://127.0.0.1:8000` dans `frontend/.env.local`. Home : 90 s → **1,8 s**.
   *(Note dev : `pnpm dev` échoue sur `ERR_PNPM_IGNORED_BUILDS` → lancer
   `node node_modules/next/dist/bin/next dev`.)*

**⚠️ Brevo — blocage à lever (découvert en lecture seule) :** la clé API dédiée
est **valide** MAIS le compte a la sécurité **« IP autorisées » activée** → tout
appel API depuis une IP non listée renvoie `401 unauthorized` (*unrecognised IP
129.0.60.180*). **Conséquence : aucun e-mail (newsletter/contact/candidature) ne
partira** tant que ce n'est pas réglé — en local ET en prod.
→ Brevo → **Sécurité → IP autorisées** : soit **désactiver** la restriction
(recommandé si IP serveur dynamique), soit **ajouter l'IP** du serveur (et
`129.0.60.180` pour tester en local). Ensuite seulement : valider l'expéditeur
`contact@horus-lab.com` (non vérifiable tant que l'IP bloque).

**Telegram** : non testé — optionnel, laissé vide (l'e-mail couvre les notifs).

**Servers laissés tournants** pour inspection manuelle : site `http://localhost:3000/fr`,
admin `http://localhost:8000/admin/` (admin / HorusLab2026!).

---

## 2026-07-05 — Bascule Brevo : sortie totale de l'adresse perso 🔁

Décision : abandon du compte Brevo perso **`tonbaloic6@gmail.com`** au profit du
compte **`horus8391@gmail.com`** (payant : 5000 SMS + contacts). Le site n'envoie
que des e-mails — il **ne touche pas** au crédit SMS.

Appliqué dans les vrais `.env` (`backend/.env` + `frontend/.env.local`) :
- **`BREVO_API_KEY` vidé** partout → à remplacer par une **clé DÉDIÉE au site**
  créée dans le compte horus8391. Ne PAS recopier la clé des autres systèmes :
  une clé par système ⇒ révocation/rotation possible sans tout casser.
- **Réception** (`CHAT_NOTIFY_EMAIL`, `BREVO_CONTACT_TO`) : tonbaloic6 →
  **`contact@horus-lab.com`** — boîte du domaine **confirmée fonctionnelle**
  (2026-07-05, MX OK). Plus aucun passage par le gmail.
- **Expéditeur** (`BREVO_SENDER_EMAIL`) : tonbaloic6 → **`contact@horus-lab.com`**
  (réponses des visiteurs = vraie boîte relevée). Validé via expéditeur unique
  (immédiat) et/ou couvert par l'authentification du domaine. `noreply@` en option.
- `BREVO_NEWSLETTER_LIST_ID=5` conservé — ⚠️ la liste doit exister dans le compte
  **horus8391** (pas l'ancien compte).

⚠️ **Compte partagé** : quota d'e-mails, base de contacts et réputation d'envoi
sont **communs à tous les systèmes** branchés sur horus8391. Cloisonner ce site
avec une **clé + une liste dédiées**. Le vrai risque long terme = quota mensuel
partagé (un autre système gourmand peut bloquer les envois du site en fin de mois).

**Domaine `horus-lab.com` acheté** (nous appartient) ; boîte `contact@horus-lab.com`
**confirmée fonctionnelle** (MX OK, reçoit déjà). Distinction clé :
- **Envoi** `noreply@horus-lab.com` : pas besoin de boîte, mais domaine à
  **authentifier dans Brevo** (SPF/DKIM via DNS du registrar) — checklist B.
- **Réception** `contact@horus-lab.com` : OK → branchée dans les `.env`.
Donc plus AUCUN gmail dans la config : reste à coller la **clé API** dédiée et à
**authentifier le domaine** pour que `noreply@` envoie.

**Fait** : clé API dédiée `xkeysib-…` (compte horus8391) collée dans les 2 `.env`.
**En cours** : authentification du domaine `horus-lab.com` dans Brevo via DNS **LWS**
(DKIM + brevo-code + SPF fusionné avec l'existant LWS ; DMARC en option).
**Telegram** = **optionnel** — les notifs e-mail (Brevo → contact@) couvrent déjà
l'usage ; `TELEGRAM_*` laissés vides pour avancer. Plus aucune trace de
`tonbaloic6@gmail.com`.

---

## 2026-07-03 — Env : source de vérité = les vrais `.env`, nettoyage des `.example` 🧹

**Correction de l'audit ci-dessous.** La config réelle vit dans **`backend/.env`**
et **`frontend/.env.local`** (git-ignorés), PAS dans les `.env.example`. Ces vrais
fichiers sont **complets et auto-documentés** (chaque variable a son commentaire
« comment l'obtenir ») : Telegram, Brevo, notifications, seed, superuser — tout y est.
L'audit précédent, basé sur le `.env.example` racine, était donc trompeur.

**Supprimés** (redondants, non utilisés, récupérables via git) :
- `.env.example` (racine), `backend/.env.example`, `frontend/.env.example`.
- `docker-compose.yml` (racine) : commentaire d'en-tête corrigé (ne référence plus
  `.env.example` ; pointe vers `backend/.env` + `frontend/.env.local`).

**Restent à renseigner par l'utilisateur** (valeurs encore vides dans les vrais `.env`) :
- `frontend/.env.local` → **`BREVO_NEWSLETTER_LIST_ID`** (newsletter). Brevo →
  Contacts → Listes → ID numérique de la liste.
- `backend/.env` → **`TELEGRAM_BOT_TOKEN`** + **`TELEGRAM_CHAT_ID`** (notifs chat/
  candidatures, optionnel). @BotFather `/newbot` → token ; puis `getUpdates` → chat.id.
- ⚠️ Vérifier que **`BREVO_SENDER_EMAIL`** est un expéditeur **validé** dans Brevo,
  sinon aucun e-mail ne part. (Voir bascule de compte du 2026-07-05 ci-dessus.)
- Déjà renseignés (rien à faire) : `BREVO_API_KEY`, `GROQ_API_KEY`, `CHAT_NOTIFY_EMAIL`,
  `BREVO_CONTACT_TO`. Non requis en local : `POSTGRES_PASSWORD`,
  `DJANGO_SUPERUSER_PASSWORD`, `ADMIN_BASE_URL` (prod/Docker uniquement).

**Note sécurité** : les clés live (`BREVO_API_KEY`, `GROQ_API_KEY`) sont dans des
fichiers **git-ignorés** — non commitées, pas de fuite dans le dépôt (`git ls-files`
ne renvoie plus aucun `.env`).

---

## 2026-07-03 — Audit des variables d'environnement (backend + frontend) 🔍

Vérification exhaustive : clés **réellement lues par le code** (`os.environ`
backend, `process.env` frontend) vs `.env.example` et `docker-compose.yml`
(racine). Aucune modif de code — audit seul.

**A. Clés lues par le code mais ABSENTES de `.env.example`** (toutes optionnelles) :
- **Backend notifications** (`chat/notifications.py`, `applications/notifications.py`) :
  `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (notif Telegram chat + candidatures),
  `CHAT_NOTIFY_EMAIL` (destinataire e-mail, repli sur `BREVO_CONTACT_TO`),
  `ADMIN_BASE_URL` (lien « voir dans l'admin » des notifs).
- **Backend prod** (`settings.py`) : `SECURE_SSL_REDIRECT` (défaut `0`).
- **Backend BD** : `DATABASE_URL` — non listé dans `.env.example` mais **construit
  par compose** depuis `POSTGRES_*` ; hors Docker → repli SQLite. OK, à documenter.
- **Frontend** : `GROQ_BASE_URL` (`api/chat/route.ts`, `api/health/route.ts`) —
  override endpoint Groq, défaut `https://api.groq.com/openai/v1`. **Seule clé
  frontend vraiment non documentée** (le reste du frontend est complet).

**B. Le vrai problème — câblage incomplet de `docker-compose.yml` (racine).**
Des clés documentées / attendues par l'entrypoint ne sont **jamais injectées au
service `backend`** :
- **`BREVO_API_KEY`, `BREVO_CONTACT_TO`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`**
  → passées seulement au service `frontend`. Le **backend** en a besoin pour ses
  notifs e-mail (chat/candidatures). ⚠️ **En Docker, les e-mails backend ne
  partent jamais.**
- **`RUN_SEED`** → jamais passé ⇒ le **seed ne tourne jamais** avec le compose
  racine (l'entrypoint l'exige) : l'admin ne pilote rien, home = fallback statique.
- **`DJANGO_SUPERUSER_USERNAME/EMAIL/PASSWORD`** → jamais passés ⇒ **aucun compte
  admin auto-créé** (l'entrypoint les attend) : `createsuperuser` reste manuel.
- Idem `TELEGRAM_*`, `ADMIN_BASE_URL`, `CHAT_NOTIFY_EMAIL` : notifs impossibles.

**Bilan** : côté **frontend** rien de bloquant (seul `GROQ_BASE_URL` optionnel
manque à la doc). Côté **backend**, ce sont les clés de **notification**
(Telegram/Brevo) qui manquent à `.env.example`, ET un **docker-compose racine
incomplet** qui neutralise seed, superuser auto et e-mails backend.

**Reste à faire (si validé)** : (1) ajouter au service `backend` du compose les
env `BREVO_*`, `RUN_SEED`, `DJANGO_SUPERUSER_*`, et les optionnelles
`TELEGRAM_*`/`CHAT_NOTIFY_EMAIL`/`ADMIN_BASE_URL` ; (2) compléter `.env.example`
avec un bloc « Backend — notifications (optionnel) » + `GROQ_BASE_URL` (frontend)
+ note sur `DATABASE_URL`.

---

## 2026-07-01 — P3 : durcissement backend + confiance (big-tech) ✅

**Confiance client — références aux grandes entreprises tech.** Traitement
différencié selon le risque :
- ❌ **Bandeau défilant home** (`BlogPreview.tsx`) qui listait NVIDIA, Google,
  Apple, Amazon, Meta, Anthropic… → remplacé par **nos réalisations**
  (Afrikamode, Gathe Finance, Elec One, e-Learning, Formation IT, Horus-Lab).
  Un mur de logos géants hors contexte laissait croire à un partenariat.
- ✂️ Description blog `(GAFAM, NVIDIA, IA)` (`dictionaries.ts`) → parenthèse
  retirée (FR+EN), sans changer le sens.
- ✅ **Articles de blog** (NVIDIA Blackwell, Google I/O, Claude 4, Orange/MTN) :
  **conservés** — ce sont des actualités datées, pas des allégations de
  partenariat. (À faire évoluer librement plus tard si souhaité.)

**Durcissement backend :**
- **Throttling** (DRF `ScopedRateThrottle`, rates dans `settings.py`) sur les
  POST publics : newsletter `10/h`, contact `6/h`, application `10/h`,
  chat_create `30/h`. Les **GET restent non limités** (lectures publiques + ISR).
  Chat : seule la création de conversation est limitée (le polling/envoi de
  messages ne l'est pas — le frontend proxifie, l'IP serait partagée).
  ⚠️ Prod : utiliser un **cache partagé** (Redis) pour un comptage global
  multi-workers, et propager l'IP réelle (X-Forwarded-For) si proxy.
- **Validation upload** (`applications/serializers.py`) : `document` doit être
  un `.zip` de ≤ 15 Mo (cohérent avec le frontend) — `validate_document`.
- **Garde SECRET_KEY** (`settings.py`) : lève `ImproperlyConfigured` si
  `DJANGO_DEBUG=0` avec la clé de dev par défaut → empêche un déploiement prod
  non sécurisé.
- **Tests** ajoutés (`applications/tests.py`, `newsletter/tests.py`) : upload
  accepté/refusé (type + taille) et throttle → 429. **4 tests, tous OK.**

Validation : `manage.py check` ✅ · `manage.py test` ✅ (4/4) · `tsc --noEmit` ✅.

**Reste (optionnel, non bloquant)** : cache Redis + X-Forwarded-For pour un
throttling prod exact ; page légale (dès immatriculation) ; le `sameAs` JSON-LD
(`page.tsx`) est en dur — à garder synchro avec « Réglages du site » de l'admin.

---

## 2026-07-01 — P2 : cohérence env + copie SEO ✅ (légale reportée)

**P2a — Variable d'environnement harmonisée.** Le code lit `BACKEND_API_URL`
partout (`cms.ts`, `next.config.ts`, routes `/api/*`) ; `NEXT_PUBLIC_API_URL`
n'était lu nulle part. Corrigé :
- `.env.example` (racine) : `NEXT_PUBLIC_API_URL` → `BACKEND_API_URL`
  (valeur docker `http://backend:8000`, sans suffixe `/api`, commentaire local).
- `docker-compose.yml` (racine) : service `frontend` → env runtime `BACKEND_API_URL`
  + **build-arg** `BACKEND_API_URL` (pour que `next/image` autorise l'hôte média).
- `frontend/Dockerfile` : `ARG/ENV BACKEND_API_URL` dans l'étape build.

**P2b — Copie SEO rafraîchie** (retrait des mentions périmées ERP/IA) :
- `manifest.ts` : description = offre réelle (applications web & mobile, SI,
  digitalisation, formation & audit IT).
- `page.tsx` (JSON-LD Organization) : même description + `sameAs` corrigés vers
  les vrais réseaux (x.com/horuslabafrik, facebook/HorusLab, github/horus-lab-team-s)
  au lieu d'URLs inexistantes.
- `sitemap.ts` : entrées `/[lang]/news` retirées (la route redirige vers `/blog`).
- `api/chat/route.ts` (assistant Horus AI) : base de connaissances + repli FAQ
  décrivent désormais les 4 services réels (au lieu de « ERP … solutions d'IA »).

Validation : `tsc --noEmit` ✅.

**P2c — Page légale : REPORTÉE.** Décision utilisateur : Horus-Lab **pas encore
immatriculée**. On n'invente pas de forme juridique / RCCM / directeur de
publication. La page garde son bandeau ⚠️ « modèle à faire valider ». À reprendre
dès que l'immatriculation existe (remplir `legal/page.tsx` : Éditeur, Directeur
de publication, hébergeur réel du frontend).

---

## 2026-07-01 — P1 (suite & fin) : projets + équipe pilotables ✅

Complète le P1 : les **réalisations** et l'**équipe (page About)** sont désormais
pilotées par l'admin, sans régression visuelle et sans perdre les visuels de marque.

**Backend — modèle `portfolio.Project`** :
- Nouveaux champs `logo` (ImageField, upload optionnel) et `screenshots`
  (JSONField, liste d'URLs). Migration **`0003_project_logo_project_screenshots`**
  écrite à la main puis validée : `manage.py makemigrations --check` → *No changes
  detected* (la migration correspond exactement au modèle).
- Serializer (`portfolio/serializers.py`) et admin (`portfolio/admin.py`, section
  « Visuel ») exposent `logo` + `screenshots`.

**Backend — `seed.py`** (alignés sur le frontend, cutover invisible) :
- `seed_portfolio` : **5 projets** dans l'ordre de `src/lib/projects.ts`
  (Afrikamode *featured* en 1er, + ajout d'**Elec One**), textes fidèles au
  catalogue local.
- `seed_team` : rôles/bios alignés sur `about/page.tsx` (rôles sans « & CEO/CTO »,
  bios longues d'About).

**Frontend** :
- `cms.ts` `getCmsProjects` : fetch `/api/portfolio/`, tri par `order`, map + 
  **enrichissement `logo`/`screenshots` par TITRE** depuis le catalogue local
  (les logos vivent dans `/public`, non stockés côté API pour les projets seedés) ;
  un logo/des captures uploadés dans l'admin restent prioritaires. Repli total.
- `about/page.tsx` : nouvelle `resolveTeam(lang)` — utilise `getCmsTeam` si des
  membres existent (repli statique sinon) ; photo ré-associée par nom, initiales
  et badge dérivés, dégradé par nom/position.

**Validation end-to-end** (venv backend créé + deps installées) :
- `tsc --noEmit` ✅ · `py_compile` ✅ · `manage.py check` ✅ ·
  `makemigrations --check` ✅ (aucune migration manquante) ·
  `migrate` + `seed` ✅ sur SQLite.
- API interrogée en direct : `/api/portfolio/` → **5** projets (ordre correct,
  Afrikamode featured, `screenshots` = tableau), `/api/testimonials/` → **4**,
  `/api/team/` → **2** (rôles alignés), `/api/hero/` subtitle OK, `/api/services/`
  → **4**.

**État du P1 : terminé.** Home (services, témoignages, hero, réalisations) +
page About (équipe) = 100 % pilotables depuis l'admin Django, avec fallback
statique intact partout. **Rappel** : après déploiement, lancer `manage.py seed`
(idempotent) pour appliquer ces contenus par défaut ; ensuite l'admin fait foi.

**Setup local déjà avancé par l'assistant** : `backend/.venv` créé, deps
installées, base SQLite migrée + seedée. Il reste seulement `createsuperuser`
puis `runserver`. Frontend : deps déjà installées (`pnpm install`).

**Reste (hors P1)** : harmoniser `BACKEND_API_URL` vs `NEXT_PUBLIC_API_URL`,
rafraîchir la copie SEO (ERP/IA), page légale, durcissement (throttling…).

---

## 2026-07-01 — P1 : CMS pilotable (services, témoignages, hero) ✅

Objectif : rendre l'admin Django réellement pilotant pour la home, sans casser
les fallbacks ni régresser le visuel. Découverte clé : les commentaires
« backend obsolète (ERP/IA) » dans `cms.ts` étaient **périmés** — le `seed.py`
contient déjà le bon contenu. Rebrancher était donc sûr.

**Frontend — `frontend/src/lib/cms.ts`** (court-circuits retirés) :
- `getCmsServices` : fetch `/api/services/` → map `{title, desc, tags}`, tri par
  `order`, **fallback dictionnaire** si vide/erreur. (L'icône, le thème couleur
  et le slug de la page service restent dérivés de l'ordre/titre côté section,
  donc garder l'ordre 0→3 et les titres cohérents avec les 4 pages service.)
- `getCmsTestimonials` : fetch `/api/testimonials/` → map `{quote, name, role}`,
  tri **featured d'abord** puis `order` (le 1er s'affiche en grand), fallback
  dictionnaire.
- `getCmsHero` : le **sous-titre** vient maintenant du backend (`subtitle_fr/en`)
  avec repli dictionnaire si vide — au lieu d'être forcé en local.

**Backend — `backend/content/management/commands/seed.py`** (alignement zéro-régression) :
- Sous-titre hero seed = texte du dictionnaire (« Vos idées, nos solutions — du
  concept au déploiement. »).
- Témoignages seed = les **4** du dictionnaire (Aïcha N. *featured*, Kwame O.,
  Sandrine M., David K.), FR+EN, au lieu des 3 anciens. Donc au 1er `seed`, la
  home reste identique, puis l'admin prend la main.
- Services seed : déjà identiques au dictionnaire → inchangé.

**Validation** : `tsc --noEmit` ✅ (exit 0) · `py_compile` seed/serializers ✅.
Aucun changement de composant nécessaire (`page.tsx` passe déjà `services`/
`testimonials` issus de `cms.ts` aux sections).

**⚠️ Effet attendu après déploiement** : pour que le contenu vienne du backend,
il faut une base **seedée** (`python manage.py seed`) et le backend joignable via
`BACKEND_API_URL`. Sinon, fallback dictionnaire (site intact). Si une base était
déjà seedée avec les anciens témoignages, **re-lancer `seed`** pour appliquer les
4 nouveaux (idempotent par `name`).

**Reste du P1 (non fait — nécessite du schéma/asset)** :
- **Projets** : le modèle backend n'a ni `logo` ni `screenshots` (le front les
  gère en local via `/public` + Unsplash). Rebrancher tel quel dégraderait les
  visuels → ajouter ces champs (modèle + migration + serializer + seed) avant.
- **Équipe (About)** : `getCmsTeam` existe mais la page About est hardcodée avec
  photos locales ; le seed ne met pas de `photo`. À câbler avec repli photo local.
- **Env var** : `NEXT_PUBLIC_API_URL` (racine) vs `BACKEND_API_URL` (code) — à
  harmoniser.

**Note outillage local** : `corepack` de ce Node (22.13.1) est trop ancien
(erreur de signature) et `corepack enable` exige un shell admin. pnpm a été
installé via **`npm install -g pnpm`** (prefix utilisateur). Deps frontend
installées (`pnpm install`). `pnpm exec` échoue à cause du warning
`ERR_PNPM_IGNORED_BUILDS` (sharp/unrs-resolver, intentionnel) → lancer les
binaires directement, ex. `node node_modules/typescript/bin/tsc --noEmit`.

---

## 2026-07-01 — Analyse complète du projet (frontend + backend)

Première cartographie exhaustive du monorepo. Aucune modification de code — audit seul.

### Vue d'ensemble

Monorepo **Horus-Lab** = site vitrine d'une entreprise tech africaine.

```
website-horus-lab/
├── frontend/   Next.js 16.2.6 (App Router) — site public bilingue FR/EN
├── backend/    Django 5.x + DRF — API REST qui sert de CMS headless
├── docker-compose.yml   (racine) db Postgres + backend + frontend
└── .env.example         (racine) variables partagées
```

Le **CMS existe déjà** : c'est **l'admin Django** (`/admin/`). Il n'y a PAS de Wagtail / django-cms. Tout le contenu éditorial est modélisé dans l'app `content` + `blog`/`portfolio`/`news` et éditable via des `ModelAdmin` riches (français, `fieldsets` FR/EN, `list_editable`, slugs auto). ➜ **Pas besoin d'installer un nouveau CMS** ; il faut plutôt le *finir de câbler* (voir « À faire »).

### Backend (Django REST) — état

**Stack** : Django 5.0–5.1, DRF ≥3.15, django-cors-headers, psycopg3 + `dj-database-url` (Postgres en prod, **SQLite en fallback local**), Pillow, whitenoise, gunicorn. **Pas de Channels / websockets.**

**8 apps, toutes complètes** (models + serializers + views + urls + admin + migrations) :

| App | Rôle | Endpoints clés |
|---|---|---|
| `content` | Bloc CMS principal (13 modèles bilingues) | `GET /api/site/`, `/api/hero/`, `/api/services/`, `/api/process/`, `/api/values/`, `/api/sectors/`, `/api/testimonials/`, `/api/partners/`, `/api/achievements/`, `/api/stack/`, `/api/team/` |
| `blog` | Articles Markdown bilingues | `GET /api/blog/posts/`, `/api/blog/posts/{slug}/`, `/api/blog/categories/` |
| `portfolio` | Réalisations | `GET /api/portfolio/`, `/{id}/` |
| `news` | Brèves | `GET /api/news/`, `/{id}/` |
| `newsletter` | Inscriptions | **`POST /api/newsletter/`** |
| `contact` | Messages du formulaire | **`POST /api/contact/`** |
| `chat` | Chat anonyme visiteur (REST polling) | `POST /api/chat/conversations/`, `GET/POST …/{uuid}/messages/` |
| `applications` | Candidatures emploi/stage + upload | **`POST /api/applications/`** (multipart) |

- **Lecture** : tout public (`AllowAny`), `ReadOnlyModelViewSet` GET-only, pagination 20.
- **Écriture** : uniquement les 4 formulaires visiteurs (newsletter, contact, chat, applications). Le reste s'édite **dans l'admin Django** (auth session superuser/staff).
- **Chat anonyme** : conversation identifiée par UUID public + `token` secret (capability URL). Polling `?after=<id>`. Réponses de l'équipe via inline admin. Notifications Telegram + Brevo en thread daemon (optionnelles, pilotées par env).
- **Candidatures** : `FileField` (ZIP dossier), statut `new/reviewing/accepted/rejected`, lien « Télécharger le ZIP » dans l'admin. Notifications idem chat.
- **Seed** : `python manage.py seed` — seeder idempotent riche (site settings, hero, 4 services, process, 8 secteurs, 3 témoignages, 2 fondateurs réels [Loïc Tonba CEO, Edwin Tchamba CTO], 6 posts blog, 4 réalisations). En Docker : ne tourne QUE si `RUN_SEED=1`.

**Note** : deux docker-compose à la **racine** — `docker-compose.yml` (db + backend + frontend, dev simple, build local) et `docker-compose.prod.yml` (prod VPS Contabo : postgres + `web`/`frontend` tirés de GHCR, branchés sur le reverse proxy conteneur existant qui termine le TLS). Les anciens guides/stacks obsolètes ont été retirés : stack LWS backend (`backend/docker-compose.yml` + `backend/nginx/` + `backend/DEPLOYMENT.md`) et guide Vercel frontend (`frontend/DEPLOYMENT.md`) — remplacés par GHCR + `docker-compose.prod.yml` (voir `RESTE-A-FAIRE.md`).

### Frontend (Next.js 16) — état

**Stack** : Next 16.2.6 (App Router, `output: standalone`), React 19.2.4, TypeScript strict, **Tailwind v4 CSS-first** (thème dans `globals.css`, pas de `tailwind.config.js`), `marked` + `gray-matter` (blog), i18n maison (segment `[lang]`, pas de lib).

**Routing** (`src/app/[lang]/`, `lang ∈ {fr,en}`, `/` → `/fr`) : home, `about`, `portfolio`, `blog` + `blog/[slug]`, `services/[slug]` (4 pages fixes), `candidature`, `legal`, `news`→redirige vers `blog`. SEO complet (sitemap, robots, manifest PWA, JSON-LD, hreflang).

**Deux modes d'accès au backend** :
- **A. `src/lib/cms.ts`** (server-side, ISR 60 s) consomme les endpoints CMS **avec fallback statique systématique** → le site fonctionne même backend éteint.
- **B. Routes `src/app/api/*`** (proxies + services tiers) :
  - `/api/chat` → **Groq** (assistant « Horus AI », modèle `llama-3.3-70b-versatile`, fallback FAQ).
  - `/api/blog-chat` + `/api/blog-chat/messages` → proxy du chat Django.
  - `/api/applications` → forward multipart vers Django (fallback `.data/` + Brevo).
  - `/api/contact`, `/api/newsletter` → Brevo + log local.
  - `/api/health` → diagnostic Groq/Brevo.

**Fonctionnalités notables** : assistant Horus AI (widget flottant), chat live anonyme sur le blog (polling 3.5 s), formulaire candidature (drag-drop ZIP 15 Mo), blog dual-source (Django puis Markdown local), thème clair/sombre sans flash.

### ⚠️ Points d'attention identifiés

1. **CMS partiellement câblé (le vrai sujet)** : `cms.ts` **court-circuite volontairement** le backend pour **projets, services, témoignages, sous-titre hero** (`getCmsProjects/Services/Testimonials` renvoient le statique) — commentaires : « le backend contient du contenu obsolète ». Donc éditer ces sections dans l'admin **n'a aucun effet** sur le site actuellement.
2. **`getCmsTeam` = code mort** : la page About utilise une équipe **hardcodée** ; l'endpoint `/api/team/` n'est jamais consommé.
3. **Incohérence de variable d'env** : le code frontend lit **`BACKEND_API_URL`**, mais le `.env.example` **racine** documente `NEXT_PUBLIC_API_URL` (jamais lu). À harmoniser.
4. **Copie SEO périmée** : `manifest.ts` + JSON-LD home parlent encore d'« ERP … intelligence artificielle » alors que l'offre actuelle = applications / systèmes d'info / digitalisation / formation-audit.
5. **`sitemap.ts`** émet encore `/[lang]/news` (route qui redirige désormais vers `/blog`).
6. **Page legal** = template non relu (`[à compléter]` : forme juridique, RCCM, directeur de publication).
7. **Sécurité** : aucun throttling/rate-limit ni CAPTCHA sur les POST publics (newsletter/contact/chat/applications) ; `SECRET_KEY` par défaut `dev-secret-change-me` et `DEBUG=1` par défaut si non surchargé ; pas de validation type-fichier sur l'upload ZIP.
8. **Pas de tests** automatisés côté backend (`tests.py` absents).

### Environnement local constaté

- **Node** v22.13.1 ✅ · **Python** 3.13.5 ✅ · **corepack** 0.30.0 ✅
- **pnpm PAS installé** → à activer via `corepack enable pnpm` (le frontend utilise pnpm, `pnpm-lock.yaml` présent).
- Docker : non vérifié cette session.

### Prochaines étapes recommandées (voir aussi la conversation)

Priorité pour « avoir un vrai CMS pilotable » :
- **P1** — Décâbler les court-circuits de `cms.ts` (projets/services/témoignages/team) OU re-seeder le backend avec le contenu à jour, pour que l'admin pilote réellement le site.
- **P1** — Harmoniser les variables d'env (`BACKEND_API_URL`) entre `.env.example` racine, docker-compose et code.
- **P2** — Rafraîchir la copie SEO (manifest, JSON-LD), nettoyer `sitemap.ts` (news), brancher `getCmsTeam`.
- **P2** — Finaliser la page légale (contenu juridique réel).
- **P3** — Durcissement : throttling DRF, validation upload, `SECRET_KEY`/`DEBUG` prod, quelques tests.

---
<!-- Ajoutez les nouvelles entrées AU-DESSUS de cette ligne, date en tête. -->
