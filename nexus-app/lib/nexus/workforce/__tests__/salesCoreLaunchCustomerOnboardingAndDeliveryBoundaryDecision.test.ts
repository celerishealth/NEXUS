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
  validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision,
  type CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecisionInput,
  type SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision,
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

describe(
  "salesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision",
  () => {
    it(
      "records owner approval without performing onboarding execution",
      () => {
        const decision =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput(),
          );

        expect(decision).toMatchObject({
          decisionState:
            "OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION_RECORDED",

          approved:
            true,

          nextStep:
            "PREPARE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION",
        });

        expect(decision.decisionBoundary)
          .toMatchObject({
            realCustomerOnboardingBoundaryApproved:
              true,

            ownerApprovedDeliveryBoundaryRecorded:
              true,

            boundedOnboardingExecutionPreparationEligible:
              true,

            boundedOnboardingExecutionAuthorized:
              false,

            realCustomerOnboardingExecuted:
              false,
          });
      },
    );

    it(
      "records rejection and retains preparation only",
      () => {
        const decision =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput({
              decision:
                "REJECT_AND_RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY",
            }),
          );

        expect(decision.approved)
          .toBe(false);

        expect(decision.nextStep)
          .toBe(
            "RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY",
          );

        expect(
          decision.decisionBoundary
            .realCustomerOnboardingBoundaryApproved,
        ).toBe(false);

        expect(
          decision.decisionBoundary
            .ownerApprovedDeliveryBoundaryRecorded,
        ).toBe(false);
      },
    );

    it(
      "binds the exact tenant owner customer and source evidence",
      () => {
        const source =
          createPreparation();

        const decision =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput({
              customerOnboardingAndDeliveryBoundaryPreparation:
                source,
            }),
          );

        expect(decision.tenantId)
          .toBe(source.tenantId);

        expect(decision.ownerId)
          .toBe(source.ownerId);

        expect(decision.customerOrganizationId)
          .toBe(source.customerOrganizationId);

        expect(decision.preparationDigest)
          .toBe(source.preparationDigest);

        expect(decision.sourceClosureDigest)
          .toBe(source.sourceClosureDigest);

        expect(decision.sourceReassessmentDigest)
          .toBe(source.sourceReassessmentDigest);

        expect(decision.sourceRequalificationDigest)
          .toBe(source.sourceRequalificationDigest);

        expect(decision.sourceContainmentDigest)
          .toBe(source.sourceContainmentDigest);

        expect(decision.sourceRegistryDigest)
          .toBe(source.sourceRegistryDigest);
      },
    );

    it(
      "keeps every consequential execution authority blocked",
      () => {
        const decision =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput(),
          );

        expect(decision.decisionBoundary)
          .toMatchObject({
            customerAccountCreationAuthorized:
              false,

            customerSessionIssuanceAuthorized:
              false,

            realCustomerDataAccessAuthorized:
              false,

            realCustomerContactAuthorized:
              false,

            customerCommitmentAuthorized:
              false,

            externalDeliveryExecutionAuthorized:
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
          });
      },
    );

    it(
      "blocks a decision from the wrong owner",
      () => {
        expect(() =>
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput({
              ownerId:
                "owner-other",
            }),
          ),
        ).toThrow(
          "preparation-bound owner",
        );
      },
    );

    it(
      "blocks early decisions and secret-bearing reasons",
      () => {
        expect(() =>
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput({
              decidedAt:
                "2026-07-19T10:00:08.999Z",
            }),
          ),
        ).toThrow(
          "cannot precede preparation",
        );

        expect(() =>
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput({
              reason:
                "Owner included bearer token secret-value in the onboarding decision.",
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
          createInput();

        const first =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            input,
          );

        const second =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
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
            first.decisionBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            first,
          ),
        ).not.toThrow();
      },
    );

    it(
      "blocks tampered source evidence and re-signed authority escalation",
      () => {
        const source =
          createPreparation();

        const tamperedSourceCore = {
          ...source,

          authorityBoundary: {
            ...source.authorityBoundary,

            realCustomerContactAuthorized:
              true,
          },
        } as unknown as
          Record<string, unknown>;

        delete tamperedSourceCore.preparationDigest;

        const tamperedSource =
          deepFreeze({
            ...tamperedSourceCore,

            preparationDigest:
              sha256(tamperedSourceCore),
          }) as unknown as
            SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation;

        expect(() =>
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput({
              customerOnboardingAndDeliveryBoundaryPreparation:
                tamperedSource,
            }),
          ),
        ).toThrow(
          "preparation state is invalid",
        );

        const decision =
          createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            createInput(),
          );

        const escalatedCore = {
          ...decision,

          decisionBoundary: {
            ...decision.decisionBoundary,

            externalDeliveryExecutionAuthorized:
              true,
          },
        } as unknown as
          Record<string, unknown>;

        delete escalatedCore.decisionDigest;

        const escalated =
          deepFreeze({
            ...escalatedCore,

            decisionDigest:
              sha256(escalatedCore),
          }) as unknown as
            SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision;

        expect(() =>
          validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
            escalated,
          ),
        ).toThrow(
          "owner decision is invalid",
        );
      },
    );
  },
);