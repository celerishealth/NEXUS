import { NextResponse } from "next/server";
import {
  getNexusDay322OwnerReviewPrepValidator,
  validateNexusDay322OwnerReviewPrepValidator
} from "@/lib/nexus/day322OwnerReviewPrepValidator";

export const dynamic = "force-static";

export async function GET() {
  const validator = getNexusDay322OwnerReviewPrepValidator();
  const validation = validateNexusDay322OwnerReviewPrepValidator();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-322-owner-review-prep-validator-preview-only",
    screen: validator.routePath,
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
    validator
  });
}