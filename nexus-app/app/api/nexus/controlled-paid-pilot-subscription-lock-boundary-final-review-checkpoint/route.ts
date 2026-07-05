import { NextResponse } from "next/server";
import {
  getControlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpoint,
  validateControlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpoint
} from "@/lib/nexus/controlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpoint";

export const dynamic = "force-static";

export async function GET() {
  const checkpoint =
    getControlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpoint();
  const validation =
    validateControlledPaidPilotSubscriptionLockBoundaryFinalReviewCheckpoint();

  return NextResponse.json({
    ok: validation.ok,
    route:
      "controlled-paid-pilot-subscription-lock-boundary-final-review-checkpoint-preview-only",
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
    checkpoint
  });
}
