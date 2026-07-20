import {
  createHash,
} from "node:crypto";
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createPostgresAuthenticatedOwnerAccess,
  PostgresAuthenticatedOwnerAccessError,
  type PostgresAuthenticatedOwnerAccessClient,
} from "./postgresAuthenticatedOwnerAccess";

type CredentialRecord = {
  tenant_id: string;
  owner_id: string;
  email_normalized: string;
  password_salt_hex: string;
  password_hash_hex: string;
  credential_status: "ACTIVE";
  credential_version: number;
  failed_attempt_count: number;
  locked_until: string | null;
};

type SessionRecord = {
  tenant_id: string;
  owner_id: string;
  session_id: string;
  session_digest: string;
  authority_epoch: string;
  role: "OWNER";
  expires_at: string;
  revoked_at: string | null;
};

function clone<Row>(
  value: Row,
): Row {
  return JSON.parse(
    JSON.stringify(value),
  ) as Row;
}

function createDeterministicRandom() {
  let counter = 1;

  return (size: number): Buffer => {
    const result =
      Buffer.alloc(
        size,
        counter,
      );

    counter += 1;

    return result;
  };
}

function createMemoryRuntime(
  options: {
    readonly returnDateTimestamps?: boolean;
    readonly failQueryMarker?: string;
  } = {},
) {
  const credentials =
    new Map<string, CredentialRecord>();

  const sessions =
    new Map<string, SessionRecord>();

  const authority = {
    tenantStatus: "ACTIVE",
    ownerStatus: "ACTIVE",
    membershipStatus: "ACTIVE",
    membershipRole: "OWNER",
    authorityEpoch: "epoch-1",
  };

  const asDatabaseTimestamp = (
    value: string | null,
  ): string | Date | null =>
    value === null
      ? null
      : options.returnDateTimestamps
        ? new Date(value)
        : value;

  const keyOfCredential = (
    tenantId: string,
    email: string,
  ) => `${tenantId}::${email}`;

  const keyOfSession = (
    tenantId: string,
    digest: string,
  ) => `${tenantId}::${digest}`;

  const client:
    PostgresAuthenticatedOwnerAccessClient = {
      async query<Row extends Record<string, unknown>>(
        text: string,
        values: readonly unknown[] = [],
      ) {
        const marker =
          (
            text.match(
              /nexus-launch-enable:([a-z-]+)/,
            ) ?? []
          )[1];

        if (
          marker ===
          options.failQueryMarker
        ) {
          throw new Error(
            "postgres://owner:database-password@private-host/nexus",
          );
        }

        if (
          marker ===
          "credential-insert"
        ) {
          const [
            tenantId,
            ownerId,
            email,
            salt,
            hash,
          ] = values as string[];

          const allowed =
            authority.tenantStatus ===
              "ACTIVE" &&
            authority.ownerStatus ===
              "ACTIVE" &&
            authority.membershipStatus ===
              "ACTIVE" &&
            authority.membershipRole ===
              "OWNER" &&
            authority.authorityEpoch.length >
              0;

          const key =
            keyOfCredential(
              tenantId,
              email,
            );

          if (
            !allowed ||
            credentials.has(key)
          ) {
            return {
              rows: [],
              rowCount: 0,
            };
          }

          credentials.set(
            key,
            {
              tenant_id:
                tenantId,
              owner_id:
                ownerId,
              email_normalized:
                email,
              password_salt_hex:
                salt,
              password_hash_hex:
                hash,
              credential_status:
                "ACTIVE",
              credential_version:
                1,
              failed_attempt_count:
                0,
              locked_until:
                null,
            },
          );

          return {
            rows: [
              {
                tenant_id:
                  tenantId,
                owner_id:
                  ownerId,
                email_normalized:
                  email,
                status:
                  "ACTIVE",
                credential_version:
                  1,
              } as unknown as Row,
            ],
            rowCount: 1,
          };
        }

        if (
          marker ===
          "credential-read"
        ) {
          const [
            tenantId,
            email,
          ] = values as string[];

          const credential =
            credentials.get(
              keyOfCredential(
                tenantId,
                email,
              ),
            );

          if (!credential) {
            return {
              rows: [],
              rowCount: 0,
            };
          }

          return {
            rows: [
              {
                ...clone(
                  credential,
                ),
                locked_until:
                  asDatabaseTimestamp(
                    credential.locked_until,
                  ),
                tenant_status:
                  authority.tenantStatus,
                owner_status:
                  authority.ownerStatus,
                membership_status:
                  authority
                    .membershipStatus,
                membership_role:
                  authority
                    .membershipRole,
                authority_epoch:
                  authority
                    .authorityEpoch,
              } as unknown as Row,
            ],
            rowCount: 1,
          };
        }

        if (
          marker ===
          "credential-failure"
        ) {
          const [
            failureCount,
            lockedUntil,
            ,
            tenantId,
            ownerId,
          ] = values;

          const credential =
            [...credentials.values()]
              .find(
                (record) =>
                  record.tenant_id ===
                    tenantId &&
                  record.owner_id ===
                    ownerId,
              );

          if (!credential) {
            return {
              rows: [],
              rowCount: 0,
            };
          }

          credential.failed_attempt_count =
            Number(
              failureCount,
            );

          credential.locked_until =
            lockedUntil as
              | string
              | null;

          return {
            rows: [],
            rowCount: 1,
          };
        }

        if (
          marker ===
          "credential-success"
        ) {
          const [
            ,
            tenantId,
            ownerId,
          ] = values;

          const credential =
            [...credentials.values()]
              .find(
                (record) =>
                  record.tenant_id ===
                    tenantId &&
                  record.owner_id ===
                    ownerId,
              );

          if (!credential) {
            return {
              rows: [],
              rowCount: 0,
            };
          }

          credential.failed_attempt_count =
            0;

          credential.locked_until =
            null;

          return {
            rows: [],
            rowCount: 1,
          };
        }

        if (
          marker ===
          "session-insert"
        ) {
          const [
            tenantId,
            sessionId,
            digest,
            ownerId,
            authorityEpoch,
            expiresAt,
          ] = values as string[];

          const key =
            keyOfSession(
              tenantId,
              digest,
            );

          if (sessions.has(key)) {
            throw new Error(
              "duplicate session",
            );
          }

          const record:
            SessionRecord = {
              tenant_id:
                tenantId,
              owner_id:
                ownerId,
              session_id:
                sessionId,
              session_digest:
                digest,
              authority_epoch:
                authorityEpoch,
              role: "OWNER",
              expires_at:
                expiresAt,
              revoked_at:
                null,
            };

          sessions.set(
            key,
            record,
          );

          return {
            rows: [
              {
                tenant_id:
                  record.tenant_id,
                owner_id:
                  record.owner_id,
                session_id:
                  record.session_id,
                authority_epoch:
                  record.authority_epoch,
                role:
                  record.role,
                expires_at:
                  asDatabaseTimestamp(
                    record.expires_at,
                  ),
                revoked_at:
                  asDatabaseTimestamp(
                    record.revoked_at,
                  ),
              } as unknown as Row,
            ],
            rowCount: 1,
          };
        }

        if (
          marker ===
          "session-resolve"
        ) {
          const [
            tenantId,
            digest,
          ] = values as string[];

          const session =
            sessions.get(
              keyOfSession(
                tenantId,
                digest,
              ),
            );

          if (!session) {
            return {
              rows: [],
              rowCount: 0,
            };
          }

          return {
            rows: [
              {
                tenant_id:
                  session.tenant_id,
                owner_id:
                  session.owner_id,
                session_id:
                  session.session_id,
                stored_authority_epoch:
                  session
                    .authority_epoch,
                current_authority_epoch:
                  authority
                    .authorityEpoch,
                role:
                  session.role,
                expires_at:
                  asDatabaseTimestamp(
                    session.expires_at,
                  ),
                revoked_at:
                  asDatabaseTimestamp(
                    session.revoked_at,
                  ),
                tenant_status:
                  authority
                    .tenantStatus,
                owner_status:
                  authority
                    .ownerStatus,
                membership_status:
                  authority
                    .membershipStatus,
                membership_role:
                  authority
                    .membershipRole,
              } as unknown as Row,
            ],
            rowCount: 1,
          };
        }

        if (
          marker ===
          "session-revoke"
        ) {
          const [
            revokedAt,
            tenantId,
            digest,
          ] = values as string[];

          const session =
            sessions.get(
              keyOfSession(
                tenantId,
                digest,
              ),
            );

          if (!session) {
            return {
              rows: [],
              rowCount: 0,
            };
          }

          session.revoked_at ??=
            revokedAt;

          return {
            rows: [
              {
                tenant_id:
                  session.tenant_id,
                owner_id:
                  session.owner_id,
                session_id:
                  session.session_id,
                revoked_at:
                  asDatabaseTimestamp(
                    session.revoked_at,
                  ),
              } as unknown as Row,
            ],
            rowCount: 1,
          };
        }

        throw new Error(
          `Unexpected SQL marker: ${marker}`,
        );
      },
    };

  return {
    access:
      createPostgresAuthenticatedOwnerAccess({
        tenantId:
          "tenant-launch-1",
        withTransaction:
          async (operation) =>
            operation(client),
        randomBytes:
          createDeterministicRandom(),
      }),
    authority,
    credentials,
    sessions,
  };
}

const activatedAt =
  "2026-07-19T12:00:00.000Z";

const email =
  "owner@example.com";

const password =
  "Correct-Horse-Launch-1";

async function activate(
  runtime:
    ReturnType<
      typeof createMemoryRuntime
    >,
) {
  return runtime.access
    .activateCredential({
      ownerId:
        "owner-launch-1",
      email,
      password,
      ownerApprovalGranted:
        true,
      activatedAt,
    });
}

describe(
  "Postgres authenticated owner access",
  () => {
    it(
      "activates one owner credential and issues a digest-only tenant session",
      async () => {
        const runtime =
          createMemoryRuntime();

        const activated =
          await activate(
            runtime,
          );

        expect(
          activated,
        ).toEqual({
          tenantId:
            "tenant-launch-1",
          ownerId:
            "owner-launch-1",
          emailNormalized:
            email,
          status:
            "ACTIVE",
          credentialVersion:
            1,
        });

        const issued =
          await runtime.access
            .authenticateAndIssueSession({
              email,
              password,
              ttlSeconds:
                3_600,
              authenticatedAt:
                "2026-07-19T12:01:00.000Z",
            });

        expect(
          issued.tenantId,
        ).toBe(
          "tenant-launch-1",
        );

        expect(
          issued.ownerId,
        ).toBe(
          "owner-launch-1",
        );

        expect(
          issued.sessionToken,
        ).not.toBe(
          issued.sessionTokenDigest,
        );

        expect(
          issued.sessionTokenDigest,
        ).toBe(
          createHash("sha256")
            .update(
              issued.sessionToken,
              "utf8",
            )
            .digest("hex"),
        );

        const stored =
          [...runtime.sessions.values()][0];

        expect(
          stored,
        ).toBeDefined();

        expect(
          JSON.stringify(stored),
        ).not.toContain(
          issued.sessionToken,
        );

        const resolved =
          await runtime.access
            .resolveSession({
              sessionToken:
                issued.sessionToken,
              resolvedAt:
                "2026-07-19T12:02:00.000Z",
            });

        expect(
          resolved,
        ).toMatchObject({
          authenticated:
            true,
          tenantId:
            "tenant-launch-1",
          ownerId:
            "owner-launch-1",
          role:
            "OWNER",
          authorityEpoch:
            "epoch-1",
        });
      },
    );

    it(
      "normalizes PostgreSQL Date timestamps across authentication and session lifecycle",
      async () => {
        const lockedRuntime =
          createMemoryRuntime({
            returnDateTimestamps:
              true,
          });

        await activate(
          lockedRuntime,
        );

        for (
          let attempt = 0;
          attempt < 4;
          attempt += 1
        ) {
          await expect(
            lockedRuntime.access
              .authenticateAndIssueSession({
                email,
                password:
                  "Wrong-Password-Value",
                ttlSeconds:
                  3_600,
                authenticatedAt:
                  "2026-07-19T12:05:00.000Z",
              }),
          ).rejects.toMatchObject({
            code:
              "AUTHENTICATION_FAILED",
          });
        }

        await expect(
          lockedRuntime.access
            .authenticateAndIssueSession({
              email,
              password:
                "Wrong-Password-Value",
              ttlSeconds:
                3_600,
              authenticatedAt:
                "2026-07-19T12:05:00.000Z",
            }),
        ).rejects.toMatchObject({
          code:
            "PRINCIPAL_LOCKED",
          lockedUntil:
            "2026-07-19T12:20:00.000Z",
        });

        await expect(
          lockedRuntime.access
            .authenticateAndIssueSession({
              email,
              password,
              ttlSeconds:
                3_600,
              authenticatedAt:
                "2026-07-19T12:06:00.000Z",
            }),
        ).rejects.toMatchObject({
          code:
            "PRINCIPAL_LOCKED",
          lockedUntil:
            "2026-07-19T12:20:00.000Z",
        });

        const sessionRuntime =
          createMemoryRuntime({
            returnDateTimestamps:
              true,
          });

        await activate(
          sessionRuntime,
        );

        const issued =
          await sessionRuntime.access
            .authenticateAndIssueSession({
              email,
              password,
              ttlSeconds:
                3_600,
              authenticatedAt:
                "2026-07-19T12:01:00.000Z",
            });

        expect(
          issued.expiresAt,
        ).toBe(
          "2026-07-19T13:01:00.000Z",
        );

        const resolved =
          await sessionRuntime.access
            .resolveSession({
              sessionToken:
                issued.sessionToken,
              resolvedAt:
                "2026-07-19T12:02:00.000Z",
            });

        expect(
          resolved.expiresAt,
        ).toBe(
          "2026-07-19T13:01:00.000Z",
        );

        const revoked =
          await sessionRuntime.access
            .revokeSession({
              sessionToken:
                issued.sessionToken,
              revokedAt:
                "2026-07-19T12:03:00.000Z",
            });

        expect(
          revoked.revokedAt,
        ).toBe(
          "2026-07-19T12:03:00.000Z",
        );
      },
    );

    it(
      "records bounded authentication failures and locks after five wrong passwords",
      async () => {
        const runtime =
          createMemoryRuntime();

        await activate(
          runtime,
        );

        for (
          let attempt = 1;
          attempt <= 4;
          attempt += 1
        ) {
          await expect(
            runtime.access
              .authenticateAndIssueSession({
                email,
                password:
                  "Wrong-Password-Value",
                ttlSeconds:
                  3_600,
                authenticatedAt:
                  `2026-07-19T12:0${attempt}:00.000Z`,
              }),
          ).rejects.toMatchObject({
            code:
              "AUTHENTICATION_FAILED",
          });
        }

        await expect(
          runtime.access
            .authenticateAndIssueSession({
              email,
              password:
                "Wrong-Password-Value",
              ttlSeconds:
                3_600,
              authenticatedAt:
                "2026-07-19T12:05:00.000Z",
            }),
        ).rejects.toMatchObject({
          code:
            "PRINCIPAL_LOCKED",
        });

        const credential =
          [...runtime.credentials.values()][0];

        expect(
          credential
            .failed_attempt_count,
        ).toBe(5);

        expect(
          credential.locked_until,
        ).toBe(
          "2026-07-19T12:20:00.000Z",
        );
      },
    );

    it(
      "rejects credential activation replay without replacing the existing credential",
      async () => {
        const runtime =
          createMemoryRuntime();

        await activate(
          runtime,
        );

        const beforeReplay =
          JSON.stringify(
            [
              ...runtime.credentials
                .entries(),
            ],
          );

        await expect(
          activate(
            runtime,
          ),
        ).rejects.toMatchObject({
          code:
            "CREDENTIAL_ACTIVATION_FAILED",
          message:
            "Owner credential could not be activated safely.",
        });

        expect(
          runtime.credentials.size,
        ).toBe(1);

        expect(
          JSON.stringify(
            [
              ...runtime.credentials
                .entries(),
            ],
          ),
        ).toBe(
          beforeReplay,
        );
      },
    );

    it(
      "sanitizes raw PostgreSQL failures across authenticated owner operations",
      async () => {
        async function captureFailure(
          operation:
            () => Promise<unknown>,
        ): Promise<
          PostgresAuthenticatedOwnerAccessError
        > {
          try {
            await operation();
          } catch (error) {
            expect(
              error,
            ).toBeInstanceOf(
              PostgresAuthenticatedOwnerAccessError,
            );

            const typedError =
              error as
                PostgresAuthenticatedOwnerAccessError;

            expect(
              typedError.message,
            ).not.toContain(
              "database-password",
            );

            expect(
              typedError.stack ?? "",
            ).not.toContain(
              "database-password",
            );

            return typedError;
          }

          throw new Error(
            "Expected a controlled PostgreSQL failure.",
          );
        }

        const activationError =
          await captureFailure(
            () =>
              activate(
                createMemoryRuntime({
                  failQueryMarker:
                    "credential-insert",
                }),
              ),
          );

        expect(
          activationError,
        ).toMatchObject({
          code:
            "CREDENTIAL_ACTIVATION_FAILED",
          message:
            "Owner credential storage is unavailable.",
        });

        const authenticationRuntime =
          createMemoryRuntime({
            failQueryMarker:
              "credential-read",
          });

        await activate(
          authenticationRuntime,
        );

        const authenticationError =
          await captureFailure(
            () =>
              authenticationRuntime.access
                .authenticateAndIssueSession({
                  email,
                  password,
                  ttlSeconds:
                    3_600,
                  authenticatedAt:
                    "2026-07-19T12:01:00.000Z",
                }),
          );

        expect(
          authenticationError,
        ).toMatchObject({
          code:
            "AUTHENTICATION_FAILED",
          message:
            "Authentication service is unavailable.",
        });

        const resolutionRuntime =
          createMemoryRuntime({
            failQueryMarker:
              "session-resolve",
          });

        await activate(
          resolutionRuntime,
        );

        const resolutionSession =
          await resolutionRuntime.access
            .authenticateAndIssueSession({
              email,
              password,
              ttlSeconds:
                3_600,
              authenticatedAt:
                "2026-07-19T12:01:00.000Z",
            });

        const resolutionError =
          await captureFailure(
            () =>
              resolutionRuntime.access
                .resolveSession({
                  sessionToken:
                    resolutionSession
                      .sessionToken,
                  resolvedAt:
                    "2026-07-19T12:02:00.000Z",
                }),
          );

        expect(
          resolutionError,
        ).toMatchObject({
          code:
            "SESSION_INVALID",
          message:
            "Authenticated owner session service is unavailable.",
        });

        const revocationRuntime =
          createMemoryRuntime({
            failQueryMarker:
              "session-revoke",
          });

        await activate(
          revocationRuntime,
        );

        const revocationSession =
          await revocationRuntime.access
            .authenticateAndIssueSession({
              email,
              password,
              ttlSeconds:
                3_600,
              authenticatedAt:
                "2026-07-19T12:01:00.000Z",
            });

        const revocationError =
          await captureFailure(
            () =>
              revocationRuntime.access
                .revokeSession({
                  sessionToken:
                    revocationSession
                      .sessionToken,
                  revokedAt:
                    "2026-07-19T12:03:00.000Z",
                }),
          );

        expect(
          revocationError,
        ).toMatchObject({
          code:
            "SESSION_REVOCATION_FAILED",
          message:
            "Authenticated owner session revocation service is unavailable.",
        });
      },
    );

    it(
      "fails credential activation when tenant-owner authority is inactive",
      async () => {
        const runtime =
          createMemoryRuntime();

        runtime.authority
          .membershipStatus =
          "SUSPENDED";

        await expect(
          activate(
            runtime,
          ),
        ).rejects.toMatchObject({
          code:
            "CREDENTIAL_ACTIVATION_FAILED",
        });

        expect(
          runtime.credentials.size,
        ).toBe(0);
      },
    );

    it(
      "invalidates an existing session when authority epoch changes",
      async () => {
        const runtime =
          createMemoryRuntime();

        await activate(
          runtime,
        );

        const issued =
          await runtime.access
            .authenticateAndIssueSession({
              email,
              password,
              ttlSeconds:
                3_600,
              authenticatedAt:
                "2026-07-19T12:01:00.000Z",
            });

        runtime.authority
          .authorityEpoch =
          "epoch-2";

        await expect(
          runtime.access
            .resolveSession({
              sessionToken:
                issued.sessionToken,
              resolvedAt:
                "2026-07-19T12:02:00.000Z",
            }),
        ).rejects.toMatchObject({
          code:
            "AUTHORITY_EPOCH_CHANGED",
        });
      },
    );

    it(
      "revokes a session idempotently and blocks subsequent resolution",
      async () => {
        const runtime =
          createMemoryRuntime();

        await activate(
          runtime,
        );

        const issued =
          await runtime.access
            .authenticateAndIssueSession({
              email,
              password,
              ttlSeconds:
                3_600,
              authenticatedAt:
                "2026-07-19T12:01:00.000Z",
            });

        const first =
          await runtime.access
            .revokeSession({
              sessionToken:
                issued.sessionToken,
              revokedAt:
                "2026-07-19T12:03:00.000Z",
            });

        const replay =
          await runtime.access
            .revokeSession({
              sessionToken:
                issued.sessionToken,
              revokedAt:
                "2026-07-19T12:04:00.000Z",
            });

        expect(
          replay.revokedAt,
        ).toBe(
          first.revokedAt,
        );

        await expect(
          runtime.access
            .resolveSession({
              sessionToken:
                issued.sessionToken,
              resolvedAt:
                "2026-07-19T12:05:00.000Z",
            }),
        ).rejects.toMatchObject({
          code:
            "SESSION_REVOKED",
        });
      },
    );

    it(
      "forces tenant row-level security on credential and session storage",
      async () => {
        const migration =
          await import(
            "node:fs/promises"
          ).then(
            ({ readFile }) =>
              readFile(
                "db/migrations/0771_authenticated_owner_access.sql",
                "utf8",
              ),
          );

        expect(
          migration,
        ).toMatch(
          /ALTER TABLE nexus_authenticated_owner_credentials\s+ENABLE ROW LEVEL SECURITY;/,
        );

        expect(
          migration,
        ).toMatch(
          /ALTER TABLE nexus_authenticated_owner_credentials\s+FORCE ROW LEVEL SECURITY;/,
        );

        expect(
          migration,
        ).toMatch(
          /ALTER TABLE nexus_authenticated_owner_sessions\s+ENABLE ROW LEVEL SECURITY;/,
        );

        expect(
          migration,
        ).toMatch(
          /ALTER TABLE nexus_authenticated_owner_sessions\s+FORCE ROW LEVEL SECURITY;/,
        );

        expect(
          migration,
        ).toMatch(
          /nexus_authenticated_owner_credentials_tenant_policy/,
        );

        expect(
          migration,
        ).toMatch(
          /nexus_authenticated_owner_sessions_tenant_policy/,
        );

        const tenantContextReferences =
          migration.match(
            /current_setting\('app\.tenant_id', true\)/g,
          ) ?? [];

        expect(
          tenantContextReferences,
        ).toHaveLength(4);
      },
    );
    it(
      "requires explicit owner approval and stores no plaintext password or raw token schema",
      async () => {
        const runtime =
          createMemoryRuntime();

        await expect(
          runtime.access
            .activateCredential({
              ownerId:
                "owner-launch-1",
              email,
              password,
              ownerApprovalGranted:
                false as true,
              activatedAt,
            }),
        ).rejects.toBeInstanceOf(
          PostgresAuthenticatedOwnerAccessError,
        );

        const migration =
          await import(
            "node:fs/promises"
          ).then(
            ({ readFile }) =>
              readFile(
                "db/migrations/0771_authenticated_owner_access.sql",
                "utf8",
              ),
          );

        expect(
          migration,
        ).not.toMatch(
          /password_plaintext|session_token\s+/i,
        );

        expect(
          migration,
        ).toMatch(
          /password_hash_hex/i,
        );

        expect(
          migration,
        ).toMatch(
          /session_digest/i,
        );
      },
    );
  },
);
