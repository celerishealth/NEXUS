import type {
  NexusProviderCategory,
  NexusProviderDescriptor,
  NexusProviderHealth,
  NexusProviderSelection,
} from "./types";

export class NexusProviderRegistry {
  private readonly providers: NexusProviderDescriptor[];

  constructor(providers: NexusProviderDescriptor[]) {
    this.providers = [...providers].sort(
      (left, right) => left.priority - right.priority,
    );
  }

  getProviders(category: NexusProviderCategory): NexusProviderDescriptor[] {
    return this.providers.filter(
      (provider) => provider.category === category && provider.enabled,
    );
  }

  selectProvider(
    category: NexusProviderCategory,
    healthChecks: NexusProviderHealth[],
  ): NexusProviderSelection {
    const candidates = this.getProviders(category);

    if (candidates.length === 0) {
      return {
        selectedProviderId: null,
        fallbackUsed: false,
        blocked: true,
        reason: `No enabled ${category} provider is configured.`,
      };
    }

    for (let index = 0; index < candidates.length; index += 1) {
      const provider = candidates[index];
      const health = healthChecks.find(
        (check) => check.providerId === provider.id,
      );

      if (health?.status === "available") {
        return {
          selectedProviderId: provider.id,
          fallbackUsed: index > 0,
          blocked: false,
          reason:
            index === 0
              ? "Primary provider selected."
              : "Primary provider unavailable; approved fallback selected.",
        };
      }

      if (!provider.supportsFallback) {
        return {
          selectedProviderId: null,
          fallbackUsed: false,
          blocked: true,
          reason: `${provider.id} is unavailable and fallback is not authorized.`,
        };
      }
    }

    return {
      selectedProviderId: null,
      fallbackUsed: false,
      blocked: true,
      reason: `All enabled ${category} providers are unavailable.`,
    };
  }
}

export const nexusProviderRegistry = new NexusProviderRegistry([
  {
    id: "supabase",
    category: "database",
    priority: 1,
    enabled: true,
    supportsFallback: true,
  },
  {
    id: "postgres-compatible-secondary",
    category: "database",
    priority: 2,
    enabled: false,
    supportsFallback: true,
  },
  {
    id: "primary-ai",
    category: "ai",
    priority: 1,
    enabled: false,
    supportsFallback: true,
  },
  {
    id: "secondary-ai",
    category: "ai",
    priority: 2,
    enabled: false,
    supportsFallback: true,
  },
  {
    id: "primary-messaging",
    category: "messaging",
    priority: 1,
    enabled: false,
    supportsFallback: true,
  },
  {
    id: "primary-payments",
    category: "payments",
    priority: 1,
    enabled: false,
    supportsFallback: false,
  },
]);
