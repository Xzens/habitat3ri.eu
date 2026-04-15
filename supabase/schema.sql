-- Habitat 3RI — Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('fr', 'nl')),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  cover_image TEXT,
  content TEXT NOT NULL,
  in_brief TEXT NOT NULL,
  key_info JSONB NOT NULL DEFAULT '[]',
  quotes JSONB NOT NULL DEFAULT '[]',
  faq JSONB NOT NULL DEFAULT '[]',
  internal_links JSONB NOT NULL DEFAULT '[]',
  external_sources JSONB NOT NULL DEFAULT '[]',
  youtube_url TEXT,
  category TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]',
  seo_keywords JSONB NOT NULL DEFAULT '[]',
  reading_time INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(slug, locale)
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL CHECK (country IN ('be', 'nl', 'lu', 'fr')),
  project_type TEXT NOT NULL,
  message TEXT,
  locale TEXT NOT NULL CHECK (locale IN ('fr', 'nl')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL CHECK (locale IN ('fr', 'nl')),
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_locale_status ON articles(locale, status);
CREATE INDEX IF NOT EXISTS idx_articles_slug_locale ON articles(slug, locale);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled ON articles(status, scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(locale, status, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(locale, category, status);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles
CREATE POLICY "Published articles are viewable by everyone"
  ON articles FOR SELECT
  USING (status = 'published');

-- Only service role can insert/update articles (for CRON and admin)
CREATE POLICY "Service role can manage articles"
  ON articles FOR ALL
  USING (auth.role() = 'service_role');

-- Anyone can submit contact forms
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only service role can read contact submissions
CREATE POLICY "Service role can read contact submissions"
  ON contact_submissions FOR SELECT
  USING (auth.role() = 'service_role');

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Allow upsert for newsletter (re-subscribe)
CREATE POLICY "Anyone can update newsletter subscription"
  ON newsletter_subscribers FOR UPDATE
  USING (true);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
