import { getPaidPilotReadinessPlanningPhaseCloseoutSummaryValidator } from "./paidPilotReadinessPlanningPhaseCloseoutSummaryValidator";

export type PaidPilotReadinessPlanningPhaseCloseoutCheckpointGate = {
  id: string;
  title: string;
  status: "CLEARED" | "LOCKED" | "BLOCKED";
  checkpointEvidence: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningPhaseCloseoutCheckpoint = {
  id: string;
  day: 167;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-phase-closeout-checkpoint-preview-only";
  checkpointFor: string[];
  status: "CLEARED" | "BLOCKED";
  closeoutCheckpointSummary: {
    closeoutSummaryValidated: boolean;
    allChecksPassed: boolean;
    phaseCheckpointCleared: boolean;
    paidPilotPlanningSequenceComplete: boolean;
    dashboardPlanningSequenceComplete: boolean;
    subscriptionLockPreserved: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForFinalPhaseSummary: boolean;
    result: "PAID_PILOT_PHASE_CLOSEOUT_CHECKPOINT_CLEARED" | "BLOCKED";
  };
  gates: PaidPilotReadinessPlanningPhaseCloseoutCheckpointGate[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningPhaseCloseoutCheckpoint(): PaidPilotReadinessPlanningPhaseCloseoutCheckpoint {
  const validator = getPaidPilotReadinessPlanningPhaseCloseoutSummaryValidator();

  const cleared =
    validator.status === "PASS" &&
    validator.validationSummary.failedChecks === 0 &&
    validator.validationSummary.closeoutSummaryCleared &&
    validator.validationSummary.phaseCheckpointCleared &&
    validator.validationSummary.paidPilotPlanningSequenceComplete &&
    validator.validationSummary.dashboardPlanningSequenceComplete &&
    validator.validationSummary.subscriptionLockPreserved &&
    validator.validationSummary.paymentExecutionBlocked &&
    validator.validationSummary.messageSendingBlocked &&
    validator.validationSummary.customerDataWritesBlocked &&
    validator.validationSummary.ownerControlPreserved &&
    validator.validationSummary.lockedVisionPreserved &&
    validator.validationSummary.safeForCloseoutCheckpoint;

  return {
    id: "nexus-paid-pilot-readiness-planning-phase-closeout-checkpoint-v1",
    day: 167,
    name: "NEXUS Paid Pilot Readiness Planning Phase Closeout Checkpoint v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-phase-closeout-checkpoint-preview-only",
    checkpointFor: [
      "Day 151 Paid Pilot Readiness Planning Contract v1",
      "Day 152 Paid Pilot Readiness Planning Validator v1",
      "Day 153 Paid Pilot Readiness Planning Summary v1",
      "Day 154 Paid Pilot Readiness Planning Checkpoint v1",
      "Day 155 Paid Pilot Readiness Planning Dashboard Contract v1",
      "Day 156 Paid Pilot Readiness Planning Dashboard Validator v1",
      "Day 157 Paid Pilot Readiness Planning Dashboard Summary v1",
      "Day 158 Paid Pilot Readiness Planning Dashboard Checkpoint v1",
      "Day 159 Paid Pilot Readiness Planning Dashboard Phase Summary v1",
      "Day 160 Paid Pilot Readiness Planning Dashboard Phase Summary Validator v1",
      "Day 161 Paid Pilot Readiness Planning Dashboard Phase Checkpoint v1",
      "Day 162 Paid Pilot Readiness Planning Phase Checkpoint Summary v1",
      "Day 163 Paid Pilot Readiness Planning Phase Checkpoint Summary Validator v1",
      "Day 164 Paid Pilot Readiness Planning Phase Checkpoint v1",
      "Day 165 Paid Pilot Readiness Planning Phase Closeout Summary v1",
      "Day 166 Paid Pilot Readiness Planning Phase Closeout Summary Validator v1",
    ],
    status: cleared ? "CLEARED" : "BLOCKED",
    closeoutCheckpointSummary: {
      closeoutSummaryValidated: validator.status === "PASS",
      allChecksPassed: validator.validationSummary.failedChecks === 0,
      phaseCheckpointCleared: validator.validationSummary.phaseCheckpointCleared,
      paidPilotPlanningSequenceComplete:
        validator.validationSummary.paidPilotPlanningSequenceComplete,
      dashboardPlanningSequenceComplete:
        validator.validationSummary.dashboardPlanningSequenceComplete,
      subscriptionLockPreserved:
        validator.validationSummary.subscriptionLockPreserved,
      paymentExecutionBlocked:
        validator.validationSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        validator.validationSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        validator.validationSummary.customerDataWritesBlocked,
      ownerControlPreserved:
        validator.validationSummary.ownerControlPreserved,
      lockedVisionPreserved:
        validator.validationSummary.lockedVisionPreserved,
      safeForFinalPhaseSummary: cleared,
      result: cleared ? "PAID_PILOT_PHASE_CLOSEOUT_CHECKPOINT_CLEARED" : "BLOCKED",
    },
    gates: [
      {
        id: "closeout-summary-validation-gate",
        title: "Closeout summary validation gate",
        status: validator.status === "PASS" ? "CLEARED" : "BLOCKED",
        checkpointEvidence:
          "The Day 166 closeout summary validator must pass before closeout checkpointing can be cleared.",
        safetyBoundary:
          "Failed closeout summary validation blocks final phase summary progression.",
      },
      {
        id: "phase-checkpoint-gate",
        title: "Phase checkpoint gate",
        status: validator.validationSummary.phaseCheckpointCleared
          ? "CLEARED"
          : "BLOCKED",
        checkpointEvidence:
          "The Day 164 paid pilot readiness planning phase checkpoint remains cleared.",
        safetyBoundary:
          "A blocked phase checkpoint cannot become closeout checkpoint readiness.",
      },
      {
        id: "subscription-lock-gate",
        title: "Subscription Lock gate",
        status: validator.validationSummary.subscriptionLockPreserved
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Subscription Lock remains preserved as a future access-control planning layer only.",
        safetyBoundary:
          "No subscription activation, entitlement write, account lock mutation, or payment provider call is enabled.",
      },
      {
        id: "payment-execution-gate",
        title: "Payment execution gate",
        status: validator.validationSummary.paymentExecutionBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Payment execution remains blocked during paid pilot closeout checkpointing.",
        safetyBoundary:
          "No payment execution, invoice creation, charging, or payment provider call is enabled.",
      },
      {
        id: "message-sending-gate",
        title: "Message sending gate",
        status: validator.validationSummary.messageSendingBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Customer-facing message sending remains blocked during paid pilot closeout checkpointing.",
        safetyBoundary:
          "No WhatsApp, email, SMS, or external customer communication is enabled.",
      },
      {
        id: "customer-data-gate",
        title: "Customer data gate",
        status: validator.validationSummary.customerDataWritesBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Customer data writes remain blocked during paid pilot closeout checkpointing.",
        safetyBoundary:
          "No customer data write, real DB memory read/write, or audit persistence is enabled.",
      },
      {
        id: "owner-control-gate",
        title: "Owner control gate",
        status: validator.validationSummary.ownerControlPreserved
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Owner Approval remains mandatory before any future paid pilot execution architecture can be enabled.",
        safetyBoundary:
          "No autonomous approval, rejection, or business action execution is allowed.",
      },
      {
        id: "locked-vision-gate",
        title: "Locked NEXUS vision gate",
        status: validator.validationSummary.lockedVisionPreserved
          ? "CLEARED"
          : "BLOCKED",
        checkpointEvidence:
          "NEXUS remains an owner-controlled AI Business Operating Layer above existing business software.",
        safetyBoundary:
          "NEXUS must not become a chatbot, CRM clone, ERP clone, or Make/Zapier clone.",
      },
      {
        id: "ai-model-isolation-gate",
        title: "AI model isolation gate",
        status: "LOCKED",
        checkpointEvidence:
          "This checkpoint uses deterministic local planning data only and does not call AI models.",
        safetyBoundary:
          "No AI model calls from this safety route.",
      },
    ],
    prohibitedActions: validator.prohibitedActions,
    requiredContinuity: validator.requiredContinuity,
    nextRecommendedStep:
      "Day 168: add paid pilot readiness planning final phase summary v1.",
  };
}
