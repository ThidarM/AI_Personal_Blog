import { NextResponse } from "next/server";
import { createSupabaseClient, ensureSupabaseConfig } from "../../../../lib/supabase/client";

export async function POST(request: Request) {
  ensureSupabaseConfig();

  const authHeader = request.headers.get("authorization") ?? request.headers.get("x-supabase-access-token") ?? null;
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader ?? undefined;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const bucket = "blog-covers";

  const supabase = createSupabaseClient(accessToken);
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data?.path ?? fileName);

  return NextResponse.json({ url: publicUrlData.publicUrl });
}
