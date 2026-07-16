import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_VERSION,
  type AshaLimitedInternalPilotInquiryTwoPreparation,
} from "../ashaLimitedInternalPilotInquiryTwoPreparation";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_VERSION,
  createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision,
} from "../ashaOwnerLimitedInternalPilotInquiryTwoExecutionDecision";

const PREPARED_AT =
  "2026-07-16T00:00:02.000Z";

const DECIDED_AT =
  "2026-07-16T00:00:03.000Z";

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

function inquiryTwoPreparation():
  AshaLimitedInternalPilotInquiryTwoPreparation {
  const core = {
    version:
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_VERSION,

    preparationId:
      "preparation-asha-limited-internal-pilot-inquiry-two-001",

    preparationState:
      "LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARED" as const,

    sourceInquiryReviewDecisionId:
      "decision-asha-limited-pilot-inquiry-one-review-001",

    sourceInquiryReviewDecisionDigest:
      "1".repeat(64),

    sourceInquiryExecutionId:
      "execution-asha-limited-internal-pilot-inquiry-001",

    sourceInquiryExecutionDigest:
      "2".repeat(64),

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

    preparedInquiry: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        "VERIFIED_URGENCY_WITHOUT_EXAGGERATION" as const,

      inquirySequence:
        2 as const,

      priorReviewedInquirySequence:
        1 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacityBeforeExecution:
        2 as const,

      projectedRemainingInquiryCapacityAfterExecution:
        1 as const,

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
      sourceInquiryReviewDecisionBound:
        true as const,

      sourceInquiryReviewDecisionIntegrityVerified:
        true as const,

      sourceInquiryExecutionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      inquiryOneOwnerReviewApproved:
        true as const,

      inquiryTwoPreparationAuthorized:
        true as const,

      inquiryTwoPrepared:
        true as const,

      inquiryTwoExecutionAuthorized:
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

      ownerReviewAfterInquiryTwoRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION" as const,

    preparedAt:
      PREPARED_AT,
  };

  return {
    ...core,

    preparationDigest:
      sha256(core),
  };
}

function approvedInput() {
  return {
    limitedInternalPilotInquiryTwoPreparation:
      inquiryTwoPreparation(),

    decisionId:
      "decision-asha-limited-pilot-inquiry-two-execution-001",

    ownerId:
      "owner-prashant",

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION" as const,

    reason:
      "Owner approved only the bounded synthetic sandbox execution of inquiry two after reviewing its exact preparation evidence.",

    decidedAt:
      DECIDED_AT,
  };
}

describe(
  "Asha owner limited internal pilot inquiry two execution decision",
  () => {
    it(
      "records owner approval without performing inquiry two execution",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision(
            approvedInput(),
          );

        expect(result.version).toBe(
          ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_VERSION,
        );

        expect(result.decisionState).toBe(
          "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_RECORDED",
        );

        expect(
          result.approvedForInquiryTwoExecution,
        ).toBe(true);

        expect(
          result.authorityBoundary
            .inquiryTwoExecutionAuthorized,
        ).toBe(true);

        expect(
          result.authorityBoundary
            .inquiryTwoExecutionPerformed,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .syntheticInquiryExecutionPerformed,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "EXECUTE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO",
        );
      },
    );

    it(
      "binds exact Day 30 preparation execution runtime tenant owner and manifest evidence",
      () => {
        const source =
          inquiryTwoPreparation();

        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision({
            ...approvedInput(),

            limitedInternalPilotInquiryTwoPreparation:
              source,
          });

        expect(result.preparationId).toBe(
          source.preparationId,
        );

        expect(result.preparationDigest).toBe(
          source.preparationDigest,
        );

        expect(
          result.sourceInquiryReviewDecisionId,
        ).toBe(
          source.sourceInquiryReviewDecisionId,
        );

        expect(
          result.sourceInquiryExecutionId,
        ).toBe(
          source.sourceInquiryExecutionId,
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
      "preserves the exact verified urgency scenario and human-like safety standard",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision(
            approvedInput(),
          );

        expect(
          result.reviewedInquiryTwoPreparation,
        ).toEqual({
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

          urgencyVerificationStandardBound:
            true,

          urgencyExaggerationProhibited:
            true,

          falseScarcityOrPressureProhibited:
            true,

          transparentAIIdentityRequired:
            true,

          humanImpersonationAuthorized:
            false,

          existingPilotArchitectureBound:
            true,
        });
      },
    );

    it(
      "authorizes only future inquiry two execution while blocking inquiry three and every real-world action",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision(
            approvedInput(),
          );

        expect(
          result.authorityBoundary,
        ).toMatchObject({
          sourceInquiryTwoPreparationIntegrityVerified:
            true,

          exactEmployeeIdentityBound:
            true,

          exactTenantBound:
            true,

          exactOwnerBound:
            true,

          exactRuntimeBound:
            true,

          exactQualifiedManifestBound:
            true,

          inquiryOneOwnerReviewApprovalBound:
            true,

          inquiryTwoPreparationBound:
            true,

          inquiryTwoExecutionDecisionRecorded:
            true,

          approvalBypassAllowed:
            false,

          inquiryTwoExecutionAuthorized:
            true,

          inquiryTwoExecutionPerformed:
            false,

          syntheticInquiryExecutionPerformed:
            false,

          concurrentInquiryExecutionAuthorized:
            false,

          inquiryThreePreparationAuthorized:
            false,

          inquiryThreeExecutionAuthorized:
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

          ownerReviewAfterInquiryTwoRequired:
            true,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "records rejection without authorizing or performing inquiry two execution",
      () => {
        const result =
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision({
            ...approvedInput(),

            decision:
              "REJECT_AND_RETAIN_INQUIRY_TWO_PREPARATION_ONLY",

            reason:
              "Owner retained inquiry two at preparation because controlled execution evidence was not yet sufficient.",
          });

        expect(
          result.approvedForInquiryTwoExecution,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .inquiryTwoExecutionAuthorized,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .inquiryTwoExecutionPerformed,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_ONLY",
        );
      },
    );

    it(
      "rejects a different owner and a decision before preparation",
      () => {
        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision({
            ...approvedInput(),

            ownerId:
              "owner-different",
          }),
        ).toThrow(
          "Only the preparation-bound owner can issue the inquiry two execution decision.",
        );

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision({
            ...approvedInput(),

            decidedAt:
              "2026-07-16T00:00:01.000Z",
          }),
        ).toThrow(
          "Inquiry two execution decision cannot precede its preparation.",
        );
      },
    );

    it(
      "rejects tampered preparation invalid decisions and secret-bearing reasons",
      () => {
        const source =
          inquiryTwoPreparation();

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision({
            ...approvedInput(),

            limitedInternalPilotInquiryTwoPreparation: {
              ...source,

              preparationDigest:
                "f".repeat(64),
            },
          }),
        ).toThrow(
          "Workforce Day 30 inquiry two preparation integrity verification failed.",
        );

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision({
            ...approvedInput(),

            decision:
              "EXECUTE_NOW",
          } as never),
        ).toThrow(
          "Inquiry two execution decision is invalid.",
        );

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision({
            ...approvedInput(),

            reason:
              "Authorization bearer token must be used.",
          }),
        ).toThrow(
          "Inquiry two execution decision reason must be safe and specific.",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects secret-bearing decision identity",
      () => {
        const first =
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision(
            approvedInput(),
          );

        const second =
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision(
            approvedInput(),
          );

        expect(first).toEqual(second);
        expect(first.decisionDigest).toBe(
          second.decisionDigest,
        );

        expect(Object.isFrozen(first)).toBe(true);
        expect(
          Object.isFrozen(
            first.reviewedInquiryTwoPreparation,
          ),
        ).toBe(true);
        expect(
          Object.isFrozen(first.authorityBoundary),
        ).toBe(true);

        const {
          decisionDigest,
          ...core
        } = first;

        expect(sha256(core)).toBe(
          decisionDigest,
        );

        expect(() =>
          createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision({
            ...approvedInput(),

            decisionId:
              "decision-secret-token-001",
          }),
        ).toThrow(
          "Inquiry two owner execution decision identity must be a canonical safe identifier.",
        );
      },
    );
  },
);
