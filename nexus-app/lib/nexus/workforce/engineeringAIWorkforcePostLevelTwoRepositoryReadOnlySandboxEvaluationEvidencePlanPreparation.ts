import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-plan-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE_PROFILES =
  [
    {
      controlId: "REPOSITORY_READ_SCOPE_ALLOWLIST",
      objective:
        "Define an explicit repository path and file-type allowlist before any bounded read-only sandbox evaluation can be considered.",
      expectedEvidence:
        "A synthetic allowlist plan proving that only owner-approved repository roots, directories, file extensions, and bounded source ranges can become eligible for later evaluation.",
    },
    {
      controlId: "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION",
      objective:
        "Define deterministic path containment rules that reject traversal, absolute-path escape, drive-relative paths, network shares, symbolic-link escape, and repository-root bypass.",
      expectedEvidence:
        "A synthetic path matrix demonstrating accepted contained paths and fail-closed rejection of every escape or ambiguity class.",
    },
    {
      controlId: "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING",
      objective:
        "Define repository-read evaluation context binding to the exact tenant, owner, approved workstream, session, and evidence request.",
      expectedEvidence:
        "A synthetic context-binding plan proving cross-tenant, stale-session, missing-owner, mismatched-workstream, and copied-authorization rejection.",
    },
    {
      controlId: "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION",
      objective:
        "Define mandatory exclusion of secrets, credentials, private keys, environment values, customer data, production configuration, and other sensitive repository content.",
      expectedEvidence:
        "A synthetic sensitive-content classification plan with filename, path, extension, marker, entropy, and redaction gates that fail closed before any content is exposed.",
    },
    {
      controlId: "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT",
      objective:
        "Define technical boundaries proving that future sandbox evaluation cannot write, edit, delete, rename, stage, commit, push, execute, deploy, or mutate repository state.",
      expectedEvidence:
        "A synthetic negative-authority plan covering filesystem mutation, Git mutation, package execution, scripts, shell commands, network calls, and production actions.",
    },
    {
      controlId: "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS",
      objective:
        "Define strict limits for file count, byte count, line range, query count, recursion depth, execution duration, output size, and evidence retention.",
      expectedEvidence:
        "A deterministic resource-bound plan proving oversized, recursive, unbounded, repeated, or abusive read requests are blocked and escalated.",
    },
    {
      controlId: "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION",
      objective:
        "Define immutable audit evidence and digest binding for every future approved repository-read request, result, denial, pause, and owner decision.",
      expectedEvidence:
        "A synthetic audit-chain plan covering request identity, approved scope, file digests, result digests, denial reasons, ordering proof, tamper probes, and replay detection.",
    },
    {
      controlId: "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW",
      objective:
        "Define emergency pause, fail-closed escalation, independent validation, and final owner-review requirements for all future repository read-only sandbox evidence.",
      expectedEvidence:
        "A synthetic pause-and-review plan proving threshold breaches, suspicious content, context mismatch, audit failure, or unauthorized authority requests stop progression and return control to the owner.",
    },
  ] as const;

export type EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationSafetyEvidenceProfile =
  (typeof ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE_PROFILES)[number];

export interface EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationSafetyEvidenceItem {
  readonly sequence: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  readonly evidenceState:
    "ENGINEERING_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE_ITEM_PREPARED";
  readonly controlId:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationSafetyEvidenceProfile["controlId"];
  readonly objective: string;
  readonly expectedEvidence: string;
  readonly dataClassification: "SYNTHETIC_SANITIZED_ONLY";
  readonly outputMode: "PLAN_ONLY";
  readonly evidenceToolMode: "READ_ONLY_EVIDENCE_ONLY";
  readonly deterministicEvidenceRequired: true;
  readonly independentValidationRequired: true;
  readonly ownerReviewRequired: true;
  readonly monitoringRequired: true;
  readonly emergencyPauseRequired: true;
  readonly rollbackEvidenceRequired: true;
  readonly tenantBindingRequired: true;
  readonly ownerBindingRequired: true;
  readonly pathContainmentRequired: true;
  readonly secretExclusionRequired: true;
  readonly immutableAuditRequired: true;
  readonly planPreparationAuthorized: true;
  readonly evidenceExecutionAuthorized: false;
  readonly repositoryEvaluationAuthorized: false;
  readonly repositoryReadAuthorized: false;
  readonly repositoryWriteAuthorized: false;
  readonly filesystemMutationAuthorized: false;
  readonly gitMutationAuthorized: false;
  readonly commandExecutionAuthorized: false;
  readonly packageExecutionAuthorized: false;
  readonly networkAccessAuthorized: false;
  readonly branchCreationAuthorized: false;
  readonly pullRequestPreparationAuthorized: false;
  readonly mergeAuthorized: false;
  readonly secretsAccessAuthorized: false;
  readonly realCustomerDataAccessAuthorized: false;
  readonly realCustomerContactAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly liveProviderExecutionAuthorized: false;
  readonly productionDatabaseAuthorized: false;
  readonly productionMutationAuthorized: false;
  readonly productionDeploymentAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly publicLaunchAuthorized: false;
  readonly evidenceItemDigest: string;
}

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparationInput {
  readonly preparationId: string;
  readonly sourcePriorWorkstreamClosureDecision:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION;
  readonly preparedAt: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, normalize(record[key])]),
    );
  }

  return value;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(normalize(value)), "utf8")
    .digest("hex");
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }

  return value;
}

function requireIdentifier(label: string, value: string): void {
  if (value.trim() !== value || !IDENTIFIER_PATTERN.test(value)) {
    throw new Error(`${label} is invalid.`);
  }
}

function requireTimestamp(label: string, value: string): void {
  if (
    value.trim() !== value ||
    !value.endsWith("Z") ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(`${label} is invalid.`);
  }
}

const priorWorkstreamClosure =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision(
    priorWorkstreamClosure,
  );

  if (
    priorWorkstreamClosure.decision !==
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE" ||
    priorWorkstreamClosure.closurePreparationAccepted !== true ||
    priorWorkstreamClosure.formalClosureDecisionRecorded !== true ||
    priorWorkstreamClosure.workstreamClosureAuthorized !== true ||
    priorWorkstreamClosure.workstreamClosurePerformed !== true ||
    priorWorkstreamClosure.workstreamClosed !== true ||
    priorWorkstreamClosure.workstreamSequence !== 2 ||
    priorWorkstreamClosure.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    priorWorkstreamClosure.reviewedClosureEvidence
      .requiredEvidenceSequenceCount !== 8 ||
    priorWorkstreamClosure.reviewedClosureEvidence
      .completedEvidenceSequenceCount !== 8 ||
    priorWorkstreamClosure.reviewedClosureEvidence
      .acceptedOwnerReviewCount !== 8 ||
    priorWorkstreamClosure.reviewedClosureEvidence
      .remainingEvidenceSequenceCount !== 0 ||
    priorWorkstreamClosure.reviewedClosureEvidence.auditGapCount !== 0 ||
    priorWorkstreamClosure.reviewedClosureEvidence
      .authorityBoundaryFailureCount !== 0 ||
    priorWorkstreamClosure.reviewedClosureEvidence
      .unauthorizedProgressionCount !== 0 ||
    priorWorkstreamClosure.reviewedClosureEvidence
      .evidenceIntegrityVerified !== true ||
    priorWorkstreamClosure.reviewedClosureEvidence
      .auditContinuityVerified !== true ||
    priorWorkstreamClosure.reviewedClosureEvidence
      .consequentialAuthorityBoundariesVerified !== true ||
    priorWorkstreamClosure.authorityBoundary.workstreamTwoClosed !== true ||
    priorWorkstreamClosure.authorityBoundary
      .workstreamThreePlanPreparationAuthorized !== true ||
    priorWorkstreamClosure.authorityBoundary
      .workstreamThreePlanPreparationPerformed !== false ||
    priorWorkstreamClosure.authorityBoundary
      .workstreamThreeEvidenceExecutionAuthorized !== false ||
    priorWorkstreamClosure.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    priorWorkstreamClosure.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    priorWorkstreamClosure.authorityBoundary
      .nextWorkstreamAutonomousStartAuthorized !== false ||
    priorWorkstreamClosure.authorityBoundary
      .concurrentEngineeringWorkAuthorized !== false ||
    priorWorkstreamClosure.authorityBoundary.repositoryReadAuthorized !==
      false ||
    priorWorkstreamClosure.authorityBoundary.repositoryWriteAuthorized !==
      false ||
    priorWorkstreamClosure.authorityBoundary.productionDeploymentAuthorized !==
      false ||
    priorWorkstreamClosure.authorityBoundary.publicLaunchAuthorized !== false ||
    priorWorkstreamClosure.authorityBoundary.founderLiberationAchieved !==
      false ||
    priorWorkstreamClosure.nextStep !==
      "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox evidence-plan prerequisites are invalid.",
    );
  }
}

function createEvidenceItems(): readonly EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationSafetyEvidenceItem[] {
  return ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE_PROFILES.map(
    (profile, index) => {
      const itemCore = {
        sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        evidenceState:
          "ENGINEERING_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE_ITEM_PREPARED" as const,
        controlId: profile.controlId,
        objective: profile.objective,
        expectedEvidence: profile.expectedEvidence,
        dataClassification: "SYNTHETIC_SANITIZED_ONLY" as const,
        outputMode: "PLAN_ONLY" as const,
        evidenceToolMode: "READ_ONLY_EVIDENCE_ONLY" as const,
        deterministicEvidenceRequired: true as const,
        independentValidationRequired: true as const,
        ownerReviewRequired: true as const,
        monitoringRequired: true as const,
        emergencyPauseRequired: true as const,
        rollbackEvidenceRequired: true as const,
        tenantBindingRequired: true as const,
        ownerBindingRequired: true as const,
        pathContainmentRequired: true as const,
        secretExclusionRequired: true as const,
        immutableAuditRequired: true as const,
        planPreparationAuthorized: true as const,
        evidenceExecutionAuthorized: false as const,
        repositoryEvaluationAuthorized: false as const,
        repositoryReadAuthorized: false as const,
        repositoryWriteAuthorized: false as const,
        filesystemMutationAuthorized: false as const,
        gitMutationAuthorized: false as const,
        commandExecutionAuthorized: false as const,
        packageExecutionAuthorized: false as const,
        networkAccessAuthorized: false as const,
        branchCreationAuthorized: false as const,
        pullRequestPreparationAuthorized: false as const,
        mergeAuthorized: false as const,
        secretsAccessAuthorized: false as const,
        realCustomerDataAccessAuthorized: false as const,
        realCustomerContactAuthorized: false as const,
        externalDeliveryAuthorized: false as const,
        liveProviderExecutionAuthorized: false as const,
        productionDatabaseAuthorized: false as const,
        productionMutationAuthorized: false as const,
        productionDeploymentAuthorized: false as const,
        paymentExecutionAuthorized: false as const,
        publicLaunchAuthorized: false as const,
      };

      return deepFreeze({
        ...itemCore,
        evidenceItemDigest: sha256(itemCore),
      });
    },
  );
}

function buildPreparation(preparationId: string, preparedAt: string) {
  const evidenceItems = deepFreeze(createEvidenceItems());

  const summary = deepFreeze({
    evidenceItemCount: 8 as const,
    syntheticSanitizedEvidenceItemCount: 8 as const,
    planOnlyEvidenceItemCount: 8 as const,
    deterministicEvidenceRequiredCount: 8 as const,
    independentValidationRequiredCount: 8 as const,
    ownerReviewRequiredCount: 8 as const,
    monitoringRequiredCount: 8 as const,
    emergencyPauseRequiredCount: 8 as const,
    rollbackEvidenceRequiredCount: 8 as const,
    tenantBindingRequiredCount: 8 as const,
    ownerBindingRequiredCount: 8 as const,
    pathContainmentRequiredCount: 8 as const,
    secretExclusionRequiredCount: 8 as const,
    immutableAuditRequiredCount: 8 as const,
    planPreparationAuthorizedCount: 8 as const,
    evidenceExecutionAuthorizedCount: 0 as const,
    repositoryEvaluationAuthorizedCount: 0 as const,
    repositoryReadAuthorizedCount: 0 as const,
    repositoryWriteAuthorizedCount: 0 as const,
    filesystemMutationAuthorizedCount: 0 as const,
    gitMutationAuthorizedCount: 0 as const,
    commandExecutionAuthorizedCount: 0 as const,
    packageExecutionAuthorizedCount: 0 as const,
    networkAccessAuthorizedCount: 0 as const,
    productionDeploymentAuthorizedCount: 0 as const,
    paymentExecutionAuthorizedCount: 0 as const,
    publicLaunchAuthorizedCount: 0 as const,
  });

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION_VERSION,
    preparationId,
    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARED" as const,
    tenantId: priorWorkstreamClosure.tenantId,
    ownerId: priorWorkstreamClosure.ownerId,
    sourcePriorWorkstreamClosureDecisionId:
      priorWorkstreamClosure.decisionId,
    sourcePriorWorkstreamClosureDecisionDigest:
      priorWorkstreamClosure.decisionDigest,
    sourcePriorWorkstreamSequence:
      priorWorkstreamClosure.workstreamSequence,
    sourcePriorWorkstreamId:
      priorWorkstreamClosure.workstreamId,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceClass:
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" as const,
    planOnly: true as const,
    evidenceItemCount: 8 as const,
    evidenceItems,
    summary,
    ownerEvidencePlanReviewRequired: true as const,
    ownerEvidencePlanReviewRecorded: false as const,
    authorityBoundary: {
      evidencePlanningOnly: true as const,
      canonicalPriorWorkstreamClosureBound: true as const,
      priorWorkstreamClosed: true as const,
      exactEightEvidenceItemsRequired: true as const,
      workstreamThreePlanPreparationAuthorized: true as const,
      workstreamThreePlanPreparationPerformed: true as const,
      workstreamThreeEvidenceExecutionAuthorized: false as const,
      repositoryReadOnlySandboxEvaluationPlanningAuthorized: true as const,
      repositoryReadOnlySandboxEvaluationPlanPrepared: true as const,
      repositoryReadOnlySandboxEvaluationAuthorized: false as const,
      repositoryReadOnlySandboxExecutionAuthorized: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      gitMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
      branchCreationAuthorized: false as const,
      pullRequestPreparationAuthorized: false as const,
      mergeAuthorized: false as const,
      secretsAccessAuthorized: false as const,
      realCustomerDataAccessAuthorized: false as const,
      realCustomerContactAuthorized: false as const,
      externalDeliveryAuthorized: false as const,
      liveProviderExecutionAuthorized: false as const,
      productionDatabaseAuthorized: false as const,
      productionMutationAuthorized: false as const,
      productionDeploymentAuthorized: false as const,
      paymentExecutionAuthorized: false as const,
      financialCommitmentAuthorized: false as const,
      legalCommitmentAuthorized: false as const,
      autonomousDecisionAuthorized: false as const,
      concurrentEngineeringWorkAuthorized: false as const,
      aggregateConcurrentEngineeringWorkLimit: 0 as const,
      levelThreeEvaluationAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      productionReadinessAuthorized: false as const,
      publicLaunchAuthorized: false as const,
      founderLiberationAchieved: false as const,
      founderReleasedFromRoutineExecution: false as const,
      monitoringRequired: true as const,
      emergencyPauseRequired: true as const,
      rollbackEvidenceRequired: true as const,
      ownerReviewRequired: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW" as const,
    preparedAt,
  };

  return deepFreeze({
    ...preparationCore,
    preparationDigest: sha256(preparationCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation =
  ReturnType<typeof buildPreparation>;

function validateEvidenceItem(
  item:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationSafetyEvidenceItem,
  index: number,
): void {
  const profile =
    ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE_PROFILES[
      index
    ];

  if (!profile) {
    throw new Error(
      "Repository read-only sandbox evidence profile is missing.",
    );
  }

  const { evidenceItemDigest, ...itemCore } = item;

  if (
    !SHA256_PATTERN.test(evidenceItemDigest) ||
    sha256(itemCore) !== evidenceItemDigest ||
    item.sequence !== index + 1 ||
    item.evidenceState !==
      "ENGINEERING_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE_ITEM_PREPARED" ||
    item.controlId !== profile.controlId ||
    item.objective !== profile.objective ||
    item.expectedEvidence !== profile.expectedEvidence ||
    item.dataClassification !== "SYNTHETIC_SANITIZED_ONLY" ||
    item.outputMode !== "PLAN_ONLY" ||
    item.evidenceToolMode !== "READ_ONLY_EVIDENCE_ONLY" ||
    item.deterministicEvidenceRequired !== true ||
    item.independentValidationRequired !== true ||
    item.ownerReviewRequired !== true ||
    item.monitoringRequired !== true ||
    item.emergencyPauseRequired !== true ||
    item.rollbackEvidenceRequired !== true ||
    item.tenantBindingRequired !== true ||
    item.ownerBindingRequired !== true ||
    item.pathContainmentRequired !== true ||
    item.secretExclusionRequired !== true ||
    item.immutableAuditRequired !== true ||
    item.planPreparationAuthorized !== true ||
    item.evidenceExecutionAuthorized !== false ||
    item.repositoryEvaluationAuthorized !== false ||
    item.repositoryReadAuthorized !== false ||
    item.repositoryWriteAuthorized !== false ||
    item.filesystemMutationAuthorized !== false ||
    item.gitMutationAuthorized !== false ||
    item.commandExecutionAuthorized !== false ||
    item.packageExecutionAuthorized !== false ||
    item.networkAccessAuthorized !== false ||
    item.branchCreationAuthorized !== false ||
    item.pullRequestPreparationAuthorized !== false ||
    item.mergeAuthorized !== false ||
    item.secretsAccessAuthorized !== false ||
    item.realCustomerDataAccessAuthorized !== false ||
    item.realCustomerContactAuthorized !== false ||
    item.externalDeliveryAuthorized !== false ||
    item.liveProviderExecutionAuthorized !== false ||
    item.productionDatabaseAuthorized !== false ||
    item.productionMutationAuthorized !== false ||
    item.productionDeploymentAuthorized !== false ||
    item.paymentExecutionAuthorized !== false ||
    item.publicLaunchAuthorized !== false ||
    !Object.isFrozen(item)
  ) {
    throw new Error(
      `Repository read-only sandbox evidence item ${index + 1} is invalid.`,
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox evidence-plan preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Repository read-only sandbox evidence-plan preparation time",
    record.preparedAt,
  );

  const { preparationDigest, ...preparationCore } = record;

  if (
    !SHA256_PATTERN.test(preparationDigest) ||
    sha256(preparationCore) !== preparationDigest
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan preparation integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARED" ||
    record.tenantId !== priorWorkstreamClosure.tenantId ||
    record.ownerId !== priorWorkstreamClosure.ownerId ||
    record.sourcePriorWorkstreamClosureDecisionId !==
      priorWorkstreamClosure.decisionId ||
    record.sourcePriorWorkstreamClosureDecisionDigest !==
      priorWorkstreamClosure.decisionDigest ||
    record.sourcePriorWorkstreamSequence !== 2 ||
    record.sourcePriorWorkstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceClass !==
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" ||
    record.planOnly !== true ||
    record.evidenceItemCount !== 8 ||
    record.evidenceItems.length !== 8 ||
    record.ownerEvidencePlanReviewRequired !== true ||
    record.ownerEvidencePlanReviewRecorded !== false ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW" ||
    Date.parse(record.preparedAt) <
      Date.parse(priorWorkstreamClosure.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan preparation identity is invalid.",
    );
  }

  record.evidenceItems.forEach(validateEvidenceItem);

  if (
    new Set(record.evidenceItems.map((item) => item.controlId)).size !== 8
  ) {
    throw new Error(
      "Repository read-only sandbox evidence controls are not unique.",
    );
  }

  const summary = record.summary;

  if (
    summary.evidenceItemCount !== 8 ||
    summary.syntheticSanitizedEvidenceItemCount !== 8 ||
    summary.planOnlyEvidenceItemCount !== 8 ||
    summary.deterministicEvidenceRequiredCount !== 8 ||
    summary.independentValidationRequiredCount !== 8 ||
    summary.ownerReviewRequiredCount !== 8 ||
    summary.monitoringRequiredCount !== 8 ||
    summary.emergencyPauseRequiredCount !== 8 ||
    summary.rollbackEvidenceRequiredCount !== 8 ||
    summary.tenantBindingRequiredCount !== 8 ||
    summary.ownerBindingRequiredCount !== 8 ||
    summary.pathContainmentRequiredCount !== 8 ||
    summary.secretExclusionRequiredCount !== 8 ||
    summary.immutableAuditRequiredCount !== 8 ||
    summary.planPreparationAuthorizedCount !== 8 ||
    summary.evidenceExecutionAuthorizedCount !== 0 ||
    summary.repositoryEvaluationAuthorizedCount !== 0 ||
    summary.repositoryReadAuthorizedCount !== 0 ||
    summary.repositoryWriteAuthorizedCount !== 0 ||
    summary.filesystemMutationAuthorizedCount !== 0 ||
    summary.gitMutationAuthorizedCount !== 0 ||
    summary.commandExecutionAuthorizedCount !== 0 ||
    summary.packageExecutionAuthorizedCount !== 0 ||
    summary.networkAccessAuthorizedCount !== 0 ||
    summary.productionDeploymentAuthorizedCount !== 0 ||
    summary.paymentExecutionAuthorizedCount !== 0 ||
    summary.publicLaunchAuthorizedCount !== 0
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan summary is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.evidencePlanningOnly,
    boundary.canonicalPriorWorkstreamClosureBound,
    boundary.priorWorkstreamClosed,
    boundary.exactEightEvidenceItemsRequired,
    boundary.workstreamThreePlanPreparationAuthorized,
    boundary.workstreamThreePlanPreparationPerformed,
    boundary.repositoryReadOnlySandboxEvaluationPlanningAuthorized,
    boundary.repositoryReadOnlySandboxEvaluationPlanPrepared,
    boundary.monitoringRequired,
    boundary.emergencyPauseRequired,
    boundary.rollbackEvidenceRequired,
    boundary.ownerReviewRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.workstreamThreeEvidenceExecutionAuthorized,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.repositoryReadOnlySandboxExecutionAuthorized,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.filesystemMutationAuthorized,
    boundary.gitMutationAuthorized,
    boundary.commandExecutionAuthorized,
    boundary.packageExecutionAuthorized,
    boundary.networkAccessAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.secretsAccessAuthorized,
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
    boundary.concurrentEngineeringWorkAuthorized,
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  if (
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidenceItems) ||
    !Object.isFrozen(record.summary) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparationInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation {
  if (
    input.sourcePriorWorkstreamClosureDecision !==
    priorWorkstreamClosure
  ) {
    throw new Error(
      "Only the canonical closed concurrent-coordination workstream can authorize repository read-only sandbox evidence-plan preparation.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox evidence-plan preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Repository read-only sandbox evidence-plan preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(priorWorkstreamClosure.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan preparation cannot precede workstream-two closure.",
    );
  }

  const record = buildPreparation(
    input.preparationId,
    input.preparedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-plan-preparation-001",
    sourcePriorWorkstreamClosureDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION,
    preparedAt: "2026-08-02T18:30:00.000Z",
  });