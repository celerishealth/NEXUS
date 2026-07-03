import { NextResponse } from "next/server";
import {
  evaluateOwnerApprovalPolicy,
  ownerApprovalPolicy,
  type OwnerApprovalRiskLevel,
} from "../../../../lib/nexus/ownerApprovalPolicy";

export const dynamic = "force-dynamic";

export async function GET() {
  const sampleRiskLevel: OwnerApprovalRiskLevel = "high";

  return NextResponse.json({
    ok: true,
    service: "NEXUS Owner Approval Policy",
    version: "v1",
    generatedAt: new Date().toISOString(),
    policy: ownerApprovalPolicy,
    sampleEvaluation: evaluateOwnerApprovalPolicy(sampleRiskLevel),
  });
}
