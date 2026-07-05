import { NextResponse } from "next/server";
import {
  getNexusDay310CinematicDemoReviewCheckpoint,
  validateNexusDay310CinematicDemoReviewCheckpoint
} from "@/lib/nexus/day310CinematicDemoReviewCheckpoint";

export const dynamic = "force-static";

export async function GET() {
  const checkpoint = getNexusDay310CinematicDemoReviewCheckpoint();
  const validation = validateNexusDay310CinematicDemoReviewCheckpoint();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-310-cinematic-demo-review-checkpoint-preview-only",
    screen: checkpoint.routePath,
    safety: {
      readOnly: true,
      previewOnly: true,
      sampleDataOnly: true,
      launchAuthorization: false,
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
    checkpoint
  });
}
