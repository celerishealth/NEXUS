import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  type EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution,
} from "../engineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION,
  createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision";

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
          stableStringify(item),
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
            JSON.stringify(key) +
            ":" +
            stableStringify(record[key]),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic test value.",
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

function approvedInput() {
  const source =
    ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

  return {
    sourceExecution:
      source,

    decisionId:
      "engineering-ishaan-first-task-review-test-001",

    ownerId:
      source.ownerId,

    decision:
      "APPROVE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Ishaan's bounded synthetic architecture result and approved only Leela's first synthetic pilot task execution as the next sequential step.",

    decidedAt:
      new Date(
        Date.parse(source.executedAt) +
          1000,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Ishaan first synthetic pilot task owner review",
  () => {
    it(
      "records approval and authorizes only Leela first-task execution",
      () => {
        const record =
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
            approvedInput(),
          );

        expect(record.version).toBe(
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION,
        );

        expect(record.decisionState).toBe(
          "OWNER_ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_RECORDED",
        );

        expect(
          record.ishaanFirstTaskApproved,
        ).toBe(true);

        expect(
          record.leelaFirstTaskExecutionAuthorized,
        ).toBe(true);

        expect(
          record.leelaFirstTaskExecutionPerformed,
        ).toBe(false);

        expect(record.nextCandidate).toEqual(
          expect.objectContaining({
            publicName:
              "Leela",

            employeeCode:
              "nx-engineering-002",

            taskSequence:
              1,

            scenarioId:
              "EVIDENCE_GATED_DELIVERY_PLAN",
          }),
        );

        expect(record.nextStep).toBe(
          "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_TWO",
        );
      },
    );

    it(
      "records rejection without authorizing Leela",
      () => {
        const record =
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvedInput(),

            decisionId:
              "engineering-ishaan-first-task-review-rejected",

            decision:
              "REJECT_AND_RETAIN_ISHAAN_FIRST_TASK_ONLY",

            reason:
              "Owner rejected continuation after reviewing Ishaan's first bounded synthetic pilot result and retained the sequence at Ishaan only.",
          });

        expect(
          record.ishaanFirstTaskApproved,
        ).toBe(false);

        expect(
          record.leelaFirstTaskExecutionAuthorized,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .onlyLeelaCurrentlyExecutable,
        ).toBe(false);

        expect(record.nextStep).toBe(
          "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AT_ISHAAN_FIRST_TASK_ONLY",
        );
      },
    );

    it(
      "preserves reviewed evidence and blocks every consequential authority",
      () => {
        const record =
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
            approvedInput(),
          );

        expect(record.reviewedEvidence).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          actorClass:
            "OWNER_SUPERVISED_INTERNAL_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          evidenceToolMode:
            "READ_ONLY",

          draftToolMode:
            "DRAFT_ONLY",

          reviewedTaskSequence:
            1,

          reviewedScenarioId:
            "BOUNDED_MODULAR_ARCHITECTURE_REVIEW",

          maximumTaskCount:
            3,

          executedTaskCount:
            1,

          remainingTaskCapacity:
            2,

          ownerReviewFrequency:
            "AFTER_EVERY_PILOT_TASK",

          pilotDraftCreated:
            true,

          pilotCompleted:
            false,
        });

        expect(
          record.authorityBoundary,
        ).toMatchObject({
          leelaFirstTaskExecutionAuthorized:
            true,

          leelaFirstTaskExecutionPerformed:
            false,

          onlyLeelaCurrentlyExecutable:
            true,

          remainingSixAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          ishaanSecondSyntheticPilotTaskExecutionAuthorized:
            false,

          ishaanThirdSyntheticPilotTaskExecutionAuthorized:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          realCustomerDataAccessAuthorized:
            false,

          realCustomerContactAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          autonomousDecisionAuthorized:
            false,

          publicLaunchAuthorized:
            false,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "blocks a cross-owner review decision",
      () => {
        expect(() =>
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvedInput(),

            ownerId:
              "owner-cross-tenant-001",
          }),
        ).toThrow(
          "Only the execution-bound owner can review Ishaan's first synthetic pilot task.",
        );
      },
    );

    it(
      "blocks review before Ishaan execution",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(() =>
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvedInput(),

            decidedAt:
              new Date(
                Date.parse(source.executedAt) -
                  1000,
              ).toISOString(),
          }),
        ).toThrow(
          "Ishaan owner-review decision cannot precede task execution.",
        );
      },
    );

    it(
      "rejects tampered Ishaan execution evidence",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        const tampered = {
          ...source,

          executionDigest:
            "f".repeat(64),
        } as EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution;

        expect(() =>
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvedInput(),

            sourceExecution:
              tampered,
          }),
        ).toThrow();
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and secret-safe",
      () => {
        const first =
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
            approvedInput(),
          );

        const second =
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
            approvedInput(),
          );

        expect(first).toEqual(second);

        expect(
          first.decisionDigest,
        ).toBe(second.decisionDigest);

        expect(Object.isFrozen(first)).toBe(
          true,
        );

        expect(
          Object.isFrozen(
            first.reviewedEvidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        const {
          decisionDigest,
          ...decisionCore
        } = first;

        expect(
          sha256(decisionCore),
        ).toBe(decisionDigest);

        expect(() =>
          validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision({
            ...first,

            decisionDigest:
              "0".repeat(64),
          }),
        ).toThrow(
          "Ishaan first synthetic pilot task owner-review decision integrity verification failed.",
        );

        expect(() =>
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvedInput(),

            decisionId:
              "decision-secret-token-001",
          }),
        ).toThrow(
          "Ishaan owner-review decision identity must be a canonical safe identifier.",
        );

        expect(() =>
          createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvedInput(),

            reason:
              "Owner approved continuation using access_token abc123 inside the review evidence.",
          }),
        ).toThrow(
          "Ishaan owner-review reason contains prohibited secret-bearing content.",
        );
      },
    );

    it(
      "exports a valid canonical owner-approved record",
      () => {
        expect(() =>
          validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
            ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
          ),
        ).not.toThrow();

        expect(
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .decision,
        ).toBe(
          "APPROVE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
        );
      },
    );
  },
);
