import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation,
} from "./autonomousGlobalGrowthSkillToolRegistryExpansionPreparation";

export const AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISIONS = [
  "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_V1",
  "REJECT_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_V1",
] as const;

export type AutonomousGlobalGrowthSkillToolRegistryExpansionDecisionType =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISIONS)[number];

const preparation =
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

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

export function createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision(
  input: Readonly<{
    sourcePreparation: typeof preparation;
    decisionId: string;
    ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
    decision: AutonomousGlobalGrowthSkillToolRegistryExpansionDecisionType;
    reason: string;
    decidedAt: string;
  }>,
) {
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation(
    input.sourcePreparation,
  );

  if (input.sourcePreparation !== preparation) {
    throw new Error(
      "Only the canonical Global Growth registry-expansion preparation is allowed.",
    );
  }

  if (input.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID) {
    throw new Error(
      "Only the verified NEXUS owner may decide this registry expansion.",
    );
  }

  if (
    Number.isNaN(Date.parse(input.decidedAt)) ||
    new Date(input.decidedAt).toISOString() !== input.decidedAt ||
    Date.parse(input.decidedAt) < Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Global Growth registry-expansion decision time is invalid.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_V1";

  const core = {
    version:
      "nexus-autonomous-global-growth-skill-tool-registry-expansion-owner-decision-v1" as const,
    decisionId:
      input.decisionId,
    ownerId:
      input.ownerId,
    sourcePreparationId:
      preparation.preparationId,
    sourcePreparationDigest:
      preparation.preparationDigest,
    sourceRegistryDigest:
      preparation.sourceRegistryDigest,
    previewRegistryDigest:
      preparation.previewRegistryDigest,
    decision:
      input.decision,
    reason:
      input.reason,
    registryExpansionApproved:
      approved,
    reviewedSkillCount:
      preparation.proposedSkillCount,
    reviewedToolCount:
      preparation.proposedToolCount,
    definitionMutationEligibility:
      preparation.proposedSkills.map((skill, index) => ({
        sequence:
          index + 1,
        skillId:
          skill.skillId,
        toolId:
          preparation.proposedTools[index].toolId,
        skillRegistryMutationAuthorized:
          approved,
        toolRegistryMutationAuthorized:
          approved,
        templateCreationAuthorized:
          false as const,
        qualificationExecutionAuthorized:
          false as const,
        employeeActivationAuthorized:
          false as const,
        runtimeAuthorized:
          false as const,
        externalActionAuthorized:
          false as const,
      })),
    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourcePreparationBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      skillRegistryMutationAuthorized:
        approved,
      toolRegistryMutationAuthorized:
        approved,
      appendOnlyRegistryExpansionRequired:
        true as const,
      existingRegistryPreservationRequired:
        true as const,
      collisionFreeDefinitionsRequired:
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
      employeeActivationAuthorized:
        false as const,
      runtimeAuthorized:
        false as const,
      realCredentialAccessAuthorized:
        false as const,
      liveConnectorActivationAuthorized:
        false as const,
      contentDraftingAuthorityGranted:
        false as const,
      videoGenerationExecutionAuthorized:
        false as const,
      publicPublishingAuthorized:
        false as const,
      customerMessagingAuthorized:
        false as const,
      leadContactAuthorized:
        false as const,
      demoBookingExecutionAuthorized:
        false as const,
      paidAdvertisingAuthorized:
        false as const,
      productionExecutionAuthorized:
        false as const,
      autonomousExternalActionAuthorized:
        false as const,
      blockedMetaAccountUseAuthorized:
        false as const,
      blockedMetaAccountBypassAuthorized:
        false as const,
      levelThreeAuthorityGranted:
        false as const,
      founderLiberationAchieved:
        false as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    nextStep: approved
      ? "EXECUTE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_V1"
      : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_REGISTRY_EXPANSION_PREPARATION_ONLY",
    decidedAt:
      input.decidedAt,
  };

  return deepFreeze({
    ...core,
    decisionDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthSkillToolRegistryExpansionDecision =
  ReturnType<
    typeof createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision
  >;

export function validateAutonomousGlobalGrowthSkillToolRegistryExpansionDecision(
  record: AutonomousGlobalGrowthSkillToolRegistryExpansionDecision,
): void {
  const approved =
    record.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_V1";

  const unsignedRecord = Object.fromEntries(
    Object.entries(record).filter(
      ([key]) => key !== "decisionDigest",
    ),
  );

  if (
    record.sourcePreparationId !== preparation.preparationId ||
    record.sourcePreparationDigest !== preparation.preparationDigest ||
    record.sourceRegistryDigest !== preparation.sourceRegistryDigest ||
    record.previewRegistryDigest !== preparation.previewRegistryDigest ||
    record.registryExpansionApproved !== approved ||
    record.reviewedSkillCount !== 9 ||
    record.reviewedToolCount !== 9 ||
    record.definitionMutationEligibility.length !== 9 ||
    record.definitionMutationEligibility.some(
      (definition) =>
        definition.skillRegistryMutationAuthorized !== approved ||
        definition.toolRegistryMutationAuthorized !== approved ||
        definition.templateCreationAuthorized !== false ||
        definition.qualificationExecutionAuthorized !== false ||
        definition.employeeActivationAuthorized !== false ||
        definition.runtimeAuthorized !== false ||
        definition.externalActionAuthorized !== false,
    ) ||
    record.authorityBoundary.skillRegistryMutationAuthorized !== approved ||
    record.authorityBoundary.toolRegistryMutationAuthorized !== approved ||
    record.authorityBoundary.appendOnlyRegistryExpansionRequired !== true ||
    record.authorityBoundary.existingRegistryPreservationRequired !== true ||
    record.authorityBoundary.collisionFreeDefinitionsRequired !== true ||
    record.authorityBoundary.templateCreationAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    record.decisionDigest !== sha256(unsignedRecord) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.definitionMutationEligibility) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth skill/tool registry-expansion decision is invalid.",
    );
  }
}