"use server";

import type { User } from "@supabase/supabase-js";
import type { createClient } from "./server";

/**
 * Ensures a profile row exists for the given user.
 * Handles the case where a user signed up before the schema was run,
 * so auth.users has a row but public.profiles does not.
 */
export async function ensureProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User
) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existing) return;

  // Backfill from user metadata (populated at registration)
  await supabase.from("profiles").insert({
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    state: user.user_metadata?.state || "Unknown",
    lga: user.user_metadata?.lga || "Unknown",
    role: "user",
  });
}
