"use client";

import { useState, useTransition, useRef } from "react";
import { submitNomination } from "./actions";
import { FIELDS } from "./data";
import { STATE_NAMES, getLGAsForState } from "@/data/nigeria";
import { createClient } from "@/lib/supabase/client";
import { Upload, X } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function NominateForm() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lgas = getLGAsForState(selectedState);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Photo must be under 5 MB."); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError("");
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    if (photoFile) {
      setUploading(true);
      try {
        const supabase = createClient();
        const ext = photoFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("nominee-photos").upload(path, photoFile, { upsert: false });
        if (uploadError) { setError(`Photo upload failed: ${uploadError.message}`); setUploading(false); return; }
        const { data: { publicUrl } } = supabase.storage.from("nominee-photos").getPublicUrl(path);
        formData.set("photo_url", publicUrl);
      } finally { setUploading(false); }
    }

    startTransition(async () => {
      const result = await submitNomination(formData);
      if (result?.error) setError(result.error);
    });
  }

  const isSubmitting = uploading || isPending;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-civic-green-light text-civic-green-dark text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-civic-lime" />
          Nomination
        </div>
        <h1 className="font-display font-bold uppercase text-civic-green-dark text-3xl sm:text-4xl leading-tight">
          Nominate a Credible Nigerian
        </h1>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Know someone honest, capable, and ready to serve from your LGA?
          Nominations go into review before going public.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Nominee Full Name <span className="text-red-400">*</span>
            </label>
            <Input type="text" name="name" required placeholder="e.g. Dr. Amaka Okonkwo"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent" />
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
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">LGA <span className="text-red-400">*</span></label>
              <Select name="lga" required value={selectedLGA} onChange={(e) => setSelectedLGA(e.target.value)}
                disabled={!selectedState}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">{selectedState ? "Select LGA" : "Select state first"}</option>
                {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Field / Sector <span className="text-red-400">*</span></label>
            <Select name="field" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white">
              <option value="">Select a field</option>
              {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Nominee Photo <span className="text-gray-400 font-normal normal-case">(optional · max 5 MB)</span>
            </label>
            {photoPreview ? (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-civic-green">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <Button type="button" onClick={clearPhoto}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                  <X size={12} />
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-civic-green hover:text-civic-green transition-colors cursor-pointer">
                <Upload size={20} />
                <span className="text-xs font-semibold">Click to upload a photo</span>
                <span className="text-xs">JPG, PNG, WebP</span>
              </Button>
            )}
            <Input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange} className="hidden" />
            <input type="hidden" name="photo_url" value="" suppressHydrationWarning />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Why do they deserve a spot? <span className="text-red-400">*</span>
            </label>
            <Textarea name="writeup" required rows={5} minLength={100}
              placeholder="Describe their achievements, character, and why Nigeria needs more people like them. Minimum 100 characters."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent resize-none" />
          </div>

          <div className="p-4 rounded-2xl bg-civic-green-light border border-civic-green/20 text-xs text-civic-green-dark leading-relaxed">
            <strong>What happens next?</strong> Your nomination goes into a review queue.
            A moderator will approve or reject it within 48 hours. Approved nominations go live and other users can endorse them.
          </div>

          <Button type="submit" disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {uploading ? "Uploading photo…" : isPending ? "Submitting…" : "Submit Nomination →"}
          </Button>
        </form>
      </div>
    </main>
  );
}
