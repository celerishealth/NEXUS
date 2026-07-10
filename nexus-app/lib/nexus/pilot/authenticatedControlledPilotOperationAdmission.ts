import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import type {
  TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

import {
  enforceAuthenticatedControlledPilotAccess,
  type ControlledPilotAccessRepository,
  type ControlledPilotCapability,
} from "./authenticatedControlledPilotAccess";

export type PilotOperationRole =
  | "OWNER"
  | "ADMIN"
  | "OPERATOR";

export type PilotSafetySnapshot = Readonly<{
  tenantId: string;
  enrollmentId: string;
  enrollmentStatus: "ACTIVE";
  emergencyStop: boolean;
  circuitStatus: "CLOSED" | "OPEN";
  dailyWindowStartedAt: string;
  dailyOperationCount: number;
  dailyOperationLimit: number;
  activeOperationCount: number;
  concurrentOperationLimit: number;
  recentFailureCount: number;
  failureThreshold: number;
  updatedAt: string;
}>;

export type PilotOperationSafetyRepository =
  Readonly<{
    findSafetySnapshot: (
      tenantId: string,
      enrollmentId: string,
      capability: ControlledPilotCapability,
    ) => Promise<PilotSafetySnapshot | null>;
  }>;

export type PilotOperationAdmissionPersistenceInput =
  Readonly<{
    tenantId: string;
    enrollmentId: string;
    invitationId: string;
    capability: ControlledPilotCapability;
    operationKey: string;
    actorUserId: string;
    sourceSessionId: string;
    actorRole: PilotOperationRole;
    idempotencyKey: string;
    status: "ADMITTED";
    executionMode: "SANDBOX_ONLY";
    executionTriggered: false;
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    expectedEnrollmentStatus: "ACTIVE";
    expectedEmergencyStop: false;
    expectedCircuitStatus: "CLOSED";
    expectedDailyOperationCount: number;
    dailyOperationLimit: number;
    expectedActiveOperationCount: number;
    concurrentOperationLimit: number;
    expectedRecentFailureCount: number;
    failureThreshold: number;
    expectedSafetyUpdatedAt: string;
    admittedAt: string;
  }>;

export type PersistedPilotOperationAdmission =
  Readonly<{
    id: string;
    tenantId: string;
    enrollmentId: string;
    invitationId: string;
    capability: ControlledPilotCapability;
    operationKey: string;
    actorUserId: string;
    sourceSessionId: string;
    actorRole: PilotOperationRole;
    idempotencyKey: string;
    status: "ADMITTED";
    executionMode: "SANDBOX_ONLY";
    executionTriggered: false;
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    circuitStatus: "CLOSED";
    dailyOperationCountAtAdmission: number;
    dailyOperationLimit: number;
    activeOperationCountAtAdmission: number;
    concurrentOperationLimit: number;
    recentFailureCountAtAdmission: number;
    failureThreshold: number;
    admittedAt: string;
    createdAt: string;
  }>;

export type PilotOperationAdmissionPersistenceResult =
  Readonly<{
    outcome: "CLAIMED" | "EXISTING";
    admission: PersistedPilotOperationAdmission;
  }>;

export type PilotOperationAdmissionRepository =
  Readonly<{
    claimOperationAtomically: (
      input: PilotOperationAdmissionPersistenceInput,
    ) => Promise<PilotOperationAdmissionPersistenceResult>;
  }>;

export type AdmitAuthenticatedPilotOperationInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    pilotAccessRepository:
      ControlledPilotAccessRepository;
    safetyRepository:
      PilotOperationSafetyRepository;
    admissionRepository:
      PilotOperationAdmissionRepository;
    requestedTenantId?: string | null;
    capability: ControlledPilotCapability;
    operationKey: string;
    idempotencyKey: string;
  }>;

export type AuthenticatedPilotOperationAdmissionResult =
  Readonly<{
    outcome: "CLAIMED" | "EXISTING";

    admission: Readonly<{
      id: string;
      tenantId: string;
      enrollmentId: string;
      capability: ControlledPilotCapability;
      operationKey: string;
      actorUserId: string;
      actorRole: PilotOperationRole;
      status: "ADMITTED";
      admittedAt: string;
      createdAt: string;
    }>;

    safetyBudget: Readonly<{
      circuitStatus: "CLOSED";
      dailyOperationLimit: number;
      dailyOperationCountAtAdmission: number;
      dailyOperationsRemaining: number;
      concurrentOperationLimit: number;
      activeOperationCountAtAdmission: number;
      concurrentSlotsRemaining: number;
      recentFailureCountAtAdmission: number;
      failureThreshold: number;
    }>;

    safetyBoundary: Readonly<{
      accessGateVerified: true;
      pilotActive: true;
      emergencyStopClear: true;
      atomicAdmission: true;
      idempotentAdmission: true;
      executionTriggered: false;
      executionMode: "SANDBOX_ONLY";
      publicSignupAuthorized: false;
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;
  }>;

export type PilotOperationAdmissionFailureCode =
  | "PILOT_OPERATION_SAFETY_REPOSITORY_MISCONFIGURED"
  | "PILOT_OPERATION_ADMISSION_REPOSITORY_MISCONFIGURED"
  | "PILOT_OPERATION_CAPABILITY_NOT_ADMISSIBLE"
  | "PILOT_OPERATION_ROLE_NOT_ADMISSIBLE"
  | "PILOT_OPERATION_KEY_REQUIRED"
  | "PILOT_OPERATION_KEY_INVALID"
  | "PILOT_OPERATION_IDEMPOTENCY_KEY_REQUIRED"
  | "PILOT_OPERATION_IDEMPOTENCY_KEY_INVALID"
  | "PILOT_SAFETY_SNAPSHOT_NOT_AVAILABLE"
  | "PILOT_SAFETY_TENANT_MISMATCH"
  | "PILOT_SAFETY_ENROLLMENT_MISMATCH"
  | "PILOT_SAFETY_ENROLLMENT_NOT_ACTIVE"
  | "PILOT_EMERGENCY_STOP_ACTIVE"
  | "PILOT_FAILURE_CIRCUIT_OPEN"
  | "PILOT_DAILY_BUDGET_INVALID"
  | "PILOT_DAILY_BUDGET_EXHAUSTED"
  | "PILOT_CONCURRENCY_BUDGET_INVALID"
  | "PILOT_CONCURRENCY_BUDGET_EXHAUSTED"
  | "PILOT_FAILURE_BUDGET_INVALID"
  | "PILOT_FAILURE_THRESHOLD_REACHED"
  | "PILOT_SAFETY_DATE_INVALID"
  | "PILOT_OPERATION_ADMISSION_RESULT_INVALID"
  | "PILOT_OPERATION_ADMISSION_ID_REQUIRED"
  | "PILOT_OPERATION_ADMISSION_IDENTITY_MISMATCH"
  | "PILOT_OPERATION_ADMISSION_STATUS_INVALID"
  | "PILOT_OPERATION_ADMISSION_BOUNDARY_INVALID"
  | "PILOT_OPERATION_ADMISSION_BUDGET_MISMATCH"
  | "PILOT_OPERATION_ADMISSION_DATE_INVALID";

export class PilotOperationAdmissionDeniedError
  extends Error {
  readonly code:
    PilotOperationAdmissionFailureCode;

  readonly status: number;

  constructor(
    code: PilotOperationAdmissionFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name =
      "PilotOperationAdmissionDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: PilotOperationAdmissionFailureCode,
  message: string,
  status = 403,
): never {
  throw new PilotOperationAdmissionDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: PilotOperationAdmissionFailureCode,
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

function normalizeOperationKey(
  value: unknown,
): string {
  const normalized = requireText(
    value,
    "PILOT_OPERATION_KEY_REQUIRED",
    "A pilot operation key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "PILOT_OPERATION_KEY_INVALID",
      "The pilot operation key is invalid.",
      400,
    );
  }

  return normalized;
}

function normalizeIdempotencyKey(
  value: unknown,
): string {
  const normalized = requireText(
    value,
    "PILOT_OPERATION_IDEMPOTENCY_KEY_REQUIRED",
    "A pilot operation idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "PILOT_OPERATION_IDEMPOTENCY_KEY_INVALID",
      "The pilot operation idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function requireInteger(
  value: unknown,
  code: PilotOperationAdmissionFailureCode,
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
  code: PilotOperationAdmissionFailureCode,
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

function freezeResult(
  result: AuthenticatedPilotOperationAdmissionResult,
): AuthenticatedPilotOperationAdmissionResult {
  Object.freeze(result.admission);
  Object.freeze(result.safetyBudget);
  Object.freeze(result.safetyBoundary);

  return Object.freeze(result);
}

/**
 * Admits one controlled-pilot operation under tenant, role, rate,
 * concurrency and failure-circuit controls.
 *
 * Safety properties:
 * - reuses the Day 716 pilot access gate;
 * - suspended or revoked pilots fail before safety-budget reads;
 * - status-read requests cannot claim operational capacity;
 * - emergency stop and open failure circuits fail closed;
 * - daily, concurrent and recent-failure budgets are enforced;
 * - repository performs the final compare-and-set admission atomically;
 * - repeated idempotency keys return the existing admission;
 * - this gate never performs the admitted operation itself;
 * - execution remains sandbox-only.
 */
export async function admitAuthenticatedPilotOperation(
  input: AdmitAuthenticatedPilotOperationInput,
): Promise<AuthenticatedPilotOperationAdmissionResult> {
  if (
    !input.safetyRepository ||
    typeof input.safetyRepository
      .findSafetySnapshot !== "function"
  ) {
    deny(
      "PILOT_OPERATION_SAFETY_REPOSITORY_MISCONFIGURED",
      "Pilot operation safety repository is not safely configured.",
      500,
    );
  }

  if (
    !input.admissionRepository ||
    typeof input.admissionRepository
      .claimOperationAtomically !== "function"
  ) {
    deny(
      "PILOT_OPERATION_ADMISSION_REPOSITORY_MISCONFIGURED",
      "Pilot operation admission repository is not safely configured.",
      500,
    );
  }

  if (input.capability === "PILOT_STATUS_READ") {
    deny(
      "PILOT_OPERATION_CAPABILITY_NOT_ADMISSIBLE",
      "Pilot status reads do not require an operational admission claim.",
      400,
    );
  }

  const operationKey = normalizeOperationKey(
    input.operationKey,
  );

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  const access =
    await enforceAuthenticatedControlledPilotAccess({
      principal: input.principal,
      accessRepositories: input.accessRepositories,
      workspaceRepository: input.workspaceRepository,
      pilotAccessRepository:
        input.pilotAccessRepository,
      requestedTenantId:
        input.requestedTenantId,
      requiredCapability: input.capability,
    });

  if (access.access.role === "VIEWER") {
    deny(
      "PILOT_OPERATION_ROLE_NOT_ADMISSIBLE",
      "Viewer membership cannot claim pilot operation capacity.",
    );
  }

  const actorRole = access.access.role;

  const safety =
    await input.safetyRepository.findSafetySnapshot(
      access.access.tenantId,
      access.access.enrollmentId,
      input.capability,
    );

  if (!safety) {
    deny(
      "PILOT_SAFETY_SNAPSHOT_NOT_AVAILABLE",
      "Pilot operation safety state is not available.",
    );
  }

  if (safety.tenantId !== access.access.tenantId) {
    deny(
      "PILOT_SAFETY_TENANT_MISMATCH",
      "The pilot safety state belongs to another tenant.",
    );
  }

  if (
    safety.enrollmentId !==
    access.access.enrollmentId
  ) {
    deny(
      "PILOT_SAFETY_ENROLLMENT_MISMATCH",
      "The pilot safety state does not match the active enrollment.",
    );
  }

  if (safety.enrollmentStatus !== "ACTIVE") {
    deny(
      "PILOT_SAFETY_ENROLLMENT_NOT_ACTIVE",
      "Pilot safety state is not active.",
    );
  }

  if (safety.emergencyStop !== false) {
    deny(
      "PILOT_EMERGENCY_STOP_ACTIVE",
      "Pilot operations are blocked by the emergency stop.",
    );
  }

  if (safety.circuitStatus !== "CLOSED") {
    deny(
      "PILOT_FAILURE_CIRCUIT_OPEN",
      "Pilot operations are blocked by the failure circuit.",
    );
  }

  const dailyOperationCount = requireInteger(
    safety.dailyOperationCount,
    "PILOT_DAILY_BUDGET_INVALID",
    "Pilot daily operation count is invalid.",
    0,
    1_000_000,
  );

  const dailyOperationLimit = requireInteger(
    safety.dailyOperationLimit,
    "PILOT_DAILY_BUDGET_INVALID",
    "Pilot daily operation limit is invalid.",
    1,
    1_000_000,
  );

  if (dailyOperationCount >= dailyOperationLimit) {
    deny(
      "PILOT_DAILY_BUDGET_EXHAUSTED",
      "The controlled-pilot daily operation budget is exhausted.",
    );
  }

  const activeOperationCount = requireInteger(
    safety.activeOperationCount,
    "PILOT_CONCURRENCY_BUDGET_INVALID",
    "Pilot active operation count is invalid.",
    0,
    10_000,
  );

  const concurrentOperationLimit = requireInteger(
    safety.concurrentOperationLimit,
    "PILOT_CONCURRENCY_BUDGET_INVALID",
    "Pilot concurrent operation limit is invalid.",
    1,
    10_000,
  );

  if (
    activeOperationCount >=
    concurrentOperationLimit
  ) {
    deny(
      "PILOT_CONCURRENCY_BUDGET_EXHAUSTED",
      "The controlled-pilot concurrent operation budget is exhausted.",
    );
  }

  const recentFailureCount = requireInteger(
    safety.recentFailureCount,
    "PILOT_FAILURE_BUDGET_INVALID",
    "Pilot recent failure count is invalid.",
    0,
    1_000_000,
  );

  const failureThreshold = requireInteger(
    safety.failureThreshold,
    "PILOT_FAILURE_BUDGET_INVALID",
    "Pilot failure threshold is invalid.",
    1,
    1_000_000,
  );

  if (recentFailureCount >= failureThreshold) {
    deny(
      "PILOT_FAILURE_THRESHOLD_REACHED",
      "The controlled-pilot failure threshold has been reached.",
    );
  }

  requireValidDate(
    safety.dailyWindowStartedAt,
    "PILOT_SAFETY_DATE_INVALID",
    "Pilot daily budget window time is invalid.",
  );

  const safetyUpdatedAt = requireValidDate(
    safety.updatedAt,
    "PILOT_SAFETY_DATE_INVALID",
    "Pilot safety state update time is invalid.",
  );

  const admittedAt = new Date().toISOString();

  const persisted =
    await input.admissionRepository
      .claimOperationAtomically({
        tenantId: access.access.tenantId,
        enrollmentId:
          access.access.enrollmentId,
        invitationId:
          access.access.invitationId,
        capability: input.capability,
        operationKey,
        actorUserId: access.access.userId,
        sourceSessionId:
          access.access.sessionId,
        actorRole,
        idempotencyKey,
        status: "ADMITTED",
        executionMode: "SANDBOX_ONLY",
        executionTriggered: false,
        publicSignupAuthorized: false,
        liveProviderExecutionAuthorized: false,
        expectedEnrollmentStatus: "ACTIVE",
        expectedEmergencyStop: false,
        expectedCircuitStatus: "CLOSED",
        expectedDailyOperationCount:
          dailyOperationCount,
        dailyOperationLimit,
        expectedActiveOperationCount:
          activeOperationCount,
        concurrentOperationLimit,
        expectedRecentFailureCount:
          recentFailureCount,
        failureThreshold,
        expectedSafetyUpdatedAt:
          safetyUpdatedAt,
        admittedAt,
      });

  if (
    !persisted ||
    (
      persisted.outcome !== "CLAIMED" &&
      persisted.outcome !== "EXISTING"
    ) ||
    !persisted.admission
  ) {
    deny(
      "PILOT_OPERATION_ADMISSION_RESULT_INVALID",
      "Pilot operation admission persistence returned an invalid result.",
      500,
    );
  }

  const admission = persisted.admission;

  const admissionId = requireText(
    admission.id,
    "PILOT_OPERATION_ADMISSION_ID_REQUIRED",
    "Persisted pilot operation admission identity is required.",
    1,
    128,
  );

  if (
    admission.tenantId !==
      access.access.tenantId ||
    admission.enrollmentId !==
      access.access.enrollmentId ||
    admission.invitationId !==
      access.access.invitationId ||
    admission.capability !== input.capability ||
    admission.operationKey !== operationKey ||
    admission.actorUserId !==
      access.access.userId ||
    admission.sourceSessionId !==
      access.access.sessionId ||
    admission.actorRole !== actorRole ||
    admission.idempotencyKey !==
      idempotencyKey
  ) {
    deny(
      "PILOT_OPERATION_ADMISSION_IDENTITY_MISMATCH",
      "Persisted pilot operation admission identities are invalid.",
      500,
    );
  }

  if (
    admission.status !== "ADMITTED" ||
    admission.circuitStatus !== "CLOSED"
  ) {
    deny(
      "PILOT_OPERATION_ADMISSION_STATUS_INVALID",
      "Persisted pilot operation admission status is invalid.",
      500,
    );
  }

  if (
    admission.executionMode !==
      "SANDBOX_ONLY" ||
    admission.executionTriggered !== false ||
    admission.publicSignupAuthorized !==
      false ||
    admission.liveProviderExecutionAuthorized !==
      false
  ) {
    deny(
      "PILOT_OPERATION_ADMISSION_BOUNDARY_INVALID",
      "Persisted pilot operation safety boundaries are invalid.",
      500,
    );
  }

  if (
    admission.dailyOperationCountAtAdmission !==
      dailyOperationCount ||
    admission.dailyOperationLimit !==
      dailyOperationLimit ||
    admission.activeOperationCountAtAdmission !==
      activeOperationCount ||
    admission.concurrentOperationLimit !==
      concurrentOperationLimit ||
    admission.recentFailureCountAtAdmission !==
      recentFailureCount ||
    admission.failureThreshold !==
      failureThreshold
  ) {
    deny(
      "PILOT_OPERATION_ADMISSION_BUDGET_MISMATCH",
      "Persisted pilot operation safety budget is invalid.",
      500,
    );
  }

  const persistedAdmittedAt = requireValidDate(
    admission.admittedAt,
    "PILOT_OPERATION_ADMISSION_DATE_INVALID",
    "Persisted pilot operation admission time is invalid.",
  );

  const createdAt = requireValidDate(
    admission.createdAt,
    "PILOT_OPERATION_ADMISSION_DATE_INVALID",
    "Persisted pilot operation creation time is invalid.",
  );

  if (
    persisted.outcome === "CLAIMED" &&
    persistedAdmittedAt !== admittedAt
  ) {
    deny(
      "PILOT_OPERATION_ADMISSION_DATE_INVALID",
      "Persisted pilot operation admission time changed during persistence.",
      500,
    );
  }

  if (
    Date.parse(createdAt) <
    Date.parse(persistedAdmittedAt)
  ) {
    deny(
      "PILOT_OPERATION_ADMISSION_DATE_INVALID",
      "Pilot operation admission timeline is invalid.",
      500,
    );
  }

  return freezeResult({
    outcome: persisted.outcome,

    admission: {
      id: admissionId,
      tenantId: admission.tenantId,
      enrollmentId: admission.enrollmentId,
      capability: admission.capability,
      operationKey: admission.operationKey,
      actorUserId: admission.actorUserId,
      actorRole: admission.actorRole,
      status: "ADMITTED",
      admittedAt: persistedAdmittedAt,
      createdAt,
    },

    safetyBudget: {
      circuitStatus: "CLOSED",
      dailyOperationLimit:
        admission.dailyOperationLimit,
      dailyOperationCountAtAdmission:
        admission.dailyOperationCountAtAdmission,
      dailyOperationsRemaining: Math.max(
        0,
        admission.dailyOperationLimit -
          admission.dailyOperationCountAtAdmission -
          1,
      ),
      concurrentOperationLimit:
        admission.concurrentOperationLimit,
      activeOperationCountAtAdmission:
        admission.activeOperationCountAtAdmission,
      concurrentSlotsRemaining: Math.max(
        0,
        admission.concurrentOperationLimit -
          admission.activeOperationCountAtAdmission -
          1,
      ),
      recentFailureCountAtAdmission:
        admission.recentFailureCountAtAdmission,
      failureThreshold:
        admission.failureThreshold,
    },

    safetyBoundary: {
      accessGateVerified: true,
      pilotActive: true,
      emergencyStopClear: true,
      atomicAdmission: true,
      idempotentAdmission: true,
      executionTriggered: false,
      executionMode: "SANDBOX_ONLY",
      publicSignupAuthorized: false,
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
  });
}
