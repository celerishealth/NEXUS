import type {
  SandboxWorkerCycleCommandRuntime,
} from "./sandboxWorkerCycleCommand";

import type {
  WithPostgresSandboxReceiptTransaction,
} from "./postgresSandboxWorkerCommandReceiptRepository";

import type {
  PostgresInternalPilotSessionQuery,
} from "./postgresInternalPilotSessionResolver";

import {
  createPostgresInternalPilotCommandAuditAppender,
} from "./postgresInternalPilotCommandAuditRepository";

import {
  createPostgresBackedInternalPilotSandboxWorkerRoute,
} from "./postgresBackedInternalPilotSandboxWorkerRoute";

import type {
  InternalPilotSandboxWorkerRoute,
} from "./internalPilotSandboxWorkerRoute";

export type PostgresAuditedInternalPilotRouteErrorCode =
  | "INVALID_CONFIGURATION";

export class PostgresAuditedInternalPilotRouteError extends Error {
  readonly code: PostgresAuditedInternalPilotRouteErrorCode;

  constructor(
    code: PostgresAuditedInternalPilotRouteErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PostgresAuditedInternalPilotRouteError";
    this.code = code;
  }
}

export interface PostgresAuditedInternalPilotRouteRuntime {
  tenantId: string;
  allowedOrigins: readonly string[];
  sessionQuery: PostgresInternalPilotSessionQuery;
  withReceiptTransaction: WithPostgresSandboxReceiptTransaction;
  withAuditTransaction: WithPostgresSandboxReceiptTransaction;
  commandRuntime: Omit<
    SandboxWorkerCycleCommandRuntime,
    "tenantId" | "now" | "appendAudit"
  >;
  sessionCookieName?: string;
  maxCookieHeaderBytes?: number;
  maxBodyBytes?: number;
  now?: () => Date;
}

function configurationError(
  message: string,
): PostgresAuditedInternalPilotRouteError {
  return new PostgresAuditedInternalPilotRouteError(
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

function isTenantIdentifier(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= 3 &&
    value.length <= 128 &&
    /^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(value)
  );
}

function validateRuntime(
  runtime: unknown,
): asserts runtime is PostgresAuditedInternalPilotRouteRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isTenantIdentifier(runtime.tenantId) ||
    !Array.isArray(runtime.allowedOrigins) ||
    runtime.allowedOrigins.length < 1 ||
    typeof runtime.sessionQuery !== "function" ||
    typeof runtime.withReceiptTransaction !== "function" ||
    typeof runtime.withAuditTransaction !== "function" ||
    !isPlainRecord(runtime.commandRuntime) ||
    (
      runtime.now !== undefined &&
      typeof runtime.now !== "function"
    ) ||
    (
      runtime.sessionCookieName !== undefined &&
      (
        typeof runtime.sessionCookieName !== "string" ||
        runtime.sessionCookieName.length < 3 ||
        runtime.sessionCookieName.length > 64 ||
        !/^[A-Za-z0-9_-]+$/.test(
          runtime.sessionCookieName,
        )
      )
    ) ||
    (
      runtime.maxCookieHeaderBytes !== undefined &&
      (
        !Number.isInteger(runtime.maxCookieHeaderBytes) ||
        runtime.maxCookieHeaderBytes < 512 ||
        runtime.maxCookieHeaderBytes > 16_384
      )
    ) ||
    (
      runtime.maxBodyBytes !== undefined &&
      (
        !Number.isInteger(runtime.maxBodyBytes) ||
        runtime.maxBodyBytes < 1_024 ||
        runtime.maxBodyBytes > 65_536
      )
    )
  ) {
    throw configurationError(
      "Postgres-audited internal pilot route configuration is invalid.",
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      runtime.commandRuntime,
      "appendAudit",
    )
  ) {
    throw configurationError(
      "External audit dependency injection is forbidden.",
    );
  }
}

export function createPostgresAuditedInternalPilotSandboxWorkerRoute(
  runtime: PostgresAuditedInternalPilotRouteRuntime,
): InternalPilotSandboxWorkerRoute {
  validateRuntime(runtime);

  const now = runtime.now ?? (() => new Date());

  try {
    const appendAudit =
      createPostgresInternalPilotCommandAuditAppender({
        withTransaction:
          runtime.withAuditTransaction,
      });

    return createPostgresBackedInternalPilotSandboxWorkerRoute({
      tenantId: runtime.tenantId,
      allowedOrigins: runtime.allowedOrigins,
      sessionQuery: runtime.sessionQuery,
      withReceiptTransaction:
        runtime.withReceiptTransaction,
      sessionCookieName:
        runtime.sessionCookieName,
      maxCookieHeaderBytes:
        runtime.maxCookieHeaderBytes,
      maxBodyBytes: runtime.maxBodyBytes,
      now,
      commandRuntime: {
        ...runtime.commandRuntime,
        appendAudit,
      },
    });
  } catch {
    throw configurationError(
      "Postgres-audited internal pilot route dependencies could not be composed safely.",
    );
  }
}
