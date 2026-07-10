import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export const RECOMMENDATION_RISK_LEVELS = [
  "LOW",
  "MEDIUM",
  "HIGH",
] as const;

export type RecommendationRiskLevel =
  (typeof RECOMMENDATION_RISK_LEVELS)[number];

export type InquiryForRecommendation = Readonly<{
  id: string;
  tenantId: string;
  customerName: string;
  message: string;
  status: "NEW";
}>;

export type InquiryRecommendationReadRepository = Readonly<{
  findInquiryByTenantAndId: (
    tenantId: string,
    inquiryId: string,
  ) => Promise<InquiryForRecommendation | null>;
}>;

export type SandboxRecommendationEngineInput = Readonly<{
  tenantId: string;
  inquiryId: string;
  businessName: string;
  customerName: string;
  customerMessage: string;
  timezone: string;
  locale: string;
  executionMode: "SANDBOX_ONLY";
}>;

export type SandboxRecommendationEngineOutput = Readonly<{
  title: string;
  summary: string;
  recommendedAction: string;
  rationale: string;
  confidence: number;
  riskLevel: RecommendationRiskLevel;
  generatedAt: string;
}>;

export type SandboxRecommendationEngine = Readonly<{
  mode: "SANDBOX_ONLY";

  generateRecommendation: (
    input: SandboxRecommendationEngineInput,
  ) => Promise<SandboxRecommendationEngineOutput>;
}>;

export type RecommendationPersistenceInput = Readonly<{
  tenantId: string;
  inquiryId: string;
  generatedByUserId: string;
  sourceSessionId: string;
  idempotencyKey: string;
  title: string;
  summary: string;
  recommendedAction: string;
  rationale: string;
  confidence: number;
  riskLevel: RecommendationRiskLevel;
  status: "DRAFT";
  engineMode: "SANDBOX_ONLY";
  generatedAt: string;
}>;

export type PersistedInquiryRecommendation = Readonly<{
  id: string;
  tenantId: string;
  inquiryId: string;
  generatedByUserId: string;
  sourceSessionId: string;
  idempotencyKey: string;
  title: string;
  summary: string;
  recommendedAction: string;
  rationale: string;
  confidence: number;
  riskLevel: RecommendationRiskLevel;
  status: "DRAFT";
  engineMode: "SANDBOX_ONLY";
  generatedAt: string;
  createdAt: string;
}>;

export type RecommendationPersistenceResult = Readonly<{
  outcome: "CREATED" | "EXISTING";
  recommendation: PersistedInquiryRecommendation;
}>;

export type InquiryRecommendationRepository = Readonly<{
  createOrGetRecommendation: (
    input: RecommendationPersistenceInput,
  ) => Promise<RecommendationPersistenceResult>;
}>;

export type GenerateAuthenticatedInquiryRecommendationInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    inquiryRepository: InquiryRecommendationReadRepository;
    recommendationRepository: InquiryRecommendationRepository;
    recommendationEngine: SandboxRecommendationEngine;
    requestedTenantId?: string | null;
    inquiryId: string;
    idempotencyKey: string;
  }>;

export type AuthenticatedInquiryRecommendationResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";

    recommendation: Readonly<{
      id: string;
      tenantId: string;
      inquiryId: string;
      title: string;
      summary: string;
      recommendedAction: string;
      rationale: string;
      confidence: number;
      riskLevel: RecommendationRiskLevel;
      status: "DRAFT";
      generatedAt: string;
      createdAt: string;
    }>;

    generationAuthority: Readonly<{
      generatedByUserId: string;
      sourceSessionId: string;
      role: "OWNER" | "ADMIN" | "OPERATOR";
    }>;

    approvalBoundary: Readonly<{
      ownerApprovalStatus: "REQUIRED";
      executionStatus: "NOT_STARTED";
      executionMode: "SANDBOX_ONLY";
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;
  }>;

export type InquiryRecommendationFailureCode =
  | "RECOMMENDATION_ROLE_NOT_AUTHORIZED"
  | "INQUIRY_READ_REPOSITORY_MISCONFIGURED"
  | "RECOMMENDATION_REPOSITORY_MISCONFIGURED"
  | "RECOMMENDATION_ENGINE_MISCONFIGURED"
  | "LIVE_RECOMMENDATION_ENGINE_NOT_AUTHORIZED"
  | "RECOMMENDATION_INQUIRY_ID_REQUIRED"
  | "RECOMMENDATION_IDEMPOTENCY_KEY_REQUIRED"
  | "RECOMMENDATION_IDEMPOTENCY_KEY_INVALID"
  | "RECOMMENDATION_INQUIRY_NOT_AVAILABLE"
  | "RECOMMENDATION_INQUIRY_TENANT_MISMATCH"
  | "RECOMMENDATION_INQUIRY_STATUS_INVALID"
  | "RECOMMENDATION_ENGINE_OUTPUT_INVALID"
  | "RECOMMENDATION_TITLE_INVALID"
  | "RECOMMENDATION_SUMMARY_INVALID"
  | "RECOMMENDATION_ACTION_INVALID"
  | "RECOMMENDATION_RATIONALE_INVALID"
  | "RECOMMENDATION_CONFIDENCE_INVALID"
  | "RECOMMENDATION_RISK_LEVEL_INVALID"
  | "RECOMMENDATION_GENERATED_AT_INVALID"
  | "RECOMMENDATION_PERSISTENCE_RESULT_INVALID"
  | "RECOMMENDATION_PERSISTED_ID_REQUIRED"
  | "RECOMMENDATION_PERSISTED_TENANT_MISMATCH"
  | "RECOMMENDATION_PERSISTED_INQUIRY_MISMATCH"
  | "RECOMMENDATION_PERSISTED_ACTOR_MISMATCH"
  | "RECOMMENDATION_PERSISTED_SESSION_MISMATCH"
  | "RECOMMENDATION_PERSISTED_IDEMPOTENCY_MISMATCH"
  | "RECOMMENDATION_PERSISTED_STATUS_INVALID"
  | "RECOMMENDATION_PERSISTED_ENGINE_MODE_INVALID"
  | "RECOMMENDATION_PERSISTED_CREATED_AT_INVALID";

export class InquiryRecommendationDeniedError extends Error {
  readonly code: InquiryRecommendationFailureCode;
  readonly status: number;

  constructor(
    code: InquiryRecommendationFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name = "InquiryRecommendationDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: InquiryRecommendationFailureCode,
  message: string,
  status = 403,
): never {
  throw new InquiryRecommendationDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: InquiryRecommendationFailureCode,
  message: string,
  minimumLength = 1,
  maximumLength = 4000,
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

function normalizeIdempotencyKey(value: unknown): string {
  const normalized = requireText(
    value,
    "RECOMMENDATION_IDEMPOTENCY_KEY_REQUIRED",
    "A recommendation idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "RECOMMENDATION_IDEMPOTENCY_KEY_INVALID",
      "The recommendation idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function isRiskLevel(
  value: unknown,
): value is RecommendationRiskLevel {
  return (
    typeof value === "string" &&
    RECOMMENDATION_RISK_LEVELS.includes(
      value as RecommendationRiskLevel,
    )
  );
}

function requireValidDate(
  value: unknown,
  code: InquiryRecommendationFailureCode,
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
  result: AuthenticatedInquiryRecommendationResult,
): AuthenticatedInquiryRecommendationResult {
  Object.freeze(result.recommendation);
  Object.freeze(result.generationAuthority);
  Object.freeze(result.approvalBoundary);

  return Object.freeze(result);
}

/**
 * Generates one structured AI recommendation for a tenant inquiry.
 *
 * Safety properties:
 * - tenant identity comes only from authenticated workspace context;
 * - cross-tenant inquiry reads are rejected;
 * - VIEWER members cannot generate recommendations;
 * - only SANDBOX_ONLY recommendation engines are accepted;
 * - model output is validated before persistence;
 * - persisted tenant, inquiry, actor and session identities are verified;
 * - generated recommendations remain DRAFT;
 * - owner approval is mandatory before any execution.
 */
export async function generateAuthenticatedInquiryRecommendation(
  input: GenerateAuthenticatedInquiryRecommendationInput,
): Promise<AuthenticatedInquiryRecommendationResult> {
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
      "RECOMMENDATION_ROLE_NOT_AUTHORIZED",
      "Viewer membership cannot generate AI recommendations.",
    );
  }

  if (
    !input.inquiryRepository ||
    typeof input.inquiryRepository
      .findInquiryByTenantAndId !== "function"
  ) {
    deny(
      "INQUIRY_READ_REPOSITORY_MISCONFIGURED",
      "Inquiry read repository is not safely configured.",
      500,
    );
  }

  if (
    !input.recommendationRepository ||
    typeof input.recommendationRepository
      .createOrGetRecommendation !== "function"
  ) {
    deny(
      "RECOMMENDATION_REPOSITORY_MISCONFIGURED",
      "Recommendation repository is not safely configured.",
      500,
    );
  }

  if (
    !input.recommendationEngine ||
    typeof input.recommendationEngine
      .generateRecommendation !== "function"
  ) {
    deny(
      "RECOMMENDATION_ENGINE_MISCONFIGURED",
      "Recommendation engine is not safely configured.",
      500,
    );
  }

  if (input.recommendationEngine.mode !== "SANDBOX_ONLY") {
    deny(
      "LIVE_RECOMMENDATION_ENGINE_NOT_AUTHORIZED",
      "Live recommendation-provider execution is not authorized.",
    );
  }

  const inquiryId = requireText(
    input.inquiryId,
    "RECOMMENDATION_INQUIRY_ID_REQUIRED",
    "Customer inquiry identity is required.",
    1,
    128,
  );

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  const inquiry =
    await input.inquiryRepository
      .findInquiryByTenantAndId(
        workspace.tenant.id,
        inquiryId,
      );

  if (!inquiry) {
    deny(
      "RECOMMENDATION_INQUIRY_NOT_AVAILABLE",
      "The customer inquiry is not available to this tenant.",
    );
  }

  if (
    inquiry.tenantId !== workspace.tenant.id ||
    inquiry.id !== inquiryId
  ) {
    deny(
      "RECOMMENDATION_INQUIRY_TENANT_MISMATCH",
      "The customer inquiry does not match the authenticated tenant.",
    );
  }

  if (inquiry.status !== "NEW") {
    deny(
      "RECOMMENDATION_INQUIRY_STATUS_INVALID",
      "The customer inquiry is not eligible for recommendation generation.",
    );
  }

  const customerName = requireText(
    inquiry.customerName,
    "RECOMMENDATION_ENGINE_OUTPUT_INVALID",
    "Customer inquiry name is invalid.",
    1,
    120,
  );

  const customerMessage = requireText(
    inquiry.message,
    "RECOMMENDATION_ENGINE_OUTPUT_INVALID",
    "Customer inquiry message is invalid.",
    1,
    4000,
  );

  const generated =
    await input.recommendationEngine
      .generateRecommendation({
        tenantId: workspace.tenant.id,
        inquiryId,
        businessName: workspace.tenant.businessName,
        customerName,
        customerMessage,
        timezone: workspace.tenant.timezone,
        locale: workspace.tenant.locale,
        executionMode: "SANDBOX_ONLY",
      });

  if (!generated || typeof generated !== "object") {
    deny(
      "RECOMMENDATION_ENGINE_OUTPUT_INVALID",
      "The sandbox AI engine returned an invalid recommendation.",
      500,
    );
  }

  const title = requireText(
    generated.title,
    "RECOMMENDATION_TITLE_INVALID",
    "Recommendation title is invalid.",
    3,
    160,
  );

  const summary = requireText(
    generated.summary,
    "RECOMMENDATION_SUMMARY_INVALID",
    "Recommendation summary is invalid.",
    10,
    1000,
  );

  const recommendedAction = requireText(
    generated.recommendedAction,
    "RECOMMENDATION_ACTION_INVALID",
    "Recommended action is invalid.",
    5,
    2000,
  );

  const rationale = requireText(
    generated.rationale,
    "RECOMMENDATION_RATIONALE_INVALID",
    "Recommendation rationale is invalid.",
    10,
    2000,
  );

  if (
    typeof generated.confidence !== "number" ||
    !Number.isFinite(generated.confidence) ||
    !Number.isInteger(generated.confidence) ||
    generated.confidence < 0 ||
    generated.confidence > 100
  ) {
    deny(
      "RECOMMENDATION_CONFIDENCE_INVALID",
      "Recommendation confidence must be an integer from 0 to 100.",
      500,
    );
  }

  if (!isRiskLevel(generated.riskLevel)) {
    deny(
      "RECOMMENDATION_RISK_LEVEL_INVALID",
      "Recommendation risk level is invalid.",
      500,
    );
  }

  const generatedAt = requireValidDate(
    generated.generatedAt,
    "RECOMMENDATION_GENERATED_AT_INVALID",
    "Recommendation generation time is invalid.",
  );

  const persisted =
    await input.recommendationRepository
      .createOrGetRecommendation({
        tenantId: workspace.tenant.id,
        inquiryId,
        generatedByUserId: workspace.actor.userId,
        sourceSessionId: workspace.actor.sessionId,
        idempotencyKey,
        title,
        summary,
        recommendedAction,
        rationale,
        confidence: generated.confidence,
        riskLevel: generated.riskLevel,
        status: "DRAFT",
        engineMode: "SANDBOX_ONLY",
        generatedAt,
      });

  if (
    !persisted ||
    (
      persisted.outcome !== "CREATED" &&
      persisted.outcome !== "EXISTING"
    ) ||
    !persisted.recommendation
  ) {
    deny(
      "RECOMMENDATION_PERSISTENCE_RESULT_INVALID",
      "Recommendation persistence returned an invalid result.",
      500,
    );
  }

  const recommendation = persisted.recommendation;

  const recommendationId = requireText(
    recommendation.id,
    "RECOMMENDATION_PERSISTED_ID_REQUIRED",
    "Persisted recommendation identity is required.",
    1,
    128,
  );

  if (recommendation.tenantId !== workspace.tenant.id) {
    deny(
      "RECOMMENDATION_PERSISTED_TENANT_MISMATCH",
      "Persisted recommendation tenant identity is invalid.",
      500,
    );
  }

  if (recommendation.inquiryId !== inquiryId) {
    deny(
      "RECOMMENDATION_PERSISTED_INQUIRY_MISMATCH",
      "Persisted recommendation inquiry identity is invalid.",
      500,
    );
  }

  if (
    recommendation.generatedByUserId !==
    workspace.actor.userId
  ) {
    deny(
      "RECOMMENDATION_PERSISTED_ACTOR_MISMATCH",
      "Persisted recommendation actor identity is invalid.",
      500,
    );
  }

  if (
    recommendation.sourceSessionId !==
    workspace.actor.sessionId
  ) {
    deny(
      "RECOMMENDATION_PERSISTED_SESSION_MISMATCH",
      "Persisted recommendation session identity is invalid.",
      500,
    );
  }

  if (recommendation.idempotencyKey !== idempotencyKey) {
    deny(
      "RECOMMENDATION_PERSISTED_IDEMPOTENCY_MISMATCH",
      "Persisted recommendation idempotency identity is invalid.",
      500,
    );
  }

  if (recommendation.status !== "DRAFT") {
    deny(
      "RECOMMENDATION_PERSISTED_STATUS_INVALID",
      "Persisted recommendation status is invalid.",
      500,
    );
  }

  if (recommendation.engineMode !== "SANDBOX_ONLY") {
    deny(
      "RECOMMENDATION_PERSISTED_ENGINE_MODE_INVALID",
      "Persisted recommendation engine mode is invalid.",
      500,
    );
  }

  const createdAt = requireValidDate(
    recommendation.createdAt,
    "RECOMMENDATION_PERSISTED_CREATED_AT_INVALID",
    "Persisted recommendation creation time is invalid.",
  );

  return freezeResult({
    outcome: persisted.outcome,

    recommendation: {
      id: recommendationId,
      tenantId: workspace.tenant.id,
      inquiryId,
      title: recommendation.title,
      summary: recommendation.summary,
      recommendedAction:
        recommendation.recommendedAction,
      rationale: recommendation.rationale,
      confidence: recommendation.confidence,
      riskLevel: recommendation.riskLevel,
      status: recommendation.status,
      generatedAt: recommendation.generatedAt,
      createdAt,
    },

    generationAuthority: {
      generatedByUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: workspace.actor.role,
    },

    approvalBoundary: {
      ownerApprovalStatus: "REQUIRED",
      executionStatus: "NOT_STARTED",
      executionMode: "SANDBOX_ONLY",
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
  });
}
