import { createHash } from "node:crypto";

import {
  ASHA_INQUIRY_INTAKE_TEMPLATE,
  MEERA_QUOTATION_PROPOSAL_SPECIALIST_TEMPLATE,
  OFFICIAL_LAUNCH_EMPLOYEE_CATALOG_VERSION,
  RIYA_RECOMMENDATION_SPECIALIST_TEMPLATE,
} from "./employeeTemplateRegistry";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
} from "./engineeringAIWorkforceDevelopmentPlan";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION,
} from "./engineeringAIWorkforceDevelopmentPlanApprovalRecord";

import {
  validateEngineeringAIWorkforceDevelopmentPlanDecision,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "./revenueGrowthWorkforceTemplatePreparationPlan";

import {
  CORE_WORKFORCE_SKILLS,
  CORE_WORKFORCE_TOOLS,
  SKILL_TOOL_REGISTRY_VERSION,
  type WorkforceSkillDefinition,
  type WorkforceToolDefinition,
} from "./skillToolRegistry";

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_VERSION =
  "nexus-engineering-ai-workforce-template-preparation-plan-v1" as const;

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITIES = [
  "SYSTEM_ARCHITECTURE_AND_BOUNDARY_DESIGN",
  "SOFTWARE_DELIVERY_COORDINATION",
  "QUALITY_ASSURANCE_AND_REGRESSION",
  "SECURITY_ENGINEERING_AND_THREAT_MODELING",
  "RELIABILITY_AND_RECOVERY_ENGINEERING",
  "CHAOS_AND_FAILURE_SCENARIO_DESIGN",
  "DATA_ENGINEERING_AND_ANALYTICS",
  "SYSTEMS_EVALUATION_AND_RED_TEAMING",
] as const;

export type EngineeringAIWorkforceTemplateCapability =
  (
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITIES
  )[number];

export interface EngineeringAIWorkforceTemplateCapabilityBlueprint {
  readonly capability:
    EngineeringAIWorkforceTemplateCapability;
  readonly proposedSkill:
    WorkforceSkillDefinition;
  readonly proposedTool:
    WorkforceToolDefinition;
}

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS =
  [
    {
      capability:
        "SYSTEM_ARCHITECTURE_AND_BOUNDARY_DESIGN",
      proposedSkill: {
        skillId:
          "skill-system-architecture-boundary-design",
        name:
          "System architecture and boundary design",
        description:
          "Prepares evidence-bound architecture decisions, component boundaries, tradeoffs, and owner-reviewable technical designs.",
        category:
          "engineering-architecture",
        version:
          1,
        active:
          true,
      },
      proposedTool: {
        toolId:
          "tool-architecture-design-draft",
        name:
          "Architecture design draft creator",
        capability:
          "Create a sandbox architecture and system-boundary design for owner review",
        risk:
          "MEDIUM",
        allowedModes: [
          "DRAFT_ONLY",
        ],
        ownerApprovalRequired:
          false,
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
        active:
          true,
      },
    },
    {
      capability:
        "SOFTWARE_DELIVERY_COORDINATION",
      proposedSkill: {
        skillId:
          "skill-software-delivery-coordination",
        name:
          "Software delivery coordination",
        description:
          "Prepares bounded implementation plans, dependency analysis, review checkpoints, and evidence-driven delivery sequencing.",
        category:
          "software-engineering",
        version:
          1,
        active:
          true,
      },
      proposedTool: {
        toolId:
          "tool-software-delivery-plan-draft",
        name:
          "Software delivery plan draft creator",
        capability:
          "Create a sandbox implementation and delivery plan without modifying a repository",
        risk:
          "MEDIUM",
        allowedModes: [
          "DRAFT_ONLY",
        ],
        ownerApprovalRequired:
          false,
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
        active:
          true,
      },
    },
    {
      capability:
        "QUALITY_ASSURANCE_AND_REGRESSION",
      proposedSkill: {
        skillId:
          "skill-quality-assurance-regression-design",
        name:
          "Quality assurance and regression design",
        description:
          "Designs acceptance criteria, test coverage, regression strategy, defect evidence, and owner-reviewable release gates.",
        category:
          "quality-engineering",
        version:
          1,
        active:
          true,
      },
      proposedTool: {
        toolId:
          "tool-qa-regression-plan-draft",
        name:
          "QA regression plan draft creator",
        capability:
          "Create a sandbox quality-assurance and regression plan for owner review",
        risk:
          "MEDIUM",
        allowedModes: [
          "DRAFT_ONLY",
        ],
        ownerApprovalRequired:
          false,
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
        active:
          true,
      },
    },
    {
      capability:
        "SECURITY_ENGINEERING_AND_THREAT_MODELING",
      proposedSkill: {
        skillId:
          "skill-security-engineering-threat-modeling",
        name:
          "Security engineering and threat modeling",
        description:
          "Prepares threat models, tenant-isolation reviews, authorization analysis, secret-protection checks, and security recommendations.",
        category:
          "security-engineering",
        version:
          1,
        active:
          true,
      },
      proposedTool: {
        toolId:
          "tool-security-threat-model-draft",
        name:
          "Security threat-model draft creator",
        capability:
          "Create a sandbox security threat model without accessing secrets or production systems",
        risk:
          "MEDIUM",
        allowedModes: [
          "DRAFT_ONLY",
        ],
        ownerApprovalRequired:
          false,
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
        active:
          true,
      },
    },
    {
      capability:
        "RELIABILITY_AND_RECOVERY_ENGINEERING",
      proposedSkill: {
        skillId:
          "skill-reliability-recovery-engineering",
        name:
          "Reliability and recovery engineering",
        description:
          "Prepares observability, rollback, recovery, continuity, capacity, and deployment-readiness plans with explicit failure boundaries.",
        category:
          "reliability-engineering",
        version:
          1,
        active:
          true,
      },
      proposedTool: {
        toolId:
          "tool-reliability-recovery-plan-draft",
        name:
          "Reliability recovery plan draft creator",
        capability:
          "Create a sandbox reliability and recovery plan without changing production infrastructure",
        risk:
          "MEDIUM",
        allowedModes: [
          "DRAFT_ONLY",
        ],
        ownerApprovalRequired:
          false,
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
        active:
          true,
      },
    },
    {
      capability:
        "CHAOS_AND_FAILURE_SCENARIO_DESIGN",
      proposedSkill: {
        skillId:
          "skill-chaos-failure-scenario-design",
        name:
          "Chaos and failure-scenario design",
        description:
          "Designs reversible sandbox failure scenarios, safety assertions, containment checks, and recovery evidence without executing disruption.",
        category:
          "chaos-engineering",
        version:
          1,
        active:
          true,
      },
      proposedTool: {
        toolId:
          "tool-chaos-scenario-draft",
        name:
          "Chaos scenario draft creator",
        capability:
          "Create a non-executing sandbox chaos-test scenario for owner review",
        risk:
          "MEDIUM",
        allowedModes: [
          "DRAFT_ONLY",
        ],
        ownerApprovalRequired:
          false,
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
        active:
          true,
      },
    },
    {
      capability:
        "DATA_ENGINEERING_AND_ANALYTICS",
      proposedSkill: {
        skillId:
          "skill-data-engineering-analytics-design",
        name:
          "Data engineering and analytics design",
        description:
          "Prepares tenant-safe data models, migration plans, lineage, data-quality controls, and transparent analytical designs.",
        category:
          "data-engineering",
        version:
          1,
        active:
          true,
      },
      proposedTool: {
        toolId:
          "tool-data-engineering-plan-draft",
        name:
          "Data engineering plan draft creator",
        capability:
          "Create a sandbox data-model and migration plan without database execution",
        risk:
          "MEDIUM",
        allowedModes: [
          "DRAFT_ONLY",
        ],
        ownerApprovalRequired:
          false,
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
        active:
          true,
      },
    },
    {
      capability:
        "SYSTEMS_EVALUATION_AND_RED_TEAMING",
      proposedSkill: {
        skillId:
          "skill-systems-evaluation-red-teaming",
        name:
          "Systems evaluation and red-team design",
        description:
          "Prepares adversarial evaluations, safety probes, defect-discovery scenarios, scoring criteria, and independent evidence reviews.",
        category:
          "systems-evaluation",
        version:
          1,
        active:
          true,
      },
      proposedTool: {
        toolId:
          "tool-red-team-evaluation-draft",
        name:
          "Red-team evaluation draft creator",
        capability:
          "Create a non-executing sandbox red-team evaluation plan for owner review",
        risk:
          "MEDIUM",
        allowedModes: [
          "DRAFT_ONLY",
        ],
        ownerApprovalRequired:
          false,
        externalEffect:
          false,
        tenantScoped:
          true,
        auditRequired:
          true,
        active:
          true,
      },
    },
  ] as const satisfies
    readonly EngineeringAIWorkforceTemplateCapabilityBlueprint[];

export interface EngineeringAIWorkforceTemplatePreparationPlanEntry {
  readonly preparationSequence:
    number;
  readonly templateId: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    "ENGINEERING_DATA_SECURITY";
  readonly managerRoleKey:
    "founder-owner-ceo";
  readonly proposedLaunchSequence:
    number;
  readonly capability:
    EngineeringAIWorkforceTemplateCapability;
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
  readonly qualificationAdmissionAuthorized:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly activationAuthorized: false;
  readonly runtimeAuthorized: false;
  readonly repositoryReadAuthorized:
    false;
  readonly repositoryWriteAuthorized:
    false;
  readonly branchCreationAuthorized:
    false;
  readonly pullRequestPreparationAuthorized:
    false;
  readonly mergeAuthorized: false;
  readonly productionDeploymentAuthorized:
    false;
  readonly secretsAccessAuthorized:
    false;
}

export interface CreateEngineeringAIWorkforceTemplatePreparationPlanInput {
  readonly planningId: string;
  readonly preparedAt: string;
}

export interface EngineeringAIWorkforceTemplatePreparationPlan {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_VERSION;
  readonly planningId: string;
  readonly planningState:
    "OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLANNED";
  readonly sourceApprovalDecisionId:
    string;
  readonly sourceApprovalDecisionDigest:
    string;
  readonly sourceDevelopmentPlanningId:
    string;
  readonly sourceDevelopmentPlanningDigest:
    string;
  readonly sourceFactoryDigest: string;
  readonly sourceRevenueGrowthTemplatePlanningDigest:
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
  readonly sourceReservedRevenueGrowthLaunchSequences:
    readonly number[];
  readonly proposedTemplateCount: 8;
  readonly proposedLaunchSequences:
    readonly number[];
  readonly proposedTemplates:
    readonly EngineeringAIWorkforceTemplatePreparationPlanEntry[];
  readonly proposedSkillRegistryExpansion:
    readonly WorkforceSkillDefinition[];
  readonly proposedToolRegistryExpansion:
    readonly WorkforceToolDefinition[];
  readonly registryGapSummary: Readonly<{
    existingOwnerEscalationSkillAvailable:
      true;
    newRoleSkillCountRequired: 8;
    newRoleToolCountRequired: 8;
    directTemplateCreationBlockedUntilRegistryExpansion:
      true;
    revenueGrowthRegistryCollisionBlocked:
      true;
  }>;
  readonly founderLiberationObjective: Readonly<{
    routineEngineeringTemplateFoundationTarget:
      true;
    founderReleaseAchieved: false;
    ownerRetainsFinalProductAuthority:
      true;
    ownerRetainsMergeAuthority: true;
    ownerRetainsProductionDeploymentAuthority:
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
    sourceOwnerApprovalBound: true;
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
    repositoryReadAuthorized: false;
    repositoryWriteAuthorized: false;
    branchCreationAuthorized: false;
    pullRequestPreparationAuthorized:
      false;
    mergeAuthorized: false;
    productionDeploymentAuthorized:
      false;
    secretsAccessAuthorized: false;
    controlledWorkAuthorized: false;
    realCustomerDataAccessAuthorized:
      false;
    realCustomerContactAuthorized:
      false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized:
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
    "AWAIT_OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION";
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
        "Unsupported deterministic Engineering template-planning value.",
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
  values:
    readonly (string | number)[],
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

export function validateEngineeringAIWorkforceTemplatePreparationPlan(
  plan:
    EngineeringAIWorkforceTemplatePreparationPlan,
): void {
  const {
    planningDigest,
    ...unsignedPlan
  } = plan;

  requireDigest(
    "Engineering template-preparation planning digest",
    planningDigest,
  );

  if (
    sha256(unsignedPlan) !==
    planningDigest
  ) {
    throw new Error(
      "Engineering template-preparation planning digest verification failed.",
    );
  }

  requireIdentifier(
    "Engineering template-preparation planning ID",
    plan.planningId,
  );

  requireIdentifier(
    "Engineering source approval decision ID",
    plan.sourceApprovalDecisionId,
  );

  requireIdentifier(
    "Engineering source development planning ID",
    plan.sourceDevelopmentPlanningId,
  );

  requireDigest(
    "Engineering source approval decision digest",
    plan.sourceApprovalDecisionDigest,
  );

  requireDigest(
    "Engineering source development planning digest",
    plan.sourceDevelopmentPlanningDigest,
  );

  requireDigest(
    "Engineering source factory digest",
    plan.sourceFactoryDigest,
  );

  requireDigest(
    "Revenue Growth template-planning digest",
    plan.sourceRevenueGrowthTemplatePlanningDigest,
  );

  requireDigest(
    "Core skill inventory digest",
    plan.sourceCoreSkillInventoryDigest,
  );

  requireDigest(
    "Core tool inventory digest",
    plan.sourceCoreToolInventoryDigest,
  );

  requireTimestamp(
    "Engineering template-preparation planning time",
    plan.preparedAt,
  );

  const approval =
    ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION;

  const developmentPlan =
    ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN;

  const revenuePlan =
    REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

  if (
    plan.version !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_VERSION ||
    plan.planningState !==
      "OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLANNED" ||
    plan.sourceApprovalDecisionId !==
      approval.decisionId ||
    plan.sourceApprovalDecisionDigest !==
      approval.decisionDigest ||
    plan.sourceDevelopmentPlanningId !==
      developmentPlan.planningId ||
    plan.sourceDevelopmentPlanningDigest !==
      developmentPlan.planningDigest ||
    plan.sourceFactoryDigest !==
      developmentPlan.sourceFactoryDigest ||
    plan.sourceRevenueGrowthTemplatePlanningDigest !==
      revenuePlan.planningDigest ||
    plan.sourceSkillToolRegistryVersion !==
      SKILL_TOOL_REGISTRY_VERSION ||
    plan.sourceEmployeeCatalogVersion !==
      OFFICIAL_LAUNCH_EMPLOYEE_CATALOG_VERSION ||
    plan.proposedTemplateCount !==
      8 ||
    plan.proposedTemplates.length !==
      8 ||
    plan.proposedLaunchSequences.length !==
      8 ||
    plan.proposedSkillRegistryExpansion.length !==
      8 ||
    plan.proposedToolRegistryExpansion.length !==
      8 ||
    plan.ownerTemplatePreparationPlanDecisionRequired !==
      true ||
    plan.ownerTemplatePreparationPlanDecisionRecorded !==
      false ||
    plan.nextStep !==
      "AWAIT_OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION"
  ) {
    throw new Error(
      "Engineering template-preparation plan identity is invalid.",
    );
  }

  const expectedRegisteredSequences = [
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
      canonicalize(
        expectedRegisteredSequences,
      ) ||
    canonicalize(
      plan.sourceReservedRevenueGrowthLaunchSequences,
    ) !==
      canonicalize(
        revenuePlan.proposedLaunchSequences,
      )
  ) {
    throw new Error(
      "Engineering source launch-sequence evidence is invalid.",
    );
  }

  requireUnique(
    "Registered template launch sequences",
    plan.sourceRegisteredTemplateLaunchSequences,
  );

  requireUnique(
    "Revenue Growth reserved launch sequences",
    plan.sourceReservedRevenueGrowthLaunchSequences,
  );

  requireUnique(
    "Engineering proposed launch sequences",
    plan.proposedLaunchSequences,
  );

  const occupiedLaunchSequences =
    new Set([
      ...plan.sourceRegisteredTemplateLaunchSequences,
      ...plan.sourceReservedRevenueGrowthLaunchSequences,
    ]);

  if (
    plan.proposedLaunchSequences.some(
      (sequence) =>
        occupiedLaunchSequences.has(
          sequence,
        ),
    )
  ) {
    throw new Error(
      "Engineering proposed launch sequence collides with registered or Revenue Growth planned templates.",
    );
  }

  const firstExpectedSequence =
    Math.max(
      ...occupiedLaunchSequences,
    ) + 1;

  plan.proposedTemplates.forEach(
    (entry, index) => {
      const candidate =
        developmentPlan.plannedCandidates[
          index
        ];

      const blueprint =
        ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS[
          index
        ];

      const expectedSequence =
        firstExpectedSequence + index;

      const expectedTemplateId =
        candidate.employeeId.replace(
          /^candidate-/,
          "template-",
        );

      if (
        entry.preparationSequence !==
          index + 1 ||
        entry.templateId !==
          expectedTemplateId ||
        entry.employeeId !==
          candidate.employeeId ||
        entry.employeeCode !==
          candidate.employeeCode ||
        entry.publicName !==
          candidate.publicName ||
        entry.officialRole !==
          candidate.officialRole ||
        entry.department !==
          "ENGINEERING_DATA_SECURITY" ||
        entry.managerRoleKey !==
          "founder-owner-ceo" ||
        entry.proposedLaunchSequence !==
          expectedSequence ||
        plan.proposedLaunchSequences[index] !==
          expectedSequence ||
        entry.capability !==
          blueprint.capability ||
        entry.sourceFactoryRecordId !==
          candidate.sourceFactoryRecordId ||
        entry.sourceFactoryRecordDigest !==
          candidate.sourceFactoryRecordDigest ||
        entry.sourceLifecycleState !==
          "PLANNED_CANDIDATE" ||
        entry.plannedTargetLifecycleState !==
          "TEMPLATE_PREPARATION_PENDING" ||
        entry.requiredSkillIds.length !==
          2 ||
        entry.requiredSkillIds[0] !==
          blueprint.proposedSkill.skillId ||
        entry.requiredSkillIds[1] !==
          "skill-owner-escalation" ||
        entry.requiredToolIds.length !==
          1 ||
        entry.requiredToolIds[0] !==
          blueprint.proposedTool.toolId ||
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
        entry.qualificationAdmissionAuthorized !==
          false ||
        entry.qualificationExecutionAuthorized !==
          false ||
        entry.activationAuthorized !==
          false ||
        entry.runtimeAuthorized !==
          false ||
        entry.repositoryReadAuthorized !==
          false ||
        entry.repositoryWriteAuthorized !==
          false ||
        entry.branchCreationAuthorized !==
          false ||
        entry.pullRequestPreparationAuthorized !==
          false ||
        entry.mergeAuthorized !==
          false ||
        entry.productionDeploymentAuthorized !==
          false ||
        entry.secretsAccessAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering template-preparation candidate binding is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Engineering template IDs",
    plan.proposedTemplates.map(
      (entry) =>
        entry.templateId,
    ),
  );

  requireUnique(
    "Engineering template employee IDs",
    plan.proposedTemplates.map(
      (entry) =>
        entry.employeeId,
    ),
  );

  requireUnique(
    "Engineering proposed skill IDs",
    plan.proposedSkillRegistryExpansion.map(
      (skill) =>
        skill.skillId,
    ),
  );

  requireUnique(
    "Engineering proposed tool IDs",
    plan.proposedToolRegistryExpansion.map(
      (tool) =>
        tool.toolId,
    ),
  );

  if (
    canonicalize(
      plan.proposedSkillRegistryExpansion,
    ) !==
      canonicalize(
        ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
          (blueprint) =>
            blueprint.proposedSkill,
        ),
      ) ||
    canonicalize(
      plan.proposedToolRegistryExpansion,
    ) !==
      canonicalize(
        ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
          (blueprint) =>
            blueprint.proposedTool,
        ),
      )
  ) {
    throw new Error(
      "Engineering proposed registry expansion does not match the approved capability blueprints.",
    );
  }

  const occupiedSkillIds =
    new Set<string>([
      ...CORE_WORKFORCE_SKILLS.map(
        (skill) =>
          skill.skillId,
      ),
      ...revenuePlan.proposedSkillRegistryExpansion.map(
        (skill) =>
          skill.skillId,
      ),
    ]);

  const occupiedToolIds =
    new Set<string>([
      ...CORE_WORKFORCE_TOOLS.map(
        (tool) =>
          tool.toolId,
      ),
      ...revenuePlan.proposedToolRegistryExpansion.map(
        (tool) =>
          tool.toolId,
      ),
    ]);

  if (
    !occupiedSkillIds.has(
      "skill-owner-escalation",
    ) ||
    plan.proposedSkillRegistryExpansion.some(
      (skill) =>
        occupiedSkillIds.has(
          skill.skillId,
        ),
    ) ||
    plan.proposedToolRegistryExpansion.some(
      (tool) =>
        occupiedToolIds.has(
          tool.toolId,
        ),
    )
  ) {
    throw new Error(
      "Engineering registry-gap assessment is invalid.",
    );
  }

  if (
    plan.proposedToolRegistryExpansion.some(
      (tool) =>
        tool.risk !==
          "MEDIUM" ||
        tool.allowedModes.length !==
          1 ||
        tool.allowedModes[0] !==
          "DRAFT_ONLY" ||
        tool.ownerApprovalRequired !==
          false ||
        tool.externalEffect !==
          false ||
        tool.tenantScoped !==
          true ||
        tool.auditRequired !==
          true ||
        tool.active !==
          true,
    )
  ) {
    throw new Error(
      "Engineering proposed tool safety contract is invalid.",
    );
  }

  const gap =
    plan.registryGapSummary;

  if (
    gap.existingOwnerEscalationSkillAvailable !==
      true ||
    gap.newRoleSkillCountRequired !==
      8 ||
    gap.newRoleToolCountRequired !==
      8 ||
    gap.directTemplateCreationBlockedUntilRegistryExpansion !==
      true ||
    gap.revenueGrowthRegistryCollisionBlocked !==
      true
  ) {
    throw new Error(
      "Engineering template registry-gap summary is invalid.",
    );
  }

  const founder =
    plan.founderLiberationObjective;

  if (
    founder.routineEngineeringTemplateFoundationTarget !==
      true ||
    founder.founderReleaseAchieved !==
      false ||
    founder.ownerRetainsFinalProductAuthority !==
      true ||
    founder.ownerRetainsMergeAuthority !==
      true ||
    founder.ownerRetainsProductionDeploymentAuthority !==
      true
  ) {
    throw new Error(
      "Engineering founder-liberation objective is invalid.",
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
      "Engineering human-like AI employee standard is invalid.",
    );
  }

  const boundary =
    plan.authorityBoundary;

  if (
    boundary.planningOnly !==
      true ||
    boundary.sourceOwnerApprovalBound !==
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
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
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
      "Engineering template-preparation authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceTemplatePreparationPlan(
  input:
    CreateEngineeringAIWorkforceTemplatePreparationPlanInput,
): EngineeringAIWorkforceTemplatePreparationPlan {
  requireIdentifier(
    "Engineering template-preparation planning ID",
    input.planningId,
  );

  requireTimestamp(
    "Engineering template-preparation planning time",
    input.preparedAt,
  );

  const approval =
    ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION;

  validateEngineeringAIWorkforceDevelopmentPlanDecision(
    approval,
  );

  const developmentPlan =
    ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN;

  const revenuePlan =
    REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

  if (
    approval.developmentPlanApproved !==
      true ||
    approval.templatePreparationPlanEligible !==
      true ||
    approval.nextStep !==
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLAN" ||
    approval.sourcePlanningId !==
      developmentPlan.planningId ||
    approval.sourcePlanningDigest !==
      developmentPlan.planningDigest ||
    approval.sourceFactoryDigest !==
      developmentPlan.sourceFactoryDigest
  ) {
    throw new Error(
      "Approved Engineering development-plan evidence is required before template planning.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(approval.decidedAt)
  ) {
    throw new Error(
      "Engineering template-preparation planning cannot precede owner approval.",
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

  const sourceReservedRevenueGrowthLaunchSequences = [
    ...revenuePlan.proposedLaunchSequences,
  ];

  const firstProposedSequence =
    Math.max(
      ...sourceRegisteredTemplateLaunchSequences,
      ...sourceReservedRevenueGrowthLaunchSequences,
    ) + 1;

  const proposedTemplates =
    developmentPlan.plannedCandidates.map(
      (candidate, index) => {
        const blueprint =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS[
            index
          ];

        if (
          !blueprint ||
          candidate.department !==
            "ENGINEERING_DATA_SECURITY" ||
          candidate.managerRoleKey !==
            "founder-owner-ceo" ||
          candidate.sourceLifecycleState !==
            "PLANNED_CANDIDATE" ||
          candidate.templatePreparationAuthorized !==
            false ||
          candidate.qualificationExecutionAuthorized !==
            false ||
          candidate.ownerActivationAuthorized !==
            false ||
          candidate.runtimeActivationAuthorized !==
            false
        ) {
          throw new Error(
            "Engineering template planning requires a safely blocked planned candidate.",
          );
        }

        return {
          preparationSequence:
            index + 1,
          templateId:
            candidate.employeeId.replace(
              /^candidate-/,
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
            "ENGINEERING_DATA_SECURITY" as const,
          managerRoleKey:
            "founder-owner-ceo" as const,
          proposedLaunchSequence:
            firstProposedSequence +
            index,
          capability:
            blueprint.capability,
          sourceFactoryRecordId:
            candidate.sourceFactoryRecordId,
          sourceFactoryRecordDigest:
            candidate.sourceFactoryRecordDigest,
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
          qualificationAdmissionAuthorized:
            false as const,
          qualificationExecutionAuthorized:
            false as const,
          activationAuthorized:
            false as const,
          runtimeAuthorized:
            false as const,
          repositoryReadAuthorized:
            false as const,
          repositoryWriteAuthorized:
            false as const,
          branchCreationAuthorized:
            false as const,
          pullRequestPreparationAuthorized:
            false as const,
          mergeAuthorized:
            false as const,
          productionDeploymentAuthorized:
            false as const,
          secretsAccessAuthorized:
            false as const,
        };
      },
    );

  const planCore = {
    version:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_VERSION,
    planningId:
      input.planningId,
    planningState:
      "OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLANNED" as const,
    sourceApprovalDecisionId:
      approval.decisionId,
    sourceApprovalDecisionDigest:
      approval.decisionDigest,
    sourceDevelopmentPlanningId:
      developmentPlan.planningId,
    sourceDevelopmentPlanningDigest:
      developmentPlan.planningDigest,
    sourceFactoryDigest:
      developmentPlan.sourceFactoryDigest,
    sourceRevenueGrowthTemplatePlanningDigest:
      revenuePlan.planningDigest,
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
    sourceReservedRevenueGrowthLaunchSequences,
    proposedTemplateCount:
      8 as const,
    proposedLaunchSequences:
      proposedTemplates.map(
        (entry) =>
          entry.proposedLaunchSequence,
      ),
    proposedTemplates,
    proposedSkillRegistryExpansion:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
        (blueprint) =>
          blueprint.proposedSkill,
      ),
    proposedToolRegistryExpansion:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
        (blueprint) =>
          blueprint.proposedTool,
      ),
    registryGapSummary: {
      existingOwnerEscalationSkillAvailable:
        true as const,
      newRoleSkillCountRequired:
        8 as const,
      newRoleToolCountRequired:
        8 as const,
      directTemplateCreationBlockedUntilRegistryExpansion:
        true as const,
      revenueGrowthRegistryCollisionBlocked:
        true as const,
    },
    founderLiberationObjective: {
      routineEngineeringTemplateFoundationTarget:
        true as const,
      founderReleaseAchieved:
        false as const,
      ownerRetainsFinalProductAuthority:
        true as const,
      ownerRetainsMergeAuthority:
        true as const,
      ownerRetainsProductionDeploymentAuthority:
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
      sourceOwnerApprovalBound:
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
      repositoryReadAuthorized:
        false as const,
      repositoryWriteAuthorized:
        false as const,
      branchCreationAuthorized:
        false as const,
      pullRequestPreparationAuthorized:
        false as const,
      mergeAuthorized:
        false as const,
      productionDeploymentAuthorized:
        false as const,
      secretsAccessAuthorized:
        false as const,
      controlledWorkAuthorized:
        false as const,
      realCustomerDataAccessAuthorized:
        false as const,
      realCustomerContactAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      liveProviderExecutionAuthorized:
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
      "AWAIT_OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION" as const,
    preparedAt:
      input.preparedAt,
  };

  const plan =
    deepFreeze({
      ...planCore,
      planningDigest:
        sha256(planCore),
    }) as EngineeringAIWorkforceTemplatePreparationPlan;

  validateEngineeringAIWorkforceTemplatePreparationPlan(
    plan,
  );

  return plan;
}

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN =
  createEngineeringAIWorkforceTemplatePreparationPlan({
    planningId:
      "engineering-ai-workforce-template-preparation-plan-001",
    preparedAt:
      "2026-07-21T15:26:36.517Z",
  });
