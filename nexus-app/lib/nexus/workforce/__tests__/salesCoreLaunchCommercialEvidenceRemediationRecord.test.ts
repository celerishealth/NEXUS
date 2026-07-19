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

describe(
  "salesCoreLaunchCommercialEvidenceRemediationRecord",
  () => {
    it(
      "creates immutable additive commercial remediation evidence",
      () => {
        const record =
          createSalesCoreLaunchCommercialEvidenceRemediationRecord(
            createInput(),
          );

        expect(record.remediationState)
          .toBe(
            "MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_CREATED",
          );

        expect(record.nextStep)
          .toBe(
            "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW",
          );

        expect(record.remediationDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(record))
          .toBe(true);
      },
    );

    it(
      "creates a transparent composite chain without claiming a historical direct Asha-to-Riya digest link",
      () => {
        const record =
          createSalesCoreLaunchCommercialEvidenceRemediationRecord(
            createInput(),
          );

        expect(
          record.sourceChain
            .historicalDirectAshaToRiyaDigestLinkPresent,
        ).toBe(false);

        expect(
          record.sourceChain
            .remediationCompositeChainCreated,
        ).toBe(true);

        expect(
          record.commercialDraft
            .sourceEvidenceDigest,
        ).toBe(
          record.sourceChain
            .compositeEvidenceDigest,
        );
      },
    );

    it(
      "represents every unresolved commercial field without inventing values",
      () => {
        const draft =
          createSalesCoreLaunchCommercialEvidenceRemediationRecord(
            createInput(),
          ).commercialDraft;

        expect(
          draft.productsAndServices
            .verifiedItems,
        ).toEqual([]);

        expect(
          draft.quantity.verifiedQuantity,
        ).toBeNull();

        expect(
          draft.pricing.lineItems,
        ).toEqual([]);

        expect(
          draft.pricing.currency,
        ).toBeNull();

        expect(
          draft.pricing.subtotal,
        ).toBeNull();

        expect(
          draft.pricing.total,
        ).toBeNull();

        expect(draft.tax.amount)
          .toBeNull();

        expect(draft.freight.amount)
          .toBeNull();

        expect(draft.discount.amount)
          .toBeNull();

        expect(draft.validity.value)
          .toBeNull();

        expect(
          draft.paymentTerms.value,
        ).toBeNull();

        expect(draft.assumptionsMade)
          .toBe(false);

        expect(
          draft.commercialAssumptions,
        ).toEqual([]);

        expect(
          draft.customerCommitmentMade,
        ).toBe(false);
      },
    );

    it(
      "keeps review requalification runtime production delivery payment and launch blocked",
      () => {
        const boundary =
          createSalesCoreLaunchCommercialEvidenceRemediationRecord(
            createInput(),
          ).remediationBoundary;

        expect(
          boundary.ownerReviewRequired,
        ).toBe(true);

        expect(
          boundary.ownerReviewDecisionRecorded,
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
      "rejects stale-digest Asha inquiry evidence",
      () => {
        const input =
          createInput();

        const tampered = {
          ...input.ashaInquiryReviewDecision,

          ownerId:
            "owner-mutated",
        } as unknown as
          AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision;

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceRemediationRecord({
            ...input,

            ashaInquiryReviewDecision:
              tampered,
          }),
        ).toThrow(
          "Asha owner-reviewed inquiry integrity verification failed.",
        );
      },
    );

    it(
      "rejects independently valid cross-tenant Riya evidence",
      () => {
        const input =
          createInput();

        const crossTenant =
          resignRecord(
            {
              ...input
                .riyaRecommendationReviewDecision,

              tenantId:
                "tenant-other",
            } as unknown as
              Record<string, unknown>,
            "decisionDigest",
          ) as unknown as
            RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision;

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceRemediationRecord({
            ...input,

            riyaRecommendationReviewDecision:
              crossTenant,
          }),
        ).toThrow(
          "Commercial remediation tenant or owner binding failed.",
        );
      },
    );

    it(
      "rejects containment that restores runtime preparation eligibility",
      () => {
        const input =
          createInput();

        const escalated =
          resignRecord(
            {
              ...input.containmentRecord,

              containmentBoundary: {
                ...input.containmentRecord
                  .containmentBoundary,

                runtimeActivationPreparationEligible:
                  true,
              },
            } as unknown as
              Record<string, unknown>,
            "containmentDigest",
          ) as unknown as
            SalesCoreLaunchEvidenceDefectContainmentRecord;

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceRemediationRecord({
            ...input,

            containmentRecord:
              escalated,
          }),
        ).toThrow(
          "Sales core launch containment is not eligible for additive remediation.",
        );
      },
    );

    it(
      "rejects a re-signed remediation record that invents pricing",
      () => {
        const record =
          createSalesCoreLaunchCommercialEvidenceRemediationRecord(
            createInput(),
          );

        const unsigned = {
          ...record,

          commercialDraft: {
            ...record.commercialDraft,

            pricing: {
              ...record.commercialDraft
                .pricing,

              currencyStatus:
                "VERIFIED",

              currency:
                "INR",
            },
          },
        } as unknown as
          Record<string, unknown>;

        delete unsigned.remediationDigest;

        const invalid = {
          ...unsigned,

          remediationDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchCommercialEvidenceRemediationRecord;

        expect(() =>
          validateSalesCoreLaunchCommercialEvidenceRemediationRecord(
            invalid,
          ),
        ).toThrow(
          "Sales core launch commercial remediation record is invalid.",
        );
      },
    );
  },
);
