from rest_framework import viewsets

from .models import News
from .serializers import NewsSerializer


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture publique des actualités publiées."""

    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsSerializer
