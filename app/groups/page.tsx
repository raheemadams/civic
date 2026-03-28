import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Users, Plus, MapPin } from "lucide-react";
import { CreateGroupForm } from "./CreateGroupForm";
import A from "@/components/ui/A";
import AppHeader from "@/components/layout/AppHeader";

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, state, lga")
    .eq("id", user.id)
    .single();

  // Fetch topic groups
  const { data: topicGroups } = await supabase
    .from("topic_groups")
    .select("*")
    .order("member_count", { ascending: false })
    .limit(20);

  // User's LGA key
  const lgaKey = profile ? `${profile.state}:${profile.lga}` : null;

  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title="Groups" backHref="/dashboard" backLabel="Dashboard" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Left: groups list */}
          <div className="space-y-6">

            {/* Your LGA group */}
            {profile && lgaKey && (
              <div>
                <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">
                  Your LGA Group
                </h2>
                <A
                  href={`/groups/lga/${encodeURIComponent(profile.state)}/${encodeURIComponent(profile.lga)}`}
                  className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #1a5c2a, #0f3a1a)" }}
                  >
                    <MapPin size={20} className="text-civic-lime" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{profile.lga} Network</p>
                    <p className="text-xs text-gray-400 mt-0.5">{profile.state} State · LGA Group</p>
                  </div>
                  <span className="text-civic-green text-sm font-bold">Enter →</span>
                </A>
              </div>
            )}

            {/* Topic groups */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl">
                  Topic Groups
                </h2>
                <A
                  href="#new-group"
                  className="flex items-center gap-1 text-xs font-bold text-civic-green hover:text-civic-green-dark transition-colors"
                >
                  <Plus size={14} /> New Group
                </A>
              </div>

              {topicGroups && topicGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topicGroups.map((group) => (
                    <A
                      key={group.id}
                      href={`/groups/topic/${group.id}`}
                      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-civic-green-light flex items-center justify-center shrink-0">
                          <Users size={18} className="text-civic-green" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 truncate">{group.name}</p>
                          {group.description && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{group.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users size={11} />
                              {group.member_count.toLocaleString("en-US")} members
                            </span>
                          </div>
                        </div>
                      </div>
                    </A>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <p className="text-gray-400 text-sm">No topic groups yet. Start one!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: create group */}
          <div>
            <div id="new-group" className="bg-white rounded-3xl p-6 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-civic-lime" />
                <h3 className="font-display font-bold uppercase text-civic-green-dark text-lg">
                  Start a Group
                </h3>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Create a topic group around an issue that matters to you.
                Anyone can join open groups.
              </p>

              <CreateGroupForm />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
