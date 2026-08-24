import { createHash } from "node:crypto";

export const CONSTITUTIONAL_TRUST_CONTEXT_LIFECYCLE_AUDIT_SCHEMA_VERSION =
  "NEXUS_CONSTITUTIONAL_TRUST_CONTEXT_LIFECYCLE_AUDIT_V1" as const;

export type ConstitutionalTrustContextLifecycleEvent =
  | "ACTIVATED"
  | "ROTATED"
  | "DISABLED"
  | "REVOKED"
  | "RETIRED"
  | "LOAD_FAILED"
  | "CORRUPTION_DETECTED"
  | "STALE_STATE_DETECTED"
  | "AMBIGUOUS_STATE_DETECTED";

export interface ConstitutionalTrustContextLifecycleAuditInput {
  lifecycleId: string;
  eventId: string;
  sequence: number;
  event: ConstitutionalTrustContextLifecycleEvent;
  trustContextDigest: string;
  previousRecordDigest: string | null;
  observedAt: string;
  reason: string;
}

export interface ConstitutionalTrustContextLifecycleAuditRecord
  extends ConstitutionalTrustContextLifecycleAuditInput {
  schemaVersion:
    typeof CONSTITUTIONAL_TRUST_CONTEXT_LIFECYCLE_AUDIT_SCHEMA_VERSION;
  trustedTimeEstablished: false;
  productionTrustEstablished: false;
  runtimeIntegrationAuthorized: false;
  constitutionalExecutionAuthorityGranted: false;
  recordDigest: string;
}

export interface ConstitutionalTrustContextLifecycleAuditVerification {
  valid: boolean;
  failureCodes: readonly string[];
  trustedTimeEstablished: false;
  productionTrustEstablished: false;
  runtimeIntegrationAuthorized: false;
  constitutionalExecutionAuthorityGranted: false;
}

const allowedEvents =
  new Set<ConstitutionalTrustContextLifecycleEvent>([
    "ACTIVATED",
    "ROTATED",
    "DISABLED",
    "REVOKED",
    "RETIRED",
    "LOAD_FAILED",
    "CORRUPTION_DETECTED",
    "STALE_STATE_DETECTED",
    "AMBIGUOUS_STATE_DETECTED",
  ]);

function requireNonEmpty(
  value: string,
  fieldName: string,
): string {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${fieldName} must be non-empty.`,
    );
  }

  return value.trim();
}

function requireDigest(
  value: string,
  fieldName: string,
): string {
  const normalized =
    requireNonEmpty(value, fieldName).toLowerCase();

  if (!/^[a-f0-9]{64}$/.test(normalized)) {
    throw new Error(
      `${fieldName} must be a SHA-256 hex digest.`,
    );
  }

  return normalized;
}

function requireObservedAt(
  value: string,
): string {
  const normalized =
    requireNonEmpty(value, "observedAt");

  if (!Number.isFinite(Date.parse(normalized))) {
    throw new Error(
      "observedAt must be a structurally valid timestamp.",
    );
  }

  return normalized;
}

function canonicalPayload(
  input: Omit<
    ConstitutionalTrustContextLifecycleAuditRecord,
    "recordDigest"
  >,
): string {
  return JSON.stringify([
    input.schemaVersion,
    input.lifecycleId,
    input.eventId,
    input.sequence,
    input.event,
    input.trustContextDigest,
    input.previousRecordDigest,
    input.observedAt,
    input.reason,
    input.trustedTimeEstablished,
    input.productionTrustEstablished,
    input.runtimeIntegrationAuthorized,
    input.constitutionalExecutionAuthorityGranted,
  ]);
}

function digestPayload(
  payload: string,
): string {
  return createHash("sha256")
    .update(payload, "utf8")
    .digest("hex");
}

export function createConstitutionalTrustContextLifecycleAuditRecord(
  input: ConstitutionalTrustContextLifecycleAuditInput,
): Readonly<ConstitutionalTrustContextLifecycleAuditRecord> {
  if (
    !Number.isSafeInteger(input.sequence) ||
    input.sequence < 1
  ) {
    throw new Error(
      "sequence must be a positive safe integer.",
    );
  }

  if (!allowedEvents.has(input.event)) {
    throw new Error(
      "Lifecycle event is invalid.",
    );
  }

  const previousRecordDigest =
    input.previousRecordDigest === null
      ? null
      : requireDigest(
          input.previousRecordDigest,
          "previousRecordDigest",
        );

  if (
    input.sequence === 1 &&
    previousRecordDigest !== null
  ) {
    throw new Error(
      "Initial lifecycle audit record must not have a previous digest.",
    );
  }

  if (
    input.sequence > 1 &&
    previousRecordDigest === null
  ) {
    throw new Error(
      "Non-initial lifecycle audit record requires a previous digest.",
    );
  }

  const unsigned = Object.freeze({
    schemaVersion:
      CONSTITUTIONAL_TRUST_CONTEXT_LIFECYCLE_AUDIT_SCHEMA_VERSION,
    lifecycleId:
      requireNonEmpty(
        input.lifecycleId,
        "lifecycleId",
      ),
    eventId:
      requireNonEmpty(
        input.eventId,
        "eventId",
      ),
    sequence: input.sequence,
    event: input.event,
    trustContextDigest:
      requireDigest(
        input.trustContextDigest,
        "trustContextDigest",
      ),
    previousRecordDigest,
    observedAt:
      requireObservedAt(input.observedAt),
    reason:
      requireNonEmpty(
        input.reason,
        "reason",
      ),
    trustedTimeEstablished: false as const,
    productionTrustEstablished: false as const,
    runtimeIntegrationAuthorized: false as const,
    constitutionalExecutionAuthorityGranted:
      false as const,
  });

  return Object.freeze({
    ...unsigned,
    recordDigest:
      digestPayload(
        canonicalPayload(unsigned),
      ),
  });
}

export function verifyConstitutionalTrustContextLifecycleAuditRecord(
  record: ConstitutionalTrustContextLifecycleAuditRecord,
  expectedPreviousRecordDigest:
    | string
    | null,
): ConstitutionalTrustContextLifecycleAuditVerification {
  const failureCodes: string[] = [];

  if (
    record.schemaVersion !==
    CONSTITUTIONAL_TRUST_CONTEXT_LIFECYCLE_AUDIT_SCHEMA_VERSION
  ) {
    failureCodes.push(
      "TRUST_LIFECYCLE_AUDIT_SCHEMA_INVALID",
    );
  }

  if (
    record.trustedTimeEstablished !== false ||
    record.productionTrustEstablished !== false ||
    record.runtimeIntegrationAuthorized !== false ||
    record.constitutionalExecutionAuthorityGranted !== false
  ) {
    failureCodes.push(
      "TRUST_LIFECYCLE_AUDIT_AUTHORITY_ESCALATION",
    );
  }

  const expectedPrevious =
    expectedPreviousRecordDigest === null
      ? null
      : expectedPreviousRecordDigest
          .trim()
          .toLowerCase();

  if (
    record.previousRecordDigest !==
    expectedPrevious
  ) {
    failureCodes.push(
      "TRUST_LIFECYCLE_AUDIT_CHAIN_MISMATCH",
    );
  }

  try {
    const expectedDigest =
      digestPayload(
        canonicalPayload({
          schemaVersion: record.schemaVersion,
          lifecycleId: record.lifecycleId,
          eventId: record.eventId,
          sequence: record.sequence,
          event: record.event,
          trustContextDigest:
            record.trustContextDigest,
          previousRecordDigest:
            record.previousRecordDigest,
          observedAt: record.observedAt,
          reason: record.reason,
          trustedTimeEstablished:
            record.trustedTimeEstablished,
          productionTrustEstablished:
            record.productionTrustEstablished,
          runtimeIntegrationAuthorized:
            record.runtimeIntegrationAuthorized,
          constitutionalExecutionAuthorityGranted:
            record.constitutionalExecutionAuthorityGranted,
        }),
      );

    if (expectedDigest !== record.recordDigest) {
      failureCodes.push(
        "TRUST_LIFECYCLE_AUDIT_DIGEST_MISMATCH",
      );
    }
  } catch {
    failureCodes.push(
      "TRUST_LIFECYCLE_AUDIT_STRUCTURAL_INVALID",
    );
  }

  return Object.freeze({
    valid: failureCodes.length === 0,
    failureCodes: Object.freeze([
      ...failureCodes,
    ]),
    trustedTimeEstablished: false,
    productionTrustEstablished: false,
    runtimeIntegrationAuthorized: false,
    constitutionalExecutionAuthorityGranted:
      false,
  });
}