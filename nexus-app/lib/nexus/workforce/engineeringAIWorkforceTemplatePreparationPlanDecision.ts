import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  validateEngineeringAIWorkforceTemplatePreparationPlan,
  type EngineeringAIWorkforceTemplatePreparationPlan,
} from "./engineeringAIWorkforceTemplatePreparationPlan";

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISION_VERSION =
  "nexus-engineering-ai-workforce-template-preparation-plan-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISIONS = [
  "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
  "REJECT_AND_RETAIN_ENGINEERING_TEMPLATE_PREPARATION_PLANNING_ONLY",
] as const;

export type EngineeringAIWorkforceTemplatePreparationPlanDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceTemplatePreparationPlanDecisionInput {
  readonly templatePreparationPlan:
    EngineeringAIWorkforceTemplatePreparationPlan;
  readonly decisionId: string;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    EngineeringAIWorkforceTemplatePreparationPlanDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringTemplateRegistryExpansionEligibility {
  readonly preparationSequence: number;
  readonly templateId: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    "ENGINEERING_DATA_SECURITY";
  readonly proposedLaunchSequence:
    number;
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

export interface EngineeringAIWorkforceTemplatePreparationPlanDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION_RECORDED";
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceDevelopmentPlanningId:
    string;
  readonly sourceDevelopmentPlanningDigest:
    string;
  readonly sourceDevelopmentPlanApprovalDecisionId:
    string;
  readonly sourceDevelopmentPlanApprovalDecisionDigest:
    string;
  readonly sourceFactoryDigest: string;
  readonly sourceRevenueGrowthTemplatePlanningDigest:
    string;
  readonly decision:
    EngineeringAIWorkforceTemplatePreparationPlanDecisionType;
  readonly templatePreparationPlanApproved:
    boolean;
  readonly registryExpansionPreparationEligible:
    boolean;
  readonly reason: string;
  readonly reviewedPlan: Readonly<{
    planningState:
      "OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLANNED";
    proposedTemplateCount: 8;
    proposedLaunchSequences:
      readonly number[];
    sourceReservedRevenueGrowthLaunchSequences:
      readonly number[];
    newRoleSkillCountRequired: 8;
    newRoleToolCountRequired: 8;
    directTemplateCreationBlockedUntilRegistryExpansion:
      true;
    revenueGrowthRegistryCollisionBlocked:
      true;
    founderReleaseAchieved: false;
    ownerRetainsMergeAuthority:
      true;
    ownerRetainsProductionDeploymentAuthority:
      true;
    sourceNextStep:
      "AWAIT_OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION";
    transparentAIIdentityRequired:
      true;
    humanImpersonationAuthorized:
      false;
  }>;
  readonly candidateRegistryExpansionEligibility:
    readonly EngineeringTemplateRegistryExpansionEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourcePlanningBound: true;
    sourceDevelopmentApprovalBound:
      true;
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
    | "PREPARE_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION"
    | "RETAIN_ENGINEERING_TEMPLATE_PREPARATION_PLANNING_ONLY";
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
        "Unsupported deterministic Engineering template-preparation decision value.",
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
      "Engineering template-preparation plan decision reason must contain 10 to 1000 trimmed characters.",
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

export function validateEngineeringAIWorkforceTemplatePreparationPlanDecision(
  record:
    EngineeringAIWorkforceTemplatePreparationPlanDecision,
): void {
  const {
    decisionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Engineering template-preparation plan decision digest",
    decisionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    decisionDigest
  ) {
    throw new Error(
      "Engineering template-preparation plan decision digest verification failed.",
    );
  }

  requireIdentifier(
    "Engineering template-preparation plan decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering template-preparation source planning ID",
    record.sourcePlanningId,
  );

  requireIdentifier(
    "Engineering source development planning ID",
    record.sourceDevelopmentPlanningId,
  );

  requireIdentifier(
    "Engineering source development-plan approval decision ID",
    record.sourceDevelopmentPlanApprovalDecisionId,
  );

  requireDigest(
    "Engineering template-preparation source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Engineering source development planning digest",
    record.sourceDevelopmentPlanningDigest,
  );

  requireDigest(
    "Engineering source development-plan approval decision digest",
    record.sourceDevelopmentPlanApprovalDecisionDigest,
  );

  requireDigest(
    "Engineering source factory digest",
    record.sourceFactoryDigest,
  );

  requireDigest(
    "Revenue Growth template-planning digest",
    record.sourceRevenueGrowthTemplatePlanningDigest,
  );

  requireReason(
    record.reason,
  );

  requireTimestamp(
    "Engineering template-preparation plan decision time",
    record.decidedAt,
  );

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION_RECORDED" ||
    record.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    !ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISIONS.includes(
      record.decision,
    ) ||
    record.templatePreparationPlanApproved !==
      approved ||
    record.registryExpansionPreparationEligible !==
      approved ||
    record.candidateRegistryExpansionEligibility.length !==
      8
  ) {
    throw new Error(
      "Engineering template-preparation plan decision identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedPlan;

  if (
    reviewed.planningState !==
      "OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLANNED" ||
    reviewed.proposedTemplateCount !==
      8 ||
    reviewed.proposedLaunchSequences.length !==
      8 ||
    reviewed.sourceReservedRevenueGrowthLaunchSequences.length !==
      9 ||
    reviewed.newRoleSkillCountRequired !==
      8 ||
    reviewed.newRoleToolCountRequired !==
      8 ||
    reviewed.directTemplateCreationBlockedUntilRegistryExpansion !==
      true ||
    reviewed.revenueGrowthRegistryCollisionBlocked !==
      true ||
    reviewed.founderReleaseAchieved !==
      false ||
    reviewed.ownerRetainsMergeAuthority !==
      true ||
    reviewed.ownerRetainsProductionDeploymentAuthority !==
      true ||
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION" ||
    reviewed.transparentAIIdentityRequired !==
      true ||
    reviewed.humanImpersonationAuthorized !==
      false
  ) {
    throw new Error(
      "Reviewed Engineering template-preparation plan evidence is invalid.",
    );
  }

  requireUnique(
    "Reviewed Engineering launch sequences",
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
        candidate.qualificationAdmissionAuthorized !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.activationAuthorized !==
          false ||
        candidate.runtimeAuthorized !==
          false ||
        candidate.repositoryReadAuthorized !==
          false ||
        candidate.repositoryWriteAuthorized !==
          false ||
        candidate.branchCreationAuthorized !==
          false ||
        candidate.pullRequestPreparationAuthorized !==
          false ||
        candidate.mergeAuthorized !==
          false ||
        candidate.productionDeploymentAuthorized !==
          false ||
        candidate.secretsAccessAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering template candidate decision binding is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Engineering decision template IDs",
    record.candidateRegistryExpansionEligibility.map(
      (candidate) =>
        candidate.templateId,
    ),
  );

  requireUnique(
    "Engineering decision employee IDs",
    record.candidateRegistryExpansionEligibility.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Engineering decision employee codes",
    record.candidateRegistryExpansionEligibility.map(
      (candidate) =>
        candidate.employeeCode,
    ),
  );

  requireUnique(
    "Engineering decision launch sequences",
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
    boundary.sourceDevelopmentApprovalBound !==
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
      "Engineering template-preparation plan decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION"
      : "RETAIN_ENGINEERING_TEMPLATE_PREPARATION_PLANNING_ONLY";

  if (
    record.nextStep !==
    expectedNextStep
  ) {
    throw new Error(
      "Engineering template-preparation plan decision next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceTemplatePreparationPlanDecision(
  input:
    CreateEngineeringAIWorkforceTemplatePreparationPlanDecisionInput,
): EngineeringAIWorkforceTemplatePreparationPlanDecision {
  const source =
    input.templatePreparationPlan;

  validateEngineeringAIWorkforceTemplatePreparationPlan(
    source,
  );

  requireIdentifier(
    "Engineering template-preparation plan decision ID",
    input.decisionId,
  );

  requireReason(
    input.reason,
  );

  requireTimestamp(
    "Engineering template-preparation plan decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
    ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the Engineering template-preparation plan decision.",
    );
  }

  if (
    source.nextStep !==
      "AWAIT_OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION" ||
    source.proposedTemplateCount !==
      8 ||
    source.ownerTemplatePreparationPlanDecisionRequired !==
      true ||
    source.ownerTemplatePreparationPlanDecisionRecorded !==
      false ||
    source.authorityBoundary
      .skillRegistryMutationAuthorized !==
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
      "Engineering template-preparation plan is not awaiting a valid owner decision.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Engineering template-preparation plan decision cannot precede the source plan.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourcePlanningId:
      source.planningId,
    sourcePlanningDigest:
      source.planningDigest,
    sourceDevelopmentPlanningId:
      source.sourceDevelopmentPlanningId,
    sourceDevelopmentPlanningDigest:
      source.sourceDevelopmentPlanningDigest,
    sourceDevelopmentPlanApprovalDecisionId:
      source.sourceApprovalDecisionId,
    sourceDevelopmentPlanApprovalDecisionDigest:
      source.sourceApprovalDecisionDigest,
    sourceFactoryDigest:
      source.sourceFactoryDigest,
    sourceRevenueGrowthTemplatePlanningDigest:
      source.sourceRevenueGrowthTemplatePlanningDigest,
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
      sourceReservedRevenueGrowthLaunchSequences:
        source.sourceReservedRevenueGrowthLaunchSequences,
      newRoleSkillCountRequired:
        source.registryGapSummary
          .newRoleSkillCountRequired,
      newRoleToolCountRequired:
        source.registryGapSummary
          .newRoleToolCountRequired,
      directTemplateCreationBlockedUntilRegistryExpansion:
        source.registryGapSummary
          .directTemplateCreationBlockedUntilRegistryExpansion,
      revenueGrowthRegistryCollisionBlocked:
        source.registryGapSummary
          .revenueGrowthRegistryCollisionBlocked,
      founderReleaseAchieved:
        source.founderLiberationObjective
          .founderReleaseAchieved,
      ownerRetainsMergeAuthority:
        source.founderLiberationObjective
          .ownerRetainsMergeAuthority,
      ownerRetainsProductionDeploymentAuthority:
        source.founderLiberationObjective
          .ownerRetainsProductionDeploymentAuthority,
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
        }),
      ),
    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourcePlanningBound:
        true as const,
      sourceDevelopmentApprovalBound:
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
        ? "PREPARE_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION" as const
        : "RETAIN_ENGINEERING_TEMPLATE_PREPARATION_PLANNING_ONLY" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceTemplatePreparationPlanDecision;

  validateEngineeringAIWorkforceTemplatePreparationPlanDecision(
    decision,
  );

  return decision;
}
