import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { Database, Video, Users, PenLine, ShieldCheck, BarChart3 } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: Database,
      title: "Credibility Database",
      desc: "A citizen-powered database of credible Nigerians from all 774 LGAs. Nominate, endorse, and discover people who deserve recognition.",
      href: "/nominees",
      cta: "Browse Nominees",
    },
    {
      icon: Video,
      title: "Civic Lens",
      desc: "A citizen journalism platform where Nigerians document civic issues — broken infrastructure, election coverage, community victories — through video.",
      href: "/videos",
      cta: "Watch Videos",
    },
    {
      icon: Users,
      title: "LGA & Topic Groups",
      desc: "Every LGA has its own discussion group. Create topic-based groups for national conversations. Discuss, debate, and hold leaders accountable.",
      href: "/groups",
      cta: "Join Groups",
    },
    {
      icon: PenLine,
      title: "Community Blog",
      desc: "Share civic perspectives, opinion pieces, and community stories with Nigerians across all 774 LGAs. Reviewed for quality before publishing.",
      href: "/blog",
      cta: "Read Blog",
    },
    {
      icon: ShieldCheck,
      title: "Moderation & Trust",
      desc: "Community-driven flagging system with trained moderators. Content that is misleading, hateful, or off-topic is reviewed and removed.",
      href: "/about",
      cta: "Learn More",
    },
    {
      icon: BarChart3,
      title: "Civic Data & Insights",
      desc: "Track nominations by state, field, and LGA. See which communities are most engaged and which areas need more representation.",
      href: "/nominees",
      cta: "Explore Data",
    },
  ];

  return (
    <StaticPage title="Services" subtitle="Tools for civic engagement, accountability, and leadership discovery.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {services.map(({ icon: Icon, title, desc, href, cta }) => (
          <div key={title} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
              <Icon size={24} className="text-civic-green" />
            </div>
            <h3 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">{desc}</p>
            <A
              href={href}
              className="text-civic-green font-bold text-sm hover:text-civic-green-dark transition-colors"
            >
              {cta} →
            </A>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
