import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
  validateEngineeringAIWorkforceDevelopmentPlan,
  type EngineeringAIWorkforceDevelopmentPlan,
} from "./engineeringAIWorkforceDevelopmentPlan";

export const ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION_VERSION =
  "nexus-engineering-ai-workforce-development-plan-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_OWNER_ID =
  "owner-prashant-001" as const;

export const ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISIONS = [
  "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN",
  "REJECT_AND_RETAIN_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNING",
] as const;

export type EngineeringAIWorkforceDevelopmentPlanDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceDevelopmentPlanDecisionInput {
  readonly developmentPlan:
    EngineeringAIWorkforceDevelopmentPlan;
  readonly decisionId: string;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    EngineeringAIWorkforceDevelopmentPlanDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceCandidateDevelopmentEligibility {
  readonly developmentSequence: number;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly templatePreparationPlanEligible:
    boolean;
  readonly templatePreparationAuthorized:
    false;
  readonly qualificationAdmissionAuthorized:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly ownerQualificationApprovalRecorded:
    false;
  readonly activationCandidatePreparationAuthorized:
    false;
  readonly ownerActivationAuthorized:
    false;
  readonly runtimeActivationAuthorized:
    false;
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
  readonly controlledWorkAuthorized:
    false;
}

export interface EngineeringAIWorkforceDevelopmentPlanDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION_RECORDED";
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest: string;
  readonly sourceRosterDigest: string;
  readonly sourceFactoryDigest: string;
  readonly sourceDirectorPlanningDigest:
    string;
  readonly decision:
    EngineeringAIWorkforceDevelopmentPlanDecisionType;
  readonly developmentPlanApproved:
    boolean;
  readonly templatePreparationPlanEligible:
    boolean;
  readonly reason: string;
  readonly reviewedPlan: Readonly<{
    planningState:
      "OWNER_CONTROLLED_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNED";
    plannedEngineeringEmployeeCount:
      8;
    directorFirstWaveEngineeringOverlapCount:
      5;
    engineeringSpecialistExtensionCount:
      3;
    plannedEmployeeCodes:
      readonly string[];
    developmentSequence:
      readonly number[];
    sourceOwnerEngineeringPlanDecisionRequired:
      true;
    sourceOwnerEngineeringPlanDecisionRecorded:
      false;
    sourceNextStep:
      "AWAIT_OWNER_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION";
  }>;
  readonly candidateDevelopmentEligibility:
    readonly EngineeringAIWorkforceCandidateDevelopmentEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourcePlanningBound: true;
    approvalBypassAllowed: false;
    templatePreparationPlanEligible:
      boolean;
    rosterMutationAuthorized: false;
    factoryLifecycleTransitionAuthorized:
      false;
    templatePreparationAuthorized:
      false;
    qualificationAdmissionAuthorized:
      false;
    qualificationExecutionAuthorized:
      false;
    ownerQualificationApprovalRecorded:
      false;
    activationCandidatePreparationAuthorized:
      false;
    ownerActivationAuthorized: false;
    runtimeActivationAuthorized: false;
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
    | "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLAN"
    | "RETAIN_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNING_ONLY";
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
        "Unsupported deterministic Engineering Workforce owner-decision value.",
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
    reason.length < 20 ||
    reason.length > 1000 ||
    /[\u0000-\u001f\u007f]/.test(
      reason,
    )
  ) {
    throw new Error(
      "Engineering Workforce owner-decision reason must be a canonical explanation between 20 and 1000 characters.",
    );
  }
}

function requireExactIsoTimestamp(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp)
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

export function validateEngineeringAIWorkforceDevelopmentPlanDecision(
  record:
    EngineeringAIWorkforceDevelopmentPlanDecision,
): void {
  const {
    decisionDigest,
    ...unsignedRecord
  } = record;

  requireDigest(
    "Engineering Workforce decision digest",
    decisionDigest,
  );

  if (
    sha256(unsignedRecord) !==
    decisionDigest
  ) {
    throw new Error(
      "Engineering Workforce owner decision digest verification failed.",
    );
  }

  requireIdentifier(
    "Engineering Workforce decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering Workforce source planning ID",
    record.sourcePlanningId,
  );

  requireDigest(
    "Engineering Workforce source planning digest",
    record.sourcePlanningDigest,
  );

  requireDigest(
    "Engineering Workforce source roster digest",
    record.sourceRosterDigest,
  );

  requireDigest(
    "Engineering Workforce source factory digest",
    record.sourceFactoryDigest,
  );

  requireDigest(
    "Engineering Workforce source Director planning digest",
    record.sourceDirectorPlanningDigest,
  );

  requireReason(
    record.reason,
  );

  requireExactIsoTimestamp(
    "Engineering Workforce decision time",
    record.decidedAt,
  );

  const source =
    ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN;

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION_RECORDED" ||
    record.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.sourcePlanningId !==
      source.planningId ||
    record.sourcePlanningDigest !==
      source.planningDigest ||
    record.sourceRosterDigest !==
      source.sourceRosterDigest ||
    record.sourceFactoryDigest !==
      source.sourceFactoryDigest ||
    record.sourceDirectorPlanningDigest !==
      source.sourceDirectorPlanningDigest
  ) {
    throw new Error(
      "Engineering Workforce owner-decision identity is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNING"
  ) {
    throw new Error(
      "Engineering Workforce owner decision is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN";

  if (
    record.developmentPlanApproved !==
      approved ||
    record.templatePreparationPlanEligible !==
      approved
  ) {
    throw new Error(
      "Engineering Workforce owner-decision approval state is invalid.",
    );
  }

  const reviewedPlan =
    record.reviewedPlan;

  if (
    reviewedPlan.planningState !==
      "OWNER_CONTROLLED_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNED" ||
    reviewedPlan.plannedEngineeringEmployeeCount !==
      8 ||
    reviewedPlan.directorFirstWaveEngineeringOverlapCount !==
      5 ||
    reviewedPlan.engineeringSpecialistExtensionCount !==
      3 ||
    reviewedPlan.plannedEmployeeCodes.length !==
      8 ||
    reviewedPlan.developmentSequence.length !==
      8 ||
    reviewedPlan.sourceOwnerEngineeringPlanDecisionRequired !==
      true ||
    reviewedPlan.sourceOwnerEngineeringPlanDecisionRecorded !==
      false ||
    reviewedPlan.sourceNextStep !==
      "AWAIT_OWNER_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION" ||
    record.candidateDevelopmentEligibility.length !==
      8
  ) {
    throw new Error(
      "Engineering Workforce reviewed development plan is invalid.",
    );
  }

  record.candidateDevelopmentEligibility.forEach(
    (candidate, index) => {
      const expected =
        source.plannedCandidates[index];

      if (
        !expected ||
        candidate.developmentSequence !==
          index + 1 ||
        reviewedPlan.developmentSequence[index] !==
          index + 1 ||
        candidate.employeeId !==
          expected.employeeId ||
        candidate.employeeCode !==
          expected.employeeCode ||
        reviewedPlan.plannedEmployeeCodes[index] !==
          expected.employeeCode ||
        candidate.templatePreparationPlanEligible !==
          approved ||
        candidate.templatePreparationAuthorized !==
          false ||
        candidate.qualificationAdmissionAuthorized !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.ownerQualificationApprovalRecorded !==
          false ||
        candidate.activationCandidatePreparationAuthorized !==
          false ||
        candidate.ownerActivationAuthorized !==
          false ||
        candidate.runtimeActivationAuthorized !==
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
          false ||
        candidate.controlledWorkAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering Workforce candidate development eligibility is invalid.",
        );
      }
    },
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
    boundary.templatePreparationPlanEligible !==
      approved ||
    boundary.rosterMutationAuthorized !==
      false ||
    boundary.factoryLifecycleTransitionAuthorized !==
      false ||
    boundary.templatePreparationAuthorized !==
      false ||
    boundary.qualificationAdmissionAuthorized !==
      false ||
    boundary.qualificationExecutionAuthorized !==
      false ||
    boundary.ownerQualificationApprovalRecorded !==
      false ||
    boundary.activationCandidatePreparationAuthorized !==
      false ||
    boundary.ownerActivationAuthorized !==
      false ||
    boundary.runtimeActivationAuthorized !==
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
      "Engineering Workforce owner-decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLAN"
      : "RETAIN_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNING_ONLY";

  if (
    record.nextStep !==
    expectedNextStep
  ) {
    throw new Error(
      "Engineering Workforce owner-decision next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceDevelopmentPlanDecision(
  input:
    CreateEngineeringAIWorkforceDevelopmentPlanDecisionInput,
): EngineeringAIWorkforceDevelopmentPlanDecision {
  const source =
    input.developmentPlan;

  validateEngineeringAIWorkforceDevelopmentPlan(
    source,
  );

  requireIdentifier(
    "Engineering Workforce decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Engineering Workforce owner ID",
    input.ownerId,
  );

  requireReason(
    input.reason,
  );

  requireExactIsoTimestamp(
    "Engineering Workforce decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the Engineering Workforce development-plan decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN" &&
    input.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNING"
  ) {
    throw new Error(
      "Engineering Workforce owner decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Engineering Workforce owner decision cannot precede development planning.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourcePlanningId:
      source.planningId,
    sourcePlanningDigest:
      source.planningDigest,
    sourceRosterDigest:
      source.sourceRosterDigest,
    sourceFactoryDigest:
      source.sourceFactoryDigest,
    sourceDirectorPlanningDigest:
      source.sourceDirectorPlanningDigest,
    decision:
      input.decision,
    developmentPlanApproved:
      approved,
    templatePreparationPlanEligible:
      approved,
    reason:
      input.reason,
    reviewedPlan: {
      planningState:
        source.planningState,
      plannedEngineeringEmployeeCount:
        source.plannedEngineeringEmployeeCount,
      directorFirstWaveEngineeringOverlapCount:
        source.directorFirstWaveEngineeringOverlapCount,
      engineeringSpecialistExtensionCount:
        source.engineeringSpecialistExtensionCount,
      plannedEmployeeCodes:
        source.plannedCandidates.map(
          (candidate) =>
            candidate.employeeCode,
        ),
      developmentSequence:
        source.developmentSequence,
      sourceOwnerEngineeringPlanDecisionRequired:
        source.ownerEngineeringPlanDecisionRequired,
      sourceOwnerEngineeringPlanDecisionRecorded:
        source.ownerEngineeringPlanDecisionRecorded,
      sourceNextStep:
        source.nextStep,
    },
    candidateDevelopmentEligibility:
      source.plannedCandidates.map(
        (candidate) => ({
          developmentSequence:
            candidate.developmentSequence,
          employeeId:
            candidate.employeeId,
          employeeCode:
            candidate.employeeCode,
          templatePreparationPlanEligible:
            approved,
          templatePreparationAuthorized:
            false as const,
          qualificationAdmissionAuthorized:
            false as const,
          qualificationExecutionAuthorized:
            false as const,
          ownerQualificationApprovalRecorded:
            false as const,
          activationCandidatePreparationAuthorized:
            false as const,
          ownerActivationAuthorized:
            false as const,
          runtimeActivationAuthorized:
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
      templatePreparationPlanEligible:
        approved,
      rosterMutationAuthorized:
        false as const,
      factoryLifecycleTransitionAuthorized:
        false as const,
      templatePreparationAuthorized:
        false as const,
      qualificationAdmissionAuthorized:
        false as const,
      qualificationExecutionAuthorized:
        false as const,
      ownerQualificationApprovalRecorded:
        false as const,
      activationCandidatePreparationAuthorized:
        false as const,
      ownerActivationAuthorized:
        false as const,
      runtimeActivationAuthorized:
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
        ? "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLAN" as const
        : "RETAIN_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNING_ONLY" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceDevelopmentPlanDecision;

  validateEngineeringAIWorkforceDevelopmentPlanDecision(
    decision,
  );

  return decision;
}
