import { createHash } from "node:crypto";

import {
  EMPLOYEE_ESCALATION_CONDITIONS,
  REQUIRED_EMPLOYEE_APPROVAL_ACTIONS,
} from "./aiEmployeeManifest";
import {
  createAIEmployeeTemplateRegistry,
  type AIEmployeeTemplateDefinition,
  type AIEmployeeTemplateRegistry,
} from "./employeeTemplateRegistry";
import {
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD,
} from "./autonomousGlobalGrowthAIEmployeeTemplateCreationApprovalRecord";
import {
  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision,
} from "./autonomousGlobalGrowthAIEmployeeTemplateCreationDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_EXPANDED_SKILL_TOOL_REGISTRY,
} from "./autonomousGlobalGrowthSkillToolRegistryExpansionExecution";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan";

export const AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION_VERSION =
  "nexus-autonomous-global-growth-ai-employee-template-creation-execution-v1" as const;

const plan =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN;

const decision =
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD;

const registry =
  AUTONOMOUS_GLOBAL_GROWTH_EXPANDED_SKILL_TOOL_REGISTRY;

type Capability =
  (typeof plan.templatePreparations)[number]["capability"];

const ROLE_CHARTERS: Readonly<Record<Capability, string>> = {
  RESEARCH_AND_FACT_VERIFICATION:
    "Prepare evidence-bound research and fact-verification drafts, identify unsupported claims and assumptions, preserve source transparency, and escalate uncertain or sensitive conclusions for owner review.",
  COPYWRITING_AND_PLATFORM_ADAPTATION:
    "Prepare brand-consistent platform-specific copy drafts without publishing, impersonating humans, making unsupported claims, or bypassing owner approval and approved communication boundaries.",
  GRAPHIC_CONTENT_PRODUCTION:
    "Prepare visual concepts, structured graphic briefs, captions, accessibility guidance, and source-safe creative recommendations without generating or publishing live external content.",
  VIDEO_CONTENT_PRODUCTION:
    "Prepare video concepts, scripts, shot lists, editing briefs, captions, and evidence-bound production plans without executing video generation, publishing, or external delivery.",
  PUBLISHING_GATEWAY_OPERATIONS:
    "Prepare provider-independent publishing schedules, platform adaptation plans, consent checks, rollback plans, and owner-review packets without connecting credentials or performing live publishing.",
  COMMUNITY_ENGAGEMENT_AND_INQUIRIES:
    "Prepare safe response drafts, inquiry classifications, escalation recommendations, and consent-aware community guidance without contacting customers, replying publicly, or impersonating a human representative.",
  LEAD_QUALIFICATION:
    "Prepare evidence-based lead assessments, qualification reasoning, risk flags, consent status, and owner-review recommendations without contacting leads, changing customer data, or making commitments.",
  DEMO_BOOKING_COORDINATION:
    "Prepare demo-booking drafts, scheduling options, qualification summaries, consent checks, and owner-review recommendations without sending invitations, contacting prospects, or creating calendar events.",
  GROWTH_ANALYTICS_AND_REVENUE_ATTRIBUTION:
    "Prepare transparent growth-analysis and revenue-attribution drafts with explicit assumptions, evidence quality, confidence limits, and owner-review recommendations without accessing unauthorized data.",
};

const KPI_NAMES: Readonly<Record<Capability, string>> = {
  RESEARCH_AND_FACT_VERIFICATION:
    "Verified research quality",
  COPYWRITING_AND_PLATFORM_ADAPTATION:
    "Platform copy quality",
  GRAPHIC_CONTENT_PRODUCTION:
    "Graphic brief quality",
  VIDEO_CONTENT_PRODUCTION:
    "Video brief quality",
  PUBLISHING_GATEWAY_OPERATIONS:
    "Publishing-plan quality",
  COMMUNITY_ENGAGEMENT_AND_INQUIRIES:
    "Community response quality",
  LEAD_QUALIFICATION:
    "Lead assessment quality",
  DEMO_BOOKING_COORDINATION:
    "Demo coordination quality",
  GROWTH_ANALYTICS_AND_REVENUE_ATTRIBUTION:
    "Attribution analysis quality",
};

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

function createTemplateDefinition(
  candidate: (typeof plan.templatePreparations)[number],
  createdAt: string,
): AIEmployeeTemplateDefinition {
  const roleSkill =
    registry.skills.find(
      (skill) => skill.skillId === candidate.requiredSkillId,
    );

  const ownerEscalationSkill =
    registry.skills.find(
      (skill) => skill.skillId === "skill-owner-escalation",
    );

  const roleTool =
    registry.tools.find(
      (tool) => tool.toolId === candidate.requiredToolId,
    );

  if (
    !roleSkill ||
    !ownerEscalationSkill ||
    !roleTool ||
    roleTool.allowedModes.length !== 1 ||
    roleTool.allowedModes[0] !== "DRAFT_ONLY" ||
    roleTool.externalEffect !== false ||
    roleTool.tenantScoped !== true ||
    roleTool.auditRequired !== true
  ) {
    throw new Error(
      `Required safe registry definitions are missing for ${candidate.employeeCode}.`,
    );
  }

  const slug =
    candidate.publicName.trim().toLowerCase();

  return {
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
      "founder-owner-ceo",
    launchSequence:
      candidate.preparationSequence,
    manifestInput: {
      employeeId:
        candidate.employeeId,
      templateId:
        candidate.templateId,
      displayName:
        candidate.publicName,
      department:
        candidate.department,
      roleTitle:
        candidate.officialRole,
      roleCharter:
        ROLE_CHARTERS[candidate.capability],
      autonomyLevel:
        "DRAFTING_ASSISTANT",
      skills: [
        {
          skillId:
            roleSkill.skillId,
          name:
            roleSkill.name,
          description:
            roleSkill.description,
        },
        {
          skillId:
            ownerEscalationSkill.skillId,
          name:
            ownerEscalationSkill.name,
          description:
            ownerEscalationSkill.description,
        },
      ],
      toolGrants: [
        {
          toolId:
            roleTool.toolId,
          capability:
            roleTool.capability,
          mode:
            "DRAFT_ONLY",
          risk:
            roleTool.risk,
        },
      ],
      knowledgePolicy: {
        sourceTypes: [
          "APPROVED_DOCUMENTS",
          "PUBLIC_KNOWLEDGE",
        ],
        tenantScoped:
          true,
        crossTenantAccess:
          false,
        customerMemoryAccess:
          "NONE",
      },
      approvalPolicy: {
        requiredFor:
          REQUIRED_EMPLOYEE_APPROVAL_ACTIONS,
        bypassAllowed:
          false,
      },
      kpis: [
        {
          kpiId:
            `kpi-${slug}-specialist-quality`,
          name:
            KPI_NAMES[candidate.capability],
          measurement:
            "Percentage of drafts that satisfy the approved role charter, preserve evidence transparency, identify risks and assumptions, and provide a clear owner-review recommendation.",
          ownerVisible:
            true,
        },
        {
          kpiId:
            `kpi-${slug}-evidence-completeness`,
          name:
            "Evidence completeness",
          measurement:
            "Percentage of drafts containing source evidence, explicit assumptions, confidence limits, blocked authority, consent status where relevant, and required escalations.",
          ownerVisible:
            true,
        },
        {
          kpiId:
            `kpi-${slug}-safety-boundary`,
          name:
            "Safety-boundary compliance",
          measurement:
            "Percentage of work that remains tenant-scoped, draft-only, audited, non-external, non-impersonating, and fully subject to owner authority.",
          ownerVisible:
            true,
        },
      ],
      escalationPolicy: {
        maxAutonomousSteps:
          3,
        ownerEscalationRequired:
          true,
        escalateOn:
          EMPLOYEE_ESCALATION_CONDITIONS,
      },
      auditPolicy: {
        everyToolCallLogged:
          true,
        everyStateTransitionLogged:
          true,
        evidenceDigestRequired:
          true,
      },
      evaluation: {
        status:
          "UNQUALIFIED",
        testCasesPassed:
          0,
        testCasesRequired:
          100,
        adversarialTestsPassed:
          false,
        tenantIsolationPassed:
          false,
        ownerControlPassed:
          false,
        emergencyPausePassed:
          false,
      },
      createdAt,
    },
  };
}

function buildExecution(executedAt: string) {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
    plan,
  );

  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision(
    decision,
  );

  if (
    decision.templateCreationApproved !== true ||
    decision.templateCreationExecutionAuthorized !== true ||
    decision.reviewedEvidence.proposedTemplateCount !== 9 ||
    decision.authorityBoundary.templateCreationAuthorized !== true ||
    decision.authorityBoundary.employeeTemplateRegistryMutationAuthorized !== true ||
    decision.authorityBoundary.factoryLifecycleTransitionAuthorized !== false ||
    decision.authorityBoundary.qualificationExecutionAuthorized !== false ||
    decision.authorityBoundary.employeeActivationAuthorized !== false ||
    decision.authorityBoundary.publicPublishingAuthorized !== false ||
    decision.authorityBoundary.productionExecutionAuthorized !== false ||
    decision.authorityBoundary.founderLiberationAchieved !== false ||
    decision.sourcePlanningId !== plan.planningId ||
    decision.sourcePlanningDigest !== plan.planningDigest ||
    decision.sourceExpandedRegistryDigest !== registry.registryDigest ||
    decision.nextStep !==
      "EXECUTE_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_V1"
  ) {
    throw new Error(
      "Global Growth template-creation execution prerequisites are invalid.",
    );
  }

  if (
    Number.isNaN(Date.parse(executedAt)) ||
    new Date(executedAt).toISOString() !== executedAt ||
    Date.parse(executedAt) < Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Global Growth template-creation execution time is invalid.",
    );
  }

  const createdTemplates =
    plan.templatePreparations.map(
      (candidate) =>
        createTemplateDefinition(candidate, executedAt),
    );

  const templateRegistry =
    createAIEmployeeTemplateRegistry({
      templates:
        createdTemplates,
      skillToolRegistry:
        registry,
      createdAt:
        executedAt,
    });

  if (
    templateRegistry.registeredTemplateCount !== 9 ||
    templateRegistry.qualifiedTemplateCount !== 0 ||
    templateRegistry.activationEligibleTemplateCount !== 0 ||
    templateRegistry.templates.some(
      (template) =>
        template.status !== "REGISTERED_UNQUALIFIED" ||
        template.controlledActivationEligible !== false,
    )
  ) {
    throw new Error(
      "Global Growth templates must remain registered-unqualified and activation-blocked.",
    );
  }

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION_VERSION,
    executionId:
      "autonomous-global-growth-ai-employee-template-creation-execution-001",
    executionState:
      "OWNER_CONTROLLED_GLOBAL_GROWTH_TEMPLATE_CREATION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourcePlanningId:
      plan.planningId,
    sourcePlanningDigest:
      plan.planningDigest,
    sourceExpandedRegistryDigest:
      registry.registryDigest,
    createdTemplateCount:
      9 as const,
    createdTemplates,
    templateRegistry:
      templateRegistry as AIEmployeeTemplateRegistry,
    templateRegistryDigest:
      templateRegistry.registryDigest,
    creationEvidence: {
      exactNineTemplatesCreated:
        true as const,
      exactPlannedIdentitiesPreserved:
        true as const,
      requiredSkillBindingsApplied:
        true as const,
      requiredDraftOnlyToolBindingsApplied:
        true as const,
      ownerEscalationSkillApplied:
        true as const,
      immutableTemplateRegistryCreated:
        true as const,
      everyTemplateUnqualified:
        true as const,
      everyTemplateActivationBlocked:
        true as const,
      transparentAIIdentityPreserved:
        true as const,
      humanImpersonationAuthorized:
        false as const,
      factoryLifecycleMutationPerformed:
        false as const,
    },
    authorityBoundary: {
      sourceOwnerApprovalBound:
        true as const,
      templateCreationExecuted:
        true as const,
      employeeTemplateRegistryMutationPerformed:
        true as const,
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
      commentResponseAuthorized:
        false as const,
      leadContactAuthorized:
        false as const,
      demoBookingExecutionAuthorized:
        false as const,
      proposalDeliveryAuthorized:
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
    nextStep:
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISION_V1" as const,
    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthAIEmployeeTemplateCreationExecution =
  ReturnType<typeof buildExecution>;

export function validateAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution(
  record: AutonomousGlobalGrowthAIEmployeeTemplateCreationExecution,
): void {
  const expected =
    buildExecution(record.executedAt);

  if (
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.createdTemplateCount !== 9 ||
    record.createdTemplates.length !== 9 ||
    record.templateRegistry.registeredTemplateCount !== 9 ||
    record.templateRegistry.qualifiedTemplateCount !== 0 ||
    record.templateRegistry.activationEligibleTemplateCount !== 0 ||
    record.templateRegistryDigest !== record.templateRegistry.registryDigest ||
    record.templateRegistry.templates.some(
      (template) =>
        template.status !== "REGISTERED_UNQUALIFIED" ||
        template.controlledActivationEligible !== false ||
        template.safetyBoundary.externalDeliveryAuthorized !== false ||
        template.safetyBoundary.liveProviderExecutionAuthorized !== false ||
        template.safetyBoundary.publicLaunchAuthorized !== false,
    ) ||
    record.createdTemplates.some(
      (template) =>
        template.manifestInput.autonomyLevel !== "DRAFTING_ASSISTANT" ||
        template.manifestInput.evaluation.status !== "UNQUALIFIED" ||
        template.manifestInput.toolGrants.length !== 1 ||
        template.manifestInput.toolGrants[0].mode !== "DRAFT_ONLY",
    ) ||
    record.creationEvidence.exactNineTemplatesCreated !== true ||
    record.creationEvidence.everyTemplateUnqualified !== true ||
    record.creationEvidence.everyTemplateActivationBlocked !== true ||
    record.creationEvidence.factoryLifecycleMutationPerformed !== false ||
    record.authorityBoundary.factoryLifecycleTransitionAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.customerMessagingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.createdTemplates) ||
    !Object.isFrozen(record.templateRegistry) ||
    !Object.isFrozen(record.creationEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth AI employee template-creation execution is invalid.",
    );
  }
}

export function createAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution(
  executedAt: string,
): AutonomousGlobalGrowthAIEmployeeTemplateCreationExecution {
  const record =
    buildExecution(executedAt);

  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION =
  createAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution(
    "2026-08-06T12:06:36.489Z",
  );

export const AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY =
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION
    .templateRegistry;