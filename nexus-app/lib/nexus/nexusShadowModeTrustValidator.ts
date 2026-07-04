import {
  nexusShadowModeTrustContract,
  type NexusShadowModeTrustContract,
} from "./nexusShadowModeTrustContract";

export type NexusShadowModeTrustValidationResult = {
  day: 102;
  name: "NEXUS Shadow Mode Trust Validator v1";
  phase: "Trust + Pilot Readiness";
  mode: "shadow-mode-validator-preview-only";
  valid: boolean;
  passed: string[];
  failed: string[];
  checkedAt: string;
  safetySummary: {
    readOnly: true;
    previewOnly: true;
    executionBlocked: boolean;
    writesBlocked: boolean;
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

const requiredBlockedActions = [
  "send_message",
  "charge_payment",
  "approve_action",
  "reject_action",
  "write_customer_data",
  "read_real_customer_memory",
  "write_real_customer_memory",
  "persist_audit_event",
  "execute_recovery",
  "call_ai_model",
  "mutate_third_party_system",
] as const;

const requiredPreviewSignals = [
  "simulated_customer_intent",
  "simulated_business_risk",
  "simulated_owner_review_need",
  "simulated_memory_context_need",
  "simulated_fallback_need",
  "simulated_audit_visibility_need",
  "simulated_subscription_lock_need",
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

export function validateNexusShadowModeTrustContract(
  contract: NexusShadowModeTrustContract = nexusShadowModeTrustContract
): NexusShadowModeTrustValidationResult {
  const passed: string[] = [];
  const failed: string[] = [];

  passOrFail(contract.day === 101, "Day 101 source contract is present", passed, failed);
  passOrFail(contract.phase === "Trust + Pilot Readiness", "Trust + Pilot Readiness phase is locked", passed, failed);
  passOrFail(contract.mode === "shadow-mode-preview-only", "Shadow Mode is preview-only", passed, failed);
  passOrFail(contract.visionLock.notAChatbot, "NEXUS is not a chatbot", passed, failed);
  passOrFail(contract.visionLock.notACrmClone, "NEXUS is not a CRM clone", passed, failed);
  passOrFail(contract.visionLock.notAnErpClone, "NEXUS is not an ERP clone", passed, failed);
  passOrFail(contract.visionLock.notAMakeZapierClone, "NEXUS is not a Make/Zapier clone", passed, failed);
  passOrFail(contract.visionLock.worksAboveExistingBusinessSoftware, "NEXUS works above existing business software", passed, failed);
  passOrFail(contract.trustRules.readOnlyPilotDiscipline, "Read-only pilot discipline is required", passed, failed);
  passOrFail(contract.trustRules.ownerApprovalRequiredForRisk, "Owner approval is required for risk", passed, failed);
  passOrFail(contract.trustRules.zeroDamage, "Zero Damage is required", passed, failed);
  passOrFail(contract.trustRules.zeroStop, "Zero Stop is required", passed, failed);
  passOrFail(contract.trustRules.auditVisible, "Audit visibility is required", passed, failed);
  passOrFail(contract.trustRules.fallbackRecoveryVisible, "Fallback/recovery visibility is required", passed, failed);
  passOrFail(contract.trustRules.subscriptionLockVisible, "Subscription Lock visibility is required", passed, failed);
  passOrFail(contract.trustRules.monetizationDiscipline, "Monetization discipline is required", passed, failed);
  passOrFail(contract.executionBlocks.noRealCustomerDataWrite, "Real customer data writes are blocked", passed, failed);
  passOrFail(contract.executionBlocks.noRealDbMemoryRead, "Real DB memory reads are blocked", passed, failed);
  passOrFail(contract.executionBlocks.noRealDbMemoryWrite, "Real DB memory writes are blocked", passed, failed);
  passOrFail(contract.executionBlocks.noAuditPersistence, "Audit persistence is blocked", passed, failed);
  passOrFail(contract.executionBlocks.noRecoveryExecution, "Recovery execution is blocked", passed, failed);
  passOrFail(contract.executionBlocks.noApproveRejectExecution, "Approve/reject execution is blocked", passed, failed);
  passOrFail(contract.executionBlocks.noPaymentExecution, "Payment execution is blocked", passed, failed);
  passOrFail(contract.executionBlocks.noMessageSending, "Message sending is blocked", passed, failed);
  passOrFail(contract.executionBlocks.noAiModelCalls, "AI model calls are blocked", passed, failed);
  passOrFail(contract.executionBlocks.noThirdPartyMutation, "Third-party mutation is blocked", passed, failed);

  for (const action of requiredBlockedActions) {
    passOrFail(
      contract.blockedProductionActions.includes(action),
      `Blocked production action confirmed: ${action}`,
      passed,
      failed
    );
  }

  for (const signal of requiredPreviewSignals) {
    passOrFail(
      contract.allowedPreviewSignals.includes(signal),
      `Allowed preview signal confirmed: ${signal}`,
      passed,
      failed
    );
  }

  const executionBlocked =
    contract.executionBlocks.noApproveRejectExecution &&
    contract.executionBlocks.noPaymentExecution &&
    contract.executionBlocks.noMessageSending &&
    contract.executionBlocks.noRecoveryExecution &&
    contract.executionBlocks.noAiModelCalls &&
    contract.executionBlocks.noThirdPartyMutation;

  const writesBlocked =
    contract.executionBlocks.noRealCustomerDataWrite &&
    contract.executionBlocks.noRealDbMemoryWrite &&
    contract.executionBlocks.noAuditPersistence;

  return {
    day: 102,
    name: "NEXUS Shadow Mode Trust Validator v1",
    phase: "Trust + Pilot Readiness",
    mode: "shadow-mode-validator-preview-only",
    valid: failed.length === 0,
    passed,
    failed,
    checkedAt: "preview-only-static-validation",
    safetySummary: {
      readOnly: true,
      previewOnly: true,
      executionBlocked,
      writesBlocked,
      realCustomerDataBlocked: contract.executionBlocks.noRealCustomerDataWrite,
      realDbMemoryBlocked:
        contract.executionBlocks.noRealDbMemoryRead && contract.executionBlocks.noRealDbMemoryWrite,
      auditPersistenceBlocked: contract.executionBlocks.noAuditPersistence,
      recoveryExecutionBlocked: contract.executionBlocks.noRecoveryExecution,
      approveRejectExecutionBlocked: contract.executionBlocks.noApproveRejectExecution,
      paymentExecutionBlocked: contract.executionBlocks.noPaymentExecution,
      messageSendingBlocked: contract.executionBlocks.noMessageSending,
      aiModelCallsBlocked: contract.executionBlocks.noAiModelCalls,
      thirdPartyMutationBlocked: contract.executionBlocks.noThirdPartyMutation,
    },
  };
}

export const nexusShadowModeTrustValidation =
  validateNexusShadowModeTrustContract();
