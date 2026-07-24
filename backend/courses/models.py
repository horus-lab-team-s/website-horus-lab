from django.db import models


class Category(models.Model):
    """Domaine de formation (Développement Web, Data & IA, Cybersécurité…).

    Regroupe les cours en parcours. Bilingue, éditable en admin. Reflète les
    catégories du catalogue frontend (frontend/src/lib/courses.ts)."""

    ICON_CHOICES = [
        ("code", "Code"),
        ("layers", "Calques"),
        ("spark", "Étincelle"),
        ("eye", "Œil"),
        ("cog", "Engrenage"),
    ]

    slug = models.SlugField("Identifiant", max_length=60, unique=True)
    name_fr = models.CharField("Nom (FR)", max_length=80)
    name_en = models.CharField("Nom (EN)", max_length=80)
    tagline_fr = models.CharField("Accroche (FR)", max_length=160, blank=True)
    tagline_en = models.CharField("Accroche (EN)", max_length=160, blank=True)
    icon_key = models.CharField("Icône", max_length=10, choices=ICON_CHOICES, default="code")

    order = models.PositiveIntegerField("Ordre", default=0)
    is_active = models.BooleanField("Actif", default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Domaine de formation"
        verbose_name_plural = "Domaines de formation"

    def __str__(self):
        return self.name_fr


class Course(models.Model):
    """Un cours du catalogue (concepts + vidéos + programme), à la façon
    d'OpenClassrooms / Udemy. Bilingue, éditable en admin."""

    slug = models.SlugField("Identifiant", max_length=80, unique=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="courses",
        verbose_name="Domaine",
    )

    title_fr = models.CharField("Titre (FR)", max_length=160)
    title_en = models.CharField("Titre (EN)", max_length=160)
    subtitle_fr = models.CharField("Sous-titre (FR)", max_length=200, blank=True)
    subtitle_en = models.CharField("Sous-titre (EN)", max_length=200, blank=True)

    level_fr = models.CharField("Niveau (FR)", max_length=40, default="Débutant")
    level_en = models.CharField("Niveau (EN)", max_length=40, default="Beginner")
    duration_hours = models.PositiveIntegerField("Durée (heures)", default=0)
    lessons_count = models.PositiveIntegerField("Nombre de leçons", default=0)

    price_fr = models.CharField("Prix (FR)", max_length=40, default="Gratuit")
    price_en = models.CharField("Prix (EN)", max_length=40, default="Free")
    is_free = models.BooleanField("Gratuit", default=False)

    tags = models.JSONField("Tags", default=list, blank=True)

    # Chemin/URL de l'image de couverture. Ex. "/img/photo-....jpg" (statique
    # servi par le frontend) ou une URL absolue. Un ImageField pourra être
    # ajouté plus tard pour l'upload direct via l'admin.
    image = models.CharField(
        "Image (chemin ou URL)",
        max_length=300,
        blank=True,
        help_text="Chemin statique frontend (ex. /img/xxx.jpg) ou URL absolue.",
    )
    video_url_fr = models.URLField(
        "Vidéo du cours — FR (YouTube)",
        max_length=300,
        blank=True,
        help_text="Vidéo de cours en français (YouTube) — lecteur intégré sur la page FR.",
    )
    video_url_en = models.URLField(
        "Vidéo du cours — EN (YouTube)",
        max_length=300,
        blank=True,
        help_text="Vidéo de cours en anglais (YouTube) — lecteur intégré sur la page EN.",
    )

    instructor_name = models.CharField("Formateur — nom", max_length=120, default="Équipe Horus-Lab")
    instructor_role_fr = models.CharField("Formateur — rôle (FR)", max_length=160, blank=True)
    instructor_role_en = models.CharField("Formateur — rôle (EN)", max_length=160, blank=True)

    intro_fr = models.TextField("Introduction (FR)", blank=True)
    intro_en = models.TextField("Introduction (EN)", blank=True)

    # Objectifs pédagogiques : liste de chaînes ("Ce que vous allez apprendre").
    learn_fr = models.JSONField("Objectifs (FR)", default=list, blank=True)
    learn_en = models.JSONField("Objectifs (EN)", default=list, blank=True)

    order = models.PositiveIntegerField("Ordre", default=0)
    is_active = models.BooleanField("Actif", default=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Formation"
        verbose_name_plural = "Formations"

    def __str__(self):
        return self.title_fr


class Module(models.Model):
    """Module du programme d'un cours (chapitre regroupant des leçons)."""

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="curriculum",
        verbose_name="Formation",
    )
    title_fr = models.CharField("Titre (FR)", max_length=160)
    title_en = models.CharField("Titre (EN)", max_length=160)

    # Leçons : liste de chaînes (titres de leçons), bilingue.
    lessons_fr = models.JSONField("Leçons (FR)", default=list, blank=True)
    lessons_en = models.JSONField("Leçons (EN)", default=list, blank=True)

    order = models.PositiveIntegerField("Ordre", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Module"
        verbose_name_plural = "Modules"

    def __str__(self):
        return f"{self.course.title_fr} — {self.title_fr}"
