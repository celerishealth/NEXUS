import {
  createHash,
} from "node:crypto";

import {
  validateMeeraActivationCandidateIssuance,
  type MeeraActivationCandidateIssuance,
} from "./meeraActivationCandidateIssuance";

export const MEERA_OWNER_ACTIVATION_DECISION_VERSION =
  "nexus-meera-owner-activation-decision-v1" as const;

export const MEERA_OWNER_ACTIVATION_DECISIONS = [
  "APPROVE_MEERA_ACTIVATION",
  "REJECT_MEERA_ACTIVATION",
] as const;

export type MeeraOwnerActivationDecisionType =
  (
    typeof MEERA_OWNER_ACTIVATION_DECISIONS
  )[number];

export interface CreateMeeraOwnerActivationDecisionInput {
  readonly activationCandidateIssuance:
    MeeraActivationCandidateIssuance;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerActivationDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface MeeraOwnerActivationDecision {
  readonly version:
    typeof MEERA_OWNER_ACTIVATION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly activationCandidateIssuanceId:
    string;

  readonly activationCandidateIssuanceDigest:
    string;

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly displayName:
    "Meera";

  readonly officialRole:
    "AI Quotation & Proposal Specialist";

  readonly department:
    "SALES";

  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";

  readonly runtimeId:
    string;

  readonly pausedRuntimeDigest:
    string;

  readonly qualifiedManifestDigest:
    string;

  readonly qualificationDigest:
    string;

  readonly sourceRegistryCreatedAt:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerActivationDecisionType;

  readonly ownerActivationApproved:
    boolean;

  readonly runtimeActivationEligible:
    boolean;

  readonly reason:
    string;

  readonly authorityBoundary: Readonly<{
    ownerDecisionRequired:
      true;

    ownerIdentityBound:
      true;

    activationCandidateIssuanceBound:
      true;

    qualificationBound:
      true;

    registryCreationTimeBound:
      true;

    approvalBypassAllowed:
      false;

    activationCandidateCreated:
      true;

    ownerActivationDecisionRecorded:
      true;

    runtimeActivationExecuted:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
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

  readonly nextStep:
    | "PREPARE_OWNER_ACTIVATED_RUNTIME"
    | "RETAIN_PAUSED_RUNTIME";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const EXPECTED_EMPLOYEE_ID =
  "employee-meera-quotation-proposal-specialist-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-meera-quotation-proposal-specialist-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-005" as const;

const EXPECTED_DISPLAY_NAME =
  "Meera" as const;

const EXPECTED_ROLE =
  "AI Quotation & Proposal Specialist" as const;

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
      "Unsupported deterministic Meera owner-activation value.",
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

function requireText(
  label: string,
  value: string,
  minimumLength: number,
  maximumLength: number,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length <
      minimumLength ||
    normalized.length >
      maximumLength
  ) {
    throw new Error(
      `${label} length is invalid.`,
    );
  }

  return normalized;
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

function validateCandidateForDecision(
  source:
    MeeraActivationCandidateIssuance,
): void {
  validateMeeraActivationCandidateIssuance(
    source,
  );

  if (
    source.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    source.templateId !==
      EXPECTED_TEMPLATE_ID ||
    source.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    source.displayName !==
      EXPECTED_DISPLAY_NAME ||
    source.officialRole !==
      EXPECTED_ROLE ||
    source.department !==
      EXPECTED_DEPARTMENT ||
    source.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Meera's registered workforce identity has changed.",
    );
  }

  const candidate =
    source.activationCandidate;

  const runtime =
    candidate.pausedRuntime;

  if (
    candidate.activationEligible !==
      true ||
    candidate.ownerActivationRequired !==
      true ||
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
      false ||
    runtime.runtimeState !==
      "PAUSED_AWAITING_OWNER" ||
    runtime.controlledWorkAuthorized !==
      false
  ) {
    throw new Error(
      "Meera activation candidate must remain paused before the owner decision.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary
      .qualifiedManifestIssuanceBound !==
        true ||
    boundary.formalQualificationBound !==
      true ||
    boundary.canonicalTemplateBound !==
      true ||
    boundary.registryCreationTimeBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.activationCandidateCreated !==
      true ||
    boundary.runtimeCreatedPaused !==
      true ||
    boundary.ownerActivationRecorded !==
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
      "Workforce Day 54 Meera authority boundary has been changed.",
    );
  }
}

export function validateMeeraOwnerActivationDecision(
  decision:
    MeeraOwnerActivationDecision,
): void {
  if (
    decision.version !==
      MEERA_OWNER_ACTIVATION_DECISION_VERSION ||
    decision.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    decision.templateId !==
      EXPECTED_TEMPLATE_ID ||
    decision.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    decision.displayName !==
      EXPECTED_DISPLAY_NAME ||
    decision.officialRole !==
      EXPECTED_ROLE ||
    decision.department !==
      EXPECTED_DEPARTMENT ||
    decision.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Meera owner activation decision identity is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "decisionId",
        decision.decisionId,
      ],
      [
        "activationCandidateIssuanceId",
        decision
          .activationCandidateIssuanceId,
      ],
      [
        "runtimeId",
        decision.runtimeId,
      ],
      [
        "tenantId",
        decision.tenantId,
      ],
      [
        "ownerId",
        decision.ownerId,
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
        decision
          .activationCandidateIssuanceDigest,
      ],
      [
        "pausedRuntimeDigest",
        decision.pausedRuntimeDigest,
      ],
      [
        "qualifiedManifestDigest",
        decision.qualifiedManifestDigest,
      ],
      [
        "qualificationDigest",
        decision.qualificationDigest,
      ],
    ] as const
  ) {
    requireDigest(
      label,
      value,
    );
  }

  requireIsoTimestamp(
    "Meera source registry creation time",
    decision.sourceRegistryCreatedAt,
  );

  requireIsoTimestamp(
    "Meera owner activation decision time",
    decision.decidedAt,
  );

  requireText(
    "Meera owner activation reason",
    decision.reason,
    12,
    1000,
  );

  const approved =
    decision.decision ===
      "APPROVE_MEERA_ACTIVATION";

  const rejected =
    decision.decision ===
      "REJECT_MEERA_ACTIVATION";

  if (
    (!approved && !rejected) ||
    decision.ownerActivationApproved !==
      approved ||
    decision.runtimeActivationEligible !==
      approved ||
    decision.nextStep !==
      (
        approved
          ? "PREPARE_OWNER_ACTIVATED_RUNTIME"
          : "RETAIN_PAUSED_RUNTIME"
      )
  ) {
    throw new Error(
      "Meera owner activation decision state is invalid.",
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
      "Meera owner activation authority boundary is invalid.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    !SHA_256_PATTERN.test(
      decisionDigest,
    ) ||
    decisionDigest !==
      sha256(decisionCore)
  ) {
    throw new Error(
      "Meera owner activation decision integrity is invalid.",
    );
  }
}

export function createMeeraOwnerActivationDecision(
  input:
    CreateMeeraOwnerActivationDecisionInput,
): MeeraOwnerActivationDecision {
  validateCandidateForDecision(
    input.activationCandidateIssuance,
  );

  requireIdentifier(
    "Meera owner activation decisionId",
    input.decisionId,
  );

  requireIdentifier(
    "Meera owner activation ownerId",
    input.ownerId,
  );

  const normalizedReason =
    requireText(
      "Meera owner activation reason",
      input.reason,
      12,
      1000,
    );

  requireIsoTimestamp(
    "Meera owner activation decision time",
    input.decidedAt,
  );

  const source =
    input.activationCandidateIssuance;

  if (
    input.ownerId !==
      source.ownerId ||
    input.ownerId !==
      source.activationCandidate
        .pausedRuntime.ownerId
  ) {
    throw new Error(
      "Only the activation-candidate-bound owner can issue Meera's activation decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_MEERA_ACTIVATION" &&
    input.decision !==
      "REJECT_MEERA_ACTIVATION"
  ) {
    throw new Error(
      "Meera owner activation decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Meera owner activation decision cannot precede activation candidate preparation.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_MEERA_ACTIVATION";

  const decisionCore = {
    version:
      MEERA_OWNER_ACTIVATION_DECISION_VERSION,

    decisionId:
      input.decisionId,

    activationCandidateIssuanceId:
      source.activationCandidateIssuanceId,

    activationCandidateIssuanceDigest:
      source.activationCandidateIssuanceDigest,

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

    pausedRuntimeDigest:
      source.activationCandidate
        .pausedRuntime.runtimeDigest,

    qualifiedManifestDigest:
      source.qualifiedManifestDigest,

    qualificationDigest:
      source.qualificationDigest,

    sourceRegistryCreatedAt:
      source.sourceRegistryCreatedAt,

    tenantId:
      source.tenantId,

    ownerId:
      input.ownerId,

    decision:
      input.decision,

    ownerActivationApproved:
      approved,

    runtimeActivationEligible:
      approved,

    reason:
      normalizedReason,

    authorityBoundary: {
      ownerDecisionRequired:
        true as const,

      ownerIdentityBound:
        true as const,

      activationCandidateIssuanceBound:
        true as const,

      qualificationBound:
        true as const,

      registryCreationTimeBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      activationCandidateCreated:
        true as const,

      ownerActivationDecisionRecorded:
        true as const,

      runtimeActivationExecuted:
        false as const,

      runtimeActivated:
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
      approved
        ? "PREPARE_OWNER_ACTIVATED_RUNTIME" as const
        : "RETAIN_PAUSED_RUNTIME" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as MeeraOwnerActivationDecision;

  validateMeeraOwnerActivationDecision(
    decision,
  );

  return decision;
}
