# ============================================================================
#  NETTOYAGE-HISTORIQUE-CLAUDE.ps1   (version corrigee)
#  Horus-Lab - Retire la mention "Co-Authored-By: Claude" de TOUT l'historique
#              et unifie les identites d'auteur.
#
#  REMPLACE : docs/nettoyage-claude-github.ps1 (bugs corriges, voir NOTES en bas)
#
#  A LIRE AVANT DE LANCER
#  ----------------------
#  Constat mesure sur le depot : 77 commits, dont 62 portent le trailer
#  "Co-Authored-By: Claude", mais AUCUN commit n'a Claude comme AUTEUR.
#  => Seuls les MESSAGES doivent etre nettoyes (le mailmap "Claude" est inutile).
#
#  PREREQUIS
#    - git et Python installes et dans le PATH
#    - AUCUNE Pull Request ouverte (elles seraient cassees) -> mergez/fermez avant
#    - Protections de branche desactivees le temps de l'operation
#    - Toute l'equipe prevenue : chacun devra RE-CLONER apres
#
#  USAGE
#    1. Renseignez la section CONFIGURATION
#    2. Ouvrez PowerShell dans un dossier VIDE (ex: C:\temp\nettoyage)
#    3. .\nettoyage-historique-claude.ps1
# ============================================================================

# ----------------------------- CONFIGURATION --------------------------------
$RepoUrl   = "https://github.com/horus-lab-team-s/website-horus-lab.git"

# Identite canonique qui remplacera toutes vos variantes.
# Conseil : utilisez l'e-mail "noreply" GitHub, c'est lui qui cree le lien
# avec votre profil et fait compter les contributions.
$NomCanonique   = "LoicTonba"
$EmailCanonique = "144190628+LoicTonba@users.noreply.github.com"

# Anciennes identites a fusionner vers l'identite canonique (une par ligne)
$AnciennesIdentites = @(
  "Loic237 <144190628+LoicTonba@users.noreply.github.com>",
  "LoicTonba <tonbaloic@gmail.com>",
  "tonba loic <tonbaloic6@gmail.com>"
)

# CLAUDE.md est un fichier de CONFIGURATION (il importe AGENTS.md), pas une
# signature. Le supprimer desactive le chargement auto du contexte projet.
# Laissez $false sauf decision contraire de l'equipe.
$SupprimerClaudeMd = $false
# -----------------------------------------------------------------------------

$ErrorActionPreference = "Stop"
function Etape($m){ Write-Host "`n==> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "    [OK] $m" -ForegroundColor Green }
function Alerte($m){ Write-Host "    [!] $m" -ForegroundColor Yellow }
function Stop-Net($m){ Write-Host "`nERREUR : $m" -ForegroundColor Red; exit 1 }

$RepoName  = ($RepoUrl -split '/')[-1] -replace '\.git$',''
$MirrorDir = "$RepoName.git"
$Work      = (Get-Location).Path

# ============================================================================
# ETAPE 0 - Verifications  (CORRECTION : on teste $LASTEXITCODE, pas try/catch,
#           car en PowerShell 5.1 l'echec d'un .exe ne leve PAS d'exception)
# ============================================================================
Etape "Verification des prerequis"

if ($EmailCanonique -notmatch '@') { Stop-Net "Renseignez `$EmailCanonique." }

git --version *> $null
if ($LASTEXITCODE -ne 0) { Stop-Net "git introuvable dans le PATH." }
Ok "git detecte"

python --version *> $null
if ($LASTEXITCODE -ne 0) { Stop-Net "python introuvable dans le PATH." }
Ok "python detecte"

# Detection fiable de git-filter-repo
$FilterCmd = $null
git filter-repo --version *> $null
if ($LASTEXITCODE -eq 0) { $FilterCmd = "git" }
else {
    python -m git_filter_repo --version *> $null
    if ($LASTEXITCODE -eq 0) { $FilterCmd = "python" }
    else {
        Etape "Installation de git-filter-repo"
        pip install --user git-filter-repo
        python -m git_filter_repo --version *> $null
        if ($LASTEXITCODE -eq 0) { $FilterCmd = "python" }
        else { Stop-Net "Impossible d'installer git-filter-repo." }
    }
}
Ok "git-filter-repo pret (via $FilterCmd)"

if (Test-Path $MirrorDir) { Stop-Net "$MirrorDir existe deja. Lancez depuis un dossier vide." }

# ============================================================================
# ETAPE 1 - Couper la source pour les FUTURS commits
# ============================================================================
Etape "Desactivation de la co-signature pour l'avenir"

$claudeDir    = Join-Path $env:USERPROFILE ".claude"
$settingsPath = Join-Path $claudeDir "settings.json"
if (-not (Test-Path $claudeDir)) { New-Item -ItemType Directory -Path $claudeDir | Out-Null }

if (Test-Path $settingsPath) {
    $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json
    $settings | Add-Member -NotePropertyName "includeCoAuthoredBy" -NotePropertyValue $false -Force
} else {
    $settings = [PSCustomObject]@{ includeCoAuthoredBy = $false }
}
$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath -Encoding UTF8
Ok "includeCoAuthoredBy = false"
Alerte "Chaque developpeur doit faire de meme sur SA machine."

# ============================================================================
# ETAPE 2 - Clone mirror + regles de reecriture
# ============================================================================
Etape "Clone mirror du depot"
git clone --mirror $RepoUrl $MirrorDir
if ($LASTEXITCODE -ne 0) { Stop-Net "Le clone a echoue." }
Ok "Mirror clone dans $MirrorDir"

# --- Regles de remplacement dans les MESSAGES de commit ---
# (CORRECTION : on utilise --replace-message, plus robuste sous Windows que de
#  passer du code Python multi-ligne en argument comme le faisait l'ancien script)
$replacePath = Join-Path $Work "regles-messages.txt"
@'
regex:(?mi)^[ \t]*co-authored-by:.*claude.*\r?\n?==>
regex:(?mi)^.*generated with.*claude.*\r?\n?==>
regex:(?mi)^.*claude code.*\r?\n?==>
'@ | Set-Content $replacePath -Encoding UTF8
Ok "regles-messages.txt cree"

# --- Unification des identites d'auteur ---
$mailmapPath = Join-Path $Work "mailmap.txt"
$lignes = foreach ($a in $AnciennesIdentites) { "$NomCanonique <$EmailCanonique> $a" }
$lignes -join "`n" | Set-Content $mailmapPath -Encoding UTF8
Ok "mailmap.txt cree ($($AnciennesIdentites.Count) identites fusionnees)"

# ============================================================================
# ETAPE 3 - Reecriture
#  (CORRECTION : la variable ne s'appelle plus $args, qui est une variable
#   AUTOMATIQUE de PowerShell et rendait le splatting imprevisible)
# ============================================================================
Etape "Reecriture de l'historique"

Set-Location $MirrorDir

$frArgs = @("--force", "--mailmap", $mailmapPath, "--replace-message", $replacePath)
if ($SupprimerClaudeMd) {
    $frArgs += @("--path", "CLAUDE.md", "--invert-paths")
    Alerte "CLAUDE.md sera efface de TOUT l'historique"
}

if ($FilterCmd -eq "git") { git filter-repo @frArgs }
else                      { python -m git_filter_repo @frArgs }
if ($LASTEXITCODE -ne 0) { Set-Location $Work; Stop-Net "La reecriture a echoue." }
Ok "Historique reecrit"

# Verification objective
$restant = (git log --all --format="%B" | Select-String -Pattern "claude" -CaseSensitive:$false).Count
if ($restant -eq 0) { Ok "Verification : plus aucune mention de Claude dans les messages" }
else { Alerte "Il reste $restant ligne(s) mentionnant Claude - inspectez avant de pousser" }

# ============================================================================
# ETAPE 4 - Push force (point de non-retour)
# ============================================================================
Etape "Push de l'historique nettoye"

Write-Host ""
Write-Host "  DERNIERE VERIFICATION AVANT LE POINT DE NON-RETOUR" -ForegroundColor Yellow
Write-Host "   - Aucune Pull Request ouverte ?          (sinon elles seront cassees)"
Write-Host "   - Protections de branche desactivees ?"
Write-Host "   - Equipe prevenue qu'elle devra re-cloner ?"
Write-Host "   - Personne n'a de commits locaux non pousses ?"
Write-Host ""
$confirm = Read-Host "  Tapez OUI (majuscules) pour pousser"

if ($confirm -ceq "OUI") {
    git remote add origin $RepoUrl 2>$null
    git push --force --mirror origin
    if ($LASTEXITCODE -ne 0) { Set-Location $Work; Stop-Net "Le push a echoue (protections de branche ?)." }
    Ok "Historique nettoye pousse sur GitHub"
} else {
    Alerte "Push annule. Pour le faire plus tard :"
    Write-Host "      cd $MirrorDir"
    Write-Host "      git remote add origin $RepoUrl"
    Write-Host "      git push --force --mirror origin"
    Set-Location $Work
    exit 0
}

Set-Location $Work

# ============================================================================
# APRES
# ============================================================================
Write-Host @"

=============================================================
 TERMINE - A FAIRE MAINTENANT
=============================================================

 1. CHAQUE developpeur SUPPRIME son clone local et re-clone :
       git clone $RepoUrl
    (indispensable : un ancien clone repousserait l'ancien historique)

 2. Reactivez les protections de branche.

 3. Nettoyez A LA MAIN, sur github.com, ce que Git ne touche pas :
       - descriptions des Pull Requests
       - commentaires de PR et d'issues
    La reecriture d'historique ne les modifie PAS.

 4. La page "Contributors" peut mettre quelques heures a se mettre a jour
    (cache GitHub). Les anciens commits restent parfois accessibles par SHA
    direct : pour une purge totale, contactez le support GitHub.

 5. Les identifiants de commit cites dans JOURNAL.md deviennent obsoletes :
    pensez a les mettre a jour ou a retirer les references.

=============================================================
 NOTES - ce qui a ete corrige par rapport a l'ancien script
=============================================================
 - Detection de git-filter-repo : l'ancien try/catch ne detectait RIEN, car
   en PowerShell 5.1 l'echec d'un executable natif ne leve pas d'exception.
 - Variable `$args` : c'est une variable AUTOMATIQUE de PowerShell ; y ecrire
   puis la splatter etait imprevisible. Renommee en `$frArgs`.
 - Le mailmap "Claude" etait inutile : aucun commit n'a Claude pour AUTEUR.
   Il sert desormais a unifier VOS trois identites, ce qui est utile.
 - Le callback Python multi-ligne passe en argument est fragile sous Windows :
   remplace par --replace-message, plus simple et plus sur.
 - Ajout d'une verification objective apres reecriture.
 - CLAUDE.md n'est plus supprime par defaut (c'est un fichier de config).
 - Rappel explicite : les descriptions de PR ne sont PAS nettoyees par Git.
"@ -ForegroundColor Green
