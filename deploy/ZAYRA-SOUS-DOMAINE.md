# Servir le site sur `zayra.technologies.horus-lab.com`

Le même conteneur `horus_frontend` sert `horus-lab.com`, `www.horus-lab.com` et
`zayra.technologies.horus-lab.com`. Aucun nouveau conteneur, aucune nouvelle image :
on ajoute un nom au DNS, au proxy Nginx et au certificat.

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
`NEXT_PUBLIC_SITE_URL` **reste** `https://horus-lab.com` : c'est l'URL canonique
déclarée aux moteurs de recherche, pour que Google ne voie pas deux sites identiques.

**📝** `.env` mis à jour ☐ · `web` redémarré ☐

---

## 5. Vérifier

```bash
curl -I  http://zayra.technologies.horus-lab.com/     # 301 → https
curl -I https://zayra.technologies.horus-lab.com/     # 200 / 307 → /fr
curl -sI https://zayra.technologies.horus-lab.com/fr/solutions/drive | head -1   # 200
```
Dans le navigateur : cadenas valide, page d'accueil Zayra, pages `/fr/solutions/…`.

**📝** HTTPS OK ☐ · pages solutions OK ☐
