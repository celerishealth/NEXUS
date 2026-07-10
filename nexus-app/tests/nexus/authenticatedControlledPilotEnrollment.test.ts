import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import {
  TenantAccessDeniedError,
} from "../../lib/nexus/auth/tenantAccessContext";

import {
  enrollAuthenticatedControlledPilot,
  ControlledPilotEnrollmentDeniedError,
  type ControlledPilotEnrollmentPersistenceInput,
  type EnrollAuthenticatedControlledPilotInput,
} from "../../lib/nexus/pilot/authenticatedControlledPilotEnrollment";

const invitationToken =
  "nexus-controlled-pilot-token-0001";

const invitationTokenDigest = createHash("sha256")
  .update(invitationToken, "utf8")
  .digest("hex");

function validInput(
  overrides:
    Partial<EnrollAuthenticatedControlledPilotInput> = {},
): EnrollAuthenticatedControlledPilotInput {
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

    eligibilityRepository: {
      async findEligibilityByTenantAndInvitationDigest(
        tenantId,
        tokenDigest,
      ) {
        return {
          invitation: {
            id: "pilot-invitation-1",
            tenantId,
            tokenDigest,
            status: "ACTIVE",
            expiresAt:
              "2099-12-31T23:59:59.000Z",
          },

          readiness: {
            tenantId,
            authenticationStatus: "REAL",
            onboardingStatus: "COMPLETE",
            verticalSliceStatus: "COMPLETE",
            securityGateStatus: "PASSED",
          },
        };
      },
    },

    enrollmentRepository: {
      async createOrGetEnrollment(
        input:
          ControlledPilotEnrollmentPersistenceInput,
      ) {
        return {
          outcome: "CREATED",
          enrollment: {
            id: "pilot-enrollment-1",
            ...input,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    invitationToken,
    idempotencyKey:
      "pilot-enrollment-0001",
    ...overrides,
  };
}

async function expectDenied(
  input: EnrollAuthenticatedControlledPilotInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      enrollAuthenticatedControlledPilot(input),
    (error: unknown) => {
      assert.ok(
        error instanceof
          ControlledPilotEnrollmentDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("authenticated tenant owner enters invitation-only controlled pilot", async () => {
  let persistenceInput:
    | ControlledPilotEnrollmentPersistenceInput
    | undefined;

  const result =
    await enrollAuthenticatedControlledPilot(
      validInput({
        enrollmentRepository: {
          async createOrGetEnrollment(
            receivedInput,
          ) {
            persistenceInput = receivedInput;

            return {
              outcome: "CREATED",
              enrollment: {
                id: "pilot-enrollment-1",
                ...receivedInput,
                createdAt:
                  new Date().toISOString(),
              },
            };
          },
        },
      }),
    );

  assert.equal(
    persistenceInput?.tenantId,
    "tenant-1",
  );

  assert.equal(
    persistenceInput?.ownerUserId,
    "owner-user-1",
  );

  assert.equal(
    persistenceInput?.invitationTokenDigest,
    invitationTokenDigest,
  );

  assert.notEqual(
    persistenceInput?.invitationTokenDigest,
    invitationToken,
  );

  assert.equal(
    persistenceInput?.accessMode,
    "CONTROLLED_PILOT",
  );

  assert.equal(
    persistenceInput?.executionMode,
    "SANDBOX_ONLY",
  );

  assert.equal(
    persistenceInput?.publicSignupAuthorized,
    false,
  );

  assert.equal(
    persistenceInput
      ?.liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(result.outcome, "CREATED");

  assert.equal(
    result.ownerAuthority.explicitlyEnrolled,
    true,
  );

  assert.equal(
    result.readinessEvidence.securityGateStatus,
    "PASSED",
  );

  assert.equal(
    result.nextBoundary.controlledPilotStatus,
    "ACTIVE",
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.enrollment),
    true,
  );
});

test("existing enrollment is returned idempotently", async () => {
  const result =
    await enrollAuthenticatedControlledPilot(
      validInput({
        enrollmentRepository: {
          async createOrGetEnrollment(
            receivedInput,
          ) {
            return {
              outcome: "EXISTING",
              enrollment: {
                id: "pilot-enrollment-existing-1",
                ...receivedInput,
                createdAt:
                  new Date().toISOString(),
              },
            };
          },
        },
      }),
    );

  assert.equal(result.outcome, "EXISTING");

  assert.equal(
    result.enrollment.id,
    "pilot-enrollment-existing-1",
  );
});

test("non-owner cannot enroll tenant into controlled pilot", async () => {
  let eligibilityReads = 0;
  let enrollmentWrites = 0;

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

    eligibilityRepository: {
      async findEligibilityByTenantAndInvitationDigest() {
        eligibilityReads += 1;
        return null;
      },
    },

    enrollmentRepository: {
      async createOrGetEnrollment(receivedInput) {
        enrollmentWrites += 1;

        return {
          outcome: "CREATED",
          enrollment: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              new Date().toISOString(),
          },
        };
      },
    },
  });

  await assert.rejects(
    () =>
      enrollAuthenticatedControlledPilot(input),
    (error: unknown) => {
      assert.ok(error instanceof TenantAccessDeniedError);

      assert.equal(
        error.code,
        "OWNER_AUTHORITY_REQUIRED",
      );

      return true;
    },
  );

  assert.equal(eligibilityReads, 0);
  assert.equal(enrollmentWrites, 0);
});

test("cross-tenant invitation is blocked before enrollment persistence", async () => {
  let enrollmentWrites = 0;

  const input = validInput({
    eligibilityRepository: {
      async findEligibilityByTenantAndInvitationDigest(
        _tenantId,
        tokenDigest,
      ) {
        return {
          invitation: {
            id: "pilot-invitation-attacker",
            tenantId: "tenant-attacker",
            tokenDigest,
            status: "ACTIVE",
            expiresAt:
              "2099-12-31T23:59:59.000Z",
          },

          readiness: {
            tenantId: "tenant-attacker",
            authenticationStatus: "REAL",
            onboardingStatus: "COMPLETE",
            verticalSliceStatus: "COMPLETE",
            securityGateStatus: "PASSED",
          },
        };
      },
    },

    enrollmentRepository: {
      async createOrGetEnrollment(receivedInput) {
        enrollmentWrites += 1;

        return {
          outcome: "CREATED",
          enrollment: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              new Date().toISOString(),
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_INVITATION_TENANT_MISMATCH",
  );

  assert.equal(enrollmentWrites, 0);
});

test("revoked invitation cannot enroll tenant", async () => {
  let enrollmentWrites = 0;

  const input = validInput({
    eligibilityRepository: {
      async findEligibilityByTenantAndInvitationDigest(
        tenantId,
        tokenDigest,
      ) {
        return {
          invitation: {
            id: "pilot-invitation-1",
            tenantId,
            tokenDigest,
            status: "REVOKED",
            expiresAt:
              "2099-12-31T23:59:59.000Z",
          },

          readiness: {
            tenantId,
            authenticationStatus: "REAL",
            onboardingStatus: "COMPLETE",
            verticalSliceStatus: "COMPLETE",
            securityGateStatus: "PASSED",
          },
        };
      },
    },

    enrollmentRepository: {
      async createOrGetEnrollment(receivedInput) {
        enrollmentWrites += 1;

        return {
          outcome: "CREATED",
          enrollment: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              new Date().toISOString(),
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_INVITATION_NOT_ACTIVE",
  );

  assert.equal(enrollmentWrites, 0);
});

test("expired invitation cannot enroll tenant", async () => {
  let enrollmentWrites = 0;

  const input = validInput({
    eligibilityRepository: {
      async findEligibilityByTenantAndInvitationDigest(
        tenantId,
        tokenDigest,
      ) {
        return {
          invitation: {
            id: "pilot-invitation-expired",
            tenantId,
            tokenDigest,
            status: "ACTIVE",
            expiresAt:
              "2020-01-01T00:00:00.000Z",
          },

          readiness: {
            tenantId,
            authenticationStatus: "REAL",
            onboardingStatus: "COMPLETE",
            verticalSliceStatus: "COMPLETE",
            securityGateStatus: "PASSED",
          },
        };
      },
    },

    enrollmentRepository: {
      async createOrGetEnrollment(receivedInput) {
        enrollmentWrites += 1;

        return {
          outcome: "CREATED",
          enrollment: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              new Date().toISOString(),
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_INVITATION_EXPIRED",
  );

  assert.equal(enrollmentWrites, 0);
});

test("incomplete vertical slice blocks controlled-pilot enrollment", async () => {
  let enrollmentWrites = 0;

  const input = validInput({
    eligibilityRepository: {
      async findEligibilityByTenantAndInvitationDigest(
        tenantId,
        tokenDigest,
      ) {
        return {
          invitation: {
            id: "pilot-invitation-1",
            tenantId,
            tokenDigest,
            status: "ACTIVE",
            expiresAt:
              "2099-12-31T23:59:59.000Z",
          },

          readiness: {
            tenantId,
            authenticationStatus: "REAL",
            onboardingStatus: "COMPLETE",
            verticalSliceStatus: "PENDING",
            securityGateStatus: "PASSED",
          } as unknown as {
            tenantId: string;
            authenticationStatus: "REAL";
            onboardingStatus: "COMPLETE";
            verticalSliceStatus: "COMPLETE";
            securityGateStatus: "PASSED";
          },
        };
      },
    },

    enrollmentRepository: {
      async createOrGetEnrollment(receivedInput) {
        enrollmentWrites += 1;

        return {
          outcome: "CREATED",
          enrollment: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              new Date().toISOString(),
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_VERTICAL_SLICE_NOT_READY",
  );

  assert.equal(enrollmentWrites, 0);
});

test("failed security gate blocks controlled-pilot enrollment", async () => {
  let enrollmentWrites = 0;

  const input = validInput({
    eligibilityRepository: {
      async findEligibilityByTenantAndInvitationDigest(
        tenantId,
        tokenDigest,
      ) {
        return {
          invitation: {
            id: "pilot-invitation-1",
            tenantId,
            tokenDigest,
            status: "ACTIVE",
            expiresAt:
              "2099-12-31T23:59:59.000Z",
          },

          readiness: {
            tenantId,
            authenticationStatus: "REAL",
            onboardingStatus: "COMPLETE",
            verticalSliceStatus: "COMPLETE",
            securityGateStatus: "FAILED",
          } as unknown as {
            tenantId: string;
            authenticationStatus: "REAL";
            onboardingStatus: "COMPLETE";
            verticalSliceStatus: "COMPLETE";
            securityGateStatus: "PASSED";
          },
        };
      },
    },

    enrollmentRepository: {
      async createOrGetEnrollment(receivedInput) {
        enrollmentWrites += 1;

        return {
          outcome: "CREATED",
          enrollment: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              new Date().toISOString(),
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_SECURITY_GATE_NOT_PASSED",
  );

  assert.equal(enrollmentWrites, 0);
});

test("persisted cross-tenant enrollment fails closed", async () => {
  const input = validInput({
    enrollmentRepository: {
      async createOrGetEnrollment(receivedInput) {
        return {
          outcome: "CREATED",
          enrollment: {
            id: "pilot-enrollment-attacker",
            ...receivedInput,
            tenantId: "tenant-attacker",
            createdAt:
              new Date().toISOString(),
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_ENROLLMENT_PERSISTED_IDENTITY_MISMATCH",
  );
});

test("controlled pilot remains private and sandbox-only", async () => {
  const result =
    await enrollAuthenticatedControlledPilot(
      validInput(),
    );

  assert.equal(
    result.safetyBoundary.invitationOnly,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .publicSignupAuthorized,
    false,
  );

  assert.equal(
    result.safetyBoundary.executionMode,
    "SANDBOX_ONLY",
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
