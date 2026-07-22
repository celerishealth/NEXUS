import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "./aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
  type EngineeringAIWorkforceDevelopmentPlan,
  validateEngineeringAIWorkforceDevelopmentPlan,
} from "./engineeringAIWorkforceDevelopmentPlan";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "./engineeringAIWorkforceTemplatePreparationPlan";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
  type EngineeringAIWorkforceTemplateCreationExecution,
  validateEngineeringAIWorkforceTemplateCreationExecution,
} from "./engineeringAIWorkforceTemplateCreationExecution";

export const ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-factory-lifecycle-transition-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_DECISIONS =
  [
    "APPROVE_ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION",
    "REJECT_AND_RETAIN_ENGINEERING_FACTORY_CANDIDATES_PLANNED",
  ] as const;

export type EngineeringAIWorkforceFactoryLifecycleTransitionDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceFactoryLifecycleTransitionDecisionInput {
  readonly developmentPlan:
    EngineeringAIWorkforceDevelopmentPlan;
  readonly templateCreationExecution:
    EngineeringAIWorkforceTemplateCreationExecution;
  readonly decisionId: string;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    EngineeringAIWorkforceFactoryLifecycleTransitionDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceFactoryLifecycleTransitionEligibility {
  readonly developmentSequence: number;
  readonly factoryRecordId: string;
  readonly factoryRecordDigest: string;
  readonly templateId: string;
  readonly templateDigest: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly sourceLifecycleState:
    "PLANNED_CANDIDATE";
  readonly targetLifecycleState:
    "TEMPLATE_PREPARATION_PENDING";
  readonly templateCreationEvidenceBound:
    true;
  readonly lifecycleTransitionAuthorized:
    boolean;
  readonly lifecycleTransitionExecuted:
    false;
  readonly templatePrepared: false;
  readonly qualificationAdmissionAuthorized:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly ownerQualificationApproved:
    false;
  readonly activationCandidatePrepared:
    false;
  readonly ownerActivationApproved:
    false;
  readonly runtimeAuthorized: false;
}

export interface EngineeringAIWorkforceFactoryLifecycleTransitionDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_DECISION_RECORDED";
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly sourceDevelopmentPlanningId:
    string;
  readonly sourceDevelopmentPlanningDigest:
    string;
  readonly sourceFactoryFoundationDigest:
    string;
  readonly sourceTemplateCreationExecutionId:
    string;
  readonly sourceTemplateCreationExecutionDigest:
    string;
  readonly sourceTemplateRegistryDigest:
    string;
  readonly decision:
    EngineeringAIWorkforceFactoryLifecycleTransitionDecisionType;
  readonly lifecycleTransitionApproved:
    boolean;
  readonly reason: string;
  readonly reviewedEvidence: Readonly<{
    candidateCount: 8;
    createdTemplateCount: 8;
    registeredTemplateCount: 8;
    qualifiedTemplateCount: 0;
    activationEligibleTemplateCount:
      0;
    sourceLifecycleState:
      "PLANNED_CANDIDATE";
    targetLifecycleState:
      "TEMPLATE_PREPARATION_PENDING";
    allowedSequentialTransitionVerified:
      true;
    directTemplatePreparedBypassBlocked:
      true;
    exactCandidateIdentityBindingVerified:
      true;
    immutableTemplateEvidenceVerified:
      true;
    founderLiberationAchieved:
      false;
  }>;
  readonly candidateTransitionEligibility:
    readonly EngineeringAIWorkforceFactoryLifecycleTransitionEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourceDevelopmentPlanBound:
      true;
    sourceTemplateCreationExecutionBound:
      true;
    approvalBypassAllowed: false;
    exactEightTransitionsRequired:
      true;
    lifecycleTransitionAuthorized:
      boolean;
    sourceLifecycleStateLocked:
      true;
    targetLifecycleStateLocked:
      true;
    directTemplatePreparedTransitionAuthorized:
      false;
    lifecycleTransitionExecuted:
      false;
    templatePrepared: false;
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
    | "APPLY_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION"
    | "RETAIN_ENGINEERING_FACTORY_CANDIDATES_PLANNED";
  readonly decidedAt: string;
  readonly decisionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

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
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value.trim().length < 30 ||
    value.trim().length > 2000
  ) {
    throw new Error(
      "Engineering lifecycle-transition decision reason must contain between 30 and 2000 characters.",
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
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
      `${label} must remain unique.`,
    );
  }
}

export function validateEngineeringAIWorkforceFactoryLifecycleTransitionDecision(
  record:
    EngineeringAIWorkforceFactoryLifecycleTransitionDecision,
): void {
  validateEngineeringAIWorkforceDevelopmentPlan(
    ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
  );

  validateEngineeringAIWorkforceTemplateCreationExecution(
    ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
  );

  requireIdentifier(
    "Engineering lifecycle-transition decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering lifecycle-transition owner ID",
    record.ownerId,
  );

  requireReason(record.reason);

  requireTimestamp(
    "Engineering lifecycle-transition decision time",
    record.decidedAt,
  );

  requireDigest(
    "Engineering lifecycle-transition source development-plan digest",
    record.sourceDevelopmentPlanningDigest,
  );

  requireDigest(
    "Engineering lifecycle-transition source factory-foundation digest",
    record.sourceFactoryFoundationDigest,
  );

  requireDigest(
    "Engineering lifecycle-transition source template-creation digest",
    record.sourceTemplateCreationExecutionDigest,
  );

  requireDigest(
    "Engineering lifecycle-transition source template-registry digest",
    record.sourceTemplateRegistryDigest,
  );

  requireDigest(
    "Engineering lifecycle-transition decision digest",
    record.decisionDigest,
  );

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION";

  const sourcePlan =
    ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN;

  const sourceExecution =
    ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION;

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_DECISION_RECORDED" ||
    record.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.sourceDevelopmentPlanningId !==
      sourcePlan.planningId ||
    record.sourceDevelopmentPlanningDigest !==
      sourcePlan.planningDigest ||
    record.sourceFactoryFoundationDigest !==
      sourcePlan.sourceFactoryDigest ||
    record.sourceTemplateCreationExecutionId !==
      sourceExecution.executionId ||
    record.sourceTemplateCreationExecutionDigest !==
      sourceExecution.executionDigest ||
    record.sourceTemplateRegistryDigest !==
      sourceExecution.templateRegistryDigest ||
    record.lifecycleTransitionApproved !==
      approved ||
    record.candidateTransitionEligibility.length !==
      8
  ) {
    throw new Error(
      "Engineering lifecycle-transition decision identity is invalid.",
    );
  }

  if (
    !AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .PLANNED_CANDIDATE.includes(
        "TEMPLATE_PREPARATION_PENDING",
      ) ||
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .PLANNED_CANDIDATE.includes(
        "TEMPLATE_PREPARED" as
          "TEMPLATE_PREPARATION_PENDING",
      )
  ) {
    throw new Error(
      "Engineering lifecycle-transition decision does not preserve the sequential Factory lifecycle.",
    );
  }

  const reviewed =
    record.reviewedEvidence;

  if (
    reviewed.candidateCount !==
      8 ||
    reviewed.createdTemplateCount !==
      8 ||
    reviewed.registeredTemplateCount !==
      8 ||
    reviewed.qualifiedTemplateCount !==
      0 ||
    reviewed.activationEligibleTemplateCount !==
      0 ||
    reviewed.sourceLifecycleState !==
      "PLANNED_CANDIDATE" ||
    reviewed.targetLifecycleState !==
      "TEMPLATE_PREPARATION_PENDING" ||
    reviewed.allowedSequentialTransitionVerified !==
      true ||
    reviewed.directTemplatePreparedBypassBlocked !==
      true ||
    reviewed.exactCandidateIdentityBindingVerified !==
      true ||
    reviewed.immutableTemplateEvidenceVerified !==
      true ||
    reviewed.founderLiberationAchieved !==
      false
  ) {
    throw new Error(
      "Engineering lifecycle-transition reviewed evidence is invalid.",
    );
  }

  record.candidateTransitionEligibility.forEach(
    (
      candidate,
      index,
    ) => {
      const sourceCandidate =
        sourcePlan.plannedCandidates[
          index
        ];

      const sourceTemplate =
        sourceExecution.templateRegistry
          .templates[index];

      if (
        !sourceCandidate ||
        !sourceTemplate ||
        candidate.developmentSequence !==
          index + 1 ||
        candidate.factoryRecordId !==
          sourceCandidate.sourceFactoryRecordId ||
        candidate.factoryRecordDigest !==
          sourceCandidate.sourceFactoryRecordDigest ||
        candidate.templateId !==
          sourceTemplate.templateId ||
        candidate.templateDigest !==
          sourceTemplate.templateDigest ||
        candidate.employeeId !==
          sourceCandidate.employeeId ||
        candidate.employeeId !==
          sourceTemplate.employeeId ||
        candidate.employeeCode !==
          sourceCandidate.employeeCode ||
        candidate.employeeCode !==
          sourceTemplate.employeeCode ||
        candidate.publicName !==
          sourceCandidate.publicName ||
        candidate.publicName !==
          sourceTemplate.publicName ||
        candidate.officialRole !==
          sourceCandidate.officialRole ||
        candidate.officialRole !==
          sourceTemplate.officialRole ||
        candidate.sourceLifecycleState !==
          "PLANNED_CANDIDATE" ||
        candidate.targetLifecycleState !==
          "TEMPLATE_PREPARATION_PENDING" ||
        candidate.templateCreationEvidenceBound !==
          true ||
        candidate.lifecycleTransitionAuthorized !==
          approved ||
        candidate.lifecycleTransitionExecuted !==
          false ||
        candidate.templatePrepared !==
          false ||
        candidate.qualificationAdmissionAuthorized !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.ownerQualificationApproved !==
          false ||
        candidate.activationCandidatePrepared !==
          false ||
        candidate.ownerActivationApproved !==
          false ||
        candidate.runtimeAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering lifecycle-transition candidate evidence is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Engineering lifecycle-transition factory-record IDs",
    record.candidateTransitionEligibility.map(
      (candidate) =>
        candidate.factoryRecordId,
    ),
  );

  requireUnique(
    "Engineering lifecycle-transition employee IDs",
    record.candidateTransitionEligibility.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Engineering lifecycle-transition employee codes",
    record.candidateTransitionEligibility.map(
      (candidate) =>
        candidate.employeeCode,
    ),
  );

  requireUnique(
    "Engineering lifecycle-transition template IDs",
    record.candidateTransitionEligibility.map(
      (candidate) =>
        candidate.templateId,
    ),
  );

  const boundary =
    record.authorityBoundary;

  if (
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.sourceDevelopmentPlanBound !==
      true ||
    boundary.sourceTemplateCreationExecutionBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.exactEightTransitionsRequired !==
      true ||
    boundary.lifecycleTransitionAuthorized !==
      approved ||
    boundary.sourceLifecycleStateLocked !==
      true ||
    boundary.targetLifecycleStateLocked !==
      true ||
    boundary.directTemplatePreparedTransitionAuthorized !==
      false ||
    boundary.lifecycleTransitionExecuted !==
      false ||
    boundary.templatePrepared !==
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
      "Engineering lifecycle-transition authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "APPLY_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION"
      : "RETAIN_ENGINEERING_FACTORY_CANDIDATES_PLANNED";

  if (
    record.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Engineering lifecycle-transition next step is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.candidateTransitionEligibility,
    )
  ) {
    throw new Error(
      "Engineering lifecycle-transition decision evidence must remain immutable.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    decisionDigest !==
      sha256(decisionCore)
  ) {
    throw new Error(
      "Engineering lifecycle-transition decision integrity is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceFactoryLifecycleTransitionDecision(
  input:
    CreateEngineeringAIWorkforceFactoryLifecycleTransitionDecisionInput,
): EngineeringAIWorkforceFactoryLifecycleTransitionDecision {
  validateEngineeringAIWorkforceDevelopmentPlan(
    input.developmentPlan,
  );

  validateEngineeringAIWorkforceTemplateCreationExecution(
    input.templateCreationExecution,
  );

  requireIdentifier(
    "Engineering lifecycle-transition decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Engineering lifecycle-transition owner ID",
    input.ownerId,
  );

  requireReason(input.reason);

  requireTimestamp(
    "Engineering lifecycle-transition decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the Engineering Factory lifecycle-transition decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION" &&
    input.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_FACTORY_CANDIDATES_PLANNED"
  ) {
    throw new Error(
      "Engineering Factory lifecycle-transition owner decision is invalid.",
    );
  }

  const sourcePlan =
    input.developmentPlan;

  const sourceExecution =
    input.templateCreationExecution;

  if (
    sourcePlan !==
      ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN ||
    sourceExecution !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION ||
    sourceExecution.sourcePlanningId !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN.planningId ||
    sourceExecution.sourcePlanningDigest !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN.planningDigest ||
    sourceExecution.createdTemplateCount !==
      8 ||
    sourceExecution.templateRegistry.registeredTemplateCount !==
      8 ||
    sourceExecution.templateRegistry.qualifiedTemplateCount !==
      0 ||
    sourceExecution.templateRegistry.activationEligibleTemplateCount !==
      0 ||
    sourceExecution.authorityBoundary
      .factoryLifecycleTransitionAuthorized !==
      false ||
    sourceExecution.authorityBoundary
      .factoryLifecycleTransitionPerformed !==
      false ||
    sourceExecution.nextStep !==
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_DECISION"
  ) {
    throw new Error(
      "Engineering Factory lifecycle-transition decision requires the exact completed template-creation evidence.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(sourceExecution.executedAt)
  ) {
    throw new Error(
      "Engineering Factory lifecycle-transition decision cannot precede template creation.",
    );
  }

  if (
    !AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .PLANNED_CANDIDATE.includes(
        "TEMPLATE_PREPARATION_PENDING",
      )
  ) {
    throw new Error(
      "The required first Engineering Factory lifecycle transition is not allowed.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION";

  const candidateTransitionEligibility =
    sourcePlan.plannedCandidates.map(
      (
        candidate,
        index,
      ) => {
        const template =
          sourceExecution.templateRegistry
            .templates[index];

        if (
          !template ||
          candidate.sourceLifecycleState !==
            "PLANNED_CANDIDATE" ||
          candidate.employeeId !==
            template.employeeId ||
          candidate.employeeCode !==
            template.employeeCode ||
          candidate.publicName !==
            template.publicName ||
          candidate.officialRole !==
            template.officialRole ||
          template.status !==
            "REGISTERED_UNQUALIFIED" ||
          template.controlledActivationEligible !==
            false
        ) {
          throw new Error(
            "Engineering Factory transition candidate is not bound to the exact unqualified template evidence.",
          );
        }

        return {
          developmentSequence:
            index + 1,
          factoryRecordId:
            candidate.sourceFactoryRecordId,
          factoryRecordDigest:
            candidate.sourceFactoryRecordDigest,
          templateId:
            template.templateId,
          templateDigest:
            template.templateDigest,
          employeeId:
            candidate.employeeId,
          employeeCode:
            candidate.employeeCode,
          publicName:
            candidate.publicName,
          officialRole:
            candidate.officialRole,
          sourceLifecycleState:
            "PLANNED_CANDIDATE" as const,
          targetLifecycleState:
            "TEMPLATE_PREPARATION_PENDING" as const,
          templateCreationEvidenceBound:
            true as const,
          lifecycleTransitionAuthorized:
            approved,
          lifecycleTransitionExecuted:
            false as const,
          templatePrepared:
            false as const,
          qualificationAdmissionAuthorized:
            false as const,
          qualificationExecutionAuthorized:
            false as const,
          ownerQualificationApproved:
            false as const,
          activationCandidatePrepared:
            false as const,
          ownerActivationApproved:
            false as const,
          runtimeAuthorized:
            false as const,
        };
      },
    );

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourceDevelopmentPlanningId:
      sourcePlan.planningId,
    sourceDevelopmentPlanningDigest:
      sourcePlan.planningDigest,
    sourceFactoryFoundationDigest:
      sourcePlan.sourceFactoryDigest,
    sourceTemplateCreationExecutionId:
      sourceExecution.executionId,
    sourceTemplateCreationExecutionDigest:
      sourceExecution.executionDigest,
    sourceTemplateRegistryDigest:
      sourceExecution.templateRegistryDigest,
    decision:
      input.decision,
    lifecycleTransitionApproved:
      approved,
    reason:
      input.reason,
    reviewedEvidence: {
      candidateCount:
        8 as const,
      createdTemplateCount:
        8 as const,
      registeredTemplateCount:
        8 as const,
      qualifiedTemplateCount:
        0 as const,
      activationEligibleTemplateCount:
        0 as const,
      sourceLifecycleState:
        "PLANNED_CANDIDATE" as const,
      targetLifecycleState:
        "TEMPLATE_PREPARATION_PENDING" as const,
      allowedSequentialTransitionVerified:
        true as const,
      directTemplatePreparedBypassBlocked:
        true as const,
      exactCandidateIdentityBindingVerified:
        true as const,
      immutableTemplateEvidenceVerified:
        true as const,
      founderLiberationAchieved:
        false as const,
    },
    candidateTransitionEligibility,
    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourceDevelopmentPlanBound:
        true as const,
      sourceTemplateCreationExecutionBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      exactEightTransitionsRequired:
        true as const,
      lifecycleTransitionAuthorized:
        approved,
      sourceLifecycleStateLocked:
        true as const,
      targetLifecycleStateLocked:
        true as const,
      directTemplatePreparedTransitionAuthorized:
        false as const,
      lifecycleTransitionExecuted:
        false as const,
      templatePrepared:
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
        ? "APPLY_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION" as const
        : "RETAIN_ENGINEERING_FACTORY_CANDIDATES_PLANNED" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceFactoryLifecycleTransitionDecision;

  validateEngineeringAIWorkforceFactoryLifecycleTransitionDecision(
    decision,
  );

  return decision;
}
