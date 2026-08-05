import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
} from "./aiEmployeeFactoryLifecycle";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeRoster";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISION,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewApprovalRecord";

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION_VERSION =
  "nexus-autonomous-global-growth-social-media-ai-employee-factory-admission-preparation-v1" as const;

const roster =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER;
const approval =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISION;
const factory =
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION;

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

function validatePrerequisites(preparedAt: string): void {
  if (
    approval.rosterAccepted !== true ||
    approval.authorityBoundary.rosterApproved !== true ||
    approval.authorityBoundary.factoryAdmissionPreparationAuthorized !== true ||
    approval.authorityBoundary.factoryAdmissionAuthorized !== false ||
    approval.authorityBoundary.qualificationExecutionAuthorized !== false ||
    approval.authorityBoundary.employeeActivationAuthorized !== false ||
    approval.authorityBoundary.publicPublishingAuthorized !== false ||
    approval.authorityBoundary.customerMessagingAuthorized !== false ||
    approval.authorityBoundary.founderLiberationAchieved !== false ||
    approval.nextStep !==
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1"
  ) {
    throw new Error("Factory-admission preparation approval is invalid.");
  }

  if (
    Number.isNaN(Date.parse(preparedAt)) ||
    new Date(preparedAt).toISOString() !== preparedAt ||
    Date.parse(preparedAt) < Date.parse(approval.decidedAt)
  ) {
    throw new Error("Factory-admission preparation time is invalid.");
  }
}

function buildPreparation(preparedAt: string) {
  validatePrerequisites(preparedAt);

  const existingEntries = roster.entries.filter(
    (entry) =>
      entry.sourceType === "EXISTING_MASTER_ROSTER_CANDIDATE",
  );

  const newEntries = roster.entries.filter(
    (entry) =>
      entry.sourceType === "NEW_SPECIALIST_CANDIDATE_PROPOSAL",
  );

  const existingFactoryBindings = existingEntries.map((entry) => {
    const factoryRecord = factory.candidateRecords.find(
      (record) =>
        record.employeeId === entry.employeeId &&
        record.employeeCode === entry.employeeCode,
    );

    if (
      !factoryRecord ||
      factoryRecord.lifecycleState !== "PLANNED_CANDIDATE" ||
      factoryRecord.runtimeAuthorized !== false ||
      factoryRecord.ownerActivationApproved !== false
    ) {
      throw new Error(
        `Existing Marketing candidate is not safely bound to Factory: ${entry.publicName}.`,
      );
    }

    return {
      employeeId: entry.employeeId,
      employeeCode: entry.employeeCode,
      publicName: entry.publicName,
      officialRole: entry.officialRole,
      factoryRecordId: factoryRecord.factoryRecordId,
      sourceLifecycleState: "PLANNED_CANDIDATE" as const,
      factoryAdmissionRequired: false as const,
      duplicateFactoryAdmissionBlocked: true as const,
    };
  });

  const candidateAdmissionPreparations = newEntries.map((entry) => ({
    employeeId: entry.employeeId,
    employeeCode: entry.employeeCode,
    publicName: entry.publicName,
    officialRole: entry.officialRole,
    department: "MARKETING" as const,
    functionKey: entry.functionKey,
    sourceLifecycleState: "PLANNED_CANDIDATE" as const,
    targetFactoryLifecycleState: "PLANNED_CANDIDATE" as const,
    factoryAdmissionPrepared: true as const,
    factoryAdmissionAuthorized: false as const,
    factoryRecordCreationAuthorized: false as const,
    templatePreparationAuthorized: false as const,
    qualificationAdmissionAuthorized: false as const,
    qualificationExecutionAuthorized: false as const,
    employeeActivationAuthorized: false as const,
    runtimeAuthorized: false as const,
    externalActionAuthorized: false as const,
  }));

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION_VERSION,
    preparationId:
      "autonomous-global-growth-social-media-ai-employee-factory-admission-preparation-001",
    preparationState:
      "FACTORY_ADMISSION_PREPARED_AWAITING_OWNER_REVIEW" as const,
    sourceRosterId: roster.rosterId,
    sourceRosterDigest: roster.rosterDigest,
    sourceOwnerDecisionId: approval.decisionId,
    sourceOwnerDecisionDigest: approval.decisionDigest,
    sourceFactoryFoundationDigest: factory.foundationDigest,
    totalRosterCandidateCount: 12 as const,
    existingFactoryCandidateCount: 3 as const,
    newFactoryAdmissionCandidateCount: 9 as const,
    existingFactoryBindings,
    candidateAdmissionPreparations,
    authorityBoundary: {
      preparationOnly: true as const,
      ownerReviewRequired: true as const,
      sourceFactoryFoundationPreserved: true as const,
      duplicateFactoryIdentityBlocked: true as const,
      factoryAdmissionAuthorized: false as const,
      factoryRecordCreationAuthorized: false as const,
      templatePreparationAuthorized: false as const,
      qualificationAdmissionAuthorized: false as const,
      qualificationExecutionAuthorized: false as const,
      employeeActivationAuthorized: false as const,
      runtimeAuthorized: false as const,
      realCredentialAccessAuthorized: false as const,
      liveConnectorActivationAuthorized: false as const,
      publicPublishingAuthorized: false as const,
      customerMessagingAuthorized: false as const,
      commentResponseAuthorized: false as const,
      leadContactAuthorized: false as const,
      demoBookingExecutionAuthorized: false as const,
      proposalDeliveryAuthorized: false as const,
      paidAdvertisingAuthorized: false as const,
      productionExecutionAuthorized: false as const,
      autonomousExternalActionAuthorized: false as const,
      blockedMetaAccountUseAuthorized: false as const,
      blockedMetaAccountBypassAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      founderLiberationAchieved: false as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_REVIEW_OF_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION_V1" as const,
    preparedAt,
  };

  return deepFreeze({
    ...core,
    preparationDigest: sha256(core),
  });
}

export type AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation =
  ReturnType<typeof buildPreparation>;

export function validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation(
  record: AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation,
): void {
  const expected = buildPreparation(record.preparedAt);

  const ids = record.candidateAdmissionPreparations.map(
    (candidate) => candidate.employeeId,
  );
  const codes = record.candidateAdmissionPreparations.map(
    (candidate) => candidate.employeeCode,
  );

  if (
    record.preparationDigest !== expected.preparationDigest ||
    sha256(record) !== sha256(expected) ||
    record.existingFactoryBindings.length !== 3 ||
    record.candidateAdmissionPreparations.length !== 9 ||
    new Set(ids).size !== 9 ||
    new Set(codes).size !== 9 ||
    record.candidateAdmissionPreparations.some(
      (candidate) =>
        candidate.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
        candidate.targetFactoryLifecycleState !== "PLANNED_CANDIDATE" ||
        candidate.factoryAdmissionPrepared !== true ||
        candidate.factoryAdmissionAuthorized !== false ||
        candidate.factoryRecordCreationAuthorized !== false ||
        candidate.qualificationExecutionAuthorized !== false ||
        candidate.employeeActivationAuthorized !== false ||
        candidate.runtimeAuthorized !== false ||
        candidate.externalActionAuthorized !== false,
    ) ||
    record.authorityBoundary.factoryAdmissionAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.customerMessagingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.existingFactoryBindings) ||
    !Object.isFrozen(record.candidateAdmissionPreparations) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth Social Media Factory-admission preparation is invalid.",
    );
  }
}

export function createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation(
  preparedAt: string,
): AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation {
  const record = buildPreparation(preparedAt);

  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION =
  createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation(
    "2026-08-05T03:56:54.676Z",
  );