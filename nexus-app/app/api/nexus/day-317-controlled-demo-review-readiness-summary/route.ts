import { NextResponse } from "next/server";
import {
  getNexusDay317ControlledDemoReviewReadinessSummary,
  validateNexusDay317ControlledDemoReviewReadinessSummary
} from "@/lib/nexus/day317ControlledDemoReviewReadinessSummary";

export const dynamic = "force-static";

export async function GET() {
  const summary = getNexusDay317ControlledDemoReviewReadinessSummary();
  const validation = validateNexusDay317ControlledDemoReviewReadinessSummary();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-317-controlled-demo-review-readiness-summary-preview-only",
    screen: summary.routePath,
    safety: {
      readOnly: true,
      previewOnly: true,
      sampleDataOnly: true,
      ownerReviewRequired: true,
      launchAuthorization: false,
      pilotAuthorization: false,
      paidAccessAuthorization: false,
      externalDemoSharingAuthorization: false,
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
    summary
  });
}