from django.db import models


class Project(models.Model):
    """Étude de cas / réalisation (bilingue, éditable en admin)."""

    title_fr = models.CharField(max_length=160)
    title_en = models.CharField(max_length=160)
    category_fr = models.CharField(max_length=80)
    category_en = models.CharField(max_length=80)
    description_fr = models.TextField()
    description_en = models.TextField()
    tags = models.JSONField(default=list, blank=True)
    result_fr = models.CharField(max_length=80, blank=True)
    result_en = models.CharField(max_length=80, blank=True)
    cover = models.ImageField(upload_to="portfolio/", blank=True, null=True)
    icon = models.CharField(max_length=20, default="code")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Réalisation"
        verbose_name_plural = "Réalisations"

    def __str__(self):
        return self.title_fr
