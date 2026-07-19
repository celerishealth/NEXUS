import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_VERSION,
  executeMeeraLimitedInternalPilotQuotationProposalThree,
  validateMeeraLimitedInternalPilotQuotationProposalThreeExecution,
  type MeeraLimitedInternalPilotQuotationProposalThreeExecution,
} from "../meeraLimitedInternalPilotQuotationProposalThreeExecution";
import {
  MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_VERSION,
  createMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision,
  validateMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision,
} from "../meeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision";
import {
  createMeeraOwnerLimitedInternalPilotExecutionDecision,
  validateMeeraOwnerLimitedInternalPilotExecutionDecision,
  type MeeraOwnerLimitedInternalPilotExecutionDecision,
} from "../meeraOwnerLimitedInternalPilotExecutionDecision";
import {
  createMeeraLimitedInternalPilotPreparation,
  validateMeeraLimitedInternalPilotPreparation,
  type MeeraLimitedInternalPilotPreparation,
} from "../meeraLimitedInternalPilotPreparation";
import {
  createMeeraOwnerControlledShadowOperationReviewDecision,
  validateMeeraOwnerControlledShadowOperationReviewDecision,
  type MeeraOwnerControlledShadowOperationReviewDecision,
} from "../meeraOwnerControlledShadowOperationReviewDecision";
import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES,
} from "../meeraQuotationProposalSpecialistQualificationStandard";

import {
  createMeeraQualificationReadinessAssessment,
} from "../meeraQualificationReadinessAssessment";

import {
  createMeeraOwnerQualificationReviewDecision,
} from "../meeraOwnerQualificationReviewDecision";

import {
  createMeeraQualificationTestingAdmission,
} from "../meeraQualificationTestingAdmission";

import {
  createMeeraQualificationTestPlan,
} from "../meeraQualificationTestPlan";

import {
  createMeeraFormalQualificationTestPlan,
} from "../meeraFormalQualificationTestPlan";

import {
  createMeeraFormalQualificationFixturePack,
} from "../meeraFormalQualificationFixturePack";

import {
  executeMeeraFormalQualificationEvidence,
} from "../meeraFormalQualificationExecutionEvidence";

import {
  createMeeraFormalQualificationReviewDecision,
} from "../meeraFormalQualificationReviewDecision";

import {
  issueMeeraFormalQualification,
  type MeeraFormalQualificationIssuance,
} from "../meeraFormalQualificationIssuance";

import {
  createMeeraQualifiedEmployeeManifestIssuance,
  type MeeraQualifiedEmployeeManifestIssuance,
} from "../meeraQualifiedEmployeeManifestIssuance";

import {
  createMeeraActivationCandidateIssuance,
  validateMeeraActivationCandidateIssuance,
  type MeeraActivationCandidateIssuance,
} from "../meeraActivationCandidateIssuance";

import {
  createMeeraOwnerActivationDecision,
  validateMeeraOwnerActivationDecision,
  type MeeraOwnerActivationDecision,
  type MeeraOwnerActivationDecisionType,
} from "../meeraOwnerActivationDecision";
import {
  createMeeraOwnerActivatedRuntimeIssuance,
  validateMeeraOwnerActivatedRuntimeIssuance,
  type MeeraOwnerActivatedRuntimeIssuance,
} from "../meeraOwnerActivatedRuntimeIssuance";
import {
  createMeeraControlledShadowOperationPreparation,
  validateMeeraControlledShadowOperationPreparation,
  type MeeraControlledShadowOperationPreparation,
} from "../meeraControlledShadowOperationPreparation";
import {
  executeMeeraControlledShadowOperation,
  validateMeeraControlledShadowOperationExecution,
  type MeeraControlledShadowOperationExecution,
} from "../meeraControlledShadowOperationExecution";
import {
  executeMeeraLimitedInternalPilotQuotationProposal,
  validateMeeraLimitedInternalPilotQuotationProposalExecution,
  type MeeraLimitedInternalPilotQuotationProposalExecution,
} from "../meeraLimitedInternalPilotQuotationProposalExecution";
import {
  MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_DECISION_VERSION,
  createMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision,
  validateMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision,
} from "../meeraOwnerLimitedInternalPilotQuotationProposalReviewDecision";
import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARATION_VERSION,
  createMeeraLimitedInternalPilotQuotationProposalTwoPreparation,
  validateMeeraLimitedInternalPilotQuotationProposalTwoPreparation,
} from "../meeraLimitedInternalPilotQuotationProposalTwoPreparation";
import {
  MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_VERSION,
  createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision,
  validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision,
} from "../meeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision";
import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_VERSION,
  executeMeeraLimitedInternalPilotQuotationProposalTwo,
  validateMeeraLimitedInternalPilotQuotationProposalTwoExecution,
} from "../meeraLimitedInternalPilotQuotationProposalTwoExecution";
import {
  MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISION_VERSION,
  createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision,
  validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision,
} from "../meeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision";
import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_VERSION,
  createMeeraLimitedInternalPilotQuotationProposalThreePreparation,
  validateMeeraLimitedInternalPilotQuotationProposalThreePreparation,
} from "../meeraLimitedInternalPilotQuotationProposalThreePreparation";
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
    createMeeraQualificationReadinessAssessment({
      assessmentId:
        "meera-readiness-assessment-day-54",

      employeeId:
        "employee-meera-quotation-proposal-specialist-v1",

      templateId:
        "template-meera-quotation-proposal-specialist-v1",

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      evaluatedAt:
        "2026-07-16T15:00:00.000Z",

      caseEvidence:
        MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES.map(
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
    createMeeraOwnerQualificationReviewDecision({
      decisionId:
        "meera-owner-review-decision-day-54",

      readiness,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      decision:
        "APPROVE_FORMAL_QUALIFICATION_TESTING",

      rationale:
        "Controlled Meera formal qualification testing remains owner approved.",

      decidedAt:
        "2026-07-16T15:15:00.000Z",
    });

  const admission =
    createMeeraQualificationTestingAdmission({
      admissionId:
        "meera-testing-admission-day-54",

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

  return createMeeraQualificationTestPlan({
    planId:
      "meera-specialist-plan-day-54",

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
  MeeraFormalQualificationIssuance |
  null = null;

async function formalQualification() {
  if (cachedFormal !== null) {
    return cachedFormal;
  }

  const plan =
    createMeeraFormalQualificationTestPlan({
      planId:
        "meera-formal-plan-day-54",

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
    createMeeraFormalQualificationFixturePack({
      fixturePackId:
        "meera-formal-fixture-pack-day-54",

      plan,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      preparedAt:
        "2026-07-16T16:15:00.000Z",
    });

  const evidenceLedger =
    await executeMeeraFormalQualificationEvidence({
      ledgerId:
        "meera-formal-evidence-ledger-day-54",

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
    createMeeraFormalQualificationReviewDecision({
      decisionId:
        "meera-formal-review-day-54",

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
    issueMeeraFormalQualification({
      issuanceId:
        "meera-formal-qualification-issuance-day-54",

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
  MeeraQualifiedEmployeeManifestIssuance |
  null = null;

async function qualifiedManifest() {
  if (cachedManifest !== null) {
    return cachedManifest;
  }

  cachedManifest =
    createMeeraQualifiedEmployeeManifestIssuance({
      manifestIssuanceId:
        "meera-qualified-manifest-issuance-day-54",

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
      "meera-activation-candidate-issuance-day-54",

    qualifiedManifestIssuance:
      await qualifiedManifest(),

    formalQualification:
      await formalQualification(),

    runtimeId:
      "runtime-meera-paused-day-54",

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
    MeeraActivationCandidateIssuance,

  decision:
    MeeraOwnerActivationDecisionType,

  overrides: Readonly<{
    ownerId?: string;
    reason?: string;
    decidedAt?: string;
  }> = {},
) {
  return createMeeraOwnerActivationDecision({
    activationCandidateIssuance:
      source,

    decisionId:
      "meera-owner-activation-decision-day-55",

    ownerId:
      overrides.ownerId ??
      OWNER_ID,

    decision,

    reason:
      overrides.reason ??
      "Owner reviewed Meera's qualified activation candidate and recorded the controlled decision.",

    decidedAt:
      overrides.decidedAt ??
      "2026-07-16T17:45:00.000Z",
  });
}

function createRuntimeIssuance(
  source:
    MeeraActivationCandidateIssuance,

  decision =
    createOwnerDecision(
      source,
      "APPROVE_MEERA_ACTIVATION",
    ),

  activatedAt =
    "2026-07-16T18:00:00.000Z",
) {
  return createMeeraOwnerActivatedRuntimeIssuance({
    runtimeIssuanceId:
      "meera-owner-activated-runtime-issuance-day-56",

    activationCandidateIssuance:
      source,

    ownerActivationDecision:
      decision,

    activatedAt,
  });
}

function createShadowPreparation(
  source:
    MeeraOwnerActivatedRuntimeIssuance,

  options: Readonly<{
    preparationId?: string;
    preparedAt?: string;
  }> = {},
) {
  return createMeeraControlledShadowOperationPreparation({
    preparationId:
      options.preparationId ??
      "meera-controlled-shadow-preparation-day-57",

    ownerActivatedRuntimeIssuance:
      source,

    preparedAt:
      options.preparedAt ??
      "2026-07-16T18:15:00.000Z",
  });
}

async function executeShadowOperation(
  source:
    MeeraOwnerActivatedRuntimeIssuance,

  preparation =
    createShadowPreparation(
      source,
    ),

  options: Readonly<{
    executionId?: string;
    executedAt?: string;
  }> = {},
) {
  return executeMeeraControlledShadowOperation({
    executionId:
      options.executionId ??
      "meera-controlled-shadow-execution-day-58",

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
    typeof createMeeraOwnerControlledShadowOperationReviewDecision
  >[0];

async function day59ReviewInput(
  overrides:
    Partial<Day59ReviewInput> = {},
): Promise<Day59ReviewInput> {
  const runtime =
    createRuntimeIssuance(
      createMeeraActivationCandidateIssuance(
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
      "meera-controlled-shadow-review-decision-day-59",

    ownerId:
      execution.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",

    reason:
      "Owner reviewed Meera's synthetic recommendation evidence and approved limited internal pilot preparation only.",

    decidedAt:
      "2026-07-16T18:45:00.000Z",

    ...overrides,
  };
}

async function approvedDay59ReviewDecision() {
  return createMeeraOwnerControlledShadowOperationReviewDecision(
    await day59ReviewInput(),
  );
}

type Day60PreparationInput =
  Parameters<
    typeof createMeeraLimitedInternalPilotPreparation
  >[0];

async function day60PreparationInput(
  overrides:
    Partial<Day60PreparationInput> = {},
): Promise<Day60PreparationInput> {
  return {
    preparationId:
      "meera-limited-internal-pilot-preparation-day-60",

    ownerControlledShadowOperationReviewDecision:
      await approvedDay59ReviewDecision(),

    preparedAt:
      "2026-07-16T19:00:00.000Z",

    ...overrides,
  };
}

type Day61DecisionInput =
  Parameters<
    typeof createMeeraOwnerLimitedInternalPilotExecutionDecision
  >[0];

type Day61Preparation =
  Day61DecisionInput[
    "limitedInternalPilotPreparation"
  ];

async function approvedDay60Preparation():
  Promise<Day61Preparation> {
  return createMeeraLimitedInternalPilotPreparation(
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
      "meera-owner-pilot-execution-decision-day-61",

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION",

    reason:
      "Owner approves only the bounded synthetic quotation/proposal pilot while every real-world authority remains blocked.",

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
    typeof executeMeeraLimitedInternalPilotQuotationProposal
  >[0];

async function day62ExecutionInput(
  overrides:
    Partial<Day62ExecutionInput> = {},
): Promise<Day62ExecutionInput> {
  const reviewInput =
    await day59ReviewInput();

  const reviewDecision =
    createMeeraOwnerControlledShadowOperationReviewDecision(
      reviewInput,
    );

  const preparation =
    createMeeraLimitedInternalPilotPreparation({
      preparationId:
        "meera-limited-internal-pilot-preparation-day-60",

      ownerControlledShadowOperationReviewDecision:
        reviewDecision,

      preparedAt:
        "2026-07-16T19:00:00.000Z",
    });

  const decision =
    createMeeraOwnerLimitedInternalPilotExecutionDecision({
      limitedInternalPilotPreparation:
        preparation,

      decisionId:
        "meera-owner-pilot-execution-decision-day-61",

      ownerId:
        preparation.ownerId,

      decision:
        "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION",

      reason:
        "Owner approves only the bounded synthetic quotation/proposal pilot while every real-world authority remains blocked.",

      decidedAt:
        "2026-07-16T19:00:01.000Z",
    });

  return {
    executionId:
      "meera-limited-pilot-recommendation-execution-day-62",

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
    typeof createMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision
  >[0];

async function day63ReviewInput(
  overrides:
    Partial<Day63ReviewInput> = {},
): Promise<Day63ReviewInput> {
  const execution =
    await executeMeeraLimitedInternalPilotQuotationProposal(
      await day62ExecutionInput(),
    );

  return {
    limitedInternalPilotQuotationProposalExecution:
      execution,

    decisionId:
      "meera-owner-quotation-proposal-one-review-day-63",

    ownerId:
      execution.ownerId,

    decision:
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_PREPARATION",

    reason:
      "Owner verified quotation/proposal one evidence and approved preparation for quotation/proposal two only.",

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
    typeof createMeeraLimitedInternalPilotQuotationProposalTwoPreparation
  >[0];

async function day64PreparationInput(
  overrides:
    Partial<Day64PreparationInput> = {},
): Promise<Day64PreparationInput> {
  const reviewDecision =
    createMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision(
      await day63ReviewInput(),
    );

  return {
    preparationId:
      "meera-limited-pilot-quotation-proposal-two-preparation-day-64",

    ownerLimitedInternalPilotQuotationProposalReviewDecision:
      reviewDecision,

    preparedAt:
      "2026-07-16T19:00:04.000Z",

    ...overrides,
  };
}


type Day99DecisionInput =
  Parameters<
    typeof createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision
  >[0];

async function day99DecisionInput(
  overrides:
    Partial<Day99DecisionInput> = {},
): Promise<Day99DecisionInput> {
  const preparation =
    createMeeraLimitedInternalPilotQuotationProposalTwoPreparation(
      await day64PreparationInput(),
    );

  return {
    limitedInternalPilotQuotationProposalTwoPreparation:
      preparation,

    decisionId:
      "meera-owner-quotation-proposal-two-execution-decision-day-99",

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION",

    reason:
      "Owner verified quotation/proposal two preparation and approved one bounded synthetic execution only.",

    decidedAt:
      "2026-07-16T19:00:05.000Z",

    ...overrides,
  };
}


type Day100ExecutionInput =
  Parameters<
    typeof executeMeeraLimitedInternalPilotQuotationProposalTwo
  >[0];

async function day100ExecutionInput(
  overrides:
    Partial<Day100ExecutionInput> = {},
): Promise<Day100ExecutionInput> {
  const decisionInput =
    await day99DecisionInput();

  const decision =
    createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
      decisionInput,
    );

  return {
    executionId:
      "meera-limited-pilot-quotation-proposal-two-execution-day-100",

    ownerLimitedInternalPilotQuotationProposalTwoExecutionDecision:
      decision,

    limitedInternalPilotQuotationProposalTwoPreparation:
      decisionInput
        .limitedInternalPilotQuotationProposalTwoPreparation,

    executedAt:
      "2026-07-16T19:00:06.000Z",

    ...overrides,
  };
}


type Day101ReviewInput =
  Parameters<
    typeof createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision
  >[0];

async function day101ReviewInput(
  overrides:
    Partial<Day101ReviewInput> = {},
): Promise<Day101ReviewInput> {
  const execution =
    await executeMeeraLimitedInternalPilotQuotationProposalTwo(
      await day100ExecutionInput(),
    );

  return {
    limitedInternalPilotQuotationProposalTwoExecution:
      execution,

    decisionId:
      "meera-owner-quotation-proposal-two-review-day-101",

    ownerId:
      execution.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION",

    reason:
      "Owner verified quotation/proposal two clarification evidence and approved quotation/proposal three preparation only.",

    decidedAt:
      "2026-07-16T19:00:07.000Z",

    ...overrides,
  };
}


type Day102PreparationInput =
  Parameters<
    typeof createMeeraLimitedInternalPilotQuotationProposalThreePreparation
  >[0];

async function day102PreparationInput(
  overrides:
    Partial<Day102PreparationInput> = {},
): Promise<Day102PreparationInput> {
  const reviewDecision =
    createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
      await day101ReviewInput(),
    );

  return {
    preparationId:
      "meera-limited-pilot-quotation-proposal-three-preparation-day-102",

    ownerLimitedInternalPilotQuotationProposalTwoReviewDecision:
      reviewDecision,

    preparedAt:
      "2026-07-16T19:00:08.000Z",

    ...overrides,
  };
}

type Day103DecisionInput =
  Parameters<
    typeof createMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision
  >[0];

async function day103DecisionInput(
  overrides:
    Partial<Day103DecisionInput> = {},
): Promise<Day103DecisionInput> {
  const preparation =
    createMeeraLimitedInternalPilotQuotationProposalThreePreparation(
      await day102PreparationInput(),
    );

  return {
    limitedInternalPilotQuotationProposalThreePreparation:
      preparation,

    decisionId:
      "meera-owner-recommendation-two-execution-decision-day-103",

    ownerId:
      preparation.ownerId,

    decision:
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION",

    reason:
      "Owner verified quotation/proposal three preparation and approved one bounded synthetic execution only.",

    decidedAt:
      "2026-07-16T19:00:09.000Z",

    ...overrides,
  };
}

type Day104ExecutionInput =
  Parameters<
    typeof executeMeeraLimitedInternalPilotQuotationProposalThree
  >[0];

async function day104ExecutionInput(
  overrides:
    Partial<Day104ExecutionInput> = {},
): Promise<Day104ExecutionInput> {
  const decisionInput =
    await day103DecisionInput();

  const decision =
    createMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision(
      decisionInput,
    );

  return {
    executionId:
      "meera-limited-pilot-quotation-proposal-three-execution-day-104",

    ownerLimitedInternalPilotQuotationProposalThreeExecutionDecision:
      decision,

    limitedInternalPilotQuotationProposalThreePreparation:
      decisionInput
        .limitedInternalPilotQuotationProposalThreePreparation,

    executedAt:
      "2026-07-16T19:30:01.000Z",

    ...overrides,
  };
}

describe(
  "Meera limited internal pilot quotationProposal three execution",
  () => {
    it(
      "executes quotationProposal three of three and stops for mandatory owner review",
      async () => {
        const execution =
          await executeMeeraLimitedInternalPilotQuotationProposalThree(
            await day104ExecutionInput(),
          );

        expect(execution.version).toBe(
          MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_VERSION,
        );

        expect(execution.executionState).toBe(
          "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTED",
        );

        expect(
          execution.pilotRecommendation
            .quotationProposalSequence,
        ).toBe(3);

        expect(
          execution.pilotRecommendation
            .remainingQuotationProposalCapacity,
        ).toBe(0);

        expect(
          execution.executionBoundary
            .limitedInternalPilotCompleted,
        ).toBe(false);

        expect(execution.nextStep).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW",
        );
      },
    );

    it(
      "creates the exact conflicting options tradeoff draft",
      async () => {
        const execution =
          await executeMeeraLimitedInternalPilotQuotationProposalThree(
            await day104ExecutionInput(),
          );

        expect(
          execution.quotationProposalDraft,
        ).toMatchObject({
          quotationProposalStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          recommendationOutcome:
            "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS",

          preferredOptionId:
            "OPTION_A_BOUNDED_SIMPLE_ROLLOUT",

          ownerDecisionReserved:
            true,

          assumptionsMade:
            false,

          unsupportedClaimsIncluded:
            false,

          urgencyExaggerated:
            false,

          guaranteeMade:
            false,

          transparentAIIdentity:
            true,

          ownerDecisionMade:
            false,

          customerDeliveryPrepared:
            false,

          customerDeliveryExecuted:
            false,
        });

        expect(
          execution.quotationProposalDraft.options,
        ).toHaveLength(2);

        expect(
          execution.quotationProposalDraft.options[0],
        ).toMatchObject({
          optionId:
            "OPTION_A_BOUNDED_SIMPLE_ROLLOUT",

          riskLevel:
            "LOW",
        });

        expect(
          execution.quotationProposalDraft.options[1],
        ).toMatchObject({
          optionId:
            "OPTION_B_HIGH_CAPACITY_ROLLOUT",

          riskLevel:
            "MEDIUM",
        });

        expect(
          execution.quotationProposalDraft.options
            .every(
              (option) =>
                option.benefits.length > 0 &&
                option.tradeoffs.length > 0,
            ),
        ).toBe(true);
      },
    );

    it(
      "binds the exact Day 103 decision Day 102 preparation and complete source chain",
      async () => {
        const input =
          await day104ExecutionInput();

        const execution =
          await executeMeeraLimitedInternalPilotQuotationProposalThree(
            input,
          );

        const decision =
          input
            .ownerLimitedInternalPilotQuotationProposalThreeExecutionDecision;

        const preparation =
          input
            .limitedInternalPilotQuotationProposalThreePreparation;

        expect(
          execution.ownerQuotationProposalThreeExecutionDecisionId,
        ).toBe(
          decision.decisionId,
        );

        expect(
          execution.ownerQuotationProposalThreeExecutionDecisionDigest,
        ).toBe(
          decision.decisionDigest,
        );

        expect(
          execution.quotationProposalThreePreparationId,
        ).toBe(
          preparation.preparationId,
        );

        expect(
          execution.quotationProposalThreePreparationDigest,
        ).toBe(
          preparation.preparationDigest,
        );

        expect(
          execution.sourceQuotationProposalTwoExecutionId,
        ).toBe(
          preparation.sourceQuotationProposalTwoExecutionId,
        );

        expect(
          execution.ownerQuotationProposalTwoExecutionDecisionId,
        ).toBe(
          preparation.ownerQuotationProposalTwoExecutionDecisionId,
        );

        expect(
          execution.controlledShadowExecutionId,
        ).toBe(
          preparation.controlledShadowExecutionId,
        );

        expect(execution.tenantId).toBe(
          preparation.tenantId,
        );

        expect(execution.ownerId).toBe(
          preparation.ownerId,
        );
      },
    );

    it(
      "executes exactly once and preserves synthetic isolation",
      async () => {
        const execution =
          await executeMeeraLimitedInternalPilotQuotationProposalThree(
            await day104ExecutionInput(),
          );

        expect(
          execution.executionBoundary
            .quotationProposalCreatorInvocationCount,
        ).toBe(1);

        expect(
          execution.executionBoundary
            .quotationProposalThreeExecutionPerformed,
        ).toBe(true);

        expect(
          execution.executionBoundary
            .syntheticQuotationProposalExecutionPerformed,
        ).toBe(true);

        expect(
          execution.syntheticInquiryEvidence
            .unsupportedFactsInvented,
        ).toBe(false);

        expect(
          execution.syntheticInquiryEvidence
            .crossCustomerEvidenceUsed,
        ).toBe(false);

        expect(
          execution.syntheticInquiryEvidence
            .crossTenantEvidenceUsed,
        ).toBe(false);

        expect(
          execution.syntheticCustomerContext
            .realCustomerDataUsed,
        ).toBe(false);
      },
    );

    it(
      "rejects rejection decisions and tampered decision integrity",
      async () => {
        const input =
          await day104ExecutionInput();

        const rejectedInput =
          await day103DecisionInput({
            decisionId:
              "meera-owner-quotation-proposal-three-execution-rejected-for-day-104",

            decision:
              "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_THREE_PREPARATION_ONLY",

            reason:
              "Owner rejected quotationProposal three execution and retained preparation only.",
          });

        const rejected =
          createMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision(
            rejectedInput,
          );

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposalThree({
            ...input,

            ownerLimitedInternalPilotQuotationProposalThreeExecutionDecision:
              rejected,

            limitedInternalPilotQuotationProposalThreePreparation:
              rejectedInput
                .limitedInternalPilotQuotationProposalThreePreparation,
          }),
        ).rejects.toThrow(
          "approved Workforce Day 103",
        );

        const tampered = {
          ...input
            .ownerLimitedInternalPilotQuotationProposalThreeExecutionDecision,

          decisionDigest:
            "a".repeat(64),
        } as Day104ExecutionInput[
          "ownerLimitedInternalPilotQuotationProposalThreeExecutionDecision"
        ];

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposalThree({
            ...input,

            ownerLimitedInternalPilotQuotationProposalThreeExecutionDecision:
              tampered,
          }),
        ).rejects.toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "rejects tampered or cross-bound preparation and execution before approval",
      async () => {
        const input =
          await day104ExecutionInput();

        const tamperedPreparation = {
          ...input
            .limitedInternalPilotQuotationProposalThreePreparation,

          preparationDigest:
            "b".repeat(64),
        } as Day104ExecutionInput[
          "limitedInternalPilotQuotationProposalThreePreparation"
        ];

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposalThree({
            ...input,

            limitedInternalPilotQuotationProposalThreePreparation:
              tamperedPreparation,
          }),
        ).rejects.toThrow(
          "integrity verification failed",
        );

        const alternatePreparation =
          createMeeraLimitedInternalPilotQuotationProposalThreePreparation(
            await day102PreparationInput({
              preparationId:
                "meera-limited-pilot-quotation-proposal-three-preparation-alternate",
            }),
          );

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposalThree({
            ...input,

            limitedInternalPilotQuotationProposalThreePreparation:
              alternatePreparation,
          }),
        ).rejects.toThrow(
          "source binding verification failed",
        );

        const beforeApproval =
          new Date(
            Date.parse(
              input
                .ownerLimitedInternalPilotQuotationProposalThreeExecutionDecision
                .decidedAt,
            ) - 1,
          ).toISOString();

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposalThree({
            ...input,

            executedAt:
              beforeApproval,
          }),
        ).rejects.toThrow(
          "cannot precede owner approval",
        );
      },
    );

    it(
      "keeps customer production payment autonomous and launch authority blocked",
      async () => {
        const execution =
          await executeMeeraLimitedInternalPilotQuotationProposalThree(
            await day104ExecutionInput(),
          );

        expect(
          execution.executionBoundary,
        ).toMatchObject({
          ownerExecutionApprovalBound:
            true,

          quotationProposalThreeExecutionPerformed:
            true,

          limitedInternalPilotCompleted:
            false,

          ownerDecisionMade:
            false,

          ownerReviewRequired:
            true,

          quotationProposalCustomerDeliveryAuthorized:
            false,

          customerDeliveryPrepared:
            false,

          customerDeliveryExecuted:
            false,

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

          publicLaunchAuthorized:
            false,

          monitoringRequired:
            true,

          ownerReviewAfterEveryQuotationProposal:
            true,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and secret-safe",
      async () => {
        const input =
          await day104ExecutionInput();

        const first =
          await executeMeeraLimitedInternalPilotQuotationProposalThree(
            input,
          );

        const second =
          await executeMeeraLimitedInternalPilotQuotationProposalThree(
            input,
          );

        expect(second).toEqual(first);

        expect(first.executionDigest).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.pilotRecommendation,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.syntheticInquiryEvidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.quotationProposalDraft,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.quotationProposalDraft.options,
          ),
        ).toBe(true);

        expect(
          first.quotationProposalDraft.options.every(
            (option) =>
              Object.isFrozen(option) &&
              Object.isFrozen(option.benefits) &&
              Object.isFrozen(option.tradeoffs),
          ),
        ).toBe(true);

        expect(() =>
          validateMeeraLimitedInternalPilotQuotationProposalThreeExecution(
            first,
          ),
        ).not.toThrow();

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposalThree({
            ...input,

            executionId:
              "secret-meera-quotation-proposal-three-execution",
          }),
        ).rejects.toThrow(
          "credential-bearing term",
        );

        const tampered = {
          ...first,

          nextStep:
            "REAL_CUSTOMER_DELIVERY",
        } as unknown as
          MeeraLimitedInternalPilotQuotationProposalThreeExecution;

        expect(() =>
          validateMeeraLimitedInternalPilotQuotationProposalThreeExecution(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);