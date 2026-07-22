import { createHash } from "node:crypto";

import {
  CORE_WORKFORCE_SKILLS,
  CORE_WORKFORCE_TOOLS,
  SKILL_TOOL_REGISTRY_VERSION,
  createSkillToolRegistry,
  type SkillToolRegistry,
  type WorkforceSkillDefinition,
  type WorkforceToolDefinition,
} from "./skillToolRegistry";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
  validateEngineeringAIWorkforceSkillToolRegistryExpansionPreparation,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionPreparation";

import {
  validateEngineeringAIWorkforceSkillToolRegistryExpansionDecision,
  type EngineeringAIWorkforceSkillToolRegistryExpansionDecision,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionDecision";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionApprovalRecord";

import {
  REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
  validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation,
} from "./revenueGrowthWorkforceSkillToolRegistryExpansionPreparation";

export const ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-skill-tool-registry-expansion-execution-v1" as const;

export interface CreateEngineeringAIWorkforceSkillToolRegistryExpansionExecutionInput {
  readonly executionId: string;
  readonly approvalDecision:
    EngineeringAIWorkforceSkillToolRegistryExpansionDecision;
  readonly executedAt: string;
}

export interface EngineeringAIWorkforceSkillToolRegistryExpansionExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION_VERSION;
  readonly executionId: string;
  readonly executionState:
    "OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTED";
  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;
  readonly sourcePreparationId: string;
  readonly sourcePreparationDigest:
    string;
  readonly sourceCombinedPreviewRegistryDigest:
    string;
  readonly sourceRevenueGrowthPreparationId:
    string;
  readonly sourceRevenueGrowthPreparationDigest:
    string;
  readonly sourceRegistryVersion:
    typeof SKILL_TOOL_REGISTRY_VERSION;
  readonly sourceCoreSkillCount: number;
  readonly sourceCoreToolCount: number;
  readonly reservedRevenueGrowthSkillCount:
    9;
  readonly reservedRevenueGrowthToolCount:
    9;
  readonly appliedEngineeringSkillCount:
    8;
  readonly appliedEngineeringToolCount:
    8;
  readonly resultSkillCount: number;
  readonly resultToolCount: number;
  readonly appliedSkills:
    readonly WorkforceSkillDefinition[];
  readonly appliedTools:
    readonly WorkforceToolDefinition[];
  readonly expandedRegistry:
    SkillToolRegistry;
  readonly expandedRegistryDigest:
    string;
  readonly applicationEvidence: Readonly<{
    registryMutationExecuted: true;
    immutableExpandedRegistrySnapshotCreated:
      true;
    appendOnlyEngineeringDefinitionsApplied:
      true;
    coreRegistryPreserved: true;
    revenueGrowthReservationPreserved:
      true;
    revenueGrowthDefinitionsApplied:
      false;
    engineeringDefinitionsRegistered:
      true;
    engineeringDefinitionsActive:
      true;
    duplicateSkillIdsBlocked: true;
    duplicateToolIdsBlocked: true;
    combinedReservationCollisionBlocked:
      true;
    templatePreparationEligibilityAchieved:
      true;
  }>;
  readonly authorityBoundary: Readonly<{
    boundedRegistryApplicationExecuted:
      true;
    sourceOwnerApprovalBound: true;
    exactEightSkillMutationsRequired:
      true;
    exactEightToolMutationsRequired:
      true;
    coreRegistrySourcePreserved:
      true;
    revenueGrowthReservationNotApplied:
      true;
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
    ownerActivationApproved:
      false;
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
    "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION_DECISION";
  readonly executedAt: string;
  readonly executionDigest: string;
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
        "Unsupported deterministic Engineering registry-expansion execution value.",
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

export function validateEngineeringAIWorkforceSkillToolRegistryExpansionExecution(
  record:
    EngineeringAIWorkforceSkillToolRegistryExpansionExecution,
): void {
  const {
    executionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Engineering registry-expansion execution digest",
    executionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    executionDigest
  ) {
    throw new Error(
      "Engineering registry-expansion execution digest verification failed.",
    );
  }

  requireIdentifier(
    "Engineering registry-expansion execution ID",
    record.executionId,
  );

  requireIdentifier(
    "Engineering source decision ID",
    record.sourceDecisionId,
  );

  requireIdentifier(
    "Engineering source preparation ID",
    record.sourcePreparationId,
  );

  requireIdentifier(
    "Revenue Growth source preparation ID",
    record.sourceRevenueGrowthPreparationId,
  );

  requireDigest(
    "Engineering source decision digest",
    record.sourceDecisionDigest,
  );

  requireDigest(
    "Engineering source preparation digest",
    record.sourcePreparationDigest,
  );

  requireDigest(
    "Engineering source combined preview digest",
    record.sourceCombinedPreviewRegistryDigest,
  );

  requireDigest(
    "Revenue Growth source preparation digest",
    record.sourceRevenueGrowthPreparationDigest,
  );

  requireDigest(
    "Engineering expanded registry digest",
    record.expandedRegistryDigest,
  );

  requireTimestamp(
    "Engineering registry-expansion execution time",
    record.executedAt,
  );

  const decision =
    ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION;

  const preparation =
    ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

  const revenuePreparation =
    REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION_VERSION ||
    record.executionState !==
      "OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTED" ||
    record.sourceDecisionId !==
      decision.decisionId ||
    record.sourceDecisionDigest !==
      decision.decisionDigest ||
    record.sourcePreparationId !==
      preparation.preparationId ||
    record.sourcePreparationDigest !==
      preparation.preparationDigest ||
    record.sourceCombinedPreviewRegistryDigest !==
      preparation.previewRegistryDigest ||
    record.sourceRevenueGrowthPreparationId !==
      revenuePreparation.preparationId ||
    record.sourceRevenueGrowthPreparationDigest !==
      revenuePreparation.preparationDigest ||
    record.sourceRegistryVersion !==
      SKILL_TOOL_REGISTRY_VERSION ||
    record.sourceCoreSkillCount !==
      CORE_WORKFORCE_SKILLS.length ||
    record.sourceCoreToolCount !==
      CORE_WORKFORCE_TOOLS.length ||
    record.reservedRevenueGrowthSkillCount !==
      9 ||
    record.reservedRevenueGrowthToolCount !==
      9 ||
    record.appliedEngineeringSkillCount !==
      8 ||
    record.appliedEngineeringToolCount !==
      8 ||
    record.appliedSkills.length !==
      8 ||
    record.appliedTools.length !==
      8 ||
    record.resultSkillCount !==
      record.sourceCoreSkillCount +
        record.appliedEngineeringSkillCount ||
    record.resultToolCount !==
      record.sourceCoreToolCount +
        record.appliedEngineeringToolCount
  ) {
    throw new Error(
      "Engineering registry-expansion execution identity or counts are invalid.",
    );
  }

  if (
    canonicalize(
      record.appliedSkills,
    ) !==
      canonicalize(
        preparation.proposedSkills,
      ) ||
    canonicalize(
      record.appliedTools,
    ) !==
      canonicalize(
        preparation.proposedTools,
      )
  ) {
    throw new Error(
      "Engineering registry-expansion execution definitions do not match the approved preparation.",
    );
  }

  requireUnique(
    "Applied Engineering skill IDs",
    record.appliedSkills.map(
      (skill) =>
        skill.skillId,
    ),
  );

  requireUnique(
    "Applied Engineering tool IDs",
    record.appliedTools.map(
      (tool) =>
        tool.toolId,
    ),
  );

  const revenueSkillIds =
    new Set(
      revenuePreparation.proposedSkills.map(
        (skill) =>
          skill.skillId,
      ),
    );

  const revenueToolIds =
    new Set(
      revenuePreparation.proposedTools.map(
        (tool) =>
          tool.toolId,
      ),
    );

  if (
    record.appliedSkills.some(
      (skill) =>
        revenueSkillIds.has(
          skill.skillId,
        ),
    ) ||
    record.appliedTools.some(
      (tool) =>
        revenueToolIds.has(
          tool.toolId,
        ),
    )
  ) {
    throw new Error(
      "Engineering registry execution must not apply reserved Revenue Growth definitions.",
    );
  }

  if (
    record.appliedTools.some(
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
      "Applied Engineering tools must remain audited tenant-scoped non-external draft-only tools.",
    );
  }

  const expectedRegistry =
    createSkillToolRegistry({
      skills: [
        ...CORE_WORKFORCE_SKILLS,
        ...record.appliedSkills,
      ],
      tools: [
        ...CORE_WORKFORCE_TOOLS,
        ...record.appliedTools,
      ],
      createdAt:
        record.executedAt,
    });

  if (
    record.expandedRegistryDigest !==
      record.expandedRegistry.registryDigest ||
    record.expandedRegistryDigest !==
      expectedRegistry.registryDigest ||
    canonicalize(
      record.expandedRegistry,
    ) !==
      canonicalize(
        expectedRegistry,
      ) ||
    record.expandedRegistry.skills.length !==
      record.resultSkillCount ||
    record.expandedRegistry.tools.length !==
      record.resultToolCount
  ) {
    throw new Error(
      "Engineering expanded registry snapshot is invalid.",
    );
  }

  const applied =
    record.applicationEvidence;

  if (
    applied.registryMutationExecuted !==
      true ||
    applied.immutableExpandedRegistrySnapshotCreated !==
      true ||
    applied.appendOnlyEngineeringDefinitionsApplied !==
      true ||
    applied.coreRegistryPreserved !==
      true ||
    applied.revenueGrowthReservationPreserved !==
      true ||
    applied.revenueGrowthDefinitionsApplied !==
      false ||
    applied.engineeringDefinitionsRegistered !==
      true ||
    applied.engineeringDefinitionsActive !==
      true ||
    applied.duplicateSkillIdsBlocked !==
      true ||
    applied.duplicateToolIdsBlocked !==
      true ||
    applied.combinedReservationCollisionBlocked !==
      true ||
    applied.templatePreparationEligibilityAchieved !==
      true
  ) {
    throw new Error(
      "Engineering registry-expansion application evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.boundedRegistryApplicationExecuted !==
      true ||
    boundary.sourceOwnerApprovalBound !==
      true ||
    boundary.exactEightSkillMutationsRequired !==
      true ||
    boundary.exactEightToolMutationsRequired !==
      true ||
    boundary.coreRegistrySourcePreserved !==
      true ||
    boundary.revenueGrowthReservationNotApplied !==
      true ||
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
      "Engineering registry-expansion execution authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION_DECISION"
  ) {
    throw new Error(
      "Engineering registry-expansion execution next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceSkillToolRegistryExpansionExecution(
  input:
    CreateEngineeringAIWorkforceSkillToolRegistryExpansionExecutionInput,
): EngineeringAIWorkforceSkillToolRegistryExpansionExecution {
  const decision =
    input.approvalDecision;

  const preparation =
    ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

  const revenuePreparation =
    REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

  validateEngineeringAIWorkforceSkillToolRegistryExpansionDecision(
    decision,
  );

  validateEngineeringAIWorkforceSkillToolRegistryExpansionPreparation(
    preparation,
  );

  validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation(
    revenuePreparation,
  );

  requireIdentifier(
    "Engineering registry-expansion execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Engineering registry-expansion execution time",
    input.executedAt,
  );

  if (
    decision.decision !==
      "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION" ||
    decision.registryExpansionApproved !==
      true ||
    decision.registryMutationExecutionAuthorized !==
      true ||
    decision.authorityBoundary
      .skillRegistryMutationAuthorized !==
      true ||
    decision.authorityBoundary
      .toolRegistryMutationAuthorized !==
      true ||
    decision.authorityBoundary
      .registryMutationExecutionAuthorized !==
      true ||
    decision.authorityBoundary
      .coreRegistryMutationPerformed !==
      false ||
    decision.authorityBoundary
      .revenueGrowthReservationMutationPerformed !==
      false ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION"
  ) {
    throw new Error(
      "Approved Engineering registry-expansion evidence is required.",
    );
  }

  if (
    decision.sourcePreparationId !==
      preparation.preparationId ||
    decision.sourcePreparationDigest !==
      preparation.preparationDigest ||
    decision.sourceRevenueGrowthPreparationId !==
      revenuePreparation.preparationId ||
    decision.sourceRevenueGrowthPreparationDigest !==
      revenuePreparation.preparationDigest
  ) {
    throw new Error(
      "Engineering registry approval is not bound to the exact preparation evidence.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Engineering registry expansion cannot precede owner approval.",
    );
  }

  const appliedSkills:
    readonly WorkforceSkillDefinition[] =
      preparation.proposedSkills.map(
        (skill) => ({
          ...skill,
        }),
      );

  const appliedTools:
    readonly WorkforceToolDefinition[] =
      preparation.proposedTools.map(
        (tool) => ({
          ...tool,
          allowedModes: [
            ...tool.allowedModes,
          ],
        }),
      );

  const expandedRegistry =
    createSkillToolRegistry({
      skills: [
        ...CORE_WORKFORCE_SKILLS,
        ...appliedSkills,
      ],
      tools: [
        ...CORE_WORKFORCE_TOOLS,
        ...appliedTools,
      ],
      createdAt:
        input.executedAt,
    });

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION_VERSION,
    executionId:
      input.executionId,
    executionState:
      "OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourcePreparationId:
      preparation.preparationId,
    sourcePreparationDigest:
      preparation.preparationDigest,
    sourceCombinedPreviewRegistryDigest:
      preparation.previewRegistryDigest,
    sourceRevenueGrowthPreparationId:
      revenuePreparation.preparationId,
    sourceRevenueGrowthPreparationDigest:
      revenuePreparation.preparationDigest,
    sourceRegistryVersion:
      SKILL_TOOL_REGISTRY_VERSION,
    sourceCoreSkillCount:
      CORE_WORKFORCE_SKILLS.length,
    sourceCoreToolCount:
      CORE_WORKFORCE_TOOLS.length,
    reservedRevenueGrowthSkillCount:
      9 as const,
    reservedRevenueGrowthToolCount:
      9 as const,
    appliedEngineeringSkillCount:
      8 as const,
    appliedEngineeringToolCount:
      8 as const,
    resultSkillCount:
      expandedRegistry.skills.length,
    resultToolCount:
      expandedRegistry.tools.length,
    appliedSkills,
    appliedTools,
    expandedRegistry,
    expandedRegistryDigest:
      expandedRegistry.registryDigest,
    applicationEvidence: {
      registryMutationExecuted:
        true as const,
      immutableExpandedRegistrySnapshotCreated:
        true as const,
      appendOnlyEngineeringDefinitionsApplied:
        true as const,
      coreRegistryPreserved:
        true as const,
      revenueGrowthReservationPreserved:
        true as const,
      revenueGrowthDefinitionsApplied:
        false as const,
      engineeringDefinitionsRegistered:
        true as const,
      engineeringDefinitionsActive:
        true as const,
      duplicateSkillIdsBlocked:
        true as const,
      duplicateToolIdsBlocked:
        true as const,
      combinedReservationCollisionBlocked:
        true as const,
      templatePreparationEligibilityAchieved:
        true as const,
    },
    authorityBoundary: {
      boundedRegistryApplicationExecuted:
        true as const,
      sourceOwnerApprovalBound:
        true as const,
      exactEightSkillMutationsRequired:
        true as const,
      exactEightToolMutationsRequired:
        true as const,
      coreRegistrySourcePreserved:
        true as const,
      revenueGrowthReservationNotApplied:
        true as const,
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
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION_DECISION" as const,
    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,
      executionDigest:
        sha256(executionCore),
    }) as EngineeringAIWorkforceSkillToolRegistryExpansionExecution;

  validateEngineeringAIWorkforceSkillToolRegistryExpansionExecution(
    execution,
  );

  return execution;
}

export const ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION =
  createEngineeringAIWorkforceSkillToolRegistryExpansionExecution({
    executionId:
      "engineering-ai-workforce-skill-tool-registry-expansion-execution-001",
    approvalDecision:
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION,
    executedAt:
      "2026-07-21T17:36:14.056Z",
  });

export const ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY =
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
    .expandedRegistry;
