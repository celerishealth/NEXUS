import {
  createHash,
} from "node:crypto";

import {
  createAIEmployeeRuntimeContract,
  type AIEmployeeRuntimeContract,
} from "./aiEmployeeManifest";

import {
  validateRiyaActivationCandidateIssuance,
  type RiyaActivationCandidateIssuance,
} from "./riyaActivationCandidateIssuance";

import {
  validateRiyaOwnerActivationDecision,
  type RiyaOwnerActivationDecision,
} from "./riyaOwnerActivationDecision";

export const RIYA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION =
  "nexus-riya-owner-activated-runtime-issuance-v1" as const;

export interface CreateRiyaOwnerActivatedRuntimeIssuanceInput {
  readonly runtimeIssuanceId:
    string;

  readonly activationCandidateIssuance:
    RiyaActivationCandidateIssuance;

  readonly ownerActivationDecision:
    RiyaOwnerActivationDecision;

  readonly activatedAt:
    string;
}

export interface RiyaOwnerActivatedRuntimeIssuance {
  readonly version:
    typeof RIYA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION;

  readonly runtimeIssuanceId:
    string;

  readonly issuanceState:
    "OWNER_ACTIVATED_RUNTIME_ISSUED";

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly templateId:
    "template-riya-recommendation-specialist-v1";

  readonly employeeCode:
    "nx-sales-004";

  readonly displayName:
    "Riya";

  readonly officialRole:
    "AI Recommendation Specialist";

  readonly department:
    "SALES";

  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";

  readonly runtimeId:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly activationCandidateIssuanceId:
    string;

  readonly activationCandidateIssuanceDigest:
    string;

  readonly ownerActivationDecisionId:
    string;

  readonly ownerActivationDecisionDigest:
    string;

  readonly qualificationDigest:
    string;

  readonly qualifiedManifestDigest:
    string;

  readonly sourceRegistryCreatedAt:
    string;

  readonly pausedRuntimeDigest:
    string;

  readonly ownerActivatedRuntime:
    AIEmployeeRuntimeContract;

  readonly authorityBoundary: Readonly<{
    activationCandidateIssuanceBound:
      true;

    ownerActivationDecisionBound:
      true;

    ownerIdentityBound:
      true;

    qualificationBound:
      true;

    qualifiedManifestBound:
      true;

    registryCreationTimeBound:
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

  readonly nextStep:
    "PREPARE_CONTROLLED_SHADOW_OPERATION";

  readonly activatedAt:
    string;

  readonly runtimeIssuanceDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const EXPECTED_EMPLOYEE_ID =
  "employee-riya-recommendation-specialist-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-riya-recommendation-specialist-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-004" as const;

const EXPECTED_DISPLAY_NAME =
  "Riya" as const;

const EXPECTED_ROLE =
  "AI Recommendation Specialist" as const;

const EXPECTED_DEPARTMENT =
  "SALES" as const;

const EXPECTED_AUTONOMY_LEVEL =
  "DRAFTING_ASSISTANT" as const;

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
            JSON.stringify(key) +
            ":" +
            stableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Riya owner-activated runtime value.",
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
): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const propertyName of
      Object.getOwnPropertyNames(value)
    ) {
      const child =
        (
          value as unknown as
            Record<string, unknown>
        )[propertyName];

      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }

    Object.freeze(value);
  }

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
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
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireIsoTimestamp(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function validateApprovedDecisionBinding(
  source:
    RiyaActivationCandidateIssuance,

  decision:
    RiyaOwnerActivationDecision,
): void {
  validateRiyaOwnerActivationDecision(
    decision,
  );

  if (
    decision.decision !==
      "APPROVE_RIYA_ACTIVATION" ||
    decision.ownerActivationApproved !==
      true ||
    decision.runtimeActivationEligible !==
      true ||
    decision.nextStep !==
      "PREPARE_OWNER_ACTIVATED_RUNTIME"
  ) {
    throw new Error(
      "Riya runtime activation requires an explicit approved owner decision.",
    );
  }

  if (
    decision.activationCandidateIssuanceId !==
      source.activationCandidateIssuanceId ||
    decision.activationCandidateIssuanceDigest !==
      source.activationCandidateIssuanceDigest ||
    decision.employeeId !==
      source.employeeId ||
    decision.templateId !==
      source.templateId ||
    decision.employeeCode !==
      source.employeeCode ||
    decision.displayName !==
      source.displayName ||
    decision.officialRole !==
      source.officialRole ||
    decision.department !==
      source.department ||
    decision.autonomyLevel !==
      source.autonomyLevel ||
    decision.runtimeId !==
      source.runtimeId ||
    decision.pausedRuntimeDigest !==
      source.activationCandidate
        .pausedRuntime.runtimeDigest ||
    decision.qualifiedManifestDigest !==
      source.qualifiedManifestDigest ||
    decision.qualificationDigest !==
      source.qualificationDigest ||
    decision.sourceRegistryCreatedAt !==
      source.sourceRegistryCreatedAt ||
    decision.tenantId !==
      source.tenantId ||
    decision.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Riya owner activation decision does not match the activation candidate.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.ownerDecisionRequired !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary
      .activationCandidateIssuanceBound !==
        true ||
    boundary.qualificationBound !==
      true ||
    boundary.registryCreationTimeBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.activationCandidateCreated !==
      true ||
    boundary
      .ownerActivationDecisionRecorded !==
        true ||
    boundary.runtimeActivationExecuted !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary
      .realCustomerDataAccessAuthorized !==
        false ||
    boundary
      .realCustomerContactAuthorized !==
        false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary
      .liveProviderExecutionAuthorized !==
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
      "Workforce Day 55 Riya authority boundary has been changed.",
    );
  }
}

function validateOwnerActivatedRuntime(
  source:
    RiyaActivationCandidateIssuance,

  runtime:
    AIEmployeeRuntimeContract,

  activatedAt:
    string,
): void {
  if (
    runtime.version !==
      "nexus-ai-employee-runtime-v1"
  ) {
    throw new Error(
      "Riya owner-activated runtime version is invalid.",
    );
  }

  requireDigest(
    "Riya owner-activated runtime digest",
    runtime.runtimeDigest,
  );

  const {
    runtimeDigest,
    ...runtimeCore
  } = runtime;

  if (
    runtimeDigest !==
      sha256(runtimeCore)
  ) {
    throw new Error(
      "Riya owner-activated runtime integrity is invalid.",
    );
  }

  if (
    runtime.runtimeId !==
      source.runtimeId ||
    runtime.employeeId !==
      source.employeeId ||
    runtime.templateId !==
      source.templateId ||
    runtime.manifestDigest !==
      source.qualifiedManifestDigest ||
    runtime.tenantId !==
      source.tenantId ||
    runtime.ownerId !==
      source.ownerId ||
    runtime.ownerActivated !==
      true ||
    runtime.runtimeState !==
      "READY_FOR_CONTROLLED_WORK" ||
    runtime.controlledWorkAuthorized !==
      true ||
    runtime.startedAt !==
      activatedAt
  ) {
    throw new Error(
      "Riya owner-activated runtime contract is invalid.",
    );
  }

  if (
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
      "Riya owner-activated runtime safety boundary is invalid.",
    );
  }

  if (
    runtime.runtimeDigest ===
      source.activationCandidate
        .pausedRuntime.runtimeDigest
  ) {
    throw new Error(
      "Riya owner-activated runtime must produce a new runtime digest.",
    );
  }
}

export function validateRiyaOwnerActivatedRuntimeIssuance(
  issuance:
    RiyaOwnerActivatedRuntimeIssuance,
): void {
  if (
    issuance.version !==
      RIYA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION ||
    issuance.issuanceState !==
      "OWNER_ACTIVATED_RUNTIME_ISSUED" ||
    issuance.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    issuance.templateId !==
      EXPECTED_TEMPLATE_ID ||
    issuance.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    issuance.displayName !==
      EXPECTED_DISPLAY_NAME ||
    issuance.officialRole !==
      EXPECTED_ROLE ||
    issuance.department !==
      EXPECTED_DEPARTMENT ||
    issuance.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL ||
    issuance.nextStep !==
      "PREPARE_CONTROLLED_SHADOW_OPERATION"
  ) {
    throw new Error(
      "Riya owner-activated runtime issuance identity is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "runtimeIssuanceId",
        issuance.runtimeIssuanceId,
      ],
      [
        "runtimeId",
        issuance.runtimeId,
      ],
      [
        "tenantId",
        issuance.tenantId,
      ],
      [
        "ownerId",
        issuance.ownerId,
      ],
      [
        "activationCandidateIssuanceId",
        issuance
          .activationCandidateIssuanceId,
      ],
      [
        "ownerActivationDecisionId",
        issuance
          .ownerActivationDecisionId,
      ],
    ] as const
  ) {
    requireIdentifier(
      label,
      value,
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "activationCandidateIssuanceDigest",
        issuance
          .activationCandidateIssuanceDigest,
      ],
      [
        "ownerActivationDecisionDigest",
        issuance
          .ownerActivationDecisionDigest,
      ],
      [
        "qualificationDigest",
        issuance.qualificationDigest,
      ],
      [
        "qualifiedManifestDigest",
        issuance.qualifiedManifestDigest,
      ],
      [
        "pausedRuntimeDigest",
        issuance.pausedRuntimeDigest,
      ],
      [
        "ownerActivatedRuntimeDigest",
        issuance.ownerActivatedRuntime
          .runtimeDigest,
      ],
    ] as const
  ) {
    requireDigest(
      label,
      value,
    );
  }

  requireIsoTimestamp(
    "Riya source registry creation time",
    issuance.sourceRegistryCreatedAt,
  );

  requireIsoTimestamp(
    "Riya runtime activation time",
    issuance.activatedAt,
  );

  const runtime =
    issuance.ownerActivatedRuntime;

  const {
    runtimeDigest,
    ...runtimeCore
  } = runtime;

  if (
    runtime.version !==
      "nexus-ai-employee-runtime-v1" ||
    runtimeDigest !==
      sha256(runtimeCore) ||
    runtime.runtimeId !==
      issuance.runtimeId ||
    runtime.employeeId !==
      issuance.employeeId ||
    runtime.templateId !==
      issuance.templateId ||
    runtime.manifestDigest !==
      issuance.qualifiedManifestDigest ||
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
      issuance.pausedRuntimeDigest
  ) {
    throw new Error(
      "Riya owner-activated runtime issuance record is invalid.",
    );
  }

  if (
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
      "Riya owner-activated runtime issuance safety boundary is invalid.",
    );
  }

  const boundary =
    issuance.authorityBoundary;

  if (
    boundary
      .activationCandidateIssuanceBound !==
        true ||
    boundary.ownerActivationDecisionBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.qualificationBound !==
      true ||
    boundary.qualifiedManifestBound !==
      true ||
    boundary.registryCreationTimeBound !==
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
    boundary
      .realCustomerDataAccessAuthorized !==
        false ||
    boundary
      .realCustomerContactAuthorized !==
        false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary
      .liveProviderExecutionAuthorized !==
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
      "Riya owner-activated runtime issuance authority boundary is invalid.",
    );
  }

  const {
    runtimeIssuanceDigest,
    ...issuanceCore
  } = issuance;

  if (
    !SHA_256_PATTERN.test(
      runtimeIssuanceDigest,
    ) ||
    runtimeIssuanceDigest !==
      sha256(issuanceCore)
  ) {
    throw new Error(
      "Riya owner-activated runtime issuance integrity is invalid.",
    );
  }
}

export function createRiyaOwnerActivatedRuntimeIssuance(
  input:
    CreateRiyaOwnerActivatedRuntimeIssuanceInput,
): RiyaOwnerActivatedRuntimeIssuance {
  requireIdentifier(
    "Riya owner-activated runtime issuanceId",
    input.runtimeIssuanceId,
  );

  requireIsoTimestamp(
    "Riya owner-activated runtime activation time",
    input.activatedAt,
  );

  validateRiyaActivationCandidateIssuance(
    input.activationCandidateIssuance,
  );

  validateApprovedDecisionBinding(
    input.activationCandidateIssuance,
    input.ownerActivationDecision,
  );

  if (
    Date.parse(input.activatedAt) <
      Date.parse(
        input.ownerActivationDecision
          .decidedAt,
      )
  ) {
    throw new Error(
      "Riya runtime activation cannot precede the owner activation decision.",
    );
  }

  const source =
    input.activationCandidateIssuance;

  const decision =
    input.ownerActivationDecision;

  const ownerActivatedRuntime =
    createAIEmployeeRuntimeContract({
      manifest:
        source.activationCandidate
          .qualifiedManifest,

      runtimeId:
        source.runtimeId,

      tenantId:
        source.tenantId,

      ownerId:
        source.ownerId,

      ownerActivated:
        true,

      startedAt:
        input.activatedAt,
    });

  validateOwnerActivatedRuntime(
    source,
    ownerActivatedRuntime,
    input.activatedAt,
  );

  const issuanceCore = {
    version:
      RIYA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION,

    runtimeIssuanceId:
      input.runtimeIssuanceId,

    issuanceState:
      "OWNER_ACTIVATED_RUNTIME_ISSUED" as const,

    employeeId:
      EXPECTED_EMPLOYEE_ID,

    templateId:
      EXPECTED_TEMPLATE_ID,

    employeeCode:
      EXPECTED_EMPLOYEE_CODE,

    displayName:
      EXPECTED_DISPLAY_NAME,

    officialRole:
      EXPECTED_ROLE,

    department:
      EXPECTED_DEPARTMENT,

    autonomyLevel:
      EXPECTED_AUTONOMY_LEVEL,

    runtimeId:
      source.runtimeId,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    activationCandidateIssuanceId:
      source.activationCandidateIssuanceId,

    activationCandidateIssuanceDigest:
      source.activationCandidateIssuanceDigest,

    ownerActivationDecisionId:
      decision.decisionId,

    ownerActivationDecisionDigest:
      decision.decisionDigest,

    qualificationDigest:
      source.qualificationDigest,

    qualifiedManifestDigest:
      source.qualifiedManifestDigest,

    sourceRegistryCreatedAt:
      source.sourceRegistryCreatedAt,

    pausedRuntimeDigest:
      source.activationCandidate
        .pausedRuntime.runtimeDigest,

    ownerActivatedRuntime,

    authorityBoundary: {
      activationCandidateIssuanceBound:
        true as const,

      ownerActivationDecisionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      qualificationBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      registryCreationTimeBound:
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

    nextStep:
      "PREPARE_CONTROLLED_SHADOW_OPERATION" as const,

    activatedAt:
      input.activatedAt,
  };

  const issuance =
    deepFreeze({
      ...issuanceCore,

      runtimeIssuanceDigest:
        sha256(issuanceCore),
    }) as RiyaOwnerActivatedRuntimeIssuance;

  validateRiyaOwnerActivatedRuntimeIssuance(
    issuance,
  );

  return issuance;
}
