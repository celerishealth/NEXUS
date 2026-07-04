import { NextResponse } from "next/server";
import { nexusReadOnlyPilotOnboardingValidation } from "@/lib/nexus/nexusReadOnlyPilotOnboardingValidator";

export async function GET() {
  return NextResponse.json({
    ok: nexusReadOnlyPilotOnboardingValidation.valid,
    route: "read-only-pilot-onboarding-validator-preview-only",
    day: 110,
    phase: "Trust + Pilot Readiness",
    validation: nexusReadOnlyPilotOnboardingValidation,
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
