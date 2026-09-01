import StaticPage from "@/components/layout/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Use" subtitle="The rules of engagement for Project 774.">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <p className="text-gray-500 text-xs">Last updated: September 2026</p>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">1. Acceptance</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            By using Project 774, you agree to these Terms of Use. If you do not agree, do not use the platform.
            We may update these terms at any time — continued use constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">2. Eligibility</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            You must be at least 18 years old and a Nigerian citizen or resident to register.
            You are responsible for keeping your account credentials secure.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">3. User Content</h2>
          <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed space-y-1">
            <li>You are responsible for the content you submit (nominations, videos, blog posts, comments).</li>
            <li>Content must be truthful, relevant to civic life in Nigeria, and free of hate speech.</li>
            <li>You must not submit false nominations or fabricated information about any person.</li>
            <li>By submitting content, you grant Project 774 a non-exclusive license to display it on the platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">4. Moderation</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            All nominations, videos, and blog posts are reviewed before publishing. Content that is misleading,
            hateful, violent, or unrelated to civic life will be rejected. Posts in groups can be flagged by the community —
            content that receives 3 or more flags is automatically suspended pending review.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">5. Prohibited Conduct</h2>
          <ul className="list-disc pl-5 text-gray-600 text-sm leading-relaxed space-y-1">
            <li>Impersonating another person or submitting false information.</li>
            <li>Harassment, hate speech, or threats against any user.</li>
            <li>Spam, commercial solicitation, or off-topic content.</li>
            <li>Attempting to manipulate endorsement counts or nomination rankings.</li>
            <li>Unauthorized access to other users&apos; accounts or platform infrastructure.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">6. Enforcement</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Violations may result in content removal, temporary suspension, or permanent account termination
            at the discretion of our moderation team. Repeated violations will result in escalated consequences.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">7. Limitation of Liability</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Project 774 provides a platform for civic engagement. We do not verify the character, qualifications,
            or suitability of nominees beyond community endorsements. Users should exercise their own judgment.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg mb-2">8. Contact</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Questions about these terms? Contact us at <span className="text-civic-green font-semibold">legal@project774.ng</span>.
          </p>
        </section>
      </div>
    </StaticPage>
  );
}
