
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_QUALIFICATION_CATEGORIES,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
} from "../employeeQualification";

import {
  ASHA_SUPER_SPECIALIST_COMPETENCIES,
} from "../ashaSuperSpecialistStandard";

import {
  ASHA_INDEPENDENT_EVALUATION_CASES,
  executeAshaIndependentEvaluation,
} from "../ashaIndependentEvaluationHarness";

function runEvaluation() {
  return executeAshaIndependentEvaluation({
    evaluatorId:
      "evaluator-asha-independent-001",
    ownerId:
      "owner-prashant-001",
    evaluatedAt:
      "2026-07-15T13:00:00.000Z",
  });
}

describe(
  "Asha independent 400-case evaluation",
  () => {
    it(
      "registers exactly 400 unique cases",
      () => {
        expect(
          ASHA_INDEPENDENT_EVALUATION_CASES,
        ).toHaveLength(400);

        expect(
          new Set(
            ASHA_INDEPENDENT_EVALUATION_CASES
              .map(
                (definition) =>
                  definition.caseId,
              ),
          ).size,
        ).toBe(400);

        expect(
          new Set(
            ASHA_INDEPENDENT_EVALUATION_CASES
              .map(
                (definition) =>
                  definition.sequence,
              ),
          ).size,
        ).toBe(400);
      },
    );

    it(
      "locks exact 100-case foundation category coverage",
      () => {
        const foundation =
          ASHA_INDEPENDENT_EVALUATION_CASES
            .filter(
              (definition) =>
                definition.scope ===
                "FOUNDATION",
            );

        expect(
          foundation,
        ).toHaveLength(100);

        for (
          const category of
          AI_EMPLOYEE_QUALIFICATION_CATEGORIES
        ) {
          expect(
            foundation.filter(
              (definition) =>
                definition.category ===
                category,
            ),
          ).toHaveLength(
            AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
              category
            ],
          );
        }
      },
    );

    it(
      "locks 25 executable cases for every specialist competency",
      () => {
        const specialist =
          ASHA_INDEPENDENT_EVALUATION_CASES
            .filter(
              (definition) =>
                definition.scope ===
                "SPECIALIST",
            );

        expect(
          specialist,
        ).toHaveLength(300);

        for (
          const competency of
          ASHA_SUPER_SPECIALIST_COMPETENCIES
        ) {
          expect(
            specialist.filter(
              (definition) =>
                definition.competencyId ===
                competency.competencyId,
            ),
          ).toHaveLength(25);
        }
      },
    );

    it(
      "executes and passes all 400 assertion-derived cases",
      async () => {
        const report =
          await runEvaluation();

        expect(
          report.totalCases,
        ).toBe(400);

        expect(
          report.passedCases,
        ).toBe(400);

        expect(
          report.foundation
            .passedCases,
        ).toBe(100);

        expect(
          report.specialist
            .passedCases,
        ).toBe(300);

        expect(
          report.caseResults,
        ).toHaveLength(400);

        expect(
          report.caseResults
            .every(
              (result) =>
                result.passed ===
                  true &&
                result.assertions
                  .length > 0,
            ),
        ).toBe(true);
      },
    );

    it(
      "creates unique executable evidence for every case",
      async () => {
        const report =
          await runEvaluation();

        expect(
          new Set(
            report.caseResults.map(
              (result) =>
                result.evidenceDigest,
            ),
          ).size,
        ).toBe(400);

        expect(
          report.caseResults
            .every(
              (result) =>
                /^[0-9a-f]{64}$/.test(
                  result.evidenceDigest,
                ),
            ),
        ).toBe(true);

        expect(
          report
            .assertionDerivedEvidence,
        ).toBe(true);

        expect(
          report
            .hardCodedPassingEvidenceAccepted,
        ).toBe(false);
      },
    );

    it(
      "creates deterministic immutable evaluation evidence",
      async () => {
        const first =
          await runEvaluation();

        const second =
          await runEvaluation();

        expect(
          first.reportDigest,
        ).toBe(
          second.reportDigest,
        );

        expect(
          first.reportDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.caseResults,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.caseResults[0],
          ),
        ).toBe(true);
      },
    );

    it(
      "requires an evaluator distinct from the owner",
      async () => {
        await expect(
          executeAshaIndependentEvaluation({
            evaluatorId:
              "owner-prashant-001",
            ownerId:
              "owner-prashant-001",
            evaluatedAt:
              "2026-07-15T13:00:00.000Z",
          }),
        ).rejects.toThrow(
          "must be distinct from the owner",
        );
      },
    );

    it(
      "permits shadow-mode review but does not issue qualification or activation",
      async () => {
        const report =
          await runEvaluation();

        expect(
          report.readiness
            .shadowModeReviewEligible,
        ).toBe(true);

        expect(
          report
            .formalQualificationIssued,
        ).toBe(false);

        expect(
          report
            .controlledActivationAuthorized,
        ).toBe(false);

        expect(
          report.productionReady,
        ).toBe(false);

        expect(
          report.readiness
            .formalQualificationIssued,
        ).toBe(false);

        expect(
          report.readiness
            .controlledActivationAuthorized,
        ).toBe(false);
      },
    );

    it(
      "keeps production, delivery, provider, payment and launch blocked",
      async () => {
        const report =
          await runEvaluation();

        expect(
          report.safetyBoundary
            .productionDatabaseAuthorized,
        ).toBe(false);

        expect(
          report.safetyBoundary
            .externalDeliveryAuthorized,
        ).toBe(false);

        expect(
          report.safetyBoundary
            .liveProviderExecutionAuthorized,
        ).toBe(false);

        expect(
          report.safetyBoundary
            .paymentExecutionAuthorized,
        ).toBe(false);

        expect(
          report.safetyBoundary
            .publicLaunchAuthorized,
        ).toBe(false);
      },
    );
  },
);
