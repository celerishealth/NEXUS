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
        "meera-readiness-assessment-day-88",

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
        "meera-owner-review-decision-day-88",

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
        "meera-testing-admission-day-88",

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
      "meera-specialist-plan-day-88",

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
        "meera-formal-plan-day-88",

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
        "meera-formal-fixture-pack-day-88",

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
        "meera-formal-evidence-ledger-day-88",

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
        "meera-formal-review-day-88",

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
        "meera-formal-qualification-issuance-day-88",

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
        "meera-qualified-manifest-issuance-day-88",

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
      "meera-activation-candidate-issuance-day-88",

    qualifiedManifestIssuance:
      await qualifiedManifest(),

    formalQualification:
      await formalQualification(),

    runtimeId:
      "runtime-meera-paused-day-88",

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
      "meera-owner-activation-decision-day-89",

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
      "meera-owner-activated-runtime-issuance-day-90",

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
      "meera-controlled-shadow-preparation-day-91",

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
      "meera-controlled-shadow-execution-day-92",

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
type Day93ReviewInput =
  Parameters<
    typeof createMeeraOwnerControlledShadowOperationReviewDecision
  >[0];

async function day93ReviewInput(
  overrides:
    Partial<Day93ReviewInput> = {},
): Promise<Day93ReviewInput> {
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
      "meera-controlled-shadow-review-decision-day-93",

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

async function approvedDay93ReviewDecision() {
  return createMeeraOwnerControlledShadowOperationReviewDecision(
    await day93ReviewInput(),
  );
}

type Day94PreparationInput =
  Parameters<
    typeof createMeeraLimitedInternalPilotPreparation
  >[0];

async function day94PreparationInput(
  overrides:
    Partial<Day94PreparationInput> = {},
): Promise<Day94PreparationInput> {
  return {
    preparationId:
      "meera-limited-internal-pilot-preparation-day-94",

    ownerControlledShadowOperationReviewDecision:
      await approvedDay93ReviewDecision(),

    preparedAt:
      "2026-07-16T19:00:00.000Z",

    ...overrides,
  };
}

type Day95DecisionInput =
  Parameters<
    typeof createMeeraOwnerLimitedInternalPilotExecutionDecision
  >[0];

type Day95Preparation =
  Day95DecisionInput[
    "limitedInternalPilotPreparation"
  ];

async function approvedDay94Preparation():
  Promise<Day95Preparation> {
  return createMeeraLimitedInternalPilotPreparation(
    await day94PreparationInput(),
  );
}

async function day95DecisionInput(
  overrides:
    Partial<Day95DecisionInput> = {},
): Promise<Day95DecisionInput> {
  const preparation =
    await approvedDay94Preparation();

  return {
    limitedInternalPilotPreparation:
      preparation,

    decisionId:
      "meera-owner-pilot-execution-decision-day-95",

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


type Day96ExecutionInput =
  Parameters<
    typeof executeMeeraLimitedInternalPilotQuotationProposal
  >[0];

async function day96ExecutionInput(
  overrides:
    Partial<Day96ExecutionInput> = {},
): Promise<Day96ExecutionInput> {
  const reviewInput =
    await day93ReviewInput();

  const reviewDecision =
    createMeeraOwnerControlledShadowOperationReviewDecision(
      reviewInput,
    );

  const preparation =
    createMeeraLimitedInternalPilotPreparation({
      preparationId:
        "meera-limited-internal-pilot-preparation-day-94",

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
        "meera-owner-pilot-execution-decision-day-95",

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
      "meera-limited-pilot-recommendation-execution-day-96",

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


type Day97ReviewInput =
  Parameters<
    typeof createMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision
  >[0];

async function day97ReviewInput(
  overrides:
    Partial<Day97ReviewInput> = {},
): Promise<Day97ReviewInput> {
  const execution =
    await executeMeeraLimitedInternalPilotQuotationProposal(
      await day96ExecutionInput(),
    );

  return {
    limitedInternalPilotQuotationProposalExecution:
      execution,

    decisionId:
      "meera-owner-recommendation-one-review-day-97",

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


function day98StableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
          day98StableStringify(item),
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
            day98StableStringify(
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
      "Unsupported deterministic Day 98 test value.",
    );
  }

  return primitive;
}

function day98Sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      day98StableStringify(value),
      "utf8",
    )
    .digest("hex");
}
type Day98PreparationInput =
  Parameters<
    typeof createMeeraLimitedInternalPilotQuotationProposalTwoPreparation
  >[0];

async function day98PreparationInput(
  overrides:
    Partial<Day98PreparationInput> = {},
): Promise<Day98PreparationInput> {
  const reviewDecision =
    createMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision(
      await day97ReviewInput(),
    );

  return {
    preparationId:
      "meera-limited-pilot-recommendation-two-preparation-day-98",

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
      await day98PreparationInput(),
    );

  return {
    limitedInternalPilotQuotationProposalTwoPreparation:
      preparation,

    decisionId:
      "meera-owner-recommendation-two-execution-decision-day-99",

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

describe(
  "Meera owner limited internal pilot quotation/proposal two execution decision",
  () => {
    it(
      "approves quotation/proposal two execution without performing it",
      async () => {
        const decision =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
            await day99DecisionInput(),
          );

        expect(decision.version).toBe(
          MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_VERSION,
        );

        expect(decision.decisionState).toBe(
          "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_RECORDED",
        );

        expect(
          decision.quotationProposalTwoExecutionAuthorized,
        ).toBe(true);

        expect(
          decision.quotationProposalTwoExecutionPerformed,
        ).toBe(false);

        expect(decision.nextStep).toBe(
          "EXECUTE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO",
        );
      },
    );

    it(
      "records rejection and retains quotation/proposal two preparation only",
      async () => {
        const decision =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
            await day99DecisionInput({
              decisionId:
                "meera-owner-recommendation-two-execution-rejected-day-99",

              decision:
                "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_TWO_PREPARATION_ONLY",

              reason:
                "Owner rejected execution and retained quotation/proposal two at preparation only.",
            }),
          );

        expect(
          decision.quotationProposalTwoExecutionAuthorized,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .quotationProposalTwoExecutionAuthorized,
        ).toBe(false);

        expect(decision.nextStep).toBe(
          "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARATION_ONLY",
        );
      },
    );

    it(
      "binds exact Day 98 preparation and complete source chain",
      async () => {
        const input =
          await day99DecisionInput();

        const decision =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
            input,
          );

        const source =
          input.limitedInternalPilotQuotationProposalTwoPreparation;

        expect(decision.preparationId).toBe(
          source.preparationId,
        );

        expect(decision.preparationDigest).toBe(
          source.preparationDigest,
        );

        expect(
          decision.sourceQuotationProposalReviewDecisionId,
        ).toBe(
          source.sourceQuotationProposalReviewDecisionId,
        );

        expect(
          decision.sourceQuotationProposalExecutionId,
        ).toBe(
          source.sourceQuotationProposalExecutionId,
        );

        expect(
          decision.ownerExecutionDecisionId,
        ).toBe(
          source.ownerExecutionDecisionId,
        );

        expect(
          decision.sourcePilotPreparationId,
        ).toBe(
          source.sourcePilotPreparationId,
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
      "preserves exact quotation/proposal two clarification scope",
      async () => {
        const decision =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
            await day99DecisionInput(),
          );

        expect(
          decision.reviewedPreparation,
        ).toMatchObject({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          scenarioId:
            "MISSING_COMMERCIAL_EVIDENCE",

          quotationProposalSequence:
            2,

          priorReviewedQuotationProposalSequence:
            1,

          maximumQuotationProposalCount:
            3,

          remainingQuotationProposalCapacityBeforeExecution:
            2,

          projectedRemainingQuotationProposalCapacityAfterExecution:
            1,

          concurrentQuotationProposalLimit:
            1,

          failureThreshold:
            1,

          ownerReviewFrequency:
            "AFTER_EVERY_QUOTATION_PROPOSAL",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          quotationProposalToolMode:
            "DRAFT_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          clarificationBeforeGuessingRequired:
            true,

          missingFactsMustBeExplicit:
            true,

          verifiedFactsSeparatedFromAssumptions:
            true,

          uncertaintyPreserved:
            true,

          practicalClarifyingQuestionsRequired:
            true,

          quotationProposalGenerationPerformed:
            false,

          ownerDecisionMade:
            false,
        });
      },
    );

    it(
      "keeps customer production payment autonomous and launch authority blocked",
      async () => {
        const decision =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
            await day99DecisionInput(),
          );

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          sourcePreparationBound:
            true,

          sourcePreparationIntegrityVerified:
            true,

          ownerExecutionDecisionRecorded:
            true,

          approvalBypassAllowed:
            false,

          quotationProposalOneReviewed:
            true,

          quotationProposalTwoPreparationPerformed:
            true,

          quotationProposalTwoExecutionAuthorized:
            true,

          quotationProposalTwoExecutionPerformed:
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
      "blocks a different owner and a decision before preparation",
      async () => {
        await expect(
          async () =>
            createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
              await day99DecisionInput({
                ownerId:
                  "owner-different",
              }),
            ),
        ).rejects.toThrow(
          "preparation-bound owner",
        );

        const input =
          await day99DecisionInput();

        const beforePreparation =
          new Date(
            Date.parse(
              input
                .limitedInternalPilotQuotationProposalTwoPreparation
                .preparedAt,
            ) - 1,
          ).toISOString();

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision({
            ...input,

            decidedAt:
              beforePreparation,
          }),
        ).toThrow(
          "cannot precede its preparation",
        );
      },
    );

    it(
      "rejects tampered preparation invalid decisions and secret-bearing reasons",
      async () => {
        const input =
          await day99DecisionInput();

        const tampered = {
          ...input
            .limitedInternalPilotQuotationProposalTwoPreparation,

          preparationDigest:
            "f".repeat(64),
        } as Day99DecisionInput[
          "limitedInternalPilotQuotationProposalTwoPreparation"
        ];

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision({
            ...input,

            limitedInternalPilotQuotationProposalTwoPreparation:
              tampered,
          }),
        ).toThrow(
          "integrity verification failed",
        );

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision({
            ...input,

            decision:
              "INVALID_EXECUTION_DECISION" as Day99DecisionInput[
                "decision"
              ],
          }),
        ).toThrow(
          "execution decision is invalid",
        );

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision({
            ...input,

            reason:
              "Owner approved execution using secret access_token abc123.",
          }),
        ).toThrow(
          "secret-bearing content",
        );
      },
    );

    it(
      "is deterministic deeply frozen digest-bound and secret-safe",
      async () => {
        const input =
          await day99DecisionInput();

        const first =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
            input,
          );

        const second =
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
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
            first.reviewedPreparation,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
            first,
          ),
        ).not.toThrow();

        expect(() =>
          createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision({
            ...input,

            decisionId:
              "secret-meera-recommendation-two-execution-decision",
          }),
        ).toThrow(
          "credential-bearing content",
        );
      },
    );
  },
);
