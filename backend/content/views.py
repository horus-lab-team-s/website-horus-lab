from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import (
    Achievement,
    HeroContent,
    HeroSlide,
    HeroStat,
    Partner,
    ProcessStep,
    Sector,
    Service,
    SiteSettings,
    TeamMember,
    TechStackItem,
    Testimonial,
    Value,
)
from .serializers import (
    AchievementSerializer,
    HeroContentSerializer,
    HeroSlideSerializer,
    HeroStatSerializer,
    PartnerSerializer,
    ProcessStepSerializer,
    SectorSerializer,
    ServiceSerializer,
    SiteSettingsSerializer,
    TeamMemberSerializer,
    TechStackItemSerializer,
    TestimonialSerializer,
    ValueSerializer,
)


class SiteSettingsView(APIView):
    """Renvoie l'unique objet de réglages du site."""

    def get(self, request):
        return Response(SiteSettingsSerializer(SiteSettings.load()).data)


class HeroView(APIView):
    """Hero complet : textes + slides + statistiques en une réponse."""

    def get(self, request):
        return Response(
            {
                "content": HeroContentSerializer(HeroContent.load()).data,
                "slides": HeroSlideSerializer(
                    HeroSlide.objects.filter(is_active=True), many=True,
                    context={"request": request},
                ).data,
                "stats": HeroStatSerializer(HeroStat.objects.all(), many=True).data,
            }
        )


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer


class ProcessStepViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProcessStep.objects.all()
    serializer_class = ProcessStepSerializer


class ValueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Value.objects.all()
    serializer_class = ValueSerializer


class SectorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sector.objects.filter(is_active=True)
    serializer_class = SectorSerializer


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer


class PartnerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Partner.objects.filter(is_active=True)
    serializer_class = PartnerSerializer


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer


class TechStackItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TechStackItem.objects.filter(is_active=True)
    serializer_class = TechStackItemSerializer


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
