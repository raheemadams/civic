import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import A from "@/components/ui/A";
import UserMenu from "./UserMenu";

interface AppHeaderProps {
  /** Title shown in the centre-left of the header */
  title: string;
  /** If provided, renders a ← back link before the title */
  backHref?: string;
  backLabel?: string;
}

export default async function AppHeader({ title, backHref, backLabel = "Back" }: AppHeaderProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, state, lga, role, avatar_url")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name ?? user.email ?? "Member";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="bg-civic-green-dark text-white px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {backHref && (
          <>
            <A
              href={backHref}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors shrink-0"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">{backLabel}</span>
            </A>
            <span className="text-white/30">|</span>
          </>
        )}
        <span className="font-display font-bold uppercase tracking-widest text-sm truncate">
          {title}
        </span>
      </div>

      <UserMenu
        displayName={displayName}
        initials={initials}
        state={profile?.state ?? ""}
        lga={profile?.lga ?? ""}
        role={profile?.role ?? "user"}
        avatarUrl={profile?.avatar_url}
      />
    </header>
  );
}
