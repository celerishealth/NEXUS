import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "./aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
  type EngineeringAIWorkforceFactoryLifecycleTransitionExecution,
  validateEngineeringAIWorkforceFactoryLifecycleTransitionExecution,
} from "./engineeringAIWorkforceFactoryLifecycleTransitionExecution";

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-template-prepared-transition-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_DECISIONS = [
  "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION",
  "REJECT_AND_RETAIN_ENGINEERING_TEMPLATES_PREPARATION_PENDING",
] as const;

export type EngineeringAIWorkforceTemplatePreparedTransitionDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceTemplatePreparedTransitionDecisionInput {
  readonly lifecycleTransitionExecution:
    EngineeringAIWorkforceFactoryLifecycleTransitionExecution;
  readonly decisionId: string;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    EngineeringAIWorkforceTemplatePreparedTransitionDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceTemplatePreparedTransitionEligibility {
  readonly developmentSequence: number;
  readonly sourceTransitionRecordId:
    string;
  readonly sourceTransitionRecordDigest:
    string;
  readonly sourceFactoryRecordId:
    string;
  readonly sourceFactoryRecordDigest:
    string;
  readonly templateId: string;
  readonly templateDigest: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly sourceLifecycleState:
    "TEMPLATE_PREPARATION_PENDING";
  readonly targetLifecycleState:
    "TEMPLATE_PREPARED";
  readonly sourcePendingTransitionExecuted:
    true;
  readonly sourceFactoryRecordPreserved:
    true;
  readonly templateEvidenceBound: true;
  readonly templatePreparedTransitionAuthorized:
    boolean;
  readonly templatePreparedTransitionExecuted:
    false;
  readonly templatePrepared: false;
  readonly qualificationAdmissionAuthorized:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly qualificationEvidenceAccepted:
    false;
  readonly ownerQualificationApproved:
    false;
  readonly activationCandidatePrepared:
    false;
  readonly ownerActivationApproved:
    false;
  readonly runtimeAuthorized: false;
}

export interface EngineeringAIWorkforceTemplatePreparedTransitionDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_TEMPLATE_PREPARED_TRANSITION_DECISION_RECORDED";
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly sourceExecutionId: string;
  readonly sourceExecutionDigest: string;
  readonly sourceFactoryFoundationDigest:
    string;
  readonly decision:
    EngineeringAIWorkforceTemplatePreparedTransitionDecisionType;
  readonly templatePreparedTransitionApproved:
    boolean;
  readonly reason: string;
  readonly reviewedEvidence: Readonly<{
    transitionedCandidateCount: 8;
    sourceLifecycleState:
      "TEMPLATE_PREPARATION_PENDING";
    targetLifecycleState:
      "TEMPLATE_PREPARED";
    sourcePendingTransitionExecuted:
      true;
    allowedSequentialTransitionVerified:
      true;
    directQualificationBypassBlocked:
      true;
    exactCandidateIdentityBindingVerified:
      true;
    immutableTemplateEvidenceVerified:
      true;
    qualifiedTemplateCount: 0;
    activationEligibleTemplateCount: 0;
    founderLiberationAchieved: false;
  }>;
  readonly candidateTransitionEligibility:
    readonly EngineeringAIWorkforceTemplatePreparedTransitionEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourceExecutionBound: true;
    approvalBypassAllowed: false;
    exactEightTransitionsRequired: true;
    templatePreparedTransitionAuthorized:
      boolean;
    sourceLifecycleStateLocked: true;
    targetLifecycleStateLocked: true;
    templatePreparedTransitionExecuted:
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
    | "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION"
    | "RETAIN_ENGINEERING_TEMPLATES_PREPARATION_PENDING";
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
        "Unsupported deterministic Engineering template-prepared decision value.",
      );
    }

    return primitive;
  }

  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (entry) =>
            canonicalize(entry),
        )
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
          `${JSON.stringify(key)}:${canonicalize(record[key])}`,
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
    value.trim().length < 20
  ) {
    throw new Error(
      "Engineering template-prepared transition decision reason is too short.",
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

export function validateEngineeringAIWorkforceTemplatePreparedTransitionDecision(
  record:
    EngineeringAIWorkforceTemplatePreparedTransitionDecision,
): void {
  const source =
    ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

  validateEngineeringAIWorkforceFactoryLifecycleTransitionExecution(
    source,
  );

  requireIdentifier(
    "Engineering template-prepared transition decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering template-prepared source execution ID",
    record.sourceExecutionId,
  );

  requireDigest(
    "Engineering template-prepared source execution digest",
    record.sourceExecutionDigest,
  );

  requireDigest(
    "Engineering template-prepared source foundation digest",
    record.sourceFactoryFoundationDigest,
  );

  requireTimestamp(
    "Engineering template-prepared transition decision time",
    record.decidedAt,
  );

  requireReason(
    record.reason,
  );

  requireDigest(
    "Engineering template-prepared transition decision digest",
    record.decisionDigest,
  );

  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Engineering template-prepared transition decision integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_TEMPLATE_PREPARED_TRANSITION_DECISION_RECORDED" ||
    record.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    !ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_DECISIONS.includes(
      record.decision,
    ) ||
    record.sourceExecutionId !==
      source.executionId ||
    record.sourceExecutionDigest !==
      source.executionDigest ||
    record.sourceFactoryFoundationDigest !==
      source.sourceFactoryFoundationDigest ||
    record.templatePreparedTransitionApproved !==
      approved ||
    record.candidateTransitionEligibility.length !==
      8
  ) {
    throw new Error(
      "Engineering template-prepared transition decision identity is invalid.",
    );
  }

  if (
    Date.parse(record.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Engineering template-prepared transition decision cannot precede the pending transition execution.",
    );
  }

  const reviewed =
    record.reviewedEvidence;

  if (
    reviewed.transitionedCandidateCount !==
      8 ||
    reviewed.sourceLifecycleState !==
      "TEMPLATE_PREPARATION_PENDING" ||
    reviewed.targetLifecycleState !==
      "TEMPLATE_PREPARED" ||
    reviewed.sourcePendingTransitionExecuted !==
      true ||
    reviewed.allowedSequentialTransitionVerified !==
      true ||
    reviewed.directQualificationBypassBlocked !==
      true ||
    reviewed.exactCandidateIdentityBindingVerified !==
      true ||
    reviewed.immutableTemplateEvidenceVerified !==
      true ||
    reviewed.qualifiedTemplateCount !==
      0 ||
    reviewed.activationEligibleTemplateCount !==
      0 ||
    reviewed.founderLiberationAchieved !==
      false
  ) {
    throw new Error(
      "Reviewed Engineering template-prepared transition evidence is invalid.",
    );
  }

  record.candidateTransitionEligibility.forEach(
    (
      candidate,
      index,
    ) => {
      const sourceRecord =
        source.transitionRecords[index];

      if (
        !sourceRecord ||
        candidate.developmentSequence !==
          index + 1 ||
        candidate.sourceTransitionRecordId !==
          sourceRecord.transitionRecordId ||
        candidate.sourceTransitionRecordDigest !==
          sourceRecord.transitionRecordDigest ||
        candidate.sourceFactoryRecordId !==
          sourceRecord.sourceFactoryRecordId ||
        candidate.sourceFactoryRecordDigest !==
          sourceRecord.sourceFactoryRecordDigest ||
        candidate.templateId !==
          sourceRecord.templateId ||
        candidate.templateDigest !==
          sourceRecord.templateDigest ||
        candidate.employeeId !==
          sourceRecord.employeeId ||
        candidate.employeeCode !==
          sourceRecord.employeeCode ||
        candidate.publicName !==
          sourceRecord.publicName ||
        candidate.officialRole !==
          sourceRecord.officialRole ||
        candidate.sourceLifecycleState !==
          "TEMPLATE_PREPARATION_PENDING" ||
        candidate.targetLifecycleState !==
          "TEMPLATE_PREPARED" ||
        candidate.sourcePendingTransitionExecuted !==
          true ||
        candidate.sourceFactoryRecordPreserved !==
          true ||
        candidate.templateEvidenceBound !==
          true ||
        candidate.templatePreparedTransitionAuthorized !==
          approved ||
        candidate.templatePreparedTransitionExecuted !==
          false ||
        candidate.templatePrepared !==
          false ||
        candidate.qualificationAdmissionAuthorized !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.qualificationEvidenceAccepted !==
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
          "Engineering template-prepared transition candidate binding is invalid.",
        );
      }
    },
  );

  requireUnique(
    "Engineering template-prepared transition-record IDs",
    record.candidateTransitionEligibility.map(
      (candidate) =>
        candidate.sourceTransitionRecordId,
    ),
  );

  requireUnique(
    "Engineering template-prepared employee IDs",
    record.candidateTransitionEligibility.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Engineering template-prepared template IDs",
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
    boundary.sourceExecutionBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.exactEightTransitionsRequired !==
      true ||
    boundary.templatePreparedTransitionAuthorized !==
      approved ||
    boundary.sourceLifecycleStateLocked !==
      true ||
    boundary.targetLifecycleStateLocked !==
      true ||
    boundary.templatePreparedTransitionExecuted !==
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
      "Engineering template-prepared transition authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION"
      : "RETAIN_ENGINEERING_TEMPLATES_PREPARATION_PENDING";

  if (
    record.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Engineering template-prepared transition decision next step is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.candidateTransitionEligibility,
    )
  ) {
    throw new Error(
      "Engineering template-prepared transition decision must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceTemplatePreparedTransitionDecision(
  input:
    CreateEngineeringAIWorkforceTemplatePreparedTransitionDecisionInput,
): EngineeringAIWorkforceTemplatePreparedTransitionDecision {
  const source =
    input.lifecycleTransitionExecution;

  validateEngineeringAIWorkforceFactoryLifecycleTransitionExecution(
    source,
  );

  requireIdentifier(
    "Engineering template-prepared transition decision ID",
    input.decisionId,
  );

  requireReason(
    input.reason,
  );

  requireTimestamp(
    "Engineering template-prepared transition decision time",
    input.decidedAt,
  );

  if (
    source !==
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION ||
    source.nextStep !==
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION_DECISION" ||
    source.transitionedCandidateCount !==
      8 ||
    source.transitionRecords.length !==
      8 ||
    source.targetLifecycleState !==
      "TEMPLATE_PREPARATION_PENDING" ||
    source.authorityBoundary
      .templatePreparationPendingRecorded !==
      true ||
    source.authorityBoundary
      .templatePrepared !==
      false ||
    source.authorityBoundary
      .qualificationAdmissionAuthorized !==
      false ||
    source.authorityBoundary
      .runtimeAuthorized !==
      false
  ) {
    throw new Error(
      "Completed and safely bounded Engineering pending-transition execution is required.",
    );
  }

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner can issue the Engineering template-prepared transition decision.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Engineering template-prepared transition decision cannot precede the pending transition execution.",
    );
  }

  const allowedTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .TEMPLATE_PREPARATION_PENDING as readonly string[];

  if (
    !allowedTargets.includes(
      "TEMPLATE_PREPARED",
    )
  ) {
    throw new Error(
      "Engineering template-prepared transition is not a legal sequential Factory transition.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION";

  const candidateTransitionEligibility =
    source.transitionRecords.map(
      (
        transition,
        index,
      ) => {
        if (
          transition.sourceLifecycleState !==
            "PLANNED_CANDIDATE" ||
          transition.targetLifecycleState !==
            "TEMPLATE_PREPARATION_PENDING" ||
          transition.lifecycleTransitionExecuted !==
            true ||
          transition.sourceFactoryRecordPreserved !==
            true ||
          transition.templateCreationEvidenceBound !==
            true ||
          transition.templatePreparationExecutionAuthorized !==
            false ||
          transition.templatePrepared !==
            false ||
          transition.qualificationAdmissionAuthorized !==
            false ||
          transition.qualificationExecutionAuthorized !==
            false ||
          transition.ownerQualificationApproved !==
            false ||
          transition.ownerActivationApproved !==
            false ||
          transition.runtimeAuthorized !==
            false
        ) {
          throw new Error(
            "Engineering template-prepared transition requires exact pending and inactive source evidence.",
          );
        }

        return {
          developmentSequence:
            index + 1,
          sourceTransitionRecordId:
            transition.transitionRecordId,
          sourceTransitionRecordDigest:
            transition.transitionRecordDigest,
          sourceFactoryRecordId:
            transition.sourceFactoryRecordId,
          sourceFactoryRecordDigest:
            transition.sourceFactoryRecordDigest,
          templateId:
            transition.templateId,
          templateDigest:
            transition.templateDigest,
          employeeId:
            transition.employeeId,
          employeeCode:
            transition.employeeCode,
          publicName:
            transition.publicName,
          officialRole:
            transition.officialRole,
          sourceLifecycleState:
            "TEMPLATE_PREPARATION_PENDING" as const,
          targetLifecycleState:
            "TEMPLATE_PREPARED" as const,
          sourcePendingTransitionExecuted:
            true as const,
          sourceFactoryRecordPreserved:
            true as const,
          templateEvidenceBound:
            true as const,
          templatePreparedTransitionAuthorized:
            approved,
          templatePreparedTransitionExecuted:
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
        };
      },
    );

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_TEMPLATE_PREPARED_TRANSITION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourceExecutionId:
      source.executionId,
    sourceExecutionDigest:
      source.executionDigest,
    sourceFactoryFoundationDigest:
      source.sourceFactoryFoundationDigest,
    decision:
      input.decision,
    templatePreparedTransitionApproved:
      approved,
    reason:
      input.reason,
    reviewedEvidence: {
      transitionedCandidateCount:
        8 as const,
      sourceLifecycleState:
        "TEMPLATE_PREPARATION_PENDING" as const,
      targetLifecycleState:
        "TEMPLATE_PREPARED" as const,
      sourcePendingTransitionExecuted:
        true as const,
      allowedSequentialTransitionVerified:
        true as const,
      directQualificationBypassBlocked:
        true as const,
      exactCandidateIdentityBindingVerified:
        true as const,
      immutableTemplateEvidenceVerified:
        true as const,
      qualifiedTemplateCount:
        0 as const,
      activationEligibleTemplateCount:
        0 as const,
      founderLiberationAchieved:
        false as const,
    },
    candidateTransitionEligibility,
    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourceExecutionBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      exactEightTransitionsRequired:
        true as const,
      templatePreparedTransitionAuthorized:
        approved,
      sourceLifecycleStateLocked:
        true as const,
      targetLifecycleStateLocked:
        true as const,
      templatePreparedTransitionExecuted:
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
        ? "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION" as const
        : "RETAIN_ENGINEERING_TEMPLATES_PREPARATION_PENDING" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceTemplatePreparedTransitionDecision;

  validateEngineeringAIWorkforceTemplatePreparedTransitionDecision(
    decision,
  );

  return decision;
}
