import { createHash } from "node:crypto";

import {
  CORE_WORKFORCE_SKILLS,
  CORE_WORKFORCE_TOOLS,
  SKILL_TOOL_REGISTRY_VERSION,
  createSkillToolRegistry,
  type WorkforceSkillDefinition,
  type WorkforceToolDefinition,
} from "./skillToolRegistry";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
  validateEngineeringAIWorkforceTemplatePreparationPlan,
} from "./engineeringAIWorkforceTemplatePreparationPlan";

import {
  validateEngineeringAIWorkforceTemplatePreparationPlanDecision,
} from "./engineeringAIWorkforceTemplatePreparationPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION,
} from "./engineeringAIWorkforceTemplatePreparationPlanApprovalRecord";

import {
  REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
  validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation,
} from "./revenueGrowthWorkforceSkillToolRegistryExpansionPreparation";

export const ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-skill-tool-registry-expansion-preparation-v1" as const;

export interface CreateEngineeringAIWorkforceSkillToolRegistryExpansionPreparationInput {
  readonly preparationId: string;
  readonly preparedAt: string;
}

export interface EngineeringAIWorkforceSkillToolRegistryExpansionPreparation {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION;
  readonly preparationId: string;
  readonly preparationState:
    "OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED";
  readonly sourceApprovalDecisionId:
    string;
  readonly sourceApprovalDecisionDigest:
    string;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceRevenueGrowthPreparationId:
    string;
  readonly sourceRevenueGrowthPreparationDigest:
    string;
  readonly sourceRegistryVersion:
    typeof SKILL_TOOL_REGISTRY_VERSION;
  readonly sourceCoreSkillInventoryDigest:
    string;
  readonly sourceCoreToolInventoryDigest:
    string;
  readonly currentCoreSkillCount:
    number;
  readonly currentCoreToolCount:
    number;
  readonly reservedRevenueGrowthSkillCount:
    9;
  readonly reservedRevenueGrowthToolCount:
    9;
  readonly proposedEngineeringSkillCount:
    8;
  readonly proposedEngineeringToolCount:
    8;
  readonly targetCombinedSkillCount:
    number;
  readonly targetCombinedToolCount:
    number;
  readonly proposedSkills:
    readonly WorkforceSkillDefinition[];
  readonly proposedTools:
    readonly WorkforceToolDefinition[];
  readonly previewRegistryDigest:
    string;
  readonly collisionCheck: Readonly<{
    coreSkillCollisionCount: 0;
    coreToolCollisionCount: 0;
    revenueGrowthSkillCollisionCount:
      0;
    revenueGrowthToolCollisionCount:
      0;
    proposedSkillDuplicateCount: 0;
    proposedToolDuplicateCount: 0;
    safeForRegistryDecisionReview:
      true;
  }>;
  readonly safetyStandard: Readonly<{
    allToolsDraftOnly: true;
    allToolsMediumRisk: true;
    allToolsNonExternal: true;
    allToolsTenantScoped: true;
    allToolsAudited: true;
    allDefinitionsInactiveInCoreRegistry:
      true;
    allDefinitionsAbsentFromRevenueGrowthReservation:
      true;
    repositoryAuthorityNotGranted:
      true;
    transparentAIIdentityPreserved:
      true;
    humanImpersonationAuthorized:
      false;
  }>;
  readonly ownerRegistryExpansionDecisionRequired:
    true;
  readonly ownerRegistryExpansionDecisionRecorded:
    false;
  readonly authorityBoundary: Readonly<{
    preparationOnly: true;
    sourceOwnerApprovalBound: true;
    sourceRevenueGrowthReservationBound:
      true;
    combinedRegistryPreviewValidationCompleted:
      true;
    skillRegistryMutationAuthorized:
      false;
    toolRegistryMutationAuthorized:
      false;
    coreRegistryMutationPerformed:
      false;
    revenueGrowthReservationMutationPerformed:
      false;
    proposedDefinitionsActivated:
      false;
    templatePreparationAuthorized:
      false;
    templateCreationAuthorized:
      false;
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
    "AWAIT_OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION";
  readonly preparedAt: string;
  readonly preparationDigest: string;
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
        "Unsupported deterministic Engineering registry-expansion preparation value.",
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

function countDuplicates(
  values: readonly string[],
): number {
  return (
    values.length -
    new Set(values).size
  );
}

function countOverlap(
  proposed: readonly string[],
  occupied: readonly string[],
): number {
  const occupiedSet =
    new Set(occupied);

  return proposed.filter(
    (value) =>
      occupiedSet.has(value),
  ).length;
}

export function validateEngineeringAIWorkforceSkillToolRegistryExpansionPreparation(
  record:
    EngineeringAIWorkforceSkillToolRegistryExpansionPreparation,
): void {
  const {
    preparationDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Engineering registry-expansion preparation digest",
    preparationDigest,
  );

  if (
    sha256(unsignedRecord) !==
    preparationDigest
  ) {
    throw new Error(
      "Engineering registry-expansion preparation digest verification failed.",
    );
  }

  requireIdentifier(
    "Engineering registry-expansion preparation ID",
    record.preparationId,
  );

  requireIdentifier(
    "Engineering source approval decision ID",
    record.sourceApprovalDecisionId,
  );

  requireIdentifier(
    "Engineering source planning ID",
    record.sourcePlanningId,
  );

  requireIdentifier(
    "Revenue Growth source preparation ID",
    record.sourceRevenueGrowthPreparationId,
  );

  requireDigest(
    "Engineering source approval decision digest",
    record.sourceApprovalDecisionDigest,
  );

  requireDigest(
    "Engineering source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Revenue Growth source preparation digest",
    record.sourceRevenueGrowthPreparationDigest,
  );

  requireDigest(
    "Engineering source core skill inventory digest",
    record.sourceCoreSkillInventoryDigest,
  );

  requireDigest(
    "Engineering source core tool inventory digest",
    record.sourceCoreToolInventoryDigest,
  );

  requireDigest(
    "Engineering combined preview registry digest",
    record.previewRegistryDigest,
  );

  requireTimestamp(
    "Engineering registry-expansion preparation time",
    record.preparedAt,
  );

  const sourcePlan =
    ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

  const approval =
    ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION;

  const revenuePreparation =
    REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED" ||
    record.sourceApprovalDecisionId !==
      approval.decisionId ||
    record.sourceApprovalDecisionDigest !==
      approval.decisionDigest ||
    record.sourcePlanningId !==
      sourcePlan.planningId ||
    record.sourcePlanningDigest !==
      sourcePlan.planningDigest ||
    record.sourceRevenueGrowthPreparationId !==
      revenuePreparation.preparationId ||
    record.sourceRevenueGrowthPreparationDigest !==
      revenuePreparation.preparationDigest ||
    record.sourceRegistryVersion !==
      SKILL_TOOL_REGISTRY_VERSION ||
    record.currentCoreSkillCount !==
      CORE_WORKFORCE_SKILLS.length ||
    record.currentCoreToolCount !==
      CORE_WORKFORCE_TOOLS.length ||
    record.reservedRevenueGrowthSkillCount !==
      9 ||
    record.reservedRevenueGrowthToolCount !==
      9 ||
    record.proposedEngineeringSkillCount !==
      8 ||
    record.proposedEngineeringToolCount !==
      8 ||
    record.proposedSkills.length !==
      8 ||
    record.proposedTools.length !==
      8 ||
    record.targetCombinedSkillCount !==
      record.currentCoreSkillCount +
        record.reservedRevenueGrowthSkillCount +
        record.proposedEngineeringSkillCount ||
    record.targetCombinedToolCount !==
      record.currentCoreToolCount +
        record.reservedRevenueGrowthToolCount +
        record.proposedEngineeringToolCount ||
    record.ownerRegistryExpansionDecisionRequired !==
      true ||
    record.ownerRegistryExpansionDecisionRecorded !==
      false
  ) {
    throw new Error(
      "Engineering registry-expansion preparation identity or counts are invalid.",
    );
  }

  requireUnique(
    "Engineering proposed skill IDs",
    record.proposedSkills.map(
      (skill) =>
        skill.skillId,
    ),
  );

  requireUnique(
    "Engineering proposed tool IDs",
    record.proposedTools.map(
      (tool) =>
        tool.toolId,
    ),
  );

  if (
    canonicalize(
      record.proposedSkills,
    ) !==
      canonicalize(
        ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
          (blueprint) =>
            blueprint.proposedSkill,
        ),
      ) ||
    canonicalize(
      record.proposedTools,
    ) !==
      canonicalize(
        ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
          (blueprint) =>
            blueprint.proposedTool,
        ),
      )
  ) {
    throw new Error(
      "Engineering proposed registry definitions do not match the approved capability blueprints.",
    );
  }

  const coreSkillIds =
    CORE_WORKFORCE_SKILLS.map(
      (skill) =>
        skill.skillId,
    );

  const coreToolIds =
    CORE_WORKFORCE_TOOLS.map(
      (tool) =>
        tool.toolId,
    );

  const revenueSkillIds =
    revenuePreparation.proposedSkills.map(
      (skill) =>
        skill.skillId,
    );

  const revenueToolIds =
    revenuePreparation.proposedTools.map(
      (tool) =>
        tool.toolId,
    );

  const proposedSkillIds =
    record.proposedSkills.map(
      (skill) =>
        skill.skillId,
    );

  const proposedToolIds =
    record.proposedTools.map(
      (tool) =>
        tool.toolId,
    );

  if (
    countOverlap(
      proposedSkillIds,
      coreSkillIds,
    ) !== 0 ||
    countOverlap(
      proposedToolIds,
      coreToolIds,
    ) !== 0 ||
    countOverlap(
      proposedSkillIds,
      revenueSkillIds,
    ) !== 0 ||
    countOverlap(
      proposedToolIds,
      revenueToolIds,
    ) !== 0 ||
    countDuplicates(
      proposedSkillIds,
    ) !== 0 ||
    countDuplicates(
      proposedToolIds,
    ) !== 0
  ) {
    throw new Error(
      "Engineering registry-expansion preparation contains a core, Revenue Growth, or duplicate collision.",
    );
  }

  if (
    record.proposedSkills.some(
      (skill) =>
        skill.version !==
          1 ||
        skill.active !==
          true,
    )
  ) {
    throw new Error(
      "Proposed Engineering skill definitions are invalid.",
    );
  }

  if (
    record.proposedTools.some(
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
      "Proposed Engineering tools must remain audited tenant-scoped non-external draft-only tools.",
    );
  }

  const previewRegistry =
    createSkillToolRegistry({
      skills: [
        ...CORE_WORKFORCE_SKILLS,
        ...revenuePreparation.proposedSkills,
        ...record.proposedSkills,
      ],
      tools: [
        ...CORE_WORKFORCE_TOOLS,
        ...revenuePreparation.proposedTools,
        ...record.proposedTools,
      ],
      createdAt:
        record.preparedAt,
    });

  if (
    previewRegistry.registryDigest !==
      record.previewRegistryDigest ||
    previewRegistry.skills.length !==
      record.targetCombinedSkillCount ||
    previewRegistry.tools.length !==
      record.targetCombinedToolCount
  ) {
    throw new Error(
      "Engineering combined registry-expansion preview validation is invalid.",
    );
  }

  const collision =
    record.collisionCheck;

  if (
    collision.coreSkillCollisionCount !==
      0 ||
    collision.coreToolCollisionCount !==
      0 ||
    collision.revenueGrowthSkillCollisionCount !==
      0 ||
    collision.revenueGrowthToolCollisionCount !==
      0 ||
    collision.proposedSkillDuplicateCount !==
      0 ||
    collision.proposedToolDuplicateCount !==
      0 ||
    collision.safeForRegistryDecisionReview !==
      true
  ) {
    throw new Error(
      "Engineering registry-expansion collision evidence is invalid.",
    );
  }

  const standard =
    record.safetyStandard;

  if (
    standard.allToolsDraftOnly !==
      true ||
    standard.allToolsMediumRisk !==
      true ||
    standard.allToolsNonExternal !==
      true ||
    standard.allToolsTenantScoped !==
      true ||
    standard.allToolsAudited !==
      true ||
    standard.allDefinitionsInactiveInCoreRegistry !==
      true ||
    standard.allDefinitionsAbsentFromRevenueGrowthReservation !==
      true ||
    standard.repositoryAuthorityNotGranted !==
      true ||
    standard.transparentAIIdentityPreserved !==
      true ||
    standard.humanImpersonationAuthorized !==
      false
  ) {
    throw new Error(
      "Engineering registry-expansion safety standard is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.preparationOnly !==
      true ||
    boundary.sourceOwnerApprovalBound !==
      true ||
    boundary.sourceRevenueGrowthReservationBound !==
      true ||
    boundary.combinedRegistryPreviewValidationCompleted !==
      true ||
    boundary.skillRegistryMutationAuthorized !==
      false ||
    boundary.toolRegistryMutationAuthorized !==
      false ||
    boundary.coreRegistryMutationPerformed !==
      false ||
    boundary.revenueGrowthReservationMutationPerformed !==
      false ||
    boundary.proposedDefinitionsActivated !==
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
      "Engineering registry-expansion preparation authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION"
  ) {
    throw new Error(
      "Engineering registry-expansion preparation next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceSkillToolRegistryExpansionPreparation(
  input:
    CreateEngineeringAIWorkforceSkillToolRegistryExpansionPreparationInput,
): EngineeringAIWorkforceSkillToolRegistryExpansionPreparation {
  const sourcePlan =
    ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

  const approval =
    ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION;

  const revenuePreparation =
    REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

  validateEngineeringAIWorkforceTemplatePreparationPlan(
    sourcePlan,
  );

  validateEngineeringAIWorkforceTemplatePreparationPlanDecision(
    approval,
  );

  validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation(
    revenuePreparation,
  );

  requireIdentifier(
    "Engineering registry-expansion preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Engineering registry-expansion preparation time",
    input.preparedAt,
  );

  if (
    approval.decision !==
      "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN" ||
    approval.templatePreparationPlanApproved !==
      true ||
    approval.registryExpansionPreparationEligible !==
      true ||
    approval.nextStep !==
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION" ||
    approval.sourcePlanningId !==
      sourcePlan.planningId ||
    approval.sourcePlanningDigest !==
      sourcePlan.planningDigest
  ) {
    throw new Error(
      "Verified Engineering owner approval does not authorize registry-expansion preparation.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
      Date.parse(
        approval.decidedAt,
      ) ||
    Date.parse(input.preparedAt) <
      Date.parse(
        revenuePreparation.preparedAt,
      )
  ) {
    throw new Error(
      "Engineering registry-expansion preparation cannot precede its source evidence.",
    );
  }

  const proposedSkills:
    readonly WorkforceSkillDefinition[] =
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
        (blueprint) => ({
          ...blueprint.proposedSkill,
        }),
      );

  const proposedTools:
    readonly WorkforceToolDefinition[] =
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
        (blueprint) => ({
          ...blueprint.proposedTool,
          allowedModes: [
            ...blueprint.proposedTool.allowedModes,
          ],
        }),
      );

  const coreSkillIds =
    CORE_WORKFORCE_SKILLS.map(
      (skill) =>
        skill.skillId,
    );

  const coreToolIds =
    CORE_WORKFORCE_TOOLS.map(
      (tool) =>
        tool.toolId,
    );

  const revenueSkillIds =
    revenuePreparation.proposedSkills.map(
      (skill) =>
        skill.skillId,
    );

  const revenueToolIds =
    revenuePreparation.proposedTools.map(
      (tool) =>
        tool.toolId,
    );

  const proposedSkillIds =
    proposedSkills.map(
      (skill) =>
        skill.skillId,
    );

  const proposedToolIds =
    proposedTools.map(
      (tool) =>
        tool.toolId,
    );

  const previewRegistry =
    createSkillToolRegistry({
      skills: [
        ...CORE_WORKFORCE_SKILLS,
        ...revenuePreparation.proposedSkills,
        ...proposedSkills,
      ],
      tools: [
        ...CORE_WORKFORCE_TOOLS,
        ...revenuePreparation.proposedTools,
        ...proposedTools,
      ],
      createdAt:
        input.preparedAt,
    });

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION,
    preparationId:
      input.preparationId,
    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED" as const,
    sourceApprovalDecisionId:
      approval.decisionId,
    sourceApprovalDecisionDigest:
      approval.decisionDigest,
    sourcePlanningId:
      sourcePlan.planningId,
    sourcePlanningDigest:
      sourcePlan.planningDigest,
    sourceRevenueGrowthPreparationId:
      revenuePreparation.preparationId,
    sourceRevenueGrowthPreparationDigest:
      revenuePreparation.preparationDigest,
    sourceRegistryVersion:
      SKILL_TOOL_REGISTRY_VERSION,
    sourceCoreSkillInventoryDigest:
      sourcePlan.sourceCoreSkillInventoryDigest,
    sourceCoreToolInventoryDigest:
      sourcePlan.sourceCoreToolInventoryDigest,
    currentCoreSkillCount:
      CORE_WORKFORCE_SKILLS.length,
    currentCoreToolCount:
      CORE_WORKFORCE_TOOLS.length,
    reservedRevenueGrowthSkillCount:
      9 as const,
    reservedRevenueGrowthToolCount:
      9 as const,
    proposedEngineeringSkillCount:
      8 as const,
    proposedEngineeringToolCount:
      8 as const,
    targetCombinedSkillCount:
      previewRegistry.skills.length,
    targetCombinedToolCount:
      previewRegistry.tools.length,
    proposedSkills,
    proposedTools,
    previewRegistryDigest:
      previewRegistry.registryDigest,
    collisionCheck: {
      coreSkillCollisionCount:
        countOverlap(
          proposedSkillIds,
          coreSkillIds,
        ) as 0,
      coreToolCollisionCount:
        countOverlap(
          proposedToolIds,
          coreToolIds,
        ) as 0,
      revenueGrowthSkillCollisionCount:
        countOverlap(
          proposedSkillIds,
          revenueSkillIds,
        ) as 0,
      revenueGrowthToolCollisionCount:
        countOverlap(
          proposedToolIds,
          revenueToolIds,
        ) as 0,
      proposedSkillDuplicateCount:
        countDuplicates(
          proposedSkillIds,
        ) as 0,
      proposedToolDuplicateCount:
        countDuplicates(
          proposedToolIds,
        ) as 0,
      safeForRegistryDecisionReview:
        true as const,
    },
    safetyStandard: {
      allToolsDraftOnly:
        true as const,
      allToolsMediumRisk:
        true as const,
      allToolsNonExternal:
        true as const,
      allToolsTenantScoped:
        true as const,
      allToolsAudited:
        true as const,
      allDefinitionsInactiveInCoreRegistry:
        true as const,
      allDefinitionsAbsentFromRevenueGrowthReservation:
        true as const,
      repositoryAuthorityNotGranted:
        true as const,
      transparentAIIdentityPreserved:
        true as const,
      humanImpersonationAuthorized:
        false as const,
    },
    ownerRegistryExpansionDecisionRequired:
      true as const,
    ownerRegistryExpansionDecisionRecorded:
      false as const,
    authorityBoundary: {
      preparationOnly:
        true as const,
      sourceOwnerApprovalBound:
        true as const,
      sourceRevenueGrowthReservationBound:
        true as const,
      combinedRegistryPreviewValidationCompleted:
        true as const,
      skillRegistryMutationAuthorized:
        false as const,
      toolRegistryMutationAuthorized:
        false as const,
      coreRegistryMutationPerformed:
        false as const,
      revenueGrowthReservationMutationPerformed:
        false as const,
      proposedDefinitionsActivated:
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
      "AWAIT_OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION" as const,
    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,
      preparationDigest:
        sha256(preparationCore),
    }) as EngineeringAIWorkforceSkillToolRegistryExpansionPreparation;

  validateEngineeringAIWorkforceSkillToolRegistryExpansionPreparation(
    preparation,
  );

  return preparation;
}

export const ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION =
  createEngineeringAIWorkforceSkillToolRegistryExpansionPreparation({
    preparationId:
      "engineering-ai-workforce-skill-tool-registry-expansion-preparation-001",
    preparedAt:
      "2026-07-21T16:09:19.418Z",
  });
