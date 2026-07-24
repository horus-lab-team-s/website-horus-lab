from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("services", views.ServiceViewSet, basename="service")
router.register("process", views.ProcessStepViewSet, basename="process")
router.register("values", views.ValueViewSet, basename="value")
router.register("sectors", views.SectorViewSet, basename="sector")
router.register("testimonials", views.TestimonialViewSet, basename="testimonial")
router.register("partners", views.PartnerViewSet, basename="partner")
router.register("achievements", views.AchievementViewSet, basename="achievement")
router.register("stack", views.TechStackItemViewSet, basename="stack")
router.register("team", views.TeamMemberViewSet, basename="team")

urlpatterns = [
    path("site/", views.SiteSettingsView.as_view(), name="site-settings"),
    path("formations-promo/", views.FormationsPromoView.as_view(), name="formations-promo"),
    path("hero/", views.HeroView.as_view(), name="hero"),
    path("", include(router.urls)),
]
