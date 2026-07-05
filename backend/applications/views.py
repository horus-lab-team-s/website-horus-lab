from rest_framework import generics
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.throttling import ScopedRateThrottle

from .models import Application
from .notifications import notify_new_application
from .serializers import ApplicationSerializer


class ApplicationCreateView(generics.CreateAPIView):
    """POST multipart { first_name, last_name, email, phone, type, position,
    message, document(.zip) } -> enregistre une candidature et notifie l'équipe."""

    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "application"

    def perform_create(self, serializer):
        application = serializer.save()
        notify_new_application(application)
