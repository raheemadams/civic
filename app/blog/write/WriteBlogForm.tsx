"use client";

import { useState, useTransition } from "react";
import { createBlogPost } from "./actions";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

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

export default function WriteBlogForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createBlogPost(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-civic-green-light text-civic-green-dark text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-civic-lime" />
          Blog
        </div>
        <h1 className="font-display font-bold uppercase text-civic-green-dark text-3xl sm:text-4xl leading-tight">
          Write a Post
        </h1>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Share your civic perspective with Nigerians across all 774 LGAs. Posts are reviewed before publishing.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Title <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              name="title"
              required
              maxLength={200}
              placeholder="e.g. Why Every LGA Needs a Youth Council"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Category <span className="text-red-400">*</span>
            </label>
            <Select
              name="category"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white"
            >
              <option value="">Select a category</option>
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Body <span className="text-red-400">*</span>
            </label>
            <Textarea
              name="body"
              required
              rows={12}
              placeholder="Write your post here. Share stories, insights, or opinions about civic life in Nigeria…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 50 characters.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Cover Image URL <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <Input
              type="url"
              name="cover_url"
              placeholder="https://example.com/my-cover-image.jpg"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Direct link to a public image. Displays at the top of your post.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Tags <span className="text-gray-400 font-normal normal-case">(optional, max 5)</span>
            </label>
            <Input
              type="text"
              name="tags"
              placeholder="e.g. youth, elections, accountability"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Separate with commas.</p>
          </div>

          <div className="p-4 rounded-2xl bg-civic-green-light border border-civic-green/20 text-xs text-civic-green-dark leading-relaxed">
            <strong>Review process:</strong> Posts are reviewed before they go live. Content that is misleading, hateful, or unrelated to civic life in Nigeria will not be approved.
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Submitting…" : "Submit Post →"}
          </Button>
        </form>
      </div>
    </main>
  );
}
