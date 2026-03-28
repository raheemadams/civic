"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/navLinks";
import A from "@/components/ui/A";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-civic-green/95 backdrop-blur-sm">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        {/* Logo */}
        <A
          href="/"
          className="font-display font-bold text-white uppercase tracking-widest text-sm shrink-0"
        >
          Project 774
        </A>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <A
                href={link.href}
                className="text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium px-3 py-2 rounded-full transition-all duration-200"
              >
                {link.label}
              </A>
            </li>
          ))}
        </ul>

        {/* Sign In + hamburger */}
        <div className="flex items-center gap-3">
          <A
            href="/register"
            className="hidden lg:inline-block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Register
          </A>
          <A
            href="/login"
            className="hidden lg:inline-block bg-civic-lime text-black font-bold text-sm px-5 py-2 rounded-full hover:bg-civic-lime-hover transition-colors duration-200"
          >
            Sign In
          </A>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="lg:hidden text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            suppressHydrationWarning
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-civic-green-dark z-40 border-t border-white/10 rounded-b-3xl shadow-xl">
          <ul className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <A
                  href={link.href}
                  className="block py-3 px-4 text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium rounded-xl transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </A>
              </li>
            ))}
            <li className="pt-2 flex gap-3">
              <A
                href="/register"
                className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Register
              </A>
              <A
                href="/login"
                className="inline-block bg-civic-lime text-black font-bold text-sm px-5 py-2 rounded-full hover:bg-civic-lime-hover transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </A>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
