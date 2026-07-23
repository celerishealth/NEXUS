import {
  createHash,
} from "node:crypto";

import {
  createAIEmployeeRuntimeContract,
  type AIEmployeeRuntimeContract,
} from "./aiEmployeeManifest";

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

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,
  validateEngineeringAIWorkforceOwnerActivationDecision,
} from "./engineeringAIWorkforceOwnerActivationDecision";

export const ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION =
  "nexus-engineering-ai-workforce-owner-activated-runtime-issuance-v1" as const;

export interface CreateEngineeringAIWorkforceOwnerActivatedRuntimeIssuanceInput {
  readonly runtimeIssuanceId:
    string;

  readonly activationCandidateIssuance:
    typeof ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE;

  readonly ownerActivationDecision:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION;

  readonly activatedAt:
    string;
}

export interface EngineeringAIWorkforceCandidateOwnerActivatedRuntimeIssuance {
  readonly developmentSequence:
    number;

  readonly issuanceState:
    "ENGINEERING_CANDIDATE_OWNER_ACTIVATED_RUNTIME_ISSUED";

  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;

  readonly templateId: string;
  readonly runtimeId: string;

  readonly activationCandidateDigest:
    string;

  readonly ownerActivationDecisionDigest:
    string;

  readonly qualificationDigest:
    string;

  readonly qualifiedManifestDigest:
    string;

  readonly pausedRuntimeDigest:
    string;

  readonly ownerActivatedRuntime:
    AIEmployeeRuntimeContract;

  readonly ownerActivatedRuntimeDigest:
    string;

  readonly authorityBoundary: Readonly<{
    activationCandidateBound:
      true;

    ownerActivationDecisionBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    qualificationBound:
      true;

    qualifiedManifestBound:
      true;

    runtimeIdentityPreserved:
      true;

    approvalBypassAllowed:
      false;

    runtimeActivationExecuted:
      true;

    runtimeActivated:
      true;

    controlledWorkAuthorized:
      true;

    emergencyPauseAvailable:
      true;

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

  readonly candidateRuntimeIssuanceDigest:
    string;
}

export interface EngineeringAIWorkforceOwnerActivatedRuntimeIssuance {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION;

  readonly runtimeIssuanceId:
    string;

  readonly issuanceState:
    "ENGINEERING_OWNER_ACTIVATED_RUNTIMES_ISSUED";

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly sourceActivationCandidateIssuanceId:
    string;

  readonly sourceActivationCandidateIssuanceDigest:
    string;

  readonly sourceOwnerActivationDecisionId:
    string;

  readonly sourceOwnerActivationDecisionDigest:
    string;

  readonly runtimeCount:
    8;

  readonly candidateRuntimeIssuances:
    readonly EngineeringAIWorkforceCandidateOwnerActivatedRuntimeIssuance[];

  readonly aggregateSummary: Readonly<{
    activationCandidateCount:
      8;

    ownerActivationApprovalCount:
      8;

    runtimeActivationExecutedCount:
      8;

    activatedRuntimeCount:
      8;

    controlledWorkAuthorizationCount:
      8;

    emergencyPauseAvailableCount:
      8;

    exactEightOwnerActivatedRuntimesIssued:
      true;

    exactCandidateSequencePreserved:
      true;

    exactCandidateIdentityPreserved:
      true;

    exactRuntimeIdentityPreserved:
      true;

    exactManifestBindingsPreserved:
      true;

    uniqueOwnerActivatedRuntimeDigests:
      8;

    pausedRuntimeDigestReplacementCount:
      8;
  }>;

  readonly nextStep:
    "PREPARE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS";

  readonly authorityBoundary: Readonly<{
    canonicalActivationCandidateIssuanceBound:
      true;

    canonicalOwnerActivationDecisionBound:
      true;

    exactEightCandidatesRequired:
      true;

    ownerActivationApproved:
      true;

    runtimeActivationExecuted:
      true;

    runtimeActivated:
      true;

    controlledWorkAuthorized:
      true;

    controlledInternalWorkOnly:
      true;

    emergencyPauseAvailable:
      true;

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

    controlledShadowOperationPrepared:
      false;

    controlledShadowOperationExecuted:
      false;
  }>;

  readonly activatedAt:
    string;

  readonly runtimeIssuanceDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

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
      "Unsupported deterministic Engineering owner-activated runtime value.",
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

export function validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
  issuance:
    EngineeringAIWorkforceOwnerActivatedRuntimeIssuance,
): void {
  validateEngineeringAIWorkforceActivationCandidateIssuance(
    ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,
  );

  validateEngineeringAIWorkforceOwnerActivationDecision(
    ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,
  );

  requireIdentifier(
    "Engineering owner-activated runtime issuance ID",
    issuance.runtimeIssuanceId,
  );

  requireTimestamp(
    "Engineering runtime activation time",
    issuance.activatedAt,
  );

  requireDigest(
    "Engineering runtime issuance digest",
    issuance.runtimeIssuanceDigest,
  );

  if (
    issuance.version !==
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION ||
    issuance.issuanceState !==
      "ENGINEERING_OWNER_ACTIVATED_RUNTIMES_ISSUED" ||
    issuance.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    issuance.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    issuance.sourceActivationCandidateIssuanceId !==
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
        .activationCandidateIssuanceId ||
    issuance.sourceActivationCandidateIssuanceDigest !==
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
        .issuanceDigest ||
    issuance.sourceOwnerActivationDecisionId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
        .decisionId ||
    issuance.sourceOwnerActivationDecisionDigest !==
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
        .decisionDigest ||
    issuance.runtimeCount !==
      8 ||
    issuance.candidateRuntimeIssuances.length !==
      8
  ) {
    throw new Error(
      "Engineering owner-activated runtime issuance identity is invalid.",
    );
  }

  requireUnique(
    "Engineering activated runtime employee IDs",
    issuance.candidateRuntimeIssuances.map(
      (entry) =>
        entry.employeeId,
    ),
  );

  requireUnique(
    "Engineering activated runtime IDs",
    issuance.candidateRuntimeIssuances.map(
      (entry) =>
        entry.runtimeId,
    ),
  );

  requireUnique(
    "Engineering owner-activated runtime digests",
    issuance.candidateRuntimeIssuances.map(
      (entry) =>
        entry.ownerActivatedRuntimeDigest,
    ),
  );

  requireUnique(
    "Engineering candidate runtime issuance digests",
    issuance.candidateRuntimeIssuances.map(
      (entry) =>
        entry.candidateRuntimeIssuanceDigest,
    ),
  );

  issuance.candidateRuntimeIssuances.forEach(
    (
      entry,
      index,
    ) => {
      const source =
        ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
          .candidateIssuances[index];

      const decision =
        ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
          .candidateDecisions[index];

      if (
        !source ||
        !decision
      ) {
        throw new Error(
          "Engineering owner-activated runtime source evidence is missing.",
        );
      }

      requireDigest(
        "Engineering candidate runtime issuance digest",
        entry.candidateRuntimeIssuanceDigest,
      );

      requireDigest(
        "Engineering owner-activated runtime digest",
        entry.ownerActivatedRuntimeDigest,
      );

      const {
        candidateRuntimeIssuanceDigest,
        ...entryCore
      } = entry;

      const runtime =
        entry.ownerActivatedRuntime;

      const boundary =
        entry.authorityBoundary;

      if (
        sha256(entryCore) !==
          candidateRuntimeIssuanceDigest ||
        entry.developmentSequence !==
          index + 1 ||
        entry.issuanceState !==
          "ENGINEERING_CANDIDATE_OWNER_ACTIVATED_RUNTIME_ISSUED" ||
        entry.employeeId !==
          source.employeeId ||
        entry.employeeId !==
          decision.employeeId ||
        entry.employeeCode !==
          source.employeeCode ||
        entry.employeeCode !==
          decision.employeeCode ||
        entry.publicName !==
          source.publicName ||
        entry.publicName !==
          decision.publicName ||
        entry.officialRole !==
          source.officialRole ||
        entry.officialRole !==
          decision.officialRole ||
        entry.templateId !==
          source.templateId ||
        entry.templateId !==
          decision.templateId ||
        entry.runtimeId !==
          source.runtimeId ||
        entry.runtimeId !==
          decision.runtimeId ||
        entry.activationCandidateDigest !==
          source.activationCandidateDigest ||
        entry.ownerActivationDecisionDigest !==
          decision.candidateDecisionDigest ||
        entry.qualificationDigest !==
          source.qualificationDigest ||
        entry.qualificationDigest !==
          decision.qualificationDigest ||
        entry.qualifiedManifestDigest !==
          source.qualifiedManifestDigest ||
        entry.qualifiedManifestDigest !==
          decision.qualifiedManifestDigest ||
        entry.pausedRuntimeDigest !==
          source.pausedRuntimeDigest ||
        entry.pausedRuntimeDigest !==
          decision.pausedRuntimeDigest ||
        entry.ownerActivatedRuntimeDigest !==
          runtime.runtimeDigest ||
        decision.ownerActivationApproved !==
          true ||
        decision.runtimeActivationEligible !==
          true ||
        runtime.version !==
          "nexus-ai-employee-runtime-v1" ||
        runtime.runtimeId !==
          entry.runtimeId ||
        runtime.employeeId !==
          entry.employeeId ||
        runtime.templateId !==
          entry.templateId ||
        runtime.manifestDigest !==
          entry.qualifiedManifestDigest ||
        runtime.tenantId !==
          issuance.tenantId ||
        runtime.ownerId !==
          issuance.ownerId ||
        runtime.ownerActivated !==
          true ||
        runtime.runtimeState !==
          "READY_FOR_CONTROLLED_WORK" ||
        runtime.controlledWorkAuthorized !==
          true ||
        runtime.startedAt !==
          issuance.activatedAt ||
        runtime.runtimeDigest ===
          entry.pausedRuntimeDigest ||
        runtime.authority
          .ownerApprovalRequired !==
            true ||
        runtime.authority
          .approvalBypassAllowed !==
            false ||
        runtime.authority
          .tenantScoped !==
            true ||
        runtime.authority
          .crossTenantDelegationAllowed !==
            false ||
        runtime.safetyBoundary
          .emergencyPauseAvailable !==
            true ||
        runtime.safetyBoundary
          .liveProviderExecutionAuthorized !==
            false ||
        runtime.safetyBoundary
          .externalDeliveryAuthorized !==
            false ||
        runtime.safetyBoundary
          .paymentExecutionAuthorized !==
            false ||
        runtime.safetyBoundary
          .publicLaunchAuthorized !==
            false
      ) {
        throw new Error(
          "Engineering owner-activated runtime binding is invalid.",
        );
      }

      if (
        boundary.activationCandidateBound !==
          true ||
        boundary.ownerActivationDecisionBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.qualificationBound !==
          true ||
        boundary.qualifiedManifestBound !==
          true ||
        boundary.runtimeIdentityPreserved !==
          true ||
        boundary.approvalBypassAllowed !==
          false ||
        boundary.runtimeActivationExecuted !==
          true ||
        boundary.runtimeActivated !==
          true ||
        boundary.controlledWorkAuthorized !==
          true ||
        boundary.emergencyPauseAvailable !==
          true ||
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
          "Engineering candidate owner-activated runtime authority boundary is invalid.",
        );
      }
    },
  );

  const summary =
    issuance.aggregateSummary;

  if (
    summary.activationCandidateCount !==
      8 ||
    summary.ownerActivationApprovalCount !==
      8 ||
    summary.runtimeActivationExecutedCount !==
      8 ||
    summary.activatedRuntimeCount !==
      8 ||
    summary.controlledWorkAuthorizationCount !==
      8 ||
    summary.emergencyPauseAvailableCount !==
      8 ||
    summary.exactEightOwnerActivatedRuntimesIssued !==
      true ||
    summary.exactCandidateSequencePreserved !==
      true ||
    summary.exactCandidateIdentityPreserved !==
      true ||
    summary.exactRuntimeIdentityPreserved !==
      true ||
    summary.exactManifestBindingsPreserved !==
      true ||
    summary.uniqueOwnerActivatedRuntimeDigests !==
      8 ||
    summary.pausedRuntimeDigestReplacementCount !==
      8
  ) {
    throw new Error(
      "Engineering owner-activated runtime aggregate summary is invalid.",
    );
  }

  const authority =
    issuance.authorityBoundary;

  if (
    authority.canonicalActivationCandidateIssuanceBound !==
      true ||
    authority.canonicalOwnerActivationDecisionBound !==
      true ||
    authority.exactEightCandidatesRequired !==
      true ||
    authority.ownerActivationApproved !==
      true ||
    authority.runtimeActivationExecuted !==
      true ||
    authority.runtimeActivated !==
      true ||
    authority.controlledWorkAuthorized !==
      true ||
    authority.controlledInternalWorkOnly !==
      true ||
    authority.emergencyPauseAvailable !==
      true ||
    authority.repositoryReadAuthorized !==
      false ||
    authority.repositoryWriteAuthorized !==
      false ||
    authority.branchCreationAuthorized !==
      false ||
    authority.pullRequestPreparationAuthorized !==
      false ||
    authority.mergeAuthorized !==
      false ||
    authority.productionDeploymentAuthorized !==
      false ||
    authority.secretsAccessAuthorized !==
      false ||
    authority.realCustomerDataAccessAuthorized !==
      false ||
    authority.realCustomerContactAuthorized !==
      false ||
    authority.externalDeliveryAuthorized !==
      false ||
    authority.liveProviderExecutionAuthorized !==
      false ||
    authority.productionDatabaseAuthorized !==
      false ||
    authority.productionMutationAuthorized !==
      false ||
    authority.paymentExecutionAuthorized !==
      false ||
    authority.financialCommitmentAuthorized !==
      false ||
    authority.legalCommitmentAuthorized !==
      false ||
    authority.autonomousDecisionAuthorized !==
      false ||
    authority.productionReadinessAuthorized !==
      false ||
    authority.publicLaunchAuthorized !==
      false ||
    authority.controlledShadowOperationPrepared !==
      false ||
    authority.controlledShadowOperationExecuted !==
      false ||
    issuance.nextStep !==
      "PREPARE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS"
  ) {
    throw new Error(
      "Engineering owner-activated runtime aggregate authority boundary is invalid.",
    );
  }

  if (
    Date.parse(issuance.activatedAt) <
    Date.parse(
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
        .decidedAt,
    )
  ) {
    throw new Error(
      "Engineering runtime activation cannot precede the owner activation decision.",
    );
  }

  const {
    runtimeIssuanceDigest,
    ...issuanceCore
  } = issuance;

  if (
    sha256(issuanceCore) !==
      runtimeIssuanceDigest
  ) {
    throw new Error(
      "Engineering owner-activated runtime issuance integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(issuance) ||
    !Object.isFrozen(
      issuance.candidateRuntimeIssuances,
    ) ||
    issuance.candidateRuntimeIssuances.some(
      (entry) =>
        !Object.isFrozen(entry) ||
        !Object.isFrozen(
          entry.ownerActivatedRuntime,
        ) ||
        !Object.isFrozen(
          entry.ownerActivatedRuntime
            .authority,
        ) ||
        !Object.isFrozen(
          entry.ownerActivatedRuntime
            .safetyBoundary,
        ) ||
        !Object.isFrozen(
          entry.authorityBoundary,
        ),
    ) ||
    !Object.isFrozen(
      issuance.aggregateSummary,
    ) ||
    !Object.isFrozen(
      issuance.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering owner-activated runtime issuance must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
  input:
    CreateEngineeringAIWorkforceOwnerActivatedRuntimeIssuanceInput,
): EngineeringAIWorkforceOwnerActivatedRuntimeIssuance {
  if (
    input.activationCandidateIssuance !==
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
  ) {
    throw new Error(
      "Only the canonical Engineering activation-candidate issuance can activate runtimes.",
    );
  }

  if (
    input.ownerActivationDecision !==
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
  ) {
    throw new Error(
      "Only the canonical approved Engineering owner-activation decision can activate runtimes.",
    );
  }

  validateEngineeringAIWorkforceActivationCandidateIssuance(
    input.activationCandidateIssuance,
  );

  validateEngineeringAIWorkforceOwnerActivationDecision(
    input.ownerActivationDecision,
  );

  requireIdentifier(
    "Engineering runtime issuance ID",
    input.runtimeIssuanceId,
  );

  requireTimestamp(
    "Engineering runtime activation time",
    input.activatedAt,
  );

  if (
    input.ownerActivationDecision
      .decision !==
        "APPROVE_ENGINEERING_OWNER_ACTIVATION" ||
    input.ownerActivationDecision
      .ownerActivationApproved !==
        true ||
    input.ownerActivationDecision
      .runtimeActivationEligible !==
        true ||
    input.ownerActivationDecision
      .candidateDecisions.length !==
        8 ||
    input.ownerActivationDecision
      .aggregateSummary
      .ownerActivationApprovedCount !==
        8 ||
    input.ownerActivationDecision
      .aggregateSummary
      .runtimeActivationEligibleCount !==
        8 ||
    input.ownerActivationDecision
      .authorityBoundary
      .runtimePreparationAuthorized !==
        true ||
    input.ownerActivationDecision
      .authorityBoundary
      .runtimeActivationExecuted !==
        false ||
    input.ownerActivationDecision
      .authorityBoundary
      .runtimeActivated !==
        false ||
    input.ownerActivationDecision
      .authorityBoundary
      .controlledWorkAuthorized !==
        false ||
    input.ownerActivationDecision
      .nextStep !==
        "PREPARE_ENGINEERING_OWNER_ACTIVATED_RUNTIMES"
  ) {
    throw new Error(
      "Engineering runtime activation requires the complete approved owner decision.",
    );
  }

  if (
    input.activationCandidateIssuance
      .activationCandidateIssuanceId !==
        input.ownerActivationDecision
          .sourceActivationCandidateIssuanceId ||
    input.activationCandidateIssuance
      .issuanceDigest !==
        input.ownerActivationDecision
          .sourceActivationCandidateIssuanceDigest ||
    input.activationCandidateIssuance
      .tenantId !==
        input.ownerActivationDecision
          .tenantId ||
    input.activationCandidateIssuance
      .ownerId !==
        input.ownerActivationDecision
          .ownerId
  ) {
    throw new Error(
      "Engineering owner decision does not match the activation-candidate issuance.",
    );
  }

  if (
    Date.parse(input.activatedAt) <
    Date.parse(
      input.ownerActivationDecision
        .decidedAt,
    )
  ) {
    throw new Error(
      "Engineering runtime activation cannot precede the owner activation decision.",
    );
  }

  const candidateRuntimeIssuances =
    input.activationCandidateIssuance
      .candidateIssuances
      .map(
        (
          source,
          index,
        ) => {
          const decision =
            input.ownerActivationDecision
              .candidateDecisions[index];

          if (
            !decision ||
            decision.employeeId !==
              source.employeeId ||
            decision.employeeCode !==
              source.employeeCode ||
            decision.publicName !==
              source.publicName ||
            decision.officialRole !==
              source.officialRole ||
            decision.templateId !==
              source.templateId ||
            decision.runtimeId !==
              source.runtimeId ||
            decision.activationCandidateDigest !==
              source.activationCandidateDigest ||
            decision.pausedRuntimeDigest !==
              source.pausedRuntimeDigest ||
            decision.qualificationDigest !==
              source.qualificationDigest ||
            decision.qualifiedManifestDigest !==
              source.qualifiedManifestDigest ||
            decision.ownerActivationApproved !==
              true ||
            decision.runtimeActivationEligible !==
              true
          ) {
            throw new Error(
              "Engineering candidate owner decision does not match its activation candidate.",
            );
          }

          const ownerActivatedRuntime =
            createAIEmployeeRuntimeContract({
              manifest:
                source.activationCandidate
                  .qualifiedManifest,

              runtimeId:
                source.runtimeId,

              tenantId:
                input.activationCandidateIssuance
                  .tenantId,

              ownerId:
                input.activationCandidateIssuance
                  .ownerId,

              ownerActivated:
                true,

              startedAt:
                input.activatedAt,
            });

          if (
            ownerActivatedRuntime
              .runtimeState !==
                "READY_FOR_CONTROLLED_WORK" ||
            ownerActivatedRuntime
              .ownerActivated !==
                true ||
            ownerActivatedRuntime
              .controlledWorkAuthorized !==
                true ||
            ownerActivatedRuntime
              .manifestDigest !==
                source.qualifiedManifestDigest ||
            ownerActivatedRuntime
              .runtimeDigest ===
                source.pausedRuntimeDigest
          ) {
            throw new Error(
              "Engineering owner-activated runtime creation is invalid.",
            );
          }

          const entryCore = {
            developmentSequence:
              index + 1,

            issuanceState:
              "ENGINEERING_CANDIDATE_OWNER_ACTIVATED_RUNTIME_ISSUED" as const,

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

            ownerActivationDecisionDigest:
              decision.candidateDecisionDigest,

            qualificationDigest:
              source.qualificationDigest,

            qualifiedManifestDigest:
              source.qualifiedManifestDigest,

            pausedRuntimeDigest:
              source.pausedRuntimeDigest,

            ownerActivatedRuntime,

            ownerActivatedRuntimeDigest:
              ownerActivatedRuntime.runtimeDigest,

            authorityBoundary: {
              activationCandidateBound:
                true as const,

              ownerActivationDecisionBound:
                true as const,

              tenantIdentityBound:
                true as const,

              ownerIdentityBound:
                true as const,

              qualificationBound:
                true as const,

              qualifiedManifestBound:
                true as const,

              runtimeIdentityPreserved:
                true as const,

              approvalBypassAllowed:
                false as const,

              runtimeActivationExecuted:
                true as const,

              runtimeActivated:
                true as const,

              controlledWorkAuthorized:
                true as const,

              emergencyPauseAvailable:
                true as const,

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

            candidateRuntimeIssuanceDigest:
              sha256(entryCore),
          });
        },
      );

  const issuanceCore = {
    version:
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION,

    runtimeIssuanceId:
      input.runtimeIssuanceId,

    issuanceState:
      "ENGINEERING_OWNER_ACTIVATED_RUNTIMES_ISSUED" as const,

    tenantId:
      input.activationCandidateIssuance
        .tenantId,

    ownerId:
      input.activationCandidateIssuance
        .ownerId,

    sourceActivationCandidateIssuanceId:
      input.activationCandidateIssuance
        .activationCandidateIssuanceId,

    sourceActivationCandidateIssuanceDigest:
      input.activationCandidateIssuance
        .issuanceDigest,

    sourceOwnerActivationDecisionId:
      input.ownerActivationDecision
        .decisionId,

    sourceOwnerActivationDecisionDigest:
      input.ownerActivationDecision
        .decisionDigest,

    runtimeCount:
      8 as const,

    candidateRuntimeIssuances,

    aggregateSummary: {
      activationCandidateCount:
        8 as const,

      ownerActivationApprovalCount:
        8 as const,

      runtimeActivationExecutedCount:
        8 as const,

      activatedRuntimeCount:
        8 as const,

      controlledWorkAuthorizationCount:
        8 as const,

      emergencyPauseAvailableCount:
        8 as const,

      exactEightOwnerActivatedRuntimesIssued:
        true as const,

      exactCandidateSequencePreserved:
        true as const,

      exactCandidateIdentityPreserved:
        true as const,

      exactRuntimeIdentityPreserved:
        true as const,

      exactManifestBindingsPreserved:
        true as const,

      uniqueOwnerActivatedRuntimeDigests:
        8 as const,

      pausedRuntimeDigestReplacementCount:
        8 as const,
    },

    nextStep:
      "PREPARE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS" as const,

    authorityBoundary: {
      canonicalActivationCandidateIssuanceBound:
        true as const,

      canonicalOwnerActivationDecisionBound:
        true as const,

      exactEightCandidatesRequired:
        true as const,

      ownerActivationApproved:
        true as const,

      runtimeActivationExecuted:
        true as const,

      runtimeActivated:
        true as const,

      controlledWorkAuthorized:
        true as const,

      controlledInternalWorkOnly:
        true as const,

      emergencyPauseAvailable:
        true as const,

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

      controlledShadowOperationPrepared:
        false as const,

      controlledShadowOperationExecuted:
        false as const,
    },

    activatedAt:
      input.activatedAt,
  };

  const issuance =
    deepFreeze({
      ...issuanceCore,

      runtimeIssuanceDigest:
        sha256(issuanceCore),
    }) as EngineeringAIWorkforceOwnerActivatedRuntimeIssuance;

  validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
    issuance,
  );

  return issuance;
}

export const ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE =
  createEngineeringAIWorkforceOwnerActivatedRuntimeIssuance({
    runtimeIssuanceId:
      "engineering-ai-workforce-owner-activated-runtime-issuance-001",

    activationCandidateIssuance:
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,

    ownerActivationDecision:
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,

    activatedAt:
      "2026-07-23T09:40:19.597Z",
  });
