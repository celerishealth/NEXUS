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
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISION_VERSION,
  createEngineeringAIWorkforceQualificationAdmissionTransitionDecision,
  validateEngineeringAIWorkforceQualificationAdmissionTransitionDecision,
} from "../engineeringAIWorkforceQualificationAdmissionTransitionDecision";

const decisionTime =
  new Date(
    Date.parse(
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
        .executedAt,
    ) + 1,
  ).toISOString();

function createApprovedDecision() {
  return createEngineeringAIWorkforceQualificationAdmissionTransitionDecision({
    templatePreparedTransitionExecution:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
    decisionId:
      "engineering-ai-workforce-qualification-admission-owner-approval-test-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION",
    reason:
      "Owner approves only the next sequential Engineering Factory transition from TEMPLATE_PREPARED to QUALIFICATION_ADMISSION_PENDING while qualification execution, evidence acceptance, activation, runtime, repository access, deployment, customer contact, payments, legal commitments, autonomous execution, and public launch remain blocked.",
    decidedAt:
      decisionTime,
  });
}

describe(
  "Engineering AI Workforce qualification-admission transition decision",
  () => {
    it(
      "creates the exact bounded owner decision contract",
      () => {
        const decision =
          createApprovedDecision();

        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISION_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-qualification-admission-transition-decision-v1",
        );

        expect(
          decision.decisionState,
        ).toBe(
          "OWNER_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION_DECISION_RECORDED",
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
      "binds exactly eight prepared Engineering candidates",
      () => {
        const candidates =
          createApprovedDecision()
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
              candidate.sourceTemplatePreparedTransitionExecuted ===
                true &&
              candidate.sourceTemplatePrepared ===
                true &&
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
      "records a decision without executing qualification admission",
      () => {
        const decision =
          createApprovedDecision();

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
      "supports rejection while retaining every template prepared",
      () => {
        const rejected =
          createEngineeringAIWorkforceQualificationAdmissionTransitionDecision({
            templatePreparedTransitionExecution:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-qualification-admission-owner-rejection-test-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_TEMPLATES_PREPARED",
            reason:
              "Owner rejects qualification admission and retains all eight Engineering candidates at TEMPLATE_PREPARED without qualification execution, activation, runtime, repository, deployment, customer, payment, legal, autonomous, or public-launch authority.",
            decidedAt:
              decisionTime,
          });

        expect(
          rejected.qualificationAdmissionTransitionApproved,
        ).toBe(false);

        expect(
          rejected.candidateQualificationAdmissionEligibility.every(
            (candidate) =>
              candidate.qualificationAdmissionTransitionAuthorized ===
                false &&
              candidate.qualificationAdmissionTransitionExecuted ===
                false &&
              candidate.qualificationAdmissionAuthorized ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          rejected.nextStep,
        ).toBe(
          "RETAIN_ENGINEERING_TEMPLATES_PREPARED",
        );
      },
    );

    it(
      "rejects an invalid owner",
      () => {
        expect(() =>
          createEngineeringAIWorkforceQualificationAdmissionTransitionDecision({
            templatePreparedTransitionExecution:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-qualification-admission-invalid-owner-test-001",
            ownerId:
              "owner-invalid-001" as unknown as
                typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION",
            reason:
              "An invalid actor must never authorize Engineering qualification admission.",
            decidedAt:
              decisionTime,
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "fails closed when the decision predates template preparation",
      () => {
        expect(() =>
          createEngineeringAIWorkforceQualificationAdmissionTransitionDecision({
            templatePreparedTransitionExecution:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-qualification-admission-too-early-test-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION",
            reason:
              "This intentionally invalid decision attempts to precede template-prepared execution and must fail closed.",
            decidedAt:
              new Date(
                Date.parse(
                  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
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
      "retains all activation runtime repository and external blocks with immutable evidence",
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
            first.candidateQualificationAdmissionEligibility,
          ),
        ).toBe(true);

        expect(
          first.candidateQualificationAdmissionEligibility.every(
            (candidate) =>
              Object.isFrozen(candidate),
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceQualificationAdmissionTransitionDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
