import {
  nexusPilotReadinessContract,
  type NexusPilotReadinessContract,
} from "./nexusPilotReadinessContract";

export type NexusPilotReadinessValidationResult = {
  day: 104;
  name: "NEXUS Pilot Readiness Validator v1";
  phase: "Trust + Pilot Readiness";
  mode: "pilot-readiness-validator-preview-only";
  valid: boolean;
  passed: string[];
  failed: string[];
  checkedAt: string;
  readinessSummary: {
    pilotAllowedNow: boolean;
    shadowModeAllowedNow: boolean;
    realExecutionAllowedNow: boolean;
    readyForShadowModePreview: boolean;
    readyForRealPilot: boolean;
  };
  safetySummary: {
    readOnly: true;
    previewOnly: true;
    pilotExecutionBlocked: boolean;
    realExecutionBlocked: boolean;
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

const requiredBeforePilot = [
  "Real tenant isolation architecture",
  "Real customer data access policy",
  "Owner approval enforcement architecture",
  "Persistent audit storage policy",
  "Recovery execution policy",
  "External system mutation boundary",
  "Message sending boundary",
  "Payment execution boundary",
  "Subscription enforcement boundary",
  "Live AI model call boundary",
  "Pilot rollback and emergency stop plan",
] as const;

const requiredAllowedPreviewCapabilities = [
  "show_shadow_mode_status",
  "show_read_only_trust_controls",
  "show_owner_approval_requirement",
  "show_safety_layer_posture",
  "show_audit_visibility_requirement",
  "show_customer_memory_preview_boundary",
  "show_fallback_recovery_requirement",
  "show_subscription_lock_requirement",
  "show_blocked_execution_summary",
] as const;

const requiredBlockedPilotCapabilities = [
  "start_real_pilot",
  "approve_real_action",
  "reject_real_action",
  "send_real_message",
  "charge_real_payment",
  "read_real_customer_memory",
  "write_real_customer_memory",
  "write_real_customer_data",
  "persist_real_audit_event",
  "execute_real_recovery",
  "call_live_ai_model",
  "mutate_real_third_party_system",
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

export function validateNexusPilotReadinessContract(
  contract: NexusPilotReadinessContract = nexusPilotReadinessContract
): NexusPilotReadinessValidationResult {
  const passed: string[] = [];
  const failed: string[] = [];

  passOrFail(contract.day === 103, "Day 103 source contract is present", passed, failed);
  passOrFail(contract.phase === "Trust + Pilot Readiness", "Trust + Pilot Readiness phase is locked", passed, failed);
  passOrFail(contract.mode === "pilot-readiness-preview-only", "Pilot Readiness mode is preview-only", passed, failed);
  passOrFail(contract.readinessPosition.pilotAllowedNow === false, "Real pilot is not allowed now", passed, failed);
  passOrFail(contract.readinessPosition.shadowModeAllowedNow === true, "Shadow Mode is allowed now", passed, failed);
  passOrFail(contract.readinessPosition.realExecutionAllowedNow === false, "Real execution is not allowed now", passed, failed);

  passOrFail(contract.trustControls.ownerApprovalVisible === true, "Owner approval visibility is enabled", passed, failed);
  passOrFail(contract.trustControls.ownerApprovalExecutable === false, "Owner approval execution is blocked", passed, failed);
  passOrFail(contract.trustControls.safetyLayerVisible === true, "Safety Layer visibility is enabled", passed, failed);
  passOrFail(contract.trustControls.auditLogsVisible === true, "Audit log visibility is enabled", passed, failed);
  passOrFail(contract.trustControls.auditPersistenceEnabled === false, "Audit persistence is blocked", passed, failed);
  passOrFail(contract.trustControls.customerMemoryPreviewVisible === true, "Customer Memory preview visibility is enabled", passed, failed);
  passOrFail(contract.trustControls.realCustomerMemoryReadEnabled === false, "Real Customer Memory reads are blocked", passed, failed);
  passOrFail(contract.trustControls.realCustomerMemoryWriteEnabled === false, "Real Customer Memory writes are blocked", passed, failed);
  passOrFail(contract.trustControls.fallbackRecoveryVisible === true, "Fallback/recovery visibility is enabled", passed, failed);
  passOrFail(contract.trustControls.fallbackRecoveryExecutable === false, "Fallback/recovery execution is blocked", passed, failed);
  passOrFail(contract.trustControls.subscriptionLockVisible === true, "Subscription Lock visibility is enabled", passed, failed);
  passOrFail(contract.trustControls.paymentExecutionEnabled === false, "Payment execution is blocked", passed, failed);
  passOrFail(contract.trustControls.messageSendingEnabled === false, "Message sending is blocked", passed, failed);
  passOrFail(contract.trustControls.aiModelCallsEnabled === false, "AI model calls are blocked", passed, failed);
  passOrFail(contract.trustControls.thirdPartyMutationEnabled === false, "Third-party mutation is blocked", passed, failed);

  for (const requirement of requiredBeforePilot) {
    passOrFail(
      contract.requiredBeforePilot.includes(requirement),
      `Required before pilot confirmed: ${requirement}`,
      passed,
      failed
    );
  }

  for (const capability of requiredAllowedPreviewCapabilities) {
    passOrFail(
      contract.allowedPilotPreviewCapabilities.includes(capability),
      `Allowed preview capability confirmed: ${capability}`,
      passed,
      failed
    );
  }

  for (const capability of requiredBlockedPilotCapabilities) {
    passOrFail(
      contract.blockedPilotCapabilities.includes(capability),
      `Blocked pilot capability confirmed: ${capability}`,
      passed,
      failed
    );
  }

  const hasPreviewReadyGate = contract.pilotReadinessGates.some(
    (gate) => gate.status === "ready-preview-only" && gate.executionSafe === true
  );

  const hasArchitectureBlockedGate = contract.pilotReadinessGates.some(
    (gate) =>
      gate.status === "blocked-until-real-architecture" && gate.executionSafe === false
  );

  passOrFail(hasPreviewReadyGate, "At least one safe preview gate is ready", passed, failed);
  passOrFail(hasArchitectureBlockedGate, "Real architecture blocked gates are present", passed, failed);

  const pilotExecutionBlocked =
    contract.readinessPosition.pilotAllowedNow === false &&
    contract.readinessPosition.realExecutionAllowedNow === false;

  const writesBlocked =
    contract.trustControls.realCustomerMemoryWriteEnabled === false &&
    contract.trustControls.auditPersistenceEnabled === false;

  const readyForShadowModePreview =
    contract.readinessPosition.shadowModeAllowedNow === true &&
    hasPreviewReadyGate &&
    pilotExecutionBlocked;

  const readyForRealPilot = false;

  return {
    day: 104,
    name: "NEXUS Pilot Readiness Validator v1",
    phase: "Trust + Pilot Readiness",
    mode: "pilot-readiness-validator-preview-only",
    valid: failed.length === 0 && readyForShadowModePreview && readyForRealPilot === false,
    passed,
    failed,
    checkedAt: "preview-only-static-validation",
    readinessSummary: {
      pilotAllowedNow: contract.readinessPosition.pilotAllowedNow,
      shadowModeAllowedNow: contract.readinessPosition.shadowModeAllowedNow,
      realExecutionAllowedNow: contract.readinessPosition.realExecutionAllowedNow,
      readyForShadowModePreview,
      readyForRealPilot,
    },
    safetySummary: {
      readOnly: true,
      previewOnly: true,
      pilotExecutionBlocked,
      realExecutionBlocked: contract.readinessPosition.realExecutionAllowedNow === false,
      writesBlocked,
      realCustomerDataBlocked: true,
      realDbMemoryBlocked:
        contract.trustControls.realCustomerMemoryReadEnabled === false &&
        contract.trustControls.realCustomerMemoryWriteEnabled === false,
      auditPersistenceBlocked: contract.trustControls.auditPersistenceEnabled === false,
      recoveryExecutionBlocked: contract.trustControls.fallbackRecoveryExecutable === false,
      approveRejectExecutionBlocked: contract.trustControls.ownerApprovalExecutable === false,
      paymentExecutionBlocked: contract.trustControls.paymentExecutionEnabled === false,
      messageSendingBlocked: contract.trustControls.messageSendingEnabled === false,
      aiModelCallsBlocked: contract.trustControls.aiModelCallsEnabled === false,
      thirdPartyMutationBlocked: contract.trustControls.thirdPartyMutationEnabled === false,
    },
  };
}

export const nexusPilotReadinessValidation =
  validateNexusPilotReadinessContract();

