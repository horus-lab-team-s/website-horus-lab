from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
# « tech » AVANT la route racine, sinon /tech/ serait pris pour un détail News.
router.register("tech", views.TechArticleViewSet, basename="technews")
router.register("", views.NewsViewSet, basename="news")

urlpatterns = router.urls
