import { nexusTrustPilotReadinessDashboardSummary } from "./nexusTrustPilotReadinessDashboardSummary";

export type NexusTrustPilotReadinessDashboardPreviewValidationResult = {
  day: 117;
  name: "NEXUS Trust + Pilot Readiness Dashboard Preview Validator v1";
  phase: "Trust + Pilot Readiness";
  mode: "trust-pilot-readiness-dashboard-preview-validator-preview-only";
  valid: boolean;
  passed: string[];
  failed: string[];
  checkedAt: string;
  previewRoute: {
    path: "/nexus/trust-pilot-readiness-dashboard-preview";
    expected: true;
    readOnly: true;
    previewOnly: true;
  };
  uiIntegrity: {
    dashboardPreviewReady: boolean;
    realPilotBlocked: boolean;
    realExecutionBlocked: boolean;
    allCardsExecutionBlocked: boolean;
    requiredWarningsPresent: boolean;
    blockedActionsPresent: boolean;
    requiredCardsPresent: boolean;
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

const requiredCards = [
  "Shadow Mode Trust",
  "Pilot Trust Evidence",
  "Read-Only Pilot Onboarding",
  "Real Pilot Start",
] as const;

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

const requiredBlockedActions = [
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

export function validateNexusTrustPilotReadinessDashboardPreview(): NexusTrustPilotReadinessDashboardPreviewValidationResult {
  const passed: string[] = [];
  const failed: string[] = [];
  const summary = nexusTrustPilotReadinessDashboardSummary;

  passOrFail(summary.day === 115, "Day 115 dashboard summary source is present", passed, failed);
  passOrFail(summary.phase === "Trust + Pilot Readiness", "Trust + Pilot Readiness phase is locked", passed, failed);
  passOrFail(summary.mode === "trust-pilot-readiness-dashboard-summary-preview-only", "Dashboard summary source is preview-only", passed, failed);

  const requiredCardsPresent = requiredCards.every((title) =>
    summary.dashboardSummaryCards.some((card) => card.title === title)
  );

  const requiredWarningsPresent = requiredWarnings.every((warning) =>
    summary.requiredDashboardWarnings.includes(warning)
  );

  const blockedActionsPresent = requiredBlockedActions.every((action) =>
    summary.blockedDashboardActions.includes(action)
  );

  passOrFail(Boolean(summary.dashboardReadiness.dashboardPreviewReady), "Dashboard preview is ready", passed, failed);
  passOrFail(Boolean(summary.dashboardReadiness.realPilotBlocked), "Real pilot remains blocked", passed, failed);
  passOrFail(Boolean(summary.dashboardReadiness.realExecutionBlocked), "Real execution remains blocked", passed, failed);
  passOrFail(Boolean(summary.dashboardReadiness.allCardsExecutionBlocked), "All dashboard cards are execution-blocked", passed, failed);
  passOrFail(requiredCardsPresent, "All required dashboard preview cards are present", passed, failed);
  passOrFail(requiredWarningsPresent, "All required dashboard warnings are present", passed, failed);
  passOrFail(blockedActionsPresent, "All required blocked dashboard actions are present", passed, failed);

  passOrFail(summary.safetySummary.readOnly, "Read-only safety summary confirmed", passed, failed);
  passOrFail(summary.safetySummary.previewOnly, "Preview-only safety summary confirmed", passed, failed);
  passOrFail(summary.safetySummary.noRealCustomerDataWrite, "Real customer data writes are blocked", passed, failed);
  passOrFail(summary.safetySummary.noRealDbMemoryRead, "Real DB memory reads are blocked", passed, failed);
  passOrFail(summary.safetySummary.noRealDbMemoryWrite, "Real DB memory writes are blocked", passed, failed);
  passOrFail(summary.safetySummary.noAuditPersistence, "Audit persistence is blocked", passed, failed);
  passOrFail(summary.safetySummary.noRecoveryExecution, "Recovery execution is blocked", passed, failed);
  passOrFail(summary.safetySummary.noApproveRejectExecution, "Approve/reject execution is blocked", passed, failed);
  passOrFail(summary.safetySummary.noPaymentExecution, "Payment execution is blocked", passed, failed);
  passOrFail(summary.safetySummary.noMessageSending, "Message sending is blocked", passed, failed);
  passOrFail(summary.safetySummary.noAiModelCalls, "AI model calls are blocked", passed, failed);
  passOrFail(summary.safetySummary.noThirdPartyMutation, "Third-party mutation is blocked", passed, failed);

  return {
    day: 117,
    name: "NEXUS Trust + Pilot Readiness Dashboard Preview Validator v1",
    phase: "Trust + Pilot Readiness",
    mode: "trust-pilot-readiness-dashboard-preview-validator-preview-only",
    valid: failed.length === 0,
    passed,
    failed,
    checkedAt: "preview-only-static-validation",
    previewRoute: {
      path: "/nexus/trust-pilot-readiness-dashboard-preview",
      expected: true,
      readOnly: true,
      previewOnly: true,
    },
    uiIntegrity: {
      dashboardPreviewReady: Boolean(summary.dashboardReadiness.dashboardPreviewReady),
      realPilotBlocked: Boolean(summary.dashboardReadiness.realPilotBlocked),
      realExecutionBlocked: Boolean(summary.dashboardReadiness.realExecutionBlocked),
      allCardsExecutionBlocked: Boolean(summary.dashboardReadiness.allCardsExecutionBlocked),
      requiredWarningsPresent,
      blockedActionsPresent,
      requiredCardsPresent,
    },
    safetySummary: {
      readOnly: true,
      previewOnly: true,
      realPilotBlocked: Boolean(summary.dashboardReadiness.realPilotBlocked),
      realExecutionBlocked: Boolean(summary.dashboardReadiness.realExecutionBlocked),
      realCustomerDataBlocked: summary.safetySummary.noRealCustomerDataWrite,
      realDbMemoryBlocked:
        summary.safetySummary.noRealDbMemoryRead &&
        summary.safetySummary.noRealDbMemoryWrite,
      auditPersistenceBlocked: summary.safetySummary.noAuditPersistence,
      recoveryExecutionBlocked: summary.safetySummary.noRecoveryExecution,
      approveRejectExecutionBlocked: summary.safetySummary.noApproveRejectExecution,
      paymentExecutionBlocked: summary.safetySummary.noPaymentExecution,
      messageSendingBlocked: summary.safetySummary.noMessageSending,
      aiModelCallsBlocked: summary.safetySummary.noAiModelCalls,
      thirdPartyMutationBlocked: summary.safetySummary.noThirdPartyMutation,
    },
  };
}

export const nexusTrustPilotReadinessDashboardPreviewValidation =
  validateNexusTrustPilotReadinessDashboardPreview();
