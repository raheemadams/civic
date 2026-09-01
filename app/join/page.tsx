import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { UserPlus, Video, Users, PenLine, Star, ShieldCheck } from "lucide-react";

export default function JoinPage() {
  const ways = [
    {
      icon: UserPlus,
      title: "Nominate",
      desc: "Know a credible Nigerian in your LGA? Add them to the database. It's free and takes under 2 minutes.",
      href: "/nominate",
      cta: "Nominate Someone →",
    },
    {
      icon: Star,
      title: "Endorse",
      desc: "Browse approved nominees and endorse the ones you trust. Your endorsement is your vote of confidence.",
      href: "/nominees",
      cta: "Browse Nominees →",
    },
    {
      icon: Video,
      title: "Document",
      desc: "Film civic issues in your community and submit them to Civic Lens. Broken roads, town halls, elections — all of it matters.",
      href: "/videos/submit",
      cta: "Submit a Video →",
    },
    {
      icon: PenLine,
      title: "Write",
      desc: "Share your civic perspective on the community blog. Opinion pieces, stories, analysis — your voice matters.",
      href: "/blog/write",
      cta: "Write a Post →",
    },
    {
      icon: Users,
      title: "Discuss",
      desc: "Join your LGA group and start conversations about the issues that matter to your community.",
      href: "/groups",
      cta: "Find Your Group →",
    },
    {
      icon: ShieldCheck,
      title: "Moderate",
      desc: "Flag content that violates community standards. Help keep the platform clean and trustworthy for everyone.",
      href: "/register",
      cta: "Create an Account →",
    },
  ];

  return (
    <StaticPage title="Join Us" subtitle="Nigeria has 774 LGAs. We need voices from every single one.">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">Why Join?</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Project 774 is only as strong as the Nigerians who use it. Every nomination, every endorsement,
          every video, and every blog post adds to the most comprehensive civic database the country has ever seen.
          You don&apos;t need money, connections, or a platform. You just need to register and participate.
        </p>
      </div>

      <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-5 text-center">Ways to Contribute</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {ways.map(({ icon: Icon, title, desc, href, cta }) => (
          <div key={title} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-civic-green-light flex items-center justify-center mb-3">
              <Icon size={20} className="text-civic-green" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed flex-1 mb-3">{desc}</p>
            <A href={href} className="text-civic-green font-bold text-xs hover:text-civic-green-dark transition-colors">
              {cta}
            </A>
          </div>
        ))}
      </div>

      <div className="text-center">
        <A
          href="/register"
          className="inline-block bg-civic-green text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-civic-green-mid transition-colors"
        >
          Create Your Account — It&apos;s Free →
        </A>
      </div>
    </StaticPage>
  );
}
