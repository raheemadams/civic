import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { PieChart } from "lucide-react";

export default function BudgetTrackerPage() {
  return (
    <StaticPage title="Budget Tracker" subtitle="Track how public funds are allocated and spent across Nigeria.">
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <PieChart size={28} className="text-gray-300" />
        </div>
        <h2 className="font-display font-bold uppercase text-gray-400 text-xl mb-2">Coming Soon</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
          We&apos;re building tools to track federal, state, and LGA budgets — from allocation to execution.
          Citizens deserve to know where the money goes.
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
