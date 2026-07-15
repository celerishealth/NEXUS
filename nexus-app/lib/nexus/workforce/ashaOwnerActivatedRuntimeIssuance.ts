import {
  createHash,
} from "node:crypto";

import {
  createAIEmployeeRuntimeContract,
  type AIEmployeeManifest,
  type AIEmployeeRuntimeContract,
} from "./aiEmployeeManifest";

import {
  ASHA_ACTIVATION_CANDIDATE_ISSUANCE_VERSION,
  type AshaActivationCandidateIssuance,
} from "./ashaActivationCandidateIssuance";

import {
  ASHA_OWNER_ACTIVATION_DECISION_VERSION,
  type AshaOwnerActivationDecision,
} from "./ashaOwnerActivationDecision";

import {
  AI_EMPLOYEE_ACTIVATION_CANDIDATE_VERSION,
} from "./employeeQualification";

export const ASHA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION =
  "nexus-asha-owner-activated-runtime-issuance-v1" as const;

export interface CreateAshaOwnerActivatedRuntimeIssuanceInput {
  readonly runtimeIssuanceId:
    string;
  readonly activationCandidateIssuance:
    AshaActivationCandidateIssuance;
  readonly ownerActivationDecision:
    AshaOwnerActivationDecision;
  readonly activatedAt:
    string;
}

export interface AshaOwnerActivatedRuntimeIssuance {
  readonly version:
    typeof ASHA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION;
  readonly runtimeIssuanceId:
    string;
  readonly issuanceState:
    "OWNER_ACTIVATED_RUNTIME_ISSUED";
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
      "Unsupported deterministic owner-activated runtime value.",
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

function validateManifestIntegrity(
  manifest:
    AIEmployeeManifest,
): void {
  requireDigest(
    "qualified manifest digest",
    manifest.manifestDigest,
  );

  const {
    manifestDigest,
    ...manifestCore
  } = manifest;

  if (
    sha256(manifestCore) !==
      manifestDigest
  ) {
    throw new Error(
      "Qualified Asha manifest integrity verification failed.",
    );
  }

  if (
    manifest.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    manifest.templateId !==
      EXPECTED_TEMPLATE_ID ||
    manifest.displayName !==
      EXPECTED_DISPLAY_NAME ||
    manifest.department !==
      EXPECTED_DEPARTMENT ||
    manifest.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL ||
    manifest.evaluation.status !==
      "QUALIFIED"
  ) {
    throw new Error(
      "Asha qualified manifest identity or qualification state is invalid.",
    );
  }

  if (
    manifest.safetyBoundary
      .ownerControlled !==
      true ||
    manifest.safetyBoundary
      .emergencyPauseRequired !==
      true ||
    manifest.safetyBoundary
      .crossTenantAccessAuthorized !==
      false ||
    manifest.safetyBoundary
      .externalDeliveryAuthorized !==
      false ||
    manifest.safetyBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    manifest.safetyBoundary
      .paymentExecutionAuthorized !==
      false ||
    manifest.safetyBoundary
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Asha qualified manifest authority boundary has been changed.",
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
      "Asha activation candidate identity has changed.",
    );
  }

  requireIdentifier(
    "activation candidate runtimeId",
    source.runtimeId,
  );

  requireIdentifier(
    "activation candidate tenantId",
    source.tenantId,
  );

  requireIdentifier(
    "activation candidate ownerId",
    source.ownerId,
  );

  requireDigest(
    "qualification digest",
    source.qualificationDigest,
  );

  requireDigest(
    "qualified manifest digest",
    source.qualifiedManifestDigest,
  );

  const candidate =
    source.activationCandidate;

  if (
    candidate.version !==
      AI_EMPLOYEE_ACTIVATION_CANDIDATE_VERSION
  ) {
    throw new Error(
      "Asha activation candidate version is invalid.",
    );
  }

  requireDigest(
    "activation candidate digest",
    candidate.candidateDigest,
  );

  const {
    candidateDigest,
    ...candidateCore
  } = candidate;

  if (
    sha256(candidateCore) !==
      candidateDigest
  ) {
    throw new Error(
      "Asha activation candidate integrity verification failed.",
    );
  }

  validateManifestIntegrity(
    candidate.qualifiedManifest,
  );

  const runtime =
    candidate.pausedRuntime;

  requireDigest(
    "paused runtime digest",
    runtime.runtimeDigest,
  );

  const {
    runtimeDigest,
    ...runtimeCore
  } = runtime;

  if (
    sha256(runtimeCore) !==
      runtimeDigest
  ) {
    throw new Error(
      "Asha paused runtime integrity verification failed.",
    );
  }

  if (
    candidate.employeeId !==
      source.employeeId ||
    candidate.templateId !==
      source.templateId ||
    candidate.qualificationDigest !==
      source.qualificationDigest ||
    candidate.qualifiedManifest
      .manifestDigest !==
      source.qualifiedManifestDigest ||
    candidate.activationEligible !==
      true ||
    candidate.ownerActivationRequired !==
      true ||
    candidate.preparedAt !==
      source.preparedAt ||
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
      "Asha activation candidate runtime binding is invalid.",
    );
  }

  if (
    candidate.safetyBoundary
      .runtimeInitiallyPaused !==
      true ||
    candidate.safetyBoundary
      .crossTenantActivationBlocked !==
      true ||
    candidate.safetyBoundary
      .externalDeliveryAuthorized !==
      false ||
    candidate.safetyBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    candidate.safetyBoundary
      .paymentExecutionAuthorized !==
      false ||
    candidate.safetyBoundary
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Asha activation candidate safety boundary has been changed.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.qualifiedManifestIssuanceBound !==
      true ||
    boundary.formalQualificationBound !==
      true ||
    boundary.canonicalTemplateBound !==
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

function validateOwnerActivationDecision(
  decision:
    AshaOwnerActivationDecision,
  source:
    AshaActivationCandidateIssuance,
): void {
  if (
    decision.version !==
      ASHA_OWNER_ACTIVATION_DECISION_VERSION
  ) {
    throw new Error(
      "A valid Workforce Day 21 owner activation decision is required.",
    );
  }

  requireDigest(
    "owner activation decision digest",
    decision.decisionDigest,
  );

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Workforce Day 21 owner activation decision integrity verification failed.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_ASHA_ACTIVATION" ||
    decision.ownerActivationApproved !==
      true ||
    decision.runtimeActivationEligible !==
      true ||
    decision.nextStep !==
      "PREPARE_OWNER_ACTIVATED_RUNTIME"
  ) {
    throw new Error(
      "Asha runtime activation requires an explicit approved owner decision.",
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
    decision.tenantId !==
      source.tenantId ||
    decision.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Owner activation decision does not match the activation candidate.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.ownerDecisionRequired !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.activationCandidateIssuanceBound !==
      true ||
    boundary.qualificationBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.activationCandidateCreated !==
      true ||
    boundary.ownerActivationDecisionRecorded !==
      true ||
    boundary.runtimeActivationExecuted !==
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
      "Workforce Day 21 authority boundary has been changed.",
    );
  }
}

function validateOwnerActivatedRuntime(
  source:
    AshaActivationCandidateIssuance,
  runtime:
    AIEmployeeRuntimeContract,
): void {
  requireDigest(
    "owner-activated runtime digest",
    runtime.runtimeDigest,
  );

  const {
    runtimeDigest,
    ...runtimeCore
  } = runtime;

  if (
    sha256(runtimeCore) !==
      runtimeDigest
  ) {
    throw new Error(
      "Asha owner-activated runtime integrity verification failed.",
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
      true
  ) {
    throw new Error(
      "Asha owner-activated runtime contract is invalid.",
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
      "Asha owner-activated runtime safety boundary is invalid.",
    );
  }

  if (
    runtime.runtimeDigest ===
      source.activationCandidate
        .pausedRuntime.runtimeDigest
  ) {
    throw new Error(
      "Owner-activated runtime must produce a new runtime digest.",
    );
  }
}

export function createAshaOwnerActivatedRuntimeIssuance(
  input:
    CreateAshaOwnerActivatedRuntimeIssuanceInput,
): AshaOwnerActivatedRuntimeIssuance {
  requireIdentifier(
    "owner-activated runtime issuanceId",
    input.runtimeIssuanceId,
  );

  requireIsoDate(
    "owner-activated runtime activation time",
    input.activatedAt,
  );

  validateActivationCandidateIssuance(
    input.activationCandidateIssuance,
  );

  validateOwnerActivationDecision(
    input.ownerActivationDecision,
    input.activationCandidateIssuance,
  );

  if (
    Date.parse(input.activatedAt) <
    Date.parse(
      input.ownerActivationDecision
        .decidedAt,
    )
  ) {
    throw new Error(
      "Runtime activation cannot precede the owner activation decision.",
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
  );

  const issuanceCore = {
    version:
      ASHA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION,
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
    pausedRuntimeDigest:
      source.activationCandidate
        .pausedRuntime.runtimeDigest,
    ownerActivatedRuntime,
    authorityBoundary: {
      activationCandidateIssuanceBound:
        true,
      ownerActivationDecisionBound:
        true,
      ownerIdentityBound:
        true,
      qualificationBound:
        true,
      qualifiedManifestBound:
        true,
      runtimeIdentityPreserved:
        true,
      approvalBypassAllowed:
        false,
      runtimeActivationExecuted:
        true,
      runtimeActivated:
        true,
      controlledWorkAuthorized:
        true,
      emergencyPauseAvailable:
        true,
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
      "PREPARE_CONTROLLED_SHADOW_OPERATION" as const,
    activatedAt:
      input.activatedAt,
  };

  const issuance:
    AshaOwnerActivatedRuntimeIssuance = {
      ...issuanceCore,
      runtimeIssuanceDigest:
        sha256(issuanceCore),
    };

  return deepFreeze(
    issuance,
  ) as AshaOwnerActivatedRuntimeIssuance;
}