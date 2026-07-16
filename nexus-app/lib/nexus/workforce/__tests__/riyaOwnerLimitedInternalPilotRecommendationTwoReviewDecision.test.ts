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
import {
  executeRiyaLimitedInternalPilotRecommendation,
  validateRiyaLimitedInternalPilotRecommendationExecution,
  type RiyaLimitedInternalPilotRecommendationExecution,
} from "../riyaLimitedInternalPilotRecommendationExecution";
import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_DECISION_VERSION,
  createRiyaOwnerLimitedInternalPilotRecommendationReviewDecision,
  validateRiyaOwnerLimitedInternalPilotRecommendationReviewDecision,
} from "../riyaOwnerLimitedInternalPilotRecommendationReviewDecision";
import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_VERSION,
  createRiyaLimitedInternalPilotRecommendationTwoPreparation,
  validateRiyaLimitedInternalPilotRecommendationTwoPreparation,
} from "../riyaLimitedInternalPilotRecommendationTwoPreparation";
import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_VERSION,
  createRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision,
  validateRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision,
} from "../riyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision";
import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_VERSION,
  executeRiyaLimitedInternalPilotRecommendationTwo,
  validateRiyaLimitedInternalPilotRecommendationTwoExecution,
} from "../riyaLimitedInternalPilotRecommendationTwoExecution";
import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISION_VERSION,
  createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision,
  validateRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision,
} from "../riyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision";
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


type Day62ExecutionInput =
  Parameters<
    typeof executeRiyaLimitedInternalPilotRecommendation
  >[0];

async function day62ExecutionInput(
  overrides:
    Partial<Day62ExecutionInput> = {},
): Promise<Day62ExecutionInput> {
  const reviewInput =
    await day59ReviewInput();

  const reviewDecision =
    createRiyaOwnerControlledShadowOperationReviewDecision(
      reviewInput,
    );

  const preparation =
    createRiyaLimitedInternalPilotPreparation({
      preparationId:
        "riya-limited-internal-pilot-preparation-day-60",

      ownerControlledShadowOperationReviewDecision:
        reviewDecision,

      preparedAt:
        "2026-07-16T19:00:00.000Z",
    });

  const decision =
    createRiyaOwnerLimitedInternalPilotExecutionDecision({
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
        "2026-07-16T19:00:01.000Z",
    });

  return {
    executionId:
      "riya-limited-pilot-recommendation-execution-day-62",

    ownerLimitedInternalPilotExecutionDecision:
      decision,

    limitedInternalPilotPreparation:
      preparation,

    controlledShadowOperationExecution:
      reviewInput.controlledShadowOperationExecution,

    executedAt:
      "2026-07-16T19:00:02.000Z",

    ...overrides,
  };
}


type Day63ReviewInput =
  Parameters<
    typeof createRiyaOwnerLimitedInternalPilotRecommendationReviewDecision
  >[0];

async function day63ReviewInput(
  overrides:
    Partial<Day63ReviewInput> = {},
): Promise<Day63ReviewInput> {
  const execution =
    await executeRiyaLimitedInternalPilotRecommendation(
      await day62ExecutionInput(),
    );

  return {
    limitedInternalPilotRecommendationExecution:
      execution,

    decisionId:
      "riya-owner-recommendation-one-review-day-63",

    ownerId:
      execution.ownerId,

    decision:
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_RECOMMENDATION_PREPARATION",

    reason:
      "Owner verified recommendation one evidence and approved preparation for recommendation two only.",

    decidedAt:
      "2026-07-16T19:00:03.000Z",

    ...overrides,
  };
}


function day64StableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
          day64StableStringify(item),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            JSON.stringify(key) +
            ":" +
            day64StableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Day 64 test value.",
    );
  }

  return primitive;
}

function day64Sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      day64StableStringify(value),
      "utf8",
    )
    .digest("hex");
}
type Day64PreparationInput =
  Parameters<
    typeof createRiyaLimitedInternalPilotRecommendationTwoPreparation
  >[0];

async function day64PreparationInput(
  overrides:
    Partial<Day64PreparationInput> = {},
): Promise<Day64PreparationInput> {
  const reviewDecision =
    createRiyaOwnerLimitedInternalPilotRecommendationReviewDecision(
      await day63ReviewInput(),
    );

  return {
    preparationId:
      "riya-limited-pilot-recommendation-two-preparation-day-64",

    ownerLimitedInternalPilotRecommendationReviewDecision:
      reviewDecision,

    preparedAt:
      "2026-07-16T19:00:04.000Z",

    ...overrides,
  };
}


type Day65DecisionInput =
  Parameters<
    typeof createRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision
  >[0];

async function day65DecisionInput(
  overrides:
    Partial<Day65DecisionInput> = {},
): Promise<Day65DecisionInput> {
  const preparation =
    createRiyaLimitedInternalPilotRecommendationTwoPreparation(
      await day64PreparationInput(),
    );

  return {
    limitedInternalPilotRecommendationTwoPreparation:
      preparation,

    decisionId:
      "riya-owner-recommendation-two-execution-decision-day-65",

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION",

    reason:
      "Owner verified recommendation two preparation and approved one bounded synthetic execution only.",

    decidedAt:
      "2026-07-16T19:00:05.000Z",

    ...overrides,
  };
}


type Day66ExecutionInput =
  Parameters<
    typeof executeRiyaLimitedInternalPilotRecommendationTwo
  >[0];

async function day66ExecutionInput(
  overrides:
    Partial<Day66ExecutionInput> = {},
): Promise<Day66ExecutionInput> {
  const decisionInput =
    await day65DecisionInput();

  const decision =
    createRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision(
      decisionInput,
    );

  return {
    executionId:
      "riya-limited-pilot-recommendation-two-execution-day-66",

    ownerLimitedInternalPilotRecommendationTwoExecutionDecision:
      decision,

    limitedInternalPilotRecommendationTwoPreparation:
      decisionInput
        .limitedInternalPilotRecommendationTwoPreparation,

    executedAt:
      "2026-07-16T19:00:06.000Z",

    ...overrides,
  };
}


type Day67ReviewInput =
  Parameters<
    typeof createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision
  >[0];

async function day67ReviewInput(
  overrides:
    Partial<Day67ReviewInput> = {},
): Promise<Day67ReviewInput> {
  const execution =
    await executeRiyaLimitedInternalPilotRecommendationTwo(
      await day66ExecutionInput(),
    );

  return {
    limitedInternalPilotRecommendationTwoExecution:
      execution,

    decisionId:
      "riya-owner-recommendation-two-review-day-67",

    ownerId:
      execution.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION",

    reason:
      "Owner verified recommendation two clarification evidence and approved recommendation three preparation only.",

    decidedAt:
      "2026-07-16T19:00:07.000Z",

    ...overrides,
  };
}

describe(
  "Riya owner limited internal pilot recommendation two review decision",
  () => {
    it(
      "approves recommendation three preparation only without authorizing execution",
      async () => {
        const decision =
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
            await day67ReviewInput(),
          );

        expect(decision.version).toBe(
          RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISION_VERSION,
        );

        expect(decision.decisionState).toBe(
          "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_RECORDED",
        );

        expect(
          decision.nextRecommendationPreparationApproved,
        ).toBe(true);

        expect(
          decision.recommendationThreeExecutionAuthorized,
        ).toBe(false);

        expect(decision.nextStep).toBe(
          "PREPARE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE",
        );
      },
    );

    it(
      "records rejection and retains recommendations one and two only",
      async () => {
        const decision =
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
            await day67ReviewInput({
              decisionId:
                "riya-owner-recommendation-two-review-rejected-day-67",

              decision:
                "REJECT_AND_RETAIN_RECOMMENDATIONS_ONE_AND_TWO_ONLY",

              reason:
                "Owner rejected continuation and retained the pilot at recommendations one and two only.",
            }),
          );

        expect(
          decision.nextRecommendationPreparationApproved,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .nextRecommendationPreparationAuthorized,
        ).toBe(false);

        expect(decision.nextStep).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATIONS_ONE_AND_TWO_ONLY",
        );
      },
    );

    it(
      "records exact recommendation two evidence without guessing",
      async () => {
        const decision =
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
            await day67ReviewInput(),
          );

        expect(decision.reviewedEvidence).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          scenarioId:
            "MISSING_FACT_CLARIFICATION",

          reviewedRecommendationSequence:
            2,

          maximumRecommendationCount:
            3,

          remainingRecommendationCapacity:
            1,

          ownerReviewFrequency:
            "AFTER_EVERY_RECOMMENDATION",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          inquiryEvidenceToolMode:
            "READ_ONLY",

          customerContextToolMode:
            "READ_ONLY",

          recommendationToolMode:
            "DRAFT_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          recommendationStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          recommendationOutcome:
            "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION",

          verifiedFacts: [
            "The synthetic business requested an implementation recommendation.",
            "The recommendation must remain owner-reviewed before any further action.",
          ],

          missingFacts: [
            "Approved budget range",
            "Required implementation timeline",
            "Primary decision criteria",
          ],

          clarifyingQuestions: [
            "What budget range has the owner approved?",
            "What implementation deadline must the option satisfy?",
            "Which decision criterion has the highest priority?",
          ],

          assumptionsMade:
            false,

          missingFactsExplicit:
            true,

          verifiedFactsSeparatedFromAssumptions:
            true,

          uncertaintyPreserved:
            true,

          unsupportedFactsInvented:
            false,

          crossCustomerEvidenceUsed:
            false,

          crossTenantEvidenceUsed:
            false,

          realCustomerDataUsed:
            false,

          crossCustomerContextUsed:
            false,

          crossTenantContextUsed:
            false,

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
      },
    );

    it(
      "binds the exact Day 66 execution and complete source chain",
      async () => {
        const input =
          await day67ReviewInput();

        const decision =
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
            input,
          );

        const source =
          input.limitedInternalPilotRecommendationTwoExecution;

        expect(
          decision.limitedInternalPilotRecommendationTwoExecutionId,
        ).toBe(source.executionId);

        expect(
          decision.limitedInternalPilotRecommendationTwoExecutionDigest,
        ).toBe(source.executionDigest);

        expect(
          decision.ownerRecommendationTwoExecutionDecisionId,
        ).toBe(
          source.ownerRecommendationTwoExecutionDecisionId,
        );

        expect(
          decision.recommendationTwoPreparationId,
        ).toBe(
          source.recommendationTwoPreparationId,
        );

        expect(
          decision.sourceRecommendationReviewDecisionId,
        ).toBe(
          source.sourceRecommendationReviewDecisionId,
        );

        expect(
          decision.sourceRecommendationOneExecutionId,
        ).toBe(
          source.sourceRecommendationOneExecutionId,
        );

        expect(
          decision.initialOwnerPilotExecutionDecisionId,
        ).toBe(
          source.initialOwnerPilotExecutionDecisionId,
        );

        expect(
          decision.initialPilotPreparationId,
        ).toBe(
          source.initialPilotPreparationId,
        );

        expect(
          decision.controlledShadowExecutionId,
        ).toBe(
          source.controlledShadowExecutionId,
        );

        expect(decision.tenantId).toBe(
          source.tenantId,
        );

        expect(decision.ownerId).toBe(
          source.ownerId,
        );
      },
    );

    it(
      "keeps customer production payment autonomous and launch authority blocked",
      async () => {
        const decision =
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
            await day67ReviewInput(),
          );

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          sourceExecutionIntegrityVerified:
            true,

          ownerReviewDecisionRecorded:
            true,

          approvalBypassAllowed:
            false,

          recommendationOneReviewed:
            true,

          recommendationTwoReviewed:
            true,

          nextRecommendationPreparationAuthorized:
            true,

          recommendationThreePreparationPerformed:
            false,

          recommendationThreeExecutionAuthorized:
            false,

          recommendationThreeExecutionPerformed:
            false,

          concurrentRecommendationExecutionAuthorized:
            false,

          limitedInternalPilotCompleted:
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
      "blocks cross-owner review and review before recommendation two execution",
      async () => {
        const input =
          await day67ReviewInput();

        expect(() =>
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision({
            ...input,

            ownerId:
              "owner-cross-tenant",
          }),
        ).toThrow(
          "recommendation-two-execution-bound owner",
        );

        const beforeExecution =
          new Date(
            Date.parse(
              input
                .limitedInternalPilotRecommendationTwoExecution
                .executedAt,
            ) - 1,
          ).toISOString();

        expect(() =>
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision({
            ...input,

            decidedAt:
              beforeExecution,
          }),
        ).toThrow(
          "cannot precede recommendation two execution",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 66 execution integrity",
      async () => {
        const input =
          await day67ReviewInput();

        const source = {
          ...input
            .limitedInternalPilotRecommendationTwoExecution,

          executionDigest:
            "f".repeat(64),
        } as Day67ReviewInput[
          "limitedInternalPilotRecommendationTwoExecution"
        ];

        expect(() =>
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision({
            ...input,

            limitedInternalPilotRecommendationTwoExecution:
              source,
          }),
        ).toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and secret-safe",
      async () => {
        const input =
          await day67ReviewInput();

        const first =
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
            input,
          );

        const second =
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
            input,
          );

        expect(second).toEqual(first);

        expect(first.decisionDigest).toMatch(
          /^[0-9a-f]{64}$/,
        );

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
            first.reviewedEvidence
              .verifiedFacts,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedEvidence
              .missingFacts,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedEvidence
              .clarifyingQuestions,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
            first,
          ),
        ).not.toThrow();

        expect(() =>
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision({
            ...input,

            decisionId:
              "secret-riya-recommendation-two-review",
          }),
        ).toThrow(
          "credential-bearing content",
        );

        expect(() =>
          createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision({
            ...input,

            reason:
              "Owner approved continuation using secret access_token abc123.",
          }),
        ).toThrow(
          "secret-bearing content",
        );
      },
    );
  },
);