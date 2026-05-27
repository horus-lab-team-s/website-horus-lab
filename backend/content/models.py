"""
Modèles de contenu éditable du site.

Convention bilingue : chaque texte traduisible existe en `_fr` et `_en`
(comme le dictionnaire du frontend). Le frontend choisit selon la langue.
"""
from django.db import models


class SingletonModel(models.Model):
    """Modèle à instance unique (pk=1) — pour les réglages/sections uniques."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class SiteSettings(SingletonModel):
    """Réglages globaux : coordonnées et réseaux sociaux."""

    brand_name = models.CharField(max_length=80, default="Horus-Lab")
    tagline_fr = models.CharField(max_length=200, blank=True)
    tagline_en = models.CharField(max_length=200, blank=True)
    about_fr = models.TextField(blank=True)
    about_en = models.TextField(blank=True)

    email = models.EmailField(default="contact@horus-lab.com")
    phone_primary = models.CharField(max_length=40, blank=True)
    phone_secondary = models.CharField(max_length=40, blank=True)
    location_fr = models.CharField(max_length=120, blank=True)
    location_en = models.CharField(max_length=120, blank=True)

    linkedin_url = models.URLField(blank=True)
    x_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    whatsapp_url = models.URLField(blank=True)
    telegram_url = models.URLField(blank=True)

    class Meta:
        verbose_name = "Réglages du site"
        verbose_name_plural = "Réglages du site"

    def __str__(self):
        return "Réglages du site"


class HeroContent(SingletonModel):
    """Textes de la section hero."""

    eyebrow_fr = models.CharField(max_length=120, blank=True)
    eyebrow_en = models.CharField(max_length=120, blank=True)
    title_lead_fr = models.CharField(max_length=200, blank=True)
    title_lead_en = models.CharField(max_length=200, blank=True)
    title_highlight_fr = models.CharField(max_length=200, blank=True)
    title_highlight_en = models.CharField(max_length=200, blank=True)
    subtitle_fr = models.TextField(blank=True)
    subtitle_en = models.TextField(blank=True)
    cta_primary_fr = models.CharField(max_length=80, blank=True)
    cta_primary_en = models.CharField(max_length=80, blank=True)
    cta_secondary_fr = models.CharField(max_length=80, blank=True)
    cta_secondary_en = models.CharField(max_length=80, blank=True)

    class Meta:
        verbose_name = "Hero — textes"
        verbose_name_plural = "Hero — textes"

    def __str__(self):
        return "Hero — textes"


class HeroSlide(models.Model):
    """Image de la bannière hero (carrousel)."""

    image = models.ImageField(upload_to="hero/")
    alt_fr = models.CharField(max_length=160, blank=True)
    alt_en = models.CharField(max_length=160, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Hero — image"
        verbose_name_plural = "Hero — images"

    def __str__(self):
        return f"Slide {self.order}"


class HeroStat(models.Model):
    """Statistique affichée dans le hero (ex. 50+ projets)."""

    value = models.CharField(max_length=20)
    label_fr = models.CharField(max_length=80)
    label_en = models.CharField(max_length=80)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Hero — statistique"
        verbose_name_plural = "Hero — statistiques"

    def __str__(self):
        return f"{self.value} {self.label_fr}"


class Service(models.Model):
    title_fr = models.CharField(max_length=120)
    title_en = models.CharField(max_length=120)
    description_fr = models.TextField()
    description_en = models.TextField()
    tags = models.JSONField(default=list, blank=True, help_text="Liste de mots-clés")
    icon = models.CharField(
        max_length=20, default="code", help_text="Clé d'icône : code, layers, cog, spark"
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title_fr


class ProcessStep(models.Model):
    title_fr = models.CharField(max_length=120)
    title_en = models.CharField(max_length=120)
    description_fr = models.TextField()
    description_en = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Étape de méthode"
        verbose_name_plural = "Étapes de méthode"

    def __str__(self):
        return self.title_fr


class Value(models.Model):
    """Atout / valeur (section « Pourquoi nous »)."""

    title_fr = models.CharField(max_length=120)
    title_en = models.CharField(max_length=120)
    description_fr = models.TextField()
    description_en = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title_fr


class Sector(models.Model):
    name_fr = models.CharField(max_length=80)
    name_en = models.CharField(max_length=80)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name_fr


class Testimonial(models.Model):
    quote_fr = models.TextField()
    quote_en = models.TextField()
    name = models.CharField(max_length=120)
    role_fr = models.CharField(max_length=120, blank=True)
    role_en = models.CharField(max_length=120, blank=True)
    avatar = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    is_featured = models.BooleanField(
        default=False,
        help_text="Affiche en grand sur la home (1 seul attendu).",
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class Partner(models.Model):
    """Partenaire ou client de référence (logos / noms défilants)."""

    name = models.CharField(max_length=120)
    logo = models.ImageField(upload_to="partners/", blank=True, null=True)
    url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Partenaire"
        verbose_name_plural = "Partenaires"

    def __str__(self):
        return self.name


class Achievement(models.Model):
    """Chiffre clé affiché sur la page Réalisations (-30%, +25%, 11, 3)."""

    value = models.CharField(max_length=20, help_text="Ex. −30%, 11, +25%")
    label_fr = models.CharField(max_length=120)
    label_en = models.CharField(max_length=120)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Chiffre clé"
        verbose_name_plural = "Chiffres clés"

    def __str__(self):
        return f"{self.value} {self.label_fr}"


class TechStackItem(models.Model):
    """Élément du bandeau « stack maîtrisée » (marquee)."""

    name = models.CharField(max_length=60)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Stack — élément"
        verbose_name_plural = "Stack — éléments"

    def __str__(self):
        return self.name


class TeamMember(models.Model):
    """Membre de l'équipe (profil affichable sur la page Équipe / À propos)."""

    name = models.CharField(max_length=120)
    role_fr = models.CharField(max_length=160)
    role_en = models.CharField(max_length=160)
    bio_fr = models.TextField(blank=True)
    bio_en = models.TextField(blank=True)
    photo = models.ImageField(upload_to="team/", blank=True, null=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    is_lead = models.BooleanField(
        default=False,
        help_text="Mettez en avant ce profil (PDG, fondateur, lead).",
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Membre de l'équipe"
        verbose_name_plural = "Équipe"

    def __str__(self):
        return self.name
