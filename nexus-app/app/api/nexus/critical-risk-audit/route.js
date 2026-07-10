import { NextResponse } from "next/server";

import {
  runCriticalRiskAudit,
} from "../../../../lib/nexus/criticalRiskBurnDown.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const report = runCriticalRiskAudit({
    repositoryRoot: process.cwd(),
  });

  return NextResponse.json(report, {
    status: report.developmentGatePassed
      ? 200
      : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
