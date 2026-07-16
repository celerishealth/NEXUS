import {
  createRiyaOwnerLimitedInternalPilotExecutionDecision,
  validateRiyaOwnerLimitedInternalPilotExecutionDecision,
  type RiyaOwnerLimitedInternalPilotExecutionDecision,
} from "../riyaOwnerLimitedInternalPilotExecutionDecision";
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

type Day61DecisionInput =
  Parameters<
    typeof createRiyaOwnerLimitedInternalPilotExecutionDecision
  >[0];

type Day61Preparation =
  Day61DecisionInput[
    "limitedInternalPilotPreparation"
  ];

async function approvedDay60Preparation():
  Promise<Day61Preparation> {
  return createRiyaLimitedInternalPilotPreparation(
    await day60PreparationInput(),
  );
}

async function day61DecisionInput(
  overrides:
    Partial<Day61DecisionInput> = {},
): Promise<Day61DecisionInput> {
  const preparation =
    await approvedDay60Preparation();

  return {
    limitedInternalPilotPreparation:
      preparation,

    decisionId:
      "riya-owner-pilot-execution-decision-day-61",

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION",

    reason:
      "Owner approves only the bounded synthetic recommendation pilot while every real-world authority remains blocked.",

    decidedAt:
      new Date(
        Date.parse(preparation.preparedAt) +
          1_000,
      ).toISOString(),

    ...overrides,
  };
}

describe(
  "Riya owner limited internal pilot execution decision",
  () => {
    it(
      "records approval without executing any recommendation",
      async () => {
        const result =
          createRiyaOwnerLimitedInternalPilotExecutionDecision(
            await day61DecisionInput(),
          );

        expect(result.version).toBe(
          "nexus-riya-owner-limited-internal-pilot-execution-decision-v1",
        );

        expect(result.decisionState).toBe(
          "OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_RECORDED",
        );

        expect(result.decision).toBe(
          "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION",
        );

        expect(
          result.approvedForLimitedInternalPilotExecution,
        ).toBe(true);

        expect(result.nextStep).toBe(
          "EXECUTE_LIMITED_INTERNAL_PILOT",
        );

        expect(
          result.authorityBoundary
            .limitedInternalPilotExecutionAuthorized,
        ).toBe(true);

        expect(
          result.authorityBoundary
            .limitedInternalPilotExecutionPerformed,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .syntheticRecommendationExecutionPerformed,
        ).toBe(false);
      },
    );

    it(
      "binds the exact Day 60 preparation employee tenant owner and shadow evidence",
      async () => {
        const input =
          await day61DecisionInput();

        const preparation =
          input.limitedInternalPilotPreparation;

        const result =
          createRiyaOwnerLimitedInternalPilotExecutionDecision(
            input,
          );

        expect(result.preparationId).toBe(
          preparation.preparationId,
        );

        expect(result.preparationDigest).toBe(
          preparation.preparationDigest,
        );

        expect(result.sourceReviewDecisionId).toBe(
          preparation.sourceReviewDecisionId,
        );

        expect(result.sourceReviewDecisionDigest).toBe(
          preparation.sourceReviewDecisionDigest,
        );

        expect(result.controlledShadowExecutionId).toBe(
          preparation.controlledShadowExecutionId,
        );

        expect(result.controlledShadowExecutionDigest).toBe(
          preparation.controlledShadowExecutionDigest,
        );

        expect(result.employeeId).toBe(
          "employee-riya-recommendation-specialist-v1",
        );

        expect(result.templateId).toBe(
          "template-riya-recommendation-specialist-v1",
        );

        expect(result.employeeCode).toBe(
          "nx-sales-004",
        );

        expect(result.displayName).toBe(
          "Riya",
        );

        expect(result.role).toBe(
          "AI Recommendation Specialist",
        );

        expect(result.department).toBe(
          "SALES",
        );

        expect(result.autonomyLevel).toBe(
          "DRAFTING_ASSISTANT",
        );

        expect(result.tenantId).toBe(
          preparation.tenantId,
        );

        expect(result.ownerId).toBe(
          preparation.ownerId,
        );
      },
    );

    it(
      "preserves the exact bounded recommendation pilot plan",
      async () => {
        const result =
          createRiyaOwnerLimitedInternalPilotExecutionDecision(
            await day61DecisionInput(),
          );

        expect(
          result.reviewedPilotPreparation,
        ).toEqual({
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

          scenarioCount:
            3,

          specialistStandardBound:
            true,

          transparentAIIdentityRequired:
            true,

          customerDeliveryRequiresSeparateOwnerAuthority:
            true,
        });
      },
    );

    it(
      "authorizes only future bounded pilot execution while blocking real-world authority",
      async () => {
        const result =
          createRiyaOwnerLimitedInternalPilotExecutionDecision(
            await day61DecisionInput(),
          );

        expect(
          result.authorityBoundary,
        ).toEqual({
          sourcePreparationIntegrityVerified:
            true,

          exactEmployeeIdentityBound:
            true,

          exactTenantBound:
            true,

          exactOwnerBound:
            true,

          ownerExecutionDecisionRecorded:
            true,

          approvalBypassAllowed:
            false,

          limitedInternalPilotPreparationAuthorized:
            true,

          limitedInternalPilotExecutionAuthorized:
            true,

          limitedInternalPilotExecutionPerformed:
            false,

          syntheticRecommendationExecutionPerformed:
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
      "records rejection without authorizing or performing pilot execution",
      async () => {
        const result =
          createRiyaOwnerLimitedInternalPilotExecutionDecision(
            await day61DecisionInput({
              decision:
                "REJECT_LIMITED_INTERNAL_PILOT_EXECUTION",

              reason:
                "Pilot execution remains paused pending additional owner assessment.",
            }),
          );

        expect(result.decision).toBe(
          "REJECT_LIMITED_INTERNAL_PILOT_EXECUTION",
        );

        expect(
          result.approvedForLimitedInternalPilotExecution,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .limitedInternalPilotExecutionAuthorized,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .limitedInternalPilotExecutionPerformed,
        ).toBe(false);

        expect(
          result.authorityBoundary
            .syntheticRecommendationExecutionPerformed,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_PREPARATION_ONLY",
        );
      },
    );

    it(
      "rejects a different owner and a decision before preparation",
      async () => {
        const input =
          await day61DecisionInput();

        expect(() =>
          createRiyaOwnerLimitedInternalPilotExecutionDecision({
            ...input,

            ownerId:
              "owner-different",
          }),
        ).toThrow(
          /only the preparation-bound owner/i,
        );

        expect(() =>
          createRiyaOwnerLimitedInternalPilotExecutionDecision({
            ...input,

            decidedAt:
              new Date(
                Date.parse(
                  input
                    .limitedInternalPilotPreparation
                    .preparedAt,
                ) - 1,
              ).toISOString(),
          }),
        ).toThrow(
          /cannot precede its preparation/i,
        );
      },
    );

    it(
      "rejects tampered preparation invalid decisions and secret-bearing reasons",
      async () => {
        const input =
          await day61DecisionInput();

        const tamperedPreparation = {
          ...input.limitedInternalPilotPreparation,

          ownerId:
            "owner-tampered",
        } as Day61Preparation;

        expect(() =>
          createRiyaOwnerLimitedInternalPilotExecutionDecision({
            ...input,

            limitedInternalPilotPreparation:
              tamperedPreparation,
          }),
        ).toThrow(
          /integrity verification failed/i,
        );

        expect(() =>
          createRiyaOwnerLimitedInternalPilotExecutionDecision({
            ...input,

            decision:
              "INVALID_EXECUTION_DECISION" as
                Day61DecisionInput["decision"],
          }),
        ).toThrow(
          /decision is invalid/i,
        );

        expect(() =>
          createRiyaOwnerLimitedInternalPilotExecutionDecision({
            ...input,

            reason:
              "Approved using secret access_token abc123 for execution.",
          }),
        ).toThrow(
          /secret-bearing information/i,
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects tampered decisions",
      async () => {
        const input =
          await day61DecisionInput();

        const first =
          createRiyaOwnerLimitedInternalPilotExecutionDecision(
            input,
          );

        const second =
          createRiyaOwnerLimitedInternalPilotExecutionDecision(
            input,
          );

        expect(first).toEqual(second);

        expect(Object.isFrozen(first)).toBe(
          true,
        );

        expect(
          Object.isFrozen(
            first.reviewedPilotPreparation,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(
          first.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(() =>
          validateRiyaOwnerLimitedInternalPilotExecutionDecision(
            first,
          ),
        ).not.toThrow();

        const tamperedDecision = {
          ...first,

          approvedForLimitedInternalPilotExecution:
            false,
        } as RiyaOwnerLimitedInternalPilotExecutionDecision;

        expect(() =>
          validateRiyaOwnerLimitedInternalPilotExecutionDecision(
            tamperedDecision,
          ),
        ).toThrow();

        expect(() =>
          createRiyaOwnerLimitedInternalPilotExecutionDecision({
            ...input,

            decisionId:
              "decision-secret-token-001",
          }),
        ).toThrow(
          /invalid/i,
        );
      },
    );
  },
);
