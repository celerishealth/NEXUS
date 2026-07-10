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
  ControlledPilotCapability,
} from "./authenticatedControlledPilotAccess";

export type PilotOperationActorRole =
  | "OWNER"
  | "ADMIN"
  | "OPERATOR";

export type PilotOperationOutcome =
  | "SUCCEEDED"
  | "FAILED";

export type CompletablePilotOperation =
  Readonly<{
    id: string;
    tenantId: string;
    enrollmentId: string;
    invitationId: string;
    capability: ControlledPilotCapability;
    operationKey: string;
    actorUserId: string;
    actorRole: PilotOperationActorRole;
    admissionIdempotencyKey: string;
    status: "ADMITTED";
    executionMode: "SANDBOX_ONLY";
    executionTriggered: false;
    admittedAt: string;
    createdAt: string;
  }>;

export type PilotOperationCompletionSafetySnapshot =
  Readonly<{
    tenantId: string;
    enrollmentId: string;
    emergencyStop: boolean;
    circuitStatus: "CLOSED" | "OPEN";
    activeOperationCount: number;
    recentFailureCount: number;
    failureThreshold: number;
    updatedAt: string;
  }>;

export type PilotOperationCompletionReadRepository =
  Readonly<{
    findOperationAndSafetyByTenantAndAdmissionId: (
      tenantId: string,
      admissionId: string,
    ) => Promise<Readonly<{
      operation: CompletablePilotOperation;
      safety:
        PilotOperationCompletionSafetySnapshot;
    }> | null>;
  }>;

export type PilotOperationCompletionPersistenceInput =
  Readonly<{
    tenantId: string;
    enrollmentId: string;
    invitationId: string;
    admissionId: string;
    capability: ControlledPilotCapability;
    operationKey: string;
    operationActorUserId: string;
    operationActorRole: PilotOperationActorRole;
    completedByUserId: string;
    completionSessionId: string;
    idempotencyKey: string;
    outcome: PilotOperationOutcome;
    summary: string;
    errorCode: string | null;
    resultDigestAlgorithm: "SHA-256";
    resultDigest: string;
    expectedAdmissionStatus: "ADMITTED";
    expectedActiveOperationCount: number;
    expectedRecentFailureCount: number;
    expectedCircuitStatus: "CLOSED" | "OPEN";
    failureThreshold: number;
    expectedSafetyUpdatedAt: string;
    releaseActiveSlot: true;
    incrementFailureCount: boolean;
    openCircuitOnFailureThreshold: true;
    executionMode: "SANDBOX_ONLY";
    executionTriggered: false;
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    completedAt: string;
  }>;

export type PersistedPilotOperationCompletion =
  Readonly<{
    id: string;
    tenantId: string;
    enrollmentId: string;
    invitationId: string;
    admissionId: string;
    capability: ControlledPilotCapability;
    operationKey: string;
    operationActorUserId: string;
    operationActorRole: PilotOperationActorRole;
    completedByUserId: string;
    completionSessionId: string;
    idempotencyKey: string;
    outcome: PilotOperationOutcome;
    summary: string;
    errorCode: string | null;
    resultDigestAlgorithm: "SHA-256";
    resultDigest: string;
    releaseActiveSlot: true;
    incrementFailureCount: boolean;
    executionMode: "SANDBOX_ONLY";
    executionTriggered: false;
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    completedAt: string;
    createdAt: string;
  }>;

export type PersistedPilotCompletionSafetyState =
  Readonly<{
    tenantId: string;
    enrollmentId: string;
    activeOperationCount: number;
    recentFailureCount: number;
    failureThreshold: number;
    circuitStatus: "CLOSED" | "OPEN";
    updatedAt: string;
  }>;

export type PilotOperationCompletionPersistenceResult =
  Readonly<{
    outcome: "COMPLETED" | "EXISTING";
    completion:
      PersistedPilotOperationCompletion;
    safety: PersistedPilotCompletionSafetyState;
  }>;

export type PilotOperationCompletionRepository =
  Readonly<{
    completeOperationAtomically: (
      input: PilotOperationCompletionPersistenceInput,
    ) => Promise<PilotOperationCompletionPersistenceResult>;
  }>;

export type CompleteAuthenticatedPilotOperationInput =
  Readonly<{
    principal:
      AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    pilotAccessRepository:
      ControlledPilotAccessRepository;
    completionReadRepository:
      PilotOperationCompletionReadRepository;
    completionRepository:
      PilotOperationCompletionRepository;
    requestedTenantId?: string | null;
    admissionId: string;
    capability: ControlledPilotCapability;
    outcome: PilotOperationOutcome;
    summary: string;
    errorCode?: string | null;
    idempotencyKey: string;
  }>;

export type AuthenticatedPilotOperationCompletionResult =
  Readonly<{
    outcome: "COMPLETED" | "EXISTING";

    completion: Readonly<{
      id: string;
      tenantId: string;
      enrollmentId: string;
      admissionId: string;
      capability: ControlledPilotCapability;
      operationKey: string;
      operationActorUserId: string;
      completedByUserId: string;
      operationOutcome: PilotOperationOutcome;
      summary: string;
      errorCode: string | null;
      resultDigestAlgorithm: "SHA-256";
      resultDigest: string;
      completedAt: string;
      createdAt: string;
    }>;

    safetyState: Readonly<{
      pilotStatus: "ACTIVE" | "SUSPENDED";
      activeOperationCount: number;
      activeSlotReleased: true;
      recentFailureCount: number;
      failureThreshold: number;
      circuitStatus: "CLOSED" | "OPEN";
    }>;

    safetyBoundary: Readonly<{
      tenantScoped: true;
      actorScoped: true;
      atomicCompletion: true;
      idempotentCompletion: true;
      immutableResultDigest: true;
      drainAllowedWhileSuspended: boolean;
      newOperationAuthorized: false;
      executionTriggered: false;
      executionMode: "SANDBOX_ONLY";
      publicSignupAuthorized: false;
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;
  }>;

export type PilotOperationCompletionFailureCode =
  | "PILOT_COMPLETION_ACCESS_REPOSITORY_MISCONFIGURED"
  | "PILOT_COMPLETION_READ_REPOSITORY_MISCONFIGURED"
  | "PILOT_COMPLETION_REPOSITORY_MISCONFIGURED"
  | "PILOT_COMPLETION_ADMISSION_ID_REQUIRED"
  | "PILOT_COMPLETION_ADMISSION_ID_INVALID"
  | "PILOT_COMPLETION_CAPABILITY_INVALID"
  | "PILOT_COMPLETION_OUTCOME_INVALID"
  | "PILOT_COMPLETION_SUMMARY_REQUIRED"
  | "PILOT_COMPLETION_SUMMARY_INVALID"
  | "PILOT_COMPLETION_ERROR_CODE_REQUIRED"
  | "PILOT_COMPLETION_ERROR_CODE_INVALID"
  | "PILOT_COMPLETION_IDEMPOTENCY_KEY_REQUIRED"
  | "PILOT_COMPLETION_IDEMPOTENCY_KEY_INVALID"
  | "PILOT_COMPLETION_ENROLLMENT_NOT_AVAILABLE"
  | "PILOT_COMPLETION_ENROLLMENT_TENANT_MISMATCH"
  | "PILOT_COMPLETION_ENROLLMENT_OWNER_MISMATCH"
  | "PILOT_COMPLETION_ENROLLMENT_REVOKED"
  | "PILOT_COMPLETION_ENROLLMENT_MODE_INVALID"
  | "PILOT_COMPLETION_ENROLLMENT_BOUNDARY_INVALID"
  | "PILOT_COMPLETION_ROLE_NOT_AUTHORIZED"
  | "PILOT_COMPLETION_OPERATION_NOT_AVAILABLE"
  | "PILOT_COMPLETION_OPERATION_TENANT_MISMATCH"
  | "PILOT_COMPLETION_OPERATION_ENROLLMENT_MISMATCH"
  | "PILOT_COMPLETION_OPERATION_INVITATION_MISMATCH"
  | "PILOT_COMPLETION_OPERATION_CAPABILITY_MISMATCH"
  | "PILOT_COMPLETION_OPERATION_ACTOR_MISMATCH"
  | "PILOT_COMPLETION_OPERATION_ROLE_MISMATCH"
  | "PILOT_COMPLETION_OPERATION_STATUS_INVALID"
  | "PILOT_COMPLETION_OPERATION_BOUNDARY_INVALID"
  | "PILOT_COMPLETION_OPERATION_DATE_INVALID"
  | "PILOT_COMPLETION_SAFETY_TENANT_MISMATCH"
  | "PILOT_COMPLETION_SAFETY_ENROLLMENT_MISMATCH"
  | "PILOT_COMPLETION_ACTIVE_COUNT_INVALID"
  | "PILOT_COMPLETION_NO_ACTIVE_SLOT"
  | "PILOT_COMPLETION_FAILURE_STATE_INVALID"
  | "PILOT_COMPLETION_SAFETY_DATE_INVALID"
  | "PILOT_COMPLETION_PERSISTENCE_RESULT_INVALID"
  | "PILOT_COMPLETION_PERSISTED_ID_REQUIRED"
  | "PILOT_COMPLETION_PERSISTED_IDENTITY_MISMATCH"
  | "PILOT_COMPLETION_PERSISTED_OUTCOME_MISMATCH"
  | "PILOT_COMPLETION_PERSISTED_BOUNDARY_INVALID"
  | "PILOT_COMPLETION_PERSISTED_DIGEST_INVALID"
  | "PILOT_COMPLETION_PERSISTED_DATE_INVALID"
  | "PILOT_COMPLETION_PERSISTED_SAFETY_IDENTITY_MISMATCH"
  | "PILOT_COMPLETION_PERSISTED_ACTIVE_COUNT_MISMATCH"
  | "PILOT_COMPLETION_PERSISTED_FAILURE_COUNT_MISMATCH"
  | "PILOT_COMPLETION_PERSISTED_CIRCUIT_MISMATCH"
  | "PILOT_COMPLETION_PERSISTED_SAFETY_DATE_INVALID";

export class PilotOperationCompletionDeniedError
  extends Error {
  readonly code:
    PilotOperationCompletionFailureCode;

  readonly status: number;

  constructor(
    code: PilotOperationCompletionFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name =
      "PilotOperationCompletionDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: PilotOperationCompletionFailureCode,
  message: string,
  status = 403,
): never {
  throw new PilotOperationCompletionDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: PilotOperationCompletionFailureCode,
  message: string,
  minimumLength = 1,
  maximumLength = 1000,
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

function normalizeIdentifier(
  value: unknown,
  requiredCode:
    PilotOperationCompletionFailureCode,
  invalidCode:
    PilotOperationCompletionFailureCode,
  requiredMessage: string,
  invalidMessage: string,
): string {
  const normalized = requireText(
    value,
    requiredCode,
    requiredMessage,
    3,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(invalidCode, invalidMessage, 400);
  }

  return normalized;
}

function normalizeIdempotencyKey(
  value: unknown,
): string {
  return normalizeIdentifier(
    value,
    "PILOT_COMPLETION_IDEMPOTENCY_KEY_REQUIRED",
    "PILOT_COMPLETION_IDEMPOTENCY_KEY_INVALID",
    "A pilot completion idempotency key is required.",
    "The pilot completion idempotency key is invalid.",
  );
}

function normalizeErrorCode(
  outcome: PilotOperationOutcome,
  value: unknown,
): string | null {
  if (outcome === "SUCCEEDED") {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return null;
    }

    deny(
      "PILOT_COMPLETION_ERROR_CODE_INVALID",
      "Successful pilot operation completion cannot contain an error code.",
      400,
    );
  }

  const normalized = requireText(
    value,
    "PILOT_COMPLETION_ERROR_CODE_REQUIRED",
    "A failed pilot operation requires an error code.",
    3,
    128,
  );

  if (!/^[A-Z0-9_:-]+$/.test(normalized)) {
    deny(
      "PILOT_COMPLETION_ERROR_CODE_INVALID",
      "The pilot operation error code is invalid.",
      400,
    );
  }

  return normalized;
}

function requireInteger(
  value: unknown,
  code: PilotOperationCompletionFailureCode,
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
  code: PilotOperationCompletionFailureCode,
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

function isCapability(
  value: unknown,
): value is ControlledPilotCapability {
  return (
    value === "PILOT_STATUS_READ" ||
    value === "INQUIRY_INTAKE" ||
    value === "AI_RECOMMENDATION" ||
    value === "OWNER_DECISION" ||
    value === "SANDBOX_EXECUTION" ||
    value === "RESULT_TRACKING" ||
    value === "EXECUTION_AUDIT_RECORDING" ||
    value === "SANDBOX_RECOVERY" ||
    value === "RECOVERY_AUDIT_RECORDING"
  );
}

function roleCanCompleteCapability(
  role: PilotOperationActorRole,
  capability: ControlledPilotCapability,
): boolean {
  if (capability === "PILOT_STATUS_READ") {
    return false;
  }

  if (role === "OWNER") {
    return true;
  }

  return (
    capability === "INQUIRY_INTAKE" ||
    capability === "AI_RECOMMENDATION" ||
    capability === "RESULT_TRACKING" ||
    capability ===
      "EXECUTION_AUDIT_RECORDING"
  );
}

function createResultDigest(input: {
  tenantId: string;
  enrollmentId: string;
  admissionId: string;
  capability: ControlledPilotCapability;
  operationKey: string;
  operationActorUserId: string;
  completedByUserId: string;
  idempotencyKey: string;
  outcome: PilotOperationOutcome;
  summary: string;
  errorCode: string | null;
  completedAt: string;
}): string {
  const canonical = JSON.stringify({
    tenantId: input.tenantId,
    enrollmentId: input.enrollmentId,
    admissionId: input.admissionId,
    capability: input.capability,
    operationKey: input.operationKey,
    operationActorUserId:
      input.operationActorUserId,
    completedByUserId:
      input.completedByUserId,
    idempotencyKey: input.idempotencyKey,
    outcome: input.outcome,
    summary: input.summary,
    errorCode: input.errorCode,
    completedAt: input.completedAt,
  });

  return createHash("sha256")
    .update(canonical, "utf8")
    .digest("hex");
}

function freezeResult(
  result:
    AuthenticatedPilotOperationCompletionResult,
): AuthenticatedPilotOperationCompletionResult {
  Object.freeze(result.completion);
  Object.freeze(result.safetyState);
  Object.freeze(result.safetyBoundary);

  return Object.freeze(result);
}

/**
 * Completes one already-admitted controlled-pilot operation.
 *
 * Important behavior:
 * - completion is allowed for ACTIVE or SUSPENDED pilot enrollment;
 * - SUSPENDED means no new admissions, but existing operations may drain;
 * - REVOKED enrollment fails closed;
 * - only the authenticated actor who claimed the admission may complete it;
 * - completion atomically releases one active slot;
 * - failure atomically increments recent failure count;
 * - failure circuit opens when the threshold is reached;
 * - immutable SHA-256 result digest protects the completion record;
 * - no operation or provider execution occurs inside this function.
 */
export async function completeAuthenticatedPilotOperation(
  input: CompleteAuthenticatedPilotOperationInput,
): Promise<AuthenticatedPilotOperationCompletionResult> {
  if (
    !input.pilotAccessRepository ||
    typeof input.pilotAccessRepository
      .findEnrollmentByTenantId !== "function"
  ) {
    deny(
      "PILOT_COMPLETION_ACCESS_REPOSITORY_MISCONFIGURED",
      "Pilot completion access repository is not safely configured.",
      500,
    );
  }

  if (
    !input.completionReadRepository ||
    typeof input.completionReadRepository
      .findOperationAndSafetyByTenantAndAdmissionId !==
      "function"
  ) {
    deny(
      "PILOT_COMPLETION_READ_REPOSITORY_MISCONFIGURED",
      "Pilot completion read repository is not safely configured.",
      500,
    );
  }

  if (
    !input.completionRepository ||
    typeof input.completionRepository
      .completeOperationAtomically !== "function"
  ) {
    deny(
      "PILOT_COMPLETION_REPOSITORY_MISCONFIGURED",
      "Pilot completion repository is not safely configured.",
      500,
    );
  }

  const admissionId = normalizeIdentifier(
    input.admissionId,
    "PILOT_COMPLETION_ADMISSION_ID_REQUIRED",
    "PILOT_COMPLETION_ADMISSION_ID_INVALID",
    "A pilot operation admission identity is required.",
    "The pilot operation admission identity is invalid.",
  );

  if (
    !isCapability(input.capability) ||
    input.capability === "PILOT_STATUS_READ"
  ) {
    deny(
      "PILOT_COMPLETION_CAPABILITY_INVALID",
      "The pilot completion capability is invalid.",
      400,
    );
  }

  if (
    input.outcome !== "SUCCEEDED" &&
    input.outcome !== "FAILED"
  ) {
    deny(
      "PILOT_COMPLETION_OUTCOME_INVALID",
      "Pilot completion outcome must be SUCCEEDED or FAILED.",
      400,
    );
  }

  const summary = requireText(
    input.summary,
    "PILOT_COMPLETION_SUMMARY_REQUIRED",
    "A clear pilot operation completion summary is required.",
    8,
    1000,
  );

  const errorCode = normalizeErrorCode(
    input.outcome,
    input.errorCode,
  );

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
      requireOwner: false,
    });

  if (workspace.actor.role === "VIEWER") {
    deny(
      "PILOT_COMPLETION_ROLE_NOT_AUTHORIZED",
      "Viewer membership cannot complete pilot operations.",
    );
  }

  const actorRole = workspace.actor.role;

  if (
    !roleCanCompleteCapability(
      actorRole,
      input.capability,
    )
  ) {
    deny(
      "PILOT_COMPLETION_ROLE_NOT_AUTHORIZED",
      "The authenticated role cannot complete this pilot capability.",
    );
  }

  const enrollment =
    await input.pilotAccessRepository
      .findEnrollmentByTenantId(
        workspace.tenant.id,
      );

  if (!enrollment) {
    deny(
      "PILOT_COMPLETION_ENROLLMENT_NOT_AVAILABLE",
      "No controlled-pilot enrollment is available.",
    );
  }

  if (
    enrollment.tenantId !==
    workspace.tenant.id
  ) {
    deny(
      "PILOT_COMPLETION_ENROLLMENT_TENANT_MISMATCH",
      "The controlled-pilot enrollment belongs to another tenant.",
    );
  }

  if (
    enrollment.ownerUserId !==
    workspace.tenant.ownerUserId
  ) {
    deny(
      "PILOT_COMPLETION_ENROLLMENT_OWNER_MISMATCH",
      "The controlled-pilot enrollment owner is invalid.",
    );
  }

  if (
    enrollment.enrollmentStatus === "REVOKED"
  ) {
    deny(
      "PILOT_COMPLETION_ENROLLMENT_REVOKED",
      "A revoked pilot enrollment cannot complete operations.",
    );
  }

  if (
    enrollment.accessMode !==
      "CONTROLLED_PILOT" ||
    enrollment.executionMode !==
      "SANDBOX_ONLY"
  ) {
    deny(
      "PILOT_COMPLETION_ENROLLMENT_MODE_INVALID",
      "The pilot enrollment mode is invalid.",
    );
  }

  if (
    enrollment.publicSignupAuthorized !== false ||
    enrollment.liveProviderExecutionAuthorized !==
      false
  ) {
    deny(
      "PILOT_COMPLETION_ENROLLMENT_BOUNDARY_INVALID",
      "The pilot enrollment safety boundary is invalid.",
    );
  }

  const snapshot =
    await input.completionReadRepository
      .findOperationAndSafetyByTenantAndAdmissionId(
        workspace.tenant.id,
        admissionId,
      );

  if (!snapshot) {
    deny(
      "PILOT_COMPLETION_OPERATION_NOT_AVAILABLE",
      "The admitted pilot operation is not available.",
      404,
    );
  }

  const operation = snapshot.operation;
  const safety = snapshot.safety;

  if (
    operation.tenantId !==
    workspace.tenant.id
  ) {
    deny(
      "PILOT_COMPLETION_OPERATION_TENANT_MISMATCH",
      "The admitted pilot operation belongs to another tenant.",
    );
  }

  if (
    operation.enrollmentId !==
    enrollment.id
  ) {
    deny(
      "PILOT_COMPLETION_OPERATION_ENROLLMENT_MISMATCH",
      "The admitted pilot operation does not match the current enrollment.",
    );
  }

  if (
    operation.invitationId !==
    enrollment.invitationId
  ) {
    deny(
      "PILOT_COMPLETION_OPERATION_INVITATION_MISMATCH",
      "The admitted pilot operation invitation is invalid.",
    );
  }

  if (
    operation.capability !==
    input.capability
  ) {
    deny(
      "PILOT_COMPLETION_OPERATION_CAPABILITY_MISMATCH",
      "The admitted pilot operation capability does not match.",
    );
  }

  if (
    operation.actorUserId !==
    workspace.actor.userId
  ) {
    deny(
      "PILOT_COMPLETION_OPERATION_ACTOR_MISMATCH",
      "Only the actor who claimed the operation may complete it.",
    );
  }

  if (
    operation.actorRole !== actorRole
  ) {
    deny(
      "PILOT_COMPLETION_OPERATION_ROLE_MISMATCH",
      "The admitted pilot operation role no longer matches.",
    );
  }

  if (operation.status !== "ADMITTED") {
    deny(
      "PILOT_COMPLETION_OPERATION_STATUS_INVALID",
      "The pilot operation is not in an admitted state.",
    );
  }

  if (
    operation.executionMode !==
      "SANDBOX_ONLY" ||
    operation.executionTriggered !== false
  ) {
    deny(
      "PILOT_COMPLETION_OPERATION_BOUNDARY_INVALID",
      "The admitted pilot operation safety boundary is invalid.",
    );
  }

  requireValidDate(
    operation.admittedAt,
    "PILOT_COMPLETION_OPERATION_DATE_INVALID",
    "The pilot operation admission time is invalid.",
  );

  requireValidDate(
    operation.createdAt,
    "PILOT_COMPLETION_OPERATION_DATE_INVALID",
    "The pilot operation creation time is invalid.",
  );

  if (
    safety.tenantId !==
    workspace.tenant.id
  ) {
    deny(
      "PILOT_COMPLETION_SAFETY_TENANT_MISMATCH",
      "The pilot completion safety state belongs to another tenant.",
    );
  }

  if (
    safety.enrollmentId !==
    enrollment.id
  ) {
    deny(
      "PILOT_COMPLETION_SAFETY_ENROLLMENT_MISMATCH",
      "The pilot completion safety state does not match the enrollment.",
    );
  }

  const activeOperationCount = requireInteger(
    safety.activeOperationCount,
    "PILOT_COMPLETION_ACTIVE_COUNT_INVALID",
    "The active pilot operation count is invalid.",
    0,
    10000,
  );

  if (activeOperationCount < 1) {
    deny(
      "PILOT_COMPLETION_NO_ACTIVE_SLOT",
      "No active pilot operation slot is available to release.",
    );
  }

  const recentFailureCount = requireInteger(
    safety.recentFailureCount,
    "PILOT_COMPLETION_FAILURE_STATE_INVALID",
    "The pilot recent failure count is invalid.",
    0,
    1000000,
  );

  const failureThreshold = requireInteger(
    safety.failureThreshold,
    "PILOT_COMPLETION_FAILURE_STATE_INVALID",
    "The pilot failure threshold is invalid.",
    1,
    1000000,
  );

  const safetyUpdatedAt = requireValidDate(
    safety.updatedAt,
    "PILOT_COMPLETION_SAFETY_DATE_INVALID",
    "The pilot completion safety update time is invalid.",
  );

  const completedAt = new Date().toISOString();

  const resultDigest = createResultDigest({
    tenantId: workspace.tenant.id,
    enrollmentId: enrollment.id,
    admissionId,
    capability: input.capability,
    operationKey: operation.operationKey,
    operationActorUserId:
      operation.actorUserId,
    completedByUserId:
      workspace.actor.userId,
    idempotencyKey,
    outcome: input.outcome,
    summary,
    errorCode,
    completedAt,
  });

  const incrementFailureCount =
    input.outcome === "FAILED";

  const expectedActiveCount =
    activeOperationCount - 1;

  const expectedFailureCount =
    recentFailureCount +
    (incrementFailureCount ? 1 : 0);

  const expectedCircuitStatus:
    | "CLOSED"
    | "OPEN" =
    safety.circuitStatus === "OPEN" ||
    (
      incrementFailureCount &&
      expectedFailureCount >=
        failureThreshold
    )
      ? "OPEN"
      : "CLOSED";

  const persisted =
    await input.completionRepository
      .completeOperationAtomically({
        tenantId: workspace.tenant.id,
        enrollmentId: enrollment.id,
        invitationId:
          enrollment.invitationId,
        admissionId,
        capability: input.capability,
        operationKey:
          operation.operationKey,
        operationActorUserId:
          operation.actorUserId,
        operationActorRole:
          operation.actorRole,
        completedByUserId:
          workspace.actor.userId,
        completionSessionId:
          workspace.actor.sessionId,
        idempotencyKey,
        outcome: input.outcome,
        summary,
        errorCode,
        resultDigestAlgorithm: "SHA-256",
        resultDigest,
        expectedAdmissionStatus: "ADMITTED",
        expectedActiveOperationCount:
          activeOperationCount,
        expectedRecentFailureCount:
          recentFailureCount,
        expectedCircuitStatus:
          safety.circuitStatus,
        failureThreshold,
        expectedSafetyUpdatedAt:
          safetyUpdatedAt,
        releaseActiveSlot: true,
        incrementFailureCount,
        openCircuitOnFailureThreshold: true,
        executionMode: "SANDBOX_ONLY",
        executionTriggered: false,
        publicSignupAuthorized: false,
        liveProviderExecutionAuthorized: false,
        completedAt,
      });

  if (
    !persisted ||
    (
      persisted.outcome !== "COMPLETED" &&
      persisted.outcome !== "EXISTING"
    ) ||
    !persisted.completion ||
    !persisted.safety
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTENCE_RESULT_INVALID",
      "Pilot completion persistence returned an invalid result.",
      500,
    );
  }

  const completion = persisted.completion;
  const persistedSafety = persisted.safety;

  const completionId = requireText(
    completion.id,
    "PILOT_COMPLETION_PERSISTED_ID_REQUIRED",
    "Persisted pilot completion identity is required.",
    1,
    128,
  );

  if (
    completion.tenantId !==
      workspace.tenant.id ||
    completion.enrollmentId !==
      enrollment.id ||
    completion.invitationId !==
      enrollment.invitationId ||
    completion.admissionId !==
      admissionId ||
    completion.capability !==
      input.capability ||
    completion.operationKey !==
      operation.operationKey ||
    completion.operationActorUserId !==
      operation.actorUserId ||
    completion.operationActorRole !==
      operation.actorRole ||
    completion.completedByUserId !==
      workspace.actor.userId ||
    completion.completionSessionId !==
      workspace.actor.sessionId ||
    completion.idempotencyKey !==
      idempotencyKey
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_IDENTITY_MISMATCH",
      "Persisted pilot completion identities are invalid.",
      500,
    );
  }

  if (
    completion.outcome !== input.outcome ||
    completion.summary !== summary ||
    completion.errorCode !== errorCode
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_OUTCOME_MISMATCH",
      "Persisted pilot completion outcome is invalid.",
      500,
    );
  }

  if (
    completion.releaseActiveSlot !== true ||
    completion.incrementFailureCount !==
      incrementFailureCount ||
    completion.executionMode !==
      "SANDBOX_ONLY" ||
    completion.executionTriggered !== false ||
    completion.publicSignupAuthorized !== false ||
    completion.liveProviderExecutionAuthorized !==
      false
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_BOUNDARY_INVALID",
      "Persisted pilot completion safety boundary is invalid.",
      500,
    );
  }

  const persistedCompletedAt =
    requireValidDate(
      completion.completedAt,
      "PILOT_COMPLETION_PERSISTED_DATE_INVALID",
      "Persisted pilot completion time is invalid.",
    );

  const completionCreatedAt =
    requireValidDate(
      completion.createdAt,
      "PILOT_COMPLETION_PERSISTED_DATE_INVALID",
      "Persisted pilot completion creation time is invalid.",
    );

  if (
    persisted.outcome === "COMPLETED" &&
    persistedCompletedAt !== completedAt
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_DATE_INVALID",
      "Persisted pilot completion time changed during persistence.",
      500,
    );
  }

  if (
    Date.parse(completionCreatedAt) <
    Date.parse(persistedCompletedAt)
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_DATE_INVALID",
      "Persisted pilot completion timeline is invalid.",
      500,
    );
  }

  const expectedDigest =
    createResultDigest({
      tenantId: completion.tenantId,
      enrollmentId:
        completion.enrollmentId,
      admissionId:
        completion.admissionId,
      capability: completion.capability,
      operationKey:
        completion.operationKey,
      operationActorUserId:
        completion.operationActorUserId,
      completedByUserId:
        completion.completedByUserId,
      idempotencyKey:
        completion.idempotencyKey,
      outcome: completion.outcome,
      summary: completion.summary,
      errorCode: completion.errorCode,
      completedAt:
        persistedCompletedAt,
    });

  if (
    completion.resultDigestAlgorithm !==
      "SHA-256" ||
    completion.resultDigest !==
      expectedDigest
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_DIGEST_INVALID",
      "Persisted pilot completion integrity digest is invalid.",
      500,
    );
  }

  if (
    persistedSafety.tenantId !==
      workspace.tenant.id ||
    persistedSafety.enrollmentId !==
      enrollment.id
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_SAFETY_IDENTITY_MISMATCH",
      "Persisted pilot safety state identities are invalid.",
      500,
    );
  }

  if (
    persistedSafety.activeOperationCount !==
    expectedActiveCount
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_ACTIVE_COUNT_MISMATCH",
      "Persisted pilot active operation count is invalid.",
      500,
    );
  }

  if (
    persistedSafety.recentFailureCount !==
    expectedFailureCount ||
    persistedSafety.failureThreshold !==
      failureThreshold
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_FAILURE_COUNT_MISMATCH",
      "Persisted pilot failure state is invalid.",
      500,
    );
  }

  if (
    persistedSafety.circuitStatus !==
    expectedCircuitStatus
  ) {
    deny(
      "PILOT_COMPLETION_PERSISTED_CIRCUIT_MISMATCH",
      "Persisted pilot failure circuit status is invalid.",
      500,
    );
  }

  requireValidDate(
    persistedSafety.updatedAt,
    "PILOT_COMPLETION_PERSISTED_SAFETY_DATE_INVALID",
    "Persisted pilot safety update time is invalid.",
  );

  const pilotStatus =
    enrollment.enrollmentStatus;

  return freezeResult({
    outcome: persisted.outcome,

    completion: {
      id: completionId,
      tenantId:
        workspace.tenant.id,
      enrollmentId:
        enrollment.id,
      admissionId,
      capability:
        input.capability,
      operationKey:
        operation.operationKey,
      operationActorUserId:
        operation.actorUserId,
      completedByUserId:
        workspace.actor.userId,
      operationOutcome:
        input.outcome,
      summary,
      errorCode,
      resultDigestAlgorithm:
        "SHA-256",
      resultDigest:
        completion.resultDigest,
      completedAt:
        persistedCompletedAt,
      createdAt:
        completionCreatedAt,
    },

    safetyState: {
      pilotStatus,
      activeOperationCount:
        persistedSafety.activeOperationCount,
      activeSlotReleased: true,
      recentFailureCount:
        persistedSafety.recentFailureCount,
      failureThreshold:
        persistedSafety.failureThreshold,
      circuitStatus:
        persistedSafety.circuitStatus,
    },

    safetyBoundary: {
      tenantScoped: true,
      actorScoped: true,
      atomicCompletion: true,
      idempotentCompletion: true,
      immutableResultDigest: true,
      drainAllowedWhileSuspended:
        pilotStatus === "SUSPENDED",
      newOperationAuthorized: false,
      executionTriggered: false,
      executionMode: "SANDBOX_ONLY",
      publicSignupAuthorized: false,
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
  });
}
