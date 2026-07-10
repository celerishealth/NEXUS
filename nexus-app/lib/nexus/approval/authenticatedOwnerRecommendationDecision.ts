import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export const OWNER_RECOMMENDATION_DECISIONS = [
  "APPROVED",
  "REJECTED",
] as const;

export type OwnerRecommendationDecision =
  (typeof OWNER_RECOMMENDATION_DECISIONS)[number];

export type RecommendationDecisionReadRecord = Readonly<{
  id: string;
  tenantId: string;
  inquiryId: string;
  status: "DRAFT";
  engineMode: "SANDBOX_ONLY";
}>;

export type RecommendationDecisionReadRepository = Readonly<{
  findRecommendationByTenantAndId: (
    tenantId: string,
    recommendationId: string,
  ) => Promise<RecommendationDecisionReadRecord | null>;
}>;

export type OwnerDecisionPersistenceInput = Readonly<{
  tenantId: string;
  recommendationId: string;
  inquiryId: string;
  ownerUserId: string;
  sourceSessionId: string;
  idempotencyKey: string;
  decision: OwnerRecommendationDecision;
  decisionNote: string;
  recommendationStatus: "APPROVED" | "REJECTED";
  executionStatus:
    | "READY_FOR_SANDBOX"
    | "BLOCKED_BY_OWNER";
  executionMode: "SANDBOX_ONLY";
}>;

export type PersistedOwnerRecommendationDecision =
  Readonly<{
    id: string;
    tenantId: string;
    recommendationId: string;
    inquiryId: string;
    ownerUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    decision: OwnerRecommendationDecision;
    decisionNote: string;
    recommendationStatus: "APPROVED" | "REJECTED";
    executionStatus:
      | "READY_FOR_SANDBOX"
      | "BLOCKED_BY_OWNER";
    executionMode: "SANDBOX_ONLY";
    decidedAt: string;
    createdAt: string;
  }>;

export type OwnerDecisionPersistenceResult = Readonly<{
  outcome: "CREATED" | "EXISTING";
  approval: PersistedOwnerRecommendationDecision;
}>;

export type OwnerRecommendationDecisionRepository =
  Readonly<{
    applyOwnerDecision: (
      input: OwnerDecisionPersistenceInput,
    ) => Promise<OwnerDecisionPersistenceResult>;
  }>;

export type DecideAuthenticatedRecommendationInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    recommendationReadRepository:
      RecommendationDecisionReadRepository;
    decisionRepository:
      OwnerRecommendationDecisionRepository;
    requestedTenantId?: string | null;
    recommendationId: string;
    idempotencyKey: string;
    decision: OwnerRecommendationDecision;
    decisionNote: string;
  }>;

export type AuthenticatedOwnerDecisionResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";

    approval: Readonly<{
      id: string;
      tenantId: string;
      recommendationId: string;
      inquiryId: string;
      decision: OwnerRecommendationDecision;
      decisionNote: string;
      recommendationStatus:
        | "APPROVED"
        | "REJECTED";
      decidedAt: string;
      createdAt: string;
    }>;

    ownerAuthority: Readonly<{
      ownerUserId: string;
      sourceSessionId: string;
      role: "OWNER";
      explicitlyAuthorized: true;
    }>;

    executionBoundary: Readonly<{
      eligibleForSandboxExecution: boolean;
      executionStatus:
        | "READY_FOR_SANDBOX"
        | "BLOCKED_BY_OWNER";
      executionStarted: false;
      executionMode: "SANDBOX_ONLY";
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;
  }>;

export type OwnerRecommendationDecisionFailureCode =
  | "RECOMMENDATION_DECISION_READ_REPOSITORY_MISCONFIGURED"
  | "OWNER_DECISION_REPOSITORY_MISCONFIGURED"
  | "OWNER_DECISION_RECOMMENDATION_ID_REQUIRED"
  | "OWNER_DECISION_IDEMPOTENCY_KEY_REQUIRED"
  | "OWNER_DECISION_IDEMPOTENCY_KEY_INVALID"
  | "OWNER_DECISION_VALUE_INVALID"
  | "OWNER_DECISION_NOTE_REQUIRED"
  | "OWNER_DECISION_NOTE_INVALID"
  | "OWNER_DECISION_RECOMMENDATION_NOT_AVAILABLE"
  | "OWNER_DECISION_RECOMMENDATION_TENANT_MISMATCH"
  | "OWNER_DECISION_RECOMMENDATION_STATUS_INVALID"
  | "OWNER_DECISION_RECOMMENDATION_ENGINE_MODE_INVALID"
  | "OWNER_DECISION_PERSISTENCE_RESULT_INVALID"
  | "OWNER_DECISION_PERSISTED_ID_REQUIRED"
  | "OWNER_DECISION_PERSISTED_TENANT_MISMATCH"
  | "OWNER_DECISION_PERSISTED_RECOMMENDATION_MISMATCH"
  | "OWNER_DECISION_PERSISTED_INQUIRY_MISMATCH"
  | "OWNER_DECISION_PERSISTED_OWNER_MISMATCH"
  | "OWNER_DECISION_PERSISTED_SESSION_MISMATCH"
  | "OWNER_DECISION_PERSISTED_IDEMPOTENCY_MISMATCH"
  | "OWNER_DECISION_PERSISTED_VALUE_MISMATCH"
  | "OWNER_DECISION_PERSISTED_STATUS_INVALID"
  | "OWNER_DECISION_PERSISTED_EXECUTION_STATUS_INVALID"
  | "OWNER_DECISION_PERSISTED_EXECUTION_MODE_INVALID"
  | "OWNER_DECISION_PERSISTED_DECIDED_AT_INVALID"
  | "OWNER_DECISION_PERSISTED_CREATED_AT_INVALID";

export class OwnerRecommendationDecisionDeniedError
  extends Error {
  readonly code:
    OwnerRecommendationDecisionFailureCode;

  readonly status: number;

  constructor(
    code: OwnerRecommendationDecisionFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name =
      "OwnerRecommendationDecisionDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: OwnerRecommendationDecisionFailureCode,
  message: string,
  status = 403,
): never {
  throw new OwnerRecommendationDecisionDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: OwnerRecommendationDecisionFailureCode,
  message: string,
  minimumLength = 1,
  maximumLength = 1000,
): string {
  if (typeof value !== "string") {
    deny(code, message, 400);
  }

  const normalized = value.trim();

  if (
    normalized.length < minimumLength ||
    normalized.length > maximumLength
  ) {
    deny(code, message, 400);
  }

  return normalized;
}

function normalizeIdempotencyKey(
  value: unknown,
): string {
  const normalized = requireText(
    value,
    "OWNER_DECISION_IDEMPOTENCY_KEY_REQUIRED",
    "An owner-decision idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "OWNER_DECISION_IDEMPOTENCY_KEY_INVALID",
      "The owner-decision idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function isOwnerDecision(
  value: unknown,
): value is OwnerRecommendationDecision {
  return (
    typeof value === "string" &&
    OWNER_RECOMMENDATION_DECISIONS.includes(
      value as OwnerRecommendationDecision,
    )
  );
}

function requireValidDate(
  value: unknown,
  code: OwnerRecommendationDecisionFailureCode,
  message: string,
): string {
  const normalized = requireText(
    value,
    code,
    message,
    1,
    64,
  );

  if (Number.isNaN(Date.parse(normalized))) {
    deny(code, message, 500);
  }

  return normalized;
}

function freezeResult(
  result: AuthenticatedOwnerDecisionResult,
): AuthenticatedOwnerDecisionResult {
  Object.freeze(result.approval);
  Object.freeze(result.ownerAuthority);
  Object.freeze(result.executionBoundary);

  return Object.freeze(result);
}

/**
 * Applies an authenticated tenant-owner decision to one AI recommendation.
 *
 * Safety properties:
 * - requires authenticated OWNER authority;
 * - tenant identity comes only from authenticated context;
 * - recommendation must belong to the same tenant;
 * - only DRAFT sandbox recommendations may be decided;
 * - decision persistence and status transition are repository-atomic;
 * - approval only enables future sandbox execution;
 * - rejection blocks execution;
 * - no execution or live-provider call occurs here.
 */
export async function decideAuthenticatedRecommendation(
  input: DecideAuthenticatedRecommendationInput,
): Promise<AuthenticatedOwnerDecisionResult> {
  const workspace =
    await buildAuthenticatedTenantWorkspace({
      principal: input.principal,
      accessRepositories: input.accessRepositories,
      workspaceRepository: input.workspaceRepository,
      requestedTenantId: input.requestedTenantId,
      requireOwner: true,
    });

  if (
    !input.recommendationReadRepository ||
    typeof input.recommendationReadRepository
      .findRecommendationByTenantAndId !== "function"
  ) {
    deny(
      "RECOMMENDATION_DECISION_READ_REPOSITORY_MISCONFIGURED",
      "Recommendation decision read repository is not safely configured.",
      500,
    );
  }

  if (
    !input.decisionRepository ||
    typeof input.decisionRepository
      .applyOwnerDecision !== "function"
  ) {
    deny(
      "OWNER_DECISION_REPOSITORY_MISCONFIGURED",
      "Owner decision repository is not safely configured.",
      500,
    );
  }

  const recommendationId = requireText(
    input.recommendationId,
    "OWNER_DECISION_RECOMMENDATION_ID_REQUIRED",
    "Recommendation identity is required.",
    1,
    128,
  );

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  if (!isOwnerDecision(input.decision)) {
    deny(
      "OWNER_DECISION_VALUE_INVALID",
      "Owner decision must be APPROVED or REJECTED.",
      400,
    );
  }

  const decisionNote = requireText(
    input.decisionNote,
    "OWNER_DECISION_NOTE_REQUIRED",
    "An owner decision note is required.",
    5,
    1000,
  );

  const recommendation =
    await input.recommendationReadRepository
      .findRecommendationByTenantAndId(
        workspace.tenant.id,
        recommendationId,
      );

  if (!recommendation) {
    deny(
      "OWNER_DECISION_RECOMMENDATION_NOT_AVAILABLE",
      "The recommendation is not available to this tenant.",
    );
  }

  if (
    recommendation.tenantId !== workspace.tenant.id ||
    recommendation.id !== recommendationId
  ) {
    deny(
      "OWNER_DECISION_RECOMMENDATION_TENANT_MISMATCH",
      "The recommendation does not match the authenticated tenant.",
    );
  }

  if (recommendation.status !== "DRAFT") {
    deny(
      "OWNER_DECISION_RECOMMENDATION_STATUS_INVALID",
      "Only draft recommendations may receive an owner decision.",
    );
  }

  if (
    recommendation.engineMode !== "SANDBOX_ONLY"
  ) {
    deny(
      "OWNER_DECISION_RECOMMENDATION_ENGINE_MODE_INVALID",
      "Only sandbox recommendations may receive an owner decision.",
    );
  }

  const recommendationStatus =
    input.decision === "APPROVED"
      ? "APPROVED"
      : "REJECTED";

  const executionStatus =
    input.decision === "APPROVED"
      ? "READY_FOR_SANDBOX"
      : "BLOCKED_BY_OWNER";

  const persisted =
    await input.decisionRepository.applyOwnerDecision({
      tenantId: workspace.tenant.id,
      recommendationId,
      inquiryId: recommendation.inquiryId,
      ownerUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      idempotencyKey,
      decision: input.decision,
      decisionNote,
      recommendationStatus,
      executionStatus,
      executionMode: "SANDBOX_ONLY",
    });

  if (
    !persisted ||
    (
      persisted.outcome !== "CREATED" &&
      persisted.outcome !== "EXISTING"
    ) ||
    !persisted.approval
  ) {
    deny(
      "OWNER_DECISION_PERSISTENCE_RESULT_INVALID",
      "Owner decision persistence returned an invalid result.",
      500,
    );
  }

  const approval = persisted.approval;

  const approvalId = requireText(
    approval.id,
    "OWNER_DECISION_PERSISTED_ID_REQUIRED",
    "Persisted owner decision identity is required.",
    1,
    128,
  );

  if (approval.tenantId !== workspace.tenant.id) {
    deny(
      "OWNER_DECISION_PERSISTED_TENANT_MISMATCH",
      "Persisted owner decision tenant identity is invalid.",
      500,
    );
  }

  if (
    approval.recommendationId !== recommendationId
  ) {
    deny(
      "OWNER_DECISION_PERSISTED_RECOMMENDATION_MISMATCH",
      "Persisted recommendation identity is invalid.",
      500,
    );
  }

  if (
    approval.inquiryId !== recommendation.inquiryId
  ) {
    deny(
      "OWNER_DECISION_PERSISTED_INQUIRY_MISMATCH",
      "Persisted inquiry identity is invalid.",
      500,
    );
  }

  if (
    approval.ownerUserId !== workspace.actor.userId
  ) {
    deny(
      "OWNER_DECISION_PERSISTED_OWNER_MISMATCH",
      "Persisted owner identity is invalid.",
      500,
    );
  }

  if (
    approval.sourceSessionId !==
    workspace.actor.sessionId
  ) {
    deny(
      "OWNER_DECISION_PERSISTED_SESSION_MISMATCH",
      "Persisted owner session identity is invalid.",
      500,
    );
  }

  if (approval.idempotencyKey !== idempotencyKey) {
    deny(
      "OWNER_DECISION_PERSISTED_IDEMPOTENCY_MISMATCH",
      "Persisted owner decision idempotency identity is invalid.",
      500,
    );
  }

  if (approval.decision !== input.decision) {
    deny(
      "OWNER_DECISION_PERSISTED_VALUE_MISMATCH",
      "Persisted owner decision value is invalid.",
      500,
    );
  }

  if (
    approval.recommendationStatus !==
    recommendationStatus
  ) {
    deny(
      "OWNER_DECISION_PERSISTED_STATUS_INVALID",
      "Persisted recommendation status is invalid.",
      500,
    );
  }

  if (
    approval.executionStatus !== executionStatus
  ) {
    deny(
      "OWNER_DECISION_PERSISTED_EXECUTION_STATUS_INVALID",
      "Persisted execution status is invalid.",
      500,
    );
  }

  if (approval.executionMode !== "SANDBOX_ONLY") {
    deny(
      "OWNER_DECISION_PERSISTED_EXECUTION_MODE_INVALID",
      "Persisted execution mode is invalid.",
      500,
    );
  }

  const decidedAt = requireValidDate(
    approval.decidedAt,
    "OWNER_DECISION_PERSISTED_DECIDED_AT_INVALID",
    "Persisted owner decision time is invalid.",
  );

  const createdAt = requireValidDate(
    approval.createdAt,
    "OWNER_DECISION_PERSISTED_CREATED_AT_INVALID",
    "Persisted owner decision creation time is invalid.",
  );

  return freezeResult({
    outcome: persisted.outcome,

    approval: {
      id: approvalId,
      tenantId: workspace.tenant.id,
      recommendationId,
      inquiryId: recommendation.inquiryId,
      decision: approval.decision,
      decisionNote: approval.decisionNote,
      recommendationStatus:
        approval.recommendationStatus,
      decidedAt,
      createdAt,
    },

    ownerAuthority: {
      ownerUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: "OWNER",
      explicitlyAuthorized: true,
    },

    executionBoundary: {
      eligibleForSandboxExecution:
        input.decision === "APPROVED",
      executionStatus,
      executionStarted: false,
      executionMode: "SANDBOX_ONLY",
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
  });
}
