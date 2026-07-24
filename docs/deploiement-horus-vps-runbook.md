# Runbook — Déployer / mettre à jour Horus-Lab sur le VPS Contabo

> Guide opérationnel pas-à-pas, tiré des commandes **réellement exécutées**.
> Pour la mise à jour courante : suivre **§3 → §4 → §5**. En cas de site non servi
> par Nginx (ex. proxy recréé) : **§6**. Rollback : **§7**. Dépannage : **§8**.
>
> ⚠️ Lis d'abord **§1 (règles d'or)** — ce VPS est **mutualisé**.

---

## 1. Règles d'or (VPS mutualisé)

Le serveur héberge plusieurs projets (afrikamode, gathe-finance, humanbcorp,
tchokos, edlearning) **plus** Horus. **On ne touche QUE** `horus_web` et
`horus_frontend`.

- ❌ **`backend-db-1`** (PostgreSQL **partagé**) : jamais `restart`/`stop`/`down`, et
  **JAMAIS `-v`** (ça détruit TOUTES les bases, pas seulement `horuslab`). Nos
  migrations partent de `horus_web` et ne touchent que la base `horuslab`.
- ❌ **`backend-nginx-1`** (proxy partagé, ports 80/443) : jamais `recreate`. On y
  **ajoute** un fichier de conf et on fait un **`reload`** gracieux, jamais plus.
- ✅ Toujours `nginx -t` **avant** un `reload`.
- ✅ Images Horus **épinglées par digest** dans `.env` → rollback facile.

**Repères :**
| Élément | Valeur |
|---|---|
| Dossier source | `/opt/horus-lab/` (`.env`, `docker-compose.prod.yml`, `horus.conf`) |
| Conteneurs | `horus_web` (`127.0.0.1:8082→8000`), `horus_frontend` (`127.0.0.1:8081→3000`) |
| Réseau | `backend_default` (`.env` → `PROXY_NETWORK`) — partagé avec le proxy ET `backend-db-1` |
| Images | `ghcr.io/horus-lab-team-s/horus-{backend,frontend}` (GHCR, **privées**) |
| Proxy | `backend-nginx-1` — conf Horus = `/etc/nginx/conf.d/horus.conf` |
| Cert | `/etc/letsencrypt/live/horus-lab.com/` (couvre `horus-lab.com` + `www` + `api`) |

---

## 2. Modèle de déploiement (à comprendre une fois)

- `/opt/horus-lab` **n'est pas un dépôt git**. Les images sont **construites par la
  CI GitHub Actions au push sur `main`** (workflows `frontend.yml` / `backend.yml`)
  et poussées sur **GHCR**. **Aucun build sur le serveur.**
- `.env` **épingle un digest** précis :
  `BACKEND_IMAGE=ghcr.io/…/horus-backend@sha256:…` (idem `FRONTEND_IMAGE`).
  Mettre à jour = **repointer ce digest** sur la nouvelle image, puis `up -d`.
- Au démarrage, l'entrypoint backend fait : **migrations** (toujours) → **seed**
  (si `RUN_SEED=1`) → superuser (idempotent) → collectstatic → Gunicorn `:8000`.
- `horus.conf` utilise `resolver 127.0.0.11` + `set $up` → Nginx **ré-résout** les
  IP à l'exécution : un `up -d` qui recrée les conteneurs **ne casse pas** le proxy,
  **aucun reload requis** après un simple redéploiement.

**Pré-requis avant toute MAJ :** avoir **mergé sur `main`** et vérifié que les **2
workflows GitHub Actions sont verts** (sinon `:latest` = ancien code).

---

## 3. Mettre à jour les images (récupérer le nouveau build)

```bash
cd /opt/horus-lab

# 3.1 — tirer le dernier :latest construit par la CI, et lire son digest + date
docker pull ghcr.io/horus-lab-team-s/horus-backend:latest
docker pull ghcr.io/horus-lab-team-s/horus-frontend:latest
docker image inspect ghcr.io/horus-lab-team-s/horus-backend:latest  --format 'backend  cree={{.Created}}  digest={{index .RepoDigests 0}}'
docker image inspect ghcr.io/horus-lab-team-s/horus-frontend:latest --format 'frontend cree={{.Created}}  digest={{index .RepoDigests 0}}'
```
- `cree=` **récent** (date/heure du merge) → OK, continuer.
- `cree=` ancien → le merge / la CI n'a pas (encore) tourné : **stop**, merger d'abord.
- Si `pull` = `denied/unauthorized` → images privées : `docker login ghcr.io -u <user> --password-stdin` avec un **PAT `read:packages`**, puis reprendre.

```bash
# 3.2 — backup .env (garde les ANCIENS digests = rollback) puis repointer
cp .env .env.bak.$(date +%F_%H%M)
sed -i "s|^BACKEND_IMAGE=.*|BACKEND_IMAGE=<DIGEST_BACKEND_AFFICHE_EN_3.1>|"  .env
sed -i "s|^FRONTEND_IMAGE=.*|FRONTEND_IMAGE=<DIGEST_FRONTEND_AFFICHE_EN_3.1>|" .env
grep -E '^BACKEND_IMAGE|^FRONTEND_IMAGE|^RUN_SEED' .env
```
> `<DIGEST_…>` = la valeur `ghcr.io/…@sha256:…` renvoyée en 3.1.

**Décider `RUN_SEED`** : le laisser à **`0`** pour préserver le contenu saisi dans
l'admin. Ne le passer à `1` que si tu veux **réinitialiser** le contenu de démo
(ex. reposer les valeurs par défaut de la bannière). Pour préserver :
```bash
sed -i 's/^RUN_SEED=.*/RUN_SEED=0/' .env
```

---

## 4. Recréer les conteneurs (uniquement web + frontend)

```bash
cd /opt/horus-lab
docker compose -f docker-compose.prod.yml up -d
sleep 8
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=60 web
docker compose -f docker-compose.prod.yml logs --tail=15 frontend
```
Attendu dans les logs `web` : `Running migrations … OK`, `Seed terminé.` (si
`RUN_SEED=1`), `Démarrage de Gunicorn sur :8000`. Le message
`CommandError: … nom d'utilisateur is already taken` est **normal** (superuser déjà
créé) — l'entrypoint continue.

> Le compose ne connaît que `web` + `frontend` → `backend-db-1`, Nginx et les autres
> projets ne sont **pas** touchés.

---

## 5. Vérifier

```bash
# 5.1 — au niveau conteneur (Host obligatoire, sinon 400 DisallowedHost)
curl -s -H "Host: api.horus-lab.com" http://127.0.0.1:8082/api/formations-promo/ | head -c 300; echo
curl -s -o /dev/null -w "site 127: %{http_code}\n" http://127.0.0.1:8081/

# 5.2 — de bout en bout via HTTPS (proxy)
curl -s -o /dev/null -w "fr  : %{http_code}\n" https://horus-lab.com/fr     # 200
curl -s -o /dev/null -w "www : %{http_code}\n" https://www.horus-lab.com/    # 307→/fr
curl -s -o /dev/null -w "api : %{http_code}\n" https://api.horus-lab.com/api/site/  # 200
```
Puis ouvrir **https://horus-lab.com** au navigateur. Si tout est vert, la MAJ est
terminée (Nginx sert déjà le site — pas de §6 nécessaire).

---

## 6. Nginx — (re)brancher le site (si non servi / après recreate du proxy)

À faire **uniquement** si le site n'est pas découvert (ex. `backend-nginx-1` a été
recréé → `horus.conf` perdu, car il n'est pas sur un volume monté).

```bash
# 6.1 — diagnostic (lecture seule)
docker exec backend-nginx-1 nginx -t
docker exec backend-nginx-1 sh -c 'ls /etc/nginx/conf.d/ | grep -qi horus && echo "horus.conf present" || echo "horus.conf ABSENT"'
docker exec backend-nginx-1 sh -c 'ls -l /etc/letsencrypt/live/horus-lab.com/ 2>&1 || echo "CERT ABSENT"'
```
- Cert **présent** → passer à 6.2.
- Cert **absent** → l'émettre via le certbot afrikamode (webroot `/var/www/certbot`,
  volume `backend_certbot_www`) **après** avoir chargé au moins le bloc HTTP de
  `horus.conf` pour servir le challenge ACME. (Cas rare : le cert existe déjà.)

```bash
# 6.2 — ajouter la conf, tester, reload (auto-revert si echec)
docker cp /opt/horus-lab/horus.conf backend-nginx-1:/etc/nginx/conf.d/horus.conf
if docker exec backend-nginx-1 nginx -t; then
  docker exec backend-nginx-1 nginx -s reload
  echo ">>> reload OK"
else
  docker exec backend-nginx-1 rm -f /etc/nginx/conf.d/horus.conf
  echo ">>> nginx -t ECHEC -> horus.conf retire, proxy inchange"
fi
```
`docker cp` + `nginx -t` ne modifient pas le proxy en cours ; on ne `reload` que si
le test passe. Reload = **gracieux**, zéro coupure pour les autres sites.

---

## 7. Rollback

```bash
cd /opt/horus-lab
cp .env.bak.<AAAA-MM-JJ_HHMM> .env        # restaure les anciens digests
docker compose -f docker-compose.prod.yml up -d
```
Ou pointer `.env` sur un digest antérieur connu, puis `up -d`. (La conf Nginx, elle,
n'est pas concernée par un rollback d'image.)

---

## 8. Dépannage

| Symptôme | Piste |
|---|---|
| `pull` = `denied/unauthorized` | `docker login ghcr.io` avec un PAT `read:packages` |
| `:latest` a une date ancienne | Merge non fait / CI non verte → merger sur `main` |
| Rien ne change après `up` | `.env` pointe encore l'ancien digest (§3.2) |
| `400 DisallowedHost` sur l'API en local | header `Host: api.horus-lab.com` obligatoire (ou passer par le domaine) |
| Site en `502` | conteneur down (`docker compose ps`/`logs`) **ou** proxy recréé → refaire §6 |
| `horus.conf ABSENT` dans le proxy | proxy recréé → refaire §6.2 (source : `/opt/horus-lab/horus.conf`) |
| `nginx -t` échoue sur le cert | cert manquant/expiré → réémettre via certbot afrikamode |
| Compte à rebours absent sur le site | `start_date` vide en base → le régler dans l'admin (Bannière Formations) ou re-seeder |
| Contenu admin écrasé après un `up` | `RUN_SEED=1` était actif → repasser à `0` (§3.2) |

---

## 9. Contenu éditable (admin)

`https://api.horus-lab.com/admin/` → **Bannière Formations (Edlearning)** :
message aperçu / annonce date (FR+EN), **lien Play Store**, **date de début +
durée** (→ fin calculée + compte à rebours), et **case « Afficher la bannière »**
pour la masquer. Modifiable **sans redéploiement** (ISR : rafraîchi en ~60 s).
