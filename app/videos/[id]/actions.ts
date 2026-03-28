"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionResult = { error: string } | null;

export async function addVideoComment(
  videoId: string,
  content: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to comment." };

  const trimmed = content.trim();
  if (trimmed.length < 2) return { error: "Comment is too short." };
  if (trimmed.length > 1000) return { error: "Comment is too long (max 1000 characters)." };

  const { error } = await supabase
    .from("video_comments")
    .insert({ video_id: videoId, user_id: user.id, content: trimmed });

  if (error) return { error: "Failed to post comment." };
  revalidatePath(`/videos/${videoId}`);
  return null;
}
