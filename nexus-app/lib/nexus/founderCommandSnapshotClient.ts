import type {
  TenantControlledActionSnapshot,
} from "@/lib/nexus/controlledActionCommandGateway";

export type FounderCommandSnapshotFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface FounderCommandSnapshotReadInput {
  accessToken: string;
  expectedTenantId: string;
  expectedOwnerActorId: string;
}

export interface FounderCommandSnapshotResult {
  schemaVersion:
    "nexus-founder-command-snapshot-v1";
  tenantId: string;
  ownerActorId: string;
  requestId: string;
  executionBoundary:
    "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION";
  snapshot: TenantControlledActionSnapshot;
  liveProviderExecutionAuthorized: false;
  providerMutationAuthorized: false;
  resumeAuthorized: false;
}

export class FounderCommandSnapshotClientError
  extends Error {
  readonly status: number;

  constructor(
    status: number,
    message: string,
  ) {
    super(message);
    this.name =
      "FounderCommandSnapshotClientError";
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

function safeMessageForStatus(
  status: number,
): string {
  if (status === 401) {
    return "Authentication failed or the session expired.";
  }

  if (status === 403) {
    return "Founder owner authority is required.";
  }

  if (status === 503) {
    return "Founder command snapshot is unavailable. No action was taken.";
  }

  return "Founder command snapshot request failed safely. No action was taken.";
}

async function performRequest(
  fetchImpl: FounderCommandSnapshotFetch,
  input: RequestInfo | URL,
  init: RequestInit,
): Promise<Response> {
  try {
    return await fetchImpl(
      input,
      init,
    );
  } catch {
    throw new FounderCommandSnapshotClientError(
      0,
      "Founder command snapshot service could not be reached. No action was taken.",
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
    throw new FounderCommandSnapshotClientError(
      502,
      "Founder command snapshot service returned an invalid response. No action was taken.",
    );
  }

  if (!isRecord(value)) {
    throw new FounderCommandSnapshotClientError(
      502,
      "Founder command snapshot service returned an invalid response. No action was taken.",
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
    body.providerMutationAuthorized !==
      false ||
    body.resumeAuthorized !== false
  ) {
    throw new FounderCommandSnapshotClientError(
      502,
      "Founder command snapshot safety boundary could not be verified. No action was taken.",
    );
  }
}

function assertTenantBoundCollection(
  collection: Record<string, unknown>,
  tenantId: string,
): void {
  for (
    const value of Object.values(collection)
  ) {
    if (!isRecord(value)) {
      throw new FounderCommandSnapshotClientError(
        502,
        "Founder command snapshot response could not be safely verified.",
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        value,
        "tenantId",
      )
    ) {
      const itemTenantId =
        readRequiredString(value.tenantId);

      if (itemTenantId !== tenantId) {
        throw new FounderCommandSnapshotClientError(
          502,
          "Founder command snapshot response could not be safely verified.",
        );
      }
    }
  }
}

function parseSnapshot(
  value: unknown,
  tenantId: string,
): TenantControlledActionSnapshot {
  if (!isRecord(value)) {
    throw new FounderCommandSnapshotClientError(
      502,
      "Founder command snapshot response could not be safely verified.",
    );
  }

  const revision = value.revision;
  const killSwitch = value.killSwitch;
  const actions = value.actions;
  const outbox = value.outbox;
  const audit = value.audit;

  if (
    !Number.isInteger(revision) ||
    Number(revision) < 0 ||
    !isRecord(killSwitch) ||
    typeof killSwitch.engaged !==
      "boolean" ||
    (
      killSwitch.reason !== null &&
      typeof killSwitch.reason !==
        "string"
    ) ||
    !isRecord(actions) ||
    !isRecord(outbox) ||
    !Array.isArray(audit)
  ) {
    throw new FounderCommandSnapshotClientError(
      502,
      "Founder command snapshot response could not be safely verified.",
    );
  }

  assertTenantBoundCollection(
    actions,
    tenantId,
  );
  assertTenantBoundCollection(
    outbox,
    tenantId,
  );

  for (const entry of audit) {
    if (
      !isRecord(entry) ||
      readRequiredString(entry.tenantId) !==
        tenantId
    ) {
      throw new FounderCommandSnapshotClientError(
        502,
        "Founder command snapshot response could not be safely verified.",
      );
    }
  }

  return value as unknown as TenantControlledActionSnapshot;
}

export async function readFounderCommandSnapshot(
  input: FounderCommandSnapshotReadInput,
  fetchImpl: FounderCommandSnapshotFetch =
    fetch,
): Promise<FounderCommandSnapshotResult> {
  const accessToken =
    readRequiredString(input?.accessToken);
  const expectedTenantId =
    readRequiredString(
      input?.expectedTenantId,
    );
  const expectedOwnerActorId =
    readRequiredString(
      input?.expectedOwnerActorId,
    );

  if (!accessToken) {
    throw new FounderCommandSnapshotClientError(
      401,
      "Authentication failed or the session expired.",
    );
  }

  if (
    !expectedTenantId ||
    !expectedOwnerActorId
  ) {
    throw new FounderCommandSnapshotClientError(
      400,
      "Authenticated tenant and founder-owner identity are required.",
    );
  }

  const response =
    await performRequest(
      fetchImpl,
      "/api/nexus/founder-command/snapshot",
      {
        method: "GET",
        headers: {
          authorization:
            `Bearer ${accessToken}`,
          "cache-control":
            "no-store",
        },
        cache: "no-store",
      },
    );

  if (!response.ok) {
    throw new FounderCommandSnapshotClientError(
      response.status,
      safeMessageForStatus(
        response.status,
      ),
    );
  }

  const body =
    await readJsonRecord(response);

  assertSafetyBoundary(body);

  const schemaVersion =
    readRequiredString(
      body.schemaVersion,
    );
  const tenantId =
    readRequiredString(body.tenantId);
  const ownerActorId =
    readRequiredString(
      body.ownerActorId,
    );
  const requestId =
    readRequiredString(body.requestId);
  const executionBoundary =
    readRequiredString(
      body.executionBoundary,
    );

  if (
    schemaVersion !==
      "nexus-founder-command-snapshot-v1" ||
    tenantId !== expectedTenantId ||
    ownerActorId !==
      expectedOwnerActorId ||
    !requestId ||
    executionBoundary !==
      "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION"
  ) {
    throw new FounderCommandSnapshotClientError(
      502,
      "Founder command snapshot identity boundary could not be verified.",
    );
  }

  const snapshot =
    parseSnapshot(
      body.snapshot,
      tenantId,
    );

  return {
    schemaVersion:
      "nexus-founder-command-snapshot-v1",
    tenantId,
    ownerActorId,
    requestId,
    executionBoundary:
      "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION",
    snapshot,
    liveProviderExecutionAuthorized:
      false,
    providerMutationAuthorized: false,
    resumeAuthorized: false,
  };
}
