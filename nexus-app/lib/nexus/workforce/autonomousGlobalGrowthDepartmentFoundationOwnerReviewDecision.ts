import { createHash } from "node:crypto";

import {
  AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION,
  validateAutonomousGlobalGrowthDepartmentFoundation,
} from "./autonomousGlobalGrowthDepartmentFoundation";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

export const AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-autonomous-global-growth-department-foundation-owner-review-decision-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1",
    "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_AWAITING_REVIEW",
  ] as const;

export type AutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecisionType =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISIONS)[number];

export interface CreateAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecisionInput {
  readonly sourceFoundation:
    typeof AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION;
  readonly decisionId: string;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    AutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIGEST = /^[0-9a-f]{64}$/;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

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

function requireIdentifier(label: string, value: string): void {
  if (value.trim() !== value || !ID.test(value)) {
    throw new Error(`${label} is invalid.`);
  }
}

function requireReason(value: string): string {
  if (value.trim() !== value || value.length < 120) {
    throw new Error(
      "Autonomous Global Growth foundation owner-review reason is invalid.",
    );
  }

  return value;
}

function requireTimestamp(label: string, value: string): void {
  if (
    value.trim() !== value ||
    !value.endsWith("Z") ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(`${label} is invalid.`);
  }
}

const foundation =
  AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION;

function validateCanonicalFoundation(): void {
  validateAutonomousGlobalGrowthDepartmentFoundation(foundation);

  if (
    foundation.foundationState !==
      "SANDBOX_FOUNDATION_PREPARED_AWAITING_OWNER_REVIEW" ||
    foundation.workstreamSequence !== 5 ||
    foundation.workstreamId !==
      "autonomous-global-growth-department-foundation" ||
    foundation.directive.issuedBy !== "Prashant Srivastav" ||
    foundation.directive.engineeringEmployeesResponsible !== true ||
    foundation.directive.founderManualDepartmentBuildRequired !== false ||
    foundation.requiredComponents.length !== 15 ||
    foundation.requiredOutcomes.length !== 12 ||
    foundation.prohibitedPractices.length !== 7 ||
    foundation.ownerReservedAuthorities.length !== 9 ||
    foundation.implementationBoundary.sandboxOnly !== true ||
    foundation.implementationBoundary.failClosedRequired !== true ||
    foundation.implementationBoundary.tenantIsolationRequired !== true ||
    foundation.implementationBoundary.providerIndependenceRequired !== true ||
    foundation.implementationBoundary.nexusCoreMetaIndependent !== true ||
    foundation.blockedAccountBoundary
      .prashantBlockedMetaAccountUseAuthorized !== false ||
    foundation.blockedAccountBoundary
      .himaniBlockedMetaAccountUseAuthorized !== false ||
    foundation.blockedAccountBoundary
      .blockedMetaAccountBypassAuthorized !== false ||
    foundation.authorityBoundary.foundationDesignAuthorized !== true ||
    foundation.authorityBoundary.sandboxEngineeringBuildAuthorized !== true ||
    foundation.authorityBoundary.publicContentPublishingAuthorized !== false ||
    foundation.authorityBoundary.customerMessageAuthorized !== false ||
    foundation.authorityBoundary.realSocialAccountActionAuthorized !== false ||
    foundation.authorityBoundary.liveConnectorActivationAuthorized !== false ||
    foundation.authorityBoundary.productionDeploymentAuthorized !== false ||
    foundation.authorityBoundary.publicLaunchAuthorized !== false ||
    foundation.authorityBoundary.founderLiberationAchieved !== false ||
    foundation.authorityBoundary.ownerFinalAuthorityPreserved !== true ||
    foundation.completionStatus.foundationPrepared !== true ||
    foundation.completionStatus.departmentBuilt !== false ||
    foundation.completionStatus.departmentTested !== false ||
    foundation.completionStatus.departmentQualified !== false ||
    foundation.completionStatus.liveOperationAuthorized !== false ||
    foundation.nextStep !==
      "AWAIT_OWNER_REVIEW_OF_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1"
  ) {
    throw new Error(
      "Canonical Autonomous Global Growth Department foundation is invalid.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
  decision: AutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1";

  const decisionCore = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_REVIEW_DECISION_RECORDED" as const,
    ownerId,
    sourceFoundationId: foundation.foundationId,
    sourceFoundationDigest: foundation.foundationDigest,
    sourceFoundationCreatedAt: foundation.createdAt,
    workstreamSequence: 5 as const,
    workstreamId:
      "autonomous-global-growth-department-foundation" as const,
    decision,
    reason,
    foundationAccepted: approved,
    reviewedEvidence: {
      requiredComponentCount: 15 as const,
      requiredOutcomeCount: 12 as const,
      prohibitedPracticeCount: 7 as const,
      ownerReservedAuthorityCount: 9 as const,
      sandboxOnlyVerified: true as const,
      failClosedVerified: true as const,
      tenantIsolationRequiredVerified: true as const,
      providerIndependenceVerified: true as const,
      nexusCoreMetaIndependenceVerified: true as const,
      blockedMetaAccountBypassBlocked: true as const,
      publicPublishingBlocked: true as const,
      customerMessagingBlocked: true as const,
      liveConnectorsBlocked: true as const,
      realPlatformActionsBlocked: true as const,
      ownerFinalAuthorityPreserved: true as const,
      founderLiberationAchieved: false as const,
    },
    authorityBoundary: {
      ownerDecisionRecorded: true as const,
      ownerIdentityBound: true as const,
      canonicalFoundationBound: true as const,
      sourceFoundationIntegrityVerified: true as const,
      approvalBypassAuthorized: false as const,
      foundationApproved: approved,
      socialMediaAIEmployeeRosterPreparationAuthorized: approved,
      socialMediaAIEmployeeRosterActivationAuthorized: false as const,
      contentFactoryExecutionAuthorized: false as const,
      videoFactoryExecutionAuthorized: false as const,
      publishingGatewayActivationAuthorized: false as const,
      liveConnectorActivationAuthorized: false as const,
      realPlatformCredentialAccessAuthorized: false as const,
      realSocialAccountActionAuthorized: false as const,
      publicContentPublishingAuthorized: false as const,
      publicPostAuthorized: false as const,
      customerMessageAuthorized: false as const,
      commentResponseAuthorized: false as const,
      leadContactAuthorized: false as const,
      demoBookingExecutionAuthorized: false as const,
      proposalDeliveryAuthorized: false as const,
      paidAdvertisingAuthorized: false as const,
      pricingDecisionAuthorized: false as const,
      discountDecisionAuthorized: false as const,
      contractExecutionAuthorized: false as const,
      partnershipExecutionAuthorized: false as const,
      productionDeploymentAuthorized: false as const,
      publicLaunchAuthorized: false as const,
      autonomousExternalActionAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      founderLiberationAchieved: false as const,
      founderReleasedFromRoutineMarketing: false as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep: (
      approved
        ? "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_V1"
        : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_AWAITING_OWNER_REVIEW"
    ) as
      | "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_V1"
      | "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type AutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision(
  record: AutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision,
): void {
  validateCanonicalFoundation();

  requireIdentifier(
    "Autonomous Global Growth foundation owner-review decision ID",
    record.decisionId,
  );
  requireTimestamp(
    "Autonomous Global Growth foundation owner-review decision time",
    record.decidedAt,
  );
  requireReason(record.reason);

  const approved =
    record.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1";

  const expected = buildDecision(
    record.decisionId,
    record.ownerId,
    record.decision,
    record.reason,
    record.decidedAt,
  );

  const requiredFalse = [
    record.authorityBoundary.socialMediaAIEmployeeRosterActivationAuthorized,
    record.authorityBoundary.contentFactoryExecutionAuthorized,
    record.authorityBoundary.videoFactoryExecutionAuthorized,
    record.authorityBoundary.publishingGatewayActivationAuthorized,
    record.authorityBoundary.liveConnectorActivationAuthorized,
    record.authorityBoundary.realPlatformCredentialAccessAuthorized,
    record.authorityBoundary.realSocialAccountActionAuthorized,
    record.authorityBoundary.publicContentPublishingAuthorized,
    record.authorityBoundary.publicPostAuthorized,
    record.authorityBoundary.customerMessageAuthorized,
    record.authorityBoundary.commentResponseAuthorized,
    record.authorityBoundary.leadContactAuthorized,
    record.authorityBoundary.demoBookingExecutionAuthorized,
    record.authorityBoundary.proposalDeliveryAuthorized,
    record.authorityBoundary.paidAdvertisingAuthorized,
    record.authorityBoundary.pricingDecisionAuthorized,
    record.authorityBoundary.discountDecisionAuthorized,
    record.authorityBoundary.contractExecutionAuthorized,
    record.authorityBoundary.partnershipExecutionAuthorized,
    record.authorityBoundary.productionDeploymentAuthorized,
    record.authorityBoundary.publicLaunchAuthorized,
    record.authorityBoundary.autonomousExternalActionAuthorized,
    record.authorityBoundary.levelThreeAuthorityGranted,
    record.authorityBoundary.founderLiberationAchieved,
    record.authorityBoundary.founderReleasedFromRoutineMarketing,
  ];

  if (
    record.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.sourceFoundationId !== foundation.foundationId ||
    record.sourceFoundationDigest !== foundation.foundationDigest ||
    record.foundationAccepted !== approved ||
    record.authorityBoundary.foundationApproved !== approved ||
    record.authorityBoundary
      .socialMediaAIEmployeeRosterPreparationAuthorized !== approved ||
    requiredFalse.some((value) => value !== false) ||
    record.reviewedEvidence.requiredComponentCount !== 15 ||
    record.reviewedEvidence.requiredOutcomeCount !== 12 ||
    record.reviewedEvidence.prohibitedPracticeCount !== 7 ||
    record.reviewedEvidence.ownerReservedAuthorityCount !== 9 ||
    record.reviewedEvidence.sandboxOnlyVerified !== true ||
    record.reviewedEvidence.failClosedVerified !== true ||
    record.reviewedEvidence.ownerFinalAuthorityPreserved !== true ||
    record.reviewedEvidence.founderLiberationAchieved !== false ||
    Date.parse(record.decidedAt) < Date.parse(foundation.createdAt) ||
    !DIGEST.test(record.decisionDigest) ||
    record.decisionDigest !== expected.decisionDigest ||
    sha256(record) !== sha256(expected) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Autonomous Global Growth foundation owner-review decision is invalid.",
    );
  }
}

export function createAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision(
  input: CreateAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecisionInput,
): AutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision {
  if (input.sourceFoundation !== foundation) {
    throw new Error(
      "Only the canonical Autonomous Global Growth Department foundation can receive the owner review.",
    );
  }

  validateCanonicalFoundation();

  requireIdentifier(
    "Autonomous Global Growth foundation owner-review decision ID",
    input.decisionId,
  );
  requireReason(input.reason);
  requireTimestamp(
    "Autonomous Global Growth foundation owner-review decision time",
    input.decidedAt,
  );

  if (input.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID) {
    throw new Error(
      "Only the verified NEXUS owner can review the Autonomous Global Growth Department foundation.",
    );
  }

  if (
    !AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Autonomous Global Growth foundation owner-review decision is invalid.",
    );
  }

  if (Date.parse(input.decidedAt) < Date.parse(foundation.createdAt)) {
    throw new Error(
      "Autonomous Global Growth foundation owner review cannot precede foundation creation.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    input.reason,
    input.decidedAt,
  );

  validateAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision(record);

  return record;
}