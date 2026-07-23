import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "./engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,
  validateEngineeringAIWorkforceActivationCandidateIssuance,
} from "./engineeringAIWorkforceActivationCandidateIssuance";

export const ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-owner-activation-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISIONS = [
  "APPROVE_ENGINEERING_OWNER_ACTIVATION",
  "REJECT_ENGINEERING_OWNER_ACTIVATION",
] as const;

export type EngineeringAIWorkforceOwnerActivationDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISIONS)[number];

export interface CreateEngineeringAIWorkforceOwnerActivationDecisionInput {
  readonly activationCandidateIssuance:
    typeof ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE;

  readonly decisionId:
    string;

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly decision:
    EngineeringAIWorkforceOwnerActivationDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface EngineeringAIWorkforceCandidateOwnerActivationDecision {
  readonly developmentSequence:
    number;

  readonly decisionState:
    "ENGINEERING_CANDIDATE_OWNER_ACTIVATION_DECISION_RECORDED";

  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;

  readonly templateId: string;
  readonly runtimeId: string;

  readonly activationCandidateDigest:
    string;

  readonly pausedRuntimeDigest:
    string;

  readonly qualifiedManifestDigest:
    string;

  readonly qualificationDigest:
    string;

  readonly decision:
    EngineeringAIWorkforceOwnerActivationDecisionType;

  readonly ownerActivationApproved:
    boolean;

  readonly runtimeActivationEligible:
    boolean;

  readonly authorityBoundary: Readonly<{
    ownerDecisionRequired:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    activationCandidateBound:
      true;

    qualificationBound:
      true;

    qualifiedManifestBound:
      true;

    approvalBypassAllowed:
      false;

    activationCandidatePrepared:
      true;

    ownerActivationDecisionRecorded:
      true;

    runtimeActivationExecuted:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly candidateDecisionDigest:
    string;
}

export interface EngineeringAIWorkforceOwnerActivationDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "ENGINEERING_OWNER_ACTIVATION_DECISION_RECORDED";

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly sourceActivationCandidateIssuanceId:
    string;

  readonly sourceActivationCandidateIssuanceDigest:
    string;

  readonly decision:
    EngineeringAIWorkforceOwnerActivationDecisionType;

  readonly ownerActivationApproved:
    boolean;

  readonly runtimeActivationEligible:
    boolean;

  readonly candidateDecisionCount:
    8;

  readonly candidateDecisions:
    readonly EngineeringAIWorkforceCandidateOwnerActivationDecision[];

  readonly aggregateSummary: Readonly<{
    activationCandidateCount:
      8;

    ownerActivationDecisionCount:
      8;

    ownerActivationApprovedCount:
      number;

    runtimeActivationEligibleCount:
      number;

    runtimeActivationExecutedCount:
      0;

    activatedRuntimeCount:
      0;

    controlledWorkAuthorizationCount:
      0;

    exactEightOwnerDecisionsRecorded:
      true;

    exactCandidateSequencePreserved:
      true;

    exactCandidateIdentityPreserved:
      true;

    exactActivationCandidateBindingsPreserved:
      true;

    uniqueCandidateDecisionDigests:
      8;
  }>;

  readonly reason:
    string;

  readonly nextStep:
    | "PREPARE_ENGINEERING_OWNER_ACTIVATED_RUNTIMES"
    | "RETAIN_ENGINEERING_PAUSED_RUNTIMES";

  readonly authorityBoundary: Readonly<{
    canonicalActivationCandidateIssuanceBound:
      true;

    exactEightCandidatesRequired:
      true;

    ownerDecisionRequired:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    approvalBypassAllowed:
      false;

    activationCandidatePrepared:
      true;

    ownerActivationDecisionRecorded:
      true;

    ownerActivationApproved:
      boolean;

    runtimePreparationAuthorized:
      boolean;

    runtimeActivationExecuted:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

const FORBIDDEN_SECRET_PATTERN =
  /(secret|password|access[_ -]?token|refresh[_ -]?token|authorization|bearer|cookie|session[_ -]?token|private[_ -]?key)/i;

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

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Engineering owner-activation decision value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
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
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireReason(
  reason: string,
): string {
  const normalized =
    reason.trim();

  if (
    normalized.length < 12 ||
    normalized.length > 1000
  ) {
    throw new Error(
      "Engineering owner-activation reason length is invalid.",
    );
  }

  if (
    FORBIDDEN_SECRET_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Engineering owner-activation reason contains secret-bearing content.",
    );
  }

  return normalized;
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

export function validateEngineeringAIWorkforceOwnerActivationDecision(
  record:
    EngineeringAIWorkforceOwnerActivationDecision,
): void {
  validateEngineeringAIWorkforceActivationCandidateIssuance(
    ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,
  );

  requireIdentifier(
    "Engineering owner-activation decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Engineering owner-activation decision time",
    record.decidedAt,
  );

  requireDigest(
    "Engineering owner-activation decision digest",
    record.decisionDigest,
  );

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION_VERSION ||
    record.decisionState !==
      "ENGINEERING_OWNER_ACTIVATION_DECISION_RECORDED" ||
    record.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    record.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.sourceActivationCandidateIssuanceId !==
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
        .activationCandidateIssuanceId ||
    record.sourceActivationCandidateIssuanceDigest !==
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
        .issuanceDigest ||
    record.candidateDecisionCount !==
      8 ||
    record.candidateDecisions.length !==
      8
  ) {
    throw new Error(
      "Engineering owner-activation decision identity is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_ENGINEERING_OWNER_ACTIVATION" &&
    record.decision !==
      "REJECT_ENGINEERING_OWNER_ACTIVATION"
  ) {
    throw new Error(
      "Engineering owner-activation decision is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_ENGINEERING_OWNER_ACTIVATION";

  if (
    record.ownerActivationApproved !==
      approved ||
    record.runtimeActivationEligible !==
      approved
  ) {
    throw new Error(
      "Engineering owner-activation eligibility is invalid.",
    );
  }

  requireUnique(
    "Engineering owner-activation employee IDs",
    record.candidateDecisions.map(
      (entry) =>
        entry.employeeId,
    ),
  );

  requireUnique(
    "Engineering owner-activation runtime IDs",
    record.candidateDecisions.map(
      (entry) =>
        entry.runtimeId,
    ),
  );

  requireUnique(
    "Engineering candidate owner-decision digests",
    record.candidateDecisions.map(
      (entry) =>
        entry.candidateDecisionDigest,
    ),
  );

  record.candidateDecisions.forEach(
    (
      entry,
      index,
    ) => {
      const source =
        ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
          .candidateIssuances[index];

      if (!source) {
        throw new Error(
          "Engineering owner-activation source candidate is missing.",
        );
      }

      requireDigest(
        "Engineering candidate owner-decision digest",
        entry.candidateDecisionDigest,
      );

      const {
        candidateDecisionDigest,
        ...entryCore
      } = entry;

      const boundary =
        entry.authorityBoundary;

      if (
        sha256(entryCore) !==
          candidateDecisionDigest ||
        entry.developmentSequence !==
          index + 1 ||
        entry.decisionState !==
          "ENGINEERING_CANDIDATE_OWNER_ACTIVATION_DECISION_RECORDED" ||
        entry.employeeId !==
          source.employeeId ||
        entry.employeeCode !==
          source.employeeCode ||
        entry.publicName !==
          source.publicName ||
        entry.officialRole !==
          source.officialRole ||
        entry.templateId !==
          source.templateId ||
        entry.runtimeId !==
          source.runtimeId ||
        entry.activationCandidateDigest !==
          source.activationCandidateDigest ||
        entry.pausedRuntimeDigest !==
          source.pausedRuntimeDigest ||
        entry.qualifiedManifestDigest !==
          source.qualifiedManifestDigest ||
        entry.qualificationDigest !==
          source.qualificationDigest ||
        entry.decision !==
          record.decision ||
        entry.ownerActivationApproved !==
          approved ||
        entry.runtimeActivationEligible !==
          approved
      ) {
        throw new Error(
          "Engineering candidate owner-activation decision binding is invalid.",
        );
      }

      if (
        boundary.ownerDecisionRequired !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.activationCandidateBound !==
          true ||
        boundary.qualificationBound !==
          true ||
        boundary.qualifiedManifestBound !==
          true ||
        boundary.approvalBypassAllowed !==
          false ||
        boundary.activationCandidatePrepared !==
          true ||
        boundary.ownerActivationDecisionRecorded !==
          true ||
        boundary.runtimeActivationExecuted !==
          false ||
        boundary.runtimeActivated !==
          false ||
        boundary.controlledWorkAuthorized !==
          false ||
        boundary.repositoryReadAuthorized !==
          false ||
        boundary.repositoryWriteAuthorized !==
          false ||
        boundary.productionDeploymentAuthorized !==
          false ||
        boundary.realCustomerDataAccessAuthorized !==
          false ||
        boundary.realCustomerContactAuthorized !==
          false ||
        boundary.externalDeliveryAuthorized !==
          false ||
        boundary.liveProviderExecutionAuthorized !==
          false ||
        boundary.productionDatabaseAuthorized !==
          false ||
        boundary.productionMutationAuthorized !==
          false ||
        boundary.paymentExecutionAuthorized !==
          false ||
        boundary.autonomousDecisionAuthorized !==
          false ||
        boundary.productionReadinessAuthorized !==
          false ||
        boundary.publicLaunchAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering candidate owner-activation authority boundary is invalid.",
        );
      }
    },
  );

  const summary =
    record.aggregateSummary;

  if (
    summary.activationCandidateCount !==
      8 ||
    summary.ownerActivationDecisionCount !==
      8 ||
    summary.ownerActivationApprovedCount !==
      (approved ? 8 : 0) ||
    summary.runtimeActivationEligibleCount !==
      (approved ? 8 : 0) ||
    summary.runtimeActivationExecutedCount !==
      0 ||
    summary.activatedRuntimeCount !==
      0 ||
    summary.controlledWorkAuthorizationCount !==
      0 ||
    summary.exactEightOwnerDecisionsRecorded !==
      true ||
    summary.exactCandidateSequencePreserved !==
      true ||
    summary.exactCandidateIdentityPreserved !==
      true ||
    summary.exactActivationCandidateBindingsPreserved !==
      true ||
    summary.uniqueCandidateDecisionDigests !==
      8
  ) {
    throw new Error(
      "Engineering owner-activation aggregate summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalActivationCandidateIssuanceBound !==
      true ||
    boundary.exactEightCandidatesRequired !==
      true ||
    boundary.ownerDecisionRequired !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.activationCandidatePrepared !==
      true ||
    boundary.ownerActivationDecisionRecorded !==
      true ||
    boundary.ownerActivationApproved !==
      approved ||
    boundary.runtimePreparationAuthorized !==
      approved ||
    boundary.runtimeActivationExecuted !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.controlledWorkAuthorized !==
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
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Engineering owner-activation aggregate authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      (
        approved
          ? "PREPARE_ENGINEERING_OWNER_ACTIVATED_RUNTIMES"
          : "RETAIN_ENGINEERING_PAUSED_RUNTIMES"
      )
  ) {
    throw new Error(
      "Engineering owner-activation next step is invalid.",
    );
  }

  if (
    Date.parse(record.decidedAt) <
    Date.parse(
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
        .preparedAt,
    )
  ) {
    throw new Error(
      "Engineering owner-activation decision cannot precede activation-candidate preparation.",
    );
  }

  requireReason(
    record.reason,
  );

  const {
    decisionDigest,
    ...recordCore
  } = record;

  if (
    sha256(recordCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Engineering owner-activation decision integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.candidateDecisions,
    ) ||
    record.candidateDecisions.some(
      (entry) =>
        !Object.isFrozen(entry) ||
        !Object.isFrozen(
          entry.authorityBoundary,
        ),
    ) ||
    !Object.isFrozen(
      record.aggregateSummary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering owner-activation decision must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceOwnerActivationDecision(
  input:
    CreateEngineeringAIWorkforceOwnerActivationDecisionInput,
): EngineeringAIWorkforceOwnerActivationDecision {
  if (
    input.activationCandidateIssuance !==
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
  ) {
    throw new Error(
      "Only the canonical Engineering activation-candidate issuance can receive the owner decision.",
    );
  }

  validateEngineeringAIWorkforceActivationCandidateIssuance(
    input.activationCandidateIssuance,
  );

  requireIdentifier(
    "Engineering owner-activation decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Engineering owner-activation decision time",
    input.decidedAt,
  );

  const reason =
    requireReason(
      input.reason,
    );

  if (
    input.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    input.tenantId !==
      input.activationCandidateIssuance
        .tenantId
  ) {
    throw new Error(
      "Cross-tenant Engineering owner-activation decision is blocked.",
    );
  }

  if (
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    input.ownerId !==
      input.activationCandidateIssuance
        .ownerId
  ) {
    throw new Error(
      "Only the activation-candidate-bound NEXUS owner can issue the Engineering activation decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_ENGINEERING_OWNER_ACTIVATION" &&
    input.decision !==
      "REJECT_ENGINEERING_OWNER_ACTIVATION"
  ) {
    throw new Error(
      "Engineering owner-activation decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(
      input.activationCandidateIssuance
        .preparedAt,
    )
  ) {
    throw new Error(
      "Engineering owner-activation decision cannot precede activation-candidate preparation.",
    );
  }

  if (
    input.activationCandidateIssuance
      .issuanceState !==
        "ENGINEERING_ACTIVATION_CANDIDATES_PREPARED" ||
    input.activationCandidateIssuance
      .candidateIssuances.length !==
        8 ||
    input.activationCandidateIssuance
      .aggregateSummary
      .ownerActivationDecisionCount !==
        0 ||
    input.activationCandidateIssuance
      .aggregateSummary
      .activatedRuntimeCount !==
        0 ||
    input.activationCandidateIssuance
      .aggregateSummary
      .controlledWorkAuthorizationCount !==
        0 ||
    input.activationCandidateIssuance
      .authorityBoundary
      .ownerActivationDecisionRequired !==
        true ||
    input.activationCandidateIssuance
      .authorityBoundary
      .ownerActivationDecisionRecorded !==
        false ||
    input.activationCandidateIssuance
      .nextStep !==
        "AWAIT_ENGINEERING_OWNER_ACTIVATION_DECISION"
  ) {
    throw new Error(
      "Engineering owner-activation decision requires complete undecided activation-candidate issuance.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_ENGINEERING_OWNER_ACTIVATION";

  const candidateDecisions =
    input.activationCandidateIssuance
      .candidateIssuances
      .map(
        (
          source,
          index,
        ) => {
          const runtime =
            source.activationCandidate
              .pausedRuntime;

          if (
            source.activationCandidate
              .ownerActivationRequired !==
                true ||
            source.activationCandidate
              .activationEligible !==
                true ||
            runtime.runtimeState !==
              "PAUSED_AWAITING_OWNER" ||
            runtime.ownerActivated !==
              false ||
            runtime.controlledWorkAuthorized !==
              false
          ) {
            throw new Error(
              "Engineering activation candidate is not safely paused for owner review.",
            );
          }

          const entryCore = {
            developmentSequence:
              index + 1,

            decisionState:
              "ENGINEERING_CANDIDATE_OWNER_ACTIVATION_DECISION_RECORDED" as const,

            employeeId:
              source.employeeId,

            employeeCode:
              source.employeeCode,

            publicName:
              source.publicName,

            officialRole:
              source.officialRole,

            templateId:
              source.templateId,

            runtimeId:
              source.runtimeId,

            activationCandidateDigest:
              source.activationCandidateDigest,

            pausedRuntimeDigest:
              source.pausedRuntimeDigest,

            qualifiedManifestDigest:
              source.qualifiedManifestDigest,

            qualificationDigest:
              source.qualificationDigest,

            decision:
              input.decision,

            ownerActivationApproved:
              approved,

            runtimeActivationEligible:
              approved,

            authorityBoundary: {
              ownerDecisionRequired:
                true as const,

              ownerIdentityBound:
                true as const,

              tenantIdentityBound:
                true as const,

              activationCandidateBound:
                true as const,

              qualificationBound:
                true as const,

              qualifiedManifestBound:
                true as const,

              approvalBypassAllowed:
                false as const,

              activationCandidatePrepared:
                true as const,

              ownerActivationDecisionRecorded:
                true as const,

              runtimeActivationExecuted:
                false as const,

              runtimeActivated:
                false as const,

              controlledWorkAuthorized:
                false as const,

              repositoryReadAuthorized:
                false as const,

              repositoryWriteAuthorized:
                false as const,

              productionDeploymentAuthorized:
                false as const,

              realCustomerDataAccessAuthorized:
                false as const,

              realCustomerContactAuthorized:
                false as const,

              externalDeliveryAuthorized:
                false as const,

              liveProviderExecutionAuthorized:
                false as const,

              productionDatabaseAuthorized:
                false as const,

              productionMutationAuthorized:
                false as const,

              paymentExecutionAuthorized:
                false as const,

              autonomousDecisionAuthorized:
                false as const,

              productionReadinessAuthorized:
                false as const,

              publicLaunchAuthorized:
                false as const,
            },
          };

          return deepFreeze({
            ...entryCore,

            candidateDecisionDigest:
              sha256(entryCore),
          });
        },
      );

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "ENGINEERING_OWNER_ACTIVATION_DECISION_RECORDED" as const,

    tenantId:
      input.tenantId,

    ownerId:
      input.ownerId,

    sourceActivationCandidateIssuanceId:
      input.activationCandidateIssuance
        .activationCandidateIssuanceId,

    sourceActivationCandidateIssuanceDigest:
      input.activationCandidateIssuance
        .issuanceDigest,

    decision:
      input.decision,

    ownerActivationApproved:
      approved,

    runtimeActivationEligible:
      approved,

    candidateDecisionCount:
      8 as const,

    candidateDecisions,

    aggregateSummary: {
      activationCandidateCount:
        8 as const,

      ownerActivationDecisionCount:
        8 as const,

      ownerActivationApprovedCount:
        approved
          ? 8
          : 0,

      runtimeActivationEligibleCount:
        approved
          ? 8
          : 0,

      runtimeActivationExecutedCount:
        0 as const,

      activatedRuntimeCount:
        0 as const,

      controlledWorkAuthorizationCount:
        0 as const,

      exactEightOwnerDecisionsRecorded:
        true as const,

      exactCandidateSequencePreserved:
        true as const,

      exactCandidateIdentityPreserved:
        true as const,

      exactActivationCandidateBindingsPreserved:
        true as const,

      uniqueCandidateDecisionDigests:
        8 as const,
    },

    reason,

    nextStep:
      approved
        ? "PREPARE_ENGINEERING_OWNER_ACTIVATED_RUNTIMES" as const
        : "RETAIN_ENGINEERING_PAUSED_RUNTIMES" as const,

    authorityBoundary: {
      canonicalActivationCandidateIssuanceBound:
        true as const,

      exactEightCandidatesRequired:
        true as const,

      ownerDecisionRequired:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      activationCandidatePrepared:
        true as const,

      ownerActivationDecisionRecorded:
        true as const,

      ownerActivationApproved:
        approved,

      runtimePreparationAuthorized:
        approved,

      runtimeActivationExecuted:
        false as const,

      runtimeActivated:
        false as const,

      controlledWorkAuthorized:
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

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      productionMutationAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      financialCommitmentAuthorized:
        false as const,

      legalCommitmentAuthorized:
        false as const,

      autonomousDecisionAuthorized:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceOwnerActivationDecision;

  validateEngineeringAIWorkforceOwnerActivationDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION =
  createEngineeringAIWorkforceOwnerActivationDecision({
    activationCandidateIssuance:
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,

    decisionId:
      "engineering-ai-workforce-owner-activation-decision-001",

    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    decision:
      "APPROVE_ENGINEERING_OWNER_ACTIVATION",

    reason:
      "Owner Prashant Srivastav explicitly approved owner activation preparation for all eight qualified Engineering AI specialists while runtime execution and every external authority remain separately blocked.",

    decidedAt:
      "2026-07-23T08:02:12.340Z",
  });
