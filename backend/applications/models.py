from django.db import models


class Application(models.Model):
    """Une candidature déposée depuis la page Candidature du site.

    Le visiteur joint un dossier ZIP (CV, lettre, diplômes…). L'équipe consulte
    et traite les candidatures depuis l'admin Django (téléchargement + statut)."""

    EMPLOI = "emploi"
    STAGE = "stage"
    TYPE_CHOICES = [(EMPLOI, "Emploi"), (STAGE, "Stage")]

    NEW = "new"
    REVIEWING = "reviewing"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    STATUS_CHOICES = [
        (NEW, "Nouvelle"),
        (REVIEWING, "En cours d'examen"),
        (ACCEPTED, "Acceptée"),
        (REJECTED, "Refusée"),
    ]

    first_name = models.CharField("Prénom", max_length=80)
    last_name = models.CharField("Nom", max_length=80)
    email = models.EmailField("E-mail")
    phone = models.CharField("Téléphone", max_length=40, blank=True)
    type = models.CharField("Type", max_length=10, choices=TYPE_CHOICES, default=EMPLOI)
    position = models.CharField("Poste / domaine visé", max_length=160, blank=True)
    message = models.TextField("Message", blank=True)
    document = models.FileField("Dossier (ZIP)", upload_to="applications/%Y/%m/")
    status = models.CharField("Statut", max_length=12, choices=STATUS_CHOICES, default=NEW)
    page = models.CharField("Page d'origine", max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Candidature"
        verbose_name_plural = "Candidatures"

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.get_type_display()}"
