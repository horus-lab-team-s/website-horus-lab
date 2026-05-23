from django.contrib import admin

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


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ["brand_name", "email", "phone_primary"]


@admin.register(HeroContent)
class HeroContentAdmin(admin.ModelAdmin):
    list_display = ["title_lead_fr", "title_highlight_fr"]


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
    list_display = ["name", "role_fr", "order", "is_active"]
    list_editable = ["order", "is_active"]
