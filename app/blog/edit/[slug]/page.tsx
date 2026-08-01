"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useProtectedRoute from "../../../../hooks/useProtectedRoute";
import useAuth from "../../../../hooks/useAuth";
import { getPostBySlug, updatePost, deletePost } from "../../../../lib/supabase/posts";
import type { Post } from "../../../../types/blog";

export default function EditBlogPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { user, loading: authLoading } = useProtectedRoute();
  const { user: authUser } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | string>("draft");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const hasCoverImage = Boolean(coverImage.trim());

  useEffect(() => {
    if (authLoading) {
      return;
    }

    let mounted = true;

    const loadPost = async () => {
      if (!slug) {
        setMessage("Missing post slug.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setMessage(null);

      const { data, error } = await getPostBySlug(slug);
      if (!mounted) return;

      if (error) {
        setMessage(error.message ?? "Unable to load post.");
      } else if (!data) {
        setMessage("Post not found.");
      } else if (!authUser?.id || data.author_id !== authUser.id) {
        setMessage("You are not authorized to edit this post.");
      } else {
        setPost(data);
        setTitle(data.title || "");
        setContent(data.content || "");
        setStatus(data.status || "draft");
        setCoverImage(data.cover_image || "");
      }

      setLoading(false);
    };

    loadPost();

    return () => {
      mounted = false;
    };
  }, [authLoading, authUser?.id, slug]);

  const router = useRouter();

  const handleSave = async () => {
    if (!post) {
      return;
    }
    if (!authUser?.id) {
      setMessage("You must be signed in to update this post.");
      return;
    }
    if (post.author_id !== authUser.id) {
      setMessage("You are not authorized to update this post.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { data, error } = await updatePost(post.id, {
        title: title || "Untitled",
        content,
        status,
        cover_image: coverImage.trim() || null,
      });

      if (error) {
        setMessage(error.message ?? "Failed to save changes.");
        return;
      }

      setPost(data ?? post);
      setCoverImage(coverImage);
      setMessage("Post updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) {
      return;
    }
    if (!authUser?.id) {
      setMessage("You must be signed in to delete this post.");
      return;
    }
    if (post.author_id !== authUser.id) {
      setMessage("You are not authorized to delete this post.");
      return;
    }

    const confirmed = window.confirm("Delete this post? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    setSaving(true);
    setMessage(null);

    const { error } = await deletePost(post.id);
    setSaving(false);

    if (error) {
      setMessage(error.message ?? "Failed to delete post.");
      return;
    }

    router.push("/dashboard");
  };

  const canEdit = !!post && !!authUser?.id && post.author_id === authUser.id;

  return (
    <main>
      <h1 className="text-2xl font-semibold">Edit Post</h1>

      <section className="mt-6 space-y-4">
        {loading || authLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-slate-600">Loading post…</div>
        ) : message && !canEdit ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">{message}</div>
        ) : (
          <>
            <label>
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </label>

            <label>
              <span className="text-sm font-medium text-slate-700">Content</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </label>

            <label>
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>

            <label>
              <span className="text-sm font-medium text-slate-700">Cover image URL</span>
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
              <p className="mt-2 text-sm text-slate-500">Enter a new image URL to replace the current cover. Leave it empty to remove the cover image.</p>
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={handleSave}
                disabled={saving || !canEdit}
                className="rounded-full bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={handleDelete}
                disabled={saving || !canEdit}
                className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
              >
                Delete Post
              </button>
              {message ? <p className="text-sm text-slate-600">{message}</p> : null}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
