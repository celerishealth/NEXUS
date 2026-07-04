import { NextResponse } from "next/server";
import { nexusReadOnlyPilotOnboardingContract } from "@/lib/nexus/nexusReadOnlyPilotOnboardingContract";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "read-only-pilot-onboarding-contract-preview-only",
    day: 109,
    phase: "Trust + Pilot Readiness",
    contract: nexusReadOnlyPilotOnboardingContract,
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
