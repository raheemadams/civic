import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { Map } from "lucide-react";

export default function ConstituencyMapPage() {
  return (
    <StaticPage title="Constituency Map" subtitle="Explore Nigeria's 774 LGAs and the civic activity in each one.">
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Map size={28} className="text-gray-300" />
        </div>
        <h2 className="font-display font-bold uppercase text-gray-400 text-xl mb-2">Coming Soon</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
          An interactive map showing all 774 LGAs, nominees per area, civic activity, and local representation.
          We&apos;re working on making Nigeria&apos;s civic landscape visible at a glance.
        </p>
        <A
          href="/resources"
          className="inline-block bg-civic-green text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-civic-green-mid transition-colors"
        >
          ← Back to Resources
        </A>
      </div>
    </StaticPage>
  );
}
