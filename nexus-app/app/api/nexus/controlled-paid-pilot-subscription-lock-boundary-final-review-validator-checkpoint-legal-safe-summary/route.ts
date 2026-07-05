import { NextResponse } from "next/server";
import {
  getControlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointLegalSafeSummary,
  validateControlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointLegalSafeSummary
} from "@/lib/nexus/controlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointLegalSafeSummary";

export const dynamic = "force-static";

export async function GET() {
  const summary =
    getControlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointLegalSafeSummary();
  const validation =
    validateControlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointLegalSafeSummary();

  return NextResponse.json({
    ok: validation.ok,
    route:
      "controlled-paid-pilot-subscription-lock-boundary-final-review-validator-checkpoint-legal-safe-summary-preview-only",
    safety: {
      readOnly: true,
      previewOnly: true,
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
    summary
  });
}
