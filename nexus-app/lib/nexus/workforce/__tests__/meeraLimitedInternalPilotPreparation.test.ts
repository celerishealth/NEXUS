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
type Day59ReviewInput =
  Parameters<
    typeof createMeeraOwnerControlledShadowOperationReviewDecision
  >[0];

async function day93ReviewInput(
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

describe(
  "Meera limited internal pilot preparation",
  () => {
    it(
      "prepares a bounded three-quotation/proposal synthetic internal pilot",
      async () => {
        const preparation =
          createMeeraLimitedInternalPilotPreparation(
            await day94PreparationInput(),
          );

        expect(
          preparation.version,
        ).toBe(
          "nexus-meera-limited-internal-pilot-preparation-v1",
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
        });

        expect(
          preparation.pilotPlan.scenarios,
        ).toEqual([
          "AUTHORIZED_INQUIRY_AND_RECOMMENDATION_EVIDENCE",
          "MISSING_COMMERCIAL_EVIDENCE",
          "CONFLICTING_COMMERCIAL_OPTIONS",
        ]);

        expect(
          preparation.nextStep,
        ).toBe(
          "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION",
        );
      },
    );

    it(
      "locks Meera specialist quality standards for every pilot quotation/proposal",
      async () => {
        const preparation =
          createMeeraLimitedInternalPilotPreparation(
            await day94PreparationInput(),
          );

        expect(
          preparation.specialistStandard,
        ).toEqual({
          aiIdentityTransparent:
            true,

          evidenceGroundingRequired:
            true,

          verifiedFactsSeparatedFromCommercialAssumptions:
            true,

          missingCommercialEvidenceIdentified:
            true,

          clarificationBeforeGuessingRequired:
            true,

          commercialRiskLevelRequired:
            true,

          scopeAndExclusionsRequired:
            true,

          conflictingCommercialOptionsWithoutCommitmentRequired:
            true,

          ownerReadyCommercialBriefRequired:
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

          quotationProposalDeliveryRequiresSeparateOwnerAuthority:
            true,
        });
      },
    );

    it(
      "binds preparation to exact Day 93 owner review execution tenant and owner evidence",
      async () => {
        const source =
          await approvedDay93ReviewDecision();

        const preparation =
          createMeeraLimitedInternalPilotPreparation({
            preparationId:
              "meera-limited-internal-pilot-preparation-day-94",

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
          createMeeraLimitedInternalPilotPreparation(
            await day94PreparationInput(),
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

          syntheticQuotationProposalExecutionAuthorized:
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
      "rejects a Day 93 owner decision that did not approve pilot preparation",
      async () => {
        const rejected =
          createMeeraOwnerControlledShadowOperationReviewDecision(
            await day93ReviewInput({
              decision:
                "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION",

              reason:
                "Owner rejected Meera pilot preparation and retained the controlled shadow boundary.",
            }),
          );

        expect(() =>
          createMeeraLimitedInternalPilotPreparation({
            preparationId:
              "meera-limited-internal-pilot-preparation-day-94",

            ownerControlledShadowOperationReviewDecision:
              rejected,

            preparedAt:
              "2026-07-16T19:00:00.000Z",
          }),
        ).toThrow(
          "requires explicit Meera owner approval",
        );
      },
    );

    it(
      "rejects tampered Day 93 owner review evidence",
      async () => {
        const source =
          await approvedDay93ReviewDecision();

        const tampered = {
          ...source,

          ownerId:
            "owner-tampered-day-94",
        } as MeeraOwnerControlledShadowOperationReviewDecision;

        expect(() =>
          createMeeraLimitedInternalPilotPreparation({
            preparationId:
              "meera-limited-internal-pilot-preparation-day-94",

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
          await approvedDay93ReviewDecision();

        expect(() =>
          createMeeraLimitedInternalPilotPreparation({
            preparationId:
              "meera-limited-internal-pilot-preparation-day-94",

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
          await day94PreparationInput();

        const first =
          createMeeraLimitedInternalPilotPreparation(
            input,
          );

        const second =
          createMeeraLimitedInternalPilotPreparation(
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
          validateMeeraLimitedInternalPilotPreparation(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "EXECUTE_LIMITED_INTERNAL_PILOT",
        } as unknown as
          MeeraLimitedInternalPilotPreparation;

        expect(() =>
          validateMeeraLimitedInternalPilotPreparation(
            tampered,
          ),
        ).toThrow(
          "preparation identity is invalid",
        );

        expect(() =>
          createMeeraLimitedInternalPilotPreparation({
            ...input,

            preparationId:
              "token-meera-pilot-preparation-day-94",
          }),
        ).toThrow(
          "Meera limited internal pilot preparationId is invalid.",
        );
      },
    );
  },
);
