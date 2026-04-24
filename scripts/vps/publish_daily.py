#!/usr/bin/env python3
"""
publish_daily.py — Pipeline editorial quotidien Habitat3RI.eu (VPS version)

Deploye sur VPS Hostinger srv988504 (31.97.159.95, Ubuntu 24.04 + Python 3.12).
Execute par cron systeme : `0 6 */2 * * /opt/habitat3ri/publish_daily.py`

Genere un article complet FR ou NL via xAI Grok + image cover,
l'insere directement dans Supabase (table `articles`) avec la structure
enrichie WiseWand (En bref, key_info, citations, FAQ, sources).

Usage:
    python3 publish_daily.py                          # article du jour
    python3 publish_daily.py --date 2026-04-22        # date specifique
    python3 publish_daily.py --slug abc --dry-run     # test sans insert
    python3 publish_daily.py --all-scheduled-past     # rattrape les manquants

Variables d'env requises (dans /opt/habitat3ri/.env):
    XAI_API_KEY            Cle xAI Grok (content + images)
    SUPABASE_URL           URL projet Supabase
    SUPABASE_SERVICE_KEY   Cle service_role (JWT) pour inserts
    TELEGRAM_BOT_TOKEN     (optionnel) pour notifications
    TELEGRAM_CHAT_ID       (optionnel)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow requis. apt install python3-pil", file=sys.stderr)
    sys.exit(1)

# =============================================================================
# CONFIG
# =============================================================================

ROOT = Path(__file__).resolve().parent
CALENDAR_PATH = ROOT / "editorial-calendar.json"
AUTHORS_PATH = ROOT / "authors.json"
IMG_DIR = ROOT / "images"  # Images generees localement, uploadees separement via SCP
LOG_PATH = ROOT / "logs" / "publish_daily.log"
ENV_PATH = ROOT / ".env"

# Load .env
if ENV_PATH.exists():
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

XAI_API_KEY = os.environ.get("XAI_API_KEY", "")
XAI_CHAT_URL = "https://api.x.ai/v1/chat/completions"
XAI_IMAGE_URL = "https://api.x.ai/v1/images/generations"
XAI_CHAT_MODEL = "grok-4-0709"
XAI_IMAGE_MODEL = "grok-imagine-image"

SUPABASE_URL = os.environ.get(
    "SUPABASE_URL", "https://vranehvfwdascqovxxhm.supabase.co"
)
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")


# =============================================================================
# LOGGING + TELEGRAM
# =============================================================================

def log(level: str, message: str, details: dict | None = None) -> None:
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "level": level,
        "message": message,
    }
    if details:
        entry["details"] = details
    line = json.dumps(entry, ensure_ascii=False)
    print(line, flush=True)
    try:
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with LOG_PATH.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


def notify_telegram(text: str) -> None:
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    try:
        subprocess.run(
            ["curl", "-sS", "--max-time", "15", "-X", "POST",
             f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
             "-H", "Content-Type: application/json",
             "-d", json.dumps({
                 "chat_id": TELEGRAM_CHAT_ID,
                 "text": text,
                 "parse_mode": "HTML",
             })],
            capture_output=True, timeout=20,
        )
    except Exception as e:
        log("WARN", f"Telegram notify failed: {e}")


# =============================================================================
# CALENDAR + AUTHORS
# =============================================================================

def load_calendar() -> list[dict]:
    with CALENDAR_PATH.open(encoding="utf-8") as f:
        return json.load(f)


def save_calendar(entries: list[dict]) -> None:
    with CALENDAR_PATH.open("w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)


def load_authors() -> dict:
    with AUTHORS_PATH.open(encoding="utf-8") as f:
        return json.load(f)


def pick_entry(entries: list[dict], target_date: str | None = None, slug: str | None = None) -> dict | None:
    if slug:
        for e in entries:
            if e.get("slug") == slug:
                return e
        return None
    if target_date:
        for e in entries:
            if e["scheduled_date"] == target_date and e.get("status") == "scheduled":
                return e
        return None
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    for e in entries:
        if e["scheduled_date"] == today and e.get("status") == "scheduled":
            return e
    return None


# =============================================================================
# xAI CALLS (via curl subprocess)
# =============================================================================

def xai_chat(messages: list[dict], max_tokens: int = 16000, temperature: float = 0.7) -> str | None:
    body = {
        "model": XAI_CHAT_MODEL,
        "stream": False,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "messages": messages,
    }
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8") as tmp:
        json.dump(body, tmp, ensure_ascii=False)
        tmp_path = tmp.name
    try:
        r = subprocess.run(
            ["curl", "-sS", "--max-time", "180", XAI_CHAT_URL,
             "-H", "Content-Type: application/json",
             "-H", f"Authorization: Bearer {XAI_API_KEY}",
             "-d", f"@{tmp_path}"],
            capture_output=True, text=True, timeout=200,
        )
    finally:
        os.unlink(tmp_path)
    if r.returncode != 0:
        log("ERROR", "xai_chat curl failed", {"stderr": r.stderr[:300]})
        return None
    try:
        data = json.loads(r.stdout)
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        log("ERROR", f"xai_chat parse failed: {e}", {"stdout": r.stdout[:300]})
        return None


def xai_image(prompt: str, retries: int = 3) -> bytes | None:
    body = {"model": XAI_IMAGE_MODEL, "prompt": prompt, "n": 1, "response_format": "url"}
    for attempt in range(retries):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8") as tmp:
            json.dump(body, tmp, ensure_ascii=False)
            tmp_path = tmp.name
        try:
            r = subprocess.run(
                ["curl", "-sS", "--max-time", "90", XAI_IMAGE_URL,
                 "-H", "Content-Type: application/json",
                 "-H", f"Authorization: Bearer {XAI_API_KEY}",
                 "-d", f"@{tmp_path}"],
                capture_output=True, text=True, timeout=100,
            )
        finally:
            os.unlink(tmp_path)
        if r.returncode != 0:
            log("WARN", f"xai_image attempt {attempt + 1} curl failed")
            time.sleep(2 * (attempt + 1))
            continue
        try:
            data = json.loads(r.stdout)
            if "error" in data or "code" in data:
                time.sleep(2 * (attempt + 1))
                continue
            img_url = data["data"][0].get("url")
            if not img_url:
                return None
            dl = subprocess.run(
                ["curl", "-sS", "--max-time", "60", "-o", "-", img_url],
                capture_output=True, timeout=80,
            )
            if dl.returncode == 0 and dl.stdout:
                return dl.stdout
        except Exception as e:
            log("WARN", f"xai_image parse failed: {e}")
            time.sleep(2 * (attempt + 1))
    return None


def save_jpeg_as_webp(jpeg_bytes: bytes, output_path: Path) -> bool:
    img = Image.open(BytesIO(jpeg_bytes))
    img.thumbnail((1600, 900))
    if img.mode != "RGB":
        img = img.convert("RGB")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(str(output_path), "WEBP", quality=80, method=6)
    return True


# =============================================================================
# PROMPTS
# =============================================================================

SYSTEM_PROMPT_FR = """Tu es un rédacteur senior SEO pour Habitat3RI.eu (portail rénovation durable Benelux + France).
Tu écris des articles factuels, chiffrés, pragmatiques, ton professionnel mais accessible.
Pattern WiseWand obligatoire : structure enrichie (En bref, Sommaire, Tableau, Citations, Contenu, FAQ, Sources).
Tu NE MÉLANGES JAMAIS les langues (article FR = liens internes FR uniquement).
Tu ne mentionnes JAMAIS les concurrents (Bobex, Solvari) dans le contenu.
Sources externes : sites gouvernementaux (energie.wallonie.be, environnement.brussels, rvo.nl, ademe.fr) ou institutionnels (IEA, EHPA).
Retour JSON uniquement entre triple backticks json."""

SYSTEM_PROMPT_NL = """Je bent een senior SEO-copywriter voor Habitat3RI.eu (Benelux portaal duurzame renovatie).
Verplicht WiseWand patroon: verrijkte structuur (Kort, Inhoud, Tabel, Citaten, Inhoud, FAQ, Bronnen).
Meng NOOIT talen (NL artikel = alleen NL interne links).
Vermeld NOOIT concurrenten (Bobex, Solvari) in de inhoud.
Verplichte externe bronnen: overheid (rvo.nl, milieucentraal.nl, vlaanderen.be) of instituten (IEA, EHPA).
Alleen JSON tussen triple backticks json."""


def build_article_prompt(entry: dict, author_name: str) -> str:
    lang = entry["locale"]
    target_lang = "français belge (FR-BE)" if lang == "fr" else "nederlands (NL-BE + NL)"
    country = "Belgique + Wallonie/Bruxelles/Luxembourg/France" if lang == "fr" else "Nederland + Vlaanderen"

    return f"""Rédige un article complet sur : "{entry['title']}"

Paramètres :
- Langue : {target_lang}
- Catégorie : {entry['category']}
- Marché cible : {country}
- Slug : {entry['slug']}
- Mots-clés SEO : {", ".join(entry.get("seo_keywords", []))}
- Auteur : {author_name}
- Longueur cible : 1800-2200 mots

Retour JSON obligatoire :
{{
  "title": "titre 50-60 chars avec 2026 + chiffre clé",
  "excerpt": "meta 150-160 chars",
  "in_brief": "encart En Bref, 250-350 chars, zero HTML",
  "content": "HTML riche: h2 avec id, h3, p, strong, ul/ol, table, blockquote. 1800+ mots.",
  "key_info": [{{"label": "...", "value": "..."}}] (6-8 rows chiffrées),
  "quotes": ["citation 1 avec auteur", "citation 2", "citation 3"],
  "faq": [{{"question": "...", "answer": "..."}}] (5-6 paires),
  "external_sources": [{{"title": "...", "url": "https://...", "author": "..."}}] (2-4 sources),
  "internal_links": [{{"title": "...", "url": "https://..."}}] (3-5 liens),
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "reading_time": 7
}}

INTERDICTIONS : pas de concurrents, pas de mélange langues, pas d'URL inventée.
Réponse : JSON seul entre triple backticks json."""


def parse_article_response(raw: str) -> dict | None:
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw, re.DOTALL)
    if not m:
        m = re.search(r"(\{.*\})", raw, re.DOTALL)
    if not m:
        log("ERROR", "No JSON found in response", {"raw": raw[:300]})
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        log("ERROR", f"JSON parse error: {e}")
        return None


# =============================================================================
# SUPABASE INSERT
# =============================================================================

def supabase_upsert(article: dict) -> bool:
    if not SUPABASE_SERVICE_KEY:
        log("WARN", "SUPABASE_SERVICE_KEY not set — skipping DB insert")
        return False

    body = json.dumps(article, ensure_ascii=False)
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8") as tmp:
        tmp.write(body)
        tmp_path = tmp.name
    try:
        r = subprocess.run(
            ["curl", "-sS", "--max-time", "30",
             f"{SUPABASE_URL}/rest/v1/articles?on_conflict=slug,locale",
             "-X", "POST",
             "-H", "Content-Type: application/json",
             "-H", f"apikey: {SUPABASE_SERVICE_KEY}",
             "-H", f"Authorization: Bearer {SUPABASE_SERVICE_KEY}",
             "-H", "Prefer: resolution=merge-duplicates,return=minimal",
             "-d", f"@{tmp_path}"],
            capture_output=True, text=True, timeout=40,
        )
    finally:
        os.unlink(tmp_path)
    if r.returncode != 0:
        log("ERROR", "supabase upsert curl failed", {"stderr": r.stderr[:300]})
        return False
    if r.stdout and '"code"' in r.stdout:
        log("ERROR", "supabase upsert error", {"body": r.stdout[:400]})
        return False
    return True


# =============================================================================
# MAIN PIPELINE
# =============================================================================

def publish_entry(entry: dict, dry_run: bool = False) -> bool:
    slug = entry["slug"]
    lang = entry["locale"]
    log("INFO", f"Processing {lang}/{slug}")

    authors = load_authors()
    author_slug = "samuel-thiret"
    author = authors.get(author_slug, {"slug": author_slug, "name": "Samuel Thiret"})

    # Note: image is already pre-generated in public/images/blog/calendar/
    # on the Next.js side. VPS doesn't need to regenerate it — just reference the URL.
    img_rel_path = entry.get("image", f"/images/blog/calendar/{slug}-xai.webp")

    # Generate content
    system_prompt = SYSTEM_PROMPT_FR if lang == "fr" else SYSTEM_PROMPT_NL
    user_prompt = build_article_prompt(entry, author["name"])

    log("INFO", "Generating article content via xAI Grok")
    raw = xai_chat(
        [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=16000,
    )
    if not raw:
        log("ERROR", "Content generation failed")
        return False

    article = parse_article_response(raw)
    if not article:
        return False

    # Assemble Supabase row
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    row = {
        "slug": slug,
        "locale": lang,
        "title": article.get("title", entry["title"]),
        "excerpt": article.get("excerpt", "")[:300],
        "cover_image": img_rel_path,
        "content": article.get("content", ""),
        "in_brief": article.get("in_brief", ""),
        "key_info": article.get("key_info", []),
        "quotes": article.get("quotes", []),
        "faq": article.get("faq", []),
        "internal_links": article.get("internal_links", []),
        "external_sources": article.get("external_sources", []),
        "youtube_url": article.get("youtube_url"),
        "category": entry["category"],
        "tags": article.get("tags", []),
        "seo_keywords": entry.get("seo_keywords", []),
        "reading_time": article.get("reading_time", 7),
        "status": "published",
        "published_at": now_iso,
        "scheduled_at": entry["scheduled_date"] + "T06:00:00Z",
    }

    if dry_run:
        log("INFO", "DRY RUN — skipping Supabase insert")
        log("INFO", "Preview", {
            "title": row["title"],
            "word_count": len(row["content"].split()),
            "key_info_count": len(row["key_info"]),
            "faq_count": len(row["faq"]),
        })
        return True

    if not supabase_upsert(row):
        return False

    # Mark as published in calendar
    calendar = load_calendar()
    for c in calendar:
        if c.get("slug") == slug:
            c["status"] = "published"
            c["published_at"] = now_iso
            break
    save_calendar(calendar)

    notify_telegram(
        f"<b>Habitat3RI publish</b>\n"
        f"Lang: {lang.upper()}\n"
        f"Title: {row['title']}\n"
        f"Category: {entry['category']}\n"
        f"Words: {len(row['content'].split())}\n"
        f"URL: https://habitat3ri.eu/{lang}/blog/{slug}"
    )

    log("INFO", f"PUBLISHED: {lang}/{slug}")
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="YYYY-MM-DD target")
    parser.add_argument("--slug", help="Specific slug")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--all-scheduled-past", action="store_true")
    args = parser.parse_args()

    if not XAI_API_KEY:
        log("ERROR", "XAI_API_KEY not set")
        sys.exit(1)
    if not SUPABASE_SERVICE_KEY and not args.dry_run:
        log("ERROR", "SUPABASE_SERVICE_KEY not set")
        sys.exit(1)

    calendar = load_calendar()

    if args.all_scheduled_past:
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        candidates = [e for e in calendar
                      if e.get("status") == "scheduled" and e["scheduled_date"] <= today]
        log("INFO", f"Found {len(candidates)} past-due scheduled entries")
        ok = 0
        for e in candidates:
            if publish_entry(e, dry_run=args.dry_run):
                ok += 1
            time.sleep(3)
        log("INFO", f"Done: {ok}/{len(candidates)} published")
        return

    entry = pick_entry(calendar, target_date=args.date, slug=args.slug)
    if not entry:
        log("INFO", "No entry to publish today")
        return

    if publish_entry(entry, dry_run=args.dry_run):
        log("INFO", "SUCCESS")
    else:
        log("ERROR", "FAILED")
        notify_telegram(f"Habitat3RI publish FAILED for {entry.get('slug', '?')}")
        sys.exit(1)


if __name__ == "__main__":
    main()
