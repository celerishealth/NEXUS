import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
  AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
} from "./aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
  validateEngineeringAIWorkforceTemplatePreparedTransitionExecution,
} from "./engineeringAIWorkforceTemplatePreparedTransitionExecution";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION,
} from "./engineeringAIWorkforceQualificationAdmissionTransitionApprovalRecord";

import {
  type EngineeringAIWorkforceQualificationAdmissionTransitionDecision,
  validateEngineeringAIWorkforceQualificationAdmissionTransitionDecision,
} from "./engineeringAIWorkforceQualificationAdmissionTransitionDecision";

export const ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-qualification-admission-transition-execution-v1" as const;

export interface CreateEngineeringAIWorkforceQualificationAdmissionTransitionExecutionInput {
  readonly executionId: string;
  readonly approvalDecision:
    EngineeringAIWorkforceQualificationAdmissionTransitionDecision;
  readonly executedAt: string;
}

export interface EngineeringAIWorkforceQualificationAdmissionTransitionRecord {
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
  readonly department:
    "ENGINEERING_DATA_SECURITY";
  readonly managerRoleKey:
    "founder-owner-ceo";
  readonly sourceLifecycleState:
    "TEMPLATE_PREPARED";
  readonly targetLifecycleState:
    "QUALIFICATION_ADMISSION_PENDING";
  readonly qualificationAdmissionTransitionAuthorized:
    true;
  readonly qualificationAdmissionTransitionExecuted:
    true;
  readonly qualificationAdmissionPendingRecorded:
    true;
  readonly sourceTemplatePreparedTransitionPreserved:
    true;
  readonly sourceFactoryRecordPreserved:
    true;
  readonly templateEvidenceBound: true;
  readonly templatePrepared: true;
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
  readonly consequentialAuthorityAuthorized:
    false;
  readonly externalCommunicationAuthorized:
    false;
  readonly productionExecutionAuthorized:
    false;
  readonly financialCommitmentAuthorized:
    false;
  readonly legalCommitmentAuthorized:
    false;
  readonly createdAt: string;
  readonly transitionRecordDigest:
    string;
}

export interface EngineeringAIWorkforceQualificationAdmissionTransitionExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION;
  readonly executionId: string;
  readonly executionState:
    "OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION_EXECUTED";
  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;
  readonly sourceTemplatePreparedExecutionId:
    string;
  readonly sourceTemplatePreparedExecutionDigest:
    string;
  readonly sourceFactoryFoundationDigest:
    string;
  readonly transitionedCandidateCount: 8;
  readonly sourceLifecycleState:
    "TEMPLATE_PREPARED";
  readonly targetLifecycleState:
    "QUALIFICATION_ADMISSION_PENDING";
  readonly transitionRecords:
    readonly EngineeringAIWorkforceQualificationAdmissionTransitionRecord[];
  readonly transitionedEmployeeIds:
    readonly string[];
  readonly transitionedTemplateIds:
    readonly string[];
  readonly transitionEvidence: Readonly<{
    exactEightTransitionsExecuted:
      true;
    exactOwnerApprovalBound: true;
    exactTemplatePreparedExecutionBound:
      true;
    exactSourceTransitionRecordsBound:
      true;
    exactTemplateEvidenceBound:
      true;
    sequentialLifecycleTransitionVerified:
      true;
    appendOnlyTransitionEvidenceCreated:
      true;
    sourceTemplatePreparedTransitionRecordsPreserved:
      true;
    sourceFactoryRecordsPreserved:
      true;
    everyTemplateRemainsPrepared:
      true;
    qualificationAdmissionPendingRecorded:
      true;
    directQualificationExecutionBypassBlocked:
      true;
    everyCandidateRemainsUnqualified:
      true;
    everyCandidateRemainsInactive:
      true;
    founderLiberationAchieved:
      false;
  }>;
  readonly authorityBoundary: Readonly<{
    sourceOwnerApprovalBound: true;
    sourceTemplatePreparedExecutionPreserved:
      true;
    sourceFactoryRecordsPreserved:
      true;
    qualificationAdmissionTransitionPerformed:
      true;
    qualificationAdmissionTransitionExecuted:
      true;
    qualificationAdmissionPendingRecorded:
      true;
    sourceTransitionRecordsMutated:
      false;
    templatePrepared: true;
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
    "PREPARE_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_DECISION";
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
    EngineeringAIWorkforceQualificationAdmissionTransitionDecision[
      "candidateQualificationAdmissionEligibility"
    ][number],
  executedAt: string,
): EngineeringAIWorkforceQualificationAdmissionTransitionRecord {
  const source =
    ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
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
    source.targetLifecycleState !==
      "TEMPLATE_PREPARED" ||
    source.templatePreparedTransitionExecuted !==
      true ||
    source.templatePrepared !==
      true ||
    source.qualificationAdmissionAuthorized !==
      false ||
    source.qualificationExecutionAuthorized !==
      false ||
    source.ownerQualificationApproved !==
      false ||
    source.ownerActivationApproved !==
      false ||
    source.runtimeAuthorized !==
      false ||
    candidate.qualificationAdmissionTransitionAuthorized !==
      true ||
    candidate.qualificationAdmissionTransitionExecuted !==
      false ||
    candidate.sourceLifecycleState !==
      "TEMPLATE_PREPARED" ||
    candidate.targetLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING" ||
    candidate.qualificationAdmissionAuthorized !==
      false ||
    candidate.qualificationExecutionAuthorized !==
      false
  ) {
    throw new Error(
      "Exact owner-approved prepared Engineering qualification-admission evidence is required.",
    );
  }

  const recordCore = {
    version:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
    transitionRecordId:
      `factory-transition-${candidate.employeeId}-qualification-admission-pending-v1`,
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
    department:
      "ENGINEERING_DATA_SECURITY" as const,
    managerRoleKey:
      "founder-owner-ceo" as const,
    sourceLifecycleState:
      "TEMPLATE_PREPARED" as const,
    targetLifecycleState:
      "QUALIFICATION_ADMISSION_PENDING" as const,
    qualificationAdmissionTransitionAuthorized:
      true as const,
    qualificationAdmissionTransitionExecuted:
      true as const,
    qualificationAdmissionPendingRecorded:
      true as const,
    sourceTemplatePreparedTransitionPreserved:
      true as const,
    sourceFactoryRecordPreserved:
      true as const,
    templateEvidenceBound:
      true as const,
    templatePrepared:
      true as const,
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
    consequentialAuthorityAuthorized:
      false as const,
    externalCommunicationAuthorized:
      false as const,
    productionExecutionAuthorized:
      false as const,
    financialCommitmentAuthorized:
      false as const,
    legalCommitmentAuthorized:
      false as const,
    createdAt:
      executedAt,
  };

  return deepFreeze({
    ...recordCore,
    transitionRecordDigest:
      sha256(recordCore),
  }) as EngineeringAIWorkforceQualificationAdmissionTransitionRecord;
}

export function validateEngineeringAIWorkforceQualificationAdmissionTransitionExecution(
  execution:
    EngineeringAIWorkforceQualificationAdmissionTransitionExecution,
): void {
  const decision =
    ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION;

  validateEngineeringAIWorkforceQualificationAdmissionTransitionDecision(
    decision,
  );

  validateEngineeringAIWorkforceTemplatePreparedTransitionExecution(
    ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
  );

  requireIdentifier(
    "Engineering qualification-admission transition execution ID",
    execution.executionId,
  );

  requireTimestamp(
    "Engineering qualification-admission transition execution time",
    execution.executedAt,
  );

  requireDigest(
    "Engineering qualification-admission source decision digest",
    execution.sourceDecisionDigest,
  );

  requireDigest(
    "Engineering source template-prepared execution digest",
    execution.sourceTemplatePreparedExecutionDigest,
  );

  requireDigest(
    "Engineering source Factory foundation digest",
    execution.sourceFactoryFoundationDigest,
  );

  requireDigest(
    "Engineering qualification-admission execution digest",
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
      "Engineering qualification-admission execution integrity is invalid.",
    );
  }

  if (
    execution.version !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION ||
    execution.executionState !==
      "OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION_EXECUTED" ||
    execution.sourceDecisionId !==
      decision.decisionId ||
    execution.sourceDecisionDigest !==
      decision.decisionDigest ||
    execution.sourceTemplatePreparedExecutionId !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
        .executionId ||
    execution.sourceTemplatePreparedExecutionDigest !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
        .executionDigest ||
    execution.sourceFactoryFoundationDigest !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
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
      "TEMPLATE_PREPARED" ||
    execution.targetLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING"
  ) {
    throw new Error(
      "Engineering qualification-admission execution identity is invalid.",
    );
  }

  requireUnique(
    "Engineering qualification-admission transition-record IDs",
    execution.transitionRecords.map(
      (record) =>
        record.transitionRecordId,
    ),
  );

  requireUnique(
    "Engineering qualification-admission employee IDs",
    execution.transitionedEmployeeIds,
  );

  requireUnique(
    "Engineering qualification-admission template IDs",
    execution.transitionedTemplateIds,
  );

  execution.transitionRecords.forEach(
    (
      record,
      index,
    ) => {
      const eligible =
        decision.candidateQualificationAdmissionEligibility[
          index
        ];

      requireDigest(
        "Engineering qualification-admission transition-record digest",
        record.transitionRecordDigest,
      );

      requireTimestamp(
        "Engineering qualification-admission transition-record time",
        record.createdAt,
      );

      const {
        transitionRecordDigest,
        ...recordCore
      } = record;

      if (
        !eligible ||
        sha256(recordCore) !==
          transitionRecordDigest ||
        record.sourceTransitionRecordId !==
          eligible.sourceTransitionRecordId ||
        record.sourceTransitionRecordDigest !==
          eligible.sourceTransitionRecordDigest ||
        record.sourceFactoryRecordId !==
          eligible.sourceFactoryRecordId ||
        record.sourceFactoryRecordDigest !==
          eligible.sourceFactoryRecordDigest ||
        record.templateId !==
          eligible.templateId ||
        record.templateDigest !==
          eligible.templateDigest ||
        record.employeeId !==
          eligible.employeeId ||
        record.employeeCode !==
          eligible.employeeCode ||
        record.publicName !==
          eligible.publicName ||
        record.officialRole !==
          eligible.officialRole ||
        record.department !==
          "ENGINEERING_DATA_SECURITY" ||
        record.managerRoleKey !==
          "founder-owner-ceo" ||
        record.sourceLifecycleState !==
          "TEMPLATE_PREPARED" ||
        record.targetLifecycleState !==
          "QUALIFICATION_ADMISSION_PENDING" ||
        record.qualificationAdmissionTransitionAuthorized !==
          true ||
        record.qualificationAdmissionTransitionExecuted !==
          true ||
        record.qualificationAdmissionPendingRecorded !==
          true ||
        record.sourceTemplatePreparedTransitionPreserved !==
          true ||
        record.sourceFactoryRecordPreserved !==
          true ||
        record.templateEvidenceBound !==
          true ||
        record.templatePrepared !==
          true ||
        record.qualificationAdmissionAuthorized !==
          false ||
        record.qualificationExecutionAuthorized !==
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
        record.consequentialAuthorityAuthorized !==
          false ||
        record.externalCommunicationAuthorized !==
          false ||
        record.productionExecutionAuthorized !==
          false ||
        record.financialCommitmentAuthorized !==
          false ||
        record.legalCommitmentAuthorized !==
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
          "Engineering qualification-admission transition record is invalid.",
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
    evidence.exactTemplatePreparedExecutionBound !==
      true ||
    evidence.exactSourceTransitionRecordsBound !==
      true ||
    evidence.exactTemplateEvidenceBound !==
      true ||
    evidence.sequentialLifecycleTransitionVerified !==
      true ||
    evidence.appendOnlyTransitionEvidenceCreated !==
      true ||
    evidence.sourceTemplatePreparedTransitionRecordsPreserved !==
      true ||
    evidence.sourceFactoryRecordsPreserved !==
      true ||
    evidence.everyTemplateRemainsPrepared !==
      true ||
    evidence.qualificationAdmissionPendingRecorded !==
      true ||
    evidence.directQualificationExecutionBypassBlocked !==
      true ||
    evidence.everyCandidateRemainsUnqualified !==
      true ||
    evidence.everyCandidateRemainsInactive !==
      true ||
    evidence.founderLiberationAchieved !==
      false ||
    boundary.sourceOwnerApprovalBound !==
      true ||
    boundary.sourceTemplatePreparedExecutionPreserved !==
      true ||
    boundary.sourceFactoryRecordsPreserved !==
      true ||
    boundary.qualificationAdmissionTransitionPerformed !==
      true ||
    boundary.qualificationAdmissionTransitionExecuted !==
      true ||
    boundary.qualificationAdmissionPendingRecorded !==
      true ||
    boundary.sourceTransitionRecordsMutated !==
      false ||
    boundary.templatePrepared !==
      true ||
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
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Engineering qualification-admission execution boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(execution) ||
    !Object.isFrozen(
      execution.transitionEvidence,
    ) ||
    !Object.isFrozen(
      execution.authorityBoundary,
    ) ||
    !Object.isFrozen(
      execution.transitionRecords,
    ) ||
    execution.transitionRecords.some(
      (record) =>
        !Object.isFrozen(record),
    )
  ) {
    throw new Error(
      "Engineering qualification-admission execution must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceQualificationAdmissionTransitionExecution(
  input:
    CreateEngineeringAIWorkforceQualificationAdmissionTransitionExecutionInput,
): EngineeringAIWorkforceQualificationAdmissionTransitionExecution {
  const decision =
    input.approvalDecision;

  validateEngineeringAIWorkforceQualificationAdmissionTransitionDecision(
    decision,
  );

  requireIdentifier(
    "Engineering qualification-admission transition execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Engineering qualification-admission transition execution time",
    input.executedAt,
  );

  if (
    decision !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION ||
    decision.decision !==
      "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION" ||
    decision.qualificationAdmissionTransitionApproved !==
      true ||
    decision.candidateQualificationAdmissionEligibility.length !==
      8 ||
    decision.authorityBoundary
      .qualificationAdmissionTransitionAuthorized !==
      true ||
    decision.authorityBoundary
      .qualificationAdmissionTransitionExecuted !==
      false ||
    decision.authorityBoundary
      .qualificationAdmissionAuthorized !==
      false ||
    decision.authorityBoundary
      .qualificationExecutionAuthorized !==
      false ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION"
  ) {
    throw new Error(
      "Exact owner-approved Engineering qualification-admission transition evidence is required.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Engineering qualification-admission transition cannot precede owner approval.",
    );
  }

  const preparedTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .TEMPLATE_PREPARED as readonly string[];

  const admissionPendingTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .QUALIFICATION_ADMISSION_PENDING as readonly string[];

  if (
    !preparedTargets.includes(
      "QUALIFICATION_ADMISSION_PENDING",
    ) ||
    preparedTargets.includes(
      "QUALIFICATION_IN_PROGRESS",
    ) ||
    !admissionPendingTargets.includes(
      "QUALIFICATION_IN_PROGRESS",
    )
  ) {
    throw new Error(
      "Engineering qualification-admission execution must preserve the exact sequential Factory lifecycle.",
    );
  }

  const transitionRecords =
    decision.candidateQualificationAdmissionEligibility.map(
      (candidate) =>
        createTransitionRecord(
          candidate,
          input.executedAt,
        ),
    );

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION,
    executionId:
      input.executionId,
    executionState:
      "OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourceTemplatePreparedExecutionId:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
        .executionId,
    sourceTemplatePreparedExecutionDigest:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
        .executionDigest,
    sourceFactoryFoundationDigest:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
        .sourceFactoryFoundationDigest,
    transitionedCandidateCount:
      8 as const,
    sourceLifecycleState:
      "TEMPLATE_PREPARED" as const,
    targetLifecycleState:
      "QUALIFICATION_ADMISSION_PENDING" as const,
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
      exactTemplatePreparedExecutionBound:
        true as const,
      exactSourceTransitionRecordsBound:
        true as const,
      exactTemplateEvidenceBound:
        true as const,
      sequentialLifecycleTransitionVerified:
        true as const,
      appendOnlyTransitionEvidenceCreated:
        true as const,
      sourceTemplatePreparedTransitionRecordsPreserved:
        true as const,
      sourceFactoryRecordsPreserved:
        true as const,
      everyTemplateRemainsPrepared:
        true as const,
      qualificationAdmissionPendingRecorded:
        true as const,
      directQualificationExecutionBypassBlocked:
        true as const,
      everyCandidateRemainsUnqualified:
        true as const,
      everyCandidateRemainsInactive:
        true as const,
      founderLiberationAchieved:
        false as const,
    },
    authorityBoundary: {
      sourceOwnerApprovalBound:
        true as const,
      sourceTemplatePreparedExecutionPreserved:
        true as const,
      sourceFactoryRecordsPreserved:
        true as const,
      qualificationAdmissionTransitionPerformed:
        true as const,
      qualificationAdmissionTransitionExecuted:
        true as const,
      qualificationAdmissionPendingRecorded:
        true as const,
      sourceTransitionRecordsMutated:
        false as const,
      templatePrepared:
        true as const,
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
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_DECISION" as const,
    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,
      executionDigest:
        sha256(executionCore),
    }) as EngineeringAIWorkforceQualificationAdmissionTransitionExecution;

  validateEngineeringAIWorkforceQualificationAdmissionTransitionExecution(
    execution,
  );

  return execution;
}

export const ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION =
  createEngineeringAIWorkforceQualificationAdmissionTransitionExecution({
    executionId:
      "engineering-ai-workforce-qualification-admission-transition-execution-001",
    approvalDecision:
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION,
    executedAt:
      "2026-07-23T03:11:37.567Z",
  });
