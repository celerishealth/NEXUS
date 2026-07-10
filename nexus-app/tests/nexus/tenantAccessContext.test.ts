import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveAuthenticatedTenantAccessContext,
  TenantAccessDeniedError,
  type ResolveTenantAccessContextInput,
} from "../../lib/nexus/auth/tenantAccessContext";

function validInput(
  overrides: Partial<ResolveTenantAccessContextInput> = {},
): ResolveTenantAccessContextInput {
  return {
    principal: {
      userId: "user-owner-1",
      tenantId: "tenant-1",
      sessionId: "session-1",
    },

    repositories: {
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

    requireOwner: true,
    ...overrides,
  };
}

async function expectDenied(
  input: ResolveTenantAccessContextInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () => resolveAuthenticatedTenantAccessContext(input),
    (error: unknown) => {
      assert.ok(error instanceof TenantAccessDeniedError);
      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("resolves an immutable owner-authorized tenant context", async () => {
  const context =
    await resolveAuthenticatedTenantAccessContext(validInput());

  assert.deepEqual(context, {
    userId: "user-owner-1",
    tenantId: "tenant-1",
    sessionId: "session-1",
    role: "OWNER",
    ownerAuthorized: true,
  });

  assert.equal(Object.isFrozen(context), true);
});

test("fails closed when the authenticated principal is missing", async () => {
  await expectDenied(
    validInput({
      principal: null,
    }),
    "AUTHENTICATED_PRINCIPAL_REQUIRED",
  );
});

test("blocks access while tenant onboarding is incomplete", async () => {
  const input = validInput({
    repositories: {
      async findTenantById(tenantId) {
        return {
          id: tenantId,
          status: "ACTIVE",
          onboardingStatus: "PENDING",
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
  });

  await expectDenied(
    input,
    "TENANT_ONBOARDING_INCOMPLETE",
  );
});

test("blocks suspended tenants", async () => {
  const input = validInput({
    repositories: {
      async findTenantById(tenantId) {
        return {
          id: tenantId,
          status: "SUSPENDED",
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
  });

  await expectDenied(input, "TENANT_NOT_ACTIVE");
});

test("blocks missing tenant memberships", async () => {
  const input = validInput({
    repositories: {
      async findTenantById(tenantId) {
        return {
          id: tenantId,
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
        };
      },

      async findMembership() {
        return null;
      },
    },
  });

  await expectDenied(
    input,
    "TENANT_MEMBERSHIP_NOT_AVAILABLE",
  );
});

test("blocks cross-tenant membership mismatches", async () => {
  const input = validInput({
    repositories: {
      async findTenantById(tenantId) {
        return {
          id: tenantId,
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
        };
      },

      async findMembership(_tenantId, userId) {
        return {
          tenantId: "tenant-attacker",
          userId,
          role: "OWNER",
          status: "ACTIVE",
        };
      },
    },
  });

  await expectDenied(
    input,
    "TENANT_MEMBERSHIP_IDENTITY_MISMATCH",
  );
});

test("blocks revoked memberships", async () => {
  const input = validInput({
    repositories: {
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
          status: "REVOKED",
        };
      },
    },
  });

  await expectDenied(
    input,
    "TENANT_MEMBERSHIP_NOT_ACTIVE",
  );
});

test("requires explicit owner authority for owner-controlled operations", async () => {
  const input = validInput({
    repositories: {
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
          role: "ADMIN",
          status: "ACTIVE",
        };
      },
    },
  });

  await expectDenied(input, "OWNER_AUTHORITY_REQUIRED");
});

test("allows active non-owner membership only when owner authority is not required", async () => {
  const input = validInput({
    requireOwner: false,

    repositories: {
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

  const context =
    await resolveAuthenticatedTenantAccessContext(input);

  assert.equal(context.role, "OPERATOR");
  assert.equal(context.ownerAuthorized, false);
});
