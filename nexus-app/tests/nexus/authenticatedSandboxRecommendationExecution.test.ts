import assert from "node:assert/strict";
import test from "node:test";

import {
  TenantAccessDeniedError,
} from "../../lib/nexus/auth/tenantAccessContext";

import {
  executeApprovedSandboxRecommendation,
  ApprovedSandboxExecutionDeniedError,
  type CompleteSandboxExecutionInput,
  type ExecuteApprovedSandboxRecommendationInput,
  type SandboxExecutionClaimInput,
  type SandboxExecutorInput,
} from "../../lib/nexus/execution/authenticatedSandboxRecommendationExecution";

function validInput(
  overrides:
    Partial<ExecuteApprovedSandboxRecommendationInput> = {},
): ExecuteApprovedSandboxRecommendationInput {
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
      async findExecutableRecommendation(
        tenantId,
        recommendationId,
      ) {
        return {
          recommendation: {
            id: recommendationId,
            tenantId,
            inquiryId: "inquiry-1",
            recommendedAction:
              "Prepare a controlled customer response draft.",
            status: "APPROVED",
            engineMode: "SANDBOX_ONLY",
          },

          approval: {
            id: "approval-1",
            tenantId,
            recommendationId,
            inquiryId: "inquiry-1",
            ownerUserId: "owner-user-1",
            recommendationStatus: "APPROVED",
            executionStatus: "READY_FOR_SANDBOX",
            executionMode: "SANDBOX_ONLY",
          },
        };
      },
    },

    sandboxExecutor: {
      mode: "SANDBOX_ONLY",

      async execute() {
        return {
          status: "SUCCEEDED",
          summary:
            "Customer response draft created in sandbox.",
          output:
            "Draft: Thank you for your inquiry. Here is a concise comparison.",
          startedAt: "2026-07-10T15:00:00.000Z",
          completedAt: "2026-07-10T15:00:01.000Z",
        };
      },
    },

    executionRepository: {
      async claimExecution(
        input: SandboxExecutionClaimInput,
      ) {
        return {
          outcome: "CLAIMED",
          claim: {
            id: "execution-1",
            ...input,
            claimedAt: "2026-07-10T14:59:59.000Z",
          },
        };
      },

      async completeExecution(
        input: CompleteSandboxExecutionInput,
      ) {
        return {
          id: input.executionId,
          tenantId: input.tenantId,
          inquiryId: input.inquiryId,
          recommendationId:
            input.recommendationId,
          ownerApprovalId: input.ownerApprovalId,
          requestedByOwnerUserId:
            input.requestedByOwnerUserId,
          sourceSessionId: input.sourceSessionId,
          idempotencyKey: input.idempotencyKey,
          status: input.status,
          executionMode: input.executionMode,
          summary: input.summary,
          output: input.output,
          startedAt: input.startedAt,
          completedAt: input.completedAt,
          createdAt: "2026-07-10T15:00:02.000Z",
        };
      },
    },

    requestedTenantId: "tenant-1",
    recommendationId: "recommendation-1",
    idempotencyKey: "sandbox-execution-0001",
    ...overrides,
  };
}

async function expectDenied(
  input: ExecuteApprovedSandboxRecommendationInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      executeApprovedSandboxRecommendation(input),
    (error: unknown) => {
      assert.ok(
        error instanceof
          ApprovedSandboxExecutionDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("executes an owner-approved recommendation once in sandbox", async () => {
  let claimInput:
    | SandboxExecutionClaimInput
    | undefined;

  let executorInput:
    | SandboxExecutorInput
    | undefined;

  let completionInput:
    | CompleteSandboxExecutionInput
    | undefined;

  const input = validInput({
    sandboxExecutor: {
      mode: "SANDBOX_ONLY",

      async execute(receivedInput) {
        executorInput = receivedInput;

        return {
          status: "SUCCEEDED",
          summary:
            "Customer response draft created in sandbox.",
          output:
            "Draft: Thank you for your inquiry. Here is a concise comparison.",
          startedAt: "2026-07-10T15:00:00.000Z",
          completedAt: "2026-07-10T15:00:01.000Z",
        };
      },
    },

    executionRepository: {
      async claimExecution(receivedInput) {
        claimInput = receivedInput;

        return {
          outcome: "CLAIMED",
          claim: {
            id: "execution-1",
            ...receivedInput,
            claimedAt:
              "2026-07-10T14:59:59.000Z",
          },
        };
      },

      async completeExecution(receivedInput) {
        completionInput = receivedInput;

        return {
          id: receivedInput.executionId,
          tenantId: receivedInput.tenantId,
          inquiryId: receivedInput.inquiryId,
          recommendationId:
            receivedInput.recommendationId,
          ownerApprovalId:
            receivedInput.ownerApprovalId,
          requestedByOwnerUserId:
            receivedInput.requestedByOwnerUserId,
          sourceSessionId:
            receivedInput.sourceSessionId,
          idempotencyKey:
            receivedInput.idempotencyKey,
          status: receivedInput.status,
          executionMode:
            receivedInput.executionMode,
          summary: receivedInput.summary,
          output: receivedInput.output,
          startedAt: receivedInput.startedAt,
          completedAt: receivedInput.completedAt,
          createdAt:
            "2026-07-10T15:00:02.000Z",
        };
      },
    },
  });

  const result =
    await executeApprovedSandboxRecommendation(
      input,
    );

  assert.equal(claimInput?.tenantId, "tenant-1");
  assert.equal(
    claimInput?.requestedByOwnerUserId,
    "owner-user-1",
  );

  assert.equal(
    claimInput?.status,
    "RUNNING",
  );

  assert.deepEqual(executorInput, {
    tenantId: "tenant-1",
    inquiryId: "inquiry-1",
    recommendationId: "recommendation-1",
    ownerApprovalId: "approval-1",
    recommendedAction:
      "Prepare a controlled customer response draft.",
    requestedByOwnerUserId: "owner-user-1",
    executionMode: "SANDBOX_ONLY",
  });

  assert.equal(
    completionInput?.status,
    "SUCCEEDED",
  );

  assert.equal(result.outcome, "EXECUTED");
  assert.equal(result.execution.status, "SUCCEEDED");

  assert.equal(
    result.ownerAuthority.approvalVerified,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .duplicateExecutionPrevented,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    result.nextBoundary.resultTrackingStatus,
    "PENDING",
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.execution),
    true,
  );
});

test("existing idempotent execution does not invoke sandbox again", async () => {
  let executorCalls = 0;
  let completionCalls = 0;

  const input = validInput({
    sandboxExecutor: {
      mode: "SANDBOX_ONLY",

      async execute() {
        executorCalls += 1;

        return {
          status: "SUCCEEDED",
          summary: "Should not execute again.",
          output: "Duplicate execution blocked.",
          startedAt: "2026-07-10T15:00:00.000Z",
          completedAt: "2026-07-10T15:00:01.000Z",
        };
      },
    },

    executionRepository: {
      async claimExecution(receivedInput) {
        return {
          outcome: "EXISTING",
          execution: {
            id: "execution-existing-1",
            tenantId: receivedInput.tenantId,
            inquiryId: receivedInput.inquiryId,
            recommendationId:
              receivedInput.recommendationId,
            ownerApprovalId:
              receivedInput.ownerApprovalId,
            requestedByOwnerUserId:
              receivedInput.requestedByOwnerUserId,
            sourceSessionId:
              receivedInput.sourceSessionId,
            idempotencyKey:
              receivedInput.idempotencyKey,
            status: "SUCCEEDED",
            executionMode: "SANDBOX_ONLY",
            summary:
              "Previously completed sandbox execution.",
            output:
              "Previously generated safe sandbox result.",
            startedAt:
              "2026-07-10T15:00:00.000Z",
            completedAt:
              "2026-07-10T15:00:01.000Z",
            createdAt:
              "2026-07-10T15:00:02.000Z",
          },
        };
      },

      async completeExecution(receivedInput) {
        completionCalls += 1;

        return {
          id: receivedInput.executionId,
          tenantId: receivedInput.tenantId,
          inquiryId: receivedInput.inquiryId,
          recommendationId:
            receivedInput.recommendationId,
          ownerApprovalId:
            receivedInput.ownerApprovalId,
          requestedByOwnerUserId:
            receivedInput.requestedByOwnerUserId,
          sourceSessionId:
            receivedInput.sourceSessionId,
          idempotencyKey:
            receivedInput.idempotencyKey,
          status: receivedInput.status,
          executionMode:
            receivedInput.executionMode,
          summary: receivedInput.summary,
          output: receivedInput.output,
          startedAt: receivedInput.startedAt,
          completedAt: receivedInput.completedAt,
          createdAt:
            "2026-07-10T15:00:02.000Z",
        };
      },
    },
  });

  const result =
    await executeApprovedSandboxRecommendation(
      input,
    );

  assert.equal(result.outcome, "EXISTING");
  assert.equal(executorCalls, 0);
  assert.equal(completionCalls, 0);
});

test("non-owner cannot execute an approved recommendation", async () => {
  let executionReads = 0;
  let executorCalls = 0;

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

    executionReadRepository: {
      async findExecutableRecommendation(
        tenantId,
        recommendationId,
      ) {
        executionReads += 1;

        return {
          recommendation: {
            id: recommendationId,
            tenantId,
            inquiryId: "inquiry-1",
            recommendedAction:
              "Should not be executed.",
            status: "APPROVED",
            engineMode: "SANDBOX_ONLY",
          },

          approval: {
            id: "approval-1",
            tenantId,
            recommendationId,
            inquiryId: "inquiry-1",
            ownerUserId: "owner-user-1",
            recommendationStatus: "APPROVED",
            executionStatus:
              "READY_FOR_SANDBOX",
            executionMode: "SANDBOX_ONLY",
          },
        };
      },
    },

    sandboxExecutor: {
      mode: "SANDBOX_ONLY",

      async execute() {
        executorCalls += 1;

        return {
          status: "FAILED",
          summary: "Should not execute.",
          output: "Owner authority was missing.",
          startedAt:
            "2026-07-10T15:00:00.000Z",
          completedAt:
            "2026-07-10T15:00:01.000Z",
        };
      },
    },
  });

  await assert.rejects(
    () =>
      executeApprovedSandboxRecommendation(input),
    (error: unknown) => {
      assert.ok(error instanceof TenantAccessDeniedError);
      assert.equal(
        error.code,
        "OWNER_AUTHORITY_REQUIRED",
      );

      return true;
    },
  );

  assert.equal(executionReads, 0);
  assert.equal(executorCalls, 0);
});

test("cross-tenant recommendation is blocked before claim", async () => {
  let claimCalls = 0;
  let executorCalls = 0;

  const base = validInput();

  const input = validInput({
    executionReadRepository: {
      async findExecutableRecommendation(
        _tenantId,
        recommendationId,
      ) {
        return {
          recommendation: {
            id: recommendationId,
            tenantId: "tenant-attacker",
            inquiryId: "inquiry-attacker",
            recommendedAction:
              "Cross-tenant action.",
            status: "APPROVED",
            engineMode: "SANDBOX_ONLY",
          },

          approval: {
            id: "approval-attacker",
            tenantId: "tenant-attacker",
            recommendationId,
            inquiryId: "inquiry-attacker",
            ownerUserId: "owner-user-1",
            recommendationStatus: "APPROVED",
            executionStatus:
              "READY_FOR_SANDBOX",
            executionMode: "SANDBOX_ONLY",
          },
        };
      },
    },

    executionRepository: {
      async claimExecution(receivedInput) {
        claimCalls += 1;

        return {
          outcome: "CLAIMED",
          claim: {
            id: "should-not-exist",
            ...receivedInput,
            claimedAt:
              "2026-07-10T14:59:59.000Z",
          },
        };
      },

      completeExecution:
        base.executionRepository.completeExecution,
    },

    sandboxExecutor: {
      mode: "SANDBOX_ONLY",

      async execute() {
        executorCalls += 1;

        return {
          status: "FAILED",
          summary: "Should not execute.",
          output: "Cross-tenant access blocked.",
          startedAt:
            "2026-07-10T15:00:00.000Z",
          completedAt:
            "2026-07-10T15:00:01.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "EXECUTABLE_RECOMMENDATION_TENANT_MISMATCH",
  );

  assert.equal(claimCalls, 0);
  assert.equal(executorCalls, 0);
});

test("recommendation without ready owner approval is blocked", async () => {
  let claimCalls = 0;
  let executorCalls = 0;

  const base = validInput();

  const input = validInput({
    executionReadRepository: {
      async findExecutableRecommendation(
        tenantId,
        recommendationId,
      ) {
        return {
          recommendation: {
            id: recommendationId,
            tenantId,
            inquiryId: "inquiry-1",
            recommendedAction:
              "Prepare a sandbox draft.",
            status: "APPROVED",
            engineMode: "SANDBOX_ONLY",
          },

          approval: {
            id: "approval-1",
            tenantId,
            recommendationId,
            inquiryId: "inquiry-1",
            ownerUserId: "owner-user-1",
            recommendationStatus: "APPROVED",
            executionStatus: "BLOCKED_BY_OWNER",
            executionMode: "SANDBOX_ONLY",
          } as unknown as {
            id: string;
            tenantId: string;
            recommendationId: string;
            inquiryId: string;
            ownerUserId: string;
            recommendationStatus: "APPROVED";
            executionStatus: "READY_FOR_SANDBOX";
            executionMode: "SANDBOX_ONLY";
          },
        };
      },
    },

    executionRepository: {
      async claimExecution(receivedInput) {
        claimCalls += 1;

        return {
          outcome: "CLAIMED",
          claim: {
            id: "should-not-exist",
            ...receivedInput,
            claimedAt:
              "2026-07-10T14:59:59.000Z",
          },
        };
      },

      completeExecution:
        base.executionRepository.completeExecution,
    },

    sandboxExecutor: {
      mode: "SANDBOX_ONLY",

      async execute() {
        executorCalls += 1;

        return {
          status: "FAILED",
          summary: "Should not execute.",
          output: "Approval was not ready.",
          startedAt:
            "2026-07-10T15:00:00.000Z",
          completedAt:
            "2026-07-10T15:00:01.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "OWNER_APPROVAL_EXECUTION_STATUS_INVALID",
  );

  assert.equal(claimCalls, 0);
  assert.equal(executorCalls, 0);
});

test("live-provider executor is rejected before any execution read", async () => {
  let executionReads = 0;
  let executorCalls = 0;

  const unsafeExecutor = {
    mode: "LIVE_PROVIDER",

    async execute() {
      executorCalls += 1;

      return {
        status: "SUCCEEDED" as const,
        summary: "Unsafe execution.",
        output: "Live execution must not occur.",
        startedAt: "2026-07-10T15:00:00.000Z",
        completedAt:
          "2026-07-10T15:00:01.000Z",
      };
    },
  };

  const input = validInput({
    executionReadRepository: {
      async findExecutableRecommendation(
        tenantId,
        recommendationId,
      ) {
        executionReads += 1;

        return {
          recommendation: {
            id: recommendationId,
            tenantId,
            inquiryId: "inquiry-1",
            recommendedAction:
              "Should not be executed.",
            status: "APPROVED",
            engineMode: "SANDBOX_ONLY",
          },

          approval: {
            id: "approval-1",
            tenantId,
            recommendationId,
            inquiryId: "inquiry-1",
            ownerUserId: "owner-user-1",
            recommendationStatus: "APPROVED",
            executionStatus:
              "READY_FOR_SANDBOX",
            executionMode: "SANDBOX_ONLY",
          },
        };
      },
    },

    sandboxExecutor:
      unsafeExecutor as unknown as
        ExecuteApprovedSandboxRecommendationInput[
          "sandboxExecutor"
        ],
  });

  await expectDenied(
    input,
    "LIVE_EXECUTOR_NOT_AUTHORIZED",
  );

  assert.equal(executionReads, 0);
  assert.equal(executorCalls, 0);
});

test("sandbox executor failure is recorded fail-closed for recovery", async () => {
  let completionInput:
    | CompleteSandboxExecutionInput
    | undefined;

  const input = validInput({
    sandboxExecutor: {
      mode: "SANDBOX_ONLY",

      async execute() {
        throw new Error("simulated sandbox failure");
      },
    },

    executionRepository: {
      async claimExecution(receivedInput) {
        return {
          outcome: "CLAIMED",
          claim: {
            id: "execution-failed-1",
            ...receivedInput,
            claimedAt:
              "2026-07-10T14:59:59.000Z",
          },
        };
      },

      async completeExecution(receivedInput) {
        completionInput = receivedInput;

        return {
          id: receivedInput.executionId,
          tenantId: receivedInput.tenantId,
          inquiryId: receivedInput.inquiryId,
          recommendationId:
            receivedInput.recommendationId,
          ownerApprovalId:
            receivedInput.ownerApprovalId,
          requestedByOwnerUserId:
            receivedInput.requestedByOwnerUserId,
          sourceSessionId:
            receivedInput.sourceSessionId,
          idempotencyKey:
            receivedInput.idempotencyKey,
          status: receivedInput.status,
          executionMode:
            receivedInput.executionMode,
          summary: receivedInput.summary,
          output: receivedInput.output,
          startedAt: receivedInput.startedAt,
          completedAt: receivedInput.completedAt,
          createdAt: new Date().toISOString(),
        };
      },
    },
  });

  const result =
    await executeApprovedSandboxRecommendation(
      input,
    );

  assert.equal(
    completionInput?.status,
    "FAILED",
  );

  assert.equal(result.execution.status, "FAILED");

  assert.equal(
    result.nextBoundary.recoveryRequired,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .liveProviderExecutionAuthorized,
    false,
  );
});
