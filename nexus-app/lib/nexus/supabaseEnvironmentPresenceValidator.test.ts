import { describe, expect, it } from "vitest";
import { validateSupabaseEnvironmentPresence } from "./supabaseEnvironmentPresenceValidator";

describe("validateSupabaseEnvironmentPresence", () => {
  it("blocks when required public configuration is missing", () => {
    const result = validateSupabaseEnvironmentPresence({});

    expect(result.status).toBe("blocked");
    expect(result.readyForBaseClient).toBe(false);
    expect(result.missingRequiredKeys).toEqual([
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]);
    expect(result.secretValuesExposed).toBe(false);
    expect(result.databaseConnectionAttempted).toBe(false);
  });

  it("becomes ready when both required public values exist", () => {
    const result = validateSupabaseEnvironmentPresence({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    });

    expect(result.status).toBe("configured");
    expect(result.readyForBaseClient).toBe(true);
    expect(result.missingRequiredKeys).toEqual([]);
  });

  it("treats whitespace-only values as missing", () => {
    const result = validateSupabaseEnvironmentPresence({
      NEXT_PUBLIC_SUPABASE_URL: "   ",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    });

    expect(result.readyForBaseClient).toBe(false);
    expect(result.missingRequiredKeys).toHaveLength(2);
  });

  it("does not require privileged credentials for the base client", () => {
    const result = validateSupabaseEnvironmentPresence({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    });

    const serviceRoleCheck = result.checks.find(
      (check) => check.key === "SUPABASE_SERVICE_ROLE_KEY",
    );

    const databaseUrlCheck = result.checks.find(
      (check) => check.key === "SUPABASE_DATABASE_URL",
    );

    expect(serviceRoleCheck?.requiredForBaseClient).toBe(false);
    expect(databaseUrlCheck?.requiredForBaseClient).toBe(false);
  });
});
