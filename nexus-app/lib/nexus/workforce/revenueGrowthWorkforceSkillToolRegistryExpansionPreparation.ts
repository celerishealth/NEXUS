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
  REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS,
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
  validateRevenueGrowthWorkforceTemplatePreparationPlan,
} from "./revenueGrowthWorkforceTemplatePreparationPlan";

import {
  validateRevenueGrowthWorkforceTemplatePreparationPlanDecision,
} from "./revenueGrowthWorkforceTemplatePreparationPlanDecision";

import {
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION,
} from "./revenueGrowthWorkforceTemplatePreparationPlanApprovalRecord";

export const REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION =
  "nexus-revenue-growth-workforce-skill-tool-registry-expansion-preparation-v1" as const;

export interface CreateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparationInput {
  readonly preparationId: string;
  readonly preparedAt: string;
}

export interface RevenueGrowthWorkforceSkillToolRegistryExpansionPreparation {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION;
  readonly preparationId: string;
  readonly preparationState:
    "OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED";
  readonly sourceApprovalDecisionId:
    string;
  readonly sourceApprovalDecisionDigest:
    string;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceRegistryVersion:
    typeof SKILL_TOOL_REGISTRY_VERSION;
  readonly sourceCoreSkillInventoryDigest:
    string;
  readonly sourceCoreToolInventoryDigest:
    string;
  readonly currentSkillCount: number;
  readonly currentToolCount: number;
  readonly proposedSkillCount: 9;
  readonly proposedToolCount: 9;
  readonly targetSkillCount: number;
  readonly targetToolCount: number;
  readonly proposedSkills:
    readonly WorkforceSkillDefinition[];
  readonly proposedTools:
    readonly WorkforceToolDefinition[];
  readonly previewRegistryDigest: string;
  readonly collisionCheck: Readonly<{
    existingSkillCollisionCount: 0;
    existingToolCollisionCount: 0;
    proposedSkillDuplicateCount: 0;
    proposedToolDuplicateCount: 0;
    safeForRegistryDecisionReview: true;
  }>;
  readonly safetyStandard: Readonly<{
    allToolsDraftOnly: true;
    allToolsMediumRisk: true;
    allToolsNonExternal: true;
    allToolsTenantScoped: true;
    allToolsAudited: true;
    allDefinitionsInactiveInCoreRegistry:
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
    registryPreviewValidationCompleted:
      true;
    skillRegistryMutationAuthorized:
      false;
    toolRegistryMutationAuthorized:
      false;
    coreRegistryMutationPerformed:
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
    "AWAIT_OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION";
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
        "Unsupported deterministic registry-expansion preparation value.",
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
    new Set<string>(values).size !==
    values.length
  ) {
    throw new Error(
      `${label} must not contain duplicates.`,
    );
  }
}

export function validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation(
  record:
    RevenueGrowthWorkforceSkillToolRegistryExpansionPreparation,
): void {
  const {
    preparationDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Registry-expansion preparation digest",
    preparationDigest,
  );

  if (
    sha256(unsignedRecord) !==
    preparationDigest
  ) {
    throw new Error(
      "Registry-expansion preparation digest verification failed.",
    );
  }

  requireIdentifier(
    "Registry-expansion preparation ID",
    record.preparationId,
  );

  requireIdentifier(
    "Source approval decision ID",
    record.sourceApprovalDecisionId,
  );

  requireIdentifier(
    "Source planning ID",
    record.sourcePlanningId,
  );

  requireDigest(
    "Source approval decision digest",
    record.sourceApprovalDecisionDigest,
  );

  requireDigest(
    "Source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Source core skill inventory digest",
    record.sourceCoreSkillInventoryDigest,
  );

  requireDigest(
    "Source core tool inventory digest",
    record.sourceCoreToolInventoryDigest,
  );

  requireDigest(
    "Preview registry digest",
    record.previewRegistryDigest,
  );

  requireTimestamp(
    "Registry-expansion preparation time",
    record.preparedAt,
  );

  if (
    record.version !==
      REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED" ||
    record.sourceRegistryVersion !==
      SKILL_TOOL_REGISTRY_VERSION ||
    record.currentSkillCount !==
      CORE_WORKFORCE_SKILLS.length ||
    record.currentToolCount !==
      CORE_WORKFORCE_TOOLS.length ||
    record.proposedSkillCount !==
      9 ||
    record.proposedToolCount !==
      9 ||
    record.proposedSkills.length !==
      9 ||
    record.proposedTools.length !==
      9 ||
    record.targetSkillCount !==
      record.currentSkillCount +
        record.proposedSkillCount ||
    record.targetToolCount !==
      record.currentToolCount +
        record.proposedToolCount ||
    record.ownerRegistryExpansionDecisionRequired !==
      true ||
    record.ownerRegistryExpansionDecisionRecorded !==
      false
  ) {
    throw new Error(
      "Registry-expansion preparation identity or counts are invalid.",
    );
  }

  requireUnique(
    "Proposed skill IDs",
    record.proposedSkills.map(
      (skill) =>
        skill.skillId,
    ),
  );

  requireUnique(
    "Proposed tool IDs",
    record.proposedTools.map(
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
    record.proposedSkills.some(
      (skill) =>
        existingSkillIds.has(
          skill.skillId,
        ),
    ) ||
    record.proposedTools.some(
      (tool) =>
        existingToolIds.has(
          tool.toolId,
        ),
    )
  ) {
    throw new Error(
      "Registry-expansion preparation collides with the core registry.",
    );
  }

  if (
    record.proposedSkills.some(
      (skill) =>
        skill.version !== 1 ||
        skill.active !== true,
    )
  ) {
    throw new Error(
      "Proposed Revenue Growth skill definitions are invalid.",
    );
  }

  if (
    record.proposedTools.some(
      (tool) =>
        tool.risk !== "MEDIUM" ||
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
      "Proposed Revenue Growth tools must remain audited tenant-scoped non-external draft-only tools.",
    );
  }

  const previewRegistry =
    createSkillToolRegistry({
      skills: [
        ...CORE_WORKFORCE_SKILLS,
        ...record.proposedSkills,
      ],
      tools: [
        ...CORE_WORKFORCE_TOOLS,
        ...record.proposedTools,
      ],
      createdAt:
        record.preparedAt,
    });

  if (
    previewRegistry.registryDigest !==
      record.previewRegistryDigest ||
    previewRegistry.skills.length !==
      record.targetSkillCount ||
    previewRegistry.tools.length !==
      record.targetToolCount
  ) {
    throw new Error(
      "Registry-expansion preview validation is invalid.",
    );
  }

  const collision =
    record.collisionCheck;

  if (
    collision.existingSkillCollisionCount !==
      0 ||
    collision.existingToolCollisionCount !==
      0 ||
    collision.proposedSkillDuplicateCount !==
      0 ||
    collision.proposedToolDuplicateCount !==
      0 ||
    collision.safeForRegistryDecisionReview !==
      true
  ) {
    throw new Error(
      "Registry-expansion collision evidence is invalid.",
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
    standard.transparentAIIdentityPreserved !==
      true ||
    standard.humanImpersonationAuthorized !==
      false
  ) {
    throw new Error(
      "Registry-expansion safety standard is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.preparationOnly !==
      true ||
    boundary.sourceOwnerApprovalBound !==
      true ||
    boundary.registryPreviewValidationCompleted !==
      true ||
    boundary.skillRegistryMutationAuthorized !==
      false ||
    boundary.toolRegistryMutationAuthorized !==
      false ||
    boundary.coreRegistryMutationPerformed !==
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
      "Registry-expansion preparation authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION"
  ) {
    throw new Error(
      "Registry-expansion preparation next step is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation(
  input:
    CreateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparationInput,
): RevenueGrowthWorkforceSkillToolRegistryExpansionPreparation {
  const sourcePlan =
    REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

  const approval =
    REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION;

  validateRevenueGrowthWorkforceTemplatePreparationPlan(
    sourcePlan,
  );

  validateRevenueGrowthWorkforceTemplatePreparationPlanDecision(
    approval,
  );

  requireIdentifier(
    "Registry-expansion preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Registry-expansion preparation time",
    input.preparedAt,
  );

  if (
    approval.decision !==
      "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN" ||
    approval.templatePreparationPlanApproved !==
      true ||
    approval.registryExpansionPreparationEligible !==
      true ||
    approval.nextStep !==
      "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION" ||
    approval.sourcePlanningId !==
      sourcePlan.planningId ||
    approval.sourcePlanningDigest !==
      sourcePlan.planningDigest
  ) {
    throw new Error(
      "Verified owner approval does not authorize registry-expansion preparation.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(approval.decidedAt)
  ) {
    throw new Error(
      "Registry-expansion preparation cannot precede owner approval.",
    );
  }

  const proposedSkills:
    readonly WorkforceSkillDefinition[] =
      REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
        (blueprint) => ({
          skillId:
            blueprint.proposedSkill.skillId,
          name:
            blueprint.proposedSkill.name,
          description:
            blueprint.proposedSkill.description,
          category:
            blueprint.proposedSkill.category,
          version:
            1,
          active:
            true,
        }),
      );

  const proposedTools:
    readonly WorkforceToolDefinition[] =
      REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
        (blueprint) => ({
          toolId:
            blueprint.proposedTool.toolId,
          name:
            blueprint.proposedTool.name,
          capability:
            blueprint.proposedTool.capability,
          risk:
            blueprint.proposedTool.risk,
          allowedModes: [
            blueprint.proposedTool.mode,
          ],
          ownerApprovalRequired:
            false,
          externalEffect:
            blueprint.proposedTool.externalEffect,
          tenantScoped:
            blueprint.proposedTool.tenantScoped,
          auditRequired:
            blueprint.proposedTool.auditRequired,
          active:
            true,
        }),
      );

  const previewRegistry =
    createSkillToolRegistry({
      skills: [
        ...CORE_WORKFORCE_SKILLS,
        ...proposedSkills,
      ],
      tools: [
        ...CORE_WORKFORCE_TOOLS,
        ...proposedTools,
      ],
      createdAt:
        input.preparedAt,
    });

  const preparationCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION,
    preparationId:
      input.preparationId,
    preparationState:
      "OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED" as const,
    sourceApprovalDecisionId:
      approval.decisionId,
    sourceApprovalDecisionDigest:
      approval.decisionDigest,
    sourcePlanningId:
      sourcePlan.planningId,
    sourcePlanningDigest:
      sourcePlan.planningDigest,
    sourceRegistryVersion:
      SKILL_TOOL_REGISTRY_VERSION,
    sourceCoreSkillInventoryDigest:
      sourcePlan.sourceCoreSkillInventoryDigest,
    sourceCoreToolInventoryDigest:
      sourcePlan.sourceCoreToolInventoryDigest,
    currentSkillCount:
      CORE_WORKFORCE_SKILLS.length,
    currentToolCount:
      CORE_WORKFORCE_TOOLS.length,
    proposedSkillCount:
      9 as const,
    proposedToolCount:
      9 as const,
    targetSkillCount:
      previewRegistry.skills.length,
    targetToolCount:
      previewRegistry.tools.length,
    proposedSkills,
    proposedTools,
    previewRegistryDigest:
      previewRegistry.registryDigest,
    collisionCheck: {
      existingSkillCollisionCount:
        0 as const,
      existingToolCollisionCount:
        0 as const,
      proposedSkillDuplicateCount:
        0 as const,
      proposedToolDuplicateCount:
        0 as const,
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
      registryPreviewValidationCompleted:
        true as const,
      skillRegistryMutationAuthorized:
        false as const,
      toolRegistryMutationAuthorized:
        false as const,
      coreRegistryMutationPerformed:
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
      "AWAIT_OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION" as const,
    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,
      preparationDigest:
        sha256(preparationCore),
    }) as RevenueGrowthWorkforceSkillToolRegistryExpansionPreparation;

  validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation(
    preparation,
  );

  return preparation;
}

export const REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION =
  createRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation({
    preparationId:
      "revenue-growth-workforce-skill-tool-registry-expansion-preparation-001",
    preparedAt:
      "2026-07-21T07:55:23.554Z",
  });
