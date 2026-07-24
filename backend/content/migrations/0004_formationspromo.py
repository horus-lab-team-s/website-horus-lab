from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0003_partner_logo_path_teammember_badge_en_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="FormationsPromo",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_active", models.BooleanField(default=True, help_text="Décochez pour masquer la bannière Edlearning sur tout le site.", verbose_name="Afficher la bannière")),
                ("badge_fr", models.CharField(blank=True, default="Aperçu", max_length=40)),
                ("badge_en", models.CharField(blank=True, default="Preview", max_length=40)),
                ("title_fr", models.CharField(blank=True, default="La formation continue sur l'app Edlearning", max_length=120)),
                ("title_en", models.CharField(blank=True, default="The full training lives on the Edlearning app", max_length=120)),
                ("body_fr", models.TextField(blank=True, default="Ce site n'est qu'un aperçu. La formation complète et le suivi des apprenants se déroulent sur notre application mobile Edlearning.")),
                ("body_en", models.TextField(blank=True, default="This site is only a preview. The complete training and learner tracking happen on our Edlearning mobile app.")),
                ("store_label_fr", models.CharField(blank=True, default="Disponible sur", max_length=40)),
                ("store_label_en", models.CharField(blank=True, default="Get it on", max_length=40)),
                ("play_url", models.URLField(blank=True, default="https://play.google.com/store/search?q=Edlearning&c=apps", help_text="URL de la fiche Play Store de l'application Edlearning.", verbose_name="Lien Play Store")),
                ("logo_path", models.CharField(blank=True, default="/logo/logo-Edlearning.png", help_text="Chemin /public du logo affiché dans la bannière.", max_length=300, verbose_name="Logo (chemin statique)")),
            ],
            options={
                "verbose_name": "Bannière Formations (Edlearning)",
                "verbose_name_plural": "Bannière Formations (Edlearning)",
            },
        ),
    ]
