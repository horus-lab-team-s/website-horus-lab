from rest_framework import viewsets

from .models import Category, Post
from .serializers import CategorySerializer, PostDetailSerializer, PostListSerializer


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """Articles publiés, lookup par slug. Liste allégée, détail complet."""

    lookup_field = "slug"

    def get_queryset(self):
        return Post.objects.filter(is_published=True)

    def get_serializer_class(self):
        return PostDetailSerializer if self.action == "retrieve" else PostListSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
