"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { createPost, createComment, flagPost } from "@/app/groups/actions";
import { createClient } from "@/lib/supabase/client";
import { Flag, MessageCircle, Send, Share2, Copy, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

interface Post {
  id: string;
  content: string;
  created_at: string;
  lga_key: string | null;
  topic_group_id: string | null;
  user_id: string;
  profiles: { full_name: string; state: string; lga: string } | null;
}

interface MentionUser {
  id: string;
  full_name: string;
}

interface PostFeedProps {
  posts: Post[];
  groupType: "lga" | "topic";
  lgaKey: string | null;
  topicGroupId: string | null;
  currentUserId: string;
}

/** Renders post content with @[Full Name] mentions highlighted */
function parseContent(content: string): React.ReactNode[] {
  const parts = content.split(/(@\[[^\]]+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^@\[([^\]]+)\]$/);
    if (match) {
      return (
        <span key={i} className="font-semibold text-civic-green">
          @{match[1]}
        </span>
      );
    }
    return part;
  });
}

function getSharePath(post: Post): string {
  if (post.lga_key) {
    const [state, lga] = post.lga_key.split(":");
    return `/groups/lga/${encodeURIComponent(state)}/${encodeURIComponent(lga)}#post-${post.id}`;
  }
  if (post.topic_group_id) {
    return `/groups/topic/${post.topic_group_id}#post-${post.id}`;
  }
  return `/groups`;
}

export function PostFeed({
  posts: initialPosts,
  groupType,
  lgaKey,
  topicGroupId,
  currentUserId,
}: PostFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [postContent, setPostContent] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Mention autocomplete state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
  const [mentionStartIdx, setMentionStartIdx] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setPostContent(value);

    const cursor = e.target.selectionStart ?? value.length;
    const textBeforeCursor = value.slice(0, cursor);
    // Match @ followed by text that hasn't been closed into @[...] yet
    const mentionMatch = textBeforeCursor.match(/@([^@[\]\n]*)$/);

    if (mentionMatch && mentionMatch[1].length >= 1) {
      const query = mentionMatch[1];
      setMentionStartIdx(cursor - mentionMatch[0].length);
      setMentionQuery(query);
      const supabase = createClient();
      supabase
        .from("profiles")
        .select("id, full_name")
        .ilike("full_name", `%${query}%`)
        .limit(5)
        .then(({ data }) => setMentionUsers(data ?? []));
    } else {
      setMentionQuery(null);
      setMentionUsers([]);
    }
  }

  function handleMentionSelect(user: MentionUser) {
    const cursor = textareaRef.current?.selectionStart ?? postContent.length;
    const before = postContent.slice(0, mentionStartIdx);
    const after = postContent.slice(cursor);
    const inserted = `@[${user.full_name}] `;
    const newContent = `${before}${inserted}${after}`;
    setPostContent(newContent);
    setMentionQuery(null);
    setMentionUsers([]);
    setTimeout(() => {
      textareaRef.current?.focus();
      const pos = mentionStartIdx + inserted.length;
      textareaRef.current?.setSelectionRange(pos, pos);
    }, 0);
  }

  function handlePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!postContent.trim()) return;

    const formData = new FormData();
    formData.set("content", postContent);
    formData.set("group_type", groupType);
    if (lgaKey) formData.set("lga_key", lgaKey);
    if (topicGroupId) formData.set("topic_group_id", topicGroupId);

    const optimistic: Post = {
      id: `temp-${Date.now()}`,
      content: postContent,
      created_at: new Date().toISOString(),
      lga_key: lgaKey,
      topic_group_id: topicGroupId,
      user_id: currentUserId,
      profiles: null,
    };

    setPosts((prev) => [optimistic, ...prev]);
    setPostContent("");
    setMentionQuery(null);
    setMentionUsers([]);

    startTransition(async () => {
      await createPost(formData);
    });
  }

  return (
    <div className="space-y-4">
      {/* Post composer */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <form onSubmit={handlePost}>
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={postContent}
              onChange={handleTextareaChange}
              rows={3}
              placeholder="Share an update or ask a question… type @ to mention someone"
              className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none"
            />

            {/* Mention suggestions dropdown */}
            {mentionQuery !== null && mentionUsers.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                {mentionUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // keep textarea focused
                      handleMentionSelect(user);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-civic-green-light flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-full bg-civic-green flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">
                        {user.full_name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </span>
                    <span className="font-medium text-gray-800">{user.full_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">Type @ to mention someone</span>
            <Button
              type="submit"
              disabled={isPending || !postContent.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-civic-green text-white text-xs font-bold hover:bg-civic-green-mid transition-colors disabled:opacity-50"
            >
              <Send size={13} />
              {isPending ? "Posting…" : "Post"}
            </Button>
          </div>
        </form>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-400 text-sm">No posts yet. Be the first to post!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isExpanded={expandedPost === post.id}
            onToggleComments={() =>
              setExpandedPost(expandedPost === post.id ? null : post.id)
            }
            currentUserId={currentUserId}
            sharePath={getSharePath(post)}
          />
        ))
      )}
    </div>
  );
}

function PostCard({
  post,
  isExpanded,
  onToggleComments,
  currentUserId,
  sharePath,
}: {
  post: Post;
  isExpanded: boolean;
  onToggleComments: () => void;
  currentUserId: string;
  sharePath: string;
}) {
  const [comment, setComment] = useState("");
  const [flagged, setFlagged] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const authorName = post.profiles?.full_name ?? "Member";
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const timeAgo = formatTimeAgo(post.created_at);

  // Close share menu on outside click
  useEffect(() => {
    if (!shareOpen) return;
    function handleOutside(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [shareOpen]);

  function handleComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!comment.trim()) return;
    const formData = new FormData();
    formData.set("content", comment);
    formData.set("post_id", post.id);
    setComment("");
    startTransition(async () => {
      await createComment(formData);
    });
  }

  function handleFlag() {
    if (flagged) return;
    setFlagged(true);
    startTransition(async () => {
      await flagPost(post.id);
    });
  }

  async function handleCopyLink() {
    const url = window.location.origin + sharePath;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setShareOpen(false);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareX() {
    const url = window.location.origin + sharePath;
    const text = `"${post.content.slice(0, 120)}${post.content.length > 120 ? "…" : ""}"`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setShareOpen(false);
  }

  function handleShareWhatsApp() {
    const url = window.location.origin + sharePath;
    const text = `${post.content.slice(0, 200)}${post.content.length > 200 ? "…" : ""}\n\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setShareOpen(false);
  }

  return (
    <div id={`post-${post.id}`} className="bg-white rounded-2xl p-5 shadow-sm">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-civic-green flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{authorName}</p>
          <p className="text-xs text-gray-400">{timeAgo}</p>
        </div>
      </div>

      {/* Content — @[Name] mentions rendered as highlighted spans */}
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {parseContent(post.content)}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
        <Button
          onClick={onToggleComments}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-civic-green transition-colors"
        >
          <MessageCircle size={14} />
          Comment
        </Button>

        {/* Share */}
        <div ref={shareRef} className="relative">
          <Button
            onClick={() => setShareOpen((v) => !v)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              copied ? "text-civic-green" : "text-gray-400 hover:text-civic-green"
            }`}
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? "Copied!" : "Share"}
          </Button>

          {shareOpen && (
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl border border-gray-200 shadow-xl z-20 overflow-hidden min-w-[168px]">
              <button
                onClick={handleCopyLink}
                className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
              >
                <Copy size={13} className="text-gray-400" />
                Copy link
              </button>
              <button
                onClick={handleShareX}
                className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors border-t border-gray-50"
              >
                {/* X (Twitter) logo */}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-gray-600" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors border-t border-gray-50"
              >
                {/* WhatsApp logo */}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-green-500" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Share on WhatsApp
              </button>
            </div>
          )}
        </div>

        <Button
          onClick={handleFlag}
          disabled={flagged || isPending}
          className={`flex items-center gap-1.5 text-xs transition-colors ml-auto ${
            flagged ? "text-red-400" : "text-gray-300 hover:text-red-400"
          }`}
        >
          <Flag size={13} />
          {flagged ? "Flagged" : "Flag"}
        </Button>
      </div>

      {/* Comment box */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <form onSubmit={handleComment} className="flex gap-2">
            <Input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-civic-green"
            />
            <Button
              type="submit"
              disabled={isPending || !comment.trim()}
              className="px-3 py-2 rounded-xl bg-civic-green text-white text-xs font-bold hover:bg-civic-green-mid transition-colors disabled:opacity-50"
            >
              <Send size={12} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
