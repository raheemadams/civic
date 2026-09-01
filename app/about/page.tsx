import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { Target, Eye, Users, MapPin, Shield, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: Shield, title: "Transparency", desc: "Every nomination, every endorsement — all visible to the public. No back-room deals." },
    { icon: Users, title: "Community-Driven", desc: "Real Nigerians from all 774 LGAs decide who is credible. Not politicians, not parties." },
    { icon: TrendingUp, title: "Accountability", desc: "We track, document, and surface leaders — good and bad — so citizens can make informed decisions." },
    { icon: MapPin, title: "Grassroots First", desc: "Leadership starts at the local government level. If your LGA representative isn't credible, nothing else matters." },
  ];

  return (
    <StaticPage title="About Us" subtitle="Building Nigeria's most comprehensive credibility database — one LGA at a time.">
      <div className="space-y-10">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
              <Target size={24} className="text-civic-green" />
            </div>
            <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">Our Mission</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              To surface credible, capable Nigerians from every local government area so that political parties,
              organizations, and communities have a verified pool of talent to draw from. Nigeria has world-class
              people — our platform makes them visible.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
              <Eye size={24} className="text-civic-green" />
            </div>
            <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">Our Vision</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              A Nigeria where leadership is earned through track records, not connections.
              Where every LGA has a documented roster of its best people. Where political parties
              have no excuse to field bad candidates because the data is public, verified, and undeniable.
            </p>
          </div>
        </div>

        {/* The Problem */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">The Problem</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Nigeria doesn&apos;t have a talent problem — it has a visibility problem. Brilliant, honest, and capable
            people exist in every corner of this country. But they&apos;re invisible to the systems that select leaders.
            Political parties recycle the same names. Communities lack a way to vouch for their own.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Project 774 changes that. We&apos;re building a citizen-powered database where communities nominate and
            endorse the people they trust. When enough Nigerians participate, the database becomes impossible to ignore.
          </p>
        </div>

        {/* Values */}
        <div>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map(({ icon: Icon, title, desc }) => (
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
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <A
            href="/nominate"
            className="inline-block bg-civic-green text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-civic-green-mid transition-colors"
          >
            Nominate Someone →
          </A>
        </div>
      </div>
    </StaticPage>
  );
}
