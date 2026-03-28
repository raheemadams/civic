import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Users, Video, UserPlus, MapPin, ChevronRight,
  TrendingUp, Star, CheckCircle, BookOpen, Globe
} from "lucide-react";
import A from "@/components/ui/A";
import AppHeader from "@/components/layout/AppHeader";

const FIELD_COLORS: Record<string, string> = {
  "Technology": "bg-blue-100 text-blue-700",
  "Medicine & Health": "bg-rose-100 text-rose-700",
  "Law & Justice": "bg-purple-100 text-purple-700",
  "Business & Entrepreneurship": "bg-amber-100 text-amber-700",
  "Education": "bg-teal-100 text-teal-700",
  "Agriculture": "bg-lime-100 text-lime-700",
  "Engineering": "bg-orange-100 text-orange-700",
  "Finance & Banking": "bg-emerald-100 text-emerald-700",
  "Arts & Culture": "bg-pink-100 text-pink-700",
  "Sports": "bg-cyan-100 text-cyan-700",
  "Media & Journalism": "bg-violet-100 text-violet-700",
  "Politics & Governance": "bg-civic-green-light text-civic-green-dark",
  "Environment": "bg-green-100 text-green-700",
  "Social Work & NGO": "bg-yellow-100 text-yellow-700",
  "Science & Research": "bg-indigo-100 text-indigo-700",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch platform stats in parallel
  const [
    { count: nomineesCount },
    { count: membersCount },
    { count: postsCount },
    { data: recentNominees },
    { data: recentPosts },
    { data: featuredNominees },
    { data: recentVideos },
  ] = await Promise.all([
    supabase.from("nominees").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("group_posts").select("*", { count: "exact", head: true }).eq("is_suspended", false),
    supabase.from("nominees").select("id, name, field, state, lga, nomination_count, photo_url").eq("status", "approved").order("created_at", { ascending: false }).limit(6),
    supabase.from("group_posts").select("id, content, created_at, lga_key, group_type").eq("is_suspended", false).order("created_at", { ascending: false }).limit(6),
    supabase.from("nominees").select("id, name, field, state, lga, nomination_count").eq("status", "approved").gte("nomination_count", 1).order("nomination_count", { ascending: false }).limit(4),
    supabase.from("videos").select("id, title, category, state, created_at").eq("status", "approved").order("created_at", { ascending: false }).limit(3),
  ]);

  const displayName = profile?.full_name ?? user.email ?? "Member";
  const firstName = displayName.split(" ")[0];
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const avatarUrl = profile?.avatar_url as string | null;

  const stats = [
    { label: "Verified Nominees", value: nomineesCount ?? 0, icon: CheckCircle, color: "text-civic-green" },
    { label: "Members", value: membersCount ?? 0, icon: Users, color: "text-blue-500" },
    { label: "Community Posts", value: postsCount ?? 0, icon: BookOpen, color: "text-violet-500" },
    { label: "LGA Groups", value: 774, icon: Globe, color: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title="Project 774" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* ── LEFT COLUMN ─────────────────────────────────── */}
          <div className="space-y-6">

            {/* Hero welcome */}
            <div
              className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0f3a1a 0%, #1a5c2a 60%, #2d7a42 100%)" }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-12 -right-4 w-56 h-56 rounded-full bg-white/5" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-civic-lime text-xs font-bold uppercase tracking-widest mb-1">Project 774</p>
                  <h1 className="font-display font-bold uppercase text-white text-2xl sm:text-3xl leading-tight">
                    Welcome back, {firstName}
                  </h1>
                  <p className="text-white/60 text-sm mt-2 max-w-sm">
                    Building Nigeria&apos;s credibility database — one LGA at a time. Nominate, discuss, and hold leaders accountable.
                  </p>
                  {profile?.state && (
                    <p className="text-white/50 text-xs mt-3 flex items-center gap-1">
                      <MapPin size={11} />
                      {profile.lga}, {profile.state}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <A
                      href="/nominate"
                      className="bg-civic-lime text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-yellow-300 transition-colors flex items-center gap-1.5"
                    >
                      <UserPlus size={13} /> Nominate Someone
                    </A>
                    <A
                      href="/nominees"
                      className="bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-white/20 transition-colors flex items-center gap-1.5"
                    >
                      <Star size={13} /> View Nominees
                    </A>
                  </div>
                </div>

                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display font-bold text-xl text-white">{initials}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                  <Icon size={18} className={`mx-auto mb-1.5 ${color}`} />
                  <p className={`font-display font-bold text-xl ${color}`}>
                    {value.toLocaleString("en-US")}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <A
                href="/nominate"
                className="bg-civic-green text-white rounded-2xl p-5 flex flex-col gap-3 hover:bg-civic-green-mid transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Nominate</p>
                  <p className="text-white/70 text-xs mt-0.5">Add a credible Nigerian to the database</p>
                </div>
                <ChevronRight size={16} className="text-white/50 group-hover:translate-x-1 transition-transform" />
              </A>
              <A
                href="/videos/submit"
                className="bg-white rounded-2xl p-5 flex flex-col gap-3 hover:bg-civic-green-light transition-colors shadow-sm group"
              >
                <div className="w-10 h-10 rounded-xl bg-civic-green-light flex items-center justify-center">
                  <Video size={20} className="text-civic-green" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Civic Lens</p>
                  <p className="text-gray-400 text-xs mt-0.5">Submit a video documenting civic issues</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
              </A>
              <A
                href="/groups"
                className="bg-white rounded-2xl p-5 flex flex-col gap-3 hover:bg-civic-green-light transition-colors shadow-sm group"
              >
                <div className="w-10 h-10 rounded-xl bg-civic-green-light flex items-center justify-center">
                  <Users size={20} className="text-civic-green" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Groups</p>
                  <p className="text-gray-400 text-xs mt-0.5">Discuss issues with your LGA community</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
              </A>
            </div>

            {/* Top nominees */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg">
                    Top Nominees
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Most endorsed by their communities</p>
                </div>
                <A href="/nominees" className="text-xs font-bold text-civic-green hover:text-civic-green-dark flex items-center gap-1">
                  View all <ChevronRight size={13} />
                </A>
              </div>

              {featuredNominees && featuredNominees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featuredNominees.map((nominee) => {
                    const fieldColor = FIELD_COLORS[nominee.field as string] ?? "bg-gray-100 text-gray-600";
                    const nInitials = (nominee.name as string).split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                    return (
                      <div key={nominee.id} className="flex items-center gap-3 p-3 rounded-2xl bg-civic-gray hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-civic-green-light flex items-center justify-center shrink-0">
                          <span className="font-display font-bold text-sm text-civic-green">{nInitials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{nominee.name as string}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin size={9} /> {nominee.lga as string}, {nominee.state as string}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${fieldColor}`}>
                            {nominee.field as string}
                          </span>
                          <span className="text-xs text-gray-400">{nominee.nomination_count as number} ✓</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-civic-green-light flex items-center justify-center mx-auto mb-3">
                    <Star size={24} className="text-civic-green" />
                  </div>
                  <p className="text-gray-500 font-semibold text-sm">No nominees yet</p>
                  <p className="text-gray-400 text-xs mt-1">Be the first to nominate a credible Nigerian from your LGA.</p>
                  <A href="/nominate" className="mt-4 inline-block bg-civic-green text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-civic-green-mid transition-colors">
                    Nominate Someone →
                  </A>
                </div>
              )}
            </div>

            {/* Recent Nominations (newly added) */}
            {recentNominees && recentNominees.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg">
                      Recent Nominations
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Newly added to the database</p>
                  </div>
                  <A href="/nominees" className="text-xs font-bold text-civic-green hover:text-civic-green-dark flex items-center gap-1">
                    View all <ChevronRight size={13} />
                  </A>
                </div>
                <ul className="divide-y divide-gray-100">
                  {recentNominees.map((nominee) => {
                    const fieldColor = FIELD_COLORS[nominee.field as string] ?? "bg-gray-100 text-gray-600";
                    return (
                      <li key={nominee.id} className="py-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{nominee.name as string}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {nominee.lga as string}, {nominee.state as string}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${fieldColor}`}>
                            {nominee.field as string}
                          </span>
                          <span className="text-xs text-gray-400">{nominee.nomination_count as number} ✓</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Community Feed */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg">
                    Community Feed
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Latest from LGA and topic groups</p>
                </div>
                <A href="/groups" className="text-xs font-bold text-civic-green hover:text-civic-green-dark flex items-center gap-1">
                  Browse groups <ChevronRight size={13} />
                </A>
              </div>

              {recentPosts && recentPosts.length > 0 ? (
                <div className="space-y-3">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-4 rounded-2xl bg-civic-gray hover:bg-gray-100 transition-colors">
                      <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          post.group_type === "lga"
                            ? "bg-civic-green-light text-civic-green-dark"
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {post.group_type === "lga" ? "LGA Group" : "Topic Group"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-civic-green-light flex items-center justify-center mx-auto mb-3">
                    <Users size={24} className="text-civic-green" />
                  </div>
                  <p className="text-gray-500 font-semibold text-sm">No posts yet</p>
                  <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">
                    Join your LGA group and start discussing civic issues in your community.
                  </p>
                  <A href="/groups" className="mt-4 inline-block bg-civic-green text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-civic-green-mid transition-colors">
                    Browse Groups →
                  </A>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────── */}
          <div className="space-y-4">

            {/* Profile card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-civic-green overflow-hidden flex items-center justify-center shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-display font-bold text-xl">{initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{displayName}</p>
                  {profile?.state && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> {profile.lga}, {profile.state}
                    </p>
                  )}
                  {profile?.role && profile.role !== "user" && (
                    <span className="text-xs bg-civic-green-light text-civic-green-dark font-semibold px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                      {profile.role}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-civic-gray rounded-xl p-3 text-center">
                  <p className="text-civic-green font-bold text-lg">0</p>
                  <p className="text-xs text-gray-400">Nominations</p>
                </div>
                <div className="bg-civic-gray rounded-xl p-3 text-center">
                  <p className="text-civic-green font-bold text-lg">0</p>
                  <p className="text-xs text-gray-400">Endorsements</p>
                </div>
              </div>
              <A
                href="/profile"
                className="block text-center text-xs font-bold text-civic-green border border-civic-green/30 px-4 py-2 rounded-xl hover:bg-civic-green-light transition-colors"
              >
                Edit Profile
              </A>
            </div>

            {/* LGA group */}
            {profile?.state && (
              <A
                href={`/groups/lga/${encodeURIComponent(profile.state)}/${encodeURIComponent(profile.lga)}`}
                className="block rounded-3xl p-5 text-white shadow-sm hover:shadow-md transition-shadow"
                style={{ background: "linear-gradient(160deg, #1a5c2a 0%, #0f3a1a 100%)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-civic-lime" />
                  <span className="text-xs font-bold uppercase tracking-wide text-civic-lime">Your LGA Group</span>
                </div>
                <p className="font-display font-bold text-white uppercase text-base leading-tight">
                  {profile.lga} Network
                </p>
                <p className="text-white/60 text-xs mt-1">{profile.state} State</p>
                <div className="mt-3 flex items-center gap-1 text-civic-lime text-xs font-bold">
                  Enter group <ChevronRight size={13} />
                </div>
              </A>
            )}

            {/* Recent Videos */}
            {recentVideos && recentVideos.length > 0 && (
              <div className="bg-white rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold uppercase text-civic-green-dark text-sm">Civic Lens</h3>
                  <A href="/videos/submit" className="text-xs font-bold text-civic-green hover:text-civic-green-dark">
                    + Submit
                  </A>
                </div>
                <div className="space-y-2">
                  {recentVideos.map((video) => (
                    <div key={video.id} className="flex items-start gap-2 p-2 rounded-xl hover:bg-civic-gray transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-civic-green-light flex items-center justify-center shrink-0">
                        <Video size={14} className="text-civic-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{video.title as string}</p>
                        <p className="text-xs text-gray-400">{video.state as string} · {video.category as string}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How it works */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h3 className="font-display font-bold uppercase text-civic-green-dark text-sm mb-4">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Nominate", desc: "Add a credible Nigerian from your LGA to the verified database.", icon: UserPlus },
                  { step: "2", title: "Endorse", desc: "Community members vote to validate nominations.", icon: TrendingUp },
                  { step: "3", title: "Discuss", desc: "Join LGA groups to discuss issues and hold leaders accountable.", icon: Users },
                ].map(({ step, title, desc, icon: Icon }) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-civic-green-light flex items-center justify-center shrink-0">
                      <span className="text-civic-green text-xs font-bold">{step}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nominate CTA */}
            <div
              className="rounded-3xl p-5 shadow-sm"
              style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}
            >
              <p className="text-sm font-bold text-civic-green-dark mb-1">Know someone credible?</p>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Nigeria has 774 LGAs. Help build the most comprehensive credibility database the country has ever seen.
              </p>
              <A
                href="/nominate"
                className="block text-center bg-civic-green text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-civic-green-mid transition-colors"
              >
                Nominate Someone →
              </A>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
