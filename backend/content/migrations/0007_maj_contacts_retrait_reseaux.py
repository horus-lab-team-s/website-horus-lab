"""Mise à jour des coordonnées publiques + retrait de X / GitHub / Telegram.

Pourquoi une migration de données et pas le seed ?
En production `RUN_SEED=0` (pour ne pas écraser le contenu saisi dans l'admin) :
le seed ne rejoue donc jamais et les anciennes valeurs resteraient en base. Or
le Footer et la page « À propos » lisent le CMS en priorité — sans cette
migration, le site continuerait d'afficher les anciens numéros.

Ce que fait la migration (et rien d'autre) :
  * SiteSettings : nouveaux téléphones, WhatsApp repointé, X/GitHub/Telegram vidés.
  * TeamMember   : GitHub vidé, WhatsApp repointé par co-fondateur.

Les colonnes `x_url`, `github_url` et `telegram_url` sont CONSERVÉES en base
(aucune suppression de champ) : rien ne casse si l'on doit revenir en arrière,
et un rollback d'image reste possible sans migration inverse.
"""

from django.db import migrations

PHONE_PRIMARY = "+237 659 90 21 91"
PHONE_SECONDARY = "+237 696 90 20 54"
WHATSAPP_SITE = "https://wa.me/237659902191"

# WhatsApp par co-fondateur (repérage par fragment de nom, insensible à la casse)
WHATSAPP_MEMBRES = {
    "TCHAMBA": "https://wa.me/237659902191",   # Edwin TCHAMBA TCHAKOUNTE
    "TONBA": "https://wa.me/237696902054",     # Loïc DJIMGOU TONBA
}


def appliquer(apps, schema_editor):
    SiteSettings = apps.get_model("content", "SiteSettings")
    TeamMember = apps.get_model("content", "TeamMember")

    # Réglages du site : un seul enregistrement (modèle singleton), mais on
    # boucle par sécurité si la base en contenait plusieurs.
    for reglages in SiteSettings.objects.all():
        reglages.phone_primary = PHONE_PRIMARY
        reglages.phone_secondary = PHONE_SECONDARY
        reglages.whatsapp_url = WHATSAPP_SITE
        reglages.x_url = ""
        reglages.github_url = ""
        reglages.telegram_url = ""
        reglages.save(update_fields=[
            "phone_primary", "phone_secondary", "whatsapp_url",
            "x_url", "github_url", "telegram_url",
        ])

    # Équipe : plus aucun lien GitHub affiché sur le site.
    TeamMember.objects.exclude(github_url="").update(github_url="")

    for fragment, lien in WHATSAPP_MEMBRES.items():
        TeamMember.objects.filter(name__icontains=fragment).update(whatsapp_url=lien)


def revenir(apps, schema_editor):
    """Pas de restauration automatique : les anciennes coordonnées ne doivent
    pas réapparaître. La migration est neutre à l'envers (aucun schéma touché)."""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0006_formationspromo_schedule"),
    ]

    operations = [
        migrations.RunPython(appliquer, revenir),
    ]
