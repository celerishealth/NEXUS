import type { ClaimedSandboxOutboxRecord } from "./sandboxOutboxLeaseRepository";

export interface SandboxHandlerContext {
  readonly tenantId: string;
  readonly outboxId: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly actionKind: string;
  readonly idempotencyKey: string;
  readonly attemptCount: number;
  readonly leaseOwner: string;
  readonly leaseToken: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly signal: AbortSignal;
}

export interface SandboxHandlerOutput {
  readonly resultId: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export type SandboxActionHandler = (
  context: SandboxHandlerContext,
) => Promise<SandboxHandlerOutput>;

export interface SandboxActionHandlerDefinition {
  readonly actionKind: string;
  readonly handler: SandboxActionHandler;
}

export interface ExecuteSandboxClaimedWorkOptions {
  readonly timeoutMilliseconds?: number;
}

export interface ValidatedSandboxExecutionResult {
  readonly tenantId: string;
  readonly outboxId: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly actionKind: string;
  readonly idempotencyKey: string;
  readonly attemptCount: number;
  readonly leaseOwner: string;
  readonly leaseToken: string;
  readonly resultId: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly payloadCanonical: string;
}

export interface SandboxHandlerRegistry {
  readonly actionKinds: readonly string[];

  execute(
    claimedRecord: ClaimedSandboxOutboxRecord,
    options?: ExecuteSandboxClaimedWorkOptions,
  ): Promise<ValidatedSandboxExecutionResult>;
}

export class SandboxWorkerBoundaryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxWorkerBoundaryValidationError";
  }
}

export class SandboxHandlerExecutionError extends Error {
  readonly safeCode: string;
  readonly retryable: boolean;

  constructor(safeCode: string, retryable: boolean) {
    super("Sandbox handler execution failed.");
    this.name = "SandboxHandlerExecutionError";
    this.safeCode = requireSafeErrorCode(safeCode);
    this.retryable = requireBoolean(retryable, "retryable");
  }
}

export class SandboxHandlerNotRegisteredError extends SandboxHandlerExecutionError {
  constructor() {
    super("sandbox_handler_not_registered", false);
    this.name = "SandboxHandlerNotRegisteredError";
  }
}

export class SandboxHandlerTimeoutError extends SandboxHandlerExecutionError {
  constructor() {
    super("sandbox_handler_timeout", true);
    this.name = "SandboxHandlerTimeoutError";
  }
}

export class SandboxHandlerInvalidOutputError extends SandboxHandlerExecutionError {
  constructor() {
    super("sandbox_handler_invalid_output", false);
    this.name = "SandboxHandlerInvalidOutputError";
  }
}

export class SandboxHandlerUnexpectedError extends SandboxHandlerExecutionError {
  constructor() {
    super("sandbox_handler_unexpected_error", true);
    this.name = "SandboxHandlerUnexpectedError";
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SANDBOX_ACTION_PATTERN =
  /^sandbox\.[a-z0-9][a-z0-9._-]{0,119}$/;

const SAFE_ERROR_CODE_PATTERN =
  /^sandbox_[a-z0-9][a-z0-9._-]{0,119}$/;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._-]{0,63}$/;

const BLOCKED_OBJECT_KEYS = new Set([
  "__proto__",
  "prototype",
  "constructor",
]);

const MAX_HANDLER_DEFINITIONS = 100;
const MAX_JSON_DEPTH = 24;
const MAX_JSON_NODES = 5000;
const MAX_CANONICAL_PAYLOAD_LENGTH = 65536;
const DEFAULT_TIMEOUT_MILLISECONDS = 5000;
const MIN_TIMEOUT_MILLISECONDS = 10;
const MAX_TIMEOUT_MILLISECONDS = 30000;

interface JsonTraversalState {
  nodes: number;
  readonly seen: Set<object>;
}

function requireBoolean(
  value: boolean,
  fieldName: string,
): boolean {
  if (typeof value !== "boolean") {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} must be a boolean.`,
    );
  }

  return value;
}

function requireUuid(value: string, fieldName: string): string {
  if (typeof value !== "string") {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} must be a UUID string.`,
    );
  }

  const normalized = value.trim().toLowerCase();

  if (!UUID_PATTERN.test(normalized)) {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} must be a valid UUID.`,
    );
  }

  return normalized;
}

function requireSandboxActionKind(value: string): string {
  if (typeof value !== "string") {
    throw new SandboxWorkerBoundaryValidationError(
      "actionKind must be a string.",
    );
  }

  const normalized = value.trim();

  if (!SANDBOX_ACTION_PATTERN.test(normalized)) {
    throw new SandboxWorkerBoundaryValidationError(
      "Only explicit sandbox action identifiers are allowed.",
    );
  }

  return normalized;
}

function requireSafeIdentifier(
  value: string,
  fieldName: string,
): string {
  if (typeof value !== "string") {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} must be a string.`,
    );
  }

  const normalized = value.trim();

  if (!SAFE_IDENTIFIER_PATTERN.test(normalized)) {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} must contain 1-64 lowercase safe identifier characters.`,
    );
  }

  return normalized;
}

function requireSafeText(
  value: string,
  fieldName: string,
  maximumLength: number,
): string {
  if (typeof value !== "string") {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} must be a string.`,
    );
  }

  const normalized = value.trim();

  if (
    normalized.length < 1 ||
    normalized.length > maximumLength ||
    /[\u0000-\u001f\u007f]/.test(normalized)
  ) {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} is invalid.`,
    );
  }

  return normalized;
}

function requireSafeErrorCode(value: string): string {
  if (typeof value !== "string") {
    throw new SandboxWorkerBoundaryValidationError(
      "safeCode must be a string.",
    );
  }

  const normalized = value.trim();

  if (!SAFE_ERROR_CODE_PATTERN.test(normalized)) {
    throw new SandboxWorkerBoundaryValidationError(
      "safeCode must be a safe sandbox error identifier.",
    );
  }

  return normalized;
}

function requireNonNegativeInteger(
  value: number,
  fieldName: string,
): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} must be a non-negative safe integer.`,
    );
  }

  return value;
}

function requireTimeoutMilliseconds(
  value: number | undefined,
): number {
  const normalized =
    value === undefined
      ? DEFAULT_TIMEOUT_MILLISECONDS
      : value;

  if (
    !Number.isInteger(normalized) ||
    normalized < MIN_TIMEOUT_MILLISECONDS ||
    normalized > MAX_TIMEOUT_MILLISECONDS
  ) {
    throw new SandboxWorkerBoundaryValidationError(
      `timeoutMilliseconds must be an integer between ${MIN_TIMEOUT_MILLISECONDS} and ${MAX_TIMEOUT_MILLISECONDS}.`,
    );
  }

  return normalized;
}

function isPlainObject(
  value: unknown,
): value is Readonly<Record<string, unknown>> {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

function cloneAndFreezeJson(
  value: unknown,
  state: JsonTraversalState,
  depth: number,
): unknown {
  if (depth > MAX_JSON_DEPTH) {
    throw new SandboxWorkerBoundaryValidationError(
      "JSON payload exceeds the maximum supported depth.",
    );
  }

  state.nodes += 1;

  if (state.nodes > MAX_JSON_NODES) {
    throw new SandboxWorkerBoundaryValidationError(
      "JSON payload exceeds the maximum supported node count.",
    );
  }

  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new SandboxWorkerBoundaryValidationError(
        "JSON payload must not contain non-finite numbers.",
      );
    }

    return value;
  }

  if (
    typeof value === "undefined" ||
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  ) {
    throw new SandboxWorkerBoundaryValidationError(
      "JSON payload contains an unsupported value.",
    );
  }

  if (typeof value !== "object") {
    throw new SandboxWorkerBoundaryValidationError(
      "JSON payload contains an unsupported value.",
    );
  }

  if (state.seen.has(value)) {
    throw new SandboxWorkerBoundaryValidationError(
      "JSON payload must not contain circular references.",
    );
  }

  state.seen.add(value);

  try {
    if (Array.isArray(value)) {
      return Object.freeze(
        value.map((item) =>
          cloneAndFreezeJson(
            item,
            state,
            depth + 1,
          ),
        ),
      );
    }

    if (!isPlainObject(value)) {
      throw new SandboxWorkerBoundaryValidationError(
        "JSON payload must contain only plain objects.",
      );
    }

    const cloned: Record<string, unknown> = {};

    for (const key of Object.keys(value).sort()) {
      if (BLOCKED_OBJECT_KEYS.has(key)) {
        throw new SandboxWorkerBoundaryValidationError(
          "JSON payload contains a blocked object key.",
        );
      }

      cloned[key] = cloneAndFreezeJson(
        value[key],
        state,
        depth + 1,
      );
    }

    return Object.freeze(cloned);
  } finally {
    state.seen.delete(value);
  }
}

function stableSerialize(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }

  if (isPlainObject(value)) {
    const entries = Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableSerialize(value[key])}`,
      );

    return `{${entries.join(",")}}`;
  }

  throw new SandboxWorkerBoundaryValidationError(
    "Unable to serialize non-JSON value.",
  );
}

function prepareJsonObject(
  value: unknown,
  fieldName: string,
): {
  readonly value: Readonly<Record<string, unknown>>;
  readonly canonical: string;
} {
  if (!isPlainObject(value)) {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} must be a plain JSON object.`,
    );
  }

  const cloned = cloneAndFreezeJson(
    value,
    {
      nodes: 0,
      seen: new Set<object>(),
    },
    0,
  );

  if (!isPlainObject(cloned)) {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} must remain a JSON object.`,
    );
  }

  const canonical = stableSerialize(cloned);

  if (
    canonical.length < 2 ||
    canonical.length > MAX_CANONICAL_PAYLOAD_LENGTH
  ) {
    throw new SandboxWorkerBoundaryValidationError(
      `${fieldName} canonical representation exceeds the allowed size.`,
    );
  }

  return Object.freeze({
    value: cloned,
    canonical,
  });
}

function requireExactHandlerOutputShape(
  value: unknown,
): SandboxHandlerOutput {
  if (!isPlainObject(value)) {
    throw new SandboxHandlerInvalidOutputError();
  }

  const keys = Object.keys(value).sort();

  if (
    keys.length !== 2 ||
    keys[0] !== "payload" ||
    keys[1] !== "resultId"
  ) {
    throw new SandboxHandlerInvalidOutputError();
  }

  return value as unknown as SandboxHandlerOutput;
}

function validateClaimedRecord(
  record: ClaimedSandboxOutboxRecord,
): {
  readonly tenantId: string;
  readonly outboxId: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly actionKind: string;
  readonly idempotencyKey: string;
  readonly attemptCount: number;
  readonly leaseOwner: string;
  readonly leaseToken: string;
  readonly payload: Readonly<Record<string, unknown>>;
} {
  if (!record || typeof record !== "object") {
    throw new SandboxWorkerBoundaryValidationError(
      "A claimed sandbox outbox record is required.",
    );
  }

  const preparedPayload = prepareJsonObject(
    record.payload,
    "claimed payload",
  );

  return Object.freeze({
    tenantId: requireUuid(
      record.tenantId,
      "tenantId",
    ),
    outboxId: requireUuid(
      record.outboxId,
      "outboxId",
    ),
    aggregateType: requireSafeIdentifier(
      record.aggregateType,
      "aggregateType",
    ),
    aggregateId: requireUuid(
      record.aggregateId,
      "aggregateId",
    ),
    actionKind: requireSandboxActionKind(
      record.actionKind,
    ),
    idempotencyKey: requireSafeText(
      record.idempotencyKey,
      "idempotencyKey",
      128,
    ),
    attemptCount: requireNonNegativeInteger(
      record.attemptCount,
      "attemptCount",
    ),
    leaseOwner: requireSafeText(
      record.leaseOwner,
      "leaseOwner",
      128,
    ),
    leaseToken: requireUuid(
      record.leaseToken,
      "leaseToken",
    ),
    payload: preparedPayload.value,
  });
}

function requireHandlerDefinition(
  definition: SandboxActionHandlerDefinition,
): {
  readonly actionKind: string;
  readonly handler: SandboxActionHandler;
} {
  if (!definition || typeof definition !== "object") {
    throw new SandboxWorkerBoundaryValidationError(
      "Every sandbox handler definition must be an object.",
    );
  }

  const actionKind = requireSandboxActionKind(
    definition.actionKind,
  );

  if (typeof definition.handler !== "function") {
    throw new SandboxWorkerBoundaryValidationError(
      `Sandbox handler ${actionKind} must be a function.`,
    );
  }

  return Object.freeze({
    actionKind,
    handler: definition.handler,
  });
}

async function executeWithTimeout(
  handler: SandboxActionHandler,
  context: SandboxHandlerContext,
  timeoutMilliseconds: number,
  controller: AbortController,
): Promise<SandboxHandlerOutput> {
  let timeoutHandle:
    | ReturnType<typeof setTimeout>
    | undefined;

  const timeoutPromise =
    new Promise<SandboxHandlerOutput>(
      (_resolve, reject) => {
        timeoutHandle = setTimeout(() => {
          controller.abort();
          reject(new SandboxHandlerTimeoutError());
        }, timeoutMilliseconds);
      },
    );

  try {
    return await Promise.race([
      Promise.resolve().then(() => handler(context)),
      timeoutPromise,
    ]);
  } finally {
    if (timeoutHandle !== undefined) {
      clearTimeout(timeoutHandle);
    }
  }
}

function normalizeExecutionError(
  error: unknown,
): SandboxHandlerExecutionError {
  if (error instanceof SandboxHandlerExecutionError) {
    return error;
  }

  return new SandboxHandlerUnexpectedError();
}

/**
 * Creates an immutable, exact-match sandbox handler registry.
 *
 * Safety properties:
 * - Only explicit sandbox.* actions can be registered.
 * - Duplicate actions fail closed.
 * - No dynamic import, eval or action-name-derived execution occurs.
 * - Claimed payloads are cloned and deeply frozen before handler access.
 * - Prototype-pollution keys, circular values and unsupported JSON fail.
 * - Handler runtime is bounded and receives an AbortSignal.
 * - Handler output uses an exact structured contract.
 * - Unknown exceptions are converted to a non-sensitive safe error code.
 */
export function createSandboxHandlerRegistry(
  definitions: readonly SandboxActionHandlerDefinition[],
): SandboxHandlerRegistry {
  if (!Array.isArray(definitions)) {
    throw new SandboxWorkerBoundaryValidationError(
      "Sandbox handler definitions must be an array.",
    );
  }

  if (
    definitions.length < 1 ||
    definitions.length > MAX_HANDLER_DEFINITIONS
  ) {
    throw new SandboxWorkerBoundaryValidationError(
      `Sandbox handler definitions must contain between 1 and ${MAX_HANDLER_DEFINITIONS} entries.`,
    );
  }

  const handlers =
    new Map<string, SandboxActionHandler>();

  for (const definitionInput of definitions) {
    const definition =
      requireHandlerDefinition(definitionInput);

    if (handlers.has(definition.actionKind)) {
      throw new SandboxWorkerBoundaryValidationError(
        `Duplicate sandbox handler registration: ${definition.actionKind}.`,
      );
    }

    handlers.set(
      definition.actionKind,
      definition.handler,
    );
  }

  const actionKinds = Object.freeze(
    Array.from(handlers.keys()).sort(),
  );

  const registry: SandboxHandlerRegistry = {
    actionKinds,

    async execute(
      claimedRecord: ClaimedSandboxOutboxRecord,
      options: ExecuteSandboxClaimedWorkOptions = {},
    ): Promise<ValidatedSandboxExecutionResult> {
      const record = validateClaimedRecord(
        claimedRecord,
      );

      const timeoutMilliseconds =
        requireTimeoutMilliseconds(
          options.timeoutMilliseconds,
        );

      const handler = handlers.get(
        record.actionKind,
      );

      if (!handler) {
        throw new SandboxHandlerNotRegisteredError();
      }

      const controller = new AbortController();

      const handlerContext: SandboxHandlerContext =
        Object.freeze({
          tenantId: record.tenantId,
          outboxId: record.outboxId,
          aggregateType: record.aggregateType,
          aggregateId: record.aggregateId,
          actionKind: record.actionKind,
          idempotencyKey: record.idempotencyKey,
          attemptCount: record.attemptCount,
          leaseOwner: record.leaseOwner,
          leaseToken: record.leaseToken,
          payload: record.payload,
          signal: controller.signal,
        });

      let rawOutput: SandboxHandlerOutput;

      try {
        rawOutput = await executeWithTimeout(
          handler,
          handlerContext,
          timeoutMilliseconds,
          controller,
        );
      } catch (error) {
        throw normalizeExecutionError(error);
      }

      let output: SandboxHandlerOutput;
      let resultId: string;
      let preparedPayload: {
        readonly value: Readonly<Record<string, unknown>>;
        readonly canonical: string;
      };

      try {
        output = requireExactHandlerOutputShape(
          rawOutput,
        );

        resultId = requireUuid(
          output.resultId,
          "resultId",
        );

        preparedPayload = prepareJsonObject(
          output.payload,
          "handler result payload",
        );
      } catch (error) {
        if (
          error instanceof SandboxHandlerExecutionError
        ) {
          throw error;
        }

        throw new SandboxHandlerInvalidOutputError();
      }

      return Object.freeze({
        tenantId: record.tenantId,
        outboxId: record.outboxId,
        aggregateType: record.aggregateType,
        aggregateId: record.aggregateId,
        actionKind: record.actionKind,
        idempotencyKey: record.idempotencyKey,
        attemptCount: record.attemptCount,
        leaseOwner: record.leaseOwner,
        leaseToken: record.leaseToken,
        resultId,
        payload: preparedPayload.value,
        payloadCanonical:
          preparedPayload.canonical,
      });
    },
  };

  return Object.freeze(registry);
}
