import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { BookOpen, Scale, PieChart, Map, Vote, FileText } from "lucide-react";

export default function ResourcesPage() {
  const resources = [
    {
      icon: Vote,
      title: "Voter Education",
      desc: "Know your rights as a voter. Learn about the electoral process, how to register, and how to verify your polling unit.",
      href: "/voter-education",
    },
    {
      icon: Scale,
      title: "Civic Rights Guide",
      desc: "A practical guide to your constitutional rights as a Nigerian citizen — freedom of assembly, right to vote, and more.",
      href: "/civic-rights",
    },
    {
      icon: PieChart,
      title: "Budget Tracker",
      desc: "Track how public funds are allocated and spent at federal, state, and local government levels.",
      href: "/budget-tracker",
    },
    {
      icon: Map,
      title: "Constituency Map",
      desc: "Interactive map showing all 774 LGAs, their representatives, and nomination activity in each area.",
      href: "/constituency-map",
    },
    {
      icon: BookOpen,
      title: "Community Blog",
      desc: "Civic perspectives, opinion pieces, and community stories written by Nigerians from all 774 LGAs.",
      href: "/blog",
    },
    {
      icon: FileText,
      title: "Transparency Report",
      desc: "How we moderate, our data practices, and platform statistics — fully transparent.",
      href: "/transparency",
    },
  ];

  return (
    <StaticPage title="Resources" subtitle="Tools, guides, and information to empower civic participation across Nigeria.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {resources.map(({ icon: Icon, title, desc, href }) => (
          <A
            key={title}
            href={href}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow block group"
          >
            <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mb-4 group-hover:bg-civic-green group-hover:text-white transition-colors">
              <Icon size={24} className="text-civic-green group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
          </A>
        ))}
      </div>
    </StaticPage>
  );
}
