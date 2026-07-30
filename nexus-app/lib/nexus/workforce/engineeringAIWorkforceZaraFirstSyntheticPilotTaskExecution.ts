import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
} from "./engineeringAIWorkforceControlledShadowOperationExecution";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-zara-first-synthetic-pilot-task-execution-v1";

export const ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_SCENARIO =
  "SCHEMA_AND_LINEAGE_VALIDATION" as const;

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
): Readonly<T> {
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

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    !/^[a-z0-9][a-z0-9-]{2,159}$/u.test(
      value,
    ) ||
    /(secret|password|token|credential|api[-_]?key|private[-_]?key)/iu.test(
      value,
    )
  ) {
    throw new Error(
      `${label} is invalid or credential-bearing.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(
      Date.parse(value),
    ) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

export const ENGINEERING_AI_WORKFORCE_ZARA_SYNTHETIC_DATA_PIPELINE_FIXTURE =
  deepFreeze({
    fixtureId:
      "engineering-zara-schema-and-lineage-validation-fixture-001",

    fixtureClass:
      "SYNTHETIC_SANITIZED_DATA_PIPELINE_SCHEMA_LINEAGE_INPUT",

    syntheticOnly:
      true,

    realCustomerDataUsed:
      false,

    crossTenantContextUsed:
      false,

    repositoryEvidenceUsed:
      false,

    productionEvidenceUsed:
      false,

    objective:
      "Validate a bounded synthetic schema and tenant-scoped lineage design with deterministic duplicate handling, idempotency, immutable audit evidence, and owner review.",

    verifiedFacts: [
      "Only synthetic sanitized evidence is available.",
      "Real customer data and production database access are unauthorized.",
      "Zara is owner-authorized only for this first bounded synthetic data-engineering pilot task.",
      "Mahir's first synthetic pilot task has been reviewed by the owner.",
      "Repository mutation, deployment, provider execution, customer contact, payments, and public launch remain blocked.",
      "Every pilot task must stop for immediate owner review.",
    ],

    dataPipelineConstraints: [
      "Require explicit schema validation for every proposed record shape.",
      "Attach tenant identity and lineage evidence to every synthetic transformation.",
      "Reject or reconcile incomplete and duplicated records deterministically.",
      "Block cross-tenant joins unless separately authorized and proven safe.",
      "Distinguish read, draft, and mutation evidence without performing any data mutation.",
    ],

    requiredEvidenceClasses: [
      "SCHEMA_VALIDATION_EVIDENCE",
      "TENANT_SCOPED_LINEAGE_EVIDENCE",
      "IDEMPOTENCY_AND_DUPLICATE_HANDLING_EVIDENCE",
      "CROSS_TENANT_JOIN_BLOCK_EVIDENCE",
      "READ_DRAFT_MUTATION_AUDIT_EVIDENCE",
      "OWNER_REVIEW_EVIDENCE",
    ],
  });

export const ENGINEERING_AI_WORKFORCE_ZARA_SCHEMA_AND_LINEAGE_VALIDATION_DRAFT =
  deepFreeze({
    draftId:
      "engineering-zara-schema-and-lineage-validation-draft-001",

    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

    title:
      "Synthetic schema and tenant-scoped lineage validation",

    summary:
      "Review synthetic pipeline correctness, schema validation, tenant-scoped lineage, idempotency, duplicate handling, and immutable audit requirements without accessing or mutating real data.",

    analysisOutcome:
      "BOUNDED_SCHEMA_AND_LINEAGE_VALIDATION_RECOMMENDED",

    riskLevel:
      "MEDIUM",

    verifiedFacts: [
      "Only Zara's first synthetic pilot task is currently executable.",
      "Only synthetic sanitized evidence is available.",
      "Real customer data and production database access are unauthorized.",
      "The task is sandbox-only and uses read-only synthetic evidence.",
      "Owner review is mandatory immediately after this draft.",
    ],

    analysisStages: [
      {
        sequence: 1,
        stage: "DATA_SCOPE_CONFIRMATION",
        purpose: "Confirm canonical identities, synthetic-only scope, blocked authorities, and the exact schema and lineage validation boundary.",
        requiredEvidence: [
          "Canonical Mahir owner-review decision",
          "Canonical Zara candidate and runtime identity",
          "Controlled-shadow data-pipeline evidence",
          "Clean repository state",
        ],
        exitGate: "All source identities, synthetic scope limits, and blocked authorities validate exactly.",
        reversible: true,
      },
      {
        sequence: 2,
        stage: "SCHEMA_AND_LINEAGE_VALIDATION",
        purpose: "Validate proposed schema structure and ensure tenant identity and lineage remain attached to every synthetic transformation.",
        requiredEvidence: [
          "Schema validation evidence",
          "Tenant-scoped lineage evidence",
          "Transformation identity evidence",
          "Read-only synthetic source evidence",
        ],
        exitGate: "No transformation lacks schema, tenant, or lineage evidence and no real data is accessed.",
        reversible: true,
      },
      {
        sequence: 3,
        stage: "IDEMPOTENCY_AND_TENANT_ISOLATION_REVIEW",
        purpose: "Review deterministic duplicate handling, idempotency, cross-tenant join blocking, and read-draft-mutation audit separation.",
        requiredEvidence: [
          "Duplicate rejection or reconciliation evidence",
          "Idempotency evidence",
          "Cross-tenant join block evidence",
          "Immutable audit-classification evidence",
        ],
        exitGate: "Incomplete evidence fails closed and no cross-tenant or mutation authority is introduced.",
        reversible: true,
      },
      {
        sequence: 4,
        stage: "OWNER_DATA_REVIEW",
        purpose: "Present schema, lineage, duplicate-handling, residual-risk, and uncertainty evidence while retaining every consequential data decision with the owner.",
        requiredEvidence: [
          "Immutable validation summary",
          "Open risks and uncertainties",
          "Blocked data authorities",
          "Explicit owner decision",
        ],
        exitGate: "No data mutation or next-candidate execution occurs without new explicit owner approval.",
        reversible: true,
      },
    ],

    evidenceGates: [
      "Reject stale, copied, tampered, cross-owner, cross-tenant, or identity-mismatched evidence.",
      "Require exact schema validation and tenant-scoped lineage evidence.",
      "Require deterministic duplicate handling, idempotency, and cross-tenant join blocking.",
      "Keep real-data access, database mutation, provider execution, repository mutation, and production authority blocked.",
      "Treat missing or inconsistent audit evidence as a blocker, not as assumed success.",
    ],

    identifiedBlockers: [
      "No real dataset volume is provided.",
      "No production warehouse technology is approved.",
      "No customer-data processing or production database authority exists.",
    ],

    recommendations: [
      "Require schema validation, idempotency, and tenant-scoped lineage.",
      "Block cross-tenant joins unless separately authorized and proven safe.",
      "Preserve immutable evidence for every future data mutation.",
    ],

    uncertainties: [
      "No real dataset volume is provided.",
      "No production warehouse technology is approved.",
      "No customer-data processing authority exists.",
    ],

    assumptionsMade:
      false,

    unsupportedClaimsIncluded:
      false,

    urgencyExaggerated:
      false,

    guaranteeMade:
      false,

    ownerDecisionMade:
      false,

    implementationPrepared:
      false,

    repositoryChangePrepared:
      false,

    repositoryChangeExecuted:
      false,

    productionDeploymentPrepared:
      false,

    productionDeploymentExecuted:
      false,

    customerDeliveryPrepared:
      false,

    customerDeliveryExecuted:
      false,
  });

export interface CreateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecutionInput {
  readonly executionId:
    string;

  readonly mahirOwnerReviewDecision:
    EngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision;

  readonly executedAt:
    string;
}

export interface EngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "ENGINEERING_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly employeeId:
    "candidate-zara-v1";

  readonly employeeCode:
    "nx-engineering-007";

  readonly publicName:
    "Zara";

  readonly officialRole:
    "AI Data Engineering & Analytics Specialist";

  readonly runtimeId:
    "runtime-engineering-nx-engineering-007-candidate-v1";

  readonly sourceMahirOwnerReviewDecisionId:
    string;

  readonly sourceMahirOwnerReviewDecisionDigest:
    string;

  readonly sourceMahirExecutionId:
    string;

  readonly sourceMahirExecutionDigest:
    string;

  readonly ownerFirstTaskExecutionDecisionId:
    string;

  readonly ownerFirstTaskExecutionDecisionDigest:
    string;

  readonly sourcePreparationId:
    string;

  readonly sourcePreparationDigest:
    string;

  readonly candidateDecisionDigest:
    string;

  readonly sourceControlledShadowExecutionDigest:
    string;

  readonly taskSequence:
    1;

  readonly executionSequence:
    7;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_SCENARIO;

  readonly pilotTask: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    evidenceToolMode:
      "READ_ONLY";

    draftToolMode:
      "DRAFT_ONLY";

    maximumTaskCount:
      3;

    executedTaskCount:
      1;

    remainingTaskCapacity:
      2;

    concurrentTaskLimit:
      1;

    failureThreshold:
      1;

    ownerReviewFrequency:
      "AFTER_EVERY_PILOT_TASK";
  }>;

  readonly syntheticDataPipelineFixture:
    typeof ENGINEERING_AI_WORKFORCE_ZARA_SYNTHETIC_DATA_PIPELINE_FIXTURE;

  readonly schemaAndLineageValidationDraft:
    typeof ENGINEERING_AI_WORKFORCE_ZARA_SCHEMA_AND_LINEAGE_VALIDATION_DRAFT;

  readonly executionBoundary: Readonly<{
    canonicalMahirOwnerReviewBound:
      true;

    mahirOwnerReviewIntegrityVerified:
      true;

    canonicalOwnerFirstTaskDecisionBound:
      true;

    canonicalPilotPreparationBound:
      true;

    candidateDecisionBound:
      true;

    controlledShadowEvidenceBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    employeeIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    approvalBypassAllowed:
      false;

    exactZaraFirstTaskExecuted:
      true;

    syntheticPilotTaskExecutionPerformed:
      true;

    taskExecutorInvocationCount:
      1;

    pilotDraftCreated:
      true;

    pilotCompleted:
      false;

    ownerDecisionMade:
      false;

    ownerReviewRequired:
      true;

    ownerReviewRequiredImmediately:
      true;

    nextCandidateExecutionAuthorized:
      false;

    remainingOneAuthorizedCandidateWaiting:
      true;

    concurrentCandidateExecutionAuthorized:
      false;

    secondSyntheticPilotTaskExecutionAuthorized:
      false;

    thirdSyntheticPilotTaskExecutionAuthorized:
      false;

    repositoryReadPerformed:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWritePerformed:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    secretsAccessPerformed:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataUsed:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactPerformed:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryPrepared:
      false;

    externalDeliveryExecuted:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAccessPerformed:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationPerformed:
      false;

    productionMutationAuthorized:
      false;

    productionDeploymentPrepared:
      false;

    productionDeploymentExecuted:
      false;

    productionDeploymentAuthorized:
      false;

    paymentExecutionPerformed:
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

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_ENGINEERING_ZARA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

const ownerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const mahirOwnerReview =
  ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

const zaraCandidate =
  ownerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Zara",
  );

const zaraShadowExecution =
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
    .candidateExecutions.find(
      (candidate) =>
        candidate.publicName === "Zara",
    );

if (
  !zaraCandidate ||
  zaraCandidate.employeeId !==
    "candidate-zara-v1" ||
  zaraCandidate.employeeCode !==
    "nx-engineering-007" ||
  zaraCandidate.officialRole !==
    "AI Data Engineering & Analytics Specialist" ||
  zaraCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-007-candidate-v1" ||
  zaraCandidate.developmentSequence !==
    7 ||
  zaraCandidate.executionSequence !==
    7 ||
  zaraCandidate.taskSequence !==
    1 ||
  zaraCandidate.scenarioId !==
    ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_SCENARIO ||
  zaraCandidate.firstTaskExecutionAuthorized !==
    true ||
  zaraCandidate.firstTaskExecutionPerformed !==
    false
) {
  throw new Error(
    "Canonical Zara first-task candidate decision is invalid.",
  );
}

if (
  !zaraShadowExecution ||
  zaraShadowExecution.employeeId !==
    "candidate-zara-v1" ||
  zaraShadowExecution.employeeCode !==
    "nx-engineering-007" ||
  zaraShadowExecution.runtimeId !==
    "runtime-engineering-nx-engineering-007-candidate-v1" ||
  zaraShadowExecution.syntheticEvidence
    .dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
  zaraShadowExecution.syntheticEvidence
    .evidenceToolMode !==
      "READ_ONLY" ||
  zaraShadowExecution.syntheticEvidence
    .realCustomerDataUsed !==
      false ||
  zaraShadowExecution.syntheticEvidence
    .crossTenantContextUsed !==
      false ||
  zaraShadowExecution.draftEvidence
    .draftToolMode !==
      "DRAFT_ONLY" ||
  zaraShadowExecution.executionBoundary
    .repositoryReadAuthorized !==
      false ||
  zaraShadowExecution.executionBoundary
    .repositoryWriteAuthorized !==
      false ||
  zaraShadowExecution.executionBoundary
    .productionDeploymentAuthorized !==
      false ||
  zaraShadowExecution.executionBoundary
    .publicLaunchAuthorized !==
      false
) {
  throw new Error(
    "Canonical Zara controlled-shadow evidence is invalid.",
  );
}

const canonicalZaraCandidate =
  zaraCandidate;

const canonicalZaraShadowExecution =
  zaraShadowExecution;
let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision(
    mahirOwnerReview,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    ownerFirstTaskDecision,
  );

  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  );

  if (
    mahirOwnerReview.decision !==
      "APPROVE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
    mahirOwnerReview.zaraFirstTaskExecutionAuthorized !==
      true ||
    mahirOwnerReview.zaraFirstTaskExecutionPerformed !==
      false ||
    mahirOwnerReview.nextCandidate.employeeId !==
      canonicalZaraCandidate.employeeId ||
    mahirOwnerReview.nextCandidate.runtimeId !==
      canonicalZaraCandidate.runtimeId ||
    mahirOwnerReview.nextCandidate.executionSequence !==
      7 ||
    mahirOwnerReview.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_SCENARIO ||
    mahirOwnerReview.authorityBoundary
      .onlyZaraCurrentlyExecutable !==
        true ||
    mahirOwnerReview.authorityBoundary
      .remainingOneAuthorizedCandidateWaiting !==
        true ||
    mahirOwnerReview.authorityBoundary
      .repositoryReadAuthorized !==
        false ||
    mahirOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !==
        false ||
    mahirOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !==
        false ||
    mahirOwnerReview.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    mahirOwnerReview.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    mahirOwnerReview.authorityBoundary
      .publicLaunchAuthorized !==
        false ||
    mahirOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_SEVEN"
  ) {
    throw new Error(
      "Zara execution requires the exact canonical approved sequence-seven owner review.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution(
  record:
    EngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Zara first synthetic pilot execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Zara first synthetic pilot execution time",
    record.executedAt,
  );

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    record.tenantId !==
      mahirOwnerReview.tenantId ||
    record.ownerId !==
      mahirOwnerReview.ownerId ||
    record.employeeId !==
      canonicalZaraCandidate.employeeId ||
    record.employeeCode !==
      canonicalZaraCandidate.employeeCode ||
    record.publicName !==
      "Zara" ||
    record.officialRole !==
      canonicalZaraCandidate.officialRole ||
    record.runtimeId !==
      canonicalZaraCandidate.runtimeId ||
    record.sourceMahirOwnerReviewDecisionId !==
      mahirOwnerReview.decisionId ||
    record.sourceMahirOwnerReviewDecisionDigest !==
      mahirOwnerReview.decisionDigest ||
    record.sourceMahirExecutionId !==
      mahirOwnerReview.sourceExecutionId ||
    record.sourceMahirExecutionDigest !==
      mahirOwnerReview.sourceExecutionDigest ||
    record.ownerFirstTaskExecutionDecisionId !==
      ownerFirstTaskDecision.decisionId ||
    record.ownerFirstTaskExecutionDecisionDigest !==
      ownerFirstTaskDecision.decisionDigest ||
    record.sourcePreparationId !==
      ownerFirstTaskDecision.sourcePreparationId ||
    record.sourcePreparationDigest !==
      ownerFirstTaskDecision.sourcePreparationDigest ||
    record.candidateDecisionDigest !==
      canonicalZaraCandidate.candidateDecisionDigest ||
    record.sourceControlledShadowExecutionDigest !==
      canonicalZaraShadowExecution.candidateExecutionDigest ||
    record.taskSequence !==
      1 ||
    record.executionSequence !==
      7 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_SCENARIO
  ) {
    throw new Error(
      "Zara first synthetic pilot execution source binding is invalid.",
    );
  }

  if (
    Date.parse(record.executedAt) <
    Date.parse(mahirOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Zara first synthetic pilot execution cannot precede Mahir owner review approval.",
    );
  }

  if (
    sha256(
      record.syntheticDataPipelineFixture,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_ZARA_SYNTHETIC_DATA_PIPELINE_FIXTURE,
      ) ||
    sha256(
      record.schemaAndLineageValidationDraft,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_ZARA_SCHEMA_AND_LINEAGE_VALIDATION_DRAFT,
      )
  ) {
    throw new Error(
      "Zara first synthetic pilot data-pipeline evidence is invalid.",
    );
  }

  const pilotTask =
    record.pilotTask;

  if (
    pilotTask.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    pilotTask.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    pilotTask.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    pilotTask.executionMode !==
      "SANDBOX_ONLY" ||
    pilotTask.evidenceToolMode !==
      "READ_ONLY" ||
    pilotTask.draftToolMode !==
      "DRAFT_ONLY" ||
    pilotTask.maximumTaskCount !==
      3 ||
    pilotTask.executedTaskCount !==
      1 ||
    pilotTask.remainingTaskCapacity !==
      2 ||
    pilotTask.concurrentTaskLimit !==
      1 ||
    pilotTask.failureThreshold !==
      1 ||
    pilotTask.ownerReviewFrequency !==
      "AFTER_EVERY_PILOT_TASK"
  ) {
    throw new Error(
      "Zara first synthetic pilot task contract is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalMahirOwnerReviewBound !== true ||
    boundary.mahirOwnerReviewIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.canonicalPilotPreparationBound !== true ||
    boundary.candidateDecisionBound !== true ||
    boundary.controlledShadowEvidenceBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.employeeIdentityBound !== true ||
    boundary.runtimeIdentityBound !== true ||
    boundary.approvalBypassAllowed !== false ||
    boundary.exactZaraFirstTaskExecuted !== true ||
    boundary.syntheticPilotTaskExecutionPerformed !== true ||
    boundary.taskExecutorInvocationCount !== 1 ||
    boundary.pilotDraftCreated !== true ||
    boundary.pilotCompleted !== false ||
    boundary.ownerDecisionMade !== false ||
    boundary.ownerReviewRequired !== true ||
    boundary.ownerReviewRequiredImmediately !== true ||
    boundary.nextCandidateExecutionAuthorized !== false ||
    boundary.remainingOneAuthorizedCandidateWaiting !== true ||
    boundary.concurrentCandidateExecutionAuthorized !== false ||
    boundary.secondSyntheticPilotTaskExecutionAuthorized !== false ||
    boundary.thirdSyntheticPilotTaskExecutionAuthorized !== false ||
    boundary.repositoryReadPerformed !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.repositoryWritePerformed !== false ||
    boundary.repositoryWriteAuthorized !== false ||
    boundary.branchCreationAuthorized !== false ||
    boundary.pullRequestPreparationAuthorized !== false ||
    boundary.mergeAuthorized !== false ||
    boundary.secretsAccessPerformed !== false ||
    boundary.secretsAccessAuthorized !== false ||
    boundary.realCustomerDataUsed !== false ||
    boundary.realCustomerDataAccessAuthorized !== false ||
    boundary.realCustomerContactPerformed !== false ||
    boundary.realCustomerContactAuthorized !== false ||
    boundary.externalDeliveryPrepared !== false ||
    boundary.externalDeliveryExecuted !== false ||
    boundary.externalDeliveryAuthorized !== false ||
    boundary.liveProviderExecutionAuthorized !== false ||
    boundary.productionDatabaseAccessPerformed !== false ||
    boundary.productionDatabaseAuthorized !== false ||
    boundary.productionMutationPerformed !== false ||
    boundary.productionMutationAuthorized !== false ||
    boundary.productionDeploymentPrepared !== false ||
    boundary.productionDeploymentExecuted !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.paymentExecutionPerformed !== false ||
    boundary.paymentExecutionAuthorized !== false ||
    boundary.financialCommitmentAuthorized !== false ||
    boundary.legalCommitmentAuthorized !== false ||
    boundary.autonomousDecisionAuthorized !== false ||
    boundary.productionReadinessAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.monitoringRequired !== true ||
    boundary.emergencyPauseAvailable !== true
  ) {
    throw new Error(
      "Zara first synthetic pilot execution boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ZARA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Zara first synthetic pilot execution next step is invalid.",
    );
  }

  const {
    executionDigest,
    ...recordCore
  } = record;

  if (
    executionDigest !==
      sha256(recordCore)
  ) {
    throw new Error(
      "Zara first synthetic pilot execution digest is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.pilotTask) ||
    !Object.isFrozen(record.syntheticDataPipelineFixture) ||
    !Object.isFrozen(
      record.syntheticDataPipelineFixture.verifiedFacts,
    ) ||
    !Object.isFrozen(
      record.syntheticDataPipelineFixture.dataPipelineConstraints,
    ) ||
    !Object.isFrozen(
      record.syntheticDataPipelineFixture.requiredEvidenceClasses,
    ) ||
    !Object.isFrozen(
      record.schemaAndLineageValidationDraft,
    ) ||
    !Object.isFrozen(
      record.schemaAndLineageValidationDraft.analysisStages,
    ) ||
    record.schemaAndLineageValidationDraft.analysisStages.some(
      (stage) =>
        !Object.isFrozen(stage) ||
        !Object.isFrozen(stage.requiredEvidence),
    ) ||
    !Object.isFrozen(
      record.schemaAndLineageValidationDraft.evidenceGates,
    ) ||
    !Object.isFrozen(
      record.schemaAndLineageValidationDraft.identifiedBlockers,
    ) ||
    !Object.isFrozen(
      record.schemaAndLineageValidationDraft.recommendations,
    ) ||
    !Object.isFrozen(
      record.schemaAndLineageValidationDraft.uncertainties,
    ) ||
    !Object.isFrozen(record.executionBoundary)
  ) {
    throw new Error(
      "Zara first synthetic pilot execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceZaraFirstSyntheticPilotTask(
  input:
    CreateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecutionInput,
): EngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution {
  if (
    input.mahirOwnerReviewDecision !==
      ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
  ) {
    throw new Error(
      "Zara first synthetic pilot execution requires the canonical Mahir owner-review decision.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Zara first synthetic pilot execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Zara first synthetic pilot execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(
      input.mahirOwnerReviewDecision.decidedAt,
    )
  ) {
    throw new Error(
      "Zara first synthetic pilot execution cannot precede Mahir owner review approval.",
    );
  }

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" as const,

    tenantId:
      mahirOwnerReview.tenantId,

    ownerId:
      mahirOwnerReview.ownerId,

    employeeId:
      "candidate-zara-v1" as const,

    employeeCode:
      "nx-engineering-007" as const,

    publicName:
      "Zara" as const,

    officialRole:
      "AI Data Engineering & Analytics Specialist" as const,

    runtimeId:
      "runtime-engineering-nx-engineering-007-candidate-v1" as const,

    sourceMahirOwnerReviewDecisionId:
      mahirOwnerReview.decisionId,

    sourceMahirOwnerReviewDecisionDigest:
      mahirOwnerReview.decisionDigest,

    sourceMahirExecutionId:
      mahirOwnerReview.sourceExecutionId,

    sourceMahirExecutionDigest:
      mahirOwnerReview.sourceExecutionDigest,

    ownerFirstTaskExecutionDecisionId:
      ownerFirstTaskDecision.decisionId,

    ownerFirstTaskExecutionDecisionDigest:
      ownerFirstTaskDecision.decisionDigest,

    sourcePreparationId:
      ownerFirstTaskDecision.sourcePreparationId,

    sourcePreparationDigest:
      ownerFirstTaskDecision.sourcePreparationDigest,

    candidateDecisionDigest:
      canonicalZaraCandidate.candidateDecisionDigest,

    sourceControlledShadowExecutionDigest:
      canonicalZaraShadowExecution.candidateExecutionDigest,

    taskSequence:
      1 as const,

    executionSequence:
      7 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_SCENARIO,

    pilotTask: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      evidenceToolMode:
        "READ_ONLY" as const,

      draftToolMode:
        "DRAFT_ONLY" as const,

      maximumTaskCount:
        3 as const,

      executedTaskCount:
        1 as const,

      remainingTaskCapacity:
        2 as const,

      concurrentTaskLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_PILOT_TASK" as const,
    },

    syntheticDataPipelineFixture:
      ENGINEERING_AI_WORKFORCE_ZARA_SYNTHETIC_DATA_PIPELINE_FIXTURE,

    schemaAndLineageValidationDraft:
      ENGINEERING_AI_WORKFORCE_ZARA_SCHEMA_AND_LINEAGE_VALIDATION_DRAFT,

    executionBoundary: {
      canonicalMahirOwnerReviewBound:
        true as const,

      mahirOwnerReviewIntegrityVerified:
        true as const,

      canonicalOwnerFirstTaskDecisionBound:
        true as const,

      canonicalPilotPreparationBound:
        true as const,

      candidateDecisionBound:
        true as const,

      controlledShadowEvidenceBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      employeeIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      exactZaraFirstTaskExecuted:
        true as const,

      syntheticPilotTaskExecutionPerformed:
        true as const,

      taskExecutorInvocationCount:
        1 as const,

      pilotDraftCreated:
        true as const,

      pilotCompleted:
        false as const,

      ownerDecisionMade:
        false as const,

      ownerReviewRequired:
        true as const,

      ownerReviewRequiredImmediately:
        true as const,

      nextCandidateExecutionAuthorized:
        false as const,

      remainingOneAuthorizedCandidateWaiting:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      secondSyntheticPilotTaskExecutionAuthorized:
        false as const,

      thirdSyntheticPilotTaskExecutionAuthorized:
        false as const,

      repositoryReadPerformed:
        false as const,

      repositoryReadAuthorized:
        false as const,

      repositoryWritePerformed:
        false as const,

      repositoryWriteAuthorized:
        false as const,

      branchCreationAuthorized:
        false as const,

      pullRequestPreparationAuthorized:
        false as const,

      mergeAuthorized:
        false as const,

      secretsAccessPerformed:
        false as const,

      secretsAccessAuthorized:
        false as const,

      realCustomerDataUsed:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactPerformed:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryPrepared:
        false as const,

      externalDeliveryExecuted:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseAccessPerformed:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      productionMutationPerformed:
        false as const,

      productionMutationAuthorized:
        false as const,

      productionDeploymentPrepared:
        false as const,

      productionDeploymentExecuted:
        false as const,

      productionDeploymentAuthorized:
        false as const,

      paymentExecutionPerformed:
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
    },

    nextStep:
      "AWAIT_OWNER_ENGINEERING_ZARA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      executionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution;

  validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION =
  executeEngineeringAIWorkforceZaraFirstSyntheticPilotTask({
    executionId:
      "engineering-zara-first-synthetic-pilot-task-execution-001",

    mahirOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-07-25T15:50:00.000Z",
  });
