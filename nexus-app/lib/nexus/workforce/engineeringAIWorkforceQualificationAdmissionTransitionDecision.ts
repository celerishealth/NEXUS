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
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION_VERSION,
  type EngineeringAIWorkforceTemplatePreparedTransitionExecution,
  validateEngineeringAIWorkforceTemplatePreparedTransitionExecution,
} from "./engineeringAIWorkforceTemplatePreparedTransitionExecution";

export const ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-qualification-admission-transition-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISIONS = [
  "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION",
  "REJECT_AND_RETAIN_ENGINEERING_TEMPLATES_PREPARED",
] as const;

export type EngineeringAIWorkforceQualificationAdmissionTransitionDecisionValue =
  (
    typeof ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceQualificationAdmissionTransitionDecisionInput {
  readonly templatePreparedTransitionExecution:
    EngineeringAIWorkforceTemplatePreparedTransitionExecution;
  readonly decisionId: string;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision:
    EngineeringAIWorkforceQualificationAdmissionTransitionDecisionValue;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceQualificationAdmissionCandidateEligibility {
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
    "TEMPLATE_PREPARED";
  readonly targetLifecycleState:
    "QUALIFICATION_ADMISSION_PENDING";
  readonly sourceTemplatePreparedTransitionExecuted:
    true;
  readonly sourceTemplatePrepared:
    true;
  readonly sourceTransitionRecordPreserved:
    true;
  readonly sourceFactoryRecordPreserved:
    true;
  readonly templateEvidenceBound:
    true;
  readonly qualificationAdmissionTransitionAuthorized:
    boolean;
  readonly qualificationAdmissionTransitionExecuted:
    false;
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

export interface EngineeringAIWorkforceQualificationAdmissionTransitionDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION_DECISION_RECORDED";
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly sourceExecutionVersion:
    typeof ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION_VERSION;
  readonly sourceExecutionId: string;
  readonly sourceExecutionDigest: string;
  readonly sourceFactoryFoundationDigest:
    string;
  readonly decision:
    EngineeringAIWorkforceQualificationAdmissionTransitionDecisionValue;
  readonly qualificationAdmissionTransitionApproved:
    boolean;
  readonly reason: string;
  readonly reviewedEvidence: Readonly<{
    candidateCount: 8;
    sourceLifecycleState:
      "TEMPLATE_PREPARED";
    targetLifecycleState:
      "QUALIFICATION_ADMISSION_PENDING";
    exactTemplatePreparedExecutionBound:
      true;
    allowedSequentialTransitionVerified:
      true;
    exactCandidateIdentityBindingVerified:
      true;
    immutableTemplateEvidenceVerified:
      true;
    directQualificationExecutionBypassBlocked:
      true;
    admittedCandidateCount: 0;
    qualificationExecutionCandidateCount:
      0;
    qualifiedCandidateCount: 0;
    activationEligibleCandidateCount: 0;
    founderLiberationAchieved: false;
  }>;
  readonly candidateQualificationAdmissionEligibility:
    readonly EngineeringAIWorkforceQualificationAdmissionCandidateEligibility[];
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
    qualificationAdmissionTransitionAuthorized:
      boolean;
    qualificationAdmissionTransitionExecuted:
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
    | "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION"
    | "RETAIN_ENGINEERING_TEMPLATES_PREPARED";
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

export function validateEngineeringAIWorkforceQualificationAdmissionTransitionDecision(
  decision:
    EngineeringAIWorkforceQualificationAdmissionTransitionDecision,
): void {
  const source =
    ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION;

  validateEngineeringAIWorkforceTemplatePreparedTransitionExecution(
    source,
  );

  requireIdentifier(
    "Engineering qualification-admission decision ID",
    decision.decisionId,
  );

  requireTimestamp(
    "Engineering qualification-admission decision time",
    decision.decidedAt,
  );

  requireDigest(
    "Engineering qualification-admission source execution digest",
    decision.sourceExecutionDigest,
  );

  requireDigest(
    "Engineering qualification-admission source Factory digest",
    decision.sourceFactoryFoundationDigest,
  );

  requireDigest(
    "Engineering qualification-admission decision digest",
    decision.decisionDigest,
  );

  const approved =
    decision.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION";

  if (
    decision.version !==
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION_DECISION_RECORDED" ||
    decision.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    !ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISIONS.includes(
      decision.decision,
    ) ||
    decision.qualificationAdmissionTransitionApproved !==
      approved ||
    decision.sourceExecutionVersion !==
      source.version ||
    decision.sourceExecutionId !==
      source.executionId ||
    decision.sourceExecutionDigest !==
      source.executionDigest ||
    decision.sourceFactoryFoundationDigest !==
      source.sourceFactoryFoundationDigest ||
    decision.candidateQualificationAdmissionEligibility.length !==
      8 ||
    Date.parse(decision.decidedAt) <
      Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Engineering qualification-admission transition decision identity is invalid.",
    );
  }

  requireUnique(
    "Engineering qualification-admission employee IDs",
    decision.candidateQualificationAdmissionEligibility.map(
      (candidate) =>
        candidate.employeeId,
    ),
  );

  requireUnique(
    "Engineering qualification-admission template IDs",
    decision.candidateQualificationAdmissionEligibility.map(
      (candidate) =>
        candidate.templateId,
    ),
  );

  requireUnique(
    "Engineering qualification-admission source transition-record IDs",
    decision.candidateQualificationAdmissionEligibility.map(
      (candidate) =>
        candidate.sourceTransitionRecordId,
    ),
  );

  decision.candidateQualificationAdmissionEligibility.forEach(
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
          "TEMPLATE_PREPARED" ||
        candidate.targetLifecycleState !==
          "QUALIFICATION_ADMISSION_PENDING" ||
        candidate.sourceTemplatePreparedTransitionExecuted !==
          true ||
        candidate.sourceTemplatePrepared !==
          true ||
        candidate.sourceTransitionRecordPreserved !==
          true ||
        candidate.sourceFactoryRecordPreserved !==
          true ||
        candidate.templateEvidenceBound !==
          true ||
        candidate.qualificationAdmissionTransitionAuthorized !==
          approved ||
        candidate.qualificationAdmissionTransitionExecuted !==
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
          false ||
        sourceRecord.sourceLifecycleState !==
          "TEMPLATE_PREPARATION_PENDING" ||
        sourceRecord.targetLifecycleState !==
          "TEMPLATE_PREPARED" ||
        sourceRecord.templatePreparedTransitionExecuted !==
          true ||
        sourceRecord.templatePrepared !==
          true ||
        sourceRecord.qualificationAdmissionAuthorized !==
          false ||
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
          "Engineering qualification-admission candidate evidence is invalid.",
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
      "TEMPLATE_PREPARED" ||
    evidence.targetLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING" ||
    evidence.exactTemplatePreparedExecutionBound !==
      true ||
    evidence.allowedSequentialTransitionVerified !==
      true ||
    evidence.exactCandidateIdentityBindingVerified !==
      true ||
    evidence.immutableTemplateEvidenceVerified !==
      true ||
    evidence.directQualificationExecutionBypassBlocked !==
      true ||
    evidence.admittedCandidateCount !==
      0 ||
    evidence.qualificationExecutionCandidateCount !==
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
    boundary.qualificationAdmissionTransitionAuthorized !==
      approved ||
    boundary.qualificationAdmissionTransitionExecuted !==
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
    decision.nextStep !==
      (
        approved
          ? "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION"
          : "RETAIN_ENGINEERING_TEMPLATES_PREPARED"
      )
  ) {
    throw new Error(
      "Engineering qualification-admission transition decision boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      decision.candidateQualificationAdmissionEligibility,
    ) ||
    decision.candidateQualificationAdmissionEligibility.some(
      (candidate) =>
        !Object.isFrozen(candidate),
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering qualification-admission transition decision must remain immutable.",
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
      "Engineering qualification-admission transition decision integrity is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceQualificationAdmissionTransitionDecision(
  input:
    CreateEngineeringAIWorkforceQualificationAdmissionTransitionDecisionInput,
): EngineeringAIWorkforceQualificationAdmissionTransitionDecision {
  const source =
    input.templatePreparedTransitionExecution;

  validateEngineeringAIWorkforceTemplatePreparedTransitionExecution(
    source,
  );

  requireIdentifier(
    "Engineering qualification-admission decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Engineering qualification-admission decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the verified NEXUS owner may decide Engineering qualification admission.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Engineering qualification-admission decision is unsupported.",
    );
  }

  if (
    input.reason.trim().length <
      24
  ) {
    throw new Error(
      "Engineering qualification-admission decision requires a substantive reason.",
    );
  }

  if (
    source !==
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION ||
    source.executionState !==
      "OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION_EXECUTED" ||
    source.transitionedCandidateCount !==
      8 ||
    source.transitionRecords.length !==
      8 ||
    source.targetLifecycleState !==
      "TEMPLATE_PREPARED" ||
    source.authorityBoundary.templatePrepared !==
      true ||
    source.authorityBoundary.qualificationAdmissionAuthorized !==
      false ||
    source.authorityBoundary.qualificationExecutionAuthorized !==
      false ||
    source.authorityBoundary.ownerQualificationApproved !==
      false ||
    source.authorityBoundary.ownerActivationApproved !==
      false ||
    source.authorityBoundary.runtimeAuthorized !==
      false
  ) {
    throw new Error(
      "Exact completed and inactive Engineering template-prepared execution is required.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Engineering qualification-admission decision cannot precede template-prepared execution.",
    );
  }

  const templatePreparedTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .TEMPLATE_PREPARED as readonly string[];

  if (
    !templatePreparedTargets.includes(
      "QUALIFICATION_ADMISSION_PENDING",
    ) ||
    templatePreparedTargets.includes(
      "QUALIFICATION_IN_PROGRESS",
    )
  ) {
    throw new Error(
      "Engineering qualification admission must use the exact sequential Factory transition.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION";

  const candidateQualificationAdmissionEligibility =
    source.transitionRecords.map(
      (
        record,
        index,
      ) => {
        if (
          record.targetLifecycleState !==
            "TEMPLATE_PREPARED" ||
          record.templatePreparedTransitionExecuted !==
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
          record.ownerActivationApproved !==
            false ||
          record.runtimeAuthorized !==
            false
        ) {
          throw new Error(
            "Engineering qualification admission requires exact prepared and inactive source evidence.",
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
            "TEMPLATE_PREPARED" as const,
          targetLifecycleState:
            "QUALIFICATION_ADMISSION_PENDING" as const,
          sourceTemplatePreparedTransitionExecuted:
            true as const,
          sourceTemplatePrepared:
            true as const,
          sourceTransitionRecordPreserved:
            true as const,
          sourceFactoryRecordPreserved:
            true as const,
          templateEvidenceBound:
            true as const,
          qualificationAdmissionTransitionAuthorized:
            approved,
          qualificationAdmissionTransitionExecuted:
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
      ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION_DECISION_RECORDED" as const,
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
    qualificationAdmissionTransitionApproved:
      approved,
    reason:
      input.reason,
    reviewedEvidence: {
      candidateCount:
        8 as const,
      sourceLifecycleState:
        "TEMPLATE_PREPARED" as const,
      targetLifecycleState:
        "QUALIFICATION_ADMISSION_PENDING" as const,
      exactTemplatePreparedExecutionBound:
        true as const,
      allowedSequentialTransitionVerified:
        true as const,
      exactCandidateIdentityBindingVerified:
        true as const,
      immutableTemplateEvidenceVerified:
        true as const,
      directQualificationExecutionBypassBlocked:
        true as const,
      admittedCandidateCount:
        0 as const,
      qualificationExecutionCandidateCount:
        0 as const,
      qualifiedCandidateCount:
        0 as const,
      activationEligibleCandidateCount:
        0 as const,
      founderLiberationAchieved:
        false as const,
    },
    candidateQualificationAdmissionEligibility,
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
      qualificationAdmissionTransitionAuthorized:
        approved,
      qualificationAdmissionTransitionExecuted:
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
        ? "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_TRANSITION" as const
        : "RETAIN_ENGINEERING_TEMPLATES_PREPARED" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceQualificationAdmissionTransitionDecision;

  validateEngineeringAIWorkforceQualificationAdmissionTransitionDecision(
    decision,
  );

  return decision;
}
