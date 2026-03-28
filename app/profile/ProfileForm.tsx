"use client";

import { useState, useTransition, useRef } from "react";
import { updateProfile } from "./actions";
import { createClient } from "@/lib/supabase/client";
import { STATE_NAMES, getLGAsForState } from "@/data/nigeria";
import { Camera, Upload, X } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface Profile {
  full_name: string;
  state: string;
  lga: string;
  avatar_url: string | null;
  role: string;
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [selectedState, setSelectedState] = useState(profile.state);
  const [selectedLGA, setSelectedLGA] = useState(profile.lga);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lgas = getLGAsForState(selectedState);
  const initials = profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5 MB.");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError("");
  }

  function clearAvatar() {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    // Upload new avatar if one was chosen
    if (avatarFile) {
      setUploading(true);
      try {
        const supabase = createClient();
        const ext = avatarFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: false });

        if (uploadError) {
          setError(`Photo upload failed: ${uploadError.message}`);
          setUploading(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);

        formData.set("avatar_url", publicUrl);
      } finally {
        setUploading(false);
      }
    }

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) setError(result.error);
    });
  }

  const isSubmitting = uploading || isPending;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold uppercase text-civic-green-dark text-2xl">
          Edit Profile
        </h1>
        <p className="text-gray-400 text-sm mt-1">Update your name, location, and photo.</p>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-civic-lime flex items-center justify-center ring-4 ring-civic-green-light">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-bold text-3xl text-black">{initials}</span>
              )}
            </div>
            {/* Camera overlay button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-civic-green text-white flex items-center justify-center hover:bg-civic-green-mid transition-colors shadow-md"
            >
              <Camera size={14} />
            </button>
          </div>

          {avatarPreview && avatarPreview !== profile.avatar_url ? (
            <button
              type="button"
              onClick={clearAvatar}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              <X size={12} /> Remove new photo
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-civic-green hover:text-civic-green-dark transition-colors font-semibold"
            >
              <Upload size={12} /> Upload photo
            </button>
          )}

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <input type="hidden" name="avatar_url" value={avatarPreview ?? ""} suppressHydrationWarning />
        </div>

        {/* Full name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
            Full Name <span className="text-red-400">*</span>
          </label>
          <Input
            type="text"
            name="full_name"
            required
            defaultValue={profile.full_name}
            placeholder="e.g. Amaka Okonkwo"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
          />
        </div>

        {/* State + LGA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              State <span className="text-red-400">*</span>
            </label>
            <Select
              name="state"
              required
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedLGA(""); }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white"
            >
              <option value="">Select state</option>
              {STATE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              LGA <span className="text-red-400">*</span>
            </label>
            <Select
              name="lga"
              required
              value={selectedLGA}
              onChange={(e) => setSelectedLGA(e.target.value)}
              disabled={!selectedState}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{selectedState ? "Select LGA" : "Select state first"}</option>
              {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading photo…" : isPending ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
