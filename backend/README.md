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
