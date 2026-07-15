import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_SANITIZED_SHADOW_SESSION_VERSION,
  ASHA_SHADOW_OBSERVATION_LEDGER_VERSION,
  type AshaSanitizedShadowSession,
  type AshaShadowObservationLedger,
  type AshaShadowObservationLedgerEntry,
} from "../ashaSanitizedShadowObservation";

import {
  createAshaShadowQualificationReadinessEvidence,
} from "../ashaShadowQualificationReadiness";

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
            stableStringify(item),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            JSON.stringify(key) +
            ":" +
            stableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported test value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
    .digest("hex");
}

function session(
  overrides:
    Partial<AshaSanitizedShadowSession> = {},
): AshaSanitizedShadowSession {
  return {
    version:
      ASHA_SANITIZED_SHADOW_SESSION_VERSION,
    sessionId:
      "asha-shadow-session-day-11",
    sessionState:
      "ACTIVE_SANITIZED_OBSERVATION",
    admissionId:
      "asha-shadow-admission-day-11",
    admissionDigest:
      sha256("admission-day-11"),
    evaluationReportDigest:
      sha256("evaluation-day-11"),
    employeeId:
      "asha-specialist-001",
    templateId:
      "asha-specialist-template-001",
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    evaluatorId:
      "evaluator-asha-independent-001",
    sourceRestriction:
      "SANITIZED_OR_SYNTHETIC_ONLY",
    authorityBoundary: {
      internalAssessmentAuthorized:
        true,
      ownerComparisonAuthorized:
        true,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      productionMutationAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      autonomousDecisionAuthorized:
        false,
      formalQualificationAuthorized:
        false,
      runtimeActivationAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    },
    controlBoundary: {
      admissionExpiryEnforced:
        true,
      emergencyPauseEnforced:
        true,
      ownerRevocationEnforced:
        true,
      crossTenantUseBlocked:
        true,
      failedScoringRemainsFailClosed:
        true,
    },
    openedAt:
      "2026-07-15T14:15:00.000Z",
    expiresAt:
      "2026-07-22T14:10:00.000Z",
    sessionDigest:
      sha256("session-day-11"),
    ...overrides,
  };
}

function ledger(
  outcomes:
    readonly (
      "PASS" |
      "FAIL_CLOSED"
    )[] = [
      "PASS",
      "PASS",
    ],
  sessionValue =
    session(),
): AshaShadowObservationLedger {
  const entries:
    AshaShadowObservationLedgerEntry[] = [];

  for (
    let index = 0;
    index < outcomes.length;
    index++
  ) {
    const outcome =
      outcomes[index];

    const entryCore = {
      sequence:
        index + 1,
      observationId:
        "asha-shadow-observation-" +
        String(index + 1).padStart(
          3,
          "0",
        ),
      observationDigest:
        sha256(
          "observation-" +
          String(index + 1),
        ),
      score:
        outcome === "PASS"
          ? 100
          : 0,
      outcome,
      recordedAt:
        "2026-07-15T14:" +
        String(17 + index).padStart(
          2,
          "0",
        ) +
        ":00.000Z",
      previousEntryDigest:
        index === 0
          ? null
          : entries[index - 1]
              .entryDigest,
    };

    entries.push({
      ...entryCore,
      entryDigest:
        sha256(entryCore),
    });
  }

  const passedObservations =
    entries.filter(
      (entry) =>
        entry.outcome === "PASS",
    ).length;

  const failedClosedObservations =
    entries.length -
    passedObservations;

  const ownerReviewRequired =
    failedClosedObservations > 0;

  const ledgerCore = {
    version:
      ASHA_SHADOW_OBSERVATION_LEDGER_VERSION,
    ledgerId:
      "asha-shadow-ledger-day-11",
    sessionId:
      sessionValue.sessionId,
    sessionDigest:
      sessionValue.sessionDigest,
    admissionDigest:
      sessionValue.admissionDigest,
    tenantId:
      sessionValue.tenantId,
    ownerId:
      sessionValue.ownerId,
    entries,
    summary: {
      totalObservations:
        entries.length,
      passedObservations,
      failedClosedObservations,
      ownerReviewRequired,
      continuationRecommendation:
        ownerReviewRequired
          ? "PAUSE_FOR_OWNER_REVIEW" as const
          : "CONTINUE_SANITIZED_OBSERVATION" as const,
      formalQualificationAuthorized:
        false as const,
      runtimeActivationAuthorized:
        false as const,
      productionReadinessAuthorized:
        false as const,
    },
    createdAt:
      "2026-07-15T14:16:00.000Z",
    updatedAt:
      entries.length === 0
        ? "2026-07-15T14:16:00.000Z"
        : entries[
            entries.length - 1
          ].recordedAt,
  };

  return {
    ...ledgerCore,
    ledgerDigest:
      sha256(ledgerCore),
  };
}

describe(
  "Asha shadow qualification readiness evidence",
  () => {
    it(
      "creates immutable owner-review readiness evidence from a passing ledger",
      () => {
        const sessionValue =
          session();

        const ledgerValue =
          ledger(
            [
              "PASS",
              "PASS",
            ],
            sessionValue,
          );

        const evidence =
          createAshaShadowQualificationReadinessEvidence({
            readinessId:
              "asha-readiness-day-11-001",
            session:
              sessionValue,
            ledger:
              ledgerValue,
            reviewedAt:
              "2026-07-15T15:00:00.000Z",
          });

        expect(
          evidence.readinessState,
        ).toBe(
          "READY_FOR_OWNER_QUALIFICATION_REVIEW",
        );

        expect(
          evidence.readinessReason,
        ).toBe(
          "READY_FOR_OWNER_QUALIFICATION_REVIEW",
        );

        expect(
          evidence.ownerQualificationReviewEligible,
        ).toBe(true);

        expect(
          evidence.nextStep,
        ).toBe(
          "OWNER_REVIEW_BEFORE_FORMAL_QUALIFICATION_TESTING",
        );

        expect(
          evidence.observationEvidence,
        ).toHaveLength(2);

        expect(
          evidence.authorityBoundary
            .formalQualificationAuthorized,
        ).toBe(false);

        expect(
          evidence.authorityBoundary
            .qualificationEngineInvoked,
        ).toBe(false);

        expect(
          evidence.authorityBoundary
            .runtimeActivationAuthorized,
        ).toBe(false);

        expect(
          evidence.authorityBoundary
            .productionReadinessAuthorized,
        ).toBe(false);

        expect(
          Object.isFrozen(evidence),
        ).toBe(true);

        expect(
          Object.isFrozen(
            evidence.authorityBoundary,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            evidence.observationEvidence,
          ),
        ).toBe(true);
      },
    );

    it(
      "is deterministic for the same evidence input",
      () => {
        const sessionValue =
          session();

        const ledgerValue =
          ledger(
            [
              "PASS",
            ],
            sessionValue,
          );

        const input = {
          readinessId:
            "asha-readiness-day-11-002",
          session:
            sessionValue,
          ledger:
            ledgerValue,
          reviewedAt:
            "2026-07-15T15:00:00.000Z",
        };

        const first =
          createAshaShadowQualificationReadinessEvidence(
            input,
          );

        const second =
          createAshaShadowQualificationReadinessEvidence(
            input,
          );

        expect(
          first.readinessDigest,
        ).toBe(
          second.readinessDigest,
        );
      },
    );

    it(
      "fails closed when no observations exist",
      () => {
        const sessionValue =
          session();

        const evidence =
          createAshaShadowQualificationReadinessEvidence({
            readinessId:
              "asha-readiness-day-11-empty",
            session:
              sessionValue,
            ledger:
              ledger(
                [],
                sessionValue,
              ),
            reviewedAt:
              "2026-07-15T15:00:00.000Z",
          });

        expect(
          evidence.readinessState,
        ).toBe("BLOCKED");

        expect(
          evidence.readinessReason,
        ).toBe(
          "NO_SHADOW_OBSERVATIONS",
        );

        expect(
          evidence.ownerQualificationReviewEligible,
        ).toBe(false);
      },
    );

    it(
      "fails closed when any observation failed",
      () => {
        const sessionValue =
          session();

        const evidence =
          createAshaShadowQualificationReadinessEvidence({
            readinessId:
              "asha-readiness-day-11-failed",
            session:
              sessionValue,
            ledger:
              ledger(
                [
                  "PASS",
                  "FAIL_CLOSED",
                ],
                sessionValue,
              ),
            reviewedAt:
              "2026-07-15T15:00:00.000Z",
          });

        expect(
          evidence.readinessState,
        ).toBe("BLOCKED");

        expect(
          evidence.readinessReason,
        ).toBe(
          "FAILED_CLOSED_OBSERVATIONS_PRESENT",
        );

        expect(
          evidence.authorityBoundary
            .formalQualificationAuthorized,
        ).toBe(false);
      },
    );

    it(
      "blocks cross-tenant ledger binding",
      () => {
        const sessionValue =
          session();

        const ledgerValue =
          ledger(
            [
              "PASS",
            ],
            sessionValue,
          );

        const mismatchedSession =
          session({
            tenantId:
              "tenant-other-business",
          });

        expect(
          () =>
            createAshaShadowQualificationReadinessEvidence({
              readinessId:
                "asha-readiness-day-11-cross-tenant",
              session:
                mismatchedSession,
              ledger:
                ledgerValue,
              reviewedAt:
                "2026-07-15T15:00:00.000Z",
            }),
        ).toThrow(
          "does not belong to the supplied session",
        );
      },
    );

    it(
      "blocks owner identity mismatch",
      () => {
        const sessionValue =
          session();

        const ledgerValue =
          ledger(
            [
              "PASS",
            ],
            sessionValue,
          );

        const mismatchedSession =
          session({
            ownerId:
              "owner-other-001",
          });

        expect(
          () =>
            createAshaShadowQualificationReadinessEvidence({
              readinessId:
                "asha-readiness-day-11-owner-mismatch",
              session:
                mismatchedSession,
              ledger:
                ledgerValue,
              reviewedAt:
                "2026-07-15T15:00:00.000Z",
            }),
        ).toThrow(
          "does not belong to the supplied session",
        );
      },
    );

    it(
      "blocks a tampered ledger digest",
      () => {
        const sessionValue =
          session();

        const ledgerValue =
          ledger(
            [
              "PASS",
            ],
            sessionValue,
          );

        const tampered = {
          ...ledgerValue,
          ledgerDigest:
            sha256("tampered-ledger"),
        } as AshaShadowObservationLedger;

        expect(
          () =>
            createAshaShadowQualificationReadinessEvidence({
              readinessId:
                "asha-readiness-day-11-tampered-ledger",
              session:
                sessionValue,
              ledger:
                tampered,
              reviewedAt:
                "2026-07-15T15:00:00.000Z",
            }),
        ).toThrow(
          "ledger digest is invalid",
        );
      },
    );

    it(
      "blocks a tampered entry chain",
      () => {
        const sessionValue =
          session();

        const ledgerValue =
          ledger(
            [
              "PASS",
              "PASS",
            ],
            sessionValue,
          );

        const secondEntry = {
          ...ledgerValue.entries[1],
          previousEntryDigest:
            sha256("wrong-previous-entry"),
        };

        const tampered = {
          ...ledgerValue,
          entries: [
            ledgerValue.entries[0],
            secondEntry,
          ],
        } as AshaShadowObservationLedger;

        expect(
          () =>
            createAshaShadowQualificationReadinessEvidence({
              readinessId:
                "asha-readiness-day-11-tampered-chain",
              session:
                sessionValue,
              ledger:
                tampered,
              reviewedAt:
                "2026-07-15T15:00:00.000Z",
            }),
        ).toThrow(
          "ledger chain is invalid",
        );
      },
    );

    it(
      "blocks a tampered ledger summary",
      () => {
        const sessionValue =
          session();

        const ledgerValue =
          ledger(
            [
              "PASS",
            ],
            sessionValue,
          );

        const tampered = {
          ...ledgerValue,
          summary: {
            ...ledgerValue.summary,
            passedObservations:
              0,
          },
        } as AshaShadowObservationLedger;

        expect(
          () =>
            createAshaShadowQualificationReadinessEvidence({
              readinessId:
                "asha-readiness-day-11-tampered-summary",
              session:
                sessionValue,
              ledger:
                tampered,
              reviewedAt:
                "2026-07-15T15:00:00.000Z",
            }),
        ).toThrow(
          "ledger summary is invalid",
        );
      },
    );

    it(
      "blocks review timestamps before the latest ledger evidence",
      () => {
        const sessionValue =
          session();

        const ledgerValue =
          ledger(
            [
              "PASS",
            ],
            sessionValue,
          );

        expect(
          () =>
            createAshaShadowQualificationReadinessEvidence({
              readinessId:
                "asha-readiness-day-11-early-review",
              session:
                sessionValue,
              ledger:
                ledgerValue,
              reviewedAt:
                "2026-07-15T14:00:00.000Z",
            }),
        ).toThrow(
          "cannot precede the latest ledger evidence",
        );
      },
    );

    it(
      "never authorizes qualification, activation, production, delivery, or payments",
      () => {
        const sessionValue =
          session();

        const evidence =
          createAshaShadowQualificationReadinessEvidence({
            readinessId:
              "asha-readiness-day-11-boundary",
            session:
              sessionValue,
            ledger:
              ledger(
                [
                  "PASS",
                ],
                sessionValue,
              ),
            reviewedAt:
              "2026-07-15T15:00:00.000Z",
          });

        expect(
          evidence.authorityBoundary,
        ).toMatchObject({
          qualificationEngineInvoked:
            false,
          formalQualificationTestCasesCreated:
            false,
          formalQualificationAuthorized:
            false,
          qualifiedManifestCreated:
            false,
          activationCandidateCreated:
            false,
          runtimeActivationAuthorized:
            false,
          productionReadinessAuthorized:
            false,
          customerDataAccessAuthorized:
            false,
          customerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          productionMutationAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          autonomousDecisionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );
  },
);