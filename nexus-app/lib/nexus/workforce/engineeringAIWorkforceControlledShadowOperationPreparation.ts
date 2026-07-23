import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "./engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
  validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance,
} from "./engineeringAIWorkforceOwnerActivatedRuntimeIssuance";

export const ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-controlled-shadow-operation-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_SCENARIOS = [
  {
    publicName:
      "Ishaan",
    scenarioId:
      "scenario-ishaan-synthetic-architecture-tradeoff-001",
    taskClass:
      "SYNTHETIC_ARCHITECTURE_TRADEOFF_BRIEF",
    expectedDraft:
      "ARCHITECTURE_TRADEOFF_RECOMMENDATION_DRAFT",
  },
  {
    publicName:
      "Leela",
    scenarioId:
      "scenario-leela-synthetic-engineering-delivery-plan-001",
    taskClass:
      "SYNTHETIC_ENGINEERING_DELIVERY_PLAN",
    expectedDraft:
      "ENGINEERING_DELIVERY_PLAN_DRAFT",
  },
  {
    publicName:
      "Vivaan",
    scenarioId:
      "scenario-vivaan-synthetic-quality-gap-analysis-001",
    taskClass:
      "SYNTHETIC_QUALITY_GAP_ANALYSIS",
    expectedDraft:
      "QUALITY_GAP_ANALYSIS_DRAFT",
  },
  {
    publicName:
      "Anaya",
    scenarioId:
      "scenario-anaya-synthetic-threat-model-review-001",
    taskClass:
      "SYNTHETIC_THREAT_MODEL_REVIEW",
    expectedDraft:
      "THREAT_MODEL_REVIEW_DRAFT",
  },
  {
    publicName:
      "Atharv",
    scenarioId:
      "scenario-atharv-synthetic-reliability-risk-review-001",
    taskClass:
      "SYNTHETIC_RELIABILITY_RISK_REVIEW",
    expectedDraft:
      "RELIABILITY_RISK_REVIEW_DRAFT",
  },
  {
    publicName:
      "Mahir",
    scenarioId:
      "scenario-mahir-synthetic-chaos-experiment-design-001",
    taskClass:
      "SYNTHETIC_CHAOS_EXPERIMENT_DESIGN",
    expectedDraft:
      "CHAOS_EXPERIMENT_DESIGN_DRAFT",
  },
  {
    publicName:
      "Zara",
    scenarioId:
      "scenario-zara-synthetic-data-pipeline-quality-review-001",
    taskClass:
      "SYNTHETIC_DATA_PIPELINE_QUALITY_REVIEW",
    expectedDraft:
      "DATA_PIPELINE_QUALITY_REVIEW_DRAFT",
  },
  {
    publicName:
      "Advik",
    scenarioId:
      "scenario-advik-synthetic-red-team-evaluation-plan-001",
    taskClass:
      "SYNTHETIC_RED_TEAM_EVALUATION_PLAN",
    expectedDraft:
      "RED_TEAM_EVALUATION_PLAN_DRAFT",
  },
] as const;

export interface CreateEngineeringAIWorkforceControlledShadowOperationPreparationInput {
  readonly preparationId:
    string;

  readonly ownerActivatedRuntimeIssuance:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE;

  readonly preparedAt:
    string;
}

export interface EngineeringAIWorkforceCandidateControlledShadowOperationPreparation {
  readonly developmentSequence:
    number;

  readonly preparationState:
    "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_PREPARED";

  readonly employeeId:
    string;

  readonly employeeCode:
    string;

  readonly publicName:
    string;

  readonly officialRole:
    string;

  readonly templateId:
    string;

  readonly runtimeId:
    string;

  readonly runtimeDigest:
    string;

  readonly runtimeIssuanceDigest:
    string;

  readonly qualifiedManifestDigest:
    string;

  readonly shadowFixture: Readonly<{
    fixtureId:
      string;

    scenarioId:
      string;

    taskClass:
      string;

    expectedDraft:
      string;

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    evidenceToolId:
      "tool-engineering-shadow-evidence-read";

    evidenceToolMode:
      "READ_ONLY";

    draftToolId:
      "tool-engineering-shadow-draft";

    draftToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    maximumTaskCount:
      1;

    ownerReviewRequired:
      true;
  }>;

  readonly authorityBoundary: Readonly<{
    ownerActivatedRuntimeIssuanceBound:
      true;

    ownerActivationBound:
      true;

    qualifiedManifestBound:
      true;

    runtimeIdentityBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    approvalBypassAllowed:
      false;

    runtimeReadyForControlledWork:
      true;

    controlledInternalWorkOnly:
      true;

    shadowExecutionEligible:
      true;

    shadowExecutionExecuted:
      false;

    syntheticSanitizedEvidencePrepared:
      true;

    draftCreated:
      false;

    ownerReviewRequired:
      true;

    emergencyPauseAvailable:
      true;

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
  }>;

  readonly candidatePreparationDigest:
    string;
}

export interface EngineeringAIWorkforceControlledShadowOperationPreparation {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION;

  readonly preparationId:
    string;

  readonly preparationState:
    "ENGINEERING_CONTROLLED_SHADOW_OPERATIONS_PREPARED";

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly sourceRuntimeIssuanceId:
    string;

  readonly sourceRuntimeIssuanceDigest:
    string;

  readonly candidatePreparationCount:
    8;

  readonly candidatePreparations:
    readonly EngineeringAIWorkforceCandidateControlledShadowOperationPreparation[];

  readonly aggregateSummary: Readonly<{
    ownerActivatedRuntimeCount:
      8;

    controlledShadowPreparationCount:
      8;

    shadowExecutionEligibleCount:
      8;

    shadowExecutionExecutedCount:
      0;

    syntheticSanitizedFixtureCount:
      8;

    readOnlyEvidenceToolCount:
      8;

    draftOnlyToolCount:
      8;

    ownerReviewRequiredCount:
      8;

    maximumAggregateTaskCount:
      8;

    draftCreatedCount:
      0;

    exactCandidateSequencePreserved:
      true;

    exactCandidateIdentityPreserved:
      true;

    exactRuntimeBindingsPreserved:
      true;

    uniqueScenarioCount:
      8;

    uniqueCandidatePreparationDigests:
      8;
  }>;

  readonly authorityBoundary: Readonly<{
    canonicalOwnerActivatedRuntimeIssuanceBound:
      true;

    exactEightCandidatesRequired:
      true;

    controlledInternalWorkOnly:
      true;

    controlledShadowOperationPrepared:
      true;

    controlledShadowOperationExecuted:
      false;

    shadowExecutionEligible:
      true;

    ownerReviewRequiredAfterExecution:
      true;

    emergencyPauseAvailable:
      true;

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
  }>;

  readonly nextStep:
    "EXECUTE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS";

  readonly preparedAt:
    string;

  readonly preparationDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

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
      "Unsupported deterministic Engineering controlled-shadow preparation value.",
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
  if (!SAFE_IDENTIFIER_PATTERN.test(value)) {
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
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
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

export function validateEngineeringAIWorkforceControlledShadowOperationPreparation(
  preparation:
    EngineeringAIWorkforceControlledShadowOperationPreparation,
): void {
  validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
    ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
  );

  requireIdentifier(
    "Engineering controlled-shadow preparation ID",
    preparation.preparationId,
  );

  requireTimestamp(
    "Engineering controlled-shadow preparation time",
    preparation.preparedAt,
  );

  requireDigest(
    "Engineering controlled-shadow preparation digest",
    preparation.preparationDigest,
  );

  if (
    preparation.version !==
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION ||
    preparation.preparationState !==
      "ENGINEERING_CONTROLLED_SHADOW_OPERATIONS_PREPARED" ||
    preparation.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    preparation.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    preparation.sourceRuntimeIssuanceId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
        .runtimeIssuanceId ||
    preparation.sourceRuntimeIssuanceDigest !==
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
        .runtimeIssuanceDigest ||
    preparation.candidatePreparationCount !==
      8 ||
    preparation.candidatePreparations.length !==
      8
  ) {
    throw new Error(
      "Engineering controlled-shadow preparation identity is invalid.",
    );
  }

  requireUnique(
    "Engineering controlled-shadow employee IDs",
    preparation.candidatePreparations.map(
      (entry) =>
        entry.employeeId,
    ),
  );

  requireUnique(
    "Engineering controlled-shadow runtime IDs",
    preparation.candidatePreparations.map(
      (entry) =>
        entry.runtimeId,
    ),
  );

  requireUnique(
    "Engineering controlled-shadow scenario IDs",
    preparation.candidatePreparations.map(
      (entry) =>
        entry.shadowFixture.scenarioId,
    ),
  );

  requireUnique(
    "Engineering controlled-shadow candidate preparation digests",
    preparation.candidatePreparations.map(
      (entry) =>
        entry.candidatePreparationDigest,
    ),
  );

  preparation.candidatePreparations.forEach(
    (
      entry,
      index,
    ) => {
      const source =
        ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
          .candidateRuntimeIssuances[index];

      const scenario =
        ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_SCENARIOS[index];

      if (
        !source ||
        !scenario
      ) {
        throw new Error(
          "Engineering controlled-shadow source evidence is missing.",
        );
      }

      requireDigest(
        "Engineering candidate controlled-shadow preparation digest",
        entry.candidatePreparationDigest,
      );

      const {
        candidatePreparationDigest,
        ...entryCore
      } = entry;

      const fixture =
        entry.shadowFixture;

      const boundary =
        entry.authorityBoundary;

      if (
        sha256(entryCore) !==
          candidatePreparationDigest ||
        entry.developmentSequence !==
          index + 1 ||
        entry.preparationState !==
          "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_PREPARED" ||
        entry.employeeId !==
          source.employeeId ||
        entry.employeeCode !==
          source.employeeCode ||
        entry.publicName !==
          source.publicName ||
        entry.publicName !==
          scenario.publicName ||
        entry.officialRole !==
          source.officialRole ||
        entry.templateId !==
          source.templateId ||
        entry.runtimeId !==
          source.runtimeId ||
        entry.runtimeDigest !==
          source.ownerActivatedRuntimeDigest ||
        entry.runtimeIssuanceDigest !==
          source.candidateRuntimeIssuanceDigest ||
        entry.qualifiedManifestDigest !==
          source.qualifiedManifestDigest ||
        fixture.fixtureId !==
          `fixture-${source.employeeCode}-controlled-shadow-v1` ||
        fixture.scenarioId !==
          scenario.scenarioId ||
        fixture.taskClass !==
          scenario.taskClass ||
        fixture.expectedDraft !==
          scenario.expectedDraft ||
        fixture.dataClassification !==
          "SYNTHETIC_SANITIZED_ONLY" ||
        fixture.evidenceToolId !==
          "tool-engineering-shadow-evidence-read" ||
        fixture.evidenceToolMode !==
          "READ_ONLY" ||
        fixture.draftToolId !==
          "tool-engineering-shadow-draft" ||
        fixture.draftToolMode !==
          "DRAFT_ONLY" ||
        fixture.executionMode !==
          "SANDBOX_ONLY" ||
        fixture.maximumTaskCount !==
          1 ||
        fixture.ownerReviewRequired !==
          true
      ) {
        throw new Error(
          "Engineering candidate controlled-shadow fixture binding is invalid.",
        );
      }

      if (
        boundary.ownerActivatedRuntimeIssuanceBound !==
          true ||
        boundary.ownerActivationBound !==
          true ||
        boundary.qualifiedManifestBound !==
          true ||
        boundary.runtimeIdentityBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.approvalBypassAllowed !==
          false ||
        boundary.runtimeReadyForControlledWork !==
          true ||
        boundary.controlledInternalWorkOnly !==
          true ||
        boundary.shadowExecutionEligible !==
          true ||
        boundary.shadowExecutionExecuted !==
          false ||
        boundary.syntheticSanitizedEvidencePrepared !==
          true ||
        boundary.draftCreated !==
          false ||
        boundary.ownerReviewRequired !==
          true ||
        boundary.emergencyPauseAvailable !==
          true ||
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
          false
      ) {
        throw new Error(
          "Engineering candidate controlled-shadow authority boundary is invalid.",
        );
      }
    },
  );

  const summary =
    preparation.aggregateSummary;

  if (
    summary.ownerActivatedRuntimeCount !==
      8 ||
    summary.controlledShadowPreparationCount !==
      8 ||
    summary.shadowExecutionEligibleCount !==
      8 ||
    summary.shadowExecutionExecutedCount !==
      0 ||
    summary.syntheticSanitizedFixtureCount !==
      8 ||
    summary.readOnlyEvidenceToolCount !==
      8 ||
    summary.draftOnlyToolCount !==
      8 ||
    summary.ownerReviewRequiredCount !==
      8 ||
    summary.maximumAggregateTaskCount !==
      8 ||
    summary.draftCreatedCount !==
      0 ||
    summary.exactCandidateSequencePreserved !==
      true ||
    summary.exactCandidateIdentityPreserved !==
      true ||
    summary.exactRuntimeBindingsPreserved !==
      true ||
    summary.uniqueScenarioCount !==
      8 ||
    summary.uniqueCandidatePreparationDigests !==
      8
  ) {
    throw new Error(
      "Engineering controlled-shadow aggregate summary is invalid.",
    );
  }

  const authority =
    preparation.authorityBoundary;

  if (
    authority.canonicalOwnerActivatedRuntimeIssuanceBound !==
      true ||
    authority.exactEightCandidatesRequired !==
      true ||
    authority.controlledInternalWorkOnly !==
      true ||
    authority.controlledShadowOperationPrepared !==
      true ||
    authority.controlledShadowOperationExecuted !==
      false ||
    authority.shadowExecutionEligible !==
      true ||
    authority.ownerReviewRequiredAfterExecution !==
      true ||
    authority.emergencyPauseAvailable !==
      true ||
    authority.repositoryReadAuthorized !==
      false ||
    authority.repositoryWriteAuthorized !==
      false ||
    authority.branchCreationAuthorized !==
      false ||
    authority.pullRequestPreparationAuthorized !==
      false ||
    authority.mergeAuthorized !==
      false ||
    authority.productionDeploymentAuthorized !==
      false ||
    authority.secretsAccessAuthorized !==
      false ||
    authority.realCustomerDataAccessAuthorized !==
      false ||
    authority.realCustomerContactAuthorized !==
      false ||
    authority.externalDeliveryAuthorized !==
      false ||
    authority.liveProviderExecutionAuthorized !==
      false ||
    authority.productionDatabaseAuthorized !==
      false ||
    authority.productionMutationAuthorized !==
      false ||
    authority.paymentExecutionAuthorized !==
      false ||
    authority.financialCommitmentAuthorized !==
      false ||
    authority.legalCommitmentAuthorized !==
      false ||
    authority.autonomousDecisionAuthorized !==
      false ||
    authority.productionReadinessAuthorized !==
      false ||
    authority.publicLaunchAuthorized !==
      false ||
    preparation.nextStep !==
      "EXECUTE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS"
  ) {
    throw new Error(
      "Engineering controlled-shadow aggregate authority boundary is invalid.",
    );
  }

  if (
    Date.parse(preparation.preparedAt) <
    Date.parse(
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
        .activatedAt,
    )
  ) {
    throw new Error(
      "Engineering controlled-shadow preparation cannot precede runtime activation.",
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
      "Engineering controlled-shadow preparation integrity is invalid.",
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
          entry.shadowFixture,
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
      "Engineering controlled-shadow preparation must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceControlledShadowOperationPreparation(
  input:
    CreateEngineeringAIWorkforceControlledShadowOperationPreparationInput,
): EngineeringAIWorkforceControlledShadowOperationPreparation {
  if (
    input.ownerActivatedRuntimeIssuance !==
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
  ) {
    throw new Error(
      "Only the canonical Engineering owner-activated runtime issuance can prepare controlled shadow operations.",
    );
  }

  validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
    input.ownerActivatedRuntimeIssuance,
  );

  requireIdentifier(
    "Engineering controlled-shadow preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Engineering controlled-shadow preparation time",
    input.preparedAt,
  );

  const source =
    input.ownerActivatedRuntimeIssuance;

  if (
    source.issuanceState !==
      "ENGINEERING_OWNER_ACTIVATED_RUNTIMES_ISSUED" ||
    source.candidateRuntimeIssuances.length !==
      8 ||
    source.aggregateSummary
      .activatedRuntimeCount !==
        8 ||
    source.aggregateSummary
      .controlledWorkAuthorizationCount !==
        8 ||
    source.authorityBoundary
      .controlledInternalWorkOnly !==
        true ||
    source.authorityBoundary
      .controlledShadowOperationPrepared !==
        false ||
    source.authorityBoundary
      .controlledShadowOperationExecuted !==
        false ||
    source.nextStep !==
      "PREPARE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS"
  ) {
    throw new Error(
      "Engineering controlled-shadow preparation requires eight safely activated internal runtimes.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(source.activatedAt)
  ) {
    throw new Error(
      "Engineering controlled-shadow preparation cannot precede runtime activation.",
    );
  }

  const candidatePreparations =
    source.candidateRuntimeIssuances.map(
      (
        runtimeIssuance,
        index,
      ) => {
        const scenario =
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_SCENARIOS[index];

        if (
          !scenario ||
          scenario.publicName !==
            runtimeIssuance.publicName ||
          runtimeIssuance.ownerActivatedRuntime
            .runtimeState !==
              "READY_FOR_CONTROLLED_WORK" ||
          runtimeIssuance.ownerActivatedRuntime
            .controlledWorkAuthorized !==
              true ||
          runtimeIssuance.authorityBoundary
            .emergencyPauseAvailable !==
              true ||
          runtimeIssuance.authorityBoundary
            .repositoryReadAuthorized !==
              false ||
          runtimeIssuance.authorityBoundary
            .repositoryWriteAuthorized !==
              false ||
          runtimeIssuance.authorityBoundary
            .realCustomerContactAuthorized !==
              false ||
          runtimeIssuance.authorityBoundary
            .productionDatabaseAuthorized !==
              false ||
          runtimeIssuance.authorityBoundary
            .paymentExecutionAuthorized !==
              false ||
          runtimeIssuance.authorityBoundary
            .publicLaunchAuthorized !==
              false
        ) {
          throw new Error(
            "Engineering runtime is not eligible for bounded controlled-shadow preparation.",
          );
        }

        const entryCore = {
          developmentSequence:
            index + 1,

          preparationState:
            "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_PREPARED" as const,

          employeeId:
            runtimeIssuance.employeeId,

          employeeCode:
            runtimeIssuance.employeeCode,

          publicName:
            runtimeIssuance.publicName,

          officialRole:
            runtimeIssuance.officialRole,

          templateId:
            runtimeIssuance.templateId,

          runtimeId:
            runtimeIssuance.runtimeId,

          runtimeDigest:
            runtimeIssuance.ownerActivatedRuntimeDigest,

          runtimeIssuanceDigest:
            runtimeIssuance.candidateRuntimeIssuanceDigest,

          qualifiedManifestDigest:
            runtimeIssuance.qualifiedManifestDigest,

          shadowFixture: {
            fixtureId:
              `fixture-${runtimeIssuance.employeeCode}-controlled-shadow-v1`,

            scenarioId:
              scenario.scenarioId,

            taskClass:
              scenario.taskClass,

            expectedDraft:
              scenario.expectedDraft,

            dataClassification:
              "SYNTHETIC_SANITIZED_ONLY" as const,

            evidenceToolId:
              "tool-engineering-shadow-evidence-read" as const,

            evidenceToolMode:
              "READ_ONLY" as const,

            draftToolId:
              "tool-engineering-shadow-draft" as const,

            draftToolMode:
              "DRAFT_ONLY" as const,

            executionMode:
              "SANDBOX_ONLY" as const,

            maximumTaskCount:
              1 as const,

            ownerReviewRequired:
              true as const,
          },

          authorityBoundary: {
            ownerActivatedRuntimeIssuanceBound:
              true as const,

            ownerActivationBound:
              true as const,

            qualifiedManifestBound:
              true as const,

            runtimeIdentityBound:
              true as const,

            tenantIdentityBound:
              true as const,

            ownerIdentityBound:
              true as const,

            approvalBypassAllowed:
              false as const,

            runtimeReadyForControlledWork:
              true as const,

            controlledInternalWorkOnly:
              true as const,

            shadowExecutionEligible:
              true as const,

            shadowExecutionExecuted:
              false as const,

            syntheticSanitizedEvidencePrepared:
              true as const,

            draftCreated:
              false as const,

            ownerReviewRequired:
              true as const,

            emergencyPauseAvailable:
              true as const,

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
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "ENGINEERING_CONTROLLED_SHADOW_OPERATIONS_PREPARED" as const,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    sourceRuntimeIssuanceId:
      source.runtimeIssuanceId,

    sourceRuntimeIssuanceDigest:
      source.runtimeIssuanceDigest,

    candidatePreparationCount:
      8 as const,

    candidatePreparations,

    aggregateSummary: {
      ownerActivatedRuntimeCount:
        8 as const,

      controlledShadowPreparationCount:
        8 as const,

      shadowExecutionEligibleCount:
        8 as const,

      shadowExecutionExecutedCount:
        0 as const,

      syntheticSanitizedFixtureCount:
        8 as const,

      readOnlyEvidenceToolCount:
        8 as const,

      draftOnlyToolCount:
        8 as const,

      ownerReviewRequiredCount:
        8 as const,

      maximumAggregateTaskCount:
        8 as const,

      draftCreatedCount:
        0 as const,

      exactCandidateSequencePreserved:
        true as const,

      exactCandidateIdentityPreserved:
        true as const,

      exactRuntimeBindingsPreserved:
        true as const,

      uniqueScenarioCount:
        8 as const,

      uniqueCandidatePreparationDigests:
        8 as const,
    },

    authorityBoundary: {
      canonicalOwnerActivatedRuntimeIssuanceBound:
        true as const,

      exactEightCandidatesRequired:
        true as const,

      controlledInternalWorkOnly:
        true as const,

      controlledShadowOperationPrepared:
        true as const,

      controlledShadowOperationExecuted:
        false as const,

      shadowExecutionEligible:
        true as const,

      ownerReviewRequiredAfterExecution:
        true as const,

      emergencyPauseAvailable:
        true as const,

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
    },

    nextStep:
      "EXECUTE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS" as const,

    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    }) as EngineeringAIWorkforceControlledShadowOperationPreparation;

  validateEngineeringAIWorkforceControlledShadowOperationPreparation(
    preparation,
  );

  return preparation;
}

export const ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION =
  createEngineeringAIWorkforceControlledShadowOperationPreparation({
    preparationId:
      "engineering-ai-workforce-controlled-shadow-operation-preparation-001",

    ownerActivatedRuntimeIssuance:
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,

    preparedAt:
      "2026-07-23T09:55:16.073Z",
  });
