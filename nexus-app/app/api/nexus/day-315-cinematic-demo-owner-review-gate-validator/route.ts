import { NextResponse } from "next/server";
import {
  getNexusDay315CinematicDemoOwnerReviewGateValidator,
  validateNexusDay315CinematicDemoOwnerReviewGateValidator
} from "@/lib/nexus/day315CinematicDemoOwnerReviewGateValidator";

export const dynamic = "force-static";

export async function GET() {
  const validator = getNexusDay315CinematicDemoOwnerReviewGateValidator();
  const validation = validateNexusDay315CinematicDemoOwnerReviewGateValidator();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-315-cinematic-demo-owner-review-gate-validator-preview-only",
    screen: validator.routePath,
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
    validator
  });
}