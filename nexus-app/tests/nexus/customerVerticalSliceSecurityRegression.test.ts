import assert from "node:assert/strict";
import test from "node:test";

import {
  TenantAccessDeniedError,
} from "../../lib/nexus/auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  TenantWorkspaceDeniedError,
} from "../../lib/nexus/onboarding/authenticatedTenantWorkspace";

import {
  createAuthenticatedCustomerInquiry,
  CustomerInquiryDeniedError,
} from "../../lib/nexus/inquiry/authenticatedCustomerInquiry";

import {
  generateAuthenticatedInquiryRecommendation,
  InquiryRecommendationDeniedError,
} from "../../lib/nexus/recommendation/authenticatedInquiryRecommendation";

import {
  decideAuthenticatedRecommendation,
} from "../../lib/nexus/approval/authenticatedOwnerRecommendationDecision";

import {
  executeApprovedSandboxRecommendation,
  ApprovedSandboxExecutionDeniedError,
} from "../../lib/nexus/execution/authenticatedSandboxRecommendationExecution";

import {
  recordAuthenticatedSandboxExecutionResult,
  ExecutionResultTrackingDeniedError,
} from "../../lib/nexus/tracking/authenticatedSandboxExecutionResultTracking";

import {
  recordAuthenticatedExecutionAudit,
  ExecutionAuditDeniedError,
} from "../../lib/nexus/audit/authenticatedExecutionAuditRecord";

import {
  recoverAuthenticatedSandboxExecution,
  SandboxRecoveryDeniedError,
} from "../../lib/nexus/recovery/authenticatedSandboxExecutionRecovery";

import {
  recordAuthenticatedSandboxRecoveryAudit,
  SandboxRecoveryAuditDeniedError,
} from "../../lib/nexus/audit/authenticatedSandboxRecoveryAuditRecord";

type MembershipRole =
  | "OWNER"
  | "ADMIN"
  | "OPERATOR"
  | "VIEWER";

type CodedErrorConstructor = new (
  ...args: never[]
) => Error & {
  readonly code: string;
};

const validDigest = "a".repeat(64);

const ownerPrincipal = {
  userId: "owner-user-1",
  tenantId: "tenant-1",
  sessionId: "owner-session-1",
} as const;

const operatorPrincipal = {
  userId: "operator-user-1",
  tenantId: "tenant-1",
  sessionId: "operator-session-1",
} as const;

function accessRepositories(
  role: MembershipRole,
) {
  return {
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
        role,
        status: "ACTIVE" as const,
      };
    },
  };
}

function workspaceRepository() {
  return {
    async findWorkspaceByTenantId(
      tenantId: string,
    ) {
      return {
        tenantId,
        ownerUserId: "owner-user-1",
        businessName: "NEXUS Security Business",
        businessSlug: "nexus-security-business",
        status: "ACTIVE" as const,
        onboardingStatus: "COMPLETE" as const,
        timezone: "Europe/Amsterdam",
        locale: "en-NL",
      };
    },
  };
}

async function expectCode(
  action: () => Promise<unknown>,
  ErrorConstructor: CodedErrorConstructor,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    action,
    (error: unknown) => {
      assert.ok(error instanceof ErrorConstructor);
      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("cross-tenant workspace selection is blocked before workspace access", async () => {
  let workspaceReads = 0;

  await expectCode(
    () =>
      buildAuthenticatedTenantWorkspace({
        principal: ownerPrincipal,
        accessRepositories:
          accessRepositories("OWNER"),

        workspaceRepository: {
          async findWorkspaceByTenantId(
            tenantId: string,
          ) {
            workspaceReads += 1;

            return {
              tenantId,
              ownerUserId: "owner-user-1",
              businessName: "Unsafe Business",
              businessSlug: "unsafe-business",
              status: "ACTIVE",
              onboardingStatus: "COMPLETE",
              timezone: "UTC",
              locale: "en",
            };
          },
        },

        requestedTenantId: "tenant-attacker",
        requireOwner: true,
      }),
    TenantWorkspaceDeniedError,
    "CROSS_TENANT_WORKSPACE_ACCESS_DENIED",
  );

  assert.equal(workspaceReads, 0);
});

test("VIEWER inquiry write is blocked before repository persistence", async () => {
  let inquiryWrites = 0;

  await expectCode(
    () =>
      createAuthenticatedCustomerInquiry({
        principal: {
          userId: "viewer-user-1",
          tenantId: "tenant-1",
          sessionId: "viewer-session-1",
        },

        accessRepositories:
          accessRepositories("VIEWER"),

        workspaceRepository:
          workspaceRepository(),

        inquiryRepository: {
          async createOrGetInquiry(input) {
            inquiryWrites += 1;

            return {
              outcome: "CREATED",
              inquiry: {
                id: "should-not-exist",
                tenantId: input.tenantId,
                createdByUserId:
                  input.createdByUserId,
                sourceSessionId:
                  input.sourceSessionId,
                idempotencyKey:
                  input.idempotencyKey,
                channel: input.channel,
                customerName:
                  input.customerName,
                customerEmail:
                  input.customerEmail,
                customerPhone:
                  input.customerPhone,
                message: input.message,
                status: "NEW",
                createdAt:
                  "2026-07-10T12:00:00.000Z",
              },
            };
          },
        },

        requestedTenantId: "tenant-1",
        idempotencyKey:
          "security-inquiry-0001",
        channel: "WEB",
        customerName: "Security Customer",
        customerEmail:
          "security@example.com",
        customerPhone: null,
        message:
          "This write must be blocked for viewers.",
      }),
    CustomerInquiryDeniedError,
    "INQUIRY_ROLE_NOT_AUTHORIZED",
  );

  assert.equal(inquiryWrites, 0);
});

test("live recommendation engine injection is blocked before inquiry access", async () => {
  let inquiryReads = 0;
  let engineCalls = 0;
  let recommendationWrites = 0;

  const unsafeEngine = {
    mode: "LIVE_PROVIDER",

    async generateRecommendation() {
      engineCalls += 1;

      return {
        title: "Unsafe live recommendation",
        summary:
          "This engine must never be called.",
        recommendedAction:
          "No action is authorized.",
        rationale:
          "Live-provider recommendation is disabled.",
        confidence: 100,
        riskLevel: "HIGH" as const,
        generatedAt:
          "2026-07-10T13:00:00.000Z",
      };
    },
  };

  await expectCode(
    () =>
      generateAuthenticatedInquiryRecommendation({
        principal: operatorPrincipal,
        accessRepositories:
          accessRepositories("OPERATOR"),
        workspaceRepository:
          workspaceRepository(),

        inquiryRepository: {
          async findInquiryByTenantAndId(
            tenantId,
            inquiryId,
          ) {
            inquiryReads += 1;

            return {
              id: inquiryId,
              tenantId,
              customerName:
                "Security Customer",
              message:
                "This inquiry must not reach a live engine.",
              status: "NEW",
            };
          },
        },

        recommendationRepository: {
          async createOrGetRecommendation(input) {
            recommendationWrites += 1;

            return {
              outcome: "CREATED",
              recommendation: {
                id: "should-not-exist",
                ...input,
                createdAt:
                  "2026-07-10T13:00:01.000Z",
              },
            };
          },
        },

        recommendationEngine:
          unsafeEngine as unknown as Parameters<
            typeof generateAuthenticatedInquiryRecommendation
          >[0]["recommendationEngine"],

        requestedTenantId: "tenant-1",
        inquiryId: "inquiry-1",
        idempotencyKey:
          "security-recommendation-0001",
      }),
    InquiryRecommendationDeniedError,
    "LIVE_RECOMMENDATION_ENGINE_NOT_AUTHORIZED",
  );

  assert.equal(inquiryReads, 0);
  assert.equal(engineCalls, 0);
  assert.equal(recommendationWrites, 0);
});

test("non-owner recommendation decision is blocked before recommendation access", async () => {
  let recommendationReads = 0;
  let decisionWrites = 0;

  await expectCode(
    () =>
      decideAuthenticatedRecommendation({
        principal: operatorPrincipal,
        accessRepositories:
          accessRepositories("OPERATOR"),
        workspaceRepository:
          workspaceRepository(),

        recommendationReadRepository: {
          async findRecommendationByTenantAndId(
            tenantId,
            recommendationId,
          ) {
            recommendationReads += 1;

            return {
              id: recommendationId,
              tenantId,
              inquiryId: "inquiry-1",
              status: "DRAFT",
              engineMode: "SANDBOX_ONLY",
            };
          },
        },

        decisionRepository: {
          async applyOwnerDecision(input) {
            decisionWrites += 1;

            return {
              outcome: "CREATED",
              approval: {
                id: "should-not-exist",
                ...input,
                decidedAt:
                  "2026-07-10T14:00:00.000Z",
                createdAt:
                  "2026-07-10T14:00:01.000Z",
              },
            };
          },
        },

        requestedTenantId: "tenant-1",
        recommendationId:
          "recommendation-1",
        idempotencyKey:
          "security-owner-decision-0001",
        decision: "APPROVED",
        decisionNote:
          "Unauthorized operator approval attempt.",
      }),
    TenantAccessDeniedError,
    "OWNER_AUTHORITY_REQUIRED",
  );

  assert.equal(recommendationReads, 0);
  assert.equal(decisionWrites, 0);
});

test("cross-tenant approved execution is blocked before claim and executor", async () => {
  let claimCalls = 0;
  let executorCalls = 0;

  await expectCode(
    () =>
      executeApprovedSandboxRecommendation({
        principal: ownerPrincipal,
        accessRepositories:
          accessRepositories("OWNER"),
        workspaceRepository:
          workspaceRepository(),

        executionReadRepository: {
          async findExecutableRecommendation(
            _tenantId,
            recommendationId,
          ) {
            return {
              recommendation: {
                id: recommendationId,
                tenantId: "tenant-attacker",
                inquiryId:
                  "inquiry-attacker",
                recommendedAction:
                  "Cross-tenant unsafe action.",
                status: "APPROVED",
                engineMode: "SANDBOX_ONLY",
              },

              approval: {
                id: "approval-attacker",
                tenantId: "tenant-attacker",
                recommendationId,
                inquiryId:
                  "inquiry-attacker",
                ownerUserId: "owner-user-1",
                recommendationStatus:
                  "APPROVED",
                executionStatus:
                  "READY_FOR_SANDBOX",
                executionMode:
                  "SANDBOX_ONLY",
              },
            };
          },
        },

        executionRepository: {
          async claimExecution(input) {
            claimCalls += 1;

            return {
              outcome: "CLAIMED",
              claim: {
                id: "should-not-exist",
                ...input,
                claimedAt:
                  "2026-07-10T15:00:00.000Z",
              },
            };
          },

          async completeExecution(input) {
            return {
              id: input.executionId,
              tenantId: input.tenantId,
              inquiryId: input.inquiryId,
              recommendationId:
                input.recommendationId,
              ownerApprovalId:
                input.ownerApprovalId,
              requestedByOwnerUserId:
                input.requestedByOwnerUserId,
              sourceSessionId:
                input.sourceSessionId,
              idempotencyKey:
                input.idempotencyKey,
              status: input.status,
              executionMode:
                input.executionMode,
              summary: input.summary,
              output: input.output,
              startedAt: input.startedAt,
              completedAt:
                input.completedAt,
              createdAt:
                "2026-07-10T15:00:02.000Z",
            };
          },
        },

        sandboxExecutor: {
          mode: "SANDBOX_ONLY",

          async execute() {
            executorCalls += 1;

            return {
              status: "FAILED",
              summary:
                "Should never execute.",
              output:
                "Cross-tenant execution was blocked.",
              startedAt:
                "2026-07-10T15:00:00.000Z",
              completedAt:
                "2026-07-10T15:00:01.000Z",
            };
          },
        },

        requestedTenantId: "tenant-1",
        recommendationId:
          "recommendation-1",
        idempotencyKey:
          "security-execution-0001",
      }),
    ApprovedSandboxExecutionDeniedError,
    "EXECUTABLE_RECOMMENDATION_TENANT_MISMATCH",
  );

  assert.equal(claimCalls, 0);
  assert.equal(executorCalls, 0);
});

test("existing idempotent execution prevents duplicate executor invocation", async () => {
  let executorCalls = 0;
  let completionCalls = 0;

  const result =
    await executeApprovedSandboxRecommendation({
      principal: ownerPrincipal,
      accessRepositories:
        accessRepositories("OWNER"),
      workspaceRepository:
        workspaceRepository(),

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
                "Prepare a safe sandbox draft.",
              status: "APPROVED",
              engineMode: "SANDBOX_ONLY",
            },

            approval: {
              id: "approval-1",
              tenantId,
              recommendationId,
              inquiryId: "inquiry-1",
              ownerUserId: "owner-user-1",
              recommendationStatus:
                "APPROVED",
              executionStatus:
                "READY_FOR_SANDBOX",
              executionMode: "SANDBOX_ONLY",
            },
          };
        },
      },

      executionRepository: {
        async claimExecution(input) {
          return {
            outcome: "EXISTING",
            execution: {
              id: "execution-existing-1",
              tenantId: input.tenantId,
              inquiryId: input.inquiryId,
              recommendationId:
                input.recommendationId,
              ownerApprovalId:
                input.ownerApprovalId,
              requestedByOwnerUserId:
                input.requestedByOwnerUserId,
              sourceSessionId:
                input.sourceSessionId,
              idempotencyKey:
                input.idempotencyKey,
              status: "SUCCEEDED",
              executionMode:
                "SANDBOX_ONLY",
              summary:
                "Existing sandbox execution.",
              output:
                "Existing safe sandbox output.",
              startedAt:
                "2026-07-10T15:00:00.000Z",
              completedAt:
                "2026-07-10T15:00:01.000Z",
              createdAt:
                "2026-07-10T15:00:02.000Z",
            },
          };
        },

        async completeExecution(input) {
          completionCalls += 1;

          return {
            id: input.executionId,
            tenantId: input.tenantId,
            inquiryId: input.inquiryId,
            recommendationId:
              input.recommendationId,
            ownerApprovalId:
              input.ownerApprovalId,
            requestedByOwnerUserId:
              input.requestedByOwnerUserId,
            sourceSessionId:
              input.sourceSessionId,
            idempotencyKey:
              input.idempotencyKey,
            status: input.status,
            executionMode:
              input.executionMode,
            summary: input.summary,
            output: input.output,
            startedAt: input.startedAt,
            completedAt:
              input.completedAt,
            createdAt:
              "2026-07-10T15:00:02.000Z",
          };
        },
      },

      sandboxExecutor: {
        mode: "SANDBOX_ONLY",

        async execute() {
          executorCalls += 1;

          return {
            status: "SUCCEEDED",
            summary:
              "Duplicate execution must not occur.",
            output:
              "Duplicate execution blocked.",
            startedAt:
              "2026-07-10T15:00:00.000Z",
            completedAt:
              "2026-07-10T15:00:01.000Z",
          };
        },
      },

      requestedTenantId: "tenant-1",
      recommendationId:
        "recommendation-1",
      idempotencyKey:
        "security-existing-execution-0001",
    });

  assert.equal(result.outcome, "EXISTING");
  assert.equal(executorCalls, 0);
  assert.equal(completionCalls, 0);

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
});

test("cross-tenant result tracking is blocked before persistence", async () => {
  let trackingWrites = 0;

  await expectCode(
    () =>
      recordAuthenticatedSandboxExecutionResult({
        principal: operatorPrincipal,
        accessRepositories:
          accessRepositories("OPERATOR"),
        workspaceRepository:
          workspaceRepository(),

        executionReadRepository: {
          async findExecutionByTenantAndId(
            _tenantId,
            executionId,
          ) {
            return {
              id: executionId,
              tenantId: "tenant-attacker",
              inquiryId:
                "inquiry-attacker",
              recommendationId:
                "recommendation-attacker",
              ownerApprovalId:
                "approval-attacker",
              requestedByOwnerUserId:
                "owner-attacker",
              sourceSessionId:
                "session-attacker",
              status: "SUCCEEDED",
              executionMode:
                "SANDBOX_ONLY",
              summary:
                "Cross-tenant result.",
              output:
                "Cross-tenant output.",
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
          async createOrGetTracking(input) {
            trackingWrites += 1;

            return {
              outcome: "CREATED",
              tracking: {
                id: "should-not-exist",
                ...input,
                createdAt:
                  "2026-07-10T15:01:00.000Z",
              },
            };
          },
        },

        requestedTenantId: "tenant-1",
        executionId: "execution-1",
        idempotencyKey:
          "security-tracking-0001",
      }),
    ExecutionResultTrackingDeniedError,
    "TRACKABLE_EXECUTION_TENANT_MISMATCH",
  );

  assert.equal(trackingWrites, 0);
});

test("corrupted execution audit digest is rejected fail-closed", async () => {
  await expectCode(
    () =>
      recordAuthenticatedExecutionAudit({
        principal: operatorPrincipal,
        accessRepositories:
          accessRepositories("OPERATOR"),
        workspaceRepository:
          workspaceRepository(),

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
              recommendationId:
                "recommendation-1",
              ownerApprovalId: "approval-1",
              trackedByUserId:
                "operator-user-1",
              executionStatus: "SUCCEEDED",
              resultStatus: "AVAILABLE",
              trackingStatus: "RECORDED",
              executionMode:
                "SANDBOX_ONLY",
              recoveryRequired: false,
              createdAt:
                "2026-07-10T15:01:00.000Z",
            };
          },
        },

        auditRepository: {
          async appendOrGetEvent(input) {
            return {
              outcome: "CREATED",
              event: {
                id: "audit-corrupt-1",
                ...input,
                integrityDigest:
                  "0".repeat(64),
                createdAt:
                  "2026-07-10T15:02:00.000Z",
              },
            };
          },
        },

        requestedTenantId: "tenant-1",
        trackingId: "tracking-1",
        idempotencyKey:
          "security-audit-0001",
      }),
    ExecutionAuditDeniedError,
    "EXECUTION_AUDIT_PERSISTED_DIGEST_INVALID",
  );
});

test("maximum recovery attempts block claim and executor", async () => {
  let claimCalls = 0;
  let executorCalls = 0;

  await expectCode(
    () =>
      recoverAuthenticatedSandboxExecution({
        principal: ownerPrincipal,
        accessRepositories:
          accessRepositories("OWNER"),
        workspaceRepository:
          workspaceRepository(),

        recoveryReadRepository: {
          async findRecoverableFailure(
            tenantId,
            trackingId,
          ) {
            return {
              tracking: {
                id: trackingId,
                tenantId,
                executionId:
                  "execution-failed-1",
                inquiryId: "inquiry-1",
                recommendationId:
                  "recommendation-1",
                ownerApprovalId:
                  "approval-1",
                approvalOwnerUserId:
                  "owner-user-1",
                executionStatus: "FAILED",
                resultStatus:
                  "FAILED_REQUIRES_RECOVERY",
                trackingStatus: "RECORDED",
                executionMode:
                  "SANDBOX_ONLY",
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
                executionId:
                  "execution-failed-1",
                eventType:
                  "SANDBOX_EXECUTION_FAILED",
                outcome: "FAILURE",
                recoveryRequired: true,
                executionMode:
                  "SANDBOX_ONLY",
                integrityAlgorithm:
                  "SHA-256",
                integrityDigest:
                  validDigest,
                immutable: true,
              },

              completedRecoveryAttempts: 3,
            };
          },
        },

        recoveryRepository: {
          async claimRecovery(input) {
            claimCalls += 1;

            return {
              outcome: "CLAIMED",
              claim: {
                id: "should-not-exist",
                ...input,
                claimedAt:
                  "2026-07-10T16:00:00.000Z",
              },
            };
          },

          async completeRecovery(input) {
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
              ownerUserId:
                input.ownerUserId,
              sourceSessionId:
                input.sourceSessionId,
              failureAuditEventId:
                input.failureAuditEventId,
              idempotencyKey:
                input.idempotencyKey,
              attemptNumber:
                input.attemptNumber,
              maximumAttempts: 3,
              status: input.status,
              executionMode:
                "SANDBOX_ONLY",
              automaticRetry: false,
              summary: input.summary,
              output: input.output,
              startedAt: input.startedAt,
              completedAt:
                input.completedAt,
              createdAt:
                "2026-07-10T16:00:02.000Z",
            };
          },
        },

        recoveryExecutor: {
          mode: "SANDBOX_ONLY",

          async recover() {
            executorCalls += 1;

            return {
              status: "FAILED",
              summary:
                "Should not execute.",
              output:
                "Maximum attempts were reached.",
              startedAt:
                "2026-07-10T16:00:00.000Z",
              completedAt:
                "2026-07-10T16:00:01.000Z",
            };
          },
        },

        requestedTenantId: "tenant-1",
        trackingId: "tracking-failed-1",
        idempotencyKey:
          "security-recovery-limit-0001",
      }),
    SandboxRecoveryDeniedError,
    "RECOVERY_MAXIMUM_ATTEMPTS_REACHED",
  );

  assert.equal(claimCalls, 0);
  assert.equal(executorCalls, 0);
});

test("live recovery executor is rejected before failure read", async () => {
  let recoveryReads = 0;
  let executorCalls = 0;

  const unsafeRecoveryExecutor = {
    mode: "LIVE_PROVIDER",

    async recover() {
      executorCalls += 1;

      return {
        status: "RECOVERED" as const,
        summary:
          "Unsafe live recovery.",
        output:
          "Live recovery must not occur.",
        startedAt:
          "2026-07-10T16:00:00.000Z",
        completedAt:
          "2026-07-10T16:00:01.000Z",
      };
    },
  };

  await expectCode(
    () =>
      recoverAuthenticatedSandboxExecution({
        principal: ownerPrincipal,
        accessRepositories:
          accessRepositories("OWNER"),
        workspaceRepository:
          workspaceRepository(),

        recoveryReadRepository: {
          async findRecoverableFailure() {
            recoveryReads += 1;
            return null;
          },
        },

        recoveryRepository: {
          async claimRecovery() {
            throw new Error(
              "Recovery claim must not run.",
            );
          },

          async completeRecovery() {
            throw new Error(
              "Recovery completion must not run.",
            );
          },
        },

        recoveryExecutor:
          unsafeRecoveryExecutor as unknown as Parameters<
            typeof recoverAuthenticatedSandboxExecution
          >[0]["recoveryExecutor"],

        requestedTenantId: "tenant-1",
        trackingId: "tracking-failed-1",
        idempotencyKey:
          "security-live-recovery-0001",
      }),
    SandboxRecoveryDeniedError,
    "LIVE_RECOVERY_EXECUTOR_NOT_AUTHORIZED",
  );

  assert.equal(recoveryReads, 0);
  assert.equal(executorCalls, 0);
});

test("cross-tenant recovery audit is blocked before append", async () => {
  let auditWrites = 0;

  await expectCode(
    () =>
      recordAuthenticatedSandboxRecoveryAudit({
        principal: ownerPrincipal,
        accessRepositories:
          accessRepositories("OWNER"),
        workspaceRepository:
          workspaceRepository(),

        recoveryReadRepository: {
          async findRecoveryByTenantAndId(
            _tenantId,
            recoveryId,
          ) {
            return {
              id: recoveryId,
              tenantId: "tenant-attacker",
              trackingId:
                "tracking-attacker",
              failedExecutionId:
                "execution-attacker",
              inquiryId:
                "inquiry-attacker",
              recommendationId:
                "recommendation-attacker",
              ownerApprovalId:
                "approval-attacker",
              ownerUserId:
                "owner-user-1",
              sourceSessionId:
                "attacker-session",
              failureAuditEventId:
                "audit-attacker",
              attemptNumber: 1,
              maximumAttempts: 3,
              status: "RECOVERED",
              executionMode:
                "SANDBOX_ONLY",
              automaticRetry: false,
              summary:
                "Cross-tenant recovery.",
              output:
                "Cross-tenant recovery output.",
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
          async appendOrGetRecoveryEvent(input) {
            auditWrites += 1;

            return {
              outcome: "CREATED",
              event: {
                id: "should-not-exist",
                ...input,
                createdAt:
                  "2026-07-10T16:01:00.000Z",
              },
            };
          },
        },

        requestedTenantId: "tenant-1",
        recoveryId: "recovery-1",
        idempotencyKey:
          "security-recovery-audit-0001",
      }),
    SandboxRecoveryAuditDeniedError,
    "AUDITABLE_RECOVERY_TENANT_MISMATCH",
  );

  assert.equal(auditWrites, 0);
});

test("security-approved existing execution remains sandbox-only and launch-locked", async () => {
  const result =
    await executeApprovedSandboxRecommendation({
      principal: ownerPrincipal,
      accessRepositories:
        accessRepositories("OWNER"),
      workspaceRepository:
        workspaceRepository(),

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
                "Prepare a sandbox-only response.",
              status: "APPROVED",
              engineMode: "SANDBOX_ONLY",
            },

            approval: {
              id: "approval-1",
              tenantId,
              recommendationId,
              inquiryId: "inquiry-1",
              ownerUserId: "owner-user-1",
              recommendationStatus:
                "APPROVED",
              executionStatus:
                "READY_FOR_SANDBOX",
              executionMode: "SANDBOX_ONLY",
            },
          };
        },
      },

      executionRepository: {
        async claimExecution(input) {
          return {
            outcome: "EXISTING",
            execution: {
              id: "execution-existing-2",
              tenantId: input.tenantId,
              inquiryId: input.inquiryId,
              recommendationId:
                input.recommendationId,
              ownerApprovalId:
                input.ownerApprovalId,
              requestedByOwnerUserId:
                input.requestedByOwnerUserId,
              sourceSessionId:
                input.sourceSessionId,
              idempotencyKey:
                input.idempotencyKey,
              status: "SUCCEEDED",
              executionMode:
                "SANDBOX_ONLY",
              summary:
                "Sandbox-only execution completed.",
              output:
                "No external provider was contacted.",
              startedAt:
                "2026-07-10T15:00:00.000Z",
              completedAt:
                "2026-07-10T15:00:01.000Z",
              createdAt:
                "2026-07-10T15:00:02.000Z",
            },
          };
        },

        async completeExecution() {
          throw new Error(
            "Existing execution must not complete again.",
          );
        },
      },

      sandboxExecutor: {
        mode: "SANDBOX_ONLY",

        async execute() {
          throw new Error(
            "Existing execution must not run again.",
          );
        },
      },

      requestedTenantId: "tenant-1",
      recommendationId:
        "recommendation-1",
      idempotencyKey:
        "security-boundary-proof-0001",
    });

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
    result.safetyBoundary
      .duplicateExecutionPrevented,
    true,
  );
});
