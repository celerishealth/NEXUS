import { NextResponse } from "next/server";
import { nexusPilotTrustEvidenceContract } from "@/lib/nexus/nexusPilotTrustEvidenceContract";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "pilot-trust-evidence-contract-preview-only",
    day: 106,
    phase: "Trust + Pilot Readiness",
    contract: nexusPilotTrustEvidenceContract,
    safety: {
      readOnly: true,
      previewOnly: true,
      realPilotBlocked: true,
      realExecutionBlocked: true,
      writesBlocked: true,
      realCustomerDataBlocked: true,
      realDbMemoryBlocked: true,
      auditPersistenceBlocked: true,
      recoveryExecutionBlocked: true,
      approveRejectExecutionBlocked: true,
      paymentExecutionBlocked: true,
      messageSendingBlocked: true,
      aiModelCallsBlocked: true,
      thirdPartyMutationBlocked: true,
    },
  });
}
