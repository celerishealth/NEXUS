import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
  validateEngineeringAIWorkforceTemplatePreparationPlan,
  type EngineeringAIWorkforceTemplatePreparationPlan,
} from "./engineeringAIWorkforceTemplatePreparationPlan";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
  validateEngineeringAIWorkforceSkillToolRegistryExpansionExecution,
  type EngineeringAIWorkforceSkillToolRegistryExpansionExecution,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionExecution";

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-template-creation-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_DECISIONS = [
  "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION",
  "REJECT_AND_RETAIN_ENGINEERING_TEMPLATE_CREATION_BLOCKED",
] as const;

export type EngineeringAIWorkforceTemplateCreationDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceTemplateCreationDecisionInput {
  readonly templatePreparationPlan:
    EngineeringAIWorkforceTemplatePreparationPlan;
  readonly registryExpansionExecution:
    EngineeringAIWorkforceSkillToolRegistryExpansionExecution;
  readonly decisionId: string;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    EngineeringAIWorkforceTemplateCreationDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringTemplateCreationEligibility {
  readonly preparationSequence: number;
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
  readonly capability: string;
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
  readonly registryRequirementsSatisfied:
    boolean;
  readonly templateCreationAuthorized:
    boolean;
  readonly templateCreated: false;
  readonly factoryLifecycleTransitionAuthorized:
    false;
  readonly factoryLifecycleTransitionExecuted:
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

export interface EngineeringAIWorkforceTemplateCreationDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_TEMPLATE_CREATION_DECISION_RECORDED";
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceRegistryExecutionId:
    string;
  readonly sourceRegistryExecutionDigest:
    string;
  readonly sourceExpandedRegistryDigest:
    string;
  readonly decision:
    EngineeringAIWorkforceTemplateCreationDecisionType;
  readonly templateCreationApproved:
    boolean;
  readonly templateCreationExecutionAuthorized:
    boolean;
  readonly reason: string;
  readonly reviewedEvidence: Readonly<{
    proposedTemplateCount: 8;
    proposedLaunchSequences:
      readonly number[];
    registeredEngineeringSkillCount:
      8;
    registeredEngineeringToolCount:
      8;
    registryRequirementsSatisfied:
      true;
    sourceRegistryApplicationExecuted:
      true;
    sourceTemplateCreationAuthorized:
      false;
    transparentAIIdentityRequired:
      true;
    humanImpersonationAuthorized:
      false;
    founderReleaseAchieved: false;
    ownerRetainsMergeAuthority:
      true;
    ownerRetainsProductionDeploymentAuthority:
      true;
  }>;
  readonly candidateTemplateCreationEligibility:
    readonly EngineeringTemplateCreationEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourcePlanningBound: true;
    sourceRegistryExecutionBound:
      true;
    approvalBypassAllowed: false;
    exactEightTemplateCreationsRequired:
      true;
    templateCreationExecutionAuthorized:
      boolean;
    templateCreationPerformed:
      false;
    employeeTemplateRegistryMutationPerformed:
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
    | "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION"
    | "RETAIN_ENGINEERING_TEMPLATE_CREATION_BLOCKED";
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
        "Unsupported deterministic Engineering template-creation decision value.",
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

function requireReason(
  value: string,
): void {
  if (
    value !== value.trim() ||
    value.length < 20 ||
    value.length > 2000
  ) {
    throw new Error(
      "Engineering template-creation decision reason must contain 20 to 2000 canonical characters.",
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

export function validateEngineeringAIWorkforceTemplateCreationDecision(
  record:
    EngineeringAIWorkforceTemplateCreationDecision,
): void {
  const {
    decisionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Engineering template-creation decision digest",
    decisionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    decisionDigest
  ) {
    throw new Error(
      "Engineering template-creation decision digest verification failed.",
    );
  }

  requireIdentifier(
    "Engineering template-creation decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering template-creation source planning ID",
    record.sourcePlanningId,
  );

  requireIdentifier(
    "Engineering template-creation source registry execution ID",
    record.sourceRegistryExecutionId,
  );

  requireDigest(
    "Engineering template-creation source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Engineering template-creation source registry execution digest",
    record.sourceRegistryExecutionDigest,
  );

  requireDigest(
    "Engineering template-creation source expanded registry digest",
    record.sourceExpandedRegistryDigest,
  );

  requireReason(record.reason);

  requireTimestamp(
    "Engineering template-creation decision time",
    record.decidedAt,
  );

  const sourcePlan =
    ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

  const sourceExecution =
    ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_TEMPLATE_CREATION_DECISION_RECORDED" ||
    record.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    !ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_DECISIONS.includes(
      record.decision,
    ) ||
    record.templateCreationApproved !==
      approved ||
    record.templateCreationExecutionAuthorized !==
      approved ||
    record.sourcePlanningId !==
      sourcePlan.planningId ||
    record.sourcePlanningDigest !==
      sourcePlan.planningDigest ||
    record.sourceRegistryExecutionId !==
      sourceExecution.executionId ||
    record.sourceRegistryExecutionDigest !==
      sourceExecution.executionDigest ||
    record.sourceExpandedRegistryDigest !==
      sourceExecution.expandedRegistryDigest ||
    record.candidateTemplateCreationEligibility.length !==
      8
  ) {
    throw new Error(
      "Engineering template-creation decision identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedEvidence;

  if (
    reviewed.proposedTemplateCount !==
      8 ||
    reviewed.proposedLaunchSequences.length !==
      8 ||
    reviewed.registeredEngineeringSkillCount !==
      8 ||
    reviewed.registeredEngineeringToolCount !==
      8 ||
    reviewed.registryRequirementsSatisfied !==
      true ||
    reviewed.sourceRegistryApplicationExecuted !==
      true ||
    reviewed.sourceTemplateCreationAuthorized !==
      false ||
    reviewed.transparentAIIdentityRequired !==
      true ||
    reviewed.humanImpersonationAuthorized !==
      false ||
    reviewed.founderReleaseAchieved !==
      false ||
    reviewed.ownerRetainsMergeAuthority !==
      true ||
    reviewed.ownerRetainsProductionDeploymentAuthority !==
      true
  ) {
    throw new Error(
      "Reviewed Engineering template-creation evidence is invalid.",
    );
  }

  requireUnique(
    "Engineering reviewed launch sequences",
    reviewed.proposedLaunchSequences,
  );

  record.candidateTemplateCreationEligibility.forEach(
    (candidate, index) => {
      const sourceCandidate =
        sourcePlan.proposedTemplates[index];

      if (
        !sourceCandidate ||
        candidate.preparationSequence !==
          index + 1 ||
        candidate.templateId !==
          sourceCandidate.templateId ||
        candidate.employeeId !==
          sourceCandidate.employeeId ||
        candidate.employeeCode !==
          sourceCandidate.employeeCode ||
        candidate.publicName !==
          sourceCandidate.publicName ||
        candidate.officialRole !==
          sourceCandidate.officialRole ||
        candidate.department !==
          "ENGINEERING_DATA_SECURITY" ||
        candidate.managerRoleKey !==
          "founder-owner-ceo" ||
        candidate.proposedLaunchSequence !==
          sourceCandidate.proposedLaunchSequence ||
        candidate.capability !==
          sourceCandidate.capability ||
        candidate.sourceFactoryRecordId !==
          sourceCandidate.sourceFactoryRecordId ||
        candidate.sourceFactoryRecordDigest !==
          sourceCandidate.sourceFactoryRecordDigest ||
        candidate.sourceLifecycleState !==
          "PLANNED_CANDIDATE" ||
        candidate.plannedTargetLifecycleState !==
          "TEMPLATE_PREPARATION_PENDING" ||
        canonicalize(
          candidate.requiredSkillIds,
        ) !==
          canonicalize(
            sourceCandidate.requiredSkillIds,
          ) ||
        canonicalize(
          candidate.requiredToolIds,
        ) !==
          canonicalize(
            sourceCandidate.requiredToolIds,
          ) ||
        candidate.registryRequirementsSatisfied !==
          true ||
        candidate.templateCreationAuthorized !==
          approved ||
        candidate.templateCreated !==
          false ||
        candidate.factoryLifecycleTransitionAuthorized !==
          false ||
        candidate.factoryLifecycleTransitionExecuted !==
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
          "Engineering template-creation candidate binding is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Engineering template-creation template IDs",
    record.candidateTemplateCreationEligibility.map(
      (candidate) =>
        candidate.templateId,
    ),
  );

  requireUnique(
    "Engineering template-creation employee IDs",
    record.candidateTemplateCreationEligibility.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Engineering template-creation employee codes",
    record.candidateTemplateCreationEligibility.map(
      (candidate) =>
        candidate.employeeCode,
    ),
  );

  requireUnique(
    "Engineering template-creation launch sequences",
    record.candidateTemplateCreationEligibility.map(
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
    boundary.sourceRegistryExecutionBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.exactEightTemplateCreationsRequired !==
      true ||
    boundary.templateCreationExecutionAuthorized !==
      approved ||
    boundary.templateCreationPerformed !==
      false ||
    boundary.employeeTemplateRegistryMutationPerformed !==
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
      "Engineering template-creation decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION"
      : "RETAIN_ENGINEERING_TEMPLATE_CREATION_BLOCKED";

  if (
    record.nextStep !==
    expectedNextStep
  ) {
    throw new Error(
      "Engineering template-creation decision next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceTemplateCreationDecision(
  input:
    CreateEngineeringAIWorkforceTemplateCreationDecisionInput,
): EngineeringAIWorkforceTemplateCreationDecision {
  const sourcePlan =
    input.templatePreparationPlan;

  const sourceExecution =
    input.registryExpansionExecution;

  validateEngineeringAIWorkforceTemplatePreparationPlan(
    sourcePlan,
  );

  validateEngineeringAIWorkforceSkillToolRegistryExpansionExecution(
    sourceExecution,
  );

  requireIdentifier(
    "Engineering template-creation decision ID",
    input.decisionId,
  );

  requireReason(input.reason);

  requireTimestamp(
    "Engineering template-creation decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
    ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the Engineering template-creation decision.",
    );
  }

  if (
    sourcePlan.proposedTemplateCount !==
      8 ||
    sourcePlan.proposedTemplates.length !==
      8 ||
    sourceExecution.appliedEngineeringSkillCount !==
      8 ||
    sourceExecution.appliedEngineeringToolCount !==
      8 ||
    sourceExecution.applicationEvidence
      .templatePreparationEligibilityAchieved !==
      true ||
    sourceExecution.authorityBoundary
      .templateCreationAuthorized !==
      false ||
    sourceExecution.nextStep !==
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION_DECISION"
  ) {
    throw new Error(
      "Engineering template-creation sources are not ready for owner decision.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(sourceExecution.executedAt)
  ) {
    throw new Error(
      "Engineering template-creation decision cannot precede registry expansion execution.",
    );
  }

  const registeredSkillIds =
    new Set(
      sourceExecution.expandedRegistry.skills.map(
        (skill) =>
          skill.skillId,
      ),
    );

  const registeredToolIds =
    new Set(
      sourceExecution.expandedRegistry.tools.map(
        (tool) =>
          tool.toolId,
      ),
    );

  const registryRequirementsSatisfied =
    sourcePlan.proposedTemplates.every(
      (candidate) =>
        candidate.requiredSkillIds.every(
          (skillId) =>
            registeredSkillIds.has(skillId),
        ) &&
        candidate.requiredToolIds.every(
          (toolId) =>
            registeredToolIds.has(toolId),
        ),
    );

  if (
    registryRequirementsSatisfied !==
    true
  ) {
    throw new Error(
      "Engineering template creation is blocked because required skills or tools are not registered.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_TEMPLATE_CREATION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourcePlanningId:
      sourcePlan.planningId,
    sourcePlanningDigest:
      sourcePlan.planningDigest,
    sourceRegistryExecutionId:
      sourceExecution.executionId,
    sourceRegistryExecutionDigest:
      sourceExecution.executionDigest,
    sourceExpandedRegistryDigest:
      sourceExecution.expandedRegistryDigest,
    decision:
      input.decision,
    templateCreationApproved:
      approved,
    templateCreationExecutionAuthorized:
      approved,
    reason:
      input.reason,
    reviewedEvidence: {
      proposedTemplateCount:
        8 as const,
      proposedLaunchSequences:
        sourcePlan.proposedLaunchSequences,
      registeredEngineeringSkillCount:
        8 as const,
      registeredEngineeringToolCount:
        8 as const,
      registryRequirementsSatisfied:
        true as const,
      sourceRegistryApplicationExecuted:
        true as const,
      sourceTemplateCreationAuthorized:
        false as const,
      transparentAIIdentityRequired:
        sourcePlan.humanLikeEmployeeStandard
          .transparentAIIdentityRequired,
      humanImpersonationAuthorized:
        sourcePlan.humanLikeEmployeeStandard
          .humanImpersonationAuthorized,
      founderReleaseAchieved:
        sourcePlan.founderLiberationObjective
          .founderReleaseAchieved,
      ownerRetainsMergeAuthority:
        sourcePlan.founderLiberationObjective
          .ownerRetainsMergeAuthority,
      ownerRetainsProductionDeploymentAuthority:
        sourcePlan.founderLiberationObjective
          .ownerRetainsProductionDeploymentAuthority,
    },
    candidateTemplateCreationEligibility:
      sourcePlan.proposedTemplates.map(
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
          managerRoleKey:
            candidate.managerRoleKey,
          proposedLaunchSequence:
            candidate.proposedLaunchSequence,
          capability:
            candidate.capability,
          sourceFactoryRecordId:
            candidate.sourceFactoryRecordId,
          sourceFactoryRecordDigest:
            candidate.sourceFactoryRecordDigest,
          sourceLifecycleState:
            candidate.sourceLifecycleState,
          plannedTargetLifecycleState:
            candidate.plannedTargetLifecycleState,
          requiredSkillIds:
            candidate.requiredSkillIds,
          requiredToolIds:
            candidate.requiredToolIds,
          registryRequirementsSatisfied:
            true,
          templateCreationAuthorized:
            approved,
          templateCreated:
            false as const,
          factoryLifecycleTransitionAuthorized:
            false as const,
          factoryLifecycleTransitionExecuted:
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
      sourceRegistryExecutionBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      exactEightTemplateCreationsRequired:
        true as const,
      templateCreationExecutionAuthorized:
        approved,
      templateCreationPerformed:
        false as const,
      employeeTemplateRegistryMutationPerformed:
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
        ? "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION" as const
        : "RETAIN_ENGINEERING_TEMPLATE_CREATION_BLOCKED" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceTemplateCreationDecision;

  validateEngineeringAIWorkforceTemplateCreationDecision(
    decision,
  );

  return decision;
}
