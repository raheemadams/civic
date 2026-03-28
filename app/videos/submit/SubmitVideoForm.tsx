"use client";

import { useState, useTransition } from "react";
import { STATE_NAMES, getLGAsForState } from "@/data/nigeria";
import { submitVideo } from "./actions";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const VIDEO_CATEGORIES = [
  "Elections & Democracy", "Youth & Education", "Health", "Infrastructure",
  "Corruption & Accountability", "Environment", "Security", "Economy & Jobs",
  "Women & Inclusion", "Community Development",
];

export default function SubmitVideoForm() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const lgas = getLGAsForState(selectedState);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitVideo(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-civic-green-light text-civic-green-dark text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-civic-lime" />
          Civic Lens
        </div>
        <h1 className="font-display font-bold uppercase text-civic-green-dark text-3xl sm:text-4xl leading-tight">
          Submit a Video
        </h1>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Share a video that documents civic life in Nigeria. All videos are reviewed before going live.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Video Title <span className="text-red-400">*</span></label>
            <Input type="text" name="title" required placeholder="e.g. Broken Roads in Ajegunle After 3 Years"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Video URL <span className="text-red-400">*</span></label>
            <Input type="url" name="url" required placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent" />
            <p className="text-xs text-gray-400 mt-1">YouTube, Twitter/X, or any public video URL.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Category <span className="text-red-400">*</span></label>
            <Select name="category" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white">
              <option value="">Select a category</option>
              {VIDEO_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">State <span className="text-red-400">*</span></label>
              <Select name="state" required value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedLGA(""); }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white">
                <option value="">Select state</option>
                {STATE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">LGA <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
              <Select name="lga" value={selectedLGA} onChange={(e) => setSelectedLGA(e.target.value)}
                disabled={!selectedState}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">{selectedState ? "Select LGA" : "Select state first"}</option>
                {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Description <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
            <Textarea name="description" rows={3} placeholder="What does this video show? Any context that helps viewers understand it."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent resize-none" />
          </div>

          <div className="p-4 rounded-2xl bg-civic-green-light border border-civic-green/20 text-xs text-civic-green-dark leading-relaxed">
            <strong>Review process:</strong> Videos are reviewed before going live. Content that is misleading, violent, or unrelated to civic life in Nigeria will not be approved.
          </div>

          <Button type="submit" disabled={isPending}
            className="w-full py-3.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {isPending ? "Submitting…" : "Submit Video →"}
          </Button>
        </form>
      </div>
    </main>
  );
}
