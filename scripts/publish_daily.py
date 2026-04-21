#!/usr/bin/env python3
"""
publish_daily.py — Pipeline editorial quotidien Habitat3RI.eu

Execute toutes les 48h via Vercel CRON (ou manuellement en local).
Genere un article complet multilingue (FR ou NL) via xAI Grok + image cover,
l'insere directement dans Supabase (table `articles`) avec toute la structure
enrichie WiseWand (En bref, key_info, citations, FAQ, sources).

Pattern derive de E:\\Synergy\\constellation-20\\tuin-veranda-pergola.nl\\scripts\\publish_daily.py
adapte pour Habitat3RI.eu (stack Next.js + Supabase + pgvector).

Usage:
    python3 scripts/publish_daily.py                          # article du jour
    python3 scripts/publish_daily.py --date 2026-04-22        # date specifique
    python3 scripts/publish_daily.py --slug abc --dry-run     # test sans insert
    python3 scripts/publish_daily.py --all-scheduled-past     # rattrape les manquants

Variables d'env requises:
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
    print("ERROR: Pillow requis. pip install Pillow", file=sys.stderr)
    sys.exit(1)

# =============================================================================
# CONFIG
# =============================================================================

ROOT = Path(__file__).resolve().parent.parent
CALENDAR_PATH = ROOT / "src" / "data" / "editorial-calendar.json"
AUTHORS_PATH = ROOT / "src" / "data" / "authors.ts"
IMG_ROOT = ROOT / "public" / "images" / "blog" / "calendar"
LOG_PATH = ROOT / "data" / "publish_daily.log"

XAI_API_KEY = os.environ.get("XAI_API_KEY", "")
XAI_CHAT_URL = "https://api.x.ai/v1/chat/completions"
XAI_IMAGE_URL = "https://api.x.ai/v1/images/generations"
XAI_CHAT_MODEL = "grok-4-0709"
XAI_IMAGE_MODEL = "grok-imagine-image"

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://vranehvfwdascqovxxhm.supabase.co")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

ON_SERVER = Path("/home").exists() and not Path("E:\\").exists()


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


# Parsed from authors.ts (simple regex, no TS parser needed)
def load_authors() -> dict[str, dict]:
    text = AUTHORS_PATH.read_text(encoding="utf-8")
    authors = {}
    # Extract each author block { slug: "...", name: "...", ... }
    pattern = re.compile(r'\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"', re.DOTALL)
    for slug, name in pattern.findall(text):
        authors[slug] = {"slug": slug, "name": name}
    return authors


# =============================================================================
# xAI CALLS (via curl subprocess — evite Cloudflare 1010 sur urllib)
# =============================================================================

def xai_chat(messages: list[dict], max_tokens: int = 16000, temperature: float = 0.7) -> str | None:
    """Call xAI chat completion, return content string or None on failure."""
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
    """Generate image via xAI, return JPEG bytes or None."""
    body = {
        "model": XAI_IMAGE_MODEL,
        "prompt": prompt,
        "n": 1,
        "response_format": "url",
    }
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
                log("WARN", f"xai_image attempt {attempt + 1} API error", {"body": str(data)[:300]})
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
            log("WARN", f"xai_image attempt {attempt + 1} parse failed: {e}")
            time.sleep(2 * (attempt + 1))
    return None


def save_jpeg_as_webp(jpeg_bytes: bytes, output_path: Path) -> bool:
    """Convert JPEG to WebP via Pillow (1600x900, quality 80)."""
    if jpeg_bytes[0:3] != b"\xff\xd8\xff" and not (
        jpeg_bytes[0:4] == b"RIFF" and jpeg_bytes[8:12] == b"WEBP"
    ):
        log("ERROR", f"Unknown image format: {jpeg_bytes[:12]!r}")
        return False
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

SYSTEM_PROMPT_FR = """Tu es un redacteur senior SEO pour Habitat3RI.eu (portail renovation durable Benelux + France).
Tu ecris des articles factuels, chiffres, pragmatiques, ton professionnel mais accessible.
Pattern WiseWand obligatoire : structure enrichie (En bref, Sommaire, Tableau, Citations, Contenu, FAQ, Sources).
Tu NE MELANGES JAMAIS les langues (article FR = liens internes FR uniquement).
Tu ne mentionnes JAMAIS les concurrents (Bobex, Solvari, ImmoValue...) dans le contenu.
Sources externes obligatoires : sites gouvernementaux (energie.wallonie.be, environnement.brussels, vlaanderen.be, myenergy.lu, rvo.nl, ademe.fr) ou institutionnels (IEA, EHPA, Commission Europeenne, Rifkin Foundation).
Retour JSON uniquement entre triple backticks json, sans explication."""

SYSTEM_PROMPT_NL = """Je bent een senior SEO-copywriter voor Habitat3RI.eu (Benelux portaal duurzame renovatie).
Je schrijft feitelijke, cijfermatige, pragmatische artikelen in professionele maar toegankelijke toon.
WiseWand patroon verplicht: verrijkte structuur (Kort, Inhoud, Tabel, Citaten, Inhoud, FAQ, Bronnen).
Meng NOOIT talen (NL artikel = alleen NL interne links).
Vermeld NOOIT concurrenten (Bobex, Solvari, ImmoValue...) in de inhoud.
Verplichte externe bronnen: overheidssites (rvo.nl, milieucentraal.nl, vlaanderen.be, myenergy.lu) of instituten (IEA, EHPA, Europese Commissie, Rifkin Foundation).
Alleen JSON tussen triple backticks json, zonder uitleg."""


def build_article_prompt(entry: dict, author_name: str) -> str:
    lang = entry["locale"]
    title = entry["title"]
    category = entry["category"]
    keywords = ", ".join(entry.get("seo_keywords", []))
    slug = entry["slug"]

    if lang == "fr":
        target_lang = "francais belge (FR-BE)"
        country = "Belgique + Wallonie/Bruxelles/Luxembourg/France"
    else:
        target_lang = "nederlands (NL-BE + NL)"
        country = "Nederland + Vlaanderen"

    return f"""Redige un article de blog complet sur : "{title}"

Parametres :
- Langue : {target_lang}
- Categorie : {category}
- Marche cible : {country}
- Slug URL : {slug}
- Mots-cles SEO : {keywords}
- Auteur : {author_name}
- Annee de reference : 2026
- Longueur cible : 1800-2200 mots

Sortie JSON obligatoire (triple backticks json) avec cette structure exacte :
{{
  "slug": "{slug}",
  "title": "titre optimise SEO 50-60 chars avec annee 2026 et chiffre cle",
  "excerpt": "meta description 150-160 chars avec chiffre + CTA",
  "in_brief": "encart En Bref, 3-4 phrases, 250-350 chars, zero HTML, datapoints cles",
  "content": "HTML riche: h2 avec id (slugified), h3, p, strong, ul/ol, table, blockquote. 1800+ mots. 6-8 H2 minimum. 1-2 tables. 4-6 listes. Mots en <strong> sur chiffres et mots-cles. Liens internes vers /{lang}/#contact, /{lang}/#calculateur, /{lang}/blog UNIQUEMENT.",
  "key_info": [
    {{ "label": "Prix moyen 2026", "value": "8 000 - 12 000 EUR" }},
    {{ "label": "Retour sur investissement", "value": "5-7 ans" }},
    ...6-8 rows avec donnees chiffrees 2026
  ],
  "quotes": [
    "citation exacte avec auteur entre guillemets. Ex: Selon l'Agence Internationale de l'Energie (IEA), le solaire est desormais la source d'electricite la moins chere.",
    "2eme citation avec auteur et contexte",
    "3eme citation (optionnel)"
  ],
  "faq": [
    {{ "question": "Question courte pertinente SEO", "answer": "Reponse 2-3 phrases avec chiffre." }},
    ...5-6 paires Q/R
  ],
  "external_sources": [
    {{ "title": "Nom rapport/source", "url": "https://www.officiel.be", "author": "Institution" }},
    ...2-4 sources d'autorite (IEA, Commission EU, gouvernement, etc.)
  ],
  "internal_links": [
    {{ "title": "Texte ancre niche-specifique", "url": "https://site-constellation.be" }},
    ...3-5 liens vers la constellation dans la bonne langue
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "reading_time": 7
}}

INTERDICTIONS :
- Ne mentionne JAMAIS : Bobex, Solvari, ImmoValue, ThinkBigger, DeviXperts, ou tout site concurrent
- Pas de langue etrangere dans le corps (article FR = 100% FR)
- Pas de liens externes dans le HTML content (ils vont dans external_sources)
- Pas d'URL inventee — seulement sites officiels ou sites constellation Satyvo SA verifies

Reponse : JSON seul entre triple backticks json."""


def parse_article_response(raw: str) -> dict | None:
    """Extract JSON from xAI response (handles triple backticks)."""
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw, re.DOTALL)
    if not m:
        m = re.search(r"(\{.*\})", raw, re.DOTALL)
    if not m:
        log("ERROR", "No JSON found in response", {"raw": raw[:300]})
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        log("ERROR", f"JSON parse error: {e}", {"excerpt": m.group(1)[:500]})
        return None


# =============================================================================
# SUPABASE INSERT
# =============================================================================

def supabase_insert(article: dict) -> bool:
    """Insert article into Supabase via REST PostgREST."""
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
             f"{SUPABASE_URL}/rest/v1/articles",
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
        log("ERROR", "supabase insert curl failed", {"stderr": r.stderr[:300]})
        return False
    if r.stdout and "error" in r.stdout.lower():
        log("ERROR", "supabase insert error", {"body": r.stdout[:400]})
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
    author_slug = entry.get("author_slug", "samuel-thiret")
    author = authors.get(author_slug, {"slug": "samuel-thiret", "name": "Samuel Thiret"})

    # === Step 1: Generate image (if missing) ===
    img_path = ROOT / "public" / entry["image"].lstrip("/")
    if not img_path.exists():
        log("INFO", "Generating cover image via xAI")
        jpeg = xai_image(entry["image_prompt"] + ". Scene theme: " + entry["title"])
        if jpeg:
            if save_jpeg_as_webp(jpeg, img_path):
                log("INFO", f"Saved WebP: {img_path}")
            else:
                log("WARN", "Image conversion failed")
        else:
            log("WARN", "Image generation failed, continuing without")
    else:
        log("INFO", f"Image exists: {img_path.name}")

    # === Step 2: Generate article content via xAI Grok ===
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

    # === Step 3: Assemble final article for Supabase ===
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    row = {
        "slug": slug,
        "locale": lang,
        "title": article.get("title", entry["title"]),
        "excerpt": article.get("excerpt", "")[:300],
        "cover_image": entry["image"],
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
        "author_slug": author_slug,
        "status": "published",
        "published_at": now_iso,
        "scheduled_at": entry["scheduled_date"] + "T06:00:00Z",
    }

    if dry_run:
        log("INFO", "DRY RUN — skipping Supabase insert")
        log("INFO", "Preview", {"title": row["title"], "word_count": len(row["content"].split())})
        return True

    # === Step 4: Insert into Supabase ===
    if not supabase_insert(row):
        return False

    # === Step 5: Mark entry as published in calendar ===
    calendar = load_calendar()
    for c in calendar:
        if c.get("slug") == slug:
            c["status"] = "published"
            c["published_at"] = now_iso
            break
    save_calendar(calendar)

    # === Step 6: Notify ===
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


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="Publish daily article for Habitat3RI.eu")
    parser.add_argument("--date", help="YYYY-MM-DD target date (default: today)")
    parser.add_argument("--slug", help="Specific slug to publish")
    parser.add_argument("--dry-run", action="store_true", help="Skip Supabase insert")
    parser.add_argument("--all-scheduled-past", action="store_true",
                        help="Publish all scheduled entries with date <= today")
    args = parser.parse_args()

    if not XAI_API_KEY:
        log("ERROR", "XAI_API_KEY env var not set")
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
