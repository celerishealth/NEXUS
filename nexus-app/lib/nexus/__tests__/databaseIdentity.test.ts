import {
  describe,
  expect,
  it,
} from "vitest";

import {
  DATABASE_IDENTITY_MAX_LENGTH,
  normalizeDatabaseIdentity,
} from "../databaseIdentity";

describe("database identity", () => {
  it("accepts and trims bounded durable text identities", () => {
    expect(
      normalizeDatabaseIdentity(
        " tenant-ppa-industrial-solution-v1 ",
      ),
    ).toBe(
      "tenant-ppa-industrial-solution-v1",
    );
  });

  it("rejects missing, oversized, and control-character identities", () => {
    expect(normalizeDatabaseIdentity(null)).toBeNull();
    expect(normalizeDatabaseIdentity("   ")).toBeNull();
    expect(
      normalizeDatabaseIdentity(
        "x".repeat(
          DATABASE_IDENTITY_MAX_LENGTH + 1,
        ),
      ),
    ).toBeNull();
    expect(
      normalizeDatabaseIdentity(
        "tenant" + String.fromCharCode(0) + "a",
      ),
    ).toBeNull();
  });
});
