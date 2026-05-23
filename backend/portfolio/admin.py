from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title_fr", "category_fr", "result_fr", "order", "is_active"]
    list_editable = ["order", "is_active"]
