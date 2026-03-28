"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "@/app/(auth)/actions";
import {
  LogOut, MapPin, ChevronDown, UserCog,
  Shield, ClipboardList, Video, Flag, Users,
} from "lucide-react";
import A from "@/components/ui/A";

interface UserMenuProps {
  displayName: string;
  initials: string;
  state: string;
  lga: string;
  role: string;
  avatarUrl?: string | null;
}

const ADMIN_LINKS = [
  { label: "Nominations", tab: "Nominations", icon: ClipboardList },
  { label: "Videos",      tab: "Videos",      icon: Video },
  { label: "Flagged Posts", tab: "Flagged Posts", icon: Flag },
  { label: "Users",       tab: "Users",        icon: Users },
];

const roleBadgeColor: Record<string, string> = {
  moderator:   "bg-blue-100 text-blue-700",
  admin:       "bg-purple-100 text-purple-700",
  super_admin: "bg-civic-green-light text-civic-green-dark",
};

export default function UserMenu({
  displayName, initials, state, lga, role, avatarUrl,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const isAdmin = ["admin", "super_admin", "moderator"].includes(role);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        suppressHydrationWarning
        className="flex items-center gap-2 group focus:outline-none"
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-civic-lime flex items-center justify-center shrink-0 ring-2 ring-white/20 group-hover:ring-white/60 transition-all">
          {avatarUrl
            ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            : <span className="text-black text-xs font-bold leading-none">{initials}</span>}
        </div>
        <span className="hidden sm:block text-white/80 text-sm font-medium group-hover:text-white transition-colors max-w-[120px] truncate">
          {displayName.split(" ")[0]}
        </span>
        <ChevronDown
          size={14}
          className={`text-white/50 group-hover:text-white/80 transition-all duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">

          {/* Identity */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-civic-gray/40 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-civic-lime flex items-center justify-center shrink-0">
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                : <span className="text-black text-sm font-bold leading-none">{initials}</span>}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{displayName}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                <MapPin size={10} className="shrink-0" />{lga}, {state}
              </p>
              {isAdmin && (
                <span className={`mt-1 inline-block text-xs font-bold px-2 py-0.5 rounded-full ${roleBadgeColor[role] ?? "bg-gray-100 text-gray-600"}`}>
                  {role.replace("_", " ")}
                </span>
              )}
            </div>
          </div>

          {/* Account */}
          <div className="py-1.5 border-b border-gray-100">
            <A
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <UserCog size={15} className="text-gray-400" />
              Edit Profile
            </A>
          </div>

          {/* Admin control panel */}
          {isAdmin && (
            <div className="py-1.5 border-b border-gray-100">
              <p className="flex items-center gap-1.5 px-4 pt-1 pb-1.5 text-xs font-bold text-civic-green-dark uppercase tracking-widest">
                <Shield size={11} />
                Administration
              </p>
              {ADMIN_LINKS.map(({ label, tab, icon: Icon }) => (
                <A
                  key={tab}
                  href={`/admin?tab=${encodeURIComponent(tab)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-civic-green-light hover:text-civic-green-dark transition-colors"
                >
                  <Icon size={14} className="text-gray-400 shrink-0" />
                  {label}
                </A>
              ))}
            </div>
          )}

          {/* Sign out */}
          <div className="py-1.5">
            <form action={signOut}>
              <button
                type="submit"
                suppressHydrationWarning
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
