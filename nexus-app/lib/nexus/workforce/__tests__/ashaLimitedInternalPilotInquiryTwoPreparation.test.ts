import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISION_VERSION,
  type AshaOwnerLimitedInternalPilotInquiryReviewDecision,
} from "../ashaOwnerLimitedInternalPilotInquiryReviewDecision";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_VERSION,
  createAshaLimitedInternalPilotInquiryTwoPreparation,
} from "../ashaLimitedInternalPilotInquiryTwoPreparation";

const DECIDED_AT =
  "2026-07-16T00:00:01.000Z";

const PREPARED_AT =
  "2026-07-16T00:00:02.000Z";

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

function approvedInquiryOneReviewDecision():
  AshaOwnerLimitedInternalPilotInquiryReviewDecision {
  const decisionCore = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISION_VERSION,

    decisionId:
      "decision-asha-limited-pilot-inquiry-one-review-001",

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_RECORDED" as const,

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

    limitedInternalPilotInquiryExecutionId:
      "execution-asha-limited-internal-pilot-inquiry-001",

    limitedInternalPilotInquiryExecutionDigest:
      "1".repeat(64),

    ownerExecutionDecisionId:
      "decision-asha-limited-internal-pilot-execution-001",

    ownerExecutionDecisionDigest:
      "2".repeat(64),

    runtimeIssuanceId:
      "issuance-asha-owner-activated-runtime-001",

    runtimeIssuanceDigest:
      "3".repeat(64),

    runtimeId:
      "runtime-asha-owner-activated-001",

    runtimeDigest:
      "4".repeat(64),

    qualifiedManifestDigest:
      "5".repeat(64),

    tenantId:
      "tenant-ppa-industrial-solution",

    ownerId:
      "owner-prashant",

    decision:
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_INQUIRY_PREPARATION" as const,

    nextInquiryPreparationApproved:
      true,

    inquiryTwoExecutionAuthorized:
      false as const,

    reason:
      "Owner verified inquiry one evidence and approved preparation for the next bounded synthetic inquiry only.",

    reviewedEvidence: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        "INCOMPLETE_REQUIREMENT_CLARIFICATION" as const,

      reviewedInquirySequence:
        1 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacity:
        2 as const,

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
    },

    authorityBoundary: {
      limitedInternalPilotInquiryExecutionBound:
        true as const,

      limitedInternalPilotInquiryExecutionIntegrityVerified:
        true as const,

      controlledInquiryReceiptIntegrityVerified:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      inquiryOneReviewed:
        true as const,

      ownerDecisionRequired:
        true as const,

      approvalBypassAllowed:
        false as const,

      nextInquiryPreparationAuthorized:
        true,

      inquiryTwoExecutionAuthorized:
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

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO" as const,

    decidedAt:
      DECIDED_AT,
  };

  return {
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  };
}

function preparationInput() {
  return {
    preparationId:
      "preparation-asha-limited-internal-pilot-inquiry-two-001",

    ownerLimitedInternalPilotInquiryReviewDecision:
      approvedInquiryOneReviewDecision(),

    preparedAt:
      PREPARED_AT,
  };
}

describe(
  "Asha limited internal pilot inquiry two preparation",
  () => {
    it(
      "prepares inquiry two without executing or creating it",
      () => {
        const preparation =
          createAshaLimitedInternalPilotInquiryTwoPreparation(
            preparationInput(),
          );

        expect(preparation.version).toBe(
          ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_VERSION,
        );

        expect(preparation.preparationState).toBe(
          "LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARED",
        );

        expect(
          preparation.authorityBoundary
            .inquiryTwoPrepared,
        ).toBe(true);

        expect(
          preparation.authorityBoundary
            .inquiryTwoExecutionAuthorized,
        ).toBe(false);

        expect(
          preparation.authorityBoundary
            .syntheticInquiryCreated,
        ).toBe(false);

        expect(preparation.nextStep).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION",
        );
      },
    );

    it(
      "locks the exact second pilot scenario and bounded sequence",
      () => {
        const preparation =
          createAshaLimitedInternalPilotInquiryTwoPreparation(
            preparationInput(),
          );

        expect(preparation.preparedInquiry).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          dataClass:
            "SYNTHETIC_SANITIZED_ONLY",

          actorClass:
            "OWNER_SUPERVISED_INTERNAL_ONLY",

          scenarioId:
            "VERIFIED_URGENCY_WITHOUT_EXAGGERATION",

          inquirySequence:
            2,

          priorReviewedInquirySequence:
            1,

          maximumInquiryCount:
            3,

          remainingInquiryCapacityBeforeExecution:
            2,

          projectedRemainingInquiryCapacityAfterExecution:
            1,

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
      "binds exact Day 29 decision execution runtime tenant owner and manifest evidence",
      () => {
        const source =
          approvedInquiryOneReviewDecision();

        const preparation =
          createAshaLimitedInternalPilotInquiryTwoPreparation({
            ...preparationInput(),

            ownerLimitedInternalPilotInquiryReviewDecision:
              source,
          });

        expect(
          preparation.sourceInquiryReviewDecisionId,
        ).toBe(source.decisionId);

        expect(
          preparation.sourceInquiryReviewDecisionDigest,
        ).toBe(source.decisionDigest);

        expect(
          preparation.sourceInquiryExecutionId,
        ).toBe(
          source.limitedInternalPilotInquiryExecutionId,
        );

        expect(
          preparation.sourceInquiryExecutionDigest,
        ).toBe(
          source.limitedInternalPilotInquiryExecutionDigest,
        );

        expect(preparation.runtimeId).toBe(
          source.runtimeId,
        );

        expect(preparation.tenantId).toBe(
          source.tenantId,
        );

        expect(preparation.ownerId).toBe(
          source.ownerId,
        );
      },
    );

    it(
      "locks verified urgency behavior and keeps pilot architecture uninvoked",
      () => {
        const preparation =
          createAshaLimitedInternalPilotInquiryTwoPreparation(
            preparationInput(),
          );

        expect(
          preparation.humanLikeScenarioExpectation,
        ).toEqual({
          urgencyMustBeVerifiedBeforeClaiming:
            true,

          urgencyExaggerationProhibited:
            true,

          falseScarcityOrPressureProhibited:
            true,

          evidenceBasedClarificationRequired:
            true,

          transparentAIIdentityRequired:
            true,

          naturalProfessionalToneRequired:
            true,

          ownerEscalationOnUncertaintyRequired:
            true,

          responseGenerationPerformed:
            false,

          humanImpersonationAuthorized:
            false,
        });

        expect(
          preparation.existingPilotArchitectureBridge,
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
      },
    );

    it(
      "keeps every real-world and autonomous authority blocked",
      () => {
        const preparation =
          createAshaLimitedInternalPilotInquiryTwoPreparation(
            preparationInput(),
          );

        expect(
          preparation.authorityBoundary,
        ).toMatchObject({
          inquiryOneOwnerReviewApproved:
            true,

          inquiryTwoPreparationAuthorized:
            true,

          inquiryTwoPrepared:
            true,

          inquiryTwoExecutionAuthorized:
            false,

          concurrentInquiryExecutionAuthorized:
            false,

          limitedInternalPilotCompleted:
            false,

          syntheticInquiryCreated:
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

          monitoringRequired:
            true,

          ownerReviewAfterInquiryTwoRequired:
            true,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "rejects an owner decision that did not approve inquiry two preparation",
      () => {
        const source =
          approvedInquiryOneReviewDecision();

        const rejectedCore = {
          ...source,

          decision:
            "REJECT_AND_RETAIN_INQUIRY_ONE_ONLY" as const,

          nextInquiryPreparationApproved:
            false,

          authorityBoundary: {
            ...source.authorityBoundary,

            nextInquiryPreparationAuthorized:
              false,
          },

          nextStep:
            "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_ONE_ONLY" as const,
        };

        const {
          decisionDigest: _discardedDigest,
          ...core
        } = rejectedCore;

        const rejected = {
          ...core,

          decisionDigest:
            sha256(core),
        } as AshaOwnerLimitedInternalPilotInquiryReviewDecision;

        expect(() =>
          createAshaLimitedInternalPilotInquiryTwoPreparation({
            ...preparationInput(),

            ownerLimitedInternalPilotInquiryReviewDecision:
              rejected,
          }),
        ).toThrow(
          "An approved Workforce Day 29 inquiry one owner review decision is required.",
        );
      },
    );

    it(
      "rejects tampered Day 29 evidence and preparation before the owner decision",
      () => {
        const source =
          approvedInquiryOneReviewDecision();

        expect(() =>
          createAshaLimitedInternalPilotInquiryTwoPreparation({
            ...preparationInput(),

            ownerLimitedInternalPilotInquiryReviewDecision: {
              ...source,

              decisionDigest:
                "f".repeat(64),
            },
          }),
        ).toThrow(
          "Workforce Day 29 inquiry one owner review decision integrity verification failed.",
        );

        expect(() =>
          createAshaLimitedInternalPilotInquiryTwoPreparation({
            ...preparationInput(),

            preparedAt:
              "2026-07-16T00:00:00.000Z",
          }),
        ).toThrow(
          "Inquiry two preparation cannot precede the inquiry one owner review decision.",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects secret-bearing preparation identity",
      () => {
        const first =
          createAshaLimitedInternalPilotInquiryTwoPreparation(
            preparationInput(),
          );

        const second =
          createAshaLimitedInternalPilotInquiryTwoPreparation(
            preparationInput(),
          );

        expect(first).toEqual(second);
        expect(first.preparationDigest).toBe(
          second.preparationDigest,
        );

        expect(Object.isFrozen(first)).toBe(true);
        expect(
          Object.isFrozen(first.preparedInquiry),
        ).toBe(true);
        expect(
          Object.isFrozen(
            first.humanLikeScenarioExpectation,
          ),
        ).toBe(true);
        expect(
          Object.isFrozen(
            first.existingPilotArchitectureBridge,
          ),
        ).toBe(true);
        expect(
          Object.isFrozen(first.authorityBoundary),
        ).toBe(true);

        const {
          preparationDigest,
          ...preparationCore
        } = first;

        expect(sha256(preparationCore)).toBe(
          preparationDigest,
        );

        expect(() =>
          createAshaLimitedInternalPilotInquiryTwoPreparation({
            ...preparationInput(),

            preparationId:
              "preparation-secret-token-001",
          }),
        ).toThrow(
          "Inquiry two preparation identity must be a canonical safe identifier.",
        );
      },
    );
  },
);
