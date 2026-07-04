import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchArchitecturePlanningContinuityReview } from "@/lib/nexus/controlledPaidPilotLaunchArchitecturePlanningContinuityReview";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "controlled-paid-pilot-launch-architecture-planning-continuity-review-preview-only",
    review: getControlledPaidPilotLaunchArchitecturePlanningContinuityReview(),
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
