from django.contrib import admin
from django.utils.html import format_html

from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ["full_name", "type", "position", "email", "status", "created_at", "download"]
    list_editable = ["status"]
    list_filter = ["type", "status", "created_at"]
    search_fields = ["first_name", "last_name", "email", "position", "message"]
    readonly_fields = ["created_at", "download"]

    @admin.display(description="Candidat")
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    @admin.display(description="Dossier")
    def download(self, obj):
        if obj.document:
            return format_html('<a href="{}" target="_blank" rel="noopener">⬇ Télécharger le ZIP</a>', obj.document.url)
        return "—"
