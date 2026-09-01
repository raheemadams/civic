import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { Megaphone } from "lucide-react";

export default function NewsPage() {
  return (
    <StaticPage title="News" subtitle="Updates, announcements, and milestones from Project 774.">
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Megaphone size={28} className="text-gray-300" />
        </div>
        <h2 className="font-display font-bold uppercase text-gray-400 text-xl mb-2">Coming Soon</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto mb-6">
          We&apos;re working on bringing you the latest civic news and platform updates.
          In the meantime, check out our community blog.
        </p>
        <A
          href="/blog"
          className="inline-block bg-civic-green text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-civic-green-mid transition-colors"
        >
          Read the Blog →
        </A>
      </div>
    </StaticPage>
  );
}
