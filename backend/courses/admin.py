from django.contrib import admin

from .models import Category, Course, Module


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name_fr", "slug", "icon_key", "order", "is_active"]
    list_filter = ["is_active", "icon_key"]
    search_fields = ["name_fr", "name_en", "slug"]
    list_editable = ["order", "is_active"]
    prepopulated_fields = {"slug": ("name_en",)}


class ModuleInline(admin.StackedInline):
    model = Module
    extra = 1
    fields = ("title_fr", "title_en", "lessons_fr", "lessons_en", "order")


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ["title_fr", "category", "level_fr", "is_free", "order", "is_active"]
    list_filter = ["is_active", "is_free", "category", "level_fr"]
    search_fields = ["title_fr", "title_en", "subtitle_fr", "slug"]
    list_editable = ["order", "is_active"]
    prepopulated_fields = {"slug": ("title_en",)}
    inlines = [ModuleInline]
    fieldsets = (
        ("Identité", {"fields": ("slug", "category", "title_fr", "title_en", "subtitle_fr", "subtitle_en")}),
        ("Caractéristiques", {"fields": ("level_fr", "level_en", "duration_hours", "lessons_count", "price_fr", "price_en", "is_free", "tags", "image", "video_url_fr", "video_url_en")}),
        ("Formateur", {"fields": ("instructor_name", "instructor_role_fr", "instructor_role_en")}),
        ("Contenu", {"fields": ("intro_fr", "intro_en", "learn_fr", "learn_en")}),
        ("Publication", {"fields": ("order", "is_active")}),
    )
