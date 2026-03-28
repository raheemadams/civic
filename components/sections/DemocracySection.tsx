import { createClient } from "@/lib/supabase/server";
import { quickLinks } from "@/data/quickLinks";
import NomineeCard from "@/components/ui/NomineeCard";
import QuickLinkItem from "@/components/ui/QuickLinkItem";
import A from "@/components/ui/A";
import { Users, MessageCircle } from "lucide-react";
import { Nominee } from "@/types";

const activeGroups = [
  { name: "Lagos LGA Network",   type: "LGA",   members: 1240, posts: 34 },
  { name: "Education Reform NG", type: "Topic",  members: 876,  posts: 19 },
  { name: "Kano Civic Circle",   type: "LGA",   members: 654,  posts: 12 },
  { name: "Corruption Watch",    type: "Topic",  members: 2103, posts: 57 },
];

const avatarUrl = (name: string, bg = "1a5c2a") =>
  `https://ui-avatars.com/api/?background=${bg}&color=fff&bold=true&size=256&name=${encodeURIComponent(name)}`;

export default async function DemocracySection() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("nominees")
    .select("id, name, photo_url, state, lga, field, writeup")
    .eq("status", "approved")
    .eq("featured", true)
    .order("created_at")
    .limit(12);

  const nominees: Nominee[] = (rows ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    achievement: r.writeup,
    field: r.field,
    state: r.state,
    lga: r.lga,
    imageUrl: r.photo_url ?? avatarUrl(r.name),
  }));

  const states = [...new Set(nominees.map((n) => n.state))].sort();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-civic-gray">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">

          {/* Left: nominees */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-3 h-3 rounded-full bg-civic-lime shrink-0" />
              <h2 className="font-display font-bold uppercase tracking-tight text-civic-green-dark text-2xl sm:text-3xl">
                Featured Nigerians
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-5 ml-6">
              Credible people from across Nigeria&apos;s local governments —
              nominated by their communities.
            </p>

            <div className="flex gap-2 flex-wrap mb-6 ml-6">
              <button
                className="text-xs font-bold px-3 py-1.5 rounded-full bg-civic-green text-white"
                suppressHydrationWarning
              >
                All States
              </button>
              {states.map((state) => (
                <button
                  key={state}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-civic-green-light text-civic-green-dark hover:bg-civic-green hover:text-white transition-colors duration-150"
                  suppressHydrationWarning
                >
                  {state}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nominees.map((nominee) => (
                <NomineeCard key={nominee.id} nominee={nominee} />
              ))}
            </div>

            <div className="mt-6 text-center">
              <A
                href="/nominees"
                className="inline-flex items-center gap-2 text-civic-green font-bold text-sm hover:text-civic-green-dark transition-colors"
              >
                View all nominated Nigerians →
              </A>
            </div>
          </div>

          {/* Right column: stacked cards */}
          <div className="flex flex-col gap-6">

            {/* Join the Movement */}
            <div
              className="rounded-3xl p-6 sm:p-8 shadow-sm"
              style={{ background: "linear-gradient(160deg, #1a5c2a 0%, #0f3a1a 100%)" }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-3 h-3 rounded-full bg-civic-lime shrink-0" />
                <h2 className="font-display font-bold uppercase tracking-tight text-white text-2xl sm:text-3xl">
                  Join the Movement
                </h2>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6 ml-6">
                Know someone credible, capable, and honest from your LGA?
                Nominate them. We&apos;re building the database that proves Nigeria
                has better options — so political parties run out of excuses.
              </p>

              <A
                href="/nominate"
                className="flex items-center justify-center gap-2 w-full bg-civic-lime text-black font-bold text-sm px-6 py-3.5 rounded-full hover:bg-civic-lime-hover hover:scale-105 transition-all duration-200 shadow-md mb-6"
              >
                Nominate Someone →
              </A>

              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <QuickLinkItem key={link.id} link={link} />
                ))}
              </ul>

              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-civic-lime font-bold text-lg">774</p>
                <p className="text-white/50 text-xs mt-0.5">
                  Local governments waiting to be represented
                </p>
              </div>
            </div>

            {/* Group Discussions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-civic-lime shrink-0" />
                  <h3 className="font-display font-bold uppercase tracking-tight text-civic-green-dark text-lg">
                    Group Discussions
                  </h3>
                </div>
                <A href="/groups" className="text-xs font-bold text-civic-green hover:text-civic-green-dark transition-colors">
                  See all →
                </A>
              </div>

              <ul className="space-y-2">
                {activeGroups.map((group) => (
                  <li key={group.name}>
                    <A
                      href="/groups"
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-civic-green-light transition-colors duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-civic-green-light flex items-center justify-center shrink-0 group-hover:bg-civic-green transition-colors">
                        <Users size={16} className="text-civic-green group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{group.name}</p>
                        <p className="text-xs text-gray-400">{group.members.toLocaleString("en-US")} members</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                        <MessageCircle size={11} />
                        {group.posts}
                      </div>
                    </A>
                  </li>
                ))}
              </ul>

              <A
                href="/groups/new"
                className="mt-4 flex items-center justify-center w-full border-2 border-dashed border-civic-green/20 text-civic-green font-bold text-sm py-3 rounded-2xl hover:border-civic-green/50 hover:bg-civic-green-light transition-all duration-200"
              >
                + Start a Group
              </A>
            </div>

          </div>{/* end right column */}

        </div>
      </div>
    </section>
  );
}
