import {
  createHash,
} from "node:crypto";

import type {
  AshaSanitizedShadowSession,
  AshaShadowObservationLedger,
  AshaShadowObservationLedgerEntry,
} from "./ashaSanitizedShadowObservation";

export const ASHA_SHADOW_QUALIFICATION_READINESS_VERSION =
  "nexus-asha-shadow-qualification-readiness-v1" as const;

export const ASHA_SHADOW_QUALIFICATION_READINESS_STATES = [
  "READY_FOR_OWNER_QUALIFICATION_REVIEW",
  "BLOCKED",
] as const;

export type AshaShadowQualificationReadinessState =
  (typeof ASHA_SHADOW_QUALIFICATION_READINESS_STATES)[number];

export const ASHA_SHADOW_QUALIFICATION_READINESS_REASONS = [
  "READY_FOR_OWNER_QUALIFICATION_REVIEW",
  "NO_SHADOW_OBSERVATIONS",
  "FAILED_CLOSED_OBSERVATIONS_PRESENT",
  "OWNER_REVIEW_REQUIRED",
  "SHADOW_CONTINUATION_PAUSED",
] as const;

export type AshaShadowQualificationReadinessReason =
  (typeof ASHA_SHADOW_QUALIFICATION_READINESS_REASONS)[number];

export interface CreateAshaShadowQualificationReadinessInput {
  readonly readinessId: string;
  readonly session: AshaSanitizedShadowSession;
  readonly ledger: AshaShadowObservationLedger;
  readonly reviewedAt: string;
}

export interface AshaShadowQualificationObservationEvidence {
  readonly sequence: number;
  readonly observationId: string;
  readonly observationDigest: string;
  readonly score: number;
  readonly outcome:
    AshaShadowObservationLedgerEntry["outcome"];
  readonly recordedAt: string;
  readonly entryDigest: string;
}

export interface AshaShadowQualificationReadinessEvidence {
  readonly version:
    typeof ASHA_SHADOW_QUALIFICATION_READINESS_VERSION;
  readonly readinessId: string;
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly admissionDigest: string;
  readonly evaluationReportDigest: string;
  readonly sessionId: string;
  readonly sessionDigest: string;
  readonly ledgerId: string;
  readonly ledgerDigest: string;
  readonly observationEvidence:
    readonly AshaShadowQualificationObservationEvidence[];
  readonly summary: Readonly<{
    totalObservations: number;
    passedObservations: number;
    failedClosedObservations: number;
    ownerReviewRequired: boolean;
  }>;
  readonly readinessState:
    AshaShadowQualificationReadinessState;
  readonly readinessReason:
    AshaShadowQualificationReadinessReason;
  readonly ownerQualificationReviewEligible: boolean;
  readonly nextStep:
    | "OWNER_REVIEW_BEFORE_FORMAL_QUALIFICATION_TESTING"
    | "CONTINUE_OR_REMEDIATE_SANITIZED_SHADOW_OBSERVATION";
  readonly authorityBoundary: Readonly<{
    shadowEvidenceOnly: true;
    ownerReviewRequiredBeforeQualificationTesting: true;
    qualificationEngineInvoked: false;
    formalQualificationTestCasesCreated: false;
    formalQualificationAuthorized: false;
    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    runtimeActivationAuthorized: false;
    productionReadinessAuthorized: false;
    customerDataAccessAuthorized: false;
    customerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly reviewedAt: string;
  readonly readinessDigest: string;
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
      "Unsupported deterministic readiness value.",
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
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a safe identifier.",
    );
  }
}

function requireSha256(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a SHA-256 digest.",
    );
  }
}

function requireIsoDate(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      label +
        " must be a valid ISO timestamp.",
    );
  }
}

function validateSessionBoundary(
  session: AshaSanitizedShadowSession,
): void {
  requireIdentifier(
    "shadow sessionId",
    session.sessionId,
  );

  requireIdentifier(
    "shadow admissionId",
    session.admissionId,
  );

  requireIdentifier(
    "shadow employeeId",
    session.employeeId,
  );

  requireIdentifier(
    "shadow templateId",
    session.templateId,
  );

  requireIdentifier(
    "shadow tenantId",
    session.tenantId,
  );

  requireIdentifier(
    "shadow ownerId",
    session.ownerId,
  );

  requireIdentifier(
    "shadow evaluatorId",
    session.evaluatorId,
  );

  requireSha256(
    "shadow session digest",
    session.sessionDigest,
  );

  requireSha256(
    "shadow admission digest",
    session.admissionDigest,
  );

  requireSha256(
    "shadow evaluation report digest",
    session.evaluationReportDigest,
  );

  requireIsoDate(
    "shadow session openedAt",
    session.openedAt,
  );

  requireIsoDate(
    "shadow session expiresAt",
    session.expiresAt,
  );

  if (
    session.sessionState !==
      "ACTIVE_SANITIZED_OBSERVATION" ||
    session.sourceRestriction !==
      "SANITIZED_OR_SYNTHETIC_ONLY"
  ) {
    throw new Error(
      "Qualification readiness requires an active sanitized shadow session.",
    );
  }

  if (
    session.authorityBoundary
      .customerDataAccessAuthorized !== false ||
    session.authorityBoundary
      .customerContactAuthorized !== false ||
    session.authorityBoundary
      .externalDeliveryAuthorized !== false ||
    session.authorityBoundary
      .liveProviderExecutionAuthorized !== false ||
    session.authorityBoundary
      .productionMutationAuthorized !== false ||
    session.authorityBoundary
      .paymentExecutionAuthorized !== false ||
    session.authorityBoundary
      .autonomousDecisionAuthorized !== false ||
    session.authorityBoundary
      .formalQualificationAuthorized !== false ||
    session.authorityBoundary
      .runtimeActivationAuthorized !== false ||
    session.authorityBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Shadow session authority exceeds the readiness evidence boundary.",
    );
  }
}

function validateEntry(
  entry: AshaShadowObservationLedgerEntry,
  expectedSequence: number,
  expectedPreviousDigest: string | null,
): void {
  if (
    entry.sequence !== expectedSequence
  ) {
    throw new Error(
      "Shadow observation ledger sequence is invalid.",
    );
  }

  requireIdentifier(
    "shadow observationId",
    entry.observationId,
  );

  requireSha256(
    "shadow observation digest",
    entry.observationDigest,
  );

  requireSha256(
    "shadow entry digest",
    entry.entryDigest,
  );

  requireIsoDate(
    "shadow entry recordedAt",
    entry.recordedAt,
  );

  if (
    !Number.isFinite(entry.score) ||
    entry.score < 0 ||
    entry.score > 100
  ) {
    throw new Error(
      "Shadow observation score must be between 0 and 100.",
    );
  }

  if (
    entry.outcome !== "PASS" &&
    entry.outcome !== "FAIL_CLOSED"
  ) {
    throw new Error(
      "Shadow observation outcome is invalid.",
    );
  }

  if (
    entry.previousEntryDigest !==
      expectedPreviousDigest
  ) {
    throw new Error(
      "Shadow observation ledger chain is invalid.",
    );
  }

  const entryCore = {
    sequence:
      entry.sequence,
    observationId:
      entry.observationId,
    observationDigest:
      entry.observationDigest,
    score:
      entry.score,
    outcome:
      entry.outcome,
    recordedAt:
      entry.recordedAt,
    previousEntryDigest:
      entry.previousEntryDigest,
  };

  if (
    sha256(entryCore) !==
      entry.entryDigest
  ) {
    throw new Error(
      "Shadow observation ledger entry digest is invalid.",
    );
  }
}

function validateLedger(
  session: AshaSanitizedShadowSession,
  ledger: AshaShadowObservationLedger,
): void {
  requireIdentifier(
    "shadow ledgerId",
    ledger.ledgerId,
  );

  requireIdentifier(
    "shadow ledger sessionId",
    ledger.sessionId,
  );

  requireIdentifier(
    "shadow ledger tenantId",
    ledger.tenantId,
  );

  requireIdentifier(
    "shadow ledger ownerId",
    ledger.ownerId,
  );

  requireSha256(
    "shadow ledger session digest",
    ledger.sessionDigest,
  );

  requireSha256(
    "shadow ledger admission digest",
    ledger.admissionDigest,
  );

  requireSha256(
    "shadow ledger digest",
    ledger.ledgerDigest,
  );

  requireIsoDate(
    "shadow ledger createdAt",
    ledger.createdAt,
  );

  requireIsoDate(
    "shadow ledger updatedAt",
    ledger.updatedAt,
  );

  if (
    ledger.sessionId !==
      session.sessionId ||
    ledger.sessionDigest !==
      session.sessionDigest ||
    ledger.admissionDigest !==
      session.admissionDigest ||
    ledger.tenantId !==
      session.tenantId ||
    ledger.ownerId !==
      session.ownerId
  ) {
    throw new Error(
      "Shadow observation ledger does not belong to the supplied session.",
    );
  }

  let previousDigest:
    string | null = null;

  for (
    let index = 0;
    index < ledger.entries.length;
    index++
  ) {
    const entry =
      ledger.entries[index];

    validateEntry(
      entry,
      index + 1,
      previousDigest,
    );

    previousDigest =
      entry.entryDigest;
  }

  const passedObservations =
    ledger.entries.filter(
      (entry) =>
        entry.outcome === "PASS",
    ).length;

  const failedClosedObservations =
    ledger.entries.length -
    passedObservations;

  const ownerReviewRequired =
    failedClosedObservations > 0;

  const continuationRecommendation =
    ownerReviewRequired
      ? "PAUSE_FOR_OWNER_REVIEW"
      : "CONTINUE_SANITIZED_OBSERVATION";

  if (
    ledger.summary.totalObservations !==
      ledger.entries.length ||
    ledger.summary.passedObservations !==
      passedObservations ||
    ledger.summary.failedClosedObservations !==
      failedClosedObservations ||
    ledger.summary.ownerReviewRequired !==
      ownerReviewRequired ||
    ledger.summary.continuationRecommendation !==
      continuationRecommendation
  ) {
    throw new Error(
      "Shadow observation ledger summary is invalid.",
    );
  }

  if (
    ledger.summary
      .formalQualificationAuthorized !== false ||
    ledger.summary
      .runtimeActivationAuthorized !== false ||
    ledger.summary
      .productionReadinessAuthorized !== false
  ) {
    throw new Error(
      "Shadow ledger cannot authorize qualification, activation, or production readiness.",
    );
  }

  const ledgerCore = {
    version:
      ledger.version,
    ledgerId:
      ledger.ledgerId,
    sessionId:
      ledger.sessionId,
    sessionDigest:
      ledger.sessionDigest,
    admissionDigest:
      ledger.admissionDigest,
    tenantId:
      ledger.tenantId,
    ownerId:
      ledger.ownerId,
    entries:
      ledger.entries,
    summary:
      ledger.summary,
    createdAt:
      ledger.createdAt,
    updatedAt:
      ledger.updatedAt,
  };

  if (
    sha256(ledgerCore) !==
      ledger.ledgerDigest
  ) {
    throw new Error(
      "Shadow observation ledger digest is invalid.",
    );
  }
}

export function createAshaShadowQualificationReadinessEvidence(
  input:
    CreateAshaShadowQualificationReadinessInput,
): AshaShadowQualificationReadinessEvidence {
  requireIdentifier(
    "qualification readinessId",
    input.readinessId,
  );

  requireIsoDate(
    "qualification readiness review time",
    input.reviewedAt,
  );

  validateSessionBoundary(
    input.session,
  );

  validateLedger(
    input.session,
    input.ledger,
  );

  if (
    Date.parse(input.reviewedAt) <
    Date.parse(input.ledger.updatedAt)
  ) {
    throw new Error(
      "Qualification readiness review cannot precede the latest ledger evidence.",
    );
  }

  let readinessState:
    AshaShadowQualificationReadinessState;

  let readinessReason:
    AshaShadowQualificationReadinessReason;

  let ownerQualificationReviewEligible:
    boolean;

  if (
    input.ledger.summary
      .totalObservations === 0
  ) {
    readinessState =
      "BLOCKED";

    readinessReason =
      "NO_SHADOW_OBSERVATIONS";

    ownerQualificationReviewEligible =
      false;
  } else if (
    input.ledger.summary
      .failedClosedObservations > 0
  ) {
    readinessState =
      "BLOCKED";

    readinessReason =
      "FAILED_CLOSED_OBSERVATIONS_PRESENT";

    ownerQualificationReviewEligible =
      false;
  } else if (
    input.ledger.summary
      .ownerReviewRequired
  ) {
    readinessState =
      "BLOCKED";

    readinessReason =
      "OWNER_REVIEW_REQUIRED";

    ownerQualificationReviewEligible =
      false;
  } else if (
    input.ledger.summary
      .continuationRecommendation !==
      "CONTINUE_SANITIZED_OBSERVATION"
  ) {
    readinessState =
      "BLOCKED";

    readinessReason =
      "SHADOW_CONTINUATION_PAUSED";

    ownerQualificationReviewEligible =
      false;
  } else {
    readinessState =
      "READY_FOR_OWNER_QUALIFICATION_REVIEW";

    readinessReason =
      "READY_FOR_OWNER_QUALIFICATION_REVIEW";

    ownerQualificationReviewEligible =
      true;
  }

  const observationEvidence =
    input.ledger.entries.map(
      (
        entry,
      ): AshaShadowQualificationObservationEvidence => ({
        sequence:
          entry.sequence,
        observationId:
          entry.observationId,
        observationDigest:
          entry.observationDigest,
        score:
          entry.score,
        outcome:
          entry.outcome,
        recordedAt:
          entry.recordedAt,
        entryDigest:
          entry.entryDigest,
      }),
    );

  const readinessCore = {
    version:
      ASHA_SHADOW_QUALIFICATION_READINESS_VERSION,
    readinessId:
      input.readinessId,
    employeeId:
      input.session.employeeId,
    templateId:
      input.session.templateId,
    tenantId:
      input.session.tenantId,
    ownerId:
      input.session.ownerId,
    evaluatorId:
      input.session.evaluatorId,
    admissionDigest:
      input.session.admissionDigest,
    evaluationReportDigest:
      input.session.evaluationReportDigest,
    sessionId:
      input.session.sessionId,
    sessionDigest:
      input.session.sessionDigest,
    ledgerId:
      input.ledger.ledgerId,
    ledgerDigest:
      input.ledger.ledgerDigest,
    observationEvidence,
    summary: {
      totalObservations:
        input.ledger.summary
          .totalObservations,
      passedObservations:
        input.ledger.summary
          .passedObservations,
      failedClosedObservations:
        input.ledger.summary
          .failedClosedObservations,
      ownerReviewRequired:
        input.ledger.summary
          .ownerReviewRequired,
    },
    readinessState,
    readinessReason,
    ownerQualificationReviewEligible,
    nextStep:
      ownerQualificationReviewEligible
        ? "OWNER_REVIEW_BEFORE_FORMAL_QUALIFICATION_TESTING" as const
        : "CONTINUE_OR_REMEDIATE_SANITIZED_SHADOW_OBSERVATION" as const,
    authorityBoundary: {
      shadowEvidenceOnly:
        true,
      ownerReviewRequiredBeforeQualificationTesting:
        true,
      qualificationEngineInvoked:
        false,
      formalQualificationTestCasesCreated:
        false,
      formalQualificationAuthorized:
        false,
      qualifiedManifestCreated:
        false,
      activationCandidateCreated:
        false,
      runtimeActivationAuthorized:
        false,
      productionReadinessAuthorized:
        false,
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
      publicLaunchAuthorized:
        false,
    } as const,
    reviewedAt:
      input.reviewedAt,
  };

  const evidence:
    AshaShadowQualificationReadinessEvidence = {
      ...readinessCore,
      readinessDigest:
        sha256(readinessCore),
  };

  return deepFreeze(
    evidence,
  ) as AshaShadowQualificationReadinessEvidence;
}