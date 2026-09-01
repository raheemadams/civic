import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { Users, ShieldCheck, MapPin, Megaphone, Code, BookOpen } from "lucide-react";

export default function VolunteerPage() {
  const roles = [
    {
      icon: ShieldCheck,
      title: "Content Moderator",
      desc: "Review nominations, videos, and blog posts. Flag inappropriate content. Help maintain community standards.",
    },
    {
      icon: MapPin,
      title: "LGA Ambassador",
      desc: "Represent your LGA on the platform. Drive nominations, encourage participation, and report civic issues in your area.",
    },
    {
      icon: Megaphone,
      title: "Community Outreach",
      desc: "Spread the word about Project 774 in your community. Organize town halls, share on social media, and onboard new users.",
    },
    {
      icon: BookOpen,
      title: "Content Creator",
      desc: "Write blog posts, create educational content, and produce civic awareness materials for the platform.",
    },
    {
      icon: Code,
      title: "Tech Volunteer",
      desc: "Help improve the platform. We're open-source friendly — designers, developers, and data analysts are welcome.",
    },
    {
      icon: Users,
      title: "Event Coordinator",
      desc: "Organize virtual or in-person civic events — debates, town halls, and community discussions.",
    },
  ];

  return (
    <StaticPage title="Volunteer" subtitle="Civic infrastructure is built by citizens. Here's how you can help.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {roles.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-civic-green-light flex items-center justify-center shrink-0">
              <Icon size={20} className="text-civic-green" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-3xl p-6 sm:p-8 text-center"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}
      >
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-2">Ready to Volunteer?</h2>
        <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto mb-5">
          Start by creating an account. Once you&apos;re registered, reach out through the contact page
          and let us know how you&apos;d like to contribute.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <A
            href="/register"
            className="inline-block bg-civic-green text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-civic-green-mid transition-colors"
          >
            Create an Account →
          </A>
          <A
            href="/contact"
            className="inline-block border-2 border-civic-green text-civic-green font-bold text-sm px-6 py-3 rounded-full hover:bg-civic-green-light transition-colors"
          >
            Contact Us
          </A>
        </div>
      </div>
    </StaticPage>
  );
}
