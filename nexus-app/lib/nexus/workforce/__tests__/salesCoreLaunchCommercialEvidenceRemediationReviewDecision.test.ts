import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision,
} from "../ashaOwnerLimitedInternalPilotInquiryThreeReviewDecision";

import type {
  RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
} from "../riyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision";

import type {
  SalesCoreLaunchEvidenceDefectContainmentRecord,
} from "../salesCoreLaunchEvidenceDefectContainmentRecord";

import {
  createSalesCoreLaunchCommercialEvidenceRemediationRecord,
  validateSalesCoreLaunchCommercialEvidenceRemediationRecord,
  type CreateSalesCoreLaunchCommercialEvidenceRemediationRecordInput,
  type SalesCoreLaunchCommercialEvidenceRemediationRecord,
} from "../salesCoreLaunchCommercialEvidenceRemediationRecord";

import {
  createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision,
  validateSalesCoreLaunchCommercialEvidenceRemediationReviewDecision,
  type CreateSalesCoreLaunchCommercialEvidenceRemediationReviewDecisionInput,
  type SalesCoreLaunchCommercialEvidenceRemediationReviewDecision,
} from "../salesCoreLaunchCommercialEvidenceRemediationReviewDecision";
function canonicalize(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
            canonicalize(item),
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
            canonicalize(
              record[key],
            ),
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
      canonicalize(value),
      "utf8",
    )
    .digest("hex");
}

function signRecord<
  T extends Record<string, unknown>,
>(
  core: T,
  digestField: string,
): T {
  return {
    ...core,
    [digestField]:
      sha256(core),
  } as T;
}

function resignRecord<
  T extends Record<string, unknown>,
>(
  record: T,
  digestField: string,
): T {
  const unsigned = {
    ...record,
  } as Record<string, unknown>;

  delete unsigned[digestField];

  return {
    ...unsigned,
    [digestField]:
      sha256(unsigned),
  } as T;
}

function createInput():
  CreateSalesCoreLaunchCommercialEvidenceRemediationRecordInput {
  const tenantId =
    "tenant-ppa-industrial-solution";

  const ownerId =
    "owner-prashant-srivastav";

  const asha =
    signRecord(
      {
        decisionId:
          "asha-inquiry-three-review-001",

        decisionState:
          "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_RECORDED" as const,

        employeeId:
          "employee-asha-inquiry-intake-v1" as const,

        tenantId,
        ownerId,

        limitedInternalPilotInquiryThreeExecutionId:
          "asha-inquiry-three-execution-001",

        limitedInternalPilotInquiryThreeExecutionDigest:
          "2".repeat(64),

        decision:
          "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" as const,

        limitedInternalPilotCompleted:
          true as const,

        reviewedEvidence: {
          scenarioId:
            "SAFE_CUSTOMER_CONTEXT_CONTINUITY" as const,

          dataClass:
            "SYNTHETIC_SANITIZED_ONLY" as const,

          toolMode:
            "DRAFT_ONLY" as const,

          executionMode:
            "SANDBOX_ONLY" as const,

          clarificationBeforeGuessingRequired:
            true as const,

          tenantScopedContextOnly:
            true as const,

          customerScopedContextOnly:
            true as const,
        },

        authorityBoundary: {
          ownerDecisionRequired:
            true as const,

          approvalBypassAllowed:
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

          paymentExecutionAuthorized:
            false as const,

          autonomousDecisionAuthorized:
            false as const,

          publicLaunchAuthorized:
            false as const,
        },

        nextStep:
          "LIMITED_INTERNAL_PILOT_COMPLETE" as const,

        decidedAt:
          "2026-07-16T19:00:00.000Z",
      },
      "decisionDigest",
    ) as unknown as
      AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision;

  const riya =
    signRecord(
      {
        decisionId:
          "riya-recommendation-three-review-001",

        decisionState:
          "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_RECORDED" as const,

        employeeId:
          "employee-riya-recommendation-specialist-v1" as const,

        tenantId,
        ownerId,

        limitedInternalPilotRecommendationThreeExecutionId:
          "riya-recommendation-three-execution-001",

        limitedInternalPilotRecommendationThreeExecutionDigest:
          "3".repeat(64),

        decision:
          "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" as const,

        limitedInternalPilotCompleted:
          true as const,

        reviewedEvidence: {
          scenarioId:
            "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" as const,

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY" as const,

          inquiryEvidenceToolMode:
            "READ_ONLY" as const,

          recommendationToolMode:
            "DRAFT_ONLY" as const,

          executionMode:
            "SANDBOX_ONLY" as const,

          ownerDecisionReserved:
            true as const,

          assumptionsMade:
            false as const,

          unsupportedClaimsIncluded:
            false as const,

          unsupportedFactsInvented:
            false as const,

          customerDeliveryPrepared:
            false as const,

          customerDeliveryExecuted:
            false as const,

          realCustomerDataUsed:
            false as const,

          crossCustomerEvidenceUsed:
            false as const,

          crossTenantEvidenceUsed:
            false as const,
        },

        authorityBoundary: {
          ownerDecisionRequired:
            true as const,

          approvalBypassAllowed:
            false as const,

          recommendationCustomerDeliveryAuthorized:
            false as const,

          realCustomerDataAccessAuthorized:
            false as const,

          realCustomerContactAuthorized:
            false as const,

          externalDeliveryAuthorized:
            false as const,

          liveProviderExecutionAuthorized:
            false as const,

          paymentExecutionAuthorized:
            false as const,

          autonomousDecisionAuthorized:
            false as const,

          publicLaunchAuthorized:
            false as const,
        },

        nextStep:
          "LIMITED_INTERNAL_PILOT_COMPLETE" as const,

        decidedAt:
          "2026-07-16T19:30:02.000Z",
      },
      "decisionDigest",
    ) as unknown as
      RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision;

  const containment =
    signRecord(
      {
        containmentId:
          "sales-core-launch-containment-001",

        containmentState:
          "SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINED" as const,

        affectedEmployeeId:
          "employee-meera-quotation-proposal-specialist-v1" as const,

        affectedEmployeeCode:
          "nx-sales-005" as const,

        tenantId,
        ownerId,

        sourceChain: {
          sourceRegistryDigest:
            "1".repeat(64),
        },

        containmentBoundary: {
          historicalRecordsMutated:
            false as const,

          sourceDigestsPreserved:
            true as const,

          runtimeActivationPreparationEligible:
            false as const,

          runtimeActivationAuthorized:
            false as const,

          runtimeActivationExecuted:
            false as const,

          runtimeActivated:
            false as const,

          controlledWorkAuthorized:
            false as const,

          productionAuthorityGranted:
            false as const,

          realCustomerDataAccessAuthorized:
            false as const,

          realCustomerContactAuthorized:
            false as const,

          externalDeliveryAuthorized:
            false as const,

          liveProviderExecutionAuthorized:
            false as const,

          paymentExecutionAuthorized:
            false as const,

          autonomousExecutionAuthorized:
            false as const,

          publicLaunchAuthorized:
            false as const,

          remediationRequired:
            true as const,

          ownerReapprovalRequiredAfterRemediation:
            true as const,
        },

        nextStep:
          "REMEDIATE_MEERA_COMMERCIAL_EVIDENCE_AND_REQUALIFY_SALES_CORE_LAUNCH" as const,

        detectedAt:
          "2026-07-18T10:00:00.000Z",
      },
      "containmentDigest",
    ) as unknown as
      SalesCoreLaunchEvidenceDefectContainmentRecord;

  return {
    remediationId:
      "sales-core-commercial-remediation-001",

    containmentRecord:
      containment,

    ashaInquiryReviewDecision:
      asha,

    riyaRecommendationReviewDecision:
      riya,

    reason:
      "Create additive digest-bound Meera commercial evidence without modifying historical records.",

    remediatedAt:
      "2026-07-19T10:00:00.000Z",
  };
}

function createReviewInput(
  overrides:
    Partial<CreateSalesCoreLaunchCommercialEvidenceRemediationReviewDecisionInput> = {},
): CreateSalesCoreLaunchCommercialEvidenceRemediationReviewDecisionInput {
  const remediation =
    createSalesCoreLaunchCommercialEvidenceRemediationRecord(
      createInput(),
    );

  return {
    decisionId:
      "sales-core-commercial-remediation-review-001",

    commercialEvidenceRemediation:
      remediation,

    ownerId:
      remediation.ownerId,

    decision:
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_FOR_CONTROLLED_REQUALIFICATION_PREPARATION",

    reason:
      "Owner approves controlled Meera commercial evidence requalification preparation only.",

    reviewedAt:
      "2026-07-19T10:00:01.000Z",

    ...overrides,
  };
}

describe(
  "salesCoreLaunchCommercialEvidenceRemediationReviewDecision",
  () => {
    it(
      "approves controlled requalification preparation only",
      () => {
        const result =
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            createReviewInput(),
          );

        expect(result.decisionState)
          .toBe(
            "OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_RECORDED",
          );

        expect(
          result.approvedForControlledRequalificationPreparation,
        ).toBe(true);

        expect(result.nextStep)
          .toBe(
            "PREPARE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION",
          );

        expect(
          result.authorityBoundary
            .controlledRequalificationPreparationAuthorized,
        ).toBe(true);
      },
    );

    it(
      "records rejection without authorizing preparation",
      () => {
        const result =
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            createReviewInput({
              decision:
                "REJECT_AND_RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY",

              reason:
                "Owner rejects the remediation and retains the bounded draft for correction.",
            }),
          );

        expect(
          result.approvedForControlledRequalificationPreparation,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .controlledRequalificationPreparationAuthorized,
        ).toBe(false);

        expect(result.nextStep)
          .toBe(
            "RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY",
          );
      },
    );

    it(
      "reviews the complete unresolved commercial contract without invented values",
      () => {
        const evidence =
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            createReviewInput(),
          ).reviewedEvidence;

        expect(
          evidence.commercialContractFieldsPresent,
        ).toBe(true);

        expect(
          evidence.commercialValuesInvented,
        ).toBe(false);

        expect(
          evidence.verifiedCommercialItemCount,
        ).toBe(0);

        expect(
          evidence.pricedLineItemCount,
        ).toBe(0);

        expect(
          evidence.unresolvedPricingInputCount,
        ).toBe(4);

        expect(
          evidence.missingCommercialEvidenceCount,
        ).toBe(6);

        expect(
          evidence.pricedCustomerQuotationEligible,
        ).toBe(false);
      },
    );

    it(
      "keeps execution qualification activation production delivery payment and launch blocked",
      () => {
        const boundary =
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            createReviewInput(),
          ).authorityBoundary;

        expect(
          boundary.controlledRequalificationExecutionAuthorized,
        ).toBe(false);

        expect(
          boundary.formalQualificationEngineInvocationAuthorized,
        ).toBe(false);

        expect(
          boundary.meeraCommercialEvidenceRequalified,
        ).toBe(false);

        expect(
          boundary.salesCoreLaunchRequalificationEligible,
        ).toBe(false);

        expect(
          boundary.runtimeActivationAuthorized,
        ).toBe(false);

        expect(
          boundary.productionAuthorityGranted,
        ).toBe(false);

        expect(
          boundary.externalDeliveryAuthorized,
        ).toBe(false);

        expect(
          boundary.paymentExecutionAuthorized,
        ).toBe(false);

        expect(
          boundary.publicLaunchAuthorized,
        ).toBe(false);
      },
    );

    it(
      "rejects integrity-tampered remediation evidence",
      () => {
        const input =
          createReviewInput();

        const tampered = {
          ...input.commercialEvidenceRemediation,

          ownerId:
            "owner-unauthorized",
        };

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision({
            ...input,

            commercialEvidenceRemediation:
              tampered,
          }),
        ).toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "rejects review by a different owner",
      () => {
        expect(() =>
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            createReviewInput({
              ownerId:
                "owner-another-tenant",
            }),
          ),
        ).toThrow(
          "Only the commercial-remediation-bound owner",
        );
      },
    );

    it(
      "rejects review before remediation creation",
      () => {
        expect(() =>
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            createReviewInput({
              reviewedAt:
                "2026-07-19T09:59:59.999Z",
            }),
          ),
        ).toThrow(
          "cannot precede remediation creation",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and blocks re-signed authority escalation",
      () => {
        const input =
          createReviewInput();

        const first =
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            input,
          );

        const second =
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            input,
          );

        expect(second).toEqual(first);

        expect(first.decisionDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(first))
          .toBe(true);

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

        const unsigned = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            runtimeActivationAuthorized:
              true,
          },
        } as unknown as
          Record<string, unknown>;

        delete unsigned.decisionDigest;

        const escalated = {
          ...unsigned,

          decisionDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchCommercialEvidenceRemediationReviewDecision;

        expect(() =>
          validateSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            escalated,
          ),
        ).toThrow(
          "Sales core launch commercial-remediation review decision is invalid.",
        );
      },
    );
  },
);
