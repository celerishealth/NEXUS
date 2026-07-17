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
  validateMeeraQualificationTestingAdmission,
} from "../meeraQualificationTestingAdmission";

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

  return createMeeraOwnerQualificationReviewDecision({
    decisionId:
      "meera-owner-review-decision-001",
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
      "2026-07-17T15:45:00.000Z",
  });
}

function createInput() {
  return {
    admissionId:
      "meera-testing-admission-001",
    decision:
      createDecision(),
    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,
    templateId:
      "template-meera-quotation-proposal-specialist-v1" as const,
    tenantId:
      "tenant-nexus-internal-001",
    ownerId:
      "owner-prashant-001",
    preparedAt:
      "2026-07-17T16:00:00.000Z",
  };
}

describe(
  "Meera qualification testing admission",
  () => {
    it(
      "admits approved Meera qualification testing",
      () => {
        const admission =
          createMeeraQualificationTestingAdmission(
            createInput(),
          );

        expect(admission).toMatchObject({
          admissionState:
            "QUALIFICATION_TESTING_ADMITTED",
          employeeId:
            "employee-meera-quotation-proposal-specialist-v1",
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
          createMeeraQualificationTestingAdmission(
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
          createMeeraQualificationTestingAdmission(
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
          createMeeraQualificationTestingAdmission(
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
          createMeeraQualificationTestingAdmission(
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
          createMeeraQualificationTestingAdmission(
            createInput(),
          );

        const second =
          createMeeraQualificationTestingAdmission(
            createInput(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);

        expect(
          () =>
            validateMeeraQualificationTestingAdmission(
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
            createMeeraQualificationTestingAdmission({
              ...createInput(),
              decision:
                createDecision(false),
            }),
        ).toThrow(
          "Rejected Meera qualification review",
        );
      },
    );

    it(
      "blocks cross-tenant and cross-owner admission",
      () => {
        expect(
          () =>
            createMeeraQualificationTestingAdmission({
              ...createInput(),
              tenantId:
                "tenant-other-001",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createMeeraQualificationTestingAdmission({
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
