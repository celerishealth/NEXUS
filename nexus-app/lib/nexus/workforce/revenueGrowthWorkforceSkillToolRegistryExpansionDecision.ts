import { createHash } from "node:crypto";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "./revenueGrowthWorkforceExpansionDecision";

import {
  SKILL_TOOL_REGISTRY_VERSION,
} from "./skillToolRegistry";

import {
  validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation,
  type RevenueGrowthWorkforceSkillToolRegistryExpansionPreparation,
} from "./revenueGrowthWorkforceSkillToolRegistryExpansionPreparation";

export const REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_VERSION =
  "nexus-revenue-growth-workforce-skill-tool-registry-expansion-decision-v1" as const;

export const REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISIONS = [
  "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
  "REJECT_AND_RETAIN_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY",
] as const;

export type RevenueGrowthWorkforceSkillToolRegistryExpansionDecisionType =
  (
    typeof REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISIONS
  )[number];

export interface CreateRevenueGrowthWorkforceSkillToolRegistryExpansionDecisionInput {
  readonly registryExpansionPreparation:
    RevenueGrowthWorkforceSkillToolRegistryExpansionPreparation;
  readonly decisionId: string;
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly decision:
    RevenueGrowthWorkforceSkillToolRegistryExpansionDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface RevenueGrowthRegistryDefinitionMutationEligibility {
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
  readonly definitionActivated: false;
  readonly templatePreparationAuthorized:
    false;
  readonly templateCreationAuthorized:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly activationAuthorized: false;
  readonly runtimeAuthorized: false;
}

export interface RevenueGrowthWorkforceSkillToolRegistryExpansionDecision {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_RECORDED";
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly sourcePreparationId: string;
  readonly sourcePreparationDigest: string;
  readonly sourceApprovalDecisionId:
    string;
  readonly sourceApprovalDecisionDigest:
    string;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceRegistryVersion:
    typeof SKILL_TOOL_REGISTRY_VERSION;
  readonly sourcePreviewRegistryDigest:
    string;
  readonly decision:
    RevenueGrowthWorkforceSkillToolRegistryExpansionDecisionType;
  readonly registryExpansionApproved:
    boolean;
  readonly registryMutationExecutionAuthorized:
    boolean;
  readonly reason: string;
  readonly reviewedPreparation: Readonly<{
    preparationState:
      "OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED";
    currentSkillCount: number;
    currentToolCount: number;
    proposedSkillCount: 9;
    proposedToolCount: 9;
    targetSkillCount: number;
    targetToolCount: number;
    existingSkillCollisionCount: 0;
    existingToolCollisionCount: 0;
    proposedSkillDuplicateCount: 0;
    proposedToolDuplicateCount: 0;
    safeForRegistryDecisionReview:
      true;
    allToolsDraftOnly: true;
    allToolsMediumRisk: true;
    allToolsNonExternal: true;
    allToolsTenantScoped: true;
    allToolsAudited: true;
    sourceNextStep:
      "AWAIT_OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION";
  }>;
  readonly definitionMutationEligibility:
    readonly RevenueGrowthRegistryDefinitionMutationEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourcePreparationBound: true;
    approvalBypassAllowed: false;
    skillRegistryMutationAuthorized:
      boolean;
    toolRegistryMutationAuthorized:
      boolean;
    registryMutationExecutionAuthorized:
      boolean;
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
    | "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION"
    | "RETAIN_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY";
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
        "Unsupported deterministic registry-expansion decision value.",
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
      "Registry-expansion decision reason must contain 10 to 1000 trimmed characters.",
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

export function validateRevenueGrowthWorkforceSkillToolRegistryExpansionDecision(
  record:
    RevenueGrowthWorkforceSkillToolRegistryExpansionDecision,
): void {
  const {
    decisionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Registry-expansion decision digest",
    decisionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    decisionDigest
  ) {
    throw new Error(
      "Registry-expansion decision digest verification failed.",
    );
  }

  requireIdentifier(
    "Registry-expansion decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Source registry-expansion preparation ID",
    record.sourcePreparationId,
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
    "Source preparation digest",
    record.sourcePreparationDigest,
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
    "Source preview registry digest",
    record.sourcePreviewRegistryDigest,
  );

  requireReason(
    record.reason,
  );

  requireTimestamp(
    "Registry-expansion decision time",
    record.decidedAt,
  );

  const approved =
    record.decision ===
    "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION";

  if (
    record.version !==
      REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_RECORDED" ||
    record.ownerId !==
      REVENUE_GROWTH_WORKFORCE_OWNER_ID ||
    record.sourceRegistryVersion !==
      SKILL_TOOL_REGISTRY_VERSION ||
    !REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISIONS.includes(
      record.decision,
    ) ||
    record.registryExpansionApproved !==
      approved ||
    record.registryMutationExecutionAuthorized !==
      approved ||
    record.definitionMutationEligibility.length !==
      9
  ) {
    throw new Error(
      "Registry-expansion decision identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedPreparation;

  if (
    reviewed.preparationState !==
      "OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED" ||
    reviewed.proposedSkillCount !==
      9 ||
    reviewed.proposedToolCount !==
      9 ||
    reviewed.targetSkillCount !==
      reviewed.currentSkillCount +
        reviewed.proposedSkillCount ||
    reviewed.targetToolCount !==
      reviewed.currentToolCount +
        reviewed.proposedToolCount ||
    reviewed.existingSkillCollisionCount !==
      0 ||
    reviewed.existingToolCollisionCount !==
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
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION"
  ) {
    throw new Error(
      "Reviewed registry-expansion preparation evidence is invalid.",
    );
  }

  record.definitionMutationEligibility.forEach(
    (definition, index) => {
      if (
        definition.expansionSequence !==
          index + 1 ||
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
        definition.qualificationExecutionAuthorized !==
          false ||
        definition.activationAuthorized !==
          false ||
        definition.runtimeAuthorized !==
          false
      ) {
        throw new Error(
          "Registry definition mutation eligibility is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Decision skill IDs",
    record.definitionMutationEligibility.map(
      (definition) =>
        definition.skillId,
    ),
  );

  requireUnique(
    "Decision tool IDs",
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
      "Registry-expansion decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION"
      : "RETAIN_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY";

  if (
    record.nextStep !==
    expectedNextStep
  ) {
    throw new Error(
      "Registry-expansion decision next step is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceSkillToolRegistryExpansionDecision(
  input:
    CreateRevenueGrowthWorkforceSkillToolRegistryExpansionDecisionInput,
): RevenueGrowthWorkforceSkillToolRegistryExpansionDecision {
  const source =
    input.registryExpansionPreparation;

  validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation(
    source,
  );

  requireIdentifier(
    "Registry-expansion decision ID",
    input.decisionId,
  );

  requireReason(
    input.reason,
  );

  requireTimestamp(
    "Registry-expansion decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
    REVENUE_GROWTH_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the Revenue Growth skill/tool registry-expansion decision.",
    );
  }

  if (
    source.nextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION" ||
    source.proposedSkillCount !==
      9 ||
    source.proposedToolCount !==
      9 ||
    source.ownerRegistryExpansionDecisionRequired !==
      true ||
    source.ownerRegistryExpansionDecisionRecorded !==
      false ||
    source.collisionCheck
      .safeForRegistryDecisionReview !==
      true ||
    source.authorityBoundary
      .skillRegistryMutationAuthorized !==
      false ||
    source.authorityBoundary
      .toolRegistryMutationAuthorized !==
      false ||
    source.authorityBoundary
      .coreRegistryMutationPerformed !==
      false
  ) {
    throw new Error(
      "Revenue Growth registry-expansion preparation is not awaiting a valid owner decision.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Registry-expansion decision cannot precede the source preparation.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION";

  const decisionCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION_RECORDED" as const,
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
      currentSkillCount:
        source.currentSkillCount,
      currentToolCount:
        source.currentToolCount,
      proposedSkillCount:
        source.proposedSkillCount,
      proposedToolCount:
        source.proposedToolCount,
      targetSkillCount:
        source.targetSkillCount,
      targetToolCount:
        source.targetToolCount,
      existingSkillCollisionCount:
        source.collisionCheck
          .existingSkillCollisionCount,
      existingToolCollisionCount:
        source.collisionCheck
          .existingToolCollisionCount,
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
      sourceNextStep:
        source.nextStep,
    },
    definitionMutationEligibility:
      source.proposedSkills.map(
        (skill, index) => {
          const tool =
            source.proposedTools[index];

          if (!tool) {
            throw new Error(
              "Registry-expansion skill/tool definition pairing is incomplete.",
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
            qualificationExecutionAuthorized:
              false as const,
            activationAuthorized:
              false as const,
            runtimeAuthorized:
              false as const,
          };
        },
      ),
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
      registryMutationExecutionAuthorized:
        approved,
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
      approved
        ? "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION" as const
        : "RETAIN_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as RevenueGrowthWorkforceSkillToolRegistryExpansionDecision;

  validateRevenueGrowthWorkforceSkillToolRegistryExpansionDecision(
    decision,
  );

  return decision;
}
