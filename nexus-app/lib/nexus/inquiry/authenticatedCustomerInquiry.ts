import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

export const CUSTOMER_INQUIRY_CHANNELS = [
  "WEB",
  "EMAIL",
  "WHATSAPP",
  "MANUAL",
  "API",
] as const;

export type CustomerInquiryChannel =
  (typeof CUSTOMER_INQUIRY_CHANNELS)[number];

export type CustomerInquiryStatus = "NEW";

export type CustomerInquiryPersistenceInput = Readonly<{
  tenantId: string;
  createdByUserId: string;
  sourceSessionId: string;
  idempotencyKey: string;
  channel: CustomerInquiryChannel;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  message: string;
  status: CustomerInquiryStatus;
  executionMode: "SANDBOX_ONLY";
}>;

export type PersistedCustomerInquiry = Readonly<{
  id: string;
  tenantId: string;
  createdByUserId: string;
  sourceSessionId: string;
  idempotencyKey: string;
  channel: CustomerInquiryChannel;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  message: string;
  status: CustomerInquiryStatus;
  createdAt: string;
}>;

export type CustomerInquiryPersistenceResult = Readonly<{
  outcome: "CREATED" | "EXISTING";
  inquiry: PersistedCustomerInquiry;
}>;

export type TenantCustomerInquiryRepository = Readonly<{
  createOrGetInquiry: (
    input: CustomerInquiryPersistenceInput,
  ) => Promise<CustomerInquiryPersistenceResult>;
}>;

export type CreateAuthenticatedCustomerInquiryInput = Readonly<{
  principal: AuthenticatedPrincipal | null | undefined;
  accessRepositories: TenantAccessRepositories;
  workspaceRepository: TenantWorkspaceRepository;
  inquiryRepository: TenantCustomerInquiryRepository;
  requestedTenantId?: string | null;
  idempotencyKey: string;
  channel: CustomerInquiryChannel;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  message: string;
}>;

export type AuthenticatedCustomerInquiryResult = Readonly<{
  outcome: "CREATED" | "EXISTING";

  inquiry: Readonly<{
    id: string;
    tenantId: string;
    customerName: string;
    customerEmail: string | null;
    customerPhone: string | null;
    channel: CustomerInquiryChannel;
    message: string;
    status: CustomerInquiryStatus;
    createdAt: string;
  }>;

  intakeAuthority: Readonly<{
    createdByUserId: string;
    sourceSessionId: string;
    role: "OWNER" | "ADMIN" | "OPERATOR";
  }>;

  safetyBoundary: Readonly<{
    recommendationStatus: "NOT_GENERATED";
    ownerApprovalRequiredBeforeExecution: true;
    executionMode: "SANDBOX_ONLY";
    liveProviderExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
}>;

export type CustomerInquiryFailureCode =
  | "INQUIRY_REPOSITORY_MISCONFIGURED"
  | "INQUIRY_ROLE_NOT_AUTHORIZED"
  | "INQUIRY_IDEMPOTENCY_KEY_REQUIRED"
  | "INQUIRY_IDEMPOTENCY_KEY_INVALID"
  | "INQUIRY_CHANNEL_INVALID"
  | "INQUIRY_CUSTOMER_NAME_REQUIRED"
  | "INQUIRY_CUSTOMER_NAME_TOO_LONG"
  | "INQUIRY_CUSTOMER_EMAIL_INVALID"
  | "INQUIRY_CUSTOMER_PHONE_INVALID"
  | "INQUIRY_CUSTOMER_CONTACT_REQUIRED"
  | "INQUIRY_MESSAGE_REQUIRED"
  | "INQUIRY_MESSAGE_TOO_LONG"
  | "INQUIRY_PERSISTENCE_RESULT_INVALID"
  | "INQUIRY_PERSISTED_ID_REQUIRED"
  | "INQUIRY_PERSISTED_TENANT_MISMATCH"
  | "INQUIRY_PERSISTED_ACTOR_MISMATCH"
  | "INQUIRY_PERSISTED_SESSION_MISMATCH"
  | "INQUIRY_PERSISTED_IDEMPOTENCY_MISMATCH"
  | "INQUIRY_PERSISTED_CHANNEL_MISMATCH"
  | "INQUIRY_PERSISTED_STATUS_INVALID"
  | "INQUIRY_PERSISTED_CREATED_AT_INVALID";

export class CustomerInquiryDeniedError extends Error {
  readonly code: CustomerInquiryFailureCode;
  readonly status: number;

  constructor(
    code: CustomerInquiryFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name = "CustomerInquiryDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: CustomerInquiryFailureCode,
  message: string,
  status = 403,
): never {
  throw new CustomerInquiryDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: CustomerInquiryFailureCode,
  message: string,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    deny(code, message, 400);
  }

  return value.trim();
}

function normalizeIdempotencyKey(value: unknown): string {
  const normalized = requireText(
    value,
    "INQUIRY_IDEMPOTENCY_KEY_REQUIRED",
    "A customer inquiry idempotency key is required.",
  );

  if (
    normalized.length < 8 ||
    normalized.length > 128 ||
    !/^[A-Za-z0-9._:-]+$/.test(normalized)
  ) {
    deny(
      "INQUIRY_IDEMPOTENCY_KEY_INVALID",
      "The customer inquiry idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function normalizeCustomerName(value: unknown): string {
  const normalized = requireText(
    value,
    "INQUIRY_CUSTOMER_NAME_REQUIRED",
    "Customer name is required.",
  );

  if (normalized.length > 120) {
    deny(
      "INQUIRY_CUSTOMER_NAME_TOO_LONG",
      "Customer name exceeds the supported length.",
      400,
    );
  }

  return normalized;
}

function normalizeCustomerEmail(
  value: unknown,
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (typeof value !== "string") {
    deny(
      "INQUIRY_CUSTOMER_EMAIL_INVALID",
      "Customer email is invalid.",
      400,
    );
  }

  const normalized = value.trim().toLowerCase();

  if (
    normalized.length === 0 ||
    normalized.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
  ) {
    deny(
      "INQUIRY_CUSTOMER_EMAIL_INVALID",
      "Customer email is invalid.",
      400,
    );
  }

  return normalized;
}

function normalizeCustomerPhone(
  value: unknown,
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (typeof value !== "string") {
    deny(
      "INQUIRY_CUSTOMER_PHONE_INVALID",
      "Customer phone is invalid.",
      400,
    );
  }

  const normalized = value.trim();
  const digitCount = normalized.replace(/\D/g, "").length;

  if (
    normalized.length > 32 ||
    digitCount < 7 ||
    digitCount > 15 ||
    !/^[0-9+()\-\s.]+$/.test(normalized)
  ) {
    deny(
      "INQUIRY_CUSTOMER_PHONE_INVALID",
      "Customer phone is invalid.",
      400,
    );
  }

  return normalized;
}

function normalizeMessage(value: unknown): string {
  const normalized = requireText(
    value,
    "INQUIRY_MESSAGE_REQUIRED",
    "Customer inquiry message is required.",
  );

  if (normalized.length > 4000) {
    deny(
      "INQUIRY_MESSAGE_TOO_LONG",
      "Customer inquiry message exceeds the supported length.",
      400,
    );
  }

  return normalized;
}

function isInquiryChannel(
  value: unknown,
): value is CustomerInquiryChannel {
  return (
    typeof value === "string" &&
    CUSTOMER_INQUIRY_CHANNELS.includes(
      value as CustomerInquiryChannel,
    )
  );
}

function freezeResult(
  result: AuthenticatedCustomerInquiryResult,
): AuthenticatedCustomerInquiryResult {
  Object.freeze(result.inquiry);
  Object.freeze(result.intakeAuthority);
  Object.freeze(result.safetyBoundary);

  return Object.freeze(result);
}

/**
 * Creates or retrieves one tenant-scoped customer inquiry.
 *
 * Security and product properties:
 * - derives tenant identity only from authenticated access context;
 * - rejects client-selected cross-tenant workspace access;
 * - blocks VIEWER inquiry creation;
 * - requires an idempotency key to prevent duplicate intake;
 * - verifies every persisted identity before returning success;
 * - generates no AI recommendation and performs no execution;
 * - preserves mandatory owner approval and sandbox-only execution.
 */
export async function createAuthenticatedCustomerInquiry(
  input: CreateAuthenticatedCustomerInquiryInput,
): Promise<AuthenticatedCustomerInquiryResult> {
  const workspace =
    await buildAuthenticatedTenantWorkspace({
      principal: input.principal,
      accessRepositories: input.accessRepositories,
      workspaceRepository: input.workspaceRepository,
      requestedTenantId: input.requestedTenantId,
      requireOwner: false,
    });

  if (workspace.actor.role === "VIEWER") {
    deny(
      "INQUIRY_ROLE_NOT_AUTHORIZED",
      "Viewer membership cannot create customer inquiries.",
    );
  }

  const repository = input.inquiryRepository;

  if (
    !repository ||
    typeof repository.createOrGetInquiry !== "function"
  ) {
    deny(
      "INQUIRY_REPOSITORY_MISCONFIGURED",
      "Customer inquiry repository is not safely configured.",
      500,
    );
  }

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  if (!isInquiryChannel(input.channel)) {
    deny(
      "INQUIRY_CHANNEL_INVALID",
      "Customer inquiry channel is invalid.",
      400,
    );
  }

  const customerName = normalizeCustomerName(
    input.customerName,
  );

  const customerEmail = normalizeCustomerEmail(
    input.customerEmail,
  );

  const customerPhone = normalizeCustomerPhone(
    input.customerPhone,
  );

  if (
    customerEmail === null &&
    customerPhone === null
  ) {
    deny(
      "INQUIRY_CUSTOMER_CONTACT_REQUIRED",
      "At least one customer contact method is required.",
      400,
    );
  }

  const message = normalizeMessage(input.message);

  const persistenceInput: CustomerInquiryPersistenceInput = {
    tenantId: workspace.tenant.id,
    createdByUserId: workspace.actor.userId,
    sourceSessionId: workspace.actor.sessionId,
    idempotencyKey,
    channel: input.channel,
    customerName,
    customerEmail,
    customerPhone,
    message,
    status: "NEW",
    executionMode: "SANDBOX_ONLY",
  };

  const persisted =
    await repository.createOrGetInquiry(
      persistenceInput,
    );

  if (
    !persisted ||
    (
      persisted.outcome !== "CREATED" &&
      persisted.outcome !== "EXISTING"
    ) ||
    !persisted.inquiry
  ) {
    deny(
      "INQUIRY_PERSISTENCE_RESULT_INVALID",
      "Customer inquiry persistence returned an invalid result.",
      500,
    );
  }

  const inquiry = persisted.inquiry;

  const inquiryId = requireText(
    inquiry.id,
    "INQUIRY_PERSISTED_ID_REQUIRED",
    "Persisted customer inquiry identity is required.",
  );

  if (inquiry.tenantId !== workspace.tenant.id) {
    deny(
      "INQUIRY_PERSISTED_TENANT_MISMATCH",
      "Persisted customer inquiry tenant identity is invalid.",
      500,
    );
  }

  if (
    inquiry.createdByUserId !== workspace.actor.userId
  ) {
    deny(
      "INQUIRY_PERSISTED_ACTOR_MISMATCH",
      "Persisted customer inquiry actor identity is invalid.",
      500,
    );
  }

  if (
    inquiry.sourceSessionId !==
    workspace.actor.sessionId
  ) {
    deny(
      "INQUIRY_PERSISTED_SESSION_MISMATCH",
      "Persisted customer inquiry session identity is invalid.",
      500,
    );
  }

  if (inquiry.idempotencyKey !== idempotencyKey) {
    deny(
      "INQUIRY_PERSISTED_IDEMPOTENCY_MISMATCH",
      "Persisted customer inquiry idempotency identity is invalid.",
      500,
    );
  }

  if (inquiry.channel !== input.channel) {
    deny(
      "INQUIRY_PERSISTED_CHANNEL_MISMATCH",
      "Persisted customer inquiry channel is invalid.",
      500,
    );
  }

  if (inquiry.status !== "NEW") {
    deny(
      "INQUIRY_PERSISTED_STATUS_INVALID",
      "Persisted customer inquiry status is invalid.",
      500,
    );
  }

  const createdAt = requireText(
    inquiry.createdAt,
    "INQUIRY_PERSISTED_CREATED_AT_INVALID",
    "Persisted customer inquiry creation time is invalid.",
  );

  if (Number.isNaN(Date.parse(createdAt))) {
    deny(
      "INQUIRY_PERSISTED_CREATED_AT_INVALID",
      "Persisted customer inquiry creation time is invalid.",
      500,
    );
  }

  return freezeResult({
    outcome: persisted.outcome,

    inquiry: {
      id: inquiryId,
      tenantId: workspace.tenant.id,
      customerName: inquiry.customerName,
      customerEmail: inquiry.customerEmail,
      customerPhone: inquiry.customerPhone,
      channel: inquiry.channel,
      message: inquiry.message,
      status: inquiry.status,
      createdAt,
    },

    intakeAuthority: {
      createdByUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: workspace.actor.role,
    },

    safetyBoundary: {
      recommendationStatus: "NOT_GENERATED",
      ownerApprovalRequiredBeforeExecution: true,
      executionMode: "SANDBOX_ONLY",
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
  });
}
