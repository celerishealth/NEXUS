import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION,
  type EngineeringAIWorkforcePostLevelTwoScopeDefinition,
  validateEngineeringAIWorkforcePostLevelTwoScopeDefinition,
} from "./engineeringAIWorkforcePostLevelTwoScopeDefinition";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-scope-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DECISIONS =
  [
    "APPROVE_ENGINEERING_POST_LEVEL_TWO_SCOPE_PREPARATION_ONLY",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_SCOPE_REVIEW",
  ] as const;

export type EngineeringAIWorkforcePostLevelTwoScopeDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoScopeDecisionInput {
  readonly decisionId: string;
  readonly sourceScope:
    EngineeringAIWorkforcePostLevelTwoScopeDefinition;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforcePostLevelTwoScopeDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforcePostLevelTwoScopeDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION_RECORDED";
  readonly sourceScopeId: string;
  readonly sourceScopeDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforcePostLevelTwoScopeDecisionType;
  readonly scopeApproved: boolean;
  readonly boundedPreparationAuthorized:
    boolean;
  readonly consequentialAuthorityGranted:
    false;
  readonly reviewedScope: Readonly<{
    scopeDefinitionOnly: true;
    workstreamCount: 4;
    workstreamIds: readonly string[];
    sourceLevelTwoEvidenceAccepted: true;
    sourceAdditionalAuthorityGranted:
      false;
    sourceNextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION";
  }>;
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourceScopeIntegrityVerified: true;
    scopeDefinitionReviewed: true;
    boundedPreparationAuthorized:
      boolean;
    consequentialAuthorityGranted:
      false;
    levelThreeAuthorityGranted: false;
    secondTaskExecutionAuthorized:
      false;
    thirdTaskExecutionAuthorized:
      false;
    concurrentExecutionAuthorized:
      false;
    repositoryReadAuthorized: false;
    repositoryWriteAuthorized: false;
    branchCreationAuthorized: false;
    pullRequestPreparationAuthorized:
      false;
    mergeAuthorized: false;
    secretsAccessAuthorized: false;
    realCustomerDataAccessAuthorized:
      false;
    realCustomerContactAuthorized:
      false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized:
      false;
    productionDatabaseAuthorized:
      false;
    productionMutationAuthorized:
      false;
    productionDeploymentAuthorized:
      false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized:
      false;
    legalCommitmentAuthorized: false;
    autonomousDecisionAuthorized:
      false;
    productionReadinessAuthorized:
      false;
    publicLaunchAuthorized: false;
    founderLiberationAchieved: false;
    founderReleasedFromRoutineExecution:
      false;
    monitoringRequired: true;
    emergencyPauseRequired: true;
    rollbackEvidenceRequired: true;
    ownerFinalAuthorityPreserved: true;
  }>;
  readonly reason: string;
  readonly nextStep:
    | "AWAIT_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION"
    | "RETAIN_ENGINEERING_POST_LEVEL_TWO_SCOPE_REVIEW";
  readonly decidedAt: string;
  readonly decisionDigest: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

const SENSITIVE_REASON_PATTERN =
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password|secret|credential|bearer|private[_ -]?key)\b/i;

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

function requireReason(
  value: string,
): void {
  const normalized =
    value.trim();

  if (
    normalized.length < 40 ||
    normalized.length > 1200
  ) {
    throw new Error(
      "Engineering post-Level-2 scope-decision reason is invalid.",
    );
  }

  if (
    SENSITIVE_REASON_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Engineering post-Level-2 scope-decision reason must not contain sensitive material.",
    );
  }
}

const canonicalSource =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;

function validateCanonicalSource(): void {
  validateEngineeringAIWorkforcePostLevelTwoScopeDefinition(
    canonicalSource,
  );

  if (
    canonicalSource.scopeDefinitionOnly !==
      true ||
    canonicalSource.ownerScopeDecisionRequired !==
      true ||
    canonicalSource.ownerScopeDecisionRecorded !==
      false ||
    canonicalSource.authorityBoundary
      .levelThreeAuthorityGranted !==
      false ||
    canonicalSource.authorityBoundary
      .secondTaskExecutionAuthorized !==
      false ||
    canonicalSource.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    canonicalSource.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    canonicalSource.authorityBoundary
      .productionDeploymentAuthorized !==
      false ||
    canonicalSource.authorityBoundary
      .paymentExecutionAuthorized !==
      false ||
    canonicalSource.authorityBoundary
      .publicLaunchAuthorized !==
      false ||
    canonicalSource.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    canonicalSource.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION"
  ) {
    throw new Error(
      "Engineering post-Level-2 scope is not eligible for owner review.",
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoScopeDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoScopeDecision,
): void {
  validateCanonicalSource();

  requireIdentifier(
    "Engineering post-Level-2 scope decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering post-Level-2 scope decision owner ID",
    record.ownerId,
  );

  requireTimestamp(
    "Engineering post-Level-2 scope decision time",
    record.decidedAt,
  );

  requireReason(
    record.reason,
  );

  if (
    !SHA256_PATTERN.test(
      record.decisionDigest,
    )
  ) {
    throw new Error(
      "Engineering post-Level-2 scope decision digest is invalid.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Engineering post-Level-2 scope decision integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_SCOPE_PREPARATION_ONLY";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION_RECORDED" ||
    record.sourceScopeId !==
      canonicalSource.scopeId ||
    record.sourceScopeDigest !==
      canonicalSource.scopeDigest ||
    record.tenantId !==
      canonicalSource.tenantId ||
    record.ownerId !==
      canonicalSource.ownerId ||
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DECISIONS.includes(
      record.decision,
    ) ||
    record.scopeApproved !==
      approved ||
    record.boundedPreparationAuthorized !==
      approved ||
    record.consequentialAuthorityGranted !==
      false ||
    Date.parse(record.decidedAt) <
      Date.parse(
        canonicalSource.preparedAt,
      )
  ) {
    throw new Error(
      "Engineering post-Level-2 scope decision identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedScope;

  if (
    reviewed.scopeDefinitionOnly !==
      true ||
    reviewed.workstreamCount !==
      4 ||
    JSON.stringify(
      reviewed.workstreamIds,
    ) !==
      JSON.stringify(
        canonicalSource.workstreams.map(
          (workstream) =>
            workstream.workstreamId,
        ),
      ) ||
    reviewed.sourceLevelTwoEvidenceAccepted !==
      true ||
    reviewed.sourceAdditionalAuthorityGranted !==
      false ||
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION"
  ) {
    throw new Error(
      "Engineering post-Level-2 reviewed scope is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.sourceScopeIntegrityVerified !==
      true ||
    boundary.scopeDefinitionReviewed !==
      true ||
    boundary.boundedPreparationAuthorized !==
      approved ||
    boundary.consequentialAuthorityGranted !==
      false ||
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
    boundary.founderLiberationAchieved !==
      false ||
    boundary.founderReleasedFromRoutineExecution !==
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseRequired !==
      true ||
    boundary.rollbackEvidenceRequired !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true
  ) {
    throw new Error(
      "Engineering post-Level-2 scope decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_SCOPE_REVIEW";

  if (
    record.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Engineering post-Level-2 scope decision next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoScopeDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoScopeDecisionInput,
): EngineeringAIWorkforcePostLevelTwoScopeDecision {
  validateCanonicalSource();

  if (
    input.sourceScope !==
      canonicalSource
  ) {
    validateEngineeringAIWorkforcePostLevelTwoScopeDefinition(
      input.sourceScope,
    );
  }

  if (
    input.sourceScope.scopeId !==
      canonicalSource.scopeId ||
    input.sourceScope.scopeDigest !==
      canonicalSource.scopeDigest
  ) {
    throw new Error(
      "Engineering post-Level-2 owner decision requires the canonical scope.",
    );
  }

  requireIdentifier(
    "Engineering post-Level-2 scope decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Engineering post-Level-2 scope decision owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Engineering post-Level-2 scope decision time",
    input.decidedAt,
  );

  requireReason(
    input.reason,
  );

  if (
    input.ownerId !==
      canonicalSource.ownerId
  ) {
    throw new Error(
      "Only the canonical NEXUS owner can issue the Engineering post-Level-2 scope decision.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Engineering post-Level-2 scope decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(
        canonicalSource.preparedAt,
      )
  ) {
    throw new Error(
      "Engineering post-Level-2 scope decision cannot precede scope preparation.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_SCOPE_PREPARATION_ONLY";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION_RECORDED" as const,
    sourceScopeId:
      canonicalSource.scopeId,
    sourceScopeDigest:
      canonicalSource.scopeDigest,
    tenantId:
      canonicalSource.tenantId,
    ownerId:
      input.ownerId,
    decision:
      input.decision,
    scopeApproved:
      approved,
    boundedPreparationAuthorized:
      approved,
    consequentialAuthorityGranted:
      false as const,
    reviewedScope: {
      scopeDefinitionOnly:
        true as const,
      workstreamCount:
        4 as const,
      workstreamIds:
        canonicalSource.workstreams.map(
          (workstream) =>
            workstream.workstreamId,
        ),
      sourceLevelTwoEvidenceAccepted:
        true as const,
      sourceAdditionalAuthorityGranted:
        false as const,
      sourceNextStep:
        canonicalSource.nextStep,
    },
    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourceScopeIntegrityVerified:
        true as const,
      scopeDefinitionReviewed:
        true as const,
      boundedPreparationAuthorized:
        approved,
      consequentialAuthorityGranted:
        false as const,
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
    reason:
      input.reason.trim(),
    nextStep:
      approved
        ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_SCOPE_REVIEW" as const,
    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforcePostLevelTwoScopeDecision;

  validateEngineeringAIWorkforcePostLevelTwoScopeDecision(
    record,
  );

  return record;
}