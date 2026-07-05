from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe

from .models import ForumPost, ForumThread


class ForumPostInline(admin.TabularInline):
    """Modération + réponse publique. Pour RÉPONDRE : ajouter un message (case
    « Réponse de l'équipe » déjà cochée → badge public). Pour MODÉRER : cocher
    « Masqué » sur un message indésirable (il disparaît du site) ou le supprimer."""

    model = ForumPost
    extra = 1
    fields = ["author_name", "text", "is_staff", "is_hidden", "created_at"]
    readonly_fields = ["created_at"]
    verbose_name = "message du forum"
    verbose_name_plural = "➕ Répondre / modérer"

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        # Une nouvelle ligne = réponse de l'équipe par défaut.
        formset.form.base_fields["is_staff"].initial = True
        formset.form.base_fields["author_name"].initial = "Horus-Lab"
        return formset


@admin.register(ForumThread)
class ForumThreadAdmin(admin.ModelAdmin):
    """Forum public : un fil par article. La liste = tous les fils actifs ;
    l'ouverture affiche le fil public (avec les messages masqués grisés) et la
    zone pour répondre / modérer."""

    list_display = ["display_title", "post_count", "last_activity"]
    search_fields = ["slug", "title", "posts__text", "posts__author_name"]
    readonly_fields = ["thread_view", "slug", "created_at", "updated_at"]
    inlines = [ForumPostInline]
    fields = ["thread_view", "title", "slug", "created_at", "updated_at"]

    @admin.display(description="Article")
    def display_title(self, obj):
        return obj.title or obj.slug

    @admin.display(description="Messages")
    def post_count(self, obj):
        return obj.posts.count()

    @admin.display(description="Dernière activité")
    def last_activity(self, obj):
        last = obj.posts.last()
        return last.created_at if last else obj.updated_at

    @admin.display(description="Fil public")
    def thread_view(self, obj):
        if obj.pk is None:
            return "—"
        posts = list(obj.posts.all())
        if not posts:
            return "Aucun message pour l'instant."
        bubbles = []
        for p in posts:
            is_team = p.is_staff
            who = "Équipe Horus-Lab" if is_team else (p.author_name or "Visiteur")
            flag = " · MASQUÉ" if p.is_hidden else ""
            bubbles.append(
                format_html(
                    '<div style="text-align:{};margin:6px 0">'
                    '<div style="display:inline-block;max-width:78%;text-align:left;'
                    "background:{};color:#0f172a;padding:8px 12px;border-radius:14px;"
                    'opacity:{};box-shadow:0 1px 2px rgba(0,0,0,.08)">'
                    '<div style="font-size:11px;color:#475569;margin-bottom:2px">{} · {}{}</div>'
                    '<div style="white-space:pre-wrap">{}</div></div></div>',
                    "right" if is_team else "left",
                    "#dbeafe" if is_team else "#eef2f7",
                    "0.45" if p.is_hidden else "1",
                    who,
                    p.created_at.strftime("%d/%m/%Y %H:%M"),
                    flag,
                    p.text,
                )
            )
        return format_html(
            '<div style="max-width:700px;padding:12px;background:#f8fafc;'
            'border:1px solid #e2e8f0;border-radius:12px">{}</div>',
            mark_safe("".join(bubbles)),
        )
