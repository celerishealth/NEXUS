import { createHash } from "node:crypto";

export const AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_VERSION =
  "nexus-autonomous-global-growth-department-foundation-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_COMPONENTS = [
  "SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER",
  "CONTENT_FACTORY",
  "VIDEO_FACTORY",
  "RESEARCH_AND_FACT_VERIFICATION_ENGINE",
  "COPYRIGHT_AND_BRAND_SAFETY_CONTROLS",
  "OWNER_APPROVAL_QUEUE",
  "PROVIDER_INDEPENDENT_PUBLISHING_GATEWAY",
  "UNIFIED_COMMENT_AND_LEAD_INBOX",
  "LEAD_QUALIFICATION_WORKFLOW",
  "DEMO_BOOKING_WORKFLOW",
  "GROWTH_ANALYTICS_DASHBOARD",
  "CONSENT_AND_OPT_OUT_REGISTRY",
  "AUDIT_LEDGER",
  "EMERGENCY_PAUSE_AND_ROLLBACK",
  "PLATFORM_SPECIFIC_ADAPTERS",
] as const;

export const AUTONOMOUS_GLOBAL_GROWTH_REQUIRED_OUTCOMES = [
  "GLOBAL_MARKET_RESEARCH",
  "CONTENT_STRATEGY",
  "POST_GRAPHIC_AND_VIDEO_CREATION",
  "PLATFORM_SPECIFIC_CONTENT_ADAPTATION",
  "APPROVED_CONNECTOR_PUBLISHING",
  "COMMENT_AND_INQUIRY_HANDLING",
  "LEAD_QUALIFICATION",
  "DEMO_MEETING_RECOMMENDATION_AND_BOOKING",
  "PROPOSAL_DRAFTING",
  "PERFORMANCE_REPORTING",
  "REVENUE_ATTRIBUTION_REPORTING",
  "FOUNDER_ESCALATION_FOR_IMPORTANT_APPROVALS_AND_STRATEGIC_DECISIONS",
] as const;

export const AUTONOMOUS_GLOBAL_GROWTH_PROHIBITED_PRACTICES = [
  "FAKE_FOLLOWERS",
  "FAKE_REVIEWS",
  "SPAM",
  "UNAUTHORIZED_BULK_MESSAGING",
  "UNAUTHORIZED_SCRAPING",
  "IMPERSONATION",
  "COPYRIGHT_VIOLATION",
] as const;

export const AUTONOMOUS_GLOBAL_GROWTH_OWNER_RESERVED_AUTHORITIES = [
  "PRICING",
  "DISCOUNTS",
  "PAID_ADVERTISING",
  "CONTRACTS",
  "PARTNERSHIPS",
  "HIGH_RISK_PUBLIC_CLAIMS",
  "STRATEGIC_DECISIONS",
  "FINANCIAL_COMMITMENTS",
  "LEGAL_COMMITMENTS",
] as const;

export type AutonomousGlobalGrowthDepartmentComponent =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_COMPONENTS)[number];

export type AutonomousGlobalGrowthRequiredOutcome =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_REQUIRED_OUTCOMES)[number];

export type AutonomousGlobalGrowthProhibitedPractice =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_PROHIBITED_PRACTICES)[number];

export type AutonomousGlobalGrowthOwnerReservedAuthority =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_OWNER_RESERVED_AUTHORITIES)[number];

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

function buildFoundation(createdAt: string) {
  const foundationCore = {
    version: AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_VERSION,
    foundationId: "nexus-autonomous-global-growth-department-foundation-001",
    foundationState:
      "SANDBOX_FOUNDATION_PREPARED_AWAITING_OWNER_REVIEW" as const,
    workstreamSequence: 5 as const,
    workstreamId: "autonomous-global-growth-department-foundation" as const,
    directive: {
      issuedBy: "Prashant Srivastav" as const,
      founderRole: "FOUNDER_OWNER_AND_CEO" as const,
      effectiveDate: "2026-08-04" as const,
      engineeringEmployeesResponsible: true as const,
      founderManualDepartmentBuildRequired: false as const,
    },
    requiredOutcomes: AUTONOMOUS_GLOBAL_GROWTH_REQUIRED_OUTCOMES,
    requiredComponents: AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_COMPONENTS,
    prohibitedPractices: AUTONOMOUS_GLOBAL_GROWTH_PROHIBITED_PRACTICES,
    ownerReservedAuthorities:
      AUTONOMOUS_GLOBAL_GROWTH_OWNER_RESERVED_AUTHORITIES,
    implementationBoundary: {
      sandboxOnly: true as const,
      failClosedRequired: true as const,
      qualificationRequiredBeforeLiveOperation: true as const,
      ownerApprovalRequiredForConsequentialActions: true as const,
      tenantIsolationRequired: true as const,
      tenantIsolatedPlatformCredentialsRequired: true as const,
      providerIndependenceRequired: true as const,
      nexusCoreMetaIndependent: true as const,
      auditLedgerRequired: true as const,
      consentAndOptOutRequired: true as const,
      emergencyPauseRequired: true as const,
      rollbackRequired: true as const,
      factVerificationRequired: true as const,
      copyrightSafetyRequired: true as const,
      brandSafetyRequired: true as const,
    },
    platformAdapters: {
      website: "DISABLED_PENDING_BUILD_AND_QUALIFICATION" as const,
      email: "DISABLED_PENDING_BUILD_AND_QUALIFICATION" as const,
      linkedIn: "DISABLED_PENDING_BUILD_AND_QUALIFICATION" as const,
      youTube: "DISABLED_PENDING_BUILD_AND_QUALIFICATION" as const,
      x: "DISABLED_PENDING_BUILD_AND_QUALIFICATION" as const,
      facebook:
        "DISABLED_PENDING_OFFICIAL_ELIGIBILITY_EVIDENCE" as const,
      instagram:
        "DISABLED_PENDING_OFFICIAL_ELIGIBILITY_EVIDENCE" as const,
      whatsApp:
        "DISABLED_PENDING_OFFICIAL_ELIGIBILITY_EVIDENCE" as const,
    },
    blockedAccountBoundary: {
      prashantBlockedMetaAccountUseAuthorized: false as const,
      himaniBlockedMetaAccountUseAuthorized: false as const,
      blockedMetaAccountBypassAuthorized: false as const,
    },
    authorityBoundary: {
      foundationDesignAuthorized: true as const,
      sandboxEngineeringBuildAuthorized: true as const,
      sandboxTestingAuthorized: true as const,
      qualificationPreparationAuthorized: true as const,
      aiEmployeeRosterActivationAuthorized: false as const,
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
      highRiskPublicClaimAuthorized: false as const,
      productionDeploymentAuthorized: false as const,
      publicLaunchAuthorized: false as const,
      autonomousExternalActionAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      founderLiberationAchieved: false as const,
      founderReleasedFromRoutineMarketing: false as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    completionStatus: {
      foundationPrepared: true as const,
      departmentBuilt: false as const,
      departmentTested: false as const,
      departmentQualified: false as const,
      liveOperationAuthorized: false as const,
      completedComponentCount: 0 as const,
      requiredComponentCount: 15 as const,
    },
    nextStep:
      "AWAIT_OWNER_REVIEW_OF_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1" as const,
    createdAt,
  };

  return deepFreeze({
    ...foundationCore,
    foundationDigest: sha256(foundationCore),
  });
}

export type AutonomousGlobalGrowthDepartmentFoundation = ReturnType<
  typeof buildFoundation
>;

export function validateAutonomousGlobalGrowthDepartmentFoundation(
  record: AutonomousGlobalGrowthDepartmentFoundation,
): void {
  const expected = buildFoundation(record.createdAt);

  const requiredFalse = [
    record.authorityBoundary.aiEmployeeRosterActivationAuthorized,
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
    record.authorityBoundary.highRiskPublicClaimAuthorized,
    record.authorityBoundary.productionDeploymentAuthorized,
    record.authorityBoundary.publicLaunchAuthorized,
    record.authorityBoundary.autonomousExternalActionAuthorized,
    record.authorityBoundary.levelThreeAuthorityGranted,
    record.authorityBoundary.founderLiberationAchieved,
    record.authorityBoundary.founderReleasedFromRoutineMarketing,
  ];

  if (
    Number.isNaN(Date.parse(record.createdAt)) ||
    new Date(record.createdAt).toISOString() !== record.createdAt ||
    record.foundationDigest !== expected.foundationDigest ||
    sha256(record) !== sha256(expected) ||
    record.requiredComponents.length !== 15 ||
    record.requiredOutcomes.length !== 12 ||
    record.prohibitedPractices.length !== 7 ||
    record.ownerReservedAuthorities.length !== 9 ||
    record.implementationBoundary.sandboxOnly !== true ||
    record.implementationBoundary.failClosedRequired !== true ||
    record.implementationBoundary.tenantIsolationRequired !== true ||
    record.implementationBoundary.providerIndependenceRequired !== true ||
    record.implementationBoundary.nexusCoreMetaIndependent !== true ||
    record.blockedAccountBoundary.prashantBlockedMetaAccountUseAuthorized !==
      false ||
    record.blockedAccountBoundary.himaniBlockedMetaAccountUseAuthorized !==
      false ||
    record.blockedAccountBoundary.blockedMetaAccountBypassAuthorized !== false ||
    record.authorityBoundary.foundationDesignAuthorized !== true ||
    record.authorityBoundary.sandboxEngineeringBuildAuthorized !== true ||
    record.authorityBoundary.ownerFinalAuthorityPreserved !== true ||
    requiredFalse.some((value) => value !== false) ||
    record.completionStatus.foundationPrepared !== true ||
    record.completionStatus.departmentBuilt !== false ||
    record.completionStatus.departmentTested !== false ||
    record.completionStatus.departmentQualified !== false ||
    record.completionStatus.liveOperationAuthorized !== false ||
    record.completionStatus.completedComponentCount !== 0 ||
    record.completionStatus.requiredComponentCount !== 15 ||
    record.nextStep !==
      "AWAIT_OWNER_REVIEW_OF_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1" ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.directive) ||
    !Object.isFrozen(record.requiredComponents) ||
    !Object.isFrozen(record.requiredOutcomes) ||
    !Object.isFrozen(record.prohibitedPractices) ||
    !Object.isFrozen(record.ownerReservedAuthorities) ||
    !Object.isFrozen(record.implementationBoundary) ||
    !Object.isFrozen(record.platformAdapters) ||
    !Object.isFrozen(record.blockedAccountBoundary) ||
    !Object.isFrozen(record.authorityBoundary) ||
    !Object.isFrozen(record.completionStatus)
  ) {
    throw new Error(
      "Autonomous Global Growth Department foundation is invalid.",
    );
  }
}

export function createAutonomousGlobalGrowthDepartmentFoundation(
  createdAt: string,
): AutonomousGlobalGrowthDepartmentFoundation {
  const record = buildFoundation(createdAt);
  validateAutonomousGlobalGrowthDepartmentFoundation(record);
  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION =
  createAutonomousGlobalGrowthDepartmentFoundation("2026-08-04T12:24:11.308Z");