# Serveur Horus-Lab — diagnostic puis mise à jour du site

> **Deux parties :**
> **A.** commandes de **diagnostic** (lecture seule) → tu me renvoies la sortie, je fais le point.
> **B.** la **mise à jour** du site à proprement parler.
>
> Fais **A** d'abord. Ne lance **B** qu'après mon feu vert (ou si tu es pressé et que
> le diagnostic ne montre rien d'anormal).

---

## ⛔ Les 3 interdits (VPS mutualisé — 5 autres projets tournent dessus)

1. **Jamais** `restart` / `stop` / `down` sur **`backend-db-1`** (PostgreSQL partagé),
   et **JAMAIS l'option `-v`** : elle détruirait les bases de **tous** les projets.
2. **Jamais** de `recreate` / `up -d` / `down` sur **`backend-nginx-1`** (le proxy
   partagé, ports 80/443). On peut seulement **ajouter un fichier de conf** et faire
   un **`reload` gracieux**, toujours après un `nginx -t` réussi.
3. **Rien à récupérer par git sur le serveur.** `/opt/horus-lab` **n'est pas un dépôt
   git** : il ne contient que `docker-compose.prod.yml`, `.env` et `horus.conf`.
   Le code voyage dans les **images Docker**. Le « pull » à faire est un
   **`docker pull` d'images**, pas un `git pull`.

Toutes les commandes de la **partie A** sont en **lecture seule** : elles ne modifient
rien, ne redémarrent rien.

---

# PARTIE A — Diagnostic (lecture seule)

## A.0 — Le bloc à copier-coller d'un coup

Colle ce bloc entier dans le terminal du serveur. Il écrit tout dans un fichier,
puis l'affiche. **Tu me renvoies la sortie.**

```bash
OUT=/tmp/horus-diagnostic.txt
{
echo "########## 1. MACHINE ##########"
hostname; uname -a; uptime
echo "--- disque ---"; df -h / /var/lib/docker 2>/dev/null | sort -u
echo "--- memoire ---"; free -h

echo; echo "########## 2. TOUS LES CONTENEURS (tous projets) ##########"
docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'

echo; echo "########## 3. RESEAUX DOCKER ##########"
docker network ls
echo "--- membres du reseau backend_default ---"
docker network inspect backend_default --format '{{range .Containers}}{{.Name}} {{end}}' 2>/dev/null || echo "reseau backend_default introuvable"

echo; echo "########## 4. VOLUMES ##########"
docker volume ls

echo; echo "########## 5. DOSSIER /opt/horus-lab ##########"
ls -la /opt/horus-lab 2>/dev/null || echo "/opt/horus-lab ABSENT"
echo "--- est-ce un depot git ? ---"
[ -d /opt/horus-lab/.git ] && echo "OUI (inattendu)" || echo "NON (attendu : le code vient des images)"

echo; echo "########## 6. .env — VALEURS NON SENSIBLES ##########"
grep -E '^(BACKEND_IMAGE|FRONTEND_IMAGE|RUN_SEED|PROXY_NETWORK|BACKEND_PORT|FRONTEND_PORT|BACKEND_API_URL|NEXT_PUBLIC_SITE_URL|POSTGRES_HOST|POSTGRES_DB|POSTGRES_USER|DJANGO_DEBUG|DJANGO_ALLOWED_HOSTS|CORS_ALLOWED_ORIGINS|CSRF_TRUSTED_ORIGINS|SECURE_SSL_REDIRECT|ADMIN_BASE_URL|GROQ_MODEL|BREVO_SENDER_EMAIL|BREVO_NEWSLETTER_LIST_ID)=' /opt/horus-lab/.env 2>/dev/null

echo; echo "########## 7. .env — AUTRES CLES (valeurs MASQUEES) ##########"
sed -E 's/^([A-Za-z0-9_]+)=.+/\1=<defini>/' /opt/horus-lab/.env 2>/dev/null | grep -E '=' | grep -vE '^\s*#' | grep -vE '^(BACKEND_IMAGE|FRONTEND_IMAGE|RUN_SEED|PROXY_NETWORK|BACKEND_PORT|FRONTEND_PORT|BACKEND_API_URL|NEXT_PUBLIC_SITE_URL|POSTGRES_HOST|POSTGRES_DB|POSTGRES_USER|DJANGO_DEBUG|DJANGO_ALLOWED_HOSTS|CORS_ALLOWED_ORIGINS|CSRF_TRUSTED_ORIGINS|SECURE_SSL_REDIRECT|ADMIN_BASE_URL|GROQ_MODEL|BREVO_SENDER_EMAIL|BREVO_NEWSLETTER_LIST_ID)='
echo "--- droits du fichier ---"; ls -l /opt/horus-lab/.env 2>/dev/null
echo "--- sauvegardes .env existantes ---"; ls -1 /opt/horus-lab/.env.bak.* 2>/dev/null | tail -5 || echo "aucune"

echo; echo "########## 8. STACK HORUS ##########"
cd /opt/horus-lab 2>/dev/null && docker compose -f docker-compose.prod.yml ps
echo "--- images Horus presentes localement ---"
docker images 'ghcr.io/horus-lab-team-s/*' --format 'table {{.Repository}}\t{{.Tag}}\t{{.CreatedSince}}\t{{.ID}}'
echo "--- digest des images actuellement UTILISEES par les conteneurs ---"
docker inspect horus_web horus_frontend --format '{{.Name}} image={{.Config.Image}} demarre={{.State.StartedAt}} statut={{.State.Status}}' 2>/dev/null

echo; echo "########## 9. PROXY NGINX (lecture seule) ##########"
docker exec backend-nginx-1 nginx -t 2>&1
echo "--- fichiers de conf presents ---"
docker exec backend-nginx-1 sh -c 'ls -1 /etc/nginx/conf.d/' 2>&1
echo "--- horus.conf present ? ---"
docker exec backend-nginx-1 sh -c 'ls /etc/nginx/conf.d/ | grep -qi horus && echo "PRESENT" || echo "ABSENT (a remettre : voir B.5)"' 2>&1
echo "--- certificat TLS ---"
docker exec backend-nginx-1 sh -c 'ls -l /etc/letsencrypt/live/horus-lab.com/ 2>&1 || echo "CERT ABSENT"' 2>&1

echo; echo "########## 10. BASE DE DONNEES (lecture seule) ##########"
docker exec backend-db-1 psql -U postgres -c '\l' 2>&1 | head -20
echo "--- migrations Django deja appliquees sur content ---"
cd /opt/horus-lab 2>/dev/null && docker compose -f docker-compose.prod.yml exec -T web python manage.py showmigrations content 2>&1 | tail -12

echo; echo "########## 11. CRON ##########"
crontab -l 2>&1 | grep -vE '^\s*#' | grep -v '^$' || echo "aucune tache cron"

echo; echo "########## 12. SANTE DU SITE ##########"
curl -s -o /dev/null -w "site local  8081 : %{http_code}\n" http://127.0.0.1:8081/
curl -s -o /dev/null -w "api  local  8082 : %{http_code}\n" -H "Host: api.horus-lab.com" http://127.0.0.1:8082/api/site/
curl -s -o /dev/null -w "https fr        : %{http_code}\n" https://horus-lab.com/fr
curl -s -o /dev/null -w "https www       : %{http_code}\n" https://www.horus-lab.com/
curl -s -o /dev/null -w "https api       : %{http_code}\n" https://api.horus-lab.com/api/site/
echo "--- coordonnees actuellement en base ---"
curl -s -H "Host: api.horus-lab.com" http://127.0.0.1:8082/api/site/ | grep -o '"phone_[a-z]*":"[^"]*"'
echo "--- reseaux encore affiches sur le site ---"
curl -s https://horus-lab.com/fr | grep -o 'github\|t\.me\|x\.com/horuslab' | sort | uniq -c
} 2>&1 | tee $OUT
echo; echo ">>> Sortie enregistree dans $OUT — envoie-la moi."
```

### Ce que je cherche dans cette sortie
- la **liste réelle** des conteneurs et des projets voisins (pour ne rien casser) ;
- si **`horus.conf`** est bien présent dans le proxy (sinon → **B.5**) ;
- le **digest** actuellement épinglé dans `.env` (point de rollback) ;
- l'état de **`RUN_SEED`** (doit être `0`) ;
- les **migrations `content`** déjà appliquées (pour savoir si `0007` est passée) ;
- si le **cron des actualités tech** est en place ;
- les **numéros actuellement servis** par l'API.

> ⚠️ Le bloc masque les mots de passe et clés d'API (section 7 n'affiche que les noms
> de variables). Si tu vois malgré tout une valeur sensible dans la sortie, retire-la
> avant de me l'envoyer.

---

# PARTIE B — Mettre à jour le site

## B.0 — Ce qui va se passer (à comprendre une fois)

```
ton PC ──push──▶ branche ──PR──▶ merge sur main
                                    │
                    GitHub Actions construit les images
                    (frontend/** → chaine "frontend", backend/** → chaine "backend")
                                    ▼
                        publication sur GHCR (tags latest + sha-court)
                                    ▼
        serveur : docker pull ──▶ lire le digest ──▶ l'epingler dans .env ──▶ up -d
                        (rien n'est jamais construit sur le VPS)
```

**Aucune image n'est construite tant que rien n'est mergé sur `main`.**

## B.1 — Prérequis : merger, puis attendre le vert

Deux commits sont en attente sur la branche `feat/refonte-site-pro` :

| Commit | Contenu | Reconstruit une image ? |
|---|---|---|
| `0f51413` | cahier des charges (PDF) + carte mentale (PNG) | **non** (docs uniquement) |
| `fbb49b4` | nouveaux numéros + retrait X / Telegram / GitHub | **oui — les deux** |

Merge sur `main`, puis **vérifie que les 2 workflows GitHub Actions sont verts**.
Sinon `:latest` pointe encore l'ancien code.

## B.2 — Tirer les nouvelles images (le vrai « pull »)

```bash
cd /opt/horus-lab
docker pull ghcr.io/horus-lab-team-s/horus-backend:latest
docker pull ghcr.io/horus-lab-team-s/horus-frontend:latest

docker image inspect ghcr.io/horus-lab-team-s/horus-backend:latest  --format 'backend  cree={{.Created}}  {{index .RepoDigests 0}}'
docker image inspect ghcr.io/horus-lab-team-s/horus-frontend:latest --format 'frontend cree={{.Created}}  {{index .RepoDigests 0}}'
```

- `cree=` **récent** (heure du merge) → continue.
- `cree=` **ancien** → le merge ou la CI n'a pas abouti : **arrête-toi**, corrige en amont.
- `denied` / `unauthorized` → images privées :
  `docker login ghcr.io -u <ton-user>` avec un **PAT `read:packages`**, puis reprends.

**Note les 2 lignes `sha256:…`**, tu en as besoin juste après.

## B.3 — Épingler les digests dans `.env`

```bash
cd /opt/horus-lab
cp .env .env.bak.$(date +%F_%H%M)          # <<< c'est ton point de rollback

sed -i "s|^BACKEND_IMAGE=.*|BACKEND_IMAGE=<COLLE_ICI_LE_DIGEST_BACKEND>|"   .env
sed -i "s|^FRONTEND_IMAGE=.*|FRONTEND_IMAGE=<COLLE_ICI_LE_DIGEST_FRONTEND>|" .env

grep -E '^BACKEND_IMAGE|^FRONTEND_IMAGE|^RUN_SEED' .env
```

`<COLLE_ICI_LE_DIGEST_…>` = la valeur complète `ghcr.io/…@sha256:…` lue en **B.2**.

> **`RUN_SEED` doit rester à `0`.** La correction des numéros de téléphone **ne passe
> pas par le seed** mais par une migration (voir B.4) : ton contenu saisi dans l'admin
> est préservé. Si `RUN_SEED=1`, remets-le à 0 :
> `sed -i 's/^RUN_SEED=.*/RUN_SEED=0/' .env`

## B.4 — Recréer les 2 conteneurs Horus

```bash
cd /opt/horus-lab
docker compose -f docker-compose.prod.yml up -d
sleep 12
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=50 web
```

Dans les logs de `web`, tu dois voir :

```
Applying content.0007_maj_contacts_retrait_reseaux... OK
...
Démarrage de Gunicorn sur :8000
```

**Cette ligne `0007` est le cœur de cette mise à jour** : c'est elle qui écrit les
nouveaux numéros en base. Sans elle, le site continuerait d'afficher les anciens,
parce que le pied de page et la page « À propos » lisent le **CMS en priorité**.

Le message `CommandError: … nom d'utilisateur is already taken` est **normal**
(superuser déjà créé) — l'entrypoint continue.

> Le compose ne déclare que `web` et `frontend` : `backend-db-1`, le proxy Nginx et
> les 5 autres projets ne sont **pas** touchés par cette commande.

## B.5 — Nginx

**Pour cette mise à jour : rien à faire.** `horus.conf` utilise `resolver 127.0.0.11`
+ `set $up` → Nginx **ré-résout** l'adresse des conteneurs à l'exécution. Recréer
`horus_web` / `horus_frontend` ne casse donc pas le routage, **aucun reload n'est requis**.

**Si tu veux quand même recharger** (ou si le diagnostic A.9 a montré un souci) :

```bash
docker exec backend-nginx-1 nginx -t && docker exec backend-nginx-1 nginx -s reload
```

Le `nginx -t` passe **en premier** : si le test échoue, le `reload` ne s'exécute pas
et le proxy reste intact pour les autres sites. Le reload est **gracieux** : zéro coupure.

**Uniquement si `horus.conf` est ABSENT** (proxy recréé par un autre projet — il n'est
pas sur un volume monté, sa conf est donc perdue) :

```bash
docker cp /opt/horus-lab/horus.conf backend-nginx-1:/etc/nginx/conf.d/horus.conf
if docker exec backend-nginx-1 nginx -t; then
  docker exec backend-nginx-1 nginx -s reload
  echo ">>> reload OK"
else
  docker exec backend-nginx-1 rm -f /etc/nginx/conf.d/horus.conf
  echo ">>> nginx -t ECHEC -> conf retiree, proxy inchange"
fi
```

⛔ **Jamais** `docker compose ... up -d` / `restart` / `down` sur `backend-nginx-1`.

## B.6 — Vérifier

```bash
# 1) au niveau conteneur (l'en-tete Host est obligatoire, sinon 400 DisallowedHost)
curl -s -H "Host: api.horus-lab.com" http://127.0.0.1:8082/api/site/ | grep -o '"phone_[a-z]*":"[^"]*"'
curl -s -o /dev/null -w "site 127 : %{http_code}\n" http://127.0.0.1:8081/

# 2) de bout en bout en HTTPS
curl -s -o /dev/null -w "fr  : %{http_code}\n" https://horus-lab.com/fr        # 200
curl -s -o /dev/null -w "www : %{http_code}\n" https://www.horus-lab.com/       # 307 -> /fr
curl -s -o /dev/null -w "api : %{http_code}\n" https://api.horus-lab.com/api/site/  # 200

# 3) le contenu de CETTE mise a jour (laisser ~70 s a l'ISR pour regenerer)
sleep 70
curl -s https://horus-lab.com/fr | grep -o 'tel:+237[0-9]*' | sort -u
curl -s https://horus-lab.com/fr | grep -c 'github\|t\.me\|x\.com/horuslab'
```

**Attendu :**

| Contrôle | Résultat attendu |
|---|---|
| `phone_primary` / `phone_secondary` | `+237 659 90 21 91` et `+237 696 90 20 54` |
| `tel:` sur la page | `tel:+237659902191` et `tel:+237696902054` |
| compteur github / t.me / x.com | **`0`** |
| codes HTTP | `200`, `307`, `200` |

Puis ouvre **https://horus-lab.com/fr** au navigateur (vide le cache : `Ctrl+Maj+R`) :
- pied de page → **3 icônes** seulement : LinkedIn, Facebook, WhatsApp ;
- bulle Horus AI en bas à droite → au survol : **e-mail + WhatsApp**, plus de Telegram ;
- `/fr/about` → cartes fondateurs **sans icône GitHub** ; WhatsApp d'Edwin → `659902191`,
  celui de Loïc → `696902054`.

## B.7 — Rollback

```bash
cd /opt/horus-lab
ls -1 .env.bak.*                      # repere la sauvegarde de B.3
cp .env.bak.<AAAA-MM-JJ_HHMM> .env    # restaure les anciens digests
docker compose -f docker-compose.prod.yml up -d
```

La migration `0007`, elle, ne se rejoue pas à l'envers — mais elle ne touche **que**
les champs de contact (téléphones, WhatsApp, X/GitHub/Telegram vidés). Aucun risque
pour le reste du contenu. Les colonnes `x_url` / `github_url` / `telegram_url` ont été
**conservées en base** exprès : rien n'a été supprimé au niveau du schéma.

## B.8 — Après coup : le cron des actualités tech

Si le diagnostic **A.11** n'a montré aucune tâche `fetch_tech_news`, la section
« Actualités tech » du blog restera vide. À poser une fois :

```bash
cd /opt/horus-lab
docker compose -f docker-compose.prod.yml exec -T web python manage.py fetch_tech_news
crontab -e
# ajouter cette ligne :
# 0 */4 * * * cd /opt/horus-lab && docker compose -f docker-compose.prod.yml exec -T web python manage.py fetch_tech_news >> /var/log/horus-technews.log 2>&1
```

---

## Dépannage rapide

| Symptôme | Cause / traitement |
|---|---|
| `docker pull` → `denied` / `unauthorized` | Images privées → `docker login ghcr.io` avec un PAT `read:packages` |
| L'image `:latest` a une date ancienne | Merge non fait ou CI en échec → corriger sur GitHub, pas sur le serveur |
| Rien ne change après `up -d` | `.env` épingle encore l'ancien digest (refaire **B.3**) |
| Les anciens numéros s'affichent encore | La migration `0007` n'est pas passée → vérifier les logs `web` (**B.4**) |
| Page pas à jour dans le navigateur | Cache ISR (~60 s) puis cache navigateur → attendre, puis `Ctrl+Maj+R` |
| `400 DisallowedHost` sur l'API en local | En-tête `Host: api.horus-lab.com` manquant |
| Site en `502` | Conteneur arrêté (`docker compose ps` / `logs`) **ou** proxy recréé → **B.5** |
| `horus.conf ABSENT` dans le proxy | Proxy recréé → remettre la conf (**B.5**) |
| Contenu de l'admin écrasé | `RUN_SEED=1` était actif → repasser à `0` (**B.3**) |

---

*Document généré le 2026-08-05. Complète le manuel d'exploitation
`docs/deploiement-horus-vps-runbook.md`, qu'il ne remplace pas.*
