import StaticPage from "@/components/layout/StaticPage";
import { Newspaper, Mail } from "lucide-react";

export default function PressPage() {
  return (
    <StaticPage title="Press & Media" subtitle="Media resources, press inquiries, and the story behind Project 774.">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-3">About Project 774</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Project 774 is Nigeria&apos;s citizen-powered credibility database. We surface credible, capable Nigerians from
          all 774 local government areas through community nominations, endorsements, and civic journalism.
          Our goal: ensure political parties have no excuse to field bad candidates.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          The platform was built to solve a fundamental problem — Nigeria has world-class talent, but the systems
          that select leaders don&apos;t have access to it. Project 774 bridges that gap.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mx-auto mb-4">
            <Newspaper size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">Press Kit</h3>
          <p className="text-gray-500 text-xs leading-relaxed mb-3">
            Logos, brand guidelines, and approved descriptions for media use. Coming soon.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-civic-green" />
          </div>
          <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-2">Press Inquiries</h3>
          <p className="text-gray-500 text-xs leading-relaxed mb-3">
            For interviews, features, and media partnerships, reach out to us.
          </p>
          <p className="text-civic-green font-semibold text-sm">press@project774.ng</p>
        </div>
      </div>
    </StaticPage>
  );
}
