from django.contrib import admin

from .models import Category, Post


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name_fr", "name_en", "slug"]
    prepopulated_fields = {"slug": ("name_en",)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["title_fr", "category", "is_published", "published_at"]
    list_editable = ["is_published"]
    list_filter = ["is_published", "category"]
    search_fields = ["title_fr", "title_en", "excerpt_fr"]
    prepopulated_fields = {"slug": ("title_en",)}
