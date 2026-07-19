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
import {
  createSalesCoreLaunchCommercialInfrastructureClosureRecord,
  validateSalesCoreLaunchCommercialInfrastructureClosureRecord,
  type CreateSalesCoreLaunchCommercialInfrastructureClosureRecordInput,
  type SalesCoreLaunchCommercialInfrastructureClosureRecord,
} from "../salesCoreLaunchCommercialInfrastructureClosureRecord";
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

async function createCommercialInfrastructureClosureInput(
  overrides:
    Partial<CreateSalesCoreLaunchCommercialInfrastructureClosureRecordInput> = {},
): Promise<CreateSalesCoreLaunchCommercialInfrastructureClosureRecordInput> {
  const correctedReadinessReassessment =
    createSalesCoreLaunchCorrectedReadinessReassessment(
      await createCorrectedReadinessReassessmentInput(),
    );

  return {
    closureId:
      "sales-core-commercial-infrastructure-closure-001",

    correctedReadinessReassessment,

    ownerId:
      correctedReadinessReassessment.ownerId,

    outcome:
      "APPROVE_CONTROLLED_COMMERCIAL_INFRASTRUCTURE_FOUNDATION_CLOSURE",

    rationale:
      "Owner approves the controlled commercial infrastructure foundation closure while every real execution surface remains blocked.",

    closedAt:
      "2026-07-19T10:00:08.000Z",

    ...overrides,
  };
}

describe(
  "salesCoreLaunchCommercialInfrastructureClosureRecord",
  () => {
    it(
      "records owner corrected-readiness approval and controlled infrastructure closure",
      async () => {
        const record =
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            await createCommercialInfrastructureClosureInput(),
          );

        expect(record).toMatchObject({
          closureState:
            "OWNER_SALES_CORE_COMMERCIAL_INFRASTRUCTURE_CLOSURE_RECORDED",

          outcome:
            "APPROVE_CONTROLLED_COMMERCIAL_INFRASTRUCTURE_FOUNDATION_CLOSURE",

          approved:
            true,

          nextStep:
            "PREPARE_REAL_CUSTOMER_ONBOARDING_AND_OWNER_APPROVED_DELIVERY_BOUNDARIES",
        });

        expect(record.closureBoundary)
          .toMatchObject({
            ownerCorrectedReadinessDecisionRecorded:
              true,

            correctedReadinessApproved:
              true,

            commercialInfrastructureFoundationClosureApproved:
              true,

            commercialInfrastructureFoundationClosed:
              true,

            realCustomerOnboardingPreparationEligible:
              true,

            realCustomerOnboardingExecutionAuthorized:
              false,

            ownerApprovedDeliveryBoundaryPreparationEligible:
              true,

            ownerApprovedDeliveryBoundaryRecorded:
              false,
          });
      },
    );

    it(
      "records verified foundations without claiming external execution readiness",
      async () => {
        const record =
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            await createCommercialInfrastructureClosureInput(),
          );

        expect(record.infrastructureFoundation)
          .toEqual({
            authenticatedTenantOnboardingFoundationVerified:
              true,

            tenantIsolationFoundationVerified:
              true,

            tenantScopedCustomerWorkflowPersistenceVerified:
              true,

            ownerControlledCommandGatewayVerified:
              true,

            immutableAuditFoundationVerified:
              true,

            providerContinuityContainmentVerified:
              true,

            sandboxRecoveryFoundationVerified:
              true,

            emergencyPauseAndKillSwitchFoundationVerified:
              true,

            subscriptionEntitlementDataFoundationVerified:
              true,

            correctedCommercialEvidenceVerified:
              true,

            externalMessagingExecutionReady:
              false,

            paymentExecutionReady:
              false,

            invoiceExecutionReady:
              false,

            subscriptionActivationReady:
              false,

            entitlementMutationReady:
              false,

            publicLaunchInfrastructureReady:
              false,
          });
      },
    );

    it(
      "binds the corrected reassessment and complete remediation evidence chain",
      async () => {
        const input =
          await createCommercialInfrastructureClosureInput();

        const source =
          input.correctedReadinessReassessment;

        const record =
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            input,
          );

        expect(record.sourceReassessmentId)
          .toBe(source.reassessmentId);

        expect(record.sourceReassessmentDigest)
          .toBe(source.reassessmentDigest);

        expect(record.sourceRequalificationId)
          .toBe(source.sourceRequalificationId);

        expect(record.sourceRequalificationDigest)
          .toBe(source.sourceRequalificationDigest);

        expect(record.sourceExecutionReviewDigest)
          .toBe(source.sourceExecutionReviewDigest);

        expect(record.sourceExecutionEvidenceLedgerDigest)
          .toBe(source.sourceExecutionEvidenceLedgerDigest);

        expect(record.sourceRemediationDigest)
          .toBe(source.sourceRemediationDigest);

        expect(record.sourceContainmentDigest)
          .toBe(source.sourceContainmentDigest);

        expect(record.sourceRegistryDigest)
          .toBe(source.sourceRegistryDigest);
      },
    );

    it(
      "records rejection without closing infrastructure or enabling onboarding preparation",
      async () => {
        const record =
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            await createCommercialInfrastructureClosureInput({
              outcome:
                "REJECT_AND_RETURN_TO_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT",

              rationale:
                "Owner rejects closure and returns the evidence to corrected Sales-core readiness reassessment.",
            }),
          );

        expect(record.approved)
          .toBe(false);

        expect(record.closureBoundary)
          .toMatchObject({
            correctedReadinessApproved:
              false,

            commercialInfrastructureFoundationClosureApproved:
              false,

            commercialInfrastructureFoundationClosed:
              false,

            realCustomerOnboardingPreparationEligible:
              false,

            ownerApprovedDeliveryBoundaryPreparationEligible:
              false,
          });

        expect(record.nextStep)
          .toBe(
            "RETURN_TO_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT",
          );
      },
    );

    it(
      "blocks wrong owner early closure and secret-bearing rationale",
      async () => {
        const wrongOwner =
          await createCommercialInfrastructureClosureInput({
            ownerId:
              "owner-other",
          });

        expect(() =>
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            wrongOwner,
          ),
        ).toThrow(
          "reassessment-bound owner",
        );

        const early =
          await createCommercialInfrastructureClosureInput({
            closedAt:
              "2026-07-19T10:00:06.999Z",
          });

        expect(() =>
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            early,
          ),
        ).toThrow(
          "cannot precede corrected readiness reassessment",
        );

        const secretBearing =
          await createCommercialInfrastructureClosureInput({
            rationale:
              "Owner included bearer token secret-value in the commercial infrastructure closure rationale.",
          });

        expect(() =>
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            secretBearing,
          ),
        ).toThrow(
          "safe, explicit, and non-secret",
        );
      },
    );

    it(
      "blocks tampered corrected readiness reassessment",
      async () => {
        const input =
          await createCommercialInfrastructureClosureInput();

        const tampered = {
          ...input.correctedReadinessReassessment,

          reassessmentBoundary: {
            ...input.correctedReadinessReassessment.reassessmentBoundary,

            correctedReadinessReassessmentCreated:
              false,
          },
        } as unknown as
          SalesCoreLaunchCorrectedReadinessReassessment;

        expect(() =>
          createSalesCoreLaunchCommercialInfrastructureClosureRecord({
            ...input,

            correctedReadinessReassessment:
              tampered,
          }),
        ).toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "preserves historical evidence and keeps every consequential authority blocked",
      async () => {
        const record =
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            await createCommercialInfrastructureClosureInput(),
          );

        expect(record.closureBoundary)
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

            commercialInfrastructureExecutionReady:
              false,

            paidPilotEligible:
              false,

            paidPilotAuthorized:
              false,
          });

        expect(
          Object.values(
            record.authorityBoundary,
          ).every(
            (authorized) =>
              authorized === false,
          ),
        ).toBe(true);
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and blocks re-signed authority escalation",
      async () => {
        const input =
          await createCommercialInfrastructureClosureInput();

        const first =
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            input,
          );

        const second =
          createSalesCoreLaunchCommercialInfrastructureClosureRecord(
            input,
          );

        expect(second).toEqual(first);

        expect(first.closureDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.infrastructureFoundation,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.closureBoundary,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateSalesCoreLaunchCommercialInfrastructureClosureRecord(
            first,
          ),
        ).not.toThrow();

        const unsigned = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            externalDeliveryAuthorized:
              true,
          },
        } as unknown as
          Record<string, unknown>;

        delete unsigned.closureDigest;

        const escalated = {
          ...unsigned,

          closureDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchCommercialInfrastructureClosureRecord;

        expect(() =>
          validateSalesCoreLaunchCommercialInfrastructureClosureRecord(
            escalated,
          ),
        ).toThrow(
          "closure record state is invalid",
        );
      },
    );
  },
);
