from rest_framework import serializers

from .models import ForumPost


class ForumReplyPreviewSerializer(serializers.ModelSerializer):
    """Mini-aperçu du message cité (« qui répond à qui ») : auteur + extrait."""

    text = serializers.SerializerMethodField()

    class Meta:
        model = ForumPost
        fields = ["id", "author_name", "text", "is_staff"]

    def get_text(self, obj):
        return (obj.text or "")[:140]


class ForumPostSerializer(serializers.ModelSerializer):
    """Lecture PUBLIQUE — n'expose jamais l'e-mail de l'auteur."""

    reply_to = ForumReplyPreviewSerializer(read_only=True)

    class Meta:
        model = ForumPost
        fields = ["id", "author_name", "text", "is_staff", "created_at", "reply_to"]


class ForumPostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = ["author_name", "author_email", "text"]
        extra_kwargs = {
            "author_name": {"required": False, "allow_blank": True},
            "author_email": {"required": False, "allow_blank": True},
        }
