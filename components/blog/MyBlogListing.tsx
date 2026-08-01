"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">My Blogs</h1>
            <p className="mt-3 text-slate-600">Manage your drafts and published posts in one place.</p>
          </div>
          <div>
            <Link
              href="/blog/create"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              New post
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading your posts…
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">No posts yet</h2>
          <p className="mt-2 text-slate-500">You don’t have any posts yet. Create a draft to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/blog/edit/${post.slug}`}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  {post.status?.toLowerCase() === "draft" ? (
                    <button
                      type="button"
                      onClick={() => publishDraft(post)}
                      disabled={publishingId === post.id}
                      className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-60"
                    >
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
