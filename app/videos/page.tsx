import { createClient } from "@/lib/supabase/server";
import { STATE_NAMES } from "@/data/nigeria";
import AppHeader from "@/components/layout/AppHeader";
import A from "@/components/ui/A";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Play, MapPin, Video, MessageCircle } from "lucide-react";

const VIDEO_CATEGORIES = [
  "Elections & Democracy", "Youth & Education", "Health", "Infrastructure",
  "Corruption & Accountability", "Environment", "Security", "Economy & Jobs",
  "Women & Inclusion", "Community Development",
];

const categoryColors: Record<string, string> = {
  "Elections & Democracy": "bg-green-100 text-green-700",
  "Youth & Education":     "bg-blue-100 text-blue-700",
  "Health":                "bg-rose-100 text-rose-700",
  "Infrastructure":        "bg-orange-100 text-orange-700",
  "Corruption & Accountability": "bg-purple-100 text-purple-700",
  "Environment":           "bg-lime-100 text-lime-700",
  "Security":              "bg-red-100 text-red-700",
  "Economy & Jobs":        "bg-amber-100 text-amber-700",
  "Women & Inclusion":     "bg-pink-100 text-pink-700",
  "Community Development": "bg-teal-100 text-teal-700",
};

function getYoutubeThumbnail(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}

interface SearchParams {
  state?: string;
  category?: string;
  search?: string;
}

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("videos")
    .select("id, title, url, category, state, lga, description, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (params.state)    query = query.eq("state", params.state);
  if (params.category) query = query.eq("category", params.category);
  if (params.search)   query = query.ilike("title", `%${params.search}%`);

  const { data: videos } = await query.limit(60);

  // Fetch comment counts for displayed videos
  const videoIds = (videos ?? []).map((v) => v.id);
  const { data: commentCounts } = videoIds.length > 0
    ? await supabase
        .from("video_comments")
        .select("video_id")
        .in("video_id", videoIds)
    : { data: [] };

  const countMap: Record<string, number> = {};
  for (const row of commentCounts ?? []) {
    countMap[row.video_id] = (countMap[row.video_id] ?? 0) + 1;
  }

  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title="Civic Lens" backHref="/dashboard" backLabel="Dashboard" />

      {/* Hero */}
      <div
        className="px-4 sm:px-6 lg:px-8 py-10"
        style={{ background: "linear-gradient(135deg, #0f3a1a 0%, #1a5c2a 100%)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-bold uppercase text-white text-4xl sm:text-5xl leading-tight">
              Civic Lens
            </h1>
            <p className="text-white/60 text-sm mt-2">
              Stories from across Nigeria — powered by citizens, not politicians.
            </p>
          </div>
          <A
            href="/videos/submit"
            className="inline-block bg-civic-lime text-black font-bold text-sm px-5 py-2.5 rounded-full hover:bg-yellow-300 transition-colors shrink-0"
          >
            Submit a Video →
          </A>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <form method="GET" className="bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 mb-8">
          <Input
            type="text"
            name="search"
            defaultValue={params.search ?? ""}
            placeholder="Search by title…"
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
            name="category"
            defaultValue={params.category ?? ""}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green bg-white"
          >
            <option value="">All Categories</option>
            {VIDEO_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors shrink-0"
          >
            Filter
          </Button>
          {(params.state || params.category || params.search) && (
            <A
              href="/videos"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors shrink-0 text-center"
            >
              Clear
            </A>
          )}
        </form>

        <p className="text-sm text-gray-500 mb-4">
          {videos?.length ?? 0} video{(videos?.length ?? 0) !== 1 ? "s" : ""} found
          {params.state ? ` in ${params.state}` : ""}
          {params.category ? ` · ${params.category}` : ""}
        </p>

        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => {
              const thumbnail = getYoutubeThumbnail(video.url);
              const location = video.lga ? `${video.lga}, ${video.state}` : video.state;
              const colorClass = categoryColors[video.category] ?? "bg-gray-100 text-gray-600";
              const comments = countMap[video.id] ?? 0;

              return (
                <A
                  key={video.id}
                  href={`/videos/${video.id}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow block"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-civic-green-dark overflow-hidden">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video size={28} className="text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:bg-civic-lime group-hover:border-civic-lime transition-all duration-300">
                        <Play size={14} className="text-white fill-white ml-0.5 group-hover:text-black group-hover:fill-black transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2">{video.title}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
                        {video.category}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MessageCircle size={11} />{comments}
                        </span>
                      </div>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                      <MapPin size={10} />{location}
                    </p>
                  </div>
                </A>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Video size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-lg font-display uppercase">No videos found</p>
            <p className="text-gray-400 text-sm mt-2">
              {params.state || params.category || params.search
                ? "Try adjusting your filters."
                : "Be the first to document civic life in your community."}
            </p>
            <A
              href="/videos/submit"
              className="mt-4 inline-block bg-civic-green text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-civic-green-mid transition-colors"
            >
              Submit a Video →
            </A>
          </div>
        )}
      </main>
    </div>
  );
}
