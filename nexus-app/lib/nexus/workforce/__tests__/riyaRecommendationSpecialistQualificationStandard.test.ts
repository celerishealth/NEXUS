import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createRiyaRecommendationSpecialistTemplate,
} from "../riyaRecommendationSpecialistTemplate";

import {
  RIYA_RECOMMENDATION_SPECIALIST_COMPETENCIES,
  RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES,
  RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_STANDARD,
  createRiyaRecommendationSpecialistQualificationStandard,
  validateRiyaRecommendationSpecialistQualificationStandard,
  type RiyaRecommendationSpecialistQualificationStandard,
} from "../riyaRecommendationSpecialistQualificationStandard";

describe(
  "Riya recommendation specialist qualification standard",
  () => {
    it(
      "binds the standard to the exact Riya identity",
      () => {
        expect(
          RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_STANDARD,
        ).toMatchObject({
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
          standardLevel:
            "SUPER_SPECIALIST",
        });
      },
    );

    it(
      "stays aligned with the registered standalone Riya template",
      () => {
        const template =
          createRiyaRecommendationSpecialistTemplate(
            "2026-07-16T14:00:00.000Z",
          );

        const standard =
          RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_STANDARD;

        expect(standard).toMatchObject({
          employeeId:
            template.employeeId,
          templateId:
            template.templateId,
          employeeCode:
            template.employeeCode,
          displayName:
            template.displayName,
          officialRole:
            template.officialRole,
        });
      },
    );

    it(
      "defines six specialist competencies",
      () => {
        expect(
          RIYA_RECOMMENDATION_SPECIALIST_COMPETENCIES,
        ).toHaveLength(6);

        expect(
          new Set(
            RIYA_RECOMMENDATION_SPECIALIST_COMPETENCIES.map(
              (competency) =>
                competency.competencyId,
            ),
          ).size,
        ).toBe(6);
      },
    );

    it(
      "requires all twelve qualification cases to pass",
      () => {
        const standard =
          RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_STANDARD;

        expect(
          RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES,
        ).toHaveLength(12);

        expect(
          standard.totalQualificationCases,
        ).toBe(12);

        expect(
          standard.minimumPassingCases,
        ).toBe(12);

        expect(
          new Set(
            standard.qualificationCases.map(
              (qualificationCase) =>
                qualificationCase.caseId,
            ),
          ).size,
        ).toBe(12);
      },
    );

    it(
      "keeps qualification and activation under owner control",
      () => {
        expect(
          RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_STANDARD
            .qualificationPolicy,
        ).toEqual({
          everyCaseMustPass:
            true,
          selfQualificationAllowed:
            false,
          independentOwnerReviewRequired:
            true,
          ownerCertificationRequired:
            true,
          automaticQualificationBlocked:
            true,
          automaticProductionActivationBlocked:
            true,
        });
      },
    );

    it(
      "blocks every real-world side effect during evaluation",
      () => {
        expect(
          RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_STANDARD
            .safetyBoundary,
        ).toEqual({
          sandboxOnly:
            true,
          tenantIsolationRequired:
            true,
          customerContextIsolationRequired:
            true,
          unsupportedClaimsBlocked:
            true,
          realCustomerContactDuringEvaluationAuthorized:
            false,
          externalDeliveryDuringEvaluationAuthorized:
            false,
          liveProviderExecutionDuringEvaluationAuthorized:
            false,
          productionDatabaseDuringEvaluationAuthorized:
            false,
          paymentExecutionDuringEvaluationAuthorized:
            false,
          autonomousDecisionDuringEvaluationAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable valid evidence",
      () => {
        const first =
          createRiyaRecommendationSpecialistQualificationStandard();

        const second =
          createRiyaRecommendationSpecialistQualificationStandard();

        expect(first).toEqual(second);

        expect(
          first.qualificationStandardDigest,
        ).toMatch(
          /^[a-f0-9]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(first.competencies),
        ).toBe(true);

        expect(
          Object.isFrozen(first.qualificationCases),
        ).toBe(true);

        expect(
          () =>
            validateRiyaRecommendationSpecialistQualificationStandard(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "rejects tampered qualification evidence",
      () => {
        const valid =
          createRiyaRecommendationSpecialistQualificationStandard();

        const tampered = {
          ...valid,
          minimumPassingCases:
            11,
        } as unknown as
          RiyaRecommendationSpecialistQualificationStandard;

        expect(
          () =>
            validateRiyaRecommendationSpecialistQualificationStandard(
              tampered,
            ),
        ).toThrow(
          "case requirement is invalid",
        );
      },
    );
  },
);