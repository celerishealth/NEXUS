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
import {
  MEERA_COMMERCIAL_REQUALIFICATION_CASES,
  createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
  type CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparationInput,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
} from "../salesCoreLaunchCommercialEvidenceControlledRequalificationPreparation";
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

function createPreparationInput(
  overrides:
    Partial<CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparationInput> = {},
): CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparationInput {
  const reviewDecision =
    createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
      createReviewInput(),
    );

  return {
    preparationId:
      "sales-core-commercial-requalification-preparation-001",

    remediationReviewDecision:
      reviewDecision,

    ownerId:
      reviewDecision.ownerId,

    preparedAt:
      "2026-07-19T10:00:02.000Z",

    ...overrides,
  };
}

describe(
  "salesCoreLaunchCommercialEvidenceControlledRequalificationPreparation",
  () => {
    it(
      "prepares exactly twelve genuine commercial requalification cases",
      () => {
        const result =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            createPreparationInput(),
          );

        expect(result.preparationState)
          .toBe(
            "MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARED",
          );

        expect(result.plannedCases)
          .toHaveLength(12);

        expect(result.plannedCases)
          .toEqual(
            MEERA_COMMERCIAL_REQUALIFICATION_CASES,
          );

        expect(result.nextStep)
          .toBe(
            "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION",
          );
      },
    );

    it(
      "binds the owner remediation review and complete evidence digest chain",
      () => {
        const input =
          createPreparationInput();

        const result =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            input,
          );

        expect(
          result.sourceReviewDecisionId,
        ).toBe(
          input.remediationReviewDecision
            .decisionId,
        );

        expect(
          result.sourceReviewDecisionDigest,
        ).toBe(
          input.remediationReviewDecision
            .decisionDigest,
        );

        expect(
          result.sourceRemediationDigest,
        ).toBe(
          input.remediationReviewDecision
            .sourceRemediationDigest,
        );

        expect(
          result.sourceCompositeEvidenceDigest,
        ).toBe(
          input.remediationReviewDecision
            .sourceCompositeEvidenceDigest,
        );

        expect(
          result.sourceContainmentDigest,
        ).toBe(
          input.remediationReviewDecision
            .sourceContainmentDigest,
        );
      },
    );

    it(
      "covers required commercial competency and safety failures explicitly",
      () => {
        const result =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            createPreparationInput(),
          );

        const scenarios =
          result.plannedCases.map(
            (plannedCase) =>
              plannedCase.scenario,
          );

        expect(scenarios)
          .toEqual([
            "VERIFIED_PRODUCT_SERVICE_AND_QUANTITY",
            "VERIFIED_UNIT_PRICE_AND_CURRENCY",
            "MULTI_LINE_SUBTOTAL_AND_TOTAL",
            "UNRESOLVED_PRICING_INPUTS",
            "VERIFIED_TAX_TREATMENT",
            "VERIFIED_FREIGHT_AND_DISCOUNT_TREATMENT",
            "VERIFIED_VALIDITY_AND_PAYMENT_TERMS",
            "SCOPE_EXCLUSIONS_DEPENDENCIES",
            "ASHA_RIYA_MEERA_DIGEST_CHAIN",
            "CROSS_TENANT_OR_UNAUTHORIZED_OWNER_INPUT",
            "TAMPERED_DIGEST_SECRET_OR_UNSUPPORTED_CLAIM",
            "INCOMPLETE_OR_FAILED_COMMERCIAL_DRAFT",
          ]);

        expect(
          Object.values(
            result.coverageSummary,
          ).slice(8).every(
            (covered) =>
              covered === true,
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps execution qualification activation customer delivery payment and launch blocked",
      () => {
        const result =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            createPreparationInput(),
          );

        expect(
          result.executionBoundary
            .ownerExecutionDecisionRequired,
        ).toBe(true);

        expect(
          result.executionBoundary
            .controlledRequalificationExecutionAuthorized,
        ).toBe(false);

        expect(
          result.executionBoundary
            .meeraCommercialEvidenceRequalified,
        ).toBe(false);

        expect(
          result.executionBoundary
            .salesCoreLaunchRequalificationEligible,
        ).toBe(false);

        expect(
          Object.values(
            result.authorityBoundary,
          ).every(
            (authorized) =>
              authorized === false,
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a remediation review that did not approve preparation",
      () => {
        const rejectedReview =
          createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
            createReviewInput({
              decision:
                "REJECT_AND_RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY",

              reason:
                "Owner rejects the remediation evidence and retains the draft for correction.",
            }),
          );

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation({
            ...createPreparationInput(),

            remediationReviewDecision:
              rejectedReview,
          }),
        ).toThrow(
          "does not authorize controlled requalification preparation",
        );
      },
    );

    it(
      "rejects integrity-tampered owner review evidence",
      () => {
        const input =
          createPreparationInput();

        const tampered = {
          ...input.remediationReviewDecision,

          ownerId:
            "owner-unauthorized",
        };

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation({
            ...input,

            remediationReviewDecision:
              tampered,
          }),
        ).toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "rejects cross-owner and premature preparation",
      () => {
        expect(() =>
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            createPreparationInput({
              ownerId:
                "owner-another-tenant",
            }),
          ),
        ).toThrow(
          "Only the remediation-review-bound owner",
        );

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            createPreparationInput({
              preparedAt:
                "2026-07-19T10:00:00.999Z",
            }),
          ),
        ).toThrow(
          "cannot precede owner remediation review",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and blocks re-signed authority escalation",
      () => {
        const input =
          createPreparationInput();

        const first =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            input,
          );

        const second =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            input,
          );

        expect(second).toEqual(first);

        expect(first.preparationDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.plannedCases,
          ),
        ).toBe(true);

        expect(
          first.plannedCases.every(
            (plannedCase) =>
              Object.isFrozen(
                plannedCase.requiredEvidence,
              ),
          ),
        ).toBe(true);

        const unsigned = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            customerCommitmentAuthorized:
              true,
          },
        } as unknown as
          Record<string, unknown>;

        delete unsigned.preparationDigest;

        const escalated = {
          ...unsigned,

          preparationDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation;

        expect(() =>
          validateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
            escalated,
          ),
        ).toThrow(
          "Sales core launch controlled commercial requalification preparation is invalid.",
        );
      },
    );
  },
);
