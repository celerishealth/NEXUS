import assert from "node:assert/strict";
import test from "node:test";

import {
  recordAuthenticatedExecutionAudit,
  ExecutionAuditDeniedError,
  type ExecutionAuditPersistenceInput,
  type RecordAuthenticatedExecutionAuditInput,
} from "../../lib/nexus/audit/authenticatedExecutionAuditRecord";

function validInput(
  overrides:
    Partial<RecordAuthenticatedExecutionAuditInput> = {},
): RecordAuthenticatedExecutionAuditInput {
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

    trackingReadRepository: {
      async findTrackingByTenantAndId(
        tenantId,
        trackingId,
      ) {
        return {
          id: trackingId,
          tenantId,
          executionId: "execution-1",
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          trackedByUserId: "operator-user-1",
          executionStatus: "SUCCEEDED",
          resultStatus: "AVAILABLE",
          trackingStatus: "RECORDED",
          executionMode: "SANDBOX_ONLY",
          recoveryRequired: false,
          createdAt: "2026-07-10T15:01:00.000Z",
        };
      },
    },

    auditRepository: {
      async appendOrGetEvent(
        input: ExecutionAuditPersistenceInput,
      ) {
        return {
          outcome: "CREATED",
          event: {
            id: "audit-1",
            ...input,
            createdAt: "2026-07-10T15:02:00.000Z",
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    trackingId: "tracking-1",
    idempotencyKey: "execution-audit-0001",
    ...overrides,
  };
}

async function expectDenied(
  input: RecordAuthenticatedExecutionAuditInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () => recordAuthenticatedExecutionAudit(input),
    (error: unknown) => {
      assert.ok(
        error instanceof ExecutionAuditDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("creates an immutable successful execution audit event", async () => {
  let persistenceInput:
    | ExecutionAuditPersistenceInput
    | undefined;

  const result =
    await recordAuthenticatedExecutionAudit(
      validInput({
        auditRepository: {
          async appendOrGetEvent(receivedInput) {
            persistenceInput = receivedInput;

            return {
              outcome: "CREATED",
              event: {
                id: "audit-1",
                ...receivedInput,
                createdAt:
                  "2026-07-10T15:02:00.000Z",
              },
            };
          },
        },
      }),
    );

  assert.equal(
    persistenceInput?.eventType,
    "SANDBOX_EXECUTION_SUCCEEDED",
  );

  assert.equal(persistenceInput?.severity, "INFO");
  assert.equal(persistenceInput?.outcome, "SUCCESS");
  assert.equal(
    persistenceInput?.recoveryRequired,
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

  assert.equal(persistenceInput?.immutable, true);
  assert.equal(result.outcome, "CREATED");

  assert.equal(
    result.auditEvent.eventType,
    "SANDBOX_EXECUTION_SUCCEEDED",
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
    Object.isFrozen(result.auditEvent),
    true,
  );
});

test("failed execution creates error audit and preserves recovery requirement", async () => {
  const result =
    await recordAuthenticatedExecutionAudit(
      validInput({
        trackingReadRepository: {
          async findTrackingByTenantAndId(
            tenantId,
            trackingId,
          ) {
            return {
              id: trackingId,
              tenantId,
              executionId: "execution-failed-1",
              inquiryId: "inquiry-1",
              recommendationId:
                "recommendation-1",
              ownerApprovalId: "approval-1",
              trackedByUserId:
                "operator-user-1",
              executionStatus: "FAILED",
              resultStatus:
                "FAILED_REQUIRES_RECOVERY",
              trackingStatus: "RECORDED",
              executionMode: "SANDBOX_ONLY",
              recoveryRequired: true,
              createdAt:
                "2026-07-10T15:01:00.000Z",
            };
          },
        },

        auditRepository: {
          async appendOrGetEvent(receivedInput) {
            return {
              outcome: "CREATED",
              event: {
                id: "audit-failed-1",
                ...receivedInput,
                createdAt:
                  "2026-07-10T15:02:00.000Z",
              },
            };
          },
        },
      }),
    );

  assert.equal(
    result.auditEvent.eventType,
    "SANDBOX_EXECUTION_FAILED",
  );

  assert.equal(result.auditEvent.severity, "ERROR");
  assert.equal(result.auditEvent.outcome, "FAILURE");

  assert.equal(
    result.auditEvent.recoveryRequired,
    true,
  );

  assert.equal(
    result.nextBoundary.recoveryStatus,
    "REQUIRED",
  );
});

test("returns an existing audit event idempotently", async () => {
  const result =
    await recordAuthenticatedExecutionAudit(
      validInput({
        auditRepository: {
          async appendOrGetEvent(receivedInput) {
            return {
              outcome: "EXISTING",
              event: {
                id: "audit-existing-1",
                ...receivedInput,
                createdAt:
                  "2026-07-10T15:02:00.000Z",
              },
            };
          },
        },
      }),
    );

  assert.equal(result.outcome, "EXISTING");

  assert.equal(
    result.auditEvent.id,
    "audit-existing-1",
  );
});

test("VIEWER cannot create audit records", async () => {
  let trackingReads = 0;
  let auditWrites = 0;

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

    trackingReadRepository: {
      async findTrackingByTenantAndId(
        tenantId,
        trackingId,
      ) {
        trackingReads += 1;

        return {
          id: trackingId,
          tenantId,
          executionId: "execution-1",
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          trackedByUserId: "viewer-user-1",
          executionStatus: "SUCCEEDED",
          resultStatus: "AVAILABLE",
          trackingStatus: "RECORDED",
          executionMode: "SANDBOX_ONLY",
          recoveryRequired: false,
          createdAt:
            "2026-07-10T15:01:00.000Z",
        };
      },
    },

    auditRepository: {
      async appendOrGetEvent(receivedInput) {
        auditWrites += 1;

        return {
          outcome: "CREATED",
          event: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:02:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "EXECUTION_AUDIT_ROLE_NOT_AUTHORIZED",
  );

  assert.equal(trackingReads, 0);
  assert.equal(auditWrites, 0);
});

test("cross-tenant tracking is blocked before audit persistence", async () => {
  let auditWrites = 0;

  const input = validInput({
    trackingReadRepository: {
      async findTrackingByTenantAndId(
        _tenantId,
        trackingId,
      ) {
        return {
          id: trackingId,
          tenantId: "tenant-attacker",
          executionId: "execution-attacker",
          inquiryId: "inquiry-attacker",
          recommendationId:
            "recommendation-attacker",
          ownerApprovalId: "approval-attacker",
          trackedByUserId: "user-attacker",
          executionStatus: "SUCCEEDED",
          resultStatus: "AVAILABLE",
          trackingStatus: "RECORDED",
          executionMode: "SANDBOX_ONLY",
          recoveryRequired: false,
          createdAt:
            "2026-07-10T15:01:00.000Z",
        };
      },
    },

    auditRepository: {
      async appendOrGetEvent(receivedInput) {
        auditWrites += 1;

        return {
          outcome: "CREATED",
          event: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:02:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "AUDITABLE_TRACKING_TENANT_MISMATCH",
  );

  assert.equal(auditWrites, 0);
});

test("unrecorded tracking cannot create an audit event", async () => {
  let auditWrites = 0;

  const input = validInput({
    trackingReadRepository: {
      async findTrackingByTenantAndId(
        tenantId,
        trackingId,
      ) {
        return {
          id: trackingId,
          tenantId,
          executionId: "execution-1",
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          trackedByUserId: "operator-user-1",
          executionStatus: "SUCCEEDED",
          resultStatus: "AVAILABLE",
          trackingStatus: "PENDING",
          executionMode: "SANDBOX_ONLY",
          recoveryRequired: false,
          createdAt:
            "2026-07-10T15:01:00.000Z",
        } as unknown as {
          id: string;
          tenantId: string;
          executionId: string;
          inquiryId: string;
          recommendationId: string;
          ownerApprovalId: string;
          trackedByUserId: string;
          executionStatus: "SUCCEEDED" | "FAILED";
          resultStatus:
            | "AVAILABLE"
            | "FAILED_REQUIRES_RECOVERY";
          trackingStatus: "RECORDED";
          executionMode: "SANDBOX_ONLY";
          recoveryRequired: boolean;
          createdAt: string;
        };
      },
    },

    auditRepository: {
      async appendOrGetEvent(receivedInput) {
        auditWrites += 1;

        return {
          outcome: "CREATED",
          event: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:02:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "AUDITABLE_TRACKING_STATUS_INVALID",
  );

  assert.equal(auditWrites, 0);
});

test("non-sandbox tracking cannot create an audit event", async () => {
  let auditWrites = 0;

  const input = validInput({
    trackingReadRepository: {
      async findTrackingByTenantAndId(
        tenantId,
        trackingId,
      ) {
        return {
          id: trackingId,
          tenantId,
          executionId: "execution-1",
          inquiryId: "inquiry-1",
          recommendationId: "recommendation-1",
          ownerApprovalId: "approval-1",
          trackedByUserId: "operator-user-1",
          executionStatus: "SUCCEEDED",
          resultStatus: "AVAILABLE",
          trackingStatus: "RECORDED",
          executionMode: "LIVE_PROVIDER",
          recoveryRequired: false,
          createdAt:
            "2026-07-10T15:01:00.000Z",
        } as unknown as {
          id: string;
          tenantId: string;
          executionId: string;
          inquiryId: string;
          recommendationId: string;
          ownerApprovalId: string;
          trackedByUserId: string;
          executionStatus: "SUCCEEDED" | "FAILED";
          resultStatus:
            | "AVAILABLE"
            | "FAILED_REQUIRES_RECOVERY";
          trackingStatus: "RECORDED";
          executionMode: "SANDBOX_ONLY";
          recoveryRequired: boolean;
          createdAt: string;
        };
      },
    },

    auditRepository: {
      async appendOrGetEvent(receivedInput) {
        auditWrites += 1;

        return {
          outcome: "CREATED",
          event: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt:
              "2026-07-10T15:02:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "AUDITABLE_TRACKING_MODE_INVALID",
  );

  assert.equal(auditWrites, 0);
});

test("fails closed when persistence changes the integrity digest", async () => {
  const input = validInput({
    auditRepository: {
      async appendOrGetEvent(receivedInput) {
        return {
          outcome: "CREATED",
          event: {
            id: "audit-corrupt-1",
            ...receivedInput,
            integrityDigest: "0".repeat(64),
            createdAt:
              "2026-07-10T15:02:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "EXECUTION_AUDIT_PERSISTED_DIGEST_INVALID",
  );
});

test("audit recording cannot trigger execution or live-provider activity", async () => {
  const result =
    await recordAuthenticatedExecutionAudit(
      validInput(),
    );

  assert.equal(
    result.safetyBoundary.appendOnlyAudit,
    true,
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
    "RECORDED",
  );
});
