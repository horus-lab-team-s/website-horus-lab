from django.contrib import admin

from .models import (
    Achievement,
    FormationsPromo,
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


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ["brand_name", "email", "phone_primary"]
    fieldsets = (
        ("Marque", {"fields": ("brand_name", "tagline_fr", "tagline_en", "about_fr", "about_en")}),
        ("Coordonnées", {"fields": ("email", "phone_primary", "phone_secondary", "location_fr", "location_en")}),
        (
            "Réseaux sociaux",
            {
                "fields": (
                    "linkedin_url",
                    "x_url",
                    "facebook_url",
                    "github_url",
                    "whatsapp_url",
                    "telegram_url",
                )
            },
        ),
    )


@admin.register(FormationsPromo)
class FormationsPromoAdmin(admin.ModelAdmin):
    list_display = ["__str__", "is_active"]
    fieldsets = (
        ("Affichage", {"fields": ("is_active",)}),
        (
            "Pages Formations — aperçu Edlearning (FR)",
            {"fields": ("badge_fr", "title_fr", "body_fr", "store_label_fr")},
        ),
        (
            "Pages Formations — aperçu Edlearning (EN)",
            {"fields": ("badge_en", "title_en", "body_en", "store_label_en")},
        ),
        ("Lien & logo", {"fields": ("play_url", "logo_path")}),
        (
            "Autres pages — annonce date (FR)",
            {"fields": ("teaser_badge_fr", "teaser_title_fr", "teaser_body_fr", "teaser_cta_fr")},
        ),
        (
            "Autres pages — annonce date (EN)",
            {"fields": ("teaser_badge_en", "teaser_title_en", "teaser_body_en", "teaser_cta_en")},
        ),
    )


@admin.register(HeroContent)
class HeroContentAdmin(admin.ModelAdmin):
    list_display = ["title_lead_fr", "title_highlight_fr"]
    fieldsets = (
        ("Français", {"fields": ("eyebrow_fr", "title_lead_fr", "title_highlight_fr", "subtitle_fr", "cta_primary_fr", "cta_secondary_fr")}),
        ("English", {"fields": ("eyebrow_en", "title_lead_en", "title_highlight_en", "subtitle_en", "cta_primary_en", "cta_secondary_en")}),
    )


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ["__str__", "alt_fr", "order", "is_active"]
    list_editable = ["order", "is_active"]


@admin.register(HeroStat)
class HeroStatAdmin(admin.ModelAdmin):
    list_display = ["value", "label_fr", "order"]
    list_editable = ["order"]


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["title_fr", "icon", "order", "is_active"]
    list_editable = ["order", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["title_fr", "title_en"]


@admin.register(ProcessStep)
class ProcessStepAdmin(admin.ModelAdmin):
    list_display = ["title_fr", "order"]
    list_editable = ["order"]


@admin.register(Value)
class ValueAdmin(admin.ModelAdmin):
    list_display = ["title_fr", "order"]
    list_editable = ["order"]


@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ["name_fr", "name_en", "order", "is_active"]
    list_editable = ["order", "is_active"]


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["name", "role_fr", "is_featured", "order", "is_active"]
    list_filter = ["is_active", "is_featured"]
    list_editable = ["order", "is_active", "is_featured"]


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ["name", "order", "is_active"]
    list_editable = ["order", "is_active"]
    search_fields = ["name"]


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ["value", "label_fr", "order"]
    list_editable = ["order"]


@admin.register(TechStackItem)
class TechStackItemAdmin(admin.ModelAdmin):
    list_display = ["name", "order", "is_active"]
    list_editable = ["order", "is_active"]


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ["name", "role_fr", "is_lead", "order", "is_active"]
    list_filter = ["is_active", "is_lead"]
    list_editable = ["order", "is_active", "is_lead"]
    search_fields = ["name", "role_fr", "role_en"]
    fieldsets = (
        ("Identité", {"fields": ("name", "photo", "is_lead")}),
        ("Rôle", {"fields": ("role_fr", "role_en")}),
        ("Bio", {"fields": ("bio_fr", "bio_en")}),
        ("Liens", {"fields": ("linkedin_url", "github_url", "email")}),
        ("Tri / publication", {"fields": ("order", "is_active")}),
    )
