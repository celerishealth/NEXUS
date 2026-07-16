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
import {
  executeRiyaControlledShadowOperation,
  validateRiyaControlledShadowOperationExecution,
  type RiyaControlledShadowOperationExecution,
} from "../riyaControlledShadowOperationExecution";
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

async function executeShadowOperation(
  source:
    RiyaOwnerActivatedRuntimeIssuance,

  preparation =
    createShadowPreparation(
      source,
    ),

  options: Readonly<{
    executionId?: string;
    executedAt?: string;
  }> = {},
) {
  return executeRiyaControlledShadowOperation({
    executionId:
      options.executionId ??
      "riya-controlled-shadow-execution-day-58",

    preparation,

    ownerActivatedRuntimeIssuance:
      source,

    qualifiedManifest:
      (await qualifiedManifest()).qualifiedManifest,

    executedAt:
      options.executedAt ??
      "2026-07-16T18:30:00.000Z",
  });
}

describe(
  "Riya controlled shadow operation execution",
  () => {
    it(
      "executes exactly one synthetic recommendation draft and awaits owner review",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const execution =
          await executeShadowOperation(
            source,
          );

        expect(
          execution.executionState,
        ).toBe(
          "CONTROLLED_SHADOW_OPERATION_EXECUTED",
        );

        expect(
          execution.recommendationDraft
            .recommendationStatus,
        ).toBe(
          "DRAFT_CREATED_AWAITING_OWNER_REVIEW",
        );

        expect(
          execution.executionBoundary
            .recommendationCreatorInvocationCount,
        ).toBe(1);

        expect(
          execution.nextStep,
        ).toBe(
          "AWAIT_OWNER_SHADOW_OPERATION_REVIEW",
        );
      },
    );

    it(
      "creates evidence-grounded risk-aware owner-ready synthetic draft evidence",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const execution =
          await executeShadowOperation(
            source,
          );

        expect(
          execution.syntheticInquiryEvidence,
        ).toMatchObject({
          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          unsupportedFactsInvented:
            false,
        });

        expect(
          execution.syntheticInquiryEvidence
            .verifiedFacts,
        ).toHaveLength(3);

        expect(
          execution.syntheticInquiryEvidence
            .missingEvidence,
        ).toHaveLength(3);

        expect(
          execution.syntheticCustomerContext,
        ).toMatchObject({
          approvedTenantContextOnly:
            true,

          crossCustomerContextUsed:
            false,

          crossTenantContextUsed:
            false,
        });

        expect(
          execution.recommendationDraft,
        ).toMatchObject({
          toolId:
            "tool-recommendation-draft",

          toolMode:
            "DRAFT_ONLY",

          riskLevel:
            "MEDIUM",

          ownerDecisionMade:
            false,

          unsupportedClaimsIncluded:
            false,

          urgencyExaggerated:
            false,

          guaranteeMade:
            false,

          customerDeliveryPrepared:
            false,

          customerDeliveryExecuted:
            false,
        });

        expect(
          execution.recommendationDraft
            .rationale,
        ).toHaveLength(3);

        expect(
          execution.recommendationDraft
            .uncertainty,
        ).toHaveLength(3);
      },
    );

    it(
      "preserves preparation runtime manifest registry tenant owner and employee bindings",
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

        const execution =
          await executeShadowOperation(
            source,
            preparation,
          );

        expect(execution).toMatchObject({
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

          preparationId:
            preparation.preparationId,

          preparationDigest:
            preparation.preparationDigest,

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
      "keeps owner decision customer delivery external production payment autonomous and launch authority blocked",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const boundary =
          (
            await executeShadowOperation(
              source,
            )
          ).executionBoundary;

        expect(boundary).toMatchObject({
          preparationBound:
            true,

          ownerActivatedRuntimeIssuanceBound:
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

          maximumRecommendationCountEnforced:
            true,

          recommendationCreatorInvocationCount:
            1,

          shadowExecutionExecuted:
            true,

          syntheticInquiryEvidenceRead:
            true,

          syntheticCustomerContextRead:
            true,

          recommendationDraftCreated:
            true,

          ownerDecisionMade:
            false,

          ownerReviewRequired:
            true,

          realCustomerDataUsed:
            false,

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

          emergencyPauseAvailable:
            true,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "blocks controlled shadow execution before preparation",
      async () => {
        const source =
          createRuntimeIssuance(
            createRiyaActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        await expect(
          executeShadowOperation(
            source,
            createShadowPreparation(
              source,
            ),
            {
              executedAt:
                "2026-07-16T18:14:59.999Z",
            },
          ),
        ).rejects.toThrow(
          "cannot precede preparation",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 57 preparation evidence",
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

        const tampered = {
          ...preparation,

          tenantId:
            "tenant-other-day-58",
        } as
          RiyaControlledShadowOperationPreparation;

        await expect(
          executeShadowOperation(
            source,
            tampered,
          ),
        ).rejects.toThrow(
          "preparation",
        );
      },
    );

    it(
      "rejects an unbound qualified manifest",
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

        const manifest = {
          ...(await qualifiedManifest()).qualifiedManifest,

          manifestDigest:
            digest(
              "different-riya-manifest-day-58",
            ),
        };

        await expect(
          executeRiyaControlledShadowOperation({
            executionId:
              "riya-controlled-shadow-execution-day-58",

            preparation,

            ownerActivatedRuntimeIssuance:
              source,

            qualifiedManifest:
              manifest,

            executedAt:
              "2026-07-16T18:30:00.000Z",
          }),
        ).rejects.toThrow(
          "Qualified Riya manifest is not bound",
        );
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
          await executeShadowOperation(
            source,
          );

        const second =
          await executeShadowOperation(
            source,
          );

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.syntheticInquiryEvidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.syntheticCustomerContext,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.recommendationDraft,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        expect(
          Reflect.set(
            first.recommendationDraft,
            "ownerDecisionMade",
            true,
          ),
        ).toBe(false);

        expect(() =>
          validateRiyaControlledShadowOperationExecution(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "DELIVER_TO_CUSTOMER",
        } as unknown as
          RiyaControlledShadowOperationExecution;

        expect(() =>
          validateRiyaControlledShadowOperationExecution(
            tampered,
          ),
        ).toThrow(
          "execution identity is invalid",
        );

        await expect(
          executeShadowOperation(
            source,
            createShadowPreparation(
              source,
            ),
            {
              executionId:
                "riya-secret-token-day-58",
            },
          ),
        ).rejects.toThrow(
          "executionId is invalid",
        );
      },
    );
  },
);
