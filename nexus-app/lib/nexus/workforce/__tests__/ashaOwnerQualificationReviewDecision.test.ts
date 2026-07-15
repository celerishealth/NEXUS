import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_SHADOW_QUALIFICATION_READINESS_VERSION,
  type AshaShadowQualificationReadinessEvidence,
} from "../ashaShadowQualificationReadiness";

import {
  createAshaOwnerQualificationReviewDecision,
} from "../ashaOwnerQualificationReviewDecision";

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

function readyEvidence():
  AshaShadowQualificationReadinessEvidence {
  const readinessCore = {
    version:
      ASHA_SHADOW_QUALIFICATION_READINESS_VERSION,
    readinessId:
      "asha-readiness-day-12-ready",
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
    admissionDigest:
      sha256("admission-day-12"),
    evaluationReportDigest:
      sha256("evaluation-day-12"),
    sessionId:
      "asha-shadow-session-day-12",
    sessionDigest:
      sha256("session-day-12"),
    ledgerId:
      "asha-shadow-ledger-day-12",
    ledgerDigest:
      sha256("ledger-day-12"),
    observationEvidence: [
      {
        sequence:
          1,
        observationId:
          "asha-shadow-observation-day-12",
        observationDigest:
          sha256("observation-day-12"),
        score:
          100,
        outcome:
          "PASS" as const,
        recordedAt:
          "2026-07-15T15:10:00.000Z",
        entryDigest:
          sha256("entry-day-12"),
      },
    ],
    summary: {
      totalObservations:
        1,
      passedObservations:
        1,
      failedClosedObservations:
        0,
      ownerReviewRequired:
        false,
    },
    readinessState:
      "READY_FOR_OWNER_QUALIFICATION_REVIEW" as const,
    readinessReason:
      "READY_FOR_OWNER_QUALIFICATION_REVIEW" as const,
    ownerQualificationReviewEligible:
      true,
    nextStep:
      "OWNER_REVIEW_BEFORE_FORMAL_QUALIFICATION_TESTING" as const,
    authorityBoundary: {
      shadowEvidenceOnly:
        true,
      ownerReviewRequiredBeforeQualificationTesting:
        true,
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
    } as const,
    reviewedAt:
      "2026-07-15T15:30:00.000Z",
  };

  return {
    ...readinessCore,
    readinessDigest:
      sha256(readinessCore),
  };
}

function blockedEvidence():
  AshaShadowQualificationReadinessEvidence {
  const readinessCore = {
    version:
      ASHA_SHADOW_QUALIFICATION_READINESS_VERSION,
    readinessId:
      "asha-readiness-day-12-blocked",
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
    admissionDigest:
      sha256("admission-day-12"),
    evaluationReportDigest:
      sha256("evaluation-day-12"),
    sessionId:
      "asha-shadow-session-day-12",
    sessionDigest:
      sha256("session-day-12"),
    ledgerId:
      "asha-shadow-ledger-day-12",
    ledgerDigest:
      sha256("ledger-day-12"),
    observationEvidence: [],
    summary: {
      totalObservations:
        0,
      passedObservations:
        0,
      failedClosedObservations:
        0,
      ownerReviewRequired:
        false,
    },
    readinessState:
      "BLOCKED" as const,
    readinessReason:
      "NO_SHADOW_OBSERVATIONS" as const,
    ownerQualificationReviewEligible:
      false,
    nextStep:
      "CONTINUE_OR_REMEDIATE_SANITIZED_SHADOW_OBSERVATION" as const,
    authorityBoundary: {
      shadowEvidenceOnly:
        true,
      ownerReviewRequiredBeforeQualificationTesting:
        true,
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
    } as const,
    reviewedAt:
      "2026-07-15T15:30:00.000Z",
  };

  return {
    ...readinessCore,
    readinessDigest:
      sha256(readinessCore),
  };
}

describe(
  "Asha owner qualification-review decision gate",
  () => {
    it(
      "allows the bound owner to approve entry into qualification testing",
      () => {
        const decision =
          createAshaOwnerQualificationReviewDecision({
            readinessEvidence:
              readyEvidence(),
            decisionId:
              "asha-qualification-review-decision-001",
            ownerId:
              "owner-prashant-001",
            decision:
              "APPROVE_FORMAL_QUALIFICATION_TESTING",
            reason:
              "The verified shadow evidence is approved for the next controlled qualification-testing stage.",
            decidedAt:
              "2026-07-15T15:35:00.000Z",
          });

        expect(
          decision.ownerApprovedForQualificationTesting,
        ).toBe(true);

        expect(
          decision.qualificationTestingAdmissionEligible,
        ).toBe(true);

        expect(
          decision.authorityBoundary
            .qualificationTestingExecuted,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .qualificationEngineInvoked,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .formalQualificationIssued,
        ).toBe(false);

        expect(
          Object.isFrozen(decision),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.authorityBoundary,
          ),
        ).toBe(true);
      },
    );

    it(
      "allows the bound owner to reject qualification testing",
      () => {
        const decision =
          createAshaOwnerQualificationReviewDecision({
            readinessEvidence:
              readyEvidence(),
            decisionId:
              "asha-qualification-review-decision-002",
            ownerId:
              "owner-prashant-001",
            decision:
              "REJECT_FORMAL_QUALIFICATION_TESTING",
            reason:
              "The owner requires additional sanitized observation evidence before qualification testing.",
            decidedAt:
              "2026-07-15T15:35:00.000Z",
          });

        expect(
          decision.ownerApprovedForQualificationTesting,
        ).toBe(false);

        expect(
          decision.qualificationTestingAdmissionEligible,
        ).toBe(false);
      },
    );

    it(
      "blocks approval of non-ready evidence",
      () => {
        expect(
          () =>
            createAshaOwnerQualificationReviewDecision({
              readinessEvidence:
                blockedEvidence(),
              decisionId:
                "asha-qualification-review-blocked",
              ownerId:
                "owner-prashant-001",
              decision:
                "APPROVE_FORMAL_QUALIFICATION_TESTING",
              reason:
                "This approval must fail because no valid shadow observation evidence exists.",
              decidedAt:
                "2026-07-15T15:35:00.000Z",
            }),
        ).toThrow(
          "cannot be approved for formal qualification testing",
        );
      },
    );

    it(
      "blocks a cross-owner decision",
      () => {
        expect(
          () =>
            createAshaOwnerQualificationReviewDecision({
              readinessEvidence:
                readyEvidence(),
              decisionId:
                "asha-qualification-review-cross-owner",
              ownerId:
                "owner-other-001",
              decision:
                "APPROVE_FORMAL_QUALIFICATION_TESTING",
              reason:
                "A different owner must not approve this readiness-bound qualification-testing decision.",
              decidedAt:
                "2026-07-15T15:35:00.000Z",
            }),
        ).toThrow(
          "Only the readiness-bound owner",
        );
      },
    );

    it(
      "blocks tampered readiness evidence",
      () => {
        const evidence =
          readyEvidence();

        const tampered = {
          ...evidence,
          readinessDigest:
            sha256("tampered-readiness"),
        } as AshaShadowQualificationReadinessEvidence;

        expect(
          () =>
            createAshaOwnerQualificationReviewDecision({
              readinessEvidence:
                tampered,
              decisionId:
                "asha-qualification-review-tampered",
              ownerId:
                "owner-prashant-001",
              decision:
                "APPROVE_FORMAL_QUALIFICATION_TESTING",
              reason:
                "Tampered readiness evidence must never produce an owner qualification-review approval.",
              decidedAt:
                "2026-07-15T15:35:00.000Z",
            }),
        ).toThrow(
          "readiness evidence digest is invalid",
        );
      },
    );

    it(
      "blocks a decision before readiness evidence",
      () => {
        expect(
          () =>
            createAshaOwnerQualificationReviewDecision({
              readinessEvidence:
                readyEvidence(),
              decisionId:
                "asha-qualification-review-early",
              ownerId:
                "owner-prashant-001",
              decision:
                "APPROVE_FORMAL_QUALIFICATION_TESTING",
              reason:
                "A decision timestamp before readiness evidence must be blocked by the qualification-review gate.",
              decidedAt:
                "2026-07-15T15:00:00.000Z",
            }),
        ).toThrow(
          "cannot precede readiness evidence",
        );
      },
    );

    it(
      "creates a deterministic decision digest",
      () => {
        const input = {
          readinessEvidence:
            readyEvidence(),
          decisionId:
            "asha-qualification-review-deterministic",
          ownerId:
            "owner-prashant-001",
          decision:
            "APPROVE_FORMAL_QUALIFICATION_TESTING" as const,
          reason:
            "The same verified owner decision input must always create the same immutable decision digest.",
          decidedAt:
            "2026-07-15T15:35:00.000Z",
        };

        const first =
          createAshaOwnerQualificationReviewDecision(
            input,
          );

        const second =
          createAshaOwnerQualificationReviewDecision(
            input,
          );

        expect(
          first.decisionDigest,
        ).toBe(
          second.decisionDigest,
        );
      },
    );

    it(
      "never issues qualification, activation, production, delivery, or payment authority",
      () => {
        const decision =
          createAshaOwnerQualificationReviewDecision({
            readinessEvidence:
              readyEvidence(),
            decisionId:
              "asha-qualification-review-boundary",
            ownerId:
              "owner-prashant-001",
            decision:
              "APPROVE_FORMAL_QUALIFICATION_TESTING",
            reason:
              "Owner approval is limited to controlled qualification-testing admission and grants no wider authority.",
            decidedAt:
              "2026-07-15T15:35:00.000Z",
          });

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          approvalBypassAllowed:
            false,
          qualificationTestingExecuted:
            false,
          qualificationEngineInvoked:
            false,
          formalQualificationIssued:
            false,
          qualifiedManifestCreated:
            false,
          activationCandidateCreated:
            false,
          runtimeActivated:
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