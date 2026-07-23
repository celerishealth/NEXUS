import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
  AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
} from "./aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION,
} from "./engineeringAIWorkforceFactoryLifecycleTransitionApprovalRecord";

import {
  type EngineeringAIWorkforceFactoryLifecycleTransitionDecision,
  validateEngineeringAIWorkforceFactoryLifecycleTransitionDecision,
} from "./engineeringAIWorkforceFactoryLifecycleTransitionDecision";

export const ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-factory-lifecycle-transition-execution-v1" as const;

export interface CreateEngineeringAIWorkforceFactoryLifecycleTransitionExecutionInput {
  readonly executionId: string;
  readonly approvalDecision:
    EngineeringAIWorkforceFactoryLifecycleTransitionDecision;
  readonly executedAt: string;
}

export interface EngineeringAIWorkforceFactoryLifecycleTransitionRecord {
  readonly version:
    typeof AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION;
  readonly transitionRecordId: string;
  readonly sourceFactoryRecordId: string;
  readonly sourceFactoryRecordDigest:
    string;
  readonly sourceFactoryRecordCreatedAt:
    string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly department:
    "ENGINEERING_DATA_SECURITY";
  readonly managerRoleKey:
    "founder-owner-ceo";
  readonly templateId: string;
  readonly templateDigest: string;
  readonly sourceLifecycleState:
    "PLANNED_CANDIDATE";
  readonly targetLifecycleState:
    "TEMPLATE_PREPARATION_PENDING";
  readonly lifecycleTransitionAuthorized:
    true;
  readonly lifecycleTransitionExecuted:
    true;
  readonly sourceFactoryRecordPreserved:
    true;
  readonly templateCreationEvidenceBound:
    true;
  readonly templatePreparationExecutionAuthorized:
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

export interface EngineeringAIWorkforceFactoryLifecycleTransitionExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION_VERSION;
  readonly executionId: string;
  readonly executionState:
    "OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_EXECUTED";
  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;
  readonly sourceFactoryFoundationVersion:
    typeof AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION;
  readonly sourceFactoryFoundationDigest:
    string;
  readonly sourceFactoryCandidateCount:
    number;
  readonly transitionedCandidateCount: 8;
  readonly sourceLifecycleState:
    "PLANNED_CANDIDATE";
  readonly targetLifecycleState:
    "TEMPLATE_PREPARATION_PENDING";
  readonly transitionRecords:
    readonly EngineeringAIWorkforceFactoryLifecycleTransitionRecord[];
  readonly transitionedEmployeeIds:
    readonly string[];
  readonly transitionedFactoryRecordIds:
    readonly string[];
  readonly transitionEvidence: Readonly<{
    exactEightTransitionsExecuted:
      true;
    exactOwnerApprovalBound: true;
    exactSourceFactoryRecordsBound:
      true;
    exactTemplateEvidenceBound:
      true;
    sequentialLifecycleTransitionVerified:
      true;
    sourceFactoryRecordsPreserved:
      true;
    appendOnlyTransitionEvidenceCreated:
      true;
    directTemplatePreparedBypassBlocked:
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
    sourceFactoryFoundationPreserved:
      true;
    factoryLifecycleTransitionPerformed:
      true;
    lifecycleTransitionExecuted:
      true;
    templatePreparationPendingRecorded:
      true;
    sourceCandidateRecordsMutated:
      false;
    directTemplatePreparedTransitionAuthorized:
      false;
    templatePreparationExecutionAuthorized:
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
    "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION_DECISION";
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
    EngineeringAIWorkforceFactoryLifecycleTransitionDecision[
      "candidateTransitionEligibility"
    ][number],
  executedAt: string,
): EngineeringAIWorkforceFactoryLifecycleTransitionRecord {
  const sourceRecord =
    AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
      .candidateRecords.find(
        (record) =>
          record.factoryRecordId ===
          candidate.factoryRecordId,
      );

  if (
    !sourceRecord ||
    sourceRecord.recordDigest !==
      candidate.factoryRecordDigest ||
    sourceRecord.employeeId !==
      candidate.employeeId ||
    sourceRecord.employeeCode !==
      candidate.employeeCode ||
    sourceRecord.publicName !==
      candidate.publicName ||
    sourceRecord.officialRole !==
      candidate.officialRole ||
    sourceRecord.department !==
      "ENGINEERING_DATA_SECURITY" ||
    sourceRecord.managerRoleKey !==
      "founder-owner-ceo" ||
    sourceRecord.lifecycleState !==
      "PLANNED_CANDIDATE" ||
    sourceRecord.templatePrepared !==
      false ||
    sourceRecord.qualificationAdmissionAuthorized !==
      false ||
    sourceRecord.qualificationEvidenceAccepted !==
      false ||
    sourceRecord.ownerQualificationApproved !==
      false ||
    sourceRecord.activationCandidatePrepared !==
      false ||
    sourceRecord.ownerActivationApproved !==
      false ||
    sourceRecord.runtimeAuthorized !==
      false ||
    candidate.lifecycleTransitionAuthorized !==
      true ||
    candidate.lifecycleTransitionExecuted !==
      false ||
    candidate.sourceLifecycleState !==
      "PLANNED_CANDIDATE" ||
    candidate.targetLifecycleState !==
      "TEMPLATE_PREPARATION_PENDING"
  ) {
    throw new Error(
      "Exact planned and inactive Engineering Factory candidate evidence is required.",
    );
  }

  const transitionCore = {
    version:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
    transitionRecordId:
      `factory-transition-${candidate.employeeId}-template-preparation-pending-v1`,
    sourceFactoryRecordId:
      sourceRecord.factoryRecordId,
    sourceFactoryRecordDigest:
      sourceRecord.recordDigest,
    sourceFactoryRecordCreatedAt:
      sourceRecord.createdAt,
    employeeId:
      sourceRecord.employeeId,
    employeeCode:
      sourceRecord.employeeCode,
    publicName:
      sourceRecord.publicName,
    officialRole:
      sourceRecord.officialRole,
    department:
      "ENGINEERING_DATA_SECURITY" as const,
    managerRoleKey:
      "founder-owner-ceo" as const,
    templateId:
      candidate.templateId,
    templateDigest:
      candidate.templateDigest,
    sourceLifecycleState:
      "PLANNED_CANDIDATE" as const,
    targetLifecycleState:
      "TEMPLATE_PREPARATION_PENDING" as const,
    lifecycleTransitionAuthorized:
      true as const,
    lifecycleTransitionExecuted:
      true as const,
    sourceFactoryRecordPreserved:
      true as const,
    templateCreationEvidenceBound:
      true as const,
    templatePreparationExecutionAuthorized:
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
    ...transitionCore,
    transitionRecordDigest:
      sha256(transitionCore),
  }) as EngineeringAIWorkforceFactoryLifecycleTransitionRecord;
}

export function validateEngineeringAIWorkforceFactoryLifecycleTransitionExecution(
  execution:
    EngineeringAIWorkforceFactoryLifecycleTransitionExecution,
): void {
  const decision =
    ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION;

  validateEngineeringAIWorkforceFactoryLifecycleTransitionDecision(
    decision,
  );

  requireIdentifier(
    "Engineering Factory lifecycle-transition execution ID",
    execution.executionId,
  );

  requireTimestamp(
    "Engineering Factory lifecycle-transition execution time",
    execution.executedAt,
  );

  requireDigest(
    "Engineering Factory lifecycle-transition source decision digest",
    execution.sourceDecisionDigest,
  );

  requireDigest(
    "Engineering Factory lifecycle-transition source foundation digest",
    execution.sourceFactoryFoundationDigest,
  );

  requireDigest(
    "Engineering Factory lifecycle-transition execution digest",
    execution.executionDigest,
  );

  if (
    execution.version !==
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION_VERSION ||
    execution.executionState !==
      "OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_EXECUTED" ||
    execution.sourceDecisionId !==
      decision.decisionId ||
    execution.sourceDecisionDigest !==
      decision.decisionDigest ||
    execution.sourceFactoryFoundationVersion !==
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION.version ||
    execution.sourceFactoryFoundationDigest !==
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION.foundationDigest ||
    execution.sourceFactoryCandidateCount !==
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION.plannedCandidateCount ||
    execution.transitionedCandidateCount !==
      8 ||
    execution.transitionRecords.length !==
      8 ||
    execution.transitionedEmployeeIds.length !==
      8 ||
    execution.transitionedFactoryRecordIds.length !==
      8 ||
    execution.sourceLifecycleState !==
      "PLANNED_CANDIDATE" ||
    execution.targetLifecycleState !==
      "TEMPLATE_PREPARATION_PENDING"
  ) {
    throw new Error(
      "Engineering Factory lifecycle-transition execution identity is invalid.",
    );
  }

  requireUnique(
    "Engineering transition-record IDs",
    execution.transitionRecords.map(
      (record) =>
        record.transitionRecordId,
    ),
  );

  requireUnique(
    "Engineering transitioned employee IDs",
    execution.transitionedEmployeeIds,
  );

  requireUnique(
    "Engineering transitioned Factory record IDs",
    execution.transitionedFactoryRecordIds,
  );

  execution.transitionRecords.forEach(
    (
      record,
      index,
    ) => {
      const eligibility =
        decision.candidateTransitionEligibility[
          index
        ];

      const sourceRecord =
        AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
          .candidateRecords.find(
            (candidate) =>
              candidate.factoryRecordId ===
              record.sourceFactoryRecordId,
          );

      requireIdentifier(
        "Engineering Factory transition-record ID",
        record.transitionRecordId,
      );

      requireDigest(
        "Engineering Factory transition-record source digest",
        record.sourceFactoryRecordDigest,
      );

      requireDigest(
        "Engineering Factory transition-record template digest",
        record.templateDigest,
      );

      requireDigest(
        "Engineering Factory transition-record digest",
        record.transitionRecordDigest,
      );

      requireTimestamp(
        "Engineering Factory source-record creation time",
        record.sourceFactoryRecordCreatedAt,
      );

      requireTimestamp(
        "Engineering Factory transition-record creation time",
        record.createdAt,
      );

      const {
        transitionRecordDigest,
        ...recordCore
      } = record;

      if (
        !eligibility ||
        !sourceRecord ||
        sha256(recordCore) !==
          transitionRecordDigest ||
        record.version !==
          AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION ||
        record.sourceFactoryRecordId !==
          eligibility.factoryRecordId ||
        record.sourceFactoryRecordDigest !==
          eligibility.factoryRecordDigest ||
        record.sourceFactoryRecordDigest !==
          sourceRecord.recordDigest ||
        record.sourceFactoryRecordCreatedAt !==
          sourceRecord.createdAt ||
        record.employeeId !==
          eligibility.employeeId ||
        record.employeeId !==
          sourceRecord.employeeId ||
        record.employeeCode !==
          eligibility.employeeCode ||
        record.employeeCode !==
          sourceRecord.employeeCode ||
        record.publicName !==
          eligibility.publicName ||
        record.publicName !==
          sourceRecord.publicName ||
        record.officialRole !==
          eligibility.officialRole ||
        record.officialRole !==
          sourceRecord.officialRole ||
        record.department !==
          "ENGINEERING_DATA_SECURITY" ||
        record.managerRoleKey !==
          "founder-owner-ceo" ||
        record.templateId !==
          eligibility.templateId ||
        record.templateDigest !==
          eligibility.templateDigest ||
        record.sourceLifecycleState !==
          "PLANNED_CANDIDATE" ||
        record.targetLifecycleState !==
          "TEMPLATE_PREPARATION_PENDING" ||
        record.lifecycleTransitionAuthorized !==
          true ||
        record.lifecycleTransitionExecuted !==
          true ||
        record.sourceFactoryRecordPreserved !==
          true ||
        record.templateCreationEvidenceBound !==
          true ||
        record.templatePreparationExecutionAuthorized !==
          false ||
        record.templatePrepared !==
          false ||
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
        execution.transitionedFactoryRecordIds[
          index
        ] !==
          record.sourceFactoryRecordId
      ) {
        throw new Error(
          "Engineering Factory lifecycle-transition record is invalid.",
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
    evidence.exactSourceFactoryRecordsBound !==
      true ||
    evidence.exactTemplateEvidenceBound !==
      true ||
    evidence.sequentialLifecycleTransitionVerified !==
      true ||
    evidence.sourceFactoryRecordsPreserved !==
      true ||
    evidence.appendOnlyTransitionEvidenceCreated !==
      true ||
    evidence.directTemplatePreparedBypassBlocked !==
      true ||
    evidence.everyCandidateRemainsUnqualified !==
      true ||
    evidence.everyCandidateRemainsInactive !==
      true ||
    evidence.founderLiberationAchieved !==
      false ||
    boundary.sourceOwnerApprovalBound !==
      true ||
    boundary.sourceFactoryFoundationPreserved !==
      true ||
    boundary.factoryLifecycleTransitionPerformed !==
      true ||
    boundary.lifecycleTransitionExecuted !==
      true ||
    boundary.templatePreparationPendingRecorded !==
      true ||
    boundary.sourceCandidateRecordsMutated !==
      false ||
    boundary.directTemplatePreparedTransitionAuthorized !==
      false ||
    boundary.templatePreparationExecutionAuthorized !==
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
      false ||
    execution.nextStep !==
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION_DECISION"
  ) {
    throw new Error(
      "Engineering Factory lifecycle-transition execution boundary is invalid.",
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
    )
  ) {
    throw new Error(
      "Engineering Factory lifecycle-transition execution evidence must remain immutable.",
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
      "Engineering Factory lifecycle-transition execution integrity is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceFactoryLifecycleTransitionExecution(
  input:
    CreateEngineeringAIWorkforceFactoryLifecycleTransitionExecutionInput,
): EngineeringAIWorkforceFactoryLifecycleTransitionExecution {
  const decision =
    input.approvalDecision;

  validateEngineeringAIWorkforceFactoryLifecycleTransitionDecision(
    decision,
  );

  requireIdentifier(
    "Engineering Factory lifecycle-transition execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Engineering Factory lifecycle-transition execution time",
    input.executedAt,
  );

  if (
    decision !==
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION ||
    decision.decision !==
      "APPROVE_ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION" ||
    decision.lifecycleTransitionApproved !==
      true ||
    decision.candidateTransitionEligibility.length !==
      8 ||
    decision.authorityBoundary.lifecycleTransitionAuthorized !==
      true ||
    decision.authorityBoundary.lifecycleTransitionExecuted !==
      false ||
    decision.authorityBoundary.directTemplatePreparedTransitionAuthorized !==
      false ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION"
  ) {
    throw new Error(
      "Exact owner-approved Engineering Factory lifecycle-transition evidence is required.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Engineering Factory lifecycle transition cannot precede owner approval.",
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
      "Engineering Factory lifecycle transition must preserve the first sequential step.",
    );
  }

  const transitionRecords =
    decision.candidateTransitionEligibility.map(
      (candidate) =>
        createTransitionRecord(
          candidate,
          input.executedAt,
        ),
    );

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION_VERSION,
    executionId:
      input.executionId,
    executionState:
      "OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourceFactoryFoundationVersion:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION.version,
    sourceFactoryFoundationDigest:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION.foundationDigest,
    sourceFactoryCandidateCount:
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION.plannedCandidateCount,
    transitionedCandidateCount:
      8 as const,
    sourceLifecycleState:
      "PLANNED_CANDIDATE" as const,
    targetLifecycleState:
      "TEMPLATE_PREPARATION_PENDING" as const,
    transitionRecords,
    transitionedEmployeeIds:
      transitionRecords.map(
        (record) =>
          record.employeeId,
      ),
    transitionedFactoryRecordIds:
      transitionRecords.map(
        (record) =>
          record.sourceFactoryRecordId,
      ),
    transitionEvidence: {
      exactEightTransitionsExecuted:
        true as const,
      exactOwnerApprovalBound:
        true as const,
      exactSourceFactoryRecordsBound:
        true as const,
      exactTemplateEvidenceBound:
        true as const,
      sequentialLifecycleTransitionVerified:
        true as const,
      sourceFactoryRecordsPreserved:
        true as const,
      appendOnlyTransitionEvidenceCreated:
        true as const,
      directTemplatePreparedBypassBlocked:
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
      sourceFactoryFoundationPreserved:
        true as const,
      factoryLifecycleTransitionPerformed:
        true as const,
      lifecycleTransitionExecuted:
        true as const,
      templatePreparationPendingRecorded:
        true as const,
      sourceCandidateRecordsMutated:
        false as const,
      directTemplatePreparedTransitionAuthorized:
        false as const,
      templatePreparationExecutionAuthorized:
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
      "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION_DECISION" as const,
    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,
      executionDigest:
        sha256(executionCore),
    }) as EngineeringAIWorkforceFactoryLifecycleTransitionExecution;

  validateEngineeringAIWorkforceFactoryLifecycleTransitionExecution(
    execution,
  );

  return execution;
}

export const ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION =
  createEngineeringAIWorkforceFactoryLifecycleTransitionExecution({
    executionId:
      "engineering-ai-workforce-factory-lifecycle-transition-execution-001",
    approvalDecision:
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION,
    executedAt:
      "2026-07-22T17:31:08.182Z",
  });
