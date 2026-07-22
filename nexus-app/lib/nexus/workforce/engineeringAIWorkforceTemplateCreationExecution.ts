import {
  createHash,
} from "node:crypto";

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
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION,
} from "./engineeringAIWorkforceTemplateCreationApprovalRecord";

import {
  type EngineeringAIWorkforceTemplateCreationDecision,
  validateEngineeringAIWorkforceTemplateCreationDecision,
} from "./engineeringAIWorkforceTemplateCreationDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
  type EngineeringAIWorkforceTemplateCapability,
  type EngineeringAIWorkforceTemplatePreparationPlanEntry,
} from "./engineeringAIWorkforceTemplatePreparationPlan";

import {
  ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionExecution";

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-template-creation-execution-v1" as const;

export interface CreateEngineeringAIWorkforceTemplateCreationExecutionInput {
  readonly executionId: string;
  readonly approvalDecision:
    EngineeringAIWorkforceTemplateCreationDecision;
  readonly executedAt: string;
}

export interface EngineeringAIWorkforceTemplateCreationExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION_VERSION;
  readonly executionId: string;
  readonly executionState:
    "OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION_EXECUTED";
  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceExpandedRegistryDigest:
    string;
  readonly createdTemplateCount: 8;
  readonly createdTemplates:
    readonly AIEmployeeTemplateDefinition[];
  readonly templateRegistry:
    AIEmployeeTemplateRegistry;
  readonly templateRegistryDigest:
    string;
  readonly creationEvidence: Readonly<{
    exactEightTemplatesCreated: true;
    exactPlannedIdentitiesPreserved:
      true;
    exactLaunchSequencesPreserved:
      true;
    engineeringSkillBindingsApplied:
      true;
    engineeringToolBindingsApplied:
      true;
    ownerEscalationSkillApplied:
      true;
    immutableTemplateRegistryCreated:
      true;
    everyTemplateUnqualified:
      true;
    everyTemplateActivationBlocked:
      true;
    factoryLifecycleMutationPerformed:
      false;
  }>;
  readonly founderLiberationEvidence:
    Readonly<{
      engineeringTemplateFoundationCreated:
        true;
      routineEngineeringOperationDelegated:
        false;
      founderLiberationAchieved:
        false;
      ownerRetainsFinalProductAuthority:
        true;
      ownerRetainsMergeAuthority:
        true;
      ownerRetainsProductionDeploymentAuthority:
        true;
    }>;
  readonly authorityBoundary: Readonly<{
    sourceOwnerApprovalBound: true;
    templateCreationExecuted: true;
    employeeTemplateRegistryMutationPerformed:
      true;
    factoryLifecycleTransitionAuthorized:
      false;
    factoryLifecycleTransitionPerformed:
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
    "PREPARE_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_DECISION";
  readonly executedAt: string;
  readonly executionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const ROLE_CHARTERS:
  Readonly<
    Record<
      EngineeringAIWorkforceTemplateCapability,
      string
    >
  > = {
  SYSTEM_ARCHITECTURE_AND_BOUNDARY_DESIGN:
    "Prepare evidence-bound architecture, component-boundary, tradeoff, and technical-design drafts for owner review while preserving tenant isolation, security, recovery, and final owner authority.",
  SOFTWARE_DELIVERY_COORDINATION:
    "Prepare bounded implementation plans, dependency analysis, validation checkpoints, and delivery evidence without independently modifying repositories, branches, deployments, production systems, or secrets.",
  QUALITY_ASSURANCE_AND_REGRESSION:
    "Prepare independent acceptance criteria, test plans, regression coverage, defect evidence, and release recommendations while blocking unsupported quality claims and escalating unsafe results.",
  SECURITY_ENGINEERING_AND_THREAT_MODELING:
    "Prepare tenant-isolation reviews, authorization analysis, threat models, secret-protection checks, and security recommendations without accessing secrets, production systems, or another tenant's information.",
  RELIABILITY_AND_RECOVERY_ENGINEERING:
    "Prepare observability, rollback, recovery, continuity, capacity, and deployment-readiness plans with explicit failure boundaries and owner-reviewable evidence.",
  CHAOS_AND_FAILURE_SCENARIO_DESIGN:
    "Design reversible non-executing sandbox failure scenarios, safety assertions, containment checks, and recovery evidence without disrupting production or real customer data.",
  DATA_ENGINEERING_AND_ANALYTICS:
    "Prepare tenant-safe data models, migration plans, lineage, data-quality controls, and transparent analytics designs without executing database mutations or accessing unauthorized data.",
  SYSTEMS_EVALUATION_AND_RED_TEAMING:
    "Prepare independent adversarial evaluations, prompt-injection probes, tool-misuse scenarios, scoring criteria, and defect evidence without executing uncontrolled attacks or production changes.",
};

const KPI_DEFINITIONS:
  Readonly<
    Record<
      EngineeringAIWorkforceTemplateCapability,
      Readonly<{
        readonly name: string;
        readonly measurement: string;
      }>
    >
  > = {
  SYSTEM_ARCHITECTURE_AND_BOUNDARY_DESIGN: {
    name:
      "Architecture evidence quality",
    measurement:
      "Percentage of architecture drafts containing verified requirements, boundaries, tradeoffs, risks, recovery considerations, and an owner-reviewable recommendation.",
  },
  SOFTWARE_DELIVERY_COORDINATION: {
    name:
      "Delivery-plan readiness",
    measurement:
      "Percentage of implementation plans containing bounded scope, dependencies, validation steps, rollback guidance, and explicit blocked authority.",
  },
  QUALITY_ASSURANCE_AND_REGRESSION: {
    name:
      "Defect detection quality",
    measurement:
      "Percentage of reviewed changes with complete acceptance criteria, meaningful regression coverage, reproducible defect evidence, and accurate release recommendations.",
  },
  SECURITY_ENGINEERING_AND_THREAT_MODELING: {
    name:
      "Security-review completeness",
    measurement:
      "Percentage of security reviews covering authorization, tenant isolation, secrets, misuse paths, mitigations, residual risk, and owner escalation.",
  },
  RELIABILITY_AND_RECOVERY_ENGINEERING: {
    name:
      "Recovery-plan completeness",
    measurement:
      "Percentage of reliability plans containing detection, containment, rollback, recovery, continuity, validation, and owner-visible residual-risk evidence.",
  },
  CHAOS_AND_FAILURE_SCENARIO_DESIGN: {
    name:
      "Chaos-scenario safety",
    measurement:
      "Percentage of chaos scenarios that remain non-destructive, reversible, bounded, observable, and supported by explicit containment and recovery assertions.",
  },
  DATA_ENGINEERING_AND_ANALYTICS: {
    name:
      "Data-design integrity",
    measurement:
      "Percentage of data designs covering tenant isolation, lineage, validation, migration safety, recovery, and transparent analytical assumptions.",
  },
  SYSTEMS_EVALUATION_AND_RED_TEAMING: {
    name:
      "Evaluation defect yield",
    measurement:
      "Percentage of evaluations that identify reproducible defects, unsafe assumptions, bypass attempts, or evidence gaps with clear severity and containment guidance.",
  },
};

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
            stableStringify(item),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            `${JSON.stringify(key)}:${stableStringify(record[key])}`,
        )
        .join(",") +
      "}"
    );
  }

  return JSON.stringify(value);
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<
          string,
          unknown
        >,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    !SAFE_IDENTIFIER_PATTERN.test(
      value,
    )
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
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

function createTemplateDefinition(
  candidate:
    EngineeringAIWorkforceTemplatePreparationPlanEntry,
  index: number,
  createdAt: string,
): AIEmployeeTemplateDefinition {
  const blueprint =
    ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS[
      index
    ];

  if (
    !blueprint ||
    candidate.capability !==
      blueprint.capability ||
    candidate.requiredSkillIds.length !==
      2 ||
    candidate.requiredSkillIds[0] !==
      blueprint.proposedSkill.skillId ||
    candidate.requiredSkillIds[1] !==
      "skill-owner-escalation" ||
    candidate.requiredToolIds.length !==
      1 ||
    candidate.requiredToolIds[0] !==
      blueprint.proposedTool.toolId
  ) {
    throw new Error(
      "Engineering template candidate is not bound to its approved capability blueprint.",
    );
  }

  const ownerEscalationSkill =
    ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY
      .skills.find(
        (skill) =>
          skill.skillId ===
          "skill-owner-escalation",
      );

  const registeredRoleSkill =
    ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY
      .skills.find(
        (skill) =>
          skill.skillId ===
          blueprint.proposedSkill.skillId,
      );

  const registeredRoleTool =
    ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY
      .tools.find(
        (tool) =>
          tool.toolId ===
          blueprint.proposedTool.toolId,
      );

  if (
    !ownerEscalationSkill ||
    !registeredRoleSkill ||
    !registeredRoleTool ||
    registeredRoleTool.allowedModes.length !==
      1 ||
    registeredRoleTool.allowedModes[0] !==
      "DRAFT_ONLY" ||
    registeredRoleTool.externalEffect !==
      false ||
    registeredRoleTool.tenantScoped !==
      true ||
    registeredRoleTool.auditRequired !==
      true
  ) {
    throw new Error(
      "Engineering template creation requires the exact expanded draft-only registry definitions.",
    );
  }

  const employeeSlug =
    candidate.publicName
      .trim()
      .toLowerCase();

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
      candidate.managerRoleKey,
    launchSequence:
      candidate.proposedLaunchSequence,
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
        ROLE_CHARTERS[
          candidate.capability
        ],
      autonomyLevel:
        "DRAFTING_ASSISTANT",
      skills: [
        {
          skillId:
            registeredRoleSkill.skillId,
          name:
            registeredRoleSkill.name,
          description:
            registeredRoleSkill.description,
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
            registeredRoleTool.toolId,
          capability:
            registeredRoleTool.capability,
          mode:
            "DRAFT_ONLY",
          risk:
            registeredRoleTool.risk,
        },
      ],
      knowledgePolicy: {
        sourceTypes: [
          "APPROVED_DOCUMENTS",
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
            `kpi-${employeeSlug}-specialist-quality`,
          name:
            KPI_DEFINITIONS[
              candidate.capability
            ].name,
          measurement:
            KPI_DEFINITIONS[
              candidate.capability
            ].measurement,
          ownerVisible:
            true,
        },
        {
          kpiId:
            `kpi-${employeeSlug}-evidence-completeness`,
          name:
            "Evidence completeness",
          measurement:
            "Percentage of drafts supported by source evidence, explicit assumptions, identified risks, blocked authority, and a clear owner-review recommendation.",
          ownerVisible:
            true,
        },
        {
          kpiId:
            `kpi-${employeeSlug}-escalation-quality`,
          name:
            "Escalation quality",
          measurement:
            "Percentage of escalations containing the triggering condition, supporting evidence, risk level, blocked action, and recommended owner decision.",
          ownerVisible:
            true,
        },
      ],
      escalationPolicy: {
        maxAutonomousSteps:
          5,
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

export function validateEngineeringAIWorkforceTemplateCreationExecution(
  execution:
    EngineeringAIWorkforceTemplateCreationExecution,
): void {
  requireIdentifier(
    "Engineering template-creation execution ID",
    execution.executionId,
  );

  requireTimestamp(
    "Engineering template-creation execution time",
    execution.executedAt,
  );

  requireDigest(
    "Engineering template-creation source decision digest",
    execution.sourceDecisionDigest,
  );

  requireDigest(
    "Engineering template-creation source planning digest",
    execution.sourcePlanningDigest,
  );

  requireDigest(
    "Engineering template-creation source expanded registry digest",
    execution.sourceExpandedRegistryDigest,
  );

  requireDigest(
    "Engineering template registry digest",
    execution.templateRegistryDigest,
  );

  requireDigest(
    "Engineering template-creation execution digest",
    execution.executionDigest,
  );

  if (
    execution.version !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION_VERSION ||
    execution.executionState !==
      "OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION_EXECUTED" ||
    execution.sourcePlanningId !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN.planningId ||
    execution.sourcePlanningDigest !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN.planningDigest ||
    execution.sourceExpandedRegistryDigest !==
      ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY.registryDigest ||
    execution.createdTemplateCount !==
      8 ||
    execution.createdTemplates.length !==
      8 ||
    execution.templateRegistry.registeredTemplateCount !==
      8 ||
    execution.templateRegistry.qualifiedTemplateCount !==
      0 ||
    execution.templateRegistry.activationEligibleTemplateCount !==
      0 ||
    execution.templateRegistry.skillToolRegistryDigest !==
      ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY.registryDigest ||
    execution.templateRegistryDigest !==
      execution.templateRegistry.registryDigest
  ) {
    throw new Error(
      "Engineering template-creation execution identity is invalid.",
    );
  }

  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
    .proposedTemplates.forEach(
      (
        candidate,
        index,
      ) => {
        const definition =
          execution.createdTemplates[
            index
          ];

        const record =
          execution.templateRegistry
            .templates[index];

        if (
          !definition ||
          !record ||
          definition.templateId !==
            candidate.templateId ||
          definition.employeeId !==
            candidate.employeeId ||
          definition.employeeCode !==
            candidate.employeeCode ||
          definition.publicName !==
            candidate.publicName ||
          definition.officialRole !==
            candidate.officialRole ||
          definition.department !==
            candidate.department ||
          definition.managerRoleKey !==
            candidate.managerRoleKey ||
          definition.launchSequence !==
            candidate.proposedLaunchSequence ||
          record.templateId !==
            candidate.templateId ||
          record.employeeId !==
            candidate.employeeId ||
          record.employeeCode !==
            candidate.employeeCode ||
          record.publicName !==
            candidate.publicName ||
          record.officialRole !==
            candidate.officialRole ||
          record.launchSequence !==
            candidate.proposedLaunchSequence ||
          record.status !==
            "REGISTERED_UNQUALIFIED" ||
          record.controlledActivationEligible !==
            false ||
          record.manifest.evaluation.status !==
            "UNQUALIFIED" ||
          record.manifest.evaluation.testCasesPassed !==
            0 ||
          record.manifest.evaluation.testCasesRequired !==
            100
        ) {
          throw new Error(
            "Engineering template creation did not preserve the exact approved candidate identity and blocked qualification state.",
          );
        }
      },
    );

  const evidence =
    execution.creationEvidence;

  const founder =
    execution.founderLiberationEvidence;

  const boundary =
    execution.authorityBoundary;

  if (
    evidence.exactEightTemplatesCreated !==
      true ||
    evidence.exactPlannedIdentitiesPreserved !==
      true ||
    evidence.exactLaunchSequencesPreserved !==
      true ||
    evidence.engineeringSkillBindingsApplied !==
      true ||
    evidence.engineeringToolBindingsApplied !==
      true ||
    evidence.ownerEscalationSkillApplied !==
      true ||
    evidence.immutableTemplateRegistryCreated !==
      true ||
    evidence.everyTemplateUnqualified !==
      true ||
    evidence.everyTemplateActivationBlocked !==
      true ||
    evidence.factoryLifecycleMutationPerformed !==
      false ||
    founder.engineeringTemplateFoundationCreated !==
      true ||
    founder.routineEngineeringOperationDelegated !==
      false ||
    founder.founderLiberationAchieved !==
      false ||
    founder.ownerRetainsFinalProductAuthority !==
      true ||
    founder.ownerRetainsMergeAuthority !==
      true ||
    founder.ownerRetainsProductionDeploymentAuthority !==
      true ||
    boundary.sourceOwnerApprovalBound !==
      true ||
    boundary.templateCreationExecuted !==
      true ||
    boundary.employeeTemplateRegistryMutationPerformed !==
      true ||
    boundary.factoryLifecycleTransitionAuthorized !==
      false ||
    boundary.factoryLifecycleTransitionPerformed !==
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
      false ||
    execution.nextStep !==
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_DECISION"
  ) {
    throw new Error(
      "Engineering template-creation authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(execution) ||
    !Object.isFrozen(
      execution.createdTemplates,
    ) ||
    !Object.isFrozen(
      execution.templateRegistry,
    )
  ) {
    throw new Error(
      "Engineering template-creation evidence must remain immutable.",
    );
  }

  const {
    executionDigest,
    ...executionCore
  } = execution;

  if (
    executionDigest !==
      sha256(executionCore)
  ) {
    throw new Error(
      "Engineering template-creation execution integrity is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceTemplateCreationExecution(
  input:
    CreateEngineeringAIWorkforceTemplateCreationExecutionInput,
): EngineeringAIWorkforceTemplateCreationExecution {
  requireIdentifier(
    "Engineering template-creation execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Engineering template-creation execution time",
    input.executedAt,
  );

  const decision =
    input.approvalDecision;

  validateEngineeringAIWorkforceTemplateCreationDecision(
    decision,
  );

  if (
    decision.decision !==
      "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION" ||
    decision.templateCreationApproved !==
      true ||
    decision.templateCreationExecutionAuthorized !==
      true ||
    decision.authorityBoundary
      .templateCreationExecutionAuthorized !==
      true ||
    decision.authorityBoundary
      .templateCreationPerformed !==
      false ||
    decision.authorityBoundary
      .employeeTemplateRegistryMutationPerformed !==
      false ||
    decision.authorityBoundary
      .factoryLifecycleTransitionAuthorized !==
      false ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION"
  ) {
    throw new Error(
      "Approved Engineering template-creation evidence is required.",
    );
  }

  if (
    decision.sourcePlanningId !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN.planningId ||
    decision.sourcePlanningDigest !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN.planningDigest ||
    decision.sourceExpandedRegistryDigest !==
      ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY.registryDigest ||
    decision.candidateTemplateCreationEligibility.length !==
      8
  ) {
    throw new Error(
      "Engineering template approval is not bound to the exact planning and registry evidence.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Engineering template creation cannot precede owner approval.",
    );
  }

  const createdTemplates:
    readonly AIEmployeeTemplateDefinition[] =
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
        .proposedTemplates.map(
          (
            candidate,
            index,
          ) =>
            createTemplateDefinition(
              candidate,
              index,
              input.executedAt,
            ),
        );

  const templateRegistry =
    createAIEmployeeTemplateRegistry({
      templates:
        createdTemplates,
      skillToolRegistry:
        ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY,
      createdAt:
        input.executedAt,
    });

  if (
    templateRegistry.qualifiedTemplateCount !==
      0 ||
    templateRegistry.activationEligibleTemplateCount !==
      0 ||
    templateRegistry.templates.some(
      (template) =>
        template.status !==
          "REGISTERED_UNQUALIFIED" ||
        template.controlledActivationEligible !==
          false,
    )
  ) {
    throw new Error(
      "New Engineering templates must remain unqualified and activation-blocked.",
    );
  }

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION_VERSION,
    executionId:
      input.executionId,
    executionState:
      "OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourcePlanningId:
      decision.sourcePlanningId,
    sourcePlanningDigest:
      decision.sourcePlanningDigest,
    sourceExpandedRegistryDigest:
      decision.sourceExpandedRegistryDigest,
    createdTemplateCount:
      8 as const,
    createdTemplates,
    templateRegistry,
    templateRegistryDigest:
      templateRegistry.registryDigest,
    creationEvidence: {
      exactEightTemplatesCreated:
        true as const,
      exactPlannedIdentitiesPreserved:
        true as const,
      exactLaunchSequencesPreserved:
        true as const,
      engineeringSkillBindingsApplied:
        true as const,
      engineeringToolBindingsApplied:
        true as const,
      ownerEscalationSkillApplied:
        true as const,
      immutableTemplateRegistryCreated:
        true as const,
      everyTemplateUnqualified:
        true as const,
      everyTemplateActivationBlocked:
        true as const,
      factoryLifecycleMutationPerformed:
        false as const,
    },
    founderLiberationEvidence: {
      engineeringTemplateFoundationCreated:
        true as const,
      routineEngineeringOperationDelegated:
        false as const,
      founderLiberationAchieved:
        false as const,
      ownerRetainsFinalProductAuthority:
        true as const,
      ownerRetainsMergeAuthority:
        true as const,
      ownerRetainsProductionDeploymentAuthority:
        true as const,
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
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_DECISION" as const,
    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,
      executionDigest:
        sha256(executionCore),
    }) as EngineeringAIWorkforceTemplateCreationExecution;

  validateEngineeringAIWorkforceTemplateCreationExecution(
    execution,
  );

  return execution;
}

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION =
  createEngineeringAIWorkforceTemplateCreationExecution({
    executionId:
      "engineering-ai-workforce-template-creation-execution-001",
    approvalDecision:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION,
    executedAt:
      "2026-07-22T17:31:06.182Z",
  });

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY =
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
    .templateRegistry;
