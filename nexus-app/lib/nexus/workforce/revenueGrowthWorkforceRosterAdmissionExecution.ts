import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_DEPARTMENTS,
  type AIEmployeeDepartment,
} from "./aiEmployeeManifest";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER_VERSION,
  type AIWorkforceRosterEntry,
  type WorldClassAIWorkforceMasterRoster,
} from "./worldClassAIWorkforceMasterRoster";

import {
  validateRevenueGrowthWorkforceRosterAdmissionDecision,
  type RevenueGrowthWorkforceRosterAdmissionDecision,
} from "./revenueGrowthWorkforceRosterAdmissionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION,
} from "./revenueGrowthWorkforceRosterAdmissionApprovalRecord";

export const REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION_VERSION =
  "nexus-revenue-growth-workforce-roster-admission-execution-v1" as const;

export interface CreateRevenueGrowthWorkforceRosterAdmissionExecutionInput {
  readonly executionId: string;
  readonly approvalDecision:
    RevenueGrowthWorkforceRosterAdmissionDecision;
  readonly sourceRoster:
    WorldClassAIWorkforceMasterRoster;
  readonly executedAt: string;
}

export interface RevenueGrowthWorkforceRosterAdmissionExecution {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION_VERSION;
  readonly executionId: string;
  readonly executionState:
    "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION_EXECUTED";
  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;
  readonly sourcePreparationId: string;
  readonly sourcePreparationDigest: string;
  readonly sourceRosterVersion:
    typeof WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER_VERSION;
  readonly sourceRosterDigest: string;
  readonly sourceEmployeeCount: number;
  readonly admittedCandidateCount: 9;
  readonly entries:
    readonly AIWorkforceRosterEntry[];
  readonly totalEmployeeCount: number;
  readonly existingActivatedEmployeeCount: 3;
  readonly plannedCandidateCount: number;
  readonly admittedEmployeeIds:
    readonly string[];
  readonly admittedEmployeeCodes:
    readonly string[];
  readonly coveredDepartments:
    readonly AIEmployeeDepartment[];
  readonly sourceRosterPreserved: true;
  readonly humanLikeEmployeeStandard: Readonly<{
    naturalProfessionalCommunicationRequired:
      true;
    contextAwarenessRequired: true;
    proactiveSpecialistWorkRequired: true;
    transparentAIIdentityRequired: true;
    humanImpersonationAuthorized: false;
    fabricatedHumanExperienceAuthorized:
      false;
  }>;
  readonly authorityBoundary: Readonly<{
    rosterAdmissionExecuted: true;
    appendOnlyAdmissionRequired: true;
    sourceRosterPreserved: true;
    duplicateIdentityBlocked: true;
    postAdmissionRosterValidationCompleted:
      true;
    plannedCandidatesRemainUnqualified:
      true;
    plannedCandidateActivationBlocked:
      true;
    ownerQualificationApprovalRequired:
      true;
    ownerActivationApprovalRequired: true;
    factoryAdmissionAuthorized: false;
    templatePreparationAuthorized: false;
    qualificationExecutionAuthorized: false;
    ownerQualificationApprovalRecorded:
      false;
    activationCandidatePreparationAuthorized:
      false;
    ownerActivationAuthorized: false;
    runtimeActivationAuthorized: false;
    controlledWorkAuthorized: false;
    contentDraftingAuthorityGranted: false;
    videoGenerationExecutionAuthorized: false;
    liveSocialPostingAuthorized: false;
    paidAdvertisingSpendAuthorized: false;
    customerMessagingAuthorized: false;
    customerDataAccessAuthorized: false;
    externalDeliveryAuthorized: false;
    productionExecutionAuthorized: false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized: false;
    legalCommitmentAuthorized: false;
    autonomousExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly nextStep:
    "AWAIT_OWNER_REVENUE_GROWTH_FACTORY_ADMISSION_DECISION";
  readonly executedAt: string;
  readonly executionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    const primitive =
      JSON.stringify(value);

    if (primitive === undefined) {
      throw new Error(
        "Unsupported deterministic roster-admission execution value.",
      );
    }

    return primitive;
  }

  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(canonicalize)
        .join(",") +
      "]"
    );
  }

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
          canonicalize(record[key]),
      )
      .join(",") +
    "}"
  );
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      canonicalize(value),
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
    Object.freeze(value);

    for (
      const child of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }
  }

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (
    !/^[0-9a-f]{64}$/.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireExactIsoTimestamp(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp)
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
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
      `${label} must not contain duplicates.`,
    );
  }
}

function validateSourceRoster(
  roster:
    WorldClassAIWorkforceMasterRoster,
): void {
  const {
    rosterDigest,
    ...unsignedRoster
  } = roster;

  requireDigest(
    "Source roster digest",
    rosterDigest,
  );

  if (
    sha256(unsignedRoster) !==
    rosterDigest
  ) {
    throw new Error(
      "Source roster digest verification failed.",
    );
  }

  if (
    roster.version !==
      WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER_VERSION ||
    roster.existingActivatedEmployeeCount !==
      3 ||
    roster.totalEmployeeCount !==
      roster.entries.length
  ) {
    throw new Error(
      "Source roster identity is invalid.",
    );
  }
}

export function validateRevenueGrowthWorkforceRosterAdmissionExecution(
  record:
    RevenueGrowthWorkforceRosterAdmissionExecution,
): void {
  const {
    executionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Roster-admission execution digest",
    executionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    executionDigest
  ) {
    throw new Error(
      "Roster-admission execution digest verification failed.",
    );
  }

  requireIdentifier(
    "Roster-admission execution ID",
    record.executionId,
  );

  requireIdentifier(
    "Roster-admission source decision ID",
    record.sourceDecisionId,
  );

  requireIdentifier(
    "Roster-admission source preparation ID",
    record.sourcePreparationId,
  );

  requireDigest(
    "Roster-admission source decision digest",
    record.sourceDecisionDigest,
  );

  requireDigest(
    "Roster-admission source preparation digest",
    record.sourcePreparationDigest,
  );

  requireDigest(
    "Roster-admission source roster digest",
    record.sourceRosterDigest,
  );

  requireExactIsoTimestamp(
    "Roster-admission execution time",
    record.executedAt,
  );

  if (
    record.version !==
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION_VERSION ||
    record.executionState !==
      "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION_EXECUTED" ||
    record.sourceRosterVersion !==
      WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER_VERSION ||
    record.admittedCandidateCount !==
      9 ||
    record.entries.length !==
      record.totalEmployeeCount ||
    record.totalEmployeeCount !==
      record.sourceEmployeeCount + 9 ||
    record.existingActivatedEmployeeCount !==
      3 ||
    record.admittedEmployeeIds.length !==
      9 ||
    record.admittedEmployeeCodes.length !==
      9 ||
    record.sourceRosterPreserved !==
      true ||
    record.nextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_FACTORY_ADMISSION_DECISION"
  ) {
    throw new Error(
      "Roster-admission execution identity is invalid.",
    );
  }

  requireUnique(
    "Admitted roster employee IDs",
    record.entries.map(
      (entry) =>
        entry.employeeId,
    ),
  );

  requireUnique(
    "Admitted roster employee codes",
    record.entries.map(
      (entry) =>
        entry.employeeCode,
    ),
  );

  requireUnique(
    "Admitted roster public names",
    record.entries.map(
      (entry) =>
        entry.publicName.toLowerCase(),
    ),
  );

  const admittedEntries =
    record.entries.slice(
      record.sourceEmployeeCount,
    );

  if (
    admittedEntries.length !== 9
  ) {
    throw new Error(
      "Roster admission must append exactly nine candidates.",
    );
  }

  admittedEntries.forEach(
    (entry, index) => {
      if (
        entry.employeeId !==
          record.admittedEmployeeIds[index] ||
        entry.employeeCode !==
          record.admittedEmployeeCodes[index] ||
        entry.status !==
          "PLANNED_CANDIDATE" ||
        entry.priorityTier !==
          "REVENUE_READINESS_PRIORITY" ||
        entry.managerRoleKey !==
          "founder-owner-ceo" ||
        entry.qualificationRequired !==
          true ||
        entry.activationAuthorized !==
          false ||
        entry.consequentialAuthorityAuthorized !==
          false ||
        entry.externalCommunicationAuthorized !==
          false ||
        entry.productionExecutionAuthorized !==
          false ||
        entry.financialCommitmentAuthorized !==
          false ||
        entry.legalCommitmentAuthorized !==
          false
      ) {
        throw new Error(
          "Admitted revenue-growth roster candidate is invalid.",
        );
      }
    },
  );

  const plannedCandidates =
    record.entries.filter(
      (entry) =>
        entry.status ===
        "PLANNED_CANDIDATE",
    );

  if (
    plannedCandidates.length !==
      record.plannedCandidateCount ||
    plannedCandidates.some(
      (entry) =>
        entry.qualificationRequired !==
          true ||
        entry.activationAuthorized !==
          false
    )
  ) {
    throw new Error(
      "Admitted planned candidates must remain unqualified and activation-blocked.",
    );
  }

  const expectedDepartments =
    AI_EMPLOYEE_DEPARTMENTS.filter(
      (department) =>
        record.entries.some(
          (entry) =>
            entry.department ===
            department,
        ),
    );

  if (
    expectedDepartments.length !==
      AI_EMPLOYEE_DEPARTMENTS.length ||
    canonicalize(
      record.coveredDepartments,
    ) !==
      canonicalize(
        expectedDepartments,
      )
  ) {
    throw new Error(
      "Admitted roster must preserve complete department coverage.",
    );
  }

  const humanLike =
    record.humanLikeEmployeeStandard;

  if (
    humanLike.naturalProfessionalCommunicationRequired !==
      true ||
    humanLike.contextAwarenessRequired !==
      true ||
    humanLike.proactiveSpecialistWorkRequired !==
      true ||
    humanLike.transparentAIIdentityRequired !==
      true ||
    humanLike.humanImpersonationAuthorized !==
      false ||
    humanLike.fabricatedHumanExperienceAuthorized !==
      false
  ) {
    throw new Error(
      "Human-like AI employee standard is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.rosterAdmissionExecuted !==
      true ||
    boundary.appendOnlyAdmissionRequired !==
      true ||
    boundary.sourceRosterPreserved !==
      true ||
    boundary.duplicateIdentityBlocked !==
      true ||
    boundary.postAdmissionRosterValidationCompleted !==
      true ||
    boundary.plannedCandidatesRemainUnqualified !==
      true ||
    boundary.plannedCandidateActivationBlocked !==
      true ||
    boundary.ownerQualificationApprovalRequired !==
      true ||
    boundary.ownerActivationApprovalRequired !==
      true ||
    boundary.factoryAdmissionAuthorized !==
      false ||
    boundary.templatePreparationAuthorized !==
      false ||
    boundary.qualificationExecutionAuthorized !==
      false ||
    boundary.ownerQualificationApprovalRecorded !==
      false ||
    boundary.activationCandidatePreparationAuthorized !==
      false ||
    boundary.ownerActivationAuthorized !==
      false ||
    boundary.runtimeActivationAuthorized !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.contentDraftingAuthorityGranted !==
      false ||
    boundary.videoGenerationExecutionAuthorized !==
      false ||
    boundary.liveSocialPostingAuthorized !==
      false ||
    boundary.paidAdvertisingSpendAuthorized !==
      false ||
    boundary.customerMessagingAuthorized !==
      false ||
    boundary.customerDataAccessAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.productionExecutionAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Roster-admission execution authority boundary is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceRosterAdmissionExecution(
  input:
    CreateRevenueGrowthWorkforceRosterAdmissionExecutionInput,
): RevenueGrowthWorkforceRosterAdmissionExecution {
  const decision =
    input.approvalDecision;

  validateRevenueGrowthWorkforceRosterAdmissionDecision(
    decision,
  );

  validateSourceRoster(
    input.sourceRoster,
  );

  requireIdentifier(
    "Roster-admission execution ID",
    input.executionId,
  );

  requireExactIsoTimestamp(
    "Roster-admission execution time",
    input.executedAt,
  );

  if (
    decision.decision !==
      "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION" ||
    decision.rosterAdmissionApproved !==
      true ||
    decision.authorityBoundary
      .rosterAdmissionAuthorized !==
      true ||
    decision.authorityBoundary
      .rosterMutationAuthorized !==
      true ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION"
  ) {
    throw new Error(
      "Approved revenue-growth roster-admission evidence is required.",
    );
  }

  if (
    decision.sourceRosterDigest !==
      input.sourceRoster.rosterDigest
  ) {
    throw new Error(
      "Roster-admission approval is not bound to the supplied source roster.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Roster admission cannot precede owner approval.",
    );
  }

  const sourceEntries =
    input.sourceRoster.entries.map(
      (entry) => ({
        ...entry,
      }),
    );

  const admittedEntries:
    AIWorkforceRosterEntry[] =
      decision.candidateRosterAdmissionEligibility.map(
        (candidate) => {
          if (
            candidate.rosterAdmissionAuthorized !==
              true ||
            candidate.targetRosterStatus !==
              "PLANNED_CANDIDATE"
          ) {
            throw new Error(
              "Every admitted candidate requires explicit roster-admission authority.",
            );
          }

          return {
            employeeId:
              candidate.employeeId,
            employeeCode:
              candidate.employeeCode,
            publicName:
              candidate.publicName,
            officialRole:
              candidate.officialRole,
            department:
              candidate.department,
            managerRoleKey:
              "founder-owner-ceo",
            status:
              "PLANNED_CANDIDATE",
            priorityTier:
              "REVENUE_READINESS_PRIORITY",
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
          };
        },
      );

  const entries =
    [
      ...sourceEntries,
      ...admittedEntries,
    ];

  requireUnique(
    "Expanded roster employee IDs",
    entries.map(
      (entry) =>
        entry.employeeId,
    ),
  );

  requireUnique(
    "Expanded roster employee codes",
    entries.map(
      (entry) =>
        entry.employeeCode,
    ),
  );

  requireUnique(
    "Expanded roster public names",
    entries.map(
      (entry) =>
        entry.publicName.toLowerCase(),
    ),
  );

  const plannedCandidates =
    entries.filter(
      (entry) =>
        entry.status ===
        "PLANNED_CANDIDATE",
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

  const executionCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION_VERSION,
    executionId:
      input.executionId,
    executionState:
      "OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourcePreparationId:
      decision.sourcePreparationId,
    sourcePreparationDigest:
      decision.sourcePreparationDigest,
    sourceRosterVersion:
      input.sourceRoster.version,
    sourceRosterDigest:
      input.sourceRoster.rosterDigest,
    sourceEmployeeCount:
      input.sourceRoster.totalEmployeeCount,
    admittedCandidateCount:
      9 as const,
    entries,
    totalEmployeeCount:
      entries.length,
    existingActivatedEmployeeCount:
      3 as const,
    plannedCandidateCount:
      plannedCandidates.length,
    admittedEmployeeIds:
      admittedEntries.map(
        (entry) =>
          entry.employeeId,
      ),
    admittedEmployeeCodes:
      admittedEntries.map(
        (entry) =>
          entry.employeeCode,
      ),
    coveredDepartments,
    sourceRosterPreserved:
      true as const,
    humanLikeEmployeeStandard: {
      naturalProfessionalCommunicationRequired:
        true as const,
      contextAwarenessRequired:
        true as const,
      proactiveSpecialistWorkRequired:
        true as const,
      transparentAIIdentityRequired:
        true as const,
      humanImpersonationAuthorized:
        false as const,
      fabricatedHumanExperienceAuthorized:
        false as const,
    },
    authorityBoundary: {
      rosterAdmissionExecuted:
        true as const,
      appendOnlyAdmissionRequired:
        true as const,
      sourceRosterPreserved:
        true as const,
      duplicateIdentityBlocked:
        true as const,
      postAdmissionRosterValidationCompleted:
        true as const,
      plannedCandidatesRemainUnqualified:
        true as const,
      plannedCandidateActivationBlocked:
        true as const,
      ownerQualificationApprovalRequired:
        true as const,
      ownerActivationApprovalRequired:
        true as const,
      factoryAdmissionAuthorized:
        false as const,
      templatePreparationAuthorized:
        false as const,
      qualificationExecutionAuthorized:
        false as const,
      ownerQualificationApprovalRecorded:
        false as const,
      activationCandidatePreparationAuthorized:
        false as const,
      ownerActivationAuthorized:
        false as const,
      runtimeActivationAuthorized:
        false as const,
      controlledWorkAuthorized:
        false as const,
      contentDraftingAuthorityGranted:
        false as const,
      videoGenerationExecutionAuthorized:
        false as const,
      liveSocialPostingAuthorized:
        false as const,
      paidAdvertisingSpendAuthorized:
        false as const,
      customerMessagingAuthorized:
        false as const,
      customerDataAccessAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      productionExecutionAuthorized:
        false as const,
      paymentExecutionAuthorized:
        false as const,
      financialCommitmentAuthorized:
        false as const,
      legalCommitmentAuthorized:
        false as const,
      autonomousExecutionAuthorized:
        false as const,
      publicLaunchAuthorized:
        false as const,
    },
    nextStep:
      "AWAIT_OWNER_REVENUE_GROWTH_FACTORY_ADMISSION_DECISION" as const,
    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,
      executionDigest:
        sha256(executionCore),
    }) as RevenueGrowthWorkforceRosterAdmissionExecution;

  validateRevenueGrowthWorkforceRosterAdmissionExecution(
    execution,
  );

  return execution;
}

export const REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION =
  createRevenueGrowthWorkforceRosterAdmissionExecution({
    executionId:
      "revenue-growth-workforce-roster-admission-execution-001",
    approvalDecision:
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION,
    sourceRoster:
      WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
    executedAt:
      "2026-07-21T01:42:06.259Z",
  });
