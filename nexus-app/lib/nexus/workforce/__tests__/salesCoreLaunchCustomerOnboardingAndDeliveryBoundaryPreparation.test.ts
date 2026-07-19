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
import {
  createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation,
  validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation,
  type CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparationInput,
  type SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation,
} from "../salesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation";
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

async function createCustomerOnboardingAndDeliveryPreparationInput(
  overrides:
    Partial<CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparationInput> = {},
): Promise<CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparationInput> {
  const commercialInfrastructureClosure =
    createSalesCoreLaunchCommercialInfrastructureClosureRecord(
      await createCommercialInfrastructureClosureInput(),
    );

  return {
    preparationId:
      "sales-core-customer-onboarding-delivery-preparation-001",

    commercialInfrastructureClosure,

    ownerId:
      commercialInfrastructureClosure.ownerId,

    customerOrganizationId:
      "customer-ppa-industrial-solution-controlled-pilot-001",

    customerOrganizationName:
      "PPA Industrial Solution",

    rationale:
      "Owner prepares one controlled real-customer onboarding candidate and authenticated portal-only delivery boundary without authorizing execution.",

    preparedAt:
      "2026-07-19T10:00:09.000Z",

    ...overrides,
  };
}

describe(
  "salesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation",
  () => {
    it(
      "prepares one controlled customer onboarding candidate and delivery boundary",
      async () => {
        const preparation =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            await createCustomerOnboardingAndDeliveryPreparationInput(),
          );

        expect(preparation).toMatchObject({
          preparationState:
            "REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARED",

          customerOrganizationId:
            "customer-ppa-industrial-solution-controlled-pilot-001",

          customerOrganizationName:
            "PPA Industrial Solution",

          nextStep:
            "AWAIT_OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION",
        });

        expect(preparation.preparationBoundary)
          .toMatchObject({
            realCustomerOnboardingPreparationEligible:
              true,

            realCustomerOnboardingPreparationCreated:
              true,

            realCustomerOnboardingDecisionRecorded:
              false,

            realCustomerOnboardingAuthorized:
              false,

            realCustomerOnboardingExecuted:
              false,

            ownerApprovedDeliveryBoundaryPreparationCreated:
              true,

            ownerApprovedDeliveryBoundaryDecisionRecorded:
              false,

            ownerApprovedDeliveryBoundaryRecorded:
              false,
          });
      },
    );

    it(
      "binds the approved commercial infrastructure and remediation chain",
      async () => {
        const input =
          await createCustomerOnboardingAndDeliveryPreparationInput();

        const source =
          input.commercialInfrastructureClosure;

        const preparation =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            input,
          );

        expect(preparation.sourceClosureId)
          .toBe(source.closureId);

        expect(preparation.sourceClosureDigest)
          .toBe(source.closureDigest);

        expect(preparation.sourceReassessmentDigest)
          .toBe(source.sourceReassessmentDigest);

        expect(preparation.sourceRequalificationDigest)
          .toBe(source.sourceRequalificationDigest);

        expect(preparation.sourceContainmentDigest)
          .toBe(source.sourceContainmentDigest);

        expect(preparation.sourceRegistryDigest)
          .toBe(source.sourceRegistryDigest);
      },
    );

    it(
      "requires controlled atomic tenant-bound onboarding safeguards",
      async () => {
        const preparation =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            await createCustomerOnboardingAndDeliveryPreparationInput(),
          );

        expect(preparation.onboardingPreparation)
          .toEqual({
            onboardingMode:
              "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER",

            tenantBindingRequired:
              true,

            ownerBindingRequired:
              true,

            authenticatedCustomerIdentityRequired:
              true,

            explicitCustomerConsentRequired:
              true,

            minimumNecessaryCustomerDataOnly:
              true,

            customerDataRetentionPolicyRequired:
              true,

            customerDataRedactionRequired:
              true,

            crossTenantAccessBlocked:
              true,

            idempotentOnboardingRequired:
              true,

            atomicOnboardingRequired:
              true,

            rollbackOnFailureRequired:
              true,

            auditEvidenceRequired:
              true,

            realCustomerContactDetailsStored:
              false,

            customerAccountCreated:
              false,

            customerSessionIssued:
              false,

            customerOnboardingExecuted:
              false,
          });
      },
    );

    it(
      "limits delivery to a future authenticated portal release boundary",
      async () => {
        const preparation =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            await createCustomerOnboardingAndDeliveryPreparationInput(),
          );

        expect(preparation.deliveryBoundaryPreparation)
          .toEqual({
            deliveryMode:
              "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY",

            ownerReleaseRequired:
              true,

            authenticatedCustomerAccessRequired:
              true,

            tenantScopedAccessRequired:
              true,

            customerScopedAccessRequired:
              true,

            releasedResultOnly:
              true,

            sandboxResultOnly:
              true,

            idempotentAcknowledgementRequired:
              true,

            externalEmailDeliveryAllowed:
              false,

            externalWhatsAppDeliveryAllowed:
              false,

            externalSmsDeliveryAllowed:
              false,

            publicLinkDeliveryAllowed:
              false,

            liveProviderDeliveryAllowed:
              false,

            paymentCollectionAllowed:
              false,

            invoiceCreationAllowed:
              false,

            customerCommitmentAllowed:
              false,
          });
      },
    );

    it(
      "blocks wrong owner early preparation and secret-bearing rationale",
      async () => {
        const wrongOwner =
          await createCustomerOnboardingAndDeliveryPreparationInput({
            ownerId:
              "owner-other",
          });

        expect(() =>
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            wrongOwner,
          ),
        ).toThrow(
          "closure-bound owner",
        );

        const early =
          await createCustomerOnboardingAndDeliveryPreparationInput({
            preparedAt:
              "2026-07-19T10:00:07.999Z",
          });

        expect(() =>
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            early,
          ),
        ).toThrow(
          "cannot precede commercial infrastructure closure",
        );

        const secretBearing =
          await createCustomerOnboardingAndDeliveryPreparationInput({
            rationale:
              "Owner included bearer token secret-value in the customer onboarding preparation.",
          });

        expect(() =>
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            secretBearing,
          ),
        ).toThrow(
          "safe, explicit, and non-secret",
        );
      },
    );

    it(
      "blocks invalid customer identity and tampered infrastructure closure",
      async () => {
        const invalidCustomer =
          await createCustomerOnboardingAndDeliveryPreparationInput({
            customerOrganizationId:
              "INVALID CUSTOMER",
          });

        expect(() =>
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            invalidCustomer,
          ),
        ).toThrow(
          "Customer organization ID is invalid",
        );

        const input =
          await createCustomerOnboardingAndDeliveryPreparationInput();

        const tamperedClosure = {
          ...input.commercialInfrastructureClosure,

          closureBoundary: {
            ...input.commercialInfrastructureClosure.closureBoundary,

            commercialInfrastructureFoundationClosed:
              false,
          },
        } as unknown as
          SalesCoreLaunchCommercialInfrastructureClosureRecord;

        expect(() =>
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation({
            ...input,

            commercialInfrastructureClosure:
              tamperedClosure,
          }),
        ).toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "keeps every real execution and consequential authority blocked",
      async () => {
        const preparation =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            await createCustomerOnboardingAndDeliveryPreparationInput(),
          );

        expect(preparation.preparationBoundary)
          .toMatchObject({
            externalDeliveryExecutionAuthorized:
              false,

            paidPilotEligible:
              false,

            paidPilotAuthorized:
              false,

            historicalRecordsMutated:
              false,

            historicalSourceDigestsPreserved:
              true,

            priorActivationAuthorityRevived:
              false,
          });

        expect(
          Object.values(
            preparation.authorityBoundary,
          ).every(
            (authorized) =>
              authorized === false,
          ),
        ).toBe(true);
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and blocks re-signed escalation",
      async () => {
        const input =
          await createCustomerOnboardingAndDeliveryPreparationInput();

        const first =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            input,
          );

        const second =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            input,
          );

        expect(second).toEqual(first);

        expect(first.preparationDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.onboardingPreparation,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.deliveryBoundaryPreparation,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.preparationBoundary,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            first,
          ),
        ).not.toThrow();

        const unsigned = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            realCustomerContactAuthorized:
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
          SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation;

        expect(() =>
          validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
            escalated,
          ),
        ).toThrow(
          "preparation state is invalid",
        );
      },
    );
  },
);
