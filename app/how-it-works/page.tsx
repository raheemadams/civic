import StaticPage from "@/components/layout/StaticPage";
import A from "@/components/ui/A";
import { UserPlus, CheckCircle, TrendingUp, Users, Star, ShieldCheck } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Nominate",
      desc: "Know someone credible in your LGA? Nominate them. Add their name, photo, field of expertise, and a write-up on why they deserve recognition. Your nomination goes to our review queue.",
    },
    {
      step: "02",
      icon: CheckCircle,
      title: "Review",
      desc: "Our moderators review every nomination for accuracy and relevance. We verify that the person is real, the information is factual, and the nomination meets our community standards.",
    },
    {
      step: "03",
      icon: TrendingUp,
      title: "Endorse",
      desc: "Once approved, the nominee appears in the public database. Any registered user can endorse them — one endorsement per user per nominee. Endorsements signal community trust.",
    },
    {
      step: "04",
      icon: Star,
      title: "Featured",
      desc: "Nominees who reach a threshold of endorsements earn the Featured badge. This is the highest signal of community trust — a public stamp that says 'this person is credible.'",
    },
    {
      step: "05",
      icon: Users,
      title: "Discuss",
      desc: "Join your LGA group to discuss nominees, civic issues, and hold leaders accountable. Create topic groups for national conversations. Flag content that violates community standards.",
    },
    {
      step: "06",
      icon: ShieldCheck,
      title: "Impact",
      desc: "As the database grows, it becomes a public resource. Political parties, media, and organizations can draw from a verified pool of credible Nigerians — no more excuses for bad candidates.",
    },
  ];

  return (
    <StaticPage title="How It Works" subtitle="From nomination to national impact — in six steps.">
      <div className="space-y-4">
        {steps.map(({ step, icon: Icon, title, desc }) => (
          <div key={step} className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-5">
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-civic-green flex items-center justify-center">
                <Icon size={22} className="text-white" />
              </div>
              <p className="text-center text-xs font-bold text-civic-green mt-1.5">{step}</p>
            </div>
            <div>
              <h3 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-1">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <A
          href="/nominate"
          className="inline-block bg-civic-green text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-civic-green-mid transition-colors"
        >
          Start Nominating →
        </A>
      </div>
    </StaticPage>
  );
}
