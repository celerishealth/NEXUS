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
      "Owner reviewed Meera's synthetic quotation and proposal draft evidence and approved limited internal pilot preparation only.",

    decidedAt:
      "2026-07-16T18:45:00.000Z",

    ...overrides,
  };
}

describe(
  "Meera owner controlled shadow operation review decision",
  () => {
    it(
      "records owner approval for limited internal pilot preparation only",
      async () => {
        const decision =
          createMeeraOwnerControlledShadowOperationReviewDecision(
            await day93ReviewInput(),
          );

        expect(
          decision.version,
        ).toBe(
          "nexus-meera-owner-controlled-shadow-operation-review-decision-v1",
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
          createMeeraOwnerControlledShadowOperationReviewDecision(
            await day93ReviewInput({
              decision:
                "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION",

              reason:
                "Owner rejected pilot preparation and retained Meera within the controlled shadow boundary.",
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
          await day93ReviewInput();

        const source =
          input
            .controlledShadowOperationExecution;

        const decision =
          createMeeraOwnerControlledShadowOperationReviewDecision(
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
      "records exact reviewed quotation and proposal evidence and blocks every execution authority",
      async () => {
        const decision =
          createMeeraOwnerControlledShadowOperationReviewDecision(
            await day93ReviewInput(),
          );

        expect(
          decision.reviewedEvidence,
        ).toEqual({
          inquiryEvidenceId:
            "synthetic-meera-inquiry-evidence-001",

          recommendationEvidenceId:
            "synthetic-meera-recommendation-evidence-001",

          quotationProposalId:
            "synthetic-meera-quotation-proposal-draft-001",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          inquiryEvidenceToolId:
            "tool-inquiry-read",

          inquiryEvidenceToolMode:
            "READ_ONLY",

          recommendationEvidenceToolId:
            "tool-recommendation-read",

          recommendationEvidenceToolMode:
            "READ_ONLY",

          quotationProposalToolId:
            "tool-quotation-proposal-draft",

          quotationProposalToolMode:
            "DRAFT_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          maximumQuotationProposalCount:
            1,

          actualQuotationProposalCount:
            1,

          quotationProposalStatus:
            "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          commercialRiskLevel:
            "MEDIUM",

          verifiedFactCount:
            3,

          missingEvidenceCount:
            3,

          commercialAssumptionCount:
            3,

          scopeExclusionCount:
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

          maximumOneQuotationProposalVerified:
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

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "blocks a cross-owner controlled shadow review decision",
      async () => {
        const input =
          await day93ReviewInput({
            ownerId:
              "owner-cross-tenant-day-59",
          });

        expect(() =>
          createMeeraOwnerControlledShadowOperationReviewDecision(
            input,
          ),
        ).toThrow(
          "Only the Meera controlled-shadow-bound owner can issue the review decision.",
        );
      },
    );

    it(
      "blocks a review decision before the controlled shadow execution time",
      async () => {
        const input =
          await day93ReviewInput({
            decidedAt:
              "2026-07-16T18:29:59.999Z",
          });

        expect(() =>
          createMeeraOwnerControlledShadowOperationReviewDecision(
            input,
          ),
        ).toThrow(
          "Meera owner controlled-shadow review decision cannot precede shadow execution.",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 92 controlled shadow execution evidence",
      async () => {
        const input =
          await day93ReviewInput();

        const tampered = {
          ...input
            .controlledShadowOperationExecution,

          nextStep:
            "DELIVER_TO_CUSTOMER",
        } as unknown as
          MeeraControlledShadowOperationExecution;

        expect(() =>
          createMeeraOwnerControlledShadowOperationReviewDecision({
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
          await day93ReviewInput();

        const first =
          createMeeraOwnerControlledShadowOperationReviewDecision(
            input,
          );

        const second =
          createMeeraOwnerControlledShadowOperationReviewDecision(
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
          validateMeeraOwnerControlledShadowOperationReviewDecision(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "DELIVER_TO_CUSTOMER",
        } as unknown as
          MeeraOwnerControlledShadowOperationReviewDecision;

        expect(() =>
          validateMeeraOwnerControlledShadowOperationReviewDecision(
            tampered,
          ),
        ).toThrow(
          "decision identity is invalid",
        );

        expect(() =>
          createMeeraOwnerControlledShadowOperationReviewDecision({
            ...input,

            decisionId:
              "token-meera-shadow-review-day-93",
          }),
        ).toThrow(
          "Meera controlled-shadow review decisionId is invalid.",
        );

        expect(() =>
          createMeeraOwnerControlledShadowOperationReviewDecision({
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
