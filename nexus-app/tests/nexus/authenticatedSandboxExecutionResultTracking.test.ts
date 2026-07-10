import assert from "node:assert/strict";
import test from "node:test";

import {
  recordAuthenticatedSandboxExecutionResult,
  ExecutionResultTrackingDeniedError,
  type ExecutionResultTrackingPersistenceInput,
  type RecordAuthenticatedSandboxExecutionResultInput,
} from "../../lib/nexus/tracking/authenticatedSandboxExecutionResultTracking";

function validInput(
  overrides:
    Partial<RecordAuthenticatedSandboxExecutionResultInput> = {},
): RecordAuthenticatedSandboxExecutionResultInput {
  return {
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

    executionReadRepository: {
      async findExecutionByTenantAndId(
        tenantId,
        executionId,
      ) {
        return {
          id: executionId,
          tenantId,
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          requestedByOwnerUserId: "owner-user-1",
          sourceSessionId: "owner-session-1",
          status: "SUCCEEDED",
          executionMode: "SANDBOX_ONLY",
          summary:
            "Customer response draft created successfully.",
          output:
            "Draft: Thank you for your inquiry. Here is the recommended service comparison.",
          startedAt: "2026-07-10T15:00:00.000Z",
          completedAt: "2026-07-10T15:00:01.000Z",
          createdAt: "2026-07-10T15:00:02.000Z",
        };
      },
    },

    trackingRepository: {
      async createOrGetTracking(
        input: ExecutionResultTrackingPersistenceInput,
      ) {
        return {
          outcome: "CREATED",
          tracking: {
            id: "tracking-1",
            ...input,
            createdAt: "2026-07-10T15:01:00.000Z",
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    executionId: "execution-1",
    idempotencyKey: "result-tracking-0001",
    ...overrides,
  };
}

async function expectDenied(
  input: RecordAuthenticatedSandboxExecutionResultInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      recordAuthenticatedSandboxExecutionResult(
        input,
      ),
    (error: unknown) => {
      assert.ok(
        error instanceof
          ExecutionResultTrackingDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("records an immutable successful sandbox execution result", async () => {
  let persistenceInput:
    | ExecutionResultTrackingPersistenceInput
    | undefined;

  const result =
    await recordAuthenticatedSandboxExecutionResult(
      validInput({
        trackingRepository: {
          async createOrGetTracking(receivedInput) {
            persistenceInput = receivedInput;

            return {
              outcome: "CREATED",
              tracking: {
                id: "tracking-1",
                ...receivedInput,
                createdAt:
                  "2026-07-10T15:01:00.000Z",
              },
            };
          },
        },
      }),
    );

  assert.deepEqual(persistenceInput, {
    tenantId: "tenant-1",
    executionId: "execution-1",
    inquiryId: "inquiry-1",
    recommendationId: "recommendation-1",
    ownerApprovalId: "approval-1",
    originalOwnerUserId: "owner-user-1",
    trackedByUserId: "operator-user-1",
    sourceSessionId: "operator-session-1",
    idempotencyKey: "result-tracking-0001",
    executionStatus: "SUCCEEDED",
    resultStatus: "AVAILABLE",
    trackingStatus: "RECORDED",
    executionMode: "SANDBOX_ONLY",
    outcomeSummary:
      "Customer response draft created successfully.",
    outputPreview:
      "Draft: Thank you for your inquiry. Here is the recommended service comparison.",
    startedAt: "2026-07-10T15:00:00.000Z",
    completedAt: "2026-07-10T15:00:01.000Z",
    recoveryRequired: false,
  });

  assert.equal(result.outcome, "CREATED");

  assert.equal(
    result.tracking.executionStatus,
    "SUCCEEDED",
  );

  assert.equal(
    result.tracking.resultStatus,
    "AVAILABLE",
  );

  assert.equal(
    result.nextBoundary.recoveryStatus,
    "NOT_REQUIRED",
  );

  assert.equal(
    result.safetyBoundary.executionTriggered,
    false,
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.tracking),
    true,
  );
});

test("failed execution is marked for recovery", async () => {
  const input = validInput({
    executionReadRepository: {
      async findExecutionByTenantAndId(
        tenantId,
        executionId,
      ) {
        return {
          id: executionId,
          tenantId,
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          requestedByOwnerUserId: "owner-user-1",
          sourceSessionId: "owner-session-1",
          status: "FAILED",
          executionMode: "SANDBOX_ONLY",
          summary:
            "Sandbox execution failed safely.",
          output:
            "No live-provider execution occurred.",
          startedAt:
            "2026-07-10T15:00:00.000Z",
          completedAt:
            "2026-07-10T15:00:01.000Z",
          createdAt:
            "2026-07-10T15:00:02.000Z",
        };
      },
    },

    trackingRepository: {
      async createOrGetTracking(receivedInput) {
        return {
          outcome: "CREATED",
          tracking: {
            id: "tracking-failed-1",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:01:00.000Z",
          },
        };
      },
    },
  });

  const result =
    await recordAuthenticatedSandboxExecutionResult(
      input,
    );

  assert.equal(
    result.tracking.executionStatus,
    "FAILED",
  );

  assert.equal(
    result.tracking.resultStatus,
    "FAILED_REQUIRES_RECOVERY",
  );

  assert.equal(
    result.tracking.recoveryRequired,
    true,
  );

  assert.equal(
    result.nextBoundary.recoveryStatus,
    "REQUIRED",
  );
});

test("existing idempotent tracking record is returned without duplication", async () => {
  let trackingCalls = 0;

  const input = validInput({
    trackingRepository: {
      async createOrGetTracking(receivedInput) {
        trackingCalls += 1;

        return {
          outcome: "EXISTING",
          tracking: {
            id: "tracking-existing-1",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:01:00.000Z",
          },
        };
      },
    },
  });

  const result =
    await recordAuthenticatedSandboxExecutionResult(
      input,
    );

  assert.equal(result.outcome, "EXISTING");
  assert.equal(
    result.tracking.id,
    "tracking-existing-1",
  );

  assert.equal(trackingCalls, 1);
});

test("VIEWER cannot create execution result tracking records", async () => {
  let executionReads = 0;
  let trackingCalls = 0;

  const input = validInput({
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
          role: "VIEWER",
          status: "ACTIVE",
        };
      },
    },

    executionReadRepository: {
      async findExecutionByTenantAndId(
        tenantId,
        executionId,
      ) {
        executionReads += 1;

        return {
          id: executionId,
          tenantId,
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          requestedByOwnerUserId: "owner-user-1",
          sourceSessionId: "owner-session-1",
          status: "SUCCEEDED",
          executionMode: "SANDBOX_ONLY",
          summary: "Should not be read.",
          output: "Should not be tracked.",
          startedAt:
            "2026-07-10T15:00:00.000Z",
          completedAt:
            "2026-07-10T15:00:01.000Z",
          createdAt:
            "2026-07-10T15:00:02.000Z",
        };
      },
    },

    trackingRepository: {
      async createOrGetTracking(receivedInput) {
        trackingCalls += 1;

        return {
          outcome: "CREATED",
          tracking: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:01:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "RESULT_TRACKING_ROLE_NOT_AUTHORIZED",
  );

  assert.equal(executionReads, 0);
  assert.equal(trackingCalls, 0);
});

test("cross-tenant execution is blocked before tracking persistence", async () => {
  let trackingCalls = 0;

  const input = validInput({
    executionReadRepository: {
      async findExecutionByTenantAndId(
        _tenantId,
        executionId,
      ) {
        return {
          id: executionId,
          tenantId: "tenant-attacker",
          inquiryId: "inquiry-attacker",
          recommendationId:
            "recommendation-attacker",
          ownerApprovalId: "approval-attacker",
          requestedByOwnerUserId:
            "owner-attacker",
          sourceSessionId: "session-attacker",
          status: "SUCCEEDED",
          executionMode: "SANDBOX_ONLY",
          summary: "Cross-tenant result.",
          output: "Cross-tenant output.",
          startedAt:
            "2026-07-10T15:00:00.000Z",
          completedAt:
            "2026-07-10T15:00:01.000Z",
          createdAt:
            "2026-07-10T15:00:02.000Z",
        };
      },
    },

    trackingRepository: {
      async createOrGetTracking(receivedInput) {
        trackingCalls += 1;

        return {
          outcome: "CREATED",
          tracking: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:01:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "TRACKABLE_EXECUTION_TENANT_MISMATCH",
  );

  assert.equal(trackingCalls, 0);
});

test("non-sandbox execution result cannot be tracked", async () => {
  let trackingCalls = 0;

  const input = validInput({
    executionReadRepository: {
      async findExecutionByTenantAndId(
        tenantId,
        executionId,
      ) {
        return {
          id: executionId,
          tenantId,
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          requestedByOwnerUserId: "owner-user-1",
          sourceSessionId: "owner-session-1",
          status: "SUCCEEDED",
          executionMode: "LIVE_PROVIDER",
          summary: "Unsafe result.",
          output: "Live-provider result.",
          startedAt:
            "2026-07-10T15:00:00.000Z",
          completedAt:
            "2026-07-10T15:00:01.000Z",
          createdAt:
            "2026-07-10T15:00:02.000Z",
        } as unknown as {
          id: string;
          tenantId: string;
          inquiryId: string;
          recommendationId: string;
          ownerApprovalId: string;
          requestedByOwnerUserId: string;
          sourceSessionId: string;
          status: "SUCCEEDED" | "FAILED";
          executionMode: "SANDBOX_ONLY";
          summary: string;
          output: string;
          startedAt: string;
          completedAt: string;
          createdAt: string;
        };
      },
    },

    trackingRepository: {
      async createOrGetTracking(receivedInput) {
        trackingCalls += 1;

        return {
          outcome: "CREATED",
          tracking: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:01:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "TRACKABLE_EXECUTION_MODE_INVALID",
  );

  assert.equal(trackingCalls, 0);
});

test("execution with impossible completion time fails closed", async () => {
  let trackingCalls = 0;

  const input = validInput({
    executionReadRepository: {
      async findExecutionByTenantAndId(
        tenantId,
        executionId,
      ) {
        return {
          id: executionId,
          tenantId,
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          requestedByOwnerUserId: "owner-user-1",
          sourceSessionId: "owner-session-1",
          status: "SUCCEEDED",
          executionMode: "SANDBOX_ONLY",
          summary: "Invalid timeline.",
          output: "Completion is before start.",
          startedAt:
            "2026-07-10T15:00:02.000Z",
          completedAt:
            "2026-07-10T15:00:01.000Z",
          createdAt:
            "2026-07-10T15:00:03.000Z",
        };
      },
    },

    trackingRepository: {
      async createOrGetTracking(receivedInput) {
        trackingCalls += 1;

        return {
          outcome: "CREATED",
          tracking: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:01:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "TRACKABLE_EXECUTION_COMPLETED_AT_INVALID",
  );

  assert.equal(trackingCalls, 0);
});

test("fails closed when tracking persistence returns another tenant", async () => {
  const input = validInput({
    trackingRepository: {
      async createOrGetTracking(receivedInput) {
        return {
          outcome: "CREATED",
          tracking: {
            id: "tracking-attacker",
            ...receivedInput,
            tenantId: "tenant-attacker",
            createdAt:
              "2026-07-10T15:01:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "RESULT_TRACKING_PERSISTED_IDENTITY_MISMATCH",
  );
});

test("result tracking cannot trigger execution or live-provider activity", async () => {
  const result =
    await recordAuthenticatedSandboxExecutionResult(
      validInput(),
    );

  assert.equal(
    result.safetyBoundary.resultOnlyOperation,
    true,
  );

  assert.equal(
    result.safetyBoundary.executionTriggered,
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

  assert.equal(
    result.nextBoundary.auditStatus,
    "PENDING",
  );
});
