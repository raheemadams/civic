import { Play, MapPin, ExternalLink, Video } from "lucide-react";
import A from "@/components/ui/A";

const categoryColors: Record<string, string> = {
  Elections:      "bg-green-500/30 text-green-300 border-green-500/30",
  Infrastructure: "bg-orange-500/30 text-orange-300 border-orange-500/30",
  Youth:          "bg-purple-500/30 text-purple-300 border-purple-500/30",
  Education:      "bg-blue-500/30 text-blue-300 border-blue-500/30",
  Economy:        "bg-amber-500/30 text-amber-300 border-amber-500/30",
  Leadership:     "bg-pink-500/30 text-pink-300 border-pink-500/30",
  Health:         "bg-red-500/30 text-red-300 border-red-500/30",
  Technology:     "bg-cyan-500/30 text-cyan-300 border-cyan-500/30",
  Security:       "bg-rose-500/30 text-rose-300 border-rose-500/30",
  Environment:    "bg-lime-500/30 text-lime-300 border-lime-500/30",
};

interface VideoRow {
  id: string;
  title: string;
  url: string;
  category: string;
  state: string;
  lga: string | null;
  description: string | null;
  created_at: string;
}

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

interface Props {
  videos: VideoRow[];
}

export default function CivicLensSection({ videos }: Props) {
  return (
    <section className="bg-civic-green-dark pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-3 h-3 rounded-full bg-civic-lime" />
              <h2 className="font-display font-bold uppercase tracking-tight text-white text-2xl sm:text-3xl">
                Civic Lens
              </h2>
            </div>
            <p className="text-white/40 text-sm ml-6">
              Stories from across Nigeria — powered by citizens, not politicians.
            </p>
          </div>
          <A
            href="/videos/submit"
            className="text-civic-lime font-bold text-sm hover:text-white transition-colors shrink-0 ml-6 sm:ml-0"
          >
            Submit a video →
          </A>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.map((video) => {
              const thumbnail = getYoutubeThumbnail(video.url);
              const location = video.lga ? `${video.lga}, ${video.state}` : video.state;
              const colorClass = categoryColors[video.category] ?? "bg-white/20 text-white border-white/20";

              return (
                <A
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl bg-black block"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-50"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-civic-green/40 to-civic-green-dark flex items-center justify-center">
                        <Video size={32} className="text-white/30" />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${colorClass}`}>
                        {video.category}
                      </span>
                    </div>

                    {/* External link icon */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={10} />
                    </div>

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-civic-lime group-hover:border-civic-lime transition-all duration-300">
                        <Play size={16} className="text-white fill-white ml-0.5 group-hover:text-black group-hover:fill-black transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Title + location */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-sm leading-snug line-clamp-2">
                        {video.title}
                      </p>
                      <p className="flex items-center gap-1 text-white/50 text-xs mt-1">
                        <MapPin size={10} />
                        {location}
                      </p>
                    </div>
                  </div>
                </A>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Video size={24} className="text-white/40" />
            </div>
            <p className="text-white/60 font-semibold text-sm">No videos published yet</p>
            <p className="text-white/30 text-xs mt-1 mb-5">Be the first to document civic issues in your community.</p>
            <A
              href="/videos/submit"
              className="inline-block bg-civic-lime text-black font-bold text-xs px-5 py-2.5 rounded-full hover:bg-yellow-300 transition-colors"
            >
              Submit a Video →
            </A>
          </div>
        )}

      </div>
    </section>
  );
}
