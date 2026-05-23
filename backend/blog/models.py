"""Modèles du blog (articles bilingues éditables depuis l'admin)."""
import math

from django.db import models
from django.utils import timezone


class Category(models.Model):
    name_fr = models.CharField(max_length=80)
    name_en = models.CharField(max_length=80)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"

    def __str__(self):
        return self.name_fr


class Post(models.Model):
    slug = models.SlugField(unique=True, help_text="Identifiant URL (ex. mon-article)")
    title_fr = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    excerpt_fr = models.TextField()
    excerpt_en = models.TextField()
    body_fr = models.TextField(help_text="Contenu en Markdown")
    body_en = models.TextField(help_text="Contenu en Markdown", blank=True)
    cover = models.ImageField(upload_to="blog/", blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts"
    )
    author = models.CharField(max_length=120, default="Équipe Horus-Lab")
    tags = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=False)
    published_at = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at"]

    def __str__(self):
        return self.title_fr

    @property
    def reading_minutes(self) -> int:
        words = len((self.body_fr or "").split())
        return max(1, math.ceil(words / 200))
