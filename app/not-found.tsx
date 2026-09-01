import A from "@/components/ui/A";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-civic-gray flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div
          className="rounded-3xl p-10 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f3a1a 0%, #1a5c2a 60%, #2d7a42 100%)" }}
        >
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -right-4 w-56 h-56 rounded-full bg-white/5" />

          <div className="relative">
            <p className="font-display font-bold text-civic-lime text-8xl mb-2">404</p>
            <h1 className="font-display font-bold uppercase text-white text-2xl mb-3">
              Page Not Found
            </h1>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Let&apos;s get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <A
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-civic-lime text-black font-bold text-sm px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors"
              >
                <Home size={16} />
                Back to Home
              </A>
              <A
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                <ArrowLeft size={16} />
                Dashboard
              </A>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
