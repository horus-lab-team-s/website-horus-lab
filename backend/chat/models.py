from django.db import models
from django.utils import timezone


class ForumThread(models.Model):
    """Fil de discussion PUBLIC rattaché à un article de blog (une entrée par
    article, identifiée par le slug). Tout le monde le lit : c'est le « forum »."""

    slug = models.SlugField("Slug de l'article", max_length=300, unique=True)
    title = models.CharField("Titre (repère admin)", max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Forum — fil d'un article"
        verbose_name_plural = "Forum — fils par article"

    def __str__(self):
        return self.title or self.slug


class ForumPost(models.Model):
    """Message PUBLIC dans un fil de forum. `is_staff` = réponse de l'équipe
    (badge) ; `is_hidden` = masqué par la modération. L'e-mail (facultatif) reste
    privé : jamais exposé par l'API publique."""

    thread = models.ForeignKey(ForumThread, related_name="posts", on_delete=models.CASCADE)
    author_name = models.CharField("Auteur", max_length=120, default="Visiteur", blank=True)
    author_email = models.EmailField("E-mail (privé, jamais public)", blank=True)
    text = models.TextField()
    is_staff = models.BooleanField("Réponse de l'équipe Horus-Lab", default=False)
    is_hidden = models.BooleanField("Masqué (modération)", default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]
        verbose_name = "Forum — message"
        verbose_name_plural = "Forum — messages"

    def __str__(self):
        who = "Équipe Horus-Lab" if self.is_staff else (self.author_name or "Visiteur")
        return f"{who}: {self.text[:40]}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Remonte le fil dans la liste (tri par activité récente).
        ForumThread.objects.filter(pk=self.thread_id).update(updated_at=timezone.now())
