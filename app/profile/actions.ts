"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = (formData.get("full_name") as string).trim();
  const state = formData.get("state") as string;
  const lga = formData.get("lga") as string;
  const avatar_url = formData.get("avatar_url") as string;

  if (!full_name || !state || !lga) {
    return { error: "Full name, state, and LGA are required." };
  }

  const updates: Record<string, string> = { full_name, state, lga };
  if (avatar_url) updates.avatar_url = avatar_url;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  redirect("/dashboard");
}
