import {
  createRiyaLimitedInternalPilotPreparation,
  validateRiyaLimitedInternalPilotPreparation,
  type RiyaLimitedInternalPilotPreparation,
} from "../riyaLimitedInternalPilotPreparation";
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

async function approvedDay59ReviewDecision() {
  return createRiyaOwnerControlledShadowOperationReviewDecision(
    await day59ReviewInput(),
  );
}

type Day60PreparationInput =
  Parameters<
    typeof createRiyaLimitedInternalPilotPreparation
  >[0];

async function day60PreparationInput(
  overrides:
    Partial<Day60PreparationInput> = {},
): Promise<Day60PreparationInput> {
  return {
    preparationId:
      "riya-limited-internal-pilot-preparation-day-60",

    ownerControlledShadowOperationReviewDecision:
      await approvedDay59ReviewDecision(),

    preparedAt:
      "2026-07-16T19:00:00.000Z",

    ...overrides,
  };
}

describe(
  "Riya limited internal pilot preparation",
  () => {
    it(
      "prepares a bounded three-recommendation synthetic internal pilot",
      async () => {
        const preparation =
          createRiyaLimitedInternalPilotPreparation(
            await day60PreparationInput(),
          );

        expect(
          preparation.version,
        ).toBe(
          "nexus-riya-limited-internal-pilot-preparation-v1",
        );

        expect(
          preparation.preparationState,
        ).toBe(
          "LIMITED_INTERNAL_PILOT_PREPARED",
        );

        expect(
          preparation.pilotPlan,
        ).toMatchObject({
          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          inquiryEvidenceToolMode:
            "READ_ONLY",

          customerContextToolMode:
            "READ_ONLY",

          recommendationToolMode:
            "DRAFT_ONLY",

          maximumRecommendationCount:
            3,

          concurrentRecommendationLimit:
            1,

          failureThreshold:
            1,

          ownerReviewFrequency:
            "AFTER_EVERY_RECOMMENDATION",

          externalDeliveryMode:
            "DISABLED",

          productionMutationMode:
            "DISABLED",
        });

        expect(
          preparation.pilotPlan.scenarios,
        ).toEqual([
          "EVIDENCE_GROUNDED_RECOMMENDATION",
          "MISSING_FACT_CLARIFICATION",
          "RISK_AWARE_TRADEOFF_COMPARISON",
        ]);

        expect(
          preparation.nextStep,
        ).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION",
        );
      },
    );

    it(
      "locks Riya specialist quality standards for every pilot recommendation",
      async () => {
        const preparation =
          createRiyaLimitedInternalPilotPreparation(
            await day60PreparationInput(),
          );

        expect(
          preparation.specialistStandard,
        ).toEqual({
          aiIdentityTransparent:
            true,

          evidenceGroundingRequired:
            true,

          verifiedFactsSeparatedFromAssumptions:
            true,

          missingFactsIdentified:
            true,

          clarificationBeforeGuessingRequired:
            true,

          riskLevelRequired:
            true,

          uncertaintyRequired:
            true,

          practicalTradeoffsRequired:
            true,

          ownerReadyBriefRequired:
            true,

          unsupportedClaimsBlocked:
            true,

          urgencyExaggerationBlocked:
            true,

          guaranteeBlocked:
            true,

          crossCustomerContextBlocked:
            true,

          crossTenantContextBlocked:
            true,

          customerDeliveryRequiresSeparateOwnerAuthority:
            true,
        });
      },
    );

    it(
      "binds preparation to exact Day 59 owner review execution tenant and owner evidence",
      async () => {
        const source =
          await approvedDay59ReviewDecision();

        const preparation =
          createRiyaLimitedInternalPilotPreparation({
            preparationId:
              "riya-limited-internal-pilot-preparation-day-60",

            ownerControlledShadowOperationReviewDecision:
              source,

            preparedAt:
              "2026-07-16T19:00:00.000Z",
          });

        expect(
          preparation.sourceReviewDecisionId,
        ).toBe(source.decisionId);

        expect(
          preparation.sourceReviewDecisionDigest,
        ).toBe(source.decisionDigest);

        expect(
          preparation.controlledShadowExecutionId,
        ).toBe(
          source.controlledShadowExecutionId,
        );

        expect(
          preparation.controlledShadowExecutionDigest,
        ).toBe(
          source.controlledShadowExecutionDigest,
        );

        expect(
          preparation.tenantId,
        ).toBe(source.tenantId);

        expect(
          preparation.ownerId,
        ).toBe(source.ownerId);
      },
    );

    it(
      "authorizes preparation only and blocks pilot execution plus every real authority",
      async () => {
        const preparation =
          createRiyaLimitedInternalPilotPreparation(
            await day60PreparationInput(),
          );

        expect(
          preparation.authorityBoundary,
        ).toEqual({
          ownerReviewDecisionBound:
            true,

          ownerReviewDecisionIntegrityVerified:
            true,

          ownerPilotPreparationApprovalBound:
            true,

          tenantIdentityBound:
            true,

          ownerIdentityBound:
            true,

          controlledShadowExecutionBound:
            true,

          approvalBypassAllowed:
            false,

          limitedInternalPilotPreparationAuthorized:
            true,

          limitedInternalPilotExecutionAuthorized:
            false,

          syntheticRecommendationExecutionAuthorized:
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

          monitoringRequired:
            true,

          ownerReviewAfterEveryRecommendation:
            true,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "rejects a Day 59 owner decision that did not approve pilot preparation",
      async () => {
        const rejected =
          createRiyaOwnerControlledShadowOperationReviewDecision(
            await day59ReviewInput({
              decision:
                "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION",

              reason:
                "Owner rejected Riya pilot preparation and retained the controlled shadow boundary.",
            }),
          );

        expect(() =>
          createRiyaLimitedInternalPilotPreparation({
            preparationId:
              "riya-limited-internal-pilot-preparation-day-60",

            ownerControlledShadowOperationReviewDecision:
              rejected,

            preparedAt:
              "2026-07-16T19:00:00.000Z",
          }),
        ).toThrow(
          "requires explicit Riya owner approval",
        );
      },
    );

    it(
      "rejects tampered Day 59 owner review evidence",
      async () => {
        const source =
          await approvedDay59ReviewDecision();

        const tampered = {
          ...source,

          ownerId:
            "owner-tampered-day-60",
        } as RiyaOwnerControlledShadowOperationReviewDecision;

        expect(() =>
          createRiyaLimitedInternalPilotPreparation({
            preparationId:
              "riya-limited-internal-pilot-preparation-day-60",

            ownerControlledShadowOperationReviewDecision:
              tampered,

            preparedAt:
              "2026-07-16T19:00:00.000Z",
          }),
        ).toThrow();
      },
    );

    it(
      "blocks pilot preparation before the owner review decision time",
      async () => {
        const source =
          await approvedDay59ReviewDecision();

        expect(() =>
          createRiyaLimitedInternalPilotPreparation({
            preparationId:
              "riya-limited-internal-pilot-preparation-day-60",

            ownerControlledShadowOperationReviewDecision:
              source,

            preparedAt:
              "2026-07-16T18:44:59.999Z",
          }),
        ).toThrow(
          "cannot precede the owner review decision",
        );
      },
    );

    it(
      "is deterministic deeply immutable self-validating and rejects secret-bearing identity",
      async () => {
        const input =
          await day60PreparationInput();

        const first =
          createRiyaLimitedInternalPilotPreparation(
            input,
          );

        const second =
          createRiyaLimitedInternalPilotPreparation(
            input,
          );

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.pilotPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.pilotPlan.scenarios,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.specialistStandard,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateRiyaLimitedInternalPilotPreparation(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "EXECUTE_LIMITED_INTERNAL_PILOT",
        } as unknown as
          RiyaLimitedInternalPilotPreparation;

        expect(() =>
          validateRiyaLimitedInternalPilotPreparation(
            tampered,
          ),
        ).toThrow(
          "preparation identity is invalid",
        );

        expect(() =>
          createRiyaLimitedInternalPilotPreparation({
            ...input,

            preparationId:
              "token-riya-pilot-preparation-day-60",
          }),
        ).toThrow(
          "Riya limited internal pilot preparationId is invalid.",
        );
      },
    );
  },
);