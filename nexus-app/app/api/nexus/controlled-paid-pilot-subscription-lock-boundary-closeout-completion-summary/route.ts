import { NextResponse } from "next/server";
import { getControlledPaidPilotSubscriptionLockBoundaryCloseoutCompletionSummary } from "@/lib/nexus/controlledPaidPilotSubscriptionLockBoundaryCloseoutCompletionSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route:
      "controlled-paid-pilot-subscription-lock-boundary-closeout-completion-summary-preview-only",
    safety:
      "read-only-preview-only: no launch authorization, no subscription activation, no payment execution, no invoice creation, no entitlement writes, no customer data writes, no real DB memory read/write, no audit persistence, no approve/reject execution, no owner override execution, no recovery execution, no rollback execution, no message sending, no third-party mutation, no AI model calls.",
    data: getControlledPaidPilotSubscriptionLockBoundaryCloseoutCompletionSummary(),
  });
}
