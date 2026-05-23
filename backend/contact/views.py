from rest_framework import generics

from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactCreateView(generics.CreateAPIView):
    """POST { name, email, subject, message } -> enregistre un message."""

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
