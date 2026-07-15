
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

async function packet() {
  return createAshaOwnerCertificationReviewPacket({
    evaluation:
      await evaluation(),
    tenantId:
      "tenant-ppa-industrial",
    preparedAt:
      "2026-07-15T14:00:00.000Z",
  });
}

async function approval() {
  const reviewPacket =
    await packet();

  return {
    reviewPacket,
    decision:
      createAshaOwnerCertificationDecision({
        packet:
          reviewPacket,
        decisionId:
          "asha-shadow-decision-001",
        ownerId:
          "owner-prashant-001",
        decision:
          "APPROVE_SHADOW_MODE",
        reason:
          "The independent 400-case evidence is accepted for controlled shadow observation only.",
        decidedAt:
          "2026-07-15T14:05:00.000Z",
      }),
  };
}

async function admission() {
  const approved =
    await approval();

  return createAshaShadowModeAdmission({
    packet:
      approved.reviewPacket,
    decision:
      approved.decision,
    admissionId:
      "asha-shadow-admission-001",
    tenantId:
      "tenant-ppa-industrial",
    admittedAt:
      "2026-07-15T14:10:00.000Z",
    expiresAt:
      "2026-07-22T14:10:00.000Z",
  });
}

describe(
  "Asha owner certification and shadow admission",
  () => {
    it(
      "binds the review packet to the exact 400-case evaluation",
      async () => {
        const reviewPacket =
          await packet();

        const report =
          await evaluation();

        expect(
          reviewPacket
            .evaluationReportDigest,
        ).toBe(
          report.reportDigest,
        );

        expect(
          reviewPacket
            .evaluationSummary
            .totalCases,
        ).toBe(400);

        expect(
          reviewPacket
            .evaluationSummary
            .passedCases,
        ).toBe(400);

        expect(
          reviewPacket
            .evaluationSummary
            .foundationCases,
        ).toBe(100);

        expect(
          reviewPacket
            .evaluationSummary
            .specialistCases,
        ).toBe(300);
      },
    );

    it(
      "blocks incomplete or tampered evaluation evidence",
      async () => {
        const report =
          await evaluation();

        const tampered = {
          ...report,
          passedCases:
            399,
        } as unknown as
          AshaIndependentEvaluationReport;

        expect(() =>
          createAshaOwnerCertificationReviewPacket({
            evaluation:
              tampered,
            tenantId:
              "tenant-ppa-industrial",
            preparedAt:
              "2026-07-15T14:00:00.000Z",
          }),
        ).toThrow(
          "exactly 400 passing executable cases",
        );
      },
    );

    it(
      "requires the evaluation-bound owner for certification",
      async () => {
        const reviewPacket =
          await packet();

        expect(() =>
          createAshaOwnerCertificationDecision({
            packet:
              reviewPacket,
            decisionId:
              "asha-shadow-decision-owner-mismatch",
            ownerId:
              "owner-other-001",
            decision:
              "APPROVE_SHADOW_MODE",
            reason:
              "This unauthorized owner must not approve the shadow-mode certification.",
            decidedAt:
              "2026-07-15T14:05:00.000Z",
          }),
        ).toThrow(
          "Only the evaluation-bound owner",
        );
      },
    );

    it(
      "records explicit owner approval only for shadow mode",
      async () => {
        const approved =
          await approval();

        expect(
          approved.decision
            .approvedForShadowMode,
        ).toBe(true);

        expect(
          approved.decision
            .shadowModeAdmissionEligible,
        ).toBe(true);

        expect(
          approved.decision
            .authorityBoundary
            .formalQualificationIssued,
        ).toBe(false);

        expect(
          approved.decision
            .authorityBoundary
            .runtimeActivated,
        ).toBe(false);

        expect(
          approved.decision
            .authorityBoundary
            .productionReadinessAuthorized,
        ).toBe(false);
      },
    );

    it(
      "keeps owner rejection fail-closed",
      async () => {
        const reviewPacket =
          await packet();

        const rejection =
          createAshaOwnerCertificationDecision({
            packet:
              reviewPacket,
            decisionId:
              "asha-shadow-decision-reject-001",
            ownerId:
              "owner-prashant-001",
            decision:
              "REJECT_SHADOW_MODE",
            reason:
              "Shadow-mode admission is rejected pending further owner review and evidence.",
            decidedAt:
              "2026-07-15T14:05:00.000Z",
          });

        expect(
          rejection
            .approvedForShadowMode,
        ).toBe(false);

        expect(() =>
          createAshaShadowModeAdmission({
            packet:
              reviewPacket,
            decision:
              rejection,
            admissionId:
              "asha-shadow-admission-rejected",
            tenantId:
              "tenant-ppa-industrial",
            admittedAt:
              "2026-07-15T14:10:00.000Z",
            expiresAt:
              "2026-07-22T14:10:00.000Z",
          }),
        ).toThrow(
          "Rejected owner certification cannot create shadow-mode admission",
        );
      },
    );

    it(
      "creates sanitized shadow observation without activation",
      async () => {
        const shadowAdmission =
          await admission();

        expect(
          shadowAdmission
            .admissionState,
        ).toBe(
          "ACTIVE_SHADOW_OBSERVATION",
        );

        expect(
          shadowAdmission.mode,
        ).toBe(
          "SANITIZED_OR_SYNTHETIC_SHADOW_OBSERVATION_ONLY",
        );

        expect(
          shadowAdmission
            .shadowAuthority
            .internalAssessmentAuthorized,
        ).toBe(true);

        expect(
          shadowAdmission
            .shadowAuthority
            .sanitizedOrSyntheticInputsOnly,
        ).toBe(true);

        expect(
          shadowAdmission
            .shadowAuthority
            .runtimeActivationAuthorized,
        ).toBe(false);

        expect(
          shadowAdmission
            .shadowAuthority
            .formalQualificationAuthorized,
        ).toBe(false);
      },
    );

    it(
      "blocks cross-tenant shadow-mode admission",
      async () => {
        const approved =
          await approval();

        expect(() =>
          createAshaShadowModeAdmission({
            packet:
              approved.reviewPacket,
            decision:
              approved.decision,
            admissionId:
              "asha-shadow-admission-other-tenant",
            tenantId:
              "tenant-other-business",
            admittedAt:
              "2026-07-15T14:10:00.000Z",
            expiresAt:
              "2026-07-22T14:10:00.000Z",
          }),
        ).toThrow(
          "Cross-tenant shadow-mode admission is blocked",
        );
      },
    );

    it(
      "requires exact packet and decision binding",
      async () => {
        const approved =
          await approval();

        const tamperedDecision = {
          ...approved.decision,
          packetDigest:
            "a".repeat(64),
        };

        expect(() =>
          createAshaShadowModeAdmission({
            packet:
              approved.reviewPacket,
            decision:
              tamperedDecision,
            admissionId:
              "asha-shadow-admission-tampered",
            tenantId:
              "tenant-ppa-industrial",
            admittedAt:
              "2026-07-15T14:10:00.000Z",
            expiresAt:
              "2026-07-22T14:10:00.000Z",
          }),
        ).toThrow(
          "decision digest integrity check failed",
        );
      },
    );

    it(
      "limits shadow admission to 30 days",
      async () => {
        const approved =
          await approval();

        expect(() =>
          createAshaShadowModeAdmission({
            packet:
              approved.reviewPacket,
            decision:
              approved.decision,
            admissionId:
              "asha-shadow-admission-too-long",
            tenantId:
              "tenant-ppa-industrial",
            admittedAt:
              "2026-07-15T14:10:00.000Z",
            expiresAt:
              "2026-09-15T14:10:00.000Z",
          }),
        ).toThrow(
          "cannot exceed 30 days",
        );
      },
    );

    it(
      "supports immediate owner emergency pause",
      async () => {
        const shadowAdmission =
          await admission();

        const termination =
          terminateAshaShadowModeAdmission({
            admission:
              shadowAdmission,
            terminationId:
              "asha-shadow-termination-emergency-001",
            ownerId:
              "owner-prashant-001",
            action:
              "EMERGENCY_PAUSE",
            reason:
              "Emergency pause applied because owner review requires immediate shadow-mode termination.",
            terminatedAt:
              "2026-07-15T14:20:00.000Z",
          });

        expect(
          termination.currentState,
        ).toBe("TERMINATED");

        expect(
          termination
            .shadowWorkAuthorized,
        ).toBe(false);

        expect(
          termination
            .emergencyPauseApplied,
        ).toBe(true);

        expect(
          termination
            .ownerRevocationApplied,
        ).toBe(false);
      },
    );

    it(
      "blocks non-owner shadow-mode termination",
      async () => {
        const shadowAdmission =
          await admission();

        expect(() =>
          terminateAshaShadowModeAdmission({
            admission:
              shadowAdmission,
            terminationId:
              "asha-shadow-termination-unauthorized",
            ownerId:
              "owner-other-001",
            action:
              "OWNER_REVOKE",
            reason:
              "An unauthorized identity must not revoke the owner-controlled shadow admission.",
            terminatedAt:
              "2026-07-15T14:20:00.000Z",
          }),
        ).toThrow(
          "Only the admission owner",
        );
      },
    );

    it(
      "creates deterministic immutable certification evidence",
      async () => {
        const firstPacket =
          await packet();

        const secondPacket =
          await packet();

        expect(
          firstPacket.packetDigest,
        ).toBe(
          secondPacket.packetDigest,
        );

        const firstAdmission =
          await admission();

        const secondAdmission =
          await admission();

        expect(
          firstAdmission
            .admissionDigest,
        ).toBe(
          secondAdmission
            .admissionDigest,
        );

        expect(
          Object.isFrozen(
            firstPacket,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            firstAdmission,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            firstAdmission
              .shadowAuthority,
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps every production and customer-facing action blocked",
      async () => {
        const shadowAdmission =
          await admission();

        expect(
          shadowAdmission
            .shadowAuthority
            .customerDataAccessAuthorized,
        ).toBe(false);

        expect(
          shadowAdmission
            .shadowAuthority
            .customerContactAuthorized,
        ).toBe(false);

        expect(
          shadowAdmission
            .shadowAuthority
            .externalDeliveryAuthorized,
        ).toBe(false);

        expect(
          shadowAdmission
            .shadowAuthority
            .liveProviderExecutionAuthorized,
        ).toBe(false);

        expect(
          shadowAdmission
            .shadowAuthority
            .productionMutationAuthorized,
        ).toBe(false);

        expect(
          shadowAdmission
            .shadowAuthority
            .paymentExecutionAuthorized,
        ).toBe(false);

        expect(
          shadowAdmission
            .shadowAuthority
            .publicLaunchAuthorized,
        ).toBe(false);
      },
    );
  },
);
