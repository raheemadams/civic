"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = { error?: string } | null;

export async function createTopicGroup(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string | null)?.trim() || null;

  if (!name) return { error: "Group name is required." };

  const { data, error } = await supabase
    .from("topic_groups")
    .insert({ name, description, created_by: user.id, member_count: 1 })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await supabase.from("group_memberships").insert({
    user_id: user.id,
    group_type: "topic",
    topic_group_id: data.id,
  });

  revalidatePath("/groups");
  redirect(`/groups/topic/${data.id}`);
}

export async function joinTopicGroup(groupId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("group_memberships").insert({
    user_id: user.id,
    group_type: "topic",
    topic_group_id: groupId,
  });

  await supabase
    .from("topic_groups")
    .update({ member_count: supabase.rpc as unknown as number })
    .eq("id", groupId);

  revalidatePath(`/groups/topic/${groupId}`);
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const content = (formData.get("content") as string).trim();
  const groupType = formData.get("group_type") as string;
  const lgaKey = (formData.get("lga_key") as string | null) || null;
  const topicGroupId = (formData.get("topic_group_id") as string | null) || null;

  if (!content) return { error: "Post cannot be empty." };

  const { error } = await supabase.from("group_posts").insert({
    content,
    user_id: user.id,
    group_type: groupType,
    lga_key: lgaKey,
    topic_group_id: topicGroupId,
  });

  if (error) return { error: error.message };

  revalidatePath(lgaKey ? `/groups/lga/${lgaKey.replace(":", "/")}` : `/groups/topic/${topicGroupId}`);
}

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const content = (formData.get("content") as string).trim();
  const postId = formData.get("post_id") as string;

  if (!content) return { error: "Comment cannot be empty." };

  await supabase.from("post_comments").insert({
    content,
    user_id: user.id,
    post_id: postId,
  });

  revalidatePath("/groups");
}

export async function flagPost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("flags").insert({
    target_type: "post",
    target_id: postId,
    flagged_by: user.id,
    reason: "Flagged by user",
  });

  revalidatePath("/groups");
}
