import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import DemocracySection from "@/components/sections/DemocracySection";
import CivicLensSection from "@/components/sections/CivicLensSection";

export default async function Home() {
  const supabase = await createClient();

  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, url, category, state, lga, description, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <DemocracySection />
        <CivicLensSection videos={videos ?? []} />
      </main>
      <Footer />
    </>
  );
}
