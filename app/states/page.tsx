import { createClient } from "@/lib/supabase/server";
import { STATE_NAMES } from "@/data/nigeria";
import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { MapPin, Users } from "lucide-react";

export default async function StatesPage() {
  const supabase = await createClient();

  // Get nominee counts per state
  const { data: stateCounts } = await supabase
    .from("nominees")
    .select("state")
    .eq("status", "approved");

  const countMap: Record<string, number> = {};
  for (const row of stateCounts ?? []) {
    countMap[row.state] = (countMap[row.state] ?? 0) + 1;
  }

  // Group states by geopolitical zone
  const zones: Record<string, string[]> = {
    "North Central": ["Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "FCT"],
    "North East": ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"],
    "North West": ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"],
    "South East": ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
    "South South": ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"],
    "South West": ["Ekiti", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"],
  };

  return (
    <StaticPage title="Browse by State" subtitle="Explore nominees and civic activity across Nigeria's 36 states and FCT.">
      <div className="space-y-8">
        {Object.entries(zones).map(([zone, states]) => (
          <div key={zone}>
            <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-civic-green" />
              {zone}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {states.map((state) => {
                const count = countMap[state] ?? 0;
                return (
                  <A
                    key={state}
                    href={`/nominees?state=${encodeURIComponent(state)}`}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow block group"
                  >
                    <p className="font-semibold text-gray-800 text-sm group-hover:text-civic-green transition-colors">{state}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Users size={10} />
                      {count} nominee{count !== 1 ? "s" : ""}
                    </p>
                  </A>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
