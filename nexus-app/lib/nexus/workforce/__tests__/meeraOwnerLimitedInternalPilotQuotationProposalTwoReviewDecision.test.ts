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

describe(
  "Meera owner limited internal pilot quotation/proposal two review decision",
  () => {
    it(
      "approves quotation/proposal three preparation only without authorizing execution",
      async () => {
        const decision =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
            await day101ReviewInput(),
          );

        expect(decision.version).toBe(
          MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISION_VERSION,
        );

        expect(decision.decisionState).toBe(
          "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_RECORDED",
        );

        expect(
          decision.nextQuotationProposalPreparationApproved,
        ).toBe(true);

        expect(
          decision.quotationProposalThreeExecutionAuthorized,
        ).toBe(false);

        expect(decision.nextStep).toBe(
          "PREPARE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE",
        );
      },
    );

    it(
      "records rejection and retains quotation/proposals one and two only",
      async () => {
        const decision =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
            await day101ReviewInput({
              decisionId:
                "meera-owner-quotation-proposal-two-review-rejected-day-101",

              decision:
                "REJECT_AND_RETAIN_QUOTATION_PROPOSALS_ONE_AND_TWO_ONLY",

              reason:
                "Owner rejected continuation and retained the pilot at quotation/proposals one and two only.",
            }),
          );

        expect(
          decision.nextQuotationProposalPreparationApproved,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .nextQuotationProposalPreparationAuthorized,
        ).toBe(false);

        expect(decision.nextStep).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSALS_ONE_AND_TWO_ONLY",
        );
      },
    );

    it(
      "records exact quotation/proposal two evidence without guessing",
      async () => {
        const decision =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
            await day101ReviewInput(),
          );

        expect(decision.reviewedEvidence).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          scenarioId:
            "MISSING_COMMERCIAL_EVIDENCE",

          reviewedQuotationProposalSequence:
            2,

          maximumQuotationProposalCount:
            3,

          remainingQuotationProposalCapacity:
            1,

          ownerReviewFrequency:
            "AFTER_EVERY_QUOTATION_PROPOSAL",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          inquiryEvidenceToolMode:
            "READ_ONLY",

          recommendationEvidenceToolMode:
            "READ_ONLY",

          quotationProposalToolMode:
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
      "binds the exact Day 100 execution and complete source chain",
      async () => {
        const input =
          await day101ReviewInput();

        const decision =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
            input,
          );

        const source =
          input.limitedInternalPilotQuotationProposalTwoExecution;

        expect(
          decision.limitedInternalPilotQuotationProposalTwoExecutionId,
        ).toBe(source.executionId);

        expect(
          decision.limitedInternalPilotQuotationProposalTwoExecutionDigest,
        ).toBe(source.executionDigest);

        expect(
          decision.ownerQuotationProposalTwoExecutionDecisionId,
        ).toBe(
          source.ownerQuotationProposalTwoExecutionDecisionId,
        );

        expect(
          decision.quotationProposalTwoPreparationId,
        ).toBe(
          source.quotationProposalTwoPreparationId,
        );

        expect(
          decision.sourceQuotationProposalReviewDecisionId,
        ).toBe(
          source.sourceQuotationProposalReviewDecisionId,
        );

        expect(
          decision.sourceQuotationProposalOneExecutionId,
        ).toBe(
          source.sourceQuotationProposalOneExecutionId,
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
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
            await day101ReviewInput(),
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

          quotationProposalOneReviewed:
            true,

          quotationProposalTwoReviewed:
            true,

          nextQuotationProposalPreparationAuthorized:
            true,

          quotationProposalThreePreparationPerformed:
            false,

          quotationProposalThreeExecutionAuthorized:
            false,

          quotationProposalThreeExecutionPerformed:
            false,

          concurrentQuotationProposalExecutionAuthorized:
            false,

          limitedInternalPilotCompleted:
            false,

          quotationProposalCustomerDeliveryAuthorized:
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
      "blocks cross-owner review and review before quotation/proposal two execution",
      async () => {
        const input =
          await day101ReviewInput();

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision({
            ...input,

            ownerId:
              "owner-cross-tenant",
          }),
        ).toThrow(
          "quotation-proposal-two-execution-bound owner",
        );

        const beforeExecution =
          new Date(
            Date.parse(
              input
                .limitedInternalPilotQuotationProposalTwoExecution
                .executedAt,
            ) - 1,
          ).toISOString();

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision({
            ...input,

            decidedAt:
              beforeExecution,
          }),
        ).toThrow(
          "cannot precede quotation/proposal two execution",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 100 execution integrity",
      async () => {
        const input =
          await day101ReviewInput();

        const source = {
          ...input
            .limitedInternalPilotQuotationProposalTwoExecution,

          executionDigest:
            "f".repeat(64),
        } as Day101ReviewInput[
          "limitedInternalPilotQuotationProposalTwoExecution"
        ];

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision({
            ...input,

            limitedInternalPilotQuotationProposalTwoExecution:
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
          await day101ReviewInput();

        const first =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
            input,
          );

        const second =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
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
          validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
            first,
          ),
        ).not.toThrow();

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision({
            ...input,

            decisionId:
              "secret-meera-quotation-proposal-two-review",
          }),
        ).toThrow(
          "credential-bearing content",
        );

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision({
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
