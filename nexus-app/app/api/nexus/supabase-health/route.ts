import { NextResponse } from "next/server";
import { validateSupabaseEnvironmentPresence } from "@/lib/nexus/supabaseEnvironmentPresenceValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = validateSupabaseEnvironmentPresence();

  return NextResponse.json(result, {
    status: result.readyForBaseClient ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
