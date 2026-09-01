import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface StaticPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function StaticPage({ title, subtitle, children }: StaticPageProps) {
  return (
    <>
      <Navbar />
      <div
        className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
        style={{ background: "linear-gradient(135deg, #0f3a1a 0%, #1a5c2a 100%)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display font-bold uppercase text-white text-4xl sm:text-5xl leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/60 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
