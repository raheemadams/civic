import { X, Globe, Camera, PlayCircle, LucideIcon } from "lucide-react";
import { SocialLink } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  X,
  Globe,
  Camera,
  PlayCircle,
};

interface SocialIconProps {
  link: SocialLink;
}

export default function SocialIcon({ link }: SocialIconProps) {
  const Icon = iconMap[link.icon];
  return Icon ? <Icon size={16} /> : null;
}
