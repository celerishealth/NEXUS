import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import {
  completeAuthenticatedPilotOperation,
  PilotOperationCompletionDeniedError,
  type CompleteAuthenticatedPilotOperationInput,
  type PilotOperationCompletionPersistenceInput,
} from "../../lib/nexus/pilot/authenticatedControlledPilotOperationCompletion";

function digestFor(
  input:
    PilotOperationCompletionPersistenceInput,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        tenantId: input.tenantId,
        enrollmentId: input.enrollmentId,
        admissionId: input.admissionId,
        capability: input.capability,
        operationKey: input.operationKey,
        operationActorUserId:
          input.operationActorUserId,
        completedByUserId:
          input.completedByUserId,
        idempotencyKey:
          input.idempotencyKey,
        outcome: input.outcome,
        summary: input.summary,
        errorCode: input.errorCode,
        completedAt: input.completedAt,
      }),
      "utf8",
    )
    .digest("hex");
}

function validInput(
  overrides:
    Partial<CompleteAuthenticatedPilotOperationInput> = {},
): CompleteAuthenticatedPilotOperationInput {
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

      async findMembership(
        tenantId,
        userId,
      ) {
        return {
          tenantId,
          userId,
          role: "OWNER",
          status: "ACTIVE",
        };
      },
    },

    workspaceRepository: {
      async findWorkspaceByTenantId(
        tenantId,
      ) {
        return {
          tenantId,
          ownerUserId: "owner-user-1",
          businessName:
            "NEXUS Pilot Business",
          businessSlug:
            "nexus-pilot-business",
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
          timezone: "Europe/Amsterdam",
          locale: "en-NL",
        };
      },
    },

    pilotAccessRepository: {
      async findEnrollmentByTenantId(
        tenantId,
      ) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId:
            "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "ACTIVE",
          accessMode:
            "CONTROLLED_PILOT",
          executionMode:
            "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized:
            false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },

    completionReadRepository: {
      async findOperationAndSafetyByTenantAndAdmissionId(
        tenantId,
        admissionId,
      ) {
        return {
          operation: {
            id: admissionId,
            tenantId,
            enrollmentId:
              "pilot-enrollment-1",
            invitationId:
              "pilot-invitation-1",
            capability:
              "SANDBOX_EXECUTION",
            operationKey:
              "pilot-operation-0001",
            actorUserId:
              "owner-user-1",
            actorRole: "OWNER",
            admissionIdempotencyKey:
              "pilot-admission-0001",
            status: "ADMITTED",
            executionMode:
              "SANDBOX_ONLY",
            executionTriggered: false,
            admittedAt:
              "2026-07-10T17:20:00.000Z",
            createdAt:
              "2026-07-10T17:20:00.000Z",
          },

          safety: {
            tenantId,
            enrollmentId:
              "pilot-enrollment-1",
            emergencyStop: false,
            circuitStatus: "CLOSED",
            activeOperationCount: 2,
            recentFailureCount: 0,
            failureThreshold: 3,
            updatedAt:
              "2026-07-10T17:20:00.000Z",
          },
        };
      },
    },

    completionRepository: {
      async completeOperationAtomically(
        input:
          PilotOperationCompletionPersistenceInput,
      ) {
        return {
          outcome: "COMPLETED",

          completion: {
            id: "pilot-completion-1",
            tenantId: input.tenantId,
            enrollmentId:
              input.enrollmentId,
            invitationId:
              input.invitationId,
            admissionId:
              input.admissionId,
            capability:
              input.capability,
            operationKey:
              input.operationKey,
            operationActorUserId:
              input.operationActorUserId,
            operationActorRole:
              input.operationActorRole,
            completedByUserId:
              input.completedByUserId,
            completionSessionId:
              input.completionSessionId,
            idempotencyKey:
              input.idempotencyKey,
            outcome: input.outcome,
            summary: input.summary,
            errorCode: input.errorCode,
            resultDigestAlgorithm:
              "SHA-256",
            resultDigest:
              digestFor(input),
            releaseActiveSlot: true,
            incrementFailureCount:
              input.incrementFailureCount,
            executionMode:
              "SANDBOX_ONLY",
            executionTriggered: false,
            publicSignupAuthorized:
              false,
            liveProviderExecutionAuthorized:
              false,
            completedAt:
              input.completedAt,
            createdAt:
              input.completedAt,
          },

          safety: {
            tenantId: input.tenantId,
            enrollmentId:
              input.enrollmentId,
            activeOperationCount:
              input
                .expectedActiveOperationCount -
              1,
            recentFailureCount:
              input
                .expectedRecentFailureCount +
              (
                input.incrementFailureCount
                  ? 1
                  : 0
              ),
            failureThreshold:
              input.failureThreshold,
            circuitStatus:
              input.expectedCircuitStatus ===
                "OPEN" ||
              (
                input.incrementFailureCount &&
                input
                  .expectedRecentFailureCount +
                  1 >=
                  input.failureThreshold
              )
                ? "OPEN"
                : "CLOSED",
            updatedAt:
              input.completedAt,
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    admissionId: "pilot-admission-1",
    capability: "SANDBOX_EXECUTION",
    outcome: "SUCCEEDED",
    summary:
      "The sandbox pilot operation completed safely.",
    errorCode: null,
    idempotencyKey:
      "pilot-completion-0001",
    ...overrides,
  };
}

async function expectDenied(
  input:
    CompleteAuthenticatedPilotOperationInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      completeAuthenticatedPilotOperation(
        input,
      ),
    (error: unknown) => {
      assert.ok(
        error instanceof
          PilotOperationCompletionDeniedError,
      );

      assert.equal(
        error.code,
        expectedCode,
      );

      return true;
    },
  );
}

test("successful operation releases active capacity atomically", async () => {
  let persistenceInput:
    | PilotOperationCompletionPersistenceInput
    | undefined;

  const base = validInput();

  const result =
    await completeAuthenticatedPilotOperation({
      ...base,

      completionRepository: {
        async completeOperationAtomically(
          receivedInput,
        ) {
          persistenceInput =
            receivedInput;

          return base.completionRepository
            .completeOperationAtomically(
              receivedInput,
            );
        },
      },
    });

  assert.equal(
    persistenceInput?.releaseActiveSlot,
    true,
  );

  assert.equal(
    persistenceInput
      ?.incrementFailureCount,
    false,
  );

  assert.equal(
    result.outcome,
    "COMPLETED",
  );

  assert.equal(
    result.safetyState
      .activeOperationCount,
    1,
  );

  assert.equal(
    result.safetyState
      .activeSlotReleased,
    true,
  );

  assert.equal(
    result.safetyState
      .recentFailureCount,
    0,
  );

  assert.equal(
    result.safetyState.circuitStatus,
    "CLOSED",
  );

  assert.equal(
    result.completion
      .resultDigest.length,
    64,
  );

  assert.equal(
    Object.isFrozen(result),
    true,
  );
});

test("failed operation increments failures and opens circuit at threshold", async () => {
  const base = validInput({
    outcome: "FAILED",
    summary:
      "The sandbox operation failed safely and caused no external change.",
    errorCode:
      "SANDBOX_OPERATION_FAILED",

    completionReadRepository: {
      async findOperationAndSafetyByTenantAndAdmissionId(
        tenantId,
        admissionId,
      ) {
        return {
          operation: {
            id: admissionId,
            tenantId,
            enrollmentId:
              "pilot-enrollment-1",
            invitationId:
              "pilot-invitation-1",
            capability:
              "SANDBOX_EXECUTION",
            operationKey:
              "pilot-operation-0001",
            actorUserId:
              "owner-user-1",
            actorRole: "OWNER",
            admissionIdempotencyKey:
              "pilot-admission-0001",
            status: "ADMITTED",
            executionMode:
              "SANDBOX_ONLY",
            executionTriggered: false,
            admittedAt:
              "2026-07-10T17:20:00.000Z",
            createdAt:
              "2026-07-10T17:20:00.000Z",
          },

          safety: {
            tenantId,
            enrollmentId:
              "pilot-enrollment-1",
            emergencyStop: false,
            circuitStatus: "CLOSED",
            activeOperationCount: 1,
            recentFailureCount: 2,
            failureThreshold: 3,
            updatedAt:
              "2026-07-10T17:20:00.000Z",
          },
        };
      },
    },
  });

  const result =
    await completeAuthenticatedPilotOperation(
      base,
    );

  assert.equal(
    result.completion.operationOutcome,
    "FAILED",
  );

  assert.equal(
    result.completion.errorCode,
    "SANDBOX_OPERATION_FAILED",
  );

  assert.equal(
    result.safetyState
      .activeOperationCount,
    0,
  );

  assert.equal(
    result.safetyState
      .recentFailureCount,
    3,
  );

  assert.equal(
    result.safetyState.circuitStatus,
    "OPEN",
  );
});

test("suspended pilot may drain an already admitted operation", async () => {
  const base = validInput();

  const result =
    await completeAuthenticatedPilotOperation({
      ...base,

      pilotAccessRepository: {
        async findEnrollmentByTenantId(
          tenantId,
        ) {
          return {
            id: "pilot-enrollment-1",
            tenantId,
            invitationId:
              "pilot-invitation-1",
            ownerUserId:
              "owner-user-1",
            enrollmentStatus:
              "SUSPENDED",
            accessMode:
              "CONTROLLED_PILOT",
            executionMode:
              "SANDBOX_ONLY",
            publicSignupAuthorized:
              false,
            liveProviderExecutionAuthorized:
              false,
            enrolledAt:
              "2026-07-10T17:00:00.000Z",
            createdAt:
              "2026-07-10T17:00:01.000Z",
          };
        },
      },
    });

  assert.equal(
    result.safetyState.pilotStatus,
    "SUSPENDED",
  );

  assert.equal(
    result.safetyBoundary
      .drainAllowedWhileSuspended,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .newOperationAuthorized,
    false,
  );
});

test("revoked pilot cannot complete operations", async () => {
  let completionReads = 0;
  let completionWrites = 0;

  const input = validInput({
    pilotAccessRepository: {
      async findEnrollmentByTenantId(
        tenantId,
      ) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId:
            "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "REVOKED",
          accessMode:
            "CONTROLLED_PILOT",
          executionMode:
            "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized:
            false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },

    completionReadRepository: {
      async findOperationAndSafetyByTenantAndAdmissionId() {
        completionReads += 1;
        return null;
      },
    },

    completionRepository: {
      async completeOperationAtomically() {
        completionWrites += 1;

        throw new Error(
          "Completion write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_COMPLETION_ENROLLMENT_REVOKED",
  );

  assert.equal(completionReads, 0);
  assert.equal(completionWrites, 0);
});

test("another actor cannot complete the admitted operation", async () => {
  let completionWrites = 0;

  const input = validInput({
    principal: {
      userId: "owner-user-2",
      tenantId: "tenant-1",
      sessionId: "owner-session-2",
    },

    accessRepositories: {
      async findTenantById(tenantId) {
        return {
          id: tenantId,
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
        };
      },

      async findMembership(
        tenantId,
        userId,
      ) {
        return {
          tenantId,
          userId,
          role: "OWNER",
          status: "ACTIVE",
        };
      },
    },

    completionRepository: {
      async completeOperationAtomically() {
        completionWrites += 1;

        throw new Error(
          "Completion write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_COMPLETION_OPERATION_ACTOR_MISMATCH",
  );

  assert.equal(completionWrites, 0);
});

test("cross-tenant admitted operation is blocked", async () => {
  let completionWrites = 0;

  const input = validInput({
    completionReadRepository: {
      async findOperationAndSafetyByTenantAndAdmissionId(
        tenantId,
        admissionId,
      ) {
        return {
          operation: {
            id: admissionId,
            tenantId:
              "tenant-attacker",
            enrollmentId:
              "pilot-enrollment-1",
            invitationId:
              "pilot-invitation-1",
            capability:
              "SANDBOX_EXECUTION",
            operationKey:
              "pilot-operation-0001",
            actorUserId:
              "owner-user-1",
            actorRole: "OWNER",
            admissionIdempotencyKey:
              "pilot-admission-0001",
            status: "ADMITTED",
            executionMode:
              "SANDBOX_ONLY",
            executionTriggered: false,
            admittedAt:
              "2026-07-10T17:20:00.000Z",
            createdAt:
              "2026-07-10T17:20:00.000Z",
          },

          safety: {
            tenantId,
            enrollmentId:
              "pilot-enrollment-1",
            emergencyStop: false,
            circuitStatus: "CLOSED",
            activeOperationCount: 1,
            recentFailureCount: 0,
            failureThreshold: 3,
            updatedAt:
              "2026-07-10T17:20:00.000Z",
          },
        };
      },
    },

    completionRepository: {
      async completeOperationAtomically() {
        completionWrites += 1;

        throw new Error(
          "Completion write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_COMPLETION_OPERATION_TENANT_MISMATCH",
  );

  assert.equal(completionWrites, 0);
});

test("completion fails closed when no active slot exists", async () => {
  let completionWrites = 0;

  const input = validInput({
    completionReadRepository: {
      async findOperationAndSafetyByTenantAndAdmissionId(
        tenantId,
        admissionId,
      ) {
        return {
          operation: {
            id: admissionId,
            tenantId,
            enrollmentId:
              "pilot-enrollment-1",
            invitationId:
              "pilot-invitation-1",
            capability:
              "SANDBOX_EXECUTION",
            operationKey:
              "pilot-operation-0001",
            actorUserId:
              "owner-user-1",
            actorRole: "OWNER",
            admissionIdempotencyKey:
              "pilot-admission-0001",
            status: "ADMITTED",
            executionMode:
              "SANDBOX_ONLY",
            executionTriggered: false,
            admittedAt:
              "2026-07-10T17:20:00.000Z",
            createdAt:
              "2026-07-10T17:20:00.000Z",
          },

          safety: {
            tenantId,
            enrollmentId:
              "pilot-enrollment-1",
            emergencyStop: false,
            circuitStatus: "CLOSED",
            activeOperationCount: 0,
            recentFailureCount: 0,
            failureThreshold: 3,
            updatedAt:
              "2026-07-10T17:20:00.000Z",
          },
        };
      },
    },

    completionRepository: {
      async completeOperationAtomically() {
        completionWrites += 1;

        throw new Error(
          "Completion write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_COMPLETION_NO_ACTIVE_SLOT",
  );

  assert.equal(completionWrites, 0);
});

test("existing completion is returned idempotently", async () => {
  const base = validInput();

  const result =
    await completeAuthenticatedPilotOperation({
      ...base,

      completionRepository: {
        async completeOperationAtomically(
          input,
        ) {
          return {
            outcome: "EXISTING",

            completion: {
              id:
                "pilot-completion-existing-1",
              tenantId:
                input.tenantId,
              enrollmentId:
                input.enrollmentId,
              invitationId:
                input.invitationId,
              admissionId:
                input.admissionId,
              capability:
                input.capability,
              operationKey:
                input.operationKey,
              operationActorUserId:
                input.operationActorUserId,
              operationActorRole:
                input.operationActorRole,
              completedByUserId:
                input.completedByUserId,
              completionSessionId:
                input.completionSessionId,
              idempotencyKey:
                input.idempotencyKey,
              outcome:
                input.outcome,
              summary:
                input.summary,
              errorCode:
                input.errorCode,
              resultDigestAlgorithm:
                "SHA-256",
              resultDigest:
                digestFor(input),
              releaseActiveSlot: true,
              incrementFailureCount:
                false,
              executionMode:
                "SANDBOX_ONLY",
              executionTriggered: false,
              publicSignupAuthorized:
                false,
              liveProviderExecutionAuthorized:
                false,
              completedAt:
                input.completedAt,
              createdAt:
                input.completedAt,
            },

            safety: {
              tenantId:
                input.tenantId,
              enrollmentId:
                input.enrollmentId,
              activeOperationCount:
                input
                  .expectedActiveOperationCount -
                1,
              recentFailureCount:
                input
                  .expectedRecentFailureCount,
              failureThreshold:
                input.failureThreshold,
              circuitStatus:
                input.expectedCircuitStatus,
              updatedAt:
                input.completedAt,
            },
          };
        },
      },
    });

  assert.equal(
    result.outcome,
    "EXISTING",
  );

  assert.equal(
    result.completion.id,
    "pilot-completion-existing-1",
  );
});

test("incorrect persisted active capacity fails closed", async () => {
  const base = validInput();

  await expectDenied(
    {
      ...base,

      completionRepository: {
        async completeOperationAtomically(
          input,
        ) {
          return {
            outcome: "COMPLETED",

            completion: {
              id: "pilot-completion-1",
              tenantId:
                input.tenantId,
              enrollmentId:
                input.enrollmentId,
              invitationId:
                input.invitationId,
              admissionId:
                input.admissionId,
              capability:
                input.capability,
              operationKey:
                input.operationKey,
              operationActorUserId:
                input.operationActorUserId,
              operationActorRole:
                input.operationActorRole,
              completedByUserId:
                input.completedByUserId,
              completionSessionId:
                input.completionSessionId,
              idempotencyKey:
                input.idempotencyKey,
              outcome:
                input.outcome,
              summary:
                input.summary,
              errorCode:
                input.errorCode,
              resultDigestAlgorithm:
                "SHA-256",
              resultDigest:
                digestFor(input),
              releaseActiveSlot: true,
              incrementFailureCount:
                false,
              executionMode:
                "SANDBOX_ONLY",
              executionTriggered: false,
              publicSignupAuthorized:
                false,
              liveProviderExecutionAuthorized:
                false,
              completedAt:
                input.completedAt,
              createdAt:
                input.completedAt,
            },

            safety: {
              tenantId:
                input.tenantId,
              enrollmentId:
                input.enrollmentId,
              activeOperationCount:
                input
                  .expectedActiveOperationCount,
              recentFailureCount:
                input
                  .expectedRecentFailureCount,
              failureThreshold:
                input.failureThreshold,
              circuitStatus:
                input.expectedCircuitStatus,
              updatedAt:
                input.completedAt,
            },
          };
        },
      },
    },
    "PILOT_COMPLETION_PERSISTED_ACTIVE_COUNT_MISMATCH",
  );
});

test("completion never executes work or authorizes live activity", async () => {
  const result =
    await completeAuthenticatedPilotOperation(
      validInput(),
    );

  assert.equal(
    result.safetyBoundary
      .atomicCompletion,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .idempotentCompletion,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .immutableResultDigest,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .newOperationAuthorized,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .executionTriggered,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .executionMode,
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
