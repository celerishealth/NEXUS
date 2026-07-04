import {
  nexusTrustPilotReadinessDashboardContract,
  type NexusTrustPilotReadinessDashboardContract,
} from "./nexusTrustPilotReadinessDashboardContract";

export type NexusTrustPilotReadinessDashboardValidationResult = {
  day: 114;
  name: "NEXUS Trust + Pilot Readiness Dashboard Validator v1";
  phase: "Trust + Pilot Readiness";
  mode: "trust-pilot-readiness-dashboard-validator-preview-only";
  valid: boolean;
  passed: string[];
  failed: string[];
  checkedAt: string;
  dashboardSummary: {
    dashboardAllowedNow: boolean;
    realPilotBlocked: boolean;
    realExecutionBlocked: boolean;
    allCardsExecutionBlocked: boolean;
    requiredWarningsPresent: boolean;
    allowedActionsPreviewOnly: boolean;
    blockedActionsPresent: boolean;
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

const requiredWarnings = [
  "Shadow Mode preview only",
  "Real pilot blocked",
  "Real execution blocked",
  "No customer data write",
  "No real DB memory read/write",
  "No audit persistence",
  "No recovery execution",
  "No approve/reject execution",
  "No payment execution",
  "No message sending",
  "No AI model calls",
  "No third-party mutation",
] as const;

const requiredDashboardActions = [
  "view_shadow_mode_trust_status",
  "view_pilot_trust_evidence",
  "view_read_only_onboarding_summary",
  "view_blocked_real_pilot_reasons",
  "view_required_real_architecture_before_pilot",
] as const;

const requiredBlockedDashboardActions = [
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

export function validateNexusTrustPilotReadinessDashboardContract(
  contract: NexusTrustPilotReadinessDashboardContract = nexusTrustPilotReadinessDashboardContract
): NexusTrustPilotReadinessDashboardValidationResult {
  const passed: string[] = [];
  const failed: string[] = [];

  passOrFail(contract.day === 113, "Day 113 source contract is present", passed, failed);
  passOrFail(contract.phase === "Trust + Pilot Readiness", "Trust + Pilot Readiness phase is locked", passed, failed);
  passOrFail(contract.mode === "trust-pilot-readiness-dashboard-contract-preview-only", "Dashboard contract mode is preview-only", passed, failed);
  passOrFail(Boolean(contract.dashboardPosition.dashboardAllowedNow), "Dashboard preview is allowed now", passed, failed);
  passOrFail(Boolean(contract.dashboardPosition.realPilotBlocked), "Real pilot remains blocked", passed, failed);
  passOrFail(Boolean(contract.dashboardPosition.realExecutionBlocked), "Real execution remains blocked", passed, failed);

  const allCardsExecutionBlocked = contract.dashboardCards.every(
    (card) => !Boolean(card.executionAllowed)
  );

  const hasPreviewReadyCards = contract.dashboardCards.some(
    (card) => card.status === "preview-ready"
  );

  const hasBlockedRealPilotCard = contract.dashboardCards.some(
    (card) =>
      card.title === "Real Pilot Start" &&
      card.status === "blocked-until-real-architecture" &&
      !Boolean(card.executionAllowed)
  );

  passOrFail(allCardsExecutionBlocked, "All dashboard cards are execution-blocked", passed, failed);
  passOrFail(hasPreviewReadyCards, "Dashboard has preview-ready trust cards", passed, failed);
  passOrFail(hasBlockedRealPilotCard, "Real Pilot Start card is blocked until real architecture", passed, failed);

  for (const warning of requiredWarnings) {
    passOrFail(
      contract.requiredDashboardWarnings.includes(warning),
      `Required dashboard warning confirmed: ${warning}`,
      passed,
      failed
    );
  }

  for (const action of requiredDashboardActions) {
    passOrFail(
      contract.allowedDashboardActions.includes(action),
      `Allowed dashboard preview action confirmed: ${action}`,
      passed,
      failed
    );
  }

  for (const action of requiredBlockedDashboardActions) {
    passOrFail(
      contract.blockedDashboardActions.includes(action),
      `Blocked dashboard action confirmed: ${action}`,
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

  const requiredWarningsPresent = requiredWarnings.every((warning) =>
    contract.requiredDashboardWarnings.includes(warning)
  );

  const allowedActionsPreviewOnly = requiredDashboardActions.every((action) =>
    contract.allowedDashboardActions.includes(action)
  );

  const blockedActionsPresent = requiredBlockedDashboardActions.every((action) =>
    contract.blockedDashboardActions.includes(action)
  );

  return {
    day: 114,
    name: "NEXUS Trust + Pilot Readiness Dashboard Validator v1",
    phase: "Trust + Pilot Readiness",
    mode: "trust-pilot-readiness-dashboard-validator-preview-only",
    valid: failed.length === 0,
    passed,
    failed,
    checkedAt: "preview-only-static-validation",
    dashboardSummary: {
      dashboardAllowedNow: Boolean(contract.dashboardPosition.dashboardAllowedNow),
      realPilotBlocked: Boolean(contract.dashboardPosition.realPilotBlocked),
      realExecutionBlocked: Boolean(contract.dashboardPosition.realExecutionBlocked),
      allCardsExecutionBlocked,
      requiredWarningsPresent,
      allowedActionsPreviewOnly,
      blockedActionsPresent,
    },
    safetySummary: {
      readOnly: true,
      previewOnly: true,
      realPilotBlocked: Boolean(contract.dashboardPosition.realPilotBlocked),
      realExecutionBlocked: Boolean(contract.dashboardPosition.realExecutionBlocked),
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

export const nexusTrustPilotReadinessDashboardValidation =
  validateNexusTrustPilotReadinessDashboardContract();
