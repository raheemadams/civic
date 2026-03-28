"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type ActionState = { error?: string } | null;

export async function approveNominee(
  nomineeId: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);
    await createAdminClient()
      .from("nominees")
      .update({ status: "approved" })
      .eq("id", nomineeId);
    revalidatePath("/admin");
    revalidatePath("/nominees");
    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Action failed" };
  }
}

export async function rejectNominee(
  nomineeId: string,
  note: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);
    await createAdminClient()
      .from("nominees")
      .update({ status: "rejected", rejection_note: note })
      .eq("id", nomineeId);
    revalidatePath("/admin");
    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Action failed" };
  }
}

export async function approveVideo(
  videoId: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);
    await createAdminClient()
      .from("videos")
      .update({ status: "approved" })
      .eq("id", videoId);
    revalidatePath("/admin");
    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Action failed" };
  }
}

export async function rejectVideo(
  videoId: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);
    await createAdminClient()
      .from("videos")
      .update({ status: "rejected" })
      .eq("id", videoId);
    revalidatePath("/admin");
    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Action failed" };
  }
}

export async function restorePost(
  postId: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);
    await createAdminClient()
      .from("group_posts")
      .update({ is_suspended: false, flag_count: 0 })
      .eq("id", postId);
    revalidatePath("/admin");
    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Action failed" };
  }
}

export async function removePost(
  postId: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    await requireAdmin(supabase);
    await createAdminClient()
      .from("group_posts")
      .delete()
      .eq("id", postId);
    revalidatePath("/admin");
    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Action failed" };
  }
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!caller || !["admin", "super_admin"].includes(caller.role)) {
    throw new Error("Only admins can change roles.");
  }

  const adminClient = createAdminClient();
  await adminClient
    .from("profiles")
    .update({ role })
    .eq("id", userId);

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
