
import { createHash } from "node:crypto";

import {
  assessAshaSpecialistInquiry,
  type AshaSpecialistInquiryAssessment,
  type AshaSpecialistInquiryAssessmentInput,
} from "./ashaSpecialistInquiryAssessment";

import {
  ASHA_SHADOW_MODE_ADMISSION_VERSION,
  ASHA_SHADOW_MODE_TERMINATION_VERSION,
  type AshaShadowModeAdmission,
  type AshaShadowModeTermination,
} from "./ashaOwnerCertificationShadowAdmission";

export const ASHA_SANITIZED_SHADOW_SESSION_VERSION =
  "nexus-asha-sanitized-shadow-session-v1" as const;

export const ASHA_SHADOW_SANITIZATION_EVIDENCE_VERSION =
  "nexus-asha-shadow-sanitization-evidence-v1" as const;

export const ASHA_SHADOW_OBSERVATION_VERSION =
  "nexus-asha-shadow-observation-v1" as const;

export const ASHA_SHADOW_OBSERVATION_LEDGER_VERSION =
  "nexus-asha-shadow-observation-ledger-v1" as const;

export type AshaShadowInputSourceMode =
  | "SANITIZED"
  | "SYNTHETIC";

export type AshaShadowObservationOutcome =
  | "PASS"
  | "FAIL_CLOSED";

export type AshaShadowComparisonCriterionId =
  | "INTENT"
  | "ROUTING"
  | "URGENCY"
  | "ESCALATION"
  | "CLARIFICATION"
  | "COMPLETENESS";

export interface CreateAshaShadowSanitizationEvidenceInput {
  readonly evidenceId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly sourceMode:
    AshaShadowInputSourceMode;
  readonly sourceLabel: string;
  readonly containsDirectCustomerData: false;
  readonly containsSecrets: false;
  readonly containsProductionIdentifiers: false;
  readonly sanitizedAt: string;
}

export interface AshaShadowSanitizationEvidence {
  readonly version:
    typeof ASHA_SHADOW_SANITIZATION_EVIDENCE_VERSION;
  readonly evidenceId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly sourceMode:
    AshaShadowInputSourceMode;
  readonly sourceLabel: string;
  readonly containsDirectCustomerData: false;
  readonly containsSecrets: false;
  readonly containsProductionIdentifiers: false;
  readonly sanitizedAt: string;
  readonly evidenceDigest: string;
}

export interface CreateAshaSanitizedShadowSessionInput {
  readonly admission:
    AshaShadowModeAdmission;
  readonly sessionId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly openedAt: string;
}

export interface AshaSanitizedShadowSession {
  readonly version:
    typeof ASHA_SANITIZED_SHADOW_SESSION_VERSION;
  readonly sessionId: string;
  readonly sessionState:
    "ACTIVE_SANITIZED_OBSERVATION";
  readonly admissionId: string;
  readonly admissionDigest: string;
  readonly evaluationReportDigest: string;
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly sourceRestriction:
    "SANITIZED_OR_SYNTHETIC_ONLY";
  readonly authorityBoundary: Readonly<{
    internalAssessmentAuthorized: true;
    ownerComparisonAuthorized: true;
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
    admissionExpiryEnforced: true;
    emergencyPauseEnforced: true;
    ownerRevocationEnforced: true;
    crossTenantUseBlocked: true;
    failedScoringRemainsFailClosed: true;
  }>;
  readonly openedAt: string;
  readonly expiresAt: string;
  readonly sessionDigest: string;
}

export interface AshaShadowOwnerReference {
  readonly preparedByOwnerId: string;
  readonly expectedIntent:
    AshaSpecialistInquiryAssessment[
      "intent"
    ]["primary"];
  readonly expectedDepartment:
    AshaSpecialistInquiryAssessment[
      "routing"
    ]["destination"];
  readonly expectedUrgency:
    AshaSpecialistInquiryAssessment[
      "urgency"
    ]["level"];
  readonly expectedEscalationRequired:
    boolean;
  readonly expectedClarificationRequired:
    boolean;
  readonly expectedCompletenessPercent:
    number;
  readonly referenceReason: string;
}

export interface AshaShadowComparisonCriterion {
  readonly criterionId:
    AshaShadowComparisonCriterionId;
  readonly weight: number;
  readonly critical: boolean;
  readonly expectedValue:
    string | number | boolean;
  readonly actualValue:
    string | number | boolean;
  readonly matched: boolean;
}

export interface ExecuteAshaShadowObservationInput {
  readonly session:
    AshaSanitizedShadowSession;
  readonly termination?:
    AshaShadowModeTermination | null;
  readonly observationId: string;
  readonly sanitizationEvidence:
    AshaShadowSanitizationEvidence;
  readonly inquiry:
    AshaSpecialistInquiryAssessmentInput;
  readonly ownerReference:
    AshaShadowOwnerReference;
  readonly observedAt: string;
}

export interface AshaShadowObservation {
  readonly version:
    typeof ASHA_SHADOW_OBSERVATION_VERSION;
  readonly observationId: string;
  readonly sessionId: string;
  readonly sessionDigest: string;
  readonly admissionId: string;
  readonly admissionDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly employeeId: string;
  readonly sanitizationEvidenceDigest:
    string;
  readonly sourceMode:
    AshaShadowInputSourceMode;
  readonly inquiryId: string;
  readonly assessment:
    AshaSpecialistInquiryAssessment;
  readonly assessmentDigest: string;
  readonly ownerComparison: Readonly<{
    criteria:
      readonly AshaShadowComparisonCriterion[];
    totalWeight: 100;
    achievedScore: number;
    passingScore: 85;
    criticalMismatch: boolean;
    outcome:
      AshaShadowObservationOutcome;
    ownerReviewRequired: boolean;
  }>;
  readonly safetyBoundary: Readonly<{
    sanitizedOrSyntheticInputVerified: true;
    externalDeliveryPerformed: false;
    liveProviderExecutionPerformed: false;
    productionMutationPerformed: false;
    paymentExecutionPerformed: false;
    customerContactPerformed: false;
    formalQualificationIssued: false;
    runtimeActivated: false;
    publicLaunchAuthorized: false;
  }>;
  readonly observedAt: string;
  readonly observationDigest: string;
}

export interface AshaShadowObservationLedgerEntry {
  readonly sequence: number;
  readonly observationId: string;
  readonly observationDigest: string;
  readonly score: number;
  readonly outcome:
    AshaShadowObservationOutcome;
  readonly recordedAt: string;
  readonly previousEntryDigest:
    string | null;
  readonly entryDigest: string;
}

export interface CreateAshaShadowObservationLedgerInput {
  readonly ledgerId: string;
  readonly session:
    AshaSanitizedShadowSession;
  readonly createdAt: string;
}

export interface AppendAshaShadowObservationLedgerInput {
  readonly ledger:
    AshaShadowObservationLedger;
  readonly session:
    AshaSanitizedShadowSession;
  readonly observation:
    AshaShadowObservation;
  readonly recordedAt: string;
}

export interface AshaShadowObservationLedger {
  readonly version:
    typeof ASHA_SHADOW_OBSERVATION_LEDGER_VERSION;
  readonly ledgerId: string;
  readonly sessionId: string;
  readonly sessionDigest: string;
  readonly admissionDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly entries:
    readonly AshaShadowObservationLedgerEntry[];
  readonly summary: Readonly<{
    totalObservations: number;
    passedObservations: number;
    failedClosedObservations: number;
    ownerReviewRequired: boolean;
    continuationRecommendation:
      | "CONTINUE_SANITIZED_OBSERVATION"
      | "PAUSE_FOR_OWNER_REVIEW";
    formalQualificationAuthorized: false;
    runtimeActivationAuthorized: false;
    productionReadinessAuthorized: false;
  }>;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly ledgerDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

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
      "Unsupported deterministic shadow observation value.",
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

function validateAdmission(
  admission:
    AshaShadowModeAdmission,
): void {
  if (
    admission.version !==
      ASHA_SHADOW_MODE_ADMISSION_VERSION ||
    admission.admissionState !==
      "ACTIVE_SHADOW_OBSERVATION" ||
    admission.mode !==
      "SANITIZED_OR_SYNTHETIC_SHADOW_OBSERVATION_ONLY"
  ) {
    throw new Error(
      "Asha shadow admission contract is invalid.",
    );
  }

  if (
    admission.shadowAuthority
      .sanitizedOrSyntheticInputsOnly !==
      true ||
    admission.shadowAuthority
      .customerDataAccessAuthorized !==
      false ||
    admission.shadowAuthority
      .customerContactAuthorized !==
      false ||
    admission.shadowAuthority
      .externalDeliveryAuthorized !==
      false ||
    admission.shadowAuthority
      .liveProviderExecutionAuthorized !==
      false ||
    admission.shadowAuthority
      .productionMutationAuthorized !==
      false ||
    admission.shadowAuthority
      .paymentExecutionAuthorized !==
      false ||
    admission.shadowAuthority
      .formalQualificationAuthorized !==
      false ||
    admission.shadowAuthority
      .runtimeActivationAuthorized !==
      false ||
    admission.shadowAuthority
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Asha shadow admission authority boundary is invalid.",
    );
  }

  requireDigestIntegrity(
    "Asha shadow admission",
    admission as unknown as
      Record<string, unknown>,
    "admissionDigest",
  );
}

function validateTermination(
  termination:
    AshaShadowModeTermination,
): void {
  if (
    termination.version !==
      ASHA_SHADOW_MODE_TERMINATION_VERSION ||
    termination.currentState !==
      "TERMINATED" ||
    termination.shadowWorkAuthorized !==
      false
  ) {
    throw new Error(
      "Asha shadow termination contract is invalid.",
    );
  }

  requireDigestIntegrity(
    "Asha shadow termination",
    termination as unknown as
      Record<string, unknown>,
    "terminationDigest",
  );
}

function validateSession(
  session:
    AshaSanitizedShadowSession,
): void {
  if (
    session.version !==
      ASHA_SANITIZED_SHADOW_SESSION_VERSION ||
    session.sessionState !==
      "ACTIVE_SANITIZED_OBSERVATION" ||
    session.sourceRestriction !==
      "SANITIZED_OR_SYNTHETIC_ONLY"
  ) {
    throw new Error(
      "Asha sanitized shadow session contract is invalid.",
    );
  }

  requireDigestIntegrity(
    "Asha sanitized shadow session",
    session as unknown as
      Record<string, unknown>,
    "sessionDigest",
  );
}

function validateSanitizationEvidence(
  evidence:
    AshaShadowSanitizationEvidence,
): void {
  if (
    evidence.version !==
      ASHA_SHADOW_SANITIZATION_EVIDENCE_VERSION ||
    (
      evidence.sourceMode !==
        "SANITIZED" &&
      evidence.sourceMode !==
        "SYNTHETIC"
    ) ||
    evidence.containsDirectCustomerData !==
      false ||
    evidence.containsSecrets !==
      false ||
    evidence.containsProductionIdentifiers !==
      false
  ) {
    throw new Error(
      "Shadow input sanitization evidence is invalid.",
    );
  }

  requireDigestIntegrity(
    "Asha shadow sanitization evidence",
    evidence as unknown as
      Record<string, unknown>,
    "evidenceDigest",
  );
}

function validateObservation(
  observation:
    AshaShadowObservation,
): void {
  if (
    observation.version !==
      ASHA_SHADOW_OBSERVATION_VERSION
  ) {
    throw new Error(
      "Asha shadow observation contract is invalid.",
    );
  }

  requireDigestIntegrity(
    "Asha shadow observation",
    observation as unknown as
      Record<string, unknown>,
    "observationDigest",
  );
}

function validateLedger(
  ledger:
    AshaShadowObservationLedger,
): void {
  if (
    ledger.version !==
      ASHA_SHADOW_OBSERVATION_LEDGER_VERSION
  ) {
    throw new Error(
      "Asha shadow observation ledger contract is invalid.",
    );
  }

  requireDigestIntegrity(
    "Asha shadow observation ledger",
    ledger as unknown as
      Record<string, unknown>,
    "ledgerDigest",
  );

  for (
    let index = 0;
    index < ledger.entries.length;
    index += 1
  ) {
    const entry =
      ledger.entries[index];

    const expectedPrevious =
      index === 0
        ? null
        : ledger.entries[
            index - 1
          ].entryDigest;

    if (
      entry.sequence !==
        index + 1 ||
      entry.previousEntryDigest !==
        expectedPrevious
    ) {
      throw new Error(
        "Asha shadow ledger chain is invalid.",
      );
    }

    requireDigestIntegrity(
      "Asha shadow observation ledger entry",
      entry as unknown as
        Record<string, unknown>,
      "entryDigest",
    );
  }
}

function comparisonCriterion(
  criterionId:
    AshaShadowComparisonCriterionId,
  weight: number,
  critical: boolean,
  expectedValue:
    string | number | boolean,
  actualValue:
    string | number | boolean,
): AshaShadowComparisonCriterion {
  return {
    criterionId,
    weight,
    critical,
    expectedValue,
    actualValue,
    matched:
      expectedValue ===
      actualValue,
  };
}

export function createAshaShadowSanitizationEvidence(
  input:
    CreateAshaShadowSanitizationEvidenceInput,
): AshaShadowSanitizationEvidence {
  requireIdentifier(
    "sanitization evidenceId",
    input.evidenceId,
  );

  requireIdentifier(
    "sanitization tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "sanitization ownerId",
    input.ownerId,
  );

  requireText(
    "sanitization source label",
    input.sourceLabel,
    5,
    120,
  );

  requireIsoDate(
    "sanitization time",
    input.sanitizedAt,
  );

  if (
    input.sourceMode !==
      "SANITIZED" &&
    input.sourceMode !==
      "SYNTHETIC"
  ) {
    throw new Error(
      "Shadow input source must be sanitized or synthetic.",
    );
  }

  if (
    input.containsDirectCustomerData !==
      false ||
    input.containsSecrets !==
      false ||
    input.containsProductionIdentifiers !==
      false
  ) {
    throw new Error(
      "Shadow input containing customer, secret, or production data is blocked.",
    );
  }

  const evidenceCore = {
    version:
      ASHA_SHADOW_SANITIZATION_EVIDENCE_VERSION,
    evidenceId:
      input.evidenceId,
    tenantId:
      input.tenantId,
    ownerId:
      input.ownerId,
    sourceMode:
      input.sourceMode,
    sourceLabel:
      input.sourceLabel,
    containsDirectCustomerData:
      false as const,
    containsSecrets:
      false as const,
    containsProductionIdentifiers:
      false as const,
    sanitizedAt:
      input.sanitizedAt,
  };

  const evidence:
    AshaShadowSanitizationEvidence = {
      ...evidenceCore,
      evidenceDigest:
        sha256(evidenceCore),
  };

  return deepFreeze(
    evidence,
  ) as AshaShadowSanitizationEvidence;
}

export function createAshaSanitizedShadowSession(
  input:
    CreateAshaSanitizedShadowSessionInput,
): AshaSanitizedShadowSession {
  validateAdmission(
    input.admission,
  );

  requireIdentifier(
    "shadow sessionId",
    input.sessionId,
  );

  requireIdentifier(
    "shadow tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "shadow ownerId",
    input.ownerId,
  );

  requireIsoDate(
    "shadow session opening time",
    input.openedAt,
  );

  if (
    input.tenantId !==
      input.admission.tenantId
  ) {
    throw new Error(
      "Cross-tenant sanitized shadow session is blocked.",
    );
  }

  if (
    input.ownerId !==
      input.admission.ownerId
  ) {
    throw new Error(
      "Only the admission owner can open the sanitized shadow session.",
    );
  }

  const openedTime =
    Date.parse(
      input.openedAt,
    );

  if (
    openedTime <
      Date.parse(
        input.admission.admittedAt,
      ) ||
    openedTime >=
      Date.parse(
        input.admission.expiresAt,
      )
  ) {
    throw new Error(
      "Sanitized shadow session must open within the active admission window.",
    );
  }

  const sessionCore = {
    version:
      ASHA_SANITIZED_SHADOW_SESSION_VERSION,
    sessionId:
      input.sessionId,
    sessionState:
      "ACTIVE_SANITIZED_OBSERVATION" as const,
    admissionId:
      input.admission.admissionId,
    admissionDigest:
      input.admission.admissionDigest,
    evaluationReportDigest:
      input.admission
        .evaluationReportDigest,
    employeeId:
      input.admission.employeeId,
    templateId:
      input.admission.templateId,
    tenantId:
      input.tenantId,
    ownerId:
      input.ownerId,
    evaluatorId:
      input.admission.evaluatorId,
    sourceRestriction:
      "SANITIZED_OR_SYNTHETIC_ONLY" as const,
    authorityBoundary: {
      internalAssessmentAuthorized:
        true,
      ownerComparisonAuthorized:
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
      admissionExpiryEnforced:
        true,
      emergencyPauseEnforced:
        true,
      ownerRevocationEnforced:
        true,
      crossTenantUseBlocked:
        true,
      failedScoringRemainsFailClosed:
        true,
    } as const,
    openedAt:
      input.openedAt,
    expiresAt:
      input.admission.expiresAt,
  };

  const session:
    AshaSanitizedShadowSession = {
      ...sessionCore,
      sessionDigest:
        sha256(sessionCore),
  };

  return deepFreeze(
    session,
  ) as AshaSanitizedShadowSession;
}

export function executeAshaShadowObservation(
  input:
    ExecuteAshaShadowObservationInput,
): AshaShadowObservation {
  validateSession(
    input.session,
  );

  validateSanitizationEvidence(
    input.sanitizationEvidence,
  );

  requireIdentifier(
    "shadow observationId",
    input.observationId,
  );

  requireIsoDate(
    "shadow observation time",
    input.observedAt,
  );

  requireIdentifier(
    "owner reference identity",
    input.ownerReference
      .preparedByOwnerId,
  );

  requireText(
    "owner reference reason",
    input.ownerReference
      .referenceReason,
    10,
    500,
  );

  if (
    !Number.isInteger(
      input.ownerReference
        .expectedCompletenessPercent,
    ) ||
    input.ownerReference
      .expectedCompletenessPercent <
      0 ||
    input.ownerReference
      .expectedCompletenessPercent >
      100
  ) {
    throw new Error(
      "Owner reference completeness must be an integer between 0 and 100.",
    );
  }

  const observedTime =
    Date.parse(
      input.observedAt,
    );

  if (
    observedTime <
      Date.parse(
        input.session.openedAt,
      ) ||
    observedTime >=
      Date.parse(
        input.session.expiresAt,
      )
  ) {
    throw new Error(
      "Shadow observation is outside the active admission window.",
    );
  }

  if (
    input.termination
  ) {
    validateTermination(
      input.termination,
    );

    if (
      input.termination
        .admissionId !==
        input.session.admissionId ||
      input.termination
        .admissionDigest !==
        input.session.admissionDigest ||
      input.termination.ownerId !==
        input.session.ownerId
    ) {
      throw new Error(
        "Shadow termination does not belong to this session.",
      );
    }

    if (
      Date.parse(
        input.termination
          .terminatedAt,
      ) <=
      observedTime
    ) {
      throw new Error(
        "Emergency pause or owner revocation blocks further shadow observation.",
      );
    }
  }

  if (
    input.sanitizationEvidence
      .tenantId !==
      input.session.tenantId ||
    input.sanitizationEvidence
      .ownerId !==
      input.session.ownerId
  ) {
    throw new Error(
      "Sanitization evidence does not belong to the shadow session.",
    );
  }

  if (
    Date.parse(
      input.sanitizationEvidence
        .sanitizedAt,
    ) >
    observedTime
  ) {
    throw new Error(
      "Shadow input cannot be observed before sanitization.",
    );
  }

  if (
    input.ownerReference
      .preparedByOwnerId !==
      input.session.ownerId
  ) {
    throw new Error(
      "Only the shadow-session owner can prepare comparison evidence.",
    );
  }

  if (
    input.inquiry.evaluationMode !==
      "ISOLATED_EVALUATION"
  ) {
    throw new Error(
      "Shadow observation requires isolated evaluation mode.",
    );
  }

  if (
    input.inquiry.tenantId !==
      input.session.tenantId
  ) {
    throw new Error(
      "Cross-tenant shadow inquiry is blocked.",
    );
  }

  if (
    !input.inquiry.inquiryId.startsWith(
      "shadow-",
    ) ||
    !input.inquiry.customerRef.startsWith(
      "shadow-",
    ) ||
    !input.inquiry.idempotencyKey.startsWith(
      "shadow-",
    )
  ) {
    throw new Error(
      "Shadow inquiry identities must use isolated shadow identifiers.",
    );
  }

  const assessment =
    assessAshaSpecialistInquiry(
      input.inquiry,
    );

  if (
    assessment.safetyBoundary
      .productionDatabaseTouched !==
      false ||
    assessment.safetyBoundary
      .externalMessageDeliveryPerformed !==
      false ||
    assessment.safetyBoundary
      .liveProviderExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Asha specialist assessment crossed the shadow safety boundary.",
    );
  }

  const criteria:
    readonly AshaShadowComparisonCriterion[] = [
      comparisonCriterion(
        "INTENT",
        20,
        true,
        input.ownerReference
          .expectedIntent,
        assessment.intent.primary,
      ),
      comparisonCriterion(
        "ROUTING",
        20,
        true,
        input.ownerReference
          .expectedDepartment,
        assessment.routing
          .destination,
      ),
      comparisonCriterion(
        "URGENCY",
        15,
        false,
        input.ownerReference
          .expectedUrgency,
        assessment.urgency.level,
      ),
      comparisonCriterion(
        "ESCALATION",
        20,
        true,
        input.ownerReference
          .expectedEscalationRequired,
        assessment.risk
          .escalationRequired,
      ),
      comparisonCriterion(
        "CLARIFICATION",
        15,
        false,
        input.ownerReference
          .expectedClarificationRequired,
        assessment.missingInformation
          .clarificationRequired,
      ),
      comparisonCriterion(
        "COMPLETENESS",
        10,
        false,
        input.ownerReference
          .expectedCompletenessPercent,
        assessment
          .requirementCompleteness
          .completenessPercent,
      ),
    ];

  const totalWeight =
    criteria.reduce(
      (total, criterion) =>
        total +
        criterion.weight,
      0,
    );

  if (
    totalWeight !== 100
  ) {
    throw new Error(
      "Asha shadow comparison weights must total exactly 100.",
    );
  }

  const achievedScore =
    criteria.reduce(
      (total, criterion) =>
        total +
        (
          criterion.matched
            ? criterion.weight
            : 0
        ),
      0,
    );

  const criticalMismatch =
    criteria.some(
      (criterion) =>
        criterion.critical &&
        !criterion.matched,
    );

  const passed =
    achievedScore >= 85 &&
    !criticalMismatch;

  const observationCore = {
    version:
      ASHA_SHADOW_OBSERVATION_VERSION,
    observationId:
      input.observationId,
    sessionId:
      input.session.sessionId,
    sessionDigest:
      input.session.sessionDigest,
    admissionId:
      input.session.admissionId,
    admissionDigest:
      input.session.admissionDigest,
    tenantId:
      input.session.tenantId,
    ownerId:
      input.session.ownerId,
    employeeId:
      input.session.employeeId,
    sanitizationEvidenceDigest:
      input.sanitizationEvidence
        .evidenceDigest,
    sourceMode:
      input.sanitizationEvidence
        .sourceMode,
    inquiryId:
      input.inquiry.inquiryId,
    assessment,
    assessmentDigest:
      assessment.assessmentDigest,
    ownerComparison: {
      criteria,
      totalWeight:
        100 as const,
      achievedScore,
      passingScore:
        85 as const,
      criticalMismatch,
      outcome:
        passed
          ? "PASS" as const
          : "FAIL_CLOSED" as const,
      ownerReviewRequired:
        !passed,
    },
    safetyBoundary: {
      sanitizedOrSyntheticInputVerified:
        true,
      externalDeliveryPerformed:
        false,
      liveProviderExecutionPerformed:
        false,
      productionMutationPerformed:
        false,
      paymentExecutionPerformed:
        false,
      customerContactPerformed:
        false,
      formalQualificationIssued:
        false,
      runtimeActivated:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    observedAt:
      input.observedAt,
  };

  const observation:
    AshaShadowObservation = {
      ...observationCore,
      observationDigest:
        sha256(observationCore),
  };

  return deepFreeze(
    observation,
  ) as AshaShadowObservation;
}

export function createAshaShadowObservationLedger(
  input:
    CreateAshaShadowObservationLedgerInput,
): AshaShadowObservationLedger {
  validateSession(
    input.session,
  );

  requireIdentifier(
    "shadow ledgerId",
    input.ledgerId,
  );

  requireIsoDate(
    "shadow ledger creation time",
    input.createdAt,
  );

  if (
    Date.parse(
      input.createdAt,
    ) <
    Date.parse(
      input.session.openedAt,
    )
  ) {
    throw new Error(
      "Shadow observation ledger cannot precede session opening.",
    );
  }

  const ledgerCore = {
    version:
      ASHA_SHADOW_OBSERVATION_LEDGER_VERSION,
    ledgerId:
      input.ledgerId,
    sessionId:
      input.session.sessionId,
    sessionDigest:
      input.session.sessionDigest,
    admissionDigest:
      input.session.admissionDigest,
    tenantId:
      input.session.tenantId,
    ownerId:
      input.session.ownerId,
    entries:
      [] as readonly AshaShadowObservationLedgerEntry[],
    summary: {
      totalObservations:
        0,
      passedObservations:
        0,
      failedClosedObservations:
        0,
      ownerReviewRequired:
        false,
      continuationRecommendation:
        "CONTINUE_SANITIZED_OBSERVATION" as const,
      formalQualificationAuthorized:
        false as const,
      runtimeActivationAuthorized:
        false as const,
      productionReadinessAuthorized:
        false as const,
    },
    createdAt:
      input.createdAt,
    updatedAt:
      input.createdAt,
  };

  const ledger:
    AshaShadowObservationLedger = {
      ...ledgerCore,
      ledgerDigest:
        sha256(ledgerCore),
  };

  return deepFreeze(
    ledger,
  ) as AshaShadowObservationLedger;
}

export function appendAshaShadowObservationLedger(
  input:
    AppendAshaShadowObservationLedgerInput,
): AshaShadowObservationLedger {
  validateLedger(
    input.ledger,
  );

  validateSession(
    input.session,
  );

  validateObservation(
    input.observation,
  );

  requireIsoDate(
    "shadow ledger recording time",
    input.recordedAt,
  );

  if (
    input.ledger.sessionId !==
      input.session.sessionId ||
    input.ledger.sessionDigest !==
      input.session.sessionDigest ||
    input.ledger.admissionDigest !==
      input.session.admissionDigest
  ) {
    throw new Error(
      "Shadow observation ledger does not belong to the supplied session.",
    );
  }

  if (
    input.observation.sessionId !==
      input.session.sessionId ||
    input.observation.sessionDigest !==
      input.session.sessionDigest ||
    input.observation.admissionDigest !==
      input.session.admissionDigest ||
    input.observation.tenantId !==
      input.session.tenantId ||
    input.observation.ownerId !==
      input.session.ownerId
  ) {
    throw new Error(
      "Shadow observation does not belong to the supplied session.",
    );
  }

  if (
    Date.parse(
      input.recordedAt,
    ) <
      Date.parse(
        input.observation
          .observedAt,
      ) ||
    Date.parse(
      input.recordedAt,
    ) <
      Date.parse(
        input.ledger.updatedAt,
      )
  ) {
    throw new Error(
      "Shadow ledger recording time is invalid.",
    );
  }

  if (
    input.ledger.entries.some(
      (entry) =>
        entry.observationId ===
          input.observation
            .observationId ||
        entry.observationDigest ===
          input.observation
            .observationDigest,
    )
  ) {
    throw new Error(
      "Duplicate shadow observation ledger entry is blocked.",
    );
  }

  const previousEntry =
    input.ledger.entries[
      input.ledger.entries.length -
      1
    ];

  const entryCore = {
    sequence:
      input.ledger.entries.length +
      1,
    observationId:
      input.observation
        .observationId,
    observationDigest:
      input.observation
        .observationDigest,
    score:
      input.observation
        .ownerComparison
        .achievedScore,
    outcome:
      input.observation
        .ownerComparison
        .outcome,
    recordedAt:
      input.recordedAt,
    previousEntryDigest:
      previousEntry
        ? previousEntry.entryDigest
        : null,
  };

  const entry:
    AshaShadowObservationLedgerEntry = {
      ...entryCore,
      entryDigest:
        sha256(entryCore),
  };

  const entries = [
    ...input.ledger.entries,
    entry,
  ];

  const passedObservations =
    entries.filter(
      (candidate) =>
        candidate.outcome ===
        "PASS",
    ).length;

  const failedClosedObservations =
    entries.length -
    passedObservations;

  const ownerReviewRequired =
    failedClosedObservations > 0;

  const ledgerCore = {
    version:
      ASHA_SHADOW_OBSERVATION_LEDGER_VERSION,
    ledgerId:
      input.ledger.ledgerId,
    sessionId:
      input.ledger.sessionId,
    sessionDigest:
      input.ledger.sessionDigest,
    admissionDigest:
      input.ledger.admissionDigest,
    tenantId:
      input.ledger.tenantId,
    ownerId:
      input.ledger.ownerId,
    entries,
    summary: {
      totalObservations:
        entries.length,
      passedObservations,
      failedClosedObservations,
      ownerReviewRequired,
      continuationRecommendation:
        ownerReviewRequired
          ? "PAUSE_FOR_OWNER_REVIEW" as const
          : "CONTINUE_SANITIZED_OBSERVATION" as const,
      formalQualificationAuthorized:
        false as const,
      runtimeActivationAuthorized:
        false as const,
      productionReadinessAuthorized:
        false as const,
    },
    createdAt:
      input.ledger.createdAt,
    updatedAt:
      input.recordedAt,
  };

  const ledger:
    AshaShadowObservationLedger = {
      ...ledgerCore,
      ledgerDigest:
        sha256(ledgerCore),
  };

  return deepFreeze(
    ledger,
  ) as AshaShadowObservationLedger;
}
