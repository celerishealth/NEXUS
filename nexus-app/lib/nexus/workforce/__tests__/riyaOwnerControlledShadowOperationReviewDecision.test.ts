import {
  createRiyaOwnerControlledShadowOperationReviewDecision,
  validateRiyaOwnerControlledShadowOperationReviewDecision,
  type RiyaOwnerControlledShadowOperationReviewDecision,
} from "../riyaOwnerControlledShadowOperationReviewDecision";
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
type Day59ReviewInput =
  Parameters<
    typeof createRiyaOwnerControlledShadowOperationReviewDecision
  >[0];

async function day59ReviewInput(
  overrides:
    Partial<Day59ReviewInput> = {},
): Promise<Day59ReviewInput> {
  const runtime =
    createRuntimeIssuance(
      createRiyaActivationCandidateIssuance(
        await activationInput(),
      ),
    );

  const execution =
    await executeShadowOperation(
      runtime,
    );

  return {
    controlledShadowOperationExecution:
      execution,

    decisionId:
      "riya-controlled-shadow-review-decision-day-59",

    ownerId:
      execution.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",

    reason:
      "Owner reviewed Riya's synthetic recommendation evidence and approved limited internal pilot preparation only.",

    decidedAt:
      "2026-07-16T18:45:00.000Z",

    ...overrides,
  };
}

describe(
  "Riya owner controlled shadow operation review decision",
  () => {
    it(
      "records owner approval for limited internal pilot preparation only",
      async () => {
        const decision =
          createRiyaOwnerControlledShadowOperationReviewDecision(
            await day59ReviewInput(),
          );

        expect(
          decision.version,
        ).toBe(
          "nexus-riya-owner-controlled-shadow-operation-review-decision-v1",
        );

        expect(
          decision.decisionState,
        ).toBe(
          "OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED",
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
        );

        expect(
          decision.shadowOperationApproved,
        ).toBe(true);

        expect(
          decision
            .limitedInternalPilotPreparationEligible,
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_LIMITED_INTERNAL_PILOT",
        );
      },
    );

    it(
      "records owner rejection and retains controlled shadow only",
      async () => {
        const decision =
          createRiyaOwnerControlledShadowOperationReviewDecision(
            await day59ReviewInput({
              decision:
                "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION",

              reason:
                "Owner rejected pilot preparation and retained Riya within the controlled shadow boundary.",
            }),
          );

        expect(
          decision.shadowOperationApproved,
        ).toBe(false);

        expect(
          decision
            .limitedInternalPilotPreparationEligible,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .limitedInternalPilotPreparationAuthorized,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_CONTROLLED_SHADOW_ONLY",
        );
      },
    );

    it(
      "binds the review to exact execution preparation runtime manifest registry tenant and owner evidence",
      async () => {
        const input =
          await day59ReviewInput();

        const source =
          input
            .controlledShadowOperationExecution;

        const decision =
          createRiyaOwnerControlledShadowOperationReviewDecision(
            input,
          );

        expect(
          decision.controlledShadowExecutionId,
        ).toBe(source.executionId);

        expect(
          decision.controlledShadowExecutionDigest,
        ).toBe(source.executionDigest);

        expect(
          decision.preparationId,
        ).toBe(source.preparationId);

        expect(
          decision.preparationDigest,
        ).toBe(source.preparationDigest);

        expect(
          decision.runtimeIssuanceId,
        ).toBe(source.runtimeIssuanceId);

        expect(
          decision.runtimeIssuanceDigest,
        ).toBe(source.runtimeIssuanceDigest);

        expect(
          decision.runtimeId,
        ).toBe(source.runtimeId);

        expect(
          decision.runtimeDigest,
        ).toBe(source.runtimeDigest);

        expect(
          decision.qualifiedManifestDigest,
        ).toBe(source.qualifiedManifestDigest);

        expect(
          decision.sourceRegistryCreatedAt,
        ).toBe(source.sourceRegistryCreatedAt);

        expect(
          decision.tenantId,
        ).toBe(source.tenantId);

        expect(
          decision.ownerId,
        ).toBe(source.ownerId);
      },
    );

    it(
      "records exact reviewed recommendation evidence and blocks every execution authority",
      async () => {
        const decision =
          createRiyaOwnerControlledShadowOperationReviewDecision(
            await day59ReviewInput(),
          );

        expect(
          decision.reviewedEvidence,
        ).toEqual({
          inquiryEvidenceId:
            "synthetic-riya-inquiry-evidence-001",

          customerContextId:
            "synthetic-riya-customer-context-001",

          recommendationId:
            "synthetic-riya-recommendation-draft-001",

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

          recommendationToolId:
            "tool-recommendation-draft",

          recommendationToolMode:
            "DRAFT_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          maximumRecommendationCount:
            1,

          actualRecommendationCount:
            1,

          recommendationStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          riskLevel:
            "MEDIUM",

          verifiedFactCount:
            3,

          missingEvidenceCount:
            3,

          rationaleCount:
            3,

          uncertaintyCount:
            3,

          unsupportedFactsInvented:
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
          decision.authorityBoundary,
        ).toMatchObject({
          controlledShadowExecutionBound:
            true,

          controlledShadowExecutionIntegrityVerified:
            true,

          ownerIdentityBound:
            true,

          tenantIdentityBound:
            true,

          runtimeIdentityBound:
            true,

          qualifiedManifestBound:
            true,

          registryCreationTimeBound:
            true,

          syntheticSanitizedDataOnly:
            true,

          maximumOneRecommendationVerified:
            true,

          ownerDecisionRequired:
            true,

          approvalBypassAllowed:
            false,

          ownerReviewDecisionRecorded:
            true,

          limitedInternalPilotPreparationAuthorized:
            true,

          limitedInternalPilotExecutionAuthorized:
            false,

          recommendationCustomerDeliveryAuthorized:
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

          publicLaunchAuthorized:
            false,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "blocks a cross-owner controlled shadow review decision",
      async () => {
        const input =
          await day59ReviewInput({
            ownerId:
              "owner-cross-tenant-day-59",
          });

        expect(() =>
          createRiyaOwnerControlledShadowOperationReviewDecision(
            input,
          ),
        ).toThrow(
          "Only the Riya controlled-shadow-bound owner can issue the review decision.",
        );
      },
    );

    it(
      "blocks a review decision before the controlled shadow execution time",
      async () => {
        const input =
          await day59ReviewInput({
            decidedAt:
              "2026-07-16T18:29:59.999Z",
          });

        expect(() =>
          createRiyaOwnerControlledShadowOperationReviewDecision(
            input,
          ),
        ).toThrow(
          "Riya owner controlled-shadow review decision cannot precede shadow execution.",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 58 controlled shadow execution evidence",
      async () => {
        const input =
          await day59ReviewInput();

        const tampered = {
          ...input
            .controlledShadowOperationExecution,

          nextStep:
            "DELIVER_TO_CUSTOMER",
        } as unknown as
          RiyaControlledShadowOperationExecution;

        expect(() =>
          createRiyaOwnerControlledShadowOperationReviewDecision({
            ...input,

            controlledShadowOperationExecution:
              tampered,
          }),
        ).toThrow(
          "execution identity is invalid",
        );
      },
    );

    it(
      "is deterministic deeply immutable self-validating and rejects secret-bearing review input",
      async () => {
        const input =
          await day59ReviewInput();

        const first =
          createRiyaOwnerControlledShadowOperationReviewDecision(
            input,
          );

        const second =
          createRiyaOwnerControlledShadowOperationReviewDecision(
            input,
          );

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedEvidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateRiyaOwnerControlledShadowOperationReviewDecision(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "DELIVER_TO_CUSTOMER",
        } as unknown as
          RiyaOwnerControlledShadowOperationReviewDecision;

        expect(() =>
          validateRiyaOwnerControlledShadowOperationReviewDecision(
            tampered,
          ),
        ).toThrow(
          "decision identity is invalid",
        );

        expect(() =>
          createRiyaOwnerControlledShadowOperationReviewDecision({
            ...input,

            decisionId:
              "token-riya-shadow-review-day-59",
          }),
        ).toThrow(
          "Riya controlled-shadow review decisionId is invalid.",
        );

        expect(() =>
          createRiyaOwnerControlledShadowOperationReviewDecision({
            ...input,

            reason:
              "Owner review contains api_key secret-value and must be blocked.",
          }),
        ).toThrow(
          "Owner controlled-shadow review reason contains prohibited secret-bearing content.",
        );
      },
    );
  },
);