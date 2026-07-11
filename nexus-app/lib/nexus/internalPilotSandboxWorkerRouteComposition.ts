import type {
  SandboxWorkerCycleCommandRuntime,
} from "./sandboxWorkerCycleCommand";

import {
  createPostgresBackedSandboxWorkerCycleService,
} from "./postgresBackedSandboxWorkerCycleService";

import type {
  WithPostgresSandboxReceiptTransaction,
} from "./postgresSandboxWorkerCommandReceiptRepository";

import {
  createInternalPilotSandboxWorkerEndpoint,
} from "./internalPilotSandboxWorkerEndpoint";

import {
  createInternalPilotSandboxWorkerRoute,
  type InternalPilotRouteRuntime,
  type InternalPilotSandboxWorkerRoute,
} from "./internalPilotSandboxWorkerRoute";

export type InternalPilotRouteCompositionErrorCode =
  | "INVALID_CONFIGURATION";

export class InternalPilotRouteCompositionError extends Error {
  readonly code: InternalPilotRouteCompositionErrorCode;

  constructor(
    code: InternalPilotRouteCompositionErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "InternalPilotRouteCompositionError";
    this.code = code;
  }
}

export interface InternalPilotSandboxWorkerRouteCompositionRuntime {
  tenantId: string;
  allowedOrigins: readonly string[];
  resolveSession: InternalPilotRouteRuntime["resolveSession"];
  withReceiptTransaction: WithPostgresSandboxReceiptTransaction;
  commandRuntime: Omit<
    SandboxWorkerCycleCommandRuntime,
    "tenantId" | "now"
  >;
  maxBodyBytes?: number;
  now?: () => Date;
}

function configurationError(
  message: string,
): InternalPilotRouteCompositionError {
  return new InternalPilotRouteCompositionError(
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

function assertRuntime(
  runtime: unknown,
): asserts runtime is InternalPilotSandboxWorkerRouteCompositionRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isTenantIdentifier(runtime.tenantId) ||
    !Array.isArray(runtime.allowedOrigins) ||
    runtime.allowedOrigins.length < 1 ||
    typeof runtime.resolveSession !== "function" ||
    typeof runtime.withReceiptTransaction !== "function" ||
    !isPlainRecord(runtime.commandRuntime) ||
    (
      runtime.now !== undefined &&
      typeof runtime.now !== "function"
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
      "Controlled internal pilot route composition is invalid.",
    );
  }
}

export function createInternalPilotSandboxWorkerRouteComposition(
  runtime: InternalPilotSandboxWorkerRouteCompositionRuntime,
): InternalPilotSandboxWorkerRoute {
  assertRuntime(runtime);

  const now = runtime.now ?? (() => new Date());

  try {
    const service =
      createPostgresBackedSandboxWorkerCycleService({
        tenantId: runtime.tenantId,
        withReceiptTransaction:
          runtime.withReceiptTransaction,
        commandRuntime: runtime.commandRuntime,
        now,
      });

    const endpoint =
      createInternalPilotSandboxWorkerEndpoint({
        tenantId: runtime.tenantId,
        service,
        maxBodyBytes: runtime.maxBodyBytes,
      });

    return createInternalPilotSandboxWorkerRoute({
      tenantId: runtime.tenantId,
      allowedOrigins: runtime.allowedOrigins,
      resolveSession: runtime.resolveSession,
      endpoint,
      now,
    });
  } catch (error) {
    if (
      error instanceof InternalPilotRouteCompositionError
    ) {
      throw error;
    }

    throw configurationError(
      "Controlled internal pilot route dependencies could not be composed safely.",
    );
  }
}
