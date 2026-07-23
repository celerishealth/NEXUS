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
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION,
  type EngineeringAIWorkforceQualificationAdmissionTransitionExecution,
  validateEngineeringAIWorkforceQualificationAdmissionTransitionExecution,
} from "./engineeringAIWorkforceQualificationAdmissionTransitionExecution";

export const ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-qualification-execution-transition-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISIONS = [
  "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION",
  "REJECT_AND_RETAIN_ENGINEERING_QUALIFICATION_ADMISSION_PENDING",
] as const;

export type EngineeringAIWorkforceQualificationExecutionTransitionDecisionValue =
  (
    typeof ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceQualificationExecutionTransitionDecisionInput {
  readonly qualificationAdmissionTransitionExecution:
    EngineeringAIWorkforceQualificationAdmissionTransitionExecution;
  readonly decisionId: string;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    EngineeringAIWorkforceQualificationExecutionTransitionDecisionValue;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceQualificationExecutionCandidateEligibility {
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
    "QUALIFICATION_ADMISSION_PENDING";
  readonly targetLifecycleState:
    "QUALIFICATION_IN_PROGRESS";
  readonly sourceQualificationAdmissionTransitionExecuted:
    true;
  readonly sourceQualificationAdmissionPendingRecorded:
    true;
  readonly sourceTemplatePrepared:
    true;
  readonly sourceTransitionRecordPreserved:
    true;
  readonly sourceFactoryRecordPreserved:
    true;
  readonly templateEvidenceBound:
    true;
  readonly qualificationExecutionTransitionAuthorized:
    boolean;
  readonly qualificationExecutionTransitionExecuted:
    false;
  readonly qualificationExecutionAuthorized:
    false;
  readonly qualificationFixtureExecutionStarted:
    false;
  readonly qualificationFixtureExecutionCompleted:
    false;
  readonly qualificationEvidenceCreated:
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

export interface EngineeringAIWorkforceQualificationExecutionTransitionDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION_DECISION_RECORDED";
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly sourceExecutionVersion:
    typeof ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION;
  readonly sourceExecutionId: string;
  readonly sourceExecutionDigest: string;
  readonly sourceFactoryFoundationDigest:
    string;
  readonly decision:
    EngineeringAIWorkforceQualificationExecutionTransitionDecisionValue;
  readonly qualificationExecutionTransitionApproved:
    boolean;
  readonly reason: string;
  readonly reviewedEvidence: Readonly<{
    candidateCount: 8;
    sourceLifecycleState:
      "QUALIFICATION_ADMISSION_PENDING";
    targetLifecycleState:
      "QUALIFICATION_IN_PROGRESS";
    exactAdmissionExecutionBound:
      true;
    allowedSequentialTransitionVerified:
      true;
    exactCandidateIdentityBindingVerified:
      true;
    immutableTemplateEvidenceVerified:
      true;
    qualificationFixturesExecuted:
      0;
    qualificationEvidenceRecordsCreated:
      0;
    qualificationEvidenceRecordsAccepted:
      0;
    qualifiedCandidateCount: 0;
    activationEligibleCandidateCount: 0;
    founderLiberationAchieved: false;
  }>;
  readonly candidateQualificationExecutionEligibility:
    readonly EngineeringAIWorkforceQualificationExecutionCandidateEligibility[];
  readonly authorityBoundary: Readonly<{
    ownerDecisionRecorded: true;
    ownerIdentityBound: true;
    sourceExecutionBound: true;
    approvalBypassAllowed: false;
    exactEightTransitionsRequired:
      true;
    sourceLifecycleStateLocked:
      true;
    targetLifecycleStateLocked:
      true;
    qualificationExecutionTransitionAuthorized:
      boolean;
    qualificationExecutionTransitionExecuted:
      false;
    qualificationExecutionAuthorized:
      false;
    qualificationFixtureExecutionStarted:
      false;
    qualificationFixtureExecutionCompleted:
      false;
    qualificationEvidenceCreated:
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
    | "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION"
    | "RETAIN_ENGINEERING_QUALIFICATION_ADMISSION_PENDING";
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
        .map((entry) =>
          stableStringify(entry),
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
    .update(stableStringify(value))
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
        value as Record<string, unknown>,
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
  if (!SAFE_IDENTIFIER_PATTERN.test(value)) {
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
  if (!/^[0-9a-f]{64}$/.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
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

export function validateEngineeringAIWorkforceQualificationExecutionTransitionDecision(
  decision:
    EngineeringAIWorkforceQualificationExecutionTransitionDecision,
): void {
  const source =
    ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION;

  validateEngineeringAIWorkforceQualificationAdmissionTransitionExecution(
    source,
  );

  requireIdentifier(
    "Engineering qualification-execution transition decision ID",
    decision.decisionId,
  );

  requireTimestamp(
    "Engineering qualification-execution transition decision time",
    decision.decidedAt,
  );

  requireDigest(
    "Engineering qualification-execution source digest",
    decision.sourceExecutionDigest,
  );

  requireDigest(
    "Engineering qualification-execution Factory digest",
    decision.sourceFactoryFoundationDigest,
  );

  requireDigest(
    "Engineering qualification-execution decision digest",
    decision.decisionDigest,
  );

  const approved =
    decision.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION";

  if (
    decision.version !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION_DECISION_RECORDED" ||
    decision.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    !ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISIONS.includes(
      decision.decision,
    ) ||
    decision.qualificationExecutionTransitionApproved !==
      approved ||
    decision.sourceExecutionVersion !==
      source.version ||
    decision.sourceExecutionId !==
      source.executionId ||
    decision.sourceExecutionDigest !==
      source.executionDigest ||
    decision.sourceFactoryFoundationDigest !==
      source.sourceFactoryFoundationDigest ||
    decision.candidateQualificationExecutionEligibility.length !==
      8 ||
    Date.parse(decision.decidedAt) <
      Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Engineering qualification-execution transition decision identity is invalid.",
    );
  }

  requireUnique(
    "Engineering qualification-execution employee IDs",
    decision.candidateQualificationExecutionEligibility.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Engineering qualification-execution template IDs",
    decision.candidateQualificationExecutionEligibility.map(
      (candidate) =>
        candidate.templateId,
    ),
  );

  decision.candidateQualificationExecutionEligibility.forEach(
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
          "QUALIFICATION_ADMISSION_PENDING" ||
        candidate.targetLifecycleState !==
          "QUALIFICATION_IN_PROGRESS" ||
        candidate.sourceQualificationAdmissionTransitionExecuted !==
          true ||
        candidate.sourceQualificationAdmissionPendingRecorded !==
          true ||
        candidate.sourceTemplatePrepared !==
          true ||
        candidate.sourceTransitionRecordPreserved !==
          true ||
        candidate.sourceFactoryRecordPreserved !==
          true ||
        candidate.templateEvidenceBound !==
          true ||
        candidate.qualificationExecutionTransitionAuthorized !==
          approved ||
        candidate.qualificationExecutionTransitionExecuted !==
          false ||
        candidate.qualificationExecutionAuthorized !==
          false ||
        candidate.qualificationFixtureExecutionStarted !==
          false ||
        candidate.qualificationFixtureExecutionCompleted !==
          false ||
        candidate.qualificationEvidenceCreated !==
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
          false ||
        sourceRecord.targetLifecycleState !==
          "QUALIFICATION_ADMISSION_PENDING" ||
        sourceRecord.qualificationAdmissionTransitionExecuted !==
          true ||
        sourceRecord.qualificationAdmissionPendingRecorded !==
          true ||
        sourceRecord.templatePrepared !==
          true ||
        sourceRecord.qualificationExecutionAuthorized !==
          false ||
        sourceRecord.qualificationEvidenceAccepted !==
          false ||
        sourceRecord.ownerQualificationApproved !==
          false ||
        sourceRecord.ownerActivationApproved !==
          false ||
        sourceRecord.runtimeAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering qualification-execution candidate evidence is invalid.",
        );
      }
    },
  );

  const evidence =
    decision.reviewedEvidence;

  const boundary =
    decision.authorityBoundary;

  if (
    evidence.candidateCount !==
      8 ||
    evidence.sourceLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING" ||
    evidence.targetLifecycleState !==
      "QUALIFICATION_IN_PROGRESS" ||
    evidence.exactAdmissionExecutionBound !==
      true ||
    evidence.allowedSequentialTransitionVerified !==
      true ||
    evidence.exactCandidateIdentityBindingVerified !==
      true ||
    evidence.immutableTemplateEvidenceVerified !==
      true ||
    evidence.qualificationFixturesExecuted !==
      0 ||
    evidence.qualificationEvidenceRecordsCreated !==
      0 ||
    evidence.qualificationEvidenceRecordsAccepted !==
      0 ||
    evidence.qualifiedCandidateCount !==
      0 ||
    evidence.activationEligibleCandidateCount !==
      0 ||
    evidence.founderLiberationAchieved !==
      false ||
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
    boundary.sourceLifecycleStateLocked !==
      true ||
    boundary.targetLifecycleStateLocked !==
      true ||
    boundary.qualificationExecutionTransitionAuthorized !==
      approved ||
    boundary.qualificationExecutionTransitionExecuted !==
      false ||
    boundary.qualificationExecutionAuthorized !==
      false ||
    boundary.qualificationFixtureExecutionStarted !==
      false ||
    boundary.qualificationFixtureExecutionCompleted !==
      false ||
    boundary.qualificationEvidenceCreated !==
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
    decision.nextStep !==
      (
        approved
          ? "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION"
          : "RETAIN_ENGINEERING_QUALIFICATION_ADMISSION_PENDING"
      )
  ) {
    throw new Error(
      "Engineering qualification-execution transition decision boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      decision.candidateQualificationExecutionEligibility,
    ) ||
    decision.candidateQualificationExecutionEligibility.some(
      (candidate) =>
        !Object.isFrozen(candidate),
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering qualification-execution transition decision must remain immutable.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    decisionDigest !==
      sha256(decisionCore)
  ) {
    throw new Error(
      "Engineering qualification-execution transition decision integrity is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceQualificationExecutionTransitionDecision(
  input:
    CreateEngineeringAIWorkforceQualificationExecutionTransitionDecisionInput,
): EngineeringAIWorkforceQualificationExecutionTransitionDecision {
  const source =
    input.qualificationAdmissionTransitionExecution;

  validateEngineeringAIWorkforceQualificationAdmissionTransitionExecution(
    source,
  );

  requireIdentifier(
    "Engineering qualification-execution transition decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Engineering qualification-execution transition decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner may decide Engineering qualification execution.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Engineering qualification-execution transition decision is unsupported.",
    );
  }

  if (
    input.reason.trim().length <
      24
  ) {
    throw new Error(
      "Engineering qualification-execution transition decision requires a substantive reason.",
    );
  }

  if (
    source !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION ||
    source.executionState !==
      "OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION_EXECUTED" ||
    source.transitionedCandidateCount !==
      8 ||
    source.transitionRecords.length !==
      8 ||
    source.targetLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING" ||
    source.authorityBoundary.qualificationAdmissionPendingRecorded !==
      true ||
    source.authorityBoundary.qualificationExecutionAuthorized !==
      false ||
    source.authorityBoundary.qualificationEvidenceAccepted !==
      false ||
    source.authorityBoundary.ownerQualificationApproved !==
      false ||
    source.authorityBoundary.ownerActivationApproved !==
      false ||
    source.authorityBoundary.runtimeAuthorized !==
      false
  ) {
    throw new Error(
      "Exact admitted and inactive Engineering qualification source evidence is required.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Engineering qualification-execution decision cannot precede qualification admission.",
    );
  }

  const admissionPendingTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .QUALIFICATION_ADMISSION_PENDING as readonly string[];

  if (
    !admissionPendingTargets.includes(
      "QUALIFICATION_IN_PROGRESS",
    ) ||
    admissionPendingTargets.includes(
      "QUALIFICATION_EVIDENCE_PENDING",
    )
  ) {
    throw new Error(
      "Engineering qualification execution must use the exact sequential Factory transition.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION";

  const candidateQualificationExecutionEligibility =
    source.transitionRecords.map(
      (
        record,
        index,
      ) => {
        if (
          record.targetLifecycleState !==
            "QUALIFICATION_ADMISSION_PENDING" ||
          record.qualificationAdmissionTransitionExecuted !==
            true ||
          record.qualificationAdmissionPendingRecorded !==
            true ||
          record.templatePrepared !==
            true ||
          record.qualificationExecutionAuthorized !==
            false ||
          record.qualificationEvidenceAccepted !==
            false ||
          record.ownerQualificationApproved !==
            false ||
          record.ownerActivationApproved !==
            false ||
          record.runtimeAuthorized !==
            false
        ) {
          throw new Error(
            "Engineering qualification execution requires exact admitted and inactive source evidence.",
          );
        }

        return {
          developmentSequence:
            index + 1,
          sourceTransitionRecordId:
            record.transitionRecordId,
          sourceTransitionRecordDigest:
            record.transitionRecordDigest,
          sourceFactoryRecordId:
            record.sourceFactoryRecordId,
          sourceFactoryRecordDigest:
            record.sourceFactoryRecordDigest,
          templateId:
            record.templateId,
          templateDigest:
            record.templateDigest,
          employeeId:
            record.employeeId,
          employeeCode:
            record.employeeCode,
          publicName:
            record.publicName,
          officialRole:
            record.officialRole,
          sourceLifecycleState:
            "QUALIFICATION_ADMISSION_PENDING" as const,
          targetLifecycleState:
            "QUALIFICATION_IN_PROGRESS" as const,
          sourceQualificationAdmissionTransitionExecuted:
            true as const,
          sourceQualificationAdmissionPendingRecorded:
            true as const,
          sourceTemplatePrepared:
            true as const,
          sourceTransitionRecordPreserved:
            true as const,
          sourceFactoryRecordPreserved:
            true as const,
          templateEvidenceBound:
            true as const,
          qualificationExecutionTransitionAuthorized:
            approved,
          qualificationExecutionTransitionExecuted:
            false as const,
          qualificationExecutionAuthorized:
            false as const,
          qualificationFixtureExecutionStarted:
            false as const,
          qualificationFixtureExecutionCompleted:
            false as const,
          qualificationEvidenceCreated:
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
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,
    sourceExecutionVersion:
      source.version,
    sourceExecutionId:
      source.executionId,
    sourceExecutionDigest:
      source.executionDigest,
    sourceFactoryFoundationDigest:
      source.sourceFactoryFoundationDigest,
    decision:
      input.decision,
    qualificationExecutionTransitionApproved:
      approved,
    reason:
      input.reason,
    reviewedEvidence: {
      candidateCount:
        8 as const,
      sourceLifecycleState:
        "QUALIFICATION_ADMISSION_PENDING" as const,
      targetLifecycleState:
        "QUALIFICATION_IN_PROGRESS" as const,
      exactAdmissionExecutionBound:
        true as const,
      allowedSequentialTransitionVerified:
        true as const,
      exactCandidateIdentityBindingVerified:
        true as const,
      immutableTemplateEvidenceVerified:
        true as const,
      qualificationFixturesExecuted:
        0 as const,
      qualificationEvidenceRecordsCreated:
        0 as const,
      qualificationEvidenceRecordsAccepted:
        0 as const,
      qualifiedCandidateCount:
        0 as const,
      activationEligibleCandidateCount:
        0 as const,
      founderLiberationAchieved:
        false as const,
    },
    candidateQualificationExecutionEligibility,
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
      sourceLifecycleStateLocked:
        true as const,
      targetLifecycleStateLocked:
        true as const,
      qualificationExecutionTransitionAuthorized:
        approved,
      qualificationExecutionTransitionExecuted:
        false as const,
      qualificationExecutionAuthorized:
        false as const,
      qualificationFixtureExecutionStarted:
        false as const,
      qualificationFixtureExecutionCompleted:
        false as const,
      qualificationEvidenceCreated:
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
        ? "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION" as const
        : "RETAIN_ENGINEERING_QUALIFICATION_ADMISSION_PENDING" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceQualificationExecutionTransitionDecision;

  validateEngineeringAIWorkforceQualificationExecutionTransitionDecision(
    decision,
  );

  return decision;
}
