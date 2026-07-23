import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
} from "../engineeringAIWorkforceQualificationAdmissionTransitionExecution";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISION_VERSION,
  createEngineeringAIWorkforceQualificationExecutionTransitionDecision,
  validateEngineeringAIWorkforceQualificationExecutionTransitionDecision,
} from "../engineeringAIWorkforceQualificationExecutionTransitionDecision";

const decisionTime =
  new Date(
    Date.parse(
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
        .executedAt,
    ) + 1,
  ).toISOString();

function createApprovedDecision() {
  return createEngineeringAIWorkforceQualificationExecutionTransitionDecision({
    qualificationAdmissionTransitionExecution:
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
    decisionId:
      "engineering-ai-workforce-qualification-execution-owner-approval-test-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION",
    reason:
      "Owner approves only the next sequential transition from QUALIFICATION_ADMISSION_PENDING to QUALIFICATION_IN_PROGRESS. No fixture execution, qualification evidence creation or acceptance, owner qualification approval, activation, runtime, repository access, deployment, customer contact, payment, autonomous execution, or public launch is authorized by this decision contract.",
    decidedAt:
      decisionTime,
  });
}

describe(
  "Engineering AI Workforce qualification-execution transition decision",
  () => {
    it(
      "creates the bounded owner decision contract",
      () => {
        const decision =
          createApprovedDecision();

        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISION_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-qualification-execution-transition-decision-v1",
        );

        expect(
          decision.decisionState,
        ).toBe(
          "OWNER_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION_DECISION_RECORDED",
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION",
        );

        expect(
          decision.qualificationExecutionTransitionApproved,
        ).toBe(true);
      },
    );

    it(
      "binds exactly eight admitted Engineering candidates",
      () => {
        const candidates =
          createApprovedDecision()
            .candidateQualificationExecutionEligibility;

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
                "QUALIFICATION_ADMISSION_PENDING" &&
              candidate.targetLifecycleState ===
                "QUALIFICATION_IN_PROGRESS" &&
              candidate.qualificationExecutionTransitionAuthorized ===
                true &&
              candidate.qualificationExecutionTransitionExecuted ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false &&
              candidate.qualificationFixtureExecutionStarted ===
                false &&
              candidate.qualificationEvidenceCreated ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not start qualification inside the decision contract",
      () => {
        const decision =
          createApprovedDecision();

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          qualificationExecutionTransitionAuthorized:
            true,
          qualificationExecutionTransitionExecuted:
            false,
          qualificationExecutionAuthorized:
            false,
          qualificationFixtureExecutionStarted:
            false,
          qualificationFixtureExecutionCompleted:
            false,
          qualificationEvidenceCreated:
            false,
          qualificationEvidenceAccepted:
            false,
          ownerQualificationApproved:
            false,
        });

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION",
        );
      },
    );

    it(
      "supports rejection while retaining admission-pending state",
      () => {
        const rejected =
          createEngineeringAIWorkforceQualificationExecutionTransitionDecision({
            qualificationAdmissionTransitionExecution:
              ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-qualification-execution-owner-rejection-test-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_QUALIFICATION_ADMISSION_PENDING",
            reason:
              "Owner rejects qualification execution and retains all eight Engineering candidates at QUALIFICATION_ADMISSION_PENDING without fixture execution, qualification evidence, activation, runtime, repository, deployment, customer, payment, autonomous, or public-launch authority.",
            decidedAt:
              decisionTime,
          });

        expect(
          rejected.qualificationExecutionTransitionApproved,
        ).toBe(false);

        expect(
          rejected.candidateQualificationExecutionEligibility.every(
            (candidate) =>
              candidate.qualificationExecutionTransitionAuthorized ===
                false &&
              candidate.qualificationExecutionTransitionExecuted ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false &&
              candidate.qualificationFixtureExecutionStarted ===
                false,
          ),
        ).toBe(true);

        expect(
          rejected.nextStep,
        ).toBe(
          "RETAIN_ENGINEERING_QUALIFICATION_ADMISSION_PENDING",
        );
      },
    );

    it(
      "rejects an invalid owner",
      () => {
        expect(() =>
          createEngineeringAIWorkforceQualificationExecutionTransitionDecision({
            qualificationAdmissionTransitionExecution:
              ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-qualification-execution-invalid-owner-test-001",
            ownerId:
              "owner-invalid-001" as unknown as
                typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION",
            reason:
              "An invalid actor must never authorize Engineering qualification execution.",
            decidedAt:
              decisionTime,
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "fails closed when decision predates qualification admission",
      () => {
        expect(() =>
          createEngineeringAIWorkforceQualificationExecutionTransitionDecision({
            qualificationAdmissionTransitionExecution:
              ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-qualification-execution-too-early-test-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION",
            reason:
              "This intentionally invalid decision attempts to precede qualification admission and must fail closed.",
            decidedAt:
              new Date(
                Date.parse(
                  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
                    .executedAt,
                ) - 1,
              ).toISOString(),
          }),
        ).toThrow(
          "cannot precede",
        );
      },
    );

    it(
      "retains activation runtime repository and external blocks with immutable evidence",
      () => {
        const first =
          createApprovedDecision();

        const second =
          createApprovedDecision();

        expect(second).toEqual(first);

        expect(
          first.authorityBoundary,
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

        expect(
          first.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateQualificationExecutionEligibility,
          ),
        ).toBe(true);

        expect(
          first.candidateQualificationExecutionEligibility.every(
            (candidate) =>
              Object.isFrozen(candidate),
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceQualificationExecutionTransitionDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
