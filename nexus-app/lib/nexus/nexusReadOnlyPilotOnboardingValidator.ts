import {
  nexusReadOnlyPilotOnboardingContract,
  type NexusReadOnlyPilotOnboardingContract,
} from "./nexusReadOnlyPilotOnboardingContract";

export type NexusReadOnlyPilotOnboardingValidationResult = {
  day: 110;
  name: "NEXUS Read-Only Pilot Onboarding Validator v1";
  phase: "Trust + Pilot Readiness";
  mode: "read-only-pilot-onboarding-validator-preview-only";
  valid: boolean;
  passed: string[];
  failed: string[];
  checkedAt: string;
  onboardingSummary: {
    onboardingPreviewAllowedNow: boolean;
    realPilotAllowedNow: boolean;
    realExecutionAllowedNow: boolean;
    ownerDecisionRequiredBeforePilot: boolean;
    businessFitPreviewOnly: boolean;
    ownerTrustPreviewOnly: boolean;
    realPilotBoundariesBlocked: boolean;
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

const requiredBusinessFitItems = [
  "Business uses existing software NEXUS can operate above",
  "Owner accepts NEXUS as control layer, not chatbot/CRM/ERP replacement",
  "Business can start with Shadow Mode trust review",
  "Risky actions can remain owner-controlled",
  "Pilot can be measured without live mutation",
] as const;

const requiredOwnerTrustItems = [
  "Owner Approval visible before any future risky action",
  "Safety Layer visible before pilot",
  "Audit visibility visible before persistence",
  "Customer Memory boundary visible before real DB access",
  "Fallback/Recovery boundary visible before recovery execution",
  "Subscription Lock boundary visible before payment/subscription execution",
] as const;

const requiredAllowedOnboardingPreview = [
  "show_business_fit_checklist",
  "show_owner_trust_checklist",
  "show_pilot_boundary_checklist",
  "show_shadow_mode_only_status",
  "show_blocked_real_pilot_status",
  "show_required_before_real_pilot",
] as const;

const requiredBlockedOnboardingActions = [
  "create_real_tenant",
  "connect_real_customer_data_source",
  "read_real_customer_memory",
  "write_real_customer_memory",
  "write_real_customer_data",
  "persist_real_audit_event",
  "execute_real_recovery",
  "approve_real_action",
  "reject_real_action",
  "send_real_message",
  "charge_real_payment",
  "activate_real_subscription",
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

export function validateNexusReadOnlyPilotOnboardingContract(
  contract: NexusReadOnlyPilotOnboardingContract = nexusReadOnlyPilotOnboardingContract
): NexusReadOnlyPilotOnboardingValidationResult {
  const passed: string[] = [];
  const failed: string[] = [];

  passOrFail(contract.day === 109, "Day 109 source contract is present", passed, failed);
  passOrFail(contract.phase === "Trust + Pilot Readiness", "Trust + Pilot Readiness phase is locked", passed, failed);
  passOrFail(contract.mode === "read-only-pilot-onboarding-preview-only", "Read-only pilot onboarding mode is preview-only", passed, failed);
  passOrFail(Boolean(contract.onboardingPosition.onboardingPreviewAllowedNow), "Onboarding preview is allowed now", passed, failed);
  passOrFail(!Boolean(contract.onboardingPosition.realPilotAllowedNow), "Real pilot onboarding remains blocked", passed, failed);
  passOrFail(!Boolean(contract.onboardingPosition.realExecutionAllowedNow), "Real execution remains blocked", passed, failed);
  passOrFail(Boolean(contract.onboardingPosition.ownerDecisionRequiredBeforePilot), "Owner decision is required before pilot", passed, failed);

  for (const item of requiredBusinessFitItems) {
    const match = contract.businessFitChecklist.find((entry) => entry.item === item);
    passOrFail(Boolean(match), `Business fit item present: ${item}`, passed, failed);
    passOrFail(Boolean(match?.required), `Business fit item required: ${item}`, passed, failed);
    passOrFail(Boolean(match?.previewOnly), `Business fit item preview-only: ${item}`, passed, failed);
    passOrFail(!Boolean(match?.executionAllowed), `Business fit item execution blocked: ${item}`, passed, failed);
  }

  for (const item of requiredOwnerTrustItems) {
    const match = contract.ownerTrustChecklist.find((entry) => entry.item === item);
    passOrFail(Boolean(match), `Owner trust item present: ${item}`, passed, failed);
    passOrFail(Boolean(match?.required), `Owner trust item required: ${item}`, passed, failed);
    passOrFail(Boolean(match?.previewOnly), `Owner trust item preview-only: ${item}`, passed, failed);
    passOrFail(!Boolean(match?.executionAllowed), `Owner trust item execution blocked: ${item}`, passed, failed);
  }

  const businessFitPreviewOnly = contract.businessFitChecklist.every(
    (item) =>
      Boolean(item.required) &&
      Boolean(item.previewOnly) &&
      !Boolean(item.executionAllowed)
  );

  const ownerTrustPreviewOnly = contract.ownerTrustChecklist.every(
    (item) =>
      Boolean(item.required) &&
      Boolean(item.previewOnly) &&
      !Boolean(item.executionAllowed)
  );

  const realPilotBoundariesBlocked = contract.pilotBoundaryChecklist
    .filter((item) => item.status === "blocked-until-approved-real-architecture")
    .every((item) => !Boolean(item.safeForShadowMode));

  passOrFail(businessFitPreviewOnly, "All business fit checklist items are preview-only and execution-blocked", passed, failed);
  passOrFail(ownerTrustPreviewOnly, "All owner trust checklist items are preview-only and execution-blocked", passed, failed);
  passOrFail(realPilotBoundariesBlocked, "All real pilot boundaries remain blocked until approved real architecture", passed, failed);

  for (const capability of requiredAllowedOnboardingPreview) {
    passOrFail(
      contract.allowedOnboardingPreview.includes(capability),
      `Allowed onboarding preview confirmed: ${capability}`,
      passed,
      failed
    );
  }

  for (const action of requiredBlockedOnboardingActions) {
    passOrFail(
      contract.blockedOnboardingActions.includes(action),
      `Blocked onboarding action confirmed: ${action}`,
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
    day: 110,
    name: "NEXUS Read-Only Pilot Onboarding Validator v1",
    phase: "Trust + Pilot Readiness",
    mode: "read-only-pilot-onboarding-validator-preview-only",
    valid: failed.length === 0,
    passed,
    failed,
    checkedAt: "preview-only-static-validation",
    onboardingSummary: {
      onboardingPreviewAllowedNow: Boolean(
        contract.onboardingPosition.onboardingPreviewAllowedNow
      ),
      realPilotAllowedNow: Boolean(contract.onboardingPosition.realPilotAllowedNow),
      realExecutionAllowedNow: Boolean(
        contract.onboardingPosition.realExecutionAllowedNow
      ),
      ownerDecisionRequiredBeforePilot: Boolean(
        contract.onboardingPosition.ownerDecisionRequiredBeforePilot
      ),
      businessFitPreviewOnly,
      ownerTrustPreviewOnly,
      realPilotBoundariesBlocked,
    },
    safetySummary: {
      readOnly: true,
      previewOnly: true,
      realPilotBlocked: !Boolean(contract.onboardingPosition.realPilotAllowedNow),
      realExecutionBlocked: !Boolean(contract.onboardingPosition.realExecutionAllowedNow),
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

export const nexusReadOnlyPilotOnboardingValidation =
  validateNexusReadOnlyPilotOnboardingContract();
