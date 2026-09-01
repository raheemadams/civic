"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-|-$/g, "");
}

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = (formData.get("title") as string).trim();
  const body = (formData.get("body") as string).trim();
  const category = formData.get("category") as string;
  const tagsRaw = (formData.get("tags") as string | null)?.trim() || "";
  const coverUrl = (formData.get("cover_url") as string | null)?.trim() || null;

  if (!title || !body || !category) {
    return { error: "Title, body, and category are required." };
  }

  if (title.length > 200) {
    return { error: "Title must be 200 characters or fewer." };
  }

  if (body.length < 50) {
    return { error: "Post body must be at least 50 characters." };
  }

  // Parse tags: comma-separated, max 5, trimmed
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5)
    : [];

  // Generate unique slug
  const baseSlug = slugify(title);
  const suffix = Date.now().toString(36);
  const slug = `${baseSlug}-${suffix}`;

  // Auto-generate excerpt from first ~160 chars of body
  const excerpt = body.length > 160 ? body.slice(0, 157) + "…" : body;

  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug,
    body,
    excerpt,
    cover_url: coverUrl,
    category,
    tags,
    author_id: user.id,
    status: "pending",
  });

  if (error) return { error: error.message };

  redirect("/blog/write/success");
}
