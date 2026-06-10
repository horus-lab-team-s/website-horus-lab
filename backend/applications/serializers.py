from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "type",
            "position",
            "message",
            "document",
            "page",
        ]
