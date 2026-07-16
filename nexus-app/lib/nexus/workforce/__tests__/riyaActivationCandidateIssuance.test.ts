import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES,
} from "../riyaRecommendationSpecialistQualificationStandard";

import {
  createRiyaQualificationReadinessAssessment,
} from "../riyaQualificationReadinessAssessment";

import {
  createRiyaOwnerQualificationReviewDecision,
} from "../riyaOwnerQualificationReviewDecision";

import {
  createRiyaQualificationTestingAdmission,
} from "../riyaQualificationTestingAdmission";

import {
  createRiyaQualificationTestPlan,
} from "../riyaQualificationTestPlan";

import {
  createRiyaFormalQualificationTestPlan,
} from "../riyaFormalQualificationTestPlan";

import {
  createRiyaFormalQualificationFixturePack,
} from "../riyaFormalQualificationFixturePack";

import {
  executeRiyaFormalQualificationEvidence,
} from "../riyaFormalQualificationExecutionEvidence";

import {
  createRiyaFormalQualificationReviewDecision,
} from "../riyaFormalQualificationReviewDecision";

import {
  issueRiyaFormalQualification,
  type RiyaFormalQualificationIssuance,
} from "../riyaFormalQualificationIssuance";

import {
  createRiyaQualifiedEmployeeManifestIssuance,
  type RiyaQualifiedEmployeeManifestIssuance,
} from "../riyaQualifiedEmployeeManifestIssuance";

import {
  createRiyaActivationCandidateIssuance,
  validateRiyaActivationCandidateIssuance,
  type RiyaActivationCandidateIssuance,
} from "../riyaActivationCandidateIssuance";

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
    createRiyaQualificationReadinessAssessment({
      assessmentId:
        "riya-readiness-assessment-day-54",

      employeeId:
        "employee-riya-recommendation-specialist-v1",

      templateId:
        "template-riya-recommendation-specialist-v1",

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      evaluatedAt:
        "2026-07-16T15:00:00.000Z",

      caseEvidence:
        RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES.map(
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
    createRiyaOwnerQualificationReviewDecision({
      decisionId:
        "riya-owner-review-decision-day-54",

      readiness,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      decision:
        "APPROVE_FORMAL_QUALIFICATION_TESTING",

      rationale:
        "Controlled Riya formal qualification testing remains owner approved.",

      decidedAt:
        "2026-07-16T15:15:00.000Z",
    });

  const admission =
    createRiyaQualificationTestingAdmission({
      admissionId:
        "riya-testing-admission-day-54",

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

  return createRiyaQualificationTestPlan({
    planId:
      "riya-specialist-plan-day-54",

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
  RiyaFormalQualificationIssuance |
  null = null;

async function formalQualification() {
  if (cachedFormal !== null) {
    return cachedFormal;
  }

  const plan =
    createRiyaFormalQualificationTestPlan({
      planId:
        "riya-formal-plan-day-54",

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
    createRiyaFormalQualificationFixturePack({
      fixturePackId:
        "riya-formal-fixture-pack-day-54",

      plan,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      preparedAt:
        "2026-07-16T16:15:00.000Z",
    });

  const evidenceLedger =
    await executeRiyaFormalQualificationEvidence({
      ledgerId:
        "riya-formal-evidence-ledger-day-54",

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
    createRiyaFormalQualificationReviewDecision({
      decisionId:
        "riya-formal-review-day-54",

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
    issueRiyaFormalQualification({
      issuanceId:
        "riya-formal-qualification-issuance-day-54",

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
  RiyaQualifiedEmployeeManifestIssuance |
  null = null;

async function qualifiedManifest() {
  if (cachedManifest !== null) {
    return cachedManifest;
  }

  cachedManifest =
    createRiyaQualifiedEmployeeManifestIssuance({
      manifestIssuanceId:
        "riya-qualified-manifest-issuance-day-54",

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
      "riya-activation-candidate-issuance-day-54",

    qualifiedManifestIssuance:
      await qualifiedManifest(),

    formalQualification:
      await formalQualification(),

    runtimeId:
      "runtime-riya-paused-day-54",

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

describe(
  "Riya activation candidate issuance",
  () => {
    it(
      "prepares Riya's activation candidate with a paused runtime",
      async () => {
        const result =
          createRiyaActivationCandidateIssuance(
            await activationInput(),
          );

        expect(
          result.issuanceState,
        ).toBe(
          "ACTIVATION_CANDIDATE_PREPARED",
        );

        expect(
          result.nextStep,
        ).toBe(
          "AWAIT_OWNER_ACTIVATION",
        );

        expect(
          result.activationCandidate
            .activationEligible,
        ).toBe(true);

        expect(
          result.activationCandidate
            .ownerActivationRequired,
        ).toBe(true);

        expect(
          result.activationCandidate
            .pausedRuntime.runtimeState,
        ).toBe(
          "PAUSED_AWAITING_OWNER",
        );

        expect(
          result.activationCandidate
            .pausedRuntime.ownerActivated,
        ).toBe(false);

        expect(
          result.activationCandidate
            .pausedRuntime
            .controlledWorkAuthorized,
        ).toBe(false);
      },
    );

    it(
      "preserves employee qualification manifest registry tenant and owner bindings",
      async () => {
        const input =
          await activationInput();

        const result =
          createRiyaActivationCandidateIssuance(
            input,
          );

        expect(result).toMatchObject({
          employeeId:
            "employee-riya-recommendation-specialist-v1",

          templateId:
            "template-riya-recommendation-specialist-v1",

          employeeCode:
            "nx-sales-004",

          displayName:
            "Riya",

          officialRole:
            "AI Recommendation Specialist",

          department:
            "SALES",

          autonomyLevel:
            "DRAFTING_ASSISTANT",

          tenantId:
            TENANT_ID,

          ownerId:
            OWNER_ID,

          qualificationDigest:
            input.formalQualification
              .qualificationDigest,

          qualifiedManifestDigest:
            input
              .qualifiedManifestIssuance
              .qualifiedManifest
              .manifestDigest,

          sourceRegistryCreatedAt:
            REGISTRY_CREATED_AT,
        });
      },
    );

    it(
      "keeps real customer execution production payment and launch blocked",
      async () => {
        const result =
          createRiyaActivationCandidateIssuance(
            await activationInput(),
          );

        expect(
          result.authorityBoundary,
        ).toMatchObject({
          activationCandidateCreated:
            true,

          runtimeCreatedPaused:
            true,

          ownerActivationRecorded:
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
      "blocks cross-tenant and cross-owner activation candidate preparation",
      async () => {
        const crossTenantInput =
          await activationInput();

        expect(() =>
          createRiyaActivationCandidateIssuance({
            ...crossTenantInput,

            tenantId:
              "tenant-other-001",
          }),
        ).toThrow(
          "Cross-tenant Riya activation candidate creation is blocked.",
        );

        const crossOwnerInput =
          await activationInput();

        expect(() =>
          createRiyaActivationCandidateIssuance({
            ...crossOwnerInput,

            ownerId:
              "owner-other-001",
          }),
        ).toThrow(
          "qualified-manifest-bound owner",
        );
      },
    );

    it(
      "blocks preparation before qualified manifest issuance",
      async () => {
        const earlyInput =
          await activationInput({
            preparedAt:
              "2026-07-16T17:14:59.000Z",
          });

        expect(() =>
          createRiyaActivationCandidateIssuance(
            earlyInput,
          ),
        ).toThrow(
          "cannot precede qualified manifest issuance",
        );
      },
    );
    it(
      "rejects tampered Day 53 and Day 52 evidence",
      async () => {
        const input =
          await activationInput();

        const tamperedDay53 = {
          ...input
            .qualifiedManifestIssuance,

          manifestIssuanceId:
            "riya-qualified-manifest-tampered-day-54",
        } as
          RiyaQualifiedEmployeeManifestIssuance;

        expect(() =>
          createRiyaActivationCandidateIssuance({
            ...input,

            qualifiedManifestIssuance:
              tamperedDay53,
          }),
        ).toThrow(
          "Riya qualified employee manifest issuance integrity is invalid.",
        );

        const tamperedDay52 = {
          ...input.formalQualification,

          issuanceId:
            "riya-formal-qualification-tampered-day-54",
        } as
          RiyaFormalQualificationIssuance;

        expect(() =>
          createRiyaActivationCandidateIssuance({
            ...input,

            formalQualification:
              tamperedDay52,
          }),
        ).toThrow();
      },
    );

    it(
      "is deterministic deeply immutable and self-validating",
      async () => {
        const input =
          await activationInput();

        const first =
          createRiyaActivationCandidateIssuance(
            input,
          );

        const second =
          createRiyaActivationCandidateIssuance(
            input,
          );

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.activationCandidate,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.activationCandidate
              .pausedRuntime,
          ),
        ).toBe(true);

        expect(() =>
          validateRiyaActivationCandidateIssuance(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "RUNTIME_ACTIVATED",
        } as unknown as
          RiyaActivationCandidateIssuance;

        expect(() =>
          validateRiyaActivationCandidateIssuance(
            tampered,
          ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );

    it(
      "creates no owner activation controlled-work or external authority",
      async () => {
        const result =
          createRiyaActivationCandidateIssuance(
            await activationInput(),
          );

        expect(
          result.activationCandidate
            .safetyBoundary,
        ).toEqual({
          runtimeInitiallyPaused:
            true,

          crossTenantActivationBlocked:
            true,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          publicLaunchAuthorized:
            false,
        });

        expect(
          "ownerActivation" in result,
        ).toBe(false);

        expect(
          "activatedRuntime" in result,
        ).toBe(false);

        expect(
          result.activationCandidate
            .pausedRuntime.runtimeState,
        ).toBe(
          "PAUSED_AWAITING_OWNER",
        );
      },
    );
  },
);
