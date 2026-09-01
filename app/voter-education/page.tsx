import StaticPage from "@/components/layout/StaticPage";
import { CheckCircle } from "lucide-react";

export default function VoterEducationPage() {
  const sections = [
    {
      title: "Who Can Vote?",
      items: [
        "You must be a Nigerian citizen aged 18 or older.",
        "You must have a valid Permanent Voter's Card (PVC).",
        "You must be registered at a polling unit in the LGA where you reside.",
        "Your name must appear on the voter register at your polling unit.",
      ],
    },
    {
      title: "How to Register",
      items: [
        "Visit the INEC website or your nearest INEC office to begin registration.",
        "Provide your biometric data (fingerprints, photograph) at the registration center.",
        "Collect your Permanent Voter's Card (PVC) when it's ready — INEC will announce collection dates.",
        "Verify your polling unit online at voters.inecnigeria.org before election day.",
      ],
    },
    {
      title: "On Election Day",
      items: [
        "Arrive at your polling unit early — voting starts at 8:30 AM.",
        "Bring your PVC and a valid photo ID.",
        "Your fingerprint will be verified using the Bimodal Voter Accreditation System (BVAS).",
        "Vote in secret — no one should see your ballot.",
        "Wait for results to be announced and uploaded at your polling unit.",
      ],
    },
    {
      title: "Your Rights as a Voter",
      items: [
        "You have the right to vote without intimidation or coercion.",
        "You have the right to a secret ballot — no one can force you to reveal your vote.",
        "You have the right to observe the counting and announcement of results at your polling unit.",
        "You can report electoral violations to INEC, security agencies, or election monitoring organizations.",
        "Vote buying and selling is a criminal offense — don't participate.",
      ],
    },
  ];

  return (
    <StaticPage title="Voter Education" subtitle="Know your rights. Know the process. Make your vote count.">
      <div className="space-y-6">
        {sections.map(({ title, items }) => (
          <div key={title} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-4">{title}</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-civic-green shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
