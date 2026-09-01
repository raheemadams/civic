import StaticPage from "@/components/layout/StaticPage";

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" subtitle="How we collect, use, and protect your data.">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <p className="text-gray-500 text-xs">Last updated: September 2026</p>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">1. Information We Collect</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">When you register on Project 774, we collect:</p>
          <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed space-y-1">
            <li>Your full name, email address, state, and LGA (required at registration).</li>
            <li>Profile information you choose to add (avatar, bio).</li>
            <li>Content you submit (nominations, videos, blog posts, group posts, comments).</li>
            <li>Endorsements and flags you make on the platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">2. How We Use Your Data</h2>
          <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed space-y-1">
            <li>To operate the platform and provide our services.</li>
            <li>To display your nominations, endorsements, and posts to other users.</li>
            <li>To auto-join you to your LGA group based on your registration details.</li>
            <li>To enforce community standards through our moderation system.</li>
            <li>To communicate platform updates and announcements.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">3. Data Sharing</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We do not sell your personal data. Approved nominations and public content are visible to all users.
            We may share aggregated, anonymized data for research and reporting purposes.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">4. Data Storage & Security</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your data is stored securely using Supabase infrastructure with encryption at rest and in transit.
            We implement row-level security policies to ensure users can only access data they&apos;re authorized to see.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">5. Your Rights</h2>
          <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed space-y-1">
            <li>You can view and update your profile information at any time.</li>
            <li>You can delete your own comments and remove your endorsements.</li>
            <li>You can request deletion of your account by contacting us.</li>
            <li>You have the right to know what data we hold about you.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">6. Contact</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            For privacy-related inquiries, contact us at <span className="text-civic-green font-semibold">privacy@project774.ng</span>.
          </p>
        </section>
      </div>
    </StaticPage>
  );
}
