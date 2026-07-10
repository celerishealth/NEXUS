import { describe, expect, it } from "vitest";
import { validateSupabaseIntegrationReadiness } from "./supabaseIntegrationReadiness";

describe("validateSupabaseIntegrationReadiness", () => {
  it("fails closed when required configuration is absent", () => {
    const result = validateSupabaseIntegrationReadiness({});

    expect(result.status).toBe("blocked");
    expect(result.ready).toBe(false);
    expect(result.missingRequiredConfiguration).toEqual([
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]);
  });

  it("allows controlled connection readiness with public configuration", () => {
    const result = validateSupabaseIntegrationReadiness({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    });

    expect(result.status).toBe("ready-for-controlled-connection");
    expect(result.ready).toBe(true);
    expect(result.missingRequiredConfiguration).toEqual([]);
  });

  it("keeps privileged keys server-only", () => {
    const result = validateSupabaseIntegrationReadiness({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-secret",
      SUPABASE_DATABASE_URL: "postgresql://secret",
    });

    const privilegedChecks = result.checks.filter(
      (check) => check.exposure === "server-only",
    );

    expect(privilegedChecks).toHaveLength(2);
    expect(
      privilegedChecks.every((check) => check.requiredForConnection === false),
    ).toBe(true);
  });

  it("preserves locked execution boundaries", () => {
    const result = validateSupabaseIntegrationReadiness({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    });

    expect(result.lockedBoundaries).toContain(
      "No real database write is authorized.",
    );
    expect(result.lockedBoundaries).toContain(
      "No uncontrolled AI action is authorized.",
    );
  });
});
