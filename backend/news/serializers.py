from rest_framework import serializers

from .models import News, TechArticle


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


class TechArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechArticle
        fields = [
            "id",
            "title_fr",
            "title_en",
            "summary_fr",
            "summary_en",
            "url",
            "source",
            "image_url",
            "published_at",
        ]
