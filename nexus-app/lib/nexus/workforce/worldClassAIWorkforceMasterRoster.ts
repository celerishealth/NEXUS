import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_DEPARTMENTS,
  type AIEmployeeDepartment,
} from "./aiEmployeeManifest";

export const WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER_VERSION =
  "nexus-world-class-ai-workforce-master-roster-v1" as const;

export type AIWorkforceRosterStatus =
  | "EXISTING_OWNER_ACTIVATED"
  | "PLANNED_CANDIDATE";

export type AIWorkforcePriorityTier =
  | "FOUNDATION_PRIORITY"
  | "REVENUE_READINESS_PRIORITY"
  | "EXPANSION_PRIORITY";

export interface AIWorkforceRosterEntry {
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department: AIEmployeeDepartment;
  readonly managerRoleKey: string;
  readonly status: AIWorkforceRosterStatus;
  readonly priorityTier: AIWorkforcePriorityTier;
  readonly qualificationRequired: boolean;
  readonly activationAuthorized: boolean;
  readonly consequentialAuthorityAuthorized: false;
  readonly externalCommunicationAuthorized: false;
  readonly productionExecutionAuthorized: false;
  readonly financialCommitmentAuthorized: false;
  readonly legalCommitmentAuthorized: false;
}

export interface WorldClassAIWorkforceMasterRoster {
  readonly version:
    typeof WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER_VERSION;
  readonly entries:
    readonly AIWorkforceRosterEntry[];
  readonly totalEmployeeCount: number;
  readonly existingActivatedEmployeeCount: 3;
  readonly plannedCandidateCount: number;
  readonly coveredDepartments:
    readonly AIEmployeeDepartment[];
  readonly safetyBoundary: Readonly<{
    existingEmployeesPreserved: true;
    plannedCandidatesRemainUnqualified: true;
    plannedCandidateActivationBlocked: true;
    ownerQualificationApprovalRequired: true;
    ownerActivationApprovalRequired: true;
    tenantIsolationRequired: true;
    externalCommunicationAuthorized: false;
    productionExecutionAuthorized: false;
    financialCommitmentAuthorized: false;
    legalCommitmentAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly rosterDigest: string;
}

const EXISTING_EMPLOYEES =
  [
    {
      employeeId:
        "employee-asha-inquiry-intake-v1",
      employeeCode:
        "nx-sales-003",
      publicName:
        "Asha",
      officialRole:
        "AI Inquiry Intake Executive",
      department:
        "SALES",
      managerRoleKey:
        "founder-chief-of-staff",
      status:
        "EXISTING_OWNER_ACTIVATED",
      priorityTier:
        "REVENUE_READINESS_PRIORITY",
      qualificationRequired:
        false,
      activationAuthorized:
        true,
    },
    {
      employeeId:
        "employee-riya-recommendation-specialist-v1",
      employeeCode:
        "nx-sales-004",
      publicName:
        "Riya",
      officialRole:
        "AI Recommendation Specialist",
      department:
        "SALES",
      managerRoleKey:
        "founder-chief-of-staff",
      status:
        "EXISTING_OWNER_ACTIVATED",
      priorityTier:
        "REVENUE_READINESS_PRIORITY",
      qualificationRequired:
        false,
      activationAuthorized:
        true,
    },
    {
      employeeId:
        "employee-meera-quotation-proposal-specialist-v1",
      employeeCode:
        "nx-sales-005",
      publicName:
        "Meera",
      officialRole:
        "AI Quotation & Proposal Specialist",
      department:
        "SALES",
      managerRoleKey:
        "founder-chief-of-staff",
      status:
        "EXISTING_OWNER_ACTIVATED",
      priorityTier:
        "REVENUE_READINESS_PRIORITY",
      qualificationRequired:
        false,
      activationAuthorized:
        true,
    },
  ] as const;

const PLANNED_EMPLOYEES =
  [
    ["tara", "nx-exec-001", "Tara", "AI Founder Chief of Staff", "EXECUTIVE", "FOUNDATION_PRIORITY"],
    ["ved", "nx-exec-002", "Ved", "AI Workforce Director", "EXECUTIVE", "FOUNDATION_PRIORITY"],
    ["naina", "nx-exec-003", "Naina", "AI Founder Command & Decision Analyst", "EXECUTIVE", "FOUNDATION_PRIORITY"],

    ["kabir", "nx-sales-006", "Kabir", "AI Sales Pipeline & Qualification Specialist", "SALES", "REVENUE_READINESS_PRIORITY"],
    ["diya", "nx-sales-007", "Diya", "AI Sales Enablement & Follow-up Specialist", "SALES", "REVENUE_READINESS_PRIORITY"],

    ["anika", "nx-marketing-001", "Anika", "AI Market Intelligence Director", "MARKETING", "FOUNDATION_PRIORITY"],
    ["aarav", "nx-marketing-002", "Aarav", "AI Growth Strategy Specialist", "MARKETING", "REVENUE_READINESS_PRIORITY"],
    ["isha", "nx-marketing-003", "Isha", "AI Brand, Content & Campaign Specialist", "MARKETING", "EXPANSION_PRIORITY"],

    ["sana", "nx-cs-001", "Sana", "AI Customer Success Director", "CUSTOMER_SUCCESS", "REVENUE_READINESS_PRIORITY"],
    ["neil", "nx-cs-002", "Neil", "AI Customer Onboarding Specialist", "CUSTOMER_SUCCESS", "REVENUE_READINESS_PRIORITY"],
    ["kiara", "nx-cs-003", "Kiara", "AI Support Resolution Specialist", "CUSTOMER_SUCCESS", "REVENUE_READINESS_PRIORITY"],

    ["kavya", "nx-finance-001", "Kavya", "AI Finance Controller", "FINANCE", "REVENUE_READINESS_PRIORITY"],
    ["rohan", "nx-finance-002", "Rohan", "AI Accounting & Reconciliation Specialist", "FINANCE", "REVENUE_READINESS_PRIORITY"],
    ["myra", "nx-finance-003", "Myra", "AI Revenue Operations Analyst", "FINANCE", "REVENUE_READINESS_PRIORITY"],

    ["vanya", "nx-people-001", "Vanya", "AI People Operations Director", "PEOPLE_OPERATIONS", "EXPANSION_PRIORITY"],
    ["aditya", "nx-people-002", "Aditya", "AI Talent & Recruitment Specialist", "PEOPLE_OPERATIONS", "EXPANSION_PRIORITY"],
    ["ruhi", "nx-people-003", "Ruhi", "AI Employee Qualification & Learning Specialist", "PEOPLE_OPERATIONS", "FOUNDATION_PRIORITY"],

    ["nyra", "nx-legal-001", "Nyra", "AI Legal Operations Specialist", "LEGAL_COMPLIANCE", "REVENUE_READINESS_PRIORITY"],
    ["viraj", "nx-legal-002", "Viraj", "AI Compliance & Policy Analyst", "LEGAL_COMPLIANCE", "REVENUE_READINESS_PRIORITY"],
    ["ira", "nx-legal-003", "Ira", "AI Privacy Governance Specialist", "LEGAL_COMPLIANCE", "FOUNDATION_PRIORITY"],

    ["aditi", "nx-ops-001", "Aditi", "AI Operations Director", "OPERATIONS", "FOUNDATION_PRIORITY"],
    ["dhruv", "nx-ops-002", "Dhruv", "AI Workflow Optimization Specialist", "OPERATIONS", "FOUNDATION_PRIORITY"],
    ["siya", "nx-ops-003", "Siya", "AI Incident Coordination Specialist", "OPERATIONS", "FOUNDATION_PRIORITY"],

    ["prisha", "nx-procurement-001", "Prisha", "AI Procurement Specialist", "PROCUREMENT", "EXPANSION_PRIORITY"],
    ["arnav", "nx-procurement-002", "Arnav", "AI Vendor Risk & Sourcing Analyst", "PROCUREMENT", "EXPANSION_PRIORITY"],

    ["nivaan", "nx-logistics-001", "Nivaan", "AI Inventory Planning Specialist", "INVENTORY_LOGISTICS", "EXPANSION_PRIORITY"],
    ["trisha", "nx-logistics-002", "Trisha", "AI Logistics & Supply Continuity Specialist", "INVENTORY_LOGISTICS", "EXPANSION_PRIORITY"],

    ["avni", "nx-product-001", "Avni", "AI Product Director", "PRODUCT_RESEARCH", "FOUNDATION_PRIORITY"],
    ["vihaan", "nx-product-002", "Vihaan", "AI Product Research Specialist", "PRODUCT_RESEARCH", "FOUNDATION_PRIORITY"],
    ["navya", "nx-product-003", "Navya", "AI UX Research & Customer Problem Specialist", "PRODUCT_RESEARCH", "FOUNDATION_PRIORITY"],
    ["om", "nx-product-004", "Om", "AI Product Analytics Specialist", "PRODUCT_RESEARCH", "FOUNDATION_PRIORITY"],

    ["ishaan", "nx-engineering-001", "Ishaan", "AI Principal Software Architect", "ENGINEERING_DATA_SECURITY", "FOUNDATION_PRIORITY"],
    ["leela", "nx-engineering-002", "Leela", "AI Software Engineering Director", "ENGINEERING_DATA_SECURITY", "FOUNDATION_PRIORITY"],
    ["vivaan", "nx-engineering-003", "Vivaan", "AI Quality Assurance Director", "ENGINEERING_DATA_SECURITY", "FOUNDATION_PRIORITY"],
    ["anaya", "nx-engineering-004", "Anaya", "AI Security Engineering Director", "ENGINEERING_DATA_SECURITY", "FOUNDATION_PRIORITY"],
    ["atharv", "nx-engineering-005", "Atharv", "AI Reliability Engineering Specialist", "ENGINEERING_DATA_SECURITY", "FOUNDATION_PRIORITY"],
    ["mahir", "nx-engineering-006", "Mahir", "AI Chaos Engineering Specialist", "ENGINEERING_DATA_SECURITY", "FOUNDATION_PRIORITY"],
    ["zara", "nx-engineering-007", "Zara", "AI Data Engineering & Analytics Specialist", "ENGINEERING_DATA_SECURITY", "FOUNDATION_PRIORITY"],
    ["advik", "nx-engineering-008", "Advik", "AI Systems Evaluation & Red-Team Specialist", "ENGINEERING_DATA_SECURITY", "FOUNDATION_PRIORITY"],

    ["riddhi", "nx-commerce-001", "Riddhi", "AI Commerce Operations Specialist", "ECOMMERCE_RETAIL", "EXPANSION_PRIORITY"],
    ["krish", "nx-commerce-002", "Krish", "AI Merchandising & Conversion Specialist", "ECOMMERCE_RETAIL", "EXPANSION_PRIORITY"],

    ["eshan", "nx-industry-001", "Eshan", "AI Industry Pack Architect", "INDUSTRY_SPECIALIST", "FOUNDATION_PRIORITY"],
    ["samaira", "nx-industry-002", "Samaira", "AI Custom Sector Creation Specialist", "INDUSTRY_SPECIALIST", "FOUNDATION_PRIORITY"],
    ["laksh", "nx-industry-003", "Laksh", "AI Sector Regulation & Domain Research Specialist", "INDUSTRY_SPECIALIST", "EXPANSION_PRIORITY"],
  ] as const satisfies readonly [
    string,
    string,
    string,
    string,
    AIEmployeeDepartment,
    AIWorkforcePriorityTier,
  ][];

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
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
            stableStringify(record[key]),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic workforce roster value.",
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

function deepFreeze<T>(
  value: T,
): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const propertyName of
      Object.getOwnPropertyNames(value)
    ) {
      const child =
        (
          value as unknown as
            Record<string, unknown>
        )[propertyName];

      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }

    Object.freeze(value);
  }

  return value as Readonly<T>;
}

function requireUnique(
  label: string,
  values: readonly string[],
): void {
  if (
    new Set(values).size !==
    values.length
  ) {
    throw new Error(
      label +
        " must not contain duplicates.",
    );
  }
}

export function createWorldClassAIWorkforceMasterRoster():
  WorldClassAIWorkforceMasterRoster {
  const existingEntries:
    AIWorkforceRosterEntry[] =
      EXISTING_EMPLOYEES.map(
        (employee) => ({
          ...employee,
          consequentialAuthorityAuthorized:
            false,
          externalCommunicationAuthorized:
            false,
          productionExecutionAuthorized:
            false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
        }),
      );

  const plannedEntries:
    AIWorkforceRosterEntry[] =
      PLANNED_EMPLOYEES.map(
        ([
          key,
          employeeCode,
          publicName,
          officialRole,
          department,
          priorityTier,
        ]) => ({
          employeeId:
            "candidate-" + key + "-v1",
          employeeCode,
          publicName,
          officialRole,
          department,
          managerRoleKey:
            "founder-owner-ceo",
          status:
            "PLANNED_CANDIDATE",
          priorityTier,
          qualificationRequired:
            true,
          activationAuthorized:
            false,
          consequentialAuthorityAuthorized:
            false,
          externalCommunicationAuthorized:
            false,
          productionExecutionAuthorized:
            false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
        }),
      );

  const entries =
    [
      ...existingEntries,
      ...plannedEntries,
    ];

  requireUnique(
    "Employee IDs",
    entries.map(
      (entry) =>
        entry.employeeId,
    ),
  );

  requireUnique(
    "Employee codes",
    entries.map(
      (entry) =>
        entry.employeeCode,
    ),
  );

  requireUnique(
    "Employee public names",
    entries.map(
      (entry) =>
        entry.publicName.toLowerCase(),
    ),
  );

  const coveredDepartments =
    AI_EMPLOYEE_DEPARTMENTS.filter(
      (department) =>
        entries.some(
          (entry) =>
            entry.department ===
            department,
        ),
    );

  if (
    coveredDepartments.length !==
    AI_EMPLOYEE_DEPARTMENTS.length
  ) {
    throw new Error(
      "World-class workforce roster must cover every official NEXUS department.",
    );
  }

  const plannedCandidates =
    entries.filter(
      (entry) =>
        entry.status ===
        "PLANNED_CANDIDATE",
    );

  if (
    plannedCandidates.some(
      (entry) =>
        entry.qualificationRequired !==
          true ||
        entry.activationAuthorized !==
          false,
    )
  ) {
    throw new Error(
      "Planned AI employees must remain unqualified and activation-blocked.",
    );
  }

  const rosterCore = {
    version:
      WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER_VERSION,
    entries,
    totalEmployeeCount:
      entries.length,
    existingActivatedEmployeeCount:
      3 as const,
    plannedCandidateCount:
      plannedCandidates.length,
    coveredDepartments,
    safetyBoundary: {
      existingEmployeesPreserved:
        true,
      plannedCandidatesRemainUnqualified:
        true,
      plannedCandidateActivationBlocked:
        true,
      ownerQualificationApprovalRequired:
        true,
      ownerActivationApprovalRequired:
        true,
      tenantIsolationRequired:
        true,
      externalCommunicationAuthorized:
        false,
      productionExecutionAuthorized:
        false,
      financialCommitmentAuthorized:
        false,
      legalCommitmentAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
  };

  return deepFreeze({
    ...rosterCore,
    rosterDigest:
      sha256(rosterCore),
  }) as WorldClassAIWorkforceMasterRoster;
}

export const WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER =
  createWorldClassAIWorkforceMasterRoster();
