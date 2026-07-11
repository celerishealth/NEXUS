import {
  projectCustomerInquiryLifecycle,
  type AuthenticatedLifecycleContext,
  type CustomerInquiryLifecycleRepository,
  type CustomerInquiryLifecycleStatus,
  type CustomerInquiryLifecycleView,
  type LifecycleActorRole,
} from "./customerInquiryLifecycleProjection";

export type InquiryProgressStepKey =
  | "inquiry"
  | "recommendation"
  | "owner_decision"
  | "sandbox_execution"
  | "result_release"
  | "customer_acknowledgement";

export type InquiryProgressStepState =
  | "complete"
  | "current"
  | "blocked"
  | "not_started";

export interface InquiryProgressStep {
  key: InquiryProgressStepKey;
  label: string;
  state: InquiryProgressStepState;
}

export interface CustomerInquiryProgressSnapshot {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  role: LifecycleActorRole;
  lifecycleStatus: CustomerInquiryLifecycleStatus;
  version: string;
  terminal: boolean;
  completedSteps: number;
  totalSteps: 6;
  actionRequired: boolean;
  actionMessage: string;
  steps: InquiryProgressStep[];
  recommendationSummary: string | null;
  ownerDecision: "approved" | "rejected" | null;
  result: CustomerInquiryLifecycleView["result"];
  failureCode: string | null;
  updatedAt: string;
}

export type CustomerInquiryProgressResponse =
  | {
      changed: false;
      version: string;
      snapshot: null;
    }
  | {
      changed: true;
      version: string;
      snapshot: CustomerInquiryProgressSnapshot;
    };

export type CustomerInquiryProgressErrorCode =
  | "INVALID_KNOWN_VERSION";

export class CustomerInquiryProgressError extends Error {
  readonly code: CustomerInquiryProgressErrorCode;

  constructor(
    code: CustomerInquiryProgressErrorCode,
    message = "Invalid inquiry progress request.",
  ) {
    super(message);
    this.name = "CustomerInquiryProgressError";
    this.code = code;
  }
}

function normalizeKnownVersion(
  value: string | null | undefined,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = value.trim();

  if (!/^clv1_[a-f0-9]{8}$/.test(normalized)) {
    throw new CustomerInquiryProgressError(
      "INVALID_KNOWN_VERSION",
    );
  }

  return normalized;
}

function isAtOrAfter(
  status: CustomerInquiryLifecycleStatus,
  target:
    | "recommendation_ready"
    | "owner_approved"
    | "sandbox_executing"
    | "sandbox_succeeded"
    | "result_released"
    | "customer_acknowledged",
): boolean {
  const order: Record<CustomerInquiryLifecycleStatus, number> = {
    inquiry_received: 0,
    recommendation_ready: 1,
    owner_approved: 2,
    owner_rejected: 2,
    sandbox_executing: 3,
    sandbox_failed: 3,
    sandbox_succeeded: 4,
    result_released: 5,
    customer_acknowledged: 6,
  };

  return order[status] >= order[target];
}

function buildSteps(
  view: CustomerInquiryLifecycleView,
): InquiryProgressStep[] {
  const rejected = view.status === "owner_rejected";
  const failed = view.status === "sandbox_failed";

  const recommendationComplete =
    view.recommendationSummary !== null;

  const decisionComplete =
    view.ownerDecision !== null;

  const executionComplete =
    view.status === "sandbox_succeeded" ||
    view.status === "result_released" ||
    view.status === "customer_acknowledged";

  const releaseComplete =
    view.releaseId !== null;

  const acknowledgementComplete =
    view.acknowledgementId !== null;

  return [
    {
      key: "inquiry",
      label: "Inquiry received",
      state: "complete",
    },
    {
      key: "recommendation",
      label: "Sandbox recommendation prepared",
      state: recommendationComplete
        ? "complete"
        : "current",
    },
    {
      key: "owner_decision",
      label: "Owner decision recorded",
      state: decisionComplete
        ? "complete"
        : view.status === "recommendation_ready"
          ? "current"
          : "not_started",
    },
    {
      key: "sandbox_execution",
      label: "Approved sandbox execution",
      state: rejected
        ? "blocked"
        : failed
          ? "blocked"
          : executionComplete
            ? "complete"
            : view.status === "owner_approved" ||
                view.status === "sandbox_executing"
              ? "current"
              : "not_started",
    },
    {
      key: "result_release",
      label: "Owner-controlled result release",
      state: rejected || failed
        ? "blocked"
        : releaseComplete
          ? "complete"
          : view.status === "sandbox_succeeded"
            ? "current"
            : "not_started",
    },
    {
      key: "customer_acknowledgement",
      label: "Customer acknowledgement",
      state: rejected || failed
        ? "blocked"
        : acknowledgementComplete
          ? "complete"
          : view.status === "result_released"
            ? "current"
            : "not_started",
    },
  ];
}

function getAction(
  role: LifecycleActorRole,
  status: CustomerInquiryLifecycleStatus,
): {
  required: boolean;
  message: string;
} {
  if (role === "owner") {
    switch (status) {
      case "inquiry_received":
        return {
          required: false,
          message:
            "The sandbox recommendation is being prepared.",
        };

      case "recommendation_ready":
        return {
          required: true,
          message:
            "Review the sandbox recommendation and approve or reject it.",
        };

      case "owner_approved":
        return {
          required: false,
          message:
            "The approved sandbox execution is ready to proceed.",
        };

      case "owner_rejected":
        return {
          required: false,
          message:
            "The recommendation was rejected. No execution or release is permitted.",
        };

      case "sandbox_executing":
        return {
          required: false,
          message:
            "Sandbox execution is currently in progress.",
        };

      case "sandbox_failed":
        return {
          required: true,
          message:
            "Review the sandbox execution failure before taking another controlled action.",
        };

      case "sandbox_succeeded":
        return {
          required: true,
          message:
            "Review the completed sandbox result and release it to the customer when appropriate.",
        };

      case "result_released":
        return {
          required: false,
          message:
            "The result is released and awaiting customer acknowledgement.",
        };

      case "customer_acknowledged":
        return {
          required: false,
          message:
            "The customer has acknowledged the released sandbox result.",
        };
    }
  }

  switch (status) {
    case "inquiry_received":
      return {
        required: false,
        message:
          "Your inquiry was received and is being reviewed.",
      };

    case "recommendation_ready":
      return {
        required: false,
        message:
          "A sandbox recommendation is awaiting owner review.",
      };

    case "owner_approved":
      return {
        required: false,
        message:
          "The owner approved the sandbox recommendation.",
      };

    case "owner_rejected":
      return {
        required: false,
        message:
          "The owner did not approve the sandbox recommendation.",
      };

    case "sandbox_executing":
      return {
        required: false,
        message:
          "The approved sandbox execution is in progress.",
      };

    case "sandbox_failed":
      return {
        required: false,
        message:
          "The sandbox execution could not be completed.",
      };

    case "sandbox_succeeded":
      return {
        required: false,
        message:
          "Sandbox execution completed and is awaiting owner release.",
      };

    case "result_released":
      return {
        required: true,
        message:
          "Your sandbox result is ready. Review and acknowledge it.",
      };

    case "customer_acknowledged":
      return {
        required: false,
        message:
          "You acknowledged the released sandbox result.",
      };
  }
}

function buildSnapshot(
  view: CustomerInquiryLifecycleView,
): CustomerInquiryProgressSnapshot {
  const steps = buildSteps(view);
  const action = getAction(view.role, view.status);

  const terminal =
    view.status === "owner_rejected" ||
    view.status === "sandbox_failed" ||
    view.status === "customer_acknowledged";

  const completedSteps = steps.filter(
    (step) => step.state === "complete",
  ).length;

  return {
    tenantId: view.tenantId,
    inquiryId: view.inquiryId,
    customerId: view.customerId,
    role: view.role,
    lifecycleStatus: view.status,
    version: view.version,
    terminal,
    completedSteps,
    totalSteps: 6,
    actionRequired: action.required,
    actionMessage: action.message,
    steps,
    recommendationSummary:
      view.recommendationSummary,
    ownerDecision: view.ownerDecision,
    result: view.result,
    failureCode:
      view.role === "owner"
        ? view.failureCode
        : null,
    updatedAt: view.updatedAt,
  };
}

export async function getCustomerInquiryProgress(input: {
  context: AuthenticatedLifecycleContext;
  requestedTenantId: string;
  inquiryId: string;
  knownVersion?: string | null;
  repository: CustomerInquiryLifecycleRepository;
}): Promise<CustomerInquiryProgressResponse> {
  const knownVersion = normalizeKnownVersion(
    input.knownVersion,
  );

  const lifecycle =
    await projectCustomerInquiryLifecycle({
      context: input.context,
      requestedTenantId: input.requestedTenantId,
      inquiryId: input.inquiryId,
      repository: input.repository,
    });

  if (
    knownVersion !== null &&
    knownVersion === lifecycle.version
  ) {
    return {
      changed: false,
      version: lifecycle.version,
      snapshot: null,
    };
  }

  return {
    changed: true,
    version: lifecycle.version,
    snapshot: buildSnapshot(lifecycle),
  };
}
