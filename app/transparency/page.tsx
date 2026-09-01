import StaticPage from "@/components/layout/StaticPage";
import { BarChart3, ShieldCheck, Users, Eye } from "lucide-react";

export default function TransparencyPage() {
  return (
    <StaticPage title="Transparency Report" subtitle="How we moderate, what we track, and how the platform operates.">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">Why Transparency?</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          We ask Nigerians to trust this platform with their nominations, endorsements, and civic voices.
          That trust must be earned through full transparency about how we operate, moderate content,
          and handle data. This page is our commitment to openness.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
            <ShieldCheck size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">Moderation</h3>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
            <li>All nominations, videos, and blog posts are reviewed before publishing.</li>
            <li>Group posts are live but subject to community flagging (auto-suspend at 3 flags).</li>
            <li>Moderators are selected from active, trusted community members.</li>
            <li>Rejected content includes a reason visible to the submitter.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
            <BarChart3 size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">Platform Stats</h3>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
            <li>774 LGA groups auto-created and available.</li>
            <li>Nomination, endorsement, and video counts are public on the dashboard.</li>
            <li>All endorsement actions are logged and auditable.</li>
            <li>We publish periodic reports on platform growth and engagement.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
            <Eye size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">Data Practices</h3>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
            <li>No tracking pixels, ad networks, or third-party analytics.</li>
            <li>Data is stored in Nigeria-compliant infrastructure.</li>
            <li>Row-level security ensures proper data access controls.</li>
            <li>Users can request data deletion at any time.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
            <Users size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">Governance</h3>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
            <li>Role hierarchy: User → Moderator → Admin → Super Admin.</li>
            <li>Moderator actions are logged and reviewable by admins.</li>
            <li>Community feedback is actively solicited and incorporated.</li>
            <li>Open-source ethos — our processes are documented publicly.</li>
          </ul>
        </div>
      </div>
    </StaticPage>
  );
}
