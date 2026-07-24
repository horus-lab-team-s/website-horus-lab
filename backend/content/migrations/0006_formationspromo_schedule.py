from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0005_formationspromo_teaser"),
    ]

    operations = [
        migrations.AddField(
            model_name="formationspromo",
            name="start_date",
            field=models.DateField(blank=True, null=True, help_text="Début de la formation (ex. 2026-09-01). Vide = ni compte à rebours, ni expiration.", verbose_name="Date de début"),
        ),
        migrations.AddField(
            model_name="formationspromo",
            name="duration_value",
            field=models.PositiveIntegerField(default=1, verbose_name="Durée"),
        ),
        migrations.AddField(
            model_name="formationspromo",
            name="duration_unit",
            field=models.CharField(choices=[("days", "Jours"), ("weeks", "Semaines"), ("months", "Mois")], default="months", max_length=10, verbose_name="Unité de durée"),
        ),
    ]
