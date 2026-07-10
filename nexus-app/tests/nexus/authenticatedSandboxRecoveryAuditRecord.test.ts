import assert from "node:assert/strict";
import test from "node:test";

import {
  TenantAccessDeniedError,
} from "../../lib/nexus/auth/tenantAccessContext";

import {
  recordAuthenticatedSandboxRecoveryAudit,
  SandboxRecoveryAuditDeniedError,
  type RecordAuthenticatedSandboxRecoveryAuditInput,
  type SandboxRecoveryAuditPersistenceInput,
} from "../../lib/nexus/audit/authenticatedSandboxRecoveryAuditRecord";

function validInput(
  overrides:
    Partial<RecordAuthenticatedSandboxRecoveryAuditInput> = {},
): RecordAuthenticatedSandboxRecoveryAuditInput {
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
      async findRecoveryByTenantAndId(
        tenantId,
        recoveryId,
      ) {
        return {
          id: recoveryId,
          tenantId,
          trackingId: "tracking-failed-1",
          failedExecutionId: "execution-failed-1",
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          ownerUserId: "owner-user-1",
          sourceSessionId: "owner-session-1",
          failureAuditEventId: "audit-failed-1",
          attemptNumber: 1,
          maximumAttempts: 3,
          status: "RECOVERED",
          executionMode: "SANDBOX_ONLY",
          automaticRetry: false,
          summary:
            "Sandbox recovery completed successfully.",
          output:
            "A safe sandbox result was produced.",
          startedAt: "2026-07-10T16:00:00.000Z",
          completedAt: "2026-07-10T16:00:01.000Z",
          createdAt: "2026-07-10T16:00:02.000Z",
        };
      },
    },

    auditRepository: {
      async appendOrGetRecoveryEvent(
        input: SandboxRecoveryAuditPersistenceInput,
      ) {
        return {
          outcome: "CREATED",
          event: {
            id: "recovery-audit-1",
            ...input,
            createdAt: "2026-07-10T16:01:00.000Z",
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    recoveryId: "recovery-1",
    idempotencyKey: "recovery-audit-0001",
    ...overrides,
  };
}

async function expectDenied(
  input: RecordAuthenticatedSandboxRecoveryAuditInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      recordAuthenticatedSandboxRecoveryAudit(input),
    (error: unknown) => {
      assert.ok(
        error instanceof
          SandboxRecoveryAuditDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("creates immutable audit for successful sandbox recovery", async () => {
  let persistenceInput:
    | SandboxRecoveryAuditPersistenceInput
    | undefined;

  const result =
    await recordAuthenticatedSandboxRecoveryAudit(
      validInput({
        auditRepository: {
          async appendOrGetRecoveryEvent(
            receivedInput,
          ) {
            persistenceInput = receivedInput;

            return {
              outcome: "CREATED",
              event: {
                id: "recovery-audit-1",
                ...receivedInput,
                createdAt:
                  "2026-07-10T16:01:00.000Z",
              },
            };
          },
        },
      }),
    );

  assert.equal(
    persistenceInput?.eventType,
    "SANDBOX_RECOVERY_SUCCEEDED",
  );

  assert.equal(
    persistenceInput?.outcome,
    "SUCCESS",
  );

  assert.equal(
    persistenceInput?.severity,
    "INFO",
  );

  assert.equal(
    persistenceInput?.automaticRetry,
    false,
  );

  assert.equal(
    persistenceInput?.integrityAlgorithm,
    "SHA-256",
  );

  assert.match(
    persistenceInput?.integrityDigest ?? "",
    /^[a-f0-9]{64}$/,
  );

  assert.equal(result.outcome, "CREATED");

  assert.equal(
    result.auditEvent.recoveryStatus,
    "RECOVERED",
  );

  assert.equal(
    result.safetyBoundary.recoveryTriggered,
    false,
  );

  assert.equal(
    result.nextBoundary.securityTestingStatus,
    "PENDING",
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.auditEvent),
    true,
  );
});

test("failed recovery creates error audit event", async () => {
  const result =
    await recordAuthenticatedSandboxRecoveryAudit(
      validInput({
        recoveryReadRepository: {
          async findRecoveryByTenantAndId(
            tenantId,
            recoveryId,
          ) {
            return {
              id: recoveryId,
              tenantId,
              trackingId: "tracking-failed-1",
              failedExecutionId:
                "execution-failed-1",
              inquiryId: "inquiry-1",
              recommendationId:
                "recommendation-1",
              ownerApprovalId: "approval-1",
              ownerUserId: "owner-user-1",
              sourceSessionId:
                "owner-session-1",
              failureAuditEventId:
                "audit-failed-1",
              attemptNumber: 2,
              maximumAttempts: 3,
              status: "FAILED",
              executionMode: "SANDBOX_ONLY",
              automaticRetry: false,
              summary:
                "Sandbox recovery failed safely.",
              output:
                "Explicit owner review is required.",
              startedAt:
                "2026-07-10T16:00:00.000Z",
              completedAt:
                "2026-07-10T16:00:01.000Z",
              createdAt:
                "2026-07-10T16:00:02.000Z",
            };
          },
        },
      }),
    );

  assert.equal(
    result.auditEvent.eventType,
    "SANDBOX_RECOVERY_FAILED",
  );

  assert.equal(
    result.auditEvent.recoveryStatus,
    "FAILED",
  );

  assert.equal(
    result.auditEvent.severity,
    "ERROR",
  );

  assert.equal(
    result.auditEvent.outcome,
    "FAILURE",
  );
});

test("returns existing recovery audit idempotently", async () => {
  const result =
    await recordAuthenticatedSandboxRecoveryAudit(
      validInput({
        auditRepository: {
          async appendOrGetRecoveryEvent(
            receivedInput,
          ) {
            return {
              outcome: "EXISTING",
              event: {
                id: "recovery-audit-existing-1",
                ...receivedInput,
                createdAt:
                  "2026-07-10T16:01:00.000Z",
              },
            };
          },
        },
      }),
    );

  assert.equal(result.outcome, "EXISTING");

  assert.equal(
    result.auditEvent.id,
    "recovery-audit-existing-1",
  );
});

test("non-owner cannot create recovery audit", async () => {
  let recoveryReads = 0;
  let auditWrites = 0;

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
      async findRecoveryByTenantAndId() {
        recoveryReads += 1;
        return null;
      },
    },

    auditRepository: {
      async appendOrGetRecoveryEvent(
        receivedInput,
      ) {
        auditWrites += 1;

        return {
          outcome: "CREATED",
          event: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T16:01:00.000Z",
          },
        };
      },
    },
  });

  await assert.rejects(
    () =>
      recordAuthenticatedSandboxRecoveryAudit(input),
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
  assert.equal(auditWrites, 0);
});

test("cross-tenant recovery is blocked before audit persistence", async () => {
  let auditWrites = 0;

  const input = validInput({
    recoveryReadRepository: {
      async findRecoveryByTenantAndId(
        _tenantId,
        recoveryId,
      ) {
        return {
          id: recoveryId,
          tenantId: "tenant-attacker",
          trackingId: "tracking-attacker",
          failedExecutionId:
            "execution-attacker",
          inquiryId: "inquiry-attacker",
          recommendationId:
            "recommendation-attacker",
          ownerApprovalId: "approval-attacker",
          ownerUserId: "owner-user-1",
          sourceSessionId: "session-attacker",
          failureAuditEventId:
            "audit-attacker",
          attemptNumber: 1,
          maximumAttempts: 3,
          status: "RECOVERED",
          executionMode: "SANDBOX_ONLY",
          automaticRetry: false,
          summary: "Cross-tenant recovery.",
          output: "Cross-tenant output.",
          startedAt:
            "2026-07-10T16:00:00.000Z",
          completedAt:
            "2026-07-10T16:00:01.000Z",
          createdAt:
            "2026-07-10T16:00:02.000Z",
        };
      },
    },

    auditRepository: {
      async appendOrGetRecoveryEvent(
        receivedInput,
      ) {
        auditWrites += 1;

        return {
          outcome: "CREATED",
          event: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T16:01:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "AUDITABLE_RECOVERY_TENANT_MISMATCH",
  );

  assert.equal(auditWrites, 0);
});

test("automatic recovery record cannot be audited", async () => {
  let auditWrites = 0;

  const input = validInput({
    recoveryReadRepository: {
      async findRecoveryByTenantAndId(
        tenantId,
        recoveryId,
      ) {
        return {
          id: recoveryId,
          tenantId,
          trackingId: "tracking-failed-1",
          failedExecutionId:
            "execution-failed-1",
          inquiryId: "inquiry-1",
          recommendationId:
            "recommendation-1",
          ownerApprovalId: "approval-1",
          ownerUserId: "owner-user-1",
          sourceSessionId: "owner-session-1",
          failureAuditEventId:
            "audit-failed-1",
          attemptNumber: 1,
          maximumAttempts: 3,
          status: "RECOVERED",
          executionMode: "SANDBOX_ONLY",
          automaticRetry: true,
          summary: "Unsafe automatic recovery.",
          output: "Automatic recovery occurred.",
          startedAt:
            "2026-07-10T16:00:00.000Z",
          completedAt:
            "2026-07-10T16:00:01.000Z",
          createdAt:
            "2026-07-10T16:00:02.000Z",
        } as unknown as {
          id: string;
          tenantId: string;
          trackingId: string;
          failedExecutionId: string;
          inquiryId: string;
          recommendationId: string;
          ownerApprovalId: string;
          ownerUserId: string;
          sourceSessionId: string;
          failureAuditEventId: string;
          attemptNumber: number;
          maximumAttempts: 3;
          status: "RECOVERED" | "FAILED";
          executionMode: "SANDBOX_ONLY";
          automaticRetry: false;
          summary: string;
          output: string;
          startedAt: string;
          completedAt: string;
          createdAt: string;
        };
      },
    },

    auditRepository: {
      async appendOrGetRecoveryEvent(
        receivedInput,
      ) {
        auditWrites += 1;

        return {
          outcome: "CREATED",
          event: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T16:01:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "AUDITABLE_RECOVERY_AUTOMATION_INVALID",
  );

  assert.equal(auditWrites, 0);
});

test("non-sandbox recovery cannot create audit event", async () => {
  let auditWrites = 0;

  const input = validInput({
    recoveryReadRepository: {
      async findRecoveryByTenantAndId(
        tenantId,
        recoveryId,
      ) {
        return {
          id: recoveryId,
          tenantId,
          trackingId: "tracking-failed-1",
          failedExecutionId:
            "execution-failed-1",
          inquiryId: "inquiry-1",
          recommendationId:
            "recommendation-1",
          ownerApprovalId: "approval-1",
          ownerUserId: "owner-user-1",
          sourceSessionId: "owner-session-1",
          failureAuditEventId:
            "audit-failed-1",
          attemptNumber: 1,
          maximumAttempts: 3,
          status: "RECOVERED",
          executionMode: "LIVE_PROVIDER",
          automaticRetry: false,
          summary: "Unsafe recovery.",
          output: "Live provider recovery.",
          startedAt:
            "2026-07-10T16:00:00.000Z",
          completedAt:
            "2026-07-10T16:00:01.000Z",
          createdAt:
            "2026-07-10T16:00:02.000Z",
        } as unknown as {
          id: string;
          tenantId: string;
          trackingId: string;
          failedExecutionId: string;
          inquiryId: string;
          recommendationId: string;
          ownerApprovalId: string;
          ownerUserId: string;
          sourceSessionId: string;
          failureAuditEventId: string;
          attemptNumber: number;
          maximumAttempts: 3;
          status: "RECOVERED" | "FAILED";
          executionMode: "SANDBOX_ONLY";
          automaticRetry: false;
          summary: string;
          output: string;
          startedAt: string;
          completedAt: string;
          createdAt: string;
        };
      },
    },

    auditRepository: {
      async appendOrGetRecoveryEvent(
        receivedInput,
      ) {
        auditWrites += 1;

        return {
          outcome: "CREATED",
          event: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T16:01:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "AUDITABLE_RECOVERY_MODE_INVALID",
  );

  assert.equal(auditWrites, 0);
});

test("corrupted persisted digest fails closed", async () => {
  const input = validInput({
    auditRepository: {
      async appendOrGetRecoveryEvent(
        receivedInput,
      ) {
        return {
          outcome: "CREATED",
          event: {
            id: "recovery-audit-corrupt-1",
            ...receivedInput,
            integrityDigest: "0".repeat(64),
            createdAt:
              "2026-07-10T16:01:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "RECOVERY_AUDIT_PERSISTED_DIGEST_INVALID",
  );
});

test("audit recording cannot trigger recovery or execution", async () => {
  const result =
    await recordAuthenticatedSandboxRecoveryAudit(
      validInput(),
    );

  assert.equal(
    result.safetyBoundary.appendOnlyAudit,
    true,
  );

  assert.equal(
    result.safetyBoundary.recoveryTriggered,
    false,
  );

  assert.equal(
    result.safetyBoundary.executionTriggered,
    false,
  );

  assert.equal(
    result.safetyBoundary.automaticRetry,
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
