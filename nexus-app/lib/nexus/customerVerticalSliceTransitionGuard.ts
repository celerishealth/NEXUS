export type VerticalSliceActorRole =
  | "owner"
  | "customer"
  | "service";

export interface AuthenticatedVerticalSliceActor {
  authenticated: boolean;
  tenantId: string | null;
  actorId: string | null;
  role: VerticalSliceActorRole;
}

export type CustomerVerticalSliceStatus =
  | "inquiry_received"
  | "recommendation_ready"
  | "owner_approved"
  | "owner_rejected"
  | "sandbox_executing"
  | "sandbox_succeeded"
  | "sandbox_failed"
  | "result_released"
  | "customer_acknowledged";

export type CustomerVerticalSliceTransition =
  | "generate_recommendation"
  | "approve_recommendation"
  | "reject_recommendation"
  | "start_sandbox_execution"
  | "complete_sandbox_execution"
  | "fail_sandbox_execution"
  | "release_result"
  | "acknowledge_result";

export interface CustomerVerticalSliceStateRecord {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  ownerId: string;
  status: CustomerVerticalSliceStatus;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerVerticalSliceTransitionEvent {
  eventId: string;
  idempotencyKey: string;
  tenantId: string;
  inquiryId: string;
  customerId: string;
  ownerId: string;
  actorId: string;
  actorRole: VerticalSliceActorRole;
  transition: CustomerVerticalSliceTransition;
  fromStatus: CustomerVerticalSliceStatus;
  toStatus: CustomerVerticalSliceStatus;
  previousVersion: string;
  nextVersion: string;
  createdAt: string;
}

export interface CustomerVerticalSliceTransitionRepository {
  findState(input: {
    tenantId: string;
    inquiryId: string;
  }): Promise<CustomerVerticalSliceStateRecord | null>;

  findEventByIdempotencyKey(input: {
    tenantId: string;
    idempotencyKey: string;
  }): Promise<CustomerVerticalSliceTransitionEvent | null>;

  compareAndSet(input: {
    tenantId: string;
    inquiryId: string;
    expectedVersion: string;
    nextState: CustomerVerticalSliceStateRecord;
    event: CustomerVerticalSliceTransitionEvent;
  }): Promise<{
    applied: boolean;
    state: CustomerVerticalSliceStateRecord;
  }>;
}

export type CustomerVerticalSliceTransitionErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_CONTEXT"
  | "CROSS_TENANT_ACCESS"
  | "INVALID_REQUEST"
  | "LIFECYCLE_NOT_FOUND"
  | "INVALID_STATE_RECORD"
  | "STATE_TENANT_MISMATCH"
  | "STATE_INQUIRY_MISMATCH"
  | "ACTOR_ACCESS_DENIED"
  | "TRANSITION_NOT_ALLOWED"
  | "STALE_VERSION"
  | "INVALID_EVENT_RECORD"
  | "IDEMPOTENCY_CONFLICT"
  | "CONCURRENT_MODIFICATION"
  | "PERSISTENCE_MISMATCH";

export class CustomerVerticalSliceTransitionError extends Error {
  readonly code: CustomerVerticalSliceTransitionErrorCode;

  constructor(
    code: CustomerVerticalSliceTransitionErrorCode,
    message = "Customer vertical slice transition denied.",
  ) {
    super(message);
    this.name = "CustomerVerticalSliceTransitionError";
    this.code = code;
  }
}

function requireString(
  value: string | null | undefined,
  code: CustomerVerticalSliceTransitionErrorCode,
  maximumLength = 512,
): string {
  const normalized = value?.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new CustomerVerticalSliceTransitionError(code);
  }

  return normalized;
}

function requireTimestamp(
  value: string,
  code: CustomerVerticalSliceTransitionErrorCode,
): string {
  const normalized = requireString(value, code);

  if (Number.isNaN(Date.parse(normalized))) {
    throw new CustomerVerticalSliceTransitionError(code);
  }

  return normalized;
}

function isKnownRole(value: string): value is VerticalSliceActorRole {
  return (
    value === "owner" ||
    value === "customer" ||
    value === "service"
  );
}

function isKnownStatus(
  value: string,
): value is CustomerVerticalSliceStatus {
  return (
    value === "inquiry_received" ||
    value === "recommendation_ready" ||
    value === "owner_approved" ||
    value === "owner_rejected" ||
    value === "sandbox_executing" ||
    value === "sandbox_succeeded" ||
    value === "sandbox_failed" ||
    value === "result_released" ||
    value === "customer_acknowledged"
  );
}

function isKnownTransition(
  value: string,
): value is CustomerVerticalSliceTransition {
  return (
    value === "generate_recommendation" ||
    value === "approve_recommendation" ||
    value === "reject_recommendation" ||
    value === "start_sandbox_execution" ||
    value === "complete_sandbox_execution" ||
    value === "fail_sandbox_execution" ||
    value === "release_result" ||
    value === "acknowledge_result"
  );
}

function createStableIdentifier(
  prefix: string,
  source: string,
): string {
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `${prefix}_${(hash >>> 0)
    .toString(16)
    .padStart(8, "0")}`;
}

function validateStateRecord(
  state: CustomerVerticalSliceStateRecord,
): void {
  const requiredValues = [
    state.tenantId,
    state.inquiryId,
    state.customerId,
    state.ownerId,
    state.version,
    state.createdAt,
    state.updatedAt,
  ];

  if (
    requiredValues.some(
      (value) =>
        typeof value !== "string" ||
        !value.trim() ||
        value.length > 512,
    ) ||
    !isKnownStatus(state.status)
  ) {
    throw new CustomerVerticalSliceTransitionError(
      "INVALID_STATE_RECORD",
    );
  }

  requireTimestamp(
    state.createdAt,
    "INVALID_STATE_RECORD",
  );

  requireTimestamp(
    state.updatedAt,
    "INVALID_STATE_RECORD",
  );
}

function validateEventRecord(
  event: CustomerVerticalSliceTransitionEvent,
): void {
  const requiredValues = [
    event.eventId,
    event.idempotencyKey,
    event.tenantId,
    event.inquiryId,
    event.customerId,
    event.ownerId,
    event.actorId,
    event.previousVersion,
    event.nextVersion,
    event.createdAt,
  ];

  if (
    requiredValues.some(
      (value) =>
        typeof value !== "string" ||
        !value.trim() ||
        value.length > 512,
    ) ||
    !isKnownRole(event.actorRole) ||
    !isKnownTransition(event.transition) ||
    !isKnownStatus(event.fromStatus) ||
    !isKnownStatus(event.toStatus)
  ) {
    throw new CustomerVerticalSliceTransitionError(
      "INVALID_EVENT_RECORD",
    );
  }

  requireTimestamp(
    event.createdAt,
    "INVALID_EVENT_RECORD",
  );
}

function assertActorAuthority(input: {
  context: AuthenticatedVerticalSliceActor;
  state: CustomerVerticalSliceStateRecord;
  transition: CustomerVerticalSliceTransition;
}): void {
  const { context, state, transition } = input;
  const actorId = requireString(
    context.actorId,
    "INVALID_CONTEXT",
  );

  if (
    context.role === "owner" &&
    actorId !== state.ownerId
  ) {
    throw new CustomerVerticalSliceTransitionError(
      "ACTOR_ACCESS_DENIED",
    );
  }

  if (
    context.role === "customer" &&
    actorId !== state.customerId
  ) {
    throw new CustomerVerticalSliceTransitionError(
      "ACTOR_ACCESS_DENIED",
    );
  }

  const ownerTransitions: CustomerVerticalSliceTransition[] = [
    "generate_recommendation",
    "approve_recommendation",
    "reject_recommendation",
    "start_sandbox_execution",
    "complete_sandbox_execution",
    "fail_sandbox_execution",
    "release_result",
  ];

  const serviceTransitions: CustomerVerticalSliceTransition[] = [
    "generate_recommendation",
    "start_sandbox_execution",
    "complete_sandbox_execution",
    "fail_sandbox_execution",
  ];

  const customerTransitions: CustomerVerticalSliceTransition[] = [
    "acknowledge_result",
  ];

  const allowed =
    context.role === "owner"
      ? ownerTransitions.includes(transition)
      : context.role === "service"
        ? serviceTransitions.includes(transition)
        : customerTransitions.includes(transition);

  if (!allowed) {
    throw new CustomerVerticalSliceTransitionError(
      "ACTOR_ACCESS_DENIED",
    );
  }
}

function resolveNextStatus(input: {
  currentStatus: CustomerVerticalSliceStatus;
  transition: CustomerVerticalSliceTransition;
}): CustomerVerticalSliceStatus {
  const { currentStatus, transition } = input;

  const transitions: Record<
    CustomerVerticalSliceTransition,
    {
      from: CustomerVerticalSliceStatus;
      to: CustomerVerticalSliceStatus;
    }
  > = {
    generate_recommendation: {
      from: "inquiry_received",
      to: "recommendation_ready",
    },
    approve_recommendation: {
      from: "recommendation_ready",
      to: "owner_approved",
    },
    reject_recommendation: {
      from: "recommendation_ready",
      to: "owner_rejected",
    },
    start_sandbox_execution: {
      from: "owner_approved",
      to: "sandbox_executing",
    },
    complete_sandbox_execution: {
      from: "sandbox_executing",
      to: "sandbox_succeeded",
    },
    fail_sandbox_execution: {
      from: "sandbox_executing",
      to: "sandbox_failed",
    },
    release_result: {
      from: "sandbox_succeeded",
      to: "result_released",
    },
    acknowledge_result: {
      from: "result_released",
      to: "customer_acknowledged",
    },
  };

  const rule = transitions[transition];

  if (rule.from !== currentStatus) {
    throw new CustomerVerticalSliceTransitionError(
      "TRANSITION_NOT_ALLOWED",
    );
  }

  return rule.to;
}

function eventMatchesRequest(input: {
  event: CustomerVerticalSliceTransitionEvent;
  state: CustomerVerticalSliceStateRecord;
  context: AuthenticatedVerticalSliceActor;
  transition: CustomerVerticalSliceTransition;
  idempotencyKey: string;
}): boolean {
  const {
    event,
    state,
    context,
    transition,
    idempotencyKey,
  } = input;

  return (
    event.idempotencyKey === idempotencyKey &&
    event.tenantId === state.tenantId &&
    event.inquiryId === state.inquiryId &&
    event.customerId === state.customerId &&
    event.ownerId === state.ownerId &&
    event.actorId === context.actorId &&
    event.actorRole === context.role &&
    event.transition === transition
  );
}

function stateMatchesExpected(
  actual: CustomerVerticalSliceStateRecord,
  expected: CustomerVerticalSliceStateRecord,
): boolean {
  return (
    actual.tenantId === expected.tenantId &&
    actual.inquiryId === expected.inquiryId &&
    actual.customerId === expected.customerId &&
    actual.ownerId === expected.ownerId &&
    actual.status === expected.status &&
    actual.version === expected.version &&
    actual.createdAt === expected.createdAt &&
    actual.updatedAt === expected.updatedAt
  );
}

export async function applyCustomerVerticalSliceTransition(input: {
  context: AuthenticatedVerticalSliceActor;
  requestedTenantId: string;
  inquiryId: string;
  expectedVersion: string;
  transition: CustomerVerticalSliceTransition;
  idempotencyKey: string;
  repository: CustomerVerticalSliceTransitionRepository;
  nowIso?: string;
}): Promise<{
  applied: boolean;
  idempotent: boolean;
  state: CustomerVerticalSliceStateRecord;
  event: CustomerVerticalSliceTransitionEvent;
}> {
  if (input.context.authenticated !== true) {
    throw new CustomerVerticalSliceTransitionError(
      "UNAUTHENTICATED",
    );
  }

  if (!isKnownRole(input.context.role)) {
    throw new CustomerVerticalSliceTransitionError(
      "INVALID_CONTEXT",
    );
  }

  const contextTenantId = requireString(
    input.context.tenantId,
    "INVALID_CONTEXT",
  );

  requireString(
    input.context.actorId,
    "INVALID_CONTEXT",
  );

  const requestedTenantId = requireString(
    input.requestedTenantId,
    "CROSS_TENANT_ACCESS",
  );

  if (requestedTenantId !== contextTenantId) {
    throw new CustomerVerticalSliceTransitionError(
      "CROSS_TENANT_ACCESS",
    );
  }

  const inquiryId = requireString(
    input.inquiryId,
    "INVALID_REQUEST",
  );

  const expectedVersion = requireString(
    input.expectedVersion,
    "INVALID_REQUEST",
  );

  const idempotencyKey = requireString(
    input.idempotencyKey,
    "INVALID_REQUEST",
    256,
  );

  if (!isKnownTransition(input.transition)) {
    throw new CustomerVerticalSliceTransitionError(
      "INVALID_REQUEST",
    );
  }

  const state = await input.repository.findState({
    tenantId: contextTenantId,
    inquiryId,
  });

  if (!state) {
    throw new CustomerVerticalSliceTransitionError(
      "LIFECYCLE_NOT_FOUND",
    );
  }

  validateStateRecord(state);

  if (state.tenantId !== contextTenantId) {
    throw new CustomerVerticalSliceTransitionError(
      "STATE_TENANT_MISMATCH",
    );
  }

  if (state.inquiryId !== inquiryId) {
    throw new CustomerVerticalSliceTransitionError(
      "STATE_INQUIRY_MISMATCH",
    );
  }

  assertActorAuthority({
    context: input.context,
    state,
    transition: input.transition,
  });

  const existingEvent =
    await input.repository.findEventByIdempotencyKey({
      tenantId: contextTenantId,
      idempotencyKey,
    });

  if (existingEvent) {
    validateEventRecord(existingEvent);

    if (
      !eventMatchesRequest({
        event: existingEvent,
        state,
        context: input.context,
        transition: input.transition,
        idempotencyKey,
      })
    ) {
      throw new CustomerVerticalSliceTransitionError(
        "IDEMPOTENCY_CONFLICT",
      );
    }

    return {
      applied: false,
      idempotent: true,
      state,
      event: existingEvent,
    };
  }

  if (state.version !== expectedVersion) {
    throw new CustomerVerticalSliceTransitionError(
      "STALE_VERSION",
    );
  }

  const nextStatus = resolveNextStatus({
    currentStatus: state.status,
    transition: input.transition,
  });

  const timestamp = input.nowIso ?? new Date().toISOString();

  if (Number.isNaN(Date.parse(timestamp))) {
    throw new CustomerVerticalSliceTransitionError(
      "INVALID_REQUEST",
    );
  }

  const nextVersion = createStableIdentifier(
    "lsv1",
    [
      state.version,
      state.tenantId,
      state.inquiryId,
      input.transition,
      nextStatus,
      idempotencyKey,
    ].join("|"),
  );

  const eventId = createStableIdentifier(
    "lse1",
    [
      state.tenantId,
      state.inquiryId,
      idempotencyKey,
      input.transition,
    ].join("|"),
  );

  const nextState: CustomerVerticalSliceStateRecord = {
    ...state,
    status: nextStatus,
    version: nextVersion,
    updatedAt: timestamp,
  };

  const event: CustomerVerticalSliceTransitionEvent = {
    eventId,
    idempotencyKey,
    tenantId: state.tenantId,
    inquiryId: state.inquiryId,
    customerId: state.customerId,
    ownerId: state.ownerId,
    actorId: input.context.actorId!,
    actorRole: input.context.role,
    transition: input.transition,
    fromStatus: state.status,
    toStatus: nextStatus,
    previousVersion: state.version,
    nextVersion,
    createdAt: timestamp,
  };

  const persisted = await input.repository.compareAndSet({
    tenantId: contextTenantId,
    inquiryId,
    expectedVersion,
    nextState,
    event,
  });

  if (!persisted.applied) {
    throw new CustomerVerticalSliceTransitionError(
      "CONCURRENT_MODIFICATION",
    );
  }

  validateStateRecord(persisted.state);

  if (!stateMatchesExpected(persisted.state, nextState)) {
    throw new CustomerVerticalSliceTransitionError(
      "PERSISTENCE_MISMATCH",
    );
  }

  return {
    applied: true,
    idempotent: false,
    state: persisted.state,
    event,
  };
}
