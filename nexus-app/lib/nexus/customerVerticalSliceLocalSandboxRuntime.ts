import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

import {
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";

import {
  dirname,
  join,
} from "node:path";

import type {
  CustomerVerticalSliceHttpRouteDependencies,
} from "./customerVerticalSliceHttpRoute";

import {
  areCustomerVerticalSliceRouteDependenciesConfigured,
  configureCustomerVerticalSliceRouteDependencies,
} from "./customerVerticalSliceRouteDependencies";

import type {
  CustomerVerticalSliceStateRecord,
  CustomerVerticalSliceTransitionEvent,
} from "./customerVerticalSliceTransitionGuard";

import type {
  CustomerVerticalSliceAuditEntry,
} from "./customerVerticalSliceAuditLedger";

import type {
  CustomerVerticalSliceTransactionalRepository,
  CustomerVerticalSliceTransactionRepositories,
} from "./customerVerticalSliceAuditedTransition";

export type LocalSandboxRuntimeErrorCode =
  | "LOCAL_SANDBOX_NOT_ALLOWED"
  | "INVALID_LOCAL_SANDBOX_CONFIGURATION"
  | "INVALID_LOCAL_SANDBOX_DATA"
  | "LOCAL_SANDBOX_SEED_CONFLICT";

export class LocalSandboxRuntimeError extends Error {
  readonly code: LocalSandboxRuntimeErrorCode;

  constructor(
    code: LocalSandboxRuntimeErrorCode,
    message = "Local sandbox runtime is unavailable.",
  ) {
    super(message);
    this.name = "LocalSandboxRuntimeError";
    this.code = code;
  }
}

interface LocalSandboxData {
  schemaVersion: 1;
  states: CustomerVerticalSliceStateRecord[];
  events: CustomerVerticalSliceTransitionEvent[];
  audits: CustomerVerticalSliceAuditEntry[];
}

export interface FileBackedCustomerVerticalSliceRepository
  extends CustomerVerticalSliceTransactionalRepository {
  seedInquiry(
    state: CustomerVerticalSliceStateRecord,
  ): Promise<{
    created: boolean;
    idempotent: boolean;
  }>;

  readSnapshot(): Promise<LocalSandboxData>;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function emptyData(): LocalSandboxData {
  return {
    schemaVersion: 1,
    states: [],
    events: [],
    audits: [],
  };
}

function stateKey(
  tenantId: string,
  inquiryId: string,
): string {
  return `${tenantId}\u0000${inquiryId}`;
}

function validateState(
  state: CustomerVerticalSliceStateRecord,
): void {
  const values = [
    state.tenantId,
    state.inquiryId,
    state.customerId,
    state.ownerId,
    state.status,
    state.version,
    state.createdAt,
    state.updatedAt,
  ];

  if (
    values.some(
      (value) =>
        typeof value !== "string" ||
        !value.trim(),
    ) ||
    Number.isNaN(Date.parse(state.createdAt)) ||
    Number.isNaN(Date.parse(state.updatedAt))
  ) {
    throw new LocalSandboxRuntimeError(
      "INVALID_LOCAL_SANDBOX_DATA",
    );
  }
}

function validateData(
  value: unknown,
): LocalSandboxData {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    throw new LocalSandboxRuntimeError(
      "INVALID_LOCAL_SANDBOX_DATA",
    );
  }

  const candidate = value as Partial<LocalSandboxData>;

  if (
    candidate.schemaVersion !== 1 ||
    !Array.isArray(candidate.states) ||
    !Array.isArray(candidate.events) ||
    !Array.isArray(candidate.audits)
  ) {
    throw new LocalSandboxRuntimeError(
      "INVALID_LOCAL_SANDBOX_DATA",
    );
  }

  candidate.states.forEach(validateState);

  return candidate as LocalSandboxData;
}

export function createFileBackedCustomerVerticalSliceRepository(
  filePath: string,
): FileBackedCustomerVerticalSliceRepository {
  const normalizedPath = filePath.trim();

  if (!normalizedPath) {
    throw new LocalSandboxRuntimeError(
      "INVALID_LOCAL_SANDBOX_CONFIGURATION",
    );
  }

  let queue: Promise<void> = Promise.resolve();

  async function withLock<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    const previous = queue;
    let release!: () => void;

    queue = new Promise<void>((resolve) => {
      release = resolve;
    });

    await previous;

    try {
      return await operation();
    } finally {
      release();
    }
  }

  async function load(): Promise<LocalSandboxData> {
    try {
      const raw = await readFile(
        normalizedPath,
        "utf8",
      );

      return validateData(JSON.parse(raw));
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: unknown }).code === "ENOENT"
      ) {
        return emptyData();
      }

      if (error instanceof LocalSandboxRuntimeError) {
        throw error;
      }

      throw new LocalSandboxRuntimeError(
        "INVALID_LOCAL_SANDBOX_DATA",
      );
    }
  }

  async function persist(
    data: LocalSandboxData,
  ): Promise<void> {
    await mkdir(dirname(normalizedPath), {
      recursive: true,
    });

    const temporaryPath =
      `${normalizedPath}.${process.pid}.${randomUUID()}.tmp`;

    await writeFile(
      temporaryPath,
      JSON.stringify(data, null, 2),
      "utf8",
    );

    await rename(
      temporaryPath,
      normalizedPath,
    );
  }

  return {
    async runInTransaction<T>(
      operation: (
        repositories: CustomerVerticalSliceTransactionRepositories,
      ) => Promise<T>,
    ): Promise<T> {
      return withLock(async () => {
        const working = clone(await load());

        const transitionRepository = {
          async findState(input: {
            tenantId: string;
            inquiryId: string;
          }) {
            const key = stateKey(
              input.tenantId,
              input.inquiryId,
            );

            const state = working.states.find(
              (candidate) =>
                stateKey(
                  candidate.tenantId,
                  candidate.inquiryId,
                ) === key,
            );

            return state ? clone(state) : null;
          },

          async findEventByIdempotencyKey(input: {
            tenantId: string;
            idempotencyKey: string;
          }) {
            const event = working.events.find(
              (candidate) =>
                candidate.tenantId === input.tenantId &&
                candidate.idempotencyKey ===
                  input.idempotencyKey,
            );

            return event ? clone(event) : null;
          },

          async compareAndSet(input: {
            tenantId: string;
            inquiryId: string;
            expectedVersion: string;
            nextState: CustomerVerticalSliceStateRecord;
            event: CustomerVerticalSliceTransitionEvent;
          }) {
            const key = stateKey(
              input.tenantId,
              input.inquiryId,
            );

            const index = working.states.findIndex(
              (candidate) =>
                stateKey(
                  candidate.tenantId,
                  candidate.inquiryId,
                ) === key,
            );

            if (
              index < 0 ||
              working.states[index].version !==
                input.expectedVersion
            ) {
              return {
                applied: false,
                state:
                  index >= 0
                    ? clone(working.states[index])
                    : clone(input.nextState),
              };
            }

            working.states[index] =
              clone(input.nextState);

            working.events.push(
              clone(input.event),
            );

            return {
              applied: true,
              state: clone(input.nextState),
            };
          },
        };

        const auditRepository = {
          async findBySourceEventId(input: {
            tenantId: string;
            sourceEventId: string;
          }) {
            const entry = working.audits.find(
              (candidate) =>
                candidate.tenantId === input.tenantId &&
                candidate.sourceEventId ===
                  input.sourceEventId,
            );

            return entry ? clone(entry) : null;
          },

          async findLatest(input: {
            tenantId: string;
            inquiryId: string;
          }) {
            const entries = working.audits
              .filter(
                (entry) =>
                  entry.tenantId === input.tenantId &&
                  entry.inquiryId === input.inquiryId,
              )
              .sort(
                (left, right) =>
                  left.sequence - right.sequence,
              );

            return entries.length > 0
              ? clone(entries[entries.length - 1])
              : null;
          },

          async appendIfCurrent(input: {
            entry: CustomerVerticalSliceAuditEntry;
            expectedSequence: number;
            expectedPreviousHash: string;
          }) {
            const entries = working.audits
              .filter(
                (entry) =>
                  entry.tenantId ===
                    input.entry.tenantId &&
                  entry.inquiryId ===
                    input.entry.inquiryId,
              )
              .sort(
                (left, right) =>
                  left.sequence - right.sequence,
              );

            const latest =
              entries.length > 0
                ? entries[entries.length - 1]
                : null;

            const actualSequence = latest
              ? latest.sequence + 1
              : 1;

            const actualPreviousHash = latest
              ? latest.hash
              : "GENESIS";

            if (
              actualSequence !== input.expectedSequence ||
              actualPreviousHash !==
                input.expectedPreviousHash
            ) {
              return {
                created: false,
                entry: latest
                  ? clone(latest)
                  : clone(input.entry),
              };
            }

            working.audits.push(
              clone(input.entry),
            );

            return {
              created: true,
              entry: clone(input.entry),
            };
          },
        };

        const result = await operation({
          transitionRepository,
          auditRepository,
        });

        await persist(working);

        return result;
      });
    },

    async seedInquiry(state) {
      validateState(state);

      return withLock(async () => {
        const data = await load();

        const existing = data.states.find(
          (candidate) =>
            stateKey(
              candidate.tenantId,
              candidate.inquiryId,
            ) ===
            stateKey(
              state.tenantId,
              state.inquiryId,
            ),
        );

        if (existing) {
          if (
            JSON.stringify(existing) ===
            JSON.stringify(state)
          ) {
            return {
              created: false,
              idempotent: true,
            };
          }

          throw new LocalSandboxRuntimeError(
            "LOCAL_SANDBOX_SEED_CONFLICT",
          );
        }

        data.states.push(clone(state));

        await persist(data);

        return {
          created: true,
          idempotent: false,
        };
      });
    },

    async readSnapshot() {
      return clone(await load());
    },
  };
}

export function createLocalSandboxRequestSignature(input: {
  secret: string;
  method: string;
  url: string;
  tenantId: string;
  actorId: string;
  role: string;
  rawBody: string;
}): string {
  return createHmac("sha256", input.secret)
    .update(
      [
        input.method.toUpperCase(),
        input.url,
        input.tenantId,
        input.actorId,
        input.role,
        input.rawBody,
      ].join("\n"),
      "utf8",
    )
    .digest("hex");
}

function safeEqual(
  left: string,
  right: string,
): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function isRole(
  value: string | null,
): value is "owner" | "customer" | "service" {
  return (
    value === "owner" ||
    value === "customer" ||
    value === "service"
  );
}

export function createLocalSandboxRouteDependencies(input: {
  token: string;
  secret: string;
  filePath: string;
  production: boolean;
  rateLimit?: number;
  now?: () => number;
}): CustomerVerticalSliceHttpRouteDependencies {
  if (input.production) {
    throw new LocalSandboxRuntimeError(
      "LOCAL_SANDBOX_NOT_ALLOWED",
    );
  }

  const token = input.token.trim();
  const secret = input.secret.trim();
  const filePath = input.filePath.trim();

  if (
    token.length < 32 ||
    secret.length < 32 ||
    !filePath
  ) {
    throw new LocalSandboxRuntimeError(
      "INVALID_LOCAL_SANDBOX_CONFIGURATION",
    );
  }

  const repository =
    createFileBackedCustomerVerticalSliceRepository(
      filePath,
    );

  const rateLimit = Math.max(
    1,
    Math.min(input.rateLimit ?? 60, 500),
  );

  const now = input.now ?? Date.now;
  const counters = new Map<
    string,
    {
      windowStartedAt: number;
      count: number;
    }
  >();

  return {
    async loadSession(request) {
      const authorization =
        request.headers.get("authorization");

      const tenantId =
        request.headers
          .get("x-nexus-tenant-id")
          ?.trim() ?? "";

      const actorId =
        request.headers
          .get("x-nexus-actor-id")
          ?.trim() ?? "";

      const role =
        request.headers.get("x-nexus-actor-role");

      const authenticated =
        authorization === `Bearer ${token}` &&
        tenantId.length > 0 &&
        actorId.length > 0 &&
        isRole(role);

      return {
        authenticated,
        tenantId: authenticated ? tenantId : null,
        actorId: authenticated ? actorId : null,
        role: isRole(role) ? role : "service",
      };
    },

    async verifyRequestIntegrity({
      request,
      session,
      rawBody,
    }) {
      if (
        session.authenticated !== true ||
        !session.tenantId ||
        !session.actorId
      ) {
        return false;
      }

      const supplied =
        request.headers
          .get("x-nexus-signature")
          ?.trim()
          .toLowerCase() ?? "";

      if (!/^[a-f0-9]{64}$/.test(supplied)) {
        return false;
      }

      const expected =
        createLocalSandboxRequestSignature({
          secret,
          method: request.method,
          url: request.url,
          tenantId: session.tenantId,
          actorId: session.actorId,
          role: session.role,
          rawBody,
        });

      return safeEqual(supplied, expected);
    },

    async loadAuditContext(session) {
      if (
        session.authenticated !== true ||
        !session.tenantId?.trim()
      ) {
        throw new LocalSandboxRuntimeError(
          "INVALID_LOCAL_SANDBOX_CONFIGURATION",
        );
      }

      return {
        authenticated: true,
        tenantId: session.tenantId.trim(),
        serviceId:
          "nexus-local-sandbox-audit-service",
        role: "service",
      };
    },

    rateLimiter: {
      async consume({
        tenantId,
        actorId,
        command,
      }) {
        const key = createHash("sha256")
          .update(
            `${tenantId}|${actorId}|${command}`,
            "utf8",
          )
          .digest("hex");

        const currentTime = now();
        const current = counters.get(key);

        if (
          !current ||
          currentTime - current.windowStartedAt >= 60_000
        ) {
          counters.set(key, {
            windowStartedAt: currentTime,
            count: 1,
          });

          return {
            allowed: true,
            retryAfterSeconds: 0,
          };
        }

        if (current.count >= rateLimit) {
          return {
            allowed: false,
            retryAfterSeconds: Math.max(
              1,
              Math.ceil(
                (
                  60_000 -
                  (
                    currentTime -
                    current.windowStartedAt
                  )
                ) / 1000,
              ),
            ),
          };
        }

        current.count += 1;

        return {
          allowed: true,
          retryAfterSeconds: 0,
        };
      },
    },

    repository,
  };
}

function environmentFilePath(): string {
  return (
    process.env.NEXUS_LOCAL_SANDBOX_FILE?.trim() ||
    join(
      process.cwd(),
      ".nexus-data",
      "customer-vertical-slice.json",
    )
  );
}

export async function ensureCustomerVerticalSliceLocalSandboxRuntimeConfigured():
  Promise<boolean> {
  if (
    areCustomerVerticalSliceRouteDependenciesConfigured()
  ) {
    return true;
  }

  if (
    process.env.NODE_ENV === "production" ||
    process.env.NEXUS_LOCAL_SANDBOX_ENABLED !== "true"
  ) {
    return false;
  }

  const token =
    process.env.NEXUS_LOCAL_SANDBOX_TOKEN ?? "";

  const secret =
    process.env.NEXUS_LOCAL_SANDBOX_SECRET ?? "";

  const dependencies =
    createLocalSandboxRouteDependencies({
      token,
      secret,
      filePath: environmentFilePath(),
      production: false,
    });

  configureCustomerVerticalSliceRouteDependencies(
    dependencies,
  );

  return true;
}

export async function seedLocalSandboxInquiry(
  state: CustomerVerticalSliceStateRecord,
): Promise<{
  created: boolean;
  idempotent: boolean;
}> {
  const repository =
    createFileBackedCustomerVerticalSliceRepository(
      environmentFilePath(),
    );

  return repository.seedInquiry(state);
}
