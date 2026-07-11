import {
  randomUUID,
} from "node:crypto";

import type {
  TrustedControlledPilotOwnerIdentity,
} from "./controlledPilotAuthenticatedOwnerResumeService";

export type ControlledCustomerInquiryChannel =
  | "web"
  | "email"
  | "whatsapp"
  | "manual";

export interface ControlledCustomerInquiryRecord {
  inquiryId: string;
  tenantId: string;
  customerRef: string;
  channel: ControlledCustomerInquiryChannel;
  message: string;
  idempotencyKey: string;
  receivedAt: number;
}

export type ControlledCustomerInquiryStoreResult =
  | {
      status: "created" | "already-created";
      inquiryId: string;
      receivedAt: number;
    }
  | {
      status:
        | "binding-conflict"
        | "store-unavailable";
      existingInquiryId?: string;
    };

export interface ControlledCustomerInquiryStore {
  createInquiry(
    record: ControlledCustomerInquiryRecord,
  ): Promise<ControlledCustomerInquiryStoreResult>;
}

export interface ControlledCustomerInquiryIntakeInput {
  identity: TrustedControlledPilotOwnerIdentity;
  customerRef: string;
  channel: ControlledCustomerInquiryChannel;
  message: string;
  idempotencyKey: string;
  store: ControlledCustomerInquiryStore;
  receivedAt?: number;
  createInquiryId?: () => string;
}

export interface ControlledCustomerInquiryAccepted {
  accepted: true;
  code:
    | "CUSTOMER_INQUIRY_CREATED"
    | "CUSTOMER_INQUIRY_ALREADY_CREATED";
  inquiryId: string;
  tenantId: string;
  customerRef: string;
  channel: ControlledCustomerInquiryChannel;
  status: "received";
  receivedAt: number;
  aiRecommendationAuthorized: false;
  ownerApprovalRequired: true;
  sandboxExecutionAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledCustomerInquiryRejected {
  accepted: false;
  code:
    | "INVALID_TRUSTED_IDENTITY"
    | "AUTHENTICATION_REQUIRED"
    | "INQUIRY_INTAKE_ROLE_REQUIRED"
    | "INVALID_INQUIRY_INPUT"
    | "INQUIRY_IDEMPOTENCY_CONFLICT"
    | "INQUIRY_STORE_UNAVAILABLE";
  reason: string;
  existingInquiryId?: string;
  aiRecommendationAuthorized: false;
  ownerApprovalRequired: true;
  sandboxExecutionAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledCustomerInquiryIntakeResult =
  | ControlledCustomerInquiryAccepted
  | ControlledCustomerInquiryRejected;

function reject(
  code:
    ControlledCustomerInquiryRejected["code"],
  reason: string,
  existingInquiryId?: string,
): ControlledCustomerInquiryRejected {
  return {
    accepted: false,
    code,
    reason,
    ...(existingInquiryId
      ? {
          existingInquiryId,
        }
      : {}),
    aiRecommendationAuthorized: false,
    ownerApprovalRequired: true,
    sandboxExecutionAuthorized: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}

function normalizeRequiredString(
  value: unknown,
  maximumLength: number,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (
    normalized.length < 1 ||
    normalized.length > maximumLength
  ) {
    return null;
  }

  return normalized;
}

function normalizeIdentity(
  value: unknown,
): {
  authenticated: boolean;
  userId: string;
  tenantId: string;
  roles: readonly string[];
} | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  const record =
    value as Record<string, unknown>;

  const userId =
    normalizeRequiredString(
      record.userId,
      200,
    );

  const tenantId =
    normalizeRequiredString(
      record.tenantId,
      200,
    );

  if (
    typeof record.authenticated !== "boolean" ||
    !userId ||
    !tenantId ||
    !Array.isArray(record.roles) ||
    !record.roles.every(
      (role) =>
        normalizeRequiredString(
          role,
          100,
        ) !== null,
    )
  ) {
    return null;
  }

  return {
    authenticated: record.authenticated,
    userId,
    tenantId,
    roles:
      record.roles as readonly string[],
  };
}

function isAllowedChannel(
  value: unknown,
): value is ControlledCustomerInquiryChannel {
  return (
    value === "web" ||
    value === "email" ||
    value === "whatsapp" ||
    value === "manual"
  );
}

function hasInquiryStore(
  value: unknown,
): value is ControlledCustomerInquiryStore {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        createInquiry?: unknown;
      }
    ).createInquiry === "function"
  );
}

export async function intakeControlledCustomerInquiry(
  input: ControlledCustomerInquiryIntakeInput,
): Promise<ControlledCustomerInquiryIntakeResult> {
  const identity =
    normalizeIdentity(input?.identity);

  if (!identity) {
    return reject(
      "INVALID_TRUSTED_IDENTITY",
      "Trusted inquiry intake identity is incomplete or invalid.",
    );
  }

  if (!identity.authenticated) {
    return reject(
      "AUTHENTICATION_REQUIRED",
      "An authenticated tenant session is required for controlled inquiry intake.",
    );
  }

  if (
    !identity.roles.includes("owner") &&
    !identity.roles.includes("operator")
  ) {
    return reject(
      "INQUIRY_INTAKE_ROLE_REQUIRED",
      "The authenticated identity does not hold an allowed inquiry intake role.",
    );
  }

  const customerRef =
    normalizeRequiredString(
      input?.customerRef,
      200,
    );

  const message =
    normalizeRequiredString(
      input?.message,
      4000,
    );

  const idempotencyKey =
    normalizeRequiredString(
      input?.idempotencyKey,
      200,
    );

  const receivedAt =
    input?.receivedAt ??
    Math.floor(Date.now() / 1000);

  if (
    !customerRef ||
    !message ||
    !idempotencyKey ||
    !isAllowedChannel(input?.channel) ||
    !Number.isSafeInteger(receivedAt) ||
    receivedAt < 0 ||
    !hasInquiryStore(input?.store)
  ) {
    return reject(
      "INVALID_INQUIRY_INPUT",
      "Controlled customer inquiry input or persistence store is invalid.",
    );
  }

  const createInquiryId =
    input.createInquiryId ??
    randomUUID;

  const inquiryId =
    normalizeRequiredString(
      createInquiryId(),
      200,
    );

  if (!inquiryId) {
    return reject(
      "INVALID_INQUIRY_INPUT",
      "A valid inquiry identity could not be created.",
    );
  }

  let storeResult:
    ControlledCustomerInquiryStoreResult;

  try {
    storeResult =
      await input.store.createInquiry({
        inquiryId,
        /*
         * Tenant identity is derived only from the trusted
         * authenticated context. The caller cannot override it.
         */
        tenantId: identity.tenantId,
        customerRef,
        channel: input.channel,
        message,
        idempotencyKey,
        receivedAt,
      });
  } catch {
    return reject(
      "INQUIRY_STORE_UNAVAILABLE",
      "Customer inquiry could not be persistently stored.",
    );
  }

  if (
    storeResult.status ===
    "binding-conflict"
  ) {
    return reject(
      "INQUIRY_IDEMPOTENCY_CONFLICT",
      "The idempotency key is already bound to different inquiry content.",
      storeResult.existingInquiryId,
    );
  }

  if (
    storeResult.status ===
    "store-unavailable"
  ) {
    return reject(
      "INQUIRY_STORE_UNAVAILABLE",
      "Customer inquiry persistence was not confirmed.",
    );
  }

  return {
    accepted: true,
    code:
      storeResult.status === "created"
        ? "CUSTOMER_INQUIRY_CREATED"
        : "CUSTOMER_INQUIRY_ALREADY_CREATED",
    inquiryId: storeResult.inquiryId,
    tenantId: identity.tenantId,
    customerRef,
    channel: input.channel,
    status: "received",
    receivedAt: storeResult.receivedAt,
    aiRecommendationAuthorized: false,
    ownerApprovalRequired: true,
    sandboxExecutionAuthorized: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
