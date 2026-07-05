from rest_framework import generics
from rest_framework.throttling import ScopedRateThrottle

from .models import Subscriber
from .serializers import SubscriberSerializer


class SubscribeView(generics.CreateAPIView):
    """POST { email } -> inscrit à la newsletter."""

    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "newsletter"
