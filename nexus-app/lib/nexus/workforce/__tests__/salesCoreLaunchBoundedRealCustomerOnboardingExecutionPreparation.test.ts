import {
  createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation,
  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation,
  type CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparationInput,
  type SalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation,
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

describe(
  "sales core launch bounded real-customer onboarding execution preparation",
  () => {
    it(
      "prepares exactly one bounded onboarding plan and awaits owner execution decision",
      () => {
        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            createExecutionPreparationInput(),
          );

        expect(result.preparationState)
          .toBe(
            "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED",
          );

        expect(
          result.executionPlan
            .customerOrganizationCount,
        ).toBe(1);

        expect(result.nextStep)
          .toBe(
            "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION",
          );

        expect(
          result.preparationBoundary
            .ownerExecutionDecisionRequired,
        ).toBe(true);

        expect(
          result.preparationBoundary
            .ownerExecutionDecisionRecorded,
        ).toBe(false);

        expect(
          result.preparationBoundary
            .boundedOnboardingExecutionAuthorized,
        ).toBe(false);
      },
    );

    it(
      "binds the exact source decision tenant owner customer and digest chain",
      () => {
        const input =
          createExecutionPreparationInput();

        const source =
          input.customerOnboardingAndDeliveryBoundaryDecision;

        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            input,
          );

        expect(result.sourceDecisionId)
          .toBe(source.decisionId);

        expect(result.sourceDecisionDigest)
          .toBe(source.decisionDigest);

        expect(
          result.sourceBoundaryPreparationId,
        ).toBe(source.preparationId);

        expect(
          result.sourceBoundaryPreparationDigest,
        ).toBe(source.preparationDigest);

        expect(result.tenantId)
          .toBe(source.tenantId);

        expect(result.ownerId)
          .toBe(source.ownerId);

        expect(result.customerOrganizationId)
          .toBe(source.customerOrganizationId);
      },
    );

    it(
      "preserves authenticated portal-only delivery consent and tenant-customer scope",
      () => {
        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            createExecutionPreparationInput(),
          );

        expect(result.executionPlan)
          .toMatchObject({
            onboardingMode:
              "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER",

            deliveryMode:
              "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY",

            ownerSupervisionRequired:
              true,

            authenticatedCustomerIdentityRequired:
              true,

            explicitCustomerConsentRequired:
              true,

            tenantScopedAccessRequired:
              true,

            customerScopedAccessRequired:
              true,

            minimumNecessaryDataRequired:
              true,

            retentionAndRedactionRequired:
              true,

            idempotentExecutionRequired:
              true,

            atomicExecutionRequired:
              true,

            rollbackRequired:
              true,

            auditEvidenceRequired:
              true,
          });
      },
    );

    it(
      "keeps onboarding account access contact delivery payment and launch execution blocked",
      () => {
        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            createExecutionPreparationInput(),
          );

        expect(
          Object.values(
            result.authorityBoundary,
          ).every(
            (authorized) =>
              authorized === false,
          ),
        ).toBe(true);

        expect(result.executionPlan)
          .toMatchObject({
            realCustomerContactDetailsStored:
              false,

            customerAccountCreated:
              false,

            customerSessionIssued:
              false,

            realCustomerOnboardingExecuted:
              false,

            authenticatedPortalReleaseExecuted:
              false,
          });
      },
    );

    it(
      "rejects an owner decision that did not approve bounded preparation",
      () => {
        const rejectedDecision =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput({
              decision:
                "REJECT_AND_RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY",
            }),
          );

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation({
            ...createExecutionPreparationInput(),

            customerOnboardingAndDeliveryBoundaryDecision:
              rejectedDecision,
          }),
        ).toThrow(
          "does not authorize bounded execution preparation",
        );
      },
    );

    it(
      "rejects cross-owner premature and secret-bearing preparation",
      () => {
        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            createExecutionPreparationInput({
              ownerId:
                "owner-other",
            }),
          ),
        ).toThrow(
          "onboarding-decision-bound owner",
        );

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            createExecutionPreparationInput({
              preparedAt:
                "2026-07-19T10:00:09.999Z",
            }),
          ),
        ).toThrow(
          "cannot precede the owner decision",
        );

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            createExecutionPreparationInput({
              rationale:
                "Owner included bearer token secret-value in the bounded preparation.",
            }),
          ),
        ).toThrow(
          "safe, explicit, and non-secret",
        );
      },
    );

    it(
      "is deterministic digest-bound valid and deeply immutable",
      () => {
        const input =
          createExecutionPreparationInput();

        const first =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            input,
          );

        const second =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            input,
          );

        expect(second)
          .toEqual(first);

        expect(first.preparationDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.executionPlan,
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
          validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            first,
          ),
        ).not.toThrow();
      },
    );

    it(
      "blocks tampered source evidence and re-signed authority escalation",
      () => {
        const input =
          createExecutionPreparationInput();

        const source =
          input.customerOnboardingAndDeliveryBoundaryDecision;

        const tamperedSource = {
          ...source,

          decisionBoundary: {
            ...source.decisionBoundary,

            boundedOnboardingExecutionAuthorized:
              true,
          },
        };

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation({
            ...input,

            customerOnboardingAndDeliveryBoundaryDecision:
              tamperedSource as unknown as
                CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparationInput[
                  "customerOnboardingAndDeliveryBoundaryDecision"
                ],
          }),
        ).toThrow(
          "integrity verification failed",
        );

        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            input,
          );

        const unsigned = {
          ...result,

          authorityBoundary: {
            ...result.authorityBoundary,

            externalDeliveryExecutionAuthorized:
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
          SalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation;

        expect(() =>
          validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            escalated,
          ),
        ).toThrow(
          "bounded real-customer onboarding execution preparation is invalid",
        );
      },
    );
  },
);
