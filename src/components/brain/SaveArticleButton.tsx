"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type SaveArticleButtonProps = {
  articleId: string;
  initialSaved?: boolean;
  locale: "fr" | "nl";
};

export default function SaveArticleButton({
  articleId,
  initialSaved = false,
  locale,
}: SaveArticleButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggleSave() {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to sign-in or show toast
        alert(
          locale === "fr"
            ? "Connectez-vous pour sauvegarder des articles dans votre Deuxième Cerveau."
            : "Log in om artikelen op te slaan in uw Tweede Brein."
        );
        setLoading(false);
        return;
      }

      if (saved) {
        await supabase
          .from("user_saved_articles")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);
        setSaved(false);
      } else {
        await supabase.from("user_saved_articles").insert({
          user_id: user.id,
          article_id: articleId,
        });
        setSaved(true);
      }
    } catch (err) {
      console.error("Save toggle failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
        saved
          ? "border-eco-green/30 bg-eco-green/10 text-eco-green"
          : "border-border bg-card text-muted-foreground hover:border-eco-green/30 hover:text-eco-green"
      } disabled:opacity-50`}
      aria-label={
        saved
          ? locale === "fr"
            ? "Retirer du Deuxième Cerveau"
            : "Verwijderen uit Tweede Brein"
          : locale === "fr"
            ? "Sauvegarder dans mon Deuxième Cerveau"
            : "Opslaan in mijn Tweede Brein"
      }
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {saved
        ? locale === "fr"
          ? "Sauvegardé"
          : "Opgeslagen"
        : locale === "fr"
          ? "Sauvegarder dans mon Cerveau"
          : "Opslaan in mijn Brein"}
    </button>
  );
}
