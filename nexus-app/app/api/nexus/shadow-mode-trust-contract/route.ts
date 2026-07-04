import { NextResponse } from "next/server";
import { nexusShadowModeTrustContract } from "@/lib/nexus/nexusShadowModeTrustContract";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "shadow-mode-trust-contract-preview-only",
    day: 101,
    phase: "Trust + Pilot Readiness",
    contract: nexusShadowModeTrustContract,
    safety: {
      readOnly: true,
      previewOnly: true,
      executionBlocked: true,
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
