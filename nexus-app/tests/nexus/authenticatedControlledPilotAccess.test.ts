import assert from "node:assert/strict";
import test from "node:test";

import {
  enforceAuthenticatedControlledPilotAccess,
  ControlledPilotAccessDeniedError,
  type EnforceAuthenticatedControlledPilotAccessInput,
} from "../../lib/nexus/pilot/authenticatedControlledPilotAccess";

function validInput(
  overrides:
    Partial<EnforceAuthenticatedControlledPilotAccessInput> = {},
): EnforceAuthenticatedControlledPilotAccessInput {
  return {
    principal: {
      userId: "owner-user-1",
      tenantId: "tenant-1",
      sessionId: "owner-session-1",
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
          businessName: "NEXUS Pilot Business",
          businessSlug: "nexus-pilot-business",
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
          timezone: "Europe/Amsterdam",
          locale: "en-NL",
        };
      },
    },

    pilotAccessRepository: {
      async findEnrollmentByTenantId(tenantId) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "ACTIVE",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },

    requestedTenantId: "tenant-1",
    requiredCapability: "SANDBOX_EXECUTION",
    ...overrides,
  };
}

async function expectDenied(
  input: EnforceAuthenticatedControlledPilotAccessInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      enforceAuthenticatedControlledPilotAccess(
        input,
      ),
    (error: unknown) => {
      assert.ok(
        error instanceof
          ControlledPilotAccessDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("owner receives tenant-scoped sandbox execution access", async () => {
  const result =
    await enforceAuthenticatedControlledPilotAccess(
      validInput(),
    );

  assert.equal(result.access.granted, true);

  assert.equal(
    result.access.capability,
    "SANDBOX_EXECUTION",
  );

  assert.equal(result.access.role, "OWNER");

  assert.equal(
    result.access.executionMode,
    "SANDBOX_ONLY",
  );

  assert.equal(
    result.safetyBoundary.tenantScoped,
    true,
  );

  assert.equal(
    result.safetyBoundary.roleScoped,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .publicLaunchAuthorized,
    false,
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.access),
    true,
  );
});

test("operator receives inquiry intake access", async () => {
  const result =
    await enforceAuthenticatedControlledPilotAccess(
      validInput({
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

        requiredCapability: "INQUIRY_INTAKE",
      }),
    );

  assert.equal(result.access.role, "OPERATOR");

  assert.equal(
    result.access.capability,
    "INQUIRY_INTAKE",
  );
});

test("operator cannot access owner decision capability", async () => {
  let enrollmentReads = 0;

  const input = validInput({
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

    pilotAccessRepository: {
      async findEnrollmentByTenantId(tenantId) {
        enrollmentReads += 1;

        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "ACTIVE",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },

    requiredCapability: "OWNER_DECISION",
  });

  await expectDenied(
    input,
    "PILOT_ROLE_NOT_AUTHORIZED",
  );

  assert.equal(enrollmentReads, 0);
});

test("viewer receives only pilot status read access", async () => {
  const viewerBase = {
    principal: {
      userId: "viewer-user-1",
      tenantId: "tenant-1",
      sessionId: "viewer-session-1",
    },

    accessRepositories: {
      async findTenantById(tenantId: string) {
        return {
          id: tenantId,
          status: "ACTIVE" as const,
          onboardingStatus: "COMPLETE" as const,
        };
      },

      async findMembership(
        tenantId: string,
        userId: string,
      ) {
        return {
          tenantId,
          userId,
          role: "VIEWER" as const,
          status: "ACTIVE" as const,
        };
      },
    },
  };

  const readResult =
    await enforceAuthenticatedControlledPilotAccess(
      validInput({
        ...viewerBase,
        requiredCapability: "PILOT_STATUS_READ",
      }),
    );

  assert.equal(readResult.access.role, "VIEWER");

  await expectDenied(
    validInput({
      ...viewerBase,
      requiredCapability: "INQUIRY_INTAKE",
    }),
    "PILOT_ROLE_NOT_AUTHORIZED",
  );
});

test("tenant without pilot enrollment is blocked", async () => {
  const input = validInput({
    pilotAccessRepository: {
      async findEnrollmentByTenantId() {
        return null;
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_ENROLLMENT_NOT_AVAILABLE",
  );
});

test("cross-tenant pilot enrollment is blocked", async () => {
  const input = validInput({
    pilotAccessRepository: {
      async findEnrollmentByTenantId() {
        return {
          id: "pilot-enrollment-attacker",
          tenantId: "tenant-attacker",
          invitationId:
            "pilot-invitation-attacker",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "ACTIVE",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_ENROLLMENT_TENANT_MISMATCH",
  );
});

test("suspended enrollment cannot authorize pilot access", async () => {
  const input = validInput({
    pilotAccessRepository: {
      async findEnrollmentByTenantId(tenantId) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "SUSPENDED",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_ENROLLMENT_NOT_ACTIVE",
  );
});

test("enrollment with another owner is blocked", async () => {
  const input = validInput({
    pilotAccessRepository: {
      async findEnrollmentByTenantId(tenantId) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-attacker",
          enrollmentStatus: "ACTIVE",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_ENROLLMENT_OWNER_MISMATCH",
  );
});

test("live-provider pilot boundary is rejected", async () => {
  const input = validInput({
    pilotAccessRepository: {
      async findEnrollmentByTenantId(tenantId) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "ACTIVE",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: true,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        } as unknown as {
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
          createdAt: string;
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_LIVE_PROVIDER_BOUNDARY_INVALID",
  );
});

test("public signup boundary is rejected", async () => {
  const input = validInput({
    pilotAccessRepository: {
      async findEnrollmentByTenantId(tenantId) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "ACTIVE",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: true,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        } as unknown as {
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
          createdAt: string;
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_PUBLIC_SIGNUP_BOUNDARY_INVALID",
  );
});

test("invalid enrollment timeline fails closed", async () => {
  const input = validInput({
    pilotAccessRepository: {
      async findEnrollmentByTenantId(tenantId) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "ACTIVE",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:02.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_ENROLLMENT_TIMELINE_INVALID",
  );
});

test("pilot access remains invitation-only and sandbox-only", async () => {
  const result =
    await enforceAuthenticatedControlledPilotAccess(
      validInput({
        requiredCapability:
          "RECOVERY_AUDIT_RECORDING",
      }),
    );

  assert.equal(
    result.safetyBoundary.invitationOnly,
    true,
  );

  assert.equal(
    result.safetyBoundary.sandboxOnly,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .publicSignupAuthorized,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .publicLaunchAuthorized,
    false,
  );
});
