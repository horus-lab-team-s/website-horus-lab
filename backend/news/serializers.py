from rest_framework import serializers

from .models import News


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = [
            "id",
            "title_fr",
            "title_en",
            "body_fr",
            "body_en",
            "tag_fr",
            "tag_en",
            "url",
            "published_at",
        ]
