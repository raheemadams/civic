"use server";

import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensureProfile";
import { redirect } from "next/navigation";

export async function submitNomination(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await ensureProfile(supabase, user);

  const name = (formData.get("name") as string).trim();
  const state = formData.get("state") as string;
  const lga = formData.get("lga") as string;
  const field = formData.get("field") as string;
  const writeup = (formData.get("writeup") as string).trim();
  const photo_url = (formData.get("photo_url") as string | null) || null;

  if (!name || !state || !lga || !field || !writeup) {
    return { error: "All fields are required." };
  }

  const { error } = await supabase.from("nominees").insert({
    name,
    state,
    lga,
    field,
    writeup,
    photo_url,
    nominated_by: user.id,
    status: "pending",
    nomination_count: 1,
  });

  if (error) return { error: error.message };

  redirect("/nominate/success");
}
