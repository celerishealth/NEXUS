import type {
  SandboxWorkerCycleCommandRuntime,
} from "./sandboxWorkerCycleCommand";

import type {
  PostgresInternalPilotSessionQuery,
} from "./postgresInternalPilotSessionResolver";

import type {
  WithPostgresSandboxReceiptTransaction,
} from "./postgresSandboxWorkerCommandReceiptRepository";

import {
  createPostgresBackedInternalPilotSessionLifecycleRoute,
} from "./postgresBackedInternalPilotSessionLifecycleRoute";

import {
  createPostgresAuditedInternalPilotSandboxWorkerRoute,
} from "./postgresAuditedInternalPilotSandboxWorkerRoute";

import {
  createControlledInternalPilotProductionApiRouter,
} from "./controlledInternalPilotProductionApiRouter";

import {
  createControlledInternalPilotFetchApiAdapter,
  type ControlledInternalPilotFetchApiHandler,
} from "./controlledInternalPilotFetchApiAdapter";

export type ControlledInternalPilotProductionServerErrorCode =
  | "INVALID_CONFIGURATION";

export class ControlledInternalPilotProductionServerError extends Error {
  readonly code:
    ControlledInternalPilotProductionServerErrorCode;

  constructor(
    code:
      ControlledInternalPilotProductionServerErrorCode,
    message: string,
  ) {
    super(message);
    this.name =
      "ControlledInternalPilotProductionServerError";
    this.code = code;
  }
}

export interface ControlledInternalPilotProductionServerRuntime {
  tenantId: string;
  allowedOrigins: readonly string[];
  allowedHosts: readonly string[];
  sessionQuery: PostgresInternalPilotSessionQuery;
  withLifecycleTransaction:
    WithPostgresSandboxReceiptTransaction;
  withReceiptTransaction:
    WithPostgresSandboxReceiptTransaction;
  withAuditTransaction:
    WithPostgresSandboxReceiptTransaction;
  commandRuntime: Omit<
    SandboxWorkerCycleCommandRuntime,
    "tenantId" | "now" | "appendAudit"
  >;
  cookieName?: string;
  maxCookieHeaderBytes?: number;
  maxRouteBodyBytes?: number;
  maxRequestBodyBytes?: number;
  maxResponseBodyBytes?: number;
  now?: () => Date;
  randomBytes?: (size: number) => Buffer;
}

function serverError(
  message: string,
): ControlledInternalPilotProductionServerError {
  return new ControlledInternalPilotProductionServerError(
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
    Object.getPrototypeOf(value) ===
      Object.prototype
  );
}

function isIdentifier(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= 3 &&
    value.length <= 128 &&
    /^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(
      value,
    )
  );
}

function validateRuntime(
  runtime: unknown,
): asserts runtime is ControlledInternalPilotProductionServerRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId) ||
    !Array.isArray(runtime.allowedOrigins) ||
    runtime.allowedOrigins.length < 1 ||
    !Array.isArray(runtime.allowedHosts) ||
    runtime.allowedHosts.length < 1 ||
    typeof runtime.sessionQuery !== "function" ||
    typeof runtime.withLifecycleTransaction !==
      "function" ||
    typeof runtime.withReceiptTransaction !==
      "function" ||
    typeof runtime.withAuditTransaction !==
      "function" ||
    !isPlainRecord(runtime.commandRuntime) ||
    (
      runtime.now !== undefined &&
      typeof runtime.now !== "function"
    ) ||
    (
      runtime.randomBytes !== undefined &&
      typeof runtime.randomBytes !==
        "function"
    ) ||
    (
      runtime.cookieName !== undefined &&
      (
        typeof runtime.cookieName !==
          "string" ||
        runtime.cookieName.length < 3 ||
        runtime.cookieName.length > 64 ||
        !/^[A-Za-z0-9_-]+$/.test(
          runtime.cookieName,
        )
      )
    ) ||
    (
      runtime.maxCookieHeaderBytes !==
        undefined &&
      (
        typeof runtime.maxCookieHeaderBytes !== "number" ||
        !Number.isInteger(
          runtime.maxCookieHeaderBytes,
        ) ||
        runtime.maxCookieHeaderBytes < 512 ||
        runtime.maxCookieHeaderBytes >
          16_384
      )
    ) ||
    (
      runtime.maxRouteBodyBytes !==
        undefined &&
      (
        typeof runtime.maxRouteBodyBytes !== "number" ||
        !Number.isInteger(
          runtime.maxRouteBodyBytes,
        ) ||
        runtime.maxRouteBodyBytes < 1_024 ||
        runtime.maxRouteBodyBytes >
          65_536
      )
    ) ||
    (
      runtime.maxRequestBodyBytes !==
        undefined &&
      (
        typeof runtime.maxRequestBodyBytes !== "number" ||
        !Number.isInteger(
          runtime.maxRequestBodyBytes,
        ) ||
        runtime.maxRequestBodyBytes < 1_024 ||
        runtime.maxRequestBodyBytes >
          1_048_576
      )
    ) ||
    (
      runtime.maxResponseBodyBytes !==
        undefined &&
      (
        typeof runtime.maxResponseBodyBytes !== "number" ||
        !Number.isInteger(
          runtime.maxResponseBodyBytes,
        ) ||
        runtime.maxResponseBodyBytes < 1_024 ||
        runtime.maxResponseBodyBytes >
          262_144
      )
    )
  ) {
    throw serverError(
      "The controlled internal pilot production server configuration is invalid.",
    );
  }

  for (const forbiddenKey of [
    "appendAudit",
    "tenantId",
    "now",
  ]) {
    if (
      Object.prototype.hasOwnProperty.call(
        runtime.commandRuntime,
        forbiddenKey,
      )
    ) {
      throw serverError(
        "Externally supplied command authority is forbidden.",
      );
    }
  }
}

export function createControlledInternalPilotProductionServer(
  runtime:
    ControlledInternalPilotProductionServerRuntime,
): ControlledInternalPilotFetchApiHandler {
  validateRuntime(runtime);

  const now =
    runtime.now ?? (() => new Date());

  try {
    const sessionLifecycleRoute =
      createPostgresBackedInternalPilotSessionLifecycleRoute({
        tenantId: runtime.tenantId,
        allowedOrigins:
          runtime.allowedOrigins,
        sessionQuery:
          runtime.sessionQuery,
        withLifecycleTransaction:
          runtime.withLifecycleTransaction,
        cookieName:
          runtime.cookieName,
        maxCookieHeaderBytes:
          runtime.maxCookieHeaderBytes,
        maxBodyBytes:
          runtime.maxRouteBodyBytes,
        now,
        randomBytes:
          runtime.randomBytes,
      });

    const sandboxWorkerRoute =
      createPostgresAuditedInternalPilotSandboxWorkerRoute({
        tenantId: runtime.tenantId,
        allowedOrigins:
          runtime.allowedOrigins,
        sessionQuery:
          runtime.sessionQuery,
        withReceiptTransaction:
          runtime.withReceiptTransaction,
        withAuditTransaction:
          runtime.withAuditTransaction,
        sessionCookieName:
          runtime.cookieName,
        maxCookieHeaderBytes:
          runtime.maxCookieHeaderBytes,
        maxBodyBytes:
          runtime.maxRouteBodyBytes,
        now,
        commandRuntime:
          runtime.commandRuntime,
      });

    const router =
      createControlledInternalPilotProductionApiRouter({
        sessionLifecycleRoute,
        sandboxWorkerRoute,
        cookieName:
          runtime.cookieName,
        maxResponseBodyBytes:
          runtime.maxResponseBodyBytes,
      });

    return createControlledInternalPilotFetchApiAdapter({
      router,
      allowedHosts:
        runtime.allowedHosts,
      maxRequestBodyBytes:
        runtime.maxRequestBodyBytes,
      maxResponseBodyBytes:
        runtime.maxResponseBodyBytes,
    });
  } catch {
    throw serverError(
      "The controlled internal pilot production server dependencies could not be composed safely.",
    );
  }
}
