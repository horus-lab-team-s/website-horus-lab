from django.urls import path

from .views import ForumThreadView

urlpatterns = [
    # Forum public par article (lecture libre, écriture throttlée).
    path("forum/<slug:slug>/", ForumThreadView.as_view(), name="forum-thread"),
]
