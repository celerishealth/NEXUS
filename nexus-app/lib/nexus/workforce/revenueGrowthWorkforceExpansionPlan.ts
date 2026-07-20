import { createHash } from "node:crypto";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
  type WorldClassAIWorkforceMasterRoster,
} from "./worldClassAIWorkforceMasterRoster";

export const REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN_VERSION =
  "nexus-revenue-growth-workforce-expansion-plan-v1" as const;

export const EXISTING_REVENUE_WORKFORCE_ROLES = [
  "AI Inquiry Intake Executive",
  "AI Recommendation Specialist",
  "AI Quotation & Proposal Specialist",
  "AI Sales Pipeline & Qualification Specialist",
  "AI Sales Enablement & Follow-up Specialist",
  "AI Market Intelligence Director",
  "AI Growth Strategy Specialist",
  "AI Brand, Content & Campaign Specialist",
] as const;

export const PROPOSED_REVENUE_GROWTH_SPECIALISTS = [
  {
    employeeId:
      "employee-rehaan-outbound-prospecting-v1",
    employeeCode:
      "nx-sales-008",
    publicName:
      "Rehaan",
    officialRole:
      "AI Outbound Prospecting Specialist",
    department:
      "SALES",
  },
  {
    employeeId:
      "employee-alina-sales-copy-funnel-v1",
    employeeCode:
      "nx-sales-009",
    publicName:
      "Alina",
    officialRole:
      "AI Sales Copywriting & Funnel Specialist",
    department:
      "SALES",
  },
  {
    employeeId:
      "employee-reyansh-creative-video-director-v1",
    employeeCode:
      "nx-marketing-004",
    publicName:
      "Reyansh",
    officialRole:
      "AI Creative & Video Production Director",
    department:
      "MARKETING",
  },
  {
    employeeId:
      "employee-mira-short-form-video-motion-v1",
    employeeCode:
      "nx-marketing-005",
    publicName:
      "Mira",
    officialRole:
      "AI Short-Form Video & Motion Specialist",
    department:
      "MARKETING",
  },
  {
    employeeId:
      "employee-ayaan-social-distribution-community-v1",
    employeeCode:
      "nx-marketing-006",
    publicName:
      "Ayaan",
    officialRole:
      "AI Social Media Distribution & Community Specialist",
    department:
      "MARKETING",
  },
  {
    employeeId:
      "employee-sia-seo-organic-growth-v1",
    employeeCode:
      "nx-marketing-007",
    publicName:
      "Sia",
    officialRole:
      "AI SEO & Organic Growth Specialist",
    department:
      "MARKETING",
  },
  {
    employeeId:
      "employee-dev-performance-marketing-v1",
    employeeCode:
      "nx-marketing-008",
    publicName:
      "Dev",
    officialRole:
      "AI Performance Marketing & Paid Media Specialist",
    department:
      "MARKETING",
  },
  {
    employeeId:
      "employee-noor-conversion-optimization-v1",
    employeeCode:
      "nx-marketing-009",
    publicName:
      "Noor",
    officialRole:
      "AI Conversion Optimization Specialist",
    department:
      "MARKETING",
  },
  {
    employeeId:
      "employee-yash-marketing-attribution-v1",
    employeeCode:
      "nx-marketing-010",
    publicName:
      "Yash",
    officialRole:
      "AI Marketing Analytics & Attribution Specialist",
    department:
      "MARKETING",
  },
] as const;

export type ProposedRevenueGrowthSpecialistRole =
  (typeof PROPOSED_REVENUE_GROWTH_SPECIALISTS)[number]["officialRole"];

export interface CreateRevenueGrowthWorkforceExpansionPlanInput {
  readonly planningId: string;
  readonly sourceRoster:
    WorldClassAIWorkforceMasterRoster;
  readonly preparedAt: string;
}

export interface RevenueGrowthExpansionCandidate {
  readonly expansionSequence: number;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole:
    ProposedRevenueGrowthSpecialistRole;
  readonly department:
    "SALES" | "MARKETING";
  readonly priorityTier:
    "REVENUE_READINESS_PRIORITY";
  readonly planningStatus:
    "PROPOSED_ROSTER_EXPANSION_CANDIDATE";
  readonly qualificationRequired: true;
  readonly rosterAdmissionAuthorized: false;
  readonly factoryAdmissionAuthorized: false;
  readonly templatePreparationAuthorized: false;
  readonly qualificationExecutionAuthorized: false;
  readonly ownerQualificationApprovalRecorded: false;
  readonly activationCandidatePreparationAuthorized: false;
  readonly ownerActivationAuthorized: false;
  readonly runtimeActivationAuthorized: false;
  readonly liveSocialPostingAuthorized: false;
  readonly paidAdvertisingSpendAuthorized: false;
  readonly customerMessagingAuthorized: false;
  readonly controlledWorkAuthorized: false;
}

export interface RevenueGrowthWorkforceExpansionPlan {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN_VERSION;
  readonly planningId: string;
  readonly planningState:
    "REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING_RECORDED";
  readonly sourceRosterVersion:
    WorldClassAIWorkforceMasterRoster["version"];
  readonly sourceRosterDigest: string;
  readonly existingRevenueEmployeeCount: 8;
  readonly existingRevenueEmployeeCodes:
    readonly string[];
  readonly proposedCandidateCount: 9;
  readonly proposedCandidates:
    readonly RevenueGrowthExpansionCandidate[];
  readonly expansionSequence:
    readonly number[];
  readonly capabilitiesCovered: readonly [
    "OUTBOUND_PROSPECTING",
    "SALES_COPY_AND_FUNNEL",
    "VIDEO_PRODUCTION_DIRECTION",
    "SHORT_FORM_VIDEO_AND_MOTION",
    "SOCIAL_MEDIA_DISTRIBUTION_AND_COMMUNITY",
    "SEO_AND_ORGANIC_GROWTH",
    "PERFORMANCE_MARKETING_AND_PAID_MEDIA",
    "CONVERSION_OPTIMIZATION",
    "MARKETING_ANALYTICS_AND_ATTRIBUTION",
  ];
  readonly ownerExpansionDecisionRequired:
    true;
  readonly ownerExpansionDecisionRecorded:
    false;
  readonly authorityBoundary: Readonly<{
    planningOnly: true;
    sourceRosterPreserved: true;
    rosterMutationAuthorized: false;
    factoryAdmissionAuthorized: false;
    templatePreparationAuthorized: false;
    qualificationExecutionAuthorized: false;
    ownerQualificationApprovalRecorded: false;
    activationCandidatePreparationAuthorized: false;
    ownerActivationAuthorized: false;
    runtimeActivationAuthorized: false;
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
    "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_EXPANSION_DECISION";
  readonly preparedAt: string;
  readonly planningDigest: string;
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
        "Unsupported deterministic revenue-growth planning value.",
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

export function validateRevenueGrowthWorkforceExpansionPlan(
  plan:
    RevenueGrowthWorkforceExpansionPlan,
): void {
  const {
    planningDigest,
    ...unsignedPlan
  } = plan;

  requireDigest(
    "Revenue-growth planning digest",
    planningDigest,
  );

  if (
    sha256(unsignedPlan) !==
    planningDigest
  ) {
    throw new Error(
      "Revenue-growth planning digest verification failed.",
    );
  }

  requireIdentifier(
    "Revenue-growth planning ID",
    plan.planningId,
  );

  requireExactIsoTimestamp(
    "Revenue-growth planning time",
    plan.preparedAt,
  );

  if (
    plan.version !==
      REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN_VERSION ||
    plan.planningState !==
      "REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING_RECORDED" ||
    plan.existingRevenueEmployeeCount !==
      8 ||
    plan.existingRevenueEmployeeCodes.length !==
      8 ||
    plan.proposedCandidateCount !==
      9 ||
    plan.proposedCandidates.length !==
      9 ||
    plan.expansionSequence.length !==
      9 ||
    plan.ownerExpansionDecisionRequired !==
      true ||
    plan.ownerExpansionDecisionRecorded !==
      false ||
    plan.nextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_EXPANSION_DECISION"
  ) {
    throw new Error(
      "Revenue-growth workforce expansion planning identity is invalid.",
    );
  }

  plan.proposedCandidates.forEach(
    (candidate, index) => {
      const expected =
        PROPOSED_REVENUE_GROWTH_SPECIALISTS[
          index
        ];

      if (
        candidate.expansionSequence !==
          index + 1 ||
        plan.expansionSequence[index] !==
          index + 1 ||
        candidate.employeeId !==
          expected.employeeId ||
        candidate.employeeCode !==
          expected.employeeCode ||
        candidate.publicName !==
          expected.publicName ||
        candidate.officialRole !==
          expected.officialRole ||
        candidate.department !==
          expected.department ||
        candidate.priorityTier !==
          "REVENUE_READINESS_PRIORITY" ||
        candidate.planningStatus !==
          "PROPOSED_ROSTER_EXPANSION_CANDIDATE" ||
        candidate.qualificationRequired !==
          true ||
        candidate.rosterAdmissionAuthorized !==
          false ||
        candidate.factoryAdmissionAuthorized !==
          false ||
        candidate.templatePreparationAuthorized !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.ownerQualificationApprovalRecorded !==
          false ||
        candidate.activationCandidatePreparationAuthorized !==
          false ||
        candidate.ownerActivationAuthorized !==
          false ||
        candidate.runtimeActivationAuthorized !==
          false ||
        candidate.liveSocialPostingAuthorized !==
          false ||
        candidate.paidAdvertisingSpendAuthorized !==
          false ||
        candidate.customerMessagingAuthorized !==
          false ||
        candidate.controlledWorkAuthorized !==
          false
      ) {
        throw new Error(
          "Revenue-growth expansion candidate binding is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Proposed revenue-growth employee IDs",
    plan.proposedCandidates.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Proposed revenue-growth employee codes",
    plan.proposedCandidates.map(
      (candidate) =>
        candidate.employeeCode,
    ),
  );

  requireUnique(
    "Proposed revenue-growth public names",
    plan.proposedCandidates.map(
      (candidate) =>
        candidate.publicName.toLowerCase(),
    ),
  );

  const boundary =
    plan.authorityBoundary;

  if (
    boundary.planningOnly !==
      true ||
    boundary.sourceRosterPreserved !==
      true ||
    boundary.rosterMutationAuthorized !==
      false ||
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
      "Revenue-growth workforce authority boundary is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceExpansionPlan(
  input:
    CreateRevenueGrowthWorkforceExpansionPlanInput,
): RevenueGrowthWorkforceExpansionPlan {
  requireIdentifier(
    "Revenue-growth planning ID",
    input.planningId,
  );

  requireExactIsoTimestamp(
    "Revenue-growth planning time",
    input.preparedAt,
  );

  requireDigest(
    "Source roster digest",
    input.sourceRoster.rosterDigest,
  );

  const existingRevenueEntries =
    EXISTING_REVENUE_WORKFORCE_ROLES.map(
      (officialRole) => {
        const entry =
          input.sourceRoster.entries.find(
            (candidate) =>
              candidate.officialRole ===
              officialRole,
          );

        if (!entry) {
          throw new Error(
            `Existing revenue role is missing from the source roster: ${officialRole}.`,
          );
        }

        return entry;
      },
    );

  requireUnique(
    "Existing revenue employee codes",
    existingRevenueEntries.map(
      (entry) =>
        entry.employeeCode,
    ),
  );

  const existingIds =
    new Set(
      input.sourceRoster.entries.map(
        (entry) =>
          entry.employeeId,
      ),
    );

  const existingCodes =
    new Set(
      input.sourceRoster.entries.map(
        (entry) =>
          entry.employeeCode,
      ),
    );

  const existingNames =
    new Set(
      input.sourceRoster.entries.map(
        (entry) =>
          entry.publicName.toLowerCase(),
      ),
    );

  for (
    const proposed of
    PROPOSED_REVENUE_GROWTH_SPECIALISTS
  ) {
    if (
      existingIds.has(
        proposed.employeeId,
      ) ||
      existingCodes.has(
        proposed.employeeCode,
      ) ||
      existingNames.has(
        proposed.publicName.toLowerCase(),
      )
    ) {
      throw new Error(
        `Proposed revenue-growth identity collides with the source roster: ${proposed.officialRole}.`,
      );
    }
  }

  const proposedCandidates =
    PROPOSED_REVENUE_GROWTH_SPECIALISTS.map(
      (candidate, index) => ({
        expansionSequence:
          index + 1,
        ...candidate,
        priorityTier:
          "REVENUE_READINESS_PRIORITY" as const,
        planningStatus:
          "PROPOSED_ROSTER_EXPANSION_CANDIDATE" as const,
        qualificationRequired:
          true as const,
        rosterAdmissionAuthorized:
          false as const,
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
        liveSocialPostingAuthorized:
          false as const,
        paidAdvertisingSpendAuthorized:
          false as const,
        customerMessagingAuthorized:
          false as const,
        controlledWorkAuthorized:
          false as const,
      }),
    );

  const planCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN_VERSION,
    planningId:
      input.planningId,
    planningState:
      "REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING_RECORDED" as const,
    sourceRosterVersion:
      input.sourceRoster.version,
    sourceRosterDigest:
      input.sourceRoster.rosterDigest,
    existingRevenueEmployeeCount:
      8 as const,
    existingRevenueEmployeeCodes:
      existingRevenueEntries.map(
        (entry) =>
          entry.employeeCode,
      ),
    proposedCandidateCount:
      9 as const,
    proposedCandidates,
    expansionSequence:
      proposedCandidates.map(
        (candidate) =>
          candidate.expansionSequence,
      ),
    capabilitiesCovered: [
      "OUTBOUND_PROSPECTING",
      "SALES_COPY_AND_FUNNEL",
      "VIDEO_PRODUCTION_DIRECTION",
      "SHORT_FORM_VIDEO_AND_MOTION",
      "SOCIAL_MEDIA_DISTRIBUTION_AND_COMMUNITY",
      "SEO_AND_ORGANIC_GROWTH",
      "PERFORMANCE_MARKETING_AND_PAID_MEDIA",
      "CONVERSION_OPTIMIZATION",
      "MARKETING_ANALYTICS_AND_ATTRIBUTION",
    ] as const,
    ownerExpansionDecisionRequired:
      true as const,
    ownerExpansionDecisionRecorded:
      false as const,
    authorityBoundary: {
      planningOnly:
        true,
      sourceRosterPreserved:
        true,
      rosterMutationAuthorized:
        false,
      factoryAdmissionAuthorized:
        false,
      templatePreparationAuthorized:
        false,
      qualificationExecutionAuthorized:
        false,
      ownerQualificationApprovalRecorded:
        false,
      activationCandidatePreparationAuthorized:
        false,
      ownerActivationAuthorized:
        false,
      runtimeActivationAuthorized:
        false,
      contentDraftingAuthorityGranted:
        false,
      videoGenerationExecutionAuthorized:
        false,
      liveSocialPostingAuthorized:
        false,
      paidAdvertisingSpendAuthorized:
        false,
      customerMessagingAuthorized:
        false,
      customerDataAccessAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      productionExecutionAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      financialCommitmentAuthorized:
        false,
      legalCommitmentAuthorized:
        false,
      autonomousExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    nextStep:
      "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_EXPANSION_DECISION" as const,
    preparedAt:
      input.preparedAt,
  };

  const plan =
    deepFreeze({
      ...planCore,
      planningDigest:
        sha256(planCore),
    }) as RevenueGrowthWorkforceExpansionPlan;

  validateRevenueGrowthWorkforceExpansionPlan(
    plan,
  );

  return plan;
}

export const REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN =
  createRevenueGrowthWorkforceExpansionPlan({
    planningId:
      "revenue-growth-workforce-expansion-plan-v1",
    sourceRoster:
      WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
    preparedAt:
      "2026-07-20T17:30:00.000Z",
  });
