import type {
  IntegratedAuditEvent,
  IntegratedControlledAction,
  IntegratedDispatchOutboxRecord,
  PersistentControlledActionState,
} from "./persistentControlledActionVerticalSlice";
import {
  PersistentControlledActionVerticalSlice,
} from "./persistentControlledActionVerticalSlice";

export type ControlledActionGatewayRole =
  | "owner"
  | "operator"
  | "worker"
  | "auditor"
  | "system_owner";

export interface ControlledActionGatewayContext {
  tenantId: string;
  actorId: string;
  role: ControlledActionGatewayRole;
  requestId: string;
}

export type ControlledActionGatewayCommand =
  | {
      type: "create_action";
      actionId: string;
      idempotencyKey: string;
      effectType: string;
      payloadDigest: string;
      auditId: string;
      now: string;
    }
  | {
      type: "authorize_action";
      actionId: string;
      ownerAuthorizationId: string;
      auditId: string;
      now: string;
    }
  | {
      type: "enqueue_action";
      actionId: string;
      outboxId: string;
      dispatchToken: string;
      maxDeliveryAttempts: number;
      auditId: string;
      now: string;
    }
  | {
      type: "claim_outbox";
      outboxId: string;
      workerId: string;
      claimToken: string;
      leaseDurationMs: number;
      auditId: string;
      now: string;
    }
  | {
      type: "record_delivery_failure";
      actionId: string;
      outboxId: string;
      workerId: string;
      leaseFence: number;
      outcomeToken: string;
      failureCode: string;
      retryable: boolean;
      retryDelayMs: number;
      auditId: string;
      now: string;
    }
  | {
      type: "finalize_action";
      actionId: string;
      workerId: string;
      leaseFence: number;
      terminalCommitToken: string;
      finalStatus: "succeeded" | "failed" | "cancelled";
      resultDigest: string | null;
      terminalReasonCode: string | null;
      auditId: string;
      now: string;
    }
  | {
      type: "read_tenant_snapshot";
    }
  | {
      type: "set_operational_kill_switch";
      engaged: boolean;
      reason: string | null;
      auditId: string;
      now: string;
    };

export interface TenantControlledActionSnapshot {
  revision: number;
  killSwitch: PersistentControlledActionState["killSwitch"];
  actions: Record<string, IntegratedControlledAction>;
  outbox: Record<string, IntegratedDispatchOutboxRecord>;
  audit: IntegratedAuditEvent[];
}

export interface ControlledActionGatewayResponse<T = unknown> {
  requestId: string;
  actorId: string;
  tenantId: string;
  commandType: ControlledActionGatewayCommand["type"];
  executionBoundary: "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION";
  liveProviderExecutionAuthorized: false;
  result: T;
}

function requireNonEmpty(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function validateContext(
  context: ControlledActionGatewayContext,
): ControlledActionGatewayContext {
  return {
    tenantId: requireNonEmpty(
      context.tenantId,
      "Gateway context tenantId",
    ),
    actorId: requireNonEmpty(
      context.actorId,
      "Gateway context actorId",
    ),
    role: context.role,
    requestId: requireNonEmpty(
      context.requestId,
      "Gateway context requestId",
    ),
  };
}

function requireRole(
  context: ControlledActionGatewayContext,
  permittedRoles: ControlledActionGatewayRole[],
): void {
  if (!permittedRoles.includes(context.role)) {
    throw new Error(
      `Role ${context.role} is not permitted to perform this command.`,
    );
  }
}

function createResponse<T>(
  context: ControlledActionGatewayContext,
  commandType: ControlledActionGatewayCommand["type"],
  result: T,
): ControlledActionGatewayResponse<T> {
  return {
    requestId: context.requestId,
    actorId: context.actorId,
    tenantId: context.tenantId,
    commandType,
    executionBoundary: "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION",
    liveProviderExecutionAuthorized: false,
    result,
  };
}

function filterTenantSnapshot(
  state: PersistentControlledActionState,
  tenantId: string,
): TenantControlledActionSnapshot {
  const actions = Object.fromEntries(
    Object.entries(state.actions).filter(
      ([, action]) => action.tenantId === tenantId,
    ),
  );

  const outbox = Object.fromEntries(
    Object.entries(state.outbox).filter(
      ([, record]) => record.tenantId === tenantId,
    ),
  );

  const audit = state.audit.filter(
    (event) => event.tenantId === tenantId,
  );

  return {
    revision: state.revision,
    killSwitch: state.killSwitch,
    actions,
    outbox,
    audit,
  };
}

export function isControlledActionGatewayRole(
  value: string,
): value is ControlledActionGatewayRole {
  return (
    value === "owner" ||
    value === "operator" ||
    value === "worker" ||
    value === "auditor" ||
    value === "system_owner"
  );
}

export class ControlledActionCommandGateway {
  constructor(
    private readonly engine: PersistentControlledActionVerticalSlice,
  ) {}

  async execute(
    rawContext: ControlledActionGatewayContext,
    command: ControlledActionGatewayCommand,
  ): Promise<ControlledActionGatewayResponse> {
    const context = validateContext(rawContext);

    switch (command.type) {
      case "create_action": {
        requireRole(context, ["owner", "operator"]);

        const result = await this.engine.createAction({
          actionId: command.actionId,
          tenantId: context.tenantId,
          idempotencyKey: command.idempotencyKey,
          effectType: command.effectType,
          payloadDigest: command.payloadDigest,
          auditId: command.auditId,
          now: command.now,
        });

        return createResponse(context, command.type, result);
      }

      case "authorize_action": {
        requireRole(context, ["owner"]);

        const result = await this.engine.authorizeAction({
          actionId: command.actionId,
          tenantId: context.tenantId,
          ownerAuthorizationId: command.ownerAuthorizationId,
          auditId: command.auditId,
          now: command.now,
        });

        return createResponse(context, command.type, result);
      }

      case "enqueue_action": {
        requireRole(context, ["owner"]);

        const result = await this.engine.enqueueAction({
          actionId: command.actionId,
          tenantId: context.tenantId,
          outboxId: command.outboxId,
          dispatchToken: command.dispatchToken,
          maxDeliveryAttempts: command.maxDeliveryAttempts,
          auditId: command.auditId,
          now: command.now,
        });

        return createResponse(context, command.type, result);
      }

      case "claim_outbox": {
        requireRole(context, ["worker"]);

        if (requireNonEmpty(command.workerId, "Worker ID") !== context.actorId) {
          throw new Error(
            "Worker command actor does not match the authenticated actor.",
          );
        }

        const result = await this.engine.claimOutbox({
          outboxId: command.outboxId,
          tenantId: context.tenantId,
          workerId: context.actorId,
          claimToken: command.claimToken,
          leaseDurationMs: command.leaseDurationMs,
          auditId: command.auditId,
          now: command.now,
        });

        return createResponse(context, command.type, result);
      }

      case "record_delivery_failure": {
        requireRole(context, ["worker"]);

        if (
          requireNonEmpty(
            command.workerId,
            "Worker ID",
          ) !== context.actorId
        ) {
          throw new Error(
            "Worker command actor does not match the authenticated actor.",
          );
        }

        const result =
          await this.engine.recordDeliveryFailure({
            actionId: command.actionId,
            outboxId: command.outboxId,
            tenantId: context.tenantId,
            workerId: context.actorId,
            leaseFence: command.leaseFence,
            outcomeToken: command.outcomeToken,
            failureCode: command.failureCode,
            retryable: command.retryable,
            retryDelayMs: command.retryDelayMs,
            auditId: command.auditId,
            now: command.now,
          });

        return createResponse(context, command.type, result);
      }
      case "finalize_action": {
        requireRole(context, ["worker"]);

        if (requireNonEmpty(command.workerId, "Worker ID") !== context.actorId) {
          throw new Error(
            "Worker command actor does not match the authenticated actor.",
          );
        }

        const result = await this.engine.finalizeAction({
          actionId: command.actionId,
          tenantId: context.tenantId,
          workerId: context.actorId,
          leaseFence: command.leaseFence,
          terminalCommitToken: command.terminalCommitToken,
          finalStatus: command.finalStatus,
          resultDigest: command.resultDigest,
          terminalReasonCode: command.terminalReasonCode,
          auditId: command.auditId,
          now: command.now,
        });

        return createResponse(context, command.type, result);
      }

      case "read_tenant_snapshot": {
        requireRole(context, ["owner", "auditor"]);

        const state = await this.engine.readSnapshot();
        const result = filterTenantSnapshot(
          state,
          context.tenantId,
        );

        return createResponse(context, command.type, result);
      }

      case "set_operational_kill_switch": {
        requireRole(context, ["system_owner"]);

        if (context.tenantId !== "__system__") {
          throw new Error(
            "Operational kill-switch commands require system tenant context.",
          );
        }

        const result = await this.engine.setKillSwitch({
          engaged: command.engaged,
          reason: command.reason,
          auditId: command.auditId,
          now: command.now,
        });

        return createResponse(context, command.type, result);
      }

      default: {
        const exhaustiveCheck: never = command;
        throw new Error(
          `Unsupported gateway command: ${JSON.stringify(exhaustiveCheck)}`,
        );
      }
    }
  }
}

