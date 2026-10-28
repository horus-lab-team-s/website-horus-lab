# Dossier des réalisations (PDF)

Le site propose en téléchargement un dossier PDF qui présente toutes les
réalisations (une fiche par projet) :

- `frontend/public/docs/dossier-realisations-fr.pdf`
- `frontend/public/docs/dossier-realisations-en.pdf`

Ces PDF sont **générés à partir de la page** `/{fr|en}/dossier-realisations`
(mise en page A4, non indexée par les moteurs de recherche). Son contenu vient
de `frontend/src/lib/caseStudies.ts`, la même source que les études de cas en
ligne (`/{fr|en}/portfolio/<projet>`) : le site et le PDF restent cohérents.

## Mettre le PDF à jour après une modification

1. Modifier `frontend/src/lib/caseStudies.ts` (ou la page du dossier).
2. Lancer le site en local : `cd frontend && pnpm dev`.
3. Ouvrir `http://localhost:3000/fr/dossier-realisations` dans Chrome, puis
   **Imprimer → Enregistrer au format PDF** avec :
   - format **A4**, marges **Aucune**,
   - **Graphiques d'arrière-plan** cochés.
4. Enregistrer sous `frontend/public/docs/dossier-realisations-fr.pdf`.
5. Refaire les étapes 3 et 4 avec `/en/dossier-realisations` →
   `dossier-realisations-en.pdf`.
6. Committer les deux PDF.

Le résultat attendu fait 11 pages : couverture, sommaire, une fiche par
projet, page contact. Si une fiche passe sur deux pages, raccourcir son texte
dans `caseStudies.ts`.
