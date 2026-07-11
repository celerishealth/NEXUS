import type {
  SandboxWorkerCycleCommandRuntime,
} from "./sandboxWorkerCycleCommand";

import type {
  WithPostgresSandboxReceiptTransaction,
} from "./postgresSandboxWorkerCommandReceiptRepository";

import {
  createPostgresInternalPilotSessionResolver,
  type PostgresInternalPilotSessionQuery,
} from "./postgresInternalPilotSessionResolver";

import {
  createInternalPilotSandboxWorkerRouteComposition,
} from "./internalPilotSandboxWorkerRouteComposition";

import type {
  InternalPilotSandboxWorkerRoute,
} from "./internalPilotSandboxWorkerRoute";

export type PostgresBackedInternalPilotRouteErrorCode =
  | "INVALID_CONFIGURATION";

export class PostgresBackedInternalPilotRouteError extends Error {
  readonly code: PostgresBackedInternalPilotRouteErrorCode;

  constructor(
    code: PostgresBackedInternalPilotRouteErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PostgresBackedInternalPilotRouteError";
    this.code = code;
  }
}

export interface PostgresBackedInternalPilotRouteRuntime {
  tenantId: string;
  allowedOrigins: readonly string[];
  sessionQuery: PostgresInternalPilotSessionQuery;
  withReceiptTransaction: WithPostgresSandboxReceiptTransaction;
  commandRuntime: Omit<
    SandboxWorkerCycleCommandRuntime,
    "tenantId" | "now"
  >;
  sessionCookieName?: string;
  maxCookieHeaderBytes?: number;
  maxBodyBytes?: number;
  now?: () => Date;
}

function configurationError(
  message: string,
): PostgresBackedInternalPilotRouteError {
  return new PostgresBackedInternalPilotRouteError(
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
): asserts runtime is PostgresBackedInternalPilotRouteRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isTenantIdentifier(runtime.tenantId) ||
    !Array.isArray(runtime.allowedOrigins) ||
    runtime.allowedOrigins.length < 1 ||
    typeof runtime.sessionQuery !== "function" ||
    typeof runtime.withReceiptTransaction !== "function" ||
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
        typeof runtime.maxCookieHeaderBytes !== "number" ||
        !Number.isInteger(runtime.maxCookieHeaderBytes) ||
        runtime.maxCookieHeaderBytes < 512 ||
        runtime.maxCookieHeaderBytes > 16_384
      )
    ) ||
    (
      runtime.maxBodyBytes !== undefined &&
      (
        typeof runtime.maxBodyBytes !== "number" ||
        !Number.isInteger(runtime.maxBodyBytes) ||
        runtime.maxBodyBytes < 1_024 ||
        runtime.maxBodyBytes > 65_536
      )
    )
  ) {
    throw configurationError(
      "Postgres-backed internal pilot route configuration is invalid.",
    );
  }
}

export function createPostgresBackedInternalPilotSandboxWorkerRoute(
  runtime: PostgresBackedInternalPilotRouteRuntime,
): InternalPilotSandboxWorkerRoute {
  validateRuntime(runtime);

  const now = runtime.now ?? (() => new Date());

  try {
    const resolveSession =
      createPostgresInternalPilotSessionResolver({
        tenantId: runtime.tenantId,
        query: runtime.sessionQuery,
        now,
        cookieName: runtime.sessionCookieName,
        maxCookieHeaderBytes:
          runtime.maxCookieHeaderBytes,
      });

    return createInternalPilotSandboxWorkerRouteComposition({
      tenantId: runtime.tenantId,
      allowedOrigins: runtime.allowedOrigins,
      resolveSession,
      withReceiptTransaction:
        runtime.withReceiptTransaction,
      commandRuntime: runtime.commandRuntime,
      maxBodyBytes: runtime.maxBodyBytes,
      now,
    });
  } catch {
    throw configurationError(
      "Postgres-backed internal pilot route dependencies could not be composed safely.",
    );
  }
}
