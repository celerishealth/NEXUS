import { NextResponse } from "next/server";
import {
  getNexusDay320ControlledDemoReviewReadinessFinalSummary,
  validateNexusDay320ControlledDemoReviewReadinessFinalSummary
} from "@/lib/nexus/day320ControlledDemoReviewReadinessFinalSummary";

export const dynamic = "force-static";

export async function GET() {
  const summary = getNexusDay320ControlledDemoReviewReadinessFinalSummary();
  const validation = validateNexusDay320ControlledDemoReviewReadinessFinalSummary();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-320-controlled-demo-review-readiness-final-summary-preview-only",
    screen: summary.routePath,
    safety: {
      readOnly: true,
      previewOnly: true,
      sampleDataOnly: true,
      ownerReviewRequired: true,
      readyForOwnerReviewOnly: true,
      launchAuthorization: false,
      pilotAuthorization: false,
      paidAccessAuthorization: false,
      externalDemoSharingAuthorization: false,
      customerOnboardingAuthorization: false,
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