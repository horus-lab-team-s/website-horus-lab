"""Notifications à l'équipe pour une nouvelle candidature (e-mail Brevo + Telegram).

Même philosophie que le module `chat.notifications` : tout est optionnel et
piloté par variables d'environnement, l'envoi part en arrière-plan (thread
daemon) et toute erreur est avalée — une notif ratée ne casse jamais le dépôt
de candidature.

Variables d'environnement :
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID   → notification Telegram
  BREVO_API_KEY                          → notification e-mail (Brevo)
  CHAT_NOTIFY_EMAIL / BREVO_CONTACT_TO   → destinataire de l'e-mail
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
            {"chat_id": chat_id, "text": text, "parse_mode": "HTML", "disable_web_page_preview": True},
            headers={},
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("[applications] notification Telegram échouée: %s", exc)


def _send_email(subject: str, html: str) -> None:
    key = os.environ.get("BREVO_API_KEY")
    if not key:
        return
    to = (
        os.environ.get("CHAT_NOTIFY_EMAIL")
        or os.environ.get("BREVO_CONTACT_TO")
        or "contact@horus-lab.com"
    )
    sender_email = os.environ.get("BREVO_SENDER_EMAIL", "noreply@horus-lab.com")
    sender_name = os.environ.get("BREVO_SENDER_NAME", "Horus-Lab")
    try:
        _post_json(
            BREVO_EMAIL_API,
            {
                "sender": {"email": sender_email, "name": sender_name},
                "to": [{"email": to}],
                "subject": subject,
                "htmlContent": html,
            },
            headers={"api-key": key, "accept": "application/json"},
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("[applications] notification e-mail échouée: %s", exc)


def _admin_link(application) -> str:
    base = os.environ.get("ADMIN_BASE_URL", "").rstrip("/")
    if not base:
        return ""
    return f"{base}/admin/applications/application/{application.id}/change/"


def notify_new_application(application) -> None:
    """Envoi non bloquant (Telegram + e-mail) dans un thread daemon."""
    link = _admin_link(application)
    full_name = f"{application.first_name} {application.last_name}".strip()
    kind = application.get_type_display()
    subject = f"📩 Candidature ({kind}) — {full_name}"
    text = (
        f"📩 <b>Nouvelle candidature</b> ({kind})\n"
        f"👤 {full_name}\n"
        f"✉️ {application.email} · 📞 {application.phone or '—'}\n"
        f"🎯 {application.position or '—'}"
        + (f"\n🔗 {link}" if link else "")
    )
    html = (
        f"<h2>Nouvelle candidature — {escape(kind)}</h2>"
        f"<p><strong>Candidat :</strong> {escape(full_name)}</p>"
        f"<p><strong>E-mail :</strong> {escape(application.email)}</p>"
        f"<p><strong>Téléphone :</strong> {escape(application.phone) or '—'}</p>"
        f"<p><strong>Poste / domaine :</strong> {escape(application.position) or '—'}</p>"
        f"<p><strong>Message :</strong><br>{escape(application.message).replace(chr(10), '<br>') or '—'}</p>"
        + (f'<p><a href="{link}">Voir la candidature (dossier ZIP) dans l\'admin</a></p>' if link else "")
    )

    def run() -> None:
        _send_telegram(text)
        _send_email(subject, html)

    threading.Thread(target=run, daemon=True).start()
