import assert from "node:assert/strict";
import test from "node:test";

import {
  generateAuthenticatedInquiryRecommendation,
  InquiryRecommendationDeniedError,
  type GenerateAuthenticatedInquiryRecommendationInput,
  type RecommendationPersistenceInput,
  type SandboxRecommendationEngineInput,
} from "../../lib/nexus/recommendation/authenticatedInquiryRecommendation";

function validInput(
  overrides:
    Partial<GenerateAuthenticatedInquiryRecommendationInput> = {},
): GenerateAuthenticatedInquiryRecommendationInput {
  return {
    principal: {
      userId: "operator-user-1",
      tenantId: "tenant-1",
      sessionId: "session-1",
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

    inquiryRepository: {
      async findInquiryByTenantAndId(
        tenantId,
        inquiryId,
      ) {
        return {
          id: inquiryId,
          tenantId,
          customerName: "Asha Sharma",
          message: "I need help choosing the right service.",
          status: "NEW",
        };
      },
    },

    recommendationEngine: {
      mode: "SANDBOX_ONLY",

      async generateRecommendation() {
        return {
          title: "Recommend the guided service package",
          summary:
            "The customer needs help comparing available service options before making a decision.",
          recommendedAction:
            "Prepare a concise comparison and offer a guided consultation.",
          rationale:
            "The inquiry expresses purchase intent but requires clearer option selection support.",
          confidence: 88,
          riskLevel: "LOW",
          generatedAt: "2026-07-10T13:00:00.000Z",
        };
      },
    },

    recommendationRepository: {
      async createOrGetRecommendation(
        input: RecommendationPersistenceInput,
      ) {
        return {
          outcome: "CREATED",
          recommendation: {
            id: "recommendation-1",
            ...input,
            createdAt: "2026-07-10T13:00:01.000Z",
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    inquiryId: "inquiry-1",
    idempotencyKey: "recommendation-inquiry-0001",
    ...overrides,
  };
}

async function expectDenied(
  input: GenerateAuthenticatedInquiryRecommendationInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      generateAuthenticatedInquiryRecommendation(
        input,
      ),
    (error: unknown) => {
      assert.ok(
        error instanceof InquiryRecommendationDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("generates and persists an immutable sandbox recommendation", async () => {
  let engineInput:
    | SandboxRecommendationEngineInput
    | undefined;

  let persistenceInput:
    | RecommendationPersistenceInput
    | undefined;

  const input = validInput({
    recommendationEngine: {
      mode: "SANDBOX_ONLY",

      async generateRecommendation(receivedInput) {
        engineInput = receivedInput;

        return {
          title: "Recommend the guided service package",
          summary:
            "The customer needs help comparing available service options before making a decision.",
          recommendedAction:
            "Prepare a concise comparison and offer a guided consultation.",
          rationale:
            "The inquiry expresses purchase intent but requires clearer option selection support.",
          confidence: 88,
          riskLevel: "LOW",
          generatedAt: "2026-07-10T13:00:00.000Z",
        };
      },
    },

    recommendationRepository: {
      async createOrGetRecommendation(receivedInput) {
        persistenceInput = receivedInput;

        return {
          outcome: "CREATED",
          recommendation: {
            id: "recommendation-1",
            ...receivedInput,
            createdAt: "2026-07-10T13:00:01.000Z",
          },
        };
      },
    },
  });

  const result =
    await generateAuthenticatedInquiryRecommendation(
      input,
    );

  assert.deepEqual(engineInput, {
    tenantId: "tenant-1",
    inquiryId: "inquiry-1",
    businessName: "NEXUS Test Business",
    customerName: "Asha Sharma",
    customerMessage:
      "I need help choosing the right service.",
    timezone: "Europe/Amsterdam",
    locale: "en-NL",
    executionMode: "SANDBOX_ONLY",
  });

  assert.equal(
    persistenceInput?.tenantId,
    "tenant-1",
  );

  assert.equal(
    persistenceInput?.generatedByUserId,
    "operator-user-1",
  );

  assert.equal(
    persistenceInput?.status,
    "DRAFT",
  );

  assert.equal(
    persistenceInput?.engineMode,
    "SANDBOX_ONLY",
  );

  assert.equal(result.outcome, "CREATED");
  assert.equal(
    result.recommendation.id,
    "recommendation-1",
  );

  assert.equal(
    result.approvalBoundary.ownerApprovalStatus,
    "REQUIRED",
  );

  assert.equal(
    result.approvalBoundary.executionStatus,
    "NOT_STARTED",
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.recommendation),
    true,
  );
});

test("returns an existing recommendation idempotently", async () => {
  const input = validInput({
    recommendationRepository: {
      async createOrGetRecommendation(receivedInput) {
        return {
          outcome: "EXISTING",
          recommendation: {
            id: "recommendation-existing-1",
            ...receivedInput,
            createdAt: "2026-07-10T13:00:01.000Z",
          },
        };
      },
    },
  });

  const result =
    await generateAuthenticatedInquiryRecommendation(
      input,
    );

  assert.equal(result.outcome, "EXISTING");
  assert.equal(
    result.recommendation.id,
    "recommendation-existing-1",
  );
});

test("blocks cross-tenant inquiry reads before AI generation", async () => {
  let engineCalls = 0;
  let persistenceCalls = 0;

  const input = validInput({
    inquiryRepository: {
      async findInquiryByTenantAndId(
        _tenantId,
        inquiryId,
      ) {
        return {
          id: inquiryId,
          tenantId: "tenant-attacker",
          customerName: "Wrong Tenant Customer",
          message: "Cross-tenant message",
          status: "NEW",
        };
      },
    },

    recommendationEngine: {
      mode: "SANDBOX_ONLY",

      async generateRecommendation() {
        engineCalls += 1;

        return {
          title: "Should not generate",
          summary:
            "This recommendation must never be generated.",
          recommendedAction:
            "No action should be created.",
          rationale:
            "The tenant identity does not match.",
          confidence: 1,
          riskLevel: "HIGH",
          generatedAt: "2026-07-10T13:00:00.000Z",
        };
      },
    },

    recommendationRepository: {
      async createOrGetRecommendation(receivedInput) {
        persistenceCalls += 1;

        return {
          outcome: "CREATED",
          recommendation: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt: "2026-07-10T13:00:01.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "RECOMMENDATION_INQUIRY_TENANT_MISMATCH",
  );

  assert.equal(engineCalls, 0);
  assert.equal(persistenceCalls, 0);
});

test("blocks VIEWER recommendation generation", async () => {
  let engineCalls = 0;

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

    recommendationEngine: {
      mode: "SANDBOX_ONLY",

      async generateRecommendation() {
        engineCalls += 1;

        return {
          title: "Should not generate",
          summary:
            "Viewer access must not generate recommendations.",
          recommendedAction:
            "No recommendation action.",
          rationale:
            "Viewer membership is read-only.",
          confidence: 1,
          riskLevel: "HIGH",
          generatedAt: "2026-07-10T13:00:00.000Z",
        };
      },
    },
  });

  await expectDenied(
    input,
    "RECOMMENDATION_ROLE_NOT_AUTHORIZED",
  );

  assert.equal(engineCalls, 0);
});

test("blocks non-sandbox recommendation engines", async () => {
  let engineCalls = 0;

  const unsafeEngine = {
    mode: "LIVE_PROVIDER",

    async generateRecommendation() {
      engineCalls += 1;

      return {
        title: "Unsafe live recommendation",
        summary:
          "This live provider must not be called.",
        recommendedAction:
          "No live action is authorized.",
        rationale:
          "Live execution remains disabled.",
        confidence: 90,
        riskLevel: "HIGH" as const,
        generatedAt: "2026-07-10T13:00:00.000Z",
      };
    },
  };

  const input = validInput({
    recommendationEngine:
      unsafeEngine as unknown as
        GenerateAuthenticatedInquiryRecommendationInput[
          "recommendationEngine"
        ],
  });

  await expectDenied(
    input,
    "LIVE_RECOMMENDATION_ENGINE_NOT_AUTHORIZED",
  );

  assert.equal(engineCalls, 0);
});

test("rejects invalid AI confidence before persistence", async () => {
  let persistenceCalls = 0;

  const input = validInput({
    recommendationEngine: {
      mode: "SANDBOX_ONLY",

      async generateRecommendation() {
        return {
          title: "Recommendation title",
          summary:
            "A sufficiently detailed recommendation summary.",
          recommendedAction:
            "Prepare a safe customer response draft.",
          rationale:
            "The customer inquiry requires clarification.",
          confidence: 150,
          riskLevel: "LOW",
          generatedAt: "2026-07-10T13:00:00.000Z",
        };
      },
    },

    recommendationRepository: {
      async createOrGetRecommendation(receivedInput) {
        persistenceCalls += 1;

        return {
          outcome: "CREATED",
          recommendation: {
            id: "should-not-exist",
            ...receivedInput,
            createdAt: "2026-07-10T13:00:01.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "RECOMMENDATION_CONFIDENCE_INVALID",
  );

  assert.equal(persistenceCalls, 0);
});

test("fails closed when persistence returns another tenant", async () => {
  const input = validInput({
    recommendationRepository: {
      async createOrGetRecommendation(receivedInput) {
        return {
          outcome: "CREATED",
          recommendation: {
            id: "recommendation-attacker",
            ...receivedInput,
            tenantId: "tenant-attacker",
            createdAt: "2026-07-10T13:00:01.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "RECOMMENDATION_PERSISTED_TENANT_MISMATCH",
  );
});

test("keeps owner approval and execution boundaries locked", async () => {
  const result =
    await generateAuthenticatedInquiryRecommendation(
      validInput(),
    );

  assert.equal(
    result.recommendation.status,
    "DRAFT",
  );

  assert.equal(
    result.approvalBoundary.ownerApprovalStatus,
    "REQUIRED",
  );

  assert.equal(
    result.approvalBoundary.executionMode,
    "SANDBOX_ONLY",
  );

  assert.equal(
    result.approvalBoundary
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    result.approvalBoundary
      .publicLaunchAuthorized,
    false,
  );
});
