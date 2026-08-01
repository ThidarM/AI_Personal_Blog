"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import type { Post } from "../../types/blog";
import { createSupabaseClient } from "../../lib/supabase/client";

async function fetchPosts() {
  const supabase = createSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: HeadersInit = {};
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const response = await fetch("/api/blog/posts?status=published", { headers });
  if (!response.ok) {
    throw new Error("Failed to load blog posts");
  }
  return response.json() as Promise<Post[]>;
}

export default function BlogListing() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchPosts()
      .then((data) => {
        if (!mounted) return;
        setPosts(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message ?? "Unable to load blog posts.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Blog</h1>
            <p className="mt-3 text-slate-600">Browse posts and manage the blog content in one place.</p>
          </div>

          <div>
            <a
              href="/blog/create"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create a new post
            </a>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading posts…
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">No posts yet</h2>
          <p className="mt-2 text-slate-500">There are no blog posts right now. Use the create page to add the first one.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
