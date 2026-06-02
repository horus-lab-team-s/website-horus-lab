# Déploiement du frontend sur Vercel

Ce projet est une application **Next.js 16** standard : Vercel la détecte
automatiquement, **aucun `vercel.json` n'est nécessaire**.

> ℹ️ **Architecture.** Le **frontend** (ce dossier `frontend/`) va sur **Vercel**
> → domaine `horus-lab.com`. Le **backend** Django (dossier `backend/`) est
> hébergé séparément sur votre serveur LWS via Docker + Nginx
> → `https://backend.website.horus-lab.com`. Le frontend lit le backend au
> build et en ISR via la variable `BACKEND_API_URL` ; si le backend est
> injoignable, le site retombe automatiquement sur son contenu local (zéro
> page cassée). Voir `backend/DEPLOYMENT.md` pour le backend.

## 1. Connecter le dépôt (monorepo)

1. Aller sur [vercel.com/new](https://vercel.com/new) (connecté avec votre compte).
2. Importer le dépôt GitHub `horus-lab-team-s/website-horus-lab`.
3. ⚠️ **Root Directory : `frontend`** — c'est un monorepo (frontend + backend).
   Cliquez sur **Edit** à côté de *Root Directory* et choisissez `frontend`,
   sinon le build échoue (Vercel ne trouve pas l'app Next.js à la racine).
4. Framework Preset : **Next.js** (détecté automatiquement une fois le dossier choisi).
5. Build Command / Output : laisser les valeurs par défaut.
   - Si Vercel le demande, Install Command : `pnpm install`.

## 2. Variables d'environnement

> ⚠️ **La clé API Brevo ne se met QUE ici (et dans `.env.local` en local).**
> Jamais dans le code, jamais dans Git, jamais partagée en clair.

Dans **Project → Settings → Environment Variables**, ajouter (scope *Production* + *Preview*) :

| Variable | Exemple / valeur | Requis |
|----------|------------------|--------|
| `BACKEND_API_URL` | `https://backend.website.horus-lab.com` | ✅ (sinon le contenu CMS retombe sur les données locales) |
| `BREVO_API_KEY` | _votre clé Brevo_ | ✅ (sinon les formulaires renvoient une erreur en prod) |
| `BREVO_NEWSLETTER_LIST_ID` | `3` | recommandé |
| `BREVO_CONTACT_TO` | `contact@horus-lab.com` | recommandé |
| `BREVO_SENDER_EMAIL` | `noreply@horus-lab.com` | recommandé |
| `BREVO_SENDER_NAME` | `Horus-Lab` | optionnel |
| `NEXT_PUBLIC_SITE_URL` | `https://horus-lab.com` | recommandé (SEO) |
| `GROQ_API_KEY` | _clé Groq gratuite_ | optionnel (assistant Horus AI ; sans clé → FAQ intégrée) |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | optionnel |

Après ajout/modification des variables : **redéployer** pour qu'elles soient prises en compte.

## 3. Côté Brevo (à faire une fois)

1. **Clé API** : `app.brevo.com → SMTP & API → API Keys` → créer → copier.
2. **Liste newsletter** : `Contacts → Listes` → créer → noter l'**ID** → `BREVO_NEWSLETTER_LIST_ID`.
3. **Expéditeur validé** : `Senders, Domains & Dedicated IPs` → valider
   `noreply@horus-lab.com` (idéalement authentifier le domaine `horus-lab.com`
   via SPF/DKIM pour la délivrabilité).

## 4. Domaine personnalisé

1. **Project → Settings → Domains** → ajouter `horus-lab.com` (et `www`).
2. Suivre les instructions DNS de Vercel (enregistrements A/CNAME).
3. Mettre `NEXT_PUBLIC_SITE_URL=https://horus-lab.com`, puis redéployer.

## 5. Vérifications post-déploiement

- [ ] `/` redirige vers `/fr`
- [ ] `/fr` et `/en` s'affichent, le sélecteur de langue bascule l'URL
- [ ] `/fr/blog` et un article s'ouvrent
- [ ] `/fr/about` affiche la section **Équipe** (vient du backend)
- [ ] Le **footer** affiche e-mail, téléphones, localisation et réseaux (backend)
- [ ] `/fr/portfolio` : chiffres clés + stack (backend)
- [ ] `/sitemap.xml` et `/robots.txt` répondent
- [ ] Inscription newsletter → contact visible dans Brevo (liste)
- [ ] Message de contact → e-mail reçu sur `BREVO_CONTACT_TO`

> Pour vérifier que le contenu vient bien du backend : modifiez un texte dans
> l'admin Django, attendez ~1 min (ISR) puis rechargez — le site se met à jour.
> Si le backend est éteint, tout reste affiché grâce au repli local.

## Notes techniques

- Le système de fichiers est en **lecture seule** sur Vercel : le journal local
  `.data/*.jsonl` (utile en dev) n'y écrit pas — c'est **Brevo** qui assure la
  persistance en production. Sans `BREVO_API_KEY`, une soumission renvoie `502`.
- Les pages et le blog sont **pré-rendus statiquement** ; seules les routes
  `/api/*` s'exécutent à la demande.
