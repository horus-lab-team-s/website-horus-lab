"""
Modèles de contenu éditable du site.

Convention bilingue : chaque texte traduisible existe en `_fr` et `_en`
(comme le dictionnaire du frontend). Le frontend choisit selon la langue.
"""
import calendar
from datetime import date, timedelta

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


class FormationsPromo(SingletonModel):
    """Bannière « aperçu » Edlearning affichée sur tout le site.

    Non bloquante (ce n'est pas un modal) : le visiteur peut la fermer quand il
    veut. Éditable ici pour piloter le message accrocheur et le lien Play Store
    sans toucher au code. Décochez « Afficher la bannière » pour la masquer.
    """

    is_active = models.BooleanField(
        "Afficher la bannière", default=True,
        help_text="Décochez pour masquer la bannière Edlearning sur tout le site.",
    )
    badge_fr = models.CharField(max_length=40, blank=True, default="Aperçu")
    badge_en = models.CharField(max_length=40, blank=True, default="Preview")
    title_fr = models.CharField(
        max_length=120, blank=True,
        default="La formation continue sur l'app Edlearning",
    )
    title_en = models.CharField(
        max_length=120, blank=True,
        default="The full training lives on the Edlearning app",
    )
    body_fr = models.TextField(
        blank=True,
        default=(
            "Ce site n'est qu'un aperçu. La formation complète et le suivi des "
            "apprenants se déroulent sur notre application mobile Edlearning."
        ),
    )
    body_en = models.TextField(
        blank=True,
        default=(
            "This site is only a preview. The complete training and learner "
            "tracking happen on our Edlearning mobile app."
        ),
    )
    store_label_fr = models.CharField(max_length=40, blank=True, default="Disponible sur")
    store_label_en = models.CharField(max_length=40, blank=True, default="Get it on")
    play_url = models.URLField(
        "Lien Play Store", blank=True,
        default="https://play.google.com/store/search?q=Edlearning&c=apps",
        help_text="URL de la fiche Play Store de l'application Edlearning.",
    )
    logo_path = models.CharField(
        "Logo (chemin statique)", max_length=300, blank=True,
        default="/logo/logo-Edlearning.png",
        help_text="Chemin /public du logo affiché dans la bannière.",
    )

    # Variante « teaser » affichée sur les pages HORS Formations : annonce la
    # date de démarrage et renvoie vers le catalogue (CTA interne /formations).
    teaser_badge_fr = models.CharField(max_length=40, blank=True, default="Formations")
    teaser_badge_en = models.CharField(max_length=40, blank=True, default="Courses")
    teaser_title_fr = models.CharField(
        max_length=140, blank=True,
        default="Nos formations gratuites démarrent le mardi 1er septembre 2026",
    )
    teaser_title_en = models.CharField(
        max_length=140, blank=True,
        default="Our free courses start on Tuesday 1 September 2026",
    )
    teaser_body_fr = models.TextField(
        blank=True,
        default=(
            "Développement web & mobile, génie logiciel et IA. Rejoignez le "
            "bootcamp Horus-Lab et montez en compétences."
        ),
    )
    teaser_body_en = models.TextField(
        blank=True,
        default=(
            "Web & mobile development, software engineering and AI. Join the "
            "Horus-Lab bootcamp and level up your skills."
        ),
    )
    teaser_cta_fr = models.CharField(max_length=60, blank=True, default="Voir les formations")
    teaser_cta_en = models.CharField(max_length=60, blank=True, default="See the courses")

    # Période de l'annonce : date de début + durée → date de fin calculée.
    # Le frontend affiche un compte à rebours (temps restant avant le début, puis
    # avant la fin) et masque la bannière une fois la date de fin dépassée.
    DURATION_UNITS = [("days", "Jours"), ("weeks", "Semaines"), ("months", "Mois")]
    start_date = models.DateField(
        "Date de début", null=True, blank=True,
        help_text="Début de la formation (ex. 2026-09-01). Vide = ni compte à rebours, ni expiration.",
    )
    duration_value = models.PositiveIntegerField("Durée", default=1)
    duration_unit = models.CharField(
        "Unité de durée", max_length=10, choices=DURATION_UNITS, default="months",
    )

    @property
    def end_date(self):
        """Date de fin calculée (début + durée). None si pas de date de début."""
        if not self.start_date:
            return None
        if self.duration_unit == "days":
            return self.start_date + timedelta(days=self.duration_value)
        if self.duration_unit == "weeks":
            return self.start_date + timedelta(weeks=self.duration_value)
        # Mois : arithmétique calendaire (borne le jour au dernier jour du mois).
        month_index = self.start_date.month - 1 + self.duration_value
        year = self.start_date.year + month_index // 12
        month = month_index % 12 + 1
        day = min(self.start_date.day, calendar.monthrange(year, month)[1])
        return date(year, month, day)

    class Meta:
        verbose_name = "Bannière Formations (Edlearning)"
        verbose_name_plural = "Bannière Formations (Edlearning)"

    def __str__(self):
        return "Bannière Formations (Edlearning)"


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
    image_path = models.CharField(
        "Image (chemin statique)", max_length=300, blank=True,
        help_text="Chemin /public (ex. /Temoignages/xxx.png). Utilisé si aucun avatar uploadé.",
    )
    is_logo = models.BooleanField(
        "Logo institutionnel", default=False,
        help_text="Affiche l'image comme logo (pastille blanche) au lieu d'une photo.",
    )
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
    logo_path = models.CharField(
        "Logo (chemin statique)", max_length=300, blank=True,
        help_text="Chemin /public (ex. /Nos-partenaires/xxx.png). Utilisé si aucun logo uploadé.",
    )
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
    photo_path = models.CharField(
        "Photo (chemin statique)", max_length=300, blank=True,
        help_text="Chemin /public (ex. /A-propos/xxx.png). Utilisé si aucune photo uploadée.",
    )
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    whatsapp_url = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    badge_fr = models.CharField(max_length=40, blank=True, help_text="Ex. Co-fondateur")
    badge_en = models.CharField(max_length=40, blank=True)
    gradient = models.CharField(
        max_length=200, blank=True,
        help_text="Classes Tailwind du dégradé (repli d'avatar si pas de photo).",
    )
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
