import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
  AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
} from "./aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
} from "./engineeringAIWorkforceQualificationAdmissionTransitionExecution";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION,
} from "./engineeringAIWorkforceQualificationExecutionTransitionApprovalRecord";

import {
  type EngineeringAIWorkforceQualificationExecutionTransitionDecision,
  validateEngineeringAIWorkforceQualificationExecutionTransitionDecision,
} from "./engineeringAIWorkforceQualificationExecutionTransitionDecision";

export const ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-qualification-execution-transition-execution-v1" as const;

export interface CreateEngineeringAIWorkforceQualificationExecutionTransitionExecutionInput {
  readonly executionId: string;
  readonly approvalDecision:
    EngineeringAIWorkforceQualificationExecutionTransitionDecision;
  readonly executedAt: string;
}

export interface EngineeringAIWorkforceQualificationExecutionTransitionRecord {
  readonly version:
    typeof AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION;
  readonly transitionRecordId: string;
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
  readonly qualificationExecutionTransitionAuthorized:
    true;
  readonly qualificationExecutionTransitionExecuted:
    true;
  readonly qualificationExecutionAuthorized:
    true;
  readonly qualificationFixturePackPrepared:
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
  readonly runtimeAuthorized:
    false;
  readonly repositoryReadAuthorized:
    false;
  readonly repositoryWriteAuthorized:
    false;
  readonly productionDeploymentAuthorized:
    false;
  readonly customerContactAuthorized:
    false;
  readonly externalDeliveryAuthorized:
    false;
  readonly paymentExecutionAuthorized:
    false;
  readonly autonomousExecutionAuthorized:
    false;
  readonly publicLaunchAuthorized:
    false;
  readonly createdAt: string;
  readonly transitionRecordDigest:
    string;
}

export interface EngineeringAIWorkforceQualificationExecutionTransitionExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION_VERSION;
  readonly executionId: string;
  readonly executionState:
    "OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION_EXECUTED";
  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;
  readonly sourceAdmissionExecutionId:
    string;
  readonly sourceAdmissionExecutionDigest:
    string;
  readonly sourceFactoryFoundationDigest:
    string;
  readonly transitionedCandidateCount: 8;
  readonly sourceLifecycleState:
    "QUALIFICATION_ADMISSION_PENDING";
  readonly targetLifecycleState:
    "QUALIFICATION_IN_PROGRESS";
  readonly transitionRecords:
    readonly EngineeringAIWorkforceQualificationExecutionTransitionRecord[];
  readonly transitionedEmployeeIds:
    readonly string[];
  readonly transitionedTemplateIds:
    readonly string[];
  readonly transitionEvidence: Readonly<{
    exactEightTransitionsExecuted:
      true;
    exactOwnerApprovalBound:
      true;
    exactAdmissionExecutionBound:
      true;
    sequentialLifecycleTransitionVerified:
      true;
    qualificationExecutionAuthorityEnabled:
      true;
    qualificationFixturesExecuted:
      0;
    qualificationEvidenceRecordsCreated:
      0;
    qualificationEvidenceRecordsAccepted:
      0;
    qualifiedCandidateCount: 0;
    activationEligibleCandidateCount:
      0;
    founderLiberationAchieved:
      false;
  }>;
  readonly authorityBoundary: Readonly<{
    qualificationExecutionTransitionExecuted:
      true;
    qualificationExecutionAuthorized:
      true;
    qualificationFixturePackPrepared:
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
    "PREPARE_CONTROLLED_ENGINEERING_QUALIFICATION_FIXTURE_PACKS";
  readonly executedAt: string;
  readonly executionDigest: string;
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

function createTransitionRecord(
  candidate:
    EngineeringAIWorkforceQualificationExecutionTransitionDecision[
      "candidateQualificationExecutionEligibility"
    ][number],
  executedAt: string,
): EngineeringAIWorkforceQualificationExecutionTransitionRecord {
  const source =
    ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
      .transitionRecords.find(
        (record) =>
          record.transitionRecordId ===
          candidate.sourceTransitionRecordId,
      );

  if (
    !source ||
    source.transitionRecordDigest !==
      candidate.sourceTransitionRecordDigest ||
    source.sourceFactoryRecordId !==
      candidate.sourceFactoryRecordId ||
    source.sourceFactoryRecordDigest !==
      candidate.sourceFactoryRecordDigest ||
    source.templateId !==
      candidate.templateId ||
    source.templateDigest !==
      candidate.templateDigest ||
    source.employeeId !==
      candidate.employeeId ||
    source.employeeCode !==
      candidate.employeeCode ||
    source.publicName !==
      candidate.publicName ||
    source.officialRole !==
      candidate.officialRole ||
    candidate.sourceLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING" ||
    candidate.targetLifecycleState !==
      "QUALIFICATION_IN_PROGRESS" ||
    candidate.qualificationExecutionTransitionAuthorized !==
      true ||
    candidate.qualificationExecutionTransitionExecuted !==
      false ||
    candidate.qualificationExecutionAuthorized !==
      false ||
    candidate.qualificationFixtureExecutionStarted !==
      false ||
    candidate.qualificationEvidenceCreated !==
      false ||
    candidate.qualificationEvidenceAccepted !==
      false ||
    candidate.ownerQualificationApproved !==
      false ||
    candidate.ownerActivationApproved !==
      false ||
    candidate.runtimeAuthorized !==
      false
  ) {
    throw new Error(
      "Exact owner-approved Engineering qualification-execution transition evidence is required.",
    );
  }

  const recordCore = {
    version:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
    transitionRecordId:
      `factory-transition-${candidate.employeeId}-qualification-in-progress-v1`,
    sourceTransitionRecordId:
      source.transitionRecordId,
    sourceTransitionRecordDigest:
      source.transitionRecordDigest,
    sourceFactoryRecordId:
      source.sourceFactoryRecordId,
    sourceFactoryRecordDigest:
      source.sourceFactoryRecordDigest,
    templateId:
      source.templateId,
    templateDigest:
      source.templateDigest,
    employeeId:
      source.employeeId,
    employeeCode:
      source.employeeCode,
    publicName:
      source.publicName,
    officialRole:
      source.officialRole,
    sourceLifecycleState:
      "QUALIFICATION_ADMISSION_PENDING" as const,
    targetLifecycleState:
      "QUALIFICATION_IN_PROGRESS" as const,
    qualificationExecutionTransitionAuthorized:
      true as const,
    qualificationExecutionTransitionExecuted:
      true as const,
    qualificationExecutionAuthorized:
      true as const,
    qualificationFixturePackPrepared:
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
    productionDeploymentAuthorized:
      false as const,
    customerContactAuthorized:
      false as const,
    externalDeliveryAuthorized:
      false as const,
    paymentExecutionAuthorized:
      false as const,
    autonomousExecutionAuthorized:
      false as const,
    publicLaunchAuthorized:
      false as const,
    createdAt:
      executedAt,
  };

  return deepFreeze({
    ...recordCore,
    transitionRecordDigest:
      sha256(recordCore),
  }) as EngineeringAIWorkforceQualificationExecutionTransitionRecord;
}

export function validateEngineeringAIWorkforceQualificationExecutionTransitionExecution(
  execution:
    EngineeringAIWorkforceQualificationExecutionTransitionExecution,
): void {
  const decision =
    ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION;

  validateEngineeringAIWorkforceQualificationExecutionTransitionDecision(
    decision,
  );

  requireIdentifier(
    "Engineering qualification-execution transition execution ID",
    execution.executionId,
  );

  requireTimestamp(
    "Engineering qualification-execution transition execution time",
    execution.executedAt,
  );

  requireDigest(
    "Engineering qualification-execution source decision digest",
    execution.sourceDecisionDigest,
  );

  requireDigest(
    "Engineering qualification-admission execution digest",
    execution.sourceAdmissionExecutionDigest,
  );

  requireDigest(
    "Engineering qualification Factory digest",
    execution.sourceFactoryFoundationDigest,
  );

  requireDigest(
    "Engineering qualification-execution transition execution digest",
    execution.executionDigest,
  );

  const {
    executionDigest,
    ...executionCore
  } = execution;

  if (
    sha256(executionCore) !==
      executionDigest
  ) {
    throw new Error(
      "Engineering qualification-execution transition execution integrity is invalid.",
    );
  }

  if (
    execution.version !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION_VERSION ||
    execution.executionState !==
      "OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION_EXECUTED" ||
    execution.sourceDecisionId !==
      decision.decisionId ||
    execution.sourceDecisionDigest !==
      decision.decisionDigest ||
    execution.sourceAdmissionExecutionId !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
        .executionId ||
    execution.sourceAdmissionExecutionDigest !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
        .executionDigest ||
    execution.sourceFactoryFoundationDigest !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
        .sourceFactoryFoundationDigest ||
    execution.transitionedCandidateCount !==
      8 ||
    execution.transitionRecords.length !==
      8 ||
    execution.transitionedEmployeeIds.length !==
      8 ||
    execution.transitionedTemplateIds.length !==
      8 ||
    execution.sourceLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING" ||
    execution.targetLifecycleState !==
      "QUALIFICATION_IN_PROGRESS"
  ) {
    throw new Error(
      "Engineering qualification-execution transition execution identity is invalid.",
    );
  }

  requireUnique(
    "Engineering qualification transition-record IDs",
    execution.transitionRecords.map(
      (record) =>
        record.transitionRecordId,
    ),
  );

  requireUnique(
    "Engineering qualification employee IDs",
    execution.transitionedEmployeeIds,
  );

  requireUnique(
    "Engineering qualification template IDs",
    execution.transitionedTemplateIds,
  );

  execution.transitionRecords.forEach(
    (
      record,
      index,
    ) => {
      const candidate =
        decision.candidateQualificationExecutionEligibility[
          index
        ];

      requireDigest(
        "Engineering qualification transition-record digest",
        record.transitionRecordDigest,
      );

      requireTimestamp(
        "Engineering qualification transition-record timestamp",
        record.createdAt,
      );

      const {
        transitionRecordDigest,
        ...recordCore
      } = record;

      if (
        !candidate ||
        sha256(recordCore) !==
          transitionRecordDigest ||
        record.sourceTransitionRecordId !==
          candidate.sourceTransitionRecordId ||
        record.sourceTransitionRecordDigest !==
          candidate.sourceTransitionRecordDigest ||
        record.sourceFactoryRecordId !==
          candidate.sourceFactoryRecordId ||
        record.sourceFactoryRecordDigest !==
          candidate.sourceFactoryRecordDigest ||
        record.templateId !==
          candidate.templateId ||
        record.templateDigest !==
          candidate.templateDigest ||
        record.employeeId !==
          candidate.employeeId ||
        record.employeeCode !==
          candidate.employeeCode ||
        record.publicName !==
          candidate.publicName ||
        record.officialRole !==
          candidate.officialRole ||
        record.sourceLifecycleState !==
          "QUALIFICATION_ADMISSION_PENDING" ||
        record.targetLifecycleState !==
          "QUALIFICATION_IN_PROGRESS" ||
        record.qualificationExecutionTransitionAuthorized !==
          true ||
        record.qualificationExecutionTransitionExecuted !==
          true ||
        record.qualificationExecutionAuthorized !==
          true ||
        record.qualificationFixturePackPrepared !==
          false ||
        record.qualificationFixtureExecutionStarted !==
          false ||
        record.qualificationFixtureExecutionCompleted !==
          false ||
        record.qualificationEvidenceCreated !==
          false ||
        record.qualificationEvidenceAccepted !==
          false ||
        record.ownerQualificationApproved !==
          false ||
        record.activationCandidatePrepared !==
          false ||
        record.ownerActivationApproved !==
          false ||
        record.runtimeAuthorized !==
          false ||
        record.repositoryReadAuthorized !==
          false ||
        record.repositoryWriteAuthorized !==
          false ||
        record.productionDeploymentAuthorized !==
          false ||
        record.customerContactAuthorized !==
          false ||
        record.externalDeliveryAuthorized !==
          false ||
        record.paymentExecutionAuthorized !==
          false ||
        record.autonomousExecutionAuthorized !==
          false ||
        record.publicLaunchAuthorized !==
          false ||
        record.createdAt !==
          execution.executedAt ||
        execution.transitionedEmployeeIds[
          index
        ] !==
          record.employeeId ||
        execution.transitionedTemplateIds[
          index
        ] !==
          record.templateId
      ) {
        throw new Error(
          "Engineering qualification-execution transition record is invalid.",
        );
      }
    },
  );

  const evidence =
    execution.transitionEvidence;

  const boundary =
    execution.authorityBoundary;

  if (
    evidence.exactEightTransitionsExecuted !==
      true ||
    evidence.exactOwnerApprovalBound !==
      true ||
    evidence.exactAdmissionExecutionBound !==
      true ||
    evidence.sequentialLifecycleTransitionVerified !==
      true ||
    evidence.qualificationExecutionAuthorityEnabled !==
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
    boundary.qualificationExecutionTransitionExecuted !==
      true ||
    boundary.qualificationExecutionAuthorized !==
      true ||
    boundary.qualificationFixturePackPrepared !==
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
    execution.nextStep !==
      "PREPARE_CONTROLLED_ENGINEERING_QUALIFICATION_FIXTURE_PACKS"
  ) {
    throw new Error(
      "Engineering qualification-execution transition boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(execution) ||
    !Object.isFrozen(
      execution.transitionRecords,
    ) ||
    execution.transitionRecords.some(
      (record) =>
        !Object.isFrozen(record),
    ) ||
    !Object.isFrozen(
      execution.transitionEvidence,
    ) ||
    !Object.isFrozen(
      execution.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering qualification-execution transition execution must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceQualificationExecutionTransitionExecution(
  input:
    CreateEngineeringAIWorkforceQualificationExecutionTransitionExecutionInput,
): EngineeringAIWorkforceQualificationExecutionTransitionExecution {
  const decision =
    input.approvalDecision;

  validateEngineeringAIWorkforceQualificationExecutionTransitionDecision(
    decision,
  );

  requireIdentifier(
    "Engineering qualification-execution transition execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Engineering qualification-execution transition execution time",
    input.executedAt,
  );

  if (
    decision !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION ||
    decision.decision !==
      "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION" ||
    decision.qualificationExecutionTransitionApproved !==
      true ||
    decision.candidateQualificationExecutionEligibility.length !==
      8 ||
    decision.authorityBoundary
      .qualificationExecutionTransitionAuthorized !==
      true ||
    decision.authorityBoundary
      .qualificationExecutionTransitionExecuted !==
      false ||
    decision.authorityBoundary
      .qualificationExecutionAuthorized !==
      false ||
    decision.authorityBoundary
      .qualificationFixtureExecutionStarted !==
      false ||
    decision.authorityBoundary
      .qualificationEvidenceCreated !==
      false ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION"
  ) {
    throw new Error(
      "Exact owner-approved Engineering qualification-execution transition evidence is required.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Engineering qualification-execution transition cannot precede owner approval.",
    );
  }

  const allowedTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .QUALIFICATION_ADMISSION_PENDING as readonly string[];

  if (
    !allowedTargets.includes(
      "QUALIFICATION_IN_PROGRESS",
    ) ||
    allowedTargets.includes(
      "OWNER_QUALIFICATION_REVIEW_PENDING",
    )
  ) {
    throw new Error(
      "Engineering qualification execution must preserve the exact sequential Factory lifecycle.",
    );
  }

  const transitionRecords =
    decision.candidateQualificationExecutionEligibility.map(
      (candidate) =>
        createTransitionRecord(
          candidate,
          input.executedAt,
        ),
    );

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION_VERSION,
    executionId:
      input.executionId,
    executionState:
      "OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourceAdmissionExecutionId:
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
        .executionId,
    sourceAdmissionExecutionDigest:
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
        .executionDigest,
    sourceFactoryFoundationDigest:
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
        .sourceFactoryFoundationDigest,
    transitionedCandidateCount:
      8 as const,
    sourceLifecycleState:
      "QUALIFICATION_ADMISSION_PENDING" as const,
    targetLifecycleState:
      "QUALIFICATION_IN_PROGRESS" as const,
    transitionRecords,
    transitionedEmployeeIds:
      transitionRecords.map(
        (record) =>
          record.employeeId,
      ),
    transitionedTemplateIds:
      transitionRecords.map(
        (record) =>
          record.templateId,
      ),
    transitionEvidence: {
      exactEightTransitionsExecuted:
        true as const,
      exactOwnerApprovalBound:
        true as const,
      exactAdmissionExecutionBound:
        true as const,
      sequentialLifecycleTransitionVerified:
        true as const,
      qualificationExecutionAuthorityEnabled:
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
    authorityBoundary: {
      qualificationExecutionTransitionExecuted:
        true as const,
      qualificationExecutionAuthorized:
        true as const,
      qualificationFixturePackPrepared:
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
      "PREPARE_CONTROLLED_ENGINEERING_QUALIFICATION_FIXTURE_PACKS" as const,
    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,
      executionDigest:
        sha256(executionCore),
    }) as EngineeringAIWorkforceQualificationExecutionTransitionExecution;

  validateEngineeringAIWorkforceQualificationExecutionTransitionExecution(
    execution,
  );

  return execution;
}

export const ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION =
  createEngineeringAIWorkforceQualificationExecutionTransitionExecution({
    executionId:
      "engineering-ai-workforce-qualification-execution-transition-execution-001",
    approvalDecision:
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION,
    executedAt:
      "2026-07-23T03:11:37.570Z",
  });
