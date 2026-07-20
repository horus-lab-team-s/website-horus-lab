# ============================================================================
#  NETTOYAGE-CLAUDE-GITHUB.ps1
#  Horus-Lab — Retire "claude" des contributeurs et nettoie l'historique Git
#
#  USAGE :
#    1. Modifie les 4 variables de la section CONFIGURATION ci-dessous
#    2. Ouvre PowerShell dans un dossier de travail VIDE (ex: C:\temp\nettoyage)
#    3. Exécute :  .\nettoyage-claude-github.ps1
#
#  PRÉREQUIS : git + Python (pip) installés et dans le PATH
#  ⚠️  PRÉVIENS EDWIN AVANT : après le force push, tout le monde doit re-cloner.
# ============================================================================

# ----------------------------- CONFIGURATION --------------------------------
$RepoUrl      = "https://github.com/horus-lab-team-s/website-horus-lab.git"
$TonNom       = "LoicTonba"                    # Nom d'auteur qui remplacera Claude
$TonEmail     = "ton-email@exemple.com"        # ⚠️ METS L'EMAIL LIÉ À TON COMPTE GITHUB
$SupprimerClaudeMd = $true                     # $true = efface CLAUDE.md de TOUT l'historique
# -----------------------------------------------------------------------------

$ErrorActionPreference = "Stop"
function Etape($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok($msg)    { Write-Host "    [OK] $msg" -ForegroundColor Green }
function Alerte($msg){ Write-Host "    [!] $msg" -ForegroundColor Yellow }

$RepoName = ($RepoUrl -split '/')[-1] -replace '\.git$', ''
$MirrorDir = "$RepoName.git"

# ============================================================================
# ÉTAPE 0 — Vérifications
# ============================================================================
Etape "Vérification des prérequis"

if ($TonEmail -eq "ton-email@exemple.com") {
    Write-Host "ERREUR : modifie la variable `$TonEmail dans le script avant de lancer." -ForegroundColor Red
    exit 1
}

git --version | Out-Null;    Ok "git détecté"
python --version | Out-Null; Ok "python détecté"

# Installe git-filter-repo si absent
$filterRepoOk = $false
try { git filter-repo --version | Out-Null; $filterRepoOk = $true } catch {}
if (-not $filterRepoOk) {
    Etape "Installation de git-filter-repo"
    pip install --user git-filter-repo
    try { git filter-repo --version | Out-Null; $filterRepoOk = $true }
    catch {
        Alerte "git filter-repo pas trouvé dans le PATH, on utilisera 'python -m git_filter_repo'"
    }
}
Ok "git-filter-repo prêt"

if (Test-Path $MirrorDir) {
    Write-Host "ERREUR : le dossier $MirrorDir existe déjà. Supprime-le ou lance depuis un dossier vide." -ForegroundColor Red
    exit 1
}

# ============================================================================
# ÉTAPE 1 — Désactiver la co-signature Claude pour les FUTURS commits
# ============================================================================
Etape "Configuration de Claude Code (~/.claude/settings.json)"

$claudeDir = Join-Path $env:USERPROFILE ".claude"
$settingsPath = Join-Path $claudeDir "settings.json"
if (-not (Test-Path $claudeDir)) { New-Item -ItemType Directory -Path $claudeDir | Out-Null }

if (Test-Path $settingsPath) {
    $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json
    $settings | Add-Member -NotePropertyName "includeCoAuthoredBy" -NotePropertyValue $false -Force
} else {
    $settings = [PSCustomObject]@{ includeCoAuthoredBy = $false }
}
$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath -Encoding UTF8
Ok "includeCoAuthoredBy = false (plus jamais de 'Co-Authored-By: Claude')"
Alerte "Edwin doit faire la même chose sur SA machine (copie ce bloc de config)."

# ============================================================================
# ÉTAPE 2 — Clone mirror + fichiers de nettoyage
# ============================================================================
Etape "Clone mirror du dépôt"
git clone --mirror $RepoUrl $MirrorDir
Ok "Mirror cloné dans $MirrorDir"

# Mailmap : réattribue à toi les commits dont Claude est l'auteur/co-auteur
$mailmapPath = Join-Path (Get-Location) "mailmap.txt"
@"
$TonNom <$TonEmail> Claude <noreply@anthropic.com>
$TonNom <$TonEmail> claude <noreply@anthropic.com>
$TonNom <$TonEmail> Claude <claude@anthropic.com>
"@ | Set-Content $mailmapPath -Encoding UTF8
Ok "mailmap.txt créé"

# Callback Python : purge les mentions Claude des messages de commit
$callbackPath = Join-Path (Get-Location) "message_callback.py"
@'
import re
msg = message.decode("utf-8", "replace")
msg = re.sub(r"(?mi)^\s*co-authored-by:.*claude.*$\n?", "", msg)
msg = re.sub(r"(?mi)^.*generated with.*claude.*$\n?", "", msg)
msg = re.sub(r"(?mi)^.*🤖.*claude.*$\n?", "", msg)
return msg.strip().encode("utf-8") + b"\n"
'@ | Set-Content $callbackPath -Encoding UTF8
Ok "message_callback.py créé"

# ============================================================================
# ÉTAPE 3 — Réécriture de l'historique
# ============================================================================
Etape "Réécriture de l'historique (auteurs + messages de commit)"

Set-Location $MirrorDir

$callback = Get-Content $callbackPath -Raw
$args = @("--force", "--mailmap", $mailmapPath, "--message-callback", $callback)

if ($SupprimerClaudeMd) {
    $args += @("--path", "CLAUDE.md", "--invert-paths")
    Alerte "CLAUDE.md sera effacé de TOUT l'historique"
}

if ($filterRepoOk) {
    git filter-repo @args
} else {
    python -m git_filter_repo @args
}
Ok "Historique réécrit : plus aucune trace de Claude dans les commits"

# ============================================================================
# ÉTAPE 4 — Force push (avec confirmation)
# ============================================================================
Etape "Push de l'historique nettoyé vers GitHub"

Write-Host ""
Write-Host "  ⚠️  DERNIÈRE VÉRIFICATION AVANT LE POINT DE NON-RETOUR  ⚠️" -ForegroundColor Yellow
Write-Host "  - Edwin est prévenu ? Il n'a pas de commits locaux non poussés ?"
Write-Host "  - Les protections de branche sont désactivées ? (Settings > Branches)"
Write-Host "  - Tout l'historique du repo va être remplacé (SHA différents)."
Write-Host ""
$confirm = Read-Host "  Tape OUI (en majuscules) pour pousser"

if ($confirm -ceq "OUI") {
    # filter-repo supprime l'origin par sécurité : on le remet
    git remote add origin $RepoUrl 2>$null
    git push --force --mirror origin
    Ok "Historique nettoyé poussé sur GitHub !"
} else {
    Alerte "Push annulé. Pour pousser manuellement plus tard :"
    Write-Host "      cd $MirrorDir"
    Write-Host "      git remote add origin $RepoUrl"
    Write-Host "      git push --force --mirror origin"
    Set-Location ..
    exit 0
}

Set-Location ..

# ============================================================================
# FIN — Instructions post-nettoyage
# ============================================================================
Write-Host ""
Write-Host "=============================================================" -ForegroundColor Green
Write-Host " NETTOYAGE TERMINÉ — À FAIRE MAINTENANT :" -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green
Write-Host @"

 1. TOI ET EDWIN : supprimez vos anciens clones locaux et re-clonez :
      git clone $RepoUrl

 2. Réactivez les protections de branche si vous les aviez désactivées.

 3. Vérifiez la page Contributors du repo :
    'claude' peut mettre quelques heures à disparaître (cache GitHub).

 4. Vérifiez à la main les fichiers README.md, JOURNAL.md,
    RESTE-A-FAIRE.md, AGENTS.md pour d'éventuelles mentions de Claude
    dans le CONTENU (le script ne touche que l'historique + CLAUDE.md).

 5. Edwin doit ajouter sur sa machine, dans ~/.claude/settings.json :
      { "includeCoAuthoredBy": false }

"@
