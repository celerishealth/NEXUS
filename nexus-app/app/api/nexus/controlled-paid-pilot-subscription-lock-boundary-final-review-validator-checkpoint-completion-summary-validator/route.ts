import { NextResponse } from "next/server";
import {
  getControlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointCompletionSummaryValidator,
  validateControlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointCompletionSummaryValidator
} from "@/lib/nexus/controlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointCompletionSummaryValidator";

export const dynamic = "force-static";

export async function GET() {
  const validator =
    getControlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointCompletionSummaryValidator();
  const validation =
    validateControlledPaidPilotSubscriptionLockBoundaryFinalReviewValidatorCheckpointCompletionSummaryValidator();

  return NextResponse.json({
    ok: validation.ok,
    route:
      "controlled-paid-pilot-subscription-lock-boundary-final-review-validator-checkpoint-completion-summary-validator-preview-only",
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
      ewayBillGeneration: false
    },
    validation,
    validator
  });
}
