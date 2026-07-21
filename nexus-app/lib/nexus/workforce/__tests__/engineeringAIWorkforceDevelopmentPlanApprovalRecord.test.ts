import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
} from "../engineeringAIWorkforceDevelopmentPlan";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforceDevelopmentPlanApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
  validateEngineeringAIWorkforceDevelopmentPlanDecision,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

describe(
  "Engineering AI Workforce development-plan approval record",
  () => {
    it(
      "records the exact explicit owner approval",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-development-plan-approval-record-v1",
        );

        expect(record.ownerId).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(record.decision).toBe(
          "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN",
        );

        expect(
          record.developmentPlanApproved,
        ).toBe(true);

        expect(
          record.templatePreparationPlanEligible,
        ).toBe(true);
      },
    );

    it(
      "binds approval to the exact immutable source plan",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION;

        expect(
          record.sourcePlanningId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
            .planningId,
        );

        expect(
          record.sourcePlanningDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
            .planningDigest,
        );

        expect(
          record.sourceRosterDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
            .sourceRosterDigest,
        );

        expect(
          record.sourceFactoryDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
            .sourceFactoryDigest,
        );

        expect(
          record.sourceDirectorPlanningDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
            .sourceDirectorPlanningDigest,
        );

        expect(
          record.candidateDevelopmentEligibility,
        ).toHaveLength(8);
      },
    );

    it(
      "grants template-plan eligibility without template execution authority",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION;

        expect(
          record.candidateDevelopmentEligibility.every(
            (candidate) =>
              candidate.templatePreparationPlanEligible ===
                true &&
              candidate.templatePreparationAuthorized ===
                false &&
              candidate.qualificationAdmissionAuthorized ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false &&
              candidate.ownerQualificationApprovalRecorded ===
                false &&
              candidate.activationCandidatePreparationAuthorized ===
                false &&
              candidate.ownerActivationAuthorized ===
                false &&
              candidate.runtimeActivationAuthorized ===
                false &&
              candidate.controlledWorkAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(record.nextStep).toBe(
          "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLAN",
        );
      },
    );

    it(
      "keeps repository deployment secrets and consequential authority blocked",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          ownerDecisionRecorded:
            true,
          ownerIdentityBound:
            true,
          sourcePlanningBound:
            true,
          approvalBypassAllowed:
            false,
          templatePreparationPlanEligible:
            true,
          rosterMutationAuthorized:
            false,
          factoryLifecycleTransitionAuthorized:
            false,
          templatePreparationAuthorized:
            false,
          qualificationAdmissionAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          ownerActivationAuthorized:
            false,
          runtimeActivationAuthorized:
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
      "preserves immutable digest-valid approval evidence",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION;

        expect(
          record.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(record),
        ).toBe(true);

        expect(
          Object.isFrozen(
            record.candidateDevelopmentEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceDevelopmentPlanDecision(
            record,
          ),
        ).not.toThrow();
      },
    );
  },
);
