from django.urls import path

from .views import ConversationCreateView, MessageListCreateView

urlpatterns = [
    path("conversations/", ConversationCreateView.as_view(), name="chat-conversation-create"),
    path(
        "conversations/<uuid:pk>/messages/",
        MessageListCreateView.as_view(),
        name="chat-messages",
    ),
]
