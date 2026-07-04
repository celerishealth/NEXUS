import {
  nexusPilotTrustEvidenceContract,
  type NexusPilotTrustEvidenceContract,
} from "./nexusPilotTrustEvidenceContract";

export type NexusPilotTrustEvidenceValidationResult = {
  day: 107;
  name: "NEXUS Pilot Trust Evidence Validator v1";
  phase: "Trust + Pilot Readiness";
  mode: "pilot-trust-evidence-validator-preview-only";
  valid: boolean;
  passed: string[];
  failed: string[];
  checkedAt: string;
  evidenceSummary: {
    evidenceAllowedNow: boolean;
    realPilotAllowedNow: boolean;
    realExecutionAllowedNow: boolean;
    ownerDecisionRequiredBeforeRealPilot: boolean;
    allEvidencePreviewOnly: boolean;
    allEvidenceExecutionBlocked: boolean;
  };
  safetySummary: {
    readOnly: true;
    previewOnly: true;
    realPilotBlocked: boolean;
    realExecutionBlocked: boolean;
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

const requiredEvidenceCategories = [
  "Owner Control Evidence",
  "Safety Layer Evidence",
  "Blocked Execution Evidence",
  "Customer Memory Boundary Evidence",
  "Audit Visibility Evidence",
  "Fallback Recovery Boundary Evidence",
  "Subscription Lock Evidence",
] as const;

const requiredBlockedEvidenceActions = [
  "use_real_customer_data",
  "read_real_customer_memory",
  "write_real_customer_memory",
  "write_real_customer_data",
  "persist_real_audit_evidence",
  "execute_real_recovery",
  "approve_real_action",
  "reject_real_action",
  "send_real_message",
  "charge_real_payment",
  "call_live_ai_model",
  "mutate_real_third_party_system",
  "start_real_pilot",
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

export function validateNexusPilotTrustEvidenceContract(
  contract: NexusPilotTrustEvidenceContract = nexusPilotTrustEvidenceContract
): NexusPilotTrustEvidenceValidationResult {
  const passed: string[] = [];
  const failed: string[] = [];

  passOrFail(contract.day === 106, "Day 106 source contract is present", passed, failed);
  passOrFail(contract.phase === "Trust + Pilot Readiness", "Trust + Pilot Readiness phase is locked", passed, failed);
  passOrFail(contract.mode === "pilot-trust-evidence-preview-only", "Pilot trust evidence mode is preview-only", passed, failed);
  passOrFail(Boolean(contract.evidencePosition.evidenceAllowedNow), "Trust evidence is allowed now as preview only", passed, failed);
  passOrFail(!contract.evidencePosition.realPilotAllowedNow, "Real pilot remains blocked", passed, failed);
  passOrFail(!contract.evidencePosition.realExecutionAllowedNow, "Real execution remains blocked", passed, failed);
  passOrFail(Boolean(contract.evidencePosition.ownerDecisionRequiredBeforeRealPilot), "Owner decision is required before any real pilot", passed, failed);

  for (const category of requiredEvidenceCategories) {
    const match = contract.evidenceCategories.find((item) => item.category === category);
    passOrFail(Boolean(match), `Evidence category present: ${category}`, passed, failed);
    passOrFail(Boolean(match?.visibleInShadowMode), `Evidence category visible in Shadow Mode: ${category}`, passed, failed);
    passOrFail(!match?.executionAllowed, `Evidence category execution blocked: ${category}`, passed, failed);
  }

  const allEvidencePreviewOnly = contract.pilotTrustQuestions.every(
    (item) => item.proofMode === "preview-only"
  );
  const allEvidenceExecutionBlocked = contract.evidenceCategories.every(
    (item) => item.visibleInShadowMode && !item.executionAllowed
  );

  passOrFail(allEvidencePreviewOnly, "All pilot trust questions use preview-only proof mode", passed, failed);
  passOrFail(allEvidenceExecutionBlocked, "All evidence categories block execution", passed, failed);
  passOrFail(contract.evidenceBoundaries.canShowReadOnlySafetyPosture, "Read-only safety posture can be shown", passed, failed);
  passOrFail(contract.evidenceBoundaries.canShowBlockedExecutionPosture, "Blocked execution posture can be shown", passed, failed);
  passOrFail(contract.evidenceBoundaries.canShowOwnerControlPosture, "Owner control posture can be shown", passed, failed);
  passOrFail(contract.evidenceBoundaries.canShowAuditVisibilityPosture, "Audit visibility posture can be shown", passed, failed);
  passOrFail(contract.evidenceBoundaries.canShowCustomerMemoryBoundary, "Customer Memory boundary can be shown", passed, failed);
  passOrFail(contract.evidenceBoundaries.canShowFallbackRecoveryBoundary, "Fallback/recovery boundary can be shown", passed, failed);
  passOrFail(contract.evidenceBoundaries.canShowSubscriptionLockBoundary, "Subscription Lock boundary can be shown", passed, failed);
  passOrFail(contract.evidenceBoundaries.cannotUseRealCustomerData, "Real customer data cannot be used", passed, failed);
  passOrFail(contract.evidenceBoundaries.cannotPersistAuditEvidence, "Audit evidence persistence is blocked", passed, failed);
  passOrFail(contract.evidenceBoundaries.cannotExecutePilotAction, "Pilot action execution is blocked", passed, failed);

  for (const action of requiredBlockedEvidenceActions) {
    passOrFail(
      contract.blockedEvidenceActions.includes(action),
      `Blocked evidence action confirmed: ${action}`,
      passed,
      failed
    );
  }

  passOrFail(contract.safetySummary.readOnly, "Read-only safety summary confirmed", passed, failed);
  passOrFail(contract.safetySummary.previewOnly, "Preview-only safety summary confirmed", passed, failed);
  passOrFail(contract.safetySummary.noRealCustomerDataWrite, "Real customer data writes are blocked", passed, failed);
  passOrFail(contract.safetySummary.noRealDbMemoryRead, "Real DB memory reads are blocked", passed, failed);
  passOrFail(contract.safetySummary.noRealDbMemoryWrite, "Real DB memory writes are blocked", passed, failed);
  passOrFail(contract.safetySummary.noAuditPersistence, "Audit persistence is blocked", passed, failed);
  passOrFail(contract.safetySummary.noRecoveryExecution, "Recovery execution is blocked", passed, failed);
  passOrFail(contract.safetySummary.noApproveRejectExecution, "Approve/reject execution is blocked", passed, failed);
  passOrFail(contract.safetySummary.noPaymentExecution, "Payment execution is blocked", passed, failed);
  passOrFail(contract.safetySummary.noMessageSending, "Message sending is blocked", passed, failed);
  passOrFail(contract.safetySummary.noAiModelCalls, "AI model calls are blocked", passed, failed);
  passOrFail(contract.safetySummary.noThirdPartyMutation, "Third-party mutation is blocked", passed, failed);

  return {
    day: 107,
    name: "NEXUS Pilot Trust Evidence Validator v1",
    phase: "Trust + Pilot Readiness",
    mode: "pilot-trust-evidence-validator-preview-only",
    valid: failed.length === 0,
    passed,
    failed,
    checkedAt: "preview-only-static-validation",
    evidenceSummary: {
      evidenceAllowedNow: Boolean(contract.evidencePosition.evidenceAllowedNow),
      realPilotAllowedNow: Boolean(contract.evidencePosition.realPilotAllowedNow),
      realExecutionAllowedNow: Boolean(contract.evidencePosition.realExecutionAllowedNow),
      ownerDecisionRequiredBeforeRealPilot: Boolean(
        contract.evidencePosition.ownerDecisionRequiredBeforeRealPilot
      ),
      allEvidencePreviewOnly,
      allEvidenceExecutionBlocked,
    },
    safetySummary: {
      readOnly: true,
      previewOnly: true,
      realPilotBlocked: !contract.evidencePosition.realPilotAllowedNow,
      realExecutionBlocked: !contract.evidencePosition.realExecutionAllowedNow,
      realCustomerDataBlocked: contract.safetySummary.noRealCustomerDataWrite,
      realDbMemoryBlocked:
        contract.safetySummary.noRealDbMemoryRead &&
        contract.safetySummary.noRealDbMemoryWrite,
      auditPersistenceBlocked: contract.safetySummary.noAuditPersistence,
      recoveryExecutionBlocked: contract.safetySummary.noRecoveryExecution,
      approveRejectExecutionBlocked: contract.safetySummary.noApproveRejectExecution,
      paymentExecutionBlocked: contract.safetySummary.noPaymentExecution,
      messageSendingBlocked: contract.safetySummary.noMessageSending,
      aiModelCallsBlocked: contract.safetySummary.noAiModelCalls,
      thirdPartyMutationBlocked: contract.safetySummary.noThirdPartyMutation,
    },
  };
}

export const nexusPilotTrustEvidenceValidation =
  validateNexusPilotTrustEvidenceContract();
