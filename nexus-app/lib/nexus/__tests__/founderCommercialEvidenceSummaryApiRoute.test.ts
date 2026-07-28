import { afterEach, describe, expect, it, vi } from "vitest";

const doubles = vi.hoisted(() => ({
  verifyToken: vi.fn(),
  assertActiveSession: vi.fn(),
  closeSessionStore: vi.fn(),
  readEvidence: vi.fn(),
}));

vi.mock(
  "@/lib/nexus/sqliteAuthenticatedTenantSessionStore",
  () => ({
    verifyAuthenticatedTenantSessionToken: doubles.verifyToken,
    SQLiteAuthenticatedTenantSessionStore: class {
      async assertActiveSession(...args: unknown[]) {
        return doubles.assertActiveSession(...args);
      }

      close() {
        doubles.closeSessionStore();
      }
    },
  }),
);

vi.mock(
  "@/lib/nexus/supabaseFounderCommercialEvidenceReader",
  () => ({
    SupabaseFounderCommercialEvidenceReader: class {
      async readTenantOwnerEvidence(...args: unknown[]) {
        return doubles.readEvidence(...args);
      }
    },
  }),
);

import { GET } from "../../../app/api/nexus/founder-command/commercial/route";

async function readBody(response: Response): Promise<unknown> {
  return response.json();
}

function bearerRequest(): Request {
  return new Request(
    "http://localhost/api/nexus/founder-command/commercial",
    {
      method: "GET",
      headers: {
        authorization: "Bearer authenticated-session-token",
      },
    },
  );
}

function enableConfiguredRoute(): void {
  vi.stubEnv(
    "NEXUS_FOUNDER_COMMERCIAL_EVIDENCE_SUMMARY_ENABLED",
    "true",
  );
  vi.stubEnv(
    "NEXUS_AUTH_SESSION_SIGNING_SECRET",
    "test-signing-secret",
  );
  vi.stubEnv(
    "NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID",
    "owner-a",
  );
  vi.stubEnv(
    "SUPABASE_URL",
    "https://nexus-example.supabase.co",
  );
  vi.stubEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
    "x".repeat(32),
  );
}

const records = [
  {
    kind: "qualified-lead" as const,
    tenantId: "tenant-a",
    ownerActorId: "owner-a",
    evidenceId: "evidence-qualified-1",
    inquiryId: "inquiry-1",
    verifiedAt: "2026-07-28T10:00:00.000Z",
    buyerRequirementVerified: true as const,
    buyerIntentVerified: true as const,
    fakeOrIrrelevantLeadExcluded: true as const,
  },
  {
    kind: "quotation-issued" as const,
    tenantId: "tenant-a",
    ownerActorId: "owner-a",
    evidenceId: "evidence-quotation-1",
    inquiryId: "inquiry-1",
    verifiedAt: "2026-07-28T10:05:00.000Z",
    quotationId: "quotation-1",
    ownerApproved: true as const,
    customerDeliveryVerified: true as const,
  },
  {
    kind: "order-confirmed" as const,
    tenantId: "tenant-a",
    ownerActorId: "owner-a",
    evidenceId: "evidence-order-1",
    inquiryId: "inquiry-1",
    verifiedAt: "2026-07-28T10:10:00.000Z",
    orderId: "order-1",
    quotationId: "quotation-1",
    ownerConfirmed: true as const,
    customerAcceptanceVerified: true as const,
  },
  {
    kind: "payment-received" as const,
    tenantId: "tenant-a",
    ownerActorId: "owner-a",
    evidenceId: "evidence-payment-1",
    inquiryId: "inquiry-1",
    verifiedAt: "2026-07-28T10:15:00.000Z",
    paymentId: "payment-1",
    orderId: "order-1",
    amountMinor: 125000,
    currencyCode: "INR",
    paymentReceiptVerified: true as const,
  },
];

describe("authenticated founder commercial evidence summary API", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("fails closed while the separate commercial route is disabled", async () => {
    vi.stubEnv(
      "NEXUS_FOUNDER_COMMERCIAL_EVIDENCE_SUMMARY_ENABLED",
      "false",
    );

    const response = await GET(
      new Request(
        "http://localhost/api/nexus/founder-command/commercial",
        { method: "GET" },
      ),
    );

    expect(response.status).toBe(503);
    await expect(readBody(response)).resolves.toMatchObject({
      error:
        "Founder commercial evidence summary is disabled by default.",
      customerContactAuthorized: false,
      quotationDeliveryAuthorized: false,
      orderExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      providerMutationAuthorized: false,
      publicLaunchAuthorized: false,
    });
  });

  it("rejects access without an authenticated bearer session", async () => {
    vi.stubEnv(
      "NEXUS_FOUNDER_COMMERCIAL_EVIDENCE_SUMMARY_ENABLED",
      "true",
    );

    const response = await GET(
      new Request(
        "http://localhost/api/nexus/founder-command/commercial",
        { method: "GET" },
      ),
    );

    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(doubles.readEvidence).not.toHaveBeenCalled();
  });

  it("verifies the bearer token before reading commercial evidence", async () => {
    enableConfiguredRoute();
    doubles.verifyToken.mockImplementation(() => {
      throw new Error("invalid token");
    });

    const response = await GET(bearerRequest());

    expect(response.status).toBe(401);
    expect(doubles.verifyToken).toHaveBeenCalledTimes(1);
    expect(doubles.assertActiveSession).not.toHaveBeenCalled();
    expect(doubles.readEvidence).not.toHaveBeenCalled();
  });

  it("returns only exact-tenant exact-owner verified commercial evidence", async () => {
    enableConfiguredRoute();
    doubles.verifyToken.mockReturnValue({
      tenantId: "tenant-a",
      actorId: "owner-a",
      role: "owner",
    });
    doubles.assertActiveSession.mockResolvedValue(undefined);
    doubles.readEvidence.mockResolvedValue({
      status: "found",
      records,
    });

    const response = await GET(bearerRequest());
    const body = await readBody(response);

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(doubles.readEvidence).toHaveBeenCalledWith(
      "tenant-a",
      "owner-a",
    );
    expect(body).toMatchObject({
      schemaVersion:
        "nexus-founder-commercial-evidence-summary-v1",
      tenantId: "tenant-a",
      ownerActorId: "owner-a",
      summary: {
        tenantId: "tenant-a",
        ownerActorId: "owner-a",
        evidenceBoundary:
          "VERIFIED_OWNER_BOUND_COMMERCIAL_EVIDENCE_ONLY",
        sourceRecordCount: 4,
        qualifiedLeadCount: 1,
        quotationCount: 1,
        orderCount: 1,
        paymentReceiptCount: 1,
        revenueByCurrencyMinor: { INR: 125000 },
        customerIdentityExposed: false,
        inquiryMessageExposed: false,
        customerContactAuthorized: false,
        quotationDeliveryAuthorized: false,
        orderExecutionAuthorized: false,
        paymentExecutionAuthorized: false,
        providerMutationAuthorized: false,
        publicLaunchAuthorized: false,
      },
      liveProviderExecutionAuthorized: false,
      providerMutationAuthorized: false,
      resumeAuthorized: false,
      customerContactAuthorized: false,
      quotationDeliveryAuthorized: false,
      orderExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    });
  });

  it("rejects non-owner authority before reading evidence", async () => {
    enableConfiguredRoute();
    doubles.verifyToken.mockReturnValue({
      tenantId: "tenant-a",
      actorId: "actor-b",
      role: "viewer",
    });
    doubles.assertActiveSession.mockResolvedValue(undefined);

    const response = await GET(bearerRequest());

    expect(response.status).toBe(403);
    expect(doubles.readEvidence).not.toHaveBeenCalled();
    await expect(readBody(response)).resolves.toMatchObject({
      error: "Owner authority is required.",
    });
  });

  it("fails closed when exact owner evidence is unavailable", async () => {
    enableConfiguredRoute();
    doubles.verifyToken.mockReturnValue({
      tenantId: "tenant-a",
      actorId: "owner-a",
      role: "owner",
    });
    doubles.assertActiveSession.mockResolvedValue(undefined);
    doubles.readEvidence.mockResolvedValue({
      status: "reader-unavailable",
    });

    const response = await GET(bearerRequest());

    expect(response.status).toBe(503);
    expect(doubles.readEvidence).toHaveBeenCalledWith(
      "tenant-a",
      "owner-a",
    );
    await expect(readBody(response)).resolves.toMatchObject({
      error:
        "Founder commercial evidence summary could not be safely verified.",
    });
  });

  it("fails closed when the evidence chain is invalid", async () => {
    enableConfiguredRoute();
    doubles.verifyToken.mockReturnValue({
      tenantId: "tenant-a",
      actorId: "owner-a",
      role: "owner",
    });
    doubles.assertActiveSession.mockResolvedValue(undefined);
    doubles.readEvidence.mockResolvedValue({
      status: "found",
      records: [records[1]],
    });

    const response = await GET(bearerRequest());

    expect(response.status).toBe(503);
    await expect(readBody(response)).resolves.toMatchObject({
      error:
        "Founder commercial evidence summary could not be safely verified.",
    });
  });

  it("rejects an inactive session before reading evidence", async () => {
    enableConfiguredRoute();
    doubles.verifyToken.mockReturnValue({
      tenantId: "tenant-a",
      actorId: "owner-a",
      role: "owner",
    });
    doubles.assertActiveSession.mockRejectedValue(
      new Error("inactive session"),
    );

    const response = await GET(bearerRequest());

    expect(response.status).toBe(401);
    expect(doubles.readEvidence).not.toHaveBeenCalled();
    expect(doubles.closeSessionStore).toHaveBeenCalledTimes(1);
  });

  it("fails closed when server-side commercial credentials are missing", async () => {
    enableConfiguredRoute();
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    doubles.verifyToken.mockReturnValue({
      tenantId: "tenant-a",
      actorId: "owner-a",
      role: "owner",
    });
    doubles.assertActiveSession.mockResolvedValue(undefined);

    const response = await GET(bearerRequest());

    expect(response.status).toBe(503);
    expect(doubles.readEvidence).not.toHaveBeenCalled();
    await expect(readBody(response)).resolves.toMatchObject({
      error:
        "Founder commercial evidence summary is not configured.",
    });
  });
});
