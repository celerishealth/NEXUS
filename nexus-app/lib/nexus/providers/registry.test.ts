import { describe, expect, it } from "vitest";
import { NexusProviderRegistry } from "./registry";

describe("NexusProviderRegistry", () => {
  const registry = new NexusProviderRegistry([
    {
      id: "primary",
      category: "database",
      priority: 1,
      enabled: true,
      supportsFallback: true,
    },
    {
      id: "secondary",
      category: "database",
      priority: 2,
      enabled: true,
      supportsFallback: true,
    },
  ]);

  it("selects the healthy primary provider", () => {
    const result = registry.selectProvider("database", [
      {
        providerId: "primary",
        status: "available",
        checkedAt: new Date().toISOString(),
      },
      {
        providerId: "secondary",
        status: "available",
        checkedAt: new Date().toISOString(),
      },
    ]);

    expect(result.selectedProviderId).toBe("primary");
    expect(result.fallbackUsed).toBe(false);
    expect(result.blocked).toBe(false);
  });

  it("selects the approved fallback when primary is unavailable", () => {
    const result = registry.selectProvider("database", [
      {
        providerId: "primary",
        status: "unavailable",
        checkedAt: new Date().toISOString(),
      },
      {
        providerId: "secondary",
        status: "available",
        checkedAt: new Date().toISOString(),
      },
    ]);

    expect(result.selectedProviderId).toBe("secondary");
    expect(result.fallbackUsed).toBe(true);
    expect(result.blocked).toBe(false);
  });

  it("fails closed when all providers are unavailable", () => {
    const result = registry.selectProvider("database", [
      {
        providerId: "primary",
        status: "unavailable",
        checkedAt: new Date().toISOString(),
      },
      {
        providerId: "secondary",
        status: "unavailable",
        checkedAt: new Date().toISOString(),
      },
    ]);

    expect(result.selectedProviderId).toBeNull();
    expect(result.blocked).toBe(true);
  });

  it("blocks when no provider is enabled", () => {
    const emptyRegistry = new NexusProviderRegistry([]);

    const result = emptyRegistry.selectProvider("ai", []);

    expect(result.blocked).toBe(true);
    expect(result.selectedProviderId).toBeNull();
  });
});
