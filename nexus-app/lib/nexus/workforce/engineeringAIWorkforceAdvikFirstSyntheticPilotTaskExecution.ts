import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
} from "./engineeringAIWorkforceControlledShadowOperationExecution";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-advik-first-synthetic-pilot-task-execution-v1";

export const ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_SCENARIO =
  "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN" as const;

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

export const ENGINEERING_AI_WORKFORCE_ADVIK_SYNTHETIC_RED_TEAM_EVALUATION_FIXTURE =
  deepFreeze({
    fixtureId:
      "engineering-advik-canonical-evidence-substitution-test-plan-fixture-001",

    fixtureClass:
      "SYNTHETIC_SANITIZED_RED_TEAM_EVALUATION_INPUT",

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
      "The plan uses synthetic sanitized evidence only.",
      "No real attack execution credential access or production probing is authorized.",
      "Advik is owner-authorized only for this first bounded synthetic data-engineering pilot task.",
      "Zara's first synthetic pilot task has been reviewed by the owner.",
      "Repository mutation, deployment, provider execution, customer contact, payments, and public launch remain blocked.",
      "Every pilot task must stop for immediate owner review.",
    ],

    redTeamEvaluationConstraints: [
      "Require explicit schema validation for every proposed record shape.",
      "Attach tenant identity and lineage evidence to every synthetic transformation.",
      "Reject or reconcile incomplete and duplicated records deterministically.",
      "Block cross-tenant joins unless separately authorized and proven safe.",
      "Distinguish read, draft, and mutation evidence without performing any data mutation.",
    ],

    requiredEvidenceClasses: [
      "CANONICAL_EVIDENCE_SUBSTITUTION_REJECTION_EVIDENCE",
      "CROSS_OWNER_CROSS_TENANT_REJECTION_EVIDENCE",
      "PROMPTED_AUTHORITY_ESCALATION_REJECTION_EVIDENCE",
      "TAMPERED_STALE_MISMATCHED_EVIDENCE_REJECTION_EVIDENCE",
      "CONSEQUENTIAL_AUTHORITY_FLAGS_FALSE_EVIDENCE",
      "OWNER_REVIEW_EVIDENCE",
    ],
  });

export const ENGINEERING_AI_WORKFORCE_ADVIK_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_DRAFT =
  deepFreeze({
    draftId:
      "engineering-advik-canonical-evidence-substitution-test-plan-draft-001",

    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

    title:
      "Synthetic schema and tenant-scoped lineage validation",

    summary:
      "Review synthetic pipeline correctness, schema validation, tenant-scoped lineage, idempotency, duplicate handling, and immutable audit requirements without accessing or mutating real data.",

    analysisOutcome:
      "BOUNDED_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_RECOMMENDED",

    riskLevel:
      "MEDIUM",

    verifiedFacts: [
      "Only Advik's first synthetic pilot task is currently executable.",
      "The plan uses synthetic sanitized evidence only.",
      "No real attack execution credential access or production probing is authorized.",
      "The task is sandbox-only and uses read-only synthetic evidence.",
      "Owner review is mandatory immediately after this draft.",
    ],

    analysisStages: [
      {
        sequence: 1,
        stage: "SYNTHETIC_EVIDENCE_SCOPE_CONFIRMATION",
        purpose: "Confirm canonical identities, synthetic-only scope, blocked authorities, and the exact schema and lineage validation boundary.",
        requiredEvidence: [
          "Canonical Zara owner-review decision",
          "Canonical Advik candidate and runtime identity",
          "Controlled-shadow data-pipeline evidence",
          "Clean repository state",
        ],
        exitGate: "All source identities, synthetic scope limits, and blocked authorities validate exactly.",
        reversible: true,
      },
      {
        sequence: 2,
        stage: "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN",
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
        stage: "CROSS_OWNER_CROSS_TENANT_REJECTION_REVIEW",
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
        stage: "OWNER_RED_TEAM_REVIEW",
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
      "No live attack surface is assessed.",
      "No customer-data processing or production database authority exists.",
    ],

    recommendations: [
      "Require schema validation, idempotency, and tenant-scoped lineage.",
      "Block cross-tenant joins unless separately authorized and proven safe.",
      "Preserve immutable evidence for every future data mutation.",
    ],

    uncertainties: [
      "No real dataset volume is provided.",
      "No live attack surface is assessed.",
      "No production vulnerability claim is made.",
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

export interface CreateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecutionInput {
  readonly executionId:
    string;

  readonly zaraOwnerReviewDecision:
    EngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision;

  readonly executedAt:
    string;
}

export interface EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly employeeId:
    "candidate-advik-v1";

  readonly employeeCode:
    "nx-engineering-008";

  readonly publicName:
    "Advik";

  readonly officialRole:
    "AI Systems Evaluation & Red-Team Specialist";

  readonly runtimeId:
    "runtime-engineering-nx-engineering-008-candidate-v1";

  readonly sourceZaraOwnerReviewDecisionId:
    string;

  readonly sourceZaraOwnerReviewDecisionDigest:
    string;

  readonly sourceZaraExecutionId:
    string;

  readonly sourceZaraExecutionDigest:
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
    8;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_SCENARIO;

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

  readonly syntheticRedTeamEvaluationFixture:
    typeof ENGINEERING_AI_WORKFORCE_ADVIK_SYNTHETIC_RED_TEAM_EVALUATION_FIXTURE;

  readonly canonicalEvidenceSubstitutionTestPlanDraft:
    typeof ENGINEERING_AI_WORKFORCE_ADVIK_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_DRAFT;

  readonly executionBoundary: Readonly<{
    canonicalZaraOwnerReviewBound:
      true;

    zaraOwnerReviewIntegrityVerified:
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

    exactAdvikFirstTaskExecuted:
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
      false;

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
    "AWAIT_OWNER_ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

const ownerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const zaraOwnerReview =
  ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

const advikCandidate =
  ownerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Advik",
  );

const advikShadowExecution =
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
    .candidateExecutions.find(
      (candidate) =>
        candidate.publicName === "Advik",
    );

if (
  !advikCandidate ||
  advikCandidate.employeeId !==
    "candidate-advik-v1" ||
  advikCandidate.employeeCode !==
    "nx-engineering-008" ||
  advikCandidate.officialRole !==
    "AI Systems Evaluation & Red-Team Specialist" ||
  advikCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-008-candidate-v1" ||
  advikCandidate.developmentSequence !==
    8 ||
  advikCandidate.executionSequence !==
    8 ||
  advikCandidate.taskSequence !==
    1 ||
  advikCandidate.scenarioId !==
    ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_SCENARIO ||
  advikCandidate.firstTaskExecutionAuthorized !==
    true ||
  advikCandidate.firstTaskExecutionPerformed !==
    false
) {
  throw new Error(
    "Canonical Advik first-task candidate decision is invalid.",
  );
}

if (
  !advikShadowExecution ||
  advikShadowExecution.employeeId !==
    "candidate-advik-v1" ||
  advikShadowExecution.employeeCode !==
    "nx-engineering-008" ||
  advikShadowExecution.runtimeId !==
    "runtime-engineering-nx-engineering-008-candidate-v1" ||
  advikShadowExecution.syntheticEvidence
    .dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
  advikShadowExecution.syntheticEvidence
    .evidenceToolMode !==
      "READ_ONLY" ||
  advikShadowExecution.syntheticEvidence
    .realCustomerDataUsed !==
      false ||
  advikShadowExecution.syntheticEvidence
    .crossTenantContextUsed !==
      false ||
  advikShadowExecution.draftEvidence
    .draftToolMode !==
      "DRAFT_ONLY" ||
  advikShadowExecution.executionBoundary
    .repositoryReadAuthorized !==
      false ||
  advikShadowExecution.executionBoundary
    .repositoryWriteAuthorized !==
      false ||
  advikShadowExecution.executionBoundary
    .productionDeploymentAuthorized !==
      false ||
  advikShadowExecution.executionBoundary
    .publicLaunchAuthorized !==
      false
) {
  throw new Error(
    "Canonical Advik controlled-shadow evidence is invalid.",
  );
}

const canonicalAdvikCandidate =
  advikCandidate;

const canonicalAdvikShadowExecution =
  advikShadowExecution;
let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision(
    zaraOwnerReview,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    ownerFirstTaskDecision,
  );

  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  );

  if (
    zaraOwnerReview.decision !==
      "APPROVE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
    zaraOwnerReview.advikFirstTaskExecutionAuthorized !==
      true ||
    zaraOwnerReview.advikFirstTaskExecutionPerformed !==
      false ||
    zaraOwnerReview.nextCandidate.employeeId !==
      canonicalAdvikCandidate.employeeId ||
    zaraOwnerReview.nextCandidate.runtimeId !==
      canonicalAdvikCandidate.runtimeId ||
    zaraOwnerReview.nextCandidate.executionSequence !==
      8 ||
    zaraOwnerReview.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_SCENARIO ||
    zaraOwnerReview.authorityBoundary
      .onlyAdvikCurrentlyExecutable !==
        true ||
    zaraOwnerReview.authorityBoundary
      .remainingOneAuthorizedCandidateWaiting !==
        false ||
    zaraOwnerReview.authorityBoundary
      .repositoryReadAuthorized !==
        false ||
    zaraOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !==
        false ||
    zaraOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !==
        false ||
    zaraOwnerReview.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    zaraOwnerReview.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    zaraOwnerReview.authorityBoundary
      .publicLaunchAuthorized !==
        false ||
    zaraOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_EIGHT"
  ) {
    throw new Error(
      "Advik execution requires the exact canonical approved sequence-seven owner review.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution(
  record:
    EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Advik first synthetic pilot execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Advik first synthetic pilot execution time",
    record.executedAt,
  );

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    record.tenantId !==
      zaraOwnerReview.tenantId ||
    record.ownerId !==
      zaraOwnerReview.ownerId ||
    record.employeeId !==
      canonicalAdvikCandidate.employeeId ||
    record.employeeCode !==
      canonicalAdvikCandidate.employeeCode ||
    record.publicName !==
      "Advik" ||
    record.officialRole !==
      canonicalAdvikCandidate.officialRole ||
    record.runtimeId !==
      canonicalAdvikCandidate.runtimeId ||
    record.sourceZaraOwnerReviewDecisionId !==
      zaraOwnerReview.decisionId ||
    record.sourceZaraOwnerReviewDecisionDigest !==
      zaraOwnerReview.decisionDigest ||
    record.sourceZaraExecutionId !==
      zaraOwnerReview.sourceExecutionId ||
    record.sourceZaraExecutionDigest !==
      zaraOwnerReview.sourceExecutionDigest ||
    record.ownerFirstTaskExecutionDecisionId !==
      ownerFirstTaskDecision.decisionId ||
    record.ownerFirstTaskExecutionDecisionDigest !==
      ownerFirstTaskDecision.decisionDigest ||
    record.sourcePreparationId !==
      ownerFirstTaskDecision.sourcePreparationId ||
    record.sourcePreparationDigest !==
      ownerFirstTaskDecision.sourcePreparationDigest ||
    record.candidateDecisionDigest !==
      canonicalAdvikCandidate.candidateDecisionDigest ||
    record.sourceControlledShadowExecutionDigest !==
      canonicalAdvikShadowExecution.candidateExecutionDigest ||
    record.taskSequence !==
      1 ||
    record.executionSequence !==
      8 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_SCENARIO
  ) {
    throw new Error(
      "Advik first synthetic pilot execution source binding is invalid.",
    );
  }

  if (
    Date.parse(record.executedAt) <
    Date.parse(zaraOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Advik first synthetic pilot execution cannot precede Zara owner review approval.",
    );
  }

  if (
    sha256(
      record.syntheticRedTeamEvaluationFixture,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_ADVIK_SYNTHETIC_RED_TEAM_EVALUATION_FIXTURE,
      ) ||
    sha256(
      record.canonicalEvidenceSubstitutionTestPlanDraft,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_ADVIK_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_DRAFT,
      )
  ) {
    throw new Error(
      "Advik first synthetic pilot data-pipeline evidence is invalid.",
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
      "Advik first synthetic pilot task contract is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalZaraOwnerReviewBound !== true ||
    boundary.zaraOwnerReviewIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.canonicalPilotPreparationBound !== true ||
    boundary.candidateDecisionBound !== true ||
    boundary.controlledShadowEvidenceBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.employeeIdentityBound !== true ||
    boundary.runtimeIdentityBound !== true ||
    boundary.approvalBypassAllowed !== false ||
    boundary.exactAdvikFirstTaskExecuted !== true ||
    boundary.syntheticPilotTaskExecutionPerformed !== true ||
    boundary.taskExecutorInvocationCount !== 1 ||
    boundary.pilotDraftCreated !== true ||
    boundary.pilotCompleted !== false ||
    boundary.ownerDecisionMade !== false ||
    boundary.ownerReviewRequired !== true ||
    boundary.ownerReviewRequiredImmediately !== true ||
    boundary.nextCandidateExecutionAuthorized !== false ||
    boundary.remainingOneAuthorizedCandidateWaiting !== false ||
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
      "Advik first synthetic pilot execution boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Advik first synthetic pilot execution next step is invalid.",
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
      "Advik first synthetic pilot execution digest is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.pilotTask) ||
    !Object.isFrozen(record.syntheticRedTeamEvaluationFixture) ||
    !Object.isFrozen(
      record.syntheticRedTeamEvaluationFixture.verifiedFacts,
    ) ||
    !Object.isFrozen(
      record.syntheticRedTeamEvaluationFixture.redTeamEvaluationConstraints,
    ) ||
    !Object.isFrozen(
      record.syntheticRedTeamEvaluationFixture.requiredEvidenceClasses,
    ) ||
    !Object.isFrozen(
      record.canonicalEvidenceSubstitutionTestPlanDraft,
    ) ||
    !Object.isFrozen(
      record.canonicalEvidenceSubstitutionTestPlanDraft.analysisStages,
    ) ||
    record.canonicalEvidenceSubstitutionTestPlanDraft.analysisStages.some(
      (stage) =>
        !Object.isFrozen(stage) ||
        !Object.isFrozen(stage.requiredEvidence),
    ) ||
    !Object.isFrozen(
      record.canonicalEvidenceSubstitutionTestPlanDraft.evidenceGates,
    ) ||
    !Object.isFrozen(
      record.canonicalEvidenceSubstitutionTestPlanDraft.identifiedBlockers,
    ) ||
    !Object.isFrozen(
      record.canonicalEvidenceSubstitutionTestPlanDraft.recommendations,
    ) ||
    !Object.isFrozen(
      record.canonicalEvidenceSubstitutionTestPlanDraft.uncertainties,
    ) ||
    !Object.isFrozen(record.executionBoundary)
  ) {
    throw new Error(
      "Advik first synthetic pilot execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceAdvikFirstSyntheticPilotTask(
  input:
    CreateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecutionInput,
): EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution {
  if (
    input.zaraOwnerReviewDecision !==
      ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
  ) {
    throw new Error(
      "Advik first synthetic pilot execution requires the canonical Zara owner-review decision.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Advik first synthetic pilot execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Advik first synthetic pilot execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(
      input.zaraOwnerReviewDecision.decidedAt,
    )
  ) {
    throw new Error(
      "Advik first synthetic pilot execution cannot precede Zara owner review approval.",
    );
  }

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" as const,

    tenantId:
      zaraOwnerReview.tenantId,

    ownerId:
      zaraOwnerReview.ownerId,

    employeeId:
      "candidate-advik-v1" as const,

    employeeCode:
      "nx-engineering-008" as const,

    publicName:
      "Advik" as const,

    officialRole:
      "AI Systems Evaluation & Red-Team Specialist" as const,

    runtimeId:
      "runtime-engineering-nx-engineering-008-candidate-v1" as const,

    sourceZaraOwnerReviewDecisionId:
      zaraOwnerReview.decisionId,

    sourceZaraOwnerReviewDecisionDigest:
      zaraOwnerReview.decisionDigest,

    sourceZaraExecutionId:
      zaraOwnerReview.sourceExecutionId,

    sourceZaraExecutionDigest:
      zaraOwnerReview.sourceExecutionDigest,

    ownerFirstTaskExecutionDecisionId:
      ownerFirstTaskDecision.decisionId,

    ownerFirstTaskExecutionDecisionDigest:
      ownerFirstTaskDecision.decisionDigest,

    sourcePreparationId:
      ownerFirstTaskDecision.sourcePreparationId,

    sourcePreparationDigest:
      ownerFirstTaskDecision.sourcePreparationDigest,

    candidateDecisionDigest:
      canonicalAdvikCandidate.candidateDecisionDigest,

    sourceControlledShadowExecutionDigest:
      canonicalAdvikShadowExecution.candidateExecutionDigest,

    taskSequence:
      1 as const,

    executionSequence:
      8 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_SCENARIO,

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

    syntheticRedTeamEvaluationFixture:
      ENGINEERING_AI_WORKFORCE_ADVIK_SYNTHETIC_RED_TEAM_EVALUATION_FIXTURE,

    canonicalEvidenceSubstitutionTestPlanDraft:
      ENGINEERING_AI_WORKFORCE_ADVIK_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_DRAFT,

    executionBoundary: {
      canonicalZaraOwnerReviewBound:
        true as const,

      zaraOwnerReviewIntegrityVerified:
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

      exactAdvikFirstTaskExecuted:
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
        false as const,

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
      "AWAIT_OWNER_ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      executionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution;

  validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION =
  executeEngineeringAIWorkforceAdvikFirstSyntheticPilotTask({
    executionId:
      "engineering-advik-first-synthetic-pilot-task-execution-001",

    zaraOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-07-25T15:52:00.000Z",
  });
