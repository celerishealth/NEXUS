import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export const CONTROLLED_PILOT_CONTROL_ACTIONS = [
  "SUSPEND",
  "RESUME",
] as const;

export type ControlledPilotControlAction =
  (typeof CONTROLLED_PILOT_CONTROL_ACTIONS)[number];

export type ControllablePilotEnrollment = Readonly<{
  id: string;
  tenantId: string;
  invitationId: string;
  ownerUserId: string;
  enrollmentStatus:
    | "ACTIVE"
    | "SUSPENDED"
    | "REVOKED";
  accessMode: "CONTROLLED_PILOT";
  executionMode: "SANDBOX_ONLY";
  publicSignupAuthorized: false;
  liveProviderExecutionAuthorized: false;
  enrolledAt: string;
  updatedAt: string;
}>;

export type ControlledPilotControlReadRepository =
  Readonly<{
    findEnrollmentByTenantId: (
      tenantId: string,
    ) => Promise<ControllablePilotEnrollment | null>;
  }>;

export type ControlledPilotControlPersistenceInput =
  Readonly<{
    tenantId: string;
    enrollmentId: string;
    invitationId: string;
    ownerUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    action: ControlledPilotControlAction;
    reason: string;
    expectedCurrentStatus:
      | "ACTIVE"
      | "SUSPENDED";
    newStatus:
      | "ACTIVE"
      | "SUSPENDED";
    accessMode: "CONTROLLED_PILOT";
    executionMode: "SANDBOX_ONLY";
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    controlledAt: string;
  }>;

export type PersistedControlledPilotControl =
  Readonly<{
    id: string;
    tenantId: string;
    enrollmentId: string;
    invitationId: string;
    ownerUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    action: ControlledPilotControlAction;
    reason: string;
    previousStatus:
      | "ACTIVE"
      | "SUSPENDED";
    newStatus:
      | "ACTIVE"
      | "SUSPENDED";
    accessMode: "CONTROLLED_PILOT";
    executionMode: "SANDBOX_ONLY";
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    controlledAt: string;
    createdAt: string;
  }>;

export type ControlledPilotControlPersistenceResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";
    control: PersistedControlledPilotControl;
    enrollment: Readonly<{
      id: string;
      tenantId: string;
      ownerUserId: string;
      enrollmentStatus:
        | "ACTIVE"
        | "SUSPENDED";
      accessMode: "CONTROLLED_PILOT";
      executionMode: "SANDBOX_ONLY";
      publicSignupAuthorized: false;
      liveProviderExecutionAuthorized: false;
      updatedAt: string;
    }>;
  }>;

export type ControlledPilotControlRepository =
  Readonly<{
    applyControlAtomically: (
      input: ControlledPilotControlPersistenceInput,
    ) => Promise<ControlledPilotControlPersistenceResult>;
  }>;

export type ControlAuthenticatedPilotInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    controlReadRepository:
      ControlledPilotControlReadRepository;
    controlRepository:
      ControlledPilotControlRepository;
    requestedTenantId?: string | null;
    action: ControlledPilotControlAction;
    reason: string;
    idempotencyKey: string;
  }>;

export type AuthenticatedControlledPilotControlResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";

    control: Readonly<{
      id: string;
      tenantId: string;
      enrollmentId: string;
      invitationId: string;
      action: ControlledPilotControlAction;
      reason: string;
      previousStatus:
        | "ACTIVE"
        | "SUSPENDED";
      newStatus:
        | "ACTIVE"
        | "SUSPENDED";
      controlledAt: string;
      createdAt: string;
    }>;

    enrollment: Readonly<{
      id: string;
      status:
        | "ACTIVE"
        | "SUSPENDED";
      updatedAt: string;
    }>;

    ownerAuthority: Readonly<{
      ownerUserId: string;
      sourceSessionId: string;
      role: "OWNER";
      explicitControlAction: true;
    }>;

    safetyBoundary: Readonly<{
      atomicStatusChange: true;
      idempotentControl: true;
      immediateAccessEnforcement: true;
      executionMode: "SANDBOX_ONLY";
      publicSignupAuthorized: false;
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;

    pilotOperations: Readonly<{
      accessStatus:
        | "READY"
        | "BLOCKED";
      operationStatus:
        | "ACTIVE"
        | "PAUSED";
    }>;
  }>;

export type ControlledPilotControlFailureCode =
  | "PILOT_CONTROL_READ_REPOSITORY_MISCONFIGURED"
  | "PILOT_CONTROL_REPOSITORY_MISCONFIGURED"
  | "PILOT_CONTROL_ACTION_INVALID"
  | "PILOT_CONTROL_REASON_REQUIRED"
  | "PILOT_CONTROL_REASON_INVALID"
  | "PILOT_CONTROL_IDEMPOTENCY_KEY_REQUIRED"
  | "PILOT_CONTROL_IDEMPOTENCY_KEY_INVALID"
  | "CONTROLLABLE_PILOT_ENROLLMENT_NOT_AVAILABLE"
  | "CONTROLLABLE_PILOT_ENROLLMENT_ID_REQUIRED"
  | "CONTROLLABLE_PILOT_INVITATION_ID_REQUIRED"
  | "CONTROLLABLE_PILOT_TENANT_MISMATCH"
  | "CONTROLLABLE_PILOT_OWNER_MISMATCH"
  | "CONTROLLABLE_PILOT_REVOKED"
  | "CONTROLLABLE_PILOT_TRANSITION_INVALID"
  | "CONTROLLABLE_PILOT_ACCESS_MODE_INVALID"
  | "CONTROLLABLE_PILOT_EXECUTION_MODE_INVALID"
  | "CONTROLLABLE_PILOT_BOUNDARY_INVALID"
  | "CONTROLLABLE_PILOT_DATE_INVALID"
  | "PILOT_CONTROL_PERSISTENCE_RESULT_INVALID"
  | "PILOT_CONTROL_PERSISTED_ID_REQUIRED"
  | "PILOT_CONTROL_PERSISTED_IDENTITY_MISMATCH"
  | "PILOT_CONTROL_PERSISTED_ACTION_MISMATCH"
  | "PILOT_CONTROL_PERSISTED_TRANSITION_MISMATCH"
  | "PILOT_CONTROL_PERSISTED_BOUNDARY_INVALID"
  | "PILOT_CONTROL_PERSISTED_DATE_INVALID"
  | "PILOT_CONTROL_ENROLLMENT_IDENTITY_MISMATCH"
  | "PILOT_CONTROL_ENROLLMENT_STATUS_MISMATCH"
  | "PILOT_CONTROL_ENROLLMENT_BOUNDARY_INVALID"
  | "PILOT_CONTROL_ENROLLMENT_DATE_INVALID";

export class ControlledPilotControlDeniedError
  extends Error {
  readonly code: ControlledPilotControlFailureCode;
  readonly status: number;

  constructor(
    code: ControlledPilotControlFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name =
      "ControlledPilotControlDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: ControlledPilotControlFailureCode,
  message: string,
  status = 403,
): never {
  throw new ControlledPilotControlDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: ControlledPilotControlFailureCode,
  message: string,
  minimumLength = 1,
  maximumLength = 500,
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
    "PILOT_CONTROL_IDEMPOTENCY_KEY_REQUIRED",
    "A pilot-control idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "PILOT_CONTROL_IDEMPOTENCY_KEY_INVALID",
      "The pilot-control idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function isControlAction(
  value: unknown,
): value is ControlledPilotControlAction {
  return (
    typeof value === "string" &&
    CONTROLLED_PILOT_CONTROL_ACTIONS.includes(
      value as ControlledPilotControlAction,
    )
  );
}

function requireValidDate(
  value: unknown,
  code: ControlledPilotControlFailureCode,
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
  result: AuthenticatedControlledPilotControlResult,
): AuthenticatedControlledPilotControlResult {
  Object.freeze(result.control);
  Object.freeze(result.enrollment);
  Object.freeze(result.ownerAuthority);
  Object.freeze(result.safetyBoundary);
  Object.freeze(result.pilotOperations);

  return Object.freeze(result);
}

/**
 * Applies an explicit authenticated owner control action to a controlled
 * pilot enrollment.
 *
 * Security properties:
 * - requires current tenant OWNER authority;
 * - enrollment tenant and owner must match authenticated workspace;
 * - REVOKED enrollment cannot be resumed or suspended;
 * - SUSPEND requires ACTIVE and RESUME requires SUSPENDED;
 * - repository must atomically compare-and-set status and create the
 *   idempotent control record;
 * - Day 716 access enforcement blocks every capability while suspended;
 * - public signup, live-provider execution and public launch stay disabled.
 */
export async function controlAuthenticatedPilot(
  input: ControlAuthenticatedPilotInput,
): Promise<AuthenticatedControlledPilotControlResult> {
  const workspace =
    await buildAuthenticatedTenantWorkspace({
      principal: input.principal,
      accessRepositories: input.accessRepositories,
      workspaceRepository: input.workspaceRepository,
      requestedTenantId: input.requestedTenantId,
      requireOwner: true,
    });

  if (
    !input.controlReadRepository ||
    typeof input.controlReadRepository
      .findEnrollmentByTenantId !== "function"
  ) {
    deny(
      "PILOT_CONTROL_READ_REPOSITORY_MISCONFIGURED",
      "Pilot control read repository is not safely configured.",
      500,
    );
  }

  if (
    !input.controlRepository ||
    typeof input.controlRepository
      .applyControlAtomically !== "function"
  ) {
    deny(
      "PILOT_CONTROL_REPOSITORY_MISCONFIGURED",
      "Pilot control repository is not safely configured.",
      500,
    );
  }

  if (!isControlAction(input.action)) {
    deny(
      "PILOT_CONTROL_ACTION_INVALID",
      "Pilot control action must be SUSPEND or RESUME.",
      400,
    );
  }

  const reason = requireText(
    input.reason,
    "PILOT_CONTROL_REASON_REQUIRED",
    "A clear pilot control reason is required.",
    8,
    500,
  );

  const idempotencyKey =
    normalizeIdempotencyKey(input.idempotencyKey);

  const enrollment =
    await input.controlReadRepository
      .findEnrollmentByTenantId(
        workspace.tenant.id,
      );

  if (!enrollment) {
    deny(
      "CONTROLLABLE_PILOT_ENROLLMENT_NOT_AVAILABLE",
      "No controlled-pilot enrollment is available to this tenant.",
    );
  }

  const enrollmentId = requireText(
    enrollment.id,
    "CONTROLLABLE_PILOT_ENROLLMENT_ID_REQUIRED",
    "Controlled-pilot enrollment identity is required.",
    1,
    128,
  );

  const invitationId = requireText(
    enrollment.invitationId,
    "CONTROLLABLE_PILOT_INVITATION_ID_REQUIRED",
    "Controlled-pilot invitation identity is required.",
    1,
    128,
  );

  if (enrollment.tenantId !== workspace.tenant.id) {
    deny(
      "CONTROLLABLE_PILOT_TENANT_MISMATCH",
      "The controlled-pilot enrollment belongs to another tenant.",
    );
  }

  if (
    enrollment.ownerUserId !==
    workspace.actor.userId ||
    enrollment.ownerUserId !==
    workspace.tenant.ownerUserId
  ) {
    deny(
      "CONTROLLABLE_PILOT_OWNER_MISMATCH",
      "The authenticated owner does not own this controlled-pilot enrollment.",
    );
  }

  if (enrollment.enrollmentStatus === "REVOKED") {
    deny(
      "CONTROLLABLE_PILOT_REVOKED",
      "A revoked controlled-pilot enrollment cannot be changed.",
    );
  }

  const expectedCurrentStatus =
    input.action === "SUSPEND"
      ? "ACTIVE"
      : "SUSPENDED";

  const newStatus =
    input.action === "SUSPEND"
      ? "SUSPENDED"
      : "ACTIVE";

  if (
    enrollment.enrollmentStatus !==
    expectedCurrentStatus
  ) {
    deny(
      "CONTROLLABLE_PILOT_TRANSITION_INVALID",
      `Cannot ${input.action.toLowerCase()} a pilot enrollment with status ${enrollment.enrollmentStatus}.`,
    );
  }

  if (
    enrollment.accessMode !==
    "CONTROLLED_PILOT"
  ) {
    deny(
      "CONTROLLABLE_PILOT_ACCESS_MODE_INVALID",
      "The enrollment does not use controlled-pilot access mode.",
    );
  }

  if (
    enrollment.executionMode !==
    "SANDBOX_ONLY"
  ) {
    deny(
      "CONTROLLABLE_PILOT_EXECUTION_MODE_INVALID",
      "The controlled pilot must remain sandbox-only.",
    );
  }

  if (
    enrollment.publicSignupAuthorized !== false ||
    enrollment.liveProviderExecutionAuthorized !==
      false
  ) {
    deny(
      "CONTROLLABLE_PILOT_BOUNDARY_INVALID",
      "The controlled-pilot safety boundary is invalid.",
    );
  }

  requireValidDate(
    enrollment.enrolledAt,
    "CONTROLLABLE_PILOT_DATE_INVALID",
    "Controlled-pilot enrollment time is invalid.",
  );

  requireValidDate(
    enrollment.updatedAt,
    "CONTROLLABLE_PILOT_DATE_INVALID",
    "Controlled-pilot update time is invalid.",
  );

  const controlledAt = new Date().toISOString();

  const persisted =
    await input.controlRepository
      .applyControlAtomically({
        tenantId: workspace.tenant.id,
        enrollmentId,
        invitationId,
        ownerUserId: workspace.actor.userId,
        sourceSessionId: workspace.actor.sessionId,
        idempotencyKey,
        action: input.action,
        reason,
        expectedCurrentStatus,
        newStatus,
        accessMode: "CONTROLLED_PILOT",
        executionMode: "SANDBOX_ONLY",
        publicSignupAuthorized: false,
        liveProviderExecutionAuthorized: false,
        controlledAt,
      });

  if (
    !persisted ||
    (
      persisted.outcome !== "CREATED" &&
      persisted.outcome !== "EXISTING"
    ) ||
    !persisted.control ||
    !persisted.enrollment
  ) {
    deny(
      "PILOT_CONTROL_PERSISTENCE_RESULT_INVALID",
      "Pilot control persistence returned an invalid result.",
      500,
    );
  }

  const control = persisted.control;
  const persistedEnrollment =
    persisted.enrollment;

  const controlId = requireText(
    control.id,
    "PILOT_CONTROL_PERSISTED_ID_REQUIRED",
    "Persisted pilot control identity is required.",
    1,
    128,
  );

  if (
    control.tenantId !== workspace.tenant.id ||
    control.enrollmentId !== enrollmentId ||
    control.invitationId !== invitationId ||
    control.ownerUserId !==
      workspace.actor.userId ||
    control.sourceSessionId !==
      workspace.actor.sessionId ||
    control.idempotencyKey !== idempotencyKey
  ) {
    deny(
      "PILOT_CONTROL_PERSISTED_IDENTITY_MISMATCH",
      "Persisted pilot control identities are invalid.",
      500,
    );
  }

  if (
    control.action !== input.action ||
    control.reason !== reason
  ) {
    deny(
      "PILOT_CONTROL_PERSISTED_ACTION_MISMATCH",
      "Persisted pilot control action is invalid.",
      500,
    );
  }

  if (
    control.previousStatus !==
      expectedCurrentStatus ||
    control.newStatus !== newStatus
  ) {
    deny(
      "PILOT_CONTROL_PERSISTED_TRANSITION_MISMATCH",
      "Persisted pilot status transition is invalid.",
      500,
    );
  }

  if (
    control.accessMode !==
      "CONTROLLED_PILOT" ||
    control.executionMode !==
      "SANDBOX_ONLY" ||
    control.publicSignupAuthorized !== false ||
    control.liveProviderExecutionAuthorized !==
      false
  ) {
    deny(
      "PILOT_CONTROL_PERSISTED_BOUNDARY_INVALID",
      "Persisted pilot control safety boundary is invalid.",
      500,
    );
  }

  const persistedControlledAt =
    requireValidDate(
      control.controlledAt,
      "PILOT_CONTROL_PERSISTED_DATE_INVALID",
      "Persisted pilot control time is invalid.",
    );

  const controlCreatedAt = requireValidDate(
    control.createdAt,
    "PILOT_CONTROL_PERSISTED_DATE_INVALID",
    "Persisted pilot control creation time is invalid.",
  );

  if (persistedControlledAt !== controlledAt) {
    deny(
      "PILOT_CONTROL_PERSISTED_DATE_INVALID",
      "Persisted pilot control time changed during persistence.",
      500,
    );
  }

  if (
    persistedEnrollment.id !== enrollmentId ||
    persistedEnrollment.tenantId !==
      workspace.tenant.id ||
    persistedEnrollment.ownerUserId !==
      workspace.actor.userId
  ) {
    deny(
      "PILOT_CONTROL_ENROLLMENT_IDENTITY_MISMATCH",
      "Updated pilot enrollment identities are invalid.",
      500,
    );
  }

  if (
    persistedEnrollment.enrollmentStatus !==
      newStatus
  ) {
    deny(
      "PILOT_CONTROL_ENROLLMENT_STATUS_MISMATCH",
      "Updated pilot enrollment status is invalid.",
      500,
    );
  }

  if (
    persistedEnrollment.accessMode !==
      "CONTROLLED_PILOT" ||
    persistedEnrollment.executionMode !==
      "SANDBOX_ONLY" ||
    persistedEnrollment.publicSignupAuthorized !==
      false ||
    persistedEnrollment
      .liveProviderExecutionAuthorized !== false
  ) {
    deny(
      "PILOT_CONTROL_ENROLLMENT_BOUNDARY_INVALID",
      "Updated pilot enrollment safety boundary is invalid.",
      500,
    );
  }

  const enrollmentUpdatedAt =
    requireValidDate(
      persistedEnrollment.updatedAt,
      "PILOT_CONTROL_ENROLLMENT_DATE_INVALID",
      "Updated pilot enrollment time is invalid.",
    );

  return freezeResult({
    outcome: persisted.outcome,

    control: {
      id: controlId,
      tenantId: workspace.tenant.id,
      enrollmentId,
      invitationId,
      action: input.action,
      reason,
      previousStatus: expectedCurrentStatus,
      newStatus,
      controlledAt: persistedControlledAt,
      createdAt: controlCreatedAt,
    },

    enrollment: {
      id: enrollmentId,
      status: newStatus,
      updatedAt: enrollmentUpdatedAt,
    },

    ownerAuthority: {
      ownerUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: "OWNER",
      explicitControlAction: true,
    },

    safetyBoundary: {
      atomicStatusChange: true,
      idempotentControl: true,
      immediateAccessEnforcement: true,
      executionMode: "SANDBOX_ONLY",
      publicSignupAuthorized: false,
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },

    pilotOperations: {
      accessStatus:
        newStatus === "ACTIVE"
          ? "READY"
          : "BLOCKED",
      operationStatus:
        newStatus === "ACTIVE"
          ? "ACTIVE"
          : "PAUSED",
    },
  });
}
