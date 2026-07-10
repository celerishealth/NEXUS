export type SupabaseReadinessCheck = {
  key: string;
  configured: boolean;
  exposure: "public" | "server-only";
  requiredForConnection: boolean;
};

export type SupabaseIntegrationReadinessResult = {
  status: "ready-for-controlled-connection" | "blocked";
  ready: boolean;
  checks: SupabaseReadinessCheck[];
  missingRequiredConfiguration: string[];
  lockedBoundaries: string[];
};

const hasValue = (value: string | undefined): boolean =>
  typeof value === "string" && value.trim().length > 0;

export function validateSupabaseIntegrationReadiness(
  environment: NodeJS.ProcessEnv = process.env,
): SupabaseIntegrationReadinessResult {
  const checks: SupabaseReadinessCheck[] = [
    {
      key: "NEXT_PUBLIC_SUPABASE_URL",
      configured: hasValue(environment.NEXT_PUBLIC_SUPABASE_URL),
      exposure: "public",
      requiredForConnection: true,
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      configured: hasValue(environment.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      exposure: "public",
      requiredForConnection: true,
    },
    {
      key: "SUPABASE_SERVICE_ROLE_KEY",
      configured: hasValue(environment.SUPABASE_SERVICE_ROLE_KEY),
      exposure: "server-only",
      requiredForConnection: false,
    },
    {
      key: "SUPABASE_DATABASE_URL",
      configured: hasValue(environment.SUPABASE_DATABASE_URL),
      exposure: "server-only",
      requiredForConnection: false,
    },
  ];

  const missingRequiredConfiguration = checks
    .filter((check) => check.requiredForConnection && !check.configured)
    .map((check) => check.key);

  const ready = missingRequiredConfiguration.length === 0;

  return {
    status: ready ? "ready-for-controlled-connection" : "blocked",
    ready,
    checks,
    missingRequiredConfiguration,
    lockedBoundaries: [
      "No real database write is authorized.",
      "No schema migration is authorized.",
      "No customer signup is authorized.",
      "No public launch is authorized.",
      "No payment automation is authorized.",
      "No WhatsApp auto-send is authorized.",
      "No uncontrolled AI action is authorized.",
    ],
  };
}
