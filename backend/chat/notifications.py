"""Notifications à l'équipe (e-mail Brevo + Telegram) pour le forum public.

Tout est optionnel et piloté par variables d'environnement : sans configuration,
les notifications sont simplement ignorées (le forum fonctionne quand même). Les
envois partent en arrière-plan (thread daemon) pour ne jamais ralentir l'API, et
toute erreur est avalée — une notif ratée ne doit jamais casser le forum.

Variables d'environnement :
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID   → notification Telegram
  BREVO_API_KEY                          → notification e-mail (Brevo)
  CHAT_NOTIFY_EMAIL (def. contact@…)     → destinataire de l'e-mail
  BREVO_SENDER_EMAIL, BREVO_SENDER_NAME  → expéditeur de l'e-mail
  ADMIN_BASE_URL                         → lien direct vers l'admin
"""

import json
import logging
import os
import threading
import urllib.request

from django.utils.html import escape

logger = logging.getLogger(__name__)

BREVO_EMAIL_API = "https://api.brevo.com/v3/smtp/email"
TELEGRAM_API = "https://api.telegram.org"


def _post_json(url: str, payload: dict, headers: dict, timeout: int = 8) -> None:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", **headers},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout):  # noqa: S310 (URL fixe/contrôlée)
        return None


def _send_telegram(text: str) -> None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return
    try:
        _post_json(
            f"{TELEGRAM_API}/bot{token}/sendMessage",
            {
                "chat_id": chat_id,
                "text": text,
                "parse_mode": "HTML",
                "disable_web_page_preview": True,
            },
            headers={},
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("[forum] notification Telegram échouée: %s", exc)


def _team_inbox() -> str:
    return (
        os.environ.get("CHAT_NOTIFY_EMAIL")
        or os.environ.get("BREVO_CONTACT_TO")
        or "contact@horus-lab.com"
    )


def _send_email(subject: str, html: str, to: str | None = None, reply_to: str | None = None) -> None:
    key = os.environ.get("BREVO_API_KEY")
    if not key:
        return
    recipient = to or _team_inbox()
    sender_email = os.environ.get("BREVO_SENDER_EMAIL", "noreply@horus-lab.com")
    sender_name = os.environ.get("BREVO_SENDER_NAME", "Horus-Lab")
    payload = {
        "sender": {"email": sender_email, "name": sender_name},
        "to": [{"email": recipient}],
        "subject": subject,
        "htmlContent": html,
    }
    if reply_to:
        payload["replyTo"] = {"email": reply_to}
    try:
        _post_json(
            BREVO_EMAIL_API,
            payload,
            headers={"api-key": key, "accept": "application/json"},
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("[forum] notification e-mail échouée: %s", exc)


def _fire(subject: str, text: str, html: str) -> None:
    """Envoi non bloquant (Telegram + e-mail) dans un thread daemon."""

    def run() -> None:
        _send_telegram(text)
        _send_email(subject, html)

    threading.Thread(target=run, daemon=True).start()


def _admin_link_forum(thread) -> str:
    base = os.environ.get("ADMIN_BASE_URL", "").rstrip("/")
    if not base:
        return ""
    return f"{base}/admin/chat/forumthread/{thread.id}/change/"


def notify_new_forum_post(post) -> None:
    """Prévient l'équipe qu'un visiteur a posté publiquement dans le forum."""
    thread = post.thread
    link = _admin_link_forum(thread)
    who = post.author_name or "Visiteur"
    label = thread.title or thread.slug
    subject = f"🗣️ Forum : message de {who}"
    text = (
        f"🗣️ <b>Nouveau message public</b> de {who}\n"
        f"📄 {label}\n"
        f"« {post.text[:500]} »"
        + (f"\n🔗 {link}" if link else "")
    )
    html = (
        f"<h2>Nouveau message public de {escape(who)}</h2>"
        f"<blockquote>{escape(post.text)}</blockquote>"
        f"<p><strong>Article :</strong> {escape(label)}</p>"
        + (f'<p><a href="{link}">Voir / répondre dans l\'admin</a></p>' if link else "")
    )
    _fire(subject, text, html)
