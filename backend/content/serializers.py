from rest_framework import serializers

from .models import (
    Achievement,
    HeroContent,
    HeroSlide,
    HeroStat,
    Partner,
    ProcessStep,
    Sector,
    Service,
    SiteSettings,
    TeamMember,
    TechStackItem,
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
        fields = [
            "id", "quote_fr", "quote_en", "name", "role_fr", "role_en",
            "avatar", "image_path", "is_logo", "is_featured", "order",
        ]


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ["id", "name", "logo", "logo_path", "url", "order"]


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["id", "value", "label_fr", "label_en", "order"]


class TechStackItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStackItem
        fields = ["id", "name", "order"]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = [
            "id", "name", "role_fr", "role_en", "bio_fr", "bio_en",
            "photo", "photo_path", "linkedin_url", "github_url", "whatsapp_url",
            "email", "badge_fr", "badge_en", "gradient", "is_lead", "order",
        ]
