import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionExecution,
} from "./autonomousGlobalGrowthSkillToolRegistryExpansionExecution";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan";

export const AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_DECISIONS = [
  "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_V1",
  "REJECT_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_V1",
] as const;

export type AutonomousGlobalGrowthAIEmployeeTemplateCreationDecisionType =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_DECISIONS)[number];

const plan =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN;

const registryExecution =
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

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

export function createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision(
  input: Readonly<{
    sourcePlan: typeof plan;
    sourceRegistryExecution: typeof registryExecution;
    decisionId: string;
    ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
    decision: AutonomousGlobalGrowthAIEmployeeTemplateCreationDecisionType;
    reason: string;
    decidedAt: string;
  }>,
) {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
    input.sourcePlan,
  );

  validateAutonomousGlobalGrowthSkillToolRegistryExpansionExecution(
    input.sourceRegistryExecution,
  );

  if (
    input.sourcePlan !== plan ||
    input.sourceRegistryExecution !== registryExecution
  ) {
    throw new Error(
      "Only canonical Global Growth planning and registry evidence is allowed.",
    );
  }

  if (input.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID) {
    throw new Error(
      "Only the verified NEXUS owner may decide template creation.",
    );
  }

  if (
    Number.isNaN(Date.parse(input.decidedAt)) ||
    new Date(input.decidedAt).toISOString() !== input.decidedAt ||
    Date.parse(input.decidedAt) < Date.parse(registryExecution.executedAt)
  ) {
    throw new Error(
      "Global Growth template-creation decision time is invalid.",
    );
  }

  if (
    registryExecution.appliedSkillCount !== 9 ||
    registryExecution.appliedToolCount !== 9 ||
    registryExecution.authorityBoundary.registryExpansionExecuted !== true ||
    registryExecution.authorityBoundary.templateCreationAuthorized !== false ||
    registryExecution.authorityBoundary.qualificationExecutionAuthorized !== false ||
    registryExecution.authorityBoundary.employeeActivationAuthorized !== false ||
    registryExecution.authorityBoundary.publicPublishingAuthorized !== false ||
    registryExecution.authorityBoundary.productionExecutionAuthorized !== false ||
    registryExecution.authorityBoundary.founderLiberationAchieved !== false ||
    registryExecution.nextStep !==
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_DECISION_V1"
  ) {
    throw new Error(
      "Global Growth registry evidence does not authorize template review.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_V1";

  const expandedSkillIds =
    new Set(
      registryExecution.expandedRegistry.skills.map(
        (skill) => skill.skillId,
      ),
    );

  const expandedToolIds =
    new Set(
      registryExecution.expandedRegistry.tools.map(
        (tool) => tool.toolId,
      ),
    );

  const candidateTemplateCreationEligibility =
    plan.templatePreparations.map((candidate) => {
      const skillRegistered =
        expandedSkillIds.has(candidate.requiredSkillId);

      const toolRegistered =
        expandedToolIds.has(candidate.requiredToolId);

      if (!skillRegistered || !toolRegistered) {
        throw new Error(
          `Required registry definitions are missing for ${candidate.employeeCode}.`,
        );
      }

      return {
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
        capability:
          candidate.capability,
        sourceFactoryRecordId:
          candidate.factoryRecordId,
        sourceLifecycleState:
          candidate.sourceLifecycleState,
        requiredSkillId:
          candidate.requiredSkillId,
        requiredToolId:
          candidate.requiredToolId,
        registryRequirementsSatisfied:
          true as const,
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
        employeeActivationAuthorized:
          false as const,
        runtimeAuthorized:
          false as const,
        externalActionAuthorized:
          false as const,
      };
    });

  const core = {
    version:
      "nexus-autonomous-global-growth-ai-employee-template-creation-owner-decision-v1" as const,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_GLOBAL_GROWTH_TEMPLATE_CREATION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourcePlanningId:
      plan.planningId,
    sourcePlanningDigest:
      plan.planningDigest,
    sourceRegistryExecutionId:
      registryExecution.executionId,
    sourceRegistryExecutionDigest:
      registryExecution.executionDigest,
    sourceExpandedRegistryDigest:
      registryExecution.expandedRegistryDigest,
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
        9 as const,
      registeredGlobalGrowthSkillCount:
        9 as const,
      registeredGlobalGrowthToolCount:
        9 as const,
      registryRequirementsSatisfied:
        true as const,
      everyToolDraftOnly:
        true as const,
      everyToolNonExternal:
        true as const,
      transparentAIIdentityRequired:
        true as const,
      humanImpersonationAuthorized:
        false as const,
    },
    candidateTemplateCreationEligibility,
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
      templateCreationAuthorized:
        approved,
      employeeTemplateRegistryMutationAuthorized:
        approved,
      factoryLifecycleTransitionAuthorized:
        false as const,
      factoryLifecycleTransitionPerformed:
        false as const,
      qualificationAdmissionAuthorized:
        false as const,
      qualificationExecutionAuthorized:
        false as const,
      qualificationEvidenceAccepted:
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
      ? "EXECUTE_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_V1"
      : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_CREATION_BLOCKED",
    decidedAt:
      input.decidedAt,
  };

  return deepFreeze({
    ...core,
    decisionDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthAIEmployeeTemplateCreationDecision =
  ReturnType<
    typeof createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision
  >;

export function validateAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision(
  record: AutonomousGlobalGrowthAIEmployeeTemplateCreationDecision,
): void {
  const approved =
    record.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_V1";

  const unsignedRecord =
    Object.fromEntries(
      Object.entries(record).filter(
        ([key]) => key !== "decisionDigest",
      ),
    );

  if (
    record.sourcePlanningId !== plan.planningId ||
    record.sourcePlanningDigest !== plan.planningDigest ||
    record.sourceRegistryExecutionId !== registryExecution.executionId ||
    record.sourceRegistryExecutionDigest !== registryExecution.executionDigest ||
    record.sourceExpandedRegistryDigest !== registryExecution.expandedRegistryDigest ||
    record.templateCreationApproved !== approved ||
    record.templateCreationExecutionAuthorized !== approved ||
    record.reviewedEvidence.proposedTemplateCount !== 9 ||
    record.reviewedEvidence.registeredGlobalGrowthSkillCount !== 9 ||
    record.reviewedEvidence.registeredGlobalGrowthToolCount !== 9 ||
    record.candidateTemplateCreationEligibility.length !== 9 ||
    new Set(
      record.candidateTemplateCreationEligibility.map(
        (candidate) => candidate.templateId,
      ),
    ).size !== 9 ||
    record.candidateTemplateCreationEligibility.some(
      (candidate) =>
        candidate.registryRequirementsSatisfied !== true ||
        candidate.templateCreationAuthorized !== approved ||
        candidate.templateCreated !== false ||
        candidate.factoryLifecycleTransitionAuthorized !== false ||
        candidate.factoryLifecycleTransitionExecuted !== false ||
        candidate.qualificationExecutionAuthorized !== false ||
        candidate.employeeActivationAuthorized !== false ||
        candidate.runtimeAuthorized !== false ||
        candidate.externalActionAuthorized !== false,
    ) ||
    record.authorityBoundary.templateCreationAuthorized !== approved ||
    record.authorityBoundary.employeeTemplateRegistryMutationAuthorized !== approved ||
    record.authorityBoundary.factoryLifecycleTransitionAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.customerMessagingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    record.decisionDigest !== sha256(unsignedRecord) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.candidateTemplateCreationEligibility) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth AI employee template-creation decision is invalid.",
    );
  }
}