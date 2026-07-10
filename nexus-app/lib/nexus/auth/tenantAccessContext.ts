export const TENANT_ROLES = [
  "OWNER",
  "ADMIN",
  "OPERATOR",
  "VIEWER",
] as const;

export type TenantRole = (typeof TENANT_ROLES)[number];

export type TenantLifecycleStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "DISABLED";

export type TenantOnboardingStatus =
  | "COMPLETE"
  | "PENDING"
  | "FAILED";

export type TenantMembershipStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "REVOKED";

export type AuthenticatedPrincipal = Readonly<{
  userId: string;
  tenantId: string;
  sessionId: string;
}>;

export type TenantAccessRecord = Readonly<{
  id: string;
  status: TenantLifecycleStatus;
  onboardingStatus: TenantOnboardingStatus;
}>;

export type TenantMembershipRecord = Readonly<{
  userId: string;
  tenantId: string;
  role: TenantRole;
  status: TenantMembershipStatus;
}>;

export type TenantAccessRepositories = Readonly<{
  findTenantById: (
    tenantId: string,
  ) => Promise<TenantAccessRecord | null>;

  findMembership: (
    tenantId: string,
    userId: string,
  ) => Promise<TenantMembershipRecord | null>;
}>;

export type ResolveTenantAccessContextInput = Readonly<{
  principal: AuthenticatedPrincipal | null | undefined;
  repositories: TenantAccessRepositories;
  requireOwner?: boolean;
}>;

export type AuthenticatedTenantAccessContext = Readonly<{
  userId: string;
  tenantId: string;
  sessionId: string;
  role: TenantRole;
  ownerAuthorized: boolean;
}>;

export type TenantAccessFailureCode =
  | "AUTHENTICATED_PRINCIPAL_REQUIRED"
  | "AUTHENTICATED_USER_ID_REQUIRED"
  | "AUTHENTICATED_TENANT_ID_REQUIRED"
  | "AUTHENTICATED_SESSION_ID_REQUIRED"
  | "TENANT_ACCESS_REPOSITORY_MISCONFIGURED"
  | "TENANT_NOT_AVAILABLE"
  | "TENANT_IDENTITY_MISMATCH"
  | "TENANT_NOT_ACTIVE"
  | "TENANT_ONBOARDING_INCOMPLETE"
  | "TENANT_MEMBERSHIP_NOT_AVAILABLE"
  | "TENANT_MEMBERSHIP_IDENTITY_MISMATCH"
  | "TENANT_MEMBERSHIP_NOT_ACTIVE"
  | "TENANT_MEMBERSHIP_ROLE_INVALID"
  | "OWNER_AUTHORITY_REQUIRED";

export class TenantAccessDeniedError extends Error {
  readonly code: TenantAccessFailureCode;
  readonly status: number;

  constructor(
    code: TenantAccessFailureCode,
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "TenantAccessDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: TenantAccessFailureCode,
  message: string,
  status = 403,
): never {
  throw new TenantAccessDeniedError(code, message, status);
}

function requireIdentifier(
  value: unknown,
  code: TenantAccessFailureCode,
  message: string,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    deny(code, message, 401);
  }

  return value.trim();
}

function isTenantRole(value: unknown): value is TenantRole {
  return (
    typeof value === "string" &&
    TENANT_ROLES.includes(value as TenantRole)
  );
}

/**
 * Resolves the immutable tenant context for an already authenticated session.
 *
 * The resolver is deliberately fail-closed:
 * - no principal means no access;
 * - tenant onboarding must be complete;
 * - tenant and membership must both be active;
 * - membership identity must exactly match the authenticated claims;
 * - owner-only operations must receive explicit OWNER authority.
 *
 * This function does not trust request headers, client-supplied roles,
 * tenant selectors or UI state.
 */
export async function resolveAuthenticatedTenantAccessContext(
  input: ResolveTenantAccessContextInput,
): Promise<AuthenticatedTenantAccessContext> {
  if (!input?.principal) {
    deny(
      "AUTHENTICATED_PRINCIPAL_REQUIRED",
      "An authenticated principal is required.",
      401,
    );
  }

  const repositories = input.repositories;

  if (
    !repositories ||
    typeof repositories.findTenantById !== "function" ||
    typeof repositories.findMembership !== "function"
  ) {
    deny(
      "TENANT_ACCESS_REPOSITORY_MISCONFIGURED",
      "Tenant access repositories are not safely configured.",
      500,
    );
  }

  const userId = requireIdentifier(
    input.principal.userId,
    "AUTHENTICATED_USER_ID_REQUIRED",
    "The authenticated user identity is required.",
  );

  const tenantId = requireIdentifier(
    input.principal.tenantId,
    "AUTHENTICATED_TENANT_ID_REQUIRED",
    "The authenticated tenant identity is required.",
  );

  const sessionId = requireIdentifier(
    input.principal.sessionId,
    "AUTHENTICATED_SESSION_ID_REQUIRED",
    "The authenticated session identity is required.",
  );

  const tenant = await repositories.findTenantById(tenantId);

  if (!tenant) {
    deny(
      "TENANT_NOT_AVAILABLE",
      "The authenticated tenant is not available.",
    );
  }

  if (tenant.id !== tenantId) {
    deny(
      "TENANT_IDENTITY_MISMATCH",
      "The resolved tenant does not match the authenticated tenant.",
    );
  }

  if (tenant.status !== "ACTIVE") {
    deny(
      "TENANT_NOT_ACTIVE",
      "The authenticated tenant is not active.",
    );
  }

  if (tenant.onboardingStatus !== "COMPLETE") {
    deny(
      "TENANT_ONBOARDING_INCOMPLETE",
      "Tenant onboarding is not complete.",
    );
  }

  const membership = await repositories.findMembership(
    tenantId,
    userId,
  );

  if (!membership) {
    deny(
      "TENANT_MEMBERSHIP_NOT_AVAILABLE",
      "An active tenant membership is required.",
    );
  }

  if (
    membership.tenantId !== tenantId ||
    membership.userId !== userId
  ) {
    deny(
      "TENANT_MEMBERSHIP_IDENTITY_MISMATCH",
      "Tenant membership does not match the authenticated identity.",
    );
  }

  if (membership.status !== "ACTIVE") {
    deny(
      "TENANT_MEMBERSHIP_NOT_ACTIVE",
      "Tenant membership is not active.",
    );
  }

  if (!isTenantRole(membership.role)) {
    deny(
      "TENANT_MEMBERSHIP_ROLE_INVALID",
      "Tenant membership role is invalid.",
    );
  }

  const ownerAuthorized = membership.role === "OWNER";

  if (input.requireOwner === true && !ownerAuthorized) {
    deny(
      "OWNER_AUTHORITY_REQUIRED",
      "Explicit tenant owner authority is required.",
    );
  }

  return Object.freeze({
    userId,
    tenantId,
    sessionId,
    role: membership.role,
    ownerAuthorized,
  });
}
