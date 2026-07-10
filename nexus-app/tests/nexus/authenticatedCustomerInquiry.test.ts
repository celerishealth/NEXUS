import assert from "node:assert/strict";
import test from "node:test";

import {
  createAuthenticatedCustomerInquiry,
  CustomerInquiryDeniedError,
  type CreateAuthenticatedCustomerInquiryInput,
  type CustomerInquiryPersistenceInput,
} from "../../lib/nexus/inquiry/authenticatedCustomerInquiry";

function validInput(
  overrides: Partial<CreateAuthenticatedCustomerInquiryInput> = {},
): CreateAuthenticatedCustomerInquiryInput {
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
      async createOrGetInquiry(
        input: CustomerInquiryPersistenceInput,
      ) {
        return {
          outcome: "CREATED",
          inquiry: {
            id: "inquiry-1",
            tenantId: input.tenantId,
            createdByUserId: input.createdByUserId,
            sourceSessionId: input.sourceSessionId,
            idempotencyKey: input.idempotencyKey,
            channel: input.channel,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            message: input.message,
            status: input.status,
            createdAt: "2026-07-10T12:00:00.000Z",
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    idempotencyKey: "web-event-0001",
    channel: "WEB",
    customerName: "  Asha Sharma  ",
    customerEmail: "  ASHA@EXAMPLE.COM ",
    customerPhone: null,
    message: "  I need help choosing the right service.  ",
    ...overrides,
  };
}

async function expectDenied(
  input: CreateAuthenticatedCustomerInquiryInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () => createAuthenticatedCustomerInquiry(input),
    (error: unknown) => {
      assert.ok(
        error instanceof CustomerInquiryDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("creates an immutable tenant-scoped customer inquiry", async () => {
  let received:
    | CustomerInquiryPersistenceInput
    | undefined;

  const input = validInput({
    inquiryRepository: {
      async createOrGetInquiry(persistenceInput) {
        received = persistenceInput;

        return {
          outcome: "CREATED",
          inquiry: {
            id: "inquiry-1",
            tenantId: persistenceInput.tenantId,
            createdByUserId:
              persistenceInput.createdByUserId,
            sourceSessionId:
              persistenceInput.sourceSessionId,
            idempotencyKey:
              persistenceInput.idempotencyKey,
            channel: persistenceInput.channel,
            customerName:
              persistenceInput.customerName,
            customerEmail:
              persistenceInput.customerEmail,
            customerPhone:
              persistenceInput.customerPhone,
            message: persistenceInput.message,
            status: persistenceInput.status,
            createdAt: "2026-07-10T12:00:00.000Z",
          },
        };
      },
    },
  });

  const result =
    await createAuthenticatedCustomerInquiry(input);

  assert.deepEqual(received, {
    tenantId: "tenant-1",
    createdByUserId: "operator-user-1",
    sourceSessionId: "session-1",
    idempotencyKey: "web-event-0001",
    channel: "WEB",
    customerName: "Asha Sharma",
    customerEmail: "asha@example.com",
    customerPhone: null,
    message: "I need help choosing the right service.",
    status: "NEW",
    executionMode: "SANDBOX_ONLY",
  });

  assert.equal(result.outcome, "CREATED");
  assert.equal(result.inquiry.tenantId, "tenant-1");
  assert.equal(
    result.intakeAuthority.role,
    "OPERATOR",
  );

  assert.equal(
    result.safetyBoundary
      .ownerApprovalRequiredBeforeExecution,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.inquiry),
    true,
  );
});

test("returns an existing inquiry for the same idempotency key", async () => {
  const input = validInput({
    inquiryRepository: {
      async createOrGetInquiry(persistenceInput) {
        return {
          outcome: "EXISTING",
          inquiry: {
            id: "inquiry-existing-1",
            tenantId: persistenceInput.tenantId,
            createdByUserId:
              persistenceInput.createdByUserId,
            sourceSessionId:
              persistenceInput.sourceSessionId,
            idempotencyKey:
              persistenceInput.idempotencyKey,
            channel: persistenceInput.channel,
            customerName:
              persistenceInput.customerName,
            customerEmail:
              persistenceInput.customerEmail,
            customerPhone:
              persistenceInput.customerPhone,
            message: persistenceInput.message,
            status: "NEW",
            createdAt: "2026-07-10T12:00:00.000Z",
          },
        };
      },
    },
  });

  const result =
    await createAuthenticatedCustomerInquiry(input);

  assert.equal(result.outcome, "EXISTING");
  assert.equal(
    result.inquiry.id,
    "inquiry-existing-1",
  );
});

test("blocks cross-tenant inquiry intake before repository write", async () => {
  let repositoryWrites = 0;

  const input = validInput({
    requestedTenantId: "tenant-attacker",

    inquiryRepository: {
      async createOrGetInquiry(persistenceInput) {
        repositoryWrites += 1;

        return {
          outcome: "CREATED",
          inquiry: {
            id: "should-not-exist",
            tenantId: persistenceInput.tenantId,
            createdByUserId:
              persistenceInput.createdByUserId,
            sourceSessionId:
              persistenceInput.sourceSessionId,
            idempotencyKey:
              persistenceInput.idempotencyKey,
            channel: persistenceInput.channel,
            customerName:
              persistenceInput.customerName,
            customerEmail:
              persistenceInput.customerEmail,
            customerPhone:
              persistenceInput.customerPhone,
            message: persistenceInput.message,
            status: "NEW",
            createdAt: "2026-07-10T12:00:00.000Z",
          },
        };
      },
    },
  });

  await assert.rejects(
    () => createAuthenticatedCustomerInquiry(input),
  );

  assert.equal(repositoryWrites, 0);
});

test("blocks VIEWER membership from creating inquiries", async () => {
  let repositoryWrites = 0;

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

    inquiryRepository: {
      async createOrGetInquiry(persistenceInput) {
        repositoryWrites += 1;

        return {
          outcome: "CREATED",
          inquiry: {
            id: "should-not-exist",
            tenantId: persistenceInput.tenantId,
            createdByUserId:
              persistenceInput.createdByUserId,
            sourceSessionId:
              persistenceInput.sourceSessionId,
            idempotencyKey:
              persistenceInput.idempotencyKey,
            channel: persistenceInput.channel,
            customerName:
              persistenceInput.customerName,
            customerEmail:
              persistenceInput.customerEmail,
            customerPhone:
              persistenceInput.customerPhone,
            message: persistenceInput.message,
            status: "NEW",
            createdAt: "2026-07-10T12:00:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "INQUIRY_ROLE_NOT_AUTHORIZED",
  );

  assert.equal(repositoryWrites, 0);
});

test("requires at least one customer contact method", async () => {
  await expectDenied(
    validInput({
      customerEmail: null,
      customerPhone: null,
    }),
    "INQUIRY_CUSTOMER_CONTACT_REQUIRED",
  );
});

test("rejects invalid inquiry email", async () => {
  await expectDenied(
    validInput({
      customerEmail: "invalid-email",
    }),
    "INQUIRY_CUSTOMER_EMAIL_INVALID",
  );
});

test("rejects invalid idempotency keys", async () => {
  await expectDenied(
    validInput({
      idempotencyKey: "bad key",
    }),
    "INQUIRY_IDEMPOTENCY_KEY_INVALID",
  );
});

test("fails closed when persistence returns another tenant", async () => {
  const input = validInput({
    inquiryRepository: {
      async createOrGetInquiry(persistenceInput) {
        return {
          outcome: "CREATED",
          inquiry: {
            id: "inquiry-attacker",
            tenantId: "tenant-attacker",
            createdByUserId:
              persistenceInput.createdByUserId,
            sourceSessionId:
              persistenceInput.sourceSessionId,
            idempotencyKey:
              persistenceInput.idempotencyKey,
            channel: persistenceInput.channel,
            customerName:
              persistenceInput.customerName,
            customerEmail:
              persistenceInput.customerEmail,
            customerPhone:
              persistenceInput.customerPhone,
            message: persistenceInput.message,
            status: "NEW",
            createdAt: "2026-07-10T12:00:00.000Z",
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "INQUIRY_PERSISTED_TENANT_MISMATCH",
  );
});

test("keeps recommendation and execution disabled after intake", async () => {
  const result =
    await createAuthenticatedCustomerInquiry(
      validInput(),
    );

  assert.equal(
    result.safetyBoundary.recommendationStatus,
    "NOT_GENERATED",
  );

  assert.equal(
    result.safetyBoundary.executionMode,
    "SANDBOX_ONLY",
  );

  assert.equal(
    result.safetyBoundary
      .publicLaunchAuthorized,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .liveProviderExecutionAuthorized,
    false,
  );
});
