export type NexusPilotTrustEvidenceContract = {
  day: 106;
  name: "NEXUS Pilot Trust Evidence Contract v1";
  phase: "Trust + Pilot Readiness";
  mode: "pilot-trust-evidence-preview-only";
  evidencePosition: {
    purpose: string;
    evidenceAllowedNow: true;
    realPilotAllowedNow: false;
    realExecutionAllowedNow: false;
    ownerDecisionRequiredBeforeRealPilot: true;
  };
  evidenceCategories: {
    category: string;
    description: string;
    visibleInShadowMode: true;
    executionAllowed: false;
  }[];
  pilotTrustQuestions: {
    question: string;
    answer: string;
    proofMode: "preview-only";
  }[];
  evidenceBoundaries: {
    canShowReadOnlySafetyPosture: true;
    canShowBlockedExecutionPosture: true;
    canShowOwnerControlPosture: true;
    canShowAuditVisibilityPosture: true;
    canShowCustomerMemoryBoundary: true;
    canShowFallbackRecoveryBoundary: true;
    canShowSubscriptionLockBoundary: true;
    cannotUseRealCustomerData: true;
    cannotPersistAuditEvidence: true;
    cannotExecutePilotAction: true;
  };
  blockedEvidenceActions: string[];
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

export const nexusPilotTrustEvidenceContract: NexusPilotTrustEvidenceContract = {
  day: 106,
  name: "NEXUS Pilot Trust Evidence Contract v1",
  phase: "Trust + Pilot Readiness",
  mode: "pilot-trust-evidence-preview-only",
  evidencePosition: {
    purpose:
      "Define the trust evidence NEXUS may show during Shadow Mode before a real pilot. Evidence is limited to safe preview posture and cannot execute, persist, mutate, send, approve, reject, charge, or call AI.",
    evidenceAllowedNow: true,
    realPilotAllowedNow: false,
    realExecutionAllowedNow: false,
    ownerDecisionRequiredBeforeRealPilot: true,
  },
  evidenceCategories: [
    {
      category: "Owner Control Evidence",
      description:
        "Shows that risky actions require owner control before any future execution path.",
      visibleInShadowMode: true,
      executionAllowed: false,
    },
    {
      category: "Safety Layer Evidence",
      description:
        "Shows Zero Damage and Zero Stop posture without touching live business systems.",
      visibleInShadowMode: true,
      executionAllowed: false,
    },
    {
      category: "Blocked Execution Evidence",
      description:
        "Shows that messages, payments, approvals, customer data writes, audit persistence, recovery execution, AI calls, and third-party mutations are blocked.",
      visibleInShadowMode: true,
      executionAllowed: false,
    },
    {
      category: "Customer Memory Boundary Evidence",
      description:
        "Shows Customer Memory design boundaries without reading or writing real memory.",
      visibleInShadowMode: true,
      executionAllowed: false,
    },
    {
      category: "Audit Visibility Evidence",
      description:
        "Shows audit visibility requirements without persisting real audit events.",
      visibleInShadowMode: true,
      executionAllowed: false,
    },
    {
      category: "Fallback Recovery Boundary Evidence",
      description:
        "Shows fallback and recovery requirements without executing recovery.",
      visibleInShadowMode: true,
      executionAllowed: false,
    },
    {
      category: "Subscription Lock Evidence",
      description:
        "Shows monetization and access-control posture without executing payment or subscription changes.",
      visibleInShadowMode: true,
      executionAllowed: false,
    },
  ],
  pilotTrustQuestions: [
    {
      question: "Can NEXUS damage live customer data during Shadow Mode?",
      answer:
        "No. Shadow Mode trust evidence is preview-only and blocks real customer data writes.",
      proofMode: "preview-only",
    },
    {
      question: "Can NEXUS send messages during Shadow Mode?",
      answer:
        "No. Message sending is blocked until a later explicitly approved real execution architecture exists.",
      proofMode: "preview-only",
    },
    {
      question: "Can NEXUS charge payments during Shadow Mode?",
      answer:
        "No. Payment execution is blocked and only Subscription Lock posture can be shown.",
      proofMode: "preview-only",
    },
    {
      question: "Can NEXUS approve or reject real business actions now?",
      answer:
        "No. Owner approval is visible as a trust control, but approve/reject execution is blocked.",
      proofMode: "preview-only",
    },
    {
      question: "Can NEXUS read or write real Customer Memory now?",
      answer:
        "No. Customer Memory remains a preview boundary with no real DB memory read/write.",
      proofMode: "preview-only",
    },
    {
      question: "Can NEXUS prove pilot readiness without becoming a chatbot, CRM, ERP, or automation clone?",
      answer:
        "Yes. The evidence posture keeps NEXUS as an owner-controlled AI Business Operating Layer above existing systems.",
      proofMode: "preview-only",
    },
  ],
  evidenceBoundaries: {
    canShowReadOnlySafetyPosture: true,
    canShowBlockedExecutionPosture: true,
    canShowOwnerControlPosture: true,
    canShowAuditVisibilityPosture: true,
    canShowCustomerMemoryBoundary: true,
    canShowFallbackRecoveryBoundary: true,
    canShowSubscriptionLockBoundary: true,
    cannotUseRealCustomerData: true,
    cannotPersistAuditEvidence: true,
    cannotExecutePilotAction: true,
  },
  blockedEvidenceActions: [
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
