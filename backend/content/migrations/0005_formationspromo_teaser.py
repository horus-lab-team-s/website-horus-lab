from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0004_formationspromo"),
    ]

    operations = [
        migrations.AddField(
            model_name="formationspromo",
            name="teaser_badge_fr",
            field=models.CharField(blank=True, default="Formations", max_length=40),
        ),
        migrations.AddField(
            model_name="formationspromo",
            name="teaser_badge_en",
            field=models.CharField(blank=True, default="Courses", max_length=40),
        ),
        migrations.AddField(
            model_name="formationspromo",
            name="teaser_title_fr",
            field=models.CharField(blank=True, default="Nos formations gratuites démarrent le mardi 1er septembre 2026", max_length=140),
        ),
        migrations.AddField(
            model_name="formationspromo",
            name="teaser_title_en",
            field=models.CharField(blank=True, default="Our free courses start on Tuesday 1 September 2026", max_length=140),
        ),
        migrations.AddField(
            model_name="formationspromo",
            name="teaser_body_fr",
            field=models.TextField(blank=True, default="Développement web & mobile, génie logiciel et IA. Rejoignez le bootcamp Horus-Lab et montez en compétences."),
        ),
        migrations.AddField(
            model_name="formationspromo",
            name="teaser_body_en",
            field=models.TextField(blank=True, default="Web & mobile development, software engineering and AI. Join the Horus-Lab bootcamp and level up your skills."),
        ),
        migrations.AddField(
            model_name="formationspromo",
            name="teaser_cta_fr",
            field=models.CharField(blank=True, default="Voir les formations", max_length=60),
        ),
        migrations.AddField(
            model_name="formationspromo",
            name="teaser_cta_en",
            field=models.CharField(blank=True, default="See the courses", max_length=60),
        ),
    ]
