from rest_framework import serializers

from .models import (
    HeroContent,
    HeroSlide,
    HeroStat,
    ProcessStep,
    Sector,
    Service,
    SiteSettings,
    Testimonial,
    Value,
)


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        exclude = ["id"]


class HeroContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroContent
        exclude = ["id"]


class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = ["id", "image", "alt_fr", "alt_en", "order"]


class HeroStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroStat
        fields = ["id", "value", "label_fr", "label_en", "order"]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id", "title_fr", "title_en", "description_fr", "description_en",
            "tags", "icon", "order",
        ]


class ProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessStep
        fields = ["id", "title_fr", "title_en", "description_fr", "description_en", "order"]


class ValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Value
        fields = ["id", "title_fr", "title_en", "description_fr", "description_en", "order"]


class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = ["id", "name_fr", "name_en", "order"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "quote_fr", "quote_en", "name", "role_fr", "role_en", "order"]
