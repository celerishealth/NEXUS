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
      "Owner approves only the bounded synthetic quotation/proposal pilot while every real-world authority remains blocked.",

    decidedAt:
      new Date(
        Date.parse(preparation.preparedAt) +
          1_000,
      ).toISOString(),

    ...overrides,
  };
}

describe(
  "Meera owner limited internal pilot execution decision",
  () => {
    it(
      "records approval without executing any quotation/proposal",
      async () => {
        const result =
          createMeeraOwnerLimitedInternalPilotExecutionDecision(
            await day95DecisionInput(),
          );

        expect(result.version).toBe(
          "nexus-meera-owner-limited-internal-pilot-execution-decision-v1",
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
            .syntheticQuotationProposalExecutionPerformed,
        ).toBe(false);
      },
    );

    it(
      "binds the exact Day 94 preparation employee tenant owner and shadow evidence",
      async () => {
        const input =
          await day95DecisionInput();

        const preparation =
          input.limitedInternalPilotPreparation;

        const result =
          createMeeraOwnerLimitedInternalPilotExecutionDecision(
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
          "employee-meera-quotation-proposal-specialist-v1",
        );

        expect(result.templateId).toBe(
          "template-meera-quotation-proposal-specialist-v1",
        );

        expect(result.employeeCode).toBe(
          "nx-sales-005",
        );

        expect(result.displayName).toBe(
          "Meera",
        );

        expect(result.role).toBe(
          "AI Quotation & Proposal Specialist",
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
      "preserves the exact bounded quotation/proposal pilot plan",
      async () => {
        const result =
          createMeeraOwnerLimitedInternalPilotExecutionDecision(
            await day95DecisionInput(),
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

          recommendationEvidenceToolMode:
            "READ_ONLY",

          quotationProposalToolMode:
            "DRAFT_ONLY",

          maximumQuotationProposalCount:
            3,

          concurrentQuotationProposalLimit:
            1,

          failureThreshold:
            1,

          ownerReviewFrequency:
            "AFTER_EVERY_QUOTATION_PROPOSAL",

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

          quotationProposalDeliveryRequiresSeparateOwnerAuthority:
            true,
        });
      },
    );

    it(
      "authorizes only future bounded pilot execution while blocking real-world authority",
      async () => {
        const result =
          createMeeraOwnerLimitedInternalPilotExecutionDecision(
            await day95DecisionInput(),
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

          syntheticQuotationProposalExecutionPerformed:
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
      "records rejection without authorizing or performing pilot execution",
      async () => {
        const result =
          createMeeraOwnerLimitedInternalPilotExecutionDecision(
            await day95DecisionInput({
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
            .syntheticQuotationProposalExecutionPerformed,
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
          await day95DecisionInput();

        expect(() =>
          createMeeraOwnerLimitedInternalPilotExecutionDecision({
            ...input,

            ownerId:
              "owner-different",
          }),
        ).toThrow(
          /only the preparation-bound owner/i,
        );

        expect(() =>
          createMeeraOwnerLimitedInternalPilotExecutionDecision({
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
          await day95DecisionInput();

        const tamperedPreparation = {
          ...input.limitedInternalPilotPreparation,

          ownerId:
            "owner-tampered",
        } as Day95Preparation;

        expect(() =>
          createMeeraOwnerLimitedInternalPilotExecutionDecision({
            ...input,

            limitedInternalPilotPreparation:
              tamperedPreparation,
          }),
        ).toThrow(
          /integrity verification failed/i,
        );

        expect(() =>
          createMeeraOwnerLimitedInternalPilotExecutionDecision({
            ...input,

            decision:
              "INVALID_EXECUTION_DECISION" as
                Day95DecisionInput["decision"],
          }),
        ).toThrow(
          /decision is invalid/i,
        );

        expect(() =>
          createMeeraOwnerLimitedInternalPilotExecutionDecision({
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
          await day95DecisionInput();

        const first =
          createMeeraOwnerLimitedInternalPilotExecutionDecision(
            input,
          );

        const second =
          createMeeraOwnerLimitedInternalPilotExecutionDecision(
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
          validateMeeraOwnerLimitedInternalPilotExecutionDecision(
            first,
          ),
        ).not.toThrow();

        const tamperedDecision = {
          ...first,

          approvedForLimitedInternalPilotExecution:
            false,
        } as MeeraOwnerLimitedInternalPilotExecutionDecision;

        expect(() =>
          validateMeeraOwnerLimitedInternalPilotExecutionDecision(
            tamperedDecision,
          ),
        ).toThrow();

        expect(() =>
          createMeeraOwnerLimitedInternalPilotExecutionDecision({
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
