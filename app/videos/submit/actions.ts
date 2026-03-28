"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitVideo(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = (formData.get("title") as string).trim();
  const url = (formData.get("url") as string).trim();
  const category = formData.get("category") as string;
  const state = formData.get("state") as string;
  const lga = (formData.get("lga") as string | null) || null;
  const description = (formData.get("description") as string | null)?.trim() || null;

  if (!title || !url || !category || !state) {
    return { error: "Title, URL, category, and state are required." };
  }

  const { error } = await supabase.from("videos").insert({
    title,
    url,
    category,
    state,
    lga,
    description,
    submitted_by: user.id,
    status: "pending",
  });

  if (error) return { error: error.message };

  redirect("/videos/submit/success");
}
