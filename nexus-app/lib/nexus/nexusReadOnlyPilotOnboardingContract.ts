export type NexusReadOnlyPilotOnboardingContract = {
  day: 109;
  name: "NEXUS Read-Only Pilot Onboarding Contract v1";
  phase: "Trust + Pilot Readiness";
  mode: "read-only-pilot-onboarding-preview-only";
  onboardingPosition: {
    onboardingPreviewAllowedNow: true;
    realPilotAllowedNow: false;
    realExecutionAllowedNow: false;
    ownerDecisionRequiredBeforePilot: true;
    reason: string;
  };
  businessFitChecklist: {
    item: string;
    required: true;
    previewOnly: true;
    executionAllowed: false;
  }[];
  ownerTrustChecklist: {
    item: string;
    required: true;
    previewOnly: true;
    executionAllowed: false;
  }[];
  pilotBoundaryChecklist: {
    boundary: string;
    status: "blocked-until-approved-real-architecture" | "visible-preview-only";
    safeForShadowMode: boolean;
  }[];
  allowedOnboardingPreview: string[];
  blockedOnboardingActions: string[];
  safetySummary: {
    readOnly: true;
    previewOnly: true;
    noRealCustomerDataWrite: true;
    noRealDbMemoryRead: true;
    noRealDbMemoryWrite: true;
    noAuditPersistence: true;
    noRecoveryExecution: true;
    noApproveRejectExecution: true;
    noPaymentExecution: true;
    noMessageSending: true;
    noAiModelCalls: true;
    noThirdPartyMutation: true;
  };
};

export const nexusReadOnlyPilotOnboardingContract: NexusReadOnlyPilotOnboardingContract = {
  day: 109,
  name: "NEXUS Read-Only Pilot Onboarding Contract v1",
  phase: "Trust + Pilot Readiness",
  mode: "read-only-pilot-onboarding-preview-only",
  onboardingPosition: {
    onboardingPreviewAllowedNow: true,
    realPilotAllowedNow: false,
    realExecutionAllowedNow: false,
    ownerDecisionRequiredBeforePilot: true,
    reason:
      "NEXUS may preview read-only pilot onboarding requirements in Shadow Mode only. Real pilot onboarding remains blocked until tenant isolation, customer data policy, owner approval enforcement, audit persistence, recovery execution, message sending, payment execution, subscription enforcement, live AI boundary, third-party mutation controls, rollback, and emergency stop are explicitly approved.",
  },
  businessFitChecklist: [
    {
      item: "Business uses existing software NEXUS can operate above",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
    {
      item: "Owner accepts NEXUS as control layer, not chatbot/CRM/ERP replacement",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
    {
      item: "Business can start with Shadow Mode trust review",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
    {
      item: "Risky actions can remain owner-controlled",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
    {
      item: "Pilot can be measured without live mutation",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
  ],
  ownerTrustChecklist: [
    {
      item: "Owner Approval visible before any future risky action",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
    {
      item: "Safety Layer visible before pilot",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
    {
      item: "Audit visibility visible before persistence",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
    {
      item: "Customer Memory boundary visible before real DB access",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
    {
      item: "Fallback/Recovery boundary visible before recovery execution",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
    {
      item: "Subscription Lock boundary visible before payment/subscription execution",
      required: true,
      previewOnly: true,
      executionAllowed: false,
    },
  ],
  pilotBoundaryChecklist: [
    {
      boundary: "Shadow Mode onboarding preview",
      status: "visible-preview-only",
      safeForShadowMode: true,
    },
    {
      boundary: "Owner trust review",
      status: "visible-preview-only",
      safeForShadowMode: true,
    },
    {
      boundary: "Real tenant onboarding",
      status: "blocked-until-approved-real-architecture",
      safeForShadowMode: false,
    },
    {
      boundary: "Real customer data access",
      status: "blocked-until-approved-real-architecture",
      safeForShadowMode: false,
    },
    {
      boundary: "Real message sending",
      status: "blocked-until-approved-real-architecture",
      safeForShadowMode: false,
    },
    {
      boundary: "Real payment/subscription mutation",
      status: "blocked-until-approved-real-architecture",
      safeForShadowMode: false,
    },
    {
      boundary: "Real third-party system mutation",
      status: "blocked-until-approved-real-architecture",
      safeForShadowMode: false,
    },
  ],
  allowedOnboardingPreview: [
    "show_business_fit_checklist",
    "show_owner_trust_checklist",
    "show_pilot_boundary_checklist",
    "show_shadow_mode_only_status",
    "show_blocked_real_pilot_status",
    "show_required_before_real_pilot",
  ],
  blockedOnboardingActions: [
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
  ],
  safetySummary: {
    readOnly: true,
    previewOnly: true,
    noRealCustomerDataWrite: true,
    noRealDbMemoryRead: true,
    noRealDbMemoryWrite: true,
    noAuditPersistence: true,
    noRecoveryExecution: true,
    noApproveRejectExecution: true,
    noPaymentExecution: true,
    noMessageSending: true,
    noAiModelCalls: true,
    noThirdPartyMutation: true,
  },
};
