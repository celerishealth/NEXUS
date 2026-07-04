import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchReadinessCompletionValidator } from "@/lib/nexus/controlledPaidPilotLaunchReadinessCompletionValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "controlled-paid-pilot-launch-readiness-completion-validator-preview-only",
    completionValidator: getControlledPaidPilotLaunchReadinessCompletionValidator(),
    safety: {
      readOnly: true,
      previewOnly: true,
      executesApprovalDecision: false,
      executesPayment: false,
      createsInvoice: false,
      activatesSubscription: false,
      writesEntitlement: false,
      sendsMessage: false,
      writesCustomerData: false,
      readsRealDatabaseMemory: false,
      writesRealDatabaseMemory: false,
      persistsAuditEvent: false,
      executesRecovery: false,
      mutatesThirdPartySystem: false,
      callsAiModel: false,
    },
  });
}
