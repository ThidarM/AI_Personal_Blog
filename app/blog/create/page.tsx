"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Save, Type } from "lucide-react";
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
    <div className="mx-auto max-w-3xl py-4">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Post</h1>
      <p className="mt-2 text-sm text-slate-600">Write a new draft and publish it when it's ready.</p>

      <section className="card mt-8 space-y-6 p-6 sm:p-8">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <div className="relative mt-2">
            <Type className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title" className="input pl-10" />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            placeholder="Write your post content here..."
            className="input mt-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Cover image URL</span>
          <div className="relative mt-2">
            <ImagePlus className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="input pl-10"
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Enter an image URL. Leave it empty to keep the post without a cover image.
          </p>
        </label>

        {hasCoverImage ? (
          <div className="card overflow-hidden">
            <Image src={coverImage.trim()} alt="Cover preview" width={1200} height={720} className="h-48 w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm uppercase tracking-[0.18em] text-slate-500">
            No cover image
          </div>
        )}

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Draft"}
          </button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </div>
      </section>
    </div>
  );
}
