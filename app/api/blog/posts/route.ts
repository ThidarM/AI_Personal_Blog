import { NextResponse } from "next/server";
import { listPosts } from "../../../../lib/supabase/posts";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authorId = url.searchParams.get("author_id");
  const status = url.searchParams.get("status") ?? undefined;
  const authHeader = request.headers.get("authorization") ?? request.headers.get("x-supabase-access-token") ?? null;
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader ?? undefined;

  // The server route needs the caller's access token so Supabase RLS can evaluate the read correctly.
  const { data, error } = await listPosts(authorId ?? undefined, status ?? undefined, accessToken);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
