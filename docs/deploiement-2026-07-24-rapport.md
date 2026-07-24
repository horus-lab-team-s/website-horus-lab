# Rapport de déploiement — Horus-Lab (2026-07-24)

> Benchmark de la mise à jour prod des conteneurs **frontend + backend** sur le
> VPS Contabo, et branchement du site dans le reverse proxy Nginx partagé.
> Runbook réutilisable : [`deploiement-horus-vps-runbook.md`](./deploiement-horus-vps-runbook.md).

## 1. Objectif
Mettre en prod les évolutions mergées sur `main` (bannière Edlearning éditable au
CMS + compte à rebours + formateurs anonymisés + logo footer + retrait tirets),
**et** faire enfin **découvrir le site par Nginx** (il ne l'était pas : certificat
présent mais bloc serveur jamais chargé).

## 2. Contexte serveur (contraintes fortes)
VPS **mutualisé** : héberge afrikamode (propriétaire du proxy `backend-nginx-1` et
de la base `backend-db-1`), gathe-finance, humanbcorp, tchokos, edlearning **et**
Horus. Règle d'or : **ne toucher QUE `horus_web` + `horus_frontend`**, jamais la
base partagée ni le proxy (recreate interdit), et Nginx en **reload** seulement.

## 3. Ce qui a été déployé
| Domaine | Changement |
|---|---|
| Bannière | Aperçu Edlearning + annonce date, éditable admin, 2 variantes/page, refermable, réapparaît au refresh & à la navigation |
| Compte à rebours | En direct (j/h/min/s) sur toutes les pages jusqu'au **1er sept 2026**, période (début + durée → fin) pilotée CMS, auto-expiration |
| Catalogue | Formateurs forcés à « Formateurs Horus-Lab » (aucun nom individuel) |
| Divers | Logo footer horizontal (aspect-ratio), tirets cadratins retirés du texte visible |
| Backend | Modèle `FormationsPromo` + endpoint `/api/formations-promo/` + migrations `0004→0006` |

## 4. Déroulé & résultats
| Étape | Commande clé | Résultat |
|---|---|---|
| Identifier la source | `docker inspect` (labels compose) | `/opt/horus-lab`, compose GHCR (pas de git/build local) |
| Pull nouvelle image | `docker pull …:latest` | Images du **2026-07-24 14:24** (CI post-merge) ✅ |
| Repointer `.env` | `sed` sur `BACKEND_IMAGE`/`FRONTEND_IMAGE` (digests) | backend `@sha256:c29b0120…`, frontend `@sha256:0398a0db…` ; backup `.env.bak.*` |
| Recréer les conteneurs | `docker compose up -d` | web + frontend `Up`, sur les nouveaux digests |
| Migrations + seed | (entrypoint) | `content.0004/0005/0006 → OK`, `Seed terminé.`, Gunicorn `:8000`, Next `Ready` |
| Vérif conteneur | `curl 127.0.0.1:8082/api/formations-promo/` | JSON `end_date:"2026-10-01"` (= 1er sept + 1 mois) ✅ |
| Brancher Nginx | `docker cp horus.conf` → `nginx -t` → `nginx -s reload` | test OK, reload gracieux, autres sites intacts |
| Vérif externe | `curl https://horus-lab.com/fr` etc. | site/www `307→/fr`, api `200`, bannière servie ✅ |

## 5. Sécurité (garde-fous respectés)
- ✅ `backend-db-1` **jamais** touchée (migrations Horus limitées à la base `horuslab`).
- ✅ Proxy Nginx **jamais recréé** : ajout d'un fichier `horus.conf` + reload gracieux, blocs afrikamode/gathe-finance inchangés.
- ✅ Ajout Nginx **réversible** : `nginx -t` avant tout `reload`, retrait auto de `horus.conf` en cas d'échec du test.
- ✅ Images **épinglées par digest** dans `.env` (+ `.env.bak.*`) → rollback immédiat possible.

## 6. Métriques
- Build CI (GitHub Actions, sur merge `main`) : 2 images (backend + frontend) poussées sur GHCR.
- Bascule conteneurs : quasi instantanée (`up -d`, images déjà pull) ; migrations + seed + collectstatic (154 fichiers) en quelques secondes.
- Reload Nginx : **zéro coupure** (SIGHUP, workers gracieux).
- Indisponibilité perçue : ~nulle côté autres projets ; Horus est passé d'« invisible » à « servi en HTTPS ».

## 7. Résultat final
Site **en ligne et à jour** : `https://horus-lab.com` (→ `/fr`), `www`, et
`https://api.horus-lab.com` servis en HTTPS. Bannière + compte à rebours live,
alimentés par l'API (`/api/formations-promo/`).

## 8. Points de vigilance / dette technique
1. **`horus.conf` est éphémère dans le proxy** (ajouté via `docker cp`, pas sur un
   volume monté — comme `gathe-finance.conf`). Si `backend-nginx-1` est **recréé**
   (par afrikamode), le site Horus redevient invisible → refaire l'étape « Nginx »
   du runbook. Source de vérité : `/opt/horus-lab/horus.conf`.
   *Amélioration future* : monter la conf via un volume/bind-mount côté compose
   afrikamode (à coordonner avec le propriétaire du proxy).
2. **`RUN_SEED`** : le laisser à **`0`** hors premier déploiement, sinon chaque
   `up` réécrit les contenus saisis dans l'admin.
3. **Dépendance au proxy afrikamode** : le TLS et le routage d'Horus reposent sur
   `backend-nginx-1` (projet d'un tiers). Un incident/recreate de leur côté impacte
   Horus (voir point 1).
