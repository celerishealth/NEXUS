import { createHash } from "node:crypto";

import {
  AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISION,
} from "./autonomousGlobalGrowthDepartmentFoundationOwnerReviewApprovalRecord";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "./worldClassAIWorkforceMasterRoster";

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_VERSION =
  "nexus-autonomous-global-growth-social-media-ai-employee-roster-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_FUNCTIONS = [
  "MARKET_INTELLIGENCE",
  "GROWTH_STRATEGY",
  "BRAND_CONTENT_AND_CAMPAIGNS",
  "RESEARCH_AND_FACT_VERIFICATION",
  "COPYWRITING_AND_PLATFORM_ADAPTATION",
  "GRAPHIC_CONTENT_PRODUCTION",
  "VIDEO_CONTENT_PRODUCTION",
  "PUBLISHING_GATEWAY_OPERATIONS",
  "COMMUNITY_ENGAGEMENT_AND_INQUIRIES",
  "LEAD_QUALIFICATION",
  "DEMO_BOOKING_COORDINATION",
  "GROWTH_ANALYTICS_AND_REVENUE_ATTRIBUTION",
] as const;

export type AutonomousGlobalGrowthSocialMediaFunction =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_FUNCTIONS)[number];

export interface AutonomousGlobalGrowthSocialMediaAIEmployeeRosterEntry {
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department: "MARKETING";
  readonly functionKey: AutonomousGlobalGrowthSocialMediaFunction;
  readonly sourceType:
    | "EXISTING_MASTER_ROSTER_CANDIDATE"
    | "NEW_SPECIALIST_CANDIDATE_PROPOSAL";
  readonly lifecycleState: "PLANNED_CANDIDATE";
  readonly qualificationRequired: true;
  readonly activationAuthorized: false;
  readonly externalActionAuthorized: false;
  readonly ownerApprovalRequired: true;
}

const ROSTER_IDENTITIES = [
  ["candidate-anika-v1", "nx-marketing-001", "Anika", "AI Market Intelligence Director", "MARKET_INTELLIGENCE", "EXISTING_MASTER_ROSTER_CANDIDATE"],
  ["candidate-aarav-v1", "nx-marketing-002", "Aarav", "AI Growth Strategy Specialist", "GROWTH_STRATEGY", "EXISTING_MASTER_ROSTER_CANDIDATE"],
  ["candidate-isha-v1", "nx-marketing-003", "Isha", "AI Brand, Content & Campaign Specialist", "BRAND_CONTENT_AND_CAMPAIGNS", "EXISTING_MASTER_ROSTER_CANDIDATE"],
  ["candidate-niyara-growth-research-v1", "nx-marketing-004", "Niyara", "AI Growth Research & Fact Verification Specialist", "RESEARCH_AND_FACT_VERIFICATION", "NEW_SPECIALIST_CANDIDATE_PROPOSAL"],
  ["candidate-rivaan-platform-copy-v1", "nx-marketing-005", "Rivaan", "AI Copywriting & Platform Adaptation Specialist", "COPYWRITING_AND_PLATFORM_ADAPTATION", "NEW_SPECIALIST_CANDIDATE_PROPOSAL"],
  ["candidate-ahaana-graphic-content-v1", "nx-marketing-006", "Ahaana", "AI Graphic Content Production Specialist", "GRAPHIC_CONTENT_PRODUCTION", "NEW_SPECIALIST_CANDIDATE_PROPOSAL"],
  ["candidate-kairav-video-content-v1", "nx-marketing-007", "Kairav", "AI Video Content Production Specialist", "VIDEO_CONTENT_PRODUCTION", "NEW_SPECIALIST_CANDIDATE_PROPOSAL"],
  ["candidate-samyra-publishing-gateway-v1", "nx-marketing-008", "Samyra", "AI Publishing Gateway Operations Specialist", "PUBLISHING_GATEWAY_OPERATIONS", "NEW_SPECIALIST_CANDIDATE_PROPOSAL"],
  ["candidate-ruhan-community-engagement-v1", "nx-marketing-009", "Ruhan", "AI Community Engagement & Inquiry Specialist", "COMMUNITY_ENGAGEMENT_AND_INQUIRIES", "NEW_SPECIALIST_CANDIDATE_PROPOSAL"],
  ["candidate-tavisha-growth-leads-v1", "nx-marketing-010", "Tavisha", "AI Growth Lead Qualification Specialist", "LEAD_QUALIFICATION", "NEW_SPECIALIST_CANDIDATE_PROPOSAL"],
  ["candidate-yuvaan-demo-coordination-v1", "nx-marketing-011", "Yuvaan", "AI Demo Booking Coordination Specialist", "DEMO_BOOKING_COORDINATION", "NEW_SPECIALIST_CANDIDATE_PROPOSAL"],
  ["candidate-vedanshi-growth-analytics-v1", "nx-marketing-012", "Vedanshi", "AI Growth Analytics & Revenue Attribution Specialist", "GROWTH_ANALYTICS_AND_REVENUE_ATTRIBUTION", "NEW_SPECIALIST_CANDIDATE_PROPOSAL"],
] as const satisfies readonly [
  string,
  string,
  string,
  string,
  AutonomousGlobalGrowthSocialMediaFunction,
  "EXISTING_MASTER_ROSTER_CANDIDATE" | "NEW_SPECIALIST_CANDIDATE_PROPOSAL",
][];

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

function validatePrerequisites(): void {
  const approval =
    AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISION;

  if (
    approval.foundationAccepted !== true ||
    approval.authorityBoundary.foundationApproved !== true ||
    approval.authorityBoundary
      .socialMediaAIEmployeeRosterPreparationAuthorized !== true ||
    approval.authorityBoundary
      .socialMediaAIEmployeeRosterActivationAuthorized !== false ||
    approval.authorityBoundary.publicContentPublishingAuthorized !== false ||
    approval.authorityBoundary.customerMessageAuthorized !== false ||
    approval.authorityBoundary.liveConnectorActivationAuthorized !== false ||
    approval.authorityBoundary.founderLiberationAchieved !== false ||
    approval.nextStep !==
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_V1"
  ) {
    throw new Error(
      "Autonomous Global Growth Social Media roster prerequisites are invalid.",
    );
  }

  const expectedExisting = [
    ["candidate-anika-v1", "nx-marketing-001", "Anika"],
    ["candidate-aarav-v1", "nx-marketing-002", "Aarav"],
    ["candidate-isha-v1", "nx-marketing-003", "Isha"],
  ] as const;

  for (const [employeeId, employeeCode, publicName] of expectedExisting) {
    const entry = WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER.entries.find(
      (candidate) => candidate.employeeCode === employeeCode,
    );

    if (
      entry?.employeeId !== employeeId ||
      entry.publicName !== publicName ||
      entry.department !== "MARKETING" ||
      entry.status !== "PLANNED_CANDIDATE" ||
      entry.activationAuthorized !== false
    ) {
      throw new Error(
        "Existing Marketing candidate identity binding is invalid.",
      );
    }
  }
}

function buildRoster(createdAt: string) {
  const entries: readonly AutonomousGlobalGrowthSocialMediaAIEmployeeRosterEntry[] =
    ROSTER_IDENTITIES.map(
      ([
        employeeId,
        employeeCode,
        publicName,
        officialRole,
        functionKey,
        sourceType,
      ]) => ({
        employeeId,
        employeeCode,
        publicName,
        officialRole,
        department: "MARKETING" as const,
        functionKey,
        sourceType,
        lifecycleState: "PLANNED_CANDIDATE" as const,
        qualificationRequired: true as const,
        activationAuthorized: false as const,
        externalActionAuthorized: false as const,
        ownerApprovalRequired: true as const,
      }),
    );

  const core = {
    version: AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_VERSION,
    rosterId:
      "autonomous-global-growth-social-media-ai-employee-roster-001",
    rosterState:
      "ROSTER_PREPARED_AWAITING_OWNER_REVIEW" as const,
    workstreamSequence: 5 as const,
    sourceFoundationDecisionId:
      AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISION
        .decisionId,
    sourceFoundationDecisionDigest:
      AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISION
        .decisionDigest,
    entries,
    requiredFunctionCount: 12 as const,
    coveredFunctionCount: 12 as const,
    totalEmployeeCount: 12 as const,
    existingMasterRosterCandidateCount: 3 as const,
    newSpecialistCandidateProposalCount: 9 as const,
    safetyBoundary: {
      preparationOnly: true as const,
      allCandidatesRequireQualification: true as const,
      rosterActivationAuthorized: false as const,
      employeeActivationAuthorized: false as const,
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
      tenantIsolationRequired: true as const,
      auditEvidenceRequired: true as const,
      emergencyPauseRequired: true as const,
      ownerFinalAuthorityPreserved: true as const,
      founderLiberationAchieved: false as const,
    },
    completionStatus: {
      rosterPrepared: true as const,
      rosterOwnerReviewed: false as const,
      candidatesAdmittedToFactory: false as const,
      candidatesQualified: false as const,
      candidatesActivated: false as const,
      liveOperationAuthorized: false as const,
    },
    nextStep:
      "AWAIT_OWNER_REVIEW_OF_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_V1" as const,
    createdAt,
  };

  return deepFreeze({
    ...core,
    rosterDigest: sha256(core),
  });
}

export type AutonomousGlobalGrowthSocialMediaAIEmployeeRoster =
  ReturnType<typeof buildRoster>;

export function validateAutonomousGlobalGrowthSocialMediaAIEmployeeRoster(
  record: AutonomousGlobalGrowthSocialMediaAIEmployeeRoster,
): void {
  validatePrerequisites();

  const expected = buildRoster(record.createdAt);
  const ids = record.entries.map((entry) => entry.employeeId);
  const codes = record.entries.map((entry) => entry.employeeCode);
  const names = record.entries.map((entry) => entry.publicName.toLowerCase());
  const functions = record.entries.map((entry) => entry.functionKey);

  if (
    Number.isNaN(Date.parse(record.createdAt)) ||
    new Date(record.createdAt).toISOString() !== record.createdAt ||
    record.rosterDigest !== expected.rosterDigest ||
    sha256(record) !== sha256(expected) ||
    record.entries.length !== 12 ||
    record.requiredFunctionCount !== 12 ||
    record.coveredFunctionCount !== 12 ||
    record.existingMasterRosterCandidateCount !== 3 ||
    record.newSpecialistCandidateProposalCount !== 9 ||
    new Set(ids).size !== 12 ||
    new Set(codes).size !== 12 ||
    new Set(names).size !== 12 ||
    new Set(functions).size !== 12 ||
    record.entries.some(
      (entry) =>
        entry.department !== "MARKETING" ||
        entry.lifecycleState !== "PLANNED_CANDIDATE" ||
        entry.qualificationRequired !== true ||
        entry.activationAuthorized !== false ||
        entry.externalActionAuthorized !== false ||
        entry.ownerApprovalRequired !== true,
    ) ||
    record.safetyBoundary.rosterActivationAuthorized !== false ||
    record.safetyBoundary.employeeActivationAuthorized !== false ||
    record.safetyBoundary.realCredentialAccessAuthorized !== false ||
    record.safetyBoundary.liveConnectorActivationAuthorized !== false ||
    record.safetyBoundary.publicPublishingAuthorized !== false ||
    record.safetyBoundary.customerMessagingAuthorized !== false ||
    record.safetyBoundary.productionExecutionAuthorized !== false ||
    record.safetyBoundary.autonomousExternalActionAuthorized !== false ||
    record.safetyBoundary.blockedMetaAccountUseAuthorized !== false ||
    record.safetyBoundary.blockedMetaAccountBypassAuthorized !== false ||
    record.safetyBoundary.ownerFinalAuthorityPreserved !== true ||
    record.safetyBoundary.founderLiberationAchieved !== false ||
    record.completionStatus.rosterPrepared !== true ||
    record.completionStatus.rosterOwnerReviewed !== false ||
    record.completionStatus.candidatesAdmittedToFactory !== false ||
    record.completionStatus.candidatesQualified !== false ||
    record.completionStatus.candidatesActivated !== false ||
    record.completionStatus.liveOperationAuthorized !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.entries) ||
    !Object.isFrozen(record.safetyBoundary) ||
    !Object.isFrozen(record.completionStatus)
  ) {
    throw new Error(
      "Autonomous Global Growth Social Media AI employee roster is invalid.",
    );
  }
}

export function createAutonomousGlobalGrowthSocialMediaAIEmployeeRoster(
  createdAt: string,
): AutonomousGlobalGrowthSocialMediaAIEmployeeRoster {
  const record = buildRoster(createdAt);
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeRoster(record);
  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER =
  createAutonomousGlobalGrowthSocialMediaAIEmployeeRoster("2026-08-04T13:19:48.279Z");