import { NextResponse } from "next/server";
import {
  getControlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpointSummaryValidator,
  validateControlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpointSummaryValidator
} from "@/lib/nexus/controlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpointSummaryValidator";

export const dynamic = "force-static";

export async function GET() {
  const validator =
    getControlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpointSummaryValidator();
  const validation =
    validateControlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpointSummaryValidator();

  return NextResponse.json({
    ok: validation.ok,
    route:
      "controlled-paid-pilot-subscription-lock-boundary-final-review-checkpoint-summary-validator-preview-only",
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
      vendorCustomerMessageSending: false
    },
    validation,
    validator
  });
}
