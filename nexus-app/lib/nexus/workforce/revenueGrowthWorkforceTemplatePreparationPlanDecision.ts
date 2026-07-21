import { createHash } from "node:crypto";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "./revenueGrowthWorkforceExpansionDecision";

import {
  validateRevenueGrowthWorkforceTemplatePreparationPlan,
  type RevenueGrowthWorkforceTemplatePreparationPlan,
} from "./revenueGrowthWorkforceTemplatePreparationPlan";

export const REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISION_VERSION =
  "nexus-revenue-growth-workforce-template-preparation-plan-decision-v1" as const;

export const REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISIONS = [
  "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
  "REJECT_AND_RETAIN_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNING_ONLY",
] as const;

export type RevenueGrowthWorkforceTemplatePreparationPlanDecisionType =
  (
    typeof REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISIONS
  )[number];

export interface CreateRevenueGrowthWorkforceTemplatePreparationPlanDecisionInput {
  readonly templatePreparationPlan:
    RevenueGrowthWorkforceTemplatePreparationPlan;
  readonly decisionId: string;
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly decision:
    RevenueGrowthWorkforceTemplatePreparationPlanDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface RevenueGrowthTemplateRegistryExpansionEligibility {
  readonly preparationSequence: number;
  readonly templateId: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    "SALES" | "MARKETING";
  readonly proposedLaunchSequence: number;
  readonly capability: string;
  readonly requiredSkillIds:
    readonly string[];
  readonly requiredToolIds:
    readonly string[];
  readonly sourceLifecycleState:
    "PLANNED_CANDIDATE";
  readonly registryExpansionPreparationEligible:
    boolean;
  readonly skillRegistryMutationAuthorized:
    false;
  readonly toolRegistryMutationAuthorized:
    false;
  readonly templatePreparationAuthorized:
    false;
  readonly templateCreated: false;
  readonly factoryLifecycleTransitionAuthorized:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly activationAuthorized: false;
  readonly runtimeAuthorized: false;
}

export interface RevenueGrowthWorkforceTemplatePreparationPlanDecision {
  readonly version:
    typeof REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION_RECORDED";
  readonly ownerId:
    typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceFactoryAdmissionExecutionId:
    string;
  readonly sourceFactoryAdmissionExecutionDigest:
    string;
  readonly decision:
    RevenueGrowthWorkforceTemplatePreparationPlanDecisionType;
  readonly templatePreparationPlanApproved:
    boolean;
  readonly registryExpansionPreparationEligible:
    boolean;
  readonly reason: string;
  readonly reviewedPlan: Readonly<{
    planningState:
      "OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNED";
    proposedTemplateCount: 9;
    proposedLaunchSequences:
      readonly number[];
    newRoleSkillCountRequired: 9;
    newRoleToolCountRequired: 9;
    directTemplateCreationBlockedUntilRegistryExpansion:
      true;
    sourceNextStep:
      "AWAIT_OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION";
    transparentAIIdentityRequired:
      true;
    humanImpersonationAuthorized:
      false;
  }>;
  readonly candidateRegistryExpansionEligibility:
    readonly RevenueGrowthTemplateRegistryExpansionEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourcePlanningBound: true;
    approvalBypassAllowed: false;
    skillRegistryExpansionPreparationAuthorized:
      boolean;
    toolRegistryExpansionPreparationAuthorized:
      boolean;
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
    | "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION"
    | "RETAIN_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNING_ONLY";
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
        "Unsupported deterministic template-preparation decision value.",
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
      "Template-preparation plan decision reason must contain 10 to 1000 trimmed characters.",
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

export function validateRevenueGrowthWorkforceTemplatePreparationPlanDecision(
  record:
    RevenueGrowthWorkforceTemplatePreparationPlanDecision,
): void {
  const {
    decisionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Template-preparation plan decision digest",
    decisionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    decisionDigest
  ) {
    throw new Error(
      "Template-preparation plan decision digest verification failed.",
    );
  }

  requireIdentifier(
    "Template-preparation plan decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Template-preparation source planning ID",
    record.sourcePlanningId,
  );

  requireIdentifier(
    "Source factory-admission execution ID",
    record.sourceFactoryAdmissionExecutionId,
  );

  requireDigest(
    "Template-preparation source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Source factory-admission execution digest",
    record.sourceFactoryAdmissionExecutionDigest,
  );

  requireReason(
    record.reason,
  );

  requireTimestamp(
    "Template-preparation plan decision time",
    record.decidedAt,
  );

  const approved =
    record.decision ===
    "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN";

  if (
    record.version !==
      REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION_RECORDED" ||
    record.ownerId !==
      REVENUE_GROWTH_WORKFORCE_OWNER_ID ||
    !REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISIONS.includes(
      record.decision,
    ) ||
    record.templatePreparationPlanApproved !==
      approved ||
    record.registryExpansionPreparationEligible !==
      approved ||
    record.candidateRegistryExpansionEligibility.length !==
      9
  ) {
    throw new Error(
      "Template-preparation plan decision identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedPlan;

  if (
    reviewed.planningState !==
      "OWNER_CONTROLLED_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNED" ||
    reviewed.proposedTemplateCount !==
      9 ||
    reviewed.proposedLaunchSequences.length !==
      9 ||
    reviewed.newRoleSkillCountRequired !==
      9 ||
    reviewed.newRoleToolCountRequired !==
      9 ||
    reviewed.directTemplateCreationBlockedUntilRegistryExpansion !==
      true ||
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION" ||
    reviewed.transparentAIIdentityRequired !==
      true ||
    reviewed.humanImpersonationAuthorized !==
      false
  ) {
    throw new Error(
      "Reviewed template-preparation plan evidence is invalid.",
    );
  }

  requireUnique(
    "Reviewed launch sequences",
    reviewed.proposedLaunchSequences,
  );

  record.candidateRegistryExpansionEligibility.forEach(
    (candidate, index) => {
      if (
        candidate.preparationSequence !==
          index + 1 ||
        candidate.registryExpansionPreparationEligible !==
          approved ||
        candidate.sourceLifecycleState !==
          "PLANNED_CANDIDATE" ||
        candidate.requiredSkillIds.length !==
          2 ||
        candidate.requiredToolIds.length !==
          1 ||
        candidate.skillRegistryMutationAuthorized !==
          false ||
        candidate.toolRegistryMutationAuthorized !==
          false ||
        candidate.templatePreparationAuthorized !==
          false ||
        candidate.templateCreated !==
          false ||
        candidate.factoryLifecycleTransitionAuthorized !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.activationAuthorized !==
          false ||
        candidate.runtimeAuthorized !==
          false
      ) {
        throw new Error(
          "Template-preparation candidate decision binding is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Decision template IDs",
    record.candidateRegistryExpansionEligibility.map(
      (candidate) =>
        candidate.templateId,
    ),
  );

  requireUnique(
    "Decision employee IDs",
    record.candidateRegistryExpansionEligibility.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Decision employee codes",
    record.candidateRegistryExpansionEligibility.map(
      (candidate) =>
        candidate.employeeCode,
    ),
  );

  requireUnique(
    "Decision launch sequences",
    record.candidateRegistryExpansionEligibility.map(
      (candidate) =>
        candidate.proposedLaunchSequence,
    ),
  );

  const boundary =
    record.authorityBoundary;

  if (
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.sourcePlanningBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.skillRegistryExpansionPreparationAuthorized !==
      approved ||
    boundary.toolRegistryExpansionPreparationAuthorized !==
      approved ||
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
      "Template-preparation plan decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION"
      : "RETAIN_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNING_ONLY";

  if (
    record.nextStep !==
    expectedNextStep
  ) {
    throw new Error(
      "Template-preparation plan decision next step is invalid.",
    );
  }
}

export function createRevenueGrowthWorkforceTemplatePreparationPlanDecision(
  input:
    CreateRevenueGrowthWorkforceTemplatePreparationPlanDecisionInput,
): RevenueGrowthWorkforceTemplatePreparationPlanDecision {
  const source =
    input.templatePreparationPlan;

  validateRevenueGrowthWorkforceTemplatePreparationPlan(
    source,
  );

  requireIdentifier(
    "Template-preparation plan decision ID",
    input.decisionId,
  );

  requireReason(
    input.reason,
  );

  requireTimestamp(
    "Template-preparation plan decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
    REVENUE_GROWTH_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the Revenue Growth template-preparation plan decision.",
    );
  }

  if (
    source.nextStep !==
      "AWAIT_OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION" ||
    source.proposedTemplateCount !==
      9 ||
    source.ownerTemplatePreparationPlanDecisionRequired !==
      true ||
    source.ownerTemplatePreparationPlanDecisionRecorded !==
      false ||
    source.authorityBoundary
      .skillRegistryMutationAuthorized !==
      false ||
    source.authorityBoundary
      .templateCreationAuthorized !==
      false
  ) {
    throw new Error(
      "Revenue Growth template-preparation plan is not awaiting a valid owner decision.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Template-preparation plan decision cannot precede the source plan.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN";

  const decisionCore = {
    version:
      REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourcePlanningId:
      source.planningId,
    sourcePlanningDigest:
      source.planningDigest,
    sourceFactoryAdmissionExecutionId:
      source.sourceFactoryAdmissionExecutionId,
    sourceFactoryAdmissionExecutionDigest:
      source.sourceFactoryAdmissionExecutionDigest,
    decision:
      input.decision,
    templatePreparationPlanApproved:
      approved,
    registryExpansionPreparationEligible:
      approved,
    reason:
      input.reason,
    reviewedPlan: {
      planningState:
        source.planningState,
      proposedTemplateCount:
        source.proposedTemplateCount,
      proposedLaunchSequences:
        source.proposedLaunchSequences,
      newRoleSkillCountRequired:
        source.registryGapSummary
          .newRoleSkillCountRequired,
      newRoleToolCountRequired:
        source.registryGapSummary
          .newRoleToolCountRequired,
      directTemplateCreationBlockedUntilRegistryExpansion:
        source.registryGapSummary
          .directTemplateCreationBlockedUntilRegistryExpansion,
      sourceNextStep:
        source.nextStep,
      transparentAIIdentityRequired:
        source.humanLikeEmployeeStandard
          .transparentAIIdentityRequired,
      humanImpersonationAuthorized:
        source.humanLikeEmployeeStandard
          .humanImpersonationAuthorized,
    },
    candidateRegistryExpansionEligibility:
      source.proposedTemplates.map(
        (candidate) => ({
          preparationSequence:
            candidate.preparationSequence,
          templateId:
            candidate.templateId,
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
          proposedLaunchSequence:
            candidate.proposedLaunchSequence,
          capability:
            candidate.capability,
          requiredSkillIds:
            candidate.requiredSkillIds,
          requiredToolIds:
            candidate.requiredToolIds,
          sourceLifecycleState:
            candidate.sourceLifecycleState,
          registryExpansionPreparationEligible:
            approved,
          skillRegistryMutationAuthorized:
            false as const,
          toolRegistryMutationAuthorized:
            false as const,
          templatePreparationAuthorized:
            false as const,
          templateCreated:
            false as const,
          factoryLifecycleTransitionAuthorized:
            false as const,
          qualificationExecutionAuthorized:
            false as const,
          activationAuthorized:
            false as const,
          runtimeAuthorized:
            false as const,
        }),
      ),
    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourcePlanningBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      skillRegistryExpansionPreparationAuthorized:
        approved,
      toolRegistryExpansionPreparationAuthorized:
        approved,
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
      approved
        ? "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION" as const
        : "RETAIN_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNING_ONLY" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as RevenueGrowthWorkforceTemplatePreparationPlanDecision;

  validateRevenueGrowthWorkforceTemplatePreparationPlanDecision(
    decision,
  );

  return decision;
}
