import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return Response.json({ status: "error", message: error.message }, { status: 500 });
    }

    return Response.json({
      status: "connected",
      message: "Supabase connection successful",
      session: data.session ? "active session" : "no session (expected)",
    });
  } catch (err) {
    return Response.json({ status: "error", message: String(err) }, { status: 500 });
  }
}
