import { describe, expect, it } from "vitest";

import {
  createPostgresAuthenticatedOwnerAuthRuntime,
} from "../postgresAuthenticatedOwnerAccessRuntime";

const REQUEST_ID =
  "55555555-5555-4555-8555-555555555555";

const ENVIRONMENT = {
  NODE_ENV: "test",
  DATABASE_URL: "postgres://example.invalid/nexus",
  NEXUS_AUTH_SYSTEM_ACTOR_ID:
    "66666666-6666-4666-8666-666666666666",
  NEXUS_DATABASE_SSL_MODE: "disable",
} as NodeJS.ProcessEnv;

describe("PostgreSQL authenticated-owner runtime database identity", () => {
  it("accepts a durable bounded text tenant identity", () => {
    const runtime =
      createPostgresAuthenticatedOwnerAuthRuntime(
        ENVIRONMENT,
      );

    expect(() =>
      runtime.createAccess({
        tenantId:
          "tenant-ppa-industrial-solution-v1",
        requestId: REQUEST_ID,
      }),
    ).not.toThrow();
  });

  it("rejects an oversized tenant identity", () => {
    const runtime =
      createPostgresAuthenticatedOwnerAuthRuntime(
        ENVIRONMENT,
      );

    expect(() =>
      runtime.createAccess({
        tenantId: "x".repeat(129),
        requestId: REQUEST_ID,
      }),
    ).toThrow();
  });
});
