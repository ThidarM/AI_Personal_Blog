"use client";

import { useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";
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
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Blog</h1>
            <p className="mt-2 text-sm text-slate-600">Browse posts and manage the blog content in one place.</p>
          </div>

          <div>
            <a href="/blog/create" className="btn-primary">
              <Plus className="h-4 w-4" />
              Create a new post
            </a>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-sm text-slate-600">Loading posts…</div>
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
              <p className="mt-1 text-sm text-slate-500">
                There are no blog posts right now. Use the create page to add the first one.
              </p>
            </div>
          </div>
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
