import { getPaidPilotReadinessPlanningSummary } from "./paidPilotReadinessPlanningSummary";

export type PaidPilotReadinessPlanningCheckpointGate = {
  id: string;
  title: string;
  status: "CLEARED" | "LOCKED" | "BLOCKED";
  checkpointEvidence: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningCheckpoint = {
  id: string;
  day: 154;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-planning-checkpoint-preview-only";
  checkpointFor: string[];
  status: "CLEARED" | "BLOCKED";
  checkpointSummary: {
    contractDefined: boolean;
    validatorPassed: boolean;
    summaryCleared: boolean;
    subscriptionLockPlanningOnly: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForNextPlanningStep: boolean;
    result: "PAID_PILOT_PLANNING_CHECKPOINT_CLEARED" | "BLOCKED";
  };
  gates: PaidPilotReadinessPlanningCheckpointGate[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningCheckpoint(): PaidPilotReadinessPlanningCheckpoint {
  const summary = getPaidPilotReadinessPlanningSummary();

  const cleared =
    summary.status === "CLEARED" &&
    summary.planningSummary.safeForCheckpoint &&
    summary.planningSummary.subscriptionLockPlanningOnly &&
    summary.planningSummary.paymentExecutionBlocked &&
    summary.planningSummary.messageSendingBlocked &&
    summary.planningSummary.customerDataWritesBlocked &&
    summary.planningSummary.ownerControlPreserved &&
    summary.planningSummary.lockedVisionPreserved;

  return {
    id: "nexus-paid-pilot-readiness-planning-checkpoint-v1",
    day: 154,
    name: "NEXUS Paid Pilot Readiness Planning Checkpoint v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-planning-checkpoint-preview-only",
    checkpointFor: [
      "Day 151 Paid Pilot Readiness Planning Contract v1",
      "Day 152 Paid Pilot Readiness Planning Validator v1",
      "Day 153 Paid Pilot Readiness Planning Summary v1",
    ],
    status: cleared ? "CLEARED" : "BLOCKED",
    checkpointSummary: {
      contractDefined: summary.planningSummary.contractDefined,
      validatorPassed: summary.planningSummary.validatorPassed,
      summaryCleared: summary.status === "CLEARED",
      subscriptionLockPlanningOnly:
        summary.planningSummary.subscriptionLockPlanningOnly,
      paymentExecutionBlocked:
        summary.planningSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        summary.planningSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        summary.planningSummary.customerDataWritesBlocked,
      ownerControlPreserved: summary.planningSummary.ownerControlPreserved,
      lockedVisionPreserved: summary.planningSummary.lockedVisionPreserved,
      safeForNextPlanningStep: cleared,
      result: cleared ? "PAID_PILOT_PLANNING_CHECKPOINT_CLEARED" : "BLOCKED",
    },
    gates: [
      {
        id: "paid-pilot-summary-gate",
        title: "Paid pilot planning summary gate",
        status: summary.status === "CLEARED" ? "CLEARED" : "BLOCKED",
        checkpointEvidence:
          "The Day 153 paid pilot readiness planning summary must be cleared before checkpointing can pass.",
        safetyBoundary:
          "A blocked summary cannot be converted into pilot readiness.",
      },
      {
        id: "subscription-lock-gate",
        title: "Subscription Lock planning gate",
        status: summary.planningSummary.subscriptionLockPlanningOnly
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Subscription Lock remains a future access-control planning layer only.",
        safetyBoundary:
          "No real subscription verification, subscription activation, entitlement write, or account lock mutation is enabled.",
      },
      {
        id: "payment-gate",
        title: "Payment execution gate",
        status: summary.planningSummary.paymentExecutionBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Payment execution remains blocked during paid pilot readiness planning.",
        safetyBoundary:
          "No payment execution, invoice creation, charging, or payment provider call is enabled.",
      },
      {
        id: "message-sending-gate",
        title: "Message sending gate",
        status: summary.planningSummary.messageSendingBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Customer-facing message sending remains blocked during paid pilot readiness planning.",
        safetyBoundary:
          "No WhatsApp, email, SMS, or external customer communication is enabled.",
      },
      {
        id: "customer-data-gate",
        title: "Customer data gate",
        status: summary.planningSummary.customerDataWritesBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Customer data writes remain blocked during paid pilot readiness planning.",
        safetyBoundary:
          "No customer data write, real DB memory read/write, or audit persistence is enabled.",
      },
      {
        id: "owner-control-gate",
        title: "Owner control gate",
        status: summary.planningSummary.ownerControlPreserved
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Owner Approval remains mandatory before any future pilot execution architecture can be enabled.",
        safetyBoundary:
          "No autonomous approval, rejection, or business action execution is allowed.",
      },
      {
        id: "locked-vision-gate",
        title: "Locked NEXUS vision gate",
        status: summary.planningSummary.lockedVisionPreserved
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
    prohibitedActions: summary.prohibitedActions,
    requiredContinuity: summary.requiredContinuity,
    nextRecommendedStep:
      "Day 155: add paid pilot readiness planning dashboard contract v1.",
  };
}
