import { createHash } from "node:crypto";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_DECISIONS = [
  "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1",
  "REJECT_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1",
] as const;

export type AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecisionType =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_DECISIONS)[number];

export interface CreateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecisionInput {
  readonly sourcePreparation:
    typeof AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION;
  readonly decisionId: string;
  readonly ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

const preparation =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record).sort().map((key) => [key, normalize(record[key])]),
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

function buildDecision(
  input: Omit<
    CreateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecisionInput,
    "sourcePreparation"
  >,
) {
  const approved =
    input.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1";

  const core = {
    version:
      "nexus-autonomous-global-growth-social-media-ai-employee-factory-admission-owner-decision-v1" as const,
    decisionId: input.decisionId,
    ownerId: input.ownerId,
    sourcePreparationId: preparation.preparationId,
    sourcePreparationDigest: preparation.preparationDigest,
    decision: input.decision,
    reason: input.reason,
    preparationAccepted: approved,
    candidateAuthorizations:
      preparation.candidateAdmissionPreparations.map((candidate) => ({
        employeeId: candidate.employeeId,
        employeeCode: candidate.employeeCode,
        publicName: candidate.publicName,
        factoryAdmissionAuthorized: approved,
        factoryRecordCreationAuthorized: approved,
        targetLifecycleState: "PLANNED_CANDIDATE" as const,
        qualificationExecutionAuthorized: false as const,
        employeeActivationAuthorized: false as const,
        runtimeAuthorized: false as const,
        externalActionAuthorized: false as const,
      })),
    authorityBoundary: {
      ownerDecisionRecorded: true as const,
      existingFactoryCandidatesPreserved: true as const,
      duplicateFactoryIdentityBlocked: true as const,
      appendOnlyFactoryRecordsRequired: true as const,
      factoryAdmissionAuthorized: approved,
      factoryRecordCreationAuthorized: approved,
      templatePreparationAuthorized: false as const,
      qualificationAdmissionAuthorized: false as const,
      qualificationExecutionAuthorized: false as const,
      employeeActivationAuthorized: false as const,
      runtimeAuthorized: false as const,
      credentialAccessAuthorized: false as const,
      liveConnectorActivationAuthorized: false as const,
      publicPublishingAuthorized: false as const,
      customerMessagingAuthorized: false as const,
      paidAdvertisingAuthorized: false as const,
      productionExecutionAuthorized: false as const,
      autonomousExternalActionAuthorized: false as const,
      blockedMetaAccountBypassAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      founderLiberationAchieved: false as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep: approved
      ? ("EXECUTE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1" as const)
      : ("RETAIN_FACTORY_ADMISSION_PREPARATION_AWAITING_OWNER_REVIEW" as const),
    decidedAt: input.decidedAt,
  };

  return deepFreeze({...core, decisionDigest: sha256(core)});
}

export type AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision =
  ReturnType<typeof buildDecision>;

export function validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(
  record: AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision,
): void {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation(
    preparation,
  );

  const approved =
    record.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1";

  const expected = buildDecision({
    decisionId: record.decisionId,
    ownerId: record.ownerId,
    decision: record.decision,
    reason: record.reason,
    decidedAt: record.decidedAt,
  });

  if (
    record.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.reason.trim() !== record.reason ||
    record.reason.length < 120 ||
    Number.isNaN(Date.parse(record.decidedAt)) ||
    new Date(record.decidedAt).toISOString() !== record.decidedAt ||
    Date.parse(record.decidedAt) < Date.parse(preparation.preparedAt) ||
    record.preparationAccepted !== approved ||
    record.candidateAuthorizations.length !== 9 ||
    record.candidateAuthorizations.some(
      (candidate) =>
        candidate.factoryAdmissionAuthorized !== approved ||
        candidate.factoryRecordCreationAuthorized !== approved ||
        candidate.targetLifecycleState !== "PLANNED_CANDIDATE" ||
        candidate.qualificationExecutionAuthorized !== false ||
        candidate.employeeActivationAuthorized !== false ||
        candidate.runtimeAuthorized !== false ||
        candidate.externalActionAuthorized !== false,
    ) ||
    record.authorityBoundary.factoryAdmissionAuthorized !== approved ||
    record.authorityBoundary.factoryRecordCreationAuthorized !== approved ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.customerMessagingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    record.decisionDigest !== expected.decisionDigest ||
    sha256(record) !== sha256(expected) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.candidateAuthorizations) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error("Global Growth Factory-admission decision is invalid.");
  }
}

export function createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(
  input: CreateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecisionInput,
): AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision {
  if (input.sourcePreparation !== preparation) {
    throw new Error("Only the canonical Factory-admission preparation can be reviewed.");
  }

  if (input.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID) {
    throw new Error("Only the verified NEXUS owner can issue this decision.");
  }

  const record = buildDecision(input);
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(record);
  return record;
}
