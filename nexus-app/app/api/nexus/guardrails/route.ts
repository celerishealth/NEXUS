import { NextResponse } from "next/server";
import {
  evaluateGuardrailIntent,
  guardrailRegistry,
} from "../../../../lib/nexus/guardrailRegistry";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "NEXUS Guardrail Registry",
    version: "v1",
    generatedAt: new Date().toISOString(),
    registry: guardrailRegistry,
    sampleEvaluation: evaluateGuardrailIntent("read current safety contract"),
  });
}
