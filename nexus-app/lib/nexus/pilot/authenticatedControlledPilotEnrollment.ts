import { createHash } from "node:crypto";

import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export type ControlledPilotInvitation = Readonly<{
  id: string;
  tenantId: string;
  tokenDigest: string;
  status: "ACTIVE" | "REVOKED";
  expiresAt: string;
}>;

export type ControlledPilotReadiness = Readonly<{
  tenantId: string;
  authenticationStatus: "REAL";
  onboardingStatus: "COMPLETE";
  verticalSliceStatus: "COMPLETE";
  securityGateStatus: "PASSED";
}>;

export type ControlledPilotEligibilitySnapshot =
  Readonly<{
    invitation: ControlledPilotInvitation;
    readiness: ControlledPilotReadiness;
  }>;

export type ControlledPilotEligibilityRepository =
  Readonly<{
    findEligibilityByTenantAndInvitationDigest: (
      tenantId: string,
      tokenDigest: string,
    ) => Promise<ControlledPilotEligibilitySnapshot | null>;
  }>;

export type ControlledPilotEnrollmentPersistenceInput =
  Readonly<{
    tenantId: string;
    invitationId: string;
    invitationTokenDigest: string;
    ownerUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    enrollmentStatus: "ACTIVE";
    accessMode: "CONTROLLED_PILOT";
    executionMode: "SANDBOX_ONLY";
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    enrolledAt: string;
  }>;

export type PersistedControlledPilotEnrollment =
  Readonly<{
    id: string;
    tenantId: string;
    invitationId: string;
    invitationTokenDigest: string;
    ownerUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    enrollmentStatus: "ACTIVE";
    accessMode: "CONTROLLED_PILOT";
    executionMode: "SANDBOX_ONLY";
    publicSignupAuthorized: false;
    liveProviderExecutionAuthorized: false;
    enrolledAt: string;
    createdAt: string;
  }>;

export type ControlledPilotEnrollmentPersistenceResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";
    enrollment: PersistedControlledPilotEnrollment;
  }>;

export type ControlledPilotEnrollmentRepository =
  Readonly<{
    createOrGetEnrollment: (
      input: ControlledPilotEnrollmentPersistenceInput,
    ) => Promise<ControlledPilotEnrollmentPersistenceResult>;
  }>;

export type EnrollAuthenticatedControlledPilotInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    eligibilityRepository:
      ControlledPilotEligibilityRepository;
    enrollmentRepository:
      ControlledPilotEnrollmentRepository;
    requestedTenantId?: string | null;
    invitationToken: string;
    idempotencyKey: string;
  }>;

export type AuthenticatedControlledPilotEnrollmentResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";

    enrollment: Readonly<{
      id: string;
      tenantId: string;
      invitationId: string;
      enrollmentStatus: "ACTIVE";
      accessMode: "CONTROLLED_PILOT";
      enrolledAt: string;
      createdAt: string;
    }>;

    ownerAuthority: Readonly<{
      ownerUserId: string;
      sourceSessionId: string;
      role: "OWNER";
      explicitlyEnrolled: true;
    }>;

    readinessEvidence: Readonly<{
      authenticationStatus: "REAL";
      onboardingStatus: "COMPLETE";
      verticalSliceStatus: "COMPLETE";
      securityGateStatus: "PASSED";
    }>;

    safetyBoundary: Readonly<{
      invitationOnly: true;
      publicSignupAuthorized: false;
      executionMode: "SANDBOX_ONLY";
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;

    nextBoundary: Readonly<{
      controlledPilotStatus: "ACTIVE";
      pilotOperationsStatus: "READY";
    }>;
  }>;

export type ControlledPilotEnrollmentFailureCode =
  | "PILOT_ELIGIBILITY_REPOSITORY_MISCONFIGURED"
  | "PILOT_ENROLLMENT_REPOSITORY_MISCONFIGURED"
  | "PILOT_INVITATION_TOKEN_REQUIRED"
  | "PILOT_INVITATION_TOKEN_INVALID"
  | "PILOT_IDEMPOTENCY_KEY_REQUIRED"
  | "PILOT_IDEMPOTENCY_KEY_INVALID"
  | "PILOT_INVITATION_NOT_AVAILABLE"
  | "PILOT_INVITATION_TENANT_MISMATCH"
  | "PILOT_INVITATION_DIGEST_MISMATCH"
  | "PILOT_INVITATION_NOT_ACTIVE"
  | "PILOT_INVITATION_EXPIRY_INVALID"
  | "PILOT_INVITATION_EXPIRED"
  | "PILOT_READINESS_TENANT_MISMATCH"
  | "PILOT_AUTHENTICATION_NOT_READY"
  | "PILOT_ONBOARDING_NOT_READY"
  | "PILOT_VERTICAL_SLICE_NOT_READY"
  | "PILOT_SECURITY_GATE_NOT_PASSED"
  | "PILOT_ENROLLMENT_PERSISTENCE_RESULT_INVALID"
  | "PILOT_ENROLLMENT_PERSISTED_ID_REQUIRED"
  | "PILOT_ENROLLMENT_PERSISTED_IDENTITY_MISMATCH"
  | "PILOT_ENROLLMENT_PERSISTED_STATUS_INVALID"
  | "PILOT_ENROLLMENT_PERSISTED_BOUNDARY_INVALID"
  | "PILOT_ENROLLMENT_PERSISTED_DATE_INVALID";

export class ControlledPilotEnrollmentDeniedError
  extends Error {
  readonly code:
    ControlledPilotEnrollmentFailureCode;

  readonly status: number;

  constructor(
    code: ControlledPilotEnrollmentFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name =
      "ControlledPilotEnrollmentDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: ControlledPilotEnrollmentFailureCode,
  message: string,
  status = 403,
): never {
  throw new ControlledPilotEnrollmentDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: ControlledPilotEnrollmentFailureCode,
  message: string,
  minimumLength = 1,
  maximumLength = 512,
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

function normalizeInvitationToken(
  value: unknown,
): string {
  const normalized = requireText(
    value,
    "PILOT_INVITATION_TOKEN_REQUIRED",
    "A controlled-pilot invitation token is required.",
    16,
    512,
  );

  if (/\s/.test(normalized)) {
    deny(
      "PILOT_INVITATION_TOKEN_INVALID",
      "The controlled-pilot invitation token is invalid.",
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
    "PILOT_IDEMPOTENCY_KEY_REQUIRED",
    "A controlled-pilot enrollment idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "PILOT_IDEMPOTENCY_KEY_INVALID",
      "The controlled-pilot enrollment idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function hashInvitationToken(
  token: string,
): string {
  return createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}

function requireValidDate(
  value: unknown,
  code: ControlledPilotEnrollmentFailureCode,
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
  result: AuthenticatedControlledPilotEnrollmentResult,
): AuthenticatedControlledPilotEnrollmentResult {
  Object.freeze(result.enrollment);
  Object.freeze(result.ownerAuthority);
  Object.freeze(result.readinessEvidence);
  Object.freeze(result.safetyBoundary);
  Object.freeze(result.nextBoundary);

  return Object.freeze(result);
}

/**
 * Enrolls one authenticated tenant owner into the invitation-only,
 * sandbox-only controlled pilot.
 *
 * Safety properties:
 * - requires current authenticated tenant OWNER authority;
 * - invitation token is hashed before repository lookup or persistence;
 * - invitation must be tenant-specific, active and unexpired;
 * - real authentication and tenant onboarding must be complete;
 * - customer vertical slice must be complete;
 * - consolidated security gate must have passed;
 * - enrollment is atomic and idempotent;
 * - public signup, public launch and live-provider execution remain disabled.
 */
export async function enrollAuthenticatedControlledPilot(
  input: EnrollAuthenticatedControlledPilotInput,
): Promise<AuthenticatedControlledPilotEnrollmentResult> {
  const workspace =
    await buildAuthenticatedTenantWorkspace({
      principal: input.principal,
      accessRepositories: input.accessRepositories,
      workspaceRepository: input.workspaceRepository,
      requestedTenantId: input.requestedTenantId,
      requireOwner: true,
    });

  if (
    !input.eligibilityRepository ||
    typeof input.eligibilityRepository
      .findEligibilityByTenantAndInvitationDigest !==
      "function"
  ) {
    deny(
      "PILOT_ELIGIBILITY_REPOSITORY_MISCONFIGURED",
      "Controlled-pilot eligibility repository is not safely configured.",
      500,
    );
  }

  if (
    !input.enrollmentRepository ||
    typeof input.enrollmentRepository
      .createOrGetEnrollment !== "function"
  ) {
    deny(
      "PILOT_ENROLLMENT_REPOSITORY_MISCONFIGURED",
      "Controlled-pilot enrollment repository is not safely configured.",
      500,
    );
  }

  const invitationToken =
    normalizeInvitationToken(
      input.invitationToken,
    );

  const invitationTokenDigest =
    hashInvitationToken(invitationToken);

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  const eligibility =
    await input.eligibilityRepository
      .findEligibilityByTenantAndInvitationDigest(
        workspace.tenant.id,
        invitationTokenDigest,
      );

  if (!eligibility) {
    deny(
      "PILOT_INVITATION_NOT_AVAILABLE",
      "No active controlled-pilot invitation is available to this tenant.",
    );
  }

  const invitation = eligibility.invitation;
  const readiness = eligibility.readiness;

  const invitationId = requireText(
    invitation.id,
    "PILOT_INVITATION_NOT_AVAILABLE",
    "Controlled-pilot invitation identity is invalid.",
    1,
    128,
  );

  if (invitation.tenantId !== workspace.tenant.id) {
    deny(
      "PILOT_INVITATION_TENANT_MISMATCH",
      "The controlled-pilot invitation belongs to another tenant.",
    );
  }

  if (
    invitation.tokenDigest !==
    invitationTokenDigest
  ) {
    deny(
      "PILOT_INVITATION_DIGEST_MISMATCH",
      "The controlled-pilot invitation token does not match.",
    );
  }

  if (invitation.status !== "ACTIVE") {
    deny(
      "PILOT_INVITATION_NOT_ACTIVE",
      "The controlled-pilot invitation is not active.",
    );
  }

  const expiresAt = requireValidDate(
    invitation.expiresAt,
    "PILOT_INVITATION_EXPIRY_INVALID",
    "Controlled-pilot invitation expiry is invalid.",
  );

  const enrolledAt = new Date().toISOString();

  if (
    Date.parse(expiresAt) <=
    Date.parse(enrolledAt)
  ) {
    deny(
      "PILOT_INVITATION_EXPIRED",
      "The controlled-pilot invitation has expired.",
    );
  }

  if (readiness.tenantId !== workspace.tenant.id) {
    deny(
      "PILOT_READINESS_TENANT_MISMATCH",
      "Controlled-pilot readiness belongs to another tenant.",
    );
  }

  if (
    readiness.authenticationStatus !== "REAL"
  ) {
    deny(
      "PILOT_AUTHENTICATION_NOT_READY",
      "Real authentication is not ready for the controlled pilot.",
    );
  }

  if (
    readiness.onboardingStatus !== "COMPLETE"
  ) {
    deny(
      "PILOT_ONBOARDING_NOT_READY",
      "Tenant onboarding is not complete for the controlled pilot.",
    );
  }

  if (
    readiness.verticalSliceStatus !== "COMPLETE"
  ) {
    deny(
      "PILOT_VERTICAL_SLICE_NOT_READY",
      "The customer vertical slice is not complete for the controlled pilot.",
    );
  }

  if (
    readiness.securityGateStatus !== "PASSED"
  ) {
    deny(
      "PILOT_SECURITY_GATE_NOT_PASSED",
      "The controlled-pilot security gate has not passed.",
    );
  }

  const persisted =
    await input.enrollmentRepository
      .createOrGetEnrollment({
        tenantId: workspace.tenant.id,
        invitationId,
        invitationTokenDigest,
        ownerUserId: workspace.actor.userId,
        sourceSessionId: workspace.actor.sessionId,
        idempotencyKey,
        enrollmentStatus: "ACTIVE",
        accessMode: "CONTROLLED_PILOT",
        executionMode: "SANDBOX_ONLY",
        publicSignupAuthorized: false,
        liveProviderExecutionAuthorized: false,
        enrolledAt,
      });

  if (
    !persisted ||
    (
      persisted.outcome !== "CREATED" &&
      persisted.outcome !== "EXISTING"
    ) ||
    !persisted.enrollment
  ) {
    deny(
      "PILOT_ENROLLMENT_PERSISTENCE_RESULT_INVALID",
      "Controlled-pilot enrollment persistence returned an invalid result.",
      500,
    );
  }

  const enrollment = persisted.enrollment;

  const enrollmentId = requireText(
    enrollment.id,
    "PILOT_ENROLLMENT_PERSISTED_ID_REQUIRED",
    "Persisted controlled-pilot enrollment identity is required.",
    1,
    128,
  );

  if (
    enrollment.tenantId !== workspace.tenant.id ||
    enrollment.invitationId !== invitationId ||
    enrollment.invitationTokenDigest !==
      invitationTokenDigest ||
    enrollment.ownerUserId !==
      workspace.actor.userId ||
    enrollment.sourceSessionId !==
      workspace.actor.sessionId ||
    enrollment.idempotencyKey !== idempotencyKey
  ) {
    deny(
      "PILOT_ENROLLMENT_PERSISTED_IDENTITY_MISMATCH",
      "Persisted controlled-pilot enrollment identities are invalid.",
      500,
    );
  }

  if (
    enrollment.enrollmentStatus !== "ACTIVE" ||
    enrollment.accessMode !==
      "CONTROLLED_PILOT"
  ) {
    deny(
      "PILOT_ENROLLMENT_PERSISTED_STATUS_INVALID",
      "Persisted controlled-pilot enrollment status is invalid.",
      500,
    );
  }

  if (
    enrollment.executionMode !==
      "SANDBOX_ONLY" ||
    enrollment.publicSignupAuthorized !== false ||
    enrollment.liveProviderExecutionAuthorized !==
      false
  ) {
    deny(
      "PILOT_ENROLLMENT_PERSISTED_BOUNDARY_INVALID",
      "Persisted controlled-pilot safety boundaries are invalid.",
      500,
    );
  }

  const persistedEnrolledAt = requireValidDate(
    enrollment.enrolledAt,
    "PILOT_ENROLLMENT_PERSISTED_DATE_INVALID",
    "Persisted controlled-pilot enrollment time is invalid.",
  );

  const createdAt = requireValidDate(
    enrollment.createdAt,
    "PILOT_ENROLLMENT_PERSISTED_DATE_INVALID",
    "Persisted controlled-pilot creation time is invalid.",
  );

  if (persistedEnrolledAt !== enrolledAt) {
    deny(
      "PILOT_ENROLLMENT_PERSISTED_DATE_INVALID",
      "Persisted controlled-pilot enrollment time changed during persistence.",
      500,
    );
  }

  return freezeResult({
    outcome: persisted.outcome,

    enrollment: {
      id: enrollmentId,
      tenantId: workspace.tenant.id,
      invitationId,
      enrollmentStatus: "ACTIVE",
      accessMode: "CONTROLLED_PILOT",
      enrolledAt: persistedEnrolledAt,
      createdAt,
    },

    ownerAuthority: {
      ownerUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: "OWNER",
      explicitlyEnrolled: true,
    },

    readinessEvidence: {
      authenticationStatus: "REAL",
      onboardingStatus: "COMPLETE",
      verticalSliceStatus: "COMPLETE",
      securityGateStatus: "PASSED",
    },

    safetyBoundary: {
      invitationOnly: true,
      publicSignupAuthorized: false,
      executionMode: "SANDBOX_ONLY",
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },

    nextBoundary: {
      controlledPilotStatus: "ACTIVE",
      pilotOperationsStatus: "READY",
    },
  });
}
