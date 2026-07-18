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

describe(
  "Meera controlled shadow operation preparation",
  () => {
    it(
      "prepares one controlled shadow quotation or proposal operation without executing it",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const preparation =
          createShadowPreparation(
            source,
          );

        expect(
          preparation.preparationState,
        ).toBe(
          "CONTROLLED_SHADOW_OPERATION_PREPARED",
        );

        expect(
          preparation.nextStep,
        ).toBe(
          "EXECUTE_CONTROLLED_SHADOW_OPERATION",
        );

        expect(
          preparation.authorityBoundary
            .shadowExecutionEligible,
        ).toBe(true);

        expect(
          preparation.authorityBoundary
            .shadowExecutionExecuted,
        ).toBe(false);

        expect(
          preparation.authorityBoundary
            .quotationProposalDraftCreated,
        ).toBe(false);
      },
    );

    it(
      "locks the fixture to one synthetic sanitized draft-only sandbox recommendation",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        expect(
          createShadowPreparation(
            source,
          ).shadowFixture,
        ).toEqual({
          fixtureId:
            "fixture-meera-controlled-shadow-quotation-proposal-v1",

          scenarioId:
            "scenario-meera-controlled-shadow-quotation-proposal-001",

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

          quotationProposalDraftToolId:
            "tool-quotation-proposal-draft",

          quotationProposalDraftToolMode:
            "DRAFT_ONLY",

          maximumQuotationProposalCount:
            1,

          executionMode:
            "SANDBOX_ONLY",

          ownerReviewRequired:
            true,
        });
      },
    );

    it(
      "preserves runtime issuance manifest registry tenant owner and employee bindings",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const preparation =
          createShadowPreparation(
            source,
          );

        expect(preparation).toMatchObject({
          employeeId:
            "employee-meera-quotation-proposal-specialist-v1",

          templateId:
            "template-meera-quotation-proposal-specialist-v1",

          employeeCode:
            "nx-sales-005",

          displayName:
            "Meera",

          officialRole:
            "AI Quotation & Proposal Specialist",

          runtimeIssuanceId:
            source.runtimeIssuanceId,

          runtimeIssuanceDigest:
            source.runtimeIssuanceDigest,

          runtimeId:
            source.runtimeId,

          runtimeDigest:
            source.ownerActivatedRuntime
              .runtimeDigest,

          qualifiedManifestDigest:
            source.qualifiedManifestDigest,

          sourceRegistryCreatedAt:
            source.sourceRegistryCreatedAt,

          tenantId:
            source.tenantId,

          ownerId:
            source.ownerId,
        });
      },
    );

    it(
      "keeps real customer external production payment autonomous and launch authority blocked",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const boundary =
          createShadowPreparation(
            source,
          ).authorityBoundary;

        expect(boundary).toMatchObject({
          ownerActivatedRuntimeIssuanceBound:
            true,

          ownerActivationBound:
            true,

          qualifiedManifestBound:
            true,

          registryCreationTimeBound:
            true,

          runtimeIdentityBound:
            true,

          tenantIdentityBound:
            true,

          ownerIdentityBound:
            true,

          approvalBypassAllowed:
            false,

          runtimeReadyForControlledWork:
            true,

          shadowExecutionEligible:
            true,

          shadowExecutionExecuted:
            false,

          syntheticInquiryEvidencePrepared:
            true,

          syntheticRecommendationEvidenceOnly:
            true,

          quotationProposalDraftCreated:
            false,

          ownerReviewRequired:
            true,

          emergencyPauseAvailable:
            true,

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
      "blocks controlled shadow preparation before runtime activation",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        expect(() =>
          createShadowPreparation(
            source,
            {
              preparedAt:
                "2026-07-16T17:59:59.999Z",
            },
          ),
        ).toThrow(
          "cannot precede runtime activation",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 56 runtime issuance evidence",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const tampered = {
          ...source,

          ownerId:
            "owner-other-day-57",
        } as
          MeeraOwnerActivatedRuntimeIssuance;

        expect(() =>
          createShadowPreparation(
            tampered,
          ),
        ).toThrow(
          "runtime issuance",
        );
      },
    );

    it(
      "rejects a runtime that no longer matches its tenant binding",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const tamperedRuntime = {
          ...source.ownerActivatedRuntime,

          tenantId:
            "tenant-other-day-57",
        };

        const tampered = {
          ...source,

          ownerActivatedRuntime:
            tamperedRuntime,
        } as
          MeeraOwnerActivatedRuntimeIssuance;

        expect(() =>
          createShadowPreparation(
            tampered,
          ),
        ).toThrow();
      },
    );

    it(
      "is deterministic deeply immutable self-validating and rejects secret-bearing identifiers",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const first =
          createShadowPreparation(
            source,
          );

        const second =
          createShadowPreparation(
            source,
          );

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.shadowFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(
          Reflect.set(
            first.shadowFixture,
            "maximumQuotationProposalCount",
            2,
          ),
        ).toBe(false);

        expect(() =>
          validateMeeraControlledShadowOperationPreparation(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "REAL_CUSTOMER_RECOMMENDATION",
        } as unknown as
          MeeraControlledShadowOperationPreparation;

        expect(() =>
          validateMeeraControlledShadowOperationPreparation(
            tampered,
          ),
        ).toThrow(
          "preparation identity is invalid",
        );

        expect(() =>
          createShadowPreparation(
            source,
            {
              preparationId:
                "meera-secret-token-day-57",
            },
          ),
        ).toThrow(
          "preparationId is invalid",
        );
      },
    );
  },
);
