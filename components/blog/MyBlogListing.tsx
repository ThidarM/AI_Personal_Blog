"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Pencil, Plus, Send } from "lucide-react";
import BlogCard from "./BlogCard";
import type { Post } from "../../types/blog";
import useAuth from "../../hooks/useAuth";
import { createSupabaseClient } from "../../lib/supabase/client";
import { updatePost } from "../../lib/supabase/posts";

async function fetchPosts(authorId: string | null) {
  const url = new URL("/api/blog/posts", window.location.origin);
  if (authorId) {
    url.searchParams.set("author_id", authorId);
  }

  const supabase = createSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: HeadersInit = {};
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error("Failed to load blog posts");
  }
  return response.json() as Promise<Post[]>;
}

export default function MyBlogListing() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const publishDraft = async (post: Post) => {
    if (!post.id) {
      return;
    }

    setPublishingId(post.id);
    setError(null);

    const { data, error } = await updatePost(post.id, { status: "published" });

    setPublishingId(null);

    if (error) {
      setError(error.message ?? "Unable to publish post.");
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((item) => (item.id === post.id ? { ...item, status: data?.status ?? "published" } : item))
    );
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const authorId = user?.id ?? null;
    setLoading(true);
    setError(null);

    fetchPosts(authorId)
      .then((data) => setPosts(data))
      .catch((err) => setError(err.message ?? "Unable to load your blog posts."))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  return (
    <section className="space-y-8">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Blogs</h1>
            <p className="mt-2 text-sm text-slate-600">Manage your drafts and published posts in one place.</p>
          </div>
          <div>
            <Link href="/blog/create" className="btn-primary">
              <Plus className="h-4 w-4" />
              New post
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-sm text-slate-600">Loading your posts…</div>
      ) : error ? (
        <div className="card border-red-200 bg-red-50 p-8 text-center text-sm font-medium text-red-700">{error}</div>
      ) : posts.length === 0 ? (
        <div className="card p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">No posts yet</h2>
              <p className="mt-1 text-sm text-slate-500">You don’t have any posts yet. Create a draft to get started.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/blog/edit/${post.slug}`} className="btn-secondary px-3.5 py-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  {post.status?.toLowerCase() === "draft" ? (
                    <button
                      type="button"
                      onClick={() => publishDraft(post)}
                      disabled={publishingId === post.id}
                      className="btn-primary px-3.5 py-2"
                    >
                      <Send className="h-4 w-4" />
                      {publishingId === post.id ? "Publishing…" : "Publish"}
                    </button>
                  ) : null}
                </div>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
