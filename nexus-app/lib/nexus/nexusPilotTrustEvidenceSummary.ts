import { nexusPilotTrustEvidenceContract } from "./nexusPilotTrustEvidenceContract";
import { nexusPilotTrustEvidenceValidation } from "./nexusPilotTrustEvidenceValidator";

export type NexusPilotTrustEvidenceSummary = {
  day: 108;
  name: "NEXUS Pilot Trust Evidence Summary v1";
  phase: "Trust + Pilot Readiness";
  mode: "pilot-trust-evidence-summary-preview-only";
  sourceDays: {
    day106PilotTrustEvidenceContract: boolean;
    day107PilotTrustEvidenceValidator: boolean;
  };
  evidenceReadiness: {
    evidencePreviewReady: boolean;
    realPilotBlocked: boolean;
    realExecutionBlocked: boolean;
    ownerDecisionRequiredBeforeRealPilot: boolean;
    allEvidencePreviewOnly: boolean;
    allEvidenceExecutionBlocked: boolean;
  };
  trustEvidenceCards: {
    title: string;
    status: "visible-preview-only";
    executionAllowed: false;
    proof: string;
  }[];
  pilotTrustAnswers: {
    question: string;
    answer: string;
    proofMode: "preview-only";
  }[];
  blockedEvidenceActions: string[];
  allowedEvidenceBoundaries: string[];
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

export const nexusPilotTrustEvidenceSummary: NexusPilotTrustEvidenceSummary = {
  day: 108,
  name: "NEXUS Pilot Trust Evidence Summary v1",
  phase: "Trust + Pilot Readiness",
  mode: "pilot-trust-evidence-summary-preview-only",
  sourceDays: {
    day106PilotTrustEvidenceContract: nexusPilotTrustEvidenceContract.day === 106,
    day107PilotTrustEvidenceValidator:
      nexusPilotTrustEvidenceValidation.day === 107 &&
      nexusPilotTrustEvidenceValidation.valid,
  },
  evidenceReadiness: {
    evidencePreviewReady:
      Boolean(nexusPilotTrustEvidenceContract.evidencePosition.evidenceAllowedNow) &&
      nexusPilotTrustEvidenceValidation.valid,
    realPilotBlocked:
      !Boolean(nexusPilotTrustEvidenceContract.evidencePosition.realPilotAllowedNow),
    realExecutionBlocked:
      !Boolean(nexusPilotTrustEvidenceContract.evidencePosition.realExecutionAllowedNow),
    ownerDecisionRequiredBeforeRealPilot: Boolean(
      nexusPilotTrustEvidenceContract.evidencePosition
        .ownerDecisionRequiredBeforeRealPilot
    ),
    allEvidencePreviewOnly:
      nexusPilotTrustEvidenceValidation.evidenceSummary.allEvidencePreviewOnly,
    allEvidenceExecutionBlocked:
      nexusPilotTrustEvidenceValidation.evidenceSummary.allEvidenceExecutionBlocked,
  },
  trustEvidenceCards: nexusPilotTrustEvidenceContract.evidenceCategories.map(
    (category) => ({
      title: category.category,
      status: "visible-preview-only",
      executionAllowed: false,
      proof: category.description,
    })
  ),
  pilotTrustAnswers: nexusPilotTrustEvidenceContract.pilotTrustQuestions,
  blockedEvidenceActions: nexusPilotTrustEvidenceContract.blockedEvidenceActions,
  allowedEvidenceBoundaries: [
    "read_only_safety_posture",
    "blocked_execution_posture",
    "owner_control_posture",
    "audit_visibility_posture",
    "customer_memory_boundary",
    "fallback_recovery_boundary",
    "subscription_lock_boundary",
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
