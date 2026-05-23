# website-horus-lab

Site vitrine de **Horus-Lab** — entreprise technologique africaine : développement web & mobile, ERP, logiciels sur-mesure et solutions d'intelligence artificielle.

> _Solutions technologiques intelligentes • Impact durable_

## ✨ Fonctionnalités

- **Landing page** animée (Hero, services, méthode, secteurs, témoignages, contact).
- **Bilingue FR / EN** via routing par locale (`/fr`, `/en`) — pages statiques séparées, `hreflang`, canonical.
- **Blog** basé sur des fichiers Markdown (`content/blog/<slug>.<fr|en>.md`), pages générées statiquement (SSG).
- **Newsletter & formulaire de contact** avec validation côté serveur (Route Handlers).
- **SEO** : sitemap, robots, données structurées JSON-LD (Organization + BlogPosting).
- **Animations sans dépendance** : keyframes CSS + révélation au scroll, respect de `prefers-reduced-motion`.

## 🧱 Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) · React 19
- [Tailwind CSS 4](https://tailwindcss.com)
- TypeScript · [gray-matter](https://github.com/jonschlinkert/gray-matter) + [marked](https://marked.js.org) pour le blog
- Gestionnaire de paquets : **pnpm**

## 🚀 Démarrage

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) (redirige vers `/fr`).

### Scripts

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build de production |
| `pnpm start` | Serveur de production |
| `pnpm lint` | Analyse ESLint |

## 📁 Structure

```
src/
├─ app/
│  ├─ [lang]/            # Pages localisées (accueil + blog)
│  ├─ api/               # Route Handlers (newsletter, contact)
│  ├─ layout.tsx         # Layout racine (<html>, polices)
│  ├─ page.tsx           # Redirige / → /fr
│  ├─ sitemap.ts · robots.ts
│  └─ globals.css        # Tokens de couleurs + animations
├─ components/           # Header, Footer, sections, blog
├─ i18n/                 # Dictionnaires FR/EN + LanguageProvider
└─ lib/                  # blog.ts (markdown), leads.ts (stockage)
content/blog/            # Articles Markdown bilingues
```

## ✍️ Ajouter un article de blog

Créer deux fichiers dans `content/blog/` :

```
mon-sujet.fr.md
mon-sujet.en.md
```

Avec en-tête (frontmatter) :

```md
---
title: "Titre de l'article"
date: "2026-05-21"
excerpt: "Résumé court."
author: "Équipe Horus-Lab"
tags: ["Tag1", "Tag2"]
category: "Catégorie"
---

Contenu en Markdown…
```

> Si la traduction `.en.md` manque, la version `.fr.md` sert de repli.

## 📬 Newsletter & contact (Brevo)

Les soumissions sont validées (+ honeypot anti-spam) puis :

1. journalisées dans `.data/*.jsonl` (audit / repli en dev, ignoré par git) ;
2. envoyées à **[Brevo](https://app.brevo.com)** dès que `BREVO_API_KEY` est défini :
   - **Newsletter** → le contact est ajouté à une liste (Contacts API) ;
   - **Contact** → un e-mail transactionnel est envoyé à l'équipe (avec `reply-to` du visiteur).

### Configuration

Copier `.env.example` en `.env.local` et renseigner :

| Variable | Rôle |
|----------|------|
| `BREVO_API_KEY` | Clé API (Brevo > SMTP & API > API Keys) — **requise** pour activer l'envoi |
| `BREVO_NEWSLETTER_LIST_ID` | ID de la liste recevant les inscriptions newsletter |
| `BREVO_CONTACT_TO` | Adresse recevant les messages du formulaire |
| `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME` | Expéditeur (domaine **validé** dans Brevo) |

> Sans clé, le site fonctionne et stocke les soumissions localement. En production
> (FS en lecture seule), `BREVO_API_KEY` est nécessaire, sinon la soumission renvoie une erreur.

## ⚙️ Configuration

Le domaine de production (`https://horus-lab.com`) est référencé dans les métadonnées SEO, le sitemap et le JSON-LD. À adapter si le domaine final diffère.

---

© Horus-Lab — Made in Africa 🌍
