import { UserPlus, MapPin, Info, Landmark, LucideIcon } from "lucide-react";
import { QuickLink } from "@/types";
import A from "@/components/ui/A";

const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  MapPin,
  Info,
  Landmark,
};

interface QuickLinkItemProps {
  link: QuickLink;
}

export default function QuickLinkItem({ link }: QuickLinkItemProps) {
  const Icon = iconMap[link.icon];

  return (
    <li>
      <A
        href={link.href}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white hover:text-civic-lime transition-all duration-200 group"
      >
        {Icon && (
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-civic-lime/20 transition-colors shrink-0">
            <Icon size={16} />
          </span>
        )}
        <span className="text-sm font-semibold">{link.label}</span>
        <span className="ml-auto text-white/40 group-hover:text-civic-lime text-sm">→</span>
      </A>
    </li>
  );
}
