from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatMessage, Conversation
from .notifications import notify_new_message
from .serializers import ChatMessageSerializer, ConversationCreateSerializer


def _token_from(request):
    return (
        request.headers.get("X-Chat-Token")
        or request.query_params.get("token")
        or (request.data.get("token") if hasattr(request, "data") else None)
    )


def _authorized(request, conversation) -> bool:
    token = _token_from(request)
    return bool(token) and str(token) == str(conversation.token)


class ConversationCreateView(APIView):
    """POST { visitor_name, visitor_email, page } -> crée une conversation.

    Renvoie l'id public + le token secret que le visiteur conservera pour
    lire/écrire dans SA conversation."""

    def post(self, request):
        serializer = ConversationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        conversation = serializer.save()
        return Response(
            {
                "id": str(conversation.id),
                "token": str(conversation.token),
                "messages": [],
            },
            status=status.HTTP_201_CREATED,
        )


class MessageListCreateView(APIView):
    """GET  ?token=&after=<id>  -> messages postérieurs à `after` (polling).
    POST { token, text }        -> le visiteur envoie un message."""

    def get(self, request, pk):
        conversation = get_object_or_404(Conversation, pk=pk)
        if not _authorized(request, conversation):
            return Response({"detail": "forbidden"}, status=status.HTTP_403_FORBIDDEN)

        messages = conversation.messages.all()
        after = request.query_params.get("after")
        if after:
            try:
                messages = messages.filter(id__gt=int(after))
            except (TypeError, ValueError):
                pass

        return Response(
            {
                "messages": ChatMessageSerializer(messages, many=True).data,
                "is_closed": conversation.is_closed,
            }
        )

    def post(self, request, pk):
        conversation = get_object_or_404(Conversation, pk=pk)
        if not _authorized(request, conversation):
            return Response({"detail": "forbidden"}, status=status.HTTP_403_FORBIDDEN)
        if conversation.is_closed:
            return Response({"detail": "closed"}, status=status.HTTP_409_CONFLICT)

        text = (request.data.get("text") or "").strip()
        if not text:
            return Response({"detail": "empty"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        message = ChatMessage.objects.create(
            conversation=conversation,
            sender=ChatMessage.VISITOR,
            text=text[:5000],
        )
        notify_new_message(message)
        return Response(
            ChatMessageSerializer(message).data, status=status.HTTP_201_CREATED
        )
