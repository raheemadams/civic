"use client";

import { useState, useTransition } from "react";
import { signUp } from "../actions";
import { STATE_NAMES, getLGAsForState } from "@/data/nigeria";
import A from "@/components/ui/A";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

export default function RegisterPage() {
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
      const result = await signUp(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="min-h-screen bg-civic-gray flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <A href="/" className="inline-block">
            <span className="font-display text-2xl font-bold text-civic-green-dark tracking-tight">
              PROJECT <span className="text-civic-lime" style={{ WebkitTextStroke: "1px #0f3a1a" }}>774</span>
            </span>
          </A>
          <p className="mt-2 text-sm text-gray-500">Nigeria deserves better</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="font-display text-2xl font-bold text-civic-green-dark mb-1">
            Join the Movement
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Create your account and nominate Nigeria&apos;s best.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Full Name
              </label>
              <Input
                type="text"
                name="full_name"
                required
                placeholder="e.g. Amaka Okonkwo"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Password
              </label>
              <Input
                type="password"
                name="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                State
              </label>
              <Select
                name="state"
                required
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedLGA("");
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white"
              >
                <option value="">Select your state</option>
                {STATE_NAMES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </div>

            {/* LGA — cascades from state */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Local Government Area
              </label>
              <Select
                name="lga"
                required
                value={selectedLGA}
                onChange={(e) => setSelectedLGA(e.target.value)}
                disabled={!selectedState}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedState ? "Select your LGA" : "Select a state first"}
                </option>
                {lgas.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-civic-green text-white font-semibold text-sm hover:bg-civic-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <A href="/login" className="text-civic-green font-semibold hover:underline">
              Sign in
            </A>
          </p>
        </div>
      </div>
    </main>
  );
}
