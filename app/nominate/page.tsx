import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/layout/AppHeader";
import NominateForm from "./NominateForm";

export default async function NominatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title="Project 774" backHref="/dashboard" backLabel="Dashboard" />
      <NominateForm />
    </div>
  );
}
