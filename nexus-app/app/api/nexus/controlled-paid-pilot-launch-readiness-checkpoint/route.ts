import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchReadinessCheckpoint } from "@/lib/nexus/controlledPaidPilotLaunchReadinessCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "controlled-paid-pilot-launch-readiness-checkpoint-preview-only",
    checkpoint: getControlledPaidPilotLaunchReadinessCheckpoint(),
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
