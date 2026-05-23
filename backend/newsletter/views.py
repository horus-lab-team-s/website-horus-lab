from rest_framework import generics

from .models import Subscriber
from .serializers import SubscriberSerializer


class SubscribeView(generics.CreateAPIView):
    """POST { email } -> inscrit à la newsletter."""

    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
