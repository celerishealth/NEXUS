import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export const CONTROLLED_PILOT_CAPABILITIES = [
  "PILOT_STATUS_READ",
  "INQUIRY_INTAKE",
  "AI_RECOMMENDATION",
  "OWNER_DECISION",
  "SANDBOX_EXECUTION",
  "RESULT_TRACKING",
  "EXECUTION_AUDIT_RECORDING",
  "SANDBOX_RECOVERY",
  "RECOVERY_AUDIT_RECORDING",
] as const;

export type ControlledPilotCapability =
  (typeof CONTROLLED_PILOT_CAPABILITIES)[number];

export type ActiveControlledPilotEnrollment =
  Readonly<{
    id: string;
    tenantId: string;
    invitationId: string;
    ownerUserId: string;
    enrollmentStatus: "ACTIVE" | "SUSPENDED" | "REVOKED";
    accessMode: "CONTROLLED_PILOT";
    executionMode: "SANDBOX_ONLY";
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    enrolledAt: string;
    createdAt: string;
  }>;

export type ControlledPilotAccessRepository =
  Readonly<{
    findEnrollmentByTenantId: (
      tenantId: string,
    ) => Promise<ActiveControlledPilotEnrollment | null>;
  }>;

export type EnforceAuthenticatedControlledPilotAccessInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    pilotAccessRepository:
      ControlledPilotAccessRepository;
    requestedTenantId?: string | null;
    requiredCapability: ControlledPilotCapability;
  }>;

export type AuthenticatedControlledPilotAccessResult =
  Readonly<{
    access: Readonly<{
      granted: true;
      tenantId: string;
      enrollmentId: string;
      invitationId: string;
      capability: ControlledPilotCapability;
      role: "OWNER" | "ADMIN" | "OPERATOR" | "VIEWER";
      userId: string;
      sessionId: string;
      accessMode: "CONTROLLED_PILOT";
      executionMode: "SANDBOX_ONLY";
    }>;

    enrollment: Readonly<{
      status: "ACTIVE";
      ownerUserId: string;
      enrolledAt: string;
      createdAt: string;
    }>;

    safetyBoundary: Readonly<{
      invitationOnly: true;
      tenantScoped: true;
      roleScoped: true;
      sandboxOnly: true;
      publicSignupAuthorized: false;
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;
  }>;

export type ControlledPilotAccessFailureCode =
  | "PILOT_ACCESS_REPOSITORY_MISCONFIGURED"
  | "PILOT_CAPABILITY_INVALID"
  | "PILOT_ROLE_NOT_AUTHORIZED"
  | "PILOT_ENROLLMENT_NOT_AVAILABLE"
  | "PILOT_ENROLLMENT_ID_REQUIRED"
  | "PILOT_ENROLLMENT_TENANT_MISMATCH"
  | "PILOT_ENROLLMENT_INVITATION_ID_REQUIRED"
  | "PILOT_ENROLLMENT_OWNER_MISMATCH"
  | "PILOT_ENROLLMENT_NOT_ACTIVE"
  | "PILOT_ACCESS_MODE_INVALID"
  | "PILOT_EXECUTION_MODE_INVALID"
  | "PILOT_PUBLIC_SIGNUP_BOUNDARY_INVALID"
  | "PILOT_LIVE_PROVIDER_BOUNDARY_INVALID"
  | "PILOT_ENROLLED_AT_INVALID"
  | "PILOT_CREATED_AT_INVALID"
  | "PILOT_ENROLLMENT_TIMELINE_INVALID";

export class ControlledPilotAccessDeniedError
  extends Error {
  readonly code: ControlledPilotAccessFailureCode;
  readonly status: number;

  constructor(
    code: ControlledPilotAccessFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name = "ControlledPilotAccessDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: ControlledPilotAccessFailureCode,
  message: string,
  status = 403,
): never {
  throw new ControlledPilotAccessDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: ControlledPilotAccessFailureCode,
  message: string,
  maximumLength = 128,
): string {
  if (typeof value !== "string") {
    deny(code, message, 500);
  }

  const normalized = value.trim();

  if (
    normalized.length < 1 ||
    normalized.length > maximumLength
  ) {
    deny(code, message, 500);
  }

  return normalized;
}

function requireValidDate(
  value: unknown,
  code: ControlledPilotAccessFailureCode,
  message: string,
): string {
  const normalized = requireText(
    value,
    code,
    message,
    64,
  );

  if (Number.isNaN(Date.parse(normalized))) {
    deny(code, message, 500);
  }

  return normalized;
}

function isControlledPilotCapability(
  value: unknown,
): value is ControlledPilotCapability {
  return (
    typeof value === "string" &&
    CONTROLLED_PILOT_CAPABILITIES.includes(
      value as ControlledPilotCapability,
    )
  );
}

function roleCanUseCapability(
  role: "OWNER" | "ADMIN" | "OPERATOR" | "VIEWER",
  capability: ControlledPilotCapability,
): boolean {
  if (capability === "PILOT_STATUS_READ") {
    return true;
  }

  if (role === "OWNER") {
    return true;
  }

  if (role === "VIEWER") {
    return false;
  }

  return (
    capability === "INQUIRY_INTAKE" ||
    capability === "AI_RECOMMENDATION" ||
    capability === "RESULT_TRACKING" ||
    capability === "EXECUTION_AUDIT_RECORDING"
  );
}

function freezeResult(
  result: AuthenticatedControlledPilotAccessResult,
): AuthenticatedControlledPilotAccessResult {
  Object.freeze(result.access);
  Object.freeze(result.enrollment);
  Object.freeze(result.safetyBoundary);

  return Object.freeze(result);
}

/**
 * Enforces access to controlled-pilot capabilities.
 *
 * Security properties:
 * - tenant identity comes only from authenticated context;
 * - tenant onboarding must already be complete;
 * - the tenant must have an ACTIVE controlled-pilot enrollment;
 * - enrollment owner must match the workspace owner;
 * - role and requested capability are checked before access is granted;
 * - owner-only operations remain inaccessible to ADMIN and OPERATOR;
 * - VIEWER receives only pilot status read access;
 * - live-provider execution, public signup and public launch remain disabled.
 */
export async function enforceAuthenticatedControlledPilotAccess(
  input: EnforceAuthenticatedControlledPilotAccessInput,
): Promise<AuthenticatedControlledPilotAccessResult> {
  const workspace =
    await buildAuthenticatedTenantWorkspace({
      principal: input.principal,
      accessRepositories: input.accessRepositories,
      workspaceRepository: input.workspaceRepository,
      requestedTenantId: input.requestedTenantId,
      requireOwner: false,
    });

  if (
    !input.pilotAccessRepository ||
    typeof input.pilotAccessRepository
      .findEnrollmentByTenantId !== "function"
  ) {
    deny(
      "PILOT_ACCESS_REPOSITORY_MISCONFIGURED",
      "Controlled-pilot access repository is not safely configured.",
      500,
    );
  }

  if (
    !isControlledPilotCapability(
      input.requiredCapability,
    )
  ) {
    deny(
      "PILOT_CAPABILITY_INVALID",
      "The requested controlled-pilot capability is invalid.",
      400,
    );
  }

  if (
    !roleCanUseCapability(
      workspace.actor.role,
      input.requiredCapability,
    )
  ) {
    deny(
      "PILOT_ROLE_NOT_AUTHORIZED",
      "The authenticated membership role is not authorized for this controlled-pilot capability.",
    );
  }

  const enrollment =
    await input.pilotAccessRepository
      .findEnrollmentByTenantId(
        workspace.tenant.id,
      );

  if (!enrollment) {
    deny(
      "PILOT_ENROLLMENT_NOT_AVAILABLE",
      "The tenant is not enrolled in the controlled pilot.",
    );
  }

  const enrollmentId = requireText(
    enrollment.id,
    "PILOT_ENROLLMENT_ID_REQUIRED",
    "Controlled-pilot enrollment identity is required.",
  );

  if (enrollment.tenantId !== workspace.tenant.id) {
    deny(
      "PILOT_ENROLLMENT_TENANT_MISMATCH",
      "The controlled-pilot enrollment belongs to another tenant.",
    );
  }

  const invitationId = requireText(
    enrollment.invitationId,
    "PILOT_ENROLLMENT_INVITATION_ID_REQUIRED",
    "Controlled-pilot invitation identity is required.",
  );

  if (
    enrollment.ownerUserId !==
    workspace.actor.userId
  ) {
    deny(
      "PILOT_ENROLLMENT_OWNER_MISMATCH",
      "The controlled-pilot enrollment owner does not match the authenticated owner.",
    );
  }

  if (enrollment.enrollmentStatus !== "ACTIVE") {
    deny(
      "PILOT_ENROLLMENT_NOT_ACTIVE",
      "The controlled-pilot enrollment is not active.",
    );
  }

  if (
    enrollment.accessMode !==
    "CONTROLLED_PILOT"
  ) {
    deny(
      "PILOT_ACCESS_MODE_INVALID",
      "The enrollment does not authorize controlled-pilot access.",
    );
  }

  if (
    enrollment.executionMode !==
    "SANDBOX_ONLY"
  ) {
    deny(
      "PILOT_EXECUTION_MODE_INVALID",
      "The controlled pilot must remain sandbox-only.",
    );
  }

  if (
    enrollment.publicSignupAuthorized !== false
  ) {
    deny(
      "PILOT_PUBLIC_SIGNUP_BOUNDARY_INVALID",
      "Public signup is not authorized for the controlled pilot.",
    );
  }

  if (
    enrollment.liveProviderExecutionAuthorized !==
    false
  ) {
    deny(
      "PILOT_LIVE_PROVIDER_BOUNDARY_INVALID",
      "Live-provider execution is not authorized for the controlled pilot.",
    );
  }

  const enrolledAt = requireValidDate(
    enrollment.enrolledAt,
    "PILOT_ENROLLED_AT_INVALID",
    "Controlled-pilot enrollment time is invalid.",
  );

  const createdAt = requireValidDate(
    enrollment.createdAt,
    "PILOT_CREATED_AT_INVALID",
    "Controlled-pilot creation time is invalid.",
  );

  if (Date.parse(createdAt) < Date.parse(enrolledAt)) {
    deny(
      "PILOT_ENROLLMENT_TIMELINE_INVALID",
      "Controlled-pilot enrollment timeline is invalid.",
      500,
    );
  }

  return freezeResult({
    access: {
      granted: true,
      tenantId: workspace.tenant.id,
      enrollmentId,
      invitationId,
      capability: input.requiredCapability,
      role: workspace.actor.role,
      userId: workspace.actor.userId,
      sessionId: workspace.actor.sessionId,
      accessMode: "CONTROLLED_PILOT",
      executionMode: "SANDBOX_ONLY",
    },

    enrollment: {
      status: "ACTIVE",
      ownerUserId: enrollment.ownerUserId,
      enrolledAt,
      createdAt,
    },

    safetyBoundary: {
      invitationOnly: true,
      tenantScoped: true,
      roleScoped: true,
      sandboxOnly: true,
      publicSignupAuthorized: false,
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
  });
}
