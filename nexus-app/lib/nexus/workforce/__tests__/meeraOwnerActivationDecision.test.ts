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

describe(
  "Meera owner activation decision",
  () => {
    it(
      "records explicit owner approval without activating the runtime",
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

        expect(
          decision.ownerActivationApproved,
        ).toBe(true);

        expect(
          decision.runtimeActivationEligible,
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_OWNER_ACTIVATED_RUNTIME",
        );

        expect(
          decision.authorityBoundary
            .runtimeActivationExecuted,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .runtimeActivated,
        ).toBe(false);
      },
    );

    it(
      "records rejection and retains the paused runtime",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const decision =
          createOwnerDecision(
            source,
            "REJECT_MEERA_ACTIVATION",
          );

        expect(
          decision.ownerActivationApproved,
        ).toBe(false);

        expect(
          decision.runtimeActivationEligible,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_PAUSED_RUNTIME",
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

        expect(decision).toMatchObject({
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

          sourceRegistryCreatedAt:
            REGISTRY_CREATED_AT,

          qualificationDigest:
            source.qualificationDigest,

          qualifiedManifestDigest:
            source.qualifiedManifestDigest,

          activationCandidateIssuanceDigest:
            source
              .activationCandidateIssuanceDigest,

          pausedRuntimeDigest:
            source.activationCandidate
              .pausedRuntime.runtimeDigest,
        });
      },
    );

    it(
      "keeps runtime controlled work customer production payment and launch authority blocked",
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

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          ownerDecisionRequired:
            true,

          ownerIdentityBound:
            true,

          activationCandidateIssuanceBound:
            true,

          qualificationBound:
            true,

          registryCreationTimeBound:
            true,

          approvalBypassAllowed:
            false,

          activationCandidateCreated:
            true,

          ownerActivationDecisionRecorded:
            true,

          runtimeActivationExecuted:
            false,

          runtimeActivated:
            false,

          controlledWorkAuthorized:
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
        });
      },
    );

    it(
      "blocks an owner not bound to the activation candidate",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        expect(() =>
          createOwnerDecision(
            source,
            "APPROVE_MEERA_ACTIVATION",
            {
              ownerId:
                "owner-other-001",
            },
          ),
        ).toThrow(
          "activation-candidate-bound owner",
        );
      },
    );

    it(
      "blocks a decision that precedes candidate preparation",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        expect(() =>
          createOwnerDecision(
            source,
            "APPROVE_MEERA_ACTIVATION",
            {
              decidedAt:
                "2026-07-16T17:29:59.000Z",
            },
          ),
        ).toThrow(
          "cannot precede activation candidate preparation",
        );
      },
    );

    it(
      "is deterministic deeply immutable normalizes reason and self-validates",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const reason =
          "  Owner approved the controlled Meera activation candidate.  ";

        const first =
          createOwnerDecision(
            source,
            "APPROVE_MEERA_ACTIVATION",
            {
              reason,
            },
          );

        const second =
          createOwnerDecision(
            source,
            "APPROVE_MEERA_ACTIVATION",
            {
              reason,
            },
          );

        expect(first).toEqual(second);

        expect(first.reason).toBe(
          reason.trim(),
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateMeeraOwnerActivationDecision(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "RUNTIME_ACTIVATED",
        } as unknown as
          MeeraOwnerActivationDecision;

        expect(() =>
          validateMeeraOwnerActivationDecision(
            tampered,
          ),
        ).toThrow(
          "decision state is invalid",
        );
      },
    );

    it(
      "rejects tampered Workforce Day 54 activation candidate evidence",
      async () => {
        const source =
          createMeeraActivationCandidateIssuance(
            await activationInput(),
          );

        const tampered = {
          ...source,

          runtimeId:
            "runtime-meera-tampered-day-55",
        } as
          MeeraActivationCandidateIssuance;

        expect(() =>
          createOwnerDecision(
            tampered,
            "APPROVE_MEERA_ACTIVATION",
          ),
        ).toThrow(
          "Meera activation candidate record is invalid.",
        );
      },
    );
  },
);
