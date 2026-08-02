"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImagePlus, Save, Tag, Trash2, Type } from "lucide-react";
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
    <div className="mx-auto max-w-3xl py-4">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Post</h1>
      <p className="mt-2 text-sm text-slate-600">Update the title, content, status, or cover image below.</p>

      <section className="card mt-8 space-y-6 p-6 sm:p-8">
        {loading || authLoading ? (
          <div className="text-sm text-slate-600">Loading post…</div>
        ) : message && !canEdit ? (
          <div className="card border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">{message}</div>
        ) : (
          <>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <div className="relative mt-2">
                <Type className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="input pl-10" />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Content</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="input mt-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <div className="relative mt-2">
                <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input appearance-none pl-10"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
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
                Enter a new image URL to replace the current cover. Leave it empty to remove the cover image.
              </p>
            </label>

            {hasCoverImage ? (
              <div className="card overflow-hidden">
                <Image
                  src={coverImage.trim()}
                  alt="Cover preview"
                  width={1200}
                  height={720}
                  className="h-48 w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm uppercase tracking-[0.18em] text-slate-500">
                No cover image
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button onClick={handleSave} disabled={saving || !canEdit} className="btn-primary">
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button onClick={handleDelete} disabled={saving || !canEdit} className="btn-danger">
                <Trash2 className="h-4 w-4" />
                Delete Post
              </button>
              {message ? <p className="text-sm text-slate-600">{message}</p> : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
