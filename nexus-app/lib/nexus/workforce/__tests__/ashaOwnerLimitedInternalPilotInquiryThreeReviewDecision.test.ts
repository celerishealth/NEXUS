import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_VERSION,
  type AshaLimitedInternalPilotInquiryThreeExecution,
} from "../ashaLimitedInternalPilotInquiryThreeExecution";

import {
  createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision,
  type CreateAshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionInput,
} from "../ashaOwnerLimitedInternalPilotInquiryThreeReviewDecision";

function canonicalize(
  value:
    unknown,
): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(
      value,
    );
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return `[${value
      .map((item) =>
        canonicalize(
          item,
        ))
      .join(",")}]`;
  }

  if (
    typeof value === "object"
  ) {
    const record =
      value as Record<
        string,
        unknown
      >;

    return `{${Object.keys(
      record,
    )
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(
            key,
          )}:${canonicalize(
            record[key],
          )}`,
      )
      .join(",")}}`;
  }

  throw new Error(
    "Unsupported deterministic test value.",
  );
}

function sha256(
  value:
    unknown,
): string {
  return createHash(
    "sha256",
  )
    .update(
      canonicalize(
        value,
      ),
    )
    .digest(
      "hex",
    );
}

const EXECUTED_AT =
  "2026-07-16T12:00:00.000Z";

const DECIDED_AT =
  "2026-07-16T12:05:00.000Z";

function createExecution(
  overrides: Record<
    string,
    unknown
  > = {},
): AshaLimitedInternalPilotInquiryThreeExecution {
  const executionCore = {
    version:
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_VERSION,

    executionId:
      "asha-inquiry-three-execution-001",

    executionState:
      "LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTED",

    employeeId:
      "employee-asha-inquiry-intake-v1",

    templateId:
      "template-asha-inquiry-intake-v1",

    employeeCode:
      "nx-sales-003",

    displayName:
      "Asha",

    officialRole:
      "AI Inquiry Intake Executive",

    department:
      "SALES",

    autonomyLevel:
      "DRAFTING_ASSISTANT",

    ownerExecutionDecisionId:
      "asha-inquiry-three-execution-decision-001",

    ownerExecutionDecisionDigest:
      sha256({
        id:
          "asha-inquiry-three-execution-decision-001",
      }),

    inquiryThreePreparationId:
      "asha-inquiry-three-preparation-001",

    inquiryThreePreparationDigest:
      sha256({
        id:
          "asha-inquiry-three-preparation-001",
      }),

    sourceInquiryTwoReviewDecisionId:
      "asha-inquiry-two-review-decision-001",

    sourceInquiryTwoReviewDecisionDigest:
      sha256({
        id:
          "asha-inquiry-two-review-decision-001",
      }),

    sourceInquiryTwoExecutionId:
      "asha-inquiry-two-execution-001",

    sourceInquiryTwoExecutionDigest:
      sha256({
        id:
          "asha-inquiry-two-execution-001",
      }),

    ownerInquiryTwoExecutionDecisionId:
      "asha-inquiry-two-execution-decision-001",

    ownerInquiryTwoExecutionDecisionDigest:
      sha256({
        id:
          "asha-inquiry-two-execution-decision-001",
      }),

    inquiryTwoPreparationId:
      "asha-inquiry-two-preparation-001",

    inquiryTwoPreparationDigest:
      sha256({
        id:
          "asha-inquiry-two-preparation-001",
      }),

    sourceInquiryOneReviewDecisionId:
      "asha-inquiry-one-review-decision-001",

    sourceInquiryOneReviewDecisionDigest:
      sha256({
        id:
          "asha-inquiry-one-review-decision-001",
      }),

    sourceInquiryOneExecutionId:
      "asha-inquiry-one-execution-001",

    sourceInquiryOneExecutionDigest:
      sha256({
        id:
          "asha-inquiry-one-execution-001",
      }),

    runtimeIssuanceId:
      "asha-runtime-issuance-001",

    runtimeIssuanceDigest:
      sha256({
        id:
          "asha-runtime-issuance-001",
      }),

    runtimeId:
      "asha-runtime-001",

    runtimeDigest:
      sha256({
        id:
          "asha-runtime-001",
      }),

    qualifiedManifestDigest:
      sha256({
        id:
          "asha-qualified-manifest-001",
      }),

    tenantId:
      "tenant-ppa-industrial-solution",

    ownerId:
      "owner-prashant-srivastav",

    pilotInquiry: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT",

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY",

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY",

      scenarioId:
        "SAFE_CUSTOMER_CONTEXT_CONTINUITY",

      inquirySequence:
        3,

      priorReviewedInquirySequence:
        2,

      maximumInquiryCount:
        3,

      remainingInquiryCapacity:
        0,

      concurrentInquiryLimit:
        1,

      failureThreshold:
        1,

      ownerReviewFrequency:
        "AFTER_EVERY_INQUIRY",

      toolId:
        "tool-inquiry-draft",

      toolMode:
        "DRAFT_ONLY",

      executionMode:
        "SANDBOX_ONLY",
    },

    customerContextContinuityExpectation: {
      customerContextContinuityRequired:
        true,

      repeatedQuestionAvoidanceRequired:
        true,

      clarificationBeforeGuessingRequired:
        true,

      promiseAndFollowUpTrackingRequired:
        true,

      uncertaintyEscalatesToOwner:
        true,

      tenantScopedContextOnly:
        true,

      customerScopedContextOnly:
        true,

      crossTenantContextReuseAuthorized:
        false,

      crossCustomerContextReuseAuthorized:
        false,

      responseGenerationPerformed:
        false,

      humanImpersonationAuthorized:
        false,
    },

    syntheticInquiryEvidence: {
      idempotencyKey:
        "asha-limited-internal-pilot-inquiry-003",

      channel:
        "WEB",

      customerName:
        "Synthetic Pilot Customer Three",

      customerEmail:
        "synthetic.pilot.three@example.invalid",

      customerPhone:
        null,

      message:
        "I previously asked about certified safety helmets for our workshop. Please continue from that confirmed context without asking me to repeat known details, and clearly identify anything still missing before drafting a response.",

      resultOutcome:
        "CREATED",

      inquiryId:
        "inquiry-asha-limited-internal-pilot-003",

      inquiryStatus:
        "NEW",

      createdAt:
        EXECUTED_AT,
    },

    controlledInquiryReceipt: {
      version:
        "nexus-asha-controlled-inquiry-intake-v1",

      outcome:
        "CREATED",
    },

    executionBoundary: {
      ownerExecutionApprovalBound:
        true,

      runtimeIssuanceBound:
        true,

      qualifiedManifestBound:
        true,

      tenantIdentityBound:
        true,

      ownerIdentityBound:
        true,

      pilotInquirySequenceEnforced:
        true,

      maximumInquiryCountPreserved:
        true,

      concurrentInquiryLimitEnforced:
        true,

      failureThresholdPreserved:
        true,

      ownerReviewAfterInquiryRequired:
        true,

      inquiryThreeExecutionDecisionBound:
        true,

      inquiryThreeExecutionPerformed:
        true,

      finalInquirySequenceReached:
        true,

      remainingInquiryCapacityExhausted:
        true,

      ownerReviewAfterInquiryThreeRequired:
        true,

      limitedInternalPilotInquiryExecuted:
        true,

      limitedInternalPilotCompleted:
        false,

      syntheticAuthenticatedInquiryCreated:
        true,

      genericPilotArchitectureInvoked:
        false,

      realCustomerInquiryCreated:
        false,

      realCustomerDataAccessed:
        false,

      customerContactPerformed:
        false,

      recommendationGenerationPerformed:
        false,

      externalDeliveryPerformed:
        false,

      liveProviderExecutionPerformed:
        false,

      productionDatabaseUsed:
        false,

      productionMutationPerformed:
        false,

      paymentExecutionPerformed:
        false,

      autonomousDecisionPerformed:
        false,

      productionReadinessAuthorized:
        false,

      publicLaunchAuthorized:
        false,

      emergencyPauseAvailable:
        true,
    },

    nextStep:
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW",

    executedAt:
      EXECUTED_AT,

    ...overrides,
  };

  return {
    ...executionCore,

    executionDigest:
      sha256(
        executionCore,
      ),
  } as unknown as AshaLimitedInternalPilotInquiryThreeExecution;
}

function createInput(
  overrides: Partial<
    CreateAshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionInput
  > = {},
): CreateAshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionInput {
  return {
    limitedInternalPilotInquiryThreeExecution:
      createExecution(),

    decisionId:
      "asha-inquiry-three-review-decision-001",

    ownerId:
      "owner-prashant-srivastav",

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION",

    reason:
      "All three bounded synthetic inquiries completed safely and the final owner review approves pilot completion only.",

    decidedAt:
      DECIDED_AT,

    ...overrides,
  };
}

describe(
  "Asha owner limited internal pilot inquiry three review decision",
  () => {
    it(
      "records final owner approval and completes the pilot only after inquiry three review",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
            createInput(),
          );

        expect(
          result.decision,
        ).toBe(
          "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION",
        );

        expect(
          result.limitedInternalPilotCompleted,
        ).toBe(
          true,
        );

        expect(
          result.nextStep,
        ).toBe(
          "LIMITED_INTERNAL_PILOT_COMPLETE",
        );

        expect(
          result.authorityBoundary.inquiryThreeReviewed,
        ).toBe(
          true,
        );
      },
    );

    it(
      "records rejection and retains inquiry three as the latest executed inquiry",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
            createInput({
              decision:
                "REJECT_AND_RETAIN_INQUIRY_THREE_ONLY",

              reason:
                "The final owner review retains inquiry three evidence and does not approve pilot completion.",
            }),
          );

        expect(
          result.limitedInternalPilotCompleted,
        ).toBe(
          false,
        );

        expect(
          result.nextStep,
        ).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_ONLY",
        );
      },
    );

    it(
      "records the exact safe customer context continuity evidence and sequence three of three",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
            createInput(),
          );

        expect(
          result.reviewedEvidence,
        ).toMatchObject({
          scenarioId:
            "SAFE_CUSTOMER_CONTEXT_CONTINUITY",

          reviewedInquirySequence:
            3,

          maximumInquiryCount:
            3,

          remainingInquiryCapacity:
            0,

          customerContextContinuityRequired:
            true,

          repeatedQuestionAvoidanceRequired:
            true,

          clarificationBeforeGuessingRequired:
            true,

          tenantScopedContextOnly:
            true,

          customerScopedContextOnly:
            true,

          crossTenantContextReuseAuthorized:
            false,

          crossCustomerContextReuseAuthorized:
            false,
        });
      },
    );

    it(
      "keeps every further inquiry and real-world autonomous authority blocked",
      () => {
        const boundary =
          createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
            createInput(),
          ).authorityBoundary;

        expect(
          boundary,
        ).toMatchObject({
          furtherInquiryPreparationAuthorized:
            false,

          furtherInquiryExecutionAuthorized:
            false,

          concurrentInquiryExecutionAuthorized:
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
        });
      },
    );

    it(
      "rejects a cross-owner decision and a review before inquiry three execution",
      () => {
        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
              createInput({
                ownerId:
                  "owner-another-tenant",
              }),
            ),
        ).toThrow(
          "Only the inquiry-three-bound owner",
        );

        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
              createInput({
                decidedAt:
                  "2026-07-16T11:59:59.000Z",
              }),
            ),
        ).toThrow(
          "cannot precede inquiry three execution",
        );
      },
    );

    it(
      "rejects integrity-tampered execution and recomputed invalid safety evidence",
      () => {
        const valid =
          createExecution();

        const tampered =
          {
            ...valid,

            pilotInquiry: {
              ...valid.pilotInquiry,

              scenarioId:
                "UNSAFE_CONTEXT_REUSE",
            },
          } as unknown as AshaLimitedInternalPilotInquiryThreeExecution;

        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
              createInput({
                limitedInternalPilotInquiryThreeExecution:
                  tampered,
              }),
            ),
        ).toThrow();

        const recomputedCore =
          {
            ...valid,

            executionBoundary: {
              ...valid.executionBoundary,

              publicLaunchAuthorized:
                true,
            },
          } as Record<
            string,
            unknown
          >;

        delete recomputedCore.executionDigest;

        const recomputed =
          {
            ...recomputedCore,

            executionDigest:
              sha256(
                recomputedCore,
              ),
          } as unknown as AshaLimitedInternalPilotInquiryThreeExecution;

        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
              createInput({
                limitedInternalPilotInquiryThreeExecution:
                  recomputed,
              }),
            ),
        ).toThrow(
          "authority boundary is invalid",
        );
      },
    );

    it(
      "is deterministic deeply frozen and digest-bound",
      () => {
        const input =
          createInput();

        const first =
          createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
            input,
          );

        const second =
          createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
            input,
          );

        expect(
          first,
        ).toEqual(
          second,
        );

        expect(
          Object.isFrozen(
            first,
          ),
        ).toBe(
          true,
        );

        expect(
          Object.isFrozen(
            first.reviewedEvidence,
          ),
        ).toBe(
          true,
        );

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(
          true,
        );

        const {
          decisionDigest,
          ...decisionCore
        } = first;

        expect(
          decisionDigest,
        ).toBe(
          sha256(
            decisionCore,
          ),
        );
      },
    );

    it(
      "rejects secret-bearing review identity and reason",
      () => {
        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
              createInput({
                decisionId:
                  "api-key-sk-super-secret-value",
              }),
            ),
        ).toThrow(
          "safe non-secret identifier",
        );

        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
              createInput({
                reason:
                  "Owner approval contains access_token secret-value and must be rejected.",
              }),
            ),
        ).toThrow(
          "safe, explicit, and non-secret",
        );
      },
    );
  },
);