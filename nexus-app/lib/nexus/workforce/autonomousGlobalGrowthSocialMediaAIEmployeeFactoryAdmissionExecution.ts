import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
  AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
  type AIEmployeeFactoryCandidateRecord,
} from "./aiEmployeeFactoryLifecycle";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_OWNER_REVIEW_DECISION,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparationOwnerReviewApprovalRecord";
import {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparationOwnerReviewDecision";

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION_VERSION =
  "nexus-autonomous-global-growth-social-media-ai-employee-factory-admission-execution-v1" as const;

const foundation =
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION;
const preparation =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION;
const decision =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_OWNER_REVIEW_DECISION;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);

  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, normalize(record[key])]),
    );
  }

  return value;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(normalize(value)), "utf8")
    .digest("hex");
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }

  return value;
}

function requireTimestamp(value: string): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value ||
    Date.parse(value) < Date.parse(decision.decidedAt)
  ) {
    throw new Error("Factory-admission execution time is invalid.");
  }
}

function validatePrerequisites(): void {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(
    decision,
  );

  if (
    decision.preparationAccepted !== true ||
    decision.authorityBoundary.factoryAdmissionAuthorized !== true ||
    decision.authorityBoundary.factoryRecordCreationAuthorized !== true ||
    decision.authorityBoundary.qualificationExecutionAuthorized !== false ||
    decision.authorityBoundary.employeeActivationAuthorized !== false ||
    decision.authorityBoundary.publicPublishingAuthorized !== false ||
    decision.authorityBoundary.customerMessagingAuthorized !== false ||
    decision.authorityBoundary.productionExecutionAuthorized !== false ||
    decision.authorityBoundary.founderLiberationAchieved !== false ||
    decision.candidateAuthorizations.length !== 9 ||
    decision.nextStep !==
      "EXECUTE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1" ||
    decision.sourcePreparationId !== preparation.preparationId ||
    decision.sourcePreparationDigest !== preparation.preparationDigest
  ) {
    throw new Error(
      "Approved Global Growth Factory-admission evidence is invalid.",
    );
  }
}

function createFactoryRecord(
  employeeId: string,
  employeeCode: string,
  executedAt: string,
): AIEmployeeFactoryCandidateRecord {
  const authorization = decision.candidateAuthorizations.find(
    (candidate) =>
      candidate.employeeId === employeeId &&
      candidate.employeeCode === employeeCode,
  );

  const candidate = preparation.candidateAdmissionPreparations.find(
    (entry) =>
      entry.employeeId === employeeId &&
      entry.employeeCode === employeeCode,
  );

  if (
    !authorization ||
    !candidate ||
    authorization.factoryAdmissionAuthorized !== true ||
    authorization.factoryRecordCreationAuthorized !== true ||
    authorization.targetLifecycleState !== "PLANNED_CANDIDATE" ||
    authorization.qualificationExecutionAuthorized !== false ||
    authorization.employeeActivationAuthorized !== false ||
    authorization.runtimeAuthorized !== false ||
    authorization.externalActionAuthorized !== false ||
    candidate.factoryAdmissionPrepared !== true ||
    candidate.factoryAdmissionAuthorized !== false ||
    candidate.qualificationExecutionAuthorized !== false ||
    candidate.employeeActivationAuthorized !== false ||
    candidate.runtimeAuthorized !== false ||
    candidate.externalActionAuthorized !== false
  ) {
    throw new Error(
      `Candidate is not eligible for controlled Factory admission: ${employeeCode}.`,
    );
  }

  const recordCore = {
    version:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
    factoryRecordId:
      `factory-record-${candidate.employeeId}`,
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
    createdAt:
      executedAt,
  };

  return deepFreeze({
    ...recordCore,
    recordDigest: sha256(recordCore),
  }) as AIEmployeeFactoryCandidateRecord;
}

function buildExecution(executedAt: string) {
  validatePrerequisites();
  requireTimestamp(executedAt);

  const candidateRecords =
    preparation.candidateAdmissionPreparations.map(
      (candidate) =>
        createFactoryRecord(
          candidate.employeeId,
          candidate.employeeCode,
          executedAt,
        ),
    );

  const existingRecordIds = new Set(
    foundation.candidateRecords.map(
      (candidate) => candidate.factoryRecordId,
    ),
  );

  const existingEmployeeIds = new Set(
    foundation.candidateRecords.map(
      (candidate) => candidate.employeeId,
    ),
  );

  const existingEmployeeCodes = new Set(
    foundation.candidateRecords.map(
      (candidate) => candidate.employeeCode,
    ),
  );

  for (const candidate of candidateRecords) {
    if (
      existingRecordIds.has(candidate.factoryRecordId) ||
      existingEmployeeIds.has(candidate.employeeId) ||
      existingEmployeeCodes.has(candidate.employeeCode)
    ) {
      throw new Error(
        `Factory admission collides with preserved Factory identity: ${candidate.publicName}.`,
      );
    }
  }

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION_VERSION,
    executionId:
      "autonomous-global-growth-social-media-ai-employee-factory-admission-execution-001",
    executionState:
      "OWNER_CONTROLLED_GLOBAL_GROWTH_FACTORY_ADMISSION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourcePreparationId:
      preparation.preparationId,
    sourcePreparationDigest:
      preparation.preparationDigest,
    sourceFactoryFoundationVersion:
      foundation.version,
    sourceFactoryFoundationDigest:
      foundation.foundationDigest,
    sourceFactoryCandidateCount:
      foundation.plannedCandidateCount,
    preservedExistingMarketingCandidateCount:
      3 as const,
    admittedFactoryCandidateCount:
      9 as const,
    candidateRecords,
    admittedFactoryRecordIds:
      candidateRecords.map(
        (candidate) => candidate.factoryRecordId,
      ),
    sourceFactoryFoundationPreserved:
      true as const,
    authorityBoundary: {
      factoryAdmissionExecuted:
        true as const,
      appendOnlyFactoryRecordsRequired:
        true as const,
      sourceFactoryFoundationPreserved:
        true as const,
      existingMarketingFactoryCandidatesPreserved:
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
      realCredentialAccessAuthorized:
        false as const,
      liveConnectorActivationAuthorized:
        false as const,
      contentDraftingAuthorityGranted:
        false as const,
      videoGenerationExecutionAuthorized:
        false as const,
      publicPublishingAuthorized:
        false as const,
      customerMessagingAuthorized:
        false as const,
      commentResponseAuthorized:
        false as const,
      leadContactAuthorized:
        false as const,
      demoBookingExecutionAuthorized:
        false as const,
      proposalDeliveryAuthorized:
        false as const,
      paidAdvertisingAuthorized:
        false as const,
      productionExecutionAuthorized:
        false as const,
      autonomousExternalActionAuthorized:
        false as const,
      blockedMetaAccountUseAuthorized:
        false as const,
      blockedMetaAccountBypassAuthorized:
        false as const,
      levelThreeAuthorityGranted:
        false as const,
      founderLiberationAchieved:
        false as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    nextStep:
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_V1" as const,
    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest: sha256(core),
  });
}

export type AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution =
  ReturnType<typeof buildExecution>;

export function validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution(
  record: AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution,
): void {
  const expected = buildExecution(record.executedAt);

  const recordIds = record.candidateRecords.map(
    (candidate) => candidate.factoryRecordId,
  );
  const employeeIds = record.candidateRecords.map(
    (candidate) => candidate.employeeId,
  );
  const employeeCodes = record.candidateRecords.map(
    (candidate) => candidate.employeeCode,
  );

  if (
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.admittedFactoryCandidateCount !== 9 ||
    record.preservedExistingMarketingCandidateCount !== 3 ||
    record.candidateRecords.length !== 9 ||
    record.admittedFactoryRecordIds.length !== 9 ||
    new Set(recordIds).size !== 9 ||
    new Set(employeeIds).size !== 9 ||
    new Set(employeeCodes).size !== 9 ||
    record.candidateRecords.some(
      (candidate) =>
        candidate.lifecycleState !== "PLANNED_CANDIDATE" ||
        candidate.templatePrepared !== false ||
        candidate.qualificationAdmissionAuthorized !== false ||
        candidate.qualificationEvidenceAccepted !== false ||
        candidate.ownerQualificationApproved !== false ||
        candidate.activationCandidatePrepared !== false ||
        candidate.ownerActivationApproved !== false ||
        candidate.runtimeAuthorized !== false ||
        candidate.consequentialAuthorityAuthorized !== false ||
        candidate.externalCommunicationAuthorized !== false ||
        candidate.productionExecutionAuthorized !== false ||
        candidate.financialCommitmentAuthorized !== false ||
        candidate.legalCommitmentAuthorized !== false,
    ) ||
    record.authorityBoundary.factoryAdmissionExecuted !== true ||
    record.authorityBoundary.templatePreparationAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.ownerActivationApproved !== false ||
    record.authorityBoundary.runtimeAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.customerMessagingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.candidateRecords) ||
    !Object.isFrozen(record.admittedFactoryRecordIds) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth Social Media Factory-admission execution is invalid.",
    );
  }
}

export function createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution(
  executedAt: string,
): AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution {
  const record = buildExecution(executedAt);

  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION =
  createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution(
    "2026-08-05T17:09:33.757Z",
  );