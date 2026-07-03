import { NextResponse } from "next/server";
import {
  classifyBusinessRisk,
  riskClassifier,
} from "../../../../lib/nexus/riskClassifier";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "NEXUS Risk Classifier",
    version: "v1",
    generatedAt: new Date().toISOString(),
    classifier: riskClassifier,
    sampleEvaluation: classifyBusinessRisk("Customer asks for urgent delivery and refund."),
  });
}
