import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildPhase2FounderCommandOperatingSnapshot,
} from "../phase2FounderCommandOperatingLayer";

describe(
  "Phase 2 Founder Command operating layer",
  () => {
    const result =
      buildPhase2FounderCommandOperatingSnapshot({
        generatedAt:
          "2026-09-29T20:00:00+05:30",

        approvals: [
          {
            approvalId: "approval-low",
            title: "Low priority review",
            severity: "LOW",
            ownerDecisionRequired: false,
          },
          {
            approvalId:
              "approval-critical",
            title:
              "Founder decision required",
            severity: "CRITICAL",
            ownerDecisionRequired: true,
          },
        ],

        incidents: [
          {
            incidentId:
              "incident-open",
            summary:
              "Open reliability incident",
            severity: "HIGH",
            status: "OPEN",
          },
          {
            incidentId:
              "incident-closed",
            summary:
              "Closed incident",
            severity: "LOW",
            status: "CLOSED",
          },
        ],

        employees: [
          {
            employeeId:
              "nx-engineering-001",
            name: "Ishaan",
            department:
              "ENGINEERING_DATA_SECURITY",
            lifecycleState: "ACTIVE",
            qualificationState:
              "QUALIFIED",
            health: "HEALTHY",
            performanceScore: 98,
          },
          {
            employeeId:
              "nx-engineering-002",
            name: "Leela",
            department:
              "ENGINEERING_DATA_SECURITY",
            lifecycleState: "ACTIVE",
            qualificationState:
              "QUALIFIED",
            health: "BLOCKED",
            performanceScore: 92,
          },
        ],

        strategySignals: [
          {
            signalId: "strategy-p2",
            summary: "Later improvement",
            priority: "P2",
          },
          {
            signalId: "strategy-p0",
            summary: "Immediate priority",
            priority: "P0",
          },
        ],
      });

    it(
      "builds the daily exception brief",
      () => {
        expect(
          result.dailyExceptionBrief,
        ).toHaveLength(3);

        expect(
          result.dailyExceptionBrief[0],
        ).toMatchObject({
          kind: "PENDING_APPROVAL",
          id: "approval-critical",
          severity: "CRITICAL",
        });
      },
    );

    it(
      "builds the weekly strategy brief",
      () => {
        expect(
          result.weeklyStrategyBrief
            .priorities[0],
        ).toMatchObject({
          signalId: "strategy-p0",
          priority: "P0",
        });

        expect(
          result.weeklyStrategyBrief
            .pendingOwnerDecisionCount,
        ).toBe(1);

        expect(
          result.weeklyStrategyBrief
            .openRiskIncidentCount,
        ).toBe(1);

        expect(
          result.weeklyStrategyBrief
            .unhealthyEmployeeCount,
        ).toBe(1);
      },
    );

    it(
      "surfaces only owner-required pending approvals",
      () => {
        expect(
          result.pendingApprovals,
        ).toHaveLength(1);

        expect(
          result.pendingApprovals[0]
            .approvalId,
        ).toBe("approval-critical");
      },
    );

    it(
      "summarizes risk and incident state",
      () => {
        expect(
          result.riskIncidentSummary,
        ).toEqual({
          open: 1,
          contained: 0,
          closed: 1,
          criticalOpen: 0,
          highOpen: 1,
        });
      },
    );

    it(
      "summarizes employee status and performance",
      () => {
        expect(
          result.employeeStatusPerformance,
        ).toEqual({
          totalEmployees: 2,
          healthy: 1,
          degraded: 0,
          blocked: 1,
          scoredEmployees: 2,
          averagePerformanceScore: 95,
        });
      },
    );

    it(
      "preserves strict owner authority and execution separation",
      () => {
        expect(
          result.authorityBoundary,
        ).toEqual({
          ownerFinalAuthorityPreserved:
            true,
          recommendationIsExecutionAuthority:
            false,
          autonomousExternalActionAuthorized:
            false,
          databaseMutationAuthorized:
            false,
          productionMutationAuthorized:
            false,
        });

        expect(
          result.roleBindings.tara
            .employeeId,
        ).toBe("nx-exec-001");

        expect(
          result.roleBindings.ved
            .employeeId,
        ).toBe("nx-exec-002");

        expect(
          result.roleBindings.naina
            .employeeId,
        ).toBe("nx-exec-003");

        expect(
          result.roleBindings.ruhi
            .employeeId,
        ).toBe("nx-people-003");
      },
    );
  },
);