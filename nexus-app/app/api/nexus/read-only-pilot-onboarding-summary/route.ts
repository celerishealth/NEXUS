import { NextResponse } from "next/server";
import { nexusReadOnlyPilotOnboardingSummary } from "@/lib/nexus/nexusReadOnlyPilotOnboardingSummary";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "read-only-pilot-onboarding-summary-preview-only",
    day: 111,
    phase: "Trust + Pilot Readiness",
    summary: nexusReadOnlyPilotOnboardingSummary,
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
