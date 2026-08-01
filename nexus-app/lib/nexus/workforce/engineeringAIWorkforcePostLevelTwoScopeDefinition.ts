import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision,
} from "./engineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-scope-definition-v1" as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAMS =
  [
    {
      sequence: 1,
      workstreamId:
        "routine-engineering-second-task-evidence",
      objective:
        "Define a bounded second synthetic engineering-task evidence sequence without authorizing execution.",
      completionEvidenceRequired:
        "Owner-reviewed deterministic evidence for every Engineering AI employee.",
    },
    {
      sequence: 2,
      workstreamId:
        "controlled-concurrent-coordination-evidence",
      objective:
        "Define safe coordination and conflict-control evidence before any concurrent Engineering work can be considered.",
      completionEvidenceRequired:
        "Fail-closed coordination, isolation, pause, rollback, and owner-review evidence.",
    },
    {
      sequence: 3,
      workstreamId:
        "repository-read-only-sandbox-evaluation",
      objective:
        "Define qualification evidence required before any repository read-only sandbox authority can be considered.",
      completionEvidenceRequired:
        "Tenant-bound, audited, secret-free, read-only sandbox evaluation evidence.",
    },
    {
      sequence: 4,
      workstreamId:
        "founder-routine-execution-reduction-evidence",
      objective:
        "Define measurable evidence for reducing founder routine engineering execution while preserving final owner authority.",
      completionEvidenceRequired:
        "Verified routine-work coverage, quality, recovery, escalation, and owner-acceptance evidence.",
    },
  ] as const;

export type EngineeringAIWorkforcePostLevelTwoWorkstream =
  (
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAMS
  )[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoScopeDefinitionInput {
  readonly scopeId: string;
  readonly preparedAt: string;
}

export interface EngineeringAIWorkforcePostLevelTwoScopeDefinition {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION_VERSION;
  readonly scopeId: string;
  readonly scopeState:
    "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SCOPE_DEFINED";
  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly sourceLevelTwoEvidenceAccepted: true;
  readonly sourceAdditionalAuthorityGranted: false;
  readonly scopeDefinitionOnly: true;
  readonly workstreamCount: 4;
  readonly workstreams:
    readonly EngineeringAIWorkforcePostLevelTwoWorkstream[];
  readonly entryCriteria: Readonly<{
    canonicalLevelTwoOwnerReviewAccepted:
      true;
    ownerFinalAuthorityPreserved: true;
    levelThreeAuthorityAlreadyGranted:
      false;
    pilotAlreadyCompleted: false;
    founderLiberationAlreadyAchieved:
      false;
  }>;
  readonly proposedExitCriteria: Readonly<{
    secondSyntheticTaskEvidenceReviewed:
      true;
    coordinationSafetyEvidenceReviewed:
      true;
    repositoryReadOnlySandboxQualificationReviewed:
      true;
    routineEngineeringCoverageMeasured:
      true;
    recoveryAndEscalationEvidenceReviewed:
      true;
    explicitOwnerScopeCompletionReviewRequired:
      true;
  }>;
  readonly ownerScopeDecisionRequired: true;
  readonly ownerScopeDecisionRecorded: false;
  readonly authorityBoundary: Readonly<{
    definitionOnly: true;
    levelThreeAuthorityGranted: false;
    secondTaskExecutionAuthorized: false;
    thirdTaskExecutionAuthorized: false;
    concurrentExecutionAuthorized: false;
    repositoryReadAuthorized: false;
    repositoryWriteAuthorized: false;
    branchCreationAuthorized: false;
    pullRequestPreparationAuthorized:
      false;
    mergeAuthorized: false;
    secretsAccessAuthorized: false;
    realCustomerDataAccessAuthorized:
      false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized:
      false;
    productionDatabaseAuthorized: false;
    productionMutationAuthorized: false;
    productionDeploymentAuthorized:
      false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized: false;
    legalCommitmentAuthorized: false;
    autonomousDecisionAuthorized: false;
    productionReadinessAuthorized: false;
    publicLaunchAuthorized: false;
    founderLiberationAchieved: false;
    founderReleasedFromRoutineExecution:
      false;
    monitoringRequired: true;
    emergencyPauseRequired: true;
    rollbackEvidenceRequired: true;
    ownerFinalAuthorityPreserved: true;
  }>;
  readonly nextStep:
    "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION";
  readonly preparedAt: string;
  readonly scopeDigest: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableNormalize(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(stableNormalize);
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    return Object.fromEntries(
      Object.entries(
        value as Record<string, unknown>,
      )
        .sort(
          ([left], [right]) =>
            left.localeCompare(right),
        )
        .map(
          ([key, nestedValue]) => [
            key,
            stableNormalize(nestedValue),
          ],
        ),
    );
  }

  return value;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify(
        stableNormalize(value),
      ),
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.freeze(value);

  for (
    const nestedValue of
    Object.values(
      value as Record<string, unknown>,
    )
  ) {
    deepFreeze(nestedValue);
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
    value.trim() !== value ||
    !value.endsWith("Z") ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

const sourceDecision =
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION;

function validateCanonicalSource(): void {
  validateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision(
    sourceDecision,
  );

  if (
    sourceDecision.decision !==
      "APPROVE_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_ONLY" ||
    sourceDecision.levelTwoEvidenceAccepted !==
      true ||
    sourceDecision.additionalAuthorityGranted !==
      false ||
    sourceDecision.authorityBoundary
      .ownerCompletionReviewAccepted !==
      true ||
    sourceDecision.authorityBoundary
      .levelThreeAuthorityGranted !==
      false ||
    sourceDecision.authorityBoundary
      .pilotCompleted !==
      false ||
    sourceDecision.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    sourceDecision.authorityBoundary
      .founderReleasedFromRoutineExecution !==
      false ||
    sourceDecision.nextStep !==
      "AWAIT_ENGINEERING_POST_LEVEL_TWO_SCOPE_DEFINITION"
  ) {
    throw new Error(
      "Engineering post-Level-2 scope source is not eligible.",
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoScopeDefinition(
  record:
    EngineeringAIWorkforcePostLevelTwoScopeDefinition,
): void {
  validateCanonicalSource();

  requireIdentifier(
    "Engineering post-Level-2 scope ID",
    record.scopeId,
  );

  requireTimestamp(
    "Engineering post-Level-2 scope preparation time",
    record.preparedAt,
  );

  if (
    !SHA256_PATTERN.test(
      record.scopeDigest,
    )
  ) {
    throw new Error(
      "Engineering post-Level-2 scope digest is invalid.",
    );
  }

  const {
    scopeDigest,
    ...scopeCore
  } = record;

  if (
    sha256(scopeCore) !==
      scopeDigest
  ) {
    throw new Error(
      "Engineering post-Level-2 scope integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION_VERSION ||
    record.scopeState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SCOPE_DEFINED" ||
    record.sourceDecisionId !==
      sourceDecision.decisionId ||
    record.sourceDecisionDigest !==
      sourceDecision.decisionDigest ||
    record.tenantId !==
      sourceDecision.tenantId ||
    record.ownerId !==
      sourceDecision.ownerId ||
    record.sourceLevelTwoEvidenceAccepted !==
      true ||
    record.sourceAdditionalAuthorityGranted !==
      false ||
    record.scopeDefinitionOnly !==
      true ||
    record.workstreamCount !==
      4 ||
    record.workstreams.length !==
      4 ||
    JSON.stringify(record.workstreams) !==
      JSON.stringify(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAMS,
      ) ||
    record.ownerScopeDecisionRequired !==
      true ||
    record.ownerScopeDecisionRecorded !==
      false ||
    Date.parse(record.preparedAt) <
      Date.parse(sourceDecision.decidedAt) ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION"
  ) {
    throw new Error(
      "Engineering post-Level-2 scope identity is invalid.",
    );
  }

  const entry =
    record.entryCriteria;

  if (
    entry.canonicalLevelTwoOwnerReviewAccepted !==
      true ||
    entry.ownerFinalAuthorityPreserved !==
      true ||
    entry.levelThreeAuthorityAlreadyGranted !==
      false ||
    entry.pilotAlreadyCompleted !==
      false ||
    entry.founderLiberationAlreadyAchieved !==
      false
  ) {
    throw new Error(
      "Engineering post-Level-2 entry criteria are invalid.",
    );
  }

  const exit =
    record.proposedExitCriteria;

  if (
    exit.secondSyntheticTaskEvidenceReviewed !==
      true ||
    exit.coordinationSafetyEvidenceReviewed !==
      true ||
    exit.repositoryReadOnlySandboxQualificationReviewed !==
      true ||
    exit.routineEngineeringCoverageMeasured !==
      true ||
    exit.recoveryAndEscalationEvidenceReviewed !==
      true ||
    exit.explicitOwnerScopeCompletionReviewRequired !==
      true
  ) {
    throw new Error(
      "Engineering post-Level-2 proposed exit criteria are invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.definitionOnly !== true ||
    boundary.levelThreeAuthorityGranted !==
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
    boundary.mergeAuthorized !== false ||
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
    boundary.founderLiberationAchieved !==
      false ||
    boundary.founderReleasedFromRoutineExecution !==
      false ||
    boundary.monitoringRequired !== true ||
    boundary.emergencyPauseRequired !==
      true ||
    boundary.rollbackEvidenceRequired !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true
  ) {
    throw new Error(
      "Engineering post-Level-2 authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoScopeDefinition(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoScopeDefinitionInput,
): EngineeringAIWorkforcePostLevelTwoScopeDefinition {
  validateCanonicalSource();

  requireIdentifier(
    "Engineering post-Level-2 scope ID",
    input.scopeId,
  );

  requireTimestamp(
    "Engineering post-Level-2 scope preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
      Date.parse(sourceDecision.decidedAt)
  ) {
    throw new Error(
      "Engineering post-Level-2 scope cannot precede its owner-reviewed source.",
    );
  }

  const scopeCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION_VERSION,
    scopeId:
      input.scopeId,
    scopeState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SCOPE_DEFINED" as const,
    sourceDecisionId:
      sourceDecision.decisionId,
    sourceDecisionDigest:
      sourceDecision.decisionDigest,
    tenantId:
      sourceDecision.tenantId,
    ownerId:
      sourceDecision.ownerId,
    sourceLevelTwoEvidenceAccepted:
      true as const,
    sourceAdditionalAuthorityGranted:
      false as const,
    scopeDefinitionOnly:
      true as const,
    workstreamCount:
      4 as const,
    workstreams:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAMS,
    entryCriteria: {
      canonicalLevelTwoOwnerReviewAccepted:
        true as const,
      ownerFinalAuthorityPreserved:
        true as const,
      levelThreeAuthorityAlreadyGranted:
        false as const,
      pilotAlreadyCompleted:
        false as const,
      founderLiberationAlreadyAchieved:
        false as const,
    },
    proposedExitCriteria: {
      secondSyntheticTaskEvidenceReviewed:
        true as const,
      coordinationSafetyEvidenceReviewed:
        true as const,
      repositoryReadOnlySandboxQualificationReviewed:
        true as const,
      routineEngineeringCoverageMeasured:
        true as const,
      recoveryAndEscalationEvidenceReviewed:
        true as const,
      explicitOwnerScopeCompletionReviewRequired:
        true as const,
    },
    ownerScopeDecisionRequired:
      true as const,
    ownerScopeDecisionRecorded:
      false as const,
    authorityBoundary: {
      definitionOnly:
        true as const,
      levelThreeAuthorityGranted:
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
      founderLiberationAchieved:
        false as const,
      founderReleasedFromRoutineExecution:
        false as const,
      monitoringRequired:
        true as const,
      emergencyPauseRequired:
        true as const,
      rollbackEvidenceRequired:
        true as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION" as const,
    preparedAt:
      input.preparedAt,
  };

  const record =
    deepFreeze({
      ...scopeCore,
      scopeDigest:
        sha256(scopeCore),
    }) as EngineeringAIWorkforcePostLevelTwoScopeDefinition;

  validateEngineeringAIWorkforcePostLevelTwoScopeDefinition(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION =
  createEngineeringAIWorkforcePostLevelTwoScopeDefinition({
    scopeId:
      "engineering-ai-workforce-post-level-two-scope-definition-001",
    preparedAt:
      "2026-08-01T16:10:00.000Z",
  });