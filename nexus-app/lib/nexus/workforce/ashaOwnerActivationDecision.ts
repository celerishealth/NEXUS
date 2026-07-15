import {
  createHash,
} from "node:crypto";

import {
  ASHA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION,
  type AshaActivationCandidateIssuance,
} from "./ashaActivationCandidateIssuance";

export const ASHA_OWNER_ACTIVATION_DECISION_VERSION =
  "nexus-asha-owner-activation-decision-v1" as const;

export const ASHA_OWNER_ACTIVATION_DECISIONS = [
  "APPROVE_ASHA_ACTIVATION",
  "REJECT_ASHA_ACTIVATION",
] as const;

export type AshaOwnerActivationDecisionType =
  (typeof ASHA_OWNER_ACTIVATION_DECISIONS)[number];

export interface CreateAshaOwnerActivationDecisionInput {
  readonly activationCandidateIssuance:
    AshaActivationCandidateIssuance;
  readonly decisionId:
    string;
  readonly ownerId:
    string;
  readonly decision:
    AshaOwnerActivationDecisionType;
  readonly reason:
    string;
  readonly decidedAt:
    string;
}

export interface AshaOwnerActivationDecision {
  readonly version:
    typeof ASHA_OWNER_ACTIVATION_DECISION_VERSION;
  readonly decisionId:
    string;
  readonly activationCandidateIssuanceId:
    string;
  readonly activationCandidateIssuanceDigest:
    string;
  readonly employeeId:
    "employee-asha-inquiry-intake-v1";
  readonly templateId:
    "template-asha-inquiry-intake-v1";
  readonly employeeCode:
    "nx-sales-003";
  readonly displayName:
    "Asha";
  readonly officialRole:
    "AI Inquiry Intake Executive";
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
  readonly tenantId:
    string;
  readonly ownerId:
    string;
  readonly decision:
    AshaOwnerActivationDecisionType;
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
    customerDataAccessAuthorized:
      false;
    customerContactAuthorized:
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
  "employee-asha-inquiry-intake-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-asha-inquiry-intake-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-003" as const;

const EXPECTED_DISPLAY_NAME =
  "Asha" as const;

const EXPECTED_ROLE =
  "AI Inquiry Intake Executive" as const;

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
        .map((item) =>
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
      value as Record<
        string,
        unknown
      >;

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
      "Unsupported deterministic owner-activation value.",
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
    ) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      value,
    )
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
  if (!SHA_256_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireText(
  label: string,
  value: string,
  minimumLength: number,
  maximumLength: number,
): void {
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
}

function requireIsoDate(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp)
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function validateActivationCandidateIssuance(
  source:
    AshaActivationCandidateIssuance,
): void {
  if (
    source.version !==
      ASHA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION ||
    source.issuanceState !==
      "ACTIVATION_CANDIDATE_PREPARED" ||
    source.nextStep !==
      "AWAIT_OWNER_ACTIVATION"
  ) {
    throw new Error(
      "A valid Workforce Day 20 activation candidate issuance is required.",
    );
  }

  requireDigest(
    "activation candidate issuance digest",
    source.activationCandidateIssuanceDigest,
  );

  const {
    activationCandidateIssuanceDigest,
    ...sourceCore
  } = source;

  if (
    sha256(sourceCore) !==
      activationCandidateIssuanceDigest
  ) {
    throw new Error(
      "Workforce Day 20 activation candidate issuance integrity verification failed.",
    );
  }

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
      "Asha's registered workforce identity has changed.",
    );
  }

  requireDigest(
    "qualification digest",
    source.qualificationDigest,
  );

  requireDigest(
    "qualified manifest digest",
    source.qualifiedManifestDigest,
  );

  requireDigest(
    "paused runtime digest",
    source.activationCandidate
      .pausedRuntime.runtimeDigest,
  );

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
      "Asha activation candidate must remain paused before the owner decision.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
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
    boundary.customerDataAccessAuthorized !==
      false ||
    boundary.customerContactAuthorized !==
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
      "Workforce Day 20 authority boundary has been changed.",
    );
  }
}

export function createAshaOwnerActivationDecision(
  input:
    CreateAshaOwnerActivationDecisionInput,
): AshaOwnerActivationDecision {
  validateActivationCandidateIssuance(
    input.activationCandidateIssuance,
  );

  requireIdentifier(
    "owner activation decisionId",
    input.decisionId,
  );

  requireIdentifier(
    "owner activation ownerId",
    input.ownerId,
  );

  requireText(
    "owner activation reason",
    input.reason,
    12,
    1000,
  );

  requireIsoDate(
    "owner activation decision time",
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
      "Only the activation-candidate-bound owner can issue the activation decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_ASHA_ACTIVATION" &&
    input.decision !==
      "REJECT_ASHA_ACTIVATION"
  ) {
    throw new Error(
      "Asha owner activation decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Owner activation decision cannot precede activation candidate preparation.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_ASHA_ACTIVATION";

  const decisionCore = {
    version:
      ASHA_OWNER_ACTIVATION_DECISION_VERSION,
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
      input.reason.trim(),
    authorityBoundary: {
      ownerDecisionRequired:
        true,
      ownerIdentityBound:
        true,
      activationCandidateIssuanceBound:
        true,
      qualificationBound:
        true,
      approvalBypassAllowed:
        false,
      activationCandidateCreated:
        true,
      ownerActivationDecisionRecorded:
        true,
      runtimeActivationExecuted:
        false,
      runtimeActivated:
        false,
      controlledWorkAuthorized:
        false,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      productionDatabaseAuthorized:
        false,
      productionMutationAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      autonomousDecisionAuthorized:
        false,
      productionReadinessAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    nextStep:
      approved
        ? "PREPARE_OWNER_ACTIVATED_RUNTIME" as const
        : "RETAIN_PAUSED_RUNTIME" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision:
    AshaOwnerActivationDecision = {
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    };

  return deepFreeze(
    decision,
  ) as AshaOwnerActivationDecision;
}