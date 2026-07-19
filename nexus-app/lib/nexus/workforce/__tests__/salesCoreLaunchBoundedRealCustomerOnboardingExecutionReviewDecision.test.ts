import {
  createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision,
  type SalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision,
  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision,
} from "../salesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision";
import {
  executeSalesCoreLaunchBoundedRealCustomerOnboarding,
} from "../salesCoreLaunchBoundedRealCustomerOnboardingExecution";
import {
  createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation,
  type CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparationInput,
} from "../salesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation";
import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation,
} from "../salesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation";

import {
  createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision,
  type CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecisionInput,
} from "../salesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision";

import {
  createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision,
  type CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecisionInput,
} from "../salesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision";
function canonicalize(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return `[${value
      .map(canonicalize)
      .join(",")}]`;
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalize(record[key])}`,
      )
      .join(",")}}`;
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
    .update(canonicalize(value))
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const key of
      Object.getOwnPropertyNames(value)
    ) {
      const child =
        (
          value as unknown as
            Record<string, unknown>
        )[key];

      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }

    Object.freeze(value);
  }

  return value as Readonly<T>;
}

function createPreparation():
  SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation {
  const core = {
    version:
      "sales-core-launch-customer-onboarding-and-delivery-boundary-preparation-v1" as const,

    preparationId:
      "sales-core-customer-onboarding-delivery-preparation-001",

    preparationState:
      "REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARED" as const,

    department:
      "SALES" as const,

    tenantId:
      "tenant-ppa-industrial-solution",

    ownerId:
      "owner-prashant",

    customerOrganizationId:
      "customer-ppa-industrial-solution-controlled-pilot-001",

    customerOrganizationName:
      "PPA Industrial Solution",

    sourceClosureId:
      "sales-core-commercial-infrastructure-closure-001",

    sourceClosureDigest:
      "a".repeat(64),

    sourceReassessmentId:
      "sales-core-corrected-readiness-reassessment-001",

    sourceReassessmentDigest:
      "b".repeat(64),

    sourceRequalificationId:
      "sales-core-commercial-requalification-001",

    sourceRequalificationDigest:
      "c".repeat(64),

    sourceContainmentDigest:
      "d".repeat(64),

    sourceRegistryDigest:
      "e".repeat(64),

    onboardingPreparation: {
      onboardingMode:
        "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER" as const,

      tenantBindingRequired:
        true as const,

      ownerBindingRequired:
        true as const,

      authenticatedCustomerIdentityRequired:
        true as const,

      explicitCustomerConsentRequired:
        true as const,

      minimumNecessaryCustomerDataOnly:
        true as const,

      customerDataRetentionPolicyRequired:
        true as const,

      customerDataRedactionRequired:
        true as const,

      crossTenantAccessBlocked:
        true as const,

      idempotentOnboardingRequired:
        true as const,

      atomicOnboardingRequired:
        true as const,

      rollbackOnFailureRequired:
        true as const,

      auditEvidenceRequired:
        true as const,

      realCustomerContactDetailsStored:
        false as const,

      customerAccountCreated:
        false as const,

      customerSessionIssued:
        false as const,

      customerOnboardingExecuted:
        false as const,
    },

    deliveryBoundaryPreparation: {
      deliveryMode:
        "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY" as const,

      ownerReleaseRequired:
        true as const,

      authenticatedCustomerAccessRequired:
        true as const,

      tenantScopedAccessRequired:
        true as const,

      customerScopedAccessRequired:
        true as const,

      releasedResultOnly:
        true as const,

      sandboxResultOnly:
        true as const,

      idempotentAcknowledgementRequired:
        true as const,

      externalEmailDeliveryAllowed:
        false as const,

      externalWhatsAppDeliveryAllowed:
        false as const,

      externalSmsDeliveryAllowed:
        false as const,

      publicLinkDeliveryAllowed:
        false as const,

      liveProviderDeliveryAllowed:
        false as const,

      paymentCollectionAllowed:
        false as const,

      invoiceCreationAllowed:
        false as const,

      customerCommitmentAllowed:
        false as const,
    },

    preparationBoundary: {
      sourceCommercialInfrastructureClosureVerified:
        true as const,

      commercialInfrastructureFoundationClosed:
        true as const,

      realCustomerOnboardingPreparationEligible:
        true as const,

      realCustomerOnboardingPreparationCreated:
        true as const,

      realCustomerOnboardingDecisionRecorded:
        false as const,

      realCustomerOnboardingAuthorized:
        false as const,

      realCustomerOnboardingExecuted:
        false as const,

      ownerApprovedDeliveryBoundaryPreparationEligible:
        true as const,

      ownerApprovedDeliveryBoundaryPreparationCreated:
        true as const,

      ownerApprovedDeliveryBoundaryDecisionRecorded:
        false as const,

      ownerApprovedDeliveryBoundaryRecorded:
        false as const,

      externalDeliveryExecutionAuthorized:
        false as const,

      paidPilotEligible:
        false as const,

      paidPilotAuthorized:
        false as const,

      historicalRecordsMutated:
        false as const,

      historicalSourceDigestsPreserved:
        true as const,

      priorActivationAuthorityRevived:
        false as const,
    },

    authorityBoundary: {
      approvalBypassAllowed:
        false as const,

      runtimeActivationAuthorized:
        false as const,

      controlledWorkAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      customerAccountCreationAuthorized:
        false as const,

      customerSessionIssuanceAuthorized:
        false as const,

      customerCommitmentAuthorized:
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

      invoiceCreationAuthorized:
        false as const,

      subscriptionActivationAuthorized:
        false as const,

      entitlementMutationAuthorized:
        false as const,

      autonomousExecutionAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    rationale:
      "Owner prepares one controlled real-customer onboarding candidate and authenticated portal-only delivery boundary without authorizing execution.",

    nextStep:
      "AWAIT_OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION" as const,

    preparedAt:
      "2026-07-19T10:00:09.000Z",
  };

  return deepFreeze({
    ...core,

    preparationDigest:
      sha256(core),
  }) as SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation;
}

function createInput(
  overrides:
    Partial<CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecisionInput> = {},
): CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecisionInput {
  const preparation =
    createPreparation();

  return {
    decisionId:
      "sales-core-customer-onboarding-delivery-decision-001",

    customerOnboardingAndDeliveryBoundaryPreparation:
      preparation,

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_REAL_CUSTOMER_ONBOARDING_AND_AUTHENTICATED_PORTAL_DELIVERY_BOUNDARIES",

    reason:
      "Owner approves the bounded onboarding and authenticated portal delivery boundaries while retaining separate execution authority.",

    decidedAt:
      "2026-07-19T10:00:10.000Z",

    ...overrides,
  };
}

function createExecutionPreparationInput(
  overrides: Partial<CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparationInput> = {},
): CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparationInput {
  const decision =
    createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
      createInput(),
    );

  return {
    preparationId:
      "sales-core-bounded-customer-onboarding-execution-preparation-001",

    customerOnboardingAndDeliveryBoundaryDecision:
      decision,

    ownerId:
      decision.ownerId,

    rationale:
      "Owner prepares one specific bounded onboarding execution plan while retaining a separate execution decision gate.",

    preparedAt:
      "2026-07-19T10:00:11.000Z",

    ...overrides,
  };
}

function createExecutionDecisionInput(
  overrides: Partial<CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecisionInput> = {},
): CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecisionInput {
  const preparation =
    createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
      createExecutionPreparationInput(),
    );

  return {
    decisionId:
      "sales-core-bounded-customer-onboarding-execution-decision-001",

    boundedRealCustomerOnboardingExecutionPreparation:
      preparation,

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION",

    reason:
      "Owner approves only the specifically prepared bounded onboarding execution while retaining all broader authority blocks.",

    decidedAt:
      "2026-07-19T10:00:12.000Z",

    ...overrides,
  };
}

type Day125ExecutionInput =
  Parameters<
    typeof executeSalesCoreLaunchBoundedRealCustomerOnboarding
  >[0];

function createDay125ExecutionInput(
  overrides:
    Partial<Day125ExecutionInput> = {},
): Day125ExecutionInput {
  const decision =
    createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
      createExecutionDecisionInput(),
    );

  return {
    executionId:
      "sales-core-bounded-customer-onboarding-execution-001",

    boundedRealCustomerOnboardingExecutionDecision:
      decision,

    ownerId:
      decision.ownerId,

    executedAt:
      "2026-07-19T10:00:13.000Z",

    ...overrides,
  };
}

type Day126ReviewInput =
  Parameters<
    typeof createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision
  >[0];

function createDay126ReviewInput(
  overrides:
    Partial<Day126ReviewInput> = {},
): Day126ReviewInput {
  const execution =
    executeSalesCoreLaunchBoundedRealCustomerOnboarding(
      createDay125ExecutionInput(),
    );

  return {
    reviewId:
      "sales-core-bounded-customer-onboarding-execution-review-001",

    boundedRealCustomerOnboardingExecution:
      execution,

    ownerId:
      execution.ownerId,

    outcome:
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW",

    rationale:
      "Owner accepts the exact bounded execution evidence while retaining every broader authority block.",

    reviewedAt:
      "2026-07-19T10:00:14.000Z",

    ...overrides,
  };
}

describe(
  "sales core launch bounded real-customer onboarding execution review decision",
  () => {
    it(
      "records owner approval and completes only the bounded execution review",
      () => {
        const review =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            createDay126ReviewInput(),
          );

        expect(review.reviewState)
          .toBe(
            "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_RECORDED",
          );

        expect(review.approved)
          .toBe(true);

        expect(
          review.reviewBoundary
            .ownerPostExecutionReviewRecorded,
        ).toBe(true);

        expect(
          review.reviewBoundary
            .controlledExecutionEvidenceAccepted,
        ).toBe(true);

        expect(
          review.reviewBoundary
            .realCustomerOnboardingExecuted,
        ).toBe(false);

        expect(review.nextStep)
          .toBe(
            "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_COMPLETE",
          );
      },
    );

    it(
      "records rejection and retains only the reviewed bounded execution",
      () => {
        const review =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            createDay126ReviewInput({
              outcome:
                "REJECT_AND_RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_ONLY",

              rationale:
                "Owner rejects the bounded execution evidence and retains the exact reviewed execution only.",
            }),
          );

        expect(review.approved)
          .toBe(false);

        expect(
          review.reviewBoundary
            .controlledExecutionEvidenceAccepted,
        ).toBe(false);

        expect(review.nextStep)
          .toBe(
            "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_ONLY",
          );
      },
    );

    it(
      "binds the exact execution decision preparation tenant owner customer and source digest chain",
      () => {
        const input =
          createDay126ReviewInput();

        const source =
          input
            .boundedRealCustomerOnboardingExecution;

        const review =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            input,
          );

        expect(review.executionId)
          .toBe(source.executionId);

        expect(review.executionDigest)
          .toBe(source.executionDigest);

        expect(review.decisionId)
          .toBe(source.decisionId);

        expect(review.decisionDigest)
          .toBe(source.decisionDigest);

        expect(review.preparationId)
          .toBe(source.preparationId);

        expect(review.preparationDigest)
          .toBe(source.preparationDigest);

        expect(review.sourceBoundaryDecisionId)
          .toBe(
            source.sourceBoundaryDecisionId,
          );

        expect(review.sourceBoundaryDecisionDigest)
          .toBe(
            source.sourceBoundaryDecisionDigest,
          );

        expect(
          review.sourceBoundaryPreparationId,
        ).toBe(
          source.sourceBoundaryPreparationId,
        );

        expect(
          review.sourceBoundaryPreparationDigest,
        ).toBe(
          source.sourceBoundaryPreparationDigest,
        );

        expect(review.tenantId)
          .toBe(source.tenantId);

        expect(review.ownerId)
          .toBe(source.ownerId);

        expect(review.customerOrganizationId)
          .toBe(
            source.customerOrganizationId,
          );
      },
    );

    it(
      "reviews the exact one-attempt control receipt and preserves every required execution control",
      () => {
        const review =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            createDay126ReviewInput(),
          );

        expect(review.reviewedExecution)
          .toMatchObject({
            customerOrganizationCount:
              1,

            executionAttemptCount:
              1,

            ownerSupervisionVerified:
              true,

            authenticatedCustomerIdentityRequirementPreserved:
              true,

            explicitCustomerConsentRequirementPreserved:
              true,

            tenantScopePreserved:
              true,

            customerScopePreserved:
              true,

            minimumNecessaryDataRequirementPreserved:
              true,

            retentionAndRedactionRequirementPreserved:
              true,

            idempotencyControlEnforced:
              true,

            atomicityControlEnforced:
              true,

            rollbackControlAvailable:
              true,

            auditEvidenceCreated:
              true,

            executionNextStep:
              "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW",
          });
      },
    );

    it(
      "keeps account session data contact delivery provider production payment autonomous and launch authority blocked",
      () => {
        const review =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            createDay126ReviewInput(),
          );

        expect(
          Object.values(
            review.authorityBoundary,
          ).every(
            (authorized) =>
              authorized === false,
          ),
        ).toBe(true);

        expect(review.reviewBoundary)
          .toMatchObject({
            boundedOnboardingExecutionAuthorized:
              true,

            boundedOnboardingExecutionPerformed:
              true,

            boundedExecutionReviewCompleted:
              true,

            duplicateBoundedExecutionAuthorized:
              false,

            realCustomerOnboardingExecuted:
              false,

            realCustomerOnboardingCompletionRecorded:
              false,

            historicalRecordsMutated:
              false,

            historicalSourceDigestsPreserved:
              true,

            priorActivationAuthorityRevived:
              false,
          });
      },
    );

    it(
      "rejects wrong owner premature review invalid outcome and secret-bearing review input",
      () => {
        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            createDay126ReviewInput({
              ownerId:
                "owner-other",
            }),
          ),
        ).toThrow(
          "execution-bound owner",
        );

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            createDay126ReviewInput({
              reviewedAt:
                "2026-07-19T10:00:12.999Z",
            }),
          ),
        ).toThrow(
          "cannot precede execution",
        );

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            createDay126ReviewInput({
              outcome:
                "INVALID_REVIEW_OUTCOME" as
                  Day126ReviewInput["outcome"],
            }),
          ),
        ).toThrow(
          "outcome is invalid",
        );

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            createDay126ReviewInput({
              rationale:
                "Owner included bearer token value in this review rationale.",
            }),
          ),
        ).toThrow(
          "safe, explicit, and non-secret",
        );
      },
    );

    it(
      "rejects integrity-tampered Day 125 execution evidence",
      () => {
        const input =
          createDay126ReviewInput();

        const tampered = {
          ...input
            .boundedRealCustomerOnboardingExecution,

          executionDigest:
            "a".repeat(64),
        } as Day126ReviewInput[
          "boundedRealCustomerOnboardingExecution"
        ];

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision({
            ...input,

            boundedRealCustomerOnboardingExecution:
              tampered,
          }),
        ).toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound valid and blocks re-signed authority escalation",
      () => {
        const input =
          createDay126ReviewInput();

        const first =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            input,
          );

        const second =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            input,
          );

        expect(second)
          .toEqual(first);

        expect(first.reviewDigest)
          .toMatch(
            /^[0-9a-f]{64}$/,
          );

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedExecution,
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
          validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            first,
          ),
        ).not.toThrow();

        const unsigned =
          {
            ...first,
          } as Record<
            string,
            unknown
          >;

        delete unsigned.reviewDigest;

        const escalatedCore = {
          ...unsigned,

          authorityBoundary: {
            ...first.authorityBoundary,

            publicLaunchAuthorized:
              true,
          },
        };

        const resignedEscalation = {
          ...escalatedCore,

          reviewDigest:
            sha256(
              escalatedCore,
            ),
        } as unknown as
          SalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision;

        expect(() =>
          validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
            resignedEscalation,
          ),
        ).toThrow(
          "authority boundary is invalid",
        );
      },
    );
  },
);