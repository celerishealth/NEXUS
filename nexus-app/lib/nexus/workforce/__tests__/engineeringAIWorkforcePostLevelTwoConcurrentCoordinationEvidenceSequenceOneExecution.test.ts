import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-concurrent-coordination-sequence-one-execution-test-001",
    sourceDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION,
    executedAt: new Date(
      Date.parse(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION
          .decidedAt,
      ) + 1,
    ).toISOString(),
  };
}

describe(
  "Engineering concurrent-coordination evidence sequence-one execution",
  () => {
    it("executes only the sequential ownership-ledger evidence", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceSequence: 1,
        controlId: "SEQUENTIAL_OWNERSHIP_LEDGER",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW",
      });
    });

    it("binds the canonical owner decision and candidate digest", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

      expect(record.sourceDecisionDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION
          .decisionDigest,
      );

      expect(record.sourceCandidateDecisionDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION
          .candidateDecisions[0]?.candidateDecisionDigest,
      );
    });

    it("records one executed entry and seven blocked entries", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .evidence;

      expect(evidence.executedEvidenceItemCount).toBe(1);
      expect(evidence.blockedEvidenceItemCount).toBe(7);

      expect(evidence.ledgerEntries[0]?.ownershipState).toBe(
        "EXECUTED_AWAITING_OWNER_REVIEW",
      );

      expect(
        evidence.ledgerEntries.slice(1).every(
          (entry) =>
            entry.ownershipState ===
              "BLOCKED_PENDING_PRIOR_OWNER_REVIEW" &&
            entry.evidenceExecutionPerformed === false,
        ),
      ).toBe(true);
    });

    it("proves isolation pause rollback monitoring and validation", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .evidence,
      ).toMatchObject({
        maximumActiveEvidenceItems: 1,
        concurrentOwnershipConflictDetected: false,
        failClosedOnOwnershipConflict: true,
        deterministicOrderingVerified: true,
        uniqueControlOwnershipVerified: true,
        controlIsolationVerified: true,
        nextEvidenceBlockedUntilOwnerReview: true,
        emergencyPauseAvailable: true,
        rollbackMarkerRecorded: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("blocks repository production concurrency and next execution", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        exactlyOneEvidenceItemExecuted: true,
        remainingSevenEvidenceItemsBlocked: true,
        nextEvidenceExecutionAuthorized: false,
        concurrentEngineeringWorkAuthorized: false,
        aggregateConcurrentEngineeringWorkLimit: 0,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        productionDeploymentAuthorized: false,
        publicLaunchAuthorized: false,
        levelThreeAuthorityGranted: false,
        founderLiberationAchieved: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("rejects noncanonical decision and premature execution", () => {
      const copiedDecision = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution({
          ...canonicalInput(),
          sourceDecision: copiedDecision,
        }),
      ).toThrow("Only the canonical owner-approved");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution({
          ...canonicalInput(),
          executedAt: new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION
                .decidedAt,
            ) - 1,
          ).toISOString(),
        }),
      ).toThrow("cannot precede the owner decision");
    }, 120_000);

    it("is deterministic deeply immutable and detects tampering", () => {
      const first =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution(
          canonicalInput(),
        );

      const second =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution(
          canonicalInput(),
        );

      expect(second).toEqual(first);
      expect(first.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(first.evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(first)).toBe(true);
      expect(Object.isFrozen(first.evidence.ledgerEntries)).toBe(true);

      const tampered = {
        ...first,
        authorityBoundary: {
          ...first.authorityBoundary,
          nextEvidenceExecutionAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution(
          tampered,
        ),
      ).toThrow();
    }, 120_000);

    it("keeps Founder Liberation at Level 2", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution(
          record,
        ),
      ).not.toThrow();

      expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
      expect(
        record.authorityBoundary.founderReleasedFromRoutineExecution,
      ).toBe(false);
    }, 120_000);
  },
);