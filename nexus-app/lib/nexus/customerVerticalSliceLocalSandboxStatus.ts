import { createHash } from "node:crypto";

import {
  createFileBackedCustomerVerticalSliceRepository,
  createLocalSandboxRouteDependencies,
} from "./customerVerticalSliceLocalSandboxRuntime";

import type {
  CustomerVerticalSliceStatus,
} from "./customerVerticalSliceTransitionGuard";

export interface LocalSandboxStatusConfiguration {
  enabled: boolean;
  production: boolean;
  token: string;
  secret: string;
  filePath: string;
}

type StatusActorRole = "owner" | "customer";

type StatusNextAction =
  | "wait_for_recommendation"
  | "owner_review_required"
  | "wait_for_owner_decision"
  | "sandbox_execution_pending"
  | "sandbox_execution_in_progress"
  | "owner_release_required"
  | "wait_for_owner_release"
  | "customer_acknowledgement_required"
  | "complete"
  | "blocked";

const MAX_IDENTIFIER_LENGTH = 256;

function headers(
  correlationId: string,
): Record<string, string> {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store, max-age=0",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "cross-origin-resource-policy": "same-origin",
    "x-correlation-id": correlationId,
  };
}

function correlationId(
  request: Request,
): string {
  return `vssr_${createHash("sha256")
    .update(
      [
        request.method,
        request.url,
        request.headers.get("x-request-id") ?? "",
      ].join("|"),
      "utf8",
    )
    .digest("hex")
    .slice(0, 20)}`;
}

function stateEtag(
  tenantId: string,
  inquiryId: string,
  version: string,
): string {
  const digest = createHash("sha256")
    .update(
      [
        tenantId,
        inquiryId,
        version,
      ].join("|"),
      "utf8",
    )
    .digest("hex")
    .slice(0, 24);

  return `"vss1_${digest}"`;
}

function errorResponse(input: {
  status: number;
  correlationId: string;
  code: string;
  message: string;
  retryable: boolean;
  additionalHeaders?: Record<string, string>;
}): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      correlationId: input.correlationId,
      error: {
        code: input.code,
        message: input.message,
        retryable: input.retryable,
      },
    }),
    {
      status: input.status,
      headers: {
        ...headers(input.correlationId),
        ...input.additionalHeaders,
      },
    },
  );
}

function identifier(
  value: string | null,
): string | null {
  const normalized = value?.trim();

  if (
    !normalized ||
    normalized.length > MAX_IDENTIFIER_LENGTH
  ) {
    return null;
  }

  return normalized;
}

function isTerminal(
  status: CustomerVerticalSliceStatus,
): boolean {
  return (
    status === "owner_rejected" ||
    status === "sandbox_failed" ||
    status === "customer_acknowledged"
  );
}

function completedSteps(
  status: CustomerVerticalSliceStatus,
): number {
  switch (status) {
    case "inquiry_received":
      return 1;

    case "recommendation_ready":
      return 2;

    case "owner_approved":
    case "owner_rejected":
    case "sandbox_executing":
    case "sandbox_failed":
      return 3;

    case "sandbox_succeeded":
      return 4;

    case "result_released":
      return 5;

    case "customer_acknowledged":
      return 6;
  }
}

function roleAction(input: {
  role: StatusActorRole;
  status: CustomerVerticalSliceStatus;
}): {
  nextAction: StatusNextAction;
  actionRequired: boolean;
  actionMessage: string;
} {
  if (input.role === "owner") {
    switch (input.status) {
      case "inquiry_received":
        return {
          nextAction: "wait_for_recommendation",
          actionRequired: false,
          actionMessage:
            "The sandbox recommendation is being prepared.",
        };

      case "recommendation_ready":
        return {
          nextAction: "owner_review_required",
          actionRequired: true,
          actionMessage:
            "Review and approve or reject the sandbox recommendation.",
        };

      case "owner_approved":
        return {
          nextAction: "sandbox_execution_pending",
          actionRequired: false,
          actionMessage:
            "The approved sandbox execution is ready to start.",
        };

      case "sandbox_executing":
        return {
          nextAction: "sandbox_execution_in_progress",
          actionRequired: false,
          actionMessage:
            "The approved sandbox execution is in progress.",
        };

      case "sandbox_succeeded":
        return {
          nextAction: "owner_release_required",
          actionRequired: true,
          actionMessage:
            "Review and release the completed sandbox result.",
        };

      case "result_released":
        return {
          nextAction: "customer_acknowledgement_required",
          actionRequired: false,
          actionMessage:
            "The result is awaiting customer acknowledgement.",
        };

      case "customer_acknowledged":
        return {
          nextAction: "complete",
          actionRequired: false,
          actionMessage:
            "The customer acknowledged the released result.",
        };

      case "owner_rejected":
        return {
          nextAction: "blocked",
          actionRequired: false,
          actionMessage:
            "The recommendation was rejected. No execution is permitted.",
        };

      case "sandbox_failed":
        return {
          nextAction: "blocked",
          actionRequired: true,
          actionMessage:
            "Review the sandbox failure before another controlled action.",
        };
    }
  }

  switch (input.status) {
    case "inquiry_received":
      return {
        nextAction: "wait_for_recommendation",
        actionRequired: false,
        actionMessage:
          "Your inquiry was received.",
      };

    case "recommendation_ready":
      return {
        nextAction: "wait_for_owner_decision",
        actionRequired: false,
        actionMessage:
          "The sandbox recommendation is awaiting owner review.",
      };

    case "owner_approved":
      return {
        nextAction: "sandbox_execution_pending",
        actionRequired: false,
        actionMessage:
          "The owner approved the sandbox recommendation.",
      };

    case "sandbox_executing":
      return {
        nextAction: "sandbox_execution_in_progress",
        actionRequired: false,
        actionMessage:
          "The sandbox execution is in progress.",
      };

    case "sandbox_succeeded":
      return {
        nextAction: "wait_for_owner_release",
        actionRequired: false,
        actionMessage:
          "The completed result is awaiting owner release.",
      };

    case "result_released":
      return {
        nextAction: "customer_acknowledgement_required",
        actionRequired: true,
        actionMessage:
          "Review and acknowledge the released sandbox result.",
      };

    case "customer_acknowledged":
      return {
        nextAction: "complete",
        actionRequired: false,
        actionMessage:
          "You acknowledged the released sandbox result.",
      };

    case "owner_rejected":
      return {
        nextAction: "blocked",
        actionRequired: false,
        actionMessage:
          "The sandbox recommendation was not approved.",
      };

    case "sandbox_failed":
      return {
        nextAction: "blocked",
        actionRequired: false,
        actionMessage:
          "The sandbox execution could not be completed.",
      };
  }
}

export async function handleCustomerVerticalSliceLocalSandboxStatus(
  request: Request,
  configuration: LocalSandboxStatusConfiguration,
): Promise<Response> {
  const requestCorrelationId =
    correlationId(request);

  if (request.method.toUpperCase() !== "GET") {
    return errorResponse({
      status: 405,
      correlationId: requestCorrelationId,
      code: "METHOD_NOT_ALLOWED",
      message: "Only GET requests are permitted.",
      retryable: false,
      additionalHeaders: {
        allow: "GET",
      },
    });
  }

  if (
    configuration.production ||
    !configuration.enabled
  ) {
    return errorResponse({
      status: 503,
      correlationId: requestCorrelationId,
      code: "SERVICE_UNAVAILABLE",
      message:
        "The local sandbox status service is unavailable.",
      retryable: true,
    });
  }

  const url = new URL(request.url);

  const requestedTenantId = identifier(
    url.searchParams.get("tenantId"),
  );

  const inquiryId = identifier(
    url.searchParams.get("inquiryId"),
  );

  if (!requestedTenantId || !inquiryId) {
    return errorResponse({
      status: 422,
      correlationId: requestCorrelationId,
      code: "INVALID_REQUEST",
      message:
        "Tenant and inquiry identifiers are required.",
      retryable: false,
    });
  }

  let dependencies;

  try {
    dependencies =
      createLocalSandboxRouteDependencies({
        token: configuration.token,
        secret: configuration.secret,
        filePath: configuration.filePath,
        production: configuration.production,
      });
  } catch {
    return errorResponse({
      status: 503,
      correlationId: requestCorrelationId,
      code: "SERVICE_UNAVAILABLE",
      message:
        "The local sandbox status service is unavailable.",
      retryable: true,
    });
  }

  const session =
    await dependencies.loadSession(request);

  if (
    session.authenticated !== true ||
    !session.tenantId ||
    !session.actorId
  ) {
    return errorResponse({
      status: 401,
      correlationId: requestCorrelationId,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required.",
      retryable: false,
    });
  }

  const verified =
    await dependencies.verifyRequestIntegrity({
      request,
      session,
      rawBody: "",
    });

  if (!verified) {
    return errorResponse({
      status: 403,
      correlationId: requestCorrelationId,
      code: "REQUEST_INTEGRITY_FAILED",
      message:
        "The request could not be verified.",
      retryable: false,
    });
  }

  if (session.tenantId !== requestedTenantId) {
    return errorResponse({
      status: 403,
      correlationId: requestCorrelationId,
      code: "STATUS_FORBIDDEN",
      message:
        "This inquiry status is not accessible.",
      retryable: false,
    });
  }

  if (
    session.role !== "owner" &&
    session.role !== "customer"
  ) {
    return errorResponse({
      status: 403,
      correlationId: requestCorrelationId,
      code: "STATUS_FORBIDDEN",
      message:
        "This inquiry status is not accessible.",
      retryable: false,
    });
  }

  const repository =
    createFileBackedCustomerVerticalSliceRepository(
      configuration.filePath,
    );

  let snapshot;

  try {
    snapshot = await repository.readSnapshot();
  } catch {
    return errorResponse({
      status: 503,
      correlationId: requestCorrelationId,
      code: "SERVICE_UNAVAILABLE",
      message:
        "The inquiry status service is temporarily unavailable.",
      retryable: true,
    });
  }

  const state = snapshot.states.find(
    (candidate) =>
      candidate.tenantId === requestedTenantId &&
      candidate.inquiryId === inquiryId,
  );

  if (!state) {
    return errorResponse({
      status: 404,
      correlationId: requestCorrelationId,
      code: "LIFECYCLE_NOT_FOUND",
      message:
        "The inquiry lifecycle was not found.",
      retryable: false,
    });
  }

  if (
    (
      session.role === "owner" &&
      session.actorId !== state.ownerId
    ) ||
    (
      session.role === "customer" &&
      session.actorId !== state.customerId
    )
  ) {
    return errorResponse({
      status: 403,
      correlationId: requestCorrelationId,
      code: "STATUS_FORBIDDEN",
      message:
        "This inquiry status is not accessible.",
      retryable: false,
    });
  }

  const etag = stateEtag(
    state.tenantId,
    state.inquiryId,
    state.version,
  );

  if (
    request.headers.get("if-none-match") === etag
  ) {
    return new Response(null, {
      status: 304,
      headers: {
        ...headers(requestCorrelationId),
        etag,
      },
    });
  }

  const action = roleAction({
    role: session.role,
    status: state.status,
  });

  return new Response(
    JSON.stringify({
      ok: true,
      correlationId: requestCorrelationId,
      data: {
        tenantId: state.tenantId,
        inquiryId: state.inquiryId,
        role: session.role,
        status: state.status,
        version: state.version,
        terminal: isTerminal(state.status),
        completedSteps: completedSteps(
          state.status,
        ),
        totalSteps: 6,
        nextAction: action.nextAction,
        actionRequired:
          action.actionRequired,
        actionMessage:
          action.actionMessage,
        updatedAt: state.updatedAt,
      },
    }),
    {
      status: 200,
      headers: {
        ...headers(requestCorrelationId),
        etag,
      },
    },
  );
}
