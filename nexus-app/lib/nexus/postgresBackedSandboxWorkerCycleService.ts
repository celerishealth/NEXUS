import {
  createAuthenticatedOwnerSandboxWorkerCommand,
  type SandboxWorkerCycleCommandRequest,
  type SandboxWorkerCycleCommandResult,
  type SandboxWorkerCycleCommandRuntime,
  type TrustedSandboxWorkerActor,
} from "./sandboxWorkerCycleCommand";

import {
  createIdempotentSandboxWorkerCycleCommand,
  type SandboxWorkerCycleCommandExecutor,
} from "./idempotentSandboxWorkerCycleCommand";

import {
  createPostgresSandboxWorkerCommandReceiptRepository,
  type WithPostgresSandboxReceiptTransaction,
} from "./postgresSandboxWorkerCommandReceiptRepository";

export type PostgresBackedSandboxWorkerServiceErrorCode =
  | "INVALID_CONFIGURATION";

export class PostgresBackedSandboxWorkerServiceError extends Error {
  readonly code: PostgresBackedSandboxWorkerServiceErrorCode;

  constructor(
    code: PostgresBackedSandboxWorkerServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PostgresBackedSandboxWorkerServiceError";
    this.code = code;
  }
}

export interface PostgresBackedSandboxWorkerCycleServiceRuntime {
  tenantId: string;
  withReceiptTransaction: WithPostgresSandboxReceiptTransaction;
  commandRuntime: Omit<
    SandboxWorkerCycleCommandRuntime,
    "tenantId" | "now"
  >;
  now?: () => Date;
}

export interface PostgresBackedSandboxWorkerCycleService {
  execute(
    actor: TrustedSandboxWorkerActor,
    request: SandboxWorkerCycleCommandRequest,
  ): Promise<SandboxWorkerCycleCommandResult>;
}

function serviceError(
  message: string,
): PostgresBackedSandboxWorkerServiceError {
  return new PostgresBackedSandboxWorkerServiceError(
    "INVALID_CONFIGURATION",
    message,
  );
}

function isPlainRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function assertTenantIdentifier(
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    value.length < 3 ||
    value.length > 128 ||
    !/^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(value)
  ) {
    throw serviceError(
      "Postgres-backed sandbox worker tenant configuration is invalid.",
    );
  }
}

function assertRuntime(
  runtime: unknown,
): asserts runtime is PostgresBackedSandboxWorkerCycleServiceRuntime {
  if (!isPlainRecord(runtime)) {
    throw serviceError(
      "Postgres-backed sandbox worker runtime is invalid.",
    );
  }

  assertTenantIdentifier(runtime.tenantId);

  if (
    typeof runtime.withReceiptTransaction !== "function" ||
    !isPlainRecord(runtime.commandRuntime)
  ) {
    throw serviceError(
      "Postgres-backed sandbox worker dependencies are invalid.",
    );
  }

  if (
    runtime.now !== undefined &&
    typeof runtime.now !== "function"
  ) {
    throw serviceError(
      "Postgres-backed sandbox worker clock is invalid.",
    );
  }
}

export function createPostgresBackedSandboxWorkerCycleService(
  runtime: PostgresBackedSandboxWorkerCycleServiceRuntime,
): PostgresBackedSandboxWorkerCycleService {
  assertRuntime(runtime);

  const now = runtime.now ?? (() => new Date());

  const authenticatedOwnerCommand =
    createAuthenticatedOwnerSandboxWorkerCommand({
      ...runtime.commandRuntime,
      tenantId: runtime.tenantId,
      now,
    });

  const receiptRepository =
    createPostgresSandboxWorkerCommandReceiptRepository({
      withTransaction: runtime.withReceiptTransaction,
    });

  const idempotentCommand: SandboxWorkerCycleCommandExecutor =
    createIdempotentSandboxWorkerCycleCommand({
      tenantId: runtime.tenantId,
      command: authenticatedOwnerCommand,
      repository: receiptRepository,
      now,
    });

  return Object.freeze({
    execute(
      actor: TrustedSandboxWorkerActor,
      request: SandboxWorkerCycleCommandRequest,
    ): Promise<SandboxWorkerCycleCommandResult> {
      return idempotentCommand(actor, request);
    },
  });
}
