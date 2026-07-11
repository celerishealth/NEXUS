import { createHash } from "node:crypto";

import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

import type {
  ControlledPilotAccessRepository,
} from "./authenticatedControlledPilotAccess";

export type ControlledPilotHealthStatus =
  | "HEALTHY"
  | "WARNING"
  | "BLOCKED";

export type ControlledPilotHealthReason =
  | "PILOT_SUSPENDED"
  | "EMERGENCY_STOP_ACTIVE"
  | "FAILURE_CIRCUIT_OPEN"
  | "FAILURE_THRESHOLD_APPROACHING"
  | "DAILY_BUDGET_PRESSURE"
  | "CONCURRENCY_PRESSURE";

export type ControlledPilotHealthSnapshot =
  Readonly<{
    tenantId: string;
    enrollmentId: string;
    enrollmentStatus: "ACTIVE" | "SUSPENDED";
    emergencyStop: boolean;
    circuitStatus: "CLOSED" | "OPEN";
    dailyOperationCount: number;
    dailyOperationLimit: number;
    activeOperationCount: number;
    concurrentOperationLimit: number;
    recentFailureCount: number;
    failureThreshold: number;
    updatedAt: string;
  }>;

export type ControlledPilotHealthRepository =
  Readonly<{
    findHealthSnapshot: (
      tenantId: string,
      enrollmentId: string,
    ) => Promise<ControlledPilotHealthSnapshot | null>;
  }>;

export type PilotHealthAlertPersistenceInput =
  Readonly<{
    tenantId: string;
    enrollmentId: string;
    invitationId: string;
    ownerUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    healthStatus: "WARNING" | "BLOCKED";
    reasonCodes:
      readonly ControlledPilotHealthReason[];
    stateFingerprintAlgorithm: "SHA-256";
    stateFingerprint: string;
    enrollmentStatus: "ACTIVE" | "SUSPENDED";
    emergencyStop: boolean;
    circuitStatus: "CLOSED" | "OPEN";
    dailyOperationCount: number;
    dailyOperationLimit: number;
    activeOperationCount: number;
    concurrentOperationLimit: number;
    recentFailureCount: number;
    failureThreshold: number;
    externalNotificationSent: false;
    executionTriggered: false;
    executionMode: "SANDBOX_ONLY";
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    observedAt: string;
  }>;

export type PersistedPilotHealthAlert =
  Readonly<{
    id: string;
    tenantId: string;
    enrollmentId: string;
    invitationId: string;
    ownerUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    healthStatus: "WARNING" | "BLOCKED";
    reasonCodes:
      readonly ControlledPilotHealthReason[];
    stateFingerprintAlgorithm: "SHA-256";
    stateFingerprint: string;
    enrollmentStatus: "ACTIVE" | "SUSPENDED";
    emergencyStop: boolean;
    circuitStatus: "CLOSED" | "OPEN";
    dailyOperationCount: number;
    dailyOperationLimit: number;
    activeOperationCount: number;
    concurrentOperationLimit: number;
    recentFailureCount: number;
    failureThreshold: number;
    externalNotificationSent: false;
    executionTriggered: false;
    executionMode: "SANDBOX_ONLY";
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    observedAt: string;
    createdAt: string;
  }>;

export type PilotHealthAlertPersistenceResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";
    alert: PersistedPilotHealthAlert;
  }>;

export type ControlledPilotHealthAlertRepository =
  Readonly<{
    createOrGetAlert: (
      input: PilotHealthAlertPersistenceInput,
    ) => Promise<PilotHealthAlertPersistenceResult>;
  }>;

export type ObserveAuthenticatedControlledPilotHealthInput =
  Readonly<{
    principal:
      AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    pilotAccessRepository:
      ControlledPilotAccessRepository;
    healthRepository:
      ControlledPilotHealthRepository;
    alertRepository:
      ControlledPilotHealthAlertRepository;
    requestedTenantId?: string | null;
    idempotencyKey: string;
  }>;

export type AuthenticatedControlledPilotHealthResult =
  Readonly<{
    health: Readonly<{
      tenantId: string;
      enrollmentId: string;
      status: ControlledPilotHealthStatus;
      reasonCodes:
        readonly ControlledPilotHealthReason[];
      enrollmentStatus: "ACTIVE" | "SUSPENDED";
      emergencyStop: boolean;
      circuitStatus: "CLOSED" | "OPEN";
      dailyUsagePercent: number;
      concurrencyUsagePercent: number;
      failureUsagePercent: number;
      observedAt: string;
    }>;

    alert: Readonly<{
      required: boolean;
      outcome:
        | "NOT_REQUIRED"
        | "CREATED"
        | "EXISTING";
      id: string | null;
      stateFingerprint: string;
      externalNotificationSent: false;
    }>;

    ownerAuthority: Readonly<{
      ownerUserId: string;
      sourceSessionId: string;
      role: "OWNER";
    }>;

    safetyBoundary: Readonly<{
      tenantScoped: true;
      ownerOnly: true;
      immutableFingerprint: true;
      internalAlertOnly: true;
      externalNotificationSent: false;
      executionTriggered: false;
      executionMode: "SANDBOX_ONLY";
      publicSignupAuthorized: false;
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;
  }>;

export type ControlledPilotHealthFailureCode =
  | "PILOT_HEALTH_ACCESS_REPOSITORY_MISCONFIGURED"
  | "PILOT_HEALTH_REPOSITORY_MISCONFIGURED"
  | "PILOT_HEALTH_ALERT_REPOSITORY_MISCONFIGURED"
  | "PILOT_HEALTH_IDEMPOTENCY_KEY_REQUIRED"
  | "PILOT_HEALTH_IDEMPOTENCY_KEY_INVALID"
  | "PILOT_HEALTH_ENROLLMENT_NOT_AVAILABLE"
  | "PILOT_HEALTH_ENROLLMENT_TENANT_MISMATCH"
  | "PILOT_HEALTH_ENROLLMENT_OWNER_MISMATCH"
  | "PILOT_HEALTH_ENROLLMENT_REVOKED"
  | "PILOT_HEALTH_ENROLLMENT_MODE_INVALID"
  | "PILOT_HEALTH_ENROLLMENT_BOUNDARY_INVALID"
  | "PILOT_HEALTH_SNAPSHOT_NOT_AVAILABLE"
  | "PILOT_HEALTH_SNAPSHOT_TENANT_MISMATCH"
  | "PILOT_HEALTH_SNAPSHOT_ENROLLMENT_MISMATCH"
  | "PILOT_HEALTH_SNAPSHOT_STATUS_MISMATCH"
  | "PILOT_HEALTH_DAILY_BUDGET_INVALID"
  | "PILOT_HEALTH_CONCURRENCY_BUDGET_INVALID"
  | "PILOT_HEALTH_FAILURE_BUDGET_INVALID"
  | "PILOT_HEALTH_ACTIVE_OPERATION_OVERFLOW"
  | "PILOT_HEALTH_DATE_INVALID"
  | "PILOT_HEALTH_ALERT_RESULT_INVALID"
  | "PILOT_HEALTH_ALERT_ID_REQUIRED"
  | "PILOT_HEALTH_ALERT_IDENTITY_MISMATCH"
  | "PILOT_HEALTH_ALERT_STATE_MISMATCH"
  | "PILOT_HEALTH_ALERT_BOUNDARY_INVALID"
  | "PILOT_HEALTH_ALERT_FINGERPRINT_INVALID"
  | "PILOT_HEALTH_ALERT_DATE_INVALID";

export class ControlledPilotHealthDeniedError
  extends Error {
  readonly code:
    ControlledPilotHealthFailureCode;

  readonly status: number;

  constructor(
    code: ControlledPilotHealthFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name =
      "ControlledPilotHealthDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: ControlledPilotHealthFailureCode,
  message: string,
  status = 403,
): never {
  throw new ControlledPilotHealthDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: ControlledPilotHealthFailureCode,
  message: string,
  minimumLength = 1,
  maximumLength = 256,
): string {
  if (typeof value !== "string") {
    deny(code, message, 400);
  }

  const normalized = value.trim();

  if (
    normalized.length < minimumLength ||
    normalized.length > maximumLength
  ) {
    deny(code, message, 400);
  }

  return normalized;
}

function normalizeIdempotencyKey(
  value: unknown,
): string {
  const normalized = requireText(
    value,
    "PILOT_HEALTH_IDEMPOTENCY_KEY_REQUIRED",
    "A pilot-health idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "PILOT_HEALTH_IDEMPOTENCY_KEY_INVALID",
      "The pilot-health idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function requireInteger(
  value: unknown,
  code: ControlledPilotHealthFailureCode,
  message: string,
  minimum: number,
  maximum: number,
): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    deny(code, message, 500);
  }

  return value;
}

function requireValidDate(
  value: unknown,
  code: ControlledPilotHealthFailureCode,
  message: string,
): string {
  const normalized = requireText(
    value,
    code,
    message,
    1,
    64,
  );

  if (Number.isNaN(Date.parse(normalized))) {
    deny(code, message, 500);
  }

  return normalized;
}

function percentage(
  value: number,
  limit: number,
): number {
  return Number(
    ((value / limit) * 100).toFixed(2),
  );
}

function evaluateHealth(input: {
  enrollmentStatus: "ACTIVE" | "SUSPENDED";
  emergencyStop: boolean;
  circuitStatus: "CLOSED" | "OPEN";
  dailyUsagePercent: number;
  concurrencyUsagePercent: number;
  recentFailureCount: number;
  failureThreshold: number;
}): Readonly<{
  status: ControlledPilotHealthStatus;
  reasonCodes:
    readonly ControlledPilotHealthReason[];
}> {
  const blocked:
    ControlledPilotHealthReason[] = [];

  const warnings:
    ControlledPilotHealthReason[] = [];

  if (input.enrollmentStatus === "SUSPENDED") {
    blocked.push("PILOT_SUSPENDED");
  }

  if (input.emergencyStop) {
    blocked.push("EMERGENCY_STOP_ACTIVE");
  }

  if (input.circuitStatus === "OPEN") {
    blocked.push("FAILURE_CIRCUIT_OPEN");
  }

  if (blocked.length > 0) {
    return Object.freeze({
      status: "BLOCKED",
      reasonCodes: Object.freeze(blocked),
    });
  }

  if (
    input.recentFailureCount >=
    Math.max(1, input.failureThreshold - 1)
  ) {
    warnings.push(
      "FAILURE_THRESHOLD_APPROACHING",
    );
  }

  if (input.dailyUsagePercent >= 80) {
    warnings.push("DAILY_BUDGET_PRESSURE");
  }

  if (
    input.concurrencyUsagePercent >= 80
  ) {
    warnings.push("CONCURRENCY_PRESSURE");
  }

  if (warnings.length > 0) {
    return Object.freeze({
      status: "WARNING",
      reasonCodes: Object.freeze(warnings),
    });
  }

  return Object.freeze({
    status: "HEALTHY",
    reasonCodes: Object.freeze([]),
  });
}

function createStateFingerprint(input: {
  tenantId: string;
  enrollmentId: string;
  enrollmentStatus: "ACTIVE" | "SUSPENDED";
  emergencyStop: boolean;
  circuitStatus: "CLOSED" | "OPEN";
  dailyOperationCount: number;
  dailyOperationLimit: number;
  activeOperationCount: number;
  concurrentOperationLimit: number;
  recentFailureCount: number;
  failureThreshold: number;
  healthStatus: ControlledPilotHealthStatus;
  reasonCodes:
    readonly ControlledPilotHealthReason[];
  observedAt: string;
}): string {
  const canonical = JSON.stringify({
    tenantId: input.tenantId,
    enrollmentId: input.enrollmentId,
    enrollmentStatus:
      input.enrollmentStatus,
    emergencyStop: input.emergencyStop,
    circuitStatus: input.circuitStatus,
    dailyOperationCount:
      input.dailyOperationCount,
    dailyOperationLimit:
      input.dailyOperationLimit,
    activeOperationCount:
      input.activeOperationCount,
    concurrentOperationLimit:
      input.concurrentOperationLimit,
    recentFailureCount:
      input.recentFailureCount,
    failureThreshold:
      input.failureThreshold,
    healthStatus: input.healthStatus,
    reasonCodes: input.reasonCodes,
    observedAt: input.observedAt,
  });

  return createHash("sha256")
    .update(canonical, "utf8")
    .digest("hex");
}

function freezeResult(
  result:
    AuthenticatedControlledPilotHealthResult,
): AuthenticatedControlledPilotHealthResult {
  Object.freeze(result.health.reasonCodes);
  Object.freeze(result.health);
  Object.freeze(result.alert);
  Object.freeze(result.ownerAuthority);
  Object.freeze(result.safetyBoundary);

  return Object.freeze(result);
}

/**
 * Produces an authenticated owner-only controlled-pilot health view.
 *
 * Safety behavior:
 * - ACTIVE and SUSPENDED pilots can be inspected;
 * - REVOKED or cross-tenant enrollment fails closed;
 * - warning and blocked states create an internal idempotent alert record;
 * - healthy state performs no alert write;
 * - SHA-256 fingerprint detects persisted alert corruption;
 * - no external message, provider execution or public action occurs.
 */
export async function observeAuthenticatedControlledPilotHealth(
  input: ObserveAuthenticatedControlledPilotHealthInput,
): Promise<AuthenticatedControlledPilotHealthResult> {
  if (
    !input.pilotAccessRepository ||
    typeof input.pilotAccessRepository
      .findEnrollmentByTenantId !== "function"
  ) {
    deny(
      "PILOT_HEALTH_ACCESS_REPOSITORY_MISCONFIGURED",
      "Pilot health access repository is not safely configured.",
      500,
    );
  }

  if (
    !input.healthRepository ||
    typeof input.healthRepository
      .findHealthSnapshot !== "function"
  ) {
    deny(
      "PILOT_HEALTH_REPOSITORY_MISCONFIGURED",
      "Pilot health repository is not safely configured.",
      500,
    );
  }

  if (
    !input.alertRepository ||
    typeof input.alertRepository
      .createOrGetAlert !== "function"
  ) {
    deny(
      "PILOT_HEALTH_ALERT_REPOSITORY_MISCONFIGURED",
      "Pilot health alert repository is not safely configured.",
      500,
    );
  }

  const idempotencyKey =
    normalizeIdempotencyKey(
      input.idempotencyKey,
    );

  const workspace =
    await buildAuthenticatedTenantWorkspace({
      principal: input.principal,
      accessRepositories:
        input.accessRepositories,
      workspaceRepository:
        input.workspaceRepository,
      requestedTenantId:
        input.requestedTenantId,
      requireOwner: true,
    });

  const enrollment =
    await input.pilotAccessRepository
      .findEnrollmentByTenantId(
        workspace.tenant.id,
      );

  if (!enrollment) {
    deny(
      "PILOT_HEALTH_ENROLLMENT_NOT_AVAILABLE",
      "No controlled-pilot enrollment is available.",
    );
  }

  if (
    enrollment.tenantId !==
    workspace.tenant.id
  ) {
    deny(
      "PILOT_HEALTH_ENROLLMENT_TENANT_MISMATCH",
      "The controlled-pilot enrollment belongs to another tenant.",
    );
  }

  if (
    enrollment.ownerUserId !==
      workspace.actor.userId
  ) {
    deny(
      "PILOT_HEALTH_ENROLLMENT_OWNER_MISMATCH",
      "The authenticated owner does not own this pilot enrollment.",
    );
  }

  if (
    enrollment.enrollmentStatus === "REVOKED"
  ) {
    deny(
      "PILOT_HEALTH_ENROLLMENT_REVOKED",
      "A revoked pilot enrollment cannot produce an operational health state.",
    );
  }

  if (
    enrollment.accessMode !==
      "CONTROLLED_PILOT" ||
    enrollment.executionMode !==
      "SANDBOX_ONLY"
  ) {
    deny(
      "PILOT_HEALTH_ENROLLMENT_MODE_INVALID",
      "The controlled-pilot enrollment mode is invalid.",
    );
  }

  if (
    enrollment.publicSignupAuthorized !== false ||
    enrollment.liveProviderExecutionAuthorized !==
      false
  ) {
    deny(
      "PILOT_HEALTH_ENROLLMENT_BOUNDARY_INVALID",
      "The controlled-pilot enrollment safety boundary is invalid.",
    );
  }

  const snapshot =
    await input.healthRepository
      .findHealthSnapshot(
        workspace.tenant.id,
        enrollment.id,
      );

  if (!snapshot) {
    deny(
      "PILOT_HEALTH_SNAPSHOT_NOT_AVAILABLE",
      "Controlled-pilot health state is not available.",
      404,
    );
  }

  if (
    snapshot.tenantId !==
    workspace.tenant.id
  ) {
    deny(
      "PILOT_HEALTH_SNAPSHOT_TENANT_MISMATCH",
      "The controlled-pilot health state belongs to another tenant.",
    );
  }

  if (
    snapshot.enrollmentId !==
    enrollment.id
  ) {
    deny(
      "PILOT_HEALTH_SNAPSHOT_ENROLLMENT_MISMATCH",
      "The controlled-pilot health state does not match the enrollment.",
    );
  }

  if (
    snapshot.enrollmentStatus !==
    enrollment.enrollmentStatus
  ) {
    deny(
      "PILOT_HEALTH_SNAPSHOT_STATUS_MISMATCH",
      "The controlled-pilot health enrollment status is stale or invalid.",
      409,
    );
  }

  const dailyOperationCount =
    requireInteger(
      snapshot.dailyOperationCount,
      "PILOT_HEALTH_DAILY_BUDGET_INVALID",
      "Pilot daily operation count is invalid.",
      0,
      1000000,
    );

  const dailyOperationLimit =
    requireInteger(
      snapshot.dailyOperationLimit,
      "PILOT_HEALTH_DAILY_BUDGET_INVALID",
      "Pilot daily operation limit is invalid.",
      1,
      1000000,
    );

  const activeOperationCount =
    requireInteger(
      snapshot.activeOperationCount,
      "PILOT_HEALTH_CONCURRENCY_BUDGET_INVALID",
      "Pilot active operation count is invalid.",
      0,
      10000,
    );

  const concurrentOperationLimit =
    requireInteger(
      snapshot.concurrentOperationLimit,
      "PILOT_HEALTH_CONCURRENCY_BUDGET_INVALID",
      "Pilot concurrent operation limit is invalid.",
      1,
      10000,
    );

  if (
    activeOperationCount >
    concurrentOperationLimit
  ) {
    deny(
      "PILOT_HEALTH_ACTIVE_OPERATION_OVERFLOW",
      "Pilot active operation count exceeds the configured concurrency limit.",
      500,
    );
  }

  const recentFailureCount =
    requireInteger(
      snapshot.recentFailureCount,
      "PILOT_HEALTH_FAILURE_BUDGET_INVALID",
      "Pilot recent failure count is invalid.",
      0,
      1000000,
    );

  const failureThreshold =
    requireInteger(
      snapshot.failureThreshold,
      "PILOT_HEALTH_FAILURE_BUDGET_INVALID",
      "Pilot failure threshold is invalid.",
      1,
      1000000,
    );

  requireValidDate(
    snapshot.updatedAt,
    "PILOT_HEALTH_DATE_INVALID",
    "Pilot health state update time is invalid.",
  );

  const dailyUsagePercent = percentage(
    dailyOperationCount,
    dailyOperationLimit,
  );

  const concurrencyUsagePercent =
    percentage(
      activeOperationCount,
      concurrentOperationLimit,
    );

  const failureUsagePercent = percentage(
    recentFailureCount,
    failureThreshold,
  );

  const evaluation = evaluateHealth({
    enrollmentStatus:
      snapshot.enrollmentStatus,
    emergencyStop:
      snapshot.emergencyStop,
    circuitStatus:
      snapshot.circuitStatus,
    dailyUsagePercent,
    concurrencyUsagePercent,
    recentFailureCount,
    failureThreshold,
  });

  const observedAt = new Date().toISOString();

  const stateFingerprint =
    createStateFingerprint({
      tenantId: workspace.tenant.id,
      enrollmentId: enrollment.id,
      enrollmentStatus:
        snapshot.enrollmentStatus,
      emergencyStop:
        snapshot.emergencyStop,
      circuitStatus:
        snapshot.circuitStatus,
      dailyOperationCount,
      dailyOperationLimit,
      activeOperationCount,
      concurrentOperationLimit,
      recentFailureCount,
      failureThreshold,
      healthStatus: evaluation.status,
      reasonCodes:
        evaluation.reasonCodes,
      observedAt,
    });

  let alertOutcome:
    | "NOT_REQUIRED"
    | "CREATED"
    | "EXISTING" = "NOT_REQUIRED";

  let alertId: string | null = null;

  if (evaluation.status !== "HEALTHY") {
    const persisted =
      await input.alertRepository
        .createOrGetAlert({
          tenantId: workspace.tenant.id,
          enrollmentId: enrollment.id,
          invitationId:
            enrollment.invitationId,
          ownerUserId:
            workspace.actor.userId,
          sourceSessionId:
            workspace.actor.sessionId,
          idempotencyKey,
          healthStatus:
            evaluation.status,
          reasonCodes:
            evaluation.reasonCodes,
          stateFingerprintAlgorithm:
            "SHA-256",
          stateFingerprint,
          enrollmentStatus:
            snapshot.enrollmentStatus,
          emergencyStop:
            snapshot.emergencyStop,
          circuitStatus:
            snapshot.circuitStatus,
          dailyOperationCount,
          dailyOperationLimit,
          activeOperationCount,
          concurrentOperationLimit,
          recentFailureCount,
          failureThreshold,
          externalNotificationSent: false,
          executionTriggered: false,
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized:
            false,
          observedAt,
        });

    if (
      !persisted ||
      (
        persisted.outcome !== "CREATED" &&
        persisted.outcome !== "EXISTING"
      ) ||
      !persisted.alert
    ) {
      deny(
        "PILOT_HEALTH_ALERT_RESULT_INVALID",
        "Pilot health alert persistence returned an invalid result.",
        500,
      );
    }

    const alert = persisted.alert;

    alertId = requireText(
      alert.id,
      "PILOT_HEALTH_ALERT_ID_REQUIRED",
      "Persisted pilot health alert identity is required.",
      1,
      128,
    );

    if (
      alert.tenantId !==
        workspace.tenant.id ||
      alert.enrollmentId !==
        enrollment.id ||
      alert.invitationId !==
        enrollment.invitationId ||
      alert.ownerUserId !==
        workspace.actor.userId ||
      alert.sourceSessionId !==
        workspace.actor.sessionId ||
      alert.idempotencyKey !==
        idempotencyKey
    ) {
      deny(
        "PILOT_HEALTH_ALERT_IDENTITY_MISMATCH",
        "Persisted pilot health alert identities are invalid.",
        500,
      );
    }

    if (
      alert.healthStatus !==
        evaluation.status ||
      JSON.stringify(alert.reasonCodes) !==
        JSON.stringify(
          evaluation.reasonCodes,
        ) ||
      alert.enrollmentStatus !==
        snapshot.enrollmentStatus ||
      alert.emergencyStop !==
        snapshot.emergencyStop ||
      alert.circuitStatus !==
        snapshot.circuitStatus ||
      alert.dailyOperationCount !==
        dailyOperationCount ||
      alert.dailyOperationLimit !==
        dailyOperationLimit ||
      alert.activeOperationCount !==
        activeOperationCount ||
      alert.concurrentOperationLimit !==
        concurrentOperationLimit ||
      alert.recentFailureCount !==
        recentFailureCount ||
      alert.failureThreshold !==
        failureThreshold
    ) {
      deny(
        "PILOT_HEALTH_ALERT_STATE_MISMATCH",
        "Persisted pilot health alert state is invalid.",
        500,
      );
    }

    if (
      alert.externalNotificationSent !==
        false ||
      alert.executionTriggered !== false ||
      alert.executionMode !==
        "SANDBOX_ONLY" ||
      alert.publicSignupAuthorized !==
        false ||
      alert.liveProviderExecutionAuthorized !==
        false
    ) {
      deny(
        "PILOT_HEALTH_ALERT_BOUNDARY_INVALID",
        "Persisted pilot health alert safety boundary is invalid.",
        500,
      );
    }

    if (
      alert.stateFingerprintAlgorithm !==
        "SHA-256" ||
      alert.stateFingerprint !==
        stateFingerprint
    ) {
      deny(
        "PILOT_HEALTH_ALERT_FINGERPRINT_INVALID",
        "Persisted pilot health alert fingerprint is invalid.",
        500,
      );
    }

    const persistedObservedAt =
      requireValidDate(
        alert.observedAt,
        "PILOT_HEALTH_ALERT_DATE_INVALID",
        "Persisted pilot health observation time is invalid.",
      );

    const createdAt = requireValidDate(
      alert.createdAt,
      "PILOT_HEALTH_ALERT_DATE_INVALID",
      "Persisted pilot health alert creation time is invalid.",
    );

    if (
      persisted.outcome === "CREATED" &&
      persistedObservedAt !== observedAt
    ) {
      deny(
        "PILOT_HEALTH_ALERT_DATE_INVALID",
        "Persisted pilot health observation time changed during persistence.",
        500,
      );
    }

    if (
      Date.parse(createdAt) <
      Date.parse(persistedObservedAt)
    ) {
      deny(
        "PILOT_HEALTH_ALERT_DATE_INVALID",
        "Persisted pilot health alert timeline is invalid.",
        500,
      );
    }

    alertOutcome = persisted.outcome;
  }

  return freezeResult({
    health: {
      tenantId: workspace.tenant.id,
      enrollmentId: enrollment.id,
      status: evaluation.status,
      reasonCodes:
        evaluation.reasonCodes,
      enrollmentStatus:
        snapshot.enrollmentStatus,
      emergencyStop:
        snapshot.emergencyStop,
      circuitStatus:
        snapshot.circuitStatus,
      dailyUsagePercent,
      concurrencyUsagePercent,
      failureUsagePercent,
      observedAt,
    },

    alert: {
      required:
        evaluation.status !== "HEALTHY",
      outcome: alertOutcome,
      id: alertId,
      stateFingerprint,
      externalNotificationSent: false,
    },

    ownerAuthority: {
      ownerUserId:
        workspace.actor.userId,
      sourceSessionId:
        workspace.actor.sessionId,
      role: "OWNER",
    },

    safetyBoundary: {
      tenantScoped: true,
      ownerOnly: true,
      immutableFingerprint: true,
      internalAlertOnly: true,
      externalNotificationSent: false,
      executionTriggered: false,
      executionMode: "SANDBOX_ONLY",
      publicSignupAuthorized: false,
      liveProviderExecutionAuthorized:
        false,
      publicLaunchAuthorized: false,
    },
  });
}
