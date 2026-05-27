from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        "title_fr",
        "client_fr",
        "category_fr",
        "result_fr",
        "is_featured",
        "order",
        "is_active",
    ]
    list_filter = ["is_active", "is_featured", "category_fr"]
    search_fields = ["title_fr", "title_en", "client_fr", "client_en", "description_fr"]
    list_editable = ["order", "is_active", "is_featured"]
    fieldsets = (
        (
            "Identité",
            {"fields": ("title_fr", "title_en", "client_fr", "client_en", "category_fr", "category_en")},
        ),
        (
            "Détails",
            {"fields": ("description_fr", "description_en", "role_fr", "role_en", "scope_fr", "scope_en")},
        ),
        ("Visuel", {"fields": ("cover", "icon", "gradient")}),
        ("Méta", {"fields": ("tags", "result_fr", "result_en", "url")}),
        (
            "Publication",
            {"fields": ("is_featured", "order", "is_active")},
        ),
    )
