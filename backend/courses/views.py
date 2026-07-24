from rest_framework import viewsets

from .models import Category, Course
from .serializers import (
    CategorySerializer,
    CourseDetailSerializer,
    CourseListSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = "slug"


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.filter(is_active=True).select_related("category")
    lookup_field = "slug"

    def get_serializer_class(self):
        # Liste = version légère ; détail (retrieve) = programme complet.
        if self.action == "retrieve":
            return CourseDetailSerializer
        return CourseListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "retrieve":
            qs = qs.prefetch_related("curriculum")
        # Filtre optionnel : /api/courses/?category=<slug>
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)
        return qs
