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
  validateMeeraOwnerQualificationReviewDecision,
} from "../meeraOwnerQualificationReviewDecision";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function createReadiness() {
  return createMeeraQualificationReadinessAssessment({
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
}

function createInput() {
  return {
    decisionId:
      "meera-owner-review-decision-001",
    readiness:
      createReadiness(),
    tenantId:
      "tenant-nexus-internal-001",
    ownerId:
      "owner-prashant-001",
    decision:
      "APPROVE_FORMAL_QUALIFICATION_TESTING" as const,
    rationale:
      "All qualification evidence passed and formal sandbox testing may proceed.",
    decidedAt:
      "2026-07-17T15:45:00.000Z",
  };
}

describe(
  "Meera owner qualification review decision",
  () => {
    it(
      "records owner approval for formal qualification testing",
      () => {
        const decision =
          createMeeraOwnerQualificationReviewDecision(
            createInput(),
          );

        expect(decision).toMatchObject({
          decisionState:
            "OWNER_QUALIFICATION_REVIEW_RECORDED",
          decision:
            "APPROVE_FORMAL_QUALIFICATION_TESTING",
          ownerApprovedForQualificationTesting:
            true,
          qualificationTestingAdmissionEligible:
            true,
          nextStep:
            "CREATE_QUALIFICATION_TESTING_ADMISSION",
        });
      },
    );

    it(
      "records rejection without creating admission eligibility",
      () => {
        const decision =
          createMeeraOwnerQualificationReviewDecision({
            ...createInput(),
            decision:
              "REJECT_FORMAL_QUALIFICATION_TESTING",
          });

        expect(decision).toMatchObject({
          ownerApprovedForQualificationTesting:
            false,
          qualificationTestingAdmissionEligible:
            false,
          nextStep:
            "RETAIN_REGISTERED_UNQUALIFIED_STATE",
        });
      },
    );

    it(
      "binds the decision to Meera readiness evidence",
      () => {
        const input =
          createInput();

        const decision =
          createMeeraOwnerQualificationReviewDecision(
            input,
          );

        expect(decision).toMatchObject({
          employeeId:
            input.readiness.employeeId,
          templateId:
            input.readiness.templateId,
          tenantId:
            input.readiness.tenantId,
          ownerId:
            input.readiness.ownerId,
          readinessAssessmentId:
            input.readiness.assessmentId,
          readinessDigest:
            input.readiness.readinessDigest,
        });
      },
    );

    it(
      "keeps qualification execution blocked after owner review",
      () => {
        const decision =
          createMeeraOwnerQualificationReviewDecision(
            createInput(),
          );

        expect(
          decision.reviewBoundary,
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
        const decision =
          createMeeraOwnerQualificationReviewDecision(
            createInput(),
          );

        expect(
          Object.values(
            decision.authorityBoundary,
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
          createMeeraOwnerQualificationReviewDecision(
            createInput(),
          );

        const second =
          createMeeraOwnerQualificationReviewDecision(
            createInput(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);

        expect(
          () =>
            validateMeeraOwnerQualificationReviewDecision(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "blocks cross-owner review",
      () => {
        expect(
          () =>
            createMeeraOwnerQualificationReviewDecision({
              ...createInput(),
              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "readiness-bound owner",
        );
      },
    );

    it(
      "blocks cross-tenant review",
      () => {
        expect(
          () =>
            createMeeraOwnerQualificationReviewDecision({
              ...createInput(),
              tenantId:
                "tenant-other-001",
            }),
        ).toThrow(
          "Cross-tenant",
        );
      },
    );
  },
);
