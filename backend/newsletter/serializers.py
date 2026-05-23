from rest_framework import serializers

from .models import Subscriber


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ["email"]

    def create(self, validated_data):
        # Idempotent : ré-inscrire un e-mail existant ne lève pas d'erreur.
        subscriber, _ = Subscriber.objects.get_or_create(
            email=validated_data["email"].lower(),
            defaults={"is_active": True},
        )
        return subscriber
