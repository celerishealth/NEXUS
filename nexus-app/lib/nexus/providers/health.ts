import type {
  NexusProviderDescriptor,
  NexusProviderHealth,
} from "./types";

export function createProviderHealthSnapshot(
  provider: NexusProviderDescriptor,
  status: NexusProviderHealth["status"],
  reason?: string,
): NexusProviderHealth {
  return {
    providerId: provider.id,
    status,
    checkedAt: new Date().toISOString(),
    ...(reason ? { reason } : {}),
  };
}

export function isProviderOperational(
  health: NexusProviderHealth,
): boolean {
  return health.status === "available";
}

export function shouldFailClosed(
  healthChecks: NexusProviderHealth[],
): boolean {
  return healthChecks.every(
    (health) =>
      health.status === "unavailable" ||
      health.status === "not-configured",
  );
}
