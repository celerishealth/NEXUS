import { afterEach, describe, expect, it, vi } from "vitest";

const doubles = vi.hoisted(() => ({
  verifyToken: vi.fn(),
  assertActiveSession: vi.fn(),
  closeSessionStore: vi.fn(),
  readStatusSummary: vi.fn(),
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
  "@/lib/nexus/supabaseControlledCustomerInquiryStatusSummaryReader",
  () => ({
    SupabaseControlledCustomerInquiryStatusSummaryReader: class {
      async readTenantStatusSummary(...args: unknown[]) {
        return doubles.readStatusSummary(...args);
      }
    },
  }),
);
import { GET } from "../../../app/api/nexus/founder-command/growth/status/route";

async function readBody(response: Response): Promise<unknown> {
  return response.json();
}

function bearerRequest(): Request {
  return new Request(
    "http://localhost/api/nexus/founder-command/growth/status",
    {
      method: "GET",
      headers: {
        authorization: "Bearer authenticated-session-token",
      },
    },
  );
}

describe("authenticated founder growth status summary API", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("fails closed while the separate growth route is disabled", async () => {
    vi.stubEnv("NEXUS_FOUNDER_GROWTH_STATUS_SUMMARY_ENABLED", "false");
    const response = await GET(new Request("http://localhost/api/nexus/founder-command/growth/status", { method: "GET" }));
    expect(response.status).toBe(503);
    await expect(readBody(response)).resolves.toMatchObject({ error: "Founder growth status summary is disabled by default.", liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false });
  });

  it("rejects access without an authenticated bearer session", async () => {
    vi.stubEnv("NEXUS_FOUNDER_GROWTH_STATUS_SUMMARY_ENABLED", "true");
    const response = await GET(new Request("http://localhost/api/nexus/founder-command/growth/status", { method: "GET" }));
    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("verifies the bearer token and active server session before reading growth evidence", async () => {
    vi.stubEnv("NEXUS_FOUNDER_GROWTH_STATUS_SUMMARY_ENABLED", "true");
    vi.stubEnv("NEXUS_AUTH_SESSION_SIGNING_SECRET", "test-signing-secret");
    vi.stubEnv("NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID", "owner-a");
    doubles.verifyToken.mockImplementation(() => { throw new Error("invalid token"); });
    const response = await GET(bearerRequest());
    expect(response.status).toBe(401);
    expect(doubles.verifyToken).toHaveBeenCalledTimes(1);
    expect(doubles.assertActiveSession).not.toHaveBeenCalled();
    await expect(readBody(response)).resolves.toMatchObject({ error: "Authentication failed.", liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false });
  });
  it("returns only exact-tenant inquiry status aggregates with execution blocked", async () => {
    vi.stubEnv("NEXUS_FOUNDER_GROWTH_STATUS_SUMMARY_ENABLED", "true");
    vi.stubEnv("NEXUS_AUTH_SESSION_SIGNING_SECRET", "test-signing-secret");
    vi.stubEnv("NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID", "owner-a");
    vi.stubEnv("SUPABASE_URL", "https://nexus-example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "x".repeat(32));
    doubles.verifyToken.mockReturnValue({ tenantId: "tenant-a", actorId: "owner-a", role: "owner" });
    doubles.assertActiveSession.mockResolvedValue(undefined);
    doubles.readStatusSummary.mockResolvedValue({ status: "found", evidence: { tenantId: "tenant-a", totalInquiries: 12, latestReceivedAt: 1722124800000, counts: { received: 2, recommendationPending: 2, ownerReview: 2, approved: 1, rejected: 1, sandboxExecuted: 1, completed: 2, failed: 1 } } });
    const response = await GET(bearerRequest());
    const body = await readBody(response);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(doubles.readStatusSummary).toHaveBeenCalledWith("tenant-a");
    expect(body).toMatchObject({ schemaVersion: "nexus-founder-growth-status-summary-v1", tenantId: "tenant-a", ownerActorId: "owner-a", summary: { tenantId: "tenant-a", evidenceBoundary: "VERIFIED_INQUIRY_STATUS_AGGREGATES_ONLY", totalInquiries: 12, latestReceivedAt: 1722124800000, counts: { received: 2, recommendationPending: 2, ownerReview: 2, approved: 1, rejected: 1, sandboxExecuted: 1, completed: 2, failed: 1 }, customerIdentityExposed: false, inquiryMessageExposed: false, liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false }, liveProviderExecutionAuthorized: false, providerMutationAuthorized: false, resumeAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false });
  });
  it("rejects non-owner authority before reading growth evidence", async () => {
    vi.stubEnv("NEXUS_FOUNDER_GROWTH_STATUS_SUMMARY_ENABLED", "true");
    vi.stubEnv("NEXUS_AUTH_SESSION_SIGNING_SECRET", "test-signing-secret");
    vi.stubEnv("NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID", "owner-a");
    doubles.verifyToken.mockReturnValue({ tenantId: "tenant-a", actorId: "actor-b", role: "viewer" });
    doubles.assertActiveSession.mockResolvedValue(undefined);
    const response = await GET(bearerRequest());
    expect(response.status).toBe(403);
    expect(doubles.readStatusSummary).not.toHaveBeenCalled();
    await expect(readBody(response)).resolves.toMatchObject({ error: "Owner authority is required.", liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false });
  });

  it("fails closed when exact-tenant aggregate evidence is unavailable", async () => {
    vi.stubEnv("NEXUS_FOUNDER_GROWTH_STATUS_SUMMARY_ENABLED", "true");
    vi.stubEnv("NEXUS_AUTH_SESSION_SIGNING_SECRET", "test-signing-secret");
    vi.stubEnv("NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID", "owner-a");
    vi.stubEnv("SUPABASE_URL", "https://nexus-example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "x".repeat(32));
    doubles.verifyToken.mockReturnValue({ tenantId: "tenant-a", actorId: "owner-a", role: "owner" });
    doubles.assertActiveSession.mockResolvedValue(undefined);
    doubles.readStatusSummary.mockResolvedValue({ status: "reader-unavailable" });
    const response = await GET(bearerRequest());
    expect(response.status).toBe(503);
    expect(doubles.readStatusSummary).toHaveBeenCalledWith("tenant-a");
    await expect(readBody(response)).resolves.toMatchObject({ error: "Founder growth status summary could not be safely verified.", liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false });
  });
  it("rejects a revoked or inactive server session before reading growth evidence", async () => {
    vi.stubEnv("NEXUS_FOUNDER_GROWTH_STATUS_SUMMARY_ENABLED", "true");
    vi.stubEnv("NEXUS_AUTH_SESSION_SIGNING_SECRET", "test-signing-secret");
    vi.stubEnv("NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID", "owner-a");
    doubles.verifyToken.mockReturnValue({ tenantId: "tenant-a", actorId: "owner-a", role: "owner" });
    doubles.assertActiveSession.mockRejectedValue(new Error("inactive session"));
    const response = await GET(bearerRequest());
    expect(response.status).toBe(401);
    expect(doubles.readStatusSummary).not.toHaveBeenCalled();
    expect(doubles.closeSessionStore).toHaveBeenCalledTimes(1);
    await expect(readBody(response)).resolves.toMatchObject({ error: "Authentication failed.", liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false });
  });

  it("fails closed when server-side growth credentials are missing", async () => {
    vi.stubEnv("NEXUS_FOUNDER_GROWTH_STATUS_SUMMARY_ENABLED", "true");
    vi.stubEnv("NEXUS_AUTH_SESSION_SIGNING_SECRET", "test-signing-secret");
    vi.stubEnv("NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID", "owner-a");
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    doubles.verifyToken.mockReturnValue({ tenantId: "tenant-a", actorId: "owner-a", role: "owner" });
    doubles.assertActiveSession.mockResolvedValue(undefined);
    const response = await GET(bearerRequest());
    expect(response.status).toBe(503);
    expect(doubles.readStatusSummary).not.toHaveBeenCalled();
    await expect(readBody(response)).resolves.toMatchObject({ error: "Founder growth status summary is not configured.", liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false });
  });
});
