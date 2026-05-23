from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("posts", views.PostViewSet, basename="post")
router.register("categories", views.CategoryViewSet, basename="category")

urlpatterns = router.urls
