export type FounderEmergencyFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface FounderEmergencyLoginInput {
  tenantId: string;
  email: string;
  password: string;
}

export interface FounderEmergencySession {
  accessToken: string;
  tenantId: string;
  actorId: string;
  role: string;
  expiresAt: string;
}

export interface FounderEmergencyOperationSnapshot {
  tenantId: string;
  ownerActorId: string;
  operationStatus: "active" | "paused";
  blockingSignalId: string | null;
  stateVersion: number;
  lastTransitionAt: number;
  liveProviderExecutionAuthorized: false;
  resumeAuthorized: false;
}

export interface FounderEmergencyStatusResult
  extends FounderEmergencyOperationSnapshot {
  mode:
    "authenticated-founder-emergency-status-v1";
  emergencyPauseAvailable: boolean;
}

export interface FounderEmergencyPauseResult
  extends FounderEmergencyOperationSnapshot {
  mode:
    "authenticated-founder-emergency-pause-v1";
  pauseStatus:
    | "paused"
    | "already-paused";
}

export interface FounderEmergencyLogoutResult {
  revoked: true;
  revokedAt: string;
  liveProviderExecutionAuthorized: false;
  resumeAuthorized: false;
}

export class FounderEmergencyClientError
  extends Error {
  readonly status: number;

  constructor(
    status: number,
    message: string,
  ) {
    super(message);
    this.name =
      "FounderEmergencyClientError";
    this.status = status;
  }
}

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
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function readNullableString(
  value: unknown,
): string | null | undefined {
  if (value === null) {
    return null;
  }

  const normalized =
    readRequiredString(value);

  return normalized ?? undefined;
}

function safeMessageForStatus(
  status: number,
): string {
  if (status === 401) {
    return "Authentication failed or the session expired.";
  }

  if (status === 403) {
    return "Founder owner authority is required.";
  }

  if (status === 404) {
    return "Controlled pilot state was not found.";
  }

  if (status === 409) {
    return "Emergency pause was blocked by a concurrent state change. Refresh status before retrying.";
  }

  if (status === 429) {
    return "Authentication is temporarily locked. Wait before retrying.";
  }

  if (status === 503) {
    return "Founder emergency control is unavailable. No action was taken.";
  }

  return "Founder emergency request failed safely. No action was taken.";
}

async function performRequest(
  fetchImpl: FounderEmergencyFetch,
  input: RequestInfo | URL,
  init: RequestInit,
): Promise<Response> {
  try {
    return await fetchImpl(
      input,
      init,
    );
  } catch {
    throw new FounderEmergencyClientError(
      0,
      "Founder emergency service could not be reached. No action was taken.",
    );
  }
}

async function readJsonRecord(
  response: Response,
): Promise<Record<string, unknown>> {
  let value: unknown;

  try {
    value = await response.json();
  } catch {
    throw new FounderEmergencyClientError(
      502,
      "Founder emergency service returned an invalid response. No action was taken.",
    );
  }

  if (!isRecord(value)) {
    throw new FounderEmergencyClientError(
      502,
      "Founder emergency service returned an invalid response. No action was taken.",
    );
  }

  return value;
}

function assertSafetyBoundary(
  body: Record<string, unknown>,
): void {
  if (
    body.liveProviderExecutionAuthorized !==
      false ||
    body.resumeAuthorized !== false
  ) {
    throw new FounderEmergencyClientError(
      502,
      "Founder emergency safety boundary could not be verified. No action was taken.",
    );
  }
}

function parseOperationSnapshot(
  body: Record<string, unknown>,
): FounderEmergencyOperationSnapshot {
  const tenantId =
    readRequiredString(body.tenantId);

  const ownerActorId =
    readRequiredString(
      body.ownerActorId,
    );

  const operationStatus =
    body.operationStatus;

  const blockingSignalId =
    readNullableString(
      body.blockingSignalId,
    );

  const stateVersion =
    body.stateVersion;

  const lastTransitionAt =
    body.lastTransitionAt;

  assertSafetyBoundary(body);

  if (
    !tenantId ||
    !ownerActorId ||
    (
      operationStatus !== "active" &&
      operationStatus !== "paused"
    ) ||
    blockingSignalId === undefined ||
    !Number.isInteger(stateVersion) ||
    Number(stateVersion) < 1 ||
    !Number.isFinite(lastTransitionAt)
  ) {
    throw new FounderEmergencyClientError(
      502,
      "Founder emergency service returned an invalid response. No action was taken.",
    );
  }

  return {
    tenantId,
    ownerActorId,
    operationStatus,
    blockingSignalId,
    stateVersion:
      Number(stateVersion),
    lastTransitionAt:
      Number(lastTransitionAt),
    liveProviderExecutionAuthorized:
      false,
    resumeAuthorized: false,
  };
}

function normalizeLoginInput(
  input: FounderEmergencyLoginInput,
): FounderEmergencyLoginInput {
  const tenantId =
    readRequiredString(
      input?.tenantId,
    );

  const email =
    readRequiredString(input?.email);

  const password =
    readRequiredString(
      input?.password,
    );

  if (
    !tenantId ||
    !email ||
    !password
  ) {
    throw new FounderEmergencyClientError(
      400,
      "Workspace ID, owner email, and password are required.",
    );
  }

  return {
    tenantId,
    email,
    password,
  };
}

export async function issueFounderEmergencySession(
  input: FounderEmergencyLoginInput,
  fetchImpl: FounderEmergencyFetch =
    fetch,
): Promise<FounderEmergencySession> {
  const normalized =
    normalizeLoginInput(input);

  const response =
    await performRequest(
      fetchImpl,
      "/api/nexus/auth/session",
      {
        method: "POST",
        headers: {
          "content-type":
            "application/json",
          "cache-control":
            "no-store",
        },
        body: JSON.stringify(
          normalized,
        ),
      },
    );

  if (!response.ok) {
    throw new FounderEmergencyClientError(
      response.status,
      safeMessageForStatus(
        response.status,
      ),
    );
  }

  const body =
    await readJsonRecord(response);

  if (
    body.liveProviderExecutionAuthorized !==
      false ||
    !isRecord(body.session)
  ) {
    throw new FounderEmergencyClientError(
      502,
      "Authentication response could not be safely verified.",
    );
  }

  const accessToken =
    readRequiredString(
      body.accessToken,
    );

  const tenantId =
    readRequiredString(
      body.session.tenantId,
    );

  const actorId =
    readRequiredString(
      body.session.actorId,
    );

  const role =
    readRequiredString(
      body.session.role,
    );

  const expiresAt =
    readRequiredString(
      body.session.expiresAt,
    );

  if (
    body.tokenType !== "Bearer" ||
    !accessToken ||
    !tenantId ||
    !actorId ||
    !role ||
    !expiresAt
  ) {
    throw new FounderEmergencyClientError(
      502,
      "Authentication response could not be safely verified.",
    );
  }

  return {
    accessToken,
    tenantId,
    actorId,
    role,
    expiresAt,
  };
}

export async function readFounderEmergencyStatus(
  accessToken: string,
  fetchImpl: FounderEmergencyFetch =
    fetch,
): Promise<FounderEmergencyStatusResult> {
  const token =
    readRequiredString(accessToken);

  if (!token) {
    throw new FounderEmergencyClientError(
      401,
      "Authentication failed or the session expired.",
    );
  }

  const response =
    await performRequest(
      fetchImpl,
      "/api/nexus/founder-emergency",
      {
        method: "GET",
        headers: {
          authorization:
            `Bearer ${token}`,
          "cache-control":
            "no-store",
        },
        cache: "no-store",
      },
    );

  if (!response.ok) {
    throw new FounderEmergencyClientError(
      response.status,
      safeMessageForStatus(
        response.status,
      ),
    );
  }

  const body =
    await readJsonRecord(response);

  if (
    body.mode !==
      "authenticated-founder-emergency-status-v1" ||
    typeof body.emergencyPauseAvailable !==
      "boolean"
  ) {
    throw new FounderEmergencyClientError(
      502,
      "Founder emergency status could not be safely verified.",
    );
  }

  return {
    mode:
      "authenticated-founder-emergency-status-v1",
    ...parseOperationSnapshot(body),
    emergencyPauseAvailable:
      body.emergencyPauseAvailable,
  };
}

export async function pauseFounderEmergency(
  accessToken: string,
  fetchImpl: FounderEmergencyFetch =
    fetch,
): Promise<FounderEmergencyPauseResult> {
  const token =
    readRequiredString(accessToken);

  if (!token) {
    throw new FounderEmergencyClientError(
      401,
      "Authentication failed or the session expired.",
    );
  }

  const response =
    await performRequest(
      fetchImpl,
      "/api/nexus/founder-emergency",
      {
        method: "POST",
        headers: {
          authorization:
            `Bearer ${token}`,
          "cache-control":
            "no-store",
        },
        cache: "no-store",
      },
    );

  if (!response.ok) {
    throw new FounderEmergencyClientError(
      response.status,
      safeMessageForStatus(
        response.status,
      ),
    );
  }

  const body =
    await readJsonRecord(response);

  if (
    body.mode !==
      "authenticated-founder-emergency-pause-v1" ||
    (
      body.pauseStatus !==
        "paused" &&
      body.pauseStatus !==
        "already-paused"
    )
  ) {
    throw new FounderEmergencyClientError(
      502,
      "Founder emergency pause could not be safely verified.",
    );
  }

  const snapshot =
    parseOperationSnapshot(body);

  if (
    snapshot.operationStatus !==
      "paused"
  ) {
    throw new FounderEmergencyClientError(
      502,
      "Founder emergency pause could not be safely verified.",
    );
  }

  return {
    mode:
      "authenticated-founder-emergency-pause-v1",
    ...snapshot,
    pauseStatus:
      body.pauseStatus,
  };
}
export async function revokeFounderEmergencySession(
  accessToken: string,
  fetchImpl: FounderEmergencyFetch =
    fetch,
): Promise<FounderEmergencyLogoutResult> {
  const token =
    readRequiredString(accessToken);

  if (!token) {
    throw new FounderEmergencyClientError(
      401,
      "Authentication failed or the session expired.",
    );
  }

  const response =
    await performRequest(
      fetchImpl,
      "/api/nexus/auth/session/revoke",
      {
        method: "POST",
        headers: {
          authorization:
            `Bearer ${token}`,
          "cache-control":
            "no-store",
        },
        cache: "no-store",
      },
    );

  if (!response.ok) {
    throw new FounderEmergencyClientError(
      response.status,
      safeMessageForStatus(
        response.status,
      ),
    );
  }

  const body =
    await readJsonRecord(response);

  const revokedAt =
    readRequiredString(
      body.revokedAt,
    );

  if (
    body.revoked !== true ||
    !revokedAt ||
    body.liveProviderExecutionAuthorized !==
      false ||
    (
      body.resumeAuthorized !== undefined &&
      body.resumeAuthorized !== false
    )
  ) {
    throw new FounderEmergencyClientError(
      502,
      "Authenticated logout response could not be safely verified.",
    );
  }

  return {
    revoked: true,
    revokedAt,
    liveProviderExecutionAuthorized:
      false,
    resumeAuthorized: false,
  };
}
