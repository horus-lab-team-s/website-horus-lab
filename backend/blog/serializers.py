from rest_framework import serializers

from .models import Category, Post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name_fr", "name_en", "slug"]


class PostListSerializer(serializers.ModelSerializer):
    """Version allégée pour les listes (sans le corps)."""

    category = serializers.SerializerMethodField()
    reading_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "slug", "title_fr", "title_en", "excerpt_fr", "excerpt_en",
            "cover", "author", "category", "tags", "published_at", "reading_minutes",
        ]

    def get_category(self, obj):
        if not obj.category:
            return None
        return {"fr": obj.category.name_fr, "en": obj.category.name_en}


class PostDetailSerializer(PostListSerializer):
    """Version complète avec le corps de l'article."""

    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ["body_fr", "body_en"]
