import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { Handshake, Building2, GraduationCap, Megaphone } from "lucide-react";

export default function PartnersPage() {
  const partnerTypes = [
    {
      icon: Building2,
      title: "Civil Society & NGOs",
      desc: "Organizations working on governance, transparency, and civic engagement. Integrate our data, co-host events, or amplify our reach.",
    },
    {
      icon: Megaphone,
      title: "Media Organizations",
      desc: "Use our credibility data in your reporting. Reference verified nominees. Partner on civic journalism initiatives through Civic Lens.",
    },
    {
      icon: GraduationCap,
      title: "Academic Institutions",
      desc: "Collaborate on research into civic engagement, political accountability, and community-driven governance in Nigeria.",
    },
    {
      icon: Handshake,
      title: "Corporate Partners",
      desc: "Support civic infrastructure through CSR programs. Sponsor LGA coverage, digital literacy, and grassroots engagement.",
    },
  ];

  return (
    <StaticPage title="Partner With Us" subtitle="Help build Nigeria's civic infrastructure. We're stronger together.">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">Why Partner?</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Project 774 is an open civic platform. We believe the credibility database should be a public good —
          accessible to media, political parties, researchers, and citizens alike. Partnerships help us
          reach more LGAs, verify more nominees, and build tools that make accountability easier.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {partnerTypes.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4">
              <Icon size={24} className="text-civic-green" />
            </div>
            <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <A
          href="/contact"
          className="inline-block bg-civic-green text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-civic-green-mid transition-colors"
        >
          Get in Touch →
        </A>
      </div>
    </StaticPage>
  );
}
