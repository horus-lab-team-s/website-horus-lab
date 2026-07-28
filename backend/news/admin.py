from django.contrib import admin

from .models import News, TechArticle


@admin.register(TechArticle)
class TechArticleAdmin(admin.ModelAdmin):
    list_display = ["title_en", "source", "published_at", "is_active"]
    list_filter = ["is_active", "source"]
    search_fields = ["title_en", "title_fr", "summary_en", "summary_fr", "url"]
    list_editable = ["is_active"]
    date_hierarchy = "published_at"
    readonly_fields = ["fetched_at"]


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ["title_fr", "tag_fr", "published_at", "is_published"]
    list_filter = ["is_published", "tag_fr", "published_at"]
    search_fields = ["title_fr", "title_en", "body_fr", "body_en"]
    list_editable = ["is_published"]
    date_hierarchy = "published_at"
    fieldsets = (
        ("Français", {"fields": ("title_fr", "tag_fr", "body_fr")}),
        ("English", {"fields": ("title_en", "tag_en", "body_en")}),
        (
            "Métadonnées",
            {"fields": ("url", "published_at", "is_published")},
        ),
    )
