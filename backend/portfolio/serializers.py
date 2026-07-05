from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "title_fr",
            "title_en",
            "client_fr",
            "client_en",
            "category_fr",
            "category_en",
            "description_fr",
            "description_en",
            "role_fr",
            "role_en",
            "scope_fr",
            "scope_en",
            "tags",
            "result_fr",
            "result_en",
            "cover",
            "logo",
            "screenshots",
            "icon",
            "gradient",
            "url",
            "is_featured",
            "order",
        ]
