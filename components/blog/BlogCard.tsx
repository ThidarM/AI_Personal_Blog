import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Post } from "../../types/blog";

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusText(status?: string | null) {
  if (!status) return "Draft";
  return status.toLowerCase() === "published" ? "Published" : "Draft";
}

function getStatusClasses(status?: string | null) {
  return status?.toLowerCase() === "published"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700";
}

export default function BlogCard({ post, actions }: { post: Post; actions?: ReactNode }) {
  const excerpt = post.content?.slice(0, 220) ?? "";
  const author = post.author_name || post.author_id || "Unknown author";
  const publishedAt = post.created_at || post.updated_at;
  const coverImage = post.cover_image?.trim();
  const hasCoverImage = Boolean(coverImage);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="h-48 w-full overflow-hidden bg-slate-100 text-slate-500">
        {hasCoverImage ? (
          <Image
            src={coverImage as string}
            alt={`Cover image for ${post.title}`}
            width={1200}
            height={720}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.18em] text-slate-500">
            No cover image
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">{post.title}</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(post.status)}`}>
            {getStatusText(post.status)}
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          {excerpt}
          {post.content && post.content.length > 220 ? "…" : ""}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            <p>{author}</p>
            <p>{formatDate(publishedAt)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {actions}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View post
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
