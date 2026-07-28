from rest_framework import viewsets

from .models import News, TechArticle
from .serializers import NewsSerializer, TechArticleSerializer


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture publique des actualités publiées."""

    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsSerializer


class TechArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture publique des actualités TECH récupérées automatiquement."""

    queryset = TechArticle.objects.filter(is_active=True)
    serializer_class = TechArticleSerializer
