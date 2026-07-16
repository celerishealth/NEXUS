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
  validateRiyaQualificationTestingAdmission,
} from "../riyaQualificationTestingAdmission";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function createDecision(
  approved = true,
) {
  const readiness =
    createRiyaQualificationReadinessAssessment({
      assessmentId:
        "riya-readiness-assessment-001",
      employeeId:
        "employee-riya-recommendation-specialist-v1",
      templateId:
        "template-riya-recommendation-specialist-v1",
      tenantId:
        "tenant-nexus-internal-001",
      ownerId:
        "owner-prashant-001",
      evaluatedAt:
        "2026-07-16T15:00:00.000Z",
      caseEvidence:
        RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES.map(
          (qualificationCase, index) => ({
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

  return createRiyaOwnerQualificationReviewDecision({
    decisionId:
      "riya-owner-review-decision-001",
    readiness,
    tenantId:
      readiness.tenantId,
    ownerId:
      readiness.ownerId,
    decision:
      approved
        ? "APPROVE_FORMAL_QUALIFICATION_TESTING"
        : "REJECT_FORMAL_QUALIFICATION_TESTING",
    rationale:
      approved
        ? "All qualification evidence passed and formal sandbox testing may proceed."
        : "Qualification evidence requires further controlled review before testing.",
    decidedAt:
      "2026-07-16T15:15:00.000Z",
  });
}

function createInput() {
  return {
    admissionId:
      "riya-testing-admission-001",
    decision:
      createDecision(),
    employeeId:
      "employee-riya-recommendation-specialist-v1" as const,
    templateId:
      "template-riya-recommendation-specialist-v1" as const,
    tenantId:
      "tenant-nexus-internal-001",
    ownerId:
      "owner-prashant-001",
    preparedAt:
      "2026-07-16T15:30:00.000Z",
  };
}

describe(
  "Riya qualification testing admission",
  () => {
    it(
      "admits approved Riya qualification testing",
      () => {
        const admission =
          createRiyaQualificationTestingAdmission(
            createInput(),
          );

        expect(admission).toMatchObject({
          admissionState:
            "QUALIFICATION_TESTING_ADMITTED",
          employeeId:
            "employee-riya-recommendation-specialist-v1",
        });

        expect(
          admission.admissionBoundary
            .qualificationTestingAdmissionAuthorized,
        ).toBe(true);
      },
    );

    it(
      "binds admission to owner decision and readiness evidence",
      () => {
        const input =
          createInput();

        const admission =
          createRiyaQualificationTestingAdmission(
            input,
          );

        expect(admission).toMatchObject({
          decisionId:
            input.decision.decisionId,
          decisionDigest:
            input.decision.decisionDigest,
          readinessAssessmentId:
            input.decision.readinessAssessmentId,
          readinessDigest:
            input.decision.readinessDigest,
        });
      },
    );

    it(
      "requires all twelve sandbox qualification cases",
      () => {
        const admission =
          createRiyaQualificationTestingAdmission(
            createInput(),
          );

        expect(
          admission.testingPolicy,
        ).toMatchObject({
          sandboxOnly:
            true,
          requiredQualificationCases:
            12,
          everyCaseMustPass:
            true,
          uniqueEvidenceDigestsRequired:
            true,
        });
      },
    );

    it(
      "does not execute or issue qualification automatically",
      () => {
        const admission =
          createRiyaQualificationTestingAdmission(
            createInput(),
          );

        expect(
          admission.admissionBoundary,
        ).toMatchObject({
          qualificationTestingExecuted:
            false,
          formalQualificationIssued:
            false,
          automaticQualificationBlocked:
            true,
          productionReady:
            false,
        });
      },
    );

    it(
      "keeps every real-world authority blocked",
      () => {
        const admission =
          createRiyaQualificationTestingAdmission(
            createInput(),
          );

        expect(
          Object.values(
            admission.authorityBoundary,
          ).every(
            (authorized) =>
              authorized === false,
          ),
        ).toBe(true);
      },
    );

    it(
      "creates deterministic immutable valid evidence",
      () => {
        const first =
          createRiyaQualificationTestingAdmission(
            createInput(),
          );

        const second =
          createRiyaQualificationTestingAdmission(
            createInput(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);

        expect(
          () =>
            validateRiyaQualificationTestingAdmission(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "blocks rejected owner decisions",
      () => {
        expect(
          () =>
            createRiyaQualificationTestingAdmission({
              ...createInput(),
              decision:
                createDecision(false),
            }),
        ).toThrow(
          "Rejected Riya qualification review",
        );
      },
    );

    it(
      "blocks cross-tenant and cross-owner admission",
      () => {
        expect(
          () =>
            createRiyaQualificationTestingAdmission({
              ...createInput(),
              tenantId:
                "tenant-other-001",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createRiyaQualificationTestingAdmission({
              ...createInput(),
              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "decision-bound owner",
        );
      },
    );
  },
);