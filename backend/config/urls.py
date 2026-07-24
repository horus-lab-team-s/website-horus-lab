"""Routage racine : admin Django + API REST sous /api/."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve as _serve_media

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("content.urls")),
    path("api/blog/", include("blog.urls")),
    path("api/portfolio/", include("portfolio.urls")),
    path("api/news/", include("news.urls")),
    path("api/newsletter/", include("newsletter.urls")),
    path("api/contact/", include("contact.urls")),
    path("api/chat/", include("chat.urls")),
    path("api/courses/", include("courses.urls")),
    path("api/auth/", include("accounts.urls")),
]

# Fichiers médias uploadés (couvertures, photos d'équipe, logos…).
if settings.DEBUG:
    # En dev : helper standard Django.
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # En prod : l'app sert /media elle-même (WhiteNoise gère déjà /static). Ça
    # évite de monter le volume média dans le reverse proxy existant — un seul
    # proxy_pass vers l'app suffit. Suffisant pour un site vitrine ; pour un très
    # fort trafic, servir /media directement depuis le proxy (volume monté).
    urlpatterns += [
        re_path(
            r"^media/(?P<path>.*)$",
            _serve_media,
            {"document_root": settings.MEDIA_ROOT},
        ),
    ]
