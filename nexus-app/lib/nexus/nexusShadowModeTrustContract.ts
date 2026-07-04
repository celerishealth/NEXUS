export type NexusShadowModeTrustContract = {
  day: 101;
  name: "NEXUS Shadow Mode Trust Contract v1";
  phase: "Trust + Pilot Readiness";
  mode: "shadow-mode-preview-only";
  visionLock: {
    productIdentity: "AI Business Operating System / owner-controlled AI Business Operating Layer";
    notAChatbot: true;
    notACrmClone: true;
    notAnErpClone: true;
    notAMakeZapierClone: true;
    worksAboveExistingBusinessSoftware: true;
  };
  trustRules: {
    readOnlyPilotDiscipline: true;
    ownerApprovalRequiredForRisk: true;
    zeroDamage: true;
    zeroStop: true;
    auditVisible: true;
    fallbackRecoveryVisible: true;
    subscriptionLockVisible: true;
    monetizationDiscipline: true;
  };
  executionBlocks: {
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
  pilotReadinessMeaning: string[];
  shadowModeMeaning: string[];
  allowedPreviewSignals: string[];
  blockedProductionActions: string[];
};

export const nexusShadowModeTrustContract: NexusShadowModeTrustContract = {
  day: 101,
  name: "NEXUS Shadow Mode Trust Contract v1",
  phase: "Trust + Pilot Readiness",
  mode: "shadow-mode-preview-only",
  visionLock: {
    productIdentity: "AI Business Operating System / owner-controlled AI Business Operating Layer",
    notAChatbot: true,
    notACrmClone: true,
    notAnErpClone: true,
    notAMakeZapierClone: true,
    worksAboveExistingBusinessSoftware: true,
  },
  trustRules: {
    readOnlyPilotDiscipline: true,
    ownerApprovalRequiredForRisk: true,
    zeroDamage: true,
    zeroStop: true,
    auditVisible: true,
    fallbackRecoveryVisible: true,
    subscriptionLockVisible: true,
    monetizationDiscipline: true,
  },
  executionBlocks: {
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
  pilotReadinessMeaning: [
    "NEXUS can observe simulated business activity without taking action.",
    "NEXUS can explain what it would do before any execution path exists.",
    "NEXUS can show owner trust controls before live customer impact.",
    "NEXUS can prove safety posture before pilot onboarding.",
  ],
  shadowModeMeaning: [
    "Preview-only operating layer above existing systems.",
    "No mutation of customer records, business software, payment state, messages, memory, audit storage, or recovery systems.",
    "Owner can inspect proposed control decisions without approving or executing them.",
    "Designed for trust verification before real execution architecture is introduced later.",
  ],
  allowedPreviewSignals: [
    "simulated_customer_intent",
    "simulated_business_risk",
    "simulated_owner_review_need",
    "simulated_memory_context_need",
    "simulated_fallback_need",
    "simulated_audit_visibility_need",
    "simulated_subscription_lock_need",
  ],
  blockedProductionActions: [
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
  ],
};
