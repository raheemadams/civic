import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/layout/AppHeader";
import A from "@/components/ui/A";
import VideoCommentForm from "./VideoCommentForm";
import { MapPin, ExternalLink, MessageCircle } from "lucide-react";

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

function getYoutubeEmbed(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: video },
    { data: commentsData },
    { data: { user } },
  ] = await Promise.all([
    supabase
      .from("videos")
      .select("*")
      .eq("id", id)
      .eq("status", "approved")
      .single(),
    supabase
      .from("video_comments")
      .select("id, content, created_at, profiles(full_name)")
      .eq("video_id", id)
      .order("created_at", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  if (!video) notFound();

  const embedUrl = getYoutubeEmbed(video.url);
  const location = video.lga ? `${video.lga}, ${video.state}` : video.state;
  const colorClass = categoryColors[video.category] ?? "bg-gray-100 text-gray-600";
  const comments = commentsData ?? [];

  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title="Civic Lens" backHref="/videos" backLabel="All Videos" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Video player */}
        <div className="rounded-2xl overflow-hidden bg-black shadow-sm">
          {embedUrl ? (
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center gap-4"
              style={{ background: "linear-gradient(135deg, #1a5c2a 0%, #0f3a1a 100%)" }}>
              <p className="text-white font-bold text-center px-6">{video.title}</p>
              <A
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-civic-lime text-black font-bold text-sm px-5 py-2.5 rounded-full hover:bg-yellow-300 transition-colors"
              >
                <ExternalLink size={14} /> Watch Video →
              </A>
            </div>
          )}
        </div>

        {/* Video info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-2 ${colorClass}`}>
                {video.category}
              </span>
              <h1 className="font-display font-bold text-civic-green-dark text-2xl leading-tight">
                {video.title}
              </h1>
              <p className="text-gray-400 text-sm flex items-center gap-1 mt-1.5">
                <MapPin size={12} />{location}
              </p>
            </div>
            <A
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-civic-green hover:text-civic-green-dark transition-colors shrink-0"
            >
              <ExternalLink size={12} /> Open original
            </A>
          </div>
          {video.description && (
            <p className="text-gray-600 text-sm mt-4 leading-relaxed border-t border-gray-50 pt-4">
              {video.description}
            </p>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <MessageCircle size={16} className="text-civic-green" />
            <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg">
              Comments ({comments.length})
            </h2>
          </div>

          <VideoCommentForm videoId={id} isLoggedIn={!!user} />

          {comments.length > 0 ? (
            <div className="mt-6 space-y-4">
              {comments.map((c) => {
                const profile = c.profiles as { full_name: string } | null;
                return (
                  <div key={c.id} className="flex gap-3 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    {/* Avatar initial */}
                    <div className="w-8 h-8 rounded-full bg-civic-green-light flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-civic-green-dark">
                        {(profile?.full_name ?? "?")[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {profile?.full_name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-400 shrink-0">
                          {new Date(c.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-5">
              No comments yet. Be the first to share your thoughts.
            </p>
          )}
        </div>

      </main>
    </div>
  );
}
