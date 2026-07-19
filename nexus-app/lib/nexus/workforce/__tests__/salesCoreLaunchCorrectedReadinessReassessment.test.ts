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
import {
  createSalesCoreLaunchCommercialEvidenceRequalificationRecord,
  validateSalesCoreLaunchCommercialEvidenceRequalificationRecord,
  type CreateSalesCoreLaunchCommercialEvidenceRequalificationRecordInput,
  type SalesCoreLaunchCommercialEvidenceRequalificationRecord,
} from "../salesCoreLaunchCommercialEvidenceRequalificationRecord";
import {
  createSalesCoreLaunchCorrectedReadinessReassessment,
  validateSalesCoreLaunchCorrectedReadinessReassessment,
  type CreateSalesCoreLaunchCorrectedReadinessReassessmentInput,
  type SalesCoreLaunchCorrectedReadinessReassessment,
} from "../salesCoreLaunchCorrectedReadinessReassessment";
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

async function createCommercialEvidenceRequalificationInput(
  overrides:
    Partial<CreateSalesCoreLaunchCommercialEvidenceRequalificationRecordInput> = {},
): Promise<CreateSalesCoreLaunchCommercialEvidenceRequalificationRecordInput> {
  const executionReviewDecision =
    createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
      await createExecutionReviewInput(),
    );

  return {
    requalificationId:
      "sales-core-commercial-evidence-requalification-001",

    executionReviewDecision,

    ownerId:
      executionReviewDecision.ownerId,

    reason:
      "Owner-approved independent commercial evidence satisfies the bounded Sales-core requalification requirement.",

    requalifiedAt:
      "2026-07-19T10:00:06.000Z",

    ...overrides,
  };
}

async function createCorrectedReadinessReassessmentInput(
  overrides:
    Partial<CreateSalesCoreLaunchCorrectedReadinessReassessmentInput> = {},
): Promise<CreateSalesCoreLaunchCorrectedReadinessReassessmentInput> {
  const commercialEvidenceRequalification =
    createSalesCoreLaunchCommercialEvidenceRequalificationRecord(
      await createCommercialEvidenceRequalificationInput(),
    );

  return {
    reassessmentId:
      "sales-core-corrected-readiness-reassessment-001",

    commercialEvidenceRequalification,

    ownerId:
      commercialEvidenceRequalification.ownerId,

    evaluatorId:
      "evaluator-sales-core-readiness-independent-001",

    rationale:
      "Independent evaluator reassessed the contained Sales-core chain using corrected commercial evidence.",

    assessedAt:
      "2026-07-19T10:00:07.000Z",

    ...overrides,
  };
}

describe(
  "salesCoreLaunchCorrectedReadinessReassessment",
  () => {
    it(
      "creates corrected Sales-core readiness reassessment without owner approval",
      async () => {
        const reassessment =
          createSalesCoreLaunchCorrectedReadinessReassessment(
            await createCorrectedReadinessReassessmentInput(),
          );

        expect(reassessment).toMatchObject({
          reassessmentState:
            "CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT_CREATED",

          department:
            "SALES",

          nextStep:
            "AWAIT_OWNER_CORRECTED_SALES_CORE_LAUNCH_READINESS_DECISION",
        });

        expect(reassessment.reassessmentBoundary)
          .toMatchObject({
            correctedReadinessReassessmentEligible:
              true,

            correctedReadinessReassessmentCreated:
              true,

            correctedReadinessDecisionRecorded:
              false,

            correctedReadinessApproved:
              false,

            ownerReviewRequired:
              true,

            ownerReviewRecorded:
              false,
          });
      },
    );

    it(
      "binds exact requalification remediation containment and registry evidence",
      async () => {
        const input =
          await createCorrectedReadinessReassessmentInput();

        const source =
          input.commercialEvidenceRequalification;

        const reassessment =
          createSalesCoreLaunchCorrectedReadinessReassessment(
            input,
          );

        expect(reassessment.sourceRequalificationId)
          .toBe(source.requalificationId);

        expect(reassessment.sourceRequalificationDigest)
          .toBe(source.requalificationDigest);

        expect(reassessment.sourceExecutionReviewId)
          .toBe(source.sourceExecutionReviewId);

        expect(reassessment.sourceExecutionReviewDigest)
          .toBe(source.sourceExecutionReviewDigest);

        expect(reassessment.sourceExecutionEvidenceLedgerDigest)
          .toBe(source.sourceExecutionEvidenceLedgerDigest);

        expect(reassessment.sourceRemediationDigest)
          .toBe(source.sourceRemediationDigest);

        expect(reassessment.sourceContainmentDigest)
          .toBe(source.sourceContainmentDigest);

        expect(reassessment.sourceRegistryDigest)
          .toBe(source.sourceRegistryDigest);
      },
    );

    it(
      "assesses the exact Sales employee sequence and corrected commercial evidence",
      async () => {
        const reassessment =
          createSalesCoreLaunchCorrectedReadinessReassessment(
            await createCorrectedReadinessReassessmentInput(),
          );

        expect(reassessment.assessedEmployees)
          .toEqual({
            employeeIds: [
              "employee-asha-inquiry-intake-v1",
              "employee-riya-recommendation-specialist-v1",
              "employee-meera-quotation-proposal-specialist-v1",
            ],

            employeeCodes: [
              "nx-sales-003",
              "nx-sales-004",
              "nx-sales-005",
            ],

            launchSequence: [
              3,
              4,
              5,
            ],

            ashaEvidenceStatus:
              "HISTORICAL_VERIFIED_PILOT_EVIDENCE_ONLY",

            riyaEvidenceStatus:
              "HISTORICAL_VERIFIED_PILOT_EVIDENCE_ONLY",

            meeraEvidenceStatus:
              "REQUALIFIED_ASSERTION_DERIVED_COMMERCIAL_EVIDENCE",
          });

        expect(reassessment.verifiedCommercialEvidence)
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

            syntheticCommercialDraftAllowedCases:
              8,

            ownerEscalationCases:
              4,
          });
      },
    );

    it(
      "preserves historical evidence and keeps all authority blocked",
      async () => {
        const reassessment =
          createSalesCoreLaunchCorrectedReadinessReassessment(
            await createCorrectedReadinessReassessmentInput(),
          );

        expect(reassessment.reassessmentBoundary)
          .toMatchObject({
            historicalRecordsMutated:
              false,

            historicalSourceDigestsPreserved:
              true,

            priorPilotCompletionRetainedAsHistoricalEvidenceOnly:
              true,

            priorReadinessApprovalRetainedAsHistoricalEvidenceOnly:
              true,

            priorActivationPlanApprovalRetainedAsHistoricalEvidenceOnly:
              true,

            priorActivationAuthorityRevived:
              false,

            activationPlanningEligible:
              false,

            commercialInfrastructureClosureEligible:
              false,
          });

        expect(
          Object.values(
            reassessment.authorityBoundary,
          ).every(
            (authorized) =>
              authorized === false,
          ),
        ).toBe(true);
      },
    );

    it(
      "blocks wrong owner and owner acting as evaluator",
      async () => {
        const wrongOwner =
          await createCorrectedReadinessReassessmentInput({
            ownerId:
              "owner-other",
          });

        expect(() =>
          createSalesCoreLaunchCorrectedReadinessReassessment(
            wrongOwner,
          ),
        ).toThrow(
          "requalification-bound owner",
        );

        const ownerEvaluator =
          await createCorrectedReadinessReassessmentInput();

        expect(() =>
          createSalesCoreLaunchCorrectedReadinessReassessment({
            ...ownerEvaluator,

            evaluatorId:
              ownerEvaluator.ownerId,
          }),
        ).toThrow(
          "Owner cannot act",
        );
      },
    );

    it(
      "blocks early reassessment and secret-bearing rationale",
      async () => {
        const early =
          await createCorrectedReadinessReassessmentInput({
            assessedAt:
              "2026-07-19T10:00:05.999Z",
          });

        expect(() =>
          createSalesCoreLaunchCorrectedReadinessReassessment(
            early,
          ),
        ).toThrow(
          "cannot precede commercial evidence requalification",
        );

        const secretBearing =
          await createCorrectedReadinessReassessmentInput({
            rationale:
              "Evaluator included bearer token secret-value in the corrected readiness reassessment.",
          });

        expect(() =>
          createSalesCoreLaunchCorrectedReadinessReassessment(
            secretBearing,
          ),
        ).toThrow(
          "safe, explicit, and non-secret",
        );
      },
    );

    it(
      "blocks tampered commercial evidence requalification",
      async () => {
        const input =
          await createCorrectedReadinessReassessmentInput();

        const tamperedSource = {
          ...input.commercialEvidenceRequalification,

          verifiedEvidence: {
            ...input.commercialEvidenceRequalification.verifiedEvidence,

            assertionsPassed:
              47,
          },
        } as unknown as
          SalesCoreLaunchCommercialEvidenceRequalificationRecord;

        expect(() =>
          createSalesCoreLaunchCorrectedReadinessReassessment({
            ...input,

            commercialEvidenceRequalification:
              tamperedSource,
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
          await createCorrectedReadinessReassessmentInput();

        const first =
          createSalesCoreLaunchCorrectedReadinessReassessment(
            input,
          );

        const second =
          createSalesCoreLaunchCorrectedReadinessReassessment(
            input,
          );

        expect(second).toEqual(first);

        expect(first.reassessmentDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.assessedEmployees,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.assessedEmployees.employeeIds,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.verifiedCommercialEvidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.reassessmentBoundary,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateSalesCoreLaunchCorrectedReadinessReassessment(
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

        delete unsigned.reassessmentDigest;

        const escalated = {
          ...unsigned,

          reassessmentDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchCorrectedReadinessReassessment;

        expect(() =>
          validateSalesCoreLaunchCorrectedReadinessReassessment(
            escalated,
          ),
        ).toThrow(
          "reassessment state is invalid",
        );
      },
    );
  },
);
