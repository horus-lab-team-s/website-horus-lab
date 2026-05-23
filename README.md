# Horus-Lab — Monorepo

Site et API de **Horus-Lab**, entreprise technologique africaine
(développement web & mobile, ERP, logiciels sur-mesure, solutions IA).

## Structure

```
website-horus-lab/
├── frontend/   # Application Next.js 16 (site public, FR/EN, blog, Horus AI)
└── backend/    # API Django REST (CMS de tout le contenu du site)
```

## Démarrage rapide

**Frontend** (port 3000) :
```bash
cd frontend
pnpm install
pnpm dev
```

**Backend** (port 8000) :
```bash
cd backend
python -m venv .venv && . .venv/Scripts/activate   # ou source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Voir `frontend/README.md` et `backend/README.md` pour le détail.

## Idée d'architecture
Le backend expose une API REST (`/api/…`) consommée par le frontend. Tout le
contenu (hero, services, blog, réalisations, témoignages, réglages, etc.) est
éditable depuis l'**admin Django**, sans toucher au code du frontend.
