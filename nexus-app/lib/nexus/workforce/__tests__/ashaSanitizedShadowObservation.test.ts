
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  executeAshaIndependentEvaluation,
  type AshaIndependentEvaluationReport,
} from "../ashaIndependentEvaluationHarness";

import {
  createAshaOwnerCertificationDecision,
  createAshaOwnerCertificationReviewPacket,
  createAshaShadowModeAdmission,
  terminateAshaShadowModeAdmission,
} from "../ashaOwnerCertificationShadowAdmission";

import {
  appendAshaShadowObservationLedger,
  createAshaSanitizedShadowSession,
  createAshaShadowObservationLedger,
  createAshaShadowSanitizationEvidence,
  executeAshaShadowObservation,
  type AshaSanitizedShadowSession,
  type AshaShadowObservation,
  type AshaShadowOwnerReference,
} from "../ashaSanitizedShadowObservation";

import type {
  AshaSpecialistInquiryAssessmentInput,
} from "../ashaSpecialistInquiryAssessment";

let evaluationPromise:
  Promise<AshaIndependentEvaluationReport> |
  null = null;

function evaluation():
  Promise<AshaIndependentEvaluationReport> {
  if (!evaluationPromise) {
    evaluationPromise =
      executeAshaIndependentEvaluation({
        evaluatorId:
          "evaluator-asha-independent-001",
        ownerId:
          "owner-prashant-001",
        evaluatedAt:
          "2026-07-15T13:00:00.000Z",
      });
  }

  return evaluationPromise;
}

async function admission() {
  const report =
    await evaluation();

  const packet =
    createAshaOwnerCertificationReviewPacket({
      evaluation:
        report,
      tenantId:
        "tenant-ppa-industrial",
      preparedAt:
        "2026-07-15T14:00:00.000Z",
    });

  const decision =
    createAshaOwnerCertificationDecision({
      packet,
      decisionId:
        "asha-shadow-decision-day-10",
      ownerId:
        "owner-prashant-001",
      decision:
        "APPROVE_SHADOW_MODE",
      reason:
        "The owner approves sanitized shadow observation only for controlled scoring and evidence review.",
      decidedAt:
        "2026-07-15T14:05:00.000Z",
    });

  return createAshaShadowModeAdmission({
    packet,
    decision,
    admissionId:
      "asha-shadow-admission-day-10",
    tenantId:
      "tenant-ppa-industrial",
    admittedAt:
      "2026-07-15T14:10:00.000Z",
    expiresAt:
      "2026-07-22T14:10:00.000Z",
  });
}

async function session():
  Promise<AshaSanitizedShadowSession> {
  return createAshaSanitizedShadowSession({
    admission:
      await admission(),
    sessionId:
      "asha-shadow-session-day-10",
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    openedAt:
      "2026-07-15T14:15:00.000Z",
  });
}

function inquiry(
  suffix = "001",
): AshaSpecialistInquiryAssessmentInput {
  return {
    evaluationMode:
      "ISOLATED_EVALUATION",
    tenantId:
      "tenant-ppa-industrial",
    inquiryId:
      "shadow-inquiry-" +
      suffix,
    customerRef:
      "shadow-customer-" +
      suffix,
    channel:
      "WEB",
    message:
      "Please prepare a quotation for industrial safety helmets.",
    idempotencyKey:
      "shadow-idempotency-" +
      suffix,
    verifiedFacts: [
      {
        key:
          "product",
        value:
          "Industrial safety helmets",
        source:
          "CUSTOMER",
      },
      {
        key:
          "quantity",
        value:
          "100",
        source:
          "CUSTOMER",
      },
    ],
    priorContext:
      null,
    duplicateCandidates: [],
  };
}

function reference(
  overrides:
    Partial<AshaShadowOwnerReference> = {},
): AshaShadowOwnerReference {
  return {
    preparedByOwnerId:
      "owner-prashant-001",
    expectedIntent:
      "QUOTE",
    expectedDepartment:
      "SALES",
    expectedUrgency:
      "NORMAL",
    expectedEscalationRequired:
      false,
    expectedClarificationRequired:
      false,
    expectedCompletenessPercent:
      100,
    referenceReason:
      "Owner reference created for a complete sanitized quotation inquiry.",
    ...overrides,
  };
}

function evidence(
  suffix = "001",
) {
  return createAshaShadowSanitizationEvidence({
    evidenceId:
      "shadow-sanitization-" +
      suffix,
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    sourceMode:
      "SYNTHETIC",
    sourceLabel:
      "Synthetic industrial quotation scenario " +
      suffix,
    containsDirectCustomerData:
      false,
    containsSecrets:
      false,
    containsProductionIdentifiers:
      false,
    sanitizedAt:
      "2026-07-15T14:16:00.000Z",
  });
}

async function observation(
  suffix = "001",
  ownerReference =
    reference(),
): Promise<AshaShadowObservation> {
  return executeAshaShadowObservation({
    session:
      await session(),
    termination:
      null,
    observationId:
      "asha-shadow-observation-" +
      suffix,
    sanitizationEvidence:
      evidence(suffix),
    inquiry:
      inquiry(suffix),
    ownerReference,
    observedAt:
      "2026-07-15T14:17:00.000Z",
  });
}

describe(
  "Asha sanitized shadow observation",
  () => {
    it(
      "opens an admission-bound sanitized shadow session",
      async () => {
        const shadowSession =
          await session();

        expect(
          shadowSession
            .sessionState,
        ).toBe(
          "ACTIVE_SANITIZED_OBSERVATION",
        );

        expect(
          shadowSession
            .sourceRestriction,
        ).toBe(
          "SANITIZED_OR_SYNTHETIC_ONLY",
        );

        expect(
          shadowSession
            .authorityBoundary
            .runtimeActivationAuthorized,
        ).toBe(false);
      },
    );

    it(
      "blocks customer, secret and production-bearing shadow input",
      () => {
        expect(() =>
          createAshaShadowSanitizationEvidence({
            evidenceId:
              "shadow-sanitization-unsafe",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            sourceMode:
              "SANITIZED",
            sourceLabel:
              "Unsafe customer-bearing scenario",
            containsDirectCustomerData:
              true,
            containsSecrets:
              false,
            containsProductionIdentifiers:
              false,
            sanitizedAt:
              "2026-07-15T14:16:00.000Z",
          } as unknown as Parameters<
            typeof createAshaShadowSanitizationEvidence
          >[0]),
        ).toThrow(
          "customer, secret, or production data is blocked",
        );
      },
    );

    it(
      "scores exact owner comparison at 100",
      async () => {
        const result =
          await observation();

        expect(
          result.ownerComparison
            .achievedScore,
        ).toBe(100);

        expect(
          result.ownerComparison
            .outcome,
        ).toBe("PASS");

        expect(
          result.ownerComparison
            .ownerReviewRequired,
        ).toBe(false);

        expect(
          result.ownerComparison
            .criteria,
        ).toHaveLength(6);
      },
    );

    it(
      "keeps critical scoring mismatch fail-closed",
      async () => {
        const result =
          await observation(
            "critical-mismatch",
            reference({
              expectedDepartment:
                "TECHNICAL_SUPPORT",
            }),
          );

        expect(
          result.ownerComparison
            .criticalMismatch,
        ).toBe(true);

        expect(
          result.ownerComparison
            .outcome,
        ).toBe("FAIL_CLOSED");

        expect(
          result.ownerComparison
            .ownerReviewRequired,
        ).toBe(true);
      },
    );

    it(
      "blocks cross-tenant shadow inquiries",
      async () => {
        const shadowSession =
          await session();

        expect(() =>
          executeAshaShadowObservation({
            session:
              shadowSession,
            termination:
              null,
            observationId:
              "asha-shadow-observation-cross-tenant",
            sanitizationEvidence:
              evidence(
                "cross-tenant",
              ),
            inquiry: {
              ...inquiry(
                "cross-tenant",
              ),
              tenantId:
                "tenant-other-business",
            },
            ownerReference:
              reference(),
            observedAt:
              "2026-07-15T14:17:00.000Z",
          }),
        ).toThrow(
          "Cross-tenant shadow inquiry is blocked",
        );
      },
    );

    it(
      "enforces admission expiry",
      async () => {
        const shadowSession =
          await session();

        expect(() =>
          executeAshaShadowObservation({
            session:
              shadowSession,
            termination:
              null,
            observationId:
              "asha-shadow-observation-expired",
            sanitizationEvidence:
              evidence("expired"),
            inquiry:
              inquiry("expired"),
            ownerReference:
              reference(),
            observedAt:
              "2026-07-22T14:10:00.000Z",
          }),
        ).toThrow(
          "outside the active admission window",
        );
      },
    );

    it(
      "enforces emergency pause before further observation",
      async () => {
        const shadowAdmission =
          await admission();

        const shadowSession =
          createAshaSanitizedShadowSession({
            admission:
              shadowAdmission,
            sessionId:
              "asha-shadow-session-emergency",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            openedAt:
              "2026-07-15T14:15:00.000Z",
          });

        const termination =
          terminateAshaShadowModeAdmission({
            admission:
              shadowAdmission,
            terminationId:
              "asha-shadow-termination-day-10",
            ownerId:
              "owner-prashant-001",
            action:
              "EMERGENCY_PAUSE",
            reason:
              "The owner immediately paused the sanitized shadow observation session.",
            terminatedAt:
              "2026-07-15T14:16:30.000Z",
          });

        expect(() =>
          executeAshaShadowObservation({
            session:
              shadowSession,
            termination,
            observationId:
              "asha-shadow-observation-after-pause",
            sanitizationEvidence:
              evidence("after-pause"),
            inquiry:
              inquiry("after-pause"),
            ownerReference:
              reference(),
            observedAt:
              "2026-07-15T14:17:00.000Z",
          }),
        ).toThrow(
          "Emergency pause or owner revocation blocks further shadow observation",
        );
      },
    );

    it(
      "creates deterministic immutable observation evidence",
      async () => {
        const first =
          await observation(
            "deterministic",
          );

        const second =
          await observation(
            "deterministic",
          );

        expect(
          first.observationDigest,
        ).toBe(
          second.observationDigest,
        );

        expect(
          first.observationDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.ownerComparison,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.ownerComparison
              .criteria,
          ),
        ).toBe(true);
      },
    );

    it(
      "creates an immutable chained observation ledger",
      async () => {
        const shadowSession =
          await session();

        const first =
          await observation(
            "ledger-pass",
          );

        const failed =
          await observation(
            "ledger-fail",
            reference({
              expectedIntent:
                "TECHNICAL_SUPPORT",
            }),
          );

        const emptyLedger =
          createAshaShadowObservationLedger({
            ledgerId:
              "asha-shadow-ledger-day-10",
            session:
              shadowSession,
            createdAt:
              "2026-07-15T14:18:00.000Z",
          });

        const oneEntry =
          appendAshaShadowObservationLedger({
            ledger:
              emptyLedger,
            session:
              shadowSession,
            observation:
              first,
            recordedAt:
              "2026-07-15T14:19:00.000Z",
          });

        const twoEntries =
          appendAshaShadowObservationLedger({
            ledger:
              oneEntry,
            session:
              shadowSession,
            observation:
              failed,
            recordedAt:
              "2026-07-15T14:20:00.000Z",
          });

        expect(
          twoEntries.entries,
        ).toHaveLength(2);

        expect(
          twoEntries.entries[1]
            .previousEntryDigest,
        ).toBe(
          twoEntries.entries[0]
            .entryDigest,
        );

        expect(
          twoEntries.summary
            .passedObservations,
        ).toBe(1);

        expect(
          twoEntries.summary
            .failedClosedObservations,
        ).toBe(1);

        expect(
          twoEntries.summary
            .continuationRecommendation,
        ).toBe(
          "PAUSE_FOR_OWNER_REVIEW",
        );

        expect(
          Object.isFrozen(
            twoEntries,
          ),
        ).toBe(true);
      },
    );

    it(
      "blocks duplicate observation ledger entries",
      async () => {
        const shadowSession =
          await session();

        const result =
          await observation(
            "duplicate-ledger",
          );

        const emptyLedger =
          createAshaShadowObservationLedger({
            ledgerId:
              "asha-shadow-ledger-duplicate",
            session:
              shadowSession,
            createdAt:
              "2026-07-15T14:18:00.000Z",
          });

        const ledger =
          appendAshaShadowObservationLedger({
            ledger:
              emptyLedger,
            session:
              shadowSession,
            observation:
              result,
            recordedAt:
              "2026-07-15T14:19:00.000Z",
          });

        expect(() =>
          appendAshaShadowObservationLedger({
            ledger,
            session:
              shadowSession,
            observation:
              result,
            recordedAt:
              "2026-07-15T14:20:00.000Z",
          }),
        ).toThrow(
          "Duplicate shadow observation ledger entry is blocked",
        );
      },
    );

    it(
      "blocks tampered sanitization evidence",
      async () => {
        const shadowSession =
          await session();

        const validEvidence =
          evidence("tampered");

        const tamperedEvidence = {
          ...validEvidence,
          sourceLabel:
            "Tampered source label",
        };

        expect(() =>
          executeAshaShadowObservation({
            session:
              shadowSession,
            termination:
              null,
            observationId:
              "asha-shadow-observation-tampered",
            sanitizationEvidence:
              tamperedEvidence,
            inquiry:
              inquiry("tampered"),
            ownerReference:
              reference(),
            observedAt:
              "2026-07-15T14:17:00.000Z",
          }),
        ).toThrow(
          "sanitization evidence digest integrity check failed",
        );
      },
    );

    it(
      "blocks cross-tenant session opening",
      async () => {
        const shadowAdmission =
          await admission();

        expect(() =>
          createAshaSanitizedShadowSession({
            admission:
              shadowAdmission,
            sessionId:
              "asha-shadow-session-other-tenant",
            tenantId:
              "tenant-other-business",
            ownerId:
              "owner-prashant-001",
            openedAt:
              "2026-07-15T14:15:00.000Z",
          }),
        ).toThrow(
          "Cross-tenant sanitized shadow session is blocked",
        );
      },
    );

    it(
      "keeps production, activation and customer-facing authority blocked",
      async () => {
        const result =
          await observation(
            "safety-boundary",
          );

        expect(
          result.safetyBoundary
            .formalQualificationIssued,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .runtimeActivated,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .customerContactPerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .externalDeliveryPerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .liveProviderExecutionPerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .productionMutationPerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .paymentExecutionPerformed,
        ).toBe(false);

        expect(
          result.safetyBoundary
            .publicLaunchAuthorized,
        ).toBe(false);
      },
    );
  },
);
