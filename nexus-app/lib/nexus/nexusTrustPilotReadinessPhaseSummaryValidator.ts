import {
  nexusTrustPilotReadinessPhaseSummary,
  type NexusTrustPilotReadinessPhaseSummary,
} from "./nexusTrustPilotReadinessPhaseSummary";

export type NexusTrustPilotReadinessPhaseSummaryValidationResult = {
  day: 120;
  name: "NEXUS Trust + Pilot Readiness Phase Summary Validator v1";
  phase: "Trust + Pilot Readiness";
  mode: "trust-pilot-readiness-phase-summary-validator-preview-only";
  valid: boolean;
  passed: string[];
  failed: string[];
  checkedAt: string;
  phaseSummaryIntegrity: {
    coversDay101ToDay118: boolean;
    shadowModeTrustReady: boolean;
    pilotTrustEvidenceReady: boolean;
    readOnlyPilotOnboardingReady: boolean;
    dashboardPreviewReady: boolean;
    realPilotBlocked: boolean;
    realExecutionBlocked: boolean;
    nextPhasePlanningOnly: boolean;
    allCompletedBlocksSafe: boolean;
  };
  safetySummary: {
    readOnly: true;
    previewOnly: true;
    realCustomerDataBlocked: boolean;
    realDbMemoryBlocked: boolean;
    auditPersistenceBlocked: boolean;
    recoveryExecutionBlocked: boolean;
    approveRejectExecutionBlocked: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    aiModelCallsBlocked: boolean;
    thirdPartyMutationBlocked: boolean;
  };
};

const requiredCompletedBlocks = [
  "Shadow Mode Trust Contract, Validator, and Summary",
  "Pilot Trust Evidence Contract, Validator, and Summary",
  "Read-Only Pilot Onboarding Contract, Validator, and Summary",
  "Trust + Pilot Readiness Checkpoint",
  "Trust + Pilot Readiness Dashboard Contract, Validator, Summary, Preview UI, Preview Validator, and Checkpoint",
] as const;

const requiredAllowedNow = [
  "view_shadow_mode_trust_preview",
  "view_pilot_trust_evidence_preview",
  "view_read_only_pilot_onboarding_preview",
  "view_trust_pilot_readiness_dashboard_preview",
  "view_blocked_real_pilot_reasons",
  "view_required_real_architecture_before_pilot",
] as const;

const requiredBlockedUntilRealArchitecture = [
  "real_tenant_creation",
  "real_customer_data_connection",
  "real_customer_memory_read",
  "real_customer_memory_write",
  "real_customer_data_write",
  "real_audit_persistence",
  "real_recovery_execution",
  "real_approve_reject_execution",
  "real_payment_execution",
  "real_message_sending",
  "live_ai_model_call",
  "real_third_party_mutation",
  "real_pilot_start",
] as const;

const requiredBeforeRealPilot = [
  "Real tenant isolation architecture",
  "Real customer data access policy",
  "Owner approval enforcement architecture",
  "Persistent audit storage policy",
  "Recovery execution policy",
  "Message sending boundary",
  "Payment execution boundary",
  "Subscription enforcement boundary",
  "Live AI model call boundary",
  "Third-party mutation boundary",
  "Pilot rollback and emergency stop plan",
] as const;

function passOrFail(
  condition: boolean,
  label: string,
  passed: string[],
  failed: string[]
) {
  if (condition) {
    passed.push(label);
  } else {
    failed.push(label);
  }
}

export function validateNexusTrustPilotReadinessPhaseSummary(
  summary: NexusTrustPilotReadinessPhaseSummary = nexusTrustPilotReadinessPhaseSummary
): NexusTrustPilotReadinessPhaseSummaryValidationResult {
  const passed: string[] = [];
  const failed: string[] = [];

  passOrFail(summary.day === 119, "Day 119 phase summary source is present", passed, failed);
  passOrFail(summary.phase === "Trust + Pilot Readiness", "Trust + Pilot Readiness phase is locked", passed, failed);
  passOrFail(summary.mode === "trust-pilot-readiness-phase-summary-preview-only", "Phase summary mode is preview-only", passed, failed);
  passOrFail(Boolean(summary.phaseScope.coversDay101ToDay118), "Phase summary covers Day 101 through Day 118", passed, failed);
  passOrFail(Boolean(summary.phaseScope.shadowModeTrustReady), "Shadow Mode Trust is ready", passed, failed);
  passOrFail(Boolean(summary.phaseScope.pilotTrustEvidenceReady), "Pilot Trust Evidence is ready", passed, failed);
  passOrFail(Boolean(summary.phaseScope.readOnlyPilotOnboardingReady), "Read-Only Pilot Onboarding is ready", passed, failed);
  passOrFail(Boolean(summary.phaseScope.dashboardPreviewReady), "Dashboard preview is ready", passed, failed);
  passOrFail(Boolean(summary.phaseScope.realPilotBlocked), "Real pilot remains blocked", passed, failed);
  passOrFail(Boolean(summary.phaseScope.realExecutionBlocked), "Real execution remains blocked", passed, failed);

  for (const block of requiredCompletedBlocks) {
    const match = summary.completedPhaseBlocks.find((item) => item.block === block);
    passOrFail(Boolean(match), `Completed phase block present: ${block}`, passed, failed);
    passOrFail(match?.status === "complete-preview-only", `Completed phase block is preview-only: ${block}`, passed, failed);
    passOrFail(Boolean(match?.safe), `Completed phase block is safe: ${block}`, passed, failed);
  }

  const allCompletedBlocksSafe = summary.completedPhaseBlocks.every(
    (block) => block.status === "complete-preview-only" && Boolean(block.safe)
  );

  passOrFail(allCompletedBlocksSafe, "All completed phase blocks are safe and preview-only", passed, failed);

  for (const allowed of requiredAllowedNow) {
    passOrFail(
      summary.allowedNow.includes(allowed),
      `Allowed preview capability confirmed: ${allowed}`,
      passed,
      failed
    );
  }

  for (const blocked of requiredBlockedUntilRealArchitecture) {
    passOrFail(
      summary.blockedUntilRealArchitecture.includes(blocked),
      `Blocked until real architecture confirmed: ${blocked}`,
      passed,
      failed
    );
  }

  for (const requirement of requiredBeforeRealPilot) {
    passOrFail(
      summary.requiredBeforeRealPilot.includes(requirement),
      `Required before real pilot confirmed: ${requirement}`,
      passed,
      failed
    );
  }

  passOrFail(
    summary.nextRecommendedArchitecturePhase.name === "Real Pilot Architecture Boundary Planning",
    "Next phase is Real Pilot Architecture Boundary Planning",
    passed,
    failed
  );
  passOrFail(
    !Boolean(summary.nextRecommendedArchitecturePhase.allowedToExecuteNow),
    "Next phase is planning-only and not executable now",
    passed,
    failed
  );

  passOrFail(Boolean(summary.safetySummary.readOnly), "Read-only safety summary confirmed", passed, failed);
  passOrFail(Boolean(summary.safetySummary.previewOnly), "Preview-only safety summary confirmed", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noRealCustomerDataWrite), "Real customer data writes are blocked", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noRealDbMemoryRead), "Real DB memory reads are blocked", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noRealDbMemoryWrite), "Real DB memory writes are blocked", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noAuditPersistence), "Audit persistence is blocked", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noRecoveryExecution), "Recovery execution is blocked", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noApproveRejectExecution), "Approve/reject execution is blocked", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noPaymentExecution), "Payment execution is blocked", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noMessageSending), "Message sending is blocked", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noAiModelCalls), "AI model calls are blocked", passed, failed);
  passOrFail(Boolean(summary.safetySummary.noThirdPartyMutation), "Third-party mutation is blocked", passed, failed);

  return {
    day: 120,
    name: "NEXUS Trust + Pilot Readiness Phase Summary Validator v1",
    phase: "Trust + Pilot Readiness",
    mode: "trust-pilot-readiness-phase-summary-validator-preview-only",
    valid: failed.length === 0,
    passed,
    failed,
    checkedAt: "preview-only-static-validation",
    phaseSummaryIntegrity: {
      coversDay101ToDay118: Boolean(summary.phaseScope.coversDay101ToDay118),
      shadowModeTrustReady: Boolean(summary.phaseScope.shadowModeTrustReady),
      pilotTrustEvidenceReady: Boolean(summary.phaseScope.pilotTrustEvidenceReady),
      readOnlyPilotOnboardingReady: Boolean(summary.phaseScope.readOnlyPilotOnboardingReady),
      dashboardPreviewReady: Boolean(summary.phaseScope.dashboardPreviewReady),
      realPilotBlocked: Boolean(summary.phaseScope.realPilotBlocked),
      realExecutionBlocked: Boolean(summary.phaseScope.realExecutionBlocked),
      nextPhasePlanningOnly: !Boolean(summary.nextRecommendedArchitecturePhase.allowedToExecuteNow),
      allCompletedBlocksSafe,
    },
    safetySummary: {
      readOnly: true,
      previewOnly: true,
      realCustomerDataBlocked: Boolean(summary.safetySummary.noRealCustomerDataWrite),
      realDbMemoryBlocked:
        Boolean(summary.safetySummary.noRealDbMemoryRead) &&
        Boolean(summary.safetySummary.noRealDbMemoryWrite),
      auditPersistenceBlocked: Boolean(summary.safetySummary.noAuditPersistence),
      recoveryExecutionBlocked: Boolean(summary.safetySummary.noRecoveryExecution),
      approveRejectExecutionBlocked: Boolean(summary.safetySummary.noApproveRejectExecution),
      paymentExecutionBlocked: Boolean(summary.safetySummary.noPaymentExecution),
      messageSendingBlocked: Boolean(summary.safetySummary.noMessageSending),
      aiModelCallsBlocked: Boolean(summary.safetySummary.noAiModelCalls),
      thirdPartyMutationBlocked: Boolean(summary.safetySummary.noThirdPartyMutation),
    },
  };
}

export const nexusTrustPilotReadinessPhaseSummaryValidation =
  validateNexusTrustPilotReadinessPhaseSummary();
