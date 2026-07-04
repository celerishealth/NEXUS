export type NexusPilotReadinessContract = {
  day: 103;
  name: "NEXUS Pilot Readiness Contract v1";
  phase: "Trust + Pilot Readiness";
  mode: "pilot-readiness-preview-only";
  readinessPosition: {
    pilotAllowedNow: false;
    shadowModeAllowedNow: true;
    realExecutionAllowedNow: false;
    reason: string;
  };
  requiredBeforePilot: string[];
  allowedPilotPreviewCapabilities: string[];
  blockedPilotCapabilities: string[];
  trustControls: {
    ownerApprovalVisible: true;
    ownerApprovalExecutable: false;
    safetyLayerVisible: true;
    auditLogsVisible: true;
    auditPersistenceEnabled: false;
    customerMemoryPreviewVisible: true;
    realCustomerMemoryReadEnabled: false;
    realCustomerMemoryWriteEnabled: false;
    fallbackRecoveryVisible: true;
    fallbackRecoveryExecutable: false;
    subscriptionLockVisible: true;
    paymentExecutionEnabled: false;
    messageSendingEnabled: false;
    aiModelCallsEnabled: false;
    thirdPartyMutationEnabled: false;
  };
  pilotReadinessGates: {
    gate: string;
    required: true;
    status: "ready-preview-only" | "blocked-until-real-architecture";
    executionSafe: boolean;
  }[];
};

export const nexusPilotReadinessContract: NexusPilotReadinessContract = {
  day: 103,
  name: "NEXUS Pilot Readiness Contract v1",
  phase: "Trust + Pilot Readiness",
  mode: "pilot-readiness-preview-only",
  readinessPosition: {
    pilotAllowedNow: false,
    shadowModeAllowedNow: true,
    realExecutionAllowedNow: false,
    reason:
      "NEXUS is ready to describe and preview pilot trust controls in Shadow Mode only. Real pilot execution remains blocked until explicit real execution architecture, persistence policy, approval enforcement, audit storage, recovery execution, and external-system mutation controls are designed and approved.",
  },
  requiredBeforePilot: [
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
  ],
  allowedPilotPreviewCapabilities: [
    "show_shadow_mode_status",
    "show_read_only_trust_controls",
    "show_owner_approval_requirement",
    "show_safety_layer_posture",
    "show_audit_visibility_requirement",
    "show_customer_memory_preview_boundary",
    "show_fallback_recovery_requirement",
    "show_subscription_lock_requirement",
    "show_blocked_execution_summary",
  ],
  blockedPilotCapabilities: [
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
  ],
  trustControls: {
    ownerApprovalVisible: true,
    ownerApprovalExecutable: false,
    safetyLayerVisible: true,
    auditLogsVisible: true,
    auditPersistenceEnabled: false,
    customerMemoryPreviewVisible: true,
    realCustomerMemoryReadEnabled: false,
    realCustomerMemoryWriteEnabled: false,
    fallbackRecoveryVisible: true,
    fallbackRecoveryExecutable: false,
    subscriptionLockVisible: true,
    paymentExecutionEnabled: false,
    messageSendingEnabled: false,
    aiModelCallsEnabled: false,
    thirdPartyMutationEnabled: false,
  },
  pilotReadinessGates: [
    {
      gate: "Shadow Mode preview",
      required: true,
      status: "ready-preview-only",
      executionSafe: true,
    },
    {
      gate: "Owner approval visibility",
      required: true,
      status: "ready-preview-only",
      executionSafe: true,
    },
    {
      gate: "Safety Layer visibility",
      required: true,
      status: "ready-preview-only",
      executionSafe: true,
    },
    {
      gate: "Audit visibility",
      required: true,
      status: "ready-preview-only",
      executionSafe: true,
    },
    {
      gate: "Real tenant isolation",
      required: true,
      status: "blocked-until-real-architecture",
      executionSafe: false,
    },
    {
      gate: "Real customer data access",
      required: true,
      status: "blocked-until-real-architecture",
      executionSafe: false,
    },
    {
      gate: "External mutation control",
      required: true,
      status: "blocked-until-real-architecture",
      executionSafe: false,
    },
    {
      gate: "Real pilot execution",
      required: true,
      status: "blocked-until-real-architecture",
      executionSafe: false,
    },
  ],
};
