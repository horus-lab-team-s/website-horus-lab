# Backend Horus-Lab — Django REST API

API qui pilote **tout le contenu** du site (modifiable via l'admin Django) :
réglages du site, hero, services, méthode, valeurs, secteurs, témoignages,
blog, réalisations, newsletter et messages de contact.

## Stack
- Django 5 + Django REST Framework
- SQLite (par défaut) · django-cors-headers · Pillow (images)

## Démarrage

```bash
cd backend
python -m venv .venv
# Windows : .venv\Scripts\activate   |  macOS/Linux : source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env          # puis adaptez si besoin
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver     # http://127.0.0.1:8000
```

- **Admin** (édition du contenu) : http://127.0.0.1:8000/admin/
- **API** : http://127.0.0.1:8000/api/

## Endpoints principaux (lecture publique)

| Méthode | URL | Rôle |
|---|---|---|
| GET | `/api/site/` | Réglages (coordonnées, réseaux) |
| GET | `/api/hero/` | Hero : textes + slides + stats |
| GET | `/api/services/` | Services |
| GET | `/api/process/` | Étapes de méthode |
| GET | `/api/values/` | Valeurs (« Pourquoi nous ») |
| GET | `/api/sectors/` | Secteurs |
| GET | `/api/testimonials/` | Témoignages |
| GET | `/api/blog/posts/` · `/api/blog/posts/<slug>/` | Articles |
| GET | `/api/blog/categories/` | Catégories |
| GET | `/api/portfolio/` | Réalisations |
| POST | `/api/newsletter/` | Inscription `{ email }` |
| POST | `/api/contact/` | Message `{ name, email, subject, message }` |

## Bilingue
Chaque texte traduisible existe en `_fr` et `_en` (ex. `title_fr`, `title_en`).
Le frontend choisit la langue. L'écriture se fait dans l'admin ; les endpoints
publics sont en lecture seule (sauf newsletter/contact qui acceptent un POST).

## CORS
`CORS_ALLOWED_ORIGINS` (dans `.env`) doit lister l'URL du frontend
(ex. `http://localhost:3000`, et plus tard votre domaine de prod).

## Base de données PostgreSQL (en ligne)

Le code lit `DATABASE_URL`. Sans elle → SQLite (dev). Avec elle → PostgreSQL.

1. Créez une base Postgres managée (gratuit pour démarrer) :
   - **Neon** (recommandé) : https://neon.tech → New Project → copiez la
     *connection string* (format `postgresql://user:pass@host/db?sslmode=require`).
   - Alternatives : Supabase, Railway, Render.
2. Mettez-la dans `backend/.env` :
   ```
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   ```
3. Construisez tout le schéma (tables + relations, automatique) :
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
   → la base en ligne contient maintenant toutes les tables. Le CRUD se fait
   dans l'admin Django.

## Déploiement (serveur LWS · Docker + Nginx)

👉 **Guide complet pas-à-pas : [`DEPLOYMENT.md`](DEPLOYMENT.md)** — DNS,
`docker compose up`, certificat HTTPS Let's Encrypt, branchement du frontend,
sauvegardes. Cible : `https://backend.website.horus-lab.com`.

En résumé (le détail est dans le guide) :

```bash
cp .env.example .env        # renseigner secrets, domaines, mot de passe DB
docker compose up -d --build
```

Le `docker-compose.yml` lance PostgreSQL + Gunicorn/Django + Nginx (reverse
proxy, HTTPS, service de `/static` et `/media`). Migrations, seed (optionnel via
`RUN_SEED`), compte admin et `collectstatic` sont automatiques au démarrage
(voir `entrypoint.sh`).

### Alternative sans Docker (gunicorn nu)

```bash
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```
Variables d'env de prod : `DJANGO_DEBUG=0`, `DJANGO_SECRET_KEY=...`,
`DJANGO_ALLOWED_HOSTS=backend.website.horus-lab.com`, `DATABASE_URL=...`,
`CSRF_TRUSTED_ORIGINS=https://backend.website.horus-lab.com`,
`CORS_ALLOWED_ORIGINS=https://horus-lab.com`. Placez Nginx devant Gunicorn.
