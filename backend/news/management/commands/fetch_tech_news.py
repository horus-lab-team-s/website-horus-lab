# -*- coding: utf-8 -*-
"""Récupère des actualités TECH depuis des flux RSS (mondial + Afrique) et les
traduit (EN/FR), pour la section « Actualités tech » du site.

UNIQUEMENT de la tech : toutes les sources ci-dessous sont des médias tech.
On ne stocke que titre + résumé + lien vers la source (pas l'article entier →
respect du droit d'auteur, principe du RSS). Dédoublonnage par URL ; seuls les
NOUVEAUX articles sont traduits (économie de quota).

Lancer :  python manage.py fetch_tech_news
Planifier (cron VPS, toutes les 4 h) :
    0 */4 * * *  cd /opt/horus-lab && docker compose -f docker-compose.prod.yml exec -T web python manage.py fetch_tech_news
"""
import json
import os
import re
import urllib.parse
import urllib.request
from datetime import datetime, timezone as dt_timezone
from time import mktime

from django.core.management.base import BaseCommand
from django.utils import timezone

from news.models import TechArticle

try:
    import feedparser
except ImportError:  # dépendance déclarée dans requirements.txt
    feedparser = None

# Flux RSS 100% TECH — mondial + Afrique. Aucune source généraliste.
FEEDS = [
    ("TechCrunch", "https://techcrunch.com/feed/"),
    ("The Verge", "https://www.theverge.com/rss/index.xml"),
    ("Ars Technica", "https://feeds.arstechnica.com/arstechnica/index"),
    ("Wired", "https://www.wired.com/feed/rss"),
    ("Hacker News", "https://hnrss.org/frontpage"),
    ("TechCabal", "https://techcabal.com/feed/"),
    ("Disrupt Africa", "https://disrupt-africa.com/feed/"),
]

MAX_PER_FEED = 6   # articles récents par flux
KEEP = 42          # nombre total conservé en base (purge des plus anciens)
_TAG_RE = re.compile(r"<[^>]+>")


def strip_html(value: str) -> str:
    return _TAG_RE.sub("", value or "").replace("&nbsp;", " ").replace("&amp;", "&").strip()


def translate(text: str, source: str, target: str) -> str:
    """Traduit via MyMemory (gratuit). Repli : le texte d'origine si échec/quota.
    L'e-mail (env TRANSLATE_EMAIL) débloque un quota élevé côté MyMemory."""
    text = (text or "").strip()
    if not text:
        return ""
    params = {"q": text[:480], "langpair": f"{source}|{target}"}
    email = os.environ.get("TRANSLATE_EMAIL", "contact@horus-lab.com")
    if email:
        params["de"] = email
    try:
        url = "https://api.mymemory.translated.net/get?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={"User-Agent": "Horus-Lab/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        out = ((data.get("responseData") or {}).get("translatedText") or "").strip()
        if out and not out.upper().startswith("MYMEMORY WARNING") and not out.upper().startswith("QUERY LENGTH"):
            return out
    except Exception:
        pass
    return text


def entry_image(entry) -> str:
    for key in ("media_content", "media_thumbnail"):
        media = entry.get(key)
        if isinstance(media, list) and media and media[0].get("url"):
            return media[0]["url"]
    for enc in entry.get("enclosures", []) or []:
        if str(enc.get("type", "")).startswith("image") and enc.get("href"):
            return enc["href"]
    return ""


class Command(BaseCommand):
    help = "Récupère les actualités TECH (flux RSS) et les traduit (EN/FR)."

    def handle(self, *args, **options):
        if feedparser is None:
            self.stderr.write(self.style.ERROR("feedparser manquant : pip install feedparser"))
            return

        added = 0
        for source, feed_url in FEEDS:
            try:
                parsed = feedparser.parse(feed_url)
            except Exception as exc:  # flux indisponible : on continue les autres
                self.stderr.write(f"[{source}] flux indisponible : {exc}")
                continue

            for entry in (parsed.entries or [])[:MAX_PER_FEED]:
                url = (entry.get("link") or "").strip()
                title = strip_html(entry.get("title") or "")
                if not url or not title:
                    continue
                # Déjà en base -> on ne re-traduit pas (économie de quota).
                if TechArticle.objects.filter(url=url).exists():
                    continue

                summary = strip_html(entry.get("summary") or entry.get("description") or "")[:400]
                published = timezone.now()
                if entry.get("published_parsed"):
                    published = datetime.fromtimestamp(mktime(entry.published_parsed), tz=dt_timezone.utc)

                # Flux anglophones -> on traduit vers le français ; l'EN reste l'original.
                title_fr = translate(title, "en", "fr")
                summary_fr = translate(summary, "en", "fr") if summary else ""

                TechArticle.objects.create(
                    url=url[:600],
                    title_en=title[:300],
                    title_fr=(title_fr or title)[:300],
                    summary_en=summary,
                    summary_fr=summary_fr or summary,
                    source=source[:80],
                    image_url=(entry_image(entry) or "")[:600],
                    published_at=published,
                    is_active=True,
                )
                added += 1

        # Purge : ne garder que les KEEP plus récentes (tri par published_at desc).
        keep_ids = list(TechArticle.objects.values_list("id", flat=True)[:KEEP])
        TechArticle.objects.exclude(id__in=keep_ids).delete()

        total = TechArticle.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f"fetch_tech_news OK : {added} nouvelle(s), {total} en base."
        ))
