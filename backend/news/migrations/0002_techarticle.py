import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("news", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="TechArticle",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title_en", models.CharField(max_length=300)),
                ("title_fr", models.CharField(max_length=300)),
                ("summary_en", models.TextField(blank=True)),
                ("summary_fr", models.TextField(blank=True)),
                ("url", models.URLField(max_length=600, unique=True, verbose_name="Lien source")),
                ("source", models.CharField(blank=True, max_length=80, verbose_name="Source")),
                ("image_url", models.URLField(blank=True, max_length=600, verbose_name="Image")),
                ("published_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("fetched_at", models.DateTimeField(auto_now_add=True)),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "Actualité tech (auto)",
                "verbose_name_plural": "Actualités tech (auto)",
                "ordering": ["-published_at", "-id"],
            },
        ),
    ]
