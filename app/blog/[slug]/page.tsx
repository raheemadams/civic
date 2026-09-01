import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import A from "@/components/ui/A";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, cover_url, category, tags, created_at")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (!post) {
    return { title: "Post Not Found | Project 774" };
  }

  const description = post.excerpt || `${post.title} — Read on Project 774 Community Blog`;

  return {
    title: `${post.title} | Project 774 Blog`,
    description,
    keywords: [
      ...(post.tags || []),
      post.category,
      "Nigeria",
      "civic engagement",
      "Project 774",
    ],
    authors: [{ name: "Project 774 Editorial" }],
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.created_at,
      tags: post.tags || [],
      siteName: "Project 774",
      ...(post.cover_url && { images: [{ url: post.cover_url, width: 1200, height: 630, alt: post.title }] }),
    },
    twitter: {
      card: post.cover_url ? "summary_large_image" : "summary",
      title: post.title,
      description,
      ...(post.cover_url && { images: [post.cover_url] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (!post) notFound();

  const { data: author } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, state, lga")
    .eq("id", post.author_id)
    .single();

  const date = new Date(post.created_at).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    ...(post.cover_url && { image: post.cover_url }),
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      "@type": "Person",
      name: author?.full_name || "Anonymous",
    },
    publisher: {
      "@type": "Organization",
      name: "Project 774",
    },
    keywords: post.tags?.join(", ") || post.category,
    articleSection: post.category,
  };

  return (
    <div className="min-h-screen bg-civic-gray">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Back link */}
        <A
          href="/blog"
          className="inline-flex items-center gap-1.5 text-civic-green hover:text-civic-green-mid text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          All Posts
        </A>

        {/* Cover image */}
        {post.cover_url && (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-civic-green-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Category badge */}
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-civic-green-light text-civic-green-dark mb-4">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="font-display font-bold text-civic-green-dark text-3xl sm:text-4xl leading-tight mb-4">
          {post.title}
        </h1>

        {/* Author + date */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {author?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.avatar_url}
                alt={author.full_name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-civic-green flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-700">{author?.full_name ?? "Anonymous"}</p>
              {author?.state && (
                <p className="text-xs text-gray-400">
                  {author.lga ? `${author.lga}, ` : ""}{author.state}
                </p>
              )}
            </div>
          </div>
          <span className="flex items-center gap-1 text-gray-400">
            <Calendar size={13} />
            {date}
          </span>
        </div>

        {/* Body */}
        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-10">
          <div className="prose prose-gray max-w-none text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">
            {post.body}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-10 p-6 rounded-2xl bg-civic-green-light border border-civic-green/20 text-center">
          <p className="text-civic-green-dark font-semibold text-sm mb-2">
            Have something to say?
          </p>
          <A
            href="/blog/write"
            className="inline-block bg-civic-green text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-civic-green-mid transition-colors"
          >
            Write a Post →
          </A>
        </div>
      </article>
      <Footer />
    </div>
  );
}
