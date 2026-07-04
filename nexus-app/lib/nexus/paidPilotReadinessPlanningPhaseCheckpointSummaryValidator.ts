import { getPaidPilotReadinessPlanningPhaseCheckpointSummary } from "./paidPilotReadinessPlanningPhaseCheckpointSummary";

export type PaidPilotReadinessPlanningPhaseCheckpointSummaryValidatorCheck = {
  id: string;
  title: string;
  result: "PASS" | "FAIL";
  evidence: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningPhaseCheckpointSummaryValidator = {
  id: string;
  day: 163;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-phase-checkpoint-summary-validator-preview-only";
  validates: string;
  status: "PASS" | "FAIL";
  validationSummary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    phaseCheckpointSummaryCleared: boolean;
    dashboardPhaseCheckpointCleared: boolean;
    paidPilotPlanningSequenceRepresented: boolean;
    subscriptionLockPreserved: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForPhaseCheckpoint: boolean;
    result: "PASS" | "FAIL";
  };
  checks: PaidPilotReadinessPlanningPhaseCheckpointSummaryValidatorCheck[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningPhaseCheckpointSummaryValidator(): PaidPilotReadinessPlanningPhaseCheckpointSummaryValidator {
  const summary = getPaidPilotReadinessPlanningPhaseCheckpointSummary();

  const checks: PaidPilotReadinessPlanningPhaseCheckpointSummaryValidatorCheck[] = [
    {
      id: "phase-checkpoint-summary-cleared",
      title: "Phase checkpoint summary is cleared",
      result: summary.status === "CLEARED" ? "PASS" : "FAIL",
      evidence:
        "The Day 162 paid pilot readiness planning phase checkpoint summary must be cleared before validation can pass.",
      safetyBoundary:
        "A blocked phase checkpoint summary cannot move to phase checkpointing.",
    },
    {
      id: "dashboard-phase-checkpoint-cleared",
      title: "Dashboard phase checkpoint is cleared",
      result: summary.phaseCheckpointSummary.dashboardPhaseCheckpointCleared
        ? "PASS"
        : "FAIL",
      evidence:
        "The Day 161 paid pilot readiness planning dashboard phase checkpoint must remain cleared.",
      safetyBoundary:
        "A blocked dashboard phase checkpoint cannot become paid pilot phase readiness.",
    },
    {
      id: "paid-pilot-planning-sequence-represented",
      title: "Paid pilot planning sequence is represented",
      result: summary.phaseCheckpointSummary.paidPilotPlanningSequenceRepresented
        ? "PASS"
        : "FAIL",
      evidence:
        "The validator confirms the paid pilot planning sequence is represented in the checkpoint summary.",
      safetyBoundary:
        "Planning sequence representation does not activate payments, subscriptions, entitlements, accounts, messages, or customer data writes.",
    },
    {
      id: "subscription-lock-preserved",
      title: "Subscription Lock remains protected",
      result: summary.phaseCheckpointSummary.subscriptionLockPreserved
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
      result: summary.phaseCheckpointSummary.paymentExecutionBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "Payment execution remains blocked throughout the paid pilot phase checkpoint summary.",
      safetyBoundary:
        "No payment execution, invoice creation, charging, or payment provider call is enabled.",
    },
    {
      id: "message-sending-blocked",
      title: "Message sending remains blocked",
      result: summary.phaseCheckpointSummary.messageSendingBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "Customer-facing message sending remains blocked throughout the paid pilot phase checkpoint summary.",
      safetyBoundary:
        "No WhatsApp, email, SMS, or external customer communication is enabled.",
    },
    {
      id: "customer-data-writes-blocked",
      title: "Customer data writes remain blocked",
      result: summary.phaseCheckpointSummary.customerDataWritesBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "Customer data writes remain blocked throughout the paid pilot phase checkpoint summary.",
      safetyBoundary:
        "No customer data write, real DB memory read/write, or audit persistence is enabled.",
    },
    {
      id: "owner-control-preserved",
      title: "Owner control is preserved",
      result: summary.phaseCheckpointSummary.ownerControlPreserved
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
      result: summary.phaseCheckpointSummary.lockedVisionPreserved
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
    id: "nexus-paid-pilot-readiness-planning-phase-checkpoint-summary-validator-v1",
    day: 163,
    name: "NEXUS Paid Pilot Readiness Planning Phase Checkpoint Summary Validator v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-phase-checkpoint-summary-validator-preview-only",
    validates:
      "Day 162 Paid Pilot Readiness Planning Phase Checkpoint Summary v1",
    status: result,
    validationSummary: {
      totalChecks: checks.length,
      passedChecks,
      failedChecks,
      phaseCheckpointSummaryCleared: summary.status === "CLEARED",
      dashboardPhaseCheckpointCleared:
        summary.phaseCheckpointSummary.dashboardPhaseCheckpointCleared,
      paidPilotPlanningSequenceRepresented:
        summary.phaseCheckpointSummary.paidPilotPlanningSequenceRepresented,
      subscriptionLockPreserved:
        summary.phaseCheckpointSummary.subscriptionLockPreserved,
      paymentExecutionBlocked:
        summary.phaseCheckpointSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        summary.phaseCheckpointSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        summary.phaseCheckpointSummary.customerDataWritesBlocked,
      ownerControlPreserved:
        summary.phaseCheckpointSummary.ownerControlPreserved,
      lockedVisionPreserved:
        summary.phaseCheckpointSummary.lockedVisionPreserved,
      safeForPhaseCheckpoint:
        summary.phaseCheckpointSummary.safeForSummaryValidation,
      result,
    },
    checks,
    prohibitedActions: summary.prohibitedActions,
    requiredContinuity: summary.requiredContinuity,
    nextRecommendedStep:
      "Day 164: add paid pilot readiness planning phase checkpoint v1.",
  };
}
