import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { Database, CheckCircle, TrendingUp, Users } from "lucide-react";

export default function PartiesPage() {
  return (
    <StaticPage title="For Political Parties" subtitle="A verified talent pool from all 774 LGAs. No more excuses for bad candidates.">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">The Proposition</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Every election cycle, the same complaint: &quot;There are no good candidates.&quot; That&apos;s not true — there are
          brilliant, honest, and capable Nigerians in every LGA. The problem is they&apos;re invisible to the party structures
          that select candidates.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Project 774 solves this. Our citizen-powered database surfaces credible people from every local government —
          verified by their own communities through nominations and endorsements. Political parties now have a public,
          searchable talent pool they can draw from.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
            <Database size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">Verified Database</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Every nominee is reviewed by moderators and endorsed by real community members. No fake profiles, no padding.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
            <CheckCircle size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">Community Endorsements</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Endorsement counts show community trust. The Featured badge signals the highest level of grassroots credibility.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
            <TrendingUp size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">LGA-Level Coverage</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Browse nominees by state and LGA. Find credible people in specific constituencies where your party needs strong candidates.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
            <Users size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">Public Accountability</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            The database is public. Citizens can see if their party is drawing from verified talent — or ignoring it.
          </p>
        </div>
      </div>

      <div className="text-center">
        <A
          href="/nominees"
          className="inline-block bg-civic-green text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-civic-green-mid transition-colors"
        >
          Browse the Database →
        </A>
      </div>
    </StaticPage>
  );
}
