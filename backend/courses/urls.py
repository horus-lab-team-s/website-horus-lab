from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("categories", views.CategoryViewSet, basename="course-category")
router.register("", views.CourseViewSet, basename="course")

urlpatterns = router.urls
