
import { createHash } from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_SUPER_SPECIALIST_COMPETENCIES,
  ASHA_SUPER_SPECIALIST_STANDARD,
  ASHA_SUPER_SPECIALIST_TOTAL_CASES,
  assessAshaSuperSpecialistReadiness,
  createAshaSuperSpecialistStandard,
  type AshaSuperSpecialistReadinessInput,
} from "../ashaSuperSpecialistStandard";

import {
  ASHA_INQUIRY_INTAKE_TEMPLATE,
} from "../employeeTemplateRegistry";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(
      "verified:" + value,
      "utf8",
    )
    .digest("hex");
}

function validInput():
  AshaSuperSpecialistReadinessInput {
  return {
    evaluationEnvironment:
      "ISOLATED_TEST",
    evidenceSource:
      "INDEPENDENT_EXECUTABLE_HARNESS",
    evaluatorId:
      "evaluator-asha-independent-001",
    ownerId:
      "owner-prashant-001",
    baseQualification: {
      totalCases:
        100,
      passedCases:
        100,
      evidenceDigest:
        digest(
          "asha-foundation-qualification",
        ),
    },
    competencyEvidence:
      ASHA_SUPER_SPECIALIST_COMPETENCIES
        .map((competency) => ({
          competencyId:
            competency.competencyId,
          executedCases:
            competency.minimumEvidenceCases,
          passedCases:
            competency.minimumEvidenceCases,
          evidenceDigest:
            digest(
              competency.competencyId,
            ),
          evaluatedAt:
            "2026-07-15T12:00:00.000Z",
        })),
    safetyEvidence: {
      tenantIsolationPassed:
        true,
      ownerControlPassed:
        true,
      emergencyPausePassed:
        true,
      auditEvidencePassed:
        true,
      idempotencyPassed:
        true,
      customerContextIsolationPassed:
        true,
      productionDatabaseTouched:
        false,
      externalDeliveryPerformed:
        false,
      liveProviderExecutionPerformed:
        false,
      paymentExecutionPerformed:
        false,
    },
    evaluatedAt:
      "2026-07-15T12:05:00.000Z",
  };
}

describe(
  "Asha super-specialist standard",
  () => {
    it(
      "binds the standard to the official Asha employee identity",
      () => {
        expect(
          ASHA_SUPER_SPECIALIST_STANDARD
            .employeeId,
        ).toBe(
          ASHA_INQUIRY_INTAKE_TEMPLATE
            .employeeId,
        );

        expect(
          ASHA_SUPER_SPECIALIST_STANDARD
            .templateId,
        ).toBe(
          ASHA_INQUIRY_INTAKE_TEMPLATE
            .templateId,
        );

        expect(
          ASHA_SUPER_SPECIALIST_STANDARD
            .standardLevel,
        ).toBe(
          "WORLD_CLASS_SUPER_SPECIALIST",
        );
      },
    );

    it(
      "defines exactly 12 unique specialist competencies",
      () => {
        expect(
          ASHA_SUPER_SPECIALIST_COMPETENCIES,
        ).toHaveLength(12);

        expect(
          new Set(
            ASHA_SUPER_SPECIALIST_COMPETENCIES
              .map(
                (competency) =>
                  competency.competencyId,
              ),
          ).size,
        ).toBe(12);
      },
    );

    it(
      "locks 300 role cases and 400 total mandatory cases",
      () => {
        const roleCases =
          ASHA_SUPER_SPECIALIST_COMPETENCIES
            .reduce(
              (total, competency) =>
                total +
                competency.minimumEvidenceCases,
              0,
            );

        expect(
          roleCases,
        ).toBe(300);

        expect(
          ASHA_SUPER_SPECIALIST_TOTAL_CASES,
        ).toBe(400);

        expect(
          ASHA_SUPER_SPECIALIST_STANDARD
            .foundationSafetyCases,
        ).toBe(100);
      },
    );

    it(
      "locks competency weights to exactly 100 points",
      () => {
        expect(
          ASHA_SUPER_SPECIALIST_COMPETENCIES
            .reduce(
              (total, competency) =>
                total +
                competency.weightPoints,
              0,
            ),
        ).toBe(100);
      },
    );

    it(
      "creates deterministic immutable standard evidence",
      () => {
        const first =
          createAshaSuperSpecialistStandard();

        const second =
          createAshaSuperSpecialistStandard();

        expect(
          first.standardDigest,
        ).toBe(
          second.standardDigest,
        );

        expect(
          first.standardDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.competencies,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.competencies[0]
              .requiredOutputs,
          ),
        ).toBe(true);
      },
    );

    it(
      "accepts complete independent evidence only for shadow-mode review",
      () => {
        const report =
          assessAshaSuperSpecialistReadiness(
            validInput(),
          );

        expect(
          report.totalEvidenceCases,
        ).toBe(400);

        expect(
          report.passedEvidenceCases,
        ).toBe(400);

        expect(
          report
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
      },
    );

    it(
      "blocks missing competency evidence",
      () => {
        const input =
          validInput();

        expect(() =>
          assessAshaSuperSpecialistReadiness({
            ...input,
            competencyEvidence:
              input.competencyEvidence
                .slice(1),
          }),
        ).toThrow(
          "Evidence for every Asha super-specialist competency is required",
        );
      },
    );

    it(
      "blocks duplicate competency identity",
      () => {
        const input =
          validInput();

        const evidence =
          input.competencyEvidence
            .map(
              (item, index) =>
                index === 1
                  ? {
                      ...item,
                      competencyId:
                        input
                          .competencyEvidence[0]
                          .competencyId,
                    }
                  : item,
            );

        expect(() =>
          assessAshaSuperSpecialistReadiness({
            ...input,
            competencyEvidence:
              evidence,
          }),
        ).toThrow(
          "must not contain duplicate competency IDs",
        );
      },
    );

    it(
      "blocks any incomplete or failed specialist case",
      () => {
        const input =
          validInput();

        const evidence =
          input.competencyEvidence
            .map(
              (item, index) =>
                index === 0
                  ? {
                      ...item,
                      passedCases:
                        item.passedCases -
                        1,
                    }
                  : item,
            );

        expect(() =>
          assessAshaSuperSpecialistReadiness({
            ...input,
            competencyEvidence:
              evidence,
          }),
        ).toThrow(
          "Every required Asha competency case must execute and pass",
        );
      },
    );

    it(
      "blocks self-attested or non-executable evidence",
      () => {
        const input =
          validInput();

        expect(() =>
          assessAshaSuperSpecialistReadiness({
            ...input,
            evidenceSource:
              "SELF_ATTESTED",
          } as unknown as
            AshaSuperSpecialistReadinessInput),
        ).toThrow(
          "independent executable harness",
        );
      },
    );

    it(
      "blocks duplicate evidence digests",
      () => {
        const input =
          validInput();

        const evidence =
          input.competencyEvidence
            .map(
              (item, index) =>
                index === 1
                  ? {
                      ...item,
                      evidenceDigest:
                        input
                          .competencyEvidence[0]
                          .evidenceDigest,
                    }
                  : item,
            );

        expect(() =>
          assessAshaSuperSpecialistReadiness({
            ...input,
            competencyEvidence:
              evidence,
          }),
        ).toThrow(
          "evidence digests must be unique",
        );
      },
    );

    it(
      "blocks incomplete foundation qualification",
      () => {
        const input =
          validInput();

        expect(() =>
          assessAshaSuperSpecialistReadiness({
            ...input,
            baseQualification: {
              ...input.baseQualification,
              passedCases:
                99,
            },
          } as unknown as
            AshaSuperSpecialistReadinessInput),
        ).toThrow(
          "All 100 foundation qualification cases must pass",
        );
      },
    );

    it(
      "blocks production database, delivery, provider and payment side effects",
      () => {
        const input =
          validInput();

        expect(() =>
          assessAshaSuperSpecialistReadiness({
            ...input,
            safetyEvidence: {
              ...input.safetyEvidence,
              externalDeliveryPerformed:
                true,
            },
          } as unknown as
            AshaSuperSpecialistReadinessInput),
        ).toThrow(
          "must not perform external delivery",
        );

        const report =
          assessAshaSuperSpecialistReadiness(
            input,
          );

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
            .productionDatabaseAuthorized,
        ).toBe(false);

        expect(
          report.safetyBoundary
            .publicLaunchAuthorized,
        ).toBe(false);
      },
    );
  },
);
