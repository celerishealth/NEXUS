import { nexusTrustPilotReadinessCheckpoint } from "./nexusTrustPilotReadinessCheckpoint";

export type NexusTrustPilotReadinessDashboardContract = {
  day: 113;
  name: "NEXUS Trust + Pilot Readiness Dashboard Contract v1";
  phase: "Trust + Pilot Readiness";
  mode: "trust-pilot-readiness-dashboard-contract-preview-only";
  dashboardPosition: {
    dashboardAllowedNow: boolean;
    dashboardPurpose: string;
    realPilotBlocked: boolean;
    realExecutionBlocked: boolean;
  };
  dashboardCards: {
    title: string;
    status: "preview-ready" | "blocked-until-real-architecture";
    intent: string;
    executionAllowed: boolean;
  }[];
  requiredDashboardWarnings: string[];
  allowedDashboardActions: string[];
  blockedDashboardActions: string[];
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

export const nexusTrustPilotReadinessDashboardContract: NexusTrustPilotReadinessDashboardContract = {
  day: 113,
  name: "NEXUS Trust + Pilot Readiness Dashboard Contract v1",
  phase: "Trust + Pilot Readiness",
  mode: "trust-pilot-readiness-dashboard-contract-preview-only",
  dashboardPosition: {
    dashboardAllowedNow: true,
    dashboardPurpose:
      "Define the safe preview dashboard surface for Trust + Pilot Readiness without starting a real pilot, writing customer data, persisting audit events, sending messages, approving/rejecting actions, charging payments, calling AI, or mutating third-party systems.",
    realPilotBlocked: nexusTrustPilotReadinessCheckpoint.checkpointScope.realPilotBlocked,
    realExecutionBlocked:
      nexusTrustPilotReadinessCheckpoint.checkpointScope.realExecutionBlocked,
  },
  dashboardCards: [
    {
      title: "Shadow Mode Trust",
      status: "preview-ready",
      intent:
        "Show that NEXUS can be reviewed safely as an owner-controlled operating layer above existing systems.",
      executionAllowed: false,
    },
    {
      title: "Pilot Trust Evidence",
      status: "preview-ready",
      intent:
        "Show owner control, Safety Layer, blocked execution, Customer Memory boundary, audit visibility, fallback/recovery boundary, and Subscription Lock evidence.",
      executionAllowed: false,
    },
    {
      title: "Read-Only Pilot Onboarding",
      status: "preview-ready",
      intent:
        "Show business fit, owner trust, and pilot boundary checklists before any real onboarding.",
      executionAllowed: false,
    },
    {
      title: "Real Pilot Start",
      status: "blocked-until-real-architecture",
      intent:
        "Block real pilot start until real tenant isolation, customer data policy, approval enforcement, audit persistence, recovery execution, messaging, payment, subscription, AI, third-party mutation, rollback, and emergency stop architecture are approved.",
      executionAllowed: false,
    },
  ],
  requiredDashboardWarnings: [
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
  ],
  allowedDashboardActions: [
    "view_shadow_mode_trust_status",
    "view_pilot_trust_evidence",
    "view_read_only_onboarding_summary",
    "view_blocked_real_pilot_reasons",
    "view_required_real_architecture_before_pilot",
  ],
  blockedDashboardActions: nexusTrustPilotReadinessCheckpoint.blockedUntilRealArchitecture,
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
