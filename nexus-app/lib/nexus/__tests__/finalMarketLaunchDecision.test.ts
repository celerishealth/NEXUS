
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  EXPECTED_FINAL_MARKET_LAUNCH_SOURCE_COMMIT,
  REQUIRED_FINAL_MARKET_LAUNCH_DECISION_GATES,
  createFinalMarketLaunchDecision,
  type FinalMarketLaunchDecisionEvidence,
  type FinalMarketLaunchDecisionGate,
  type FinalMarketLaunchDecisionInput,
} from "../finalMarketLaunchDecision";

function passingEvidence(): Record<
  FinalMarketLaunchDecisionGate,
  boolean
> {
  return Object.fromEntries(
    REQUIRED_FINAL_MARKET_LAUNCH_DECISION_GATES.map(
      (gate) => [
        gate,
        true,
      ],
    ),
  ) as Record<
    FinalMarketLaunchDecisionGate,
    boolean
  >;
}

function validInput(
  overrides:
    Partial<FinalMarketLaunchDecisionInput> = {},
): FinalMarketLaunchDecisionInput {
  return {
    sourceCommit:
      EXPECTED_FINAL_MARKET_LAUNCH_SOURCE_COMMIT,
    decisionCommit:
      "811811a",
    evidence:
      passingEvidence(),
    ...overrides,
  };
}

describe(
  "final market-launch decision",
  () => {
    for (
      const gate of
      REQUIRED_FINAL_MARKET_LAUNCH_DECISION_GATES
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
            createFinalMarketLaunchDecision(
              validInput({
                evidence,
              }),
            );

          expect(report.status).toBe(
            "NOT_COMPLETE",
          );

          expect(
            report
              .finalCompletionConfirmed,
          ).toBe(false);

          expect(
            report
              .controlledMarketEntryAuthorized,
          ).toBe(false);

          expect(
            report.failedGates,
          ).toEqual([gate]);

          expect(
            report.finalStatement,
          ).toBe(
            "NEXUS_DAY_811_NOT_COMPLETE_RESOLVE_FAILED_GATES",
          );
        },
      );
    }

    it(
      "confirms completion and controlled market entry when every gate passes",
      () => {
        const report =
          createFinalMarketLaunchDecision(
            validInput(),
          );

        expect(report.status).toBe(
          "DAY_811_FINAL_COMPLETION_CONTROLLED_MARKET_ENTRY_AUTHORIZED",
        );

        expect(
          report.finalCompletionConfirmed,
        ).toBe(true);

        expect(
          report
            .controlledMarketEntryAuthorized,
        ).toBe(true);

        expect(
          report.publicLaunchAuthorized,
        ).toBe(false);

        expect(
          report.failedGates,
        ).toEqual([]);

        expect(
          report.finalStatement,
        ).toBe(
          "NEXUS_DAY_811_FINAL_COMPLETION_CONFIRMED_CONTROLLED_MARKET_ENTRY_AUTHORIZED_PUBLIC_LAUNCH_BLOCKED",
        );
      },
    );

    it(
      "produces deterministic evidence and report digests",
      () => {
        const first =
          createFinalMarketLaunchDecision(
            validInput(),
          );

        const second =
          createFinalMarketLaunchDecision(
            validInput(),
          );

        expect(
          first.evidenceDigest,
        ).toBe(
          second.evidenceDigest,
        );

        expect(
          first.reportDigest,
        ).toBe(
          second.reportDigest,
        );

        expect(first).toEqual(second);
      },
    );

    it(
      "rejects missing and additional evidence gates",
      () => {
        const missing =
          Object.fromEntries(
            Object.entries(
              passingEvidence(),
            ).filter(
              ([key]) =>
                key !==
                "paymentExecutionBlocked",
            ),
          );

        expect(() =>
          createFinalMarketLaunchDecision(
            validInput({
              evidence:
                missing as
                  FinalMarketLaunchDecisionEvidence,
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
          createFinalMarketLaunchDecision(
            validInput({
              evidence:
                additional as unknown as
                  FinalMarketLaunchDecisionEvidence,
            }),
          ),
        ).toThrow(
          "must contain the exact required gates",
        );
      },
    );

    it(
      "validates source and decision commit identities",
      () => {
        expect(() =>
          createFinalMarketLaunchDecision(
            validInput({
              sourceCommit:
                "abcdef0",
            }),
          ),
        ).toThrow(
          "sourceCommit must equal 5953f19",
        );

        expect(() =>
          createFinalMarketLaunchDecision(
            validInput({
              decisionCommit:
                "not-a-commit",
            }),
          ),
        ).toThrow(
          "decisionCommit must be a distinct lowercase hexadecimal Git commit",
        );

        expect(() =>
          createFinalMarketLaunchDecision(
            validInput({
              decisionCommit:
                EXPECTED_FINAL_MARKET_LAUNCH_SOURCE_COMMIT,
            }),
          ),
        ).toThrow(
          "decisionCommit must be a distinct lowercase hexadecimal Git commit",
        );
      },
    );

    it(
      "deeply freezes the final decision report",
      () => {
        const report =
          createFinalMarketLaunchDecision(
            validInput(),
          );

        expect(
          Object.isFrozen(report),
        ).toBe(true);

        expect(
          Object.isFrozen(
            report.evidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            report.failedGates,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            report.authorizedScope,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            report.blockedScope,
          ),
        ).toBe(true);

        expect(() => {
          (
            report.evidence as Record<
              FinalMarketLaunchDecisionGate,
              boolean
            >
          ).workingTreeClean = false;
        }).toThrow(TypeError);
      },
    );

    it(
      "authorizes founder-led entry but never operational or public launch",
      () => {
        const report =
          createFinalMarketLaunchDecision(
            validInput(),
          );

        expect(
          report.authorizedScope
            .founderMarketingAuthorized,
        ).toBe(true);

        expect(
          report.authorizedScope
            .founderSalesConversationsAuthorized,
        ).toBe(true);

        expect(
          report.authorizedScope
            .founderDemoAuthorized,
        ).toBe(true);

        expect(
          report.authorizedScope
            .invitationOnlyPilotRecruitmentAuthorized,
        ).toBe(true);

        expect(
          report.blockedScope
            .operationalCustomerActivationAuthorized,
        ).toBe(false);

        expect(
          report.blockedScope
            .publicSignupAuthorized,
        ).toBe(false);

        expect(
          report.blockedScope
            .productionDatabaseMutationAuthorized,
        ).toBe(false);

        expect(
          report.blockedScope
            .productionDeploymentAuthorized,
        ).toBe(false);

        expect(
          report.blockedScope
            .liveProviderExecutionAuthorized,
        ).toBe(false);

        expect(
          report.blockedScope
            .customerMessageDeliveryAuthorized,
        ).toBe(false);

        expect(
          report.blockedScope
            .paymentExecutionAuthorized,
        ).toBe(false);

        expect(
          report.blockedScope
            .publicLaunchAuthorized,
        ).toBe(false);
      },
    );
  },
);
