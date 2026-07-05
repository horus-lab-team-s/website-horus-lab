import os

from rest_framework import serializers

from .models import Application

# Doit rester cohérent avec la limite côté frontend (CandidatureForm : 15 Mo).
MAX_DOCUMENT_SIZE = 15 * 1024 * 1024  # 15 Mo
ALLOWED_EXTENSIONS = {".zip"}


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "type",
            "position",
            "message",
            "document",
            "page",
        ]

    def validate_document(self, value):
        """Le dossier de candidature doit être un .zip d'au plus 15 Mo."""
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                "Le dossier doit être une archive .zip (CV, lettre, diplômes)."
            )
        if value.size > MAX_DOCUMENT_SIZE:
            raise serializers.ValidationError(
                "Le fichier dépasse la taille maximale autorisée (15 Mo)."
            )
        return value
