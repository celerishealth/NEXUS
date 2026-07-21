import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_DEPARTMENTS,
} from "../aiEmployeeManifest";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "../worldClassAIWorkforceMasterRoster";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION,
} from "../revenueGrowthWorkforceRosterAdmissionApprovalRecord";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
  createRevenueGrowthWorkforceRosterAdmissionExecution,
  validateRevenueGrowthWorkforceRosterAdmissionExecution,
} from "../revenueGrowthWorkforceRosterAdmissionExecution";

describe(
  "Revenue Growth Workforce roster-admission execution",
  () => {
    it(
      "appends exactly nine planned candidates to the source roster",
      () => {
        const execution =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION;

        expect(
          execution.admittedCandidateCount,
        ).toBe(9);

        expect(
          execution.totalEmployeeCount,
        ).toBe(
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .totalEmployeeCount + 9,
        );

        expect(
          execution.plannedCandidateCount,
        ).toBe(
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .plannedCandidateCount + 9,
        );
      },
    );

    it(
      "preserves every source roster entry in original order",
      () => {
        const execution =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION;

        expect(
          execution.entries.slice(
            0,
            execution.sourceEmployeeCount,
          ),
        ).toEqual(
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .entries,
        );

        expect(
          execution.sourceRosterPreserved,
        ).toBe(true);
      },
    );

    it(
      "binds admitted identities to the exact owner approval",
      () => {
        const execution =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION;

        expect(
          execution.sourceDecisionDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          execution.admittedEmployeeIds,
        ).toEqual(
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION
            .candidateRosterAdmissionEligibility
            .map(
              (candidate) =>
                candidate.employeeId,
            ),
        );

        expect(
          execution.admittedEmployeeCodes,
        ).toEqual(
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION
            .candidateRosterAdmissionEligibility
            .map(
              (candidate) =>
                candidate.employeeCode,
            ),
        );
      },
    );

    it(
      "keeps all admitted candidates unqualified and activation-blocked",
      () => {
        const execution =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION;

        const admitted =
          execution.entries.slice(
            execution.sourceEmployeeCount,
          );

        expect(
          admitted.every(
            (entry) =>
              entry.status ===
                "PLANNED_CANDIDATE" &&
              entry.qualificationRequired ===
                true &&
              entry.activationAuthorized ===
                false &&
              entry.consequentialAuthorityAuthorized ===
                false &&
              entry.externalCommunicationAuthorized ===
                false &&
              entry.productionExecutionAuthorized ===
                false &&
              entry.financialCommitmentAuthorized ===
                false &&
              entry.legalCommitmentAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          execution.authorityBoundary,
        ).toMatchObject({
          factoryAdmissionAuthorized:
            false,
          templatePreparationAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          ownerActivationAuthorized:
            false,
          runtimeActivationAuthorized:
            false,
          controlledWorkAuthorized:
            false,
          videoGenerationExecutionAuthorized:
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
      "requires human-like capability without human impersonation",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
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
      "preserves complete department coverage and immutable evidence",
      () => {
        const execution =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION;

        expect(
          execution.coveredDepartments,
        ).toEqual(
          AI_EMPLOYEE_DEPARTMENTS,
        );

        expect(
          execution.executionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(
            execution,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            execution.entries,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceRosterAdmissionExecution(
            execution,
          ),
        ).not.toThrow();

        const repeated =
          createRevenueGrowthWorkforceRosterAdmissionExecution({
            executionId:
              execution.executionId,
            approvalDecision:
              REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION,
            sourceRoster:
              WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
            executedAt:
              execution.executedAt,
          });

        expect(repeated).toEqual(
          execution,
        );
      },
    );
  },
);
