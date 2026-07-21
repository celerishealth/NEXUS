import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
  AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
  type AIEmployeeFactoryCandidateRecord,
} from "./aiEmployeeFactoryLifecycle";

import {
  validateRevenueGrowthWorkforceFactoryAdmissionDecision,
  type RevenueGrowthWorkforceFactoryAdmissionDecision,
} from "./revenueGrowthWorkforceFactoryAdmissionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION,
} from "./revenueGrowthWorkforceFactoryAdmissionApprovalRecord";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
} from "./revenueGrowthWorkforceRosterAdmissionExecution";

export const REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION_VERSION =
  "nexus-revenue-growth-workforce-factory-admission-execution-v1" as const;

export interface CreateRevenueGrowthWorkforceFactoryAdmissionExecutionInput {
  readonly executionId: string;
  readonly approvalDecision:
    RevenueGrowthWorkforceFactoryAdmissionDecision;
  readonly executedAt: string;
}

export interface RevenueGrowthWorkforceFactoryAdmissionExecution {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION_VERSION;
  readonly executionId: string;
  readonly executionState:
    "OWNER_CONTROLLED_REVENUE_GROWTH_FACTORY_ADMISSION_EXECUTED";
  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;
  readonly sourceRosterAdmissionExecutionId:
    string;
  readonly sourceRosterAdmissionExecutionDigest:
    string;
  readonly sourceFactoryFoundationVersion:
    typeof AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION;
  readonly sourceFactoryFoundationDigest:
    string;
  readonly sourceFactoryCandidateCount:
    number;
  readonly admittedFactoryCandidateCount:
    9;
  readonly candidateRecords:
    readonly AIEmployeeFactoryCandidateRecord[];
  readonly admittedFactoryRecordIds:
    readonly string[];
  readonly sourceFactoryFoundationPreserved:
    true;
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
    factoryAdmissionExecuted: true;
    appendOnlyFactoryRecordsRequired:
      true;
    sourceFactoryFoundationPreserved:
      true;
    duplicateFactoryIdentityBlocked:
      true;
    initialLifecycleStateLocked:
      true;
    directTemplateBypassBlocked: true;
    directQualificationBypassBlocked:
      true;
    incompleteQualificationBlocked:
      true;
    directActivationBypassBlocked:
      true;
    selfActivationBlocked: true;
    templatePreparationAuthorized:
      false;
    qualificationAdmissionAuthorized:
      false;
    qualificationExecutionAuthorized:
      false;
    qualificationEvidenceAccepted:
      false;
    ownerQualificationApproved:
      false;
    activationCandidatePrepared:
      false;
    ownerActivationApproved: false;
    runtimeAuthorized: false;
    controlledWorkAuthorized: false;
    contentDraftingAuthorityGranted:
      false;
    videoGenerationExecutionAuthorized:
      false;
    liveSocialPostingAuthorized:
      false;
    paidAdvertisingSpendAuthorized:
      false;
    customerMessagingAuthorized: false;
    customerDataAccessAuthorized: false;
    externalDeliveryAuthorized: false;
    productionExecutionAuthorized:
      false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized:
      false;
    legalCommitmentAuthorized: false;
    autonomousExecutionAuthorized:
      false;
    publicLaunchAuthorized: false;
  }>;
  readonly nextStep:
    "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN";
  readonly executedAt: string;
  readonly executionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9-]{2,127}$/;

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
        "Unsupported deterministic factory-admission execution value.",
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

function requireTimestamp(
  label: string,
  value: string,
): void {
  const parsed =
    Date.parse(value);

  if (
    !Number.isFinite(parsed) ||
    new Date(parsed)
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

function createFactoryRecord(
  candidate:
    RevenueGrowthWorkforceFactoryAdmissionDecision[
      "candidateFactoryAdmissionEligibility"
    ][number],
  createdAt: string,
): AIEmployeeFactoryCandidateRecord {
  requireIdentifier(
    "Factory employee ID",
    candidate.employeeId,
  );

  requireIdentifier(
    "Factory employee code",
    candidate.employeeCode,
  );

  if (
    candidate.factoryAdmissionAuthorized !==
      true ||
    candidate.sourceRosterStatus !==
      "PLANNED_CANDIDATE" ||
    candidate.targetFactoryLifecycleState !==
      "PLANNED_CANDIDATE"
  ) {
    throw new Error(
      "Explicit planned-candidate factory-admission authority is required.",
    );
  }

  const recordCore = {
    version:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
    factoryRecordId:
      "factory-record-" +
      candidate.employeeId,
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

export function validateRevenueGrowthWorkforceFactoryAdmissionExecution(
  record:
    RevenueGrowthWorkforceFactoryAdmissionExecution,
): void {
  const {
    executionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Factory-admission execution digest",
    executionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    executionDigest
  ) {
    throw new Error(
      "Factory-admission execution digest verification failed.",
    );
  }

  requireIdentifier(
    "Factory-admission execution ID",
    record.executionId,
  );

  requireIdentifier(
    "Factory-admission source decision ID",
    record.sourceDecisionId,
  );

  requireIdentifier(
    "Source roster-admission execution ID",
    record.sourceRosterAdmissionExecutionId,
  );

  requireDigest(
    "Factory-admission source decision digest",
    record.sourceDecisionDigest,
  );

  requireDigest(
    "Source roster-admission execution digest",
    record.sourceRosterAdmissionExecutionDigest,
  );

  requireDigest(
    "Source factory foundation digest",
    record.sourceFactoryFoundationDigest,
  );

  requireTimestamp(
    "Factory-admission execution time",
    record.executedAt,
  );

  if (
    record.version !==
      REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION_VERSION ||
    record.executionState !==
      "OWNER_CONTROLLED_REVENUE_GROWTH_FACTORY_ADMISSION_EXECUTED" ||
    record.sourceFactoryFoundationVersion !==
      AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION ||
    record.sourceFactoryCandidateCount !==
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .plannedCandidateCount ||
    record.admittedFactoryCandidateCount !==
      9 ||
    record.candidateRecords.length !==
      9 ||
    record.admittedFactoryRecordIds.length !==
      9 ||
    record.sourceFactoryFoundationPreserved !==
      true ||
    record.nextStep !==
      "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN"
  ) {
    throw new Error(
      "Factory-admission execution identity is invalid.",
    );
  }

  requireUnique(
    "Admitted factory record IDs",
    record.candidateRecords.map(
      (candidate) =>
        candidate.factoryRecordId,
    ),
  );

  requireUnique(
    "Admitted factory employee IDs",
    record.candidateRecords.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Admitted factory employee codes",
    record.candidateRecords.map(
      (candidate) =>
        candidate.employeeCode,
    ),
  );

  const existingFactoryRecordIds =
    new Set(
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .candidateRecords.map(
          (candidate) =>
            candidate.factoryRecordId,
        ),
    );

  const existingFactoryEmployeeIds =
    new Set(
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .candidateRecords.map(
          (candidate) =>
            candidate.employeeId,
        ),
    );

  record.candidateRecords.forEach(
    (candidate, index) => {
      const expectedRecordId =
        record.admittedFactoryRecordIds[index];

      requireDigest(
        "Factory candidate record digest",
        candidate.recordDigest,
      );

      const {
        recordDigest,
        ...unsignedCandidate
      } = candidate;

      if (
        sha256(unsignedCandidate) !==
          recordDigest ||
        candidate.factoryRecordId !==
          expectedRecordId ||
        existingFactoryRecordIds.has(
          candidate.factoryRecordId,
        ) ||
        existingFactoryEmployeeIds.has(
          candidate.employeeId,
        ) ||
        candidate.version !==
          AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION ||
        candidate.sourceRosterStatus !==
          "PLANNED_CANDIDATE" ||
        candidate.lifecycleState !==
          "PLANNED_CANDIDATE" ||
        candidate.managerRoleKey !==
          "founder-owner-ceo" ||
        candidate.templatePrepared !==
          false ||
        candidate.qualificationAdmissionAuthorized !==
          false ||
        candidate.qualificationEvidenceAccepted !==
          false ||
        candidate.ownerQualificationApproved !==
          false ||
        candidate.activationCandidatePrepared !==
          false ||
        candidate.ownerActivationApproved !==
          false ||
        candidate.runtimeAuthorized !==
          false ||
        candidate.consequentialAuthorityAuthorized !==
          false ||
        candidate.externalCommunicationAuthorized !==
          false ||
        candidate.productionExecutionAuthorized !==
          false ||
        candidate.financialCommitmentAuthorized !==
          false ||
        candidate.legalCommitmentAuthorized !==
          false ||
        candidate.createdAt !==
          record.executedAt
      ) {
        throw new Error(
          "Admitted revenue-growth factory candidate record is invalid.",
        );
      }
    },
  );

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
      "Factory-admitted human-like AI employee standard is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.factoryAdmissionExecuted !==
      true ||
    boundary.appendOnlyFactoryRecordsRequired !==
      true ||
    boundary.sourceFactoryFoundationPreserved !==
      true ||
    boundary.duplicateFactoryIdentityBlocked !==
      true ||
    boundary.initialLifecycleStateLocked !==
      true ||
    boundary.directTemplateBypassBlocked !==
      true ||
    boundary.directQualificationBypassBlocked !==
      true ||
    boundary.incompleteQualificationBlocked !==
      true ||
    boundary.directActivationBypassBlocked !==
      true ||
    boundary.selfActivationBlocked !==
      true ||
    boundary.templatePreparationAuthorized !==
      false ||
    boundary.qualificationAdmissionAuthorized !==
      false ||
    boundary.qualificationExecutionAuthorized !==
      false ||
    boundary.qualificationEvidenceAccepted !==
      false ||
    boundary.ownerQualificationApproved !==
      false ||
    boundary.activationCandidatePrepared !==
      false ||
    boundary.ownerActivationApproved !==
      false ||
    boundary.runtimeAuthorized !==
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
      "Factory-admission execution authority boundary is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceFactoryAdmissionExecution(
  input:
    CreateRevenueGrowthWorkforceFactoryAdmissionExecutionInput,
): RevenueGrowthWorkforceFactoryAdmissionExecution {
  const decision =
    input.approvalDecision;

  validateRevenueGrowthWorkforceFactoryAdmissionDecision(
    decision,
  );

  requireIdentifier(
    "Factory-admission execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Factory-admission execution time",
    input.executedAt,
  );

  if (
    decision.decision !==
      "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION" ||
    decision.factoryAdmissionApproved !==
      true ||
    decision.authorityBoundary
      .factoryAdmissionAuthorized !==
      true ||
    decision.authorityBoundary
      .factoryRecordCreationAuthorized !==
      true ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_FACTORY_ADMISSION"
  ) {
    throw new Error(
      "Approved revenue-growth factory-admission evidence is required.",
    );
  }

  if (
    decision.sourceExecutionId !==
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
        .executionId ||
    decision.sourceExecutionDigest !==
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
        .executionDigest
  ) {
    throw new Error(
      "Factory-admission approval is not bound to the exact roster-admission execution.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Factory admission cannot precede owner approval.",
    );
  }

  const candidateRecords =
    decision.candidateFactoryAdmissionEligibility.map(
      (candidate) =>
        createFactoryRecord(
          candidate,
          input.executedAt,
        ),
    );

  const existingRecordIds =
    new Set(
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .candidateRecords.map(
          (candidate) =>
            candidate.factoryRecordId,
        ),
    );

  const existingEmployeeIds =
    new Set(
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .candidateRecords.map(
          (candidate) =>
            candidate.employeeId,
        ),
    );

  const existingEmployeeCodes =
    new Set(
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .candidateRecords.map(
          (candidate) =>
            candidate.employeeCode,
        ),
    );

  for (
    const candidate of
    candidateRecords
  ) {
    if (
      existingRecordIds.has(
        candidate.factoryRecordId,
      ) ||
      existingEmployeeIds.has(
        candidate.employeeId,
      ) ||
      existingEmployeeCodes.has(
        candidate.employeeCode,
      )
    ) {
      throw new Error(
        `Factory admission collides with the preserved source foundation: ${candidate.officialRole}.`,
      );
    }
  }

  const executionCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION_VERSION,
    executionId:
      input.executionId,
    executionState:
      "OWNER_CONTROLLED_REVENUE_GROWTH_FACTORY_ADMISSION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourceRosterAdmissionExecutionId:
      decision.sourceExecutionId,
    sourceRosterAdmissionExecutionDigest:
      decision.sourceExecutionDigest,
    sourceFactoryFoundationVersion:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .version,
    sourceFactoryFoundationDigest:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .foundationDigest,
    sourceFactoryCandidateCount:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .plannedCandidateCount,
    admittedFactoryCandidateCount:
      9 as const,
    candidateRecords,
    admittedFactoryRecordIds:
      candidateRecords.map(
        (candidate) =>
          candidate.factoryRecordId,
      ),
    sourceFactoryFoundationPreserved:
      true as const,
    humanLikeEmployeeStandard: {
      naturalProfessionalCommunicationRequired:
        REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
          .humanLikeEmployeeStandard
          .naturalProfessionalCommunicationRequired,
      contextAwarenessRequired:
        REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
          .humanLikeEmployeeStandard
          .contextAwarenessRequired,
      proactiveSpecialistWorkRequired:
        REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
          .humanLikeEmployeeStandard
          .proactiveSpecialistWorkRequired,
      transparentAIIdentityRequired:
        REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
          .humanLikeEmployeeStandard
          .transparentAIIdentityRequired,
      humanImpersonationAuthorized:
        REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
          .humanLikeEmployeeStandard
          .humanImpersonationAuthorized,
      fabricatedHumanExperienceAuthorized:
        REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
          .humanLikeEmployeeStandard
          .fabricatedHumanExperienceAuthorized,
    },
    authorityBoundary: {
      factoryAdmissionExecuted:
        true as const,
      appendOnlyFactoryRecordsRequired:
        true as const,
      sourceFactoryFoundationPreserved:
        true as const,
      duplicateFactoryIdentityBlocked:
        true as const,
      initialLifecycleStateLocked:
        true as const,
      directTemplateBypassBlocked:
        true as const,
      directQualificationBypassBlocked:
        true as const,
      incompleteQualificationBlocked:
        true as const,
      directActivationBypassBlocked:
        true as const,
      selfActivationBlocked:
        true as const,
      templatePreparationAuthorized:
        false as const,
      qualificationAdmissionAuthorized:
        false as const,
      qualificationExecutionAuthorized:
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
      "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN" as const,
    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,
      executionDigest:
        sha256(executionCore),
    }) as RevenueGrowthWorkforceFactoryAdmissionExecution;

  validateRevenueGrowthWorkforceFactoryAdmissionExecution(
    execution,
  );

  return execution;
}

export const REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION =
  createRevenueGrowthWorkforceFactoryAdmissionExecution({
    executionId:
      "revenue-growth-workforce-factory-admission-execution-001",
    approvalDecision:
      REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION,
    executedAt:
      "2026-07-21T02:11:54.683Z",
  });
