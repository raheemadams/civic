import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WriteBlogForm from "./WriteBlogForm";

export default async function WriteBlogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="min-h-screen bg-civic-gray">
      <Navbar />
      <WriteBlogForm />
      <Footer />
    </div>
  );
}
