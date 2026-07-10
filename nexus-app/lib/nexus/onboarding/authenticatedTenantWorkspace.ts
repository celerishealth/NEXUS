import {
  resolveAuthenticatedTenantAccessContext,
  type AuthenticatedPrincipal,
  type TenantAccessRepositories,
  type TenantRole,
} from "../auth/tenantAccessContext";

export type TenantWorkspaceStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "DISABLED";

export type TenantWorkspaceOnboardingStatus =
  | "COMPLETE"
  | "PENDING"
  | "FAILED";

export type TenantWorkspaceRecord = Readonly<{
  tenantId: string;
  ownerUserId: string;
  businessName: string;
  businessSlug: string;
  status: TenantWorkspaceStatus;
  onboardingStatus: TenantWorkspaceOnboardingStatus;
  timezone: string;
  locale: string;
}>;

export type TenantWorkspaceRepository = Readonly<{
  findWorkspaceByTenantId: (
    tenantId: string,
  ) => Promise<TenantWorkspaceRecord | null>;
}>;

export type BuildAuthenticatedTenantWorkspaceInput = Readonly<{
  principal: AuthenticatedPrincipal | null | undefined;
  accessRepositories: TenantAccessRepositories;
  workspaceRepository: TenantWorkspaceRepository;
  requestedTenantId?: string | null;
  requireOwner?: boolean;
}>;

export type AuthenticatedTenantWorkspace = Readonly<{
  tenant: Readonly<{
    id: string;
    businessName: string;
    businessSlug: string;
    timezone: string;
    locale: string;
  }>;

  actor: Readonly<{
    userId: string;
    sessionId: string;
    role: TenantRole;
    ownerAuthorized: boolean;
  }>;

  authority: Readonly<{
    canManageTenant: boolean;
    ownerApprovalRequiredForExecution: true;
  }>;

  operationalBoundary: Readonly<{
    executionMode: "SANDBOX_ONLY";
    publicLaunchAuthorized: false;
    liveProviderExecutionAuthorized: false;
  }>;
}>;

export type TenantWorkspaceFailureCode =
  | "REQUESTED_TENANT_ID_INVALID"
  | "CROSS_TENANT_WORKSPACE_ACCESS_DENIED"
  | "TENANT_WORKSPACE_REPOSITORY_MISCONFIGURED"
  | "TENANT_WORKSPACE_NOT_AVAILABLE"
  | "TENANT_WORKSPACE_IDENTITY_MISMATCH"
  | "TENANT_WORKSPACE_NOT_ACTIVE"
  | "TENANT_WORKSPACE_ONBOARDING_INCOMPLETE"
  | "TENANT_WORKSPACE_OWNER_ID_REQUIRED"
  | "TENANT_WORKSPACE_OWNER_IDENTITY_MISMATCH"
  | "TENANT_WORKSPACE_BUSINESS_NAME_REQUIRED"
  | "TENANT_WORKSPACE_BUSINESS_SLUG_REQUIRED"
  | "TENANT_WORKSPACE_TIMEZONE_REQUIRED"
  | "TENANT_WORKSPACE_LOCALE_REQUIRED";

export class TenantWorkspaceDeniedError extends Error {
  readonly code: TenantWorkspaceFailureCode;
  readonly status: number;

  constructor(
    code: TenantWorkspaceFailureCode,
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "TenantWorkspaceDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: TenantWorkspaceFailureCode,
  message: string,
  status = 403,
): never {
  throw new TenantWorkspaceDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: TenantWorkspaceFailureCode,
  message: string,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    deny(code, message);
  }

  return value.trim();
}

function freezeWorkspace(
  workspace: AuthenticatedTenantWorkspace,
): AuthenticatedTenantWorkspace {
  Object.freeze(workspace.tenant);
  Object.freeze(workspace.actor);
  Object.freeze(workspace.authority);
  Object.freeze(workspace.operationalBoundary);

  return Object.freeze(workspace);
}

/**
 * Builds the authenticated tenant workspace after real authentication and
 * atomic onboarding have succeeded.
 *
 * Security properties:
 * - tenant identity comes from the authenticated principal;
 * - client-selected cross-tenant workspace access is rejected;
 * - tenant access and membership are revalidated fail-closed;
 * - workspace tenant and owner identities must match persisted authority;
 * - onboarding must be complete at both access and workspace boundaries;
 * - public launch and live-provider execution remain disabled.
 */
export async function buildAuthenticatedTenantWorkspace(
  input: BuildAuthenticatedTenantWorkspaceInput,
): Promise<AuthenticatedTenantWorkspace> {
  const requestedTenantId =
    input.requestedTenantId === undefined ||
    input.requestedTenantId === null
      ? null
      : requireText(
          input.requestedTenantId,
          "REQUESTED_TENANT_ID_INVALID",
          "Requested tenant identity is invalid.",
        );

  const context =
    await resolveAuthenticatedTenantAccessContext({
      principal: input.principal,
      repositories: input.accessRepositories,
      requireOwner: input.requireOwner,
    });

  if (
    requestedTenantId !== null &&
    requestedTenantId !== context.tenantId
  ) {
    deny(
      "CROSS_TENANT_WORKSPACE_ACCESS_DENIED",
      "The requested workspace does not match the authenticated tenant.",
    );
  }

  if (
    !input.workspaceRepository ||
    typeof input.workspaceRepository
      .findWorkspaceByTenantId !== "function"
  ) {
    deny(
      "TENANT_WORKSPACE_REPOSITORY_MISCONFIGURED",
      "Tenant workspace repository is not safely configured.",
      500,
    );
  }

  const workspace =
    await input.workspaceRepository.findWorkspaceByTenantId(
      context.tenantId,
    );

  if (!workspace) {
    deny(
      "TENANT_WORKSPACE_NOT_AVAILABLE",
      "The authenticated tenant workspace is not available.",
    );
  }

  if (workspace.tenantId !== context.tenantId) {
    deny(
      "TENANT_WORKSPACE_IDENTITY_MISMATCH",
      "The resolved workspace does not match the authenticated tenant.",
    );
  }

  if (workspace.status !== "ACTIVE") {
    deny(
      "TENANT_WORKSPACE_NOT_ACTIVE",
      "The authenticated tenant workspace is not active.",
    );
  }

  if (workspace.onboardingStatus !== "COMPLETE") {
    deny(
      "TENANT_WORKSPACE_ONBOARDING_INCOMPLETE",
      "Tenant workspace onboarding is not complete.",
    );
  }

  const ownerUserId = requireText(
    workspace.ownerUserId,
    "TENANT_WORKSPACE_OWNER_ID_REQUIRED",
    "Tenant workspace owner identity is required.",
  );

  if (
    context.ownerAuthorized &&
    ownerUserId !== context.userId
  ) {
    deny(
      "TENANT_WORKSPACE_OWNER_IDENTITY_MISMATCH",
      "Authenticated owner identity does not match the tenant workspace owner.",
    );
  }

  const businessName = requireText(
    workspace.businessName,
    "TENANT_WORKSPACE_BUSINESS_NAME_REQUIRED",
    "Tenant workspace business name is required.",
  );

  const businessSlug = requireText(
    workspace.businessSlug,
    "TENANT_WORKSPACE_BUSINESS_SLUG_REQUIRED",
    "Tenant workspace business slug is required.",
  );

  const timezone = requireText(
    workspace.timezone,
    "TENANT_WORKSPACE_TIMEZONE_REQUIRED",
    "Tenant workspace timezone is required.",
  );

  const locale = requireText(
    workspace.locale,
    "TENANT_WORKSPACE_LOCALE_REQUIRED",
    "Tenant workspace locale is required.",
  );

  return freezeWorkspace({
    tenant: {
      id: context.tenantId,
      businessName,
      businessSlug,
      timezone,
      locale,
    },

    actor: {
      userId: context.userId,
      sessionId: context.sessionId,
      role: context.role,
      ownerAuthorized: context.ownerAuthorized,
    },

    authority: {
      canManageTenant: context.ownerAuthorized,
      ownerApprovalRequiredForExecution: true,
    },

    operationalBoundary: {
      executionMode: "SANDBOX_ONLY",
      publicLaunchAuthorized: false,
      liveProviderExecutionAuthorized: false,
    },
  });
}
