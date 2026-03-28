export interface NavLink {
  label: string;
  href: string;
}

export interface Nominee {
  id: string;
  name: string;
  achievement: string;
  field: string;
  state: string;
  lga: string;
  imageUrl: string;
}

export interface QuickLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}
