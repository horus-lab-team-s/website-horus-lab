"""Actualités (news) : items courts datés, diffusés sur la home et /news."""
from django.db import models
from django.utils import timezone


class News(models.Model):
    """Brève d'actualité bilingue.

    Différent du blog : court (1–3 phrases), daté, taggé, peut renvoyer
    vers un lien externe (annonce produit, communiqué, etc.).
    """

    title_fr = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    body_fr = models.TextField(help_text="Corps court, 1–3 phrases.")
    body_en = models.TextField(help_text="Short body, 1–3 sentences.")

    tag_fr = models.CharField(
        max_length=40,
        default="Actualité",
        help_text="Étiquette courte (ex. Produit, Lancement, Partenariat).",
    )
    tag_en = models.CharField(max_length=40, default="News")

    url = models.URLField(
        blank=True,
        help_text="Lien externe optionnel (site, communiqué, etc.).",
    )

    published_at = models.DateField(
        default=timezone.now,
        help_text="Date d'affichage de la news (utilisée pour le tri).",
    )
    is_published = models.BooleanField(
        default=True,
        help_text="Décocher pour masquer sans supprimer.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-id"]
        verbose_name = "Actualité"
        verbose_name_plural = "Actualités"

    def __str__(self):
        return self.title_fr
