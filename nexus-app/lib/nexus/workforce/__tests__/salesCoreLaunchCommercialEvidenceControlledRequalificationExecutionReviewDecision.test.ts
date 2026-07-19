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
import {
  createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision,
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision,
  type CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionInput,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision,
} from "../salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision";
import {
  executeSalesCoreLaunchCommercialEvidenceControlledRequalification,
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence,
  type ExecuteSalesCoreLaunchCommercialEvidenceControlledRequalificationInput,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence,
} from "../salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence";
import {
  createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision,
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision,
  type CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecisionInput,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision,
} from "../salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision";
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

function createExecutionDecisionInput(
  overrides:
    Partial<CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionInput> = {},
): CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionInput {
  const preparation =
    createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
      createPreparationInput(),
    );

  return {
    controlledRequalificationPreparation:
      preparation,

    decisionId:
      "sales-core-commercial-requalification-execution-decision-001",

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION",

    reason:
      "Owner approves only the bounded twelve-case synthetic commercial requalification execution.",

    decidedAt:
      "2026-07-19T10:00:03.000Z",

    ...overrides,
  };
}

function createExecutionEvidenceInput(
  overrides:
    Partial<ExecuteSalesCoreLaunchCommercialEvidenceControlledRequalificationInput> = {},
): ExecuteSalesCoreLaunchCommercialEvidenceControlledRequalificationInput {
  const preparation =
    createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
      createPreparationInput(),
    );

  const executionDecision =
    createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision(
      createExecutionDecisionInput({
        controlledRequalificationPreparation:
          preparation,
      }),
    );

  return {
    ledgerId:
      "sales-core-commercial-requalification-evidence-ledger-001",

    controlledRequalificationPreparation:
      preparation,

    executionDecision,

    ownerId:
      preparation.ownerId,

    evaluatorId:
      "evaluator-commercial-independent-001",

    executedAt:
      "2026-07-19T10:00:04.000Z",

    ...overrides,
  };
}

async function createExecutionReviewInput(
  overrides:
    Partial<CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecisionInput> = {},
): Promise<CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecisionInput> {
  const executionEvidence =
    await executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
      createExecutionEvidenceInput(),
    );

  return {
    reviewId:
      "sales-core-commercial-requalification-execution-review-001",

    executionEvidence,

    ownerId:
      executionEvidence.ownerId,

    outcome:
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION",

    rationale:
      "Owner reviewed all twelve commercial cases and accepts the independent assertion-derived evidence.",

    reviewedAt:
      "2026-07-19T10:00:05.000Z",

    ...overrides,
  };
}

describe(
  "salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision",
  () => {
    it(
      "records owner approval and requalifies only Meera commercial evidence",
      async () => {
        const decision =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            await createExecutionReviewInput(),
          );

        expect(decision).toMatchObject({
          reviewState:
            "OWNER_MEERA_COMMERCIAL_REQUALIFICATION_EXECUTION_REVIEW_RECORDED",

          outcome:
            "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION",

          approved:
            true,

          nextStep:
            "REQUALIFY_SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE",
        });

        expect(decision.reviewBoundary)
          .toMatchObject({
            ownerPostExecutionReviewRecorded:
              true,

            executionEvidenceAccepted:
              true,

            meeraCommercialEvidenceRequalified:
              true,

            salesCoreLaunchRequalificationEligible:
              true,

            salesCoreLaunchRequalified:
              false,

            salesCoreLaunchReadinessAssessmentCreated:
              false,
          });
      },
    );

    it(
      "reviews exact twelve-case forty-eight-assertion evidence",
      async () => {
        const decision =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            await createExecutionReviewInput(),
          );

        expect(decision.evidenceSummary)
          .toEqual({
            qualificationCasesExecuted:
              12,

            qualificationCasesPassed:
              12,

            qualificationCasesFailed:
              0,

            qualificationEvidenceCollected:
              12,

            assertionsExecuted:
              48,

            assertionsPassed:
              48,

            assertionsFailed:
              0,

            uniqueCaseIds:
              12,

            uniqueEvidenceIds:
              12,

            uniqueEvidenceDigests:
              12,

            uniqueBindingDigests:
              12,

            syntheticCommercialDraftAllowedCases:
              8,

            ownerEscalationCases:
              4,
          });
      },
    );

    it(
      "binds the exact evidence preparation decision and remediation chain",
      async () => {
        const input =
          await createExecutionReviewInput();

        const source =
          input.executionEvidence;

        const decision =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            input,
          );

        expect(decision.sourceLedgerId)
          .toBe(source.ledgerId);

        expect(decision.sourceLedgerDigest)
          .toBe(source.ledgerDigest);

        expect(decision.sourcePreparationId)
          .toBe(source.preparationId);

        expect(decision.sourcePreparationDigest)
          .toBe(source.preparationDigest);

        expect(decision.sourceExecutionDecisionId)
          .toBe(source.executionDecisionId);

        expect(decision.sourceExecutionDecisionDigest)
          .toBe(source.executionDecisionDigest);

        expect(decision.sourceRemediationDigest)
          .toBe(source.sourceRemediationDigest);

        expect(decision.sourceContainmentDigest)
          .toBe(source.sourceContainmentDigest);

        expect(decision.sourceRegistryDigest)
          .toBe(source.sourceRegistryDigest);
      },
    );

    it(
      "keeps Sales-core qualification runtime delivery payment production and launch blocked",
      async () => {
        const decision =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            await createExecutionReviewInput(),
          );

        expect(
          decision.reviewBoundary
            .salesCoreLaunchRequalified,
        ).toBe(false);

        expect(
          decision.reviewBoundary
            .salesCoreLaunchReadinessAssessmentCreated,
        ).toBe(false);

        expect(
          Object.values(
            decision.authorityBoundary,
          ).every(
            (authorized) =>
              authorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "records rejection without requalification eligibility",
      async () => {
        const input =
          await createExecutionReviewInput({
            outcome:
              "REJECT_AND_RETURN_TO_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION",

            rationale:
              "Owner rejects the evidence and returns Meera to bounded controlled commercial requalification.",
          });

        const decision =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            input,
          );

        expect(decision.approved)
          .toBe(false);

        expect(decision.nextStep)
          .toBe(
            "RETURN_TO_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION",
          );

        expect(decision.reviewBoundary)
          .toMatchObject({
            executionEvidenceAccepted:
              false,

            meeraCommercialEvidenceRequalified:
              false,

            salesCoreLaunchRequalificationEligible:
              false,
          });
      },
    );

    it(
      "blocks wrong owner early review invalid outcome and secret-bearing rationale",
      async () => {
        const wrongOwner =
          await createExecutionReviewInput({
            ownerId:
              "owner-other",
          });

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            wrongOwner,
          ),
        ).toThrow(
          "execution-evidence-bound owner",
        );

        const early =
          await createExecutionReviewInput({
            reviewedAt:
              "2026-07-19T10:00:03.999Z",
          });

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            early,
          ),
        ).toThrow(
          "cannot precede evidence execution",
        );

        const invalid =
          await createExecutionReviewInput({
            outcome:
              "INVALID_REVIEW_OUTCOME" as
                CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecisionInput["outcome"],
          });

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            invalid,
          ),
        ).toThrow(
          "review outcome is invalid",
        );

        const secretBearing =
          await createExecutionReviewInput({
            rationale:
              "Owner included access_token secret-value while reviewing the commercial evidence.",
          });

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            secretBearing,
          ),
        ).toThrow(
          "safe, explicit, and non-secret",
        );
      },
    );

    it(
      "blocks tampered execution evidence",
      async () => {
        const input =
          await createExecutionReviewInput();

        const tampered = {
          ...input.executionEvidence,

          summary: {
            ...input.executionEvidence.summary,

            qualificationCasesPassed:
              11,
          },
        } as unknown as
          SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence;

        expect(() =>
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision({
            ...input,

            executionEvidence:
              tampered,
          }),
        ).toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and blocks re-signed authority escalation",
      async () => {
        const input =
          await createExecutionReviewInput();

        const first =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            input,
          );

        const second =
          createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            input,
          );

        expect(second).toEqual(first);

        expect(first.reviewDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceSummary,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.reviewBoundary,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            first,
          ),
        ).not.toThrow();

        const unsigned = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            publicLaunchAuthorized:
              true,
          },
        } as unknown as
          Record<string, unknown>;

        delete unsigned.reviewDigest;

        const escalated = {
          ...unsigned,

          reviewDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision;

        expect(() =>
          validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
            escalated,
          ),
        ).toThrow(
          "review decision state is invalid",
        );
      },
    );
  },
);
