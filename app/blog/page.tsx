import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import A from "@/components/ui/A";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { BookOpen, Calendar, User, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Community Blog | Project 774",
  description:
    "Civic voices from every corner of Nigeria. Read opinions, accountability reports, and community stories from citizens across all 774 LGAs.",
  keywords: [
    "Nigeria blog",
    "civic engagement",
    "accountability",
    "LGA",
    "governance",
    "Project 774",
    "Nigerian politics",
    "community voices",
  ],
  openGraph: {
    title: "Community Blog | Project 774",
    description:
      "Civic voices from every corner of Nigeria. Read opinions, accountability reports, and community stories from citizens across all 774 LGAs.",
    type: "website",
    siteName: "Project 774",
  },
  twitter: {
    card: "summary",
    title: "Community Blog | Project 774",
    description:
      "Civic voices from every corner of Nigeria. Opinions, accountability reports, and community stories.",
  },
};

const BLOG_CATEGORIES = [
  "General",
  "Civic Education",
  "Community Stories",
  "Elections & Democracy",
  "Youth & Leadership",
  "Policy & Governance",
  "Accountability",
  "Opinion",
];

const categoryColors: Record<string, string> = {
  "General":               "bg-gray-100 text-gray-600",
  "Civic Education":       "bg-blue-100 text-blue-700",
  "Community Stories":     "bg-teal-100 text-teal-700",
  "Elections & Democracy": "bg-green-100 text-green-700",
  "Youth & Leadership":    "bg-purple-100 text-purple-700",
  "Policy & Governance":   "bg-amber-100 text-amber-700",
  "Accountability":        "bg-red-100 text-red-700",
  "Opinion":               "bg-orange-100 text-orange-700",
};

interface SearchParams {
  category?: string;
  search?: string;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_url, category, tags, author_id, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (params.category) query = query.eq("category", params.category);
  if (params.search)   query = query.ilike("title", `%${params.search}%`);

  const { data: posts } = await query.limit(30);

  // Fetch author profiles
  const authorIds = [...new Set((posts ?? []).map((p) => p.author_id))];
  const { data: authors } = authorIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", authorIds)
    : { data: [] };

  const authorMap: Record<string, { full_name: string; avatar_url: string | null }> = {};
  for (const a of authors ?? []) {
    authorMap[a.id] = { full_name: a.full_name, avatar_url: a.avatar_url };
  }

  return (
    <div className="min-h-screen bg-civic-gray">
      <Navbar />

      {/* Hero */}
      <div
        className="px-4 sm:px-6 lg:px-8 py-10"
        style={{ background: "linear-gradient(135deg, #0f3a1a 0%, #1a5c2a 100%)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-bold uppercase text-white text-4xl sm:text-5xl leading-tight">
              Community Blog
            </h1>
            <p className="text-white/60 text-sm mt-2">
              Civic voices from every corner of Nigeria.
            </p>
          </div>
          <A
            href="/blog/write"
            className="inline-block bg-civic-lime text-black font-bold text-sm px-5 py-2.5 rounded-full hover:bg-yellow-300 transition-colors shrink-0"
          >
            Write a Post →
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
            placeholder="Search posts…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green"
          />
          <Select
            name="category"
            defaultValue={params.category ?? ""}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green bg-white"
          >
            <option value="">All Categories</option>
            {BLOG_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors shrink-0"
          >
            Filter
          </Button>
          {(params.category || params.search) && (
            <A
              href="/blog"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors shrink-0 text-center"
            >
              Clear
            </A>
          )}
        </form>

        <p className="text-sm text-gray-500 mb-4">
          {posts?.length ?? 0} post{(posts?.length ?? 0) !== 1 ? "s" : ""} found
          {params.category ? ` · ${params.category}` : ""}
        </p>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const author = authorMap[post.author_id];
              const colorClass = categoryColors[post.category] ?? "bg-gray-100 text-gray-600";
              const date = new Date(post.created_at).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <A
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow block"
                >
                  {/* Cover image */}
                  <div className="relative aspect-[16/9] bg-civic-green-dark overflow-hidden">
                    {post.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={28} className="text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
                      {post.category}
                    </span>
                    <h2 className="font-semibold text-gray-800 text-base leading-snug line-clamp-2 mt-3 mb-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        {author?.full_name ?? "Anonymous"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {date}
                      </span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="flex items-center gap-0.5 text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                            <Tag size={8} />{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </A>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <BookOpen size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-lg font-display uppercase">No posts yet</p>
            <p className="text-gray-400 text-sm mt-2">
              {params.category || params.search
                ? "Try adjusting your filters."
                : "Be the first to share your civic perspective."}
            </p>
            <A
              href="/blog/write"
              className="mt-4 inline-block bg-civic-green text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-civic-green-mid transition-colors"
            >
              Write a Post →
            </A>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
