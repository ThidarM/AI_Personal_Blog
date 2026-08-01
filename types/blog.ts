export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image?: string | null;
  author_id?: string | null;
  author_name?: string | null;
  status?: "draft" | "published" | string | null;
  tags?: string[] | null;
  created_at?: string;
  updated_at?: string;
};
