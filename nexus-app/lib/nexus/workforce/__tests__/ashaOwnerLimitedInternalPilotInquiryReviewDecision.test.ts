import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION,
  type AshaControlledInquiryIntakeReceipt,
} from "../ashaControlledInquiryIntake";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTION_VERSION,
  type AshaLimitedInternalPilotInquiryExecution,
} from "../ashaLimitedInternalPilotInquiryExecution";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISION_VERSION,
  createAshaOwnerLimitedInternalPilotInquiryReviewDecision,
} from "../ashaOwnerLimitedInternalPilotInquiryReviewDecision";

const EXECUTED_AT =
  "2026-07-16T00:00:00.000Z";

const DECIDED_AT =
  "2026-07-16T00:00:01.000Z";

const TENANT_ID =
  "tenant-ppa-industrial-solution";

const OWNER_ID =
  "owner-prashant";

const RUNTIME_ID =
  "runtime-asha-owner-activated-001";

const RUNTIME_DIGEST =
  "1".repeat(64);

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

function controlledInquiryReceipt():
  AshaControlledInquiryIntakeReceipt {
  const receiptCore = {
    version:
      ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION,

    employeeId:
      "employee-asha-inquiry-intake-v1" as const,

    templateId:
      "template-asha-inquiry-intake-v1" as const,

    runtimeId:
      RUNTIME_ID,

    runtimeDigest:
      RUNTIME_DIGEST,

    tenantId:
      TENANT_ID,

    workforceAuthority: {
      employeeQualified:
        true as const,

      employeeOwnerActivated:
        true as const,

      controlledWorkAuthorized:
        true as const,

      toolId:
        "tool-inquiry-draft" as const,

      toolMode:
        "DRAFT_ONLY" as const,

      tenantScoped:
        true as const,
    },

    safetyBoundary: {
      recommendationGenerationAuthorized:
        false as const,

      externalMessageDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      ownerApprovalRequiredBeforeExecution:
        true as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      publicLaunchAuthorized:
        false as const,
    },

    authenticatedInquiry: {
      outcome:
        "CREATED" as const,

      inquiry: {
        id:
          "inquiry-asha-limited-internal-pilot-001",

        tenantId:
          TENANT_ID,

        customerName:
          "Synthetic Pilot Customer One",

        customerEmail:
          "synthetic.pilot.one@example.invalid",

        customerPhone:
          null,

        channel:
          "WEB" as const,

        message:
          "We need safety equipment for a workshop, but the product type, quantity, specifications, budget, and delivery date are not yet provided.",

        status:
          "NEW" as const,

        createdAt:
          EXECUTED_AT,
      },

      intakeAuthority: {
        createdByUserId:
          OWNER_ID,

        sourceSessionId:
          "session-asha-limited-internal-pilot-001",

        role:
          "OWNER" as const,
      },

      safetyBoundary: {
        recommendationStatus:
          "NOT_GENERATED" as const,

        ownerApprovalRequiredBeforeExecution:
          true as const,

        executionMode:
          "SANDBOX_ONLY" as const,

        liveProviderExecutionAuthorized:
          false as const,

        publicLaunchAuthorized:
          false as const,
      },
    },
  };

  return {
    ...receiptCore,

    receiptDigest:
      sha256(receiptCore),
  } as unknown as AshaControlledInquiryIntakeReceipt;
}

function day28Execution():
  AshaLimitedInternalPilotInquiryExecution {
  const executionCore = {
    version:
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTION_VERSION,

    executionId:
      "execution-asha-limited-internal-pilot-inquiry-001",

    executionState:
      "LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTED" as const,

    employeeId:
      "employee-asha-inquiry-intake-v1" as const,

    templateId:
      "template-asha-inquiry-intake-v1" as const,

    employeeCode:
      "nx-sales-003" as const,

    displayName:
      "Asha" as const,

    officialRole:
      "AI Inquiry Intake Executive" as const,

    department:
      "SALES" as const,

    autonomyLevel:
      "DRAFTING_ASSISTANT" as const,

    ownerExecutionDecisionId:
      "decision-asha-limited-internal-pilot-execution-001",

    ownerExecutionDecisionDigest:
      "2".repeat(64),

    preparationId:
      "preparation-asha-limited-internal-pilot-001",

    preparationDigest:
      "3".repeat(64),

    sourceReviewDecisionId:
      "decision-asha-controlled-shadow-review-001",

    sourceReviewDecisionDigest:
      "4".repeat(64),

    runtimeIssuanceId:
      "issuance-asha-owner-activated-runtime-001",

    runtimeIssuanceDigest:
      "5".repeat(64),

    runtimeId:
      RUNTIME_ID,

    runtimeDigest:
      RUNTIME_DIGEST,

    qualifiedManifestDigest:
      "6".repeat(64),

    tenantId:
      TENANT_ID,

    ownerId:
      OWNER_ID,

    pilotInquiry: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        "INCOMPLETE_REQUIREMENT_CLARIFICATION" as const,

      inquirySequence:
        1 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacity:
        2 as const,

      concurrentInquiryLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_INQUIRY" as const,

      toolId:
        "tool-inquiry-draft" as const,

      toolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,
    },

    humanLikeScenarioExpectation: {
      understandIncompleteRequirement:
        true as const,

      clarificationBeforeAssumptionRequired:
        true as const,

      repetitiveQuestioningProhibited:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      humanImpersonationAuthorized:
        false as const,

      responseGenerationPerformed:
        false as const,
    },

    syntheticInquiryEvidence: {
      idempotencyKey:
        "asha-limited-internal-pilot-inquiry-001" as const,

      channel:
        "WEB" as const,

      customerName:
        "Synthetic Pilot Customer One" as const,

      customerEmail:
        "synthetic.pilot.one@example.invalid" as const,

      customerPhone:
        null,

      message:
        "We need safety equipment for a workshop, but the product type, quantity, specifications, budget, and delivery date are not yet provided." as const,

      resultOutcome:
        "CREATED" as const,

      inquiryId:
        "inquiry-asha-limited-internal-pilot-001" as const,

      inquiryStatus:
        "NEW" as const,

      createdAt:
        EXECUTED_AT,
    },

    controlledInquiryReceipt:
      controlledInquiryReceipt(),

    executionBoundary: {
      ownerExecutionApprovalBound:
        true as const,

      runtimeIssuanceBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      pilotInquirySequenceEnforced:
        true as const,

      maximumInquiryCountPreserved:
        true as const,

      concurrentInquiryLimitEnforced:
        true as const,

      failureThresholdPreserved:
        true as const,

      ownerReviewAfterInquiryRequired:
        true as const,

      limitedInternalPilotInquiryExecuted:
        true as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticAuthenticatedInquiryCreated:
        true as const,

      genericPilotArchitectureInvoked:
        false as const,

      realCustomerInquiryCreated:
        false as const,

      realCustomerDataAccessed:
        false as const,

      customerContactPerformed:
        false as const,

      recommendationGenerationPerformed:
        false as const,

      externalDeliveryPerformed:
        false as const,

      liveProviderExecutionPerformed:
        false as const,

      productionDatabaseUsed:
        false as const,

      productionMutationPerformed:
        false as const,

      paymentExecutionPerformed:
        false as const,

      autonomousDecisionPerformed:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW" as const,

    executedAt:
      EXECUTED_AT,
  };

  return {
    ...executionCore,

    executionDigest:
      sha256(executionCore),
  };
}

function approvedInput() {
  return {
    limitedInternalPilotInquiryExecution:
      day28Execution(),

    decisionId:
      "decision-asha-limited-pilot-inquiry-one-review-001",

    ownerId:
      OWNER_ID,

    decision:
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_INQUIRY_PREPARATION" as const,

    reason:
      "Owner verified inquiry one evidence and approved preparation for the next bounded synthetic inquiry only.",

    decidedAt:
      DECIDED_AT,
  };
}

describe(
  "Asha owner limited internal pilot inquiry review decision",
  () => {
    it(
      "records owner approval for inquiry two preparation only without executing inquiry two",
      () => {
        const decision =
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision(
            approvedInput(),
          );

        expect(decision.version).toBe(
          ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISION_VERSION,
        );

        expect(decision.decisionState).toBe(
          "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_RECORDED",
        );

        expect(
          decision.nextInquiryPreparationApproved,
        ).toBe(true);

        expect(
          decision.inquiryTwoExecutionAuthorized,
        ).toBe(false);

        expect(decision.nextStep).toBe(
          "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO",
        );
      },
    );

    it(
      "records owner rejection and retains inquiry one as the only executed pilot inquiry",
      () => {
        const decision =
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision({
            ...approvedInput(),

            decisionId:
              "decision-asha-limited-pilot-inquiry-one-review-rejected",

            decision:
              "REJECT_AND_RETAIN_INQUIRY_ONE_ONLY",

            reason:
              "Owner rejected continuation and retained the limited internal pilot at inquiry one only.",
          });

        expect(
          decision.nextInquiryPreparationApproved,
        ).toBe(false);

        expect(decision.nextStep).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_ONE_ONLY",
        );

        expect(
          decision.authorityBoundary
            .nextInquiryPreparationAuthorized,
        ).toBe(false);
      },
    );

    it(
      "records exact inquiry one evidence and keeps every real-world authority blocked",
      () => {
        const decision =
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision(
            approvedInput(),
          );

        expect(decision.reviewedEvidence).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          dataClass:
            "SYNTHETIC_SANITIZED_ONLY",

          actorClass:
            "OWNER_SUPERVISED_INTERNAL_ONLY",

          scenarioId:
            "INCOMPLETE_REQUIREMENT_CLARIFICATION",

          reviewedInquirySequence:
            1,

          maximumInquiryCount:
            3,

          remainingInquiryCapacity:
            2,

          ownerReviewFrequency:
            "AFTER_EVERY_INQUIRY",

          toolId:
            "tool-inquiry-draft",

          toolMode:
            "DRAFT_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          controlledInquiryOutcome:
            "CREATED",

          controlledInquiryStatus:
            "NEW",

          recommendationStatus:
            "NOT_GENERATED",
        });

        expect(decision.authorityBoundary).toMatchObject({
          inquiryOneReviewed:
            true,

          nextInquiryPreparationAuthorized:
            true,

          inquiryTwoExecutionAuthorized:
            false,

          concurrentInquiryExecutionAuthorized:
            false,

          limitedInternalPilotCompleted:
            false,

          realCustomerInquiryAuthorized:
            false,

          realCustomerDataAccessAuthorized:
            false,

          customerContactAuthorized:
            false,

          recommendationGenerationAuthorized:
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

          productionReadinessAuthorized:
            false,

          publicLaunchAuthorized:
            false,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "blocks a cross-owner inquiry review decision",
      () => {
        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision({
            ...approvedInput(),

            ownerId:
              "owner-cross-tenant",
          }),
        ).toThrow(
          "Only the limited-internal-pilot-bound owner can issue the inquiry review decision.",
        );
      },
    );

    it(
      "blocks a review decision before inquiry one execution",
      () => {
        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision({
            ...approvedInput(),

            decidedAt:
              "2026-07-15T23:59:59.000Z",
          }),
        ).toThrow(
          "Owner limited internal pilot inquiry review decision cannot precede inquiry execution.",
        );
      },
    );

    it(
      "rejects a tampered Day 28 execution digest",
      () => {
        const source =
          day28Execution();

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision({
            ...approvedInput(),

            limitedInternalPilotInquiryExecution: {
              ...source,

              executionDigest:
                "f".repeat(64),
            },
          }),
        ).toThrow(
          "Workforce Day 28 limited internal pilot inquiry execution integrity verification failed.",
        );
      },
    );

    it(
      "rejects a recomputed execution containing a tampered controlled inquiry receipt",
      () => {
        const source =
          day28Execution();

        const receipt = {
          ...source.controlledInquiryReceipt,

          safetyBoundary: {
            ...source.controlledInquiryReceipt
              .safetyBoundary,

            liveProviderExecutionAuthorized:
              true,
          },
        };

        const tamperedCore = {
          ...source,

          controlledInquiryReceipt:
            receipt,
        };

        const {
          executionDigest: _discardedDigest,
          ...recomputedCore
        } = tamperedCore;

        const recomputed = {
          ...recomputedCore,

          executionDigest:
            sha256(recomputedCore),
        } as AshaLimitedInternalPilotInquiryExecution;

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision({
            ...approvedInput(),

            limitedInternalPilotInquiryExecution:
              recomputed,
          }),
        ).toThrow(
          "Limited internal pilot controlled inquiry receipt integrity verification failed.",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects secret-bearing review input",
      () => {
        const first =
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision(
            approvedInput(),
          );

        const second =
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision(
            approvedInput(),
          );

        expect(first).toEqual(second);
        expect(first.decisionDigest).toBe(
          second.decisionDigest,
        );

        expect(Object.isFrozen(first)).toBe(true);
        expect(
          Object.isFrozen(first.reviewedEvidence),
        ).toBe(true);
        expect(
          Object.isFrozen(first.authorityBoundary),
        ).toBe(true);

        const {
          decisionDigest,
          ...decisionCore
        } = first;

        expect(sha256(decisionCore)).toBe(
          decisionDigest,
        );

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision({
            ...approvedInput(),

            decisionId:
              "decision-secret-token-001",
          }),
        ).toThrow(
          "Limited internal pilot inquiry review decision identity must be a canonical safe identifier.",
        );

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryReviewDecision({
            ...approvedInput(),

            reason:
              "Approved using secret access_token abc123 for continuation.",
          }),
        ).toThrow(
          "Owner limited internal pilot inquiry review reason contains prohibited secret-bearing content.",
        );
      },
    );
  },
);
