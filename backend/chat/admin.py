from django.contrib import admin
from django.utils import timezone

from .models import ChatMessage, Conversation


class ChatMessageInline(admin.TabularInline):
    """Boîte de réponse : l'équipe ajoute un message (expéditeur « Équipe »
    par défaut), le visiteur le voit apparaître en direct dans le widget."""

    model = ChatMessage
    extra = 1
    fields = ["sender", "text", "created_at"]
    readonly_fields = ["created_at"]

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        formset.form.base_fields["sender"].initial = ChatMessage.TEAM
        return formset


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = [
        "visitor_name",
        "visitor_email",
        "message_count",
        "last_activity",
        "is_closed",
        "created_at",
    ]
    list_filter = ["is_closed", "created_at"]
    list_editable = ["is_closed"]
    search_fields = ["visitor_name", "visitor_email", "messages__text"]
    readonly_fields = ["id", "token", "page", "created_at", "updated_at"]
    inlines = [ChatMessageInline]
    fields = ["visitor_name", "visitor_email", "page", "is_closed", "id", "token", "created_at", "updated_at"]

    @admin.display(description="Messages")
    def message_count(self, obj):
        return obj.messages.count()

    @admin.display(description="Dernière activité")
    def last_activity(self, obj):
        last = obj.messages.last()
        return last.created_at if last else obj.updated_at
