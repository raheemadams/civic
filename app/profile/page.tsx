import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/layout/AppHeader";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, state, lga, avatar_url, role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title="Profile" backHref="/dashboard" backLabel="Dashboard" />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-10">
        <ProfileForm profile={profile} />
      </main>
    </div>
  );
}
