import { createHash } from "node:crypto";

import {
  CORE_WORKFORCE_SKILLS,
  CORE_WORKFORCE_TOOLS,
  SKILL_TOOL_REGISTRY_VERSION,
} from "./skillToolRegistry";

import {
  ASHA_INQUIRY_INTAKE_TEMPLATE,
  MEERA_QUOTATION_PROPOSAL_SPECIALIST_TEMPLATE,
  OFFICIAL_LAUNCH_EMPLOYEE_CATALOG_VERSION,
  RIYA_RECOMMENDATION_SPECIALIST_TEMPLATE,
} from "./employeeTemplateRegistry";

import {
  PROPOSED_REVENUE_GROWTH_SPECIALISTS,
} from "./revenueGrowthWorkforceExpansionPlan";

import {
  REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION,
  validateRevenueGrowthWorkforceFactoryAdmissionExecution,
} from "./revenueGrowthWorkforceFactoryAdmissionExecution";

export const REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_VERSION =
  "nexus-revenue-growth-workforce-template-preparation-plan-v1" as const;

export const REVENUE_GROWTH_TEMPLATE_CAPABILITIES = [
  "OUTBOUND_PROSPECTING",
  "SALES_COPY_AND_FUNNEL",
  "VIDEO_PRODUCTION_DIRECTION",
  "SHORT_FORM_VIDEO_AND_MOTION",
  "SOCIAL_MEDIA_DISTRIBUTION_AND_COMMUNITY",
  "SEO_AND_ORGANIC_GROWTH",
  "PERFORMANCE_MARKETING_AND_PAID_MEDIA",
  "CONVERSION_OPTIMIZATION",
  "MARKETING_ANALYTICS_AND_ATTRIBUTION",
] as const;

export type RevenueGrowthTemplateCapability =
  (typeof REVENUE_GROWTH_TEMPLATE_CAPABILITIES)[number];

export interface RevenueGrowthTemplateCapabilityBlueprint {
  readonly capability:
    RevenueGrowthTemplateCapability;
  readonly proposedSkill: Readonly<{
    skillId: string;
    name: string;
    description: string;
    category: string;
  }>;
  readonly proposedTool: Readonly<{
    toolId: string;
    name: string;
    capability: string;
    mode: "DRAFT_ONLY";
    risk: "MEDIUM";
    externalEffect: false;
    tenantScoped: true;
    auditRequired: true;
  }>;
}

export const REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS =
  [
    {
      capability:
        "OUTBOUND_PROSPECTING",
      proposedSkill: {
        skillId:
          "skill-outbound-prospecting-analysis",
        name:
          "Outbound prospecting analysis",
        description:
          "Researches authorized prospect evidence and prepares owner-reviewable prospecting priorities without contacting prospects.",
        category:
          "sales-growth",
      },
      proposedTool: {
        toolId:
          "tool-outbound-prospecting-draft",
        name:
          "Outbound prospecting draft creator",
        capability:
          "Create a sandbox outbound prospecting draft for owner review",
        mode:
          "DRAFT_ONLY",
        risk:
          "MEDIUM",
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
      },
    },
    {
      capability:
        "SALES_COPY_AND_FUNNEL",
      proposedSkill: {
        skillId:
          "skill-sales-copy-funnel-drafting",
        name:
          "Sales copy and funnel drafting",
        description:
          "Produces evidence-bound sales copy and funnel drafts for owner review without publishing or customer contact.",
        category:
          "sales-growth",
      },
      proposedTool: {
        toolId:
          "tool-sales-copy-funnel-draft",
        name:
          "Sales copy and funnel draft creator",
        capability:
          "Create a sandbox sales-copy and funnel draft for owner review",
        mode:
          "DRAFT_ONLY",
        risk:
          "MEDIUM",
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
      },
    },
    {
      capability:
        "VIDEO_PRODUCTION_DIRECTION",
      proposedSkill: {
        skillId:
          "skill-creative-video-direction",
        name:
          "Creative video direction",
        description:
          "Prepares brand-safe creative direction, scripts, shot plans, and production briefs without generating or publishing live media.",
        category:
          "creative-marketing",
      },
      proposedTool: {
        toolId:
          "tool-creative-video-plan-draft",
        name:
          "Creative video plan draft creator",
        capability:
          "Create a sandbox creative-video production plan for owner review",
        mode:
          "DRAFT_ONLY",
        risk:
          "MEDIUM",
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
      },
    },
    {
      capability:
        "SHORT_FORM_VIDEO_AND_MOTION",
      proposedSkill: {
        skillId:
          "skill-short-form-video-motion",
        name:
          "Short-form video and motion planning",
        description:
          "Prepares short-form video concepts, storyboards, pacing, captions, and motion instructions for owner review.",
        category:
          "creative-marketing",
      },
      proposedTool: {
        toolId:
          "tool-short-form-video-storyboard-draft",
        name:
          "Short-form storyboard draft creator",
        capability:
          "Create a sandbox short-form video storyboard for owner review",
        mode:
          "DRAFT_ONLY",
        risk:
          "MEDIUM",
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
      },
    },
    {
      capability:
        "SOCIAL_MEDIA_DISTRIBUTION_AND_COMMUNITY",
      proposedSkill: {
        skillId:
          "skill-social-distribution-community",
        name:
          "Social distribution and community planning",
        description:
          "Prepares channel-specific distribution calendars and community-response drafts without posting or messaging externally.",
        category:
          "social-marketing",
      },
      proposedTool: {
        toolId:
          "tool-social-content-calendar-draft",
        name:
          "Social content calendar draft creator",
        capability:
          "Create a sandbox social distribution calendar for owner review",
        mode:
          "DRAFT_ONLY",
        risk:
          "MEDIUM",
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
      },
    },
    {
      capability:
        "SEO_AND_ORGANIC_GROWTH",
      proposedSkill: {
        skillId:
          "skill-seo-organic-growth",
        name:
          "SEO and organic growth analysis",
        description:
          "Analyzes authorized content evidence and prepares technical, content, and organic-growth recommendations for owner review.",
        category:
          "organic-marketing",
      },
      proposedTool: {
        toolId:
          "tool-seo-growth-plan-draft",
        name:
          "SEO growth plan draft creator",
        capability:
          "Create a sandbox SEO and organic-growth plan for owner review",
        mode:
          "DRAFT_ONLY",
        risk:
          "MEDIUM",
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
      },
    },
    {
      capability:
        "PERFORMANCE_MARKETING_AND_PAID_MEDIA",
      proposedSkill: {
        skillId:
          "skill-performance-marketing-analysis",
        name:
          "Performance marketing analysis",
        description:
          "Prepares evidence-bound paid-media hypotheses, targeting plans, and budget recommendations without spending money or launching campaigns.",
        category:
          "paid-marketing",
      },
      proposedTool: {
        toolId:
          "tool-paid-media-plan-draft",
        name:
          "Paid-media plan draft creator",
        capability:
          "Create a sandbox paid-media plan without campaign execution or spend",
        mode:
          "DRAFT_ONLY",
        risk:
          "MEDIUM",
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
      },
    },
    {
      capability:
        "CONVERSION_OPTIMIZATION",
      proposedSkill: {
        skillId:
          "skill-conversion-optimization",
        name:
          "Conversion optimization analysis",
        description:
          "Analyzes authorized funnel evidence and prepares reversible conversion experiments for owner review.",
        category:
          "conversion-marketing",
      },
      proposedTool: {
        toolId:
          "tool-conversion-experiment-draft",
        name:
          "Conversion experiment draft creator",
        capability:
          "Create a sandbox conversion-optimization experiment for owner review",
        mode:
          "DRAFT_ONLY",
        risk:
          "MEDIUM",
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
      },
    },
    {
      capability:
        "MARKETING_ANALYTICS_AND_ATTRIBUTION",
      proposedSkill: {
        skillId:
          "skill-marketing-attribution-analysis",
        name:
          "Marketing analytics and attribution",
        description:
          "Analyzes authorized marketing evidence and prepares transparent attribution findings with uncertainty and data-quality limits.",
        category:
          "marketing-analytics",
      },
      proposedTool: {
        toolId:
          "tool-marketing-attribution-draft",
        name:
          "Marketing attribution draft creator",
        capability:
          "Create a sandbox marketing attribution analysis for owner review",
        mode:
          "DRAFT_ONLY",
        risk:
          "MEDIUM",
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
      },
    },
  ] as const satisfies
    readonly RevenueGrowthTemplateCapabilityBlueprint[];

export interface RevenueGrowthTemplatePreparationPlanEntry {
  readonly preparationSequence: number;
  readonly templateId: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    "SALES" | "MARKETING";
  readonly managerRoleKey:
    "founder-owner-ceo";
  readonly proposedLaunchSequence:
    number;
  readonly capability:
    RevenueGrowthTemplateCapability;
  readonly sourceFactoryRecordId:
    string;
  readonly sourceFactoryRecordDigest:
    string;
  readonly sourceLifecycleState:
    "PLANNED_CANDIDATE";
  readonly plannedTargetLifecycleState:
    "TEMPLATE_PREPARATION_PENDING";
  readonly requiredSkillIds:
    readonly string[];
  readonly requiredToolIds:
    readonly string[];
  readonly roleSkillRegistryExpansionRequired:
    true;
  readonly roleToolRegistryExpansionRequired:
    true;
  readonly templatePreparationAuthorized:
    false;
  readonly templateCreated: false;
  readonly lifecycleTransitionExecuted:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly activationAuthorized: false;
  readonly runtimeAuthorized: false;
}

export interface CreateRevenueGrowthWorkforceTemplatePreparationPlanInput {
  readonly planningId: string;
  readonly preparedAt: string;
}

export interface RevenueGrowthWorkforceTemplatePreparationPlan {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_VERSION;
  readonly planningId: string;
  readonly planningState:
    "OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNED";
  readonly sourceFactoryAdmissionExecutionId:
    string;
  readonly sourceFactoryAdmissionExecutionDigest:
    string;
  readonly sourceSkillToolRegistryVersion:
    typeof SKILL_TOOL_REGISTRY_VERSION;
  readonly sourceEmployeeCatalogVersion:
    typeof OFFICIAL_LAUNCH_EMPLOYEE_CATALOG_VERSION;
  readonly sourceCoreSkillInventoryDigest:
    string;
  readonly sourceCoreToolInventoryDigest:
    string;
  readonly sourceRegisteredTemplateLaunchSequences:
    readonly number[];
  readonly proposedTemplateCount: 9;
  readonly proposedLaunchSequences:
    readonly number[];
  readonly proposedTemplates:
    readonly RevenueGrowthTemplatePreparationPlanEntry[];
  readonly proposedSkillRegistryExpansion:
    readonly RevenueGrowthTemplateCapabilityBlueprint["proposedSkill"][];
  readonly proposedToolRegistryExpansion:
    readonly RevenueGrowthTemplateCapabilityBlueprint["proposedTool"][];
  readonly registryGapSummary: Readonly<{
    existingOwnerEscalationSkillAvailable:
      true;
    newRoleSkillCountRequired: 9;
    newRoleToolCountRequired: 9;
    directTemplateCreationBlockedUntilRegistryExpansion:
      true;
  }>;
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
  readonly ownerTemplatePreparationPlanDecisionRequired:
    true;
  readonly ownerTemplatePreparationPlanDecisionRecorded:
    false;
  readonly authorityBoundary: Readonly<{
    planningOnly: true;
    sourceFactoryAdmissionExecutionBound:
      true;
    launchSequencePlanningOnly: true;
    skillRegistryMutationAuthorized:
      false;
    toolRegistryMutationAuthorized:
      false;
    templatePreparationAuthorized:
      false;
    templateCreationAuthorized: false;
    factoryLifecycleTransitionAuthorized:
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
    "AWAIT_OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION";
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
        "Unsupported deterministic template-preparation planning value.",
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
  values: readonly (
    string | number
  )[],
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

export function validateRevenueGrowthWorkforceTemplatePreparationPlan(
  plan:
    RevenueGrowthWorkforceTemplatePreparationPlan,
): void {
  const {
    planningDigest,
    ...unsignedPlan
  } = plan;

  requireDigest(
    "Template-preparation planning digest",
    planningDigest,
  );

  if (
    sha256(unsignedPlan) !==
    planningDigest
  ) {
    throw new Error(
      "Template-preparation planning digest verification failed.",
    );
  }

  requireIdentifier(
    "Template-preparation planning ID",
    plan.planningId,
  );

  requireDigest(
    "Source factory-admission execution digest",
    plan.sourceFactoryAdmissionExecutionDigest,
  );

  requireDigest(
    "Source core skill inventory digest",
    plan.sourceCoreSkillInventoryDigest,
  );

  requireDigest(
    "Source core tool inventory digest",
    plan.sourceCoreToolInventoryDigest,
  );

  requireTimestamp(
    "Template-preparation planning time",
    plan.preparedAt,
  );

  if (
    plan.version !==
      REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_VERSION ||
    plan.planningState !==
      "OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNED" ||
    plan.sourceFactoryAdmissionExecutionId !==
      REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION
        .executionId ||
    plan.sourceFactoryAdmissionExecutionDigest !==
      REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION
        .executionDigest ||
    plan.sourceSkillToolRegistryVersion !==
      SKILL_TOOL_REGISTRY_VERSION ||
    plan.sourceEmployeeCatalogVersion !==
      OFFICIAL_LAUNCH_EMPLOYEE_CATALOG_VERSION ||
    plan.proposedTemplateCount !==
      9 ||
    plan.proposedTemplates.length !==
      9 ||
    plan.proposedLaunchSequences.length !==
      9 ||
    plan.proposedSkillRegistryExpansion.length !==
      9 ||
    plan.proposedToolRegistryExpansion.length !==
      9 ||
    plan.ownerTemplatePreparationPlanDecisionRequired !==
      true ||
    plan.ownerTemplatePreparationPlanDecisionRecorded !==
      false ||
    plan.nextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION"
  ) {
    throw new Error(
      "Revenue Growth template-preparation plan identity is invalid.",
    );
  }

  const expectedCurrentSequences = [
    ASHA_INQUIRY_INTAKE_TEMPLATE
      .launchSequence,
    RIYA_RECOMMENDATION_SPECIALIST_TEMPLATE
      .launchSequence,
    MEERA_QUOTATION_PROPOSAL_SPECIALIST_TEMPLATE
      .launchSequence,
  ];

  if (
    canonicalize(
      plan.sourceRegisteredTemplateLaunchSequences,
    ) !==
    canonicalize(expectedCurrentSequences)
  ) {
    throw new Error(
      "Source registered template launch sequences are invalid.",
    );
  }

  requireUnique(
    "Source template launch sequences",
    plan.sourceRegisteredTemplateLaunchSequences,
  );

  requireUnique(
    "Proposed template launch sequences",
    plan.proposedLaunchSequences,
  );

  const existingSequenceSet =
    new Set(
      plan.sourceRegisteredTemplateLaunchSequences,
    );

  if (
    plan.proposedLaunchSequences.some(
      (sequence) =>
        existingSequenceSet.has(sequence),
    )
  ) {
    throw new Error(
      "Proposed template launch sequence collides with an existing registered template.",
    );
  }

  const expectedFirstSequence =
    Math.max(
      ...plan.sourceRegisteredTemplateLaunchSequences,
    ) + 1;

  plan.proposedTemplates.forEach(
    (entry, index) => {
      const candidate =
        REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION
          .candidateRecords[index];

      const proposed =
        PROPOSED_REVENUE_GROWTH_SPECIALISTS[
          index
        ];

      const blueprint =
        REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS[
          index
        ];

      const expectedSequence =
        expectedFirstSequence + index;

      if (
        entry.preparationSequence !==
          index + 1 ||
        entry.templateId !==
          candidate.employeeId.replace(
            /^employee-/,
            "template-",
          ) ||
        entry.employeeId !==
          candidate.employeeId ||
        entry.employeeCode !==
          candidate.employeeCode ||
        entry.publicName !==
          candidate.publicName ||
        entry.officialRole !==
          candidate.officialRole ||
        entry.department !==
          candidate.department ||
        entry.managerRoleKey !==
          "founder-owner-ceo" ||
        entry.proposedLaunchSequence !==
          expectedSequence ||
        plan.proposedLaunchSequences[index] !==
          expectedSequence ||
        entry.capability !==
          blueprint.capability ||
        entry.sourceFactoryRecordId !==
          candidate.factoryRecordId ||
        entry.sourceFactoryRecordDigest !==
          candidate.recordDigest ||
        entry.sourceLifecycleState !==
          "PLANNED_CANDIDATE" ||
        entry.plannedTargetLifecycleState !==
          "TEMPLATE_PREPARATION_PENDING" ||
        entry.requiredSkillIds[0] !==
          blueprint.proposedSkill.skillId ||
        entry.requiredSkillIds[1] !==
          "skill-owner-escalation" ||
        entry.requiredSkillIds.length !==
          2 ||
        entry.requiredToolIds[0] !==
          blueprint.proposedTool.toolId ||
        entry.requiredToolIds.length !==
          1 ||
        entry.roleSkillRegistryExpansionRequired !==
          true ||
        entry.roleToolRegistryExpansionRequired !==
          true ||
        entry.templatePreparationAuthorized !==
          false ||
        entry.templateCreated !==
          false ||
        entry.lifecycleTransitionExecuted !==
          false ||
        entry.qualificationExecutionAuthorized !==
          false ||
        entry.activationAuthorized !==
          false ||
        entry.runtimeAuthorized !==
          false ||
        proposed.employeeId !==
          entry.employeeId ||
        proposed.employeeCode !==
          entry.employeeCode ||
        proposed.publicName !==
          entry.publicName ||
        proposed.officialRole !==
          entry.officialRole ||
        proposed.department !==
          entry.department
      ) {
        throw new Error(
          "Revenue Growth template-preparation candidate binding is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Proposed template IDs",
    plan.proposedTemplates.map(
      (entry) =>
        entry.templateId,
    ),
  );

  requireUnique(
    "Proposed template employee IDs",
    plan.proposedTemplates.map(
      (entry) =>
        entry.employeeId,
    ),
  );

  requireUnique(
    "Proposed role skill IDs",
    plan.proposedSkillRegistryExpansion.map(
      (skill) =>
        skill.skillId,
    ),
  );

  requireUnique(
    "Proposed role tool IDs",
    plan.proposedToolRegistryExpansion.map(
      (tool) =>
        tool.toolId,
    ),
  );

  const existingSkillIds =
    new Set<string>(
      CORE_WORKFORCE_SKILLS.map(
        (skill) =>
          skill.skillId,
      ),
    );

  const existingToolIds =
    new Set<string>(
      CORE_WORKFORCE_TOOLS.map(
        (tool) =>
          tool.toolId,
      ),
    );

  if (
    !existingSkillIds.has(
      "skill-owner-escalation",
    ) ||
    plan.proposedSkillRegistryExpansion.some(
      (skill) =>
        existingSkillIds.has(
          skill.skillId,
        ),
    ) ||
    plan.proposedToolRegistryExpansion.some(
      (tool) =>
        existingToolIds.has(
          tool.toolId,
        ),
    )
  ) {
    throw new Error(
      "Revenue Growth registry-gap assessment is invalid.",
    );
  }

  const gap =
    plan.registryGapSummary;

  if (
    gap.existingOwnerEscalationSkillAvailable !==
      true ||
    gap.newRoleSkillCountRequired !==
      9 ||
    gap.newRoleToolCountRequired !==
      9 ||
    gap.directTemplateCreationBlockedUntilRegistryExpansion !==
      true
  ) {
    throw new Error(
      "Revenue Growth template registry-gap summary is invalid.",
    );
  }

  const humanLike =
    plan.humanLikeEmployeeStandard;

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
      "Revenue Growth human-like AI employee standard is invalid.",
    );
  }

  const boundary =
    plan.authorityBoundary;

  if (
    boundary.planningOnly !== true ||
    boundary.sourceFactoryAdmissionExecutionBound !==
      true ||
    boundary.launchSequencePlanningOnly !==
      true ||
    boundary.skillRegistryMutationAuthorized !==
      false ||
    boundary.toolRegistryMutationAuthorized !==
      false ||
    boundary.templatePreparationAuthorized !==
      false ||
    boundary.templateCreationAuthorized !==
      false ||
    boundary.factoryLifecycleTransitionAuthorized !==
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
      "Revenue Growth template-preparation authority boundary is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceTemplatePreparationPlan(
  input:
    CreateRevenueGrowthWorkforceTemplatePreparationPlanInput,
): RevenueGrowthWorkforceTemplatePreparationPlan {
  requireIdentifier(
    "Template-preparation planning ID",
    input.planningId,
  );

  requireTimestamp(
    "Template-preparation planning time",
    input.preparedAt,
  );

  const source =
    REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION;

  validateRevenueGrowthWorkforceFactoryAdmissionExecution(
    source,
  );

  if (
    source.nextStep !==
      "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN" ||
    source.admittedFactoryCandidateCount !==
      9 ||
    source.candidateRecords.length !==
      9
  ) {
    throw new Error(
      "Completed Revenue Growth factory admission is required before template planning.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Template-preparation planning cannot precede factory admission.",
    );
  }

  const sourceRegisteredTemplateLaunchSequences = [
    ASHA_INQUIRY_INTAKE_TEMPLATE
      .launchSequence,
    RIYA_RECOMMENDATION_SPECIALIST_TEMPLATE
      .launchSequence,
    MEERA_QUOTATION_PROPOSAL_SPECIALIST_TEMPLATE
      .launchSequence,
  ];

  const firstProposedSequence =
    Math.max(
      ...sourceRegisteredTemplateLaunchSequences,
    ) + 1;

  const proposedTemplates =
    source.candidateRecords.map(
      (candidate, index) => {
        if (
          candidate.department !==
            "SALES" &&
          candidate.department !==
            "MARKETING"
        ) {
          throw new Error(
            "Revenue Growth template candidate must belong to SALES or MARKETING.",
          );
        }

        if (
          candidate.lifecycleState !==
            "PLANNED_CANDIDATE" ||
          candidate.templatePrepared !==
            false ||
          candidate.runtimeAuthorized !==
            false ||
          candidate.managerRoleKey !==
            "founder-owner-ceo"
        ) {
          throw new Error(
            "Revenue Growth template planning requires a safely blocked planned factory candidate.",
          );
        }

        const blueprint =
          REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS[
            index
          ];

        return {
          preparationSequence:
            index + 1,
          templateId:
            candidate.employeeId.replace(
              /^employee-/,
              "template-",
            ),
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
            "founder-owner-ceo" as const,
          proposedLaunchSequence:
            firstProposedSequence +
            index,
          capability:
            blueprint.capability,
          sourceFactoryRecordId:
            candidate.factoryRecordId,
          sourceFactoryRecordDigest:
            candidate.recordDigest,
          sourceLifecycleState:
            "PLANNED_CANDIDATE" as const,
          plannedTargetLifecycleState:
            "TEMPLATE_PREPARATION_PENDING" as const,
          requiredSkillIds: [
            blueprint.proposedSkill
              .skillId,
            "skill-owner-escalation",
          ],
          requiredToolIds: [
            blueprint.proposedTool
              .toolId,
          ],
          roleSkillRegistryExpansionRequired:
            true as const,
          roleToolRegistryExpansionRequired:
            true as const,
          templatePreparationAuthorized:
            false as const,
          templateCreated:
            false as const,
          lifecycleTransitionExecuted:
            false as const,
          qualificationExecutionAuthorized:
            false as const,
          activationAuthorized:
            false as const,
          runtimeAuthorized:
            false as const,
        };
      },
    );

  const planCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_VERSION,
    planningId:
      input.planningId,
    planningState:
      "OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNED" as const,
    sourceFactoryAdmissionExecutionId:
      source.executionId,
    sourceFactoryAdmissionExecutionDigest:
      source.executionDigest,
    sourceSkillToolRegistryVersion:
      SKILL_TOOL_REGISTRY_VERSION,
    sourceEmployeeCatalogVersion:
      OFFICIAL_LAUNCH_EMPLOYEE_CATALOG_VERSION,
    sourceCoreSkillInventoryDigest:
      sha256(
        CORE_WORKFORCE_SKILLS.map(
          (skill) =>
            skill.skillId,
        ),
      ),
    sourceCoreToolInventoryDigest:
      sha256(
        CORE_WORKFORCE_TOOLS.map(
          (tool) =>
            tool.toolId,
        ),
      ),
    sourceRegisteredTemplateLaunchSequences,
    proposedTemplateCount:
      9 as const,
    proposedLaunchSequences:
      proposedTemplates.map(
        (entry) =>
          entry.proposedLaunchSequence,
      ),
    proposedTemplates,
    proposedSkillRegistryExpansion:
      REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
        (blueprint) =>
          blueprint.proposedSkill,
      ),
    proposedToolRegistryExpansion:
      REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
        (blueprint) =>
          blueprint.proposedTool,
      ),
    registryGapSummary: {
      existingOwnerEscalationSkillAvailable:
        true as const,
      newRoleSkillCountRequired:
        9 as const,
      newRoleToolCountRequired:
        9 as const,
      directTemplateCreationBlockedUntilRegistryExpansion:
        true as const,
    },
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
    ownerTemplatePreparationPlanDecisionRequired:
      true as const,
    ownerTemplatePreparationPlanDecisionRecorded:
      false as const,
    authorityBoundary: {
      planningOnly:
        true as const,
      sourceFactoryAdmissionExecutionBound:
        true as const,
      launchSequencePlanningOnly:
        true as const,
      skillRegistryMutationAuthorized:
        false as const,
      toolRegistryMutationAuthorized:
        false as const,
      templatePreparationAuthorized:
        false as const,
      templateCreationAuthorized:
        false as const,
      factoryLifecycleTransitionAuthorized:
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
      "AWAIT_OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION" as const,
    preparedAt:
      input.preparedAt,
  };

  const plan =
    deepFreeze({
      ...planCore,
      planningDigest:
        sha256(planCore),
    }) as RevenueGrowthWorkforceTemplatePreparationPlan;

  validateRevenueGrowthWorkforceTemplatePreparationPlan(
    plan,
  );

  return plan;
}

export const REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN =
  createRevenueGrowthWorkforceTemplatePreparationPlan({
    planningId:
      "revenue-growth-workforce-template-preparation-plan-001",
    preparedAt:
      "2026-07-21T03:21:14.665Z",
  });
