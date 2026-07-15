
import { createHash } from "node:crypto";

import {
  ASHA_INDEPENDENT_EVALUATION_VERSION,
  type AshaIndependentEvaluationReport,
} from "./ashaIndependentEvaluationHarness";

import {
  ASHA_SUPER_SPECIALIST_FOUNDATION_CASES,
  ASHA_SUPER_SPECIALIST_ROLE_CASES,
  ASHA_SUPER_SPECIALIST_STANDARD,
  ASHA_SUPER_SPECIALIST_TOTAL_CASES,
} from "./ashaSuperSpecialistStandard";

export const ASHA_OWNER_CERTIFICATION_PACKET_VERSION =
  "nexus-asha-owner-certification-packet-v1" as const;

export const ASHA_OWNER_CERTIFICATION_DECISION_VERSION =
  "nexus-asha-owner-certification-decision-v1" as const;

export const ASHA_SHADOW_MODE_ADMISSION_VERSION =
  "nexus-asha-shadow-mode-admission-v1" as const;

export const ASHA_SHADOW_MODE_TERMINATION_VERSION =
  "nexus-asha-shadow-mode-termination-v1" as const;

export type AshaOwnerCertificationDecisionValue =
  | "APPROVE_SHADOW_MODE"
  | "REJECT_SHADOW_MODE";

export type AshaShadowModeTerminationReason =
  | "EMERGENCY_PAUSE"
  | "OWNER_REVOKE";

export interface CreateAshaOwnerCertificationPacketInput {
  readonly evaluation:
    AshaIndependentEvaluationReport;
  readonly tenantId: string;
  readonly preparedAt: string;
}

export interface AshaOwnerCertificationReviewPacket {
  readonly version:
    typeof ASHA_OWNER_CERTIFICATION_PACKET_VERSION;
  readonly certificationScope:
    "SHADOW_MODE_ONLY";
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly evaluationVersion:
    typeof ASHA_INDEPENDENT_EVALUATION_VERSION;
  readonly evaluationReportDigest: string;
  readonly evaluationSummary: Readonly<{
    totalCases:
      typeof ASHA_SUPER_SPECIALIST_TOTAL_CASES;
    passedCases:
      typeof ASHA_SUPER_SPECIALIST_TOTAL_CASES;
    foundationCases:
      typeof ASHA_SUPER_SPECIALIST_FOUNDATION_CASES;
    specialistCases:
      typeof ASHA_SUPER_SPECIALIST_ROLE_CASES;
    specialistCompetencies: 12;
    assertionDerivedEvidence: true;
    hardCodedPassingEvidenceAccepted: false;
    shadowModeReviewEligible: true;
  }>;
  readonly ownerReviewRequirements: Readonly<{
    ownerIdentityMustMatchEvaluation: true;
    evaluationDigestMustRemainExact: true;
    explicitDecisionRequired: true;
    rejectionMustRemainFailClosed: true;
    emergencyPauseRequired: true;
    revocationRequired: true;
    controlledPilotEvidenceStillRequired: true;
  }>;
  readonly safetyBoundary: Readonly<{
    formalQualificationIssued: false;
    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    runtimeActivated: false;
    customerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    paymentExecutionAuthorized: false;
    productionDatabaseAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly preparedAt: string;
  readonly packetDigest: string;
}

export interface CreateAshaOwnerCertificationDecisionInput {
  readonly packet:
    AshaOwnerCertificationReviewPacket;
  readonly decisionId: string;
  readonly ownerId: string;
  readonly decision:
    AshaOwnerCertificationDecisionValue;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface AshaOwnerCertificationDecision {
  readonly version:
    typeof ASHA_OWNER_CERTIFICATION_DECISION_VERSION;
  readonly decisionId: string;
  readonly packetDigest: string;
  readonly evaluationReportDigest: string;
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly decision:
    AshaOwnerCertificationDecisionValue;
  readonly certificationScope:
    "SHADOW_MODE_ONLY";
  readonly approvedForShadowMode: boolean;
  readonly shadowModeAdmissionEligible: boolean;
  readonly reason: string;
  readonly authorityBoundary: Readonly<{
    ownerDecisionFinalForAdmission: true;
    approvalBypassAllowed: false;
    formalQualificationIssued: false;
    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    runtimeActivated: false;
    autonomousWorkAuthorized: false;
    productionReadinessAuthorized: false;
  }>;
  readonly decidedAt: string;
  readonly decisionDigest: string;
}

export interface CreateAshaShadowModeAdmissionInput {
  readonly packet:
    AshaOwnerCertificationReviewPacket;
  readonly decision:
    AshaOwnerCertificationDecision;
  readonly admissionId: string;
  readonly tenantId: string;
  readonly admittedAt: string;
  readonly expiresAt: string;
}

export interface AshaShadowModeAdmission {
  readonly version:
    typeof ASHA_SHADOW_MODE_ADMISSION_VERSION;
  readonly admissionId: string;
  readonly admissionState:
    "ACTIVE_SHADOW_OBSERVATION";
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly packetDigest: string;
  readonly decisionDigest: string;
  readonly evaluationReportDigest: string;
  readonly mode:
    "SANITIZED_OR_SYNTHETIC_SHADOW_OBSERVATION_ONLY";
  readonly shadowAuthority: Readonly<{
    internalAssessmentAuthorized: true;
    sanitizedOrSyntheticInputsOnly: true;
    ownerComparisonAuthorized: true;
    ownerVisibleEvidenceRequired: true;
    customerDataAccessAuthorized: false;
    customerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    formalQualificationAuthorized: false;
    runtimeActivationAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly controlBoundary: Readonly<{
    ownerRevocationAvailable: true;
    emergencyPauseAvailable: true;
    expiresAutomatically: true;
    crossTenantUseBlocked: true;
    controlledPilotEvidenceStillRequired: true;
    formalQualificationStillRequired: true;
  }>;
  readonly admittedAt: string;
  readonly expiresAt: string;
  readonly admissionDigest: string;
}

export interface TerminateAshaShadowModeAdmissionInput {
  readonly admission:
    AshaShadowModeAdmission;
  readonly terminationId: string;
  readonly ownerId: string;
  readonly action:
    AshaShadowModeTerminationReason;
  readonly reason: string;
  readonly terminatedAt: string;
}

export interface AshaShadowModeTermination {
  readonly version:
    typeof ASHA_SHADOW_MODE_TERMINATION_VERSION;
  readonly terminationId: string;
  readonly admissionId: string;
  readonly admissionDigest: string;
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly action:
    AshaShadowModeTerminationReason;
  readonly previousState:
    "ACTIVE_SHADOW_OBSERVATION";
  readonly currentState:
    "TERMINATED";
  readonly shadowWorkAuthorized: false;
  readonly emergencyPauseApplied: boolean;
  readonly ownerRevocationApplied: boolean;
  readonly reason: string;
  readonly safetyBoundary: Readonly<{
    customerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    runtimeActivationAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly terminatedAt: string;
  readonly terminationDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const MAX_SHADOW_MODE_DURATION_MS =
  30 * 24 * 60 * 60 * 1000;

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
      "Unsupported deterministic Asha certification value.",
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
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a canonical safe identifier.",
    );
  }
}

function requireIsoDate(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      label +
        " must be a valid ISO date.",
    );
  }
}

function requireText(
  label: string,
  value: string,
  minimum: number,
  maximum: number,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    value.length < minimum ||
    value.length > maximum
  ) {
    throw new Error(
      label +
        " must contain between " +
        minimum +
        " and " +
        maximum +
        " characters.",
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value) ||
    /^0{64}$/.test(value)
  ) {
    throw new Error(
      label +
        " must be a non-zero SHA-256 digest.",
    );
  }
}

function requireDigestIntegrity(
  label: string,
  value:
    Record<string, unknown>,
  digestField: string,
): void {
  const digest =
    value[digestField];

  if (
    typeof digest !== "string"
  ) {
    throw new Error(
      label +
        " digest is missing.",
    );
  }

  requireDigest(
    label + " digest",
    digest,
  );

  const core = {
    ...value,
  };

  delete core[digestField];

  if (
    sha256(core) !== digest
  ) {
    throw new Error(
      label +
        " digest integrity check failed.",
    );
  }
}

function validateEvaluation(
  evaluation:
    AshaIndependentEvaluationReport,
): void {
  if (
    evaluation.version !==
      ASHA_INDEPENDENT_EVALUATION_VERSION
  ) {
    throw new Error(
      "Asha certification requires the official independent evaluation version.",
    );
  }

  if (
    evaluation.employeeId !==
      ASHA_SUPER_SPECIALIST_STANDARD
        .employeeId ||
    evaluation.templateId !==
      ASHA_SUPER_SPECIALIST_STANDARD
        .templateId
  ) {
    throw new Error(
      "Asha evaluation identity does not match the official specialist standard.",
    );
  }

  if (
    evaluation.totalCases !==
      ASHA_SUPER_SPECIALIST_TOTAL_CASES ||
    evaluation.passedCases !==
      ASHA_SUPER_SPECIALIST_TOTAL_CASES ||
    evaluation.foundation.totalCases !==
      ASHA_SUPER_SPECIALIST_FOUNDATION_CASES ||
    evaluation.foundation.passedCases !==
      ASHA_SUPER_SPECIALIST_FOUNDATION_CASES ||
    evaluation.specialist.totalCases !==
      ASHA_SUPER_SPECIALIST_ROLE_CASES ||
    evaluation.specialist.passedCases !==
      ASHA_SUPER_SPECIALIST_ROLE_CASES
  ) {
    throw new Error(
      "Asha certification requires exactly 400 passing executable cases.",
    );
  }

  if (
    evaluation.caseResults.length !==
      ASHA_SUPER_SPECIALIST_TOTAL_CASES ||
    evaluation.caseResults.some(
      (result) =>
        result.passed !== true ||
        result.assertions.length < 1,
    )
  ) {
    throw new Error(
      "Asha certification requires complete assertion-derived case evidence.",
    );
  }

  if (
    new Set(
      evaluation.caseResults.map(
        (result) =>
          result.caseId,
      ),
    ).size !==
      evaluation.caseResults.length
  ) {
    throw new Error(
      "Asha certification blocks duplicate evaluation case identities.",
    );
  }

  if (
    new Set(
      evaluation.caseResults.map(
        (result) =>
          result.evidenceDigest,
      ),
    ).size !==
      evaluation.caseResults.length
  ) {
    throw new Error(
      "Asha certification blocks duplicate evaluation evidence.",
    );
  }

  if (
    evaluation.assertionDerivedEvidence !==
      true ||
    evaluation.hardCodedPassingEvidenceAccepted !==
      false ||
    evaluation.readiness
      .shadowModeReviewEligible !==
      true
  ) {
    throw new Error(
      "Asha evaluation is not eligible for owner shadow-mode review.",
    );
  }

  if (
    evaluation.formalQualificationIssued !==
      false ||
    evaluation.controlledActivationAuthorized !==
      false ||
    evaluation.productionReady !==
      false ||
    evaluation.readiness
      .formalQualificationIssued !==
      false ||
    evaluation.readiness
      .controlledActivationAuthorized !==
      false ||
    evaluation.readiness
      .productionReady !==
      false
  ) {
    throw new Error(
      "Asha evaluation unexpectedly contains qualification or activation authority.",
    );
  }

  if (
    evaluation.safetyBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    evaluation.safetyBoundary
      .externalDeliveryAuthorized !==
      false ||
    evaluation.safetyBoundary
      .paymentExecutionAuthorized !==
      false ||
    evaluation.safetyBoundary
      .productionDatabaseAuthorized !==
      false ||
    evaluation.safetyBoundary
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Asha evaluation safety boundary is invalid.",
    );
  }

  if (
    evaluation.evaluatorId ===
      evaluation.ownerId
  ) {
    throw new Error(
      "Asha owner certification requires an evaluator distinct from the owner.",
    );
  }

  requireIdentifier(
    "evaluation evaluatorId",
    evaluation.evaluatorId,
  );

  requireIdentifier(
    "evaluation ownerId",
    evaluation.ownerId,
  );

  requireIsoDate(
    "evaluation time",
    evaluation.evaluatedAt,
  );

  requireDigestIntegrity(
    "Asha independent evaluation",
    evaluation as unknown as
      Record<string, unknown>,
    "reportDigest",
  );
}

function validatePacket(
  packet:
    AshaOwnerCertificationReviewPacket,
): void {
  if (
    packet.version !==
      ASHA_OWNER_CERTIFICATION_PACKET_VERSION ||
    packet.certificationScope !==
      "SHADOW_MODE_ONLY"
  ) {
    throw new Error(
      "Asha owner certification packet contract is invalid.",
    );
  }

  requireDigestIntegrity(
    "Asha owner certification packet",
    packet as unknown as
      Record<string, unknown>,
    "packetDigest",
  );
}

function validateDecision(
  decision:
    AshaOwnerCertificationDecision,
): void {
  if (
    decision.version !==
      ASHA_OWNER_CERTIFICATION_DECISION_VERSION ||
    decision.certificationScope !==
      "SHADOW_MODE_ONLY"
  ) {
    throw new Error(
      "Asha owner certification decision contract is invalid.",
    );
  }

  requireDigestIntegrity(
    "Asha owner certification decision",
    decision as unknown as
      Record<string, unknown>,
    "decisionDigest",
  );
}

function validateAdmission(
  admission:
    AshaShadowModeAdmission,
): void {
  if (
    admission.version !==
      ASHA_SHADOW_MODE_ADMISSION_VERSION ||
    admission.admissionState !==
      "ACTIVE_SHADOW_OBSERVATION"
  ) {
    throw new Error(
      "Asha shadow-mode admission contract is invalid.",
    );
  }

  requireDigestIntegrity(
    "Asha shadow-mode admission",
    admission as unknown as
      Record<string, unknown>,
    "admissionDigest",
  );
}

export function createAshaOwnerCertificationReviewPacket(
  input:
    CreateAshaOwnerCertificationPacketInput,
): AshaOwnerCertificationReviewPacket {
  validateEvaluation(
    input.evaluation,
  );

  requireIdentifier(
    "tenantId",
    input.tenantId,
  );

  requireIsoDate(
    "packet preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(
      input.evaluation.evaluatedAt,
    )
  ) {
    throw new Error(
      "Owner certification packet cannot be prepared before evaluation.",
    );
  }

  const packetCore = {
    version:
      ASHA_OWNER_CERTIFICATION_PACKET_VERSION,
    certificationScope:
      "SHADOW_MODE_ONLY" as const,
    employeeId:
      input.evaluation.employeeId,
    templateId:
      input.evaluation.templateId,
    tenantId:
      input.tenantId,
    ownerId:
      input.evaluation.ownerId,
    evaluatorId:
      input.evaluation.evaluatorId,
    evaluationVersion:
      input.evaluation.version,
    evaluationReportDigest:
      input.evaluation.reportDigest,
    evaluationSummary: {
      totalCases:
        ASHA_SUPER_SPECIALIST_TOTAL_CASES,
      passedCases:
        ASHA_SUPER_SPECIALIST_TOTAL_CASES,
      foundationCases:
        ASHA_SUPER_SPECIALIST_FOUNDATION_CASES,
      specialistCases:
        ASHA_SUPER_SPECIALIST_ROLE_CASES,
      specialistCompetencies:
        12 as const,
      assertionDerivedEvidence:
        true as const,
      hardCodedPassingEvidenceAccepted:
        false as const,
      shadowModeReviewEligible:
        true as const,
    },
    ownerReviewRequirements: {
      ownerIdentityMustMatchEvaluation:
        true,
      evaluationDigestMustRemainExact:
        true,
      explicitDecisionRequired:
        true,
      rejectionMustRemainFailClosed:
        true,
      emergencyPauseRequired:
        true,
      revocationRequired:
        true,
      controlledPilotEvidenceStillRequired:
        true,
    } as const,
    safetyBoundary: {
      formalQualificationIssued:
        false,
      qualifiedManifestCreated:
        false,
      activationCandidateCreated:
        false,
      runtimeActivated:
        false,
      customerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      productionDatabaseAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    preparedAt:
      input.preparedAt,
  };

  const packet:
    AshaOwnerCertificationReviewPacket = {
      ...packetCore,
      packetDigest:
        sha256(packetCore),
    };

  return deepFreeze(
    packet,
  ) as AshaOwnerCertificationReviewPacket;
}

export function createAshaOwnerCertificationDecision(
  input:
    CreateAshaOwnerCertificationDecisionInput,
): AshaOwnerCertificationDecision {
  validatePacket(
    input.packet,
  );

  requireIdentifier(
    "decisionId",
    input.decisionId,
  );

  requireIdentifier(
    "ownerId",
    input.ownerId,
  );

  requireText(
    "certification reason",
    input.reason,
    10,
    500,
  );

  requireIsoDate(
    "certification decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      input.packet.ownerId
  ) {
    throw new Error(
      "Only the evaluation-bound owner can issue the certification decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_SHADOW_MODE" &&
    input.decision !==
      "REJECT_SHADOW_MODE"
  ) {
    throw new Error(
      "Asha owner certification decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(
      input.packet.preparedAt,
    )
  ) {
    throw new Error(
      "Owner certification decision cannot precede packet preparation.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_SHADOW_MODE";

  const decisionCore = {
    version:
      ASHA_OWNER_CERTIFICATION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    packetDigest:
      input.packet.packetDigest,
    evaluationReportDigest:
      input.packet
        .evaluationReportDigest,
    employeeId:
      input.packet.employeeId,
    templateId:
      input.packet.templateId,
    tenantId:
      input.packet.tenantId,
    ownerId:
      input.ownerId,
    decision:
      input.decision,
    certificationScope:
      "SHADOW_MODE_ONLY" as const,
    approvedForShadowMode:
      approved,
    shadowModeAdmissionEligible:
      approved,
    reason:
      input.reason,
    authorityBoundary: {
      ownerDecisionFinalForAdmission:
        true,
      approvalBypassAllowed:
        false,
      formalQualificationIssued:
        false,
      qualifiedManifestCreated:
        false,
      activationCandidateCreated:
        false,
      runtimeActivated:
        false,
      autonomousWorkAuthorized:
        false,
      productionReadinessAuthorized:
        false,
    } as const,
    decidedAt:
      input.decidedAt,
  };

  const decision:
    AshaOwnerCertificationDecision = {
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
  };

  return deepFreeze(
    decision,
  ) as AshaOwnerCertificationDecision;
}

export function createAshaShadowModeAdmission(
  input:
    CreateAshaShadowModeAdmissionInput,
): AshaShadowModeAdmission {
  validatePacket(
    input.packet,
  );

  validateDecision(
    input.decision,
  );

  requireIdentifier(
    "admissionId",
    input.admissionId,
  );

  requireIdentifier(
    "tenantId",
    input.tenantId,
  );

  requireIsoDate(
    "shadow admission time",
    input.admittedAt,
  );

  requireIsoDate(
    "shadow admission expiry",
    input.expiresAt,
  );

  if (
    input.decision.packetDigest !==
      input.packet.packetDigest ||
    input.decision
      .evaluationReportDigest !==
      input.packet
        .evaluationReportDigest
  ) {
    throw new Error(
      "Shadow-mode decision does not belong to the certification packet.",
    );
  }

  if (
    input.decision.employeeId !==
      input.packet.employeeId ||
    input.decision.templateId !==
      input.packet.templateId ||
    input.decision.ownerId !==
      input.packet.ownerId
  ) {
    throw new Error(
      "Shadow-mode decision identity does not match the certification packet.",
    );
  }

  if (
    input.decision.decision !==
      "APPROVE_SHADOW_MODE" ||
    input.decision
      .approvedForShadowMode !==
      true ||
    input.decision
      .shadowModeAdmissionEligible !==
      true
  ) {
    throw new Error(
      "Rejected owner certification cannot create shadow-mode admission.",
    );
  }

  if (
    input.tenantId !==
      input.packet.tenantId ||
    input.tenantId !==
      input.decision.tenantId
  ) {
    throw new Error(
      "Cross-tenant shadow-mode admission is blocked.",
    );
  }

  const admittedTime =
    Date.parse(
      input.admittedAt,
    );

  const decisionTime =
    Date.parse(
      input.decision.decidedAt,
    );

  const expiryTime =
    Date.parse(
      input.expiresAt,
    );

  if (
    admittedTime <
      decisionTime
  ) {
    throw new Error(
      "Shadow-mode admission cannot precede owner approval.",
    );
  }

  if (
    expiryTime <=
      admittedTime
  ) {
    throw new Error(
      "Shadow-mode admission expiry must occur after admission.",
    );
  }

  if (
    expiryTime -
      admittedTime >
      MAX_SHADOW_MODE_DURATION_MS
  ) {
    throw new Error(
      "Shadow-mode admission cannot exceed 30 days.",
    );
  }

  const admissionCore = {
    version:
      ASHA_SHADOW_MODE_ADMISSION_VERSION,
    admissionId:
      input.admissionId,
    admissionState:
      "ACTIVE_SHADOW_OBSERVATION" as const,
    employeeId:
      input.packet.employeeId,
    templateId:
      input.packet.templateId,
    tenantId:
      input.tenantId,
    ownerId:
      input.packet.ownerId,
    evaluatorId:
      input.packet.evaluatorId,
    packetDigest:
      input.packet.packetDigest,
    decisionDigest:
      input.decision.decisionDigest,
    evaluationReportDigest:
      input.packet
        .evaluationReportDigest,
    mode:
      "SANITIZED_OR_SYNTHETIC_SHADOW_OBSERVATION_ONLY" as const,
    shadowAuthority: {
      internalAssessmentAuthorized:
        true,
      sanitizedOrSyntheticInputsOnly:
        true,
      ownerComparisonAuthorized:
        true,
      ownerVisibleEvidenceRequired:
        true,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      productionMutationAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      autonomousDecisionAuthorized:
        false,
      formalQualificationAuthorized:
        false,
      runtimeActivationAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    controlBoundary: {
      ownerRevocationAvailable:
        true,
      emergencyPauseAvailable:
        true,
      expiresAutomatically:
        true,
      crossTenantUseBlocked:
        true,
      controlledPilotEvidenceStillRequired:
        true,
      formalQualificationStillRequired:
        true,
    } as const,
    admittedAt:
      input.admittedAt,
    expiresAt:
      input.expiresAt,
  };

  const admission:
    AshaShadowModeAdmission = {
      ...admissionCore,
      admissionDigest:
        sha256(admissionCore),
  };

  return deepFreeze(
    admission,
  ) as AshaShadowModeAdmission;
}

export function terminateAshaShadowModeAdmission(
  input:
    TerminateAshaShadowModeAdmissionInput,
): AshaShadowModeTermination {
  validateAdmission(
    input.admission,
  );

  requireIdentifier(
    "terminationId",
    input.terminationId,
  );

  requireIdentifier(
    "ownerId",
    input.ownerId,
  );

  requireText(
    "termination reason",
    input.reason,
    10,
    500,
  );

  requireIsoDate(
    "shadow termination time",
    input.terminatedAt,
  );

  if (
    input.ownerId !==
      input.admission.ownerId
  ) {
    throw new Error(
      "Only the admission owner can terminate Asha shadow mode.",
    );
  }

  if (
    input.action !==
      "EMERGENCY_PAUSE" &&
    input.action !==
      "OWNER_REVOKE"
  ) {
    throw new Error(
      "Asha shadow-mode termination action is invalid.",
    );
  }

  if (
    Date.parse(
      input.terminatedAt,
    ) <
    Date.parse(
      input.admission.admittedAt,
    )
  ) {
    throw new Error(
      "Shadow-mode termination cannot precede admission.",
    );
  }

  const terminationCore = {
    version:
      ASHA_SHADOW_MODE_TERMINATION_VERSION,
    terminationId:
      input.terminationId,
    admissionId:
      input.admission.admissionId,
    admissionDigest:
      input.admission.admissionDigest,
    employeeId:
      input.admission.employeeId,
    templateId:
      input.admission.templateId,
    tenantId:
      input.admission.tenantId,
    ownerId:
      input.ownerId,
    action:
      input.action,
    previousState:
      "ACTIVE_SHADOW_OBSERVATION" as const,
    currentState:
      "TERMINATED" as const,
    shadowWorkAuthorized:
      false as const,
    emergencyPauseApplied:
      input.action ===
        "EMERGENCY_PAUSE",
    ownerRevocationApplied:
      input.action ===
        "OWNER_REVOKE",
    reason:
      input.reason,
    safetyBoundary: {
      customerContactAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      productionMutationAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      runtimeActivationAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    terminatedAt:
      input.terminatedAt,
  };

  const termination:
    AshaShadowModeTermination = {
      ...terminationCore,
      terminationDigest:
        sha256(terminationCore),
  };

  return deepFreeze(
    termination,
  ) as AshaShadowModeTermination;
}
