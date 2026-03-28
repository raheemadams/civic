import { footerColumns, socialLinks } from "@/data/footerLinks";
import SocialIcon from "@/components/ui/SocialIcon";
import A from "@/components/ui/A";

export default function Footer() {
  return (
    <footer className="bg-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto border-2 border-civic-green-dark rounded-3xl px-8 py-10 shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-100">
          {/* Brand column */}
          <div>
            <p className="font-display font-bold uppercase tracking-widest text-sm text-civic-green-dark mb-3">
              Project 774
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Every local government. Every talent. One database.
              Building the Nigeria our generation deserves — one LGA at a time.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <A
                  key={link.platform}
                  href={link.href}
                  aria-label={link.platform}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-civic-green-light text-civic-green hover:bg-civic-green hover:text-white transition-all duration-200"
                >
                  <SocialIcon link={link} />
                </A>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-bold uppercase tracking-widest text-xs text-civic-green-dark mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <A
                      href={link.href}
                      className="text-gray-500 hover:text-civic-green text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </A>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Project 774. All rights reserved.</p>
          <p>Built by Nigerians, for Nigeria.</p>
        </div>

      </div>
    </footer>
  );
}
