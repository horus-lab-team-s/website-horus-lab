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

# Seed UNIQUEMENT si RUN_SEED=1. `seed` réécrit les contenus par défaut
# (update_or_create) : à utiliser au 1er déploiement, puis remettre RUN_SEED=0
# pour que les modifications faites dans l'admin ne soient pas écrasées.
if [ "$RUN_SEED" = "1" ]; then
  echo "→ Données par défaut (seed)..."
  python manage.py seed
else
  echo "→ Seed ignoré (RUN_SEED != 1)."
fi

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "→ Compte admin (créé s'il n'existe pas)..."
  python manage.py createsuperuser --noinput || true
fi

echo "→ Fichiers statiques..."
python manage.py collectstatic --noinput

echo "→ Démarrage de Gunicorn sur :8000"
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
