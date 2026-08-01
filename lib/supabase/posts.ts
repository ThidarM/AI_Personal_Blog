import { createSupabaseClient, ensureSupabaseConfig } from "./client";

export type PostInsert = {
  title: string;
  slug: string;
  content: string;
  author_id?: string;
  tags?: string[];
  status?: string;
  cover_image?: string | null;
};

const POST_READ_SELECT =
  "id,title,slug,content,author_id,profiles(username),status,tags,created_at,updated_at,cover_image";

function normalizePost(row: any) {
  if (!row) return row;
  const { profiles, ...rest } = row;
  return { ...rest, author_name: profiles?.username ?? null };
}

export async function createPost(payload: PostInsert) {
  ensureSupabaseConfig();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("posts").insert([payload]).select().single();
  return { data, error };
}

export async function updatePost(id: string, updates: Partial<PostInsert>) {
  ensureSupabaseConfig();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("posts").update(updates).eq("id", id).select().single();
  return { data, error };
}

export async function getPostBySlug(slug: string) {
  ensureSupabaseConfig();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select(POST_READ_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  return { data: normalizePost(data), error };
}

export async function listPosts(authorId?: string, status?: string, accessToken?: string) {
  ensureSupabaseConfig();
  const supabase = createSupabaseClient(accessToken);

  let query = supabase
    .from("posts")
    .select(POST_READ_SELECT)
    .order("created_at", { ascending: false });
  if (authorId) {
    query = query.eq("author_id", authorId);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  return { data: (data ?? []).map(normalizePost), error };
}

export async function deletePost(id: string) {
  ensureSupabaseConfig();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("posts").delete().eq("id", id).select().single();
  return { data, error };
}
