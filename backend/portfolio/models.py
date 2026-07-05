from django.db import models


class Project(models.Model):
    """Étude de cas / réalisation (bilingue, éditable en admin)."""

    title_fr = models.CharField(max_length=160)
    title_en = models.CharField(max_length=160)

    # Client / contexte
    client_fr = models.CharField(max_length=160, blank=True)
    client_en = models.CharField(max_length=160, blank=True)

    # Catégorie d'affichage
    category_fr = models.CharField(max_length=80)
    category_en = models.CharField(max_length=80)

    # Description longue
    description_fr = models.TextField()
    description_en = models.TextField()

    # Rôle de Horus-Lab sur le projet (ex. "Développeur full-stack")
    role_fr = models.CharField(max_length=120, blank=True)
    role_en = models.CharField(max_length=120, blank=True)

    # Portée / scope (ex. "Application web métier multi-pays")
    scope_fr = models.CharField(max_length=160, blank=True)
    scope_en = models.CharField(max_length=160, blank=True)

    tags = models.JSONField(default=list, blank=True)
    result_fr = models.CharField(max_length=80, blank=True)
    result_en = models.CharField(max_length=80, blank=True)

    cover = models.ImageField(upload_to="portfolio/", blank=True, null=True)
    # Logo de la marque affiché en couverture (sinon icône + dégradé côté front).
    logo = models.ImageField(
        upload_to="portfolio/logos/",
        blank=True,
        null=True,
        help_text="Logo affiché en couverture. Sinon icône + dégradé.",
    )
    # Captures d'écran (liste d'URLs). La 1re sert de couverture si pas de logo.
    screenshots = models.JSONField(
        default=list,
        blank=True,
        help_text="Liste d'URLs d'images (captures). La 1re sert de couverture si pas de logo.",
    )
    icon = models.CharField(
        max_length=20,
        default="code",
        help_text="Clé d'icône : code, layers, cog, spark, eye, globe, check",
    )
    # Gradient Tailwind appliqué à la couverture (sans préfixe `bg-gradient-to-br`).
    gradient = models.CharField(
        max_length=200,
        default="from-brand-700 via-brand-500 to-sky",
        help_text=(
            "Gradient Tailwind (ex. 'from-brand-700 via-brand-500 to-sky'). "
            "Sera appliqué via bg-gradient-to-br côté frontend."
        ),
    )

    # Lien externe optionnel (afrikamode.store, etc.)
    url = models.URLField(blank=True, help_text="Lien public optionnel.")

    # Mise en avant
    is_featured = models.BooleanField(
        default=False,
        help_text="Affiche en grand sur la home (1 seul attendu).",
    )

    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Réalisation"
        verbose_name_plural = "Réalisations"

    def __str__(self):
        return self.title_fr
