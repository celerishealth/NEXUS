import { getPaidPilotReadinessPlanningPhaseCloseoutSummary } from "./paidPilotReadinessPlanningPhaseCloseoutSummary";

export type PaidPilotReadinessPlanningPhaseCloseoutSummaryValidatorCheck = {
  id: string;
  title: string;
  result: "PASS" | "FAIL";
  evidence: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningPhaseCloseoutSummaryValidator = {
  id: string;
  day: 166;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-phase-closeout-summary-validator-preview-only";
  validates: string;
  status: "PASS" | "FAIL";
  validationSummary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    closeoutSummaryCleared: boolean;
    phaseCheckpointCleared: boolean;
    paidPilotPlanningSequenceComplete: boolean;
    dashboardPlanningSequenceComplete: boolean;
    subscriptionLockPreserved: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForCloseoutCheckpoint: boolean;
    result: "PASS" | "FAIL";
  };
  checks: PaidPilotReadinessPlanningPhaseCloseoutSummaryValidatorCheck[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningPhaseCloseoutSummaryValidator(): PaidPilotReadinessPlanningPhaseCloseoutSummaryValidator {
  const closeoutSummary = getPaidPilotReadinessPlanningPhaseCloseoutSummary();

  const checks: PaidPilotReadinessPlanningPhaseCloseoutSummaryValidatorCheck[] = [
    {
      id: "closeout-summary-cleared",
      title: "Closeout summary is cleared",
      result: closeoutSummary.status === "CLEARED" ? "PASS" : "FAIL",
      evidence:
        "The Day 165 paid pilot readiness planning phase closeout summary must be cleared before closeout checkpointing can pass.",
      safetyBoundary:
        "A blocked closeout summary cannot be converted into closeout checkpoint readiness.",
    },
    {
      id: "phase-checkpoint-cleared",
      title: "Phase checkpoint is cleared",
      result: closeoutSummary.closeoutSummary.phaseCheckpointCleared
        ? "PASS"
        : "FAIL",
      evidence:
        "The Day 164 paid pilot readiness planning phase checkpoint must remain cleared.",
      safetyBoundary:
        "A blocked phase checkpoint cannot move into closeout checkpointing.",
    },
    {
      id: "paid-pilot-planning-sequence-complete",
      title: "Paid pilot planning sequence is complete",
      result: closeoutSummary.closeoutSummary.paidPilotPlanningSequenceComplete
        ? "PASS"
        : "FAIL",
      evidence:
        "The validator confirms the paid pilot planning sequence is complete in the closeout summary.",
      safetyBoundary:
        "Planning sequence completion does not activate payments, subscriptions, entitlements, accounts, messages, or customer data writes.",
    },
    {
      id: "dashboard-planning-sequence-complete",
      title: "Dashboard planning sequence is complete",
      result: closeoutSummary.closeoutSummary.dashboardPlanningSequenceComplete
        ? "PASS"
        : "FAIL",
      evidence:
        "The validator confirms the dashboard planning sequence is complete through phase checkpointing.",
      safetyBoundary:
        "Dashboard completion remains preview-only and cannot become an execution console.",
    },
    {
      id: "subscription-lock-preserved",
      title: "Subscription Lock remains protected",
      result: closeoutSummary.closeoutSummary.subscriptionLockPreserved
        ? "PASS"
        : "FAIL",
      evidence:
        "Subscription Lock remains preserved as a future access-control planning layer only.",
      safetyBoundary:
        "No subscription activation, entitlement write, account lock mutation, or payment provider call is enabled.",
    },
    {
      id: "payment-execution-blocked",
      title: "Payment execution remains blocked",
      result: closeoutSummary.closeoutSummary.paymentExecutionBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "Payment execution remains blocked throughout the paid pilot phase closeout summary.",
      safetyBoundary:
        "No payment execution, invoice creation, charging, or payment provider call is enabled.",
    },
    {
      id: "message-sending-blocked",
      title: "Message sending remains blocked",
      result: closeoutSummary.closeoutSummary.messageSendingBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "Customer-facing message sending remains blocked throughout the paid pilot phase closeout summary.",
      safetyBoundary:
        "No WhatsApp, email, SMS, or external customer communication is enabled.",
    },
    {
      id: "customer-data-writes-blocked",
      title: "Customer data writes remain blocked",
      result: closeoutSummary.closeoutSummary.customerDataWritesBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "Customer data writes remain blocked throughout the paid pilot phase closeout summary.",
      safetyBoundary:
        "No customer data write, real DB memory read/write, or audit persistence is enabled.",
    },
    {
      id: "owner-control-preserved",
      title: "Owner control is preserved",
      result: closeoutSummary.closeoutSummary.ownerControlPreserved
        ? "PASS"
        : "FAIL",
      evidence:
        "Owner Approval remains mandatory before any future paid pilot execution architecture can be enabled.",
      safetyBoundary:
        "No autonomous approval, rejection, or business action execution is allowed.",
    },
    {
      id: "locked-vision-preserved",
      title: "Locked NEXUS vision is preserved",
      result: closeoutSummary.closeoutSummary.lockedVisionPreserved
        ? "PASS"
        : "FAIL",
      evidence:
        "NEXUS remains an owner-controlled AI Business Operating Layer above existing business software.",
      safetyBoundary:
        "NEXUS must not become a chatbot, CRM clone, ERP clone, or Make/Zapier clone.",
    },
    {
      id: "ai-model-isolation",
      title: "AI model isolation is preserved",
      result: "PASS",
      evidence:
        "The validator uses deterministic local planning data only and does not call any AI model.",
      safetyBoundary:
        "No AI model calls from this safety route.",
    },
  ];

  const passedChecks = checks.filter((check) => check.result === "PASS").length;
  const failedChecks = checks.length - passedChecks;
  const result: "PASS" | "FAIL" = failedChecks === 0 ? "PASS" : "FAIL";

  return {
    id: "nexus-paid-pilot-readiness-planning-phase-closeout-summary-validator-v1",
    day: 166,
    name: "NEXUS Paid Pilot Readiness Planning Phase Closeout Summary Validator v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-phase-closeout-summary-validator-preview-only",
    validates:
      "Day 165 Paid Pilot Readiness Planning Phase Closeout Summary v1",
    status: result,
    validationSummary: {
      totalChecks: checks.length,
      passedChecks,
      failedChecks,
      closeoutSummaryCleared: closeoutSummary.status === "CLEARED",
      phaseCheckpointCleared:
        closeoutSummary.closeoutSummary.phaseCheckpointCleared,
      paidPilotPlanningSequenceComplete:
        closeoutSummary.closeoutSummary.paidPilotPlanningSequenceComplete,
      dashboardPlanningSequenceComplete:
        closeoutSummary.closeoutSummary.dashboardPlanningSequenceComplete,
      subscriptionLockPreserved:
        closeoutSummary.closeoutSummary.subscriptionLockPreserved,
      paymentExecutionBlocked:
        closeoutSummary.closeoutSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        closeoutSummary.closeoutSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        closeoutSummary.closeoutSummary.customerDataWritesBlocked,
      ownerControlPreserved:
        closeoutSummary.closeoutSummary.ownerControlPreserved,
      lockedVisionPreserved:
        closeoutSummary.closeoutSummary.lockedVisionPreserved,
      safeForCloseoutCheckpoint:
        closeoutSummary.closeoutSummary.safeForCloseoutValidation,
      result,
    },
    checks,
    prohibitedActions: closeoutSummary.prohibitedActions,
    requiredContinuity: closeoutSummary.requiredContinuity,
    nextRecommendedStep:
      "Day 167: add paid pilot readiness planning phase closeout checkpoint v1.",
  };
}
