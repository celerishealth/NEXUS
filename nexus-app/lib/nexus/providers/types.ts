export type NexusProviderCategory =
  | "database"
  | "ai"
  | "messaging"
  | "payments";

export type NexusProviderStatus =
  | "available"
  | "degraded"
  | "unavailable"
  | "not-configured";

export type NexusProviderDescriptor = {
  id: string;
  category: NexusProviderCategory;
  priority: number;
  enabled: boolean;
  supportsFallback: boolean;
};

export type NexusProviderHealth = {
  providerId: string;
  status: NexusProviderStatus;
  checkedAt: string;
  reason?: string;
};

export type NexusProviderSelection = {
  selectedProviderId: string | null;
  fallbackUsed: boolean;
  blocked: boolean;
  reason: string;
};
