"""
Configuration Django du backend Horus-Lab (API REST).
Toutes les sections du site (hero, services, blog, portfolio, newsletter,
contact, réglages) sont gérées ici et exposées via /api/.
"""
from pathlib import Path
import os

import dj_database_url
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Charge les variables depuis backend/.env si présent.
load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: str = "0") -> bool:
    return os.environ.get(name, default) in ("1", "true", "True", "yes")


def env_list(name: str, default: str = "") -> list[str]:
    raw = os.environ.get(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-secret-change-me")
DEBUG = env_bool("DJANGO_DEBUG", "1")
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")

# Garde-fou : interdit de démarrer en production (DEBUG=0) avec la clé de dev.
if not DEBUG and SECRET_KEY == "dev-secret-change-me":
    raise ImproperlyConfigured(
        "DJANGO_SECRET_KEY doit être défini (valeur unique et secrète) "
        "lorsque DJANGO_DEBUG=0. Renseignez-le dans l'environnement/.env."
    )

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Tiers
    "rest_framework",
    "corsheaders",
    # Apps métier
    "content",
    "blog",
    "portfolio",
    "news",
    "newsletter",
    "contact",
    "chat",
    "applications",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # doit précéder CommonMiddleware
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # sert les statiques en prod
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Base de données : PostgreSQL via DATABASE_URL en prod, SQLite en repli local.
# Ex. DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
# NB : une DATABASE_URL présente mais VIDE (cas du .env local) doit se comporter
# comme absente → repli SQLite. dj_database_url.config() ne le fait pas (chaîne
# vide = moteur "dummy"), d'où le `or` explicite avant parse().
DATABASE_URL = os.environ.get("DATABASE_URL") or "sqlite:///" + str(BASE_DIR / "db.sqlite3")
DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=600,
        conn_health_checks=True,
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Africa/Douala"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Django REST Framework ---
REST_FRAMEWORK = {
    # Lecture publique par défaut ; l'écriture passe par l'admin Django.
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    # Anti-abus : limites appliquées UNIQUEMENT aux formulaires publics (POST),
    # via ScopedRateThrottle par vue. Les lectures GET ne sont pas limitées.
    # NB : en prod multi-workers, utilisez un cache partagé (Redis/Memcached)
    # pour un comptage global — sinon chaque worker compte séparément. Et si le
    # frontend proxifie ces appels, pensez à propager l'IP réelle (X-Forwarded-For).
    "DEFAULT_THROTTLE_RATES": {
        "newsletter": "10/hour",
        "contact": "6/hour",
        "application": "10/hour",
        "forum_post": "20/hour",
    },
}

# --- CORS : autorise le frontend Next.js à appeler l'API ---
CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001"
)

# Domaines de confiance pour les formulaires admin en HTTPS (prod).
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", "")

# --- Durcissement en production (DEBUG=0) ---
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = env_bool("SECURE_SSL_REDIRECT", "0")
