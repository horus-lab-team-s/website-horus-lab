import uuid

from django.db import models
from django.utils import timezone


class Conversation(models.Model):
    """Une conversation de chat ouverte par un visiteur du blog.

    L'`id` (UUID) sert de handle public dans les URLs ; le `token` (UUID secret)
    autorise le visiteur à lire/écrire uniquement sa propre conversation.
    L'équipe répond depuis l'admin Django (boîte de réception)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    visitor_name = models.CharField("Nom du visiteur", max_length=120, default="Visiteur", blank=True)
    # Optionnel : esprit « forum ». Un visiteur anonyme peut discuter sans e-mail ;
    # s'il le laisse, l'équipe peut le recontacter par mail.
    visitor_email = models.EmailField("E-mail du visiteur", blank=True)
    page = models.CharField("Page d'origine", max_length=300, blank=True)
    is_closed = models.BooleanField("Clôturée", default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Conversation (chat)"
        verbose_name_plural = "Conversations (chat)"

    def __str__(self):
        return f"{self.visitor_name} — {self.visitor_email}"

    def touch(self):
        """Remonte la conversation en tête de la boîte de réception."""
        Conversation.objects.filter(pk=self.pk).update(updated_at=timezone.now())


class ChatMessage(models.Model):
    VISITOR = "visitor"
    TEAM = "team"
    SENDER_CHOICES = [(VISITOR, "Visiteur"), (TEAM, "Équipe Horus-Lab")]

    conversation = models.ForeignKey(
        Conversation, related_name="messages", on_delete=models.CASCADE
    )
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES, default=VISITOR)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]
        verbose_name = "Message"
        verbose_name_plural = "Messages"

    def __str__(self):
        return f"{self.get_sender_display()}: {self.text[:40]}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Toute nouvelle ligne fait remonter la conversation (tri inbox).
        self.conversation.touch()
