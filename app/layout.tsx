import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Project 774",
  description:
    "Nigeria's credibility database — nominating the best people from all 774 local governments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/*
          Strip attributes injected by browser extensions (e.g. Retriever's
          rtrvr-ls / rtrvr-ro) before React hydrates the DOM.
          beforeInteractive ensures this runs before any React code.
        */}
        <Script
          id="strip-extension-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var p='rtrvr-';new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes'&&m.attributeName&&m.attributeName.startsWith(p))m.target.removeAttribute(m.attributeName);});}).observe(document.documentElement,{attributes:true,subtree:true});})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
