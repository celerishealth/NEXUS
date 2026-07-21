import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
} from "../aiEmployeeFactoryLifecycle";

import {
  REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION,
} from "../revenueGrowthWorkforceFactoryAdmissionApprovalRecord";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
} from "../revenueGrowthWorkforceRosterAdmissionExecution";

import {
  REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION,
  createRevenueGrowthWorkforceFactoryAdmissionExecution,
  validateRevenueGrowthWorkforceFactoryAdmissionExecution,
} from "../revenueGrowthWorkforceFactoryAdmissionExecution";

describe(
  "Revenue Growth Workforce factory-admission execution",
  () => {
    it(
      "creates exactly nine append-only factory candidate records",
      () => {
        const execution =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION;

        expect(
          execution.admittedFactoryCandidateCount,
        ).toBe(9);

        expect(
          execution.candidateRecords,
        ).toHaveLength(9);

        expect(
          execution.admittedFactoryRecordIds,
        ).toHaveLength(9);
      },
    );

    it(
      "preserves the existing factory lifecycle foundation",
      () => {
        const execution =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION;

        expect(
          execution.sourceFactoryFoundationDigest,
        ).toBe(
          AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
            .foundationDigest,
        );

        expect(
          execution.sourceFactoryCandidateCount,
        ).toBe(
          AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
            .plannedCandidateCount,
        );

        const existingIds =
          new Set(
            AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
              .candidateRecords.map(
                (candidate) =>
                  candidate.employeeId,
              ),
          );

        expect(
          execution.candidateRecords.every(
            (candidate) =>
              !existingIds.has(
                candidate.employeeId,
              ),
          ),
        ).toBe(true);
      },
    );

    it(
      "binds records to the exact owner approval and roster admission",
      () => {
        const execution =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION;

        expect(
          execution.sourceDecisionDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          execution.sourceRosterAdmissionExecutionDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
            .executionDigest,
        );

        expect(
          execution.candidateRecords.map(
            (candidate) =>
              candidate.employeeId,
          ),
        ).toEqual(
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION
            .candidateFactoryAdmissionEligibility
            .map(
              (candidate) =>
                candidate.employeeId,
            ),
        );
      },
    );

    it(
      "locks all candidates at planned state with runtime blocked",
      () => {
        const execution =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION;

        expect(
          execution.candidateRecords.every(
            (candidate) =>
              candidate.lifecycleState ===
                "PLANNED_CANDIDATE" &&
              candidate.templatePrepared ===
                false &&
              candidate.qualificationAdmissionAuthorized ===
                false &&
              candidate.qualificationEvidenceAccepted ===
                false &&
              candidate.ownerQualificationApproved ===
                false &&
              candidate.activationCandidatePrepared ===
                false &&
              candidate.ownerActivationApproved ===
                false &&
              candidate.runtimeAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          execution.authorityBoundary,
        ).toMatchObject({
          templatePreparationAuthorized:
            false,
          qualificationAdmissionAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          ownerQualificationApproved:
            false,
          ownerActivationApproved:
            false,
          runtimeAuthorized:
            false,
          controlledWorkAuthorized:
            false,
          liveSocialPostingAuthorized:
            false,
          paidAdvertisingSpendAuthorized:
            false,
          customerMessagingAuthorized:
            false,
          productionExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "preserves human-like capability without human impersonation",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION
            .humanLikeEmployeeStandard,
        ).toEqual({
          naturalProfessionalCommunicationRequired:
            true,
          contextAwarenessRequired:
            true,
          proactiveSpecialistWorkRequired:
            true,
          transparentAIIdentityRequired:
            true,
          humanImpersonationAuthorized:
            false,
          fabricatedHumanExperienceAuthorized:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable digest-bound execution evidence",
      () => {
        const first =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION;

        const second =
          createRevenueGrowthWorkforceFactoryAdmissionExecution({
            executionId:
              first.executionId,
            approvalDecision:
              REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION,
            executedAt:
              first.executedAt,
          });

        expect(second).toEqual(first);

        expect(
          first.executionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateRecords,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceFactoryAdmissionExecution(
            first,
          ),
        ).not.toThrow();

        expect(
          first.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN",
        );
      },
    );
  },
);
