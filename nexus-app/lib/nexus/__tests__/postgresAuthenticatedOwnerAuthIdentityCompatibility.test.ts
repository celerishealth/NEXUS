import { describe, expect, it, vi } from "vitest";

import {
  activatePostgresAuthenticatedOwnerCredential,
  resolvePostgresAuthenticatedOwnerSession,
  type PostgresAuthenticatedOwnerAuthAccess,
  type PostgresAuthenticatedOwnerAuthRuntime,
} from "../postgresAuthenticatedOwnerAuthApi";

const TENANT_ID =
  "tenant-ppa-industrial-solution-v1";
const OWNER_ID =
  "owner-prashant-srivastav-v1";
const REQUEST_ID =
  "55555555-5555-4555-8555-555555555555";
const NOW =
  "2026-07-28T00:00:00.000Z";

function createHarness() {
  const access: PostgresAuthenticatedOwnerAuthAccess = {
    activateCredential: vi.fn(async () => ({
      tenantId: TENANT_ID,
      ownerId: OWNER_ID,
      emailNormalized: "owner@nexus.test",
      status: "ACTIVE",
      credentialVersion: 1,
    })),
    authenticateAndIssueSession: vi.fn(async () => ({})),
    resolveSession: vi.fn(async () => ({})),
    revokeSession: vi.fn(async () => ({})),
  };

  const createAccess =
    vi.fn(() => access);

  const runtime: PostgresAuthenticatedOwnerAuthRuntime = {
    createAccess,
    now: () => NOW,
    randomRequestId: () => REQUEST_ID,
  };

  return { createAccess, runtime };
}

describe("PostgreSQL authenticated-owner database identity compatibility", () => {
  it("accepts durable bounded text tenant and owner identities", async () => {
    const { createAccess, runtime } =
      createHarness();

    const result =
      await activatePostgresAuthenticatedOwnerCredential(
        {
          body: {
            tenantId: TENANT_ID,
            ownerId: OWNER_ID,
            email: "owner@nexus.test",
            password: "controlled-password",
          },
          headers: {
            tenantId: TENANT_ID,
            requestId: REQUEST_ID,
          },
          ownerApprovalGranted: true,
        },
        runtime,
      );

    expect(result.status).toBe(201);
    expect(createAccess).toHaveBeenCalledWith({
      tenantId: TENANT_ID,
      requestId: REQUEST_ID,
    });
  });

  it("rejects an oversized tenant identity before access creation", async () => {
    const { createAccess, runtime } =
      createHarness();

    const result =
      await resolvePostgresAuthenticatedOwnerSession(
        {
          headers: {
            tenantId: "x".repeat(129),
            authorization: "Bearer opaque-token",
          },
        },
        runtime,
      );

    expect(result.status).toBe(400);
    expect(createAccess).not.toHaveBeenCalled();
  });
});
