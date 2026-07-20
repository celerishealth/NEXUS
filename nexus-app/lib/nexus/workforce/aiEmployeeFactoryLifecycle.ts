import { createHash } from "node:crypto";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
  type AIWorkforceRosterEntry,
  type WorldClassAIWorkforceMasterRoster,
} from "./worldClassAIWorkforceMasterRoster";

export const AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION =
  "nexus-ai-employee-factory-lifecycle-v1" as const;

export const AI_EMPLOYEE_FACTORY_LIFECYCLE_STATES = [
  "PLANNED_CANDIDATE",
  "TEMPLATE_PREPARATION_PENDING",
  "TEMPLATE_PREPARED",
  "QUALIFICATION_ADMISSION_PENDING",
  "QUALIFICATION_IN_PROGRESS",
  "OWNER_QUALIFICATION_REVIEW_PENDING",
  "DEFECT_REMEDIATION_REQUIRED",
  "ACTIVATION_CANDIDATE_PREPARED",
  "PAUSED_AWAITING_OWNER_ACTIVATION",
  "OWNER_ACTIVATED",
  "PAUSED_BY_OWNER",
  "RETIRED_BY_OWNER",
] as const;

export type AIEmployeeFactoryLifecycleState =
  (typeof AI_EMPLOYEE_FACTORY_LIFECYCLE_STATES)[number];

export const AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS = {
  PLANNED_CANDIDATE: [
    "TEMPLATE_PREPARATION_PENDING",
    "RETIRED_BY_OWNER",
  ],
  TEMPLATE_PREPARATION_PENDING: [
    "TEMPLATE_PREPARED",
    "PAUSED_BY_OWNER",
    "RETIRED_BY_OWNER",
  ],
  TEMPLATE_PREPARED: [
    "QUALIFICATION_ADMISSION_PENDING",
    "PAUSED_BY_OWNER",
    "RETIRED_BY_OWNER",
  ],
  QUALIFICATION_ADMISSION_PENDING: [
    "QUALIFICATION_IN_PROGRESS",
    "PAUSED_BY_OWNER",
    "RETIRED_BY_OWNER",
  ],
  QUALIFICATION_IN_PROGRESS: [
    "OWNER_QUALIFICATION_REVIEW_PENDING",
    "DEFECT_REMEDIATION_REQUIRED",
    "PAUSED_BY_OWNER",
  ],
  OWNER_QUALIFICATION_REVIEW_PENDING: [
    "ACTIVATION_CANDIDATE_PREPARED",
    "DEFECT_REMEDIATION_REQUIRED",
    "RETIRED_BY_OWNER",
  ],
  DEFECT_REMEDIATION_REQUIRED: [
    "QUALIFICATION_ADMISSION_PENDING",
    "RETIRED_BY_OWNER",
  ],
  ACTIVATION_CANDIDATE_PREPARED: [
    "PAUSED_AWAITING_OWNER_ACTIVATION",
    "RETIRED_BY_OWNER",
  ],
  PAUSED_AWAITING_OWNER_ACTIVATION: [
    "OWNER_ACTIVATED",
    "RETIRED_BY_OWNER",
  ],
  OWNER_ACTIVATED: [
    "PAUSED_BY_OWNER",
    "RETIRED_BY_OWNER",
  ],
  PAUSED_BY_OWNER: [
    "OWNER_ACTIVATED",
    "RETIRED_BY_OWNER",
  ],
  RETIRED_BY_OWNER: [],
} as const satisfies Readonly<
  Record<
    AIEmployeeFactoryLifecycleState,
    readonly AIEmployeeFactoryLifecycleState[]
  >
>;

export interface AIEmployeeFactoryCandidateRecord {
  readonly version:
    typeof AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION;
  readonly factoryRecordId: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    AIWorkforceRosterEntry["department"];
  readonly managerRoleKey: string;
  readonly sourceRosterStatus:
    "PLANNED_CANDIDATE";
  readonly lifecycleState:
    "PLANNED_CANDIDATE";
  readonly templatePrepared: false;
  readonly qualificationAdmissionAuthorized:
    false;
  readonly qualificationEvidenceAccepted:
    false;
  readonly ownerQualificationApproved:
    false;
  readonly activationCandidatePrepared:
    false;
  readonly ownerActivationApproved:
    false;
  readonly runtimeAuthorized: false;
  readonly consequentialAuthorityAuthorized:
    false;
  readonly externalCommunicationAuthorized:
    false;
  readonly productionExecutionAuthorized:
    false;
  readonly financialCommitmentAuthorized:
    false;
  readonly legalCommitmentAuthorized:
    false;
  readonly createdAt: string;
  readonly recordDigest: string;
}

export interface AIEmployeeFactoryLifecycleFoundation {
  readonly version:
    typeof AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION;
  readonly sourceRosterVersion:
    WorldClassAIWorkforceMasterRoster["version"];
  readonly sourceRosterDigest: string;
  readonly lifecycleStates:
    readonly AIEmployeeFactoryLifecycleState[];
  readonly allowedTransitions:
    typeof AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS;
  readonly candidateRecords:
    readonly AIEmployeeFactoryCandidateRecord[];
  readonly plannedCandidateCount: number;
  readonly safetyBoundary: Readonly<{
    existingActivatedEmployeesExcluded:
      true;
    directTemplateBypassBlocked: true;
    directQualificationBypassBlocked:
      true;
    incompleteQualificationBlocked:
      true;
    directActivationBypassBlocked:
      true;
    selfActivationBlocked: true;
    ownerQualificationApprovalRequired:
      true;
    ownerActivationApprovalRequired:
      true;
    emergencyPauseRequired: true;
    tenantIsolationRequired: true;
    evidencePreservationRequired: true;
    externalCommunicationAuthorized:
      false;
    productionExecutionAuthorized:
      false;
    financialCommitmentAuthorized:
      false;
    legalCommitmentAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly createdAt: string;
  readonly foundationDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9-]{2,127}$/;

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
      "Unsupported deterministic AI employee factory lifecycle value.",
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

function requireIsoDate(
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      "AI employee factory lifecycle createdAt must be a valid ISO date.",
    );
  }
}

function requireSafeIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a canonical safe identifier.",
    );
  }
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

function createCandidateRecord(
  entry: AIWorkforceRosterEntry,
  createdAt: string,
): AIEmployeeFactoryCandidateRecord {
  if (
    entry.status !==
      "PLANNED_CANDIDATE" ||
    entry.qualificationRequired !==
      true ||
    entry.activationAuthorized !==
      false
  ) {
    throw new Error(
      "Factory candidate records may only be created from activation-blocked planned roster candidates.",
    );
  }

  requireSafeIdentifier(
    "employeeId",
    entry.employeeId,
  );

  requireSafeIdentifier(
    "employeeCode",
    entry.employeeCode,
  );

  const recordCore = {
    version:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
    factoryRecordId:
      "factory-record-" +
      entry.employeeId,
    employeeId:
      entry.employeeId,
    employeeCode:
      entry.employeeCode,
    publicName:
      entry.publicName,
    officialRole:
      entry.officialRole,
    department:
      entry.department,
    managerRoleKey:
      entry.managerRoleKey,
    sourceRosterStatus:
      "PLANNED_CANDIDATE" as const,
    lifecycleState:
      "PLANNED_CANDIDATE" as const,
    templatePrepared:
      false as const,
    qualificationAdmissionAuthorized:
      false as const,
    qualificationEvidenceAccepted:
      false as const,
    ownerQualificationApproved:
      false as const,
    activationCandidatePrepared:
      false as const,
    ownerActivationApproved:
      false as const,
    runtimeAuthorized:
      false as const,
    consequentialAuthorityAuthorized:
      false as const,
    externalCommunicationAuthorized:
      false as const,
    productionExecutionAuthorized:
      false as const,
    financialCommitmentAuthorized:
      false as const,
    legalCommitmentAuthorized:
      false as const,
    createdAt,
  };

  return deepFreeze({
    ...recordCore,
    recordDigest:
      sha256(recordCore),
  }) as AIEmployeeFactoryCandidateRecord;
}

export function createAIEmployeeFactoryLifecycleFoundation(
  roster:
    WorldClassAIWorkforceMasterRoster,
  createdAt: string,
): AIEmployeeFactoryLifecycleFoundation {
  requireIsoDate(createdAt);

  const plannedEntries =
    roster.entries.filter(
      (entry) =>
        entry.status ===
        "PLANNED_CANDIDATE",
    );

  if (
    plannedEntries.length !==
    roster.plannedCandidateCount
  ) {
    throw new Error(
      "Factory planned-candidate count must match the source roster.",
    );
  }

  if (
    plannedEntries.length < 1
  ) {
    throw new Error(
      "AI employee factory requires at least one planned candidate.",
    );
  }

  const candidateRecords =
    plannedEntries.map(
      (entry) =>
        createCandidateRecord(
          entry,
          createdAt,
        ),
    );

  requireUnique(
    "Factory record IDs",
    candidateRecords.map(
      (record) =>
        record.factoryRecordId,
    ),
  );

  requireUnique(
    "Factory employee IDs",
    candidateRecords.map(
      (record) =>
        record.employeeId,
    ),
  );

  requireUnique(
    "Factory employee codes",
    candidateRecords.map(
      (record) =>
        record.employeeCode,
    ),
  );

  if (
    candidateRecords.some(
      (record) =>
        record.lifecycleState !==
          "PLANNED_CANDIDATE" ||
        record.runtimeAuthorized !==
          false ||
        record.ownerActivationApproved !==
          false
    )
  ) {
    throw new Error(
      "Initial factory candidates must remain planned and runtime-blocked.",
    );
  }

  const foundationCore = {
    version:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
    sourceRosterVersion:
      roster.version,
    sourceRosterDigest:
      roster.rosterDigest,
    lifecycleStates:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_STATES,
    allowedTransitions:
      AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
    candidateRecords,
    plannedCandidateCount:
      candidateRecords.length,
    safetyBoundary: {
      existingActivatedEmployeesExcluded:
        true,
      directTemplateBypassBlocked:
        true,
      directQualificationBypassBlocked:
        true,
      incompleteQualificationBlocked:
        true,
      directActivationBypassBlocked:
        true,
      selfActivationBlocked:
        true,
      ownerQualificationApprovalRequired:
        true,
      ownerActivationApprovalRequired:
        true,
      emergencyPauseRequired:
        true,
      tenantIsolationRequired:
        true,
      evidencePreservationRequired:
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
    createdAt,
  };

  return deepFreeze({
    ...foundationCore,
    foundationDigest:
      sha256(foundationCore),
  }) as AIEmployeeFactoryLifecycleFoundation;
}

export const AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION =
  createAIEmployeeFactoryLifecycleFoundation(
    WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
    "2026-07-20T16:20:00.000Z",
  );
