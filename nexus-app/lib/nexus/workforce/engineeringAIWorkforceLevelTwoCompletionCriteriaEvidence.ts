import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "./engineeringAIWorkforceFormalQualificationTestPlan";
import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK,
} from "./engineeringAIWorkforceFormalQualificationFixturePack";
import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
  validateEngineeringAIWorkforceFormalQualificationExecutionEvidence,
} from "./engineeringAIWorkforceFormalQualificationExecutionEvidence";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,
  validateEngineeringAIWorkforceOwnerActivationDecision,
} from "./engineeringAIWorkforceOwnerActivationDecision";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
  validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance,
} from "./engineeringAIWorkforceOwnerActivatedRuntimeIssuance";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,
  validateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision,
} from "./engineeringAIWorkforceOwnerControlledShadowOperationReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,
  validateEngineeringAIWorkforceLimitedInternalPilotPreparation,
} from "./engineeringAIWorkforceLimitedInternalPilotPreparation";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";
import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceVivaanFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceVivaanFirstSyntheticPilotTaskOwnerReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_VERSION =
  "nexus-engineering-ai-workforce-level-two-completion-criteria-evidence-v1" as const;

export interface CreateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidenceInput {
  readonly evidenceId: string;
  readonly auditedAt: string;
}

export interface EngineeringAIWorkforceLevelTwoSourceBinding {
  readonly sourceStage:
    | "FORMAL_QUALIFICATION_EXECUTION_EVIDENCE"
    | "OWNER_ACTIVATION_DECISION"
    | "OWNER_ACTIVATED_RUNTIME_ISSUANCE"
    | "OWNER_CONTROLLED_SHADOW_REVIEW"
    | "LIMITED_INTERNAL_PILOT_PREPARATION"
    | "OWNER_FIRST_TASK_EXECUTION_DECISION"
    | "ISHAAN_FIRST_TASK_OWNER_REVIEW"
    | "LEELA_FIRST_TASK_OWNER_REVIEW"
    | "VIVAAN_FIRST_TASK_OWNER_REVIEW"
    | "ANAYA_FIRST_TASK_OWNER_REVIEW"
    | "ATHARV_FIRST_TASK_OWNER_REVIEW"
    | "MAHIR_FIRST_TASK_OWNER_REVIEW"
    | "ZARA_FIRST_TASK_OWNER_REVIEW"
    | "ADVIK_FIRST_TASK_OWNER_REVIEW";
  readonly sourceId: string;
  readonly sourceDigest: string;
}

export interface EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_VERSION;
  readonly evidenceId: string;
  readonly evidenceState:
    "ENGINEERING_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_AUDITED";
  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly sourceBindingCount: 14;
  readonly sourceBindings:
    readonly EngineeringAIWorkforceLevelTwoSourceBinding[];
  readonly summary: Readonly<{
    candidateCount: 8;
    qualificationCasesExecuted: 800;
    qualificationCasesPassed: 800;
    qualificationCasesFailed: 0;
    qualificationEvidenceCollected: 800;
    ownerActivationApprovedCount: 8;
    runtimeActivationExecutedCount: 8;
    activatedRuntimeCount: 8;
    controlledWorkAuthorizationCount: 8;
    shadowReviewApprovedCount: 8;
    shadowReviewRejectedCount: 0;
    limitedInternalPilotPreparationAuthorizedCount: 8;
    firstSyntheticPilotTaskExecutionAuthorizedCount: 8;
    firstSyntheticPilotTaskExecutionReviewedCount: 8;
    firstSyntheticPilotTaskExecutionApprovedCount: 8;
    engineeringFirstTaskSequenceCompleted: true;
    levelTwoEvidenceCriteriaSatisfied: true;
  }>;
  readonly authorityBoundary: Readonly<{
    canonicalEvidenceBound: true;
    allCanonicalValidatorsPassed: true;
    ownerFinalAuthorityPreserved: true;
    ownerCompletionReviewRequired: true;
    ownerCompletionReviewAccepted: false;
    levelThreeAuthorityGranted: false;
    pilotCompleted: false;
    furtherCandidateExecutionAuthorized: false;
    secondTaskExecutionAuthorized: false;
    thirdTaskExecutionAuthorized: false;
    concurrentExecutionAuthorized: false;
    repositoryReadAuthorized: false;
    repositoryWriteAuthorized: false;
    branchCreationAuthorized: false;
    pullRequestPreparationAuthorized: false;
    mergeAuthorized: false;
    secretsAccessAuthorized: false;
    realCustomerDataAccessAuthorized: false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionDatabaseAuthorized: false;
    productionMutationAuthorized: false;
    productionDeploymentAuthorized: false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized: false;
    legalCommitmentAuthorized: false;
    autonomousDecisionAuthorized: false;
    productionReadinessAuthorized: false;
    publicLaunchAuthorized: false;
    monitoringRequired: true;
    emergencyPauseAvailable: true;
    founderLiberationAchieved: false;
    founderReleasedFromRoutineExecution: false;
  }>;
  readonly nextStep:
    "AWAIT_OWNER_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_REVIEW";
  readonly auditedAt: string;
  readonly evidenceDigest: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (!IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    !value.endsWith("Z") ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

const OWNER_REVIEW_RECORDS = [
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
] as const;

let canonicalSourcesValidated = false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }
  validateEngineeringAIWorkforceFormalQualificationExecutionEvidence(
    ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
    ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
    ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK,
  );

  validateEngineeringAIWorkforceOwnerActivationDecision(
    ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,
  );

  validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
    ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
  );

  validateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
    ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,
  );

  validateEngineeringAIWorkforceLimitedInternalPilotPreparation(
    ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  );

  validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  );
  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  );
  validateEngineeringAIWorkforceVivaanFirstSyntheticPilotTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  );
  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  );
  validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  );
  validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  );
  validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  );
  validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  );

  const qualificationSummary =
    ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE.summary;
  const activationSummary =
    ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION.aggregateSummary;
  const runtimeSummary =
    ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE.aggregateSummary;
  const shadowSummary =
    ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION.aggregateSummary;
  const pilotBoundary =
    ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION.authorityBoundary;
  const firstTaskSummary =
    ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION.aggregateSummary;
  const firstTaskBoundary =
    ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION.authorityBoundary;
  const finalReview =
    ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

  if (
    qualificationSummary.qualificationCasesExecuted !==
      800 ||
    qualificationSummary.qualificationCasesPassed !==
      800 ||
    qualificationSummary.qualificationCasesFailed !==
      0 ||
    qualificationSummary.qualificationEvidenceCollected !==
      800 ||
    activationSummary.ownerActivationApprovedCount !==
      8 ||
    activationSummary.runtimeActivationEligibleCount !==
      8 ||
    runtimeSummary.runtimeActivationExecutedCount !==
      8 ||
    runtimeSummary.activatedRuntimeCount !==
      8 ||
    runtimeSummary.controlledWorkAuthorizationCount !==
      8 ||
    shadowSummary.approvedCandidateCount !==
      8 ||
    shadowSummary.rejectedCandidateCount !==
      0 ||
    shadowSummary.limitedInternalPilotPreparationEligibleCount !==
      8 ||
    pilotBoundary.allEightOwnerApprovalsVerified !==
      true ||
    pilotBoundary.limitedInternalPilotPreparationAuthorizedCount !==
      8 ||
    pilotBoundary.limitedInternalPilotExecutionAuthorizedCount !==
      0 ||
    firstTaskSummary.firstTaskExecutionAuthorizedCount !==
      8 ||
    firstTaskBoundary.firstSyntheticPilotTaskExecutionAuthorizedCount !==
      8 ||
    firstTaskBoundary.remainingTaskExecutionAuthorizedCount !==
      0 ||
    finalReview.engineeringFirstTaskSequenceCompleted !==
      true ||
    finalReview.furtherCandidateExecutionAuthorized !==
      false ||
    finalReview.reviewedEvidence.pilotCompleted !==
      false ||
    finalReview.authorityBoundary.finalExecutionSequenceReached !==
      true ||
    finalReview.authorityBoundary.firstTaskExecutionCapacityExhausted !==
      true
  ) {
    throw new Error(
      "Engineering Level-2 canonical completion evidence is incomplete.",
    );
  }

  if (
    OWNER_REVIEW_RECORDS.length !==
      8 ||
    OWNER_REVIEW_RECORDS.some(
      (review) =>
        !review.decision.startsWith(
          "APPROVE_",
        ),
    ) ||
    new Set(
      OWNER_REVIEW_RECORDS.map(
        (review) =>
          review.decisionId,
      ),
    ).size !==
      8 ||
    new Set(
      OWNER_REVIEW_RECORDS.map(
        (review) =>
          review.decisionDigest,
      ),
    ).size !==
      8
  ) {
    throw new Error(
      "Engineering Level-2 owner-review evidence is incomplete.",
    );
  }

  canonicalSourcesValidated = true;
}

function canonicalSourceBindings(): readonly EngineeringAIWorkforceLevelTwoSourceBinding[] {
  return [
    {
      sourceStage:
        "FORMAL_QUALIFICATION_EXECUTION_EVIDENCE",
      sourceId:
        ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE.ledgerId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE.ledgerDigest,
    },
    {
      sourceStage:
        "OWNER_ACTIVATION_DECISION",
      sourceId:
        ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "OWNER_ACTIVATED_RUNTIME_ISSUANCE",
      sourceId:
        ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE.runtimeIssuanceId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE.runtimeIssuanceDigest,
    },
    {
      sourceStage:
        "OWNER_CONTROLLED_SHADOW_REVIEW",
      sourceId:
        ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "LIMITED_INTERNAL_PILOT_PREPARATION",
      sourceId:
        ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION.preparationId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION.preparationDigest,
    },
    {
      sourceStage:
        "OWNER_FIRST_TASK_EXECUTION_DECISION",
      sourceId:
        ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "ISHAAN_FIRST_TASK_OWNER_REVIEW",
      sourceId:
        ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "LEELA_FIRST_TASK_OWNER_REVIEW",
      sourceId:
        ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "VIVAAN_FIRST_TASK_OWNER_REVIEW",
      sourceId:
        ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "ANAYA_FIRST_TASK_OWNER_REVIEW",
      sourceId:
        ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "ATHARV_FIRST_TASK_OWNER_REVIEW",
      sourceId:
        ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "MAHIR_FIRST_TASK_OWNER_REVIEW",
      sourceId:
        ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "ZARA_FIRST_TASK_OWNER_REVIEW",
      sourceId:
        ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionDigest,
    },
    {
      sourceStage:
        "ADVIK_FIRST_TASK_OWNER_REVIEW",
      sourceId:
        ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionId,
      sourceDigest:
        ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION.decisionDigest,
    },
  ] as const;
}

export function validateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence(
  record:
    EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Engineering Level-2 completion evidence ID",
    record.evidenceId,
  );

  requireTimestamp(
    "Engineering Level-2 completion audit time",
    record.auditedAt,
  );

  requireDigest(
    "Engineering Level-2 completion evidence digest",
    record.evidenceDigest,
  );

  const {
    evidenceDigest,
    ...evidenceCore
  } = record;

  if (
    sha256(evidenceCore) !==
      evidenceDigest
  ) {
    throw new Error(
      "Engineering Level-2 completion evidence integrity is invalid.",
    );
  }

  const expectedBindings =
    canonicalSourceBindings();

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_VERSION ||
    record.evidenceState !==
      "ENGINEERING_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_AUDITED" ||
    record.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    record.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.sourceBindingCount !==
      14 ||
    record.sourceBindings.length !==
      14 ||
    JSON.stringify(
      record.sourceBindings,
    ) !==
      JSON.stringify(
        expectedBindings,
      ) ||
    new Set(
      record.sourceBindings.map(
        (binding) =>
          binding.sourceId,
      ),
    ).size !==
      14 ||
    new Set(
      record.sourceBindings.map(
        (binding) =>
          binding.sourceDigest,
      ),
    ).size !==
      14
  ) {
    throw new Error(
      "Engineering Level-2 completion evidence source binding is invalid.",
    );
  }

  const summary =
    record.summary;

  if (
    summary.candidateCount !==
      8 ||
    summary.qualificationCasesExecuted !==
      800 ||
    summary.qualificationCasesPassed !==
      800 ||
    summary.qualificationCasesFailed !==
      0 ||
    summary.qualificationEvidenceCollected !==
      800 ||
    summary.ownerActivationApprovedCount !==
      8 ||
    summary.runtimeActivationExecutedCount !==
      8 ||
    summary.activatedRuntimeCount !==
      8 ||
    summary.controlledWorkAuthorizationCount !==
      8 ||
    summary.shadowReviewApprovedCount !==
      8 ||
    summary.shadowReviewRejectedCount !==
      0 ||
    summary.limitedInternalPilotPreparationAuthorizedCount !==
      8 ||
    summary.firstSyntheticPilotTaskExecutionAuthorizedCount !==
      8 ||
    summary.firstSyntheticPilotTaskExecutionReviewedCount !==
      8 ||
    summary.firstSyntheticPilotTaskExecutionApprovedCount !==
      8 ||
    summary.engineeringFirstTaskSequenceCompleted !==
      true ||
    summary.levelTwoEvidenceCriteriaSatisfied !==
      true
  ) {
    throw new Error(
      "Engineering Level-2 completion evidence summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalEvidenceBound !==
      true ||
    boundary.allCanonicalValidatorsPassed !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true ||
    boundary.ownerCompletionReviewRequired !==
      true ||
    boundary.ownerCompletionReviewAccepted !==
      false ||
    boundary.levelThreeAuthorityGranted !==
      false ||
    boundary.pilotCompleted !==
      false ||
    boundary.furtherCandidateExecutionAuthorized !==
      false ||
    boundary.secondTaskExecutionAuthorized !==
      false ||
    boundary.thirdTaskExecutionAuthorized !==
      false ||
    boundary.concurrentExecutionAuthorized !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !==
      false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.founderLiberationAchieved !==
      false ||
    boundary.founderReleasedFromRoutineExecution !==
      false
  ) {
    throw new Error(
      "Engineering Level-2 completion evidence authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_REVIEW"
  ) {
    throw new Error(
      "Engineering Level-2 completion evidence next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence(
  input:
    CreateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidenceInput,
): EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence {
  validateCanonicalSources();

  requireIdentifier(
    "Engineering Level-2 completion evidence ID",
    input.evidenceId,
  );

  requireTimestamp(
    "Engineering Level-2 completion audit time",
    input.auditedAt,
  );

  const evidenceCore = {
    version:
      ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_VERSION,

    evidenceId:
      input.evidenceId,

    evidenceState:
      "ENGINEERING_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_AUDITED" as const,

    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    sourceBindingCount:
      14 as const,

    sourceBindings:
      canonicalSourceBindings(),

    summary: {
      candidateCount:
        8 as const,
      qualificationCasesExecuted:
        800 as const,
      qualificationCasesPassed:
        800 as const,
      qualificationCasesFailed:
        0 as const,
      qualificationEvidenceCollected:
        800 as const,
      ownerActivationApprovedCount:
        8 as const,
      runtimeActivationExecutedCount:
        8 as const,
      activatedRuntimeCount:
        8 as const,
      controlledWorkAuthorizationCount:
        8 as const,
      shadowReviewApprovedCount:
        8 as const,
      shadowReviewRejectedCount:
        0 as const,
      limitedInternalPilotPreparationAuthorizedCount:
        8 as const,
      firstSyntheticPilotTaskExecutionAuthorizedCount:
        8 as const,
      firstSyntheticPilotTaskExecutionReviewedCount:
        8 as const,
      firstSyntheticPilotTaskExecutionApprovedCount:
        8 as const,
      engineeringFirstTaskSequenceCompleted:
        true as const,
      levelTwoEvidenceCriteriaSatisfied:
        true as const,
    },

    authorityBoundary: {
      canonicalEvidenceBound:
        true as const,
      allCanonicalValidatorsPassed:
        true as const,
      ownerFinalAuthorityPreserved:
        true as const,
      ownerCompletionReviewRequired:
        true as const,
      ownerCompletionReviewAccepted:
        false as const,
      levelThreeAuthorityGranted:
        false as const,
      pilotCompleted:
        false as const,
      furtherCandidateExecutionAuthorized:
        false as const,
      secondTaskExecutionAuthorized:
        false as const,
      thirdTaskExecutionAuthorized:
        false as const,
      concurrentExecutionAuthorized:
        false as const,
      repositoryReadAuthorized:
        false as const,
      repositoryWriteAuthorized:
        false as const,
      branchCreationAuthorized:
        false as const,
      pullRequestPreparationAuthorized:
        false as const,
      mergeAuthorized:
        false as const,
      secretsAccessAuthorized:
        false as const,
      realCustomerDataAccessAuthorized:
        false as const,
      realCustomerContactAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      liveProviderExecutionAuthorized:
        false as const,
      productionDatabaseAuthorized:
        false as const,
      productionMutationAuthorized:
        false as const,
      productionDeploymentAuthorized:
        false as const,
      paymentExecutionAuthorized:
        false as const,
      financialCommitmentAuthorized:
        false as const,
      legalCommitmentAuthorized:
        false as const,
      autonomousDecisionAuthorized:
        false as const,
      productionReadinessAuthorized:
        false as const,
      publicLaunchAuthorized:
        false as const,
      monitoringRequired:
        true as const,
      emergencyPauseAvailable:
        true as const,
      founderLiberationAchieved:
        false as const,
      founderReleasedFromRoutineExecution:
        false as const,
    },

    nextStep:
      "AWAIT_OWNER_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_REVIEW" as const,

    auditedAt:
      input.auditedAt,
  };

  const record =
    deepFreeze({
      ...evidenceCore,

      evidenceDigest:
        sha256(evidenceCore),
    }) as EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence;

  validateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE =
  createEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence({
    evidenceId:
      "engineering-ai-workforce-level-two-completion-criteria-evidence-001",

    auditedAt:
      "2026-07-25T15:54:00.000Z",
  });
