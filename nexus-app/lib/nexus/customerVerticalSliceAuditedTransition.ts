import {
  applyCustomerVerticalSliceTransition,
  type AuthenticatedVerticalSliceActor,
  type CustomerVerticalSliceStateRecord,
  type CustomerVerticalSliceTransition,
  type CustomerVerticalSliceTransitionEvent,
  type CustomerVerticalSliceTransitionRepository,
} from "./customerVerticalSliceTransitionGuard";

import {
  appendVerticalSliceAuditEvent,
  type AuthenticatedAuditWriterContext,
  type CustomerVerticalSliceAuditEntry,
  type CustomerVerticalSliceAuditRepository,
} from "./customerVerticalSliceAuditLedger";

export interface CustomerVerticalSliceTransactionRepositories {
  transitionRepository: CustomerVerticalSliceTransitionRepository;
  auditRepository: CustomerVerticalSliceAuditRepository;
}

export interface CustomerVerticalSliceTransactionalRepository {
  runInTransaction<T>(
    operation: (
      repositories: CustomerVerticalSliceTransactionRepositories,
    ) => Promise<T>,
  ): Promise<T>;
}

export interface AuditedVerticalSliceTransitionResult {
  transitionApplied: boolean;
  transitionIdempotent: boolean;
  auditCreated: boolean;
  auditIdempotent: boolean;
  recoveredMissingAudit: boolean;
  state: CustomerVerticalSliceStateRecord;
  event: CustomerVerticalSliceTransitionEvent;
  auditEntry: CustomerVerticalSliceAuditEntry;
}

export type AuditedVerticalSliceTransitionErrorCode =
  | "INVALID_COORDINATOR_CONTEXT"
  | "AUDIT_SERVICE_NOT_AUTHORIZED"
  | "CROSS_TENANT_COORDINATION"
  | "COORDINATION_MISMATCH";

export class AuditedVerticalSliceTransitionError extends Error {
  readonly code: AuditedVerticalSliceTransitionErrorCode;

  constructor(
    code: AuditedVerticalSliceTransitionErrorCode,
    message = "Audited vertical slice transition denied.",
  ) {
    super(message);
    this.name = "AuditedVerticalSliceTransitionError";
    this.code = code;
  }
}

function requireString(
  value: string | null | undefined,
  code: AuditedVerticalSliceTransitionErrorCode,
): string {
  const normalized = value?.trim();

  if (!normalized || normalized.length > 512) {
    throw new AuditedVerticalSliceTransitionError(code);
  }

  return normalized;
}

function validateCoordinatorContexts(input: {
  actorContext: AuthenticatedVerticalSliceActor;
  auditContext: AuthenticatedAuditWriterContext;
  requestedTenantId: string;
}): {
  tenantId: string;
} {
  if (
    input.actorContext.authenticated !== true ||
    input.auditContext.authenticated !== true
  ) {
    throw new AuditedVerticalSliceTransitionError(
      "INVALID_COORDINATOR_CONTEXT",
    );
  }

  if (input.auditContext.role !== "service") {
    throw new AuditedVerticalSliceTransitionError(
      "AUDIT_SERVICE_NOT_AUTHORIZED",
    );
  }

  const actorTenantId = requireString(
    input.actorContext.tenantId,
    "INVALID_COORDINATOR_CONTEXT",
  );

  requireString(
    input.actorContext.actorId,
    "INVALID_COORDINATOR_CONTEXT",
  );

  const auditTenantId = requireString(
    input.auditContext.tenantId,
    "INVALID_COORDINATOR_CONTEXT",
  );

  requireString(
    input.auditContext.serviceId,
    "INVALID_COORDINATOR_CONTEXT",
  );

  const requestedTenantId = requireString(
    input.requestedTenantId,
    "CROSS_TENANT_COORDINATION",
  );

  if (
    requestedTenantId !== actorTenantId ||
    requestedTenantId !== auditTenantId
  ) {
    throw new AuditedVerticalSliceTransitionError(
      "CROSS_TENANT_COORDINATION",
    );
  }

  return {
    tenantId: requestedTenantId,
  };
}

function assertCoordinatedResult(input: {
  tenantId: string;
  state: CustomerVerticalSliceStateRecord;
  event: CustomerVerticalSliceTransitionEvent;
  auditEntry: CustomerVerticalSliceAuditEntry;
  requireStateVersionMatch: boolean;
}): void {
  const {
    tenantId,
    state,
    event,
    auditEntry,
    requireStateVersionMatch,
  } = input;

  const coordinated =
    state.tenantId === tenantId &&
    event.tenantId === tenantId &&
    auditEntry.tenantId === tenantId &&
    state.inquiryId === event.inquiryId &&
    state.inquiryId === auditEntry.inquiryId &&
    state.customerId === event.customerId &&
    state.customerId === auditEntry.customerId &&
    state.ownerId === event.ownerId &&
    state.ownerId === auditEntry.ownerId &&
    (!requireStateVersionMatch ||
      (state.version === event.nextVersion &&
        state.status === event.toStatus)) &&
    state.version === auditEntry.nextVersion &&
    event.eventId === auditEntry.sourceEventId &&
    event.idempotencyKey ===
      auditEntry.sourceIdempotencyKey &&
    event.actorId === auditEntry.actorId &&
    event.actorRole === auditEntry.actorRole &&
    event.transition === auditEntry.transition &&
    event.fromStatus === auditEntry.fromStatus &&
    event.toStatus === auditEntry.toStatus &&
    event.previousVersion ===
      auditEntry.previousVersion;

  if (!coordinated) {
    throw new AuditedVerticalSliceTransitionError(
      "COORDINATION_MISMATCH",
    );
  }
}

export async function applyAuditedCustomerVerticalSliceTransition(input: {
  actorContext: AuthenticatedVerticalSliceActor;
  auditContext: AuthenticatedAuditWriterContext;
  requestedTenantId: string;
  inquiryId: string;
  expectedVersion: string;
  transition: CustomerVerticalSliceTransition;
  idempotencyKey: string;
  repository: CustomerVerticalSliceTransactionalRepository;
  nowIso?: string;
}): Promise<AuditedVerticalSliceTransitionResult> {
  const { tenantId } = validateCoordinatorContexts({
    actorContext: input.actorContext,
    auditContext: input.auditContext,
    requestedTenantId: input.requestedTenantId,
  });

  return input.repository.runInTransaction(
    async ({
      transitionRepository,
      auditRepository,
    }) => {
      const transitionResult =
        await applyCustomerVerticalSliceTransition({
          context: input.actorContext,
          requestedTenantId: tenantId,
          inquiryId: input.inquiryId,
          expectedVersion: input.expectedVersion,
          transition: input.transition,
          idempotencyKey: input.idempotencyKey,
          repository: transitionRepository,
          nowIso: input.nowIso,
        });

      const event = transitionResult.event;

      const auditResult =
        await appendVerticalSliceAuditEvent({
          context: input.auditContext,
          requestedTenantId: tenantId,
          source: {
            eventId: event.eventId,
            idempotencyKey: event.idempotencyKey,
            tenantId: event.tenantId,
            inquiryId: event.inquiryId,
            customerId: event.customerId,
            ownerId: event.ownerId,
            actorId: event.actorId,
            actorRole: event.actorRole,
            transition: event.transition,
            fromStatus: event.fromStatus,
            toStatus: event.toStatus,
            previousVersion: event.previousVersion,
            nextVersion: event.nextVersion,
            createdAt: event.createdAt,
          },
          repository: auditRepository,
          nowIso: input.nowIso,
        });

      assertCoordinatedResult({
        tenantId,
        state: transitionResult.state,
        event,
        auditEntry: auditResult.entry,
        requireStateVersionMatch: transitionResult.applied,
      });

      return {
        transitionApplied: transitionResult.applied,
        transitionIdempotent:
          transitionResult.idempotent,
        auditCreated: auditResult.created,
        auditIdempotent: auditResult.idempotent,
        recoveredMissingAudit:
          transitionResult.idempotent &&
          auditResult.created,
        state: transitionResult.state,
        event,
        auditEntry: auditResult.entry,
        requireStateVersionMatch: transitionResult.applied,
      };
    },
  );
}

