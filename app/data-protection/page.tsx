import StaticPage from "@/components/layout/StaticPage";
import { Shield, Lock, Database, Eye } from "lucide-react";

export default function DataProtectionPage() {
  const measures = [
    {
      icon: Lock,
      title: "Encryption",
      desc: "All data is encrypted at rest and in transit using industry-standard TLS and AES-256 encryption.",
    },
    {
      icon: Shield,
      title: "Row-Level Security",
      desc: "Database-level policies ensure users can only read and modify data they're authorized to access.",
    },
    {
      icon: Database,
      title: "Secure Infrastructure",
      desc: "We use Supabase (built on PostgreSQL) with automatic backups, monitoring, and SOC 2 compliance.",
    },
    {
      icon: Eye,
      title: "Minimal Data Collection",
      desc: "We collect only what's needed to run the platform. No tracking pixels, no ad networks, no third-party analytics.",
    },
  ];

  return (
    <StaticPage title="Data Protection" subtitle="How we safeguard your information in compliance with the Nigeria Data Protection Act (NDPA).">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">Our Commitment</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Project 774 is committed to protecting the personal data of all users in accordance with the
          Nigeria Data Protection Act (NDPA) 2023 and the Nigeria Data Protection Regulation (NDPR).
          We process personal data lawfully, fairly, and transparently.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          We recognize that data protection is fundamental to trust — and trust is the foundation of our platform.
          Citizens who nominate, endorse, and discuss on Project 774 must know their data is handled responsibly.
        </p>
      </div>

      <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-5 text-center">Security Measures</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {measures.map(({ icon: Icon, title, desc }) => (
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

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">Your Data Rights</h2>
        <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed space-y-2">
          <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Right to Rectification:</strong> Update or correct your personal information via your profile.</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your account and associated data.</li>
          <li><strong>Right to Object:</strong> Object to specific uses of your data.</li>
          <li><strong>Right to Data Portability:</strong> Request your data in a machine-readable format.</li>
        </ul>
        <p className="text-gray-600 text-sm leading-relaxed mt-4">
          To exercise any of these rights, contact our Data Protection Officer at{" "}
          <span className="text-civic-green font-semibold">dpo@project774.ng</span>.
        </p>
      </div>
    </StaticPage>
  );
}
