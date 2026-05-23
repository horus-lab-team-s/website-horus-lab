#!/bin/sh
# Démarrage du conteneur backend :
# 1) migrations (crée/maj le schéma dans Postgres)
# 2) données par défaut (seed, idempotent)
# 3) compte admin auto si DJANGO_SUPERUSER_* fournis
# 4) fichiers statiques (admin) servis par whitenoise
# 5) Gunicorn (serveur de production)
set -e

echo "→ Migrations..."
python manage.py migrate --noinput

echo "→ Données par défaut (seed)..."
python manage.py seed

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "→ Compte admin (créé s'il n'existe pas)..."
  python manage.py createsuperuser --noinput || true
fi

echo "→ Fichiers statiques..."
python manage.py collectstatic --noinput

echo "→ Démarrage de Gunicorn sur :8000"
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
