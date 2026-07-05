import { controlledPaidPilotSubscriptionLockBoundaryContract } from "./controlledPaidPilotSubscriptionLockBoundaryContract";
import { validateControlledPaidPilotSubscriptionLockBoundary } from "./controlledPaidPilotSubscriptionLockBoundaryValidator";
import { getControlledPaidPilotSubscriptionLockBoundarySummary } from "./controlledPaidPilotSubscriptionLockBoundarySummary";

type CheckpointStatus = "checkpoint-ready" | "blocked-manual-review-required";

type CheckpointItem = {
  id: string;
  label: string;
  status: "locked" | "confirmed" | "blocked" | "required";
  detail: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryCheckpoint = {
  checkpointId: "controlled-paid-pilot-subscription-lock-boundary-checkpoint-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Checkpoint v1";
  mode: "read-only-preview-checkpoint";
  day: 227;
  status: CheckpointStatus;
  upstreamArtifacts: {
    contractId: typeof controlledPaidPilotSubscriptionLockBoundaryContract.contractId;
    validatorId: "controlled-paid-pilot-subscription-lock-boundary-validator-v1";
    summaryId: "controlled-paid-pilot-subscription-lock-boundary-summary-v1";
    validatorStatus: "pass" | "fail";
    summaryStatus: "ready-for-planning" | "blocked-manual-review-required";
  };
  checkpointPurpose: string;
  lockedIdentityCheckpoint: CheckpointItem[];
  subscriptionLockCheckpoint: CheckpointItem[];
  executionBlockCheckpoint: CheckpointItem[];
  accessUnlockPrerequisiteCheckpoint: CheckpointItem[];
  manualEscalationCheckpoint: CheckpointItem[];
  auditFallbackRollbackCheckpoint: CheckpointItem[];
  finalCheckpointConclusion: string;
  nextRecommendedStep: string;
};

export function getControlledPaidPilotSubscriptionLockBoundaryCheckpoint(): ControlledPaidPilotSubscriptionLockBoundaryCheckpoint {
  const contract = controlledPaidPilotSubscriptionLockBoundaryContract;
  const validation = validateControlledPaidPilotSubscriptionLockBoundary();
  const summary = getControlledPaidPilotSubscriptionLockBoundarySummary();

  const status: CheckpointStatus =
    validation.overallStatus === "pass" &&
    summary.status === "ready-for-planning"
      ? "checkpoint-ready"
      : "blocked-manual-review-required";

  return {
    checkpointId: "controlled-paid-pilot-subscription-lock-boundary-checkpoint-v1",
    title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Checkpoint v1",
    mode: "read-only-preview-checkpoint",
    day: 227,
    status,
    upstreamArtifacts: {
      contractId: contract.contractId,
      validatorId: validation.validatorId,
      summaryId: summary.summaryId,
      validatorStatus: validation.overallStatus,
      summaryStatus: summary.status,
    },
    checkpointPurpose:
      "Checkpoint the controlled paid pilot subscription lock boundary after contract, validator, and summary artifacts. This checkpoint confirms locked-by-default subscription discipline for planning only and does not unlock, activate, charge, invoice, mutate, persist, approve, reject, send, recover, or call AI models.",
    lockedIdentityCheckpoint: [
      {
        id: "nexus-owner-controlled-operating-layer",
        label: "NEXUS remains owner-controlled AI Business Operating Layer",
        status: "confirmed",
        detail:
          "The subscription lock boundary preserves owner control above existing business software.",
      },
      {
        id: "nexus-not-generic-clone",
        label: "NEXUS remains not chatbot/CRM/ERP/automation-runner",
        status: "confirmed",
        detail:
          "The checkpoint preserves the locked product identity and prevents uncontrolled automation drift.",
      },
      {
        id: "controlled-paid-pilot-discipline",
        label: "Controlled paid pilot discipline preserved",
        status: "confirmed",
        detail:
          "All paid pilot subscription lock work remains preview-only planning discipline.",
      },
    ],
    subscriptionLockCheckpoint: [
      {
        id: "unknown-subscription-state",
        label: "Unknown subscription state",
        status: "locked",
        detail:
          "Unknown, missing, conflicting, or unverified subscription state must stay locked.",
      },
      {
        id: "missing-entitlement-scope",
        label: "Missing entitlement scope",
        status: "locked",
        detail:
          "Missing or incomplete entitlement scope must stay locked until safe read-only verification exists.",
      },
      {
        id: "unapproved-pilot-account",
        label: "Unapproved pilot account",
        status: "locked",
        detail:
          "No future pilot unlock can occur without explicit owner approval of the pilot account boundary.",
      },
      {
        id: "billing-ambiguity",
        label: "Billing ambiguity",
        status: "locked",
        detail:
          "Any payment, invoice, subscription activation, or billing-state ambiguity stays locked and escalates.",
      },
    ],
    executionBlockCheckpoint: [
      {
        id: "no-subscription-activation",
        label: "Subscription activation blocked",
        status: "blocked",
        detail:
          "This checkpoint does not activate, change, or unlock subscriptions.",
      },
      {
        id: "no-payment-invoice",
        label: "Payment and invoice execution blocked",
        status: "blocked",
        detail:
          "This checkpoint does not charge, create invoices, or mutate billing records.",
      },
      {
        id: "no-entitlement-write",
        label: "Entitlement writes blocked",
        status: "blocked",
        detail:
          "This checkpoint does not create, update, delete, or persist entitlements.",
      },
      {
        id: "no-customer-data-mutation",
        label: "Customer data mutation blocked",
        status: "blocked",
        detail:
          "This checkpoint does not write customer data or read/write real DB customer memory.",
      },
      {
        id: "no-third-party-ai-message",
        label: "Third-party mutation, AI calls, and message sending blocked",
        status: "blocked",
        detail:
          "This checkpoint does not mutate third-party systems, call AI models, or send customer messages.",
      },
      {
        id: "no-approve-reject-recovery-audit-persistence",
        label: "Approve/reject, recovery execution, and audit persistence blocked",
        status: "blocked",
        detail:
          "This checkpoint does not approve, reject, execute recovery, execute rollback, or persist audit events.",
      },
    ],
    accessUnlockPrerequisiteCheckpoint: [
      {
        id: "owner-approval-required",
        label: "Owner approval",
        status: "required",
        detail:
          "Future access unlock requires explicit owner approval before customer-impacting behavior is considered.",
      },
      {
        id: "read-only-entitlement-verification-required",
        label: "Read-only entitlement verification",
        status: "required",
        detail:
          "Future access unlock requires safe read-only subscription and entitlement verification.",
      },
      {
        id: "safe-stop-required",
        label: "Safe Stop",
        status: "required",
        detail:
          "Any uncertainty must stop the unlock path and keep the subscription boundary locked.",
      },
      {
        id: "manual-escalation-required",
        label: "Manual Escalation",
        status: "required",
        detail:
          "Conflicts, ambiguity, billing requests, or customer-impacting requests must escalate to owner review.",
      },
    ],
    manualEscalationCheckpoint: [
      {
        id: "subscription-status-unknown",
        label: "Subscription status unknown",
        status: "required",
        detail:
          "Escalate to owner when subscription status cannot be safely confirmed.",
      },
      {
        id: "entitlement-scope-incomplete",
        label: "Entitlement scope incomplete",
        status: "required",
        detail:
          "Escalate to owner when entitlement scope is incomplete, conflicting, or unclear.",
      },
      {
        id: "customer-impacting-access",
        label: "Customer-impacting access requested",
        status: "required",
        detail:
          "Escalate before any future access that could affect customers, business records, orders, messages, or outcomes.",
      },
      {
        id: "billing-or-subscription-mutation-requested",
        label: "Billing or subscription mutation requested",
        status: "required",
        detail:
          "Escalate if payment, invoice, subscription activation, subscription mutation, or entitlement write is requested.",
      },
    ],
    auditFallbackRollbackCheckpoint: [
      {
        id: "audit-readiness-only",
        label: "Audit readiness only",
        status: "confirmed",
        detail:
          "This checkpoint is reviewable but does not persist audit events.",
      },
      {
        id: "fallback-to-locked",
        label: "Fallback to locked state",
        status: "confirmed",
        detail:
          "If status is uncertain, NEXUS remains locked instead of executing.",
      },
      {
        id: "rollback-planning-only",
        label: "Rollback planning only",
        status: "confirmed",
        detail:
          "Rollback readiness is tracked as a planning requirement only; no rollback execution occurs.",
      },
      {
        id: "manual-owner-review-path",
        label: "Manual owner review path",
        status: "confirmed",
        detail:
          "Owner review remains the safe resolution path for future unlock ambiguity.",
      },
    ],
    finalCheckpointConclusion:
      status === "checkpoint-ready"
        ? "Controlled paid pilot subscription lock boundary checkpoint is ready for planning continuation. Subscription lock remains locked-by-default, owner-controlled, read-only, and non-executing."
        : "Controlled paid pilot subscription lock boundary checkpoint is blocked. Manual owner review is required before continuation.",
    nextRecommendedStep:
      status === "checkpoint-ready"
        ? "Day 228: NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Review v1"
        : "Stop and manually review subscription lock boundary checkpoint failure before continuing.",
  };
}
