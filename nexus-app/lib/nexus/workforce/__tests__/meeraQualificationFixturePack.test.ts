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
  createMeeraQualificationFixturePack,
  validateMeeraQualificationFixturePack,
  type MeeraQualificationFixturePack,
} from "../meeraQualificationFixturePack";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function createPlan() {
  const readiness =
    createMeeraQualificationReadinessAssessment({
      assessmentId:
        "meera-readiness-assessment-001",
      employeeId:
        "employee-meera-quotation-proposal-specialist-v1",
      templateId:
        "template-meera-quotation-proposal-specialist-v1",
      tenantId:
        "tenant-nexus-internal-001",
      ownerId:
        "owner-prashant-001",
      evaluatedAt:
        "2026-07-17T15:30:00.000Z",
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

  const decision =
    createMeeraOwnerQualificationReviewDecision({
      decisionId:
        "meera-owner-review-decision-001",
      readiness,
      tenantId:
        readiness.tenantId,
      ownerId:
        readiness.ownerId,
      decision:
        "APPROVE_FORMAL_QUALIFICATION_TESTING",
      rationale:
        "All qualification evidence passed and formal sandbox testing may proceed.",
      decidedAt:
        "2026-07-17T15:45:00.000Z",
    });

  const admission =
    createMeeraQualificationTestingAdmission({
      admissionId:
        "meera-testing-admission-001",
      decision,
      employeeId:
        decision.employeeId,
      templateId:
        decision.templateId,
      tenantId:
        decision.tenantId,
      ownerId:
        decision.ownerId,
      preparedAt:
        "2026-07-17T16:00:00.000Z",
    });

  return createMeeraQualificationTestPlan({
    planId:
      "meera-qualification-plan-001",
    admission,
    tenantId:
      admission.tenantId,
    ownerId:
      admission.ownerId,
    plannedAt:
      "2026-07-17T16:15:00.000Z",
  });
}

function createInput() {
  return {
    fixturePackId:
      "meera-fixture-pack-001",
    plan:
      createPlan(),
    tenantId:
      "tenant-nexus-internal-001",
    ownerId:
      "owner-prashant-001",
    preparedAt:
      "2026-07-17T16:30:00.000Z",
  };
}

describe(
  "Meera qualification fixture pack",
  () => {
    it(
      "prepares exactly twelve canonical fixtures",
      () => {
        const fixturePack =
          createMeeraQualificationFixturePack(
            createInput(),
          );

        expect(fixturePack).toMatchObject({
          fixturePackState:
            "QUALIFICATION_FIXTURE_PACK_PREPARED",
          totalFixtures:
            12,
        });

        expect(
          fixturePack.fixtures,
        ).toHaveLength(12);
      },
    );

    it(
      "preserves canonical case order",
      () => {
        const fixturePack =
          createMeeraQualificationFixturePack(
            createInput(),
          );

        expect(
          fixturePack.fixtures.map(
            (fixture) =>
              fixture.caseId,
          ),
        ).toEqual(
          MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES.map(
            (qualificationCase) =>
              qualificationCase.caseId,
          ),
        );
      },
    );

    it(
      "binds fixtures to plan and upstream evidence",
      () => {
        const input =
          createInput();

        const fixturePack =
          createMeeraQualificationFixturePack(
            input,
          );

        expect(fixturePack).toMatchObject({
          planId:
            input.plan.planId,
          planDigest:
            input.plan.planDigest,
          admissionId:
            input.plan.admissionId,
          admissionDigest:
            input.plan.admissionDigest,
          decisionId:
            input.plan.decisionId,
          readinessAssessmentId:
            input.plan.readinessAssessmentId,
        });
      },
    );

    it(
      "marks unsafe cases for owner escalation",
      () => {
        const fixturePack =
          createMeeraQualificationFixturePack(
            createInput(),
          );

        const blockedCases =
          fixturePack.fixtures
            .filter(
              (fixture) =>
                fixture.expectedControl ===
                "BLOCK_AND_ESCALATE_TO_OWNER",
            )
            .map(
              (fixture) =>
                fixture.caseId,
            );

        expect(blockedCases).toEqual([
          "meera-case-010",
          "meera-case-011",
          "meera-case-012",
        ]);
      },
    );

    it(
      "uses synthetic sandbox fixtures without external effects",
      () => {
        const fixturePack =
          createMeeraQualificationFixturePack(
            createInput(),
          );

        expect(
          fixturePack.fixtures.every(
            (fixture) =>
              fixture.executionMode ===
                "SANDBOX_ONLY" &&
              fixture.syntheticOnly ===
                true &&
              fixture.realCustomerDataIncluded ===
                false &&
              fixture.externalEffectAllowed ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not execute testing or issue qualification",
      () => {
        const fixturePack =
          createMeeraQualificationFixturePack(
            createInput(),
          );

        expect(
          fixturePack.executionBoundary,
        ).toMatchObject({
          testPlanPrepared:
            true,
          fixturePackPrepared:
            true,
          qualificationTestingExecuted:
            false,
          formalQualificationIssued:
            false,
          productionReady:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable valid evidence",
      () => {
        const first =
          createMeeraQualificationFixturePack(
            createInput(),
          );

        const second =
          createMeeraQualificationFixturePack(
            createInput(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.fixtures)).toBe(true);

        expect(
          () =>
            validateMeeraQualificationFixturePack(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "blocks cross-scope and tampered fixture packs",
      () => {
        expect(
          () =>
            createMeeraQualificationFixturePack({
              ...createInput(),
              tenantId:
                "tenant-other-001",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createMeeraQualificationFixturePack({
              ...createInput(),
              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "plan-bound owner",
        );

        const valid =
          createMeeraQualificationFixturePack(
            createInput(),
          );

        const tampered = {
          ...valid,
          totalFixtures:
            11,
        } as unknown as
          MeeraQualificationFixturePack;

        expect(
          () =>
            validateMeeraQualificationFixturePack(
              tampered,
            ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );
  },
);
