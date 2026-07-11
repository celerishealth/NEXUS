export type LifecycleActorRole = "owner" | "customer";

export interface AuthenticatedLifecycleContext {
  authenticated: boolean;
  tenantId: string | null;
  actorId: string | null;
  role: LifecycleActorRole;
}

export interface PersistedCustomerInquiry {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  assignedOwnerId: string;
  status: "received";
  createdAt: string;
  updatedAt: string;
}

export interface PersistedSandboxRecommendation {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  ownerId: string;
  recommendationId: string;
  status: "generated";
  publicSummary: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersistedOwnerDecision {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  ownerId: string;
  recommendationId: string;
  decisionId: string;
  decision: "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface PersistedSandboxExecution {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  ownerId: string;
  decisionId: string;
  executionId: string;
  state: "executing" | "succeeded" | "failed";
  failureCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PersistedCustomerResultRelease {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  ownerId: string;
  executionId: string;
  releaseId: string;
  status: "released";
  result: {
    summary: string;
    recommendation: string | null;
    nextStep: string | null;
    reference: string | null;
    status: "completed";
    mode: "sandbox";
  };
  createdAt: string;
  updatedAt: string;
}

export interface PersistedCustomerAcknowledgement {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  executionId: string;
  releaseId: string;
  acknowledgementId: string;
  status: "acknowledged";
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInquiryLifecycleBundle {
  inquiry: PersistedCustomerInquiry;
  recommendation: PersistedSandboxRecommendation | null;
  decision: PersistedOwnerDecision | null;
  execution: PersistedSandboxExecution | null;
  release: PersistedCustomerResultRelease | null;
  acknowledgement: PersistedCustomerAcknowledgement | null;
}

export interface CustomerInquiryLifecycleRepository {
  loadLifecycle(input: {
    tenantId: string;
    inquiryId: string;
  }): Promise<CustomerInquiryLifecycleBundle | null>;
}

export type CustomerInquiryLifecycleStatus =
  | "inquiry_received"
  | "recommendation_ready"
  | "owner_approved"
  | "owner_rejected"
  | "sandbox_executing"
  | "sandbox_failed"
  | "sandbox_succeeded"
  | "result_released"
  | "customer_acknowledged";

export interface CustomerSafeReleasedResult {
  summary: string;
  recommendation: string | null;
  nextStep: string | null;
  reference: string | null;
  status: "completed";
  mode: "sandbox";
}

export interface CustomerInquiryLifecycleView {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  role: LifecycleActorRole;
  status: CustomerInquiryLifecycleStatus;
  version: string;
  recommendationSummary: string | null;
  ownerDecision: "approved" | "rejected" | null;
  executionId: string | null;
  releaseId: string | null;
  acknowledgementId: string | null;
  result: CustomerSafeReleasedResult | null;
  failureCode: string | null;
  updatedAt: string;
}

export type CustomerInquiryLifecycleErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_CONTEXT"
  | "CROSS_TENANT_ACCESS"
  | "INVALID_REQUEST"
  | "LIFECYCLE_NOT_FOUND"
  | "INVALID_LIFECYCLE_RECORD"
  | "ACTOR_ACCESS_DENIED"
  | "LIFECYCLE_REFERENCE_MISMATCH"
  | "INVALID_LIFECYCLE_ORDER";

export class CustomerInquiryLifecycleError extends Error {
  readonly code: CustomerInquiryLifecycleErrorCode;

  constructor(
    code: CustomerInquiryLifecycleErrorCode,
    message = "Inquiry lifecycle access denied.",
  ) {
    super(message);
    this.name = "CustomerInquiryLifecycleError";
    this.code = code;
  }
}

function requireString(
  value: string | null | undefined,
  code: CustomerInquiryLifecycleErrorCode,
  maximumLength = 512,
): string {
  const normalized = value?.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new CustomerInquiryLifecycleError(code);
  }

  return normalized;
}

function requireTimestamp(value: string): string {
  const normalized = requireString(
    value,
    "INVALID_LIFECYCLE_RECORD",
  );

  if (Number.isNaN(Date.parse(normalized))) {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  return normalized;
}

function assertReference(
  actual: string,
  expected: string,
): void {
  if (actual !== expected) {
    throw new CustomerInquiryLifecycleError(
      "LIFECYCLE_REFERENCE_MISMATCH",
    );
  }
}

function createStableVersion(source: string): string {
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `clv1_${(hash >>> 0)
    .toString(16)
    .padStart(8, "0")}`;
}

function sanitizeFailureCode(value: string | null): string {
  const normalized = value
    ?.trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_:-]/g, "_")
    .slice(0, 64);

  return normalized || "SANDBOX_EXECUTION_FAILED";
}

function validateOptionalResultString(
  value: string | null,
  maximumLength: number,
): string | null {
  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  const normalized = value.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  return normalized;
}

function projectReleasedResult(
  release: PersistedCustomerResultRelease,
): CustomerSafeReleasedResult {
  const summary = requireString(
    release.result.summary,
    "INVALID_LIFECYCLE_RECORD",
    2000,
  );

  if (
    release.result.status !== "completed" ||
    release.result.mode !== "sandbox"
  ) {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  return {
    summary,
    recommendation: validateOptionalResultString(
      release.result.recommendation,
      2000,
    ),
    nextStep: validateOptionalResultString(
      release.result.nextStep,
      2000,
    ),
    reference: validateOptionalResultString(
      release.result.reference,
      256,
    ),
    status: "completed",
    mode: "sandbox",
  };
}

function validateLifecycle(
  bundle: CustomerInquiryLifecycleBundle,
): {
  status: CustomerInquiryLifecycleStatus;
  updatedAt: string;
  result: CustomerSafeReleasedResult | null;
} {
  const inquiry = bundle.inquiry;

  requireString(
    inquiry.tenantId,
    "INVALID_LIFECYCLE_RECORD",
  );
  requireString(
    inquiry.inquiryId,
    "INVALID_LIFECYCLE_RECORD",
  );
  requireString(
    inquiry.customerId,
    "INVALID_LIFECYCLE_RECORD",
  );
  requireString(
    inquiry.assignedOwnerId,
    "INVALID_LIFECYCLE_RECORD",
  );

  if (inquiry.status !== "received") {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  requireTimestamp(inquiry.createdAt);
  let updatedAt = requireTimestamp(inquiry.updatedAt);

  if (!bundle.recommendation) {
    if (
      bundle.decision ||
      bundle.execution ||
      bundle.release ||
      bundle.acknowledgement
    ) {
      throw new CustomerInquiryLifecycleError(
        "INVALID_LIFECYCLE_ORDER",
      );
    }

    return {
      status: "inquiry_received",
      updatedAt,
      result: null,
    };
  }

  const recommendation = bundle.recommendation;

  assertReference(recommendation.tenantId, inquiry.tenantId);
  assertReference(recommendation.inquiryId, inquiry.inquiryId);
  assertReference(recommendation.customerId, inquiry.customerId);
  assertReference(
    recommendation.ownerId,
    inquiry.assignedOwnerId,
  );

  requireString(
    recommendation.recommendationId,
    "INVALID_LIFECYCLE_RECORD",
  );
  requireString(
    recommendation.publicSummary,
    "INVALID_LIFECYCLE_RECORD",
    2000,
  );

  if (recommendation.status !== "generated") {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  requireTimestamp(recommendation.createdAt);
  updatedAt = requireTimestamp(recommendation.updatedAt);

  if (!bundle.decision) {
    if (
      bundle.execution ||
      bundle.release ||
      bundle.acknowledgement
    ) {
      throw new CustomerInquiryLifecycleError(
        "INVALID_LIFECYCLE_ORDER",
      );
    }

    return {
      status: "recommendation_ready",
      updatedAt,
      result: null,
    };
  }

  const decision = bundle.decision;

  assertReference(decision.tenantId, inquiry.tenantId);
  assertReference(decision.inquiryId, inquiry.inquiryId);
  assertReference(decision.customerId, inquiry.customerId);
  assertReference(decision.ownerId, inquiry.assignedOwnerId);
  assertReference(
    decision.recommendationId,
    recommendation.recommendationId,
  );

  requireString(
    decision.decisionId,
    "INVALID_LIFECYCLE_RECORD",
  );

  if (
    decision.decision !== "approved" &&
    decision.decision !== "rejected"
  ) {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  requireTimestamp(decision.createdAt);
  updatedAt = requireTimestamp(decision.updatedAt);

  if (decision.decision === "rejected") {
    if (
      bundle.execution ||
      bundle.release ||
      bundle.acknowledgement
    ) {
      throw new CustomerInquiryLifecycleError(
        "INVALID_LIFECYCLE_ORDER",
      );
    }

    return {
      status: "owner_rejected",
      updatedAt,
      result: null,
    };
  }

  if (!bundle.execution) {
    if (bundle.release || bundle.acknowledgement) {
      throw new CustomerInquiryLifecycleError(
        "INVALID_LIFECYCLE_ORDER",
      );
    }

    return {
      status: "owner_approved",
      updatedAt,
      result: null,
    };
  }

  const execution = bundle.execution;

  assertReference(execution.tenantId, inquiry.tenantId);
  assertReference(execution.inquiryId, inquiry.inquiryId);
  assertReference(execution.customerId, inquiry.customerId);
  assertReference(execution.ownerId, inquiry.assignedOwnerId);
  assertReference(execution.decisionId, decision.decisionId);

  requireString(
    execution.executionId,
    "INVALID_LIFECYCLE_RECORD",
  );

  if (
    execution.state !== "executing" &&
    execution.state !== "succeeded" &&
    execution.state !== "failed"
  ) {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  requireTimestamp(execution.createdAt);
  updatedAt = requireTimestamp(execution.updatedAt);

  if (execution.state === "executing") {
    if (bundle.release || bundle.acknowledgement) {
      throw new CustomerInquiryLifecycleError(
        "INVALID_LIFECYCLE_ORDER",
      );
    }

    return {
      status: "sandbox_executing",
      updatedAt,
      result: null,
    };
  }

  if (execution.state === "failed") {
    if (bundle.release || bundle.acknowledgement) {
      throw new CustomerInquiryLifecycleError(
        "INVALID_LIFECYCLE_ORDER",
      );
    }

    return {
      status: "sandbox_failed",
      updatedAt,
      result: null,
    };
  }

  if (!bundle.release) {
    if (bundle.acknowledgement) {
      throw new CustomerInquiryLifecycleError(
        "INVALID_LIFECYCLE_ORDER",
      );
    }

    return {
      status: "sandbox_succeeded",
      updatedAt,
      result: null,
    };
  }

  const release = bundle.release;

  assertReference(release.tenantId, inquiry.tenantId);
  assertReference(release.inquiryId, inquiry.inquiryId);
  assertReference(release.customerId, inquiry.customerId);
  assertReference(release.ownerId, inquiry.assignedOwnerId);
  assertReference(release.executionId, execution.executionId);

  requireString(
    release.releaseId,
    "INVALID_LIFECYCLE_RECORD",
  );

  if (release.status !== "released") {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  const result = projectReleasedResult(release);

  requireTimestamp(release.createdAt);
  updatedAt = requireTimestamp(release.updatedAt);

  if (!bundle.acknowledgement) {
    return {
      status: "result_released",
      updatedAt,
      result,
    };
  }

  const acknowledgement = bundle.acknowledgement;

  assertReference(
    acknowledgement.tenantId,
    inquiry.tenantId,
  );
  assertReference(
    acknowledgement.inquiryId,
    inquiry.inquiryId,
  );
  assertReference(
    acknowledgement.customerId,
    inquiry.customerId,
  );
  assertReference(
    acknowledgement.executionId,
    execution.executionId,
  );
  assertReference(
    acknowledgement.releaseId,
    release.releaseId,
  );

  requireString(
    acknowledgement.acknowledgementId,
    "INVALID_LIFECYCLE_RECORD",
  );

  if (acknowledgement.status !== "acknowledged") {
    throw new CustomerInquiryLifecycleError(
      "INVALID_LIFECYCLE_RECORD",
    );
  }

  requireTimestamp(acknowledgement.createdAt);
  updatedAt = requireTimestamp(acknowledgement.updatedAt);

  return {
    status: "customer_acknowledged",
    updatedAt,
    result,
  };
}

export async function projectCustomerInquiryLifecycle(input: {
  context: AuthenticatedLifecycleContext;
  requestedTenantId: string;
  inquiryId: string;
  repository: CustomerInquiryLifecycleRepository;
}): Promise<CustomerInquiryLifecycleView> {
  if (input.context.authenticated !== true) {
    throw new CustomerInquiryLifecycleError(
      "UNAUTHENTICATED",
    );
  }

  if (
    input.context.role !== "owner" &&
    input.context.role !== "customer"
  ) {
    throw new CustomerInquiryLifecycleError(
      "INVALID_CONTEXT",
    );
  }

  const contextTenantId = requireString(
    input.context.tenantId,
    "INVALID_CONTEXT",
  );

  const actorId = requireString(
    input.context.actorId,
    "INVALID_CONTEXT",
  );

  const requestedTenantId = requireString(
    input.requestedTenantId,
    "CROSS_TENANT_ACCESS",
  );

  if (requestedTenantId !== contextTenantId) {
    throw new CustomerInquiryLifecycleError(
      "CROSS_TENANT_ACCESS",
    );
  }

  const inquiryId = requireString(
    input.inquiryId,
    "INVALID_REQUEST",
  );

  const bundle = await input.repository.loadLifecycle({
    tenantId: contextTenantId,
    inquiryId,
  });

  if (!bundle) {
    throw new CustomerInquiryLifecycleError(
      "LIFECYCLE_NOT_FOUND",
    );
  }

  assertReference(
    bundle.inquiry.tenantId,
    contextTenantId,
  );
  assertReference(
    bundle.inquiry.inquiryId,
    inquiryId,
  );

  if (
    input.context.role === "customer" &&
    actorId !== bundle.inquiry.customerId
  ) {
    throw new CustomerInquiryLifecycleError(
      "ACTOR_ACCESS_DENIED",
    );
  }

  if (
    input.context.role === "owner" &&
    actorId !== bundle.inquiry.assignedOwnerId
  ) {
    throw new CustomerInquiryLifecycleError(
      "ACTOR_ACCESS_DENIED",
    );
  }

  const lifecycle = validateLifecycle(bundle);

  const recommendationSummary =
    bundle.recommendation?.publicSummary.trim() ?? null;

  const ownerDecision =
    bundle.decision?.decision ?? null;

  const version = createStableVersion(
    [
      bundle.inquiry.tenantId,
      bundle.inquiry.inquiryId,
      bundle.inquiry.customerId,
      bundle.inquiry.assignedOwnerId,
      bundle.inquiry.updatedAt,
      bundle.recommendation?.recommendationId ?? "",
      bundle.recommendation?.updatedAt ?? "",
      bundle.decision?.decisionId ?? "",
      bundle.decision?.decision ?? "",
      bundle.decision?.updatedAt ?? "",
      bundle.execution?.executionId ?? "",
      bundle.execution?.state ?? "",
      bundle.execution?.updatedAt ?? "",
      bundle.release?.releaseId ?? "",
      bundle.release?.updatedAt ?? "",
      bundle.acknowledgement?.acknowledgementId ?? "",
      bundle.acknowledgement?.updatedAt ?? "",
    ].join("|"),
  );

  return {
    tenantId: contextTenantId,
    inquiryId,
    customerId: bundle.inquiry.customerId,
    role: input.context.role,
    status: lifecycle.status,
    version,
    recommendationSummary,
    ownerDecision,
    executionId: bundle.execution?.executionId ?? null,
    releaseId: bundle.release?.releaseId ?? null,
    acknowledgementId:
      bundle.acknowledgement?.acknowledgementId ?? null,
    result: lifecycle.result,
    failureCode:
      input.context.role === "owner" &&
      bundle.execution?.state === "failed"
        ? sanitizeFailureCode(bundle.execution.failureCode)
        : null,
    updatedAt: lifecycle.updatedAt,
  };
}
