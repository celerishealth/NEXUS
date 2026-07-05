import { NextResponse } from "next/server";
import {
  getNexusDay318ControlledDemoReviewReadinessValidator,
  validateNexusDay318ControlledDemoReviewReadinessValidator
} from "@/lib/nexus/day318ControlledDemoReviewReadinessValidator";

export const dynamic = "force-static";

export async function GET() {
  const validator = getNexusDay318ControlledDemoReviewReadinessValidator();
  const validation = validateNexusDay318ControlledDemoReviewReadinessValidator();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-318-controlled-demo-review-readiness-validator-preview-only",
    screen: validator.routePath,
    safety: {
      readOnly: true,
      previewOnly: true,
      sampleDataOnly: true,
      ownerReviewRequired: true,
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
    validator
  });
}