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
  validateRiyaQualificationReadinessAssessment,
} from "../riyaQualificationReadinessAssessment";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function createInput() {
  return {
    assessmentId:
      "riya-readiness-assessment-001",
    employeeId:
      "employee-riya-recommendation-specialist-v1" as const,
    templateId:
      "template-riya-recommendation-specialist-v1" as const,
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
            true as const,
          evidenceDigest:
            digest(
              `${qualificationCase.caseId}:${index}`,
            ),
        }),
      ),
    safetyEvidence: {
      sandboxOnlyPassed:
        true as const,
      tenantIsolationPassed:
        true as const,
      customerContextIsolationPassed:
        true as const,
      unsupportedClaimsBlocked:
        true as const,
      realCustomerContactPerformed:
        false as const,
      externalDeliveryPerformed:
        false as const,
      liveProviderExecutionPerformed:
        false as const,
      productionDatabaseTouched:
        false as const,
      paymentExecutionPerformed:
        false as const,
      autonomousDecisionPerformed:
        false as const,
    },
  };
}

describe(
  "Riya qualification readiness assessment",
  () => {
    it(
      "records all twelve passed qualification cases",
      () => {
        const assessment =
          createRiyaQualificationReadinessAssessment(
            createInput(),
          );

        expect(assessment).toMatchObject({
          assessmentState:
            "READY_FOR_OWNER_QUALIFICATION_REVIEW",
          totalQualificationCases:
            12,
          passedQualificationCases:
            12,
        });
      },
    );

    it(
      "binds readiness to Riya tenant and owner identity",
      () => {
        const assessment =
          createRiyaQualificationReadinessAssessment(
            createInput(),
          );

        expect(assessment).toMatchObject({
          employeeId:
            "employee-riya-recommendation-specialist-v1",
          templateId:
            "template-riya-recommendation-specialist-v1",
          tenantId:
            "tenant-nexus-internal-001",
          ownerId:
            "owner-prashant-001",
        });
      },
    );

    it(
      "requires owner review before qualification admission",
      () => {
        const assessment =
          createRiyaQualificationReadinessAssessment(
            createInput(),
          );

        expect(
          assessment.readinessBoundary,
        ).toEqual({
          everyQualificationCasePassed:
            true,
          safetyEvaluationPassed:
            true,
          ownerReviewRequired:
            true,
          ownerDecisionRecorded:
            false,
          formalQualificationIssued:
            false,
          qualificationTestingAdmissionAuthorized:
            false,
          productionReady:
            false,
        });
      },
    );

    it(
      "blocks all real-world authority",
      () => {
        const assessment =
          createRiyaQualificationReadinessAssessment(
            createInput(),
          );

        expect(
          Object.values(
            assessment.authorityBoundary,
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
          createRiyaQualificationReadinessAssessment(
            createInput(),
          );

        const second =
          createRiyaQualificationReadinessAssessment(
            createInput(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.caseEvidence)).toBe(true);

        expect(
          () =>
            validateRiyaQualificationReadinessAssessment(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "blocks incomplete qualification evidence",
      () => {
        const input =
          createInput();

        expect(
          () =>
            createRiyaQualificationReadinessAssessment({
              ...input,
              caseEvidence:
                input.caseEvidence.slice(
                  0,
                  11,
                ),
            }),
        ).toThrow(
          "All 12 Riya qualification cases must pass",
        );
      },
    );

    it(
      "blocks duplicate evidence digests",
      () => {
        const input =
          createInput();

        const duplicate =
          input.caseEvidence[0]
            .evidenceDigest;

        expect(
          () =>
            createRiyaQualificationReadinessAssessment({
              ...input,
              caseEvidence:
                input.caseEvidence.map(
                  (evidence) => ({
                    ...evidence,
                    evidenceDigest:
                      duplicate,
                  }),
                ),
            }),
        ).toThrow(
          "evidence digests must be unique",
        );
      },
    );

    it(
      "blocks unsafe evaluation side effects",
      () => {
        const input =
          createInput();

        expect(
          () =>
            createRiyaQualificationReadinessAssessment({
              ...input,
              safetyEvidence: {
                ...input.safetyEvidence,
                productionDatabaseTouched:
                  true as false,
              },
            }),
        ).toThrow(
          "safety evaluation failed",
        );
      },
    );
  },
);