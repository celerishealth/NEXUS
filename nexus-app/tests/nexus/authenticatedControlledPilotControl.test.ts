import assert from "node:assert/strict";
import test from "node:test";

import {
  TenantAccessDeniedError,
} from "../../lib/nexus/auth/tenantAccessContext";

import {
  controlAuthenticatedPilot,
  ControlledPilotControlDeniedError,
  type ControlledPilotControlPersistenceInput,
  type ControlAuthenticatedPilotInput,
} from "../../lib/nexus/pilot/authenticatedControlledPilotControl";

function validInput(
  overrides:
    Partial<ControlAuthenticatedPilotInput> = {},
): ControlAuthenticatedPilotInput {
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

    controlReadRepository: {
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
          updatedAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },

    controlRepository: {
      async applyControlAtomically(
        input:
          ControlledPilotControlPersistenceInput,
      ) {
        return {
          outcome: "CREATED",

          control: {
            id: "pilot-control-1",
            tenantId: input.tenantId,
            enrollmentId: input.enrollmentId,
            invitationId: input.invitationId,
            ownerUserId: input.ownerUserId,
            sourceSessionId:
              input.sourceSessionId,
            idempotencyKey:
              input.idempotencyKey,
            action: input.action,
            reason: input.reason,
            previousStatus:
              input.expectedCurrentStatus,
            newStatus: input.newStatus,
            accessMode: input.accessMode,
            executionMode: input.executionMode,
            publicSignupAuthorized:
              input.publicSignupAuthorized,
            liveProviderExecutionAuthorized:
              input.liveProviderExecutionAuthorized,
            controlledAt: input.controlledAt,
            createdAt:
              "2026-07-10T17:10:01.000Z",
          },

          enrollment: {
            id: input.enrollmentId,
            tenantId: input.tenantId,
            ownerUserId: input.ownerUserId,
            enrollmentStatus: input.newStatus,
            accessMode: input.accessMode,
            executionMode: input.executionMode,
            publicSignupAuthorized:
              input.publicSignupAuthorized,
            liveProviderExecutionAuthorized:
              input.liveProviderExecutionAuthorized,
            updatedAt:
              "2026-07-10T17:10:00.000Z",
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    action: "SUSPEND",
    reason:
      "Owner is pausing pilot operations for a safety review.",
    idempotencyKey:
      "pilot-control-suspend-0001",
    ...overrides,
  };
}

async function expectDenied(
  input: ControlAuthenticatedPilotInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () => controlAuthenticatedPilot(input),
    (error: unknown) => {
      assert.ok(
        error instanceof
          ControlledPilotControlDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("owner suspends active pilot atomically", async () => {
  let persistenceInput:
    | ControlledPilotControlPersistenceInput
    | undefined;

  const result =
    await controlAuthenticatedPilot(
      validInput({
        controlRepository: {
          async applyControlAtomically(
            receivedInput,
          ) {
            persistenceInput = receivedInput;

            return {
              outcome: "CREATED",

              control: {
                id: "pilot-control-1",
                tenantId:
                  receivedInput.tenantId,
                enrollmentId:
                  receivedInput.enrollmentId,
                invitationId:
                  receivedInput.invitationId,
                ownerUserId:
                  receivedInput.ownerUserId,
                sourceSessionId:
                  receivedInput.sourceSessionId,
                idempotencyKey:
                  receivedInput.idempotencyKey,
                action: receivedInput.action,
                reason: receivedInput.reason,
                previousStatus:
                  receivedInput
                    .expectedCurrentStatus,
                newStatus:
                  receivedInput.newStatus,
                accessMode:
                  receivedInput.accessMode,
                executionMode:
                  receivedInput.executionMode,
                publicSignupAuthorized:
                  false,
                liveProviderExecutionAuthorized:
                  false,
                controlledAt:
                  receivedInput.controlledAt,
                createdAt:
                  "2026-07-10T17:10:01.000Z",
              },

              enrollment: {
                id: receivedInput.enrollmentId,
                tenantId:
                  receivedInput.tenantId,
                ownerUserId:
                  receivedInput.ownerUserId,
                enrollmentStatus:
                  receivedInput.newStatus,
                accessMode:
                  "CONTROLLED_PILOT",
                executionMode:
                  "SANDBOX_ONLY",
                publicSignupAuthorized:
                  false,
                liveProviderExecutionAuthorized:
                  false,
                updatedAt:
                  "2026-07-10T17:10:00.000Z",
              },
            };
          },
        },
      }),
    );

  assert.equal(
    persistenceInput?.expectedCurrentStatus,
    "ACTIVE",
  );

  assert.equal(
    persistenceInput?.newStatus,
    "SUSPENDED",
  );

  assert.equal(
    persistenceInput?.action,
    "SUSPEND",
  );

  assert.equal(
    result.enrollment.status,
    "SUSPENDED",
  );

  assert.equal(
    result.pilotOperations.accessStatus,
    "BLOCKED",
  );

  assert.equal(
    result.pilotOperations.operationStatus,
    "PAUSED",
  );

  assert.equal(
    result.safetyBoundary
      .immediateAccessEnforcement,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.control),
    true,
  );
});

test("owner resumes suspended pilot atomically", async () => {
  const result =
    await controlAuthenticatedPilot(
      validInput({
        controlReadRepository: {
          async findEnrollmentByTenantId(
            tenantId,
          ) {
            return {
              id: "pilot-enrollment-1",
              tenantId,
              invitationId:
                "pilot-invitation-1",
              ownerUserId: "owner-user-1",
              enrollmentStatus: "SUSPENDED",
              accessMode:
                "CONTROLLED_PILOT",
              executionMode: "SANDBOX_ONLY",
              publicSignupAuthorized: false,
              liveProviderExecutionAuthorized:
                false,
              enrolledAt:
                "2026-07-10T17:00:00.000Z",
              updatedAt:
                "2026-07-10T17:10:00.000Z",
            };
          },
        },

        action: "RESUME",
        reason:
          "Owner completed the safety review and is resuming the pilot.",
        idempotencyKey:
          "pilot-control-resume-0001",
      }),
    );

  assert.equal(
    result.control.previousStatus,
    "SUSPENDED",
  );

  assert.equal(
    result.control.newStatus,
    "ACTIVE",
  );

  assert.equal(
    result.enrollment.status,
    "ACTIVE",
  );

  assert.equal(
    result.pilotOperations.accessStatus,
    "READY",
  );

  assert.equal(
    result.pilotOperations.operationStatus,
    "ACTIVE",
  );
});

test("existing idempotent control result is returned", async () => {
  const result =
    await controlAuthenticatedPilot(
      validInput({
        controlRepository: {
          async applyControlAtomically(
            receivedInput,
          ) {
            return {
              outcome: "EXISTING",

              control: {
                id: "pilot-control-existing-1",
                tenantId:
                  receivedInput.tenantId,
                enrollmentId:
                  receivedInput.enrollmentId,
                invitationId:
                  receivedInput.invitationId,
                ownerUserId:
                  receivedInput.ownerUserId,
                sourceSessionId:
                  receivedInput.sourceSessionId,
                idempotencyKey:
                  receivedInput.idempotencyKey,
                action: receivedInput.action,
                reason: receivedInput.reason,
                previousStatus:
                  receivedInput
                    .expectedCurrentStatus,
                newStatus:
                  receivedInput.newStatus,
                accessMode:
                  "CONTROLLED_PILOT",
                executionMode:
                  "SANDBOX_ONLY",
                publicSignupAuthorized:
                  false,
                liveProviderExecutionAuthorized:
                  false,
                controlledAt:
                  receivedInput.controlledAt,
                createdAt:
                  "2026-07-10T17:10:01.000Z",
              },

              enrollment: {
                id: receivedInput.enrollmentId,
                tenantId:
                  receivedInput.tenantId,
                ownerUserId:
                  receivedInput.ownerUserId,
                enrollmentStatus:
                  receivedInput.newStatus,
                accessMode:
                  "CONTROLLED_PILOT",
                executionMode:
                  "SANDBOX_ONLY",
                publicSignupAuthorized:
                  false,
                liveProviderExecutionAuthorized:
                  false,
                updatedAt:
                  "2026-07-10T17:10:00.000Z",
              },
            };
          },
        },
      }),
    );

  assert.equal(result.outcome, "EXISTING");

  assert.equal(
    result.control.id,
    "pilot-control-existing-1",
  );
});

test("non-owner cannot control pilot status", async () => {
  let enrollmentReads = 0;
  let controlWrites = 0;

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

    controlReadRepository: {
      async findEnrollmentByTenantId() {
        enrollmentReads += 1;
        return null;
      },
    },

    controlRepository: {
      async applyControlAtomically() {
        controlWrites += 1;
        throw new Error(
          "Control write must not run.",
        );
      },
    },
  });

  await assert.rejects(
    () => controlAuthenticatedPilot(input),
    (error: unknown) => {
      assert.ok(error instanceof TenantAccessDeniedError);

      assert.equal(
        error.code,
        "OWNER_AUTHORITY_REQUIRED",
      );

      return true;
    },
  );

  assert.equal(enrollmentReads, 0);
  assert.equal(controlWrites, 0);
});

test("cross-tenant enrollment is blocked before control write", async () => {
  let controlWrites = 0;

  const input = validInput({
    controlReadRepository: {
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
          updatedAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },

    controlRepository: {
      async applyControlAtomically() {
        controlWrites += 1;
        throw new Error(
          "Control write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "CONTROLLABLE_PILOT_TENANT_MISMATCH",
  );

  assert.equal(controlWrites, 0);
});

test("revoked enrollment cannot be resumed", async () => {
  let controlWrites = 0;

  const input = validInput({
    controlReadRepository: {
      async findEnrollmentByTenantId(
        tenantId,
      ) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "REVOKED",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          updatedAt:
            "2026-07-10T17:10:00.000Z",
        };
      },
    },

    controlRepository: {
      async applyControlAtomically() {
        controlWrites += 1;
        throw new Error(
          "Control write must not run.",
        );
      },
    },

    action: "RESUME",
    reason:
      "Attempting to resume a revoked enrollment.",
  });

  await expectDenied(
    input,
    "CONTROLLABLE_PILOT_REVOKED",
  );

  assert.equal(controlWrites, 0);
});

test("active enrollment cannot be resumed directly", async () => {
  let controlWrites = 0;

  const input = validInput({
    controlRepository: {
      async applyControlAtomically() {
        controlWrites += 1;
        throw new Error(
          "Control write must not run.",
        );
      },
    },

    action: "RESUME",
    reason:
      "Invalid direct resume transition attempt.",
  });

  await expectDenied(
    input,
    "CONTROLLABLE_PILOT_TRANSITION_INVALID",
  );

  assert.equal(controlWrites, 0);
});

test("suspended enrollment cannot be suspended twice", async () => {
  let controlWrites = 0;

  const input = validInput({
    controlReadRepository: {
      async findEnrollmentByTenantId(
        tenantId,
      ) {
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
          updatedAt:
            "2026-07-10T17:10:00.000Z",
        };
      },
    },

    controlRepository: {
      async applyControlAtomically() {
        controlWrites += 1;
        throw new Error(
          "Control write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "CONTROLLABLE_PILOT_TRANSITION_INVALID",
  );

  assert.equal(controlWrites, 0);
});

test("unsafe live-provider boundary is rejected", async () => {
  let controlWrites = 0;

  const input = validInput({
    controlReadRepository: {
      async findEnrollmentByTenantId(
        tenantId,
      ) {
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
          updatedAt:
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
          updatedAt: string;
        };
      },
    },

    controlRepository: {
      async applyControlAtomically() {
        controlWrites += 1;
        throw new Error(
          "Control write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "CONTROLLABLE_PILOT_BOUNDARY_INVALID",
  );

  assert.equal(controlWrites, 0);
});

test("persisted tenant mismatch fails closed", async () => {
  const input = validInput({
    controlRepository: {
      async applyControlAtomically(
        receivedInput,
      ) {
        return {
          outcome: "CREATED",

          control: {
            id: "pilot-control-attacker",
            tenantId: "tenant-attacker",
            enrollmentId:
              receivedInput.enrollmentId,
            invitationId:
              receivedInput.invitationId,
            ownerUserId:
              receivedInput.ownerUserId,
            sourceSessionId:
              receivedInput.sourceSessionId,
            idempotencyKey:
              receivedInput.idempotencyKey,
            action: receivedInput.action,
            reason: receivedInput.reason,
            previousStatus:
              receivedInput.expectedCurrentStatus,
            newStatus:
              receivedInput.newStatus,
            accessMode: "CONTROLLED_PILOT",
            executionMode: "SANDBOX_ONLY",
            publicSignupAuthorized: false,
            liveProviderExecutionAuthorized:
              false,
            controlledAt:
              receivedInput.controlledAt,
            createdAt:
              "2026-07-10T17:10:01.000Z",
          },

          enrollment: {
            id: receivedInput.enrollmentId,
            tenantId: receivedInput.tenantId,
            ownerUserId:
              receivedInput.ownerUserId,
            enrollmentStatus:
              receivedInput.newStatus,
            accessMode: "CONTROLLED_PILOT",
            executionMode: "SANDBOX_ONLY",
            publicSignupAuthorized: false,
            liveProviderExecutionAuthorized:
              false,
            updatedAt:
              "2026-07-10T17:10:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_CONTROL_PERSISTED_IDENTITY_MISMATCH",
  );
});

test("updated enrollment status mismatch fails closed", async () => {
  const input = validInput({
    controlRepository: {
      async applyControlAtomically(
        receivedInput,
      ) {
        return {
          outcome: "CREATED",

          control: {
            id: "pilot-control-1",
            tenantId: receivedInput.tenantId,
            enrollmentId:
              receivedInput.enrollmentId,
            invitationId:
              receivedInput.invitationId,
            ownerUserId:
              receivedInput.ownerUserId,
            sourceSessionId:
              receivedInput.sourceSessionId,
            idempotencyKey:
              receivedInput.idempotencyKey,
            action: receivedInput.action,
            reason: receivedInput.reason,
            previousStatus:
              receivedInput.expectedCurrentStatus,
            newStatus:
              receivedInput.newStatus,
            accessMode: "CONTROLLED_PILOT",
            executionMode: "SANDBOX_ONLY",
            publicSignupAuthorized: false,
            liveProviderExecutionAuthorized:
              false,
            controlledAt:
              receivedInput.controlledAt,
            createdAt:
              "2026-07-10T17:10:01.000Z",
          },

          enrollment: {
            id: receivedInput.enrollmentId,
            tenantId: receivedInput.tenantId,
            ownerUserId:
              receivedInput.ownerUserId,
            enrollmentStatus: "ACTIVE",
            accessMode: "CONTROLLED_PILOT",
            executionMode: "SANDBOX_ONLY",
            publicSignupAuthorized: false,
            liveProviderExecutionAuthorized:
              false,
            updatedAt:
              "2026-07-10T17:10:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_CONTROL_ENROLLMENT_STATUS_MISMATCH",
  );
});

test("pilot control never authorizes public or live execution", async () => {
  const result =
    await controlAuthenticatedPilot(
      validInput(),
    );

  assert.equal(
    result.safetyBoundary.atomicStatusChange,
    true,
  );

  assert.equal(
    result.safetyBoundary.idempotentControl,
    true,
  );

  assert.equal(
    result.safetyBoundary.executionMode,
    "SANDBOX_ONLY",
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
