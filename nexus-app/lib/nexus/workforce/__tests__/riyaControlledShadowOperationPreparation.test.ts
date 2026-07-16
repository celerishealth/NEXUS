import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES,
} from "../riyaRecommendationSpecialistQualificationStandard";

import {
  createRiyaQualificationReadinessAssessment,
} from "../riyaQualificationReadinessAssessment";

import {
  createRiyaOwnerQualificationReviewDecision,
} from "../riyaOwnerQualificationReviewDecision";

import {
  createRiyaQualificationTestingAdmission,
} from "../riyaQualificationTestingAdmission";

import {
  createRiyaQualificationTestPlan,
} from "../riyaQualificationTestPlan";

import {
  createRiyaFormalQualificationTestPlan,
} from "../riyaFormalQualificationTestPlan";

import {
  createRiyaFormalQualificationFixturePack,
} from "../riyaFormalQualificationFixturePack";

import {
  executeRiyaFormalQualificationEvidence,
} from "../riyaFormalQualificationExecutionEvidence";

import {
  createRiyaFormalQualificationReviewDecision,
} from "../riyaFormalQualificationReviewDecision";

import {
  issueRiyaFormalQualification,
  type RiyaFormalQualificationIssuance,
} from "../riyaFormalQualificationIssuance";

import {
  createRiyaQualifiedEmployeeManifestIssuance,
  type RiyaQualifiedEmployeeManifestIssuance,
} from "../riyaQualifiedEmployeeManifestIssuance";

import {
  createRiyaActivationCandidateIssuance,
  validateRiyaActivationCandidateIssuance,
  type RiyaActivationCandidateIssuance,
} from "../riyaActivationCandidateIssuance";

import {
  createRiyaOwnerActivationDecision,
  validateRiyaOwnerActivationDecision,
  type RiyaOwnerActivationDecision,
  type RiyaOwnerActivationDecisionType,
} from "../riyaOwnerActivationDecision";
import {
  createRiyaOwnerActivatedRuntimeIssuance,
  validateRiyaOwnerActivatedRuntimeIssuance,
  type RiyaOwnerActivatedRuntimeIssuance,
} from "../riyaOwnerActivatedRuntimeIssuance";
import {
  createRiyaControlledShadowOperationPreparation,
  validateRiyaControlledShadowOperationPreparation,
  type RiyaControlledShadowOperationPreparation,
} from "../riyaControlledShadowOperationPreparation";
const TENANT_ID =
  "tenant-nexus-internal-001";

const OWNER_ID =
  "owner-prashant-001";

const REGISTRY_CREATED_AT =
  "2026-07-16T14:00:00.000Z";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function specialistPlan() {
  const readiness =
    createRiyaQualificationReadinessAssessment({
      assessmentId:
        "riya-readiness-assessment-day-54",

      employeeId:
        "employee-riya-recommendation-specialist-v1",

      templateId:
        "template-riya-recommendation-specialist-v1",

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      evaluatedAt:
        "2026-07-16T15:00:00.000Z",

      caseEvidence:
        RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES.map(
          (
            qualificationCase,
            index,
          ) => ({
            caseId:
              qualificationCase.caseId,

            passed:
              true,

            evidenceDigest:
              digest(
                `${qualificationCase.caseId}:${index}`,
              ),
          }),
        ),

      safetyEvidence: {
        sandboxOnlyPassed:
          true,

        tenantIsolationPassed:
          true,

        customerContextIsolationPassed:
          true,

        unsupportedClaimsBlocked:
          true,

        realCustomerContactPerformed:
          false,

        externalDeliveryPerformed:
          false,

        liveProviderExecutionPerformed:
          false,

        productionDatabaseTouched:
          false,

        paymentExecutionPerformed:
          false,

        autonomousDecisionPerformed:
          false,
      },
    });

  const ownerDecision =
    createRiyaOwnerQualificationReviewDecision({
      decisionId:
        "riya-owner-review-decision-day-54",

      readiness,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      decision:
        "APPROVE_FORMAL_QUALIFICATION_TESTING",

      rationale:
        "Controlled Riya formal qualification testing remains owner approved.",

      decidedAt:
        "2026-07-16T15:15:00.000Z",
    });

  const admission =
    createRiyaQualificationTestingAdmission({
      admissionId:
        "riya-testing-admission-day-54",

      decision:
        ownerDecision,

      employeeId:
        ownerDecision.employeeId,

      templateId:
        ownerDecision.templateId,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      preparedAt:
        "2026-07-16T15:30:00.000Z",
    });

  return createRiyaQualificationTestPlan({
    planId:
      "riya-specialist-plan-day-54",

    admission,

    tenantId:
      TENANT_ID,

    ownerId:
      OWNER_ID,

    plannedAt:
      "2026-07-16T15:45:00.000Z",
  });
}

let cachedFormal:
  RiyaFormalQualificationIssuance |
  null = null;

async function formalQualification() {
  if (cachedFormal !== null) {
    return cachedFormal;
  }

  const plan =
    createRiyaFormalQualificationTestPlan({
      planId:
        "riya-formal-plan-day-54",

      specialistPlan:
        specialistPlan(),

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      evaluatorId:
        "evaluator-independent-001",

      registryCreatedAt:
        REGISTRY_CREATED_AT,

      preparedAt:
        "2026-07-16T16:00:00.000Z",
    });

  const fixturePack =
    createRiyaFormalQualificationFixturePack({
      fixturePackId:
        "riya-formal-fixture-pack-day-54",

      plan,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      preparedAt:
        "2026-07-16T16:15:00.000Z",
    });

  const evidenceLedger =
    await executeRiyaFormalQualificationEvidence({
      ledgerId:
        "riya-formal-evidence-ledger-day-54",

      plan,

      fixturePack,

      ownerId:
        OWNER_ID,

      evaluatorId:
        "evaluator-independent-001",

      executedAt:
        "2026-07-16T16:30:00.000Z",
    });

  const decision =
    createRiyaFormalQualificationReviewDecision({
      decisionId:
        "riya-formal-review-day-54",

      evidenceLedger,

      plan,

      fixturePack,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      outcome:
        "APPROVE_FORMAL_QUALIFICATION",

      rationale:
        "Owner reviewed the complete formal evidence before qualification issuance.",

      reviewedAt:
        "2026-07-16T16:45:00.000Z",
    });

  cachedFormal =
    issueRiyaFormalQualification({
      issuanceId:
        "riya-formal-qualification-issuance-day-54",

      qualificationPlan:
        plan,

      fixturePack,

      decision,

      evidenceLedger,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      qualifiedAt:
        "2026-07-16T17:00:00.000Z",
    });

  return cachedFormal;
}

let cachedManifest:
  RiyaQualifiedEmployeeManifestIssuance |
  null = null;

async function qualifiedManifest() {
  if (cachedManifest !== null) {
    return cachedManifest;
  }

  cachedManifest =
    createRiyaQualifiedEmployeeManifestIssuance({
      manifestIssuanceId:
        "riya-qualified-manifest-issuance-day-54",

      formalQualification:
        await formalQualification(),

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      registryCreatedAt:
        REGISTRY_CREATED_AT,

      createdAt:
        "2026-07-16T17:15:00.000Z",
    });

  return cachedManifest;
}

async function activationInput(
  overrides: Readonly<{
    tenantId?: string;
    ownerId?: string;
    preparedAt?: string;
  }> = {},
) {
  return {
    activationCandidateIssuanceId:
      "riya-activation-candidate-issuance-day-54",

    qualifiedManifestIssuance:
      await qualifiedManifest(),

    formalQualification:
      await formalQualification(),

    runtimeId:
      "runtime-riya-paused-day-54",

    tenantId:
      overrides.tenantId ??
      TENANT_ID,

    ownerId:
      overrides.ownerId ??
      OWNER_ID,

    preparedAt:
      overrides.preparedAt ??
      "2026-07-16T17:30:00.000Z",
  };
}

function createOwnerDecision(
  source:
    RiyaActivationCandidateIssuance,

  decision:
    RiyaOwnerActivationDecisionType,

  overrides: Readonly<{
    ownerId?: string;
    reason?: string;
    decidedAt?: string;
  }> = {},
) {
  return createRiyaOwnerActivationDecision({
    activationCandidateIssuance:
      source,

    decisionId:
      "riya-owner-activation-decision-day-55",

    ownerId:
      overrides.ownerId ??
      OWNER_ID,

    decision,

    reason:
      overrides.reason ??
      "Owner reviewed Riya's qualified activation candidate and recorded the controlled decision.",

    decidedAt:
      overrides.decidedAt ??
      "2026-07-16T17:45:00.000Z",
  });
}

function createRuntimeIssuance(
  source:
    RiyaActivationCandidateIssuance,

  decision =
    createOwnerDecision(
      source,
      "APPROVE_RIYA_ACTIVATION",
    ),

  activatedAt =
    "2026-07-16T18:00:00.000Z",
) {
  return createRiyaOwnerActivatedRuntimeIssuance({
    runtimeIssuanceId:
      "riya-owner-activated-runtime-issuance-day-56",

    activationCandidateIssuance:
      source,

    ownerActivationDecision:
      decision,

    activatedAt,
  });
}

function createShadowPreparation(
  source:
    RiyaOwnerActivatedRuntimeIssuance,

  options: Readonly<{
    preparationId?: string;
    preparedAt?: string;
  }> = {},
) {
  return createRiyaControlledShadowOperationPreparation({
    preparationId:
      options.preparationId ??
      "riya-controlled-shadow-preparation-day-57",

    ownerActivatedRuntimeIssuance:
      source,

    preparedAt:
      options.preparedAt ??
      "2026-07-16T18:15:00.000Z",
  });
}

describe(
  "Riya controlled shadow operation preparation",
  () => {
    it(
      "prepares one controlled shadow recommendation operation without executing it",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const preparation =
          createShadowPreparation(
            source,
          );

        expect(
          preparation.preparationState,
        ).toBe(
          "CONTROLLED_SHADOW_OPERATION_PREPARED",
        );

        expect(
          preparation.nextStep,
        ).toBe(
          "EXECUTE_CONTROLLED_SHADOW_OPERATION",
        );

        expect(
          preparation.authorityBoundary
            .shadowExecutionEligible,
        ).toBe(true);

        expect(
          preparation.authorityBoundary
            .shadowExecutionExecuted,
        ).toBe(false);

        expect(
          preparation.authorityBoundary
            .recommendationDraftCreated,
        ).toBe(false);
      },
    );

    it(
      "locks the fixture to one synthetic sanitized draft-only sandbox recommendation",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        expect(
          createShadowPreparation(
            source,
          ).shadowFixture,
        ).toEqual({
          fixtureId:
            "fixture-riya-controlled-shadow-recommendation-v1",

          scenarioId:
            "scenario-riya-controlled-shadow-recommendation-001",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          inquiryEvidenceToolId:
            "tool-inquiry-read",

          inquiryEvidenceToolMode:
            "READ_ONLY",

          customerContextToolId:
            "tool-customer-memory-read",

          customerContextToolMode:
            "READ_ONLY",

          recommendationDraftToolId:
            "tool-recommendation-draft",

          recommendationDraftToolMode:
            "DRAFT_ONLY",

          maximumRecommendationCount:
            1,

          executionMode:
            "SANDBOX_ONLY",

          ownerReviewRequired:
            true,
        });
      },
    );

    it(
      "preserves runtime issuance manifest registry tenant owner and employee bindings",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const preparation =
          createShadowPreparation(
            source,
          );

        expect(preparation).toMatchObject({
          employeeId:
            "employee-riya-recommendation-specialist-v1",

          templateId:
            "template-riya-recommendation-specialist-v1",

          employeeCode:
            "nx-sales-004",

          displayName:
            "Riya",

          officialRole:
            "AI Recommendation Specialist",

          runtimeIssuanceId:
            source.runtimeIssuanceId,

          runtimeIssuanceDigest:
            source.runtimeIssuanceDigest,

          runtimeId:
            source.runtimeId,

          runtimeDigest:
            source.ownerActivatedRuntime
              .runtimeDigest,

          qualifiedManifestDigest:
            source.qualifiedManifestDigest,

          sourceRegistryCreatedAt:
            source.sourceRegistryCreatedAt,

          tenantId:
            source.tenantId,

          ownerId:
            source.ownerId,
        });
      },
    );

    it(
      "keeps real customer external production payment autonomous and launch authority blocked",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const boundary =
          createShadowPreparation(
            source,
          ).authorityBoundary;

        expect(boundary).toMatchObject({
          ownerActivatedRuntimeIssuanceBound:
            true,

          ownerActivationBound:
            true,

          qualifiedManifestBound:
            true,

          registryCreationTimeBound:
            true,

          runtimeIdentityBound:
            true,

          tenantIdentityBound:
            true,

          ownerIdentityBound:
            true,

          approvalBypassAllowed:
            false,

          runtimeReadyForControlledWork:
            true,

          shadowExecutionEligible:
            true,

          shadowExecutionExecuted:
            false,

          syntheticInquiryEvidencePrepared:
            true,

          syntheticCustomerContextOnly:
            true,

          recommendationDraftCreated:
            false,

          ownerReviewRequired:
            true,

          emergencyPauseAvailable:
            true,

          realCustomerDataAccessAuthorized:
            false,

          realCustomerContactAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          autonomousDecisionAuthorized:
            false,

          productionReadinessAuthorized:
            false,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "blocks controlled shadow preparation before runtime activation",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        expect(() =>
          createShadowPreparation(
            source,
            {
              preparedAt:
                "2026-07-16T17:59:59.999Z",
            },
          ),
        ).toThrow(
          "cannot precede runtime activation",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 56 runtime issuance evidence",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const tampered = {
          ...source,

          ownerId:
            "owner-other-day-57",
        } as
          RiyaOwnerActivatedRuntimeIssuance;

        expect(() =>
          createShadowPreparation(
            tampered,
          ),
        ).toThrow(
          "runtime issuance",
        );
      },
    );

    it(
      "rejects a runtime that no longer matches its tenant binding",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const tamperedRuntime = {
          ...source.ownerActivatedRuntime,

          tenantId:
            "tenant-other-day-57",
        };

        const tampered = {
          ...source,

          ownerActivatedRuntime:
            tamperedRuntime,
        } as
          RiyaOwnerActivatedRuntimeIssuance;

        expect(() =>
          createShadowPreparation(
            tampered,
          ),
        ).toThrow();
      },
    );

    it(
      "is deterministic deeply immutable self-validating and rejects secret-bearing identifiers",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const first =
          createShadowPreparation(
            source,
          );

        const second =
          createShadowPreparation(
            source,
          );

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.shadowFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(
          Reflect.set(
            first.shadowFixture,
            "maximumRecommendationCount",
            2,
          ),
        ).toBe(false);

        expect(() =>
          validateRiyaControlledShadowOperationPreparation(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "REAL_CUSTOMER_RECOMMENDATION",
        } as unknown as
          RiyaControlledShadowOperationPreparation;

        expect(() =>
          validateRiyaControlledShadowOperationPreparation(
            tampered,
          ),
        ).toThrow(
          "preparation identity is invalid",
        );

        expect(() =>
          createShadowPreparation(
            source,
            {
              preparationId:
                "riya-secret-token-day-57",
            },
          ),
        ).toThrow(
          "preparationId is invalid",
        );
      },
    );
  },
);
