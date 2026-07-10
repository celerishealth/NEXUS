export type ProviderContinuityServerRuntime =
  | "nodejs"
  | "edge"
  | "browser"
  | "unknown"

export type ProviderContinuityCredentialErrorCode =
  | "PRODUCTION_ENVIRONMENT_REQUIRED"
  | "NODE_SERVER_RUNTIME_REQUIRED"
  | "SUPABASE_URL_REQUIRED"
  | "INVALID_SUPABASE_URL"
  | "HTTPS_SUPABASE_URL_REQUIRED"
  | "SERVICE_ROLE_KEY_REQUIRED"
  | "SERVICE_ROLE_KEY_TOO_SHORT"
  | "SERVICE_ROLE_KEY_WHITESPACE_BLOCKED"
  | "PUBLIC_SERVICE_ROLE_ENV_BLOCKED"
  | "SERVICE_ROLE_ANON_KEY_COLLISION"

export class ProviderContinuityCredentialError
  extends Error
{
  constructor(
    readonly code:
      ProviderContinuityCredentialErrorCode,
    message: string,
  ) {
    super(message)
    this.name =
      "ProviderContinuityCredentialError"
  }
}

export interface ProviderContinuityServerCredentialInput {
  nodeEnvironment: string
  runtime: ProviderContinuityServerRuntime
  supabaseUrl: string | undefined
  serviceRoleKey: string | undefined
  anonKey?: string | undefined
  serviceRoleEnvironmentName?: string
}

export interface ProviderContinuityCredentialSummary {
  nodeEnvironment: "production"
  runtime: "nodejs"
  supabaseOrigin: string
  serviceRoleEnvironmentName: string
  serviceRoleKey: "[REDACTED]"
}

const requireNormalizedValue = (
  value: string | undefined,
  code: ProviderContinuityCredentialErrorCode,
  message: string,
): string => {
  const normalizedValue = value?.trim() ?? ""

  if (!normalizedValue) {
    throw new ProviderContinuityCredentialError(
      code,
      message,
    )
  }

  return normalizedValue
}

export class ValidatedProviderContinuityServerCredentials {
  readonly nodeEnvironment = "production" as const
  readonly runtime = "nodejs" as const
  readonly supabaseUrl: string
  readonly supabaseOrigin: string
  readonly serviceRoleEnvironmentName: string

  readonly #serviceRoleKey: string

  constructor(input: {
    supabaseUrl: string
    supabaseOrigin: string
    serviceRoleKey: string
    serviceRoleEnvironmentName: string
  }) {
    this.supabaseUrl = input.supabaseUrl
    this.supabaseOrigin = input.supabaseOrigin
    this.#serviceRoleKey = input.serviceRoleKey
    this.serviceRoleEnvironmentName =
      input.serviceRoleEnvironmentName
  }

  getServiceRoleKey(): string {
    return this.#serviceRoleKey
  }

  getSafeSummary():
    ProviderContinuityCredentialSummary {
    return {
      nodeEnvironment: this.nodeEnvironment,
      runtime: this.runtime,
      supabaseOrigin: this.supabaseOrigin,
      serviceRoleEnvironmentName:
        this.serviceRoleEnvironmentName,
      serviceRoleKey: "[REDACTED]",
    }
  }

  toJSON():
    ProviderContinuityCredentialSummary {
    return this.getSafeSummary()
  }
}

export const validateProviderContinuityServerCredentials =
  (
    input:
      ProviderContinuityServerCredentialInput,
  ): ValidatedProviderContinuityServerCredentials => {
    const nodeEnvironment =
      input.nodeEnvironment.trim().toLowerCase()

    if (nodeEnvironment !== "production") {
      throw new ProviderContinuityCredentialError(
        "PRODUCTION_ENVIRONMENT_REQUIRED",
        "provider continuity production bootstrap requires NODE_ENV=production",
      )
    }

    if (input.runtime !== "nodejs") {
      throw new ProviderContinuityCredentialError(
        "NODE_SERVER_RUNTIME_REQUIRED",
        "provider continuity service-role bootstrap is restricted to the Node.js server runtime",
      )
    }

    const supabaseUrl =
      requireNormalizedValue(
        input.supabaseUrl,
        "SUPABASE_URL_REQUIRED",
        "Supabase URL is required for provider continuity production bootstrap",
      )

    let parsedUrl: URL

    try {
      parsedUrl = new URL(supabaseUrl)
    } catch {
      throw new ProviderContinuityCredentialError(
        "INVALID_SUPABASE_URL",
        "provider continuity Supabase URL is invalid",
      )
    }

    if (
      parsedUrl.protocol !== "https:" ||
      !parsedUrl.hostname
    ) {
      throw new ProviderContinuityCredentialError(
        "HTTPS_SUPABASE_URL_REQUIRED",
        "provider continuity production Supabase URL must use HTTPS",
      )
    }

    const serviceRoleEnvironmentName =
      (
        input.serviceRoleEnvironmentName ??
        "SUPABASE_SERVICE_ROLE_KEY"
      ).trim()

    if (
      serviceRoleEnvironmentName
        .toUpperCase()
        .startsWith("NEXT_PUBLIC_")
    ) {
      throw new ProviderContinuityCredentialError(
        "PUBLIC_SERVICE_ROLE_ENV_BLOCKED",
        "service-role credential must never use a NEXT_PUBLIC environment variable",
      )
    }

    const serviceRoleKey =
      requireNormalizedValue(
        input.serviceRoleKey,
        "SERVICE_ROLE_KEY_REQUIRED",
        "Supabase service-role key is required for provider continuity production bootstrap",
      )

    if (serviceRoleKey.length < 20) {
      throw new ProviderContinuityCredentialError(
        "SERVICE_ROLE_KEY_TOO_SHORT",
        "Supabase service-role key failed minimum credential validation",
      )
    }

    if (/\s/.test(serviceRoleKey)) {
      throw new ProviderContinuityCredentialError(
        "SERVICE_ROLE_KEY_WHITESPACE_BLOCKED",
        "Supabase service-role key must not contain whitespace",
      )
    }

    const anonKey = input.anonKey?.trim()

    if (
      anonKey &&
      anonKey === serviceRoleKey
    ) {
      throw new ProviderContinuityCredentialError(
        "SERVICE_ROLE_ANON_KEY_COLLISION",
        "Supabase service-role key must not equal the anon key",
      )
    }

    return new ValidatedProviderContinuityServerCredentials({
      supabaseUrl: parsedUrl.toString(),
      supabaseOrigin: parsedUrl.origin,
      serviceRoleKey,
      serviceRoleEnvironmentName,
    })
  }
