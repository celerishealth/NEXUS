import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceIshaanSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceLeelaSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceVivaanSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceAnayaSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceAtharvSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceMahirSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceMahirSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceZaraSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceAdvikSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-second-task-sequence-closure-evidence-preparation-v1" as const;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,159}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer|credential|private[-_]?key|access[-_]?key)/i;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((entry) =>
          stableStringify(entry),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            `${JSON.stringify(key)}:${stableStringify(record[key])}`,
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic sequence-closure evidence value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
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
    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }

    Object.freeze(value);
  }

  return value;
}

function requireSafeIdentifier(
  label: string,
  value: string,
): string {
  const normalized =
    value.trim();

  if (
    !SAFE_IDENTIFIER_PATTERN.test(
      normalized,
    ) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }

  return normalized;
}

function requireIsoTimestamp(
  label: string,
  value: string,
): string {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be a canonical ISO timestamp.`,
    );
  }

  return value;
}

const CANONICAL_ADVIK_OWNER_REVIEW =
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

function validateAllCanonicalSources(): void {
  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecution(
    ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
  );

  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  );

  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution(
    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,
  );

  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  );

  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution(
    ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
  );

  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  );

  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution(
    ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION,
  );

  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  );

  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution(
    ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION,
  );

  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  );

  validateEngineeringAIWorkforceMahirSecondSyntheticTaskExecution(
    ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION,
  );

  validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  );

  validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution(
    ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION,
  );

  validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
    ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  );

  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution(
    ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION,
  );

  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
    CANONICAL_ADVIK_OWNER_REVIEW,
  );
}

function createCandidateEvidence(
  sequence: number,
  execution: {
    readonly executionId: string;
    readonly executionDigest: string;
    readonly tenantId: string;
    readonly ownerId: string;
    readonly employeeId: string;
    readonly employeeCode: string;
    readonly publicName: string;
    readonly officialRole: string;
    readonly runtimeId: string;
    readonly taskSequence: number;
    readonly scenarioId: string;
    readonly executedAt: string;
  },
  ownerReview: {
    readonly decisionId: string;
    readonly decisionDigest: string;
    readonly tenantId: string;
    readonly ownerId: string;
    readonly decision: string;
    readonly nextStep: string;
    readonly decidedAt: string;
    readonly reviewedEmployee: {
      readonly employeeId: string;
      readonly employeeCode: string;
      readonly publicName: string;
      readonly officialRole: string;
      readonly runtimeId: string;
      readonly taskSequence: number;
      readonly scenarioId: string;
    };
  },
) {
  if (
    execution.tenantId !==
      ownerReview.tenantId ||
    execution.ownerId !==
      ownerReview.ownerId ||
    execution.employeeId !==
      ownerReview.reviewedEmployee.employeeId ||
    execution.employeeCode !==
      ownerReview.reviewedEmployee.employeeCode ||
    execution.publicName !==
      ownerReview.reviewedEmployee.publicName ||
    execution.officialRole !==
      ownerReview.reviewedEmployee.officialRole ||
    execution.runtimeId !==
      ownerReview.reviewedEmployee.runtimeId ||
    execution.taskSequence !==
      ownerReview.reviewedEmployee.taskSequence ||
    execution.scenarioId !==
      ownerReview.reviewedEmployee.scenarioId ||
    execution.taskSequence !== 2 ||
    Date.parse(ownerReview.decidedAt) <
      Date.parse(execution.executedAt)
  ) {
    throw new Error(
      `Candidate sequence ${sequence} execution and owner-review evidence do not reconcile.`,
    );
  }

  return deepFreeze({
    sequence,

    employeeId:
      execution.employeeId,

    employeeCode:
      execution.employeeCode,

    publicName:
      execution.publicName,

    officialRole:
      execution.officialRole,

    runtimeId:
      execution.runtimeId,

    taskSequence:
      2 as const,

    scenarioId:
      execution.scenarioId,

    executionId:
      execution.executionId,

    executionDigest:
      execution.executionDigest,

    executedAt:
      execution.executedAt,

    ownerReviewDecisionId:
      ownerReview.decisionId,

    ownerReviewDecisionDigest:
      ownerReview.decisionDigest,

    ownerReviewDecision:
      ownerReview.decision,

    ownerReviewNextStep:
      ownerReview.nextStep,

    ownerReviewedAt:
      ownerReview.decidedAt,

    executionCompleted:
      true as const,

    ownerReviewCompleted:
      true as const,

    deterministicEvidenceBound:
      true as const,
  });
}

function canonicalCandidateEvidence() {
  return deepFreeze([
    createCandidateEvidence(
      1,
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
    ),

    createCandidateEvidence(
      2,
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
    ),

    createCandidateEvidence(
      3,
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
    ),

    createCandidateEvidence(
      4,
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION,
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
    ),

    createCandidateEvidence(
      5,
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION,
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
    ),

    createCandidateEvidence(
      6,
      ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION,
      ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
    ),

    createCandidateEvidence(
      7,
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION,
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
    ),

    createCandidateEvidence(
      8,
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION,
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
    ),
  ] as const);
}

export interface CreateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparationInput {
  readonly evidenceId: string;

  readonly advikOwnerReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

  readonly preparedAt: string;
}

function buildSequenceClosureEvidencePreparation(
  evidenceId: string,
  preparedAt: string,
) {
  const candidateEvidence =
    canonicalCandidateEvidence();

  const evidenceCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION_VERSION,

    evidenceId,

    evidenceState:
      "ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARED" as const,

    tenantId:
      CANONICAL_ADVIK_OWNER_REVIEW
        .tenantId,

    ownerId:
      CANONICAL_ADVIK_OWNER_REVIEW
        .ownerId,

    sourceAdvikOwnerReviewDecisionId:
      CANONICAL_ADVIK_OWNER_REVIEW
        .decisionId,

    sourceAdvikOwnerReviewDecisionDigest:
      CANONICAL_ADVIK_OWNER_REVIEW
        .decisionDigest,

    workstreamId:
      "routine-engineering-second-task-evidence" as const,

    evidenceClass:
      "ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_PREPARATION_EVIDENCE" as const,

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY" as const,

    preparationMode:
      "READ_ONLY_DETERMINISTIC_EVIDENCE_AGGREGATION" as const,

    candidateCount:
      8 as const,

    executedCandidateCount:
      8 as const,

    ownerReviewedCandidateCount:
      8 as const,

    taskSequence:
      2 as const,

    candidateEvidence,

    sequenceSummary: {
      allEightCandidateSecondTaskExecutionsCompleted:
        true as const,

      allEightCandidateOwnerReviewsCompleted:
        true as const,

      exactCandidateOrderVerified:
        true as const,

      executionAndReviewDigestsBound:
        true as const,

      chronologicalReviewOrderingVerified:
        true as const,

      duplicateCandidateIdentityDetected:
        false as const,

      missingCandidateEvidenceDetected:
        false as const,

      unresolvedCandidateExecutionRemaining:
        false as const,

      closureEvidencePrepared:
        true as const,

      closureOwnerReviewRequired:
        true as const,

      closureOwnerReviewCompleted:
        false as const,

      closureOwnerAcceptanceRecorded:
        false as const,

      secondTaskSequenceClosed:
        false as const,
    },

    authorityBoundary: {
      canonicalAdvikOwnerReviewBound:
        true as const,

      sourceAdvikOwnerReviewIntegrityVerified:
        true as const,

      allCanonicalExecutionSourcesValidated:
        true as const,

      allCanonicalOwnerReviewSourcesValidated:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      exactEightCandidateSequenceBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      sequenceClosureEvidencePreparationAuthorized:
        true as const,

      sequenceClosureEvidencePrepared:
        true as const,

      sequenceClosureOwnerReviewRequired:
        true as const,

      sequenceClosureOwnerReviewCompleted:
        false as const,

      sequenceClosureOwnerAcceptanceRecorded:
        false as const,

      secondTaskSequenceClosed:
        false as const,

      nextCandidateExecutionAuthorized:
        false as const,

      noCandidateExecutionRemaining:
        true as const,

      noLaterCandidateExecutionAuthorized:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      thirdSyntheticTaskExecutionAuthorized:
        false as const,

      levelThreeEvaluationAuthorized:
        false as const,

      levelThreeAuthorityGranted:
        false as const,

      adversarialExecutionAuthorized:
        false as const,

      authorityBypassAuthorized:
        false as const,

      evidenceSubstitutionAuthorized:
        false as const,

      protectedMaterialUsed:
        false as const,

      secretsAccessAuthorized:
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

      founderLiberationAchieved:
        false as const,

      founderReleasedFromRoutineExecution:
        false as const,

      monitoringRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,

      rollbackEvidenceRequired:
        true as const,

      ownerFinalAuthorityPreserved:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_REVIEW" as const,

    preparedAt,
  };

  return deepFreeze({
    ...evidenceCore,

    evidenceDigest:
      sha256(evidenceCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation =
  ReturnType<
    typeof buildSequenceClosureEvidencePreparation
  >;

export function validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation,
): void {
  const {
    evidenceDigest,
    ...evidenceCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      evidenceDigest,
    ) ||
    evidenceDigest !==
      sha256(evidenceCore)
  ) {
    throw new Error(
      "Second-task sequence-closure preparation integrity verification failed.",
    );
  }

  validateAllCanonicalSources();

  const canonicalEvidence =
    canonicalCandidateEvidence();

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION_VERSION ||
    record.evidenceState !==
      "ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARED" ||
    record.tenantId !==
      CANONICAL_ADVIK_OWNER_REVIEW.tenantId ||
    record.ownerId !==
      CANONICAL_ADVIK_OWNER_REVIEW.ownerId ||
    record.sourceAdvikOwnerReviewDecisionId !==
      CANONICAL_ADVIK_OWNER_REVIEW.decisionId ||
    record.sourceAdvikOwnerReviewDecisionDigest !==
      CANONICAL_ADVIK_OWNER_REVIEW.decisionDigest ||
    record.workstreamId !==
      "routine-engineering-second-task-evidence" ||
    record.evidenceClass !==
      "ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_PREPARATION_EVIDENCE" ||
    record.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    record.preparationMode !==
      "READ_ONLY_DETERMINISTIC_EVIDENCE_AGGREGATION" ||
    record.candidateCount !== 8 ||
    record.executedCandidateCount !==
      8 ||
    record.ownerReviewedCandidateCount !==
      8 ||
    record.taskSequence !== 2
  ) {
    throw new Error(
      "Second-task sequence-closure preparation canonical binding is invalid.",
    );
  }

  if (
    record.candidateEvidence.length !==
      8 ||
    record.candidateEvidence.some(
      (entry, index) =>
        entry.sequence !==
          index + 1 ||
        entry.taskSequence !==
          2 ||
        entry.executionCompleted !==
          true ||
        entry.ownerReviewCompleted !==
          true ||
        entry.deterministicEvidenceBound !==
          true ||
        entry.executionId !==
          canonicalEvidence[index]
            .executionId ||
        entry.executionDigest !==
          canonicalEvidence[index]
            .executionDigest ||
        entry.ownerReviewDecisionId !==
          canonicalEvidence[index]
            .ownerReviewDecisionId ||
        entry.ownerReviewDecisionDigest !==
          canonicalEvidence[index]
            .ownerReviewDecisionDigest ||
        entry.employeeId !==
          canonicalEvidence[index]
            .employeeId ||
        entry.employeeCode !==
          canonicalEvidence[index]
            .employeeCode ||
        entry.scenarioId !==
          canonicalEvidence[index]
            .scenarioId ||
        Date.parse(
          entry.ownerReviewedAt,
        ) <
          Date.parse(
            entry.executedAt,
          ),
    )
  ) {
    throw new Error(
      "Second-task candidate closure evidence is invalid.",
    );
  }

  const employeeIds =
    record.candidateEvidence.map(
      (entry) =>
        entry.employeeId,
    );

  const executionIds =
    record.candidateEvidence.map(
      (entry) =>
        entry.executionId,
    );

  const ownerReviewIds =
    record.candidateEvidence.map(
      (entry) =>
        entry.ownerReviewDecisionId,
    );

  if (
    new Set(employeeIds).size !== 8 ||
    new Set(executionIds).size !== 8 ||
    new Set(ownerReviewIds).size !==
      8
  ) {
    throw new Error(
      "Second-task sequence contains duplicate canonical evidence.",
    );
  }

  const summary =
    record.sequenceSummary;

  const summaryRequiredTrue = [
    summary.allEightCandidateSecondTaskExecutionsCompleted,
    summary.allEightCandidateOwnerReviewsCompleted,
    summary.exactCandidateOrderVerified,
    summary.executionAndReviewDigestsBound,
    summary.chronologicalReviewOrderingVerified,
    summary.closureEvidencePrepared,
    summary.closureOwnerReviewRequired,
  ];

  const summaryRequiredFalse = [
    summary.duplicateCandidateIdentityDetected,
    summary.missingCandidateEvidenceDetected,
    summary.unresolvedCandidateExecutionRemaining,
    summary.closureOwnerReviewCompleted,
    summary.closureOwnerAcceptanceRecorded,
    summary.secondTaskSequenceClosed,
  ];

  if (
    summaryRequiredTrue.some(
      (value) =>
        value !== true,
    ) ||
    summaryRequiredFalse.some(
      (value) =>
        value !== false,
    )
  ) {
    throw new Error(
      "Second-task sequence summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalAdvikOwnerReviewBound,
    boundary.sourceAdvikOwnerReviewIntegrityVerified,
    boundary.allCanonicalExecutionSourcesValidated,
    boundary.allCanonicalOwnerReviewSourcesValidated,
    boundary.tenantIdentityBound,
    boundary.ownerIdentityBound,
    boundary.exactEightCandidateSequenceBound,
    boundary.sequenceClosureEvidencePreparationAuthorized,
    boundary.sequenceClosureEvidencePrepared,
    boundary.sequenceClosureOwnerReviewRequired,
    boundary.noCandidateExecutionRemaining,
    boundary.noLaterCandidateExecutionAuthorized,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.sequenceClosureOwnerReviewCompleted,
    boundary.sequenceClosureOwnerAcceptanceRecorded,
    boundary.secondTaskSequenceClosed,
    boundary.nextCandidateExecutionAuthorized,
    boundary.concurrentCandidateExecutionAuthorized,
    boundary.thirdSyntheticTaskExecutionAuthorized,
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.adversarialExecutionAuthorized,
    boundary.authorityBypassAuthorized,
    boundary.evidenceSubstitutionAuthorized,
    boundary.protectedMaterialUsed,
    boundary.secretsAccessAuthorized,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.realCustomerDataAccessAuthorized,
    boundary.realCustomerContactAuthorized,
    boundary.externalDeliveryAuthorized,
    boundary.liveProviderExecutionAuthorized,
    boundary.productionDatabaseAuthorized,
    boundary.productionMutationAuthorized,
    boundary.productionDeploymentAuthorized,
    boundary.paymentExecutionAuthorized,
    boundary.financialCommitmentAuthorized,
    boundary.legalCommitmentAuthorized,
    boundary.autonomousDecisionAuthorized,
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  if (
    requiredTrue.some(
      (value) =>
        value !== true,
    ) ||
    requiredFalse.some(
      (value) =>
        value !== false,
    )
  ) {
    throw new Error(
      "Second-task sequence-closure authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_REVIEW" ||
    Date.parse(record.preparedAt) <
      Date.parse(
        CANONICAL_ADVIK_OWNER_REVIEW
          .decidedAt,
      )
  ) {
    throw new Error(
      "Second-task sequence-closure preparation transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.candidateEvidence,
    ) ||
    record.candidateEvidence.some(
      (entry) =>
        !Object.isFrozen(entry),
    ) ||
    !Object.isFrozen(
      record.sequenceSummary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Second-task sequence-closure preparation must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparationInput,
): EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation {
  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
    input.advikOwnerReviewDecision,
  );

  if (
    input.advikOwnerReviewDecision.decisionId !==
      CANONICAL_ADVIK_OWNER_REVIEW.decisionId ||
    input.advikOwnerReviewDecision.decisionDigest !==
      CANONICAL_ADVIK_OWNER_REVIEW.decisionDigest
  ) {
    throw new Error(
      "Only the canonical Advik owner review can authorize closure-evidence preparation.",
    );
  }

  if (
    CANONICAL_ADVIK_OWNER_REVIEW.decision !==
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION" ||
    CANONICAL_ADVIK_OWNER_REVIEW
      .sequenceClosureEvidencePreparationAuthorized !==
      true ||
    CANONICAL_ADVIK_OWNER_REVIEW
      .sequenceClosureEvidencePrepared !==
      false ||
    CANONICAL_ADVIK_OWNER_REVIEW
      .secondTaskSequenceClosed !==
      false ||
    CANONICAL_ADVIK_OWNER_REVIEW
      .authorityBoundary
      .allEightCandidateSecondTaskExecutionsCompleted !==
      true ||
    CANONICAL_ADVIK_OWNER_REVIEW
      .authorityBoundary
      .allEightCandidateOwnerReviewsCompleted !==
      true ||
    CANONICAL_ADVIK_OWNER_REVIEW
      .authorityBoundary
      .noCandidateExecutionRemaining !==
      true ||
    CANONICAL_ADVIK_OWNER_REVIEW
      .nextStep !==
      "PREPARE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE"
  ) {
    throw new Error(
      "Second-task sequence-closure evidence preparation is not owner-authorized.",
    );
  }

  const evidenceId =
    requireSafeIdentifier(
      "Sequence-closure evidence identity",
      input.evidenceId,
    );

  const preparedAt =
    requireIsoTimestamp(
      "Sequence-closure preparation time",
      input.preparedAt,
    );

  if (
    Date.parse(preparedAt) <
      Date.parse(
        CANONICAL_ADVIK_OWNER_REVIEW
          .decidedAt,
      )
  ) {
    throw new Error(
      "Sequence-closure evidence preparation cannot precede Advik owner review.",
    );
  }

  validateAllCanonicalSources();

  const record =
    buildSequenceClosureEvidencePreparation(
      evidenceId,
      preparedAt,
    );

  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation({
    evidenceId:
      "engineering-post-level-two-second-task-sequence-closure-evidence-001",

    advikOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    preparedAt:
      "2026-08-02T11:35:00.000Z",
  });