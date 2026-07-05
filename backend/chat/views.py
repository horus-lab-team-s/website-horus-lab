from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import ForumPost, ForumThread
from .notifications import notify_new_forum_post
from .serializers import ForumPostCreateSerializer, ForumPostSerializer


class ForumThreadView(APIView):
    """Forum PUBLIC rattaché à un article (slug).

    GET  ?after=<id>  -> le fil public (messages non masqués).
    POST { author_name?, author_email?, text, thread_title? } -> un visiteur poste.

    Lecture libre (aucun throttle) ; écriture limitée par ScopedRateThrottle."""

    throttle_scope = "forum_post"

    def get_throttles(self):
        # On ne limite QUE l'écriture publique ; la lecture reste libre.
        if self.request.method == "POST":
            return [ScopedRateThrottle()]
        return []

    def get(self, request, slug):
        thread = ForumThread.objects.filter(slug=slug).first()
        if thread is None:
            return Response({"thread": {"slug": slug, "title": ""}, "posts": []})
        posts = thread.posts.filter(is_hidden=False)
        after = request.query_params.get("after")
        if after:
            try:
                posts = posts.filter(id__gt=int(after))
            except (TypeError, ValueError):
                pass
        return Response(
            {
                "thread": {"slug": thread.slug, "title": thread.title},
                "posts": ForumPostSerializer(posts, many=True).data,
            }
        )

    def post(self, request, slug):
        serializer = ForumPostCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        text = (serializer.validated_data.get("text") or "").strip()
        if not text:
            return Response({"detail": "empty"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        title = str(request.data.get("thread_title") or "").strip()[:300]
        thread, _ = ForumThread.objects.get_or_create(slug=slug, defaults={"title": title})
        if title and not thread.title:
            thread.title = title
            thread.save(update_fields=["title"])

        name = (serializer.validated_data.get("author_name") or "").strip()[:120] or "Visiteur"
        post = ForumPost.objects.create(
            thread=thread,
            author_name=name,
            author_email=(serializer.validated_data.get("author_email") or "").strip(),
            text=text[:5000],
            is_staff=False,
        )
        notify_new_forum_post(post)
        return Response(ForumPostSerializer(post).data, status=status.HTTP_201_CREATED)
