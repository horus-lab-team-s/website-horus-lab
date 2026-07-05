from rest_framework import serializers

from .models import ForumPost


class ForumPostSerializer(serializers.ModelSerializer):
    """Lecture PUBLIQUE — n'expose jamais l'e-mail de l'auteur."""

    class Meta:
        model = ForumPost
        fields = ["id", "author_name", "text", "is_staff", "created_at"]


class ForumPostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = ["author_name", "author_email", "text"]
        extra_kwargs = {
            "author_name": {"required": False, "allow_blank": True},
            "author_email": {"required": False, "allow_blank": True},
        }
