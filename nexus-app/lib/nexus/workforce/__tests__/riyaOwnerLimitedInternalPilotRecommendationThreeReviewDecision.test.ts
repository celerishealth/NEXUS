import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_DECISION_VERSION,
  createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
  validateRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
  type CreateRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecisionInput,
  type RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
} from "../riyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision";
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
import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_VERSION,
  createRiyaLimitedInternalPilotRecommendationThreePreparation,
  validateRiyaLimitedInternalPilotRecommendationThreePreparation,
  type RiyaLimitedInternalPilotRecommendationThreePreparation,
} from "../riyaLimitedInternalPilotRecommendationThreePreparation";
import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_VERSION,
  createRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision,
  validateRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision,
  type RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision,
} from "../riyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision";
import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_VERSION,
  executeRiyaLimitedInternalPilotRecommendationThree,
  validateRiyaLimitedInternalPilotRecommendationThreeExecution,
  type RiyaLimitedInternalPilotRecommendationThreeExecution,
} from "../riyaLimitedInternalPilotRecommendationThreeExecution";
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


type Day68PreparationInput =
  Parameters<
    typeof createRiyaLimitedInternalPilotRecommendationThreePreparation
  >[0];

async function day68PreparationInput(
  overrides:
    Partial<Day68PreparationInput> = {},
): Promise<Day68PreparationInput> {
  const source =
    createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
      await day67ReviewInput(),
    );

  return {
    preparationId:
      "riya-recommendation-three-preparation-day-68",

    ownerLimitedInternalPilotRecommendationTwoReviewDecision:
      source,

    preparedAt:
      "2026-07-16T19:15:00.000Z",

    ...overrides,
  };
}


type Day69DecisionInput =
  Parameters<
    typeof createRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision
  >[0];

async function day69DecisionInput(
  overrides:
    Partial<Day69DecisionInput> = {},
): Promise<Day69DecisionInput> {
  const preparation =
    createRiyaLimitedInternalPilotRecommendationThreePreparation(
      await day68PreparationInput(),
    );

  return {
    limitedInternalPilotRecommendationThreePreparation:
      preparation,

    decisionId:
      "riya-owner-recommendation-three-execution-decision-day-69",

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION",

    reason:
      "Owner verified recommendation three preparation and approved one final bounded synthetic execution only.",

    decidedAt:
      "2026-07-16T19:30:00.000Z",

    ...overrides,
  };
}


type Day70ExecutionInput =
  Parameters<
    typeof executeRiyaLimitedInternalPilotRecommendationThree
  >[0];

async function day70ExecutionInput(
  overrides:
    Partial<Day70ExecutionInput> = {},
): Promise<Day70ExecutionInput> {
  const decisionInput =
    await day69DecisionInput();

  const decision =
    createRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision(
      decisionInput,
    );

  return {
    executionId:
      "riya-limited-pilot-recommendation-three-execution-day-70",

    ownerLimitedInternalPilotRecommendationThreeExecutionDecision:
      decision,

    limitedInternalPilotRecommendationThreePreparation:
      decisionInput
        .limitedInternalPilotRecommendationThreePreparation,

    executedAt:
      "2026-07-16T19:30:01.000Z",

    ...overrides,
  };
}

type Day71ReviewInput =
  CreateRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecisionInput;

async function day71ReviewInput(
  overrides:
    Partial<Day71ReviewInput> = {},
): Promise<Day71ReviewInput> {
  const execution =
    await executeRiyaLimitedInternalPilotRecommendationThree(
      await day70ExecutionInput(),
    );

  return {
    limitedInternalPilotRecommendationThreeExecution:
      execution,

    decisionId:
      "riya-owner-recommendation-three-review-day-71",

    ownerId:
      execution.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION",

    reason:
      "Owner verified all three bounded synthetic recommendations and approves limited internal pilot completion only.",

    decidedAt:
      "2026-07-16T19:30:02.000Z",

    ...overrides,
  };
}

describe(
  "Riya owner limited internal pilot recommendation three review decision",
  () => {
    it(
      "records final owner approval and completes the limited internal pilot",
      async () => {
        const result =
          createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
            await day71ReviewInput(),
          );

        expect(result.version).toBe(
          RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_DECISION_VERSION,
        );

        expect(result.decisionState).toBe(
          "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_RECORDED",
        );

        expect(result.decision).toBe(
          "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION",
        );

        expect(
          result.limitedInternalPilotCompleted,
        ).toBe(true);

        expect(result.nextStep).toBe(
          "LIMITED_INTERNAL_PILOT_COMPLETE",
        );
      },
    );

    it(
      "records rejection and retains recommendation three as the latest executed recommendation",
      async () => {
        const result =
          createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
            await day71ReviewInput({
              decision:
                "REJECT_AND_RETAIN_RECOMMENDATION_THREE_ONLY",

              reason:
                "Owner retains recommendation three evidence and does not approve limited internal pilot completion.",
            }),
          );

        expect(
          result.limitedInternalPilotCompleted,
        ).toBe(false);

        expect(result.nextStep).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_ONLY",
        );
      },
    );

    it(
      "records the exact final tradeoff evidence and recommendation sequence three of three",
      async () => {
        const result =
          createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
            await day71ReviewInput(),
          );

        expect(result.reviewedEvidence).toMatchObject({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          scenarioId:
            "CONFLICTING_OPTIONS_TRADEOFF_BRIEF",

          reviewedRecommendationSequence:
            3,

          maximumRecommendationCount:
            3,

          remainingRecommendationCapacity:
            0,

          recommendationStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          recommendationOutcome:
            "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS",

          preferredOptionId:
            "OPTION_A_BOUNDED_SIMPLE_ROLLOUT",

          optionIds: [
            "OPTION_A_BOUNDED_SIMPLE_ROLLOUT",
            "OPTION_B_HIGH_CAPACITY_ROLLOUT",
          ],

          optionRiskLevels: [
            "LOW",
            "MEDIUM",
          ],

          benefitsAndTradeoffsExplicit:
            true,

          ownerDecisionReserved:
            true,

          assumptionsMade:
            false,

          unsupportedClaimsIncluded:
            false,

          ownerDecisionMade:
            false,
        });
      },
    );

    it(
      "keeps every further recommendation and real-world autonomous authority blocked",
      async () => {
        const boundary =
          createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
            await day71ReviewInput(),
          ).authorityBoundary;

        expect(boundary).toMatchObject({
          recommendationThreeReviewed:
            true,

          finalRecommendationSequenceReached:
            true,

          recommendationCapacityExhausted:
            true,

          limitedInternalPilotCompleted:
            true,

          furtherRecommendationPreparationAuthorized:
            false,

          furtherRecommendationExecutionAuthorized:
            false,

          concurrentRecommendationExecutionAuthorized:
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
        });
      },
    );

    it(
      "rejects a cross-owner decision and a review before recommendation three execution",
      async () => {
        await expect(
          day71ReviewInput({
            ownerId:
              "owner-another-tenant",
          }).then((input) =>
            createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
              input,
            ),
          ),
        ).rejects.toThrow(
          "Only the recommendation-three-execution-bound owner",
        );

        await expect(
          day71ReviewInput({
            decidedAt:
              "2026-07-16T19:30:00.999Z",
          }).then((input) =>
            createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
              input,
            ),
          ),
        ).rejects.toThrow(
          "cannot precede recommendation three execution",
        );
      },
    );

    it(
      "rejects integrity-tampered recommendation three execution",
      async () => {
        const input =
          await day71ReviewInput();

        const tampered = {
          ...input
            .limitedInternalPilotRecommendationThreeExecution,

          executionDigest:
            "a".repeat(64),
        } as RiyaLimitedInternalPilotRecommendationThreeExecution;

        expect(
          () =>
            createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision({
              ...input,

              limitedInternalPilotRecommendationThreeExecution:
                tampered,
            }),
        ).toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and valid",
      async () => {
        const input =
          await day71ReviewInput();

        const first =
          createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
            input,
          );

        const second =
          createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
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
            first.reviewedEvidence.optionIds,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedEvidence.rationale,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
            first,
          ),
        ).not.toThrow();

        const {
          decisionDigest,
          ...decisionCore
        } = first;

        expect(decisionDigest).toBe(
          day64Sha256(
            decisionCore,
          ),
        );
      },
    );

    it(
      "rejects secret-bearing review identity and reason",
      async () => {
        await expect(
          day71ReviewInput({
            decisionId:
              "secret-riya-recommendation-three-review",
          }).then((input) =>
            createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
              input,
            ),
          ),
        ).rejects.toThrow(
          "credential-bearing content",
        );

        await expect(
          day71ReviewInput({
            reason:
              "Owner approval contains access_token secret-value and must be rejected safely.",
          }).then((input) =>
            createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
              input,
            ),
          ),
        ).rejects.toThrow(
          "secret-bearing content",
        );
      },
    );
  },
);
