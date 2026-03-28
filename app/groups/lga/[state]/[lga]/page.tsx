import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostFeed } from "@/components/groups/PostFeed";
import A from "@/components/ui/A";
import AppHeader from "@/components/layout/AppHeader";

export default async function LGAGroupPage({
  params,
}: {
  params: Promise<{ state: string; lga: string }>;
}) {
  const { state, lga } = await params;
  const stateName = decodeURIComponent(state);
  const lgaName = decodeURIComponent(lga);
  const lgaKey = `${stateName}:${lgaName}`;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: posts } = await supabase
    .from("group_posts")
    .select("*, profiles(full_name, state, lga)")
    .eq("lga_key", lgaKey)
    .eq("is_suspended", false)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title={`${lgaName} Network`} backHref="/groups" backLabel="Groups" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold uppercase text-civic-green-dark text-2xl">{lgaName} Network</h1>
          <p className="text-gray-400 text-sm mt-1">{stateName} State · LGA Group</p>
        </div>

        <PostFeed
          posts={posts ?? []}
          groupType="lga"
          lgaKey={lgaKey}
          topicGroupId={null}
          currentUserId={user.id}
        />
      </main>
    </div>
  );
}
