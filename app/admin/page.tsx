import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  approveNominee, rejectNominee,
  approveVideo, rejectVideo,
  restorePost, removePost,
} from "./actions";
import { AdminActionForm } from "./AdminActionForm";
import { RoleSelector } from "./RoleSelector";
import { MapPin, CheckCircle, XCircle, RotateCcw, Trash2 } from "lucide-react";
import A from "@/components/ui/A";
import AppHeader from "@/components/layout/AppHeader";

const TABS = ["Nominations", "Videos", "Flagged Posts", "Users"] as const;
type Tab = typeof TABS[number];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "super_admin", "moderator"].includes(profile.role)) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const activeTab: Tab = (TABS.find((t) => t === params.tab) ?? "Nominations");

  // Use admin client to bypass RLS for all admin data fetches
  const adminDb = createAdminClient();

  const [
    { data: pendingNominees },
    { data: pendingVideos },
    { data: flaggedPosts },
    { data: allUsers },
  ] = await Promise.all([
    adminDb.from("nominees").select("*").eq("status", "pending").order("created_at"),
    adminDb.from("videos").select("*").eq("status", "pending").order("created_at"),
    adminDb.from("group_posts").select("*").eq("is_suspended", true).order("flag_count", { ascending: false }),
    profile.role === "super_admin" || profile.role === "admin"
      ? adminDb.from("profiles").select("*").order("created_at", { ascending: false }).limit(50)
      : { data: [] },
  ]);

  const counts = {
    Nominations: pendingNominees?.length ?? 0,
    Videos: pendingVideos?.length ?? 0,
    "Flagged Posts": flaggedPosts?.length ?? 0,
    Users: allUsers?.length ?? 0,
  };

  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title="Admin" backHref="/dashboard" backLabel="Dashboard" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display font-bold uppercase text-civic-green-dark text-3xl mb-6">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((tab) => (
            <A
              key={tab}
              href={`/admin?tab=${tab}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-civic-green text-white"
                  : "bg-white text-gray-600 hover:bg-civic-green-light"
              }`}
            >
              {tab}
              {counts[tab] > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                }`}>
                  {counts[tab]}
                </span>
              )}
            </A>
          ))}
        </div>

        {/* Tab: Nominations */}
        {activeTab === "Nominations" && (
          <div className="space-y-4">
            {!pendingNominees?.length ? (
              <EmptyQueue message="No pending nominations." />
            ) : (
              pendingNominees.map((n) => (
                <div key={n.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-gray-800">{n.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-civic-green-light text-civic-green-dark font-semibold">
                          {n.field}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                        <MapPin size={11} />{n.lga}, {n.state}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{n.writeup}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <AdminActionForm action={approveNominee.bind(null, n.id)}>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-civic-green text-white text-xs font-bold hover:bg-civic-green-mid transition-colors">
                          <CheckCircle size={14} /> Approve
                        </button>
                      </AdminActionForm>
                      <AdminActionForm action={rejectNominee.bind(null, n.id, "Does not meet criteria.")}>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors border border-red-200">
                          <XCircle size={14} /> Reject
                        </button>
                      </AdminActionForm>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-3">
                    Submitted {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Videos */}
        {activeTab === "Videos" && (
          <div className="space-y-4">
            {!pendingVideos?.length ? (
              <EmptyQueue message="No pending videos." />
            ) : (
              pendingVideos.map((v) => (
                <div key={v.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-0.5">{v.title}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                        <MapPin size={11} />{v.lga ? `${v.lga}, ` : ""}{v.state} · {v.category}
                      </p>
                      {v.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{v.description}</p>
                      )}
                      <A href={v.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-civic-green hover:underline mt-1 inline-block">
                        View video →
                      </A>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <AdminActionForm action={approveVideo.bind(null, v.id)}>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-civic-green text-white text-xs font-bold hover:bg-civic-green-mid transition-colors">
                          <CheckCircle size={14} /> Approve
                        </button>
                      </AdminActionForm>
                      <AdminActionForm action={rejectVideo.bind(null, v.id)}>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors border border-red-200">
                          <XCircle size={14} /> Reject
                        </button>
                      </AdminActionForm>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Flagged Posts */}
        {activeTab === "Flagged Posts" && (
          <div className="space-y-4">
            {!flaggedPosts?.length ? (
              <EmptyQueue message="No flagged posts." />
            ) : (
              flaggedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-300">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-red-500 mb-1">
                        {post.flag_count} flag{post.flag_count !== 1 ? "s" : ""} · Auto-suspended
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {post.lga_key ?? "Topic group"} · {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <AdminActionForm action={restorePost.bind(null, post.id)}>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-civic-green-light text-civic-green-dark text-xs font-bold hover:bg-civic-green hover:text-white transition-colors border border-civic-green/20">
                          <RotateCcw size={14} /> Restore
                        </button>
                      </AdminActionForm>
                      <AdminActionForm action={removePost.bind(null, post.id)}>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors border border-red-200">
                          <Trash2 size={14} /> Remove
                        </button>
                      </AdminActionForm>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Users */}
        {activeTab === "Users" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {!allUsers?.length ? (
              <EmptyQueue message="No users found." />
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-civic-gray border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">User</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Location</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Role</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allUsers.map((u: Record<string, unknown>) => (
                    <tr key={u.id as string} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-gray-800">{u.full_name as string}</p>
                        <p className="text-xs text-gray-400">
                          Joined {new Date(u.created_at as string).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {u.lga as string}, {u.state as string}
                      </td>
                      <td className="px-5 py-3">
                        <RoleBadge role={u.role as string} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        {profile.role === "super_admin" && (
                          <RoleSelector userId={u.id as string} currentRole={u.role as string} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyQueue({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    user: "bg-gray-100 text-gray-600",
    moderator: "bg-blue-100 text-blue-700",
    admin: "bg-purple-100 text-purple-700",
    super_admin: "bg-civic-green-light text-civic-green-dark",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[role] ?? styles.user}`}>
      {role}
    </span>
  );
}
