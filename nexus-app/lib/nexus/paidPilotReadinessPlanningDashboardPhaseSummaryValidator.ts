import { getPaidPilotReadinessPlanningDashboardPhaseSummary } from "./paidPilotReadinessPlanningDashboardPhaseSummary";

export type PaidPilotReadinessPlanningDashboardPhaseSummaryValidatorCheck = {
  id: string;
  title: string;
  result: "PASS" | "FAIL";
  evidence: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningDashboardPhaseSummaryValidator = {
  id: string;
  day: 160;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-dashboard-phase-summary-validator-preview-only";
  validates: string;
  status: "PASS" | "FAIL";
  validationSummary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    dashboardPhaseSummaryCleared: boolean;
    allMilestonesCompleted: boolean;
    dashboardCheckpointCleared: boolean;
    subscriptionLockPreserved: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForPhaseCheckpoint: boolean;
    result: "PASS" | "FAIL";
  };
  checks: PaidPilotReadinessPlanningDashboardPhaseSummaryValidatorCheck[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningDashboardPhaseSummaryValidator(): PaidPilotReadinessPlanningDashboardPhaseSummaryValidator {
  const phaseSummary = getPaidPilotReadinessPlanningDashboardPhaseSummary();

  const allMilestonesCompleted =
    phaseSummary.phaseSummary.completedMilestones ===
    phaseSummary.phaseSummary.totalMilestones;

  const checks: PaidPilotReadinessPlanningDashboardPhaseSummaryValidatorCheck[] = [
    {
      id: "dashboard-phase-summary-cleared",
      title: "Dashboard phase summary is cleared",
      result: phaseSummary.status === "CLEARED" ? "PASS" : "FAIL",
      evidence:
        "The Day 159 paid pilot readiness planning dashboard phase summary must be cleared before validation can pass.",
      safetyBoundary:
        "A blocked dashboard phase summary cannot move to phase checkpointing.",
    },
    {
      id: "milestones-completed",
      title: "All paid pilot dashboard milestones are complete",
      result: allMilestonesCompleted ? "PASS" : "FAIL",
      evidence:
        "The validator confirms Day 151 through Day 158 are represented as completed paid pilot readiness planning milestones.",
      safetyBoundary:
        "Incomplete milestones cannot be treated as paid pilot dashboard phase readiness.",
    },
    {
      id: "dashboard-checkpoint-cleared",
      title: "Dashboard checkpoint is cleared",
      result: phaseSummary.phaseSummary.dashboardCheckpointCleared
        ? "PASS"
        : "FAIL",
      evidence:
        "The Day 158 paid pilot readiness planning dashboard checkpoint must be cleared before phase summary validation can pass.",
      safetyBoundary:
        "A blocked dashboard checkpoint cannot be converted into phase checkpoint readiness.",
    },
    {
      id: "subscription-lock-preserved",
      title: "Subscription Lock remains protected",
      result: phaseSummary.phaseSummary.subscriptionLockPreserved
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
      result: phaseSummary.phaseSummary.paymentExecutionBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "Payment execution remains blocked throughout the paid pilot dashboard phase summary.",
      safetyBoundary:
        "No payment execution, invoice creation, charging, or payment provider call is enabled.",
    },
    {
      id: "message-sending-blocked",
      title: "Message sending remains blocked",
      result: phaseSummary.phaseSummary.messageSendingBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "Customer-facing message sending remains blocked throughout the paid pilot dashboard phase summary.",
      safetyBoundary:
        "No WhatsApp, email, SMS, or external customer communication is enabled.",
    },
    {
      id: "customer-data-writes-blocked",
      title: "Customer data writes remain blocked",
      result: phaseSummary.phaseSummary.customerDataWritesBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "Customer data writes remain blocked throughout the paid pilot dashboard phase summary.",
      safetyBoundary:
        "No customer data write, real DB memory read/write, or audit persistence is enabled.",
    },
    {
      id: "owner-control-preserved",
      title: "Owner control is preserved",
      result: phaseSummary.phaseSummary.ownerControlPreserved ? "PASS" : "FAIL",
      evidence:
        "Owner Approval remains mandatory before any future paid pilot execution architecture can be enabled.",
      safetyBoundary:
        "No autonomous approval, rejection, or business action execution is allowed.",
    },
    {
      id: "locked-vision-preserved",
      title: "Locked NEXUS vision is preserved",
      result: phaseSummary.phaseSummary.lockedVisionPreserved ? "PASS" : "FAIL",
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
    id: "nexus-paid-pilot-readiness-planning-dashboard-phase-summary-validator-v1",
    day: 160,
    name: "NEXUS Paid Pilot Readiness Planning Dashboard Phase Summary Validator v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-dashboard-phase-summary-validator-preview-only",
    validates:
      "Day 159 Paid Pilot Readiness Planning Dashboard Phase Summary v1",
    status: result,
    validationSummary: {
      totalChecks: checks.length,
      passedChecks,
      failedChecks,
      dashboardPhaseSummaryCleared: phaseSummary.status === "CLEARED",
      allMilestonesCompleted,
      dashboardCheckpointCleared:
        phaseSummary.phaseSummary.dashboardCheckpointCleared,
      subscriptionLockPreserved:
        phaseSummary.phaseSummary.subscriptionLockPreserved,
      paymentExecutionBlocked:
        phaseSummary.phaseSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        phaseSummary.phaseSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        phaseSummary.phaseSummary.customerDataWritesBlocked,
      ownerControlPreserved:
        phaseSummary.phaseSummary.ownerControlPreserved,
      lockedVisionPreserved:
        phaseSummary.phaseSummary.lockedVisionPreserved,
      safeForPhaseCheckpoint:
        phaseSummary.phaseSummary.safeForPhaseValidation,
      result,
    },
    checks,
    prohibitedActions: phaseSummary.prohibitedActions,
    requiredContinuity: phaseSummary.requiredContinuity,
    nextRecommendedStep:
      "Day 161: add paid pilot readiness planning dashboard phase checkpoint v1.",
  };
}
