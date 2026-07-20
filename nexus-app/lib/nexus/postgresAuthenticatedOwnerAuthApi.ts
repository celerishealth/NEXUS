export interface PostgresAuthenticatedOwnerAuthAccess {
  activateCredential(
    input: Readonly<{
      ownerId: string;
      email: string;
      password: string;
      ownerApprovalGranted: true;
      activatedAt: string;
    }>,
  ): Promise<unknown>;

  authenticateAndIssueSession(
    input: Readonly<{
      email: string;
      password: string;
      ttlSeconds: number;
      authenticatedAt: string;
    }>,
  ): Promise<unknown>;

  resolveSession(
    input: Readonly<{
      sessionToken: string;
      resolvedAt: string;
    }>,
  ): Promise<unknown>;

  revokeSession(
    input: Readonly<{
      sessionToken: string;
      revokedAt: string;
    }>,
  ): Promise<unknown>;
}

export interface PostgresAuthenticatedOwnerAuthRuntime {
  createAccess(
    input: Readonly<{
      tenantId: string;
      requestId: string;
    }>,
  ): PostgresAuthenticatedOwnerAuthAccess;

  now(): string;

  randomRequestId(): string;
}

export interface PostgresAuthenticatedOwnerAuthHeaders {
  readonly authorization?: string;
  readonly tenantId?: string;
  readonly requestId?: string;
}

export interface PostgresAuthenticatedOwnerAuthResponse {
  readonly status: number;
  readonly body: Readonly<Record<string, unknown>>;
}

interface LoginBody {
  readonly tenantId: string;
  readonly email: string;
  readonly password: string;
}

interface ActivationBody {
  readonly tenantId: string;
  readonly ownerId: string;
  readonly email: string;
  readonly password: string;
}

interface AccessError {
  readonly code: string;
  readonly lockedUntil?: string;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readRequiredString(
  source: Record<string, unknown>,
  fieldName: string,
  trim: boolean,
): string {
  const value =
    source[fieldName];

  if (typeof value !== "string") {
    throw {
      code: "INVALID_INPUT",
    };
  }

  const normalized =
    trim
      ? value.trim()
      : value;

  if (normalized.length === 0) {
    throw {
      code: "INVALID_INPUT",
    };
  }

  return normalized;
}

function parseLoginBody(
  value: unknown,
): LoginBody {
  if (!isRecord(value)) {
    throw {
      code: "INVALID_INPUT",
    };
  }

  const tenantId =
    readRequiredString(
      value,
      "tenantId",
      true,
    );

  if (!UUID_PATTERN.test(tenantId)) {
    throw {
      code: "INVALID_INPUT",
    };
  }

  return {
    tenantId,
    email:
      readRequiredString(
        value,
        "email",
        true,
      ),
    password:
      readRequiredString(
        value,
        "password",
        false,
      ),
  };
}

function parseActivationBody(
  value: unknown,
): ActivationBody {
  if (!isRecord(value)) {
    throw {
      code: "INVALID_INPUT",
    };
  }

  const tenantId =
    readRequiredString(
      value,
      "tenantId",
      true,
    );

  const ownerId =
    readRequiredString(
      value,
      "ownerId",
      true,
    );

  if (
    !UUID_PATTERN.test(tenantId) ||
    !UUID_PATTERN.test(ownerId)
  ) {
    throw {
      code: "INVALID_INPUT",
    };
  }

  return {
    tenantId,
    ownerId,
    email:
      readRequiredString(
        value,
        "email",
        true,
      ),
    password:
      readRequiredString(
        value,
        "password",
        false,
      ),
  };
}

function readTenantId(
  headers:
    PostgresAuthenticatedOwnerAuthHeaders,
): string {
  const tenantId =
    headers.tenantId?.trim() ?? "";

  if (
    !tenantId ||
    !UUID_PATTERN.test(tenantId)
  ) {
    throw {
      code: "INVALID_INPUT",
    };
  }

  return tenantId;
}

function readBearerToken(
  headers:
    PostgresAuthenticatedOwnerAuthHeaders,
): string {
  const authorization =
    headers.authorization?.trim() ?? "";

  if (!authorization.startsWith("Bearer ")) {
    throw {
      code: "SESSION_INVALID",
    };
  }

  const token =
    authorization
      .slice(7)
      .trim();

  if (!token) {
    throw {
      code: "SESSION_INVALID",
    };
  }

  return token;
}

function readRequestId(
  headers:
    PostgresAuthenticatedOwnerAuthHeaders,
  runtime:
    PostgresAuthenticatedOwnerAuthRuntime,
): string {
  const supplied =
    headers.requestId?.trim() ?? "";

  if (supplied && UUID_PATTERN.test(supplied)) {
    return supplied;
  }

  return runtime.randomRequestId();
}

function requireResultString(
  value: Record<string, unknown>,
  fieldName: string,
): string {
  const fieldValue =
    value[fieldName];

  if (
    typeof fieldValue !== "string" ||
    fieldValue.length === 0
  ) {
    throw new Error(
      "Authenticated owner runtime returned an invalid result.",
    );
  }

  return fieldValue;
}

function requireResultNumber(
  value: Record<string, unknown>,
  fieldName: string,
): number {
  const fieldValue =
    value[fieldName];

  if (
    typeof fieldValue !== "number" ||
    !Number.isSafeInteger(fieldValue) ||
    fieldValue < 1
  ) {
    throw new Error(
      "Authenticated owner runtime returned an invalid result.",
    );
  }

  return fieldValue;
}

function requireResultBoolean(
  value: Record<string, unknown>,
  fieldName: string,
): boolean {
  const fieldValue =
    value[fieldName];

  if (typeof fieldValue !== "boolean") {
    throw new Error(
      "Authenticated owner runtime returned an invalid result.",
    );
  }

  return fieldValue;
}

function requireResultRecord(
  value: unknown,
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(
      "Authenticated owner runtime returned an invalid result.",
    );
  }

  return value;
}

function blockedBoundaries() {
  return {
    publicSignupAuthorized:
      false,
    publicLaunchAuthorized:
      false,
    liveProviderExecutionAuthorized:
      false,
    paymentExecutionAuthorized:
      false,
    externalDeliveryAuthorized:
      false,
  } as const;
}

function isAccessError(
  error: unknown,
): error is AccessError {
  return (
    isRecord(error) &&
    typeof error.code === "string"
  );
}

function failureResponse(
  error: unknown,
): PostgresAuthenticatedOwnerAuthResponse {
  if (!isAccessError(error)) {
    return {
      status: 503,
      body: {
        error:
          "Authenticated owner service is unavailable.",
        ...blockedBoundaries(),
      },
    };
  }

  switch (error.code) {
    case "INVALID_INPUT":
      return {
        status: 400,
        body: {
          error:
            "Invalid authentication request.",
          ...blockedBoundaries(),
        },
      };

    case "PRINCIPAL_LOCKED":
      return {
        status: 429,
        body: {
          error:
            "Authenticated owner is temporarily locked.",
          lockedUntil:
            typeof error.lockedUntil === "string"
              ? error.lockedUntil
              : undefined,
          ...blockedBoundaries(),
        },
      };

    case "OWNER_APPROVAL_REQUIRED":
    case "OWNER_AUTHORITY_REQUIRED":
    case "OWNER_AUTHORITY_INVALID":
      return {
        status: 403,
        body: {
          error:
            "Owner authority is not available.",
          ...blockedBoundaries(),
        },
      };

    case "AUTHENTICATION_FAILED":
    case "SESSION_NOT_FOUND":
    case "SESSION_INVALID":
    case "SESSION_REVOKED":
    case "SESSION_EXPIRED":
    case "AUTHORITY_EPOCH_CHANGED":
      return {
        status: 401,
        body: {
          error:
            "Authentication failed.",
          ...blockedBoundaries(),
        },
      };

    default:
      return {
        status: 503,
        body: {
          error:
            "Authenticated owner service is unavailable.",
          ...blockedBoundaries(),
        },
      };
  }
}

export async function activatePostgresAuthenticatedOwnerCredential(
  input: Readonly<{
    body: unknown;
    headers:
      PostgresAuthenticatedOwnerAuthHeaders;
    ownerApprovalGranted: boolean;
  }>,
  runtime:
    PostgresAuthenticatedOwnerAuthRuntime,
): Promise<PostgresAuthenticatedOwnerAuthResponse> {
  try {
    if (input.ownerApprovalGranted !== true) {
      throw {
        code:
          "OWNER_APPROVAL_REQUIRED",
      };
    }

    const body =
      parseActivationBody(
        input.body,
      );

    const headerTenantId =
      readTenantId(
        input.headers,
      );

    if (headerTenantId !== body.tenantId) {
      throw {
        code:
          "INVALID_INPUT",
      };
    }

    const access =
      runtime.createAccess({
        tenantId:
          body.tenantId,
        requestId:
          readRequestId(
            input.headers,
            runtime,
          ),
      });

    const rawResult =
      await access
        .activateCredential({
          ownerId:
            body.ownerId,
          email:
            body.email,
          password:
            body.password,
          ownerApprovalGranted:
            true,
          activatedAt:
            runtime.now(),
        });

    const result =
      requireResultRecord(
        rawResult,
      );

    return {
      status: 201,
      body: {
        activated:
          true,
        credential: {
          tenantId:
            requireResultString(
              result,
              "tenantId",
            ),
          ownerId:
            requireResultString(
              result,
              "ownerId",
            ),
          emailNormalized:
            requireResultString(
              result,
              "emailNormalized",
            ),
          status:
            requireResultString(
              result,
              "status",
            ),
          credentialVersion:
            requireResultNumber(
              result,
              "credentialVersion",
            ),
        },
        ...blockedBoundaries(),
      },
    };
  } catch (error) {
    return failureResponse(
      error,
    );
  }
}

export async function issuePostgresAuthenticatedOwnerSession(
  input: Readonly<{
    body: unknown;
    headers:
      PostgresAuthenticatedOwnerAuthHeaders;
    ttlSeconds: number;
  }>,
  runtime:
    PostgresAuthenticatedOwnerAuthRuntime,
): Promise<PostgresAuthenticatedOwnerAuthResponse> {
  try {
    if (
      !Number.isSafeInteger(input.ttlSeconds) ||
      input.ttlSeconds < 300 ||
      input.ttlSeconds > 86_400
    ) {
      throw {
        code: "INVALID_INPUT",
      };
    }

    const body =
      parseLoginBody(
        input.body,
      );

    const access =
      runtime.createAccess({
        tenantId:
          body.tenantId,
        requestId:
          readRequestId(
            input.headers,
            runtime,
          ),
      });

    const rawResult =
      await access
        .authenticateAndIssueSession({
          email:
            body.email,
          password:
            body.password,
          ttlSeconds:
            input.ttlSeconds,
          authenticatedAt:
            runtime.now(),
        });

    const result =
      requireResultRecord(
        rawResult,
      );

    return {
      status: 200,
      body: {
        tokenType:
          "Bearer",
        accessToken:
          requireResultString(
            result,
            "sessionToken",
          ),
        session: {
          sessionId:
            requireResultString(
              result,
              "sessionId",
            ),
          tenantId:
            requireResultString(
              result,
              "tenantId",
            ),
          actorId:
            requireResultString(
              result,
              "ownerId",
            ),
          ownerId:
            requireResultString(
              result,
              "ownerId",
            ),
          role:
            requireResultString(
              result,
              "role",
            ),
          authorityEpoch:
            requireResultString(
              result,
              "authorityEpoch",
            ),
          issuedAt:
            requireResultString(
              result,
              "issuedAt",
            ),
          expiresAt:
            requireResultString(
              result,
              "expiresAt",
            ),
        },
        ...blockedBoundaries(),
      },
    };
  } catch (error) {
    return failureResponse(
      error,
    );
  }
}

export async function resolvePostgresAuthenticatedOwnerSession(
  input: Readonly<{
    headers:
      PostgresAuthenticatedOwnerAuthHeaders;
  }>,
  runtime:
    PostgresAuthenticatedOwnerAuthRuntime,
): Promise<PostgresAuthenticatedOwnerAuthResponse> {
  try {
    const tenantId =
      readTenantId(
        input.headers,
      );

    const sessionToken =
      readBearerToken(
        input.headers,
      );

    const access =
      runtime.createAccess({
        tenantId,
        requestId:
          readRequestId(
            input.headers,
            runtime,
          ),
      });

    const rawResult =
      await access
        .resolveSession({
          sessionToken,
          resolvedAt:
            runtime.now(),
        });

    const result =
      requireResultRecord(
        rawResult,
      );

    return {
      status: 200,
      body: {
        authenticated:
          "authenticated" in result
            ? requireResultBoolean(
                result,
                "authenticated",
              )
            : true,
        session: {
          sessionId:
            requireResultString(
              result,
              "sessionId",
            ),
          tenantId:
            requireResultString(
              result,
              "tenantId",
            ),
          actorId:
            requireResultString(
              result,
              "ownerId",
            ),
          ownerId:
            requireResultString(
              result,
              "ownerId",
            ),
          role:
            requireResultString(
              result,
              "role",
            ),
          authorityEpoch:
            requireResultString(
              result,
              "authorityEpoch",
            ),
          expiresAt:
            requireResultString(
              result,
              "expiresAt",
            ),
        },
        ...blockedBoundaries(),
      },
    };
  } catch (error) {
    return failureResponse(
      error,
    );
  }
}

export async function revokePostgresAuthenticatedOwnerSession(
  input: Readonly<{
    headers:
      PostgresAuthenticatedOwnerAuthHeaders;
  }>,
  runtime:
    PostgresAuthenticatedOwnerAuthRuntime,
): Promise<PostgresAuthenticatedOwnerAuthResponse> {
  try {
    const tenantId =
      readTenantId(
        input.headers,
      );

    const sessionToken =
      readBearerToken(
        input.headers,
      );

    const access =
      runtime.createAccess({
        tenantId,
        requestId:
          readRequestId(
            input.headers,
            runtime,
          ),
      });

    const rawResult =
      await access
        .revokeSession({
          sessionToken,
          revokedAt:
            runtime.now(),
        });

    const result =
      requireResultRecord(
        rawResult,
      );

    return {
      status: 200,
      body: {
        revoked:
          requireResultBoolean(
            result,
            "revoked",
          ),
        revokedAt:
          requireResultString(
            result,
            "revokedAt",
          ),
        session: {
          sessionId:
            requireResultString(
              result,
              "sessionId",
            ),
          tenantId:
            requireResultString(
              result,
              "tenantId",
            ),
          actorId:
            requireResultString(
              result,
              "ownerId",
            ),
          ownerId:
            requireResultString(
              result,
              "ownerId",
            ),
        },
        ...blockedBoundaries(),
      },
    };
  } catch (error) {
    return failureResponse(
      error,
    );
  }
}
