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

import {
  createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision,
  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision,
  type CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecisionInput,
  type SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision,
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

describe(
  "sales core launch bounded real-customer onboarding execution decision",
  () => {
    it(
      "records owner approval without performing onboarding execution",
      () => {
        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            createExecutionDecisionInput(),
          );

        expect(
          result.approvedForBoundedOnboardingExecution,
        ).toBe(true);

        expect(
          result.authorityBoundary
            .boundedOnboardingExecutionAuthorized,
        ).toBe(true);

        expect(
          result.authorityBoundary
            .boundedOnboardingExecutionPerformed,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .realCustomerOnboardingExecuted,
        ).toBe(false);

        expect(result.nextStep)
          .toBe(
            "EXECUTE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING",
          );
      },
    );

    it(
      "records rejection and retains execution preparation only",
      () => {
        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            createExecutionDecisionInput({
              decision:
                "REJECT_AND_RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY",
            }),
          );

        expect(
          result.approvedForBoundedOnboardingExecution,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .boundedOnboardingExecutionAuthorized,
        ).toBe(false);

        expect(result.nextStep)
          .toBe(
            "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY",
          );
      },
    );

    it(
      "binds the exact preparation tenant owner customer and source digest chain",
      () => {
        const input =
          createExecutionDecisionInput();

        const source =
          input.boundedRealCustomerOnboardingExecutionPreparation;

        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            input,
          );

        expect(result.preparationId)
          .toBe(source.preparationId);

        expect(result.preparationDigest)
          .toBe(source.preparationDigest);

        expect(result.sourceBoundaryDecisionId)
          .toBe(source.sourceDecisionId);

        expect(result.sourceBoundaryDecisionDigest)
          .toBe(source.sourceDecisionDigest);

        expect(
          result.sourceBoundaryPreparationId,
        ).toBe(
          source.sourceBoundaryPreparationId,
        );

        expect(
          result.sourceBoundaryPreparationDigest,
        ).toBe(
          source.sourceBoundaryPreparationDigest,
        );

        expect(result.tenantId)
          .toBe(source.tenantId);

        expect(result.ownerId)
          .toBe(source.ownerId);

        expect(result.customerOrganizationId)
          .toBe(source.customerOrganizationId);
      },
    );

    it(
      "keeps every broader consequential authority blocked",
      () => {
        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            createExecutionDecisionInput(),
          );

        expect(result.authorityBoundary)
          .toMatchObject({
            boundedOnboardingExecutionAuthorized:
              true,

            boundedOnboardingExecutionPerformed:
              false,

            realCustomerOnboardingExecuted:
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

            realCustomerContactAuthorized:
              false,

            customerCommitmentAuthorized:
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
          });
      },
    );

    it(
      "rejects a decision from the wrong owner",
      () => {
        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            createExecutionDecisionInput({
              ownerId:
                "owner-other",
            }),
          ),
        ).toThrow(
          "bounded-onboarding-preparation-bound owner",
        );
      },
    );

    it(
      "rejects premature invalid and secret-bearing decisions",
      () => {
        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            createExecutionDecisionInput({
              decidedAt:
                "2026-07-19T10:00:10.999Z",
            }),
          ),
        ).toThrow(
          "cannot precede preparation",
        );

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            createExecutionDecisionInput({
              decision:
                "INVALID_DECISION" as never,
            }),
          ),
        ).toThrow(
          "execution decision is invalid",
        );

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            createExecutionDecisionInput({
              reason:
                "Owner included bearer token secret-value while approving onboarding execution.",
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
          createExecutionDecisionInput();

        const first =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            input,
          );

        const second =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            input,
          );

        expect(second)
          .toEqual(first);

        expect(first.decisionDigest)
          .toMatch(/^[0-9a-f]{64}$/);

        expect(Object.isFrozen(first))
          .toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedPreparation,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            first,
          ),
        ).not.toThrow();

        expect(() =>
          validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
            input.boundedRealCustomerOnboardingExecutionPreparation,
          ),
        ).not.toThrow();
      },
    );

    it(
      "blocks tampered preparation evidence and re-signed authority escalation",
      () => {
        const input =
          createExecutionDecisionInput();

        const source =
          input.boundedRealCustomerOnboardingExecutionPreparation;

        const tamperedSource = {
          ...source,

          authorityBoundary: {
            ...source.authorityBoundary,

            realCustomerContactAuthorized:
              true,
          },
        } as unknown as
          SalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation;

        expect(() =>
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision({
            ...input,

            boundedRealCustomerOnboardingExecutionPreparation:
              tamperedSource,
          }),
        ).toThrow(
          "integrity verification failed",
        );

        const result =
          createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
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

        delete unsigned.decisionDigest;

        const escalated = {
          ...unsigned,

          decisionDigest:
            sha256(unsigned),
        } as unknown as
          SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision;

        expect(() =>
          validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
            escalated,
          ),
        ).toThrow(
          "bounded real-customer onboarding execution decision is invalid",
        );
      },
    );
  },
);
