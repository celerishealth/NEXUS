import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
} from "../engineeringAIWorkforceTemplatePreparedTransitionExecution";

import {
  validateEngineeringAIWorkforceQualificationAdmissionTransitionDecision,
} from "../engineeringAIWorkforceQualificationAdmissionTransitionDecision";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforceQualificationAdmissionTransitionApprovalRecord";

describe(
  "Engineering AI Workforce qualification-admission transition approval record",
  () => {
    it(
      "records the explicit verified-owner approval",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-qualification-admission-transition-approval-record-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION",
        );

        expect(
          decision.qualificationAdmissionTransitionApproved,
        ).toBe(true);
      },
    );

    it(
      "binds approval to the exact template-prepared execution",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
            .executionId,
        );

        expect(
          decision.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
            .executionDigest,
        );

        expect(
          decision.sourceFactoryFoundationDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
            .sourceFactoryFoundationDigest,
        );

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
              .executedAt,
          ),
        );
      },
    );

    it(
      "authorizes exactly eight admission transitions without executing them",
      () => {
        const candidates =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION
            .candidateQualificationAdmissionEligibility;

        expect(candidates).toHaveLength(8);

        expect(
          candidates.map(
            (candidate) =>
              candidate.publicName,
          ),
        ).toEqual([
          "Ishaan",
          "Leela",
          "Vivaan",
          "Anaya",
          "Atharv",
          "Mahir",
          "Zara",
          "Advik",
        ]);

        expect(
          candidates.every(
            (candidate) =>
              candidate.sourceLifecycleState ===
                "TEMPLATE_PREPARED" &&
              candidate.targetLifecycleState ===
                "QUALIFICATION_ADMISSION_PENDING" &&
              candidate.qualificationAdmissionTransitionAuthorized ===
                true &&
              candidate.qualificationAdmissionTransitionExecuted ===
                false &&
              candidate.qualificationAdmissionAuthorized ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not execute admission inside the approval record",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          qualificationAdmissionTransitionAuthorized:
            true,
          qualificationAdmissionTransitionExecuted:
            false,
          qualificationAdmissionAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          qualificationEvidenceAccepted:
            false,
          ownerQualificationApproved:
            false,
        });

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION",
        );
      },
    );

    it(
      "retains activation runtime repository deployment and external blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          activationCandidatePrepared:
            false,
          ownerActivationApproved:
            false,
          runtimeAuthorized:
            false,
          repositoryReadAuthorized:
            false,
          repositoryWriteAuthorized:
            false,
          branchCreationAuthorized:
            false,
          pullRequestPreparationAuthorized:
            false,
          mergeAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          secretsAccessAuthorized:
            false,
          controlledWorkAuthorized:
            false,
          realCustomerDataAccessAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          autonomousExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "records immutable digest-verified approval evidence",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(decision),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.candidateQualificationAdmissionEligibility,
          ),
        ).toBe(true);

        expect(
          decision.candidateQualificationAdmissionEligibility.every(
            (candidate) =>
              Object.isFrozen(candidate),
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceQualificationAdmissionTransitionDecision(
            decision,
          ),
        ).not.toThrow();
      },
    );
  },
);
