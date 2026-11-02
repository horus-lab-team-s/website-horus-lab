# Site Zayra Technologies : `zayra-technologies.com`

> **Depuis le 02/11/2026**, le site Zayra est servi sur `zayra-technologies.com`
> (certificat dédié, apex + www). `www.zayra-technologies.com` et l'ancien
> `zayra.technologies.horus-lab.com` redirigent en 301 vers lui (voir
> `deploy/nginx-horus.conf`). Les étapes 1 à 3 ci-dessous décrivent la mise en
> place historique du sous-domaine ; l'e-mail pro est `contact@zayra-technologies.com`.

Le même code sert deux sites, construits chacun avec sa marque :

| Site | Conteneur | Image (GHCR `horus-frontend`) | `.env` |
|---|---|---|---|
| `horus-lab.com` + `www` | `horus_frontend` | `sha-xxxxxxx` | `FRONTEND_IMAGE` |
| `zayra-technologies.com` | `zayra_frontend` | `zayra-sha-xxxxxxx` | `FRONTEND_ZAYRA_IMAGE` |

La version Zayra (`NEXT_PUBLIC_BRAND=zayra`) a ses propres titres, balises
canoniques, sitemap, JSON-LD, icône, image de partage et accents orange : c'est ce
qui permet à Google de référencer Zayra Technologies. La CI construit les deux
images à chaque push sur `main` (`.github/workflows/frontend.yml`).

> 🔒 Comme pour `RESTE-A-FAIRE.md` : chaque commande est lancée **par toi**, sur ton PC
> ou ton VPS. Les `<...>` sont remplis par toi seul.

Ordre impératif : **DNS → proxy (HTTP) → certificat → reload**. Émettre le certificat
avant que le DNS pointe sur le VPS échoue (le challenge ACME n'atteint pas le serveur).

---

## 1. DNS *(chez LWS)* 🔴

Dans la zone DNS de `horus-lab.com`, ajoute :

| Type | Nom | Valeur |
|---|---|---|
| A | `zayra.technologies` | `<IP_VPS_CONTABO>` |

⚠️ Ne touche ni aux **MX** ni aux **TXT SPF/DKIM Brevo**.

Vérifier la propagation :
```bash
dig +short zayra.technologies.horus-lab.com    # doit renvoyer <IP_VPS_CONTABO>
```
**📝** DNS OK ☐

---

## 2. Proxy Nginx (`backend-nginx-1`) *(VPS, root)* 🔴

`deploy/nginx-horus.conf` ajoute déjà le nom aux blocs HTTP (challenge ACME +
redirection) et HTTPS (site). Remplace le `horus.conf` côté hôte par cette version.

```bash
# <SOURCE_HÔTE> = dossier hôte monté sur /etc/nginx/conf.d (voir RESTE-A-FAIRE, Étape 6 b)
cp -r <SOURCE_HÔTE> <SOURCE_HÔTE>.bak
cp deploy/nginx-horus.conf <SOURCE_HÔTE>/horus.conf
docker exec backend-nginx-1 nginx -t && docker exec backend-nginx-1 nginx -s reload
#   si -t échoue : restaure <SOURCE_HÔTE>.bak puis reload.
```
**📝** conf remplacée ☐ · `nginx -t` OK ☐

---

## 3. Étendre le certificat *(VPS, root)* 🔴

On **ajoute** le nouveau nom au certificat existant `horus-lab.com` (`--expand`),
avec le certbot d'afrikamode, comme à l'Étape 6 d :

```bash
docker exec backend-certbot-1 certbot certonly --webroot -w <TON_WEBROOT_ACME> \
  --cert-name horus-lab.com --expand \
  -d horus-lab.com -d www.horus-lab.com -d api.horus-lab.com \
  -d zayra.technologies.horus-lab.com \
  --email contact@horus-lab.com --agree-tos --no-eff-email

docker exec backend-nginx-1 nginx -t && docker exec backend-nginx-1 nginx -s reload
```
Les 4 noms partagent le même fichier `/etc/letsencrypt/live/horus-lab.com/` : rien à
changer dans la conf Nginx, et le renouvellement automatique couvre les 4 noms.

**📝** certificat étendu ☐ · reload OK ☐

---

## 4. Variables du backend *(VPS, user horus)*

Le site appelle l'API côté serveur, mais on autorise quand même le nouveau domaine
pour les formulaires et l'admin. Dans le `.env` du stack, **ajoute** le domaine aux
listes existantes (sans retirer les autres) :

```
CORS_ALLOWED_ORIGINS=https://horus-lab.com,https://www.horus-lab.com,https://zayra.technologies.horus-lab.com
CSRF_TRUSTED_ORIGINS=https://horus-lab.com,https://www.horus-lab.com,https://api.horus-lab.com,https://zayra.technologies.horus-lab.com
```
Puis :
```bash
docker compose -f docker-compose.prod.yml up -d web
```
`NEXT_PUBLIC_SITE_URL` de `horus_frontend` reste `https://horus-lab.com` ; celle de
`zayra_frontend` est fixée dans `docker-compose.prod.yml` et dans l'image.

**📝** `.env` mis à jour ☐ · `web` redémarré ☐

---

## 5. Vérifier

```bash
curl -I  http://zayra.technologies.horus-lab.com/     # 301 → https
curl -I https://zayra.technologies.horus-lab.com/     # 200 / 307 → /fr
curl -sI https://zayra-technologies.com/fr/portfolio/zayra-drive | head -1   # 200
curl -sI https://zayra.technologies.horus-lab.com/fr | grep -i location   # 301 -> zayra-technologies.com
curl -s https://zayra-technologies.com/fr | grep -o '<link rel="canonical"[^>]*>'
#   doit pointer vers https://zayra-technologies.com/fr
```
Dans le navigateur : cadenas valide, logo et accents orange Zayra.

**📝** HTTPS OK ☐ · balise canonique Zayra OK ☐

---

## 6. Mettre à jour la version Zayra *(VPS, root)*

Ordre impératif : **conteneur d'abord, proxy ensuite** (sinon 502 sur le sous-domaine).

```bash
cd /opt/horus-lab
cp .env backups/env.$(date +%F_%H%M)
# digest de l'image zayra-sha-xxxxxxx (sur le PC) :
#   docker buildx imagetools inspect ghcr.io/horus-lab-team-s/horus-frontend:zayra-sha-xxxxxxx
grep -q ^FRONTEND_ZAYRA_IMAGE= .env || echo "FRONTEND_ZAYRA_IMAGE=" >> .env
sed -i 's#^FRONTEND_ZAYRA_IMAGE=.*#FRONTEND_ZAYRA_IMAGE=ghcr.io/horus-lab-team-s/horus-frontend@sha256:<digest>#' .env
docker compose -f docker-compose.prod.yml pull frontend_zayra
docker compose -f docker-compose.prod.yml up -d frontend_zayra
```

## 7. Google Search Console *(navigateur, compte Google de l'entreprise)*

1. Sur https://search.google.com/search-console, ajouter la propriété
   **préfixe d'URL** `https://zayra.technologies.horus-lab.com/`.
2. Valider avec la méthode « Enregistrement DNS » : ajouter chez LWS le TXT
   `google-site-verification=…` fourni, sur le nom `zayra.technologies`.
3. Menu **Sitemaps** : soumettre `sitemap.xml`.
4. Menu **Inspection de l'URL** : `/fr`, puis « Demander l'indexation ».
