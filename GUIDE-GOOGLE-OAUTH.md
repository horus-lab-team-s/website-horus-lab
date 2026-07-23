# Guide — Connexion Google (OAuth) pour Horus-Lab

> But : activer le bouton **« Continuer avec Google »** sur les pages de connexion /
> inscription des Formations. Durée : ~5 min. **Gratuit.**
>
> 🔑 Notre méthode vérifie le **jeton d'identité Google côté serveur** → on a
> besoin **uniquement du Client ID** (une valeur publique). Le **« client secret »
> n'est PAS nécessaire** — ne le colle nulle part, ne le partage pas.

---

## Ce qu'on veut obtenir

Un **ID client OAuth** de type *Application Web*, qui ressemble à :

```
1234567890-abcdefg.apps.googleusercontent.com
```

On le mettra à **deux endroits** (mêmes valeurs) :
- `backend/.env`   → `GOOGLE_CLIENT_ID=...`            (le serveur vérifie le jeton)
- `frontend/.env.local` → `NEXT_PUBLIC_GOOGLE_CLIENT_ID=...` (le bouton Google)

---

## Étape 1 — Créer / choisir un projet Google Cloud

1. Va sur **https://console.cloud.google.com/**  (connecte-toi avec le compte
   Google de l'entreprise, ex. `horus8391@gmail.com`).
2. En haut, ouvre le **sélecteur de projet** → **Nouveau projet**.
   - Nom : `Horus-Lab` → **Créer**. Sélectionne-le ensuite.

## Étape 2 — Configurer l'écran de consentement OAuth

*(obligatoire avant de créer un identifiant)*

1. Menu ☰ → **API et services** → **Écran de consentement OAuth**
   (*OAuth consent screen*).
2. Type d'utilisateur : **Externe** → **Créer**.
3. Renseigne :
   - **Nom de l'application** : `Horus-Lab`
   - **E-mail d'assistance utilisateur** : `contact@horus-lab.com` (ou ton gmail)
   - **Logo** (facultatif) : le logo Horus-Lab
   - **Domaines autorisés** (facultatif en test) : `horus-lab.com`
   - **Coordonnées du développeur** : ton e-mail
   → **Enregistrer et continuer**.
4. **Champs d'application** (*Scopes*) : clique **Ajouter ou supprimer des champs**,
   coche **`.../auth/userinfo.email`** et **`.../auth/userinfo.profile`** (+ `openid`),
   → **Mettre à jour** → **Enregistrer et continuer**.
5. **Utilisateurs test** : tant que l'app n'est pas « publiée », seuls les comptes
   listés ici peuvent se connecter. **Ajoute ton adresse Google** (et celles de
   l'équipe) → **Enregistrer et continuer** → **Revenir au tableau de bord**.

> ℹ️ En test, c'est suffisant. Pour ouvrir à **tout le monde** en production, il
> faudra cliquer **« Publier l'application »** (voir la section Production plus bas).

## Étape 3 — Créer l'ID client OAuth (Application Web)

1. **API et services** → **Identifiants** (*Credentials*).
2. **+ Créer des identifiants** → **ID client OAuth**.
3. **Type d'application** : **Application Web**.
4. **Nom** : `Horus-Lab Web`.
5. **Origines JavaScript autorisées** — clique **+ Ajouter un URI** pour CHACUNE :
   ```
   http://localhost:3000
   http://localhost:3001
   https://horus-lab.com
   https://www.horus-lab.com
   ```
   *(les deux `localhost` = développement ; les deux `horus-lab.com` = production)*
6. **URI de redirection autorisés** : **laisse vide** (notre bouton utilise le
   flux « jeton d'identité » de Google Identity Services, sans redirection).
7. **Créer**.
8. Une fenêtre affiche **« Votre ID client »** → **copie-le** (finit par
   `.apps.googleusercontent.com`). *(Ignore le « secret du client ».)*

## Étape 4 — Coller le Client ID dans le projet

Ouvre les deux fichiers et ajoute la ligne (remplace par ta vraie valeur) :

**`backend/.env`**
```env
GOOGLE_CLIENT_ID=1234567890-abcdefg.apps.googleusercontent.com
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-abcdefg.apps.googleusercontent.com
```

> Même valeur aux deux endroits. Ces fichiers sont **git-ignorés** (pas de fuite
> dans le dépôt). Le Client ID est public de toute façon — aucun risque.

## Étape 5 — Redémarrer et vérifier (côté backend)

1. Redémarre le backend :
   ```bash
   cd backend
   ./.venv/Scripts/python.exe manage.py runserver
   ```
2. Test rapide (dans un autre terminal) — un jeton bidon doit passer de
   **503 (non configuré)** à **401 (jeton invalide)**, ce qui **prouve que la clé
   est bien prise en compte** :
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" -X POST \
     -H "Content-Type: application/json" \
     -d "{\"credential\":\"x\"}" \
     http://127.0.0.1:8000/api/auth/google/
   ```
   - `401` → ✅ configuration OK (la vraie connexion marchera depuis le bouton).
   - `503` → la clé n'est pas lue (vérifie l'orthographe `GOOGLE_CLIENT_ID` et le
     redémarrage).

✅ À ce stade, Google OAuth est **prêt côté serveur**. Le bouton
« Continuer avec Google » sera branché en **Phase 3** (pages front) avec la clé
`NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

---

## Passage en production (plus tard)

- Les origines `https://horus-lab.com` / `https://www.horus-lab.com` sont déjà
  ajoutées (Étape 3.5) → rien à refaire côté identifiants.
- **Publier l'app** : Écran de consentement OAuth → **Publier l'application** (sinon
  seuls les « utilisateurs test » peuvent se connecter). Pour les scopes de base
  (email/profil), Google **ne demande généralement pas** de validation lourde.
- Sur le VPS, ajouter `GOOGLE_CLIENT_ID` (backend) et `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
  (frontend) dans le `.env` de prod, puis redéployer.

## Dépannage

| Symptôme | Cause probable |
|---|---|
| Bouton Google : `origin_mismatch` / popup bloquée | L'origine (ex. `http://localhost:3001`) n'est pas dans **Origines JavaScript autorisées**. Ajoute-la (Étape 3.5). |
| `/api/auth/google/` renvoie `503` | `GOOGLE_CLIENT_ID` absent/mal orthographié dans `backend/.env`, ou backend pas redémarré. |
| `/api/auth/google/` renvoie `401` avec un vrai jeton | Le Client ID du frontend ≠ celui du backend. Mets **exactement la même** valeur aux deux endroits. |
| « Accès bloqué : cette app n'est pas validée » | Ton compte n'est pas dans **Utilisateurs test**, ou l'app n'est pas publiée. Ajoute-toi en test (Étape 2.5). |

---
*Une fois le Client ID en place, préviens-moi : je branche le bouton Google dans
les pages de connexion à la Phase 3.*
