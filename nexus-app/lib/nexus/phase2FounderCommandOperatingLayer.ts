export type Phase2Severity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type Phase2EmployeeHealth =
  | "HEALTHY"
  | "DEGRADED"
  | "BLOCKED";

export interface Phase2PendingApproval {
  approvalId: string;
  title: string;
  severity: Phase2Severity;
  ownerDecisionRequired: boolean;
}

export interface Phase2RiskIncident {
  incidentId: string;
  summary: string;
  severity: Phase2Severity;
  status: "OPEN" | "CONTAINED" | "CLOSED";
}

export interface Phase2EmployeeStatus {
  employeeId: string;
  name: string;
  department: string;
  lifecycleState: string;
  qualificationState: string;
  health: Phase2EmployeeHealth;
  performanceScore: number | null;
}

export interface Phase2StrategySignal {
  signalId: string;
  summary: string;
  priority: "P0" | "P1" | "P2";
}

export interface Phase2FounderCommandOperatingInput {
  generatedAt: string;
  approvals: readonly Phase2PendingApproval[];
  incidents: readonly Phase2RiskIncident[];
  employees: readonly Phase2EmployeeStatus[];
  strategySignals: readonly Phase2StrategySignal[];
}

export interface Phase2DailyExceptionItem {
  kind:
    | "PENDING_APPROVAL"
    | "RISK_INCIDENT"
    | "EMPLOYEE_HEALTH";
  id: string;
  summary: string;
  severity: Phase2Severity;
}

export interface Phase2FounderCommandOperatingSnapshot {
  schemaVersion:
    "nexus-phase2-founder-command-operating-snapshot-v1";

  generatedAt: string;

  authorityBoundary: {
    ownerFinalAuthorityPreserved: true;
    recommendationIsExecutionAuthority: false;
    autonomousExternalActionAuthorized: false;
    databaseMutationAuthorized: false;
    productionMutationAuthorized: false;
  };

  roleBindings: {
    tara: {
      employeeId: "nx-exec-001";
      responsibility:
        "FOUNDER_PRIORITY_AND_EXCEPTION_COORDINATION";
    };
    ved: {
      employeeId: "nx-exec-002";
      responsibility:
        "AI_EMPLOYEE_LIFECYCLE_COORDINATION";
    };
    naina: {
      employeeId: "nx-exec-003";
      responsibility:
        "FOUNDER_COMMAND_DECISION_ANALYSIS";
    };
    ruhi: {
      employeeId: "nx-people-003";
      responsibility:
        "QUALIFICATION_LEARNING_AND_REPAIR_COORDINATION";
    };
  };

  dailyExceptionBrief: readonly Phase2DailyExceptionItem[];

  weeklyStrategyBrief: {
    priorities: readonly Phase2StrategySignal[];
    pendingOwnerDecisionCount: number;
    openRiskIncidentCount: number;
    unhealthyEmployeeCount: number;
  };

  pendingApprovals: readonly Phase2PendingApproval[];

  riskIncidentSummary: {
    open: number;
    contained: number;
    closed: number;
    criticalOpen: number;
    highOpen: number;
  };

  employeeStatusPerformance: {
    totalEmployees: number;
    healthy: number;
    degraded: number;
    blocked: number;
    scoredEmployees: number;
    averagePerformanceScore: number | null;
  };
}

const severityRank: Readonly<
  Record<Phase2Severity, number>
> = Object.freeze({
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
});

const priorityRank: Readonly<
  Record<"P0" | "P1" | "P2", number>
> = Object.freeze({
  P0: 3,
  P1: 2,
  P2: 1,
});

function compareSeverity(
  left: Phase2Severity,
  right: Phase2Severity,
): number {
  return severityRank[right] - severityRank[left];
}

function assertNonEmpty(
  value: string,
  field: string,
): void {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(
      `Invalid Phase 2 Founder Command field: ${field}`,
    );
  }
}

export function buildPhase2FounderCommandOperatingSnapshot(
  input: Phase2FounderCommandOperatingInput,
): Phase2FounderCommandOperatingSnapshot {
  assertNonEmpty(
    input.generatedAt,
    "generatedAt",
  );

  const pendingApprovals =
    [...input.approvals]
      .filter(
        (approval) =>
          approval.ownerDecisionRequired === true,
      )
      .sort(
        (left, right) =>
          compareSeverity(
            left.severity,
            right.severity,
          ) ||
          left.approvalId.localeCompare(
            right.approvalId,
          ),
      );

  const openIncidents =
    input.incidents.filter(
      (incident) =>
        incident.status === "OPEN",
    );

  const unhealthyEmployees =
    input.employees.filter(
      (employee) =>
        employee.health !== "HEALTHY",
    );

  const dailyExceptionBrief:
    Phase2DailyExceptionItem[] = [
      ...pendingApprovals.map(
        (approval) => ({
          kind:
            "PENDING_APPROVAL" as const,
          id: approval.approvalId,
          summary: approval.title,
          severity: approval.severity,
        }),
      ),

      ...openIncidents.map(
        (incident) => ({
          kind:
            "RISK_INCIDENT" as const,
          id: incident.incidentId,
          summary: incident.summary,
          severity: incident.severity,
        }),
      ),

      ...unhealthyEmployees.map(
        (employee) => ({
          kind:
            "EMPLOYEE_HEALTH" as const,
          id: employee.employeeId,
          summary:
            `${employee.name} health=${employee.health}`,
          severity:
            employee.health === "BLOCKED"
              ? ("HIGH" as const)
              : ("MEDIUM" as const),
        }),
      ),
    ].sort(
      (left, right) =>
        compareSeverity(
          left.severity,
          right.severity,
        ) ||
        left.id.localeCompare(right.id),
    );

  const strategySignals =
    [...input.strategySignals].sort(
      (left, right) =>
        priorityRank[right.priority] -
          priorityRank[left.priority] ||
        left.signalId.localeCompare(
          right.signalId,
        ),
    );

  const scores =
    input.employees
      .map(
        (employee) =>
          employee.performanceScore,
      )
      .filter(
        (value): value is number =>
          typeof value === "number" &&
          Number.isFinite(value),
      );

  const averagePerformanceScore =
    scores.length === 0
      ? null
      : Number(
          (
            scores.reduce(
              (sum, value) =>
                sum + value,
              0,
            ) / scores.length
          ).toFixed(2),
        );

  return Object.freeze({
    schemaVersion:
      "nexus-phase2-founder-command-operating-snapshot-v1",

    generatedAt: input.generatedAt,

    authorityBoundary:
      Object.freeze({
        ownerFinalAuthorityPreserved: true,
        recommendationIsExecutionAuthority:
          false,
        autonomousExternalActionAuthorized:
          false,
        databaseMutationAuthorized: false,
        productionMutationAuthorized: false,
      }),

    roleBindings:
      Object.freeze({
        tara: Object.freeze({
          employeeId: "nx-exec-001",
          responsibility:
            "FOUNDER_PRIORITY_AND_EXCEPTION_COORDINATION",
        }),

        ved: Object.freeze({
          employeeId: "nx-exec-002",
          responsibility:
            "AI_EMPLOYEE_LIFECYCLE_COORDINATION",
        }),

        naina: Object.freeze({
          employeeId: "nx-exec-003",
          responsibility:
            "FOUNDER_COMMAND_DECISION_ANALYSIS",
        }),

        ruhi: Object.freeze({
          employeeId: "nx-people-003",
          responsibility:
            "QUALIFICATION_LEARNING_AND_REPAIR_COORDINATION",
        }),
      }),

    dailyExceptionBrief:
      Object.freeze(dailyExceptionBrief),

    weeklyStrategyBrief:
      Object.freeze({
        priorities:
          Object.freeze(strategySignals),

        pendingOwnerDecisionCount:
          pendingApprovals.length,

        openRiskIncidentCount:
          openIncidents.length,

        unhealthyEmployeeCount:
          unhealthyEmployees.length,
      }),

    pendingApprovals:
      Object.freeze(pendingApprovals),

    riskIncidentSummary:
      Object.freeze({
        open:
          input.incidents.filter(
            (incident) =>
              incident.status === "OPEN",
          ).length,

        contained:
          input.incidents.filter(
            (incident) =>
              incident.status ===
              "CONTAINED",
          ).length,

        closed:
          input.incidents.filter(
            (incident) =>
              incident.status === "CLOSED",
          ).length,

        criticalOpen:
          openIncidents.filter(
            (incident) =>
              incident.severity ===
              "CRITICAL",
          ).length,

        highOpen:
          openIncidents.filter(
            (incident) =>
              incident.severity === "HIGH",
          ).length,
      }),

    employeeStatusPerformance:
      Object.freeze({
        totalEmployees:
          input.employees.length,

        healthy:
          input.employees.filter(
            (employee) =>
              employee.health ===
              "HEALTHY",
          ).length,

        degraded:
          input.employees.filter(
            (employee) =>
              employee.health ===
              "DEGRADED",
          ).length,

        blocked:
          input.employees.filter(
            (employee) =>
              employee.health ===
              "BLOCKED",
          ).length,

        scoredEmployees:
          scores.length,

        averagePerformanceScore,
      }),
  });
}