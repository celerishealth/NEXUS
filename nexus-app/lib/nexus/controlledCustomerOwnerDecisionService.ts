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

export type ControlledCustomerOwnerDecision =
  | "approve"
  | "reject";

export interface ControlledCustomerOwnerDecisionRecord {
  decisionId: string;
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  ownerId: string;
  sessionId: string | null;
  decision: ControlledCustomerOwnerDecision;
  decisionReason: string;
  recommendationText: string;
  rationale: string;
  confidence: number;
  riskFlags: readonly string[];
  recommendationInputFingerprint: string;
  recommendationContentHash: string;
  decidedAt: number;
}

export type ControlledCustomerOwnerDecisionStoreResult =
  | {
      status: "decided" | "already-decided";
      decisionId: string;
      decision: ControlledCustomerOwnerDecision;
      recommendationStatus:
        | "approved"
        | "rejected";
      inquiryStatus:
        | "approved"
        | "rejected";
      decidedAt: number;
    }
  | {
      status:
        | "recommendation-unavailable"
        | "inquiry-unavailable"
        | "recommendation-snapshot-conflict"
        | "recommendation-state-conflict"
        | "inquiry-state-conflict"
        | "decision-conflict"
        | "store-unavailable";
      existingDecisionId?: string;
      existingDecision?: string;
      currentRecommendationStatus?: string;
      currentInquiryStatus?: string;
    };

export interface ControlledCustomerOwnerDecisionStore {
  decideRecommendation(
    record: ControlledCustomerOwnerDecisionRecord,
  ): Promise<ControlledCustomerOwnerDecisionStoreResult>;
}

export interface ControlledCustomerOwnerDecisionInput {
  identity: TrustedControlledPilotOwnerIdentity;
  expectedStateVersion: number;
  stateReader:
    ControlledPilotOperationStateReader;
  inquiryId: string;
  recommendationId: string;
  recommendationText: string;
  rationale: string;
  confidence: number;
  riskFlags: readonly string[];
  recommendationInputFingerprint: string;
  decision: ControlledCustomerOwnerDecision;
  decisionReason: string;
  store:
    ControlledCustomerOwnerDecisionStore;
  decidedAt?: number;
  createDecisionId?: () => string;
}

export interface ControlledCustomerOwnerDecisionRecorded {
  recorded: true;
  code:
    | "OWNER_RECOMMENDATION_APPROVED"
    | "OWNER_RECOMMENDATION_REJECTED"
    | "OWNER_RECOMMENDATION_DECISION_ALREADY_RECORDED";
  tenantId: string;
  ownerId: string;
  inquiryId: string;
  recommendationId: string;
  decisionId: string;
  decision: ControlledCustomerOwnerDecision;
  recommendationStatus:
    | "approved"
    | "rejected";
  inquiryStatus:
    | "approved"
    | "rejected";
  recommendationContentHash: string;
  decidedAt: number;
  ownerDecisionRecorded: true;
  sandboxExecutionEligible: boolean;
  sandboxExecutionAuthorized: false;
  customerDeliveryAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledCustomerOwnerDecisionRejected {
  recorded: false;
  code:
    | "PILOT_OPERATION_NOT_PERMITTED"
    | "TENANT_OWNER_ROLE_REQUIRED"
    | "INVALID_OWNER_DECISION_INPUT"
    | "RECOMMENDATION_NOT_FOUND"
    | "INQUIRY_NOT_FOUND"
    | "RECOMMENDATION_SNAPSHOT_CONFLICT"
    | "RECOMMENDATION_STATE_CONFLICT"
    | "INQUIRY_STATE_CONFLICT"
    | "OWNER_DECISION_CONFLICT"
    | "OWNER_DECISION_STORE_UNAVAILABLE";
  reason: string;
  permissionCode?: string;
  existingDecisionId?: string;
  existingDecision?: string;
  currentRecommendationStatus?: string;
  currentInquiryStatus?: string;
  ownerDecisionRecorded: false;
  sandboxExecutionEligible: false;
  sandboxExecutionAuthorized: false;
  customerDeliveryAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledCustomerOwnerDecisionResult =
  | ControlledCustomerOwnerDecisionRecorded
  | ControlledCustomerOwnerDecisionRejected;

function reject(
  code:
    ControlledCustomerOwnerDecisionRejected["code"],
  reason: string,
  details?: {
    permissionCode?: string;
    existingDecisionId?: string;
    existingDecision?: string;
    currentRecommendationStatus?: string;
    currentInquiryStatus?: string;
  },
): ControlledCustomerOwnerDecisionRejected {
  return {
    recorded: false,
    code,
    reason,
    ...(details?.permissionCode
      ? {
          permissionCode:
            details.permissionCode,
        }
      : {}),
    ...(details?.existingDecisionId
      ? {
          existingDecisionId:
            details.existingDecisionId,
        }
      : {}),
    ...(details?.existingDecision
      ? {
          existingDecision:
            details.existingDecision,
        }
      : {}),
    ...(details?.currentRecommendationStatus
      ? {
          currentRecommendationStatus:
            details.currentRecommendationStatus,
        }
      : {}),
    ...(details?.currentInquiryStatus
      ? {
          currentInquiryStatus:
            details.currentInquiryStatus,
        }
      : {}),
    ownerDecisionRecorded: false,
    sandboxExecutionEligible: false,
    sandboxExecutionAuthorized: false,
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
  if (!Array.isArray(value) || value.length > 20) {
    return null;
  }

  const normalized: string[] = [];

  for (const flag of value) {
    const normalizedFlag =
      normalizeRequiredString(flag, 100);

    if (!normalizedFlag) {
      return null;
    }

    if (!normalized.includes(normalizedFlag)) {
      normalized.push(normalizedFlag);
    }
  }

  return normalized;
}

function isDecision(
  value: unknown,
): value is ControlledCustomerOwnerDecision {
  return (
    value === "approve" ||
    value === "reject"
  );
}

function hasStore(
  value: unknown,
): value is ControlledCustomerOwnerDecisionStore {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        decideRecommendation?: unknown;
      }
    ).decideRecommendation === "function"
  );
}

function createRecommendationContentHash(
  input: {
    tenantId: string;
    inquiryId: string;
    recommendationId: string;
    recommendationText: string;
    rationale: string;
    confidence: number;
    riskFlags: readonly string[];
    recommendationInputFingerprint: string;
  },
): string {
  return createHash("sha256")
    .update(
      JSON.stringify(input),
      "utf8",
    )
    .digest("hex");
}

export async function decideControlledCustomerRecommendation(
  input: ControlledCustomerOwnerDecisionInput,
): Promise<ControlledCustomerOwnerDecisionResult> {
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
      "Controlled pilot operation permission was denied before the owner decision.",
      {
        permissionCode:
          permission.code,
      },
    );
  }

  /*
   * Operation roles may include operators, but approval authority
   * remains restricted to the authenticated tenant owner.
   */
  if (!input.identity.roles.includes("owner")) {
    return reject(
      "TENANT_OWNER_ROLE_REQUIRED",
      "Only the authenticated tenant owner may approve or reject a recommendation.",
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

  const decisionReason =
    normalizeRequiredString(
      input?.decisionReason,
      1000,
    );

  const riskFlags =
    normalizeRiskFlags(
      input?.riskFlags,
    );

  const inputFingerprint =
    normalizeRequiredString(
      input?.recommendationInputFingerprint,
      64,
    );

  const decidedAt =
    input?.decidedAt ??
    Math.floor(Date.now() / 1000);

  if (
    !inquiryId ||
    !recommendationId ||
    !recommendationText ||
    !rationale ||
    !decisionReason ||
    !riskFlags ||
    !inputFingerprint ||
    !/^[a-f0-9]{64}$/.test(
      inputFingerprint,
    ) ||
    typeof input?.confidence !== "number" ||
    !Number.isFinite(input.confidence) ||
    input.confidence < 0 ||
    input.confidence > 1 ||
    !isDecision(input?.decision) ||
    !Number.isSafeInteger(decidedAt) ||
    decidedAt < 0 ||
    !hasStore(input?.store)
  ) {
    return reject(
      "INVALID_OWNER_DECISION_INPUT",
      "Owner decision input, recommendation snapshot or persistence store is invalid.",
    );
  }

  const decisionId =
    normalizeRequiredString(
      (
        input.createDecisionId ??
        randomUUID
      )(),
      200,
    );

  if (!decisionId) {
    return reject(
      "INVALID_OWNER_DECISION_INPUT",
      "A valid owner decision identity could not be created.",
    );
  }

  const recommendationContentHash =
    createRecommendationContentHash({
      tenantId: permission.tenantId,
      inquiryId,
      recommendationId,
      recommendationText,
      rationale,
      confidence: input.confidence,
      riskFlags,
      recommendationInputFingerprint:
        inputFingerprint,
    });

  let storeResult:
    ControlledCustomerOwnerDecisionStoreResult;

  try {
    storeResult =
      await input.store.decideRecommendation({
        decisionId,
        tenantId:
          permission.tenantId,
        inquiryId,
        recommendationId,
        ownerId:
          permission.userId,
        sessionId:
          input.identity.sessionId?.trim() ||
          null,
        decision:
          input.decision,
        decisionReason,
        recommendationText,
        rationale,
        confidence:
          input.confidence,
        riskFlags,
        recommendationInputFingerprint:
          inputFingerprint,
        recommendationContentHash,
        decidedAt,
      });
  } catch {
    return reject(
      "OWNER_DECISION_STORE_UNAVAILABLE",
      "Owner decision could not be persistently recorded.",
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
    "inquiry-unavailable"
  ) {
    return reject(
      "INQUIRY_NOT_FOUND",
      "The tenant-bound inquiry does not exist.",
    );
  }

  if (
    storeResult.status ===
    "recommendation-snapshot-conflict"
  ) {
    return reject(
      "RECOMMENDATION_SNAPSHOT_CONFLICT",
      "The submitted recommendation snapshot does not match persistent storage.",
      {
        currentRecommendationStatus:
          storeResult.currentRecommendationStatus,
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
      "The recommendation is no longer awaiting owner review.",
      {
        currentRecommendationStatus:
          storeResult.currentRecommendationStatus,
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
      "The inquiry is no longer awaiting owner review.",
      {
        currentRecommendationStatus:
          storeResult.currentRecommendationStatus,
        currentInquiryStatus:
          storeResult.currentInquiryStatus,
      },
    );
  }

  if (
    storeResult.status ===
    "decision-conflict"
  ) {
    return reject(
      "OWNER_DECISION_CONFLICT",
      "A different owner decision is already bound to this recommendation.",
      {
        existingDecisionId:
          storeResult.existingDecisionId,
        existingDecision:
          storeResult.existingDecision,
        currentRecommendationStatus:
          storeResult.currentRecommendationStatus,
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
      "OWNER_DECISION_STORE_UNAVAILABLE",
      "Owner decision persistence was not confirmed.",
    );
  }

  if (
    storeResult.decision !==
    input.decision
  ) {
    return reject(
      "OWNER_DECISION_CONFLICT",
      "The stored owner decision does not match the requested decision.",
      {
        existingDecisionId:
          storeResult.decisionId,
        existingDecision:
          storeResult.decision,
        currentRecommendationStatus:
          storeResult.recommendationStatus,
        currentInquiryStatus:
          storeResult.inquiryStatus,
      },
    );
  }

  return {
    recorded: true,
    code:
      storeResult.status ===
      "already-decided"
        ? "OWNER_RECOMMENDATION_DECISION_ALREADY_RECORDED"
        : input.decision === "approve"
          ? "OWNER_RECOMMENDATION_APPROVED"
          : "OWNER_RECOMMENDATION_REJECTED",
    tenantId:
      permission.tenantId,
    ownerId:
      permission.userId,
    inquiryId,
    recommendationId,
    decisionId:
      storeResult.decisionId,
    decision:
      storeResult.decision,
    recommendationStatus:
      storeResult.recommendationStatus,
    inquiryStatus:
      storeResult.inquiryStatus,
    recommendationContentHash,
    decidedAt:
      storeResult.decidedAt,
    ownerDecisionRecorded: true,
    sandboxExecutionEligible:
      storeResult.decision === "approve",
    sandboxExecutionAuthorized: false,
    customerDeliveryAuthorized: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
