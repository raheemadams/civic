"use client";

import { useState, useTransition } from "react";
import { addVideoComment } from "./actions";
import A from "@/components/ui/A";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

interface Props {
  videoId: string;
  isLoggedIn: boolean;
}

export default function VideoCommentForm({ videoId, isLoggedIn }: Props) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <div className="p-4 rounded-xl bg-civic-green-light border border-civic-green/20 text-sm text-civic-green-dark">
        <A href="/login" className="font-bold hover:underline">Sign in</A> to join the discussion.
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await addVideoComment(videoId, content);
      if (result?.error) {
        setError(result.error);
      } else {
        setContent("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100">{error}</p>
      )}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts on this video…"
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green resize-none"
      />
      <Button
        type="submit"
        disabled={isPending || !content.trim()}
        className="px-5 py-2.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Posting…" : "Post Comment →"}
      </Button>
    </form>
  );
}
