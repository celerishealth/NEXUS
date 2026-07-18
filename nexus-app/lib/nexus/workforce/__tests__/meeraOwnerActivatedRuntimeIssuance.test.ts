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

describe(
  "Meera owner-activated runtime issuance",
  () => {
    it(
      "issues the owner-activated runtime after explicit approval",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const issuance =
          createRuntimeIssuance(
            source,
          );

        expect(
          issuance.issuanceState,
        ).toBe(
          "OWNER_ACTIVATED_RUNTIME_ISSUED",
        );

        expect(
          issuance.ownerActivatedRuntime
            .ownerActivated,
        ).toBe(true);

        expect(
          issuance.ownerActivatedRuntime
            .runtimeState,
        ).toBe(
          "READY_FOR_CONTROLLED_WORK",
        );

        expect(
          issuance.ownerActivatedRuntime
            .controlledWorkAuthorized,
        ).toBe(true);

        expect(
          issuance.nextStep,
        ).toBe(
          "PREPARE_CONTROLLED_SHADOW_OPERATION",
        );
      },
    );

    it(
      "rejects a rejected owner activation decision",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const rejection =
          createOwnerDecision(
            source,
            "REJECT_MEERA_ACTIVATION",
          );

        expect(() =>
          createRuntimeIssuance(
            source,
            rejection,
          ),
        ).toThrow(
          "requires an explicit approved owner decision",
        );
      },
    );

    it(
      "preserves identity tenant owner qualification manifest registry and runtime bindings",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const decision =
          createOwnerDecision(
            source,
            "APPROVE_MEERA_ACTIVATION",
          );

        const issuance =
          createRuntimeIssuance(
            source,
            decision,
          );

        expect(issuance).toMatchObject({
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

          department:
            "SALES",

          autonomyLevel:
            "DRAFTING_ASSISTANT",

          runtimeId:
            source.runtimeId,

          tenantId:
            TENANT_ID,

          ownerId:
            OWNER_ID,

          activationCandidateIssuanceId:
            source.activationCandidateIssuanceId,

          activationCandidateIssuanceDigest:
            source.activationCandidateIssuanceDigest,

          ownerActivationDecisionId:
            decision.decisionId,

          ownerActivationDecisionDigest:
            decision.decisionDigest,

          qualificationDigest:
            source.qualificationDigest,

          qualifiedManifestDigest:
            source.qualifiedManifestDigest,

          sourceRegistryCreatedAt:
            REGISTRY_CREATED_AT,

          pausedRuntimeDigest:
            source.activationCandidate
              .pausedRuntime.runtimeDigest,
        });

        expect(
          issuance.ownerActivatedRuntime
            .runtimeDigest,
        ).not.toBe(
          issuance.pausedRuntimeDigest,
        );
      },
    );

    it(
      "keeps real customer external production payment autonomous and launch authority blocked",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const issuance =
          createRuntimeIssuance(
            source,
          );

        expect(
          issuance.authorityBoundary,
        ).toMatchObject({
          activationCandidateIssuanceBound:
            true,

          ownerActivationDecisionBound:
            true,

          ownerIdentityBound:
            true,

          qualificationBound:
            true,

          qualifiedManifestBound:
            true,

          registryCreationTimeBound:
            true,

          runtimeIdentityPreserved:
            true,

          approvalBypassAllowed:
            false,

          runtimeActivationExecuted:
            true,

          runtimeActivated:
            true,

          controlledWorkAuthorized:
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

        expect(
          issuance.ownerActivatedRuntime
            .safetyBoundary,
        ).toEqual({
          emergencyPauseAvailable:
            true,

          liveProviderExecutionAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "blocks a valid decision bound to a different activation candidate",
      async () => {
        const firstSource =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const secondInput =
          await activationInput();

        const secondSource =
          createMeeraActivationCandidateIssuance({
            ...secondInput,

            activationCandidateIssuanceId:
              "meera-activation-candidate-issuance-day-56-other",

            runtimeId:
              "runtime-meera-day-56-other",

            preparedAt:
              "2026-07-16T17:31:00.000Z",
          });

        const firstDecision =
          createOwnerDecision(
            firstSource,
            "APPROVE_MEERA_ACTIVATION",
          );

        expect(() =>
          createRuntimeIssuance(
            secondSource,
            firstDecision,
          ),
        ).toThrow(
          "does not match the activation candidate",
        );
      },
    );

    it(
      "blocks runtime activation before the owner decision",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const decision =
          createOwnerDecision(
            source,
            "APPROVE_MEERA_ACTIVATION",
          );

        expect(() =>
          createRuntimeIssuance(
            source,
            decision,
            "2026-07-16T17:44:59.000Z",
          ),
        ).toThrow(
          "cannot precede the owner activation decision",
        );
      },
    );

    it(
      "is deterministic deeply immutable self-validating and produces a new runtime digest",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const decision =
          createOwnerDecision(
            source,
            "APPROVE_MEERA_ACTIVATION",
          );

        const first =
          createRuntimeIssuance(
            source,
            decision,
          );

        const second =
          createRuntimeIssuance(
            source,
            decision,
          );

        expect(first).toEqual(second);

        expect(
          first.ownerActivatedRuntime
            .runtimeDigest,
        ).not.toBe(
          source.activationCandidate
            .pausedRuntime.runtimeDigest,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.ownerActivatedRuntime,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateMeeraOwnerActivatedRuntimeIssuance(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "REAL_CUSTOMER_EXECUTION",
        } as unknown as
          MeeraOwnerActivatedRuntimeIssuance;

        expect(() =>
          validateMeeraOwnerActivatedRuntimeIssuance(
            tampered,
          ),
        ).toThrow(
          "issuance identity is invalid",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 55 owner decision evidence",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const decision =
          createOwnerDecision(
            source,
            "APPROVE_MEERA_ACTIVATION",
          );

        const tampered = {
          ...decision,

          ownerActivationApproved:
            false,
        } as
          MeeraOwnerActivationDecision;

        expect(() =>
          createRuntimeIssuance(
            source,
            tampered,
          ),
        ).toThrow(
          "decision state is invalid",
        );
      },
    );
  },
);
