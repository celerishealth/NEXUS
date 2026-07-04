import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchArchitecturePlanningSummary } from "@/lib/nexus/controlledPaidPilotLaunchArchitecturePlanningSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "controlled-paid-pilot-launch-architecture-planning-summary-preview-only",
    summary: getControlledPaidPilotLaunchArchitecturePlanningSummary(),
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
