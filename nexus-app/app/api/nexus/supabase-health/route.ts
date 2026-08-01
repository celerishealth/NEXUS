import { NextResponse } from "next/server";
import { validateSupabaseEnvironmentPresence } from "@/lib/nexus/supabaseEnvironmentPresenceValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const result =
    validateSupabaseEnvironmentPresence();

  return NextResponse.json(
    {
      status: result.status,
      readyForBaseClient:
        result.readyForBaseClient,
      secretValuesExposed:
        result.secretValuesExposed,
      databaseConnectionAttempted:
        result.databaseConnectionAttempted,
      lockedBoundaries:
        result.lockedBoundaries,
    },
    {
      status:
        result.readyForBaseClient ? 200 : 503,
      headers: {
        "Cache-Control":
          "no-store, max-age=0",
      },
    },
  );
}