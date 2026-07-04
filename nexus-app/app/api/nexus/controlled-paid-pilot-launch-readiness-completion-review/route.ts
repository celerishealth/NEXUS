import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchReadinessCompletionReview } from "@/lib/nexus/controlledPaidPilotLaunchReadinessCompletionReview";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "controlled-paid-pilot-launch-readiness-completion-review-preview-only",
    completionReview: getControlledPaidPilotLaunchReadinessCompletionReview(),
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
