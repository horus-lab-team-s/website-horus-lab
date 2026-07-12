# Horus-Lab — RESTE À FAIRE (mise en ligne)

> **But** : mettre `horus-lab.com` (site) + l'admin/CMS Django (`api.horus-lab.com`)
> en ligne sur ton **VPS Contabo**, DNS géré chez **LWS**, code sur GitHub
> **`horus-lab-team-s`**.
> **Modèle** : CI/CD via **GHCR** — GitHub Actions construit les images Docker →
> les pousse sur *GitHub Container Registry* → le VPS fait juste `pull && up -d`.
> (Le projet *Tchokos* est **un projet séparé** ; on s'en inspire seulement pour
> la méthode, pas pour l'infra.)
>
> 🔒 **Sécurité — tu ne me donnes AUCUNE info serveur.** Chaque commande ci-dessous
> est exécutée **par toi**, sur ta machine / ton VPS. Je n'ai jamais besoin de ton
> IP, de ton mot de passe root, ni d'aucune clé. Les `<...>` sont remplis **par toi
> seul**. La clé de déploiement du CI est générée **sur ton VPS** et collée dans
> GitHub **par toi** — je ne la vois pas.
>
> Coche au fur et à mesure. Les 🔴 sont bloquants.

Accès (dans chaque terminal de **ton** PC — tu te connectes en root + mot de passe) :
```bash
SRV=root@<IP_VPS_CONTABO>        # ⬅️ toi seul connais cette valeur
```

---

## Contexte VPS (important pour le design)

Ton VPS héberge **déjà plusieurs projets** derrière un **reverse proxy Nginx EN
CONTENEUR** (`backend-nginx-1`, ports 80/443). **On ne lance donc PAS notre propre
Nginx** (conflit de ports → casse tes autres sites). De plus, **on ne lance PAS non
plus notre propre PostgreSQL** : on **réutilise le conteneur `backend-db-1` déjà en
marche** (une base + un rôle dédiés `horuslab`). À la place :

> 🧭 **Repère concret (relevé sur le VPS, `docker ps`).** Le proxy `backend-nginx-1`
> et la base `backend-db-1` font partie du **même projet Docker Compose `backend` =
> le projet AFRIKAMODE** (mêmes préfixes : `backend-nginx-1`, `backend-db-1`,
> `backend-web-1`, `backend-celery_*`, `backend-redis-1`, `backend-certbot-1`).
> **Conséquence directe** : proxy ET base sont sur **le même réseau `backend_default`**.
> On fait donc rejoindre à nos conteneurs **ce seul réseau** (`PROXY_NETWORK=backend_default`)
> → il couvre **à la fois** le routage par le proxy **et** l'accès à la base par nom.
> ⚠️ On ne touche JAMAIS au projet afrikamode (pas de `down`, pas de `-v`) : on ne
> fait que **rejoindre son réseau** et **lire sa base** via notre rôle dédié `horuslab`.


- Nos conteneurs `horus_web` / `horus_frontend` **rejoignent le réseau Docker de
  ton proxy** (variable `PROXY_NETWORK`) → joignables **par nom**.
- **Ton proxy existant** (`backend-nginx-1`) termine le TLS et route `horus-lab.com`
  + `api.horus-lab.com` vers eux (2 blocs `server` — dans `deploy/nginx-horus.conf`).
- **`horus_web` se connecte à `backend-db-1`** par nom sur ce même réseau
  (`DATABASE_URL` → `POSTGRES_HOST=backend-db-1`).

```
        Internet (HTTPS)
              │
   ┌──────────▼───────────┐   backend-nginx-1 (déjà là, 80/443)
   │  horus-lab.com / www  │   + TES autres projets · termine le TLS
   │  api.horus-lab.com    │   (certbot: backend-certbot-1)
   └─────┬───────────┬─────┘
         │  réseau Docker `PROXY_NETWORK` (par NOM de conteneur)
   ┌─────▼─────┐  ┌──▼───────────────┐      ┌──────────────┐
   │horus_front│  │   horus_web       │────▶│ backend-db-1 │  postgres EXISTANT
   │end :3000  │  │  (Django) :8000   │ nom │ base horuslab │  (réutilisé)
   └───────────┘  └───────────────────┘     └──────────────┘
```

**Décisions retenues :**
- API sur **`api.horus-lab.com`** (le site sur `horus-lab.com` + `www`).
- Images : `ghcr.io/horus-lab-team-s/horus-frontend` et `…/horus-backend`.
- **Base réutilisée** : conteneur `backend-db-1` (aucun postgres lancé par notre
  stack). ⚠️ Couplage assumé : ne fais JAMAIS `docker compose down -v` sur le
  projet propriétaire de `backend-db-1` (ça effacerait aussi notre base). Nos
  fichiers uploadés vivent, eux, dans nos volumes `media`/`static` (indépendants).
- `/static` servi par WhiteNoise, `/media` servi par l'app Django (aucun volume à
  monter dans ton proxy → un simple `proxy_pass` suffit).

> Avant l'Étape 4, **confirme** le nom du réseau partagé par le proxy ET
> `backend-db-1` (attendu : **`backend_default`**, puisqu'ils sont dans le même
> projet afrikamode) :
> ```bash
> docker inspect backend-db-1 backend-nginx-1 \
>   --format '{{.Name}} : {{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
> ```
> Les deux lignes doivent afficher **le même** réseau → c'est la valeur de
> `PROXY_NETWORK`. Dans le cas (improbable ici) où ils seraient sur des réseaux
> DIFFÉRENTS, ajoute le réseau de la base à `web` dans `docker-compose.prod.yml`.

---

# PARTIE A — Chaîne CI/CD *(faite ✅ — à relire puis pousser)*

Ces fichiers **ont été créés** dans le dépôt (branche courante). Il te reste à les
**relire, committer et pousser sur `main`** pour que la CI construise les images.

| # | Fichier | Rôle | État |
|---|---|---|---|
| A1 | `.github/workflows/backend.yml` | Push `backend/**` → build → `ghcr.io/horus-lab-team-s/horus-backend` → (si activé) SSH deploy | ✅ créé |
| A2 | `.github/workflows/frontend.yml` | Idem `frontend/**` → `horus-frontend` (build-arg `BACKEND_API_URL`) | ✅ créé |
| A3 | `docker-compose.prod.yml` | Stack prod : web + frontend (exposés sur `127.0.0.1`), **base réutilisée `backend-db-1`** (pas de db/Nginx/certbot lancés) | ✅ créé |
| A4 | `stack.env.example` | Modèle du `.env` du VPS (secrets, Brevo, superuser…) | ✅ créé |
| A5 | `deploy/nginx-horus.conf` | Les 2 blocs `server` à coller dans **ton proxy existant** | ✅ créé |
| A6 | `backend/config/urls.py` | Sert `/media` en prod (évite de monter le volume média dans ton proxy) | ✅ modifié |

**Action :**
```bash
git add .github docker-compose.prod.yml stack.env.example deploy backend/config/urls.py RESTE-A-FAIRE.md
git commit -m "infra: chaine CI/CD GHCR + stack prod (branchement proxy existant)"
git push origin main
```
Puis, onglet **Actions** du dépôt : les 2 workflows doivent passer au **vert**
(ils construisent et poussent les 1ères images sur GHCR).

**📝** poussé sur `main` ☐ · workflow **backend** vert ☐ · workflow **frontend** vert ☐

---

# PARTIE B — Mise en ligne *(checklist ordonnée)*

## ÉTAPE 0 — DNS *(chez LWS)* 🔴
Dans la **zone DNS LWS** de `horus-lab.com`, faire pointer les 3 noms sur le VPS :

| Type | Nom | Valeur |
|---|---|---|
| A | `horus-lab.com` (apex / `@`) | `<IP_VPS_CONTABO>` |
| A | `www` | `<IP_VPS_CONTABO>` (ou CNAME → `horus-lab.com`) |
| A | `api` | `<IP_VPS_CONTABO>` |

⚠️ **Ne touche PAS** aux **MX** ni aux **TXT SPF/DKIM Brevo** déjà en place
(`horus-lab.com` est authentifié Brevo depuis le 2026-05-17, `contact@horus-lab.com`
reçoit déjà) — sinon tu casses l'e-mail. Supprime d'éventuels **AAAA** parasites.

Vérifier (propagation : quelques minutes à quelques heures) :
```bash
dig +short horus-lab.com          # doit renvoyer <IP_VPS_CONTABO>
dig +short www.horus-lab.com
dig +short api.horus-lab.com
```
**📝** DNS OK ? ☐ apex ☐ www ☐ api ☐ (MX/SPF/DKIM intacts)

---

## ÉTAPE 1 — Authentifier le VPS à GHCR (images PRIVÉES) *(VPS, user horus)* 🔴
**Décision retenue : on garde les 2 images PRIVÉES.** Le VPS doit donc s'identifier
auprès de GHCR pour les `pull`. *(L'étape 1.2 se fait en tant que `horus` → si tu
n'as pas encore créé cet utilisateur, fais d'abord l'Étape 2, puis reviens ici.)*

1. Sur GitHub → **Settings → Developer settings → Personal access tokens (classic)**
   → *Generate* avec le **seul** scope **`read:packages`** (le VPS ne fait que puller).
   L'image appartenant à l'**org** `horus-lab-team-s`, vérifie que l'org autorise ce
   PAT (Org → Settings → Personal access tokens) et que le package est bien lié au repo.
2. Sur le VPS, **en tant que `horus`** (l'utilisateur que le CI utilise pour déployer —
   ⚠️ *pas* root, sinon le `pull` du CI ne trouvera pas les creds) :
   ```bash
   su - horus
   echo 'ghp_TON_TOKEN' | docker login ghcr.io -u TON_USER_GITHUB --password-stdin
   ```
   Les identifiants persistent dans `/home/horus/.docker/config.json` (chmod 600) →
   valable pour les `pull` manuels **et** l'auto-déploiement (Étape 8). Un seul login
   couvre `horus-backend` **et** `horus-frontend` (même registre `ghcr.io`).

> Si un jour le PAT expire → `pull` en `denied`/`unauthorized` : refais ce login.
> Alternative (rendre les 2 packages **Public** → plus aucun login) reste possible,
> mais on a choisi le privé.

**📝** PAT `read:packages` créé ☐ · `docker login ghcr.io` réussi (user horus) ☐

---

## ÉTAPE 2 — Préparer le VPS : user de déploiement + clé CI *(VPS, root)* 🔴
Docker est sans doute **déjà installé** (tu as d'autres projets). On crée juste un
utilisateur dédié + un dossier + une clé SSH pour le CI (séparée de ton accès root).
```bash
ssh "$SRV"          # root + mot de passe (toi seul)
# --- sur le VPS ---
docker compose version           # confirme que Docker est là (sinon: curl -fsSL https://get.docker.com | sh)

# Utilisateur dédié (le CI se connecte avec lui, PAS avec root)
adduser --disabled-password --gecos "" horus
usermod -aG docker horus
mkdir -p /opt/horus-lab && chown -R horus:horus /opt/horus-lab

# Clé SSH dédiée au CI (générée ICI, sur ton VPS)
ssh-keygen -t ed25519 -C "ci-horus" -f /tmp/horus_ci -N ""
mkdir -p /home/horus/.ssh && chmod 700 /home/horus/.ssh
cat /tmp/horus_ci.pub >> /home/horus/.ssh/authorized_keys
chmod 600 /home/horus/.ssh/authorized_keys && chown -R horus:horus /home/horus/.ssh
echo "===== CLE PRIVEE CI (copie TOUT le bloc, BEGIN…END inclus) ====="
cat /tmp/horus_ci
echo "==============================================================="
rm /tmp/horus_ci /tmp/horus_ci.pub
exit
```
> Ports 80/443 : **déjà ouverts** pour tes autres projets — rien à changer. Ne
> touche pas au pare-feu pour ces ports.

**📝** user `horus` ☐ · dossier `/opt/horus-lab` ☐ · clé privée CI copiée ☐

---

## ÉTAPE 3 — Poser les secrets CI sur le dépôt GitHub *(ton PC)* 🔴
Monorepo = **un seul dépôt**, donc un seul jeu de secrets.
```bash
R=horus-lab-team-s/website-horus-lab
gh secret set SSH_KEY  -R $R     # colle la clé privée CI (Étape 2) puis Ctrl-D
gh secret set SSH_HOST -R $R     # tape l'IP du VPS puis Ctrl-D (reste chez toi)
gh secret set SSH_USER -R $R --body "horus"
gh variable set DEPLOY_PATH     -R $R --body "/opt/horus-lab"
gh variable set DEPLOY_ENABLED  -R $R --body "false"   # activé à l'Étape 8
```
**📝** SSH_KEY ☐ · SSH_HOST ☐ · SSH_USER ☐ · DEPLOY_PATH ☐ · DEPLOY_ENABLED=false ☐

---

## ÉTAPE 4 — Déposer le stack + remplir le `.env` *(VPS, user horus)* 🔴
Depuis **ton PC**, à la racine du dépôt :
```bash
scp docker-compose.prod.yml stack.env.example "$SRV":/opt/horus-lab/
scp -r deploy                                 "$SRV":/opt/horus-lab/
ssh "$SRV" 'chown -R horus:horus /opt/horus-lab'
```
Sur le VPS, en tant que `horus` :
```bash
ssh "$SRV"; su - horus
cd /opt/horus-lab
cp stack.env.example .env && chmod 600 .env
echo "DJANGO_SECRET_KEY = $(python3 -c 'import secrets;print(secrets.token_urlsafe(64))')"
echo "POSTGRES_PASSWORD = $(openssl rand -hex 24)"
nano .env
```
À remplir dans `.env` (garde secret + mot de passe base **au chaud**) :
- `DJANGO_SECRET_KEY`, `POSTGRES_PASSWORD` (les valeurs générées ci-dessus)
- `POSTGRES_HOST=backend-db-1` (conteneur postgres réutilisé — déjà pré-rempli)
- `DJANGO_ALLOWED_HOSTS=api.horus-lab.com`
- `CORS_ALLOWED_ORIGINS=https://horus-lab.com,https://www.horus-lab.com`
- `CSRF_TRUSTED_ORIGINS=https://api.horus-lab.com`
- `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL=contact@horus-lab.com`, `DJANGO_SUPERUSER_PASSWORD`
- `BREVO_API_KEY` (clé dédiée, compte horus8391), `BREVO_CONTACT_TO`/`BREVO_SENDER_EMAIL=contact@horus-lab.com`
- `ADMIN_BASE_URL=https://api.horus-lab.com`, `GROQ_API_KEY`
- `RUN_SEED=1`  ⬅️ **1er déploiement seulement** (on repasse à 0 à l'Étape 7)
- `PROXY_NETWORK=backend_default`  ⬅️ **le réseau partagé par le proxy ET `backend-db-1`** (projet afrikamode ; confirme avec la commande du « Contexte VPS ») — indispensable, sinon `up -d` échoue
- `BACKEND_PORT=8082`, `FRONTEND_PORT=8081` (ports 127.0.0.1 de débogage ; change-les si déjà pris)

**Créer la base + le rôle dédiés dans `backend-db-1`** (une seule fois ; remplace
`<POSTGRES_PASSWORD>` par la valeur mise dans `.env`) :
```bash
docker exec -i backend-db-1 sh -c 'psql -U "$POSTGRES_USER"' <<'SQL'
CREATE ROLE horuslab LOGIN PASSWORD '<POSTGRES_PASSWORD>';
CREATE DATABASE horuslab OWNER horuslab;
SQL
```
> ⚠️ **Brevo — IP autorisées** : le compte horus8391 filtre par IP → **autorise
> l'IP du VPS** dans Brevo (Sécurité → IP autorisées), sinon les e-mails → 401.

**📝** `.env` rempli (chmod 600) ☐ · `PROXY_NETWORK` renseigné ☐ · base+rôle `horuslab` créés dans `backend-db-1` ☐ · secrets notés ☐ · IP VPS autorisée dans Brevo ☐

---

## ÉTAPE 5 — Démarrer le stack *(VPS, user horus)* 🔴
```bash
cd /opt/horus-lab
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml logs -f web
#   attendu : Migrations → seed (RUN_SEED=1) → compte admin → collectstatic → Gunicorn :8000
```
Vérifier en local sur le VPS *(le header `Host` est obligatoire pour l'API, sinon
Django renvoie 400 `DisallowedHost` — c'est NORMAL, pas une erreur)* :
```bash
# API Django -> JSON
curl -s -H "Host: api.horus-lab.com" http://127.0.0.1:8082/api/site/ | head -c 120; echo
# Frontend Next -> 200 ou 307 (redirige vers /fr)
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8081/
```
**📝** API JSON ☐ · front `200`/`307` ☐

---

## ÉTAPE 6 — Brancher le proxy afrikamode (`backend-nginx-1`) + HTTPS *(VPS, root)* 🔴
DNS de l'Étape 0 propagé **avant** d'émettre le certificat. Ici on modifie la config
du **proxy d'afrikamode** (`backend-nginx-1`) — donc **on sauvegarde d'abord** et on
ne recharge qu'après un `nginx -t` OK, pour **ne pas casser afrikamode** ni tes autres
sites.

**a) Vérifier que nos conteneurs sont bien sur le réseau du proxy** (fait
automatiquement par le compose via `PROXY_NETWORK`, y compris après redéploiement) :
```bash
docker network inspect backend_default | grep -E "horus_web|horus_frontend"
#   doit lister les 2 conteneurs (+ backend-nginx-1)
```

**b) Localiser la config Nginx montée dans `backend-nginx-1`.** C'est un `nginx:alpine`
brut → sa conf vient d'un **bind-mount** du projet afrikamode sur l'hôte. Trouve le
fichier/dossier hôte à éditer :
```bash
docker inspect backend-nginx-1 \
  --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{"\n"}}{{end}}'
#   repère la Source hôte mappée sur /etc/nginx/conf.d (ou /etc/nginx/…)
```

**c) Ajouter les 2 blocs `server`.** Ouvre `deploy/nginx-horus.conf` (upstreams déjà
réglés sur `horus_web:8000` / `horus_frontend:3000`), adapte les chemins TLS + le
webroot ACME, puis **ajoute-le côté hôte** dans le dossier repéré en (b) — de
préférence comme **fichier séparé** `horus.conf` (ne modifie pas les blocs afrikamode).
⚠️ **Sauvegarde d'abord** le dossier de conf : `cp -r <SOURCE_HÔTE> <SOURCE_HÔTE>.bak`.

**d) Émettre le certificat des 3 noms** via le **certbot d'afrikamode**
(`backend-certbot-1`), même mécanisme que pour ses domaines :
```bash
docker exec backend-certbot-1 certbot certonly --webroot -w <TON_WEBROOT_ACME> \
  -d horus-lab.com -d www.horus-lab.com -d api.horus-lab.com \
  --email contact@horus-lab.com --agree-tos --no-eff-email
#   <TON_WEBROOT_ACME> = le webroot ACME déjà utilisé par afrikamode (visible dans sa conf nginx)
```

**e) Tester la config puis recharger** (sans couper afrikamode ni tes autres sites) :
```bash
docker exec backend-nginx-1 nginx -t && docker exec backend-nginx-1 nginx -s reload
#   si -t échoue : restaure <SOURCE_HÔTE>.bak puis reload.
```

Vérifier depuis l'extérieur :
```bash
curl -I  http://horus-lab.com/            # 301 → https
curl -I https://horus-lab.com/             # 200 / 307 → /fr
curl -s  https://api.horus-lab.com/api/site/ | head -c 80; echo   # JSON
```
**📝** blocs ajoutés ☐ · certificat émis ☐ · `nginx -t` OK ☐ · site 200 ☐ · API JSON HTTPS ☐

---

## ÉTAPE 7 — Finalisation & vérifications *(VPS + navigateur)*
Le superuser est normalement créé par l'entrypoint (`DJANGO_SUPERUSER_*`). Sinon :
```bash
cd /opt/horus-lab
docker compose -f docker-compose.prod.yml exec web python manage.py createsuperuser
```
Checklist site :
- [ ] `https://horus-lab.com/` → `/fr` ; `/fr` et `/en` s'affichent (sélecteur de langue)
- [ ] `/fr/blog` + un article ; le **forum public** sous l'article répond
- [ ] `/fr/about` affiche l'**Équipe** (vient du backend → le CMS pilote bien)
- [ ] **footer** (e-mail, téléphones, réseaux) + `/fr/portfolio` (backend)
- [ ] **images** d'articles/équipe s'affichent (prouve que `/media` passe)
- [ ] `/sitemap.xml` + `/robots.txt` répondent
- [ ] **Newsletter** → contact dans Brevo (liste 5) · **Contact** → e-mail reçu sur `contact@horus-lab.com`
- [ ] **Candidature** → ZIP enregistré + notif
- [ ] Admin `https://api.horus-lab.com/admin/` : login superuser OK

**Sécuriser le seed** : il réécrit les contenus de démo à chaque démarrage. **Une
fois tes vrais contenus saisis dans l'admin**, désactive-le :
```bash
nano .env        # RUN_SEED=0
docker compose -f docker-compose.prod.yml up -d web
```
**📝** superuser ☐ · site OK ☐ · admin OK ☐ · e-mails OK ☐ · `RUN_SEED=0` ☐

---

## ÉTAPE 8 — Activer l'auto-déploiement *(ton PC — APRÈS que tout marche)*
```bash
gh variable set DEPLOY_ENABLED -R horus-lab-team-s/website-horus-lab --body "true"
```
Désormais chaque `git push` sur `main` :
- touchant `backend/**`  → rebuild `horus-backend` → GHCR → SSH → `pull && up -d web`
- touchant `frontend/**` → rebuild `horus-frontend` → GHCR → SSH → `pull && up -d frontend`

**📝** auto-déploiement activé ☐

---

## Sécurité / rappels
- `.env` du VPS : **chmod 600, jamais committé**. `DJANGO_DEBUG=0` en prod.
- **Change le mot de passe admin** après le 1er login (celui du `.env` est connu).
- Stable → passe `SECURE_SSL_REDIRECT=1` dans `.env` puis `up -d web` (la redirection
  HTTP→HTTPS est déjà faite par ton proxy ; ceci durcit côté Django).
- **Rollback** : dans `.env`, épingle `BACKEND_IMAGE=…:sha-XXXX` (ou `FRONTEND_IMAGE`)
  puis `up -d`.
- **Sauvegardes** (la base vit dans `backend-db-1`, PAS dans notre stack) :
  ```bash
  docker exec backend-db-1 pg_dump -U horuslab horuslab > backup_$(date +%F).sql
  docker run --rm -v horus-lab_media:/m -v "$PWD":/out alpine tar czf /out/media_$(date +%F).tgz -C /m .
  ```
  (Le nom du volume est préfixé par le dossier : `horus-lab_media` — vérifie avec `docker volume ls`.)
- ⚠️ `docker compose down -v` supprime **nos volumes** (`media`/`static`) : JAMAIS en
  prod. Notre **base** est dans `backend-db-1` (projet d'un coéquipier) → un
  `down -v` sur SON projet détruirait la base `horuslab` : à ne jamais faire non plus.

## Dépannage
| Symptôme | Piste |
|---|---|
| `DisallowedHost` | `DJANGO_ALLOWED_HOSTS` doit contenir `api.horus-lab.com` |
| Erreur CSRF en HTTPS (admin) | `CSRF_TRUSTED_ORIGINS=https://api.horus-lab.com` |
| Le site ne reçoit rien du CMS | `CORS_ALLOWED_ORIGINS` doit lister `https://horus-lab.com` |
| `502 Bad Gateway` sur le proxy | `horus_web`/`horus_frontend` pas sur `PROXY_NETWORK` (`docker network inspect`), ou `up -d` échoué car `PROXY_NETWORK` vide/faux |
| `network <nom> not found` au `up -d` | `PROXY_NETWORK` ne correspond pas à un réseau réel (`docker network ls`) |
| Port déjà pris au `up -d` | un autre projet occupe 8081/8082 → change `BACKEND_PORT`/`FRONTEND_PORT` dans `.env` |
| Images/médias en 404 | `/media` : vérifier que l'image backend inclut le fix `config/urls.py` (A6) |
| E-mails en 401 | IP du VPS non autorisée dans Brevo |
| Le VPS ne `pull` pas (`denied`/`unauthorized`) | pas de `docker login ghcr.io` (ou fait en root au lieu de `horus`), ou PAT expiré → refais l'Étape 1 en tant que `horus` |

## État de départ (pour mémoire)
- ✅ Monorepo `horus-lab-team-s/website-horus-lab` · Dockerfiles front+back · gunicorn ·
  domaine `horus-lab.com` (LWS) authentifié Brevo · **chaîne CI/CD + stack prod créés** (PARTIE A).
- ↩︎ Design adapté : VPS partagé (plusieurs projets) → on se branche sur le **proxy
  existant** au lieu de lancer notre propre Nginx/certbot.

<!-- Voir JOURNAL.md pour l'historique fonctionnel du projet. -->
