export type SupabaseEnvironmentKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "SUPABASE_DATABASE_URL";

export type SupabaseEnvironmentPresenceCheck = {
  key: SupabaseEnvironmentKey;
  configured: boolean;
  exposure: "public" | "server-only";
  requiredForBaseClient: boolean;
};

export type SupabaseEnvironmentPresenceResult = {
  status: "configured" | "blocked";
  readyForBaseClient: boolean;
  checks: SupabaseEnvironmentPresenceCheck[];
  missingRequiredKeys: SupabaseEnvironmentKey[];
  secretValuesExposed: false;
  databaseConnectionAttempted: false;
  lockedBoundaries: string[];
};

function hasConfiguredValue(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateSupabaseEnvironmentPresence(
  environment: NodeJS.ProcessEnv = process.env,
): SupabaseEnvironmentPresenceResult {
  const checks: SupabaseEnvironmentPresenceCheck[] = [
    {
      key: "NEXT_PUBLIC_SUPABASE_URL",
      configured: hasConfiguredValue(environment.NEXT_PUBLIC_SUPABASE_URL),
      exposure: "public",
      requiredForBaseClient: true,
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      configured: hasConfiguredValue(
        environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ),
      exposure: "public",
      requiredForBaseClient: true,
    },
    {
      key: "SUPABASE_SERVICE_ROLE_KEY",
      configured: hasConfiguredValue(environment.SUPABASE_SERVICE_ROLE_KEY),
      exposure: "server-only",
      requiredForBaseClient: false,
    },
    {
      key: "SUPABASE_DATABASE_URL",
      configured: hasConfiguredValue(environment.SUPABASE_DATABASE_URL),
      exposure: "server-only",
      requiredForBaseClient: false,
    },
  ];

  const missingRequiredKeys = checks
    .filter((check) => check.requiredForBaseClient && !check.configured)
    .map((check) => check.key);

  const readyForBaseClient = missingRequiredKeys.length === 0;

  return {
    status: readyForBaseClient ? "configured" : "blocked",
    readyForBaseClient,
    checks,
    missingRequiredKeys,
    secretValuesExposed: false,
    databaseConnectionAttempted: false,
    lockedBoundaries: [
      "No secret value is returned.",
      "No database query is executed.",
      "No schema migration is executed.",
      "No real database write is authorized.",
      "No real audit write is authorized.",
      "No real customer-memory write is authorized.",
      "No customer signup is authorized.",
      "No public launch is authorized.",
      "No payment automation is authorized.",
      "No WhatsApp auto-send is authorized.",
      "No uncontrolled AI action is authorized.",
    ],
  };
}
