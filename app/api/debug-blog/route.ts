"use server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("id, title, status, author_id", { count: "exact" });

  return Response.json({ data, error, count });
}
