import assert from "node:assert/strict";
import test from "node:test";

import {
  TenantAccessDeniedError,
} from "../../lib/nexus/auth/tenantAccessContext";

import {
  recoverAuthenticatedSandboxExecution,
  SandboxRecoveryDeniedError,
  type CompleteSandboxRecoveryInput,
  type RecoverAuthenticatedSandboxExecutionInput,
  type SandboxRecoveryClaimInput,
  type SandboxRecoveryExecutorInput,
} from "../../lib/nexus/recovery/authenticatedSandboxExecutionRecovery";

const validDigest = "a".repeat(64);

function validInput(
  overrides:
    Partial<RecoverAuthenticatedSandboxExecutionInput> = {},
): RecoverAuthenticatedSandboxExecutionInput {
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

    recoveryReadRepository: {
      async findRecoverableFailure(
        tenantId,
        trackingId,
      ) {
        return {
          tracking: {
            id: trackingId,
            tenantId,
            executionId: "execution-failed-1",
            inquiryId: "inquiry-1",
            recommendationId: "recommendation-1",
            ownerApprovalId: "approval-1",
            approvalOwnerUserId: "owner-user-1",
            executionStatus: "FAILED",
            resultStatus:
              "FAILED_REQUIRES_RECOVERY",
            trackingStatus: "RECORDED",
            executionMode: "SANDBOX_ONLY",
            recoveryRequired: true,
            outcomeSummary:
              "Sandbox execution failed safely.",
            outputPreview:
              "No live-provider execution occurred.",
          },

          auditEvent: {
            id: "audit-failed-1",
            tenantId,
            trackingId,
            executionId: "execution-failed-1",
            eventType:
              "SANDBOX_EXECUTION_FAILED",
            outcome: "FAILURE",
            recoveryRequired: true,
            executionMode: "SANDBOX_ONLY",
            integrityAlgorithm: "SHA-256",
            integrityDigest: validDigest,
            immutable: true,
          },

          completedRecoveryAttempts: 0,
        };
      },
    },

    recoveryExecutor: {
      mode: "SANDBOX_ONLY",

      async recover() {
        return {
          status: "RECOVERED",
          summary:
            "Sandbox execution recovered successfully.",
          output:
            "A safe sandbox result was produced after explicit owner-authorized recovery.",
          startedAt: "2026-07-10T16:00:00.000Z",
          completedAt: "2026-07-10T16:00:01.000Z",
        };
      },
    },

    recoveryRepository: {
      async claimRecovery(
        input: SandboxRecoveryClaimInput,
      ) {
        return {
          outcome: "CLAIMED",
          claim: {
            id: "recovery-1",
            ...input,
            claimedAt:
              "2026-07-10T15:59:59.000Z",
          },
        };
      },

      async completeRecovery(
        input: CompleteSandboxRecoveryInput,
      ) {
        return {
          id: input.recoveryId,
          tenantId: input.tenantId,
          trackingId: input.trackingId,
          failedExecutionId:
            input.failedExecutionId,
          inquiryId: input.inquiryId,
          recommendationId:
            input.recommendationId,
          ownerApprovalId:
            input.ownerApprovalId,
          ownerUserId: input.ownerUserId,
          sourceSessionId:
            input.sourceSessionId,
          failureAuditEventId:
            input.failureAuditEventId,
          idempotencyKey:
            input.idempotencyKey,
          attemptNumber: input.attemptNumber,
          maximumAttempts: 3,
          status: input.status,
          executionMode: "SANDBOX_ONLY",
          automaticRetry: false,
          summary: input.summary,
          output: input.output,
          startedAt: input.startedAt,
          completedAt: input.completedAt,
          createdAt: "2026-07-10T16:00:02.000Z",
        };
      },
    },

    requestedTenantId: "tenant-1",
    trackingId: "tracking-failed-1",
    idempotencyKey: "sandbox-recovery-0001",
    ...overrides,
  };
}

async function expectDenied(
  input: RecoverAuthenticatedSandboxExecutionInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      recoverAuthenticatedSandboxExecution(input),
    (error: unknown) => {
      assert.ok(
        error instanceof SandboxRecoveryDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("owner explicitly recovers a failed execution in sandbox", async () => {
  let claimInput:
    | SandboxRecoveryClaimInput
    | undefined;

  let executorInput:
    | SandboxRecoveryExecutorInput
    | undefined;

  let completionInput:
    | CompleteSandboxRecoveryInput
    | undefined;

  const result =
    await recoverAuthenticatedSandboxExecution(
      validInput({
        recoveryExecutor: {
          mode: "SANDBOX_ONLY",

          async recover(receivedInput) {
            executorInput = receivedInput;

            return {
              status: "RECOVERED",
              summary:
                "Sandbox execution recovered successfully.",
              output:
                "A safe sandbox result was produced after explicit owner-authorized recovery.",
              startedAt:
                "2026-07-10T16:00:00.000Z",
              completedAt:
                "2026-07-10T16:00:01.000Z",
            };
          },
        },

        recoveryRepository: {
          async claimRecovery(receivedInput) {
            claimInput = receivedInput;

            return {
              outcome: "CLAIMED",
              claim: {
                id: "recovery-1",
                ...receivedInput,
                claimedAt:
                  "2026-07-10T15:59:59.000Z",
              },
            };
          },

          async completeRecovery(receivedInput) {
            completionInput = receivedInput;

            return {
              id: receivedInput.recoveryId,
              tenantId: receivedInput.tenantId,
              trackingId:
                receivedInput.trackingId,
              failedExecutionId:
                receivedInput.failedExecutionId,
              inquiryId:
                receivedInput.inquiryId,
              recommendationId:
                receivedInput.recommendationId,
              ownerApprovalId:
                receivedInput.ownerApprovalId,
              ownerUserId:
                receivedInput.ownerUserId,
              sourceSessionId:
                receivedInput.sourceSessionId,
              failureAuditEventId:
                receivedInput.failureAuditEventId,
              idempotencyKey:
                receivedInput.idempotencyKey,
              attemptNumber:
                receivedInput.attemptNumber,
              maximumAttempts: 3,
              status: receivedInput.status,
              executionMode: "SANDBOX_ONLY",
              automaticRetry: false,
              summary: receivedInput.summary,
              output: receivedInput.output,
              startedAt: receivedInput.startedAt,
              completedAt:
                receivedInput.completedAt,
              createdAt:
                "2026-07-10T16:00:02.000Z",
            };
          },
        },
      }),
    );

  assert.equal(claimInput?.attemptNumber, 1);
  assert.equal(claimInput?.maximumAttempts, 3);
  assert.equal(claimInput?.automaticRetry, false);

  assert.deepEqual(executorInput, {
    tenantId: "tenant-1",
    trackingId: "tracking-failed-1",
    failedExecutionId: "execution-failed-1",
    inquiryId: "inquiry-1",
    recommendationId: "recommendation-1",
    ownerApprovalId: "approval-1",
    authorizedOwnerUserId: "owner-user-1",
    recoveryAttemptNumber: 1,
    failureSummary:
      "Sandbox execution failed safely.",
    failureOutputPreview:
      "No live-provider execution occurred.",
    executionMode: "SANDBOX_ONLY",
  });

  assert.equal(
    completionInput?.status,
    "RECOVERED",
  );

  assert.equal(result.outcome, "RECOVERED");
  assert.equal(result.recovery.status, "RECOVERED");

  assert.equal(
    result.ownerAuthority
      .explicitRecoveryAuthorization,
    true,
  );

  assert.equal(
    result.safetyBoundary.automaticRetry,
    false,
  );

  assert.equal(
    result.nextBoundary.recoveryStatus,
    "RESOLVED",
  );

  assert.equal(
    result.nextBoundary.recoveryAuditStatus,
    "PENDING",
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.recovery),
    true,
  );
});

test("existing idempotent recovery does not execute again", async () => {
  let executorCalls = 0;
  let completionCalls = 0;

  const input = validInput({
    recoveryExecutor: {
      mode: "SANDBOX_ONLY",

      async recover() {
        executorCalls += 1;

        return {
          status: "RECOVERED",
          summary: "Should not execute again.",
          output: "Duplicate recovery blocked.",
          startedAt:
            "2026-07-10T16:00:00.000Z",
          completedAt:
            "2026-07-10T16:00:01.000Z",
        };
      },
    },

    recoveryRepository: {
      async claimRecovery(receivedInput) {
        return {
          outcome: "EXISTING",
          recovery: {
            id: "recovery-existing-1",
            tenantId: receivedInput.tenantId,
            trackingId: receivedInput.trackingId,
            failedExecutionId:
              receivedInput.failedExecutionId,
            inquiryId: receivedInput.inquiryId,
            recommendationId:
              receivedInput.recommendationId,
            ownerApprovalId:
              receivedInput.ownerApprovalId,
            ownerUserId:
              receivedInput.ownerUserId,
            sourceSessionId:
              receivedInput.sourceSessionId,
            failureAuditEventId:
              receivedInput.failureAuditEventId,
            idempotencyKey:
              receivedInput.idempotencyKey,
            attemptNumber:
              receivedInput.attemptNumber,
            maximumAttempts: 3,
            status: "RECOVERED",
            executionMode: "SANDBOX_ONLY",
            automaticRetry: false,
            summary:
              "Previously completed recovery.",
            output:
              "Previously recovered sandbox result.",
            startedAt:
              "2026-07-10T16:00:00.000Z",
            completedAt:
              "2026-07-10T16:00:01.000Z",
            createdAt:
              "2026-07-10T16:00:02.000Z",
          },
        };
      },

      async completeRecovery(receivedInput) {
        completionCalls += 1;

        return {
          id: receivedInput.recoveryId,
          tenantId: receivedInput.tenantId,
          trackingId: receivedInput.trackingId,
          failedExecutionId:
            receivedInput.failedExecutionId,
          inquiryId: receivedInput.inquiryId,
          recommendationId:
            receivedInput.recommendationId,
          ownerApprovalId:
            receivedInput.ownerApprovalId,
          ownerUserId: receivedInput.ownerUserId,
          sourceSessionId:
            receivedInput.sourceSessionId,
          failureAuditEventId:
            receivedInput.failureAuditEventId,
          idempotencyKey:
            receivedInput.idempotencyKey,
          attemptNumber:
            receivedInput.attemptNumber,
          maximumAttempts: 3,
          status: receivedInput.status,
          executionMode: "SANDBOX_ONLY",
          automaticRetry: false,
          summary: receivedInput.summary,
          output: receivedInput.output,
          startedAt: receivedInput.startedAt,
          completedAt: receivedInput.completedAt,
          createdAt:
            "2026-07-10T16:00:02.000Z",
        };
      },
    },
  });

  const result =
    await recoverAuthenticatedSandboxExecution(
      input,
    );

  assert.equal(result.outcome, "EXISTING");
  assert.equal(executorCalls, 0);
  assert.equal(completionCalls, 0);
});

test("non-owner cannot initiate recovery", async () => {
  let recoveryReads = 0;
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

    recoveryReadRepository: {
      async findRecoverableFailure() {
        recoveryReads += 1;
        return null;
      },
    },

    recoveryExecutor: {
      mode: "SANDBOX_ONLY",

      async recover() {
        executorCalls += 1;

        return {
          status: "FAILED",
          summary: "Should not execute.",
          output: "Owner authority was missing.",
          startedAt:
            "2026-07-10T16:00:00.000Z",
          completedAt:
            "2026-07-10T16:00:01.000Z",
        };
      },
    },
  });

  await assert.rejects(
    () =>
      recoverAuthenticatedSandboxExecution(input),
    (error: unknown) => {
      assert.ok(error instanceof TenantAccessDeniedError);

      assert.equal(
        error.code,
        "OWNER_AUTHORITY_REQUIRED",
      );

      return true;
    },
  );

  assert.equal(recoveryReads, 0);
  assert.equal(executorCalls, 0);
});

test("cross-tenant failed tracking is blocked before recovery claim", async () => {
  let claimCalls = 0;
  let executorCalls = 0;

  const base = validInput();

  const input = validInput({
    recoveryReadRepository: {
      async findRecoverableFailure(
        _tenantId,
        trackingId,
      ) {
        return {
          tracking: {
            id: trackingId,
            tenantId: "tenant-attacker",
            executionId: "execution-attacker",
            inquiryId: "inquiry-attacker",
            recommendationId:
              "recommendation-attacker",
            ownerApprovalId: "approval-attacker",
            approvalOwnerUserId:
              "owner-user-1",
            executionStatus: "FAILED",
            resultStatus:
              "FAILED_REQUIRES_RECOVERY",
            trackingStatus: "RECORDED",
            executionMode: "SANDBOX_ONLY",
            recoveryRequired: true,
            outcomeSummary:
              "Cross-tenant failure.",
            outputPreview:
              "Cross-tenant result.",
          },

          auditEvent: {
            id: "audit-attacker",
            tenantId: "tenant-attacker",
            trackingId,
            executionId: "execution-attacker",
            eventType:
              "SANDBOX_EXECUTION_FAILED",
            outcome: "FAILURE",
            recoveryRequired: true,
            executionMode: "SANDBOX_ONLY",
            integrityAlgorithm: "SHA-256",
            integrityDigest: validDigest,
            immutable: true,
          },

          completedRecoveryAttempts: 0,
        };
      },
    },

    recoveryRepository: {
      async claimRecovery(receivedInput) {
        claimCalls += 1;

        return {
          outcome: "CLAIMED",
          claim: {
            id: "should-not-exist",
            ...receivedInput,
            claimedAt:
              "2026-07-10T15:59:59.000Z",
          },
        };
      },

      completeRecovery:
        base.recoveryRepository.completeRecovery,
    },

    recoveryExecutor: {
      mode: "SANDBOX_ONLY",

      async recover() {
        executorCalls += 1;

        return {
          status: "FAILED",
          summary: "Should not execute.",
          output: "Cross-tenant recovery blocked.",
          startedAt:
            "2026-07-10T16:00:00.000Z",
          completedAt:
            "2026-07-10T16:00:01.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "RECOVERABLE_TRACKING_TENANT_MISMATCH",
  );

  assert.equal(claimCalls, 0);
  assert.equal(executorCalls, 0);
});

test("invalid failure audit integrity blocks recovery", async () => {
  let claimCalls = 0;
  let executorCalls = 0;

  const base = validInput();

  const input = validInput({
    recoveryReadRepository: {
      async findRecoverableFailure(
        tenantId,
        trackingId,
      ) {
        return {
          tracking: {
            id: trackingId,
            tenantId,
            executionId: "execution-failed-1",
            inquiryId: "inquiry-1",
            recommendationId:
              "recommendation-1",
            ownerApprovalId: "approval-1",
            approvalOwnerUserId:
              "owner-user-1",
            executionStatus: "FAILED",
            resultStatus:
              "FAILED_REQUIRES_RECOVERY",
            trackingStatus: "RECORDED",
            executionMode: "SANDBOX_ONLY",
            recoveryRequired: true,
            outcomeSummary:
              "Sandbox execution failed safely.",
            outputPreview:
              "No live-provider execution occurred.",
          },

          auditEvent: {
            id: "audit-failed-1",
            tenantId,
            trackingId,
            executionId: "execution-failed-1",
            eventType:
              "SANDBOX_EXECUTION_FAILED",
            outcome: "FAILURE",
            recoveryRequired: true,
            executionMode: "SANDBOX_ONLY",
            integrityAlgorithm: "SHA-256",
            integrityDigest: "corrupt",
            immutable: true,
          },

          completedRecoveryAttempts: 0,
        };
      },
    },

    recoveryRepository: {
      async claimRecovery(receivedInput) {
        claimCalls += 1;

        return {
          outcome: "CLAIMED",
          claim: {
            id: "should-not-exist",
            ...receivedInput,
            claimedAt:
              "2026-07-10T15:59:59.000Z",
          },
        };
      },

      completeRecovery:
        base.recoveryRepository.completeRecovery,
    },

    recoveryExecutor: {
      mode: "SANDBOX_ONLY",

      async recover() {
        executorCalls += 1;

        return {
          status: "FAILED",
          summary: "Should not execute.",
          output: "Audit integrity was invalid.",
          startedAt:
            "2026-07-10T16:00:00.000Z",
          completedAt:
            "2026-07-10T16:00:01.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "RECOVERABLE_AUDIT_INTEGRITY_INVALID",
  );

  assert.equal(claimCalls, 0);
  assert.equal(executorCalls, 0);
});

test("maximum recovery attempts are enforced before claim", async () => {
  let claimCalls = 0;
  let executorCalls = 0;

  const base = validInput();

  const input = validInput({
    recoveryReadRepository: {
      async findRecoverableFailure(
        tenantId,
        trackingId,
      ) {
        return {
          tracking: {
            id: trackingId,
            tenantId,
            executionId: "execution-failed-1",
            inquiryId: "inquiry-1",
            recommendationId:
              "recommendation-1",
            ownerApprovalId: "approval-1",
            approvalOwnerUserId:
              "owner-user-1",
            executionStatus: "FAILED",
            resultStatus:
              "FAILED_REQUIRES_RECOVERY",
            trackingStatus: "RECORDED",
            executionMode: "SANDBOX_ONLY",
            recoveryRequired: true,
            outcomeSummary:
              "Sandbox execution failed safely.",
            outputPreview:
              "No live-provider execution occurred.",
          },

          auditEvent: {
            id: "audit-failed-1",
            tenantId,
            trackingId,
            executionId: "execution-failed-1",
            eventType:
              "SANDBOX_EXECUTION_FAILED",
            outcome: "FAILURE",
            recoveryRequired: true,
            executionMode: "SANDBOX_ONLY",
            integrityAlgorithm: "SHA-256",
            integrityDigest: validDigest,
            immutable: true,
          },

          completedRecoveryAttempts: 3,
        };
      },
    },

    recoveryRepository: {
      async claimRecovery(receivedInput) {
        claimCalls += 1;

        return {
          outcome: "CLAIMED",
          claim: {
            id: "should-not-exist",
            ...receivedInput,
            claimedAt:
              "2026-07-10T15:59:59.000Z",
          },
        };
      },

      completeRecovery:
        base.recoveryRepository.completeRecovery,
    },

    recoveryExecutor: {
      mode: "SANDBOX_ONLY",

      async recover() {
        executorCalls += 1;

        return {
          status: "FAILED",
          summary: "Should not execute.",
          output:
            "Maximum attempts were already reached.",
          startedAt:
            "2026-07-10T16:00:00.000Z",
          completedAt:
            "2026-07-10T16:00:01.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "RECOVERY_MAXIMUM_ATTEMPTS_REACHED",
  );

  assert.equal(claimCalls, 0);
  assert.equal(executorCalls, 0);
});

test("live recovery executor is rejected before recovery read", async () => {
  let recoveryReads = 0;
  let executorCalls = 0;

  const unsafeExecutor = {
    mode: "LIVE_PROVIDER",

    async recover() {
      executorCalls += 1;

      return {
        status: "RECOVERED" as const,
        summary: "Unsafe live recovery.",
        output: "Live execution must not occur.",
        startedAt:
          "2026-07-10T16:00:00.000Z",
        completedAt:
          "2026-07-10T16:00:01.000Z",
      };
    },
  };

  const input = validInput({
    recoveryReadRepository: {
      async findRecoverableFailure() {
        recoveryReads += 1;
        return null;
      },
    },

    recoveryExecutor:
      unsafeExecutor as unknown as
        RecoverAuthenticatedSandboxExecutionInput[
          "recoveryExecutor"
        ],
  });

  await expectDenied(
    input,
    "LIVE_RECOVERY_EXECUTOR_NOT_AUTHORIZED",
  );

  assert.equal(recoveryReads, 0);
  assert.equal(executorCalls, 0);
});

test("executor exception is recorded as a safe failed recovery", async () => {
  let completionInput:
    | CompleteSandboxRecoveryInput
    | undefined;

  const input = validInput({
    recoveryExecutor: {
      mode: "SANDBOX_ONLY",

      async recover() {
        throw new Error(
          "simulated sandbox recovery failure",
        );
      },
    },

    recoveryRepository: {
      async claimRecovery(receivedInput) {
        return {
          outcome: "CLAIMED",
          claim: {
            id: "recovery-failed-1",
            ...receivedInput,
            claimedAt:
              "2026-07-10T15:59:59.000Z",
          },
        };
      },

      async completeRecovery(receivedInput) {
        completionInput = receivedInput;

        return {
          id: receivedInput.recoveryId,
          tenantId: receivedInput.tenantId,
          trackingId: receivedInput.trackingId,
          failedExecutionId:
            receivedInput.failedExecutionId,
          inquiryId: receivedInput.inquiryId,
          recommendationId:
            receivedInput.recommendationId,
          ownerApprovalId:
            receivedInput.ownerApprovalId,
          ownerUserId:
            receivedInput.ownerUserId,
          sourceSessionId:
            receivedInput.sourceSessionId,
          failureAuditEventId:
            receivedInput.failureAuditEventId,
          idempotencyKey:
            receivedInput.idempotencyKey,
          attemptNumber:
            receivedInput.attemptNumber,
          maximumAttempts: 3,
          status: receivedInput.status,
          executionMode: "SANDBOX_ONLY",
          automaticRetry: false,
          summary: receivedInput.summary,
          output: receivedInput.output,
          startedAt: receivedInput.startedAt,
          completedAt:
            receivedInput.completedAt,
          createdAt: new Date().toISOString(),
        };
      },
    },
  });

  const result =
    await recoverAuthenticatedSandboxExecution(
      input,
    );

  assert.equal(
    completionInput?.status,
    "FAILED",
  );

  assert.equal(result.outcome, "FAILED");
  assert.equal(result.recovery.status, "FAILED");

  assert.equal(
    result.nextBoundary.recoveryStatus,
    "RETRY_REVIEW_REQUIRED",
  );

  assert.equal(
    result.safetyBoundary.automaticRetry,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .liveProviderExecutionAuthorized,
    false,
  );
});
