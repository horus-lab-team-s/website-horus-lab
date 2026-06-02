# Déploiement du backend (serveur LWS · Docker + Nginx)

Ce guide met en ligne l'API Django sur **`https://backend.website.horus-lab.com`**
(admin : `https://backend.website.horus-lab.com/admin/`). Il s'adresse à un
serveur Linux (VPS LWS) sur lequel vous avez un accès SSH **root** ou `sudo`.

```
Internet ──HTTPS──▶ Nginx (conteneur) ──▶ Gunicorn/Django (conteneur web) ──▶ PostgreSQL (conteneur db)
                       │
                       ├─ /static/  (statiques admin)
                       └─ /media/   (fichiers uploadés : photos, couvertures, logos)
```

Le **frontend** (Vercel, `horus-lab.com`) est séparé : il appelle cette API via
`BACKEND_API_URL` (voir `frontend/DEPLOYMENT.md`).

---

## 0. Pré-requis

- Un serveur avec **Docker** et le plugin **Docker Compose** :
  ```bash
  curl -fsSL https://get.docker.com | sh
  docker compose version   # doit répondre
  ```
- Les ports **80** et **443** ouverts sur le serveur (pare-feu / panneau LWS).
- Accès à la **zone DNS** du domaine `horus-lab.com`.

---

## 1. DNS — pointer le sous-domaine vers le serveur

Dans la zone DNS de `horus-lab.com` (panneau LWS), créez un enregistrement **A** :

| Type | Nom (hôte)            | Valeur            |
|------|------------------------|-------------------|
| A    | `backend.website`      | _IP de votre serveur_ |

> Le nom complet devient `backend.website.horus-lab.com`. Attendez la
> propagation (quelques minutes à 1 h). Vérifiez : `ping backend.website.horus-lab.com`
> doit renvoyer l'IP de votre serveur.

---

## 2. Récupérer le code sur le serveur

```bash
git clone https://github.com/horus-lab-team-s/website-horus-lab.git
cd website-horus-lab/backend
```

---

## 3. Configurer les variables d'environnement

```bash
cp .env.example .env
nano .env
```

Renseignez **au minimum** :

```ini
DJANGO_SECRET_KEY=<chaîne longue et aléatoire>   # python -c "import secrets;print(secrets.token_urlsafe(50))"
DJANGO_DEBUG=0
DJANGO_ALLOWED_HOSTS=backend.website.horus-lab.com
CORS_ALLOWED_ORIGINS=https://horus-lab.com,https://www.horus-lab.com
CSRF_TRUSTED_ORIGINS=https://backend.website.horus-lab.com

POSTGRES_PASSWORD=<mot de passe base solide>

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=contact@horus-lab.com
DJANGO_SUPERUSER_PASSWORD=<mot de passe admin solide>

RUN_SEED=1     # ⚠️ uniquement pour ce 1er déploiement (voir étape 6)
```

---

## 4. Premier démarrage (HTTP)

```bash
docker compose up -d --build
docker compose logs -f web        # suivez : migrations → seed → admin → gunicorn
```

À ce stade l'API répond en **HTTP** :

```bash
curl http://backend.website.horus-lab.com/api/site/      # doit renvoyer du JSON
```

L'admin est joignable sur `http://backend.website.horus-lab.com/admin/`
(connexion avec le compte `DJANGO_SUPERUSER_*`).

---

## 5. Activer HTTPS (Let's Encrypt)

Le certificat se demande une fois ; il se renouvelle ensuite tout seul
(service `certbot` du compose).

```bash
# 1) Obtenir le certificat (le challenge passe par Nginx, déjà en route)
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d backend.website.horus-lab.com \
  --email contact@horus-lab.com --agree-tos --no-eff-email

# 2) Activer la config HTTPS (redirige http→https + termine TLS)
mv nginx/conf.d/default.conf nginx/conf.d/default.conf.http-only
cp nginx/conf.d/default-ssl.conf.example nginx/conf.d/default.conf

# 3) Recharger Nginx
docker compose exec nginx nginx -t        # vérifie la syntaxe
docker compose exec nginx nginx -s reload
```

Vérifiez :

```bash
curl https://backend.website.horus-lab.com/api/site/     # JSON en HTTPS
```

Admin sécurisé : `https://backend.website.horus-lab.com/admin/`

---

## 6. Sécuriser après le premier déploiement

Le `seed` réécrit les contenus de démo à chaque démarrage. **Une fois le site en
ligne et vos contenus saisis dans l'admin**, désactivez-le pour ne plus rien
écraser :

```bash
nano .env          # RUN_SEED=0
docker compose up -d        # recrée le conteneur web avec la nouvelle valeur
```

---

## 7. Brancher le frontend

Sur Vercel (`frontend/DEPLOYMENT.md`), définissez la variable :

```
BACKEND_API_URL=https://backend.website.horus-lab.com
```

puis redéployez le frontend. Le site `horus-lab.com` est alors alimenté par
cette API.

---

## 8. Mettre à jour le backend (nouvelle version du code)

```bash
cd website-horus-lab/backend
git pull
docker compose up -d --build        # rebuild + migrations auto via l'entrypoint
```

Les fichiers uploadés (`/media`) et la base (`pgdata`) sont dans des volumes
Docker : ils **survivent** aux redéploiements.

---

## 9. Sauvegardes & maintenance

```bash
# Sauvegarde de la base
docker compose exec db pg_dump -U horuslab horuslab > backup_$(date +%F).sql

# Sauvegarde des fichiers uploadés
docker run --rm -v backend_media:/m -v "$PWD":/out alpine \
  tar czf /out/media_$(date +%F).tgz -C /m .

# Logs
docker compose logs -f web
docker compose logs -f nginx

# Arrêt / redémarrage
docker compose down          # arrête (garde les volumes/données)
docker compose up -d         # redémarre
```

> ⚠️ `docker compose down -v` supprime **aussi les volumes** (base + médias) :
> à ne JAMAIS lancer en production sauf si vous voulez tout effacer.

---

## Dépannage

| Symptôme | Piste |
|---|---|
| `DisallowedHost` dans les logs | `DJANGO_ALLOWED_HOSTS` doit contenir `backend.website.horus-lab.com` |
| Admin : erreur CSRF en HTTPS | `CSRF_TRUSTED_ORIGINS=https://backend.website.horus-lab.com` |
| Le frontend ne reçoit rien (CORS) | `CORS_ALLOWED_ORIGINS` doit lister `https://horus-lab.com` |
| certbot échoue | DNS pas encore propagé, ou ports 80/443 fermés sur le serveur |
| Images uploadées en 404 | vérifier que `/media/` est servi par Nginx (volume `media`) |
