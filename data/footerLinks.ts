import { FooterColumn, SocialLink } from "@/types";

export const footerColumns: FooterColumn[] = [
  {
    heading: "Resources",
    links: [
      { label: "Voter Education", href: "/voter-education" },
      { label: "Civic Rights Guide", href: "/civic-rights" },
      { label: "Budget Tracker", href: "/budget-tracker" },
      { label: "Constituency Map", href: "/constituency-map" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Press & Media", href: "/press" },
      { label: "Partner With Us", href: "/partners" },
      { label: "Volunteer", href: "/volunteer" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Data Protection", href: "/data-protection" },
      { label: "Transparency Report", href: "/transparency" },
    ],
  },
];

export const socialLinks: SocialLink[] = [
  { platform: "X (Twitter)", href: "#", icon: "X" },
  { platform: "Facebook", href: "#", icon: "Globe" },
  { platform: "Instagram", href: "#", icon: "Camera" },
  { platform: "YouTube", href: "#", icon: "PlayCircle" },
];
