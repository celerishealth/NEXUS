import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createMeeraQuotationProposalSpecialistTemplate,
} from "../meeraQuotationProposalSpecialistTemplate";

import {
  MEERA_QUOTATION_PROPOSAL_SPECIALIST_COMPETENCIES,
  MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES,
  MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_STANDARD,
  createMeeraQuotationProposalSpecialistQualificationStandard,
  validateMeeraQuotationProposalSpecialistQualificationStandard,
  type MeeraQuotationProposalSpecialistQualificationStandard,
} from "../meeraQuotationProposalSpecialistQualificationStandard";

describe(
  "Meera quotation and proposal specialist qualification standard",
  () => {
    it(
      "binds the standard to the exact Meera identity",
      () => {
        expect(
          MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_STANDARD,
        ).toMatchObject({
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
          standardLevel:
            "SUPER_SPECIALIST",
        });
      },
    );

    it(
      "stays aligned with the registered standalone Meera template",
      () => {
        const template =
          createMeeraQuotationProposalSpecialistTemplate(
            "2026-07-16T14:00:00.000Z",
          );

        const standard =
          MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_STANDARD;

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
          MEERA_QUOTATION_PROPOSAL_SPECIALIST_COMPETENCIES,
        ).toHaveLength(6);

        expect(
          new Set(
            MEERA_QUOTATION_PROPOSAL_SPECIALIST_COMPETENCIES.map(
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
          MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_STANDARD;

        expect(
          MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES,
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
          MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_STANDARD
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
          MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_STANDARD
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
          createMeeraQuotationProposalSpecialistQualificationStandard();

        const second =
          createMeeraQuotationProposalSpecialistQualificationStandard();

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
            validateMeeraQuotationProposalSpecialistQualificationStandard(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "rejects tampered qualification evidence",
      () => {
        const valid =
          createMeeraQuotationProposalSpecialistQualificationStandard();

        const tampered = {
          ...valid,
          minimumPassingCases:
            11,
        } as unknown as
          MeeraQuotationProposalSpecialistQualificationStandard;

        expect(
          () =>
            validateMeeraQuotationProposalSpecialistQualificationStandard(
              tampered,
            ),
        ).toThrow(
          "case requirement is invalid",
        );
      },
    );
  },
);
