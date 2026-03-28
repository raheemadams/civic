import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostFeed } from "@/components/groups/PostFeed";
import { Users } from "lucide-react";
import A from "@/components/ui/A";
import AppHeader from "@/components/layout/AppHeader";

export default async function TopicGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: group } = await supabase
    .from("topic_groups")
    .select("*")
    .eq("id", id)
    .single();

  if (!group) redirect("/groups");

  const { data: posts } = await supabase
    .from("group_posts")
    .select("*, profiles(full_name, state, lga)")
    .eq("topic_group_id", id)
    .eq("is_suspended", false)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title={group.name} backHref="/groups" backLabel="Groups" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold uppercase text-civic-green-dark text-2xl">{group.name}</h1>
            {group.description && (
              <p className="text-gray-500 text-sm mt-1">{group.description}</p>
            )}
            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
              <Users size={11} />
              {group.member_count.toLocaleString("en-US")} members
            </p>
          </div>
        </div>

        <PostFeed
          posts={posts ?? []}
          groupType="topic"
          lgaKey={null}
          topicGroupId={id}
          currentUserId={user.id}
        />
      </main>
    </div>
  );
}
