"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Pencil, Trash2 } from "lucide-react";
import type { Post } from "../../../types/blog";
import useAuth from "../../../hooks/useAuth";
import { getPostBySlug, deletePost } from "../../../lib/supabase/posts";

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function estimateReadingTime(content?: string) {
  const words = (content ?? "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function getInitials(name?: string | null) {
  const value = (name ?? "").trim();
  return value ? value.charAt(0).toUpperCase() : "?";
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const hasCoverImage = Boolean(post?.cover_image?.trim());
  const isPublished = post?.status?.toLowerCase() === "published";

  useEffect(() => {
    if (!slug) {
      return;
    }

    let mounted = true;
    const loadPost = async () => {
      const { data, error } = await getPostBySlug(slug);
      if (!mounted) return;

      if (error) {
        setError(error.message ?? "Unable to load post.");
        setPost(null);
        return;
      }

      if (!data) {
        setError("Post not found.");
        setPost(null);
        return;
      }

      if (data.status?.toLowerCase() !== "published" && data.author_id !== user?.id) {
        setError("This post is not available to view.");
        setPost(null);
        return;
      }

      setPost(data);
      setError(null);
    };

    loadPost()
      .catch((err) => {
        if (!mounted) return;
        setError(err.message ?? "Unable to load post.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug, user?.id]);

  const handleDelete = async () => {
    if (!post?.id || !user?.id || post.author_id !== user.id) {
      return;
    }

    const confirmed = window.confirm("Delete this post? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    const { error } = await deletePost(post.id);
    setDeleting(false);

    if (error) {
      setError(error.message ?? "Failed to delete post.");
      return;
    }

    router.push("/dashboard");
  };

  if (loading) {
    return <div className="card p-8 text-sm text-slate-600">Loading post…</div>;
  }

  if (error || !post) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="text-sm font-medium text-red-600">{error ?? "Post not found."}</p>
        <Link href="/dashboard" className="btn-secondary mt-6">
          <ArrowLeft className="h-4 w-4" />
          Back to your posts
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-5xl px-6 py-10">
        <div className="card overflow-hidden shadow-lg">
          {hasCoverImage ? (
            <Image
              src={post.cover_image as string}
              alt={post.title}
              width={1600}
              height={900}
              className="h-60 w-full object-cover sm:h-[420px]"
            />
          ) : (
            <div className="flex h-60 w-full items-center justify-center bg-slate-100 text-sm uppercase tracking-[0.18em] text-slate-500 sm:h-[420px]">
              No cover image
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className={isPublished ? "badge-green" : "badge-amber"}>
                {isPublished ? "Published" : "Draft"}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                {estimateReadingTime(post.content)}
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-base font-semibold text-white">
                {getInitials(post.author_name || post.author_id)}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">{post.author_name || post.author_id || "Unknown author"}</p>
                <p className="text-slate-500">{formatDate(post.created_at)}</p>
              </div>
            </div>
          </div>

          {user?.id && post.author_id === user.id ? (
            <div className="flex flex-wrap gap-2">
              <Link href={`/blog/edit/${post.slug}`} className="btn-secondary">
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
              <button type="button" onClick={handleDelete} disabled={deleting} className="btn-danger">
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          ) : null}
        </div>

        <div className="my-8 border-t border-slate-200" />

        <div className="prose prose-lg prose-slate mx-auto max-w-3xl">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Blogs
          </Link>
        </div>
      </article>
    </div>
  );
}
