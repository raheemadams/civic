import { createClient } from "@/lib/supabase/server";
import { STATE_NAMES } from "@/data/nigeria";
import { FIELDS } from "@/app/nominate/data";
import { MapPin, Star } from "lucide-react";
import A from "@/components/ui/A";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
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

interface SearchParams {
  state?: string;
  field?: string;
  search?: string;
}

export default async function NomineesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("nominees")
    .select("*")
    .eq("status", "approved")
    .order("nomination_count", { ascending: false });

  if (params.state) query = query.eq("state", params.state);
  if (params.field) query = query.eq("field", params.field);
  if (params.search) query = query.ilike("name", `%${params.search}%`);

  const { data: nominees } = await query.limit(60);

  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title="Nominated Nigerians" backHref="/dashboard" backLabel="Dashboard" />
      {/* Hero banner */}
      <div
        className="px-4 sm:px-6 lg:px-8 py-10"
        style={{ background: "linear-gradient(135deg, #0f3a1a 0%, #1a5c2a 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display font-bold uppercase text-white text-4xl sm:text-5xl leading-tight">
            Nominated Nigerians
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Credible, capable Nigerians from every local government — nominated by their communities.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <form method="GET" className="bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 mb-8">
          <Input
            type="text"
            name="search"
            defaultValue={params.search ?? ""}
            placeholder="Search by name…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green"
          />
          <Select
            name="state"
            defaultValue={params.state ?? ""}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green bg-white"
          >
            <option value="">All States</option>
            {STATE_NAMES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Select
            name="field"
            defaultValue={params.field ?? ""}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green bg-white"
          >
            <option value="">All Fields</option>
            {FIELDS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </Select>
          <Button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors shrink-0"
          >
            Filter
          </Button>
          {(params.state || params.field || params.search) && (
            <A
              href="/nominees"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors shrink-0 text-center"
            >
              Clear
            </A>
          )}
        </form>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {nominees?.length ?? 0} nominee{(nominees?.length ?? 0) !== 1 ? "s" : ""} found
          {params.state ? ` in ${params.state}` : ""}
          {params.field ? ` · ${params.field}` : ""}
        </p>

        {/* Grid */}
        {nominees && nominees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {nominees.map((nominee) => (
              <NomineeCard key={nominee.id} nominee={nominee} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-display uppercase">No nominees found</p>
            <p className="text-gray-400 text-sm mt-2">
              {params.state || params.field || params.search
                ? "Try adjusting your filters."
                : "Be the first to nominate a credible Nigerian."}
            </p>
            <A
              href="/nominate"
              className="mt-4 inline-block bg-civic-green text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-civic-green-mid transition-colors"
            >
              Nominate Someone →
            </A>
          </div>
        )}
      </main>
    </div>
  );
}

function NomineeCard({ nominee }: { nominee: Record<string, unknown> }) {
  const name = nominee.name as string;
  const field = nominee.field as string;
  const state = nominee.state as string;
  const lga = nominee.lga as string;
  const count = nominee.nomination_count as number;
  const photoUrl = nominee.photo_url as string | null;
  const isFeatured = count >= 10;

  const fieldColor = FIELD_COLORS[field] ?? "bg-gray-100 text-gray-600";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Photo / avatar */}
      <div className="relative h-40 bg-civic-green-light flex items-center justify-center">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display font-bold text-4xl text-civic-green">{initials}</span>
        )}
        {isFeatured && (
          <div className="absolute top-2 right-2 bg-civic-lime text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star size={10} fill="black" />
            Featured
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <MapPin size={10} />
          {lga} LGA
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <p className="font-semibold text-gray-800 text-sm leading-tight">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{state}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${fieldColor}`}>
            {field}
          </span>
          <span className="text-xs text-gray-400">{count} ✓</span>
        </div>
      </div>
    </div>
  );
}
