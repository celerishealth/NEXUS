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

type Day61Preparation =
  Day95DecisionInput[
    "limitedInternalPilotPreparation"
  ];

async function approvedDay94Preparation():
  Promise<Day61Preparation> {
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

describe(
  "Meera limited internal pilot quotation/proposal execution",
  () => {
    it(
      "executes quotation/proposal one of three and stops for mandatory owner review",
      async () => {
        const execution =
          await executeMeeraLimitedInternalPilotQuotationProposal(
            await day96ExecutionInput(),
          );

        expect(execution.executionState).toBe(
          "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTED",
        );

        expect(
          execution.pilotQuotationProposal
            .quotationProposalSequence,
        ).toBe(1);

        expect(
          execution.pilotQuotationProposal
            .remainingQuotationProposalCapacity,
        ).toBe(2);

        expect(
          execution.executionBoundary
            .limitedInternalPilotCompleted,
        ).toBe(false);

        expect(execution.nextStep).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW",
        );
      },
    );

    it(
      "preserves the exact bounded synthetic sandbox quotation/proposal scope",
      async () => {
        const execution =
          await executeMeeraLimitedInternalPilotQuotationProposal(
            await day96ExecutionInput(),
          );

        expect(
          execution.pilotQuotationProposal,
        ).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          scenarioId:
            "AUTHORIZED_INQUIRY_AND_RECOMMENDATION_EVIDENCE",

          quotationProposalSequence:
            1,

          maximumQuotationProposalCount:
            3,

          remainingQuotationProposalCapacity:
            2,

          concurrentQuotationProposalLimit:
            1,

          failureThreshold:
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
        });

        expect(
          execution.quotationProposalDraft
            .quotationProposalStatus,
        ).toBe(
          "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW",
        );
      },
    );

    it(
      "binds the Day 95 approval Day 94 preparation shadow evidence tenant owner and Meera identity",
      async () => {
        const input =
          await day96ExecutionInput();

        const execution =
          await executeMeeraLimitedInternalPilotQuotationProposal(
            input,
          );

        expect(
          execution.ownerExecutionDecisionId,
        ).toBe(
          input
            .ownerLimitedInternalPilotExecutionDecision
            .decisionId,
        );

        expect(execution.preparationId).toBe(
          input.limitedInternalPilotPreparation
            .preparationId,
        );

        expect(
          execution.controlledShadowExecutionId,
        ).toBe(
          input.controlledShadowOperationExecution
            .executionId,
        );

        expect(execution.tenantId).toBe(
          input.limitedInternalPilotPreparation
            .tenantId,
        );

        expect(execution.ownerId).toBe(
          input.limitedInternalPilotPreparation
            .ownerId,
        );

        expect(execution.employeeId).toBe(
          "employee-meera-quotation-proposal-specialist-v1",
        );
      },
    );

    it(
      "rejects rejection decisions and tampered decision integrity",
      async () => {
        const input =
          await day96ExecutionInput();

        const rejected =
          createMeeraOwnerLimitedInternalPilotExecutionDecision({
            limitedInternalPilotPreparation:
              input.limitedInternalPilotPreparation,

            decisionId:
              "meera-owner-pilot-execution-rejection-day-95",

            ownerId:
              input.limitedInternalPilotPreparation
                .ownerId,

            decision:
              "REJECT_LIMITED_INTERNAL_PILOT_EXECUTION",

            reason:
              "Owner retains preparation-only status.",

            decidedAt:
              input
                .ownerLimitedInternalPilotExecutionDecision
                .decidedAt,
          });

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposal({
            ...input,

            ownerLimitedInternalPilotExecutionDecision:
              rejected,
          }),
        ).rejects.toThrow(
          "approved Workforce Day 95",
        );

        const tampered = {
          ...input
            .ownerLimitedInternalPilotExecutionDecision,

          decisionDigest:
            "a".repeat(64),
        } as Day96ExecutionInput[
          "ownerLimitedInternalPilotExecutionDecision"
        ];

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposal({
            ...input,

            ownerLimitedInternalPilotExecutionDecision:
              tampered,
          }),
        ).rejects.toThrow(
          "integrity verification failed",
        );
      },
    );

    it(
      "rejects altered preparation and controlled shadow execution integrity",
      async () => {
        const input =
          await day96ExecutionInput();

        const alteredPreparation = {
          ...input.limitedInternalPilotPreparation,

          preparationDigest:
            "b".repeat(64),
        } as Day96ExecutionInput[
          "limitedInternalPilotPreparation"
        ];

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposal({
            ...input,

            limitedInternalPilotPreparation:
              alteredPreparation,
          }),
        ).rejects.toThrow(
          "integrity verification failed",
        );

        const alteredShadow = {
          ...input.controlledShadowOperationExecution,

          executionDigest:
            "c".repeat(64),
        } as Day96ExecutionInput[
          "controlledShadowOperationExecution"
        ];

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposal({
            ...input,

            controlledShadowOperationExecution:
              alteredShadow,
          }),
        ).rejects.toThrow(
          "controlled shadow operation execution integrity is invalid",
        );
      },
    );

    it(
      "rejects cross-bound sources and execution before owner approval",
      async () => {
        const input =
          await day96ExecutionInput();

        const alternatePreparation =
          createMeeraLimitedInternalPilotPreparation({
            preparationId:
              "meera-limited-internal-pilot-preparation-alternate",

            ownerControlledShadowOperationReviewDecision:
              createMeeraOwnerControlledShadowOperationReviewDecision(
                await day93ReviewInput(),
              ),

            preparedAt:
              input.limitedInternalPilotPreparation
                .preparedAt,
          });

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposal({
            ...input,

            limitedInternalPilotPreparation:
              alternatePreparation,
          }),
        ).rejects.toThrow(
          "source binding verification failed",
        );

        const beforeApproval =
          new Date(
            Date.parse(
              input
                .ownerLimitedInternalPilotExecutionDecision
                .decidedAt,
            ) - 1,
          ).toISOString();

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposal({
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
      "keeps all customer external production payment autonomous and launch authority blocked",
      async () => {
        const execution =
          await executeMeeraLimitedInternalPilotQuotationProposal(
            await day96ExecutionInput(),
          );

        expect(
          execution.executionBoundary,
        ).toMatchObject({
          limitedInternalPilotExecutionPerformed:
            true,

          syntheticQuotationProposalExecutionPerformed:
            true,

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
          await day96ExecutionInput();

        const first =
          await executeMeeraLimitedInternalPilotQuotationProposal(
            input,
          );

        const second =
          await executeMeeraLimitedInternalPilotQuotationProposal(
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
            first.pilotQuotationProposal,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.quotationProposalDraft,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateMeeraLimitedInternalPilotQuotationProposalExecution(
            first,
          ),
        ).not.toThrow();

        await expect(
          executeMeeraLimitedInternalPilotQuotationProposal({
            ...input,

            executionId:
              "secret-meera-pilot-execution",
          }),
        ).rejects.toThrow(
          "credential-bearing term",
        );
      },
    );
  },
);
