import { NextResponse } from "next/server";
import {
  getNexusDay314CinematicDemoOwnerReviewGate,
  validateNexusDay314CinematicDemoOwnerReviewGate
} from "@/lib/nexus/day314CinematicDemoOwnerReviewGate";

export const dynamic = "force-static";

export async function GET() {
  const gate = getNexusDay314CinematicDemoOwnerReviewGate();
  const validation = validateNexusDay314CinematicDemoOwnerReviewGate();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-314-cinematic-demo-owner-review-gate-preview-only",
    screen: gate.routePath,
    safety: {
      readOnly: true,
      previewOnly: true,
      sampleDataOnly: true,
      launchAuthorization: false,
      pilotAuthorization: false,
      paidAccessAuthorization: false,
      subscriptionActivation: false,
      paymentExecution: false,
      invoiceCreation: false,
      entitlementWrites: false,
      customerDataWrites: false,
      realDbMemoryReadWrite: false,
      auditPersistence: false,
      approveRejectExecution: false,
      ownerOverrideExecution: false,
      recoveryRollbackExecution: false,
      messageSending: false,
      thirdPartyMutation: false,
      aiModelCalls: false,
      globalTradeOrderPlacement: false,
      shipmentBooking: false,
      customerCommitmentExecution: false,
      vendorCustomerMessageSending: false,
      gstExecution: false,
      ewayBillGeneration: false,
      governmentApiMutation: false,
      complianceFiling: false,
      illegalMatter: false,
      greyZoneExecution: false,
      complianceShortcut: false
    },
    validation,
    gate
  });
}