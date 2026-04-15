"use client";

import { useState } from "react";
import { Plus, Save, Trash2, Loader2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import type { Locale } from "@/i18n/config";

type Note = {
  id: string;
  title: string;
  content: string;
  article_id: string | null;
  created_at: string;
};

type UserNotesProps = {
  locale: Locale;
  initialNotes: Note[];
};

export default function UserNotes({ locale, initialNotes }: UserNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [editing, setEditing] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  async function createNote() {
    if (!newTitle.trim() || !newContent.trim()) return;
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_notes")
        .insert({
          user_id: user.id,
          title: newTitle,
          content: newContent,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setNotes([data, ...notes]);
        setNewTitle("");
        setNewContent("");
        setCreating(false);

        // Generate embedding for the note in background
        fetch("/api/embeddings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note_id: data.id }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote(id: string) {
    try {
      await supabase.from("user_notes").delete().eq("id", id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  const labels = {
    fr: {
      title: "Mes Notes Personnelles",
      add: "Nouvelle note",
      titleLabel: "Titre de la note",
      contentLabel: "Contenu de votre note",
      save: "Enregistrer",
      cancel: "Annuler",
      empty: "Aucune note pour le moment. Ajoutez vos réflexions sur la rénovation 3RI !",
      delete: "Supprimer",
    },
    nl: {
      title: "Mijn Persoonlijke Notities",
      add: "Nieuwe notitie",
      titleLabel: "Titel van de notitie",
      contentLabel: "Inhoud van uw notitie",
      save: "Opslaan",
      cancel: "Annuleren",
      empty: "Nog geen notities. Voeg uw gedachten toe over 3IR-renovatie!",
      delete: "Verwijderen",
    },
  };

  const t = labels[locale];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <StickyNote className="h-5 w-5 text-solar-orange" />
          {t.title}
        </h3>
        {!creating && (
          <Button
            onClick={() => setCreating(true)}
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-eco-green to-energy-blue text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            {t.add}
          </Button>
        )}
      </div>

      {/* Create form */}
      {creating && (
        <div className="mb-4 rounded-xl border border-eco-green/20 bg-eco-green/5 p-4">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.currentTarget.value)}
            placeholder={t.titleLabel}
            className="mb-3"
          />
          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.currentTarget.value)}
            placeholder={t.contentLabel}
            rows={4}
            className="mb-3"
          />
          <div className="flex gap-2">
            <Button
              onClick={createNote}
              disabled={saving}
              size="sm"
              className="gap-1.5 bg-gradient-to-r from-eco-green to-energy-blue text-white"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {t.save}
            </Button>
            <Button
              onClick={() => {
                setCreating(false);
                setNewTitle("");
                setNewContent("");
              }}
              variant="outline"
              size="sm"
            >
              {t.cancel}
            </Button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {notes.length === 0 && !creating ? (
        <p className="rounded-xl border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
          {t.empty}
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-solar-orange/20"
            >
              <div className="flex items-start justify-between">
                <h4 className="font-semibold">{note.title}</h4>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="rounded-lg p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label={t.delete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {note.content}
              </p>
              <span className="mt-2 block text-xs text-muted-foreground/50">
                {new Date(note.created_at).toLocaleDateString(
                  locale === "fr" ? "fr-BE" : "nl-BE"
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
