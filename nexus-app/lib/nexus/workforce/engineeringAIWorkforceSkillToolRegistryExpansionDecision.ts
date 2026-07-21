import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  SKILL_TOOL_REGISTRY_VERSION,
} from "./skillToolRegistry";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
  validateEngineeringAIWorkforceSkillToolRegistryExpansionPreparation,
  type EngineeringAIWorkforceSkillToolRegistryExpansionPreparation,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionPreparation";

export const ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-skill-tool-registry-expansion-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISIONS = [
  "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
  "REJECT_AND_RETAIN_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY",
] as const;

export type EngineeringAIWorkforceSkillToolRegistryExpansionDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceSkillToolRegistryExpansionDecisionInput {
  readonly registryExpansionPreparation:
    EngineeringAIWorkforceSkillToolRegistryExpansionPreparation;
  readonly decisionId: string;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    EngineeringAIWorkforceSkillToolRegistryExpansionDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringRegistryDefinitionMutationEligibility {
  readonly expansionSequence: number;
  readonly skillId: string;
  readonly toolId: string;
  readonly toolCapability: string;
  readonly skillRegistryMutationAuthorized:
    boolean;
  readonly toolRegistryMutationAuthorized:
    boolean;
  readonly registryMutationPerformed:
    false;
  readonly definitionActivated:
    false;
  readonly templatePreparationAuthorized:
    false;
  readonly templateCreationAuthorized:
    false;
  readonly factoryLifecycleTransitionAuthorized:
    false;
  readonly qualificationAdmissionAuthorized:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly activationAuthorized:
    false;
  readonly runtimeAuthorized:
    false;
  readonly repositoryReadAuthorized:
    false;
  readonly repositoryWriteAuthorized:
    false;
  readonly branchCreationAuthorized:
    false;
  readonly pullRequestPreparationAuthorized:
    false;
  readonly mergeAuthorized:
    false;
  readonly productionDeploymentAuthorized:
    false;
  readonly secretsAccessAuthorized:
    false;
}

export interface EngineeringAIWorkforceSkillToolRegistryExpansionDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_RECORDED";
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly sourcePreparationId:
    string;
  readonly sourcePreparationDigest:
    string;
  readonly sourceApprovalDecisionId:
    string;
  readonly sourceApprovalDecisionDigest:
    string;
  readonly sourcePlanningId:
    string;
  readonly sourcePlanningDigest:
    string;
  readonly sourceRevenueGrowthPreparationId:
    string;
  readonly sourceRevenueGrowthPreparationDigest:
    string;
  readonly sourceRegistryVersion:
    typeof SKILL_TOOL_REGISTRY_VERSION;
  readonly sourcePreviewRegistryDigest:
    string;
  readonly decision:
    EngineeringAIWorkforceSkillToolRegistryExpansionDecisionType;
  readonly registryExpansionApproved:
    boolean;
  readonly registryMutationExecutionAuthorized:
    boolean;
  readonly reason: string;
  readonly reviewedPreparation: Readonly<{
    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED";
    currentCoreSkillCount:
      number;
    currentCoreToolCount:
      number;
    reservedRevenueGrowthSkillCount:
      9;
    reservedRevenueGrowthToolCount:
      9;
    proposedEngineeringSkillCount:
      8;
    proposedEngineeringToolCount:
      8;
    targetCombinedSkillCount:
      number;
    targetCombinedToolCount:
      number;
    coreSkillCollisionCount:
      0;
    coreToolCollisionCount:
      0;
    revenueGrowthSkillCollisionCount:
      0;
    revenueGrowthToolCollisionCount:
      0;
    proposedSkillDuplicateCount:
      0;
    proposedToolDuplicateCount:
      0;
    safeForRegistryDecisionReview:
      true;
    allToolsDraftOnly:
      true;
    allToolsMediumRisk:
      true;
    allToolsNonExternal:
      true;
    allToolsTenantScoped:
      true;
    allToolsAudited:
      true;
    repositoryAuthorityNotGranted:
      true;
    sourceNextStep:
      "AWAIT_OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION";
  }>;
  readonly definitionMutationEligibility:
    readonly EngineeringRegistryDefinitionMutationEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded:
      true;
    ownerIdentityBound:
      true;
    sourcePreparationBound:
      true;
    sourceRevenueGrowthReservationBound:
      true;
    approvalBypassAllowed:
      false;
    skillRegistryMutationAuthorized:
      boolean;
    toolRegistryMutationAuthorized:
      boolean;
    registryMutationExecutionAuthorized:
      boolean;
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
    ownerActivationApproved:
      false;
    runtimeAuthorized:
      false;
    repositoryReadAuthorized:
      false;
    repositoryWriteAuthorized:
      false;
    branchCreationAuthorized:
      false;
    pullRequestPreparationAuthorized:
      false;
    mergeAuthorized:
      false;
    productionDeploymentAuthorized:
      false;
    secretsAccessAuthorized:
      false;
    controlledWorkAuthorized:
      false;
    realCustomerDataAccessAuthorized:
      false;
    realCustomerContactAuthorized:
      false;
    externalDeliveryAuthorized:
      false;
    liveProviderExecutionAuthorized:
      false;
    paymentExecutionAuthorized:
      false;
    financialCommitmentAuthorized:
      false;
    legalCommitmentAuthorized:
      false;
    autonomousExecutionAuthorized:
      false;
    publicLaunchAuthorized:
      false;
  }>;
  readonly nextStep:
    | "APPLY_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION"
    | "RETAIN_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY";
  readonly decidedAt: string;
  readonly decisionDigest: string;
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
        "Unsupported deterministic Engineering registry-expansion decision value.",
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

function requireReason(
  reason: string,
): void {
  if (
    reason !== reason.trim() ||
    reason.length < 10 ||
    reason.length > 1000
  ) {
    throw new Error(
      "Engineering registry-expansion decision reason must contain 10 to 1000 trimmed characters.",
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

export function validateEngineeringAIWorkforceSkillToolRegistryExpansionDecision(
  record:
    EngineeringAIWorkforceSkillToolRegistryExpansionDecision,
): void {
  const {
    decisionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Engineering registry-expansion decision digest",
    decisionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    decisionDigest
  ) {
    throw new Error(
      "Engineering registry-expansion decision digest verification failed.",
    );
  }

  requireIdentifier(
    "Engineering registry-expansion decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering source preparation ID",
    record.sourcePreparationId,
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
    "Engineering source preparation digest",
    record.sourcePreparationDigest,
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
    "Engineering source preview registry digest",
    record.sourcePreviewRegistryDigest,
  );

  requireReason(
    record.reason,
  );

  requireTimestamp(
    "Engineering registry-expansion decision time",
    record.decidedAt,
  );

  const source =
    ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_RECORDED" ||
    record.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.sourcePreparationId !==
      source.preparationId ||
    record.sourcePreparationDigest !==
      source.preparationDigest ||
    record.sourceApprovalDecisionId !==
      source.sourceApprovalDecisionId ||
    record.sourceApprovalDecisionDigest !==
      source.sourceApprovalDecisionDigest ||
    record.sourcePlanningId !==
      source.sourcePlanningId ||
    record.sourcePlanningDigest !==
      source.sourcePlanningDigest ||
    record.sourceRevenueGrowthPreparationId !==
      source.sourceRevenueGrowthPreparationId ||
    record.sourceRevenueGrowthPreparationDigest !==
      source.sourceRevenueGrowthPreparationDigest ||
    record.sourceRegistryVersion !==
      SKILL_TOOL_REGISTRY_VERSION ||
    record.sourcePreviewRegistryDigest !==
      source.previewRegistryDigest ||
    !ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISIONS.includes(
      record.decision,
    ) ||
    record.registryExpansionApproved !==
      approved ||
    record.registryMutationExecutionAuthorized !==
      approved ||
    record.definitionMutationEligibility.length !==
      8
  ) {
    throw new Error(
      "Engineering registry-expansion decision identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedPreparation;

  if (
    reviewed.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED" ||
    reviewed.currentCoreSkillCount !==
      source.currentCoreSkillCount ||
    reviewed.currentCoreToolCount !==
      source.currentCoreToolCount ||
    reviewed.reservedRevenueGrowthSkillCount !==
      9 ||
    reviewed.reservedRevenueGrowthToolCount !==
      9 ||
    reviewed.proposedEngineeringSkillCount !==
      8 ||
    reviewed.proposedEngineeringToolCount !==
      8 ||
    reviewed.targetCombinedSkillCount !==
      reviewed.currentCoreSkillCount +
        reviewed.reservedRevenueGrowthSkillCount +
        reviewed.proposedEngineeringSkillCount ||
    reviewed.targetCombinedToolCount !==
      reviewed.currentCoreToolCount +
        reviewed.reservedRevenueGrowthToolCount +
        reviewed.proposedEngineeringToolCount ||
    reviewed.coreSkillCollisionCount !==
      0 ||
    reviewed.coreToolCollisionCount !==
      0 ||
    reviewed.revenueGrowthSkillCollisionCount !==
      0 ||
    reviewed.revenueGrowthToolCollisionCount !==
      0 ||
    reviewed.proposedSkillDuplicateCount !==
      0 ||
    reviewed.proposedToolDuplicateCount !==
      0 ||
    reviewed.safeForRegistryDecisionReview !==
      true ||
    reviewed.allToolsDraftOnly !==
      true ||
    reviewed.allToolsMediumRisk !==
      true ||
    reviewed.allToolsNonExternal !==
      true ||
    reviewed.allToolsTenantScoped !==
      true ||
    reviewed.allToolsAudited !==
      true ||
    reviewed.repositoryAuthorityNotGranted !==
      true ||
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION"
  ) {
    throw new Error(
      "Reviewed Engineering registry-expansion preparation evidence is invalid.",
    );
  }

  record.definitionMutationEligibility.forEach(
    (definition, index) => {
      const sourceSkill =
        source.proposedSkills[index];

      const sourceTool =
        source.proposedTools[index];

      if (
        !sourceSkill ||
        !sourceTool ||
        definition.expansionSequence !==
          index + 1 ||
        definition.skillId !==
          sourceSkill.skillId ||
        definition.toolId !==
          sourceTool.toolId ||
        definition.toolCapability !==
          sourceTool.capability ||
        definition.skillRegistryMutationAuthorized !==
          approved ||
        definition.toolRegistryMutationAuthorized !==
          approved ||
        definition.registryMutationPerformed !==
          false ||
        definition.definitionActivated !==
          false ||
        definition.templatePreparationAuthorized !==
          false ||
        definition.templateCreationAuthorized !==
          false ||
        definition.factoryLifecycleTransitionAuthorized !==
          false ||
        definition.qualificationAdmissionAuthorized !==
          false ||
        definition.qualificationExecutionAuthorized !==
          false ||
        definition.activationAuthorized !==
          false ||
        definition.runtimeAuthorized !==
          false ||
        definition.repositoryReadAuthorized !==
          false ||
        definition.repositoryWriteAuthorized !==
          false ||
        definition.branchCreationAuthorized !==
          false ||
        definition.pullRequestPreparationAuthorized !==
          false ||
        definition.mergeAuthorized !==
          false ||
        definition.productionDeploymentAuthorized !==
          false ||
        definition.secretsAccessAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering registry definition mutation eligibility is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Engineering decision skill IDs",
    record.definitionMutationEligibility.map(
      (definition) =>
        definition.skillId,
    ),
  );

  requireUnique(
    "Engineering decision tool IDs",
    record.definitionMutationEligibility.map(
      (definition) =>
        definition.toolId,
    ),
  );

  const boundary =
    record.authorityBoundary;

  if (
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.sourcePreparationBound !==
      true ||
    boundary.sourceRevenueGrowthReservationBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.skillRegistryMutationAuthorized !==
      approved ||
    boundary.toolRegistryMutationAuthorized !==
      approved ||
    boundary.registryMutationExecutionAuthorized !==
      approved ||
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
      "Engineering registry-expansion decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "APPLY_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION"
      : "RETAIN_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY";

  if (
    record.nextStep !==
    expectedNextStep
  ) {
    throw new Error(
      "Engineering registry-expansion decision next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceSkillToolRegistryExpansionDecision(
  input:
    CreateEngineeringAIWorkforceSkillToolRegistryExpansionDecisionInput,
): EngineeringAIWorkforceSkillToolRegistryExpansionDecision {
  const source =
    input.registryExpansionPreparation;

  validateEngineeringAIWorkforceSkillToolRegistryExpansionPreparation(
    source,
  );

  requireIdentifier(
    "Engineering registry-expansion decision ID",
    input.decisionId,
  );

  requireReason(
    input.reason,
  );

  requireTimestamp(
    "Engineering registry-expansion decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
    ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the Engineering registry-expansion decision.",
    );
  }

  if (
    source.preparationId !==
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
        .preparationId ||
    source.preparationDigest !==
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
        .preparationDigest ||
    source.nextStep !==
      "AWAIT_OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION" ||
    source.ownerRegistryExpansionDecisionRequired !==
      true ||
    source.ownerRegistryExpansionDecisionRecorded !==
      false ||
    source.authorityBoundary
      .skillRegistryMutationAuthorized !==
      false ||
    source.authorityBoundary
      .toolRegistryMutationAuthorized !==
      false ||
    source.authorityBoundary
      .coreRegistryMutationPerformed !==
      false ||
    source.authorityBoundary
      .revenueGrowthReservationMutationPerformed !==
      false ||
    source.authorityBoundary
      .templateCreationAuthorized !==
      false ||
    source.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    source.authorityBoundary
      .productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Engineering registry-expansion preparation is not awaiting a valid owner decision.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Engineering registry-expansion decision cannot precede the preparation evidence.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION";

  const definitionMutationEligibility =
    source.proposedSkills.map(
      (skill, index) => {
        const tool =
          source.proposedTools[index];

        if (!tool) {
          throw new Error(
            "Engineering registry preparation contains an unmatched skill-tool definition.",
          );
        }

        return {
          expansionSequence:
            index + 1,
          skillId:
            skill.skillId,
          toolId:
            tool.toolId,
          toolCapability:
            tool.capability,
          skillRegistryMutationAuthorized:
            approved,
          toolRegistryMutationAuthorized:
            approved,
          registryMutationPerformed:
            false as const,
          definitionActivated:
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

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourcePreparationId:
      source.preparationId,
    sourcePreparationDigest:
      source.preparationDigest,
    sourceApprovalDecisionId:
      source.sourceApprovalDecisionId,
    sourceApprovalDecisionDigest:
      source.sourceApprovalDecisionDigest,
    sourcePlanningId:
      source.sourcePlanningId,
    sourcePlanningDigest:
      source.sourcePlanningDigest,
    sourceRevenueGrowthPreparationId:
      source.sourceRevenueGrowthPreparationId,
    sourceRevenueGrowthPreparationDigest:
      source.sourceRevenueGrowthPreparationDigest,
    sourceRegistryVersion:
      source.sourceRegistryVersion,
    sourcePreviewRegistryDigest:
      source.previewRegistryDigest,
    decision:
      input.decision,
    registryExpansionApproved:
      approved,
    registryMutationExecutionAuthorized:
      approved,
    reason:
      input.reason,
    reviewedPreparation: {
      preparationState:
        source.preparationState,
      currentCoreSkillCount:
        source.currentCoreSkillCount,
      currentCoreToolCount:
        source.currentCoreToolCount,
      reservedRevenueGrowthSkillCount:
        source.reservedRevenueGrowthSkillCount,
      reservedRevenueGrowthToolCount:
        source.reservedRevenueGrowthToolCount,
      proposedEngineeringSkillCount:
        source.proposedEngineeringSkillCount,
      proposedEngineeringToolCount:
        source.proposedEngineeringToolCount,
      targetCombinedSkillCount:
        source.targetCombinedSkillCount,
      targetCombinedToolCount:
        source.targetCombinedToolCount,
      coreSkillCollisionCount:
        source.collisionCheck
          .coreSkillCollisionCount,
      coreToolCollisionCount:
        source.collisionCheck
          .coreToolCollisionCount,
      revenueGrowthSkillCollisionCount:
        source.collisionCheck
          .revenueGrowthSkillCollisionCount,
      revenueGrowthToolCollisionCount:
        source.collisionCheck
          .revenueGrowthToolCollisionCount,
      proposedSkillDuplicateCount:
        source.collisionCheck
          .proposedSkillDuplicateCount,
      proposedToolDuplicateCount:
        source.collisionCheck
          .proposedToolDuplicateCount,
      safeForRegistryDecisionReview:
        source.collisionCheck
          .safeForRegistryDecisionReview,
      allToolsDraftOnly:
        source.safetyStandard
          .allToolsDraftOnly,
      allToolsMediumRisk:
        source.safetyStandard
          .allToolsMediumRisk,
      allToolsNonExternal:
        source.safetyStandard
          .allToolsNonExternal,
      allToolsTenantScoped:
        source.safetyStandard
          .allToolsTenantScoped,
      allToolsAudited:
        source.safetyStandard
          .allToolsAudited,
      repositoryAuthorityNotGranted:
        source.safetyStandard
          .repositoryAuthorityNotGranted,
      sourceNextStep:
        source.nextStep,
    },
    definitionMutationEligibility,
    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourcePreparationBound:
        true as const,
      sourceRevenueGrowthReservationBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      skillRegistryMutationAuthorized:
        approved,
      toolRegistryMutationAuthorized:
        approved,
      registryMutationExecutionAuthorized:
        approved,
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
      approved
        ? "APPLY_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION" as const
        : "RETAIN_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceSkillToolRegistryExpansionDecision;

  validateEngineeringAIWorkforceSkillToolRegistryExpansionDecision(
    decision,
  );

  return decision;
}
