import { createHash } from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_VERSION,
  type AshaLimitedInternalPilotInquiryThreePreparation,
} from "../ashaLimitedInternalPilotInquiryThreePreparation";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_VERSION,
  createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision,
  type CreateAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecisionInput,
} from "../ashaOwnerLimitedInternalPilotInquiryThreeExecutionDecision";

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

const DIGEST_A = "a".repeat(64);
const DIGEST_B = "b".repeat(64);
const DIGEST_C = "c".repeat(64);
const DIGEST_D = "d".repeat(64);
const DIGEST_E = "e".repeat(64);
const DIGEST_F = "f".repeat(64);
const DIGEST_ONE = "1".repeat(64);
const DIGEST_TWO = "2".repeat(64);
const DIGEST_THREE = "3".repeat(64);

function rebindPreparationDigest(
  value:
    AshaLimitedInternalPilotInquiryThreePreparation,
): AshaLimitedInternalPilotInquiryThreePreparation {
  const core = {
    ...value,
  } as Record<string, unknown>;

  delete core.preparationDigest;

  return {
    ...core,

    preparationDigest:
      sha256(core),
  } as unknown as AshaLimitedInternalPilotInquiryThreePreparation;
}

function inquiryThreePreparation(
  overrides:
    Partial<AshaLimitedInternalPilotInquiryThreePreparation> = {},
): AshaLimitedInternalPilotInquiryThreePreparation {
  const core = {
    version:
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_VERSION,

    preparationId:
      "preparation-asha-limited-pilot-inquiry-three-001",

    preparationState:
      "LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARED" as const,

    sourceInquiryTwoReviewDecisionId:
      "decision-asha-limited-pilot-inquiry-two-review-001",

    sourceInquiryTwoReviewDecisionDigest:
      DIGEST_A,

    sourceInquiryTwoExecutionId:
      "execution-asha-limited-internal-pilot-inquiry-two-001",

    sourceInquiryTwoExecutionDigest:
      DIGEST_B,

    ownerExecutionDecisionId:
      "decision-asha-limited-pilot-inquiry-two-execution-001",

    ownerExecutionDecisionDigest:
      DIGEST_C,

    inquiryTwoPreparationId:
      "preparation-asha-limited-pilot-inquiry-two-001",

    inquiryTwoPreparationDigest:
      DIGEST_D,

    sourceInquiryOneReviewDecisionId:
      "decision-asha-limited-pilot-inquiry-one-review-001",

    sourceInquiryOneReviewDecisionDigest:
      DIGEST_E,

    sourceInquiryOneExecutionId:
      "execution-asha-limited-internal-pilot-inquiry-one-001",

    sourceInquiryOneExecutionDigest:
      DIGEST_F,

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

    runtimeIssuanceId:
      "issuance-asha-owner-activated-runtime-001",

    runtimeIssuanceDigest:
      DIGEST_ONE,

    runtimeId:
      "runtime-asha-owner-activated-001",

    runtimeDigest:
      DIGEST_TWO,

    qualifiedManifestDigest:
      DIGEST_THREE,

    tenantId:
      "tenant-ppa-industrial-solution",

    ownerId:
      "owner-prashant-srivastav",

    preparedInquiry: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        "SAFE_CUSTOMER_CONTEXT_CONTINUITY" as const,

      inquirySequence:
        3 as const,

      priorReviewedInquirySequence:
        2 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacityBeforeExecution:
        1 as const,

      projectedRemainingInquiryCapacityAfterExecution:
        0 as const,

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

    customerContextContinuityExpectation: {
      customerContextContinuityRequired:
        true as const,

      repeatedQuestionAvoidanceRequired:
        true as const,

      clarificationBeforeGuessingRequired:
        true as const,

      promiseAndFollowUpTrackingRequired:
        true as const,

      uncertaintyEscalatesToOwner:
        true as const,

      tenantScopedContextOnly:
        true as const,

      customerScopedContextOnly:
        true as const,

      crossTenantContextReuseAuthorized:
        false as const,

      crossCustomerContextReuseAuthorized:
        false as const,

      responseGenerationPerformed:
        false as const,

      humanImpersonationAuthorized:
        false as const,
    },

    existingPilotArchitectureBridge: {
      duplicatePilotEngineCreated:
        false as const,

      enrollmentModule:
        "lib/nexus/pilot/authenticatedControlledPilotEnrollment" as const,

      enrollmentFunction:
        "enrollAuthenticatedControlledPilot" as const,

      accessModule:
        "lib/nexus/pilot/authenticatedControlledPilotAccess" as const,

      accessFunction:
        "enforceAuthenticatedControlledPilotAccess" as const,

      controlModule:
        "lib/nexus/pilot/authenticatedControlledPilotControl" as const,

      controlFunction:
        "controlAuthenticatedPilot" as const,

      healthModule:
        "lib/nexus/pilot/authenticatedControlledPilotHealth" as const,

      healthFunction:
        "observeAuthenticatedControlledPilotHealth" as const,

      operationAdmissionModule:
        "lib/nexus/pilot/authenticatedControlledPilotOperationAdmission" as const,

      operationAdmissionFunction:
        "admitAuthenticatedPilotOperation" as const,

      enrollmentInvoked:
        false as const,

      accessGranted:
        false as const,

      pilotControlInvoked:
        false as const,

      healthObservationInvoked:
        false as const,

      operationAdmissionClaimed:
        false as const,
    },

    authorityBoundary: {
      sourceInquiryTwoReviewDecisionBound:
        true as const,

      sourceInquiryTwoReviewDecisionIntegrityVerified:
        true as const,

      sourceInquiryTwoExecutionBound:
        true as const,

      sourceInquiryTwoPreparationBound:
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

      inquiryTwoOwnerReviewApproved:
        true as const,

      inquiryThreePreparationAuthorized:
        true as const,

      inquiryThreePrepared:
        true as const,

      inquiryThreeExecutionAuthorized:
        false as const,

      concurrentInquiryExecutionAuthorized:
        false as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticInquiryCreated:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION" as const,

    preparedAt:
      "2026-07-16T00:00:06.000Z",

    ...overrides,
  };

  return rebindPreparationDigest(
    core as unknown as AshaLimitedInternalPilotInquiryThreePreparation,
  );
}

function approvedInput(
  overrides:
    Partial<CreateAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecisionInput> = {},
): CreateAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecisionInput {
  const source =
    inquiryThreePreparation();

  return {
    limitedInternalPilotInquiryThreePreparation:
      source,

    decisionId:
      "decision-asha-limited-pilot-inquiry-three-execution-001",

    ownerId:
      source.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION",

    reason:
      "Owner verified the complete Inquiry 3 preparation and approved only its bounded sandbox execution; all external and autonomous authority remains blocked.",

    decidedAt:
      "2026-07-16T00:00:07.000Z",

    ...overrides,
  };
}

describe(
  "Asha owner limited internal pilot inquiry three execution decision",
  () => {
    it(
      "records owner approval without performing inquiry three execution",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
            approvedInput(),
          );

        expect(result.version).toBe(
          ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_VERSION,
        );

        expect(result.decisionState).toBe(
          "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_RECORDED",
        );

        expect(result.executionApproved).toBe(
          true,
        );

        expect(
          result.inquiryThreeExecutionAuthorized,
        ).toBe(true);

        expect(
          result.authorityBoundary.inquiryThreeExecutionPerformed,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "EXECUTE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE",
        );
      },
    );

    it(
      "records rejection and retains inquiry three preparation only",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
            approvedInput({
              decision:
                "REJECT_AND_RETAIN_INQUIRY_THREE_PREPARATION_ONLY",

              reason:
                "Owner rejected Inquiry 3 execution and retained only the verified preparation evidence for later controlled review.",
            }),
          );

        expect(result.executionApproved).toBe(
          false,
        );

        expect(
          result.inquiryThreeExecutionAuthorized,
        ).toBe(false);

        expect(
          result.authorityBoundary.inquiryThreeExecutionPerformed,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_ONLY",
        );
      },
    );

    it(
      "binds the exact Day 34 preparation and complete upstream identity chain",
      () => {
        const source =
          inquiryThreePreparation();

        const result =
          createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
            approvedInput({
              limitedInternalPilotInquiryThreePreparation:
                source,
            }),
          );

        expect(
          result.inquiryThreePreparationId,
        ).toBe(source.preparationId);

        expect(
          result.inquiryThreePreparationDigest,
        ).toBe(source.preparationDigest);

        expect(
          result.sourceInquiryTwoReviewDecisionId,
        ).toBe(
          source.sourceInquiryTwoReviewDecisionId,
        );

        expect(
          result.sourceInquiryTwoExecutionId,
        ).toBe(
          source.sourceInquiryTwoExecutionId,
        );

        expect(
          result.inquiryTwoPreparationId,
        ).toBe(
          source.inquiryTwoPreparationId,
        );

        expect(result.runtimeId).toBe(
          source.runtimeId,
        );

        expect(result.tenantId).toBe(
          source.tenantId,
        );

        expect(result.ownerId).toBe(
          source.ownerId,
        );
      },
    );

    it(
      "preserves the exact context-continuity scenario and safety standard",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
            approvedInput(),
          );

        expect(
          result.preparedInquiry.scenarioId,
        ).toBe(
          "SAFE_CUSTOMER_CONTEXT_CONTINUITY",
        );

        expect(
          result.preparedInquiry.inquirySequence,
        ).toBe(3);

        expect(
          result.preparedInquiry.projectedRemainingInquiryCapacityAfterExecution,
        ).toBe(0);

        expect(
          result.customerContextContinuityExpectation,
        ).toMatchObject({
          customerContextContinuityRequired:
            true,

          repeatedQuestionAvoidanceRequired:
            true,

          clarificationBeforeGuessingRequired:
            true,

          promiseAndFollowUpTrackingRequired:
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
      "authorizes only future inquiry three execution while blocking every real-world autonomous action",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
            approvedInput(),
          );

        expect(
          result.authorityBoundary,
        ).toMatchObject({
          inquiryThreeExecutionAuthorized:
            true,

          inquiryThreeExecutionPerformed:
            false,

          syntheticInquiryExecutionPerformed:
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

          monitoringRequired:
            true,

          ownerReviewAfterInquiryThreeRequired:
            true,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "rejects a different owner and a decision before preparation",
      () => {
        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
              approvedInput({
                ownerId:
                  "owner-different",
              }),
            ),
        ).toThrow(
          "Only the inquiry-three-bound owner can issue its execution decision.",
        );

        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
              approvedInput({
                decidedAt:
                  "2026-07-16T00:00:05.000Z",
              }),
            ),
        ).toThrow(
          "Inquiry three execution decision cannot precede inquiry three preparation.",
        );
      },
    );

    it(
      "rejects tampered preparation invalid decision and secret-bearing reason",
      () => {
        const valid =
          inquiryThreePreparation();

        const tampered =
          rebindPreparationDigest({
            ...valid,

            preparedInquiry: {
              ...valid.preparedInquiry,

              inquirySequence:
                2 as 3,
            },
          });

        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
              approvedInput({
                limitedInternalPilotInquiryThreePreparation:
                  tampered,
              }),
            ),
        ).toThrow(
          "Inquiry three preparation scope is invalid.",
        );

        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
              approvedInput({
                decision:
                  "INVALID" as never,
              }),
            ),
        ).toThrow(
          "Inquiry three execution decision is invalid.",
        );

        expect(
          () =>
            createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
              approvedInput({
                reason:
                  "Use secret access_token value here.",
              }),
            ),
        ).toThrow(
          "Inquiry three execution decision reason is invalid or secret-bearing.",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects secret-bearing decision identity",
      () => {
        const first =
          createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
            approvedInput(),
          );

        const second =
          createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
            approvedInput(),
          );

        expect(first).toEqual(
          second,
        );

        const digestCore = {
          ...first,
        } as Record<string, unknown>;

        delete digestCore.decisionDigest;

        expect(
          first.decisionDigest,
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
            createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
              approvedInput({
                decisionId:
                  "decision-secret-token",
              }),
            ),
        ).toThrow(
          "Inquiry three owner execution decision identity is invalid or secret-bearing.",
        );
      },
    );
  },
);
