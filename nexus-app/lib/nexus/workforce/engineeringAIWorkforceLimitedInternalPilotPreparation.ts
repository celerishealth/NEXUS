import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
} from "./engineeringAIWorkforceControlledShadowOperationExecution";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,
  validateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision,
} from "./engineeringAIWorkforceOwnerControlledShadowOperationReviewDecision";

export const ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-limited-internal-pilot-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PROFILES = [
  {
    publicName:
      "Ishaan",

    scenarios: [
      "BOUNDED_MODULAR_ARCHITECTURE_REVIEW",
      "SCALE_THRESHOLD_ASSESSMENT",
      "ROLLBACK_AND_TENANT_ISOLATION_REVIEW",
    ],
  },
  {
    publicName:
      "Leela",

    scenarios: [
      "EVIDENCE_GATED_DELIVERY_PLAN",
      "ENGINEERING_BLOCKER_ESCALATION",
      "RELEASE_BOUNDARY_REVIEW",
    ],
  },
  {
    publicName:
      "Vivaan",

    scenarios: [
      "TARGETED_QUALITY_GAP_ANALYSIS",
      "REGRESSION_EVIDENCE_REVIEW",
      "FAILURE_CLASSIFICATION_REVIEW",
    ],
  },
  {
    publicName:
      "Anaya",

    scenarios: [
      "AUTHORITY_ESCALATION_THREAT_REVIEW",
      "CROSS_TENANT_EVIDENCE_TAMPER_REVIEW",
      "SECRET_HANDLING_BOUNDARY_REVIEW",
    ],
  },
  {
    publicName:
      "Atharv",

    scenarios: [
      "RECOVERY_EVIDENCE_REVIEW",
      "FAIL_CLOSED_DEGRADATION_REVIEW",
      "EMERGENCY_PAUSE_RELIABILITY_REVIEW",
    ],
  },
  {
    publicName:
      "Mahir",

    scenarios: [
      "SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN",
      "BLAST_RADIUS_CONTROL_REVIEW",
      "ROLLBACK_AND_STOP_CONDITION_REVIEW",
    ],
  },
  {
    publicName:
      "Zara",

    scenarios: [
      "SCHEMA_AND_LINEAGE_VALIDATION",
      "DUPLICATE_AND_IDEMPOTENCY_REVIEW",
      "TENANT_SCOPED_DATA_AUDIT_REVIEW",
    ],
  },
  {
    publicName:
      "Advik",

    scenarios: [
      "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN",
      "CROSS_OWNER_CROSS_TENANT_ATTACK_PLAN",
      "PROMPTED_AUTHORITY_ESCALATION_TEST_PLAN",
    ],
  },
] as const;

export interface CreateEngineeringAIWorkforceLimitedInternalPilotPreparationInput {
  readonly preparationId:
    string;

  readonly ownerControlledShadowOperationReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION;

  readonly preparedAt:
    string;
}

export interface EngineeringAIWorkforceCandidateLimitedInternalPilotPreparation {
  readonly developmentSequence:
    number;

  readonly preparationState:
    "ENGINEERING_CANDIDATE_LIMITED_INTERNAL_PILOT_PREPARED";

  readonly employeeId:
    string;

  readonly employeeCode:
    string;

  readonly publicName:
    string;

  readonly officialRole:
    string;

  readonly runtimeId:
    string;

  readonly sourceCandidateReviewDigest:
    string;

  readonly sourceCandidateExecutionDigest:
    string;

  readonly pilotPlan: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    evidenceToolId:
      "tool-engineering-pilot-evidence-read";

    evidenceToolMode:
      "READ_ONLY";

    draftToolId:
      "tool-engineering-pilot-draft";

    draftToolMode:
      "DRAFT_ONLY";

    maximumTaskCount:
      3;

    concurrentTaskLimit:
      1;

    failureThreshold:
      1;

    ownerReviewFrequency:
      "AFTER_EVERY_PILOT_TASK";

    externalDeliveryMode:
      "DISABLED";

    productionMutationMode:
      "DISABLED";

    scenarios:
      readonly string[];
  }>;

  readonly specialistStandard: Readonly<{
    aiIdentityTransparent:
      true;

    evidenceGroundingRequired:
      true;

    verifiedFactsSeparatedFromAssumptions:
      true;

    missingEvidenceIdentified:
      true;

    clarificationBeforeGuessingRequired:
      true;

    riskLevelRequired:
      true;

    uncertaintyRequired:
      true;

    practicalTradeoffsRequired:
      true;

    ownerReadyBriefRequired:
      true;

    unsupportedClaimsBlocked:
      true;

    urgencyExaggerationBlocked:
      true;

    guaranteeBlocked:
      true;

    tenantIsolationRequired:
      true;

    ownerControlRequired:
      true;

    rollbackAwarenessRequired:
      true;

    auditEvidenceRequired:
      true;
  }>;

  readonly authorityBoundary: Readonly<{
    ownerReviewDecisionBound:
      true;

    ownerReviewDecisionIntegrityVerified:
      true;

    ownerPilotPreparationApprovalBound:
      true;

    controlledShadowExecutionBound:
      true;

    candidateIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    approvalBypassAllowed:
      false;

    limitedInternalPilotPreparationAuthorized:
      true;

    limitedInternalPilotExecutionAuthorized:
      false;

    syntheticPilotTaskExecutionAuthorized:
      false;

    pilotTaskExecuted:
      false;

    pilotDraftCreated:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    monitoringRequired:
      true;

    ownerReviewAfterEveryPilotTask:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly candidatePreparationDigest:
    string;
}

export interface EngineeringAIWorkforceLimitedInternalPilotPreparation {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION;

  readonly preparationId:
    string;

  readonly preparationState:
    "ENGINEERING_LIMITED_INTERNAL_PILOTS_PREPARED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly sourceReviewDecisionId:
    string;

  readonly sourceReviewDecisionDigest:
    string;

  readonly sourceControlledShadowExecutionId:
    string;

  readonly sourceControlledShadowExecutionDigest:
    string;

  readonly candidatePreparationCount:
    8;

  readonly candidatePreparations:
    readonly EngineeringAIWorkforceCandidateLimitedInternalPilotPreparation[];

  readonly aggregateSummary: Readonly<{
    reviewedCandidateCount:
      8;

    approvedCandidateCount:
      8;

    preparedPilotCount:
      8;

    pilotExecutionEligibleCount:
      0;

    pilotExecutionAuthorizedCount:
      0;

    pilotTaskExecutedCount:
      0;

    pilotDraftCreatedCount:
      0;

    maximumTaskCountPerCandidate:
      3;

    maximumAggregateTaskCount:
      24;

    aggregateConcurrentTaskLimit:
      8;

    failureThresholdPerCandidate:
      1;

    ownerReviewAfterEveryTaskCount:
      8;

    monitoringRequiredCount:
      8;

    uniqueScenarioCount:
      24;

    uniqueCandidatePreparationDigests:
      8;
  }>;

  readonly authorityBoundary: Readonly<{
    canonicalOwnerReviewDecisionBound:
      true;

    canonicalControlledShadowExecutionBound:
      true;

    exactEightCandidatesRequired:
      true;

    allEightOwnerApprovalsVerified:
      true;

    controlledInternalSyntheticPilotOnly:
      true;

    syntheticSanitizedDataOnly:
      true;

    readOnlyEvidenceToolsOnly:
      true;

    draftOnlyToolsOnly:
      true;

    approvalBypassAllowed:
      false;

    limitedInternalPilotPreparationAuthorized:
      true;

    limitedInternalPilotPreparationAuthorizedCount:
      8;

    limitedInternalPilotExecutionAuthorized:
      false;

    limitedInternalPilotExecutionAuthorizedCount:
      0;

    pilotTaskExecutedCount:
      0;

    pilotDraftCreatedCount:
      0;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    monitoringRequired:
      true;

    ownerReviewAfterEveryPilotTask:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_ENGINEERING_LIMITED_INTERNAL_PILOT_EXECUTION_DECISIONS";

  readonly preparedAt:
    string;

  readonly preparationDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

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
      "Unsupported deterministic Engineering limited-pilot preparation value.",
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
  if (
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} is invalid or secret-bearing.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireUnique(
  label: string,
  values: readonly string[],
): void {
  if (
    new Set(values).size !==
      values.length
  ) {
    throw new Error(
      `${label} must remain unique.`,
    );
  }
}

function validateApprovalSource(): void {
  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  );

  validateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
    ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,
  );

  const decision =
    ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION;

  if (
    decision.decisionState !==
      "OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS_RECORDED" ||
    decision.candidateReviews.length !==
      8 ||
    decision.aggregateSummary
      .reviewedCandidateCount !==
        8 ||
    decision.aggregateSummary
      .approvedCandidateCount !==
        8 ||
    decision.aggregateSummary
      .rejectedCandidateCount !==
        0 ||
    decision.aggregateSummary
      .limitedInternalPilotPreparationEligibleCount !==
        8 ||
    decision.aggregateSummary
      .limitedInternalPilotExecutionAuthorizedCount !==
        0 ||
    decision.authorityBoundary
      .limitedInternalPilotPreparationAuthorized !==
        true ||
    decision.authorityBoundary
      .limitedInternalPilotPreparationAuthorizedCount !==
        8 ||
    decision.authorityBoundary
      .limitedInternalPilotExecutionAuthorized !==
        false ||
    decision.nextStep !==
      "PREPARE_ENGINEERING_LIMITED_INTERNAL_PILOTS"
  ) {
    throw new Error(
      "Engineering limited-internal-pilot preparation requires all eight explicit owner approvals.",
    );
  }
}

export function validateEngineeringAIWorkforceLimitedInternalPilotPreparation(
  preparation:
    EngineeringAIWorkforceLimitedInternalPilotPreparation,
): void {
  validateApprovalSource();

  requireIdentifier(
    "Engineering limited-internal-pilot preparation ID",
    preparation.preparationId,
  );

  requireTimestamp(
    "Engineering limited-internal-pilot preparation time",
    preparation.preparedAt,
  );

  requireDigest(
    "Engineering limited-internal-pilot preparation digest",
    preparation.preparationDigest,
  );

  const decision =
    ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION;

  const execution =
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION;

  if (
    preparation.version !==
      ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION ||
    preparation.preparationState !==
      "ENGINEERING_LIMITED_INTERNAL_PILOTS_PREPARED" ||
    preparation.tenantId !==
      decision.tenantId ||
    preparation.ownerId !==
      decision.ownerId ||
    preparation.sourceReviewDecisionId !==
      decision.decisionId ||
    preparation.sourceReviewDecisionDigest !==
      decision.decisionDigest ||
    preparation.sourceControlledShadowExecutionId !==
      execution.executionId ||
    preparation.sourceControlledShadowExecutionDigest !==
      execution.executionDigest ||
    preparation.candidatePreparationCount !==
      8 ||
    preparation.candidatePreparations.length !==
      8
  ) {
    throw new Error(
      "Engineering limited-internal-pilot preparation identity is invalid.",
    );
  }

  requireUnique(
    "Engineering limited-pilot candidate preparation digests",
    preparation.candidatePreparations.map(
      (entry) =>
        entry.candidatePreparationDigest,
    ),
  );

  requireUnique(
    "Engineering limited-pilot scenarios",
    preparation.candidatePreparations.flatMap(
      (entry) =>
        entry.pilotPlan.scenarios,
    ),
  );

  preparation.candidatePreparations.forEach(
    (
      entry,
      index,
    ) => {
      const review =
        decision.candidateReviews[index];

      const candidateExecution =
        execution.candidateExecutions[index];

      const profile =
        ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PROFILES[index];

      if (
        !review ||
        !candidateExecution ||
        !profile
      ) {
        throw new Error(
          "Engineering limited-pilot source evidence is missing.",
        );
      }

      requireDigest(
        "Engineering candidate limited-pilot preparation digest",
        entry.candidatePreparationDigest,
      );

      const {
        candidatePreparationDigest,
        ...entryCore
      } = entry;

      const plan =
        entry.pilotPlan;

      const standard =
        entry.specialistStandard;

      const boundary =
        entry.authorityBoundary;

      if (
        sha256(entryCore) !==
          candidatePreparationDigest ||
        entry.developmentSequence !==
          index + 1 ||
        entry.preparationState !==
          "ENGINEERING_CANDIDATE_LIMITED_INTERNAL_PILOT_PREPARED" ||
        entry.employeeId !==
          review.employeeId ||
        entry.employeeCode !==
          review.employeeCode ||
        entry.publicName !==
          review.publicName ||
        entry.publicName !==
          profile.publicName ||
        entry.officialRole !==
          review.officialRole ||
        entry.runtimeId !==
          review.runtimeId ||
        entry.sourceCandidateReviewDigest !==
          review.candidateReviewDigest ||
        entry.sourceCandidateExecutionDigest !==
          candidateExecution.candidateExecutionDigest ||
        review.decision !==
          "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" ||
        review.limitedInternalPilotPreparationEligible !==
          true ||
        plan.pilotClass !==
          "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
        plan.dataClassification !==
          "SYNTHETIC_SANITIZED_ONLY" ||
        plan.actorClass !==
          "OWNER_SUPERVISED_INTERNAL_ONLY" ||
        plan.executionMode !==
          "SANDBOX_ONLY" ||
        plan.evidenceToolId !==
          "tool-engineering-pilot-evidence-read" ||
        plan.evidenceToolMode !==
          "READ_ONLY" ||
        plan.draftToolId !==
          "tool-engineering-pilot-draft" ||
        plan.draftToolMode !==
          "DRAFT_ONLY" ||
        plan.maximumTaskCount !==
          3 ||
        plan.concurrentTaskLimit !==
          1 ||
        plan.failureThreshold !==
          1 ||
        plan.ownerReviewFrequency !==
          "AFTER_EVERY_PILOT_TASK" ||
        plan.externalDeliveryMode !==
          "DISABLED" ||
        plan.productionMutationMode !==
          "DISABLED" ||
        plan.scenarios.length !==
          3 ||
        plan.scenarios.some(
          (
            scenario,
            scenarioIndex,
          ) =>
            scenario !==
              profile.scenarios[scenarioIndex],
        )
      ) {
        throw new Error(
          "Engineering candidate limited-internal-pilot plan is invalid.",
        );
      }

      if (
        standard.aiIdentityTransparent !==
          true ||
        standard.evidenceGroundingRequired !==
          true ||
        standard.verifiedFactsSeparatedFromAssumptions !==
          true ||
        standard.missingEvidenceIdentified !==
          true ||
        standard.clarificationBeforeGuessingRequired !==
          true ||
        standard.riskLevelRequired !==
          true ||
        standard.uncertaintyRequired !==
          true ||
        standard.practicalTradeoffsRequired !==
          true ||
        standard.ownerReadyBriefRequired !==
          true ||
        standard.unsupportedClaimsBlocked !==
          true ||
        standard.urgencyExaggerationBlocked !==
          true ||
        standard.guaranteeBlocked !==
          true ||
        standard.tenantIsolationRequired !==
          true ||
        standard.ownerControlRequired !==
          true ||
        standard.rollbackAwarenessRequired !==
          true ||
        standard.auditEvidenceRequired !==
          true
      ) {
        throw new Error(
          "Engineering limited-internal-pilot specialist standard is invalid.",
        );
      }

      if (
        boundary.ownerReviewDecisionBound !==
          true ||
        boundary.ownerReviewDecisionIntegrityVerified !==
          true ||
        boundary.ownerPilotPreparationApprovalBound !==
          true ||
        boundary.controlledShadowExecutionBound !==
          true ||
        boundary.candidateIdentityBound !==
          true ||
        boundary.runtimeIdentityBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.approvalBypassAllowed !==
          false ||
        boundary.limitedInternalPilotPreparationAuthorized !==
          true ||
        boundary.limitedInternalPilotExecutionAuthorized !==
          false ||
        boundary.syntheticPilotTaskExecutionAuthorized !==
          false ||
        boundary.pilotTaskExecuted !==
          false ||
        boundary.pilotDraftCreated !==
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
        boundary.productionDeploymentAuthorized !==
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
        boundary.ownerReviewAfterEveryPilotTask !==
          true ||
        boundary.emergencyPauseAvailable !==
          true
      ) {
        throw new Error(
          "Engineering candidate limited-internal-pilot preparation authority boundary is invalid.",
        );
      }
    },
  );

  const summary =
    preparation.aggregateSummary;

  if (
    summary.reviewedCandidateCount !==
      8 ||
    summary.approvedCandidateCount !==
      8 ||
    summary.preparedPilotCount !==
      8 ||
    summary.pilotExecutionEligibleCount !==
      0 ||
    summary.pilotExecutionAuthorizedCount !==
      0 ||
    summary.pilotTaskExecutedCount !==
      0 ||
    summary.pilotDraftCreatedCount !==
      0 ||
    summary.maximumTaskCountPerCandidate !==
      3 ||
    summary.maximumAggregateTaskCount !==
      24 ||
    summary.aggregateConcurrentTaskLimit !==
      8 ||
    summary.failureThresholdPerCandidate !==
      1 ||
    summary.ownerReviewAfterEveryTaskCount !==
      8 ||
    summary.monitoringRequiredCount !==
      8 ||
    summary.uniqueScenarioCount !==
      24 ||
    summary.uniqueCandidatePreparationDigests !==
      8
  ) {
    throw new Error(
      "Engineering limited-internal-pilot preparation aggregate summary is invalid.",
    );
  }

  const boundary =
    preparation.authorityBoundary;

  if (
    boundary.canonicalOwnerReviewDecisionBound !==
      true ||
    boundary.canonicalControlledShadowExecutionBound !==
      true ||
    boundary.exactEightCandidatesRequired !==
      true ||
    boundary.allEightOwnerApprovalsVerified !==
      true ||
    boundary.controlledInternalSyntheticPilotOnly !==
      true ||
    boundary.syntheticSanitizedDataOnly !==
      true ||
    boundary.readOnlyEvidenceToolsOnly !==
      true ||
    boundary.draftOnlyToolsOnly !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.limitedInternalPilotPreparationAuthorized !==
      true ||
    boundary.limitedInternalPilotPreparationAuthorizedCount !==
      8 ||
    boundary.limitedInternalPilotExecutionAuthorized !==
      false ||
    boundary.limitedInternalPilotExecutionAuthorizedCount !==
      0 ||
    boundary.pilotTaskExecutedCount !==
      0 ||
    boundary.pilotDraftCreatedCount !==
      0 ||
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
    boundary.productionDeploymentAuthorized !==
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
    boundary.ownerReviewAfterEveryPilotTask !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    preparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_LIMITED_INTERNAL_PILOT_EXECUTION_DECISIONS"
  ) {
    throw new Error(
      "Engineering limited-internal-pilot preparation aggregate authority boundary is invalid.",
    );
  }

  if (
    Date.parse(preparation.preparedAt) <
    Date.parse(
      ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION
        .decidedAt,
    )
  ) {
    throw new Error(
      "Engineering limited-internal-pilot preparation cannot precede the owner review decision.",
    );
  }

  const {
    preparationDigest,
    ...preparationCore
  } = preparation;

  if (
    sha256(preparationCore) !==
      preparationDigest
  ) {
    throw new Error(
      "Engineering limited-internal-pilot preparation integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(preparation) ||
    !Object.isFrozen(
      preparation.candidatePreparations,
    ) ||
    preparation.candidatePreparations.some(
      (entry) =>
        !Object.isFrozen(entry) ||
        !Object.isFrozen(
          entry.pilotPlan,
        ) ||
        !Object.isFrozen(
          entry.pilotPlan.scenarios,
        ) ||
        !Object.isFrozen(
          entry.specialistStandard,
        ) ||
        !Object.isFrozen(
          entry.authorityBoundary,
        ),
    ) ||
    !Object.isFrozen(
      preparation.aggregateSummary,
    ) ||
    !Object.isFrozen(
      preparation.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering limited-internal-pilot preparation must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceLimitedInternalPilotPreparation(
  input:
    CreateEngineeringAIWorkforceLimitedInternalPilotPreparationInput,
): EngineeringAIWorkforceLimitedInternalPilotPreparation {
  if (
    input.ownerControlledShadowOperationReviewDecision !==
      ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION
  ) {
    throw new Error(
      "Only the canonical Engineering owner controlled-shadow review decision can prepare limited internal pilots.",
    );
  }

  validateApprovalSource();

  requireIdentifier(
    "Engineering limited-internal-pilot preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Engineering limited-internal-pilot preparation time",
    input.preparedAt,
  );

  const decision =
    input.ownerControlledShadowOperationReviewDecision;

  const execution =
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION;

  if (
    Date.parse(input.preparedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Engineering limited-internal-pilot preparation cannot precede the owner review decision.",
    );
  }

  const candidatePreparations =
    decision.candidateReviews.map(
      (
        review,
        index,
      ) => {
        const candidateExecution =
          execution.candidateExecutions[index];

        const profile =
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PROFILES[index];

        if (
          !candidateExecution ||
          !profile ||
          profile.publicName !==
            review.publicName
        ) {
          throw new Error(
            "Engineering limited-pilot specialist evidence is not correctly bound.",
          );
        }

        if (
          review.decision !==
            "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" ||
          review.shadowOperationApproved !==
            true ||
          review.limitedInternalPilotPreparationEligible !==
            true ||
          review.authorityBoundary
            .limitedInternalPilotPreparationAuthorized !==
              true ||
          review.authorityBoundary
            .limitedInternalPilotExecutionAuthorized !==
              false
        ) {
          throw new Error(
            "Engineering limited-internal-pilot preparation requires explicit owner approval for every specialist.",
          );
        }

        const entryCore = {
          developmentSequence:
            index + 1,

          preparationState:
            "ENGINEERING_CANDIDATE_LIMITED_INTERNAL_PILOT_PREPARED" as const,

          employeeId:
            review.employeeId,

          employeeCode:
            review.employeeCode,

          publicName:
            review.publicName,

          officialRole:
            review.officialRole,

          runtimeId:
            review.runtimeId,

          sourceCandidateReviewDigest:
            review.candidateReviewDigest,

          sourceCandidateExecutionDigest:
            candidateExecution.candidateExecutionDigest,

          pilotPlan: {
            pilotClass:
              "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

            dataClassification:
              "SYNTHETIC_SANITIZED_ONLY" as const,

            actorClass:
              "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

            executionMode:
              "SANDBOX_ONLY" as const,

            evidenceToolId:
              "tool-engineering-pilot-evidence-read" as const,

            evidenceToolMode:
              "READ_ONLY" as const,

            draftToolId:
              "tool-engineering-pilot-draft" as const,

            draftToolMode:
              "DRAFT_ONLY" as const,

            maximumTaskCount:
              3 as const,

            concurrentTaskLimit:
              1 as const,

            failureThreshold:
              1 as const,

            ownerReviewFrequency:
              "AFTER_EVERY_PILOT_TASK" as const,

            externalDeliveryMode:
              "DISABLED" as const,

            productionMutationMode:
              "DISABLED" as const,

            scenarios:
              profile.scenarios,
          },

          specialistStandard: {
            aiIdentityTransparent:
              true as const,

            evidenceGroundingRequired:
              true as const,

            verifiedFactsSeparatedFromAssumptions:
              true as const,

            missingEvidenceIdentified:
              true as const,

            clarificationBeforeGuessingRequired:
              true as const,

            riskLevelRequired:
              true as const,

            uncertaintyRequired:
              true as const,

            practicalTradeoffsRequired:
              true as const,

            ownerReadyBriefRequired:
              true as const,

            unsupportedClaimsBlocked:
              true as const,

            urgencyExaggerationBlocked:
              true as const,

            guaranteeBlocked:
              true as const,

            tenantIsolationRequired:
              true as const,

            ownerControlRequired:
              true as const,

            rollbackAwarenessRequired:
              true as const,

            auditEvidenceRequired:
              true as const,
          },

          authorityBoundary: {
            ownerReviewDecisionBound:
              true as const,

            ownerReviewDecisionIntegrityVerified:
              true as const,

            ownerPilotPreparationApprovalBound:
              true as const,

            controlledShadowExecutionBound:
              true as const,

            candidateIdentityBound:
              true as const,

            runtimeIdentityBound:
              true as const,

            tenantIdentityBound:
              true as const,

            ownerIdentityBound:
              true as const,

            approvalBypassAllowed:
              false as const,

            limitedInternalPilotPreparationAuthorized:
              true as const,

            limitedInternalPilotExecutionAuthorized:
              false as const,

            syntheticPilotTaskExecutionAuthorized:
              false as const,

            pilotTaskExecuted:
              false as const,

            pilotDraftCreated:
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

            productionDeploymentAuthorized:
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

            ownerReviewAfterEveryPilotTask:
              true as const,

            emergencyPauseAvailable:
              true as const,
          },
        };

        return deepFreeze({
          ...entryCore,

          candidatePreparationDigest:
            sha256(entryCore),
        });
      },
    );

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "ENGINEERING_LIMITED_INTERNAL_PILOTS_PREPARED" as const,

    tenantId:
      decision.tenantId,

    ownerId:
      decision.ownerId,

    sourceReviewDecisionId:
      decision.decisionId,

    sourceReviewDecisionDigest:
      decision.decisionDigest,

    sourceControlledShadowExecutionId:
      execution.executionId,

    sourceControlledShadowExecutionDigest:
      execution.executionDigest,

    candidatePreparationCount:
      8 as const,

    candidatePreparations,

    aggregateSummary: {
      reviewedCandidateCount:
        8 as const,

      approvedCandidateCount:
        8 as const,

      preparedPilotCount:
        8 as const,

      pilotExecutionEligibleCount:
        0 as const,

      pilotExecutionAuthorizedCount:
        0 as const,

      pilotTaskExecutedCount:
        0 as const,

      pilotDraftCreatedCount:
        0 as const,

      maximumTaskCountPerCandidate:
        3 as const,

      maximumAggregateTaskCount:
        24 as const,

      aggregateConcurrentTaskLimit:
        8 as const,

      failureThresholdPerCandidate:
        1 as const,

      ownerReviewAfterEveryTaskCount:
        8 as const,

      monitoringRequiredCount:
        8 as const,

      uniqueScenarioCount:
        24 as const,

      uniqueCandidatePreparationDigests:
        8 as const,
    },

    authorityBoundary: {
      canonicalOwnerReviewDecisionBound:
        true as const,

      canonicalControlledShadowExecutionBound:
        true as const,

      exactEightCandidatesRequired:
        true as const,

      allEightOwnerApprovalsVerified:
        true as const,

      controlledInternalSyntheticPilotOnly:
        true as const,

      syntheticSanitizedDataOnly:
        true as const,

      readOnlyEvidenceToolsOnly:
        true as const,

      draftOnlyToolsOnly:
        true as const,

      approvalBypassAllowed:
        false as const,

      limitedInternalPilotPreparationAuthorized:
        true as const,

      limitedInternalPilotPreparationAuthorizedCount:
        8 as const,

      limitedInternalPilotExecutionAuthorized:
        false as const,

      limitedInternalPilotExecutionAuthorizedCount:
        0 as const,

      pilotTaskExecutedCount:
        0 as const,

      pilotDraftCreatedCount:
        0 as const,

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

      productionDeploymentAuthorized:
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

      ownerReviewAfterEveryPilotTask:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_ENGINEERING_LIMITED_INTERNAL_PILOT_EXECUTION_DECISIONS" as const,

    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    }) as EngineeringAIWorkforceLimitedInternalPilotPreparation;

  validateEngineeringAIWorkforceLimitedInternalPilotPreparation(
    preparation,
  );

  return preparation;
}

export const ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION =
  createEngineeringAIWorkforceLimitedInternalPilotPreparation({
    preparationId:
      "engineering-ai-workforce-limited-internal-pilot-preparation-001",

    ownerControlledShadowOperationReviewDecision:
      ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,

    preparedAt:
      "2026-07-23T13:36:34.385Z",
  });
