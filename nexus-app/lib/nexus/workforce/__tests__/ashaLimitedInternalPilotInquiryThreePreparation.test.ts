import { createHash } from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISION_VERSION,
  type AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision,
} from "../ashaOwnerLimitedInternalPilotInquiryTwoReviewDecision";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_VERSION,
  createAshaLimitedInternalPilotInquiryThreePreparation,
} from "../ashaLimitedInternalPilotInquiryThreePreparation";

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
    return (
      "{" +
      Object.entries(
        value as Record<string, unknown>,
      )
        .sort(
          ([left], [right]) =>
            left.localeCompare(right),
        )
        .map(
          ([key, item]) =>
            `${JSON.stringify(key)}:${stableStringify(item)}`,
        )
        .join(",") +
      "}"
    );
  }

  return JSON.stringify(value);
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(stableStringify(value))
    .digest("hex");
}

const DIGEST_A =
  "a".repeat(64);

const DIGEST_B =
  "b".repeat(64);

const DIGEST_C =
  "c".repeat(64);

const DIGEST_D =
  "d".repeat(64);

const DIGEST_E =
  "e".repeat(64);

const DIGEST_F =
  "f".repeat(64);

const DIGEST_ONE =
  "1".repeat(64);

const DIGEST_TWO =
  "2".repeat(64);

function rebindDecisionDigest(
  value:
    AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision,
): AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision {
  const core = {
    ...value,
  } as Record<string, unknown>;

  delete core.decisionDigest;

  return {
    ...core,

    decisionDigest:
      sha256(core),
  } as unknown as AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision;
}

function approvedInquiryTwoReviewDecision(
  overrides:
    Partial<AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision> = {},
): AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision {
  const core = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISION_VERSION,

    decisionId:
      "decision-asha-limited-pilot-inquiry-two-review-001",

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_RECORDED" as const,

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

    limitedInternalPilotInquiryTwoExecutionId:
      "execution-asha-limited-internal-pilot-inquiry-two-001",

    limitedInternalPilotInquiryTwoExecutionDigest:
      DIGEST_A,

    ownerExecutionDecisionId:
      "decision-asha-limited-pilot-inquiry-two-execution-001",

    ownerExecutionDecisionDigest:
      DIGEST_B,

    preparationId:
      "preparation-asha-limited-pilot-inquiry-two-001",

    preparationDigest:
      DIGEST_C,

    sourceInquiryReviewDecisionId:
      "decision-asha-limited-pilot-inquiry-one-review-001",

    sourceInquiryReviewDecisionDigest:
      DIGEST_D,

    sourceInquiryExecutionId:
      "execution-asha-limited-internal-pilot-inquiry-one-001",

    sourceInquiryExecutionDigest:
      DIGEST_E,

    runtimeIssuanceId:
      "issuance-asha-owner-activated-runtime-001",

    runtimeIssuanceDigest:
      DIGEST_F,

    runtimeId:
      "runtime-asha-owner-activated-001",

    runtimeDigest:
      DIGEST_ONE,

    qualifiedManifestDigest:
      DIGEST_TWO,

    tenantId:
      "tenant-ppa-industrial-solution",

    ownerId:
      "owner-prashant-srivastav",

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION" as const,

    inquiryThreePreparationApproved:
      true,

    inquiryThreeExecutionAuthorized:
      false as const,

    reason:
      "Owner verified the complete Inquiry 2 sandbox evidence and approved preparation of Inquiry 3 only; execution remains separately blocked.",

    reviewedEvidence: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        "VERIFIED_URGENCY_WITHOUT_EXAGGERATION" as const,

      reviewedInquirySequence:
        2 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacity:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_INQUIRY" as const,

      toolId:
        "tool-inquiry-draft" as const,

      toolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      controlledInquiryOutcome:
        "CREATED" as const,

      controlledInquiryStatus:
        "NEW" as const,

      recommendationStatus:
        "NOT_GENERATED" as const,

      urgencyMustBeVerifiedBeforeClaiming:
        true as const,

      urgencyExaggerationProhibited:
        true as const,

      falseScarcityOrPressureProhibited:
        true as const,

      evidenceBasedClarificationRequired:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      naturalProfessionalToneRequired:
        true as const,

      ownerEscalationOnUncertaintyRequired:
        true as const,

      humanImpersonationAuthorized:
        false as const,
    },

    authorityBoundary: {
      limitedInternalPilotInquiryTwoExecutionBound:
        true as const,

      limitedInternalPilotInquiryTwoExecutionIntegrityVerified:
        true as const,

      controlledInquiryReceiptIntegrityVerified:
        true as const,

      ownerExecutionDecisionBound:
        true as const,

      inquiryTwoPreparationBound:
        true as const,

      sourceInquiryOneReviewDecisionBound:
        true as const,

      sourceInquiryOneExecutionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      inquiryTwoReviewed:
        true as const,

      ownerDecisionRequired:
        true as const,

      approvalBypassAllowed:
        false as const,

      inquiryThreePreparationAuthorized:
        true,

      inquiryThreeExecutionAuthorized:
        false as const,

      concurrentInquiryExecutionAuthorized:
        false as const,

      limitedInternalPilotCompleted:
        false as const,

      realCustomerInquiryAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      customerContactAuthorized:
        false as const,

      recommendationGenerationAuthorized:
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

      autonomousDecisionAuthorized:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      monitoringRequired:
        true as const,

      ownerReviewAfterInquiryThreeRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE" as const,

    decidedAt:
      "2026-07-16T00:00:05.000Z",

    ...overrides,
  };

  return rebindDecisionDigest(
    core as unknown as AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision,
  );
}

function preparationInput(
  overrides: {
    preparationId?: string;
    preparedAt?: string;
    source?: AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision;
  } = {},
) {
  return {
    preparationId:
      overrides.preparationId ??
      "preparation-asha-limited-pilot-inquiry-three-001",

    ownerLimitedInternalPilotInquiryTwoReviewDecision:
      overrides.source ??
      approvedInquiryTwoReviewDecision(),

    preparedAt:
      overrides.preparedAt ??
      "2026-07-16T00:00:06.000Z",
  };
}

describe(
  "Asha limited internal pilot inquiry three preparation",
  () => {
    it(
      "prepares inquiry three without executing or creating it",
      () => {
        const result =
          createAshaLimitedInternalPilotInquiryThreePreparation(
            preparationInput(),
          );

        expect(result.version).toBe(
          ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_VERSION,
        );

        expect(result.preparationState).toBe(
          "LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARED",
        );

        expect(
          result.authorityBoundary.inquiryThreePrepared,
        ).toBe(true);

        expect(
          result.authorityBoundary.inquiryThreeExecutionAuthorized,
        ).toBe(false);

        expect(
          result.authorityBoundary.syntheticInquiryCreated,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION",
        );
      },
    );

    it(
      "locks the exact third pilot scenario and bounded final sequence",
      () => {
        const result =
          createAshaLimitedInternalPilotInquiryThreePreparation(
            preparationInput(),
          );

        expect(
          result.preparedInquiry,
        ).toEqual({
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

          remainingInquiryCapacityBeforeExecution:
            1,

          projectedRemainingInquiryCapacityAfterExecution:
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
        });
      },
    );

    it(
      "locks safe customer context continuity without cross-tenant or cross-customer reuse",
      () => {
        const result =
          createAshaLimitedInternalPilotInquiryThreePreparation(
            preparationInput(),
          );

        expect(
          result.customerContextContinuityExpectation,
        ).toEqual({
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
        });
      },
    );

    it(
      "binds the exact Day 33 decision and complete upstream identity chain",
      () => {
        const source =
          approvedInquiryTwoReviewDecision();

        const result =
          createAshaLimitedInternalPilotInquiryThreePreparation(
            preparationInput({
              source,
            }),
          );

        expect(
          result.sourceInquiryTwoReviewDecisionId,
        ).toBe(source.decisionId);

        expect(
          result.sourceInquiryTwoReviewDecisionDigest,
        ).toBe(source.decisionDigest);

        expect(
          result.sourceInquiryTwoExecutionId,
        ).toBe(
          source.limitedInternalPilotInquiryTwoExecutionId,
        );

        expect(
          result.inquiryTwoPreparationId,
        ).toBe(source.preparationId);

        expect(result.runtimeId).toBe(
          source.runtimeId,
        );

        expect(result.tenantId).toBe(
          source.tenantId,
        );

        expect(result.ownerId).toBe(
          source.ownerId,
        );

        expect(
          result.qualifiedManifestDigest,
        ).toBe(
          source.qualifiedManifestDigest,
        );
      },
    );

    it(
      "keeps pilot architecture uninvoked and every real-world autonomous authority blocked",
      () => {
        const result =
          createAshaLimitedInternalPilotInquiryThreePreparation(
            preparationInput(),
          );

        expect(
          result.existingPilotArchitectureBridge,
        ).toMatchObject({
          duplicatePilotEngineCreated:
            false,

          enrollmentInvoked:
            false,

          accessGranted:
            false,

          pilotControlInvoked:
            false,

          healthObservationInvoked:
            false,

          operationAdmissionClaimed:
            false,
        });

        expect(
          result.authorityBoundary,
        ).toMatchObject({
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

          monitoringRequired:
            true,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "rejects a Day 33 decision that did not authorize inquiry three preparation",
      () => {
        const rejected =
          approvedInquiryTwoReviewDecision({
            decision:
              "REJECT_AND_RETAIN_INQUIRY_TWO_ONLY",

            inquiryThreePreparationApproved:
              false,

            authorityBoundary: {
              ...approvedInquiryTwoReviewDecision()
                .authorityBoundary,

              inquiryThreePreparationAuthorized:
                false,
            },

            nextStep:
              "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_ONLY",
          });

        expect(
          () =>
            createAshaLimitedInternalPilotInquiryThreePreparation(
              preparationInput({
                source:
                  rejected,
              }),
            ),
        ).toThrow(
          "An approved Workforce Day 33 inquiry-two review decision is required.",
        );
      },
    );

    it(
      "rejects tampered review evidence and preparation before the owner decision",
      () => {
        const valid =
          approvedInquiryTwoReviewDecision();

        const tampered =
          rebindDecisionDigest({
            ...valid,

            reviewedEvidence: {
              ...valid.reviewedEvidence,

              remainingInquiryCapacity:
                (2 as unknown as 1),
            },
          });

        expect(
          () =>
            createAshaLimitedInternalPilotInquiryThreePreparation(
              preparationInput({
                source:
                  tampered,
              }),
            ),
        ).toThrow(
          "Inquiry two reviewed evidence is invalid.",
        );

        expect(
          () =>
            createAshaLimitedInternalPilotInquiryThreePreparation(
              preparationInput({
                preparedAt:
                  "2026-07-16T00:00:04.000Z",
              }),
            ),
        ).toThrow(
          "Inquiry three preparation cannot precede the inquiry two owner review decision.",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects secret-bearing preparation identity",
      () => {
        const first =
          createAshaLimitedInternalPilotInquiryThreePreparation(
            preparationInput(),
          );

        const second =
          createAshaLimitedInternalPilotInquiryThreePreparation(
            preparationInput(),
          );

        expect(first).toEqual(
          second,
        );

        const digestCore = {
          ...first,
        } as Record<string, unknown>;

        delete digestCore.preparationDigest;

        expect(
          first.preparationDigest,
        ).toBe(
          sha256(digestCore),
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.preparedInquiry,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.customerContextContinuityExpectation,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(
          () =>
            createAshaLimitedInternalPilotInquiryThreePreparation(
              preparationInput({
                preparationId:
                  "preparation-secret-token",
              }),
            ),
        ).toThrow(
          "Inquiry three preparation identity is invalid or secret-bearing.",
        );
      },
    );
  },
);
