
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  EXPECTED_RELEASE_FREEZE_SOURCE_COMMIT,
  REQUIRED_FINAL_RELEASE_FREEZE_GATES,
  createFinalReleaseFreezeReport,
  type FinalReleaseFreezeEvidence,
  type FinalReleaseFreezeGate,
  type FinalReleaseFreezeInput,
} from "../finalReleaseFreeze";

function passingEvidence(): Record<
  FinalReleaseFreezeGate,
  boolean
> {
  return Object.fromEntries(
    REQUIRED_FINAL_RELEASE_FREEZE_GATES.map(
      (gate) => [gate, true],
    ),
  ) as Record<
    FinalReleaseFreezeGate,
    boolean
  >;
}

function validInput(
  overrides:
    Partial<FinalReleaseFreezeInput> = {},
): FinalReleaseFreezeInput {
  return {
    sourceCommit:
      EXPECTED_RELEASE_FREEZE_SOURCE_COMMIT,
    freezeCommit: "810810a",
    evidence: passingEvidence(),
    ...overrides,
  };
}

describe(
  "final release freeze",
  () => {
    for (
      const gate of
      REQUIRED_FINAL_RELEASE_FREEZE_GATES
    ) {
      it(
        "fails closed when required gate " +
          gate +
          " is false",
        () => {
          const evidence =
            passingEvidence();

          evidence[gate] = false;

          const report =
            createFinalReleaseFreezeReport(
              validInput({ evidence }),
            );

          expect(report.status).toBe(
            "NOT_FROZEN",
          );

          expect(
            report.releaseFreezeSatisfied,
          ).toBe(false);

          expect(report.failedGates).toEqual(
            [gate],
          );

          expect(
            report.finalStatement,
          ).toBe(
            "NEXUS_DAY_810_NOT_FROZEN_RESOLVE_FAILED_GATES",
          );
        },
      );
    }

    it(
      "all gates produce the Day 810 frozen decision",
      () => {
        const report =
          createFinalReleaseFreezeReport(
            validInput(),
          );

        expect(report.status).toBe(
          "DAY_810_RELEASE_FROZEN",
        );

        expect(
          report.releaseFreezeSatisfied,
        ).toBe(true);

        expect(report.failedGates).toEqual(
          [],
        );

        expect(
          report.finalStatement,
        ).toBe(
          "NEXUS_DAY_810_RELEASE_FROZEN_PUBLIC_LAUNCH_BLOCKED",
        );
      },
    );

    it(
      "produces deterministic evidence and report digests",
      () => {
        const first =
          createFinalReleaseFreezeReport(
            validInput(),
          );

        const second =
          createFinalReleaseFreezeReport(
            validInput(),
          );

        expect(first.evidenceDigest).toBe(
          second.evidenceDigest,
        );

        expect(first.reportDigest).toBe(
          second.reportDigest,
        );

        expect(first).toEqual(second);
      },
    );

    it(
      "rejects missing or additional evidence gates",
      () => {
        const missing:
          Partial<
            Record<
              FinalReleaseFreezeGate,
              boolean
            >
          > = {
            ...passingEvidence(),
          };

        delete missing.productionBuild;

        expect(() =>
          createFinalReleaseFreezeReport(
            validInput({
              evidence:
                missing as FinalReleaseFreezeEvidence,
            }),
          ),
        ).toThrow(
          "must contain the exact required gates",
        );

        const additional = {
          ...passingEvidence(),
          unexpectedGate: true,
        };

        expect(() =>
          createFinalReleaseFreezeReport(
            validInput({
              evidence:
                additional as unknown as
                  FinalReleaseFreezeEvidence,
            }),
          ),
        ).toThrow(
          "must contain the exact required gates",
        );
      },
    );

    it(
      "validates source and freeze commit identities",
      () => {
        expect(() =>
          createFinalReleaseFreezeReport(
            validInput({
              sourceCommit: "abcdef0",
            }),
          ),
        ).toThrow(
          "sourceCommit must equal 0c94153",
        );

        expect(() =>
          createFinalReleaseFreezeReport(
            validInput({
              freezeCommit: "not-a-commit",
            }),
          ),
        ).toThrow(
          "freezeCommit must be a distinct lowercase hexadecimal Git commit",
        );

        expect(() =>
          createFinalReleaseFreezeReport(
            validInput({
              freezeCommit:
                EXPECTED_RELEASE_FREEZE_SOURCE_COMMIT,
            }),
          ),
        ).toThrow(
          "freezeCommit must be a distinct lowercase hexadecimal Git commit",
        );
      },
    );

    it(
      "deeply freezes the release report",
      () => {
        const report =
          createFinalReleaseFreezeReport(
            validInput(),
          );

        expect(Object.isFrozen(report)).toBe(
          true,
        );

        expect(
          Object.isFrozen(report.evidence),
        ).toBe(true);

        expect(
          Object.isFrozen(
            report.failedGates,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            report.safetyBoundary,
          ),
        ).toBe(true);

        expect(() => {
          (
            report.evidence as Record<
              FinalReleaseFreezeGate,
              boolean
            >
          ).productionBuild = false;
        }).toThrow(TypeError);
      },
    );

    it(
      "never authorizes production or public execution",
      () => {
        const report =
          createFinalReleaseFreezeReport(
            validInput(),
          );

        expect(
          report.safetyBoundary
            .ownerApprovalRequired,
        ).toBe(true);

        expect(
          report.safetyBoundary
            .productionDatabaseMutationAuthorized,
        ).toBe(false);

        expect(
          report.safetyBoundary
            .productionDeploymentAuthorized,
        ).toBe(false);

        expect(
          report.safetyBoundary
            .liveProviderExecutionAuthorized,
        ).toBe(false);

        expect(
          report.safetyBoundary
            .customerMessageDeliveryAuthorized,
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
