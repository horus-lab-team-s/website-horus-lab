from rest_framework import serializers

from .models import Category, Course, Module


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "slug",
            "name_fr",
            "name_en",
            "tagline_fr",
            "tagline_en",
            "icon_key",
            "order",
        ]


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ["id", "title_fr", "title_en", "lessons_fr", "lessons_en", "order"]


class CourseListSerializer(serializers.ModelSerializer):
    """Version légère pour le catalogue (sans le programme détaillé)."""

    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "slug",
            "category",
            "title_fr",
            "title_en",
            "subtitle_fr",
            "subtitle_en",
            "level_fr",
            "level_en",
            "duration_hours",
            "lessons_count",
            "price_fr",
            "price_en",
            "is_free",
            "tags",
            "image",
            "video_url_fr",
            "video_url_en",
            "instructor_name",
            "instructor_role_fr",
            "instructor_role_en",
            "order",
        ]


class CourseDetailSerializer(CourseListSerializer):
    """Version complète pour la page d'un cours (intro, objectifs, programme)."""

    curriculum = ModuleSerializer(many=True, read_only=True)

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + [
            "intro_fr",
            "intro_en",
            "learn_fr",
            "learn_en",
            "curriculum",
        ]
