import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/layout/AppHeader";
import SubmitVideoForm from "./SubmitVideoForm";

export default async function SubmitVideoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="min-h-screen bg-civic-gray">
      <AppHeader title="Civic Lens" backHref="/dashboard" backLabel="Dashboard" />
      <SubmitVideoForm />
    </div>
  );
}
