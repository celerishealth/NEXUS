import {
  createHash,
  randomUUID,
} from "node:crypto";

import type {
  TrustedControlledPilotOwnerIdentity,
} from "./controlledPilotAuthenticatedOwnerResumeService";

import {
  authorizeControlledPilotOperation,
} from "./controlledPilotOperationPermissionGate";

import type {
  ControlledPilotOperationStateReader,
} from "./supabaseControlledPilotOperationStateReader";

import type {
  ControlledCustomerRecommendationDraft,
  ControlledCustomerRecommendationProvider,
} from "./controlledCustomerSandboxRecommendationProvider";

export interface ControlledCustomerRecommendationRecord {
  recommendationId: string;
  tenantId: string;
  inquiryId: string;
  inquiryMessage: string;
  providerMode: "sandbox";
  providerName: string;
  modelName: string;
  recommendationText: string;
  rationale: string;
  confidence: number;
  riskFlags: readonly string[];
  inputFingerprint: string;
  createdAt: number;
}

export type ControlledCustomerRecommendationStoreResult =
  | {
      status: "created" | "already-created";
      recommendationId: string;
      inquiryStatus: "owner-review";
      createdAt: number;
    }
  | {
      status:
        | "inquiry-unavailable"
        | "inquiry-snapshot-conflict"
        | "inquiry-state-conflict"
        | "binding-conflict"
        | "store-unavailable";
      existingRecommendationId?: string;
      currentInquiryStatus?: string;
    };

export interface ControlledCustomerRecommendationStore {
  createRecommendation(
    record: ControlledCustomerRecommendationRecord,
  ): Promise<ControlledCustomerRecommendationStoreResult>;
}

export interface ControlledCustomerRecommendationInput {
  identity: TrustedControlledPilotOwnerIdentity;
  expectedStateVersion: number;
  stateReader:
    ControlledPilotOperationStateReader;
  inquiryId: string;
  inquiryMessage: string;
  provider:
    ControlledCustomerRecommendationProvider;
  store:
    ControlledCustomerRecommendationStore;
  createdAt?: number;
  createRecommendationId?: () => string;
}

export interface ControlledCustomerRecommendationCreated {
  created: true;
  code:
    | "SANDBOX_RECOMMENDATION_CREATED"
    | "SANDBOX_RECOMMENDATION_ALREADY_CREATED";
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  inquiryStatus: "owner-review";
  providerMode: "sandbox";
  providerName: string;
  modelName: string;
  recommendationText: string;
  rationale: string;
  confidence: number;
  riskFlags: readonly string[];
  inputFingerprint: string;
  ownerApprovalRequired: true;
  customerDeliveryAuthorized: false;
  sandboxExecutionAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledCustomerRecommendationRejected {
  created: false;
  code:
    | "PILOT_OPERATION_NOT_PERMITTED"
    | "INVALID_RECOMMENDATION_INPUT"
    | "SANDBOX_PROVIDER_REQUIRED"
    | "RECOMMENDATION_PROVIDER_FAILED"
    | "INVALID_RECOMMENDATION_DRAFT"
    | "INQUIRY_NOT_FOUND"
    | "INQUIRY_SNAPSHOT_CONFLICT"
    | "INQUIRY_STATE_CONFLICT"
    | "RECOMMENDATION_BINDING_CONFLICT"
    | "RECOMMENDATION_STORE_UNAVAILABLE";
  reason: string;
  permissionCode?: string;
  existingRecommendationId?: string;
  currentInquiryStatus?: string;
  ownerApprovalRequired: true;
  customerDeliveryAuthorized: false;
  sandboxExecutionAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledCustomerRecommendationResult =
  | ControlledCustomerRecommendationCreated
  | ControlledCustomerRecommendationRejected;

function reject(
  code:
    ControlledCustomerRecommendationRejected["code"],
  reason: string,
  details?: {
    permissionCode?: string;
    existingRecommendationId?: string;
    currentInquiryStatus?: string;
  },
): ControlledCustomerRecommendationRejected {
  return {
    created: false,
    code,
    reason,
    ...(details?.permissionCode
      ? {
          permissionCode:
            details.permissionCode,
        }
      : {}),
    ...(details?.existingRecommendationId
      ? {
          existingRecommendationId:
            details.existingRecommendationId,
        }
      : {}),
    ...(details?.currentInquiryStatus
      ? {
          currentInquiryStatus:
            details.currentInquiryStatus,
        }
      : {}),
    ownerApprovalRequired: true,
    customerDeliveryAuthorized: false,
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

  const normalized =
    value.trim().replace(/\s+/g, " ");

  if (
    normalized.length < 1 ||
    normalized.length > maximumLength
  ) {
    return null;
  }

  return normalized;
}

function normalizeRiskFlags(
  value: unknown,
): readonly string[] | null {
  if (!Array.isArray(value) || value.length > 20) {
    return null;
  }

  const normalizedFlags: string[] = [];

  for (const item of value) {
    const normalized =
      normalizeRequiredString(item, 100);

    if (!normalized) {
      return null;
    }

    if (!normalizedFlags.includes(normalized)) {
      normalizedFlags.push(normalized);
    }
  }

  return normalizedFlags;
}

function isDraftValid(
  value: unknown,
): value is ControlledCustomerRecommendationDraft {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const record =
    value as Record<string, unknown>;

  return (
    normalizeRequiredString(
      record.recommendationText,
      4000,
    ) !== null &&
    normalizeRequiredString(
      record.rationale,
      4000,
    ) !== null &&
    typeof record.confidence === "number" &&
    Number.isFinite(record.confidence) &&
    record.confidence >= 0 &&
    record.confidence <= 1 &&
    normalizeRiskFlags(record.riskFlags) !== null
  );
}

function hasProvider(
  value: unknown,
): value is ControlledCustomerRecommendationProvider {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        generateRecommendation?: unknown;
      }
    ).generateRecommendation === "function"
  );
}

function hasStore(
  value: unknown,
): value is ControlledCustomerRecommendationStore {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        createRecommendation?: unknown;
      }
    ).createRecommendation === "function"
  );
}

function createInputFingerprint(
  tenantId: string,
  inquiryId: string,
  inquiryMessage: string,
  providerName: string,
  modelName: string,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        tenantId,
        inquiryId,
        inquiryMessage,
        providerName,
        modelName,
      }),
      "utf8",
    )
    .digest("hex");
}

export async function createControlledCustomerRecommendation(
  input: ControlledCustomerRecommendationInput,
): Promise<ControlledCustomerRecommendationResult> {
  const permission =
    await authorizeControlledPilotOperation({
      identity: input?.identity,
      expectedStateVersion:
        input?.expectedStateVersion,
      stateReader: input?.stateReader,
    });

  if (!permission.permitted) {
    return reject(
      "PILOT_OPERATION_NOT_PERMITTED",
      "Controlled pilot operation permission was denied before recommendation generation.",
      {
        permissionCode:
          permission.code,
      },
    );
  }

  const inquiryId =
    normalizeRequiredString(
      input?.inquiryId,
      200,
    );

  const inquiryMessage =
    normalizeRequiredString(
      input?.inquiryMessage,
      4000,
    );

  const createdAt =
    input?.createdAt ??
    Math.floor(Date.now() / 1000);

  if (
    !inquiryId ||
    !inquiryMessage ||
    !Number.isSafeInteger(createdAt) ||
    createdAt < 0 ||
    !hasProvider(input?.provider) ||
    !hasStore(input?.store)
  ) {
    return reject(
      "INVALID_RECOMMENDATION_INPUT",
      "Recommendation request, provider or persistence store is invalid.",
    );
  }

  if (input.provider.mode !== "sandbox") {
    return reject(
      "SANDBOX_PROVIDER_REQUIRED",
      "Only the controlled sandbox recommendation provider is authorized.",
    );
  }

  const providerName =
    normalizeRequiredString(
      input.provider.providerName,
      100,
    );

  const modelName =
    normalizeRequiredString(
      input.provider.modelName,
      100,
    );

  if (!providerName || !modelName) {
    return reject(
      "INVALID_RECOMMENDATION_INPUT",
      "Sandbox provider identity is invalid.",
    );
  }

  let draft:
    ControlledCustomerRecommendationDraft;

  try {
    draft =
      await input.provider.generateRecommendation({
        tenantId: permission.tenantId,
        inquiryId,
        inquiryMessage,
      });
  } catch {
    return reject(
      "RECOMMENDATION_PROVIDER_FAILED",
      "Sandbox recommendation generation failed.",
    );
  }

  if (!isDraftValid(draft)) {
    return reject(
      "INVALID_RECOMMENDATION_DRAFT",
      "Sandbox provider returned an invalid recommendation draft.",
    );
  }

  const recommendationText =
    normalizeRequiredString(
      draft.recommendationText,
      4000,
    )!;

  const rationale =
    normalizeRequiredString(
      draft.rationale,
      4000,
    )!;

  const riskFlags =
    normalizeRiskFlags(
      draft.riskFlags,
    )!;

  const recommendationId =
    normalizeRequiredString(
      (
        input.createRecommendationId ??
        randomUUID
      )(),
      200,
    );

  if (!recommendationId) {
    return reject(
      "INVALID_RECOMMENDATION_INPUT",
      "A valid recommendation identity could not be created.",
    );
  }

  const inputFingerprint =
    createInputFingerprint(
      permission.tenantId,
      inquiryId,
      inquiryMessage,
      providerName,
      modelName,
    );

  let storeResult:
    ControlledCustomerRecommendationStoreResult;

  try {
    storeResult =
      await input.store.createRecommendation({
        recommendationId,
        tenantId: permission.tenantId,
        inquiryId,
        inquiryMessage,
        providerMode: "sandbox",
        providerName,
        modelName,
        recommendationText,
        rationale,
        confidence: draft.confidence,
        riskFlags,
        inputFingerprint,
        createdAt,
      });
  } catch {
    return reject(
      "RECOMMENDATION_STORE_UNAVAILABLE",
      "Sandbox recommendation persistence failed.",
    );
  }

  if (
    storeResult.status ===
    "inquiry-unavailable"
  ) {
    return reject(
      "INQUIRY_NOT_FOUND",
      "The tenant-bound customer inquiry does not exist.",
    );
  }

  if (
    storeResult.status ===
    "inquiry-snapshot-conflict"
  ) {
    return reject(
      "INQUIRY_SNAPSHOT_CONFLICT",
      "The inquiry snapshot changed or does not match persistent storage.",
      {
        currentInquiryStatus:
          storeResult.currentInquiryStatus,
      },
    );
  }

  if (
    storeResult.status ===
    "inquiry-state-conflict"
  ) {
    return reject(
      "INQUIRY_STATE_CONFLICT",
      "The customer inquiry is not eligible for recommendation generation.",
      {
        currentInquiryStatus:
          storeResult.currentInquiryStatus,
      },
    );
  }

  if (
    storeResult.status ===
    "binding-conflict"
  ) {
    return reject(
      "RECOMMENDATION_BINDING_CONFLICT",
      "The recommendation fingerprint is already bound to different content.",
      {
        existingRecommendationId:
          storeResult.existingRecommendationId,
        currentInquiryStatus:
          storeResult.currentInquiryStatus,
      },
    );
  }

  if (
    storeResult.status ===
    "store-unavailable"
  ) {
    return reject(
      "RECOMMENDATION_STORE_UNAVAILABLE",
      "Sandbox recommendation persistence was not confirmed.",
    );
  }

  return {
    created: true,
    code:
      storeResult.status === "created"
        ? "SANDBOX_RECOMMENDATION_CREATED"
        : "SANDBOX_RECOMMENDATION_ALREADY_CREATED",
    tenantId: permission.tenantId,
    inquiryId,
    recommendationId:
      storeResult.recommendationId,
    inquiryStatus: "owner-review",
    providerMode: "sandbox",
    providerName,
    modelName,
    recommendationText,
    rationale,
    confidence: draft.confidence,
    riskFlags,
    inputFingerprint,
    ownerApprovalRequired: true,
    customerDeliveryAuthorized: false,
    sandboxExecutionAuthorized: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
