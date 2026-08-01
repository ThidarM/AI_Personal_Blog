"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useProtectedRoute from "../../../hooks/useProtectedRoute";
import { createPost } from "../../../lib/supabase/posts";
import useAuth from "../../../hooks/useAuth";

export default function CreateBlogPage() {
  const router = useRouter();
  const { user, loading } = useProtectedRoute();
  const { user: authUser } = useAuth();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const hasCoverImage = Boolean(coverImage.trim());

  const handleSave = async () => {
    if (!authUser?.id) {
      setMessage("You must be signed in to save drafts.");
      return;
    }

    setSaving(true);
    setMessage(null);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 200);

    try {
      const { error } = await createPost({
        title: title || "Untitled",
        slug: slug || `post-${Date.now()}`,
        content,
        author_id: authUser.id,
        status: "draft",
        cover_image: coverImage.trim() || null,
      });

      if (error) {
        setMessage(error.message ?? "Failed to save draft");
        return;
      }

      setMessage("Draft saved.");
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <h1 className="text-2xl font-semibold">Create Post</h1>

      <section className="mt-6 space-y-4">
        <label>
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3" />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Content</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={18} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3" />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Cover image URL</span>
          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
          />
          <p className="mt-2 text-sm text-slate-500">Enter an image URL. Leave it empty to keep the post without a cover image.</p>
        </label>

        {hasCoverImage ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <Image src={coverImage.trim()} alt="Cover preview" width={1200} height={720} className="h-48 w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm uppercase tracking-[0.18em] text-slate-500">
            No cover image
          </div>
        )}

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="rounded-full bg-slate-900 px-4 py-2 text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save Draft"}
          </button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </div>
      </section>
    </main>
  );
}
