import { NextResponse } from "next/server";
import { validateSupabaseIntegrationReadiness } from "@/lib/nexus/supabaseIntegrationReadiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = validateSupabaseIntegrationReadiness();

  return NextResponse.json(result, {
    status: result.ready ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
