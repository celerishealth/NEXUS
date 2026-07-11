import { createHash } from "node:crypto";

import {
  applyAuditedCustomerVerticalSliceTransition,
  type CustomerVerticalSliceTransactionalRepository,
} from "./customerVerticalSliceAuditedTransition";

import type {
  AuthenticatedVerticalSliceActor,
  CustomerVerticalSliceStatus,
  CustomerVerticalSliceTransition,
  VerticalSliceActorRole,
} from "./customerVerticalSliceTransitionGuard";

import type {
  AuthenticatedAuditWriterContext,
} from "./customerVerticalSliceAuditLedger";

export type CustomerVerticalSliceCommand =
  | "prepare_recommendation"
  | "approve_recommendation"
  | "reject_recommendation"
  | "start_sandbox_execution"
  | "complete_sandbox_execution"
  | "fail_sandbox_execution"
  | "release_result"
  | "acknowledge_result";

export type CustomerVerticalSliceNextAction =
  | "owner_review_required"
  | "sandbox_execution_pending"
  | "sandbox_execution_in_progress"
  | "owner_release_required"
  | "customer_acknowledgement_required"
  | "complete"
  | "blocked";

export interface CustomerVerticalSliceCommandReceipt {
  command: CustomerVerticalSliceCommand;
  tenantId: string;
  inquiryId: string;
  mode: "sandbox";
  outcome: "applied" | "replayed";
  status: CustomerVerticalSliceStatus;
  version: string;
  terminal: boolean;
  nextAction: CustomerVerticalSliceNextAction;
  recoveredMissingAudit: boolean;
  receipt: {
    eventId: string;
    auditId: string;
    auditSequence: number;
    auditHash: string | null;
  };
}

export type CustomerVerticalSliceCommandGatewayErrorCode =
  | "INVALID_GATEWAY_REQUEST"
  | "COMMAND_ROLE_MISMATCH"
  | "LIVE_EXECUTION_NOT_AUTHORIZED"
  | "EXTERNAL_DELIVERY_NOT_AUTHORIZED"
  | "PUBLIC_LAUNCH_NOT_AUTHORIZED";

export class CustomerVerticalSliceCommandGatewayError extends Error {
  readonly code: CustomerVerticalSliceCommandGatewayErrorCode;

  constructor(
    code: CustomerVerticalSliceCommandGatewayErrorCode,
    message = "Customer vertical slice command denied.",
  ) {
    super(message);
    this.name = "CustomerVerticalSliceCommandGatewayError";
    this.code = code;
  }
}

interface CommandDefinition {
  transition: CustomerVerticalSliceTransition;
  requiredRole: VerticalSliceActorRole;
}

const COMMAND_DEFINITIONS: Record<
  CustomerVerticalSliceCommand,
  CommandDefinition
> = {
  prepare_recommendation: {
    transition: "generate_recommendation",
    requiredRole: "service",
  },
  approve_recommendation: {
    transition: "approve_recommendation",
    requiredRole: "owner",
  },
  reject_recommendation: {
    transition: "reject_recommendation",
    requiredRole: "owner",
  },
  start_sandbox_execution: {
    transition: "start_sandbox_execution",
    requiredRole: "service",
  },
  complete_sandbox_execution: {
    transition: "complete_sandbox_execution",
    requiredRole: "service",
  },
  fail_sandbox_execution: {
    transition: "fail_sandbox_execution",
    requiredRole: "service",
  },
  release_result: {
    transition: "release_result",
    requiredRole: "owner",
  },
  acknowledge_result: {
    transition: "acknowledge_result",
    requiredRole: "customer",
  },
};

function requireString(
  value: string | null | undefined,
  maximumLength = 512,
): string {
  const normalized = value?.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new CustomerVerticalSliceCommandGatewayError(
      "INVALID_GATEWAY_REQUEST",
    );
  }

  return normalized;
}

function requireRequestId(value: string): string {
  const normalized = requireString(value, 128);

  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(normalized)) {
    throw new CustomerVerticalSliceCommandGatewayError(
      "INVALID_GATEWAY_REQUEST",
    );
  }

  return normalized;
}

function isKnownCommand(
  value: string,
): value is CustomerVerticalSliceCommand {
  return Object.prototype.hasOwnProperty.call(
    COMMAND_DEFINITIONS,
    value,
  );
}

function createIdempotencyKey(input: {
  tenantId: string;
  inquiryId: string;
  command: CustomerVerticalSliceCommand;
  requestId: string;
}): string {
  const digest = createHash("sha256")
    .update(
      [
        "customer-vertical-slice-command",
        "v1",
        input.tenantId,
        input.inquiryId,
        input.command,
        input.requestId,
      ].join("|"),
      "utf8",
    )
    .digest("hex");

  return `vscg1_${digest}`;
}

function getNextAction(
  status: CustomerVerticalSliceStatus,
): CustomerVerticalSliceNextAction {
  switch (status) {
    case "inquiry_received":
    case "recommendation_ready":
      return "owner_review_required";

    case "owner_approved":
      return "sandbox_execution_pending";

    case "sandbox_executing":
      return "sandbox_execution_in_progress";

    case "sandbox_succeeded":
      return "owner_release_required";

    case "result_released":
      return "customer_acknowledgement_required";

    case "customer_acknowledged":
      return "complete";

    case "owner_rejected":
    case "sandbox_failed":
      return "blocked";
  }
}

function isTerminalStatus(
  status: CustomerVerticalSliceStatus,
): boolean {
  return (
    status === "owner_rejected" ||
    status === "sandbox_failed" ||
    status === "customer_acknowledged"
  );
}

export async function executeCustomerVerticalSliceCommand(input: {
  actorContext: AuthenticatedVerticalSliceActor;
  auditContext: AuthenticatedAuditWriterContext;
  requestedTenantId: string;
  inquiryId: string;
  expectedVersion: string;
  command: CustomerVerticalSliceCommand;
  requestId: string;
  executionMode: "sandbox" | "live";
  externalDeliveryRequested: boolean;
  publicLaunchRequested: boolean;
  repository: CustomerVerticalSliceTransactionalRepository;
  nowIso?: string;
}): Promise<CustomerVerticalSliceCommandReceipt> {
  if (input.executionMode !== "sandbox") {
    throw new CustomerVerticalSliceCommandGatewayError(
      "LIVE_EXECUTION_NOT_AUTHORIZED",
    );
  }

  if (input.externalDeliveryRequested === true) {
    throw new CustomerVerticalSliceCommandGatewayError(
      "EXTERNAL_DELIVERY_NOT_AUTHORIZED",
    );
  }

  if (input.publicLaunchRequested === true) {
    throw new CustomerVerticalSliceCommandGatewayError(
      "PUBLIC_LAUNCH_NOT_AUTHORIZED",
    );
  }

  const tenantId = requireString(
    input.requestedTenantId,
  );

  const inquiryId = requireString(
    input.inquiryId,
  );

  requireString(input.expectedVersion);

  const requestId = requireRequestId(
    input.requestId,
  );

  if (!isKnownCommand(input.command)) {
    throw new CustomerVerticalSliceCommandGatewayError(
      "INVALID_GATEWAY_REQUEST",
    );
  }

  const definition =
    COMMAND_DEFINITIONS[input.command];

  if (
    input.actorContext.role !==
    definition.requiredRole
  ) {
    throw new CustomerVerticalSliceCommandGatewayError(
      "COMMAND_ROLE_MISMATCH",
    );
  }

  const idempotencyKey = createIdempotencyKey({
    tenantId,
    inquiryId,
    command: input.command,
    requestId,
  });

  const result =
    await applyAuditedCustomerVerticalSliceTransition({
      actorContext: input.actorContext,
      auditContext: input.auditContext,
      requestedTenantId: tenantId,
      inquiryId,
      expectedVersion: input.expectedVersion,
      transition: definition.transition,
      idempotencyKey,
      repository: input.repository,
      nowIso: input.nowIso,
    });

  const customerSafeAuditHash =
    input.actorContext.role === "customer"
      ? null
      : result.auditEntry.hash;

  return {
    command: input.command,
    tenantId: result.state.tenantId,
    inquiryId: result.state.inquiryId,
    mode: "sandbox",
    outcome: result.transitionApplied
      ? "applied"
      : "replayed",
    status: result.state.status,
    version: result.state.version,
    terminal: isTerminalStatus(
      result.state.status,
    ),
    nextAction: getNextAction(
      result.state.status,
    ),
    recoveredMissingAudit:
      result.recoveredMissingAudit,
    receipt: {
      eventId: result.event.eventId,
      auditId: result.auditEntry.auditId,
      auditSequence:
        result.auditEntry.sequence,
      auditHash: customerSafeAuditHash,
    },
  };
}
