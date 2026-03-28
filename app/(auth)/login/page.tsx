"use client";

import { useState, useTransition } from "react";
import { signIn } from "../actions";
import A from "@/components/ui/A";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signIn(formData);
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
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to nominate, endorse, and join the movement.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <A href="/forgot-password" className="text-xs text-civic-green hover:underline">
                  Forgot password?
                </A>
              </div>
              <Input
                type="password"
                name="password"
                required
                placeholder="Your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-civic-green text-white font-semibold text-sm hover:bg-civic-green-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <A href="/register" className="text-civic-green font-semibold hover:underline">
              Create one — it&apos;s free
            </A>
          </p>
        </div>
      </div>
    </main>
  );
}
