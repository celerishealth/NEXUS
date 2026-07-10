import {
  createHmac,
  timingSafeEqual,
} from "node:crypto"

import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export type ProviderOwnerResolutionDecision =
  | "confirm-completed"
  | "authorize-single-retry"

export interface TrustedOwnerActorContext {
  ownerId: string
  tenantId: string
  roles: string[]
  stepUpVerified: boolean
  authenticatedAt: number
  sessionExpiresAt: number
}

export interface IssueProviderOwnerResolutionAuthorizationInput {
  actor: TrustedOwnerActorContext
  providerDomain: ProviderDomain
  operationId: string
  decision: ProviderOwnerResolutionDecision
  authorizationId: string
  reason: string
  verificationReference: string
  retryAuthorizationId?: string
  ttlMs: number
}

export interface ProviderOwnerResolutionAuthorizationClaims {
  version: 1
  authorizationId: string
  tenantId: string
  providerDomain: ProviderDomain
  operationId: string
  decision: ProviderOwnerResolutionDecision
  ownerId: string
  role: "owner"
  stepUpVerified: true
  reason: string
  verificationReference: string
  retryAuthorizationId: string | null
  issuedAt: number
  expiresAt: number
}

export interface VerifyProviderOwnerResolutionAuthorizationInput {
  token: string
  tenantId: string
  providerDomain: ProviderDomain
  operationId: string
  decision: ProviderOwnerResolutionDecision
}

export type ProviderOwnerAuthorityErrorCode =
  | "OWNER_AUTHORITY_SECRET_REQUIRED"
  | "OWNER_AUTHORITY_SECRET_TOO_SHORT"
  | "PUBLIC_OWNER_AUTHORITY_SECRET_BLOCKED"
  | "OWNER_ROLE_REQUIRED"
  | "OWNER_STEP_UP_REQUIRED"
  | "OWNER_SESSION_EXPIRED"
  | "OWNER_SESSION_TOO_OLD"
  | "OWNER_AUTHORIZATION_TTL_INVALID"
  | "OWNER_AUTHORIZATION_TOKEN_INVALID"
  | "OWNER_AUTHORIZATION_EXPIRED"
  | "OWNER_AUTHORIZATION_SCOPE_MISMATCH"
  | "OWNER_AUTHORIZATION_DECISION_MISMATCH"
  | "OWNER_AUTHORIZATION_RETRY_ID_REQUIRED"

export class ProviderOwnerAuthorityError
  extends Error
{
  constructor(
    readonly code:
      ProviderOwnerAuthorityErrorCode,
    message: string,
  ) {
    super(message)
    this.name =
      "ProviderOwnerAuthorityError"
  }
}

export interface CreateProviderOwnerResolutionAuthorityInput {
  secret: string | undefined
  secretEnvironmentName?: string
  maxAuthorizationTtlMs?: number
  maxSessionAgeMs?: number
  now?: () => number
}

const providerDomains =
  new Set<ProviderDomain>([
    "database",
    "ai",
    "messaging",
    "payments",
  ])

const decisions =
  new Set<ProviderOwnerResolutionDecision>([
    "confirm-completed",
    "authorize-single-retry",
  ])

const requireValue = (
  value: string | undefined,
  fieldName: string,
  maximumLength = 500,
): string => {
  const normalizedValue = value?.trim() ?? ""

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required`)
  }

  if (normalizedValue.length > maximumLength) {
    throw new Error(
      `${fieldName} exceeds maximum length of ${maximumLength}`,
    )
  }

  return normalizedValue
}

const requirePositiveInteger = (
  value: number,
  fieldName: string,
): number => {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(
      `${fieldName} must be a positive integer`,
    )
  }

  return value
}

const isRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value)

const readString = (
  value: unknown,
  fieldName: string,
): string => {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new ProviderOwnerAuthorityError(
      "OWNER_AUTHORIZATION_TOKEN_INVALID",
      `invalid owner authorization field: ${fieldName}`,
    )
  }

  return value
}

const readNumber = (
  value: unknown,
  fieldName: string,
): number => {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new ProviderOwnerAuthorityError(
      "OWNER_AUTHORIZATION_TOKEN_INVALID",
      `invalid owner authorization field: ${fieldName}`,
    )
  }

  return value
}

const encodeBase64Url = (
  value: string,
): string =>
  Buffer.from(value, "utf8").toString(
    "base64url",
  )

const decodeBase64Url = (
  value: string,
): string =>
  Buffer.from(value, "base64url").toString(
    "utf8",
  )

const signSegment = (
  secret: string,
  payloadSegment: string,
): string =>
  createHmac("sha256", secret)
    .update(payloadSegment)
    .digest("base64url")

const signaturesMatch = (
  expected: string,
  received: string,
): boolean => {
  let expectedBuffer: Buffer
  let receivedBuffer: Buffer

  try {
    expectedBuffer = Buffer.from(
      expected,
      "base64url",
    )
    receivedBuffer = Buffer.from(
      received,
      "base64url",
    )
  } catch {
    return false
  }

  if (
    expectedBuffer.length === 0 ||
    expectedBuffer.length !==
      receivedBuffer.length
  ) {
    return false
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer,
  )
}

const parseClaims = (
  value: unknown,
): ProviderOwnerResolutionAuthorizationClaims => {
  if (!isRecord(value)) {
    throw new ProviderOwnerAuthorityError(
      "OWNER_AUTHORIZATION_TOKEN_INVALID",
      "owner resolution authorization payload is invalid",
    )
  }

  const providerDomain = readString(
    value.providerDomain,
    "providerDomain",
  ) as ProviderDomain

  const decision = readString(
    value.decision,
    "decision",
  ) as ProviderOwnerResolutionDecision

  if (
    value.version !== 1 ||
    !providerDomains.has(providerDomain) ||
    !decisions.has(decision) ||
    value.role !== "owner" ||
    value.stepUpVerified !== true
  ) {
    throw new ProviderOwnerAuthorityError(
      "OWNER_AUTHORIZATION_TOKEN_INVALID",
      "owner resolution authorization claims are invalid",
    )
  }

  const retryAuthorizationId =
    value.retryAuthorizationId === null
      ? null
      : readString(
          value.retryAuthorizationId,
          "retryAuthorizationId",
        )

  if (
    decision === "authorize-single-retry" &&
    !retryAuthorizationId
  ) {
    throw new ProviderOwnerAuthorityError(
      "OWNER_AUTHORIZATION_RETRY_ID_REQUIRED",
      "single-retry authorization requires retryAuthorizationId",
    )
  }

  if (
    decision === "confirm-completed" &&
    retryAuthorizationId !== null
  ) {
    throw new ProviderOwnerAuthorityError(
      "OWNER_AUTHORIZATION_TOKEN_INVALID",
      "confirm-completed authorization must not include retryAuthorizationId",
    )
  }

  return {
    version: 1,
    authorizationId: readString(
      value.authorizationId,
      "authorizationId",
    ),
    tenantId: readString(
      value.tenantId,
      "tenantId",
    ),
    providerDomain,
    operationId: readString(
      value.operationId,
      "operationId",
    ),
    decision,
    ownerId: readString(
      value.ownerId,
      "ownerId",
    ),
    role: "owner",
    stepUpVerified: true,
    reason: readString(
      value.reason,
      "reason",
    ),
    verificationReference: readString(
      value.verificationReference,
      "verificationReference",
    ),
    retryAuthorizationId,
    issuedAt: readNumber(
      value.issuedAt,
      "issuedAt",
    ),
    expiresAt: readNumber(
      value.expiresAt,
      "expiresAt",
    ),
  }
}

export class ProviderOwnerResolutionAuthority {
  readonly #secret: string
  readonly #maxAuthorizationTtlMs: number
  readonly #maxSessionAgeMs: number
  readonly #now: () => number

  constructor(
    input:
      CreateProviderOwnerResolutionAuthorityInput,
  ) {
    const secretEnvironmentName =
      (
        input.secretEnvironmentName ??
        "NEXUS_OWNER_AUTHORIZATION_SECRET"
      ).trim()

    if (
      secretEnvironmentName
        .toUpperCase()
        .startsWith("NEXT_PUBLIC_")
    ) {
      throw new ProviderOwnerAuthorityError(
        "PUBLIC_OWNER_AUTHORITY_SECRET_BLOCKED",
        "owner authorization secret must never use a NEXT_PUBLIC environment variable",
      )
    }

    const secret = input.secret?.trim() ?? ""

    if (!secret) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_AUTHORITY_SECRET_REQUIRED",
        "owner authorization signing secret is required",
      )
    }

    if (
      Buffer.byteLength(secret, "utf8") < 32
    ) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_AUTHORITY_SECRET_TOO_SHORT",
        "owner authorization signing secret must contain at least 32 bytes",
      )
    }

    this.#secret = secret
    this.#maxAuthorizationTtlMs =
      requirePositiveInteger(
        input.maxAuthorizationTtlMs ??
          5 * 60 * 1000,
        "maxAuthorizationTtlMs",
      )
    this.#maxSessionAgeMs =
      requirePositiveInteger(
        input.maxSessionAgeMs ??
          10 * 60 * 1000,
        "maxSessionAgeMs",
      )
    this.#now = input.now ?? Date.now
  }

  issue(
    input:
      IssueProviderOwnerResolutionAuthorizationInput,
  ): string {
    const now = this.#now()

    const ownerId = requireValue(
      input.actor.ownerId,
      "actor.ownerId",
      128,
    )
    const tenantId = requireValue(
      input.actor.tenantId,
      "actor.tenantId",
      128,
    )

    if (
      !input.actor.roles.includes("owner")
    ) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_ROLE_REQUIRED",
        "owner role is required for execution resolution",
      )
    }

    if (!input.actor.stepUpVerified) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_STEP_UP_REQUIRED",
        "step-up owner verification is required for execution resolution",
      )
    }

    if (
      input.actor.sessionExpiresAt <= now
    ) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_SESSION_EXPIRED",
        "owner session has expired",
      )
    }

    if (
      input.actor.authenticatedAt > now ||
      now -
        input.actor.authenticatedAt >
        this.#maxSessionAgeMs
    ) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_SESSION_TOO_OLD",
        "owner authentication is not recent enough for execution resolution",
      )
    }

    const ttlMs = requirePositiveInteger(
      input.ttlMs,
      "ttlMs",
    )

    if (
      ttlMs >
        this.#maxAuthorizationTtlMs ||
      now + ttlMs >
        input.actor.sessionExpiresAt
    ) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_AUTHORIZATION_TTL_INVALID",
        "owner authorization lifetime exceeds its permitted security window",
      )
    }

    const retryAuthorizationId =
      input.decision ===
      "authorize-single-retry"
        ? requireValue(
            input.retryAuthorizationId,
            "retryAuthorizationId",
            128,
          )
        : null

    const claims:
      ProviderOwnerResolutionAuthorizationClaims =
      {
        version: 1,
        authorizationId: requireValue(
          input.authorizationId,
          "authorizationId",
          128,
        ),
        tenantId,
        providerDomain:
          input.providerDomain,
        operationId: requireValue(
          input.operationId,
          "operationId",
          200,
        ),
        decision: input.decision,
        ownerId,
        role: "owner",
        stepUpVerified: true,
        reason: requireValue(
          input.reason,
          "reason",
          500,
        ),
        verificationReference:
          requireValue(
            input.verificationReference,
            "verificationReference",
            300,
          ),
        retryAuthorizationId,
        issuedAt: now,
        expiresAt: now + ttlMs,
      }

    const payloadSegment = encodeBase64Url(
      JSON.stringify(claims),
    )

    const signatureSegment = signSegment(
      this.#secret,
      payloadSegment,
    )

    return `${payloadSegment}.${signatureSegment}`
  }

  verify(
    input:
      VerifyProviderOwnerResolutionAuthorizationInput,
  ): ProviderOwnerResolutionAuthorizationClaims {
    const token = requireValue(
      input.token,
      "authorizationToken",
      10_000,
    )

    const segments = token.split(".")

    if (segments.length !== 2) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_AUTHORIZATION_TOKEN_INVALID",
        "owner resolution authorization token is malformed",
      )
    }

    const [
      payloadSegment,
      receivedSignature,
    ] = segments

    const expectedSignature = signSegment(
      this.#secret,
      payloadSegment,
    )

    if (
      !signaturesMatch(
        expectedSignature,
        receivedSignature,
      )
    ) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_AUTHORIZATION_TOKEN_INVALID",
        "owner resolution authorization signature is invalid",
      )
    }

    let decodedClaims: unknown

    try {
      decodedClaims = JSON.parse(
        decodeBase64Url(payloadSegment),
      )
    } catch {
      throw new ProviderOwnerAuthorityError(
        "OWNER_AUTHORIZATION_TOKEN_INVALID",
        "owner resolution authorization payload cannot be decoded",
      )
    }

    const claims = parseClaims(
      decodedClaims,
    )

    const now = this.#now()

    if (
      claims.expiresAt <= now ||
      claims.issuedAt > now ||
      claims.expiresAt -
        claims.issuedAt >
        this.#maxAuthorizationTtlMs
    ) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_AUTHORIZATION_EXPIRED",
        "owner resolution authorization has expired or has an invalid lifetime",
      )
    }

    if (
      claims.tenantId !==
        input.tenantId ||
      claims.providerDomain !==
        input.providerDomain ||
      claims.operationId !==
        input.operationId
    ) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_AUTHORIZATION_SCOPE_MISMATCH",
        "owner resolution authorization does not match the requested tenant, provider domain, or operation",
      )
    }

    if (
      claims.decision !== input.decision
    ) {
      throw new ProviderOwnerAuthorityError(
        "OWNER_AUTHORIZATION_DECISION_MISMATCH",
        "owner resolution authorization does not permit the requested decision",
      )
    }

    return claims
  }
}

export const createProviderOwnerResolutionAuthority =
  (
    input:
      CreateProviderOwnerResolutionAuthorityInput,
  ): ProviderOwnerResolutionAuthority =>
    new ProviderOwnerResolutionAuthority(
      input,
    )
