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
} from "../meeraFormalQualificationIssuance";

import {
  createMeeraQualifiedEmployeeManifestIssuance,
  validateMeeraQualifiedEmployeeManifestIssuance,
  type MeeraQualifiedEmployeeManifestIssuance,
} from "../meeraQualifiedEmployeeManifestIssuance";

import {
  createCoreLaunchEmployeeTemplateRegistry,
  findAIEmployeeTemplate,
} from "../employeeTemplateRegistry";

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
        "meera-readiness-assessment-day-53",

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
        "meera-owner-review-decision-day-53",

      readiness,

      tenantId:
        TENANT_ID,

      ownerId:
        OWNER_ID,

      decision:
        "APPROVE_FORMAL_QUALIFICATION_TESTING",

      rationale:
        "Controlled formal qualification testing remains approved for the complete Meera specialist evidence set.",

      decidedAt:
        "2026-07-16T15:15:00.000Z",
    });

  const admission =
    createMeeraQualificationTestingAdmission({
      admissionId:
        "meera-testing-admission-day-53",

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
      "meera-specialist-plan-day-53",

    admission,

    tenantId:
      TENANT_ID,

    ownerId:
      OWNER_ID,

    plannedAt:
      "2026-07-16T15:45:00.000Z",
  });
}

let cachedQualification:
  Awaited<
    ReturnType<
      typeof createFormalQualification
    >
  > |
  null = null;

async function createFormalQualification() {
  const plan =
    createMeeraFormalQualificationTestPlan({
      planId:
        "meera-formal-plan-day-53",

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
        "meera-formal-fixture-pack-day-53",

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
        "meera-formal-evidence-ledger-day-53",

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
        "meera-formal-review-day-53",

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
        "Owner reviewed the complete one-hundred-case and one-thousand-three-hundred-assertion formal evidence set.",

      reviewedAt:
        "2026-07-16T16:45:00.000Z",
    });

  return issueMeeraFormalQualification({
    issuanceId:
      "meera-formal-qualification-issuance-day-53",

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
}

async function formalQualification() {
  if (cachedQualification === null) {
    cachedQualification =
      await createFormalQualification();
  }

  return cachedQualification;
}

async function issuance(
  overrides: Readonly<{
    tenantId?: string;
    ownerId?: string;
    registryCreatedAt?: string;
    createdAt?: string;
  }> = {},
) {
  return createMeeraQualifiedEmployeeManifestIssuance({
    manifestIssuanceId:
      "meera-qualified-manifest-issuance-day-53",

    formalQualification:
      await formalQualification(),

    tenantId:
      overrides.tenantId ??
      TENANT_ID,

    ownerId:
      overrides.ownerId ??
      OWNER_ID,

    registryCreatedAt:
      overrides.registryCreatedAt ??
      REGISTRY_CREATED_AT,

    createdAt:
      overrides.createdAt ??
      "2026-07-16T17:15:00.000Z",
  });
}

describe(
  "Meera qualified employee manifest issuance",
  () => {
    it(
      "creates Meera's qualified employee manifest from Day 52 formal qualification",
      async () => {
        const result =
          await issuance();

        expect(
          result.issuanceState,
        ).toBe(
          "QUALIFIED_EMPLOYEE_MANIFEST_CREATED",
        );

        expect(
          result.qualifiedManifest
            .evaluation.status,
        ).toBe("QUALIFIED");

        expect(
          result.qualifiedManifest
            .evaluation.testCasesPassed,
        ).toBe(100);

        expect(
          result.qualifiedManifest
            .evaluation.testCasesRequired,
        ).toBe(100);
      },
    );

    it(
      "preserves Meera's registered identity role skills tools and approval policy",
      async () => {
        const registry =
          createCoreLaunchEmployeeTemplateRegistry(
            REGISTRY_CREATED_AT,
          );

        const template =
          findAIEmployeeTemplate(
            registry,
            "template-meera-quotation-proposal-specialist-v1",
          );

        if (template === undefined) {
          throw new Error(
            "Canonical Meera template fixture is missing.",
          );
        }

        const result =
          await issuance();

        expect(result.employeeCode).toBe(
          "nx-sales-005",
        );

        expect(result.displayName).toBe(
          "Meera",
        );

        expect(result.officialRole).toBe(
          "AI Quotation & Proposal Specialist",
        );

        expect(result.department).toBe(
          "SALES",
        );

        expect(result.autonomyLevel).toBe(
          "DRAFTING_ASSISTANT",
        );

        expect(
          result.qualifiedManifest.skills,
        ).toEqual(
          template.manifest.skills,
        );

        expect(
          result.qualifiedManifest
            .toolGrants,
        ).toEqual(
          template.manifest.toolGrants,
        );

        expect(
          result.qualifiedManifest
            .approvalPolicy,
        ).toEqual(
          template.manifest
            .approvalPolicy,
        );
      },
    );

    it(
      "records exact formal qualification and registry bindings",
      async () => {
        const qualification =
          await formalQualification();

        const result =
          await issuance();

        expect(
          result
            .formalQualificationIssuanceId,
        ).toBe(
          qualification.issuanceId,
        );

        expect(
          result
            .formalQualificationIssuanceDigest,
        ).toBe(
          qualification.issuanceDigest,
        );

        expect(
          result.qualificationDigest,
        ).toBe(
          qualification
            .qualificationDigest,
        );

        expect(
          result.templateDigest,
        ).toBe(
          qualification
            .qualificationReport
            .templateDigest,
        );

        expect(
          result.sourceRegistryCreatedAt,
        ).toBe(
          REGISTRY_CREATED_AT,
        );
      },
    );

    it(
      "blocks cross-tenant and cross-owner manifest creation",
      async () => {
        await expect(
          issuance({
            tenantId:
              "tenant-other-001",
          }),
        ).rejects.toThrow(
          "Cross-tenant",
        );

        await expect(
          issuance({
            ownerId:
              "owner-other-001",
          }),
        ).rejects.toThrow(
          "qualification-bound owner",
        );
      },
    );

    it(
      "blocks a registry-time mismatch and creation before formal qualification",
      async () => {
        await expect(
          issuance({
            registryCreatedAt:
              "2026-07-16T14:00:01.000Z",
          }),
        ).rejects.toThrow(
          "evidence-bound registry creation time",
        );

        await expect(
          issuance({
            createdAt:
              "2026-07-16T16:59:59.000Z",
          }),
        ).rejects.toThrow(
          "cannot precede formal qualification",
        );
      },
    );

    it(
      "blocks tampered Day 52 formal qualification evidence",
      async () => {
        const qualification =
          await formalQualification();

        expect(() =>
          createMeeraQualifiedEmployeeManifestIssuance({
            manifestIssuanceId:
              "meera-qualified-manifest-tampered-day-53",

            formalQualification: {
              ...qualification,

              qualificationDigest:
                digest(
                  "tampered-day-52-qualification",
                ),
            },

            tenantId:
              TENANT_ID,

            ownerId:
              OWNER_ID,

            registryCreatedAt:
              REGISTRY_CREATED_AT,

            createdAt:
              "2026-07-16T17:15:00.000Z",
          }),
        ).toThrow();
      },
    );

    it(
      "is deterministic immutable and self-validating",
      async () => {
        const first =
          await issuance();

        const second =
          await issuance();

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.qualifiedManifest,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateMeeraQualifiedEmployeeManifestIssuance(
            first,
          ),
        ).not.toThrow();

        const tampered = {
          ...first,

          issuanceState:
            "RUNTIME_ACTIVATED",
        } as unknown as
          MeeraQualifiedEmployeeManifestIssuance;

        expect(() =>
          validateMeeraQualifiedEmployeeManifestIssuance(
            tampered,
          ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );

    it(
      "creates no activation runtime production or external authority",
      async () => {
        const result =
          await issuance();

        expect(
          result.qualifiedManifest
            .safetyBoundary,
        ).toEqual({
          ownerControlled:
            true,

          emergencyPauseRequired:
            true,

          crossTenantAccessAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          publicLaunchAuthorized:
            false,
        });

        expect(
          result.authorityBoundary,
        ).toMatchObject({
          qualifiedManifestCreated:
            true,

          activationCandidateCreated:
            false,

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

        expect(
          "activationCandidate" in result,
        ).toBe(false);

        expect(
          "runtime" in result,
        ).toBe(false);
      },
    );
  },
);
