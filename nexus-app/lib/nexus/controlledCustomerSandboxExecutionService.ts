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
  ControlledCustomerSandboxExecutionProvider,
} from "./controlledCustomerSandboxExecutionProvider";

export interface ControlledCustomerSandboxExecutionRecord {
  executionId: string;
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  decisionId: string;
  ownerId: string;
  recommendationText: string;
  rationale: string;
  confidence: number;
  recommendationRiskFlags: readonly string[];
  recommendationInputFingerprint: string;
  recommendationContentHash: string;
  executionMode: "sandbox";
  executorName: string;
  executorVersion: string;
  executionInputHash: string;
  responseDraft: string;
  internalNotes: string;
  executionRiskFlags: readonly string[];
  executedAt: number;
}

export type ControlledCustomerSandboxExecutionStoreResult =
  | {
      status: "executed" | "already-executed";
      executionId: string;
      inquiryStatus: "sandbox-executed";
      executionStatus: "sandbox-executed";
      executedAt: number;
    }
  | {
      status:
        | "inquiry-unavailable"
        | "recommendation-unavailable"
        | "decision-unavailable"
        | "recommendation-snapshot-conflict"
        | "approval-snapshot-conflict"
        | "recommendation-state-conflict"
        | "inquiry-state-conflict"
        | "execution-conflict"
        | "store-unavailable";
      existingExecutionId?: string;
      currentInquiryStatus?: string;
      currentExecutionStatus?: string;
    };

export interface ControlledCustomerSandboxExecutionStore {
  executeApprovedRecommendation(
    record: ControlledCustomerSandboxExecutionRecord,
  ): Promise<ControlledCustomerSandboxExecutionStoreResult>;
}

export interface ControlledCustomerSandboxExecutionInput {
  identity: TrustedControlledPilotOwnerIdentity;
  expectedStateVersion: number;
  stateReader:
    ControlledPilotOperationStateReader;
  inquiryId: string;
  recommendationId: string;
  decisionId: string;
  ownerDecision: "approve" | "reject";
  recommendationText: string;
  rationale: string;
  confidence: number;
  recommendationRiskFlags: readonly string[];
  recommendationInputFingerprint: string;
  recommendationContentHash: string;
  provider:
    ControlledCustomerSandboxExecutionProvider;
  store:
    ControlledCustomerSandboxExecutionStore;
  executedAt?: number;
  createExecutionId?: () => string;
}

export interface ControlledCustomerSandboxExecutionCompleted {
  completed: true;
  code:
    | "SANDBOX_EXECUTION_COMPLETED"
    | "SANDBOX_EXECUTION_ALREADY_COMPLETED";
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  decisionId: string;
  executionId: string;
  inquiryStatus: "sandbox-executed";
  executionStatus: "sandbox-executed";
  responseDraft: string;
  internalNotes: string;
  riskFlags: readonly string[];
  executionInputHash: string;
  executedAt: number;
  sandboxExecutionCompleted: true;
  resultTrackingRequired: true;
  customerDeliveryAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledCustomerSandboxExecutionRejected {
  completed: false;
  code:
    | "PILOT_OPERATION_NOT_PERMITTED"
    | "TENANT_OWNER_ROLE_REQUIRED"
    | "OWNER_APPROVAL_REQUIRED"
    | "INVALID_EXECUTION_INPUT"
    | "SANDBOX_EXECUTOR_REQUIRED"
    | "SANDBOX_EXECUTION_FAILED"
    | "INVALID_SANDBOX_RESULT"
    | "INQUIRY_NOT_FOUND"
    | "RECOMMENDATION_NOT_FOUND"
    | "OWNER_DECISION_NOT_FOUND"
    | "RECOMMENDATION_SNAPSHOT_CONFLICT"
    | "OWNER_APPROVAL_SNAPSHOT_CONFLICT"
    | "RECOMMENDATION_STATE_CONFLICT"
    | "INQUIRY_STATE_CONFLICT"
    | "SANDBOX_EXECUTION_CONFLICT"
    | "SANDBOX_EXECUTION_STORE_UNAVAILABLE";
  reason: string;
  permissionCode?: string;
  existingExecutionId?: string;
  currentInquiryStatus?: string;
  currentExecutionStatus?: string;
  sandboxExecutionCompleted: false;
  resultTrackingRequired: false;
  customerDeliveryAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledCustomerSandboxExecutionResult =
  | ControlledCustomerSandboxExecutionCompleted
  | ControlledCustomerSandboxExecutionRejected;

function reject(
  code:
    ControlledCustomerSandboxExecutionRejected["code"],
  reason: string,
  details?: {
    permissionCode?: string;
    existingExecutionId?: string;
    currentInquiryStatus?: string;
    currentExecutionStatus?: string;
  },
): ControlledCustomerSandboxExecutionRejected {
  return {
    completed: false,
    code,
    reason,
    ...(details?.permissionCode
      ? {
          permissionCode:
            details.permissionCode,
        }
      : {}),
    ...(details?.existingExecutionId
      ? {
          existingExecutionId:
            details.existingExecutionId,
        }
      : {}),
    ...(details?.currentInquiryStatus
      ? {
          currentInquiryStatus:
            details.currentInquiryStatus,
        }
      : {}),
    ...(details?.currentExecutionStatus
      ? {
          currentExecutionStatus:
            details.currentExecutionStatus,
        }
      : {}),
    sandboxExecutionCompleted: false,
    resultTrackingRequired: false,
    customerDeliveryAuthorized: false,
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
  if (!Array.isArray(value) || value.length > 30) {
    return null;
  }

  const normalized: string[] = [];

  for (const valueItem of value) {
    const flag =
      normalizeRequiredString(
        valueItem,
        100,
      );

    if (!flag) {
      return null;
    }

    if (!normalized.includes(flag)) {
      normalized.push(flag);
    }
  }

  return normalized;
}

function hasProvider(
  value: unknown,
): value is ControlledCustomerSandboxExecutionProvider {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        execute?: unknown;
      }
    ).execute === "function"
  );
}

function hasStore(
  value: unknown,
): value is ControlledCustomerSandboxExecutionStore {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        executeApprovedRecommendation?: unknown;
      }
    ).executeApprovedRecommendation === "function"
  );
}

function createExecutionInputHash(
  input: {
    tenantId: string;
    inquiryId: string;
    recommendationId: string;
    decisionId: string;
    recommendationContentHash: string;
    executorName: string;
    executorVersion: string;
  },
): string {
  return createHash("sha256")
    .update(
      JSON.stringify(input),
      "utf8",
    )
    .digest("hex");
}

export async function executeApprovedCustomerRecommendationInSandbox(
  input: ControlledCustomerSandboxExecutionInput,
): Promise<ControlledCustomerSandboxExecutionResult> {
  const permission =
    await authorizeControlledPilotOperation({
      identity: input?.identity,
      expectedStateVersion:
        input?.expectedStateVersion,
      stateReader:
        input?.stateReader,
    });

  if (!permission.permitted) {
    return reject(
      "PILOT_OPERATION_NOT_PERMITTED",
      "Controlled pilot operation permission was denied before sandbox execution.",
      {
        permissionCode:
          permission.code,
      },
    );
  }

  if (!input.identity.roles.includes("owner")) {
    return reject(
      "TENANT_OWNER_ROLE_REQUIRED",
      "Only the authenticated tenant owner may start the approved sandbox execution.",
    );
  }

  if (input?.ownerDecision !== "approve") {
    return reject(
      "OWNER_APPROVAL_REQUIRED",
      "A persisted owner approval is required before sandbox execution.",
    );
  }

  const inquiryId =
    normalizeRequiredString(
      input?.inquiryId,
      200,
    );

  const recommendationId =
    normalizeRequiredString(
      input?.recommendationId,
      200,
    );

  const decisionId =
    normalizeRequiredString(
      input?.decisionId,
      200,
    );

  const recommendationText =
    normalizeRequiredString(
      input?.recommendationText,
      4000,
    );

  const rationale =
    normalizeRequiredString(
      input?.rationale,
      4000,
    );

  const recommendationRiskFlags =
    normalizeRiskFlags(
      input?.recommendationRiskFlags,
    );

  const recommendationInputFingerprint =
    normalizeRequiredString(
      input?.recommendationInputFingerprint,
      64,
    );

  const recommendationContentHash =
    normalizeRequiredString(
      input?.recommendationContentHash,
      64,
    );

  const executedAt =
    input?.executedAt ??
    Math.floor(Date.now() / 1000);

  if (
    !inquiryId ||
    !recommendationId ||
    !decisionId ||
    !recommendationText ||
    !rationale ||
    !recommendationRiskFlags ||
    !recommendationInputFingerprint ||
    !recommendationContentHash ||
    !/^[a-f0-9]{64}$/.test(
      recommendationInputFingerprint,
    ) ||
    !/^[a-f0-9]{64}$/.test(
      recommendationContentHash,
    ) ||
    typeof input?.confidence !== "number" ||
    !Number.isFinite(input.confidence) ||
    input.confidence < 0 ||
    input.confidence > 1 ||
    !Number.isSafeInteger(executedAt) ||
    executedAt < 0 ||
    !hasProvider(input?.provider) ||
    !hasStore(input?.store)
  ) {
    return reject(
      "INVALID_EXECUTION_INPUT",
      "Sandbox execution input, approval snapshot, provider or persistence store is invalid.",
    );
  }

  if (input.provider.mode !== "sandbox") {
    return reject(
      "SANDBOX_EXECUTOR_REQUIRED",
      "Only the deterministic sandbox executor is authorized.",
    );
  }

  const executorName =
    normalizeRequiredString(
      input.provider.executorName,
      100,
    );

  const executorVersion =
    normalizeRequiredString(
      input.provider.executorVersion,
      100,
    );

  if (!executorName || !executorVersion) {
    return reject(
      "INVALID_EXECUTION_INPUT",
      "Sandbox executor identity is invalid.",
    );
  }

  let draft;

  try {
    draft =
      await input.provider.execute({
        tenantId:
          permission.tenantId,
        inquiryId,
        recommendationId,
        recommendationText,
        rationale,
        confidence:
          input.confidence,
        riskFlags:
          recommendationRiskFlags,
      });
  } catch {
    return reject(
      "SANDBOX_EXECUTION_FAILED",
      "Deterministic sandbox execution failed.",
    );
  }

  const responseDraft =
    normalizeRequiredString(
      draft?.responseDraft,
      4000,
    );

  const internalNotes =
    normalizeRequiredString(
      draft?.internalNotes,
      4000,
    );

  const executionRiskFlags =
    normalizeRiskFlags(
      draft?.riskFlags,
    );

  if (
    !responseDraft ||
    !internalNotes ||
    !executionRiskFlags
  ) {
    return reject(
      "INVALID_SANDBOX_RESULT",
      "Sandbox executor returned an invalid result.",
    );
  }

  const executionId =
    normalizeRequiredString(
      (
        input.createExecutionId ??
        randomUUID
      )(),
      200,
    );

  if (!executionId) {
    return reject(
      "INVALID_EXECUTION_INPUT",
      "A valid sandbox execution identity could not be created.",
    );
  }

  const executionInputHash =
    createExecutionInputHash({
      tenantId:
        permission.tenantId,
      inquiryId,
      recommendationId,
      decisionId,
      recommendationContentHash,
      executorName,
      executorVersion,
    });

  let storeResult:
    ControlledCustomerSandboxExecutionStoreResult;

  try {
    storeResult =
      await input.store.executeApprovedRecommendation({
        executionId,
        tenantId:
          permission.tenantId,
        inquiryId,
        recommendationId,
        decisionId,
        ownerId:
          permission.userId,
        recommendationText,
        rationale,
        confidence:
          input.confidence,
        recommendationRiskFlags,
        recommendationInputFingerprint,
        recommendationContentHash,
        executionMode: "sandbox",
        executorName,
        executorVersion,
        executionInputHash,
        responseDraft,
        internalNotes,
        executionRiskFlags,
        executedAt,
      });
  } catch {
    return reject(
      "SANDBOX_EXECUTION_STORE_UNAVAILABLE",
      "Sandbox execution result could not be persistently stored.",
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
    "recommendation-unavailable"
  ) {
    return reject(
      "RECOMMENDATION_NOT_FOUND",
      "The tenant-bound recommendation does not exist.",
    );
  }

  if (
    storeResult.status ===
    "decision-unavailable"
  ) {
    return reject(
      "OWNER_DECISION_NOT_FOUND",
      "The tenant-bound owner approval does not exist.",
    );
  }

  if (
    storeResult.status ===
    "recommendation-snapshot-conflict"
  ) {
    return reject(
      "RECOMMENDATION_SNAPSHOT_CONFLICT",
      "The submitted recommendation does not match persistent storage.",
      {
        currentInquiryStatus:
          storeResult.currentInquiryStatus,
      },
    );
  }

  if (
    storeResult.status ===
    "approval-snapshot-conflict"
  ) {
    return reject(
      "OWNER_APPROVAL_SNAPSHOT_CONFLICT",
      "The submitted approval does not match the persisted owner decision.",
      {
        currentInquiryStatus:
          storeResult.currentInquiryStatus,
      },
    );
  }

  if (
    storeResult.status ===
    "recommendation-state-conflict"
  ) {
    return reject(
      "RECOMMENDATION_STATE_CONFLICT",
      "The recommendation is not in the approved state.",
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
      "The inquiry is not eligible for sandbox execution.",
      {
        currentInquiryStatus:
          storeResult.currentInquiryStatus,
      },
    );
  }

  if (
    storeResult.status ===
    "execution-conflict"
  ) {
    return reject(
      "SANDBOX_EXECUTION_CONFLICT",
      "A different sandbox execution is already bound to this recommendation.",
      {
        existingExecutionId:
          storeResult.existingExecutionId,
        currentInquiryStatus:
          storeResult.currentInquiryStatus,
        currentExecutionStatus:
          storeResult.currentExecutionStatus,
      },
    );
  }

  if (
    storeResult.status ===
    "store-unavailable"
  ) {
    return reject(
      "SANDBOX_EXECUTION_STORE_UNAVAILABLE",
      "Sandbox execution persistence was not confirmed.",
    );
  }

  return {
    completed: true,
    code:
      storeResult.status ===
      "already-executed"
        ? "SANDBOX_EXECUTION_ALREADY_COMPLETED"
        : "SANDBOX_EXECUTION_COMPLETED",
    tenantId:
      permission.tenantId,
    inquiryId,
    recommendationId,
    decisionId,
    executionId:
      storeResult.executionId,
    inquiryStatus:
      "sandbox-executed",
    executionStatus:
      "sandbox-executed",
    responseDraft,
    internalNotes,
    riskFlags:
      executionRiskFlags,
    executionInputHash,
    executedAt:
      storeResult.executedAt,
    sandboxExecutionCompleted: true,
    resultTrackingRequired: true,
    customerDeliveryAuthorized: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
