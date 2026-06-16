// Domain types — moved off Supabase (self-hosted Postgres backend).
// Previously exported from `@/lib/supabase`.

export type Article = {
  id: string;
  slug: string;
  locale: "fr" | "nl";
  title: string;
  excerpt: string;
  cover_image: string;
  content: string;
  in_brief: string;
  key_info: { label: string; value: string }[];
  quotes: string[];
  faq: { question: string; answer: string }[];
  internal_links: { title: string; url: string }[];
  external_sources: { title: string; url: string; author: string }[];
  youtube_url?: string;
  category: string;
  tags: string[];
  seo_keywords: string[];
  reading_time: number;
  author_slug?: string;
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  project_type: string;
  message: string;
  locale: string;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  locale: string;
  subscribed_at: string;
};
