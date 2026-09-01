import StaticPage from "@/components/layout/StaticPage";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const channels = [
    {
      icon: Mail,
      title: "Email",
      desc: "For general inquiries, partnerships, and press.",
      detail: "hello@project774.ng",
    },
    {
      icon: MessageCircle,
      title: "Social Media",
      desc: "Follow us and send a DM on any platform.",
      detail: "@project774ng",
    },
    {
      icon: MapPin,
      title: "Location",
      desc: "We're a remote-first team, built across Nigeria.",
      detail: "Lagos • Abuja • Nationwide",
    },
  ];

  return (
    <StaticPage title="Contact" subtitle="Got a question, suggestion, or partnership idea? We'd love to hear from you.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {channels.map(({ icon: Icon, title, desc, detail }) => (
          <div key={title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-civic-green-light flex items-center justify-center mx-auto mb-4">
              <Icon size={24} className="text-civic-green" />
            </div>
            <h3 className="font-display font-bold uppercase text-civic-green-dark text-base mb-1">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-2">{desc}</p>
            <p className="text-civic-green font-semibold text-sm">{detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-xl mb-5">Send a Message</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Your Name</label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Subject</label>
            <input
              type="text"
              placeholder="What's this about?"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Message</label>
            <textarea
              rows={5}
              placeholder="Tell us what's on your mind…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green focus:border-transparent resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors"
          >
            Send Message →
          </button>
        </form>
      </div>
    </StaticPage>
  );
}
