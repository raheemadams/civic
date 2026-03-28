import Image from "next/image";
import { MapPin } from "lucide-react";
import { Nominee } from "@/types";

const fieldColors: Record<string, { bg: string; text: string }> = {
  Economics:                    { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Agriculture & Finance":      { bg: "bg-lime-100",    text: "text-lime-700" },
  "International Development":  { bg: "bg-teal-100",    text: "text-teal-700" },
  "Governance & Anti-Corruption": { bg: "bg-violet-100", text: "text-violet-700" },
  "Healthcare Innovation":      { bg: "bg-rose-100",    text: "text-rose-700" },
  "Technology & Infrastructure": { bg: "bg-cyan-100",   text: "text-cyan-700" },
  Medicine:                     { bg: "bg-red-100",     text: "text-red-700" },
  Technology:                   { bg: "bg-blue-100",    text: "text-blue-700" },
  "Anti-Corruption & Law":      { bg: "bg-purple-100",  text: "text-purple-700" },
  "Literature & Activism":      { bg: "bg-indigo-100",  text: "text-indigo-700" },
  "Sports & Philanthropy":      { bg: "bg-sky-100",     text: "text-sky-700" },
  "Business & Philanthropy":    { bg: "bg-orange-100",  text: "text-orange-700" },
};

interface NomineeCardProps {
  nominee: Nominee;
}

export default function NomineeCard({ nominee }: NomineeCardProps) {
  const color = fieldColors[nominee.field] ?? { bg: "bg-gray-100", text: "text-gray-600" };

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Photo */}
      <div className="relative aspect-square">
        <Image
          src={nominee.imageUrl}
          alt={nominee.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          unoptimized
        />
        {/* LGA chip overlaid on photo */}
        <div className="absolute bottom-2 left-2 right-2">
          <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            <MapPin size={9} />
            {nominee.lga} LGA · {nominee.state}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-bold text-gray-900 text-sm leading-tight">{nominee.name}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{nominee.achievement}</p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
            {nominee.field}
          </span>
          <span className="text-[10px] text-civic-green font-semibold uppercase tracking-wide">
            Nominated ✓
          </span>
        </div>
      </div>
    </div>
  );
}
