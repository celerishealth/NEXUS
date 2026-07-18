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

describe(
  "Meera controlled shadow operation execution",
  () => {
    it(
      "executes exactly one synthetic quotation or proposal draft and awaits owner review",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const execution =
          await executeShadowOperation(
            source,
          );

        expect(
          execution.executionState,
        ).toBe(
          "CONTROLLED_SHADOW_OPERATION_EXECUTED",
        );

        expect(
          execution.quotationProposalDraft
            .quotationProposalStatus,
        ).toBe(
          "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW",
        );

        expect(
          execution.executionBoundary
            .quotationProposalCreatorInvocationCount,
        ).toBe(1);

        expect(
          execution.nextStep,
        ).toBe(
          "AWAIT_OWNER_SHADOW_OPERATION_REVIEW",
        );
      },
    );

    it(
      "creates evidence-grounded risk-aware owner-ready synthetic draft evidence",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const execution =
          await executeShadowOperation(
            source,
          );

        expect(
          execution.syntheticInquiryEvidence,
        ).toMatchObject({
          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          unsupportedFactsInvented:
            false,
        });

        expect(
          execution.syntheticInquiryEvidence
            .verifiedFacts,
        ).toHaveLength(3);

        expect(
          execution.syntheticInquiryEvidence
            .missingEvidence,
        ).toHaveLength(3);

        expect(
          execution.syntheticRecommendationEvidence,
        ).toMatchObject({
          ownerApprovedRecommendationOnly:
            true,

          crossCustomerEvidenceUsed:
            false,

          crossTenantContextUsed:
            false,
        });

        expect(
          execution.quotationProposalDraft,
        ).toMatchObject({
          toolId:
            "tool-quotation-proposal-draft",

          toolMode:
            "DRAFT_ONLY",

          commercialRiskLevel:
            "MEDIUM",

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

        expect(
          execution.quotationProposalDraft
            .commercialAssumptions,
        ).toHaveLength(3);

        expect(
          execution.quotationProposalDraft
            .scopeAndExclusions,
        ).toHaveLength(3);
      },
    );

    it(
      "preserves preparation runtime manifest registry tenant owner and employee bindings",
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

        const execution =
          await executeShadowOperation(
            source,
            preparation,
          );

        expect(execution).toMatchObject({
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

          preparationId:
            preparation.preparationId,

          preparationDigest:
            preparation.preparationDigest,

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
      "keeps owner decision customer delivery external production payment autonomous and launch authority blocked",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        const boundary =
          (
            await executeShadowOperation(
              source,
            )
          ).executionBoundary;

        expect(boundary).toMatchObject({
          preparationBound:
            true,

          ownerActivatedRuntimeIssuanceBound:
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

          maximumQuotationProposalCountEnforced:
            true,

          quotationProposalCreatorInvocationCount:
            1,

          shadowExecutionExecuted:
            true,

          syntheticInquiryEvidenceRead:
            true,

          syntheticRecommendationEvidenceRead:
            true,

          quotationProposalDraftCreated:
            true,

          ownerDecisionMade:
            false,

          ownerReviewRequired:
            true,

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

          emergencyPauseAvailable:
            true,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "blocks controlled shadow execution before preparation",
      async () => {
        const source =
          createRuntimeIssuance(
            createMeeraActivationCandidateIssuance(
              await activationInput(),
            ),
          );

        await expect(
          executeShadowOperation(
            source,
            createShadowPreparation(
              source,
            ),
            {
              executedAt:
                "2026-07-16T18:14:59.999Z",
            },
          ),
        ).rejects.toThrow(
          "cannot precede preparation",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 57 preparation evidence",
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

        const tampered = {
          ...preparation,

          tenantId:
            "tenant-other-day-58",
        } as
          MeeraControlledShadowOperationPreparation;

        await expect(
          executeShadowOperation(
            source,
            tampered,
          ),
        ).rejects.toThrow(
          "preparation",
        );
      },
    );

    it(
      "rejects an unbound qualified manifest",
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

        const manifest = {
          ...(await qualifiedManifest()).qualifiedManifest,

          manifestDigest:
            digest(
              "different-meera-manifest-day-58",
            ),
        };

        await expect(
          executeMeeraControlledShadowOperation({
            executionId:
              "meera-controlled-shadow-execution-day-58",

            preparation,

            ownerActivatedRuntimeIssuance:
              source,

            qualifiedManifest:
              manifest,

            executedAt:
              "2026-07-16T18:30:00.000Z",
          }),
        ).rejects.toThrow(
          "Qualified Meera manifest is not bound",
        );
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
          await executeShadowOperation(
            source,
          );

        const second =
          await executeShadowOperation(
            source,
          );

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.syntheticInquiryEvidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.syntheticRecommendationEvidence,
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

        expect(
          Reflect.set(
            first.quotationProposalDraft,
            "ownerDecisionMade",
            true,
          ),
        ).toBe(false);

        expect(() =>
          validateMeeraControlledShadowOperationExecution(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "DELIVER_TO_CUSTOMER",
        } as unknown as
          MeeraControlledShadowOperationExecution;

        expect(() =>
          validateMeeraControlledShadowOperationExecution(
            tampered,
          ),
        ).toThrow(
          "execution identity is invalid",
        );

        await expect(
          executeShadowOperation(
            source,
            createShadowPreparation(
              source,
            ),
            {
              executionId:
                "meera-secret-token-day-58",
            },
          ),
        ).rejects.toThrow(
          "executionId is invalid",
        );
      },
    );
  },
);
