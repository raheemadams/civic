import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const tables = [
    "profiles", "nominees", "endorsements", "videos",
    "video_comments", "topic_groups", "group_memberships", "group_posts",
  ];

  const results: Record<string, unknown> = {};

  for (const table of tables) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error, count } = await (supabase as any)
      .from(table)
      .select("*", { count: "exact" })
      .limit(2);

    results[table] = { count, rows: data?.length ?? 0, sample: data, error: error?.message };
  }

  return Response.json(results);
}
