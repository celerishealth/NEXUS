import { createHash } from "node:crypto";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-sequence-five-approved-checkpoint-v1" as const;

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

const checkpointCore = {
  "sourceRepositoryHead": "15e3a0f",
  "sourceWorkstreamSequence": 2,
  "sourceWorkstreamId": "controlled-concurrent-coordination-evidence",
  "ownerReview": {
    "version": "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-five-execution-owner-review-decision-v1",
    "decisionId": "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-five-owner-review-decision-001",
    "decisionState": "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW_RECORDED",
    "tenantId": "tenant-nexus-internal-001",
    "ownerId": "owner-prashant-001",
    "sourceExecutionId": "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-five-execution-001",
    "sourceExecutionDigest": "2499e187da83923d09a33e7575be6f2d30ca618abb9ef55a1cdb65ab936feb7e",
    "sourceExecutionDecisionId": "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-execution-decision-001",
    "sourceExecutionDecisionDigest": "56710b3ab1ceb8782cc954ff1bdb75bfd35a1bf398fd4170cd1284a7a7f9ce75",
    "sourceCandidateDecisionDigest": "f25ef829996ca72ecdb095d7b061b63b6d5aa13cd15e001e738fc1b9477ba374",
    "sourceSequenceFourOwnerReviewDecisionId": "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-four-owner-review-decision-001",
    "sourceSequenceFourOwnerReviewDecisionDigest": "6a999942d4c40c5df77c753544ec70b696459b41aa9fa706ac362f219cd3a90c",
    "workstreamSequence": 2,
    "workstreamId": "controlled-concurrent-coordination-evidence",
    "evidenceSequence": 5,
    "controlId": "ROLLBACK_COORDINATION_PROTOCOL",
    "decision": "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION",
    "reason": "Owner reviewed and approved the rollback-coordination evidence, confirmed three valid deterministic rollbacks, one blocked invalid target, zero retained partial state, and authorized only bounded synthetic monitoring and health-gates evidence sequence six while all consequential authority remains blocked.",
    "executionAccepted": true,
    "evidenceAccepted": true,
    "sequenceFiveOwnerReviewRecorded": true,
    "sequenceFiveClosed": true,
    "reviewedExecution": {
      "executionState": "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTED_AWAITING_OWNER_REVIEW",
      "executionMode": "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
      "evidenceToolMode": "READ_ONLY_EVIDENCE_ONLY",
      "syntheticSanitizedEvidenceOnly": true,
      "evidenceExecutionAuthorized": true,
      "evidenceExecutionPerformed": true,
      "evidenceCreated": true,
      "evidenceType": "ROLLBACK_COORDINATION_PROTOCOL_EXECUTION_EVIDENCE",
      "evaluatedRollbackCaseCount": 4,
      "validRollbackCaseCount": 3,
      "completedRollbackCaseCount": 3,
      "invalidRollbackTargetBlockedCount": 1,
      "partialStateRetainedCount": 0,
      "unauthorizedForwardExecutionAllowedCount": 0,
      "rollbackCheckpointBindingRequired": true,
      "deterministicRollbackVerified": true,
      "validRollbackTargetsVerified": true,
      "invalidRollbackTargetBlocked": true,
      "partialStateRemovalVerified": true,
      "forwardExecutionBlockedAfterFailure": true,
      "tenantBoundaryRollbackVerified": true,
      "ownershipConflictRollbackVerified": true,
      "ownerEscalationPreserved": true,
      "failClosedOnRollbackFailure": true,
      "monitoringStatus": "PASS",
      "independentValidationStatus": "PASS",
      "emergencyPauseAvailable": true,
      "evidenceDigest": "f98684f96b7598b1d969a5eab1093a93840756d98ebb9d4880c59bf3ca98d5e6"
    },
    "authorityBoundary": {
      "canonicalExecutionBound": true,
      "sourceExecutionIntegrityVerified": true,
      "ownerIdentityBound": true,
      "tenantIdentityBound": true,
      "ownerReviewRecorded": true,
      "approvalBypassAllowed": false,
      "sequenceFiveExecutionAccepted": true,
      "sequenceFiveEvidenceAccepted": true,
      "sequenceFiveClosed": true,
      "sequenceSixEvidenceExecutionAuthorized": true,
      "sequenceSixEvidenceExecutionPerformed": false,
      "onlySequenceSixAuthorizedNext": true,
      "rollbackEvidenceAccepted": true,
      "forwardExecutionAfterFailureAuthorized": false,
      "resumeAuthorizationGranted": false,
      "concurrentEngineeringWorkAuthorized": false,
      "aggregateConcurrentEngineeringWorkLimit": 0,
      "repositoryReadAuthorized": false,
      "repositoryWriteAuthorized": false,
      "branchCreationAuthorized": false,
      "pullRequestPreparationAuthorized": false,
      "mergeAuthorized": false,
      "secretsAccessAuthorized": false,
      "realCustomerDataAccessAuthorized": false,
      "realCustomerContactAuthorized": false,
      "externalDeliveryAuthorized": false,
      "liveProviderExecutionAuthorized": false,
      "productionDatabaseAuthorized": false,
      "productionMutationAuthorized": false,
      "productionDeploymentAuthorized": false,
      "paymentExecutionAuthorized": false,
      "financialCommitmentAuthorized": false,
      "legalCommitmentAuthorized": false,
      "autonomousDecisionAuthorized": false,
      "levelThreeEvaluationAuthorized": false,
      "levelThreeAuthorityGranted": false,
      "productionReadinessAuthorized": false,
      "publicLaunchAuthorized": false,
      "founderLiberationAchieved": false,
      "founderReleasedFromRoutineExecution": false,
      "monitoringRequired": true,
      "emergencyPauseAvailable": true,
      "ownerFinalAuthorityPreserved": true
    },
    "nextStep": "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX",
    "decidedAt": "2026-08-02T17:00:00.000Z",
    "decisionDigest": "c785e561b179c645f5cc3fe2def0ed12dacf75e9b20aa0d2e680b02b05a51279"
  },
  "candidateSix": {
    "sequence": 6,
    "decisionState": "OWNER_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_RECORDED",
    "controlId": "MONITORING_AND_HEALTH_GATES",
    "sourceDecisionPreparationDigest": "c9194e37379a38355063dda857a8d5ffc29e1aa66f8bd0e37469994f50505767",
    "decision": "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
    "evidenceExecutionAuthorized": true,
    "evidenceExecutionPerformed": false,
    "currentlyExecutable": false,
    "waitingForPriorEvidenceOwnerReview": true,
    "retainedAtPreparationOnly": false,
    "reason": "Owner approved the bounded monitoring-and-health-gates synthetic evidence execution with synthetic signals only, immediate owner review afterward, and no provider or deployment authority.",
    "reviewedPreparation": {
      "workstreamId": "controlled-concurrent-coordination-evidence",
      "evidenceClass": "CONCURRENT_COORDINATION_SAFETY_EVIDENCE",
      "controlId": "MONITORING_AND_HEALTH_GATES",
      "executionMode": "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
      "evidenceToolMode": "READ_ONLY_EVIDENCE_ONLY",
      "maximumEvidenceExecutionCount": 1,
      "concurrentExecutionLimit": 0,
      "deterministicEvidenceRequired": true,
      "independentValidationRequired": true,
      "ownerReviewAfterExecutionRequired": true,
      "monitoringRequired": true,
      "emergencyPauseRequired": true,
      "rollbackEvidenceRequired": true,
      "evidenceExecutionPerformed": false
    },
    "authorityBoundary": {
      "canonicalDecisionPreparationBound": true,
      "preparationIntegrityVerified": true,
      "ownerIdentityBound": true,
      "tenantIdentityBound": true,
      "controlIdentityBound": true,
      "approvalBypassAllowed": false,
      "concurrentCoordinationEvidenceExecutionAuthorized": true,
      "concurrentCoordinationEvidenceExecutionPerformed": false,
      "currentlyExecutable": false,
      "waitingForPriorEvidenceOwnerReview": true,
      "ownerReviewRequiredImmediatelyAfterExecution": true,
      "monitoringRequired": true,
      "emergencyPauseAvailable": true,
      "rollbackEvidenceRequired": true,
      "concurrentEngineeringWorkAuthorized": false,
      "aggregateConcurrentEngineeringWorkLimit": 0,
      "repositoryReadAuthorized": false,
      "repositoryWriteAuthorized": false,
      "branchCreationAuthorized": false,
      "pullRequestPreparationAuthorized": false,
      "mergeAuthorized": false,
      "secretsAccessAuthorized": false,
      "realCustomerDataAccessAuthorized": false,
      "realCustomerContactAuthorized": false,
      "externalDeliveryAuthorized": false,
      "liveProviderExecutionAuthorized": false,
      "productionDatabaseAuthorized": false,
      "productionMutationAuthorized": false,
      "productionDeploymentAuthorized": false,
      "paymentExecutionAuthorized": false,
      "financialCommitmentAuthorized": false,
      "legalCommitmentAuthorized": false,
      "autonomousDecisionAuthorized": false,
      "levelThreeEvaluationAuthorized": false,
      "levelThreeAuthorityGranted": false,
      "productionReadinessAuthorized": false,
      "publicLaunchAuthorized": false,
      "founderLiberationAchieved": false,
      "founderReleasedFromRoutineExecution": false
    },
    "candidateDecisionDigest": "c1d2bf1b8c659ce07ddec50fcf8a3038719786c7cbf3bc78abe0e1f7e069f924"
  }
} as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT =
  deepFreeze({
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT_VERSION,
    ...checkpointCore,
    checkpointDigest: "29609f5e86c17aa706277c7f004badfa266865885e538bd40c11c5f439b26f53",
  });

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationSequenceFiveApprovedCheckpoint(
  checkpoint:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT,
): void {
  const {
    version,
    checkpointDigest: actualDigest,
    ...actualCore
  } = checkpoint;

  const ownerReview = checkpoint.ownerReview;
  const candidateSix = checkpoint.candidateSix;

  if (
    version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT_VERSION ||
    checkpoint.sourceRepositoryHead !== "15e3a0f" ||
    checkpoint.sourceWorkstreamSequence !== 2 ||
    checkpoint.sourceWorkstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    !/^[0-9a-f]{64}$/.test(actualDigest) ||
    sha256(actualCore) !== actualDigest ||
    ownerReview.evidenceSequence !== 5 ||
    ownerReview.controlId !== "ROLLBACK_COORDINATION_PROTOCOL" ||
    ownerReview.executionAccepted !== true ||
    ownerReview.evidenceAccepted !== true ||
    ownerReview.sequenceFiveClosed !== true ||
    ownerReview.authorityBoundary.sequenceSixEvidenceExecutionAuthorized !==
      true ||
    ownerReview.authorityBoundary.sequenceSixEvidenceExecutionPerformed !==
      false ||
    ownerReview.authorityBoundary.onlySequenceSixAuthorizedNext !== true ||
    ownerReview.authorityBoundary.concurrentEngineeringWorkAuthorized !==
      false ||
    ownerReview.authorityBoundary.repositoryReadAuthorized !== false ||
    ownerReview.authorityBoundary.repositoryWriteAuthorized !== false ||
    ownerReview.authorityBoundary.productionDeploymentAuthorized !== false ||
    ownerReview.authorityBoundary.publicLaunchAuthorized !== false ||
    ownerReview.authorityBoundary.founderLiberationAchieved !== false ||
    ownerReview.authorityBoundary.founderReleasedFromRoutineExecution !==
      false ||
    ownerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX" ||
    candidateSix.sequence !== 6 ||
    candidateSix.controlId !== "MONITORING_AND_HEALTH_GATES" ||
    candidateSix.evidenceExecutionAuthorized !== true ||
    candidateSix.evidenceExecutionPerformed !== false ||
    candidateSix.authorityBoundary.concurrentEngineeringWorkAuthorized !==
      false ||
    candidateSix.authorityBoundary.repositoryReadAuthorized !== false ||
    candidateSix.authorityBoundary.repositoryWriteAuthorized !== false ||
    !Object.isFrozen(checkpoint) ||
    !Object.isFrozen(ownerReview) ||
    !Object.isFrozen(candidateSix)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-five approved checkpoint is invalid.",
    );
  }
}
