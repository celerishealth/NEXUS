import {
  executeSalesCoreLaunchBoundedRealCustomerOnboarding,
  type SalesCoreLaunchBoundedRealCustomerOnboardingExecution,
  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecution,
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

describe(
  "sales core launch bounded real-customer onboarding execution",
  () => {
    it(
      "records exactly one approved bounded execution and stops for mandatory owner review",
      () => {
        const execution =
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            createDay125ExecutionInput(),
          );

        expect(execution.executionState)
          .toBe(
            "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_RECORDED",
          );

        expect(
          execution.executionBoundary
            .boundedOnboardingExecutionPerformed,
        ).toBe(true);

        expect(
          execution.executionBoundary
            .realCustomerOnboardingExecuted,
        ).toBe(false);

        expect(execution.nextStep)
          .toBe(
            "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW",
          );
      },
    );

    it(
      "binds the Day 124 decision preparation tenant owner customer and complete source digest chain",
      () => {
        const input =
          createDay125ExecutionInput();

        const source =
          input
            .boundedRealCustomerOnboardingExecutionDecision;

        const execution =
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            input,
          );

        expect(execution.decisionId)
          .toBe(source.decisionId);

        expect(execution.decisionDigest)
          .toBe(source.decisionDigest);

        expect(execution.preparationId)
          .toBe(source.preparationId);

        expect(execution.preparationDigest)
          .toBe(source.preparationDigest);

        expect(execution.sourceBoundaryDecisionId)
          .toBe(
            source.sourceBoundaryDecisionId,
          );

        expect(execution.sourceBoundaryDecisionDigest)
          .toBe(
            source.sourceBoundaryDecisionDigest,
          );

        expect(
          execution.sourceBoundaryPreparationId,
        ).toBe(
          source.sourceBoundaryPreparationId,
        );

        expect(
          execution.sourceBoundaryPreparationDigest,
        ).toBe(
          source.sourceBoundaryPreparationDigest,
        );

        expect(execution.tenantId)
          .toBe(source.tenantId);

        expect(execution.ownerId)
          .toBe(source.ownerId);

        expect(execution.customerOrganizationId)
          .toBe(
            source.customerOrganizationId,
          );

        expect(execution.customerOrganizationName)
          .toBe(
            source.customerOrganizationName,
          );
      },
    );

    it(
      "preserves consent identity tenant customer minimum-data retention idempotency atomic rollback and audit controls",
      () => {
        const execution =
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            createDay125ExecutionInput(),
          );

        expect(execution.executionReceipt)
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
          });
      },
    );

    it(
      "keeps account session customer data contact delivery provider production payment autonomous and launch effects blocked",
      () => {
        const execution =
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            createDay125ExecutionInput(),
          );

        expect(execution.executionBoundary)
          .toMatchObject({
            boundedOnboardingExecutionAuthorized:
              true,

            boundedOnboardingExecutionPerformed:
              true,

            ownerReviewRequiredAfterExecution:
              true,

            ownerPostExecutionReviewRecorded:
              false,

            realCustomerOnboardingExecuted:
              false,

            realCustomerContactDetailsStored:
              false,

            customerAccountCreationAuthorized:
              false,

            customerAccountCreated:
              false,

            customerSessionIssuanceAuthorized:
              false,

            customerSessionIssued:
              false,

            realCustomerDataAccessAuthorized:
              false,

            realCustomerDataAccessed:
              false,

            realCustomerContactAuthorized:
              false,

            realCustomerContactPerformed:
              false,

            customerCommitmentAuthorized:
              false,

            customerCommitmentCreated:
              false,

            authenticatedPortalReleaseExecutionAuthorized:
              false,

            authenticatedPortalReleaseExecuted:
              false,

            externalDeliveryExecutionAuthorized:
              false,

            externalEmailDeliveryAuthorized:
              false,

            externalWhatsAppDeliveryAuthorized:
              false,

            externalSmsDeliveryAuthorized:
              false,

            publicLinkDeliveryAuthorized:
              false,

            liveProviderExecutionAuthorized:
              false,

            productionDatabaseAuthorized:
              false,

            productionMutationAuthorized:
              false,

            paidPilotEligible:
              false,

            paidPilotAuthorized:
              false,

            paymentExecutionAuthorized:
              false,

            invoiceCreationAuthorized:
              false,

            subscriptionActivationAuthorized:
              false,

            entitlementMutationAuthorized:
              false,

            autonomousExecutionAuthorized:
              false,

            publicLaunchAuthorized:
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
      "rejects rejection decisions and tampered Day 124 decision integrity",
      () => {
        const rejected =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            createExecutionDecisionInput({
              decision:
                "REJECT_AND_RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY",
            }),
          );

        expect(() =>
          executeSalesCoreLaunchBoundedRealCustomerOnboarding({
            ...createDay125ExecutionInput(),

            boundedRealCustomerOnboardingExecutionDecision:
              rejected,
          }),
        ).toThrow(
          "approved Workforce Day 124",
        );

        const input =
          createDay125ExecutionInput();

        const tampered = {
          ...input
            .boundedRealCustomerOnboardingExecutionDecision,

          decisionDigest:
            "a".repeat(64),
        } as Day125ExecutionInput[
          "boundedRealCustomerOnboardingExecutionDecision"
        ];

        expect(() =>
          executeSalesCoreLaunchBoundedRealCustomerOnboarding({
            ...input,

            boundedRealCustomerOnboardingExecutionDecision:
              tampered,
          }),
        ).toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "rejects a wrong owner premature execution and secret-bearing identity",
      () => {
        expect(() =>
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            createDay125ExecutionInput({
              ownerId:
                "owner-other",
            }),
          ),
        ).toThrow(
          "Day 124 decision-bound owner",
        );

        expect(() =>
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            createDay125ExecutionInput({
              executedAt:
                "2026-07-19T10:00:11.999Z",
            }),
          ),
        ).toThrow(
          "cannot precede owner approval",
        );

        expect(() =>
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            createDay125ExecutionInput({
              executionId:
                "secret-bounded-onboarding-execution",
            }),
          ),
        ).toThrow(
          "execution ID is invalid",
        );
      },
    );

    it(
      "is deterministic digest-bound valid and deeply immutable",
      () => {
        const input =
          createDay125ExecutionInput();

        const first =
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            input,
          );

        const second =
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            input,
          );

        expect(second)
          .toEqual(first);

        expect(first.executionDigest)
          .toMatch(
            /^[0-9a-f]{64}$/,
          );

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedDecision,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionReceipt,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateSalesCoreLaunchBoundedRealCustomerOnboardingExecution(
            first,
          ),
        ).not.toThrow();
      },
    );

    it(
      "rejects tampered source authority and re-signed execution authority escalation",
      () => {
        const input =
          createDay125ExecutionInput();

        const source =
          input
            .boundedRealCustomerOnboardingExecutionDecision;

        const tamperedSource = {
          ...source,

          authorityBoundary: {
            ...source.authorityBoundary,

            publicLaunchAuthorized:
              true,
          },
        } as unknown as Day125ExecutionInput[
          "boundedRealCustomerOnboardingExecutionDecision"
        ];

        expect(() =>
          executeSalesCoreLaunchBoundedRealCustomerOnboarding({
            ...input,

            boundedRealCustomerOnboardingExecutionDecision:
              tamperedSource,
          }),
        ).toThrow(
          "integrity verification failed",
        );

        const execution =
          executeSalesCoreLaunchBoundedRealCustomerOnboarding(
            input,
          );

        const {
          executionDigest:
            _executionDigest,

          ...unsignedExecution
        } = execution;

        void _executionDigest;

        const escalatedCore = {
          ...unsignedExecution,

          executionBoundary: {
            ...execution.executionBoundary,

            customerAccountCreated:
              true,
          },
        };

        const resignedEscalation = {
          ...escalatedCore,

          executionDigest:
            sha256(escalatedCore),
        } as
          SalesCoreLaunchBoundedRealCustomerOnboardingExecution;

        expect(() =>
          validateSalesCoreLaunchBoundedRealCustomerOnboardingExecution(
            resignedEscalation,
          ),
        ).toThrow(
          "authority boundary is invalid",
        );
      },
    );
  },
);