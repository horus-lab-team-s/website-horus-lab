#!/bin/sh
# Démarrage du conteneur backend :
# 1) applique les migrations (crée/maj le schéma dans Postgres)
# 2) collecte les fichiers statiques (admin) servis par whitenoise
# 3) lance Gunicorn (serveur de production)
set -e

echo "→ Migrations..."
python manage.py migrate --noinput

echo "→ Fichiers statiques..."
python manage.py collectstatic --noinput

echo "→ Démarrage de Gunicorn sur :8000"
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
