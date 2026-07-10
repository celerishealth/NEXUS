import assert from "node:assert/strict";
import test from "node:test";

import {
  TenantAccessDeniedError,
} from "../../lib/nexus/auth/tenantAccessContext";

import {
  decideAuthenticatedRecommendation,
  OwnerRecommendationDecisionDeniedError,
  type DecideAuthenticatedRecommendationInput,
  type OwnerDecisionPersistenceInput,
} from "../../lib/nexus/approval/authenticatedOwnerRecommendationDecision";

function validInput(
  overrides:
    Partial<DecideAuthenticatedRecommendationInput> = {},
): DecideAuthenticatedRecommendationInput {
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

    recommendationReadRepository: {
      async findRecommendationByTenantAndId(
        tenantId,
        recommendationId,
      ) {
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
      async applyOwnerDecision(
        input: OwnerDecisionPersistenceInput,
      ) {
        return {
          outcome: "CREATED",
          approval: {
            id: "approval-1",
            ...input,
            decidedAt: "2026-07-10T14:00:00.000Z",
            createdAt: "2026-07-10T14:00:01.000Z",
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    recommendationId: "recommendation-1",
    idempotencyKey: "owner-decision-0001",
    decision: "APPROVED",
    decisionNote:
      "Approved for controlled sandbox execution.",
    ...overrides,
  };
}

async function expectDenied(
  input: DecideAuthenticatedRecommendationInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () => decideAuthenticatedRecommendation(input),
    (error: unknown) => {
      assert.ok(
        error instanceof
          OwnerRecommendationDecisionDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("authenticated tenant owner approves a recommendation without executing it", async () => {
  let persistenceInput:
    | OwnerDecisionPersistenceInput
    | undefined;

  const input = validInput({
    decisionRepository: {
      async applyOwnerDecision(receivedInput) {
        persistenceInput = receivedInput;

        return {
          outcome: "CREATED",
          approval: {
            id: "approval-1",
            ...receivedInput,
            decidedAt: "2026-07-10T14:00:00.000Z",
            createdAt: "2026-07-10T14:00:01.000Z",
          },
        };
      },
    },
  });

  const result =
    await decideAuthenticatedRecommendation(input);

  assert.deepEqual(persistenceInput, {
    tenantId: "tenant-1",
    recommendationId: "recommendation-1",
    inquiryId: "inquiry-1",
    ownerUserId: "owner-user-1",
    sourceSessionId: "owner-session-1",
    idempotencyKey: "owner-decision-0001",
    decision: "APPROVED",
    decisionNote:
      "Approved for controlled sandbox execution.",
    recommendationStatus: "APPROVED",
    executionStatus: "READY_FOR_SANDBOX",
    executionMode: "SANDBOX_ONLY",
  });

  assert.equal(result.outcome, "CREATED");

  assert.equal(
    result.ownerAuthority.explicitlyAuthorized,
    true,
  );

  assert.equal(
    result.executionBoundary
      .eligibleForSandboxExecution,
    true,
  );

  assert.equal(
    result.executionBoundary.executionStarted,
    false,
  );

  assert.equal(
    result.executionBoundary
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.executionBoundary),
    true,
  );
});

test("owner rejection blocks recommendation execution", async () => {
  const result =
    await decideAuthenticatedRecommendation(
      validInput({
        decision: "REJECTED",
        decisionNote:
          "Rejected because the proposed action is not appropriate.",

        decisionRepository: {
          async applyOwnerDecision(receivedInput) {
            return {
              outcome: "CREATED",
              approval: {
                id: "approval-rejected-1",
                ...receivedInput,
                decidedAt:
                  "2026-07-10T14:00:00.000Z",
                createdAt:
                  "2026-07-10T14:00:01.000Z",
              },
            };
          },
        },
      }),
    );

  assert.equal(
    result.approval.recommendationStatus,
    "REJECTED",
  );

  assert.equal(
    result.executionBoundary.executionStatus,
    "BLOCKED_BY_OWNER",
  );

  assert.equal(
    result.executionBoundary
      .eligibleForSandboxExecution,
    false,
  );
});

test("non-owner membership cannot decide recommendations", async () => {
  let recommendationReads = 0;
  let persistenceCalls = 0;

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
      async applyOwnerDecision(receivedInput) {
        persistenceCalls += 1;

        return {
          outcome: "CREATED",
          approval: {
            id: "should-not-exist",
            ...receivedInput,
            decidedAt: "2026-07-10T14:00:00.000Z",
            createdAt: "2026-07-10T14:00:01.000Z",
          },
        };
      },
    },
  });

  await assert.rejects(
    () => decideAuthenticatedRecommendation(input),
    (error: unknown) => {
      assert.ok(error instanceof TenantAccessDeniedError);
      assert.equal(
        error.code,
        "OWNER_AUTHORITY_REQUIRED",
      );

      return true;
    },
  );

  assert.equal(recommendationReads, 0);
  assert.equal(persistenceCalls, 0);
});

test("cross-tenant recommendation mismatch is blocked before persistence", async () => {
  let persistenceCalls = 0;

  const input = validInput({
    recommendationReadRepository: {
      async findRecommendationByTenantAndId(
        _tenantId,
        recommendationId,
      ) {
        return {
          id: recommendationId,
          tenantId: "tenant-attacker",
          inquiryId: "inquiry-attacker",
          status: "DRAFT",
          engineMode: "SANDBOX_ONLY",
        };
      },
    },

    decisionRepository: {
      async applyOwnerDecision(receivedInput) {
        persistenceCalls += 1;

        return {
          outcome: "CREATED",
          approval: {
            id: "should-not-exist",
            ...receivedInput,
            decidedAt: "2026-07-10T14:00:00.000Z",
            createdAt: "2026-07-10T14:00:01.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "OWNER_DECISION_RECOMMENDATION_TENANT_MISMATCH",
  );

  assert.equal(persistenceCalls, 0);
});

test("non-draft recommendation cannot receive another decision", async () => {
  let persistenceCalls = 0;

  const input = validInput({
    recommendationReadRepository: {
      async findRecommendationByTenantAndId(
        tenantId,
        recommendationId,
      ) {
        return {
          id: recommendationId,
          tenantId,
          inquiryId: "inquiry-1",
          status: "APPROVED",
          engineMode: "SANDBOX_ONLY",
        } as unknown as {
          id: string;
          tenantId: string;
          inquiryId: string;
          status: "DRAFT";
          engineMode: "SANDBOX_ONLY";
        };
      },
    },

    decisionRepository: {
      async applyOwnerDecision(receivedInput) {
        persistenceCalls += 1;

        return {
          outcome: "CREATED",
          approval: {
            id: "should-not-exist",
            ...receivedInput,
            decidedAt: "2026-07-10T14:00:00.000Z",
            createdAt: "2026-07-10T14:00:01.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "OWNER_DECISION_RECOMMENDATION_STATUS_INVALID",
  );

  assert.equal(persistenceCalls, 0);
});

test("live-provider recommendation cannot be approved", async () => {
  let persistenceCalls = 0;

  const input = validInput({
    recommendationReadRepository: {
      async findRecommendationByTenantAndId(
        tenantId,
        recommendationId,
      ) {
        return {
          id: recommendationId,
          tenantId,
          inquiryId: "inquiry-1",
          status: "DRAFT",
          engineMode: "LIVE_PROVIDER",
        } as unknown as {
          id: string;
          tenantId: string;
          inquiryId: string;
          status: "DRAFT";
          engineMode: "SANDBOX_ONLY";
        };
      },
    },

    decisionRepository: {
      async applyOwnerDecision(receivedInput) {
        persistenceCalls += 1;

        return {
          outcome: "CREATED",
          approval: {
            id: "should-not-exist",
            ...receivedInput,
            decidedAt: "2026-07-10T14:00:00.000Z",
            createdAt: "2026-07-10T14:00:01.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "OWNER_DECISION_RECOMMENDATION_ENGINE_MODE_INVALID",
  );

  assert.equal(persistenceCalls, 0);
});

test("invalid owner decision note is rejected before persistence", async () => {
  let persistenceCalls = 0;

  const input = validInput({
    decisionNote: "no",

    decisionRepository: {
      async applyOwnerDecision(receivedInput) {
        persistenceCalls += 1;

        return {
          outcome: "CREATED",
          approval: {
            id: "should-not-exist",
            ...receivedInput,
            decidedAt: "2026-07-10T14:00:00.000Z",
            createdAt: "2026-07-10T14:00:01.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "OWNER_DECISION_NOTE_REQUIRED",
  );

  assert.equal(persistenceCalls, 0);
});

test("fails closed when persistence returns another tenant", async () => {
  const input = validInput({
    decisionRepository: {
      async applyOwnerDecision(receivedInput) {
        return {
          outcome: "CREATED",
          approval: {
            id: "approval-attacker",
            ...receivedInput,
            tenantId: "tenant-attacker",
            decidedAt: "2026-07-10T14:00:00.000Z",
            createdAt: "2026-07-10T14:00:01.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "OWNER_DECISION_PERSISTED_TENANT_MISMATCH",
  );
});

test("approved decision remains sandbox-only with no execution started", async () => {
  const result =
    await decideAuthenticatedRecommendation(
      validInput(),
    );

  assert.equal(
    result.executionBoundary.executionMode,
    "SANDBOX_ONLY",
  );

  assert.equal(
    result.executionBoundary.executionStarted,
    false,
  );

  assert.equal(
    result.executionBoundary
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    result.executionBoundary
      .publicLaunchAuthorized,
    false,
  );
});
