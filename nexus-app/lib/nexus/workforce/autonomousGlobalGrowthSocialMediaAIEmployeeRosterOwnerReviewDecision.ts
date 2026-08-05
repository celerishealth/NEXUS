import { createHash } from "node:crypto";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeRoster,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeRoster";
import { ENGINEERING_AI_WORKFORCE_OWNER_ID } from "./engineeringAIWorkforceDevelopmentPlanDecision";

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISIONS = [
  "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_V1",
  "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_AWAITING_REVIEW",
] as const;

export type AutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecisionType =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISIONS)[number];

export interface CreateAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecisionInput {
  readonly sourceRoster: typeof AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER;
  readonly decisionId: string;
  readonly ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision: AutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

const roster = AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER;

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record).sort().map((key) => [key, stable(record[key])]),
    );
  }
  return value;
}

function digest(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(stable(value)), "utf8")
    .digest("hex");
}

function freeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function validatePrerequisites(): void {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeRoster(roster);

  if (
    roster.totalEmployeeCount !== 12 ||
    roster.coveredFunctionCount !== 12 ||
    roster.existingMasterRosterCandidateCount !== 3 ||
    roster.newSpecialistCandidateProposalCount !== 9 ||
    roster.entries.some(
      (entry) =>
        entry.lifecycleState !== "PLANNED_CANDIDATE" ||
        entry.qualificationRequired !== true ||
        entry.activationAuthorized !== false ||
        entry.externalActionAuthorized !== false,
    ) ||
    roster.safetyBoundary.publicPublishingAuthorized !== false ||
    roster.safetyBoundary.customerMessagingAuthorized !== false ||
    roster.safetyBoundary.liveConnectorActivationAuthorized !== false ||
    roster.safetyBoundary.founderLiberationAchieved !== false
  ) {
    throw new Error("Canonical Global Growth roster is invalid.");
  }
}

function buildDecision(
  input: Omit<
    CreateAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecisionInput,
    "sourceRoster"
  >,
) {
  const approved =
    input.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_V1";

  const core = {
    version:
      "nexus-autonomous-global-growth-social-media-ai-employee-roster-owner-review-decision-v1" as const,
    decisionId: input.decisionId,
    ownerId: input.ownerId,
    sourceRosterId: roster.rosterId,
    sourceRosterDigest: roster.rosterDigest,
    decision: input.decision,
    reason: input.reason,
    rosterAccepted: approved,
    reviewedEvidence: {
      totalEmployeeCount: 12 as const,
      coveredFunctionCount: 12 as const,
      existingCandidateCount: 3 as const,
      newCandidateProposalCount: 9 as const,
      allCandidatesInactive: true as const,
      allExternalActionsBlocked: true as const,
      founderLiberationAchieved: false as const,
    },
    authorityBoundary: {
      rosterApproved: approved,
      factoryAdmissionPreparationAuthorized: approved,
      factoryAdmissionAuthorized: false as const,
      qualificationExecutionAuthorized: false as const,
      employeeActivationAuthorized: false as const,
      realCredentialAccessAuthorized: false as const,
      liveConnectorActivationAuthorized: false as const,
      publicPublishingAuthorized: false as const,
      customerMessagingAuthorized: false as const,
      productionExecutionAuthorized: false as const,
      autonomousExternalActionAuthorized: false as const,
      blockedMetaAccountUseAuthorized: false as const,
      blockedMetaAccountBypassAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      founderLiberationAchieved: false as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep: approved
      ? ("PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1" as const)
      : ("RETAIN_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_AWAITING_OWNER_REVIEW" as const),
    decidedAt: input.decidedAt,
  };

  return freeze({ ...core, decisionDigest: digest(core) });
}

export type AutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision(
  record: AutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision,
): void {
  validatePrerequisites();

  const expected = buildDecision({
    decisionId: record.decisionId,
    ownerId: record.ownerId,
    decision: record.decision,
    reason: record.reason,
    decidedAt: record.decidedAt,
  });

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.decisionId) ||
    record.reason.trim() !== record.reason ||
    record.reason.length < 120 ||
    Number.isNaN(Date.parse(record.decidedAt)) ||
    new Date(record.decidedAt).toISOString() !== record.decidedAt ||
    Date.parse(record.decidedAt) < Date.parse(roster.createdAt) ||
    record.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.decisionDigest !== expected.decisionDigest ||
    digest(record) !== digest(expected) ||
    record.authorityBoundary.factoryAdmissionAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.customerMessagingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error("Global Growth roster owner-review decision is invalid.");
  }
}

export function createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision(
  input: CreateAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecisionInput,
): AutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision {
  if (input.sourceRoster !== roster) {
    throw new Error("Only the canonical Global Growth roster can receive owner review.");
  }

  validatePrerequisites();

  if (input.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID) {
    throw new Error("Only the verified NEXUS owner can review this roster.");
  }

  if (
    !AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error("Global Growth roster owner-review decision is invalid.");
  }

  const record = buildDecision(input);
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision(record);
  return record;
}