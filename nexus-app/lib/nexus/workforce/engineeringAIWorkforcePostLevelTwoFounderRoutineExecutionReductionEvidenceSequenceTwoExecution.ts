import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-two-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;
  readonly executedAt: string;
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIGEST = /^[0-9a-f]{64}$/;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
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
  if (value.trim() !== value || !ID.test(value)) {
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

const decision =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION;
const sequenceOneOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
    decision,
  );
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
    sequenceOneOwnerReview,
  );

  const second = decision.candidateDecisions[1];

  if (
    !second ||
    sequenceOneOwnerReview.approved !== true ||
    sequenceOneOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO" ||
    sequenceOneOwnerReview.authorityBoundary.nextEvidenceExecutionAuthorized !==
      true ||
    sequenceOneOwnerReview.authorityBoundary.actualRoutineTaskExecutionAuthorized !==
      false ||
    sequenceOneOwnerReview.authorityBoundary.founderLiberationAchieved !== false ||
    second.sequence !== 2 ||
    second.controlId !== "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY" ||
    second.evidenceExecutionAuthorized !== true ||
    second.evidenceExecutionPerformed !== false ||
    second.currentlyExecutable !== false ||
    second.waitingForPriorEvidenceOwnerReview !== true
  ) {
    throw new Error(
      "Canonical founder routine execution reduction sequence-two prerequisites are invalid.",
    );
  }
}

const authorityMatrix = deepFreeze([
  {
    authorityId: "FINAL_OWNER_APPROVAL",
    category: "OWNER_RESERVED_DECISION",
    autonomousAIExecutionAllowed: false,
    explicitOwnerReviewRequired: true,
    failClosed: true,
  },
  {
    authorityId: "OWNER_CREDENTIAL_ACCESS_AND_ISSUANCE",
    category: "OWNER_RESERVED_CREDENTIAL",
    autonomousAIExecutionAllowed: false,
    explicitOwnerReviewRequired: true,
    failClosed: true,
  },
  {
    authorityId: "FINANCIAL_COMMITMENT_OR_PAYMENT",
    category: "OWNER_RESERVED_FINANCIAL_COMMITMENT",
    autonomousAIExecutionAllowed: false,
    explicitOwnerReviewRequired: true,
    failClosed: true,
  },
  {
    authorityId: "LEGAL_COMMITMENT_OR_SIGNATURE",
    category: "OWNER_RESERVED_LEGAL_COMMITMENT",
    autonomousAIExecutionAllowed: false,
    explicitOwnerReviewRequired: true,
    failClosed: true,
  },
  {
    authorityId: "PRODUCTION_DEPLOYMENT_OR_ACTIVATION",
    category: "OWNER_RESERVED_PRODUCTION_ACTION",
    autonomousAIExecutionAllowed: false,
    explicitOwnerReviewRequired: true,
    failClosed: true,
  },
  {
    authorityId: "CUSTOMER_CONTACT_OR_EXTERNAL_DELIVERY",
    category: "OWNER_RESERVED_CUSTOMER_ACTION",
    autonomousAIExecutionAllowed: false,
    explicitOwnerReviewRequired: true,
    failClosed: true,
  },
  {
    authorityId: "PUBLIC_LAUNCH_OR_MARKET_RELEASE",
    category: "OWNER_RESERVED_PUBLIC_ACTION",
    autonomousAIExecutionAllowed: false,
    explicitOwnerReviewRequired: true,
    failClosed: true,
  },
  {
    authorityId: "EMERGENCY_PAUSE_ROLLBACK_OR_OVERRIDE",
    category: "OWNER_RESERVED_EMERGENCY_CONTROL",
    autonomousAIExecutionAllowed: false,
    explicitOwnerReviewRequired: true,
    failClosed: true,
  },
] as const);

function buildExecution(executionId: string, executedAt: string) {
  const second = decision.candidateDecisions[1];
  if (!second) throw new Error("Sequence-two decision candidate is missing.");

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) => ({
      sequence: candidate.sequence,
      controlId: candidate.controlId,
      executionState:
        index < 2
          ? ("EXECUTED_OR_OWNER_REVIEWED" as const)
          : ("BLOCKED_PENDING_PRIOR_OWNER_REVIEW" as const),
      evidenceExecutionPerformed: index < 2,
      nextSequenceExecutionAuthorized: false as const,
    })),
  );

  const evidenceCore = {
    evidenceType:
      "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY_EVIDENCE" as const,
    evidenceMode:
      "SYNTHETIC_DETERMINISTIC_AUTHORITY_BOUNDARY_MATRIX" as const,
    authorityCaseCount: 8 as const,
    autonomouslyExecutableAuthorityCount: 0 as const,
    explicitOwnerReviewRequiredCount: 8 as const,
    failClosedAuthorityCount: 8 as const,
    unauthorizedDelegationCount: 0 as const,
    actualAuthorityTransferred: false as const,
    actualCredentialAccessPerformed: false as const,
    actualFinancialCommitmentPerformed: false as const,
    actualLegalCommitmentPerformed: false as const,
    actualProductionActionPerformed: false as const,
    actualCustomerContactPerformed: false as const,
    actualPublicLaunchPerformed: false as const,
    actualEmergencyControlTransferred: false as const,
    ownerFinalAuthorityPreserved: true as const,
    deterministicBoundaryVerified: true as const,
    independentValidationRequired: true as const,
    ownerReviewRequired: true as const,
    monitoringRequired: true as const,
    emergencyPauseAvailable: true as const,
    rollbackEvidenceRequired: true as const,
    authorityMatrix,
    sequenceLedger,
  };

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId: sequenceOneOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest: sequenceOneOwnerReview.decisionDigest,
    sourceExecutionDecisionId: decision.decisionId,
    sourceExecutionDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest: second.candidateDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 2 as const,
    controlId: "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY" as const,
    evidenceClass: "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" as const,
    executionMode:
      "SYNTHETIC_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_ONLY" as const,
    evidenceToolMode: "READ_ONLY_EVIDENCE_ONLY" as const,
    syntheticSanitizedEvidenceOnly: true as const,
    evidenceExecutionAuthorized: true as const,
    evidenceExecutionPerformed: true as const,
    evidenceCreated: true as const,
    evidence: deepFreeze({
      ...evidenceCore,
      evidenceDigest: sha256(evidenceCore),
    }),
    authorityBoundary: {
      canonicalSequenceOneOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceTwoOnly: true as const,
      exactlyTwoEvidenceItemsExecutedInWorkstream: true as const,
      remainingSixEvidenceItemsBlocked: true as const,
      oneAtATimeEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceThreeEvidenceExecutionAuthorized: false as const,
      nextEvidenceExecutionAuthorized: false as const,
      actualRoutineTaskExecutionAuthorized: false as const,
      founderRoutineExecutionReductionExecutionAuthorized: false as const,
      founderRoutineExecutionReductionClaimAuthorized: false as const,
      founderRoutineExecutionReductionClaimed: false as const,
      ownerCredentialAccessAuthorized: false as const,
      financialCommitmentAuthorized: false as const,
      legalCommitmentAuthorized: false as const,
      customerContactAuthorized: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
      productionDeploymentAuthorized: false as const,
      paymentExecutionAuthorized: false as const,
      publicLaunchAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      founderLiberationAssessmentAuthorized: false as const,
      founderLiberationAchieved: false as const,
      founderReleasedFromRoutineExecution: false as const,
      monitoringRequired: true as const,
      emergencyPauseAvailable: true as const,
      rollbackEvidenceRequired: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest: sha256(core),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution,
): void {
  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-two execution ID", record.executionId);
  requireTimestamp("Sequence-two execution time", record.executedAt);

  const expected = buildExecution(record.executionId, record.executedAt);
  const boundary = record.authorityBoundary;

  if (
    !DIGEST.test(record.executionDigest) ||
    !DIGEST.test(record.evidence.evidenceDigest) ||
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.workstreamSequence !== 4 ||
    record.evidenceSequence !== 2 ||
    record.controlId !== "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY" ||
    record.evidence.authorityCaseCount !== 8 ||
    record.evidence.autonomouslyExecutableAuthorityCount !== 0 ||
    record.evidence.explicitOwnerReviewRequiredCount !== 8 ||
    record.evidence.failClosedAuthorityCount !== 8 ||
    record.evidence.unauthorizedDelegationCount !== 0 ||
    record.evidence.actualAuthorityTransferred !== false ||
    boundary.sequenceThreeEvidenceExecutionAuthorized !== false ||
    boundary.nextEvidenceExecutionAuthorized !== false ||
    boundary.actualRoutineTaskExecutionAuthorized !== false ||
    boundary.ownerCredentialAccessAuthorized !== false ||
    boundary.financialCommitmentAuthorized !== false ||
    boundary.legalCommitmentAuthorized !== false ||
    boundary.customerContactAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.authorityMatrix) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(boundary)
  ) {
    throw new Error(
      "Founder routine execution reduction sequence-two execution is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution {
  if (input.sourceOwnerReview !== sequenceOneOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-one owner review can authorize sequence two.",
    );
  }

  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-two execution ID", input.executionId);
  requireTimestamp("Sequence-two execution time", input.executedAt);

  if (Date.parse(input.executedAt) < Date.parse(sequenceOneOwnerReview.decidedAt)) {
    throw new Error(
      "Sequence-two execution cannot precede sequence-one owner review.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution(
    record,
  );
  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-two-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-04T08:39:00.000Z",
  });