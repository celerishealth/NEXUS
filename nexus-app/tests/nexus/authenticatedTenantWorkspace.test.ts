import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAuthenticatedTenantWorkspace,
  TenantWorkspaceDeniedError,
  type BuildAuthenticatedTenantWorkspaceInput,
} from "../../lib/nexus/onboarding/authenticatedTenantWorkspace";

function validInput(
  overrides: Partial<BuildAuthenticatedTenantWorkspaceInput> = {},
): BuildAuthenticatedTenantWorkspaceInput {
  return {
    principal: {
      userId: "owner-user-1",
      tenantId: "tenant-1",
      sessionId: "session-1",
    },

    accessRepositories: {
      async findTenantById(tenantId) {
        return {
          id: tenantId,
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
        };
      },

      async findMembership(tenantId, userId) {
        return {
          tenantId,
          userId,
          role: "OWNER",
          status: "ACTIVE",
        };
      },
    },

    workspaceRepository: {
      async findWorkspaceByTenantId(tenantId) {
        return {
          tenantId,
          ownerUserId: "owner-user-1",
          businessName: "NEXUS Test Business",
          businessSlug: "nexus-test-business",
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
          timezone: "Europe/Amsterdam",
          locale: "en-NL",
        };
      },
    },

    requireOwner: true,
    ...overrides,
  };
}

async function expectWorkspaceDenied(
  input: BuildAuthenticatedTenantWorkspaceInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () => buildAuthenticatedTenantWorkspace(input),
    (error: unknown) => {
      assert.ok(
        error instanceof TenantWorkspaceDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("builds an immutable authenticated owner workspace", async () => {
  const workspace =
    await buildAuthenticatedTenantWorkspace(
      validInput({
        requestedTenantId: "tenant-1",
      }),
    );

  assert.deepEqual(workspace, {
    tenant: {
      id: "tenant-1",
      ownerUserId: "owner-user-1",
      businessName: "NEXUS Test Business",
      businessSlug: "nexus-test-business",
      timezone: "Europe/Amsterdam",
      locale: "en-NL",
    },

    actor: {
      userId: "owner-user-1",
      sessionId: "session-1",
      role: "OWNER",
      ownerAuthorized: true,
    },

    authority: {
      canManageTenant: true,
      ownerApprovalRequiredForExecution: true,
    },

    operationalBoundary: {
      executionMode: "SANDBOX_ONLY",
      publicLaunchAuthorized: false,
      liveProviderExecutionAuthorized: false,
    },
  });

  assert.equal(Object.isFrozen(workspace), true);
  assert.equal(Object.isFrozen(workspace.tenant), true);
  assert.equal(Object.isFrozen(workspace.actor), true);
  assert.equal(Object.isFrozen(workspace.authority), true);
  assert.equal(
    Object.isFrozen(workspace.operationalBoundary),
    true,
  );
});

test("rejects a client-selected cross-tenant workspace", async () => {
  let workspaceReads = 0;

  const input = validInput({
    requestedTenantId: "tenant-attacker",

    workspaceRepository: {
      async findWorkspaceByTenantId(tenantId) {
        workspaceReads += 1;

        return {
          tenantId,
          ownerUserId: "owner-user-1",
          businessName: "NEXUS Test Business",
          businessSlug: "nexus-test-business",
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
          timezone: "Europe/Amsterdam",
          locale: "en-NL",
        };
      },
    },
  });

  await expectWorkspaceDenied(
    input,
    "CROSS_TENANT_WORKSPACE_ACCESS_DENIED",
  );

  assert.equal(workspaceReads, 0);
});

test("fails closed when the tenant workspace is missing", async () => {
  const input = validInput({
    workspaceRepository: {
      async findWorkspaceByTenantId() {
        return null;
      },
    },
  });

  await expectWorkspaceDenied(
    input,
    "TENANT_WORKSPACE_NOT_AVAILABLE",
  );
});

test("blocks mismatched persisted tenant workspace identity", async () => {
  const input = validInput({
    workspaceRepository: {
      async findWorkspaceByTenantId() {
        return {
          tenantId: "tenant-attacker",
          ownerUserId: "owner-user-1",
          businessName: "Wrong Tenant",
          businessSlug: "wrong-tenant",
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
          timezone: "UTC",
          locale: "en",
        };
      },
    },
  });

  await expectWorkspaceDenied(
    input,
    "TENANT_WORKSPACE_IDENTITY_MISMATCH",
  );
});

test("blocks workspaces whose onboarding is incomplete", async () => {
  const input = validInput({
    workspaceRepository: {
      async findWorkspaceByTenantId(tenantId) {
        return {
          tenantId,
          ownerUserId: "owner-user-1",
          businessName: "NEXUS Test Business",
          businessSlug: "nexus-test-business",
          status: "ACTIVE",
          onboardingStatus: "PENDING",
          timezone: "Europe/Amsterdam",
          locale: "en-NL",
        };
      },
    },
  });

  await expectWorkspaceDenied(
    input,
    "TENANT_WORKSPACE_ONBOARDING_INCOMPLETE",
  );
});

test("blocks suspended tenant workspaces", async () => {
  const input = validInput({
    workspaceRepository: {
      async findWorkspaceByTenantId(tenantId) {
        return {
          tenantId,
          ownerUserId: "owner-user-1",
          businessName: "NEXUS Test Business",
          businessSlug: "nexus-test-business",
          status: "SUSPENDED",
          onboardingStatus: "COMPLETE",
          timezone: "Europe/Amsterdam",
          locale: "en-NL",
        };
      },
    },
  });

  await expectWorkspaceDenied(
    input,
    "TENANT_WORKSPACE_NOT_ACTIVE",
  );
});

test("blocks authenticated owner identity mismatch", async () => {
  const input = validInput({
    workspaceRepository: {
      async findWorkspaceByTenantId(tenantId) {
        return {
          tenantId,
          ownerUserId: "different-owner",
          businessName: "NEXUS Test Business",
          businessSlug: "nexus-test-business",
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
          timezone: "Europe/Amsterdam",
          locale: "en-NL",
        };
      },
    },
  });

  await expectWorkspaceDenied(
    input,
    "TENANT_WORKSPACE_OWNER_IDENTITY_MISMATCH",
  );
});

test("allows an active operator workspace without tenant-management authority", async () => {
  const input = validInput({
    requireOwner: false,

    principal: {
      userId: "operator-user-1",
      tenantId: "tenant-1",
      sessionId: "operator-session-1",
    },

    accessRepositories: {
      async findTenantById(tenantId) {
        return {
          id: tenantId,
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
        };
      },

      async findMembership(tenantId, userId) {
        return {
          tenantId,
          userId,
          role: "OPERATOR",
          status: "ACTIVE",
        };
      },
    },
  });

  const workspace =
    await buildAuthenticatedTenantWorkspace(input);

  assert.equal(workspace.actor.role, "OPERATOR");
  assert.equal(workspace.actor.ownerAuthorized, false);
  assert.equal(workspace.authority.canManageTenant, false);
  assert.equal(
    workspace.authority
      .ownerApprovalRequiredForExecution,
    true,
  );
});

test("keeps public launch and live execution unauthorized", async () => {
  const workspace =
    await buildAuthenticatedTenantWorkspace(validInput());

  assert.equal(
    workspace.operationalBoundary.executionMode,
    "SANDBOX_ONLY",
  );

  assert.equal(
    workspace.operationalBoundary
      .publicLaunchAuthorized,
    false,
  );

  assert.equal(
    workspace.operationalBoundary
      .liveProviderExecutionAuthorized,
    false,
  );
});
