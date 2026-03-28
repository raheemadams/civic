"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function approveNominee(nomineeId: string) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const { error } = await createAdminClient()
    .from("nominees")
    .update({ status: "approved" })
    .eq("id", nomineeId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/nominees");
}

export async function rejectNominee(nomineeId: string, note: string) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const { error } = await createAdminClient()
    .from("nominees")
    .update({ status: "rejected", rejection_note: note })
    .eq("id", nomineeId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
}

export async function approveVideo(videoId: string) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const { error } = await createAdminClient()
    .from("videos")
    .update({ status: "approved" })
    .eq("id", videoId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
}

export async function rejectVideo(videoId: string) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const { error } = await createAdminClient()
    .from("videos")
    .update({ status: "rejected" })
    .eq("id", videoId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
}

export async function restorePost(postId: string) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const { error } = await createAdminClient()
    .from("group_posts")
    .update({ is_suspended: false, flag_count: 0 })
    .eq("id", postId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
}

export async function removePost(postId: string) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const { error } = await createAdminClient()
    .from("group_posts")
    .delete()
    .eq("id", postId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
}

export async function updateUserRole(userId: string, role: string) {
  // Verify the caller is a super_admin via the user session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!caller || !["admin", "super_admin"].includes(caller.role)) {
    return { error: "Only admins can change roles." };
  }

  // Use the service-role client to bypass the RLS policy that
  // restricts profile updates to auth.uid() = id
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return { error: error.message };

  // Sync role into auth.users app_metadata so it appears in the
  // Supabase Auth dashboard and is available in JWT claims
  await adminClient.auth.admin.updateUserById(userId, {
    app_metadata: { role },
  });

  revalidatePath("/admin");
}

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "super_admin", "moderator"].includes(profile.role)) {
    throw new Error("Forbidden");
  }
}
