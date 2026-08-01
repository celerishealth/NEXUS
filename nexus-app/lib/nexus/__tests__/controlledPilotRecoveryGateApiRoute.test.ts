import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  GET,
  POST,
} from "../../../app/api/nexus/controlled-pilot-recovery-gate/route";

const doubles = vi.hoisted(() => ({
  authenticate: vi.fn(),
}));

vi.mock(
  "@/lib/nexus/founderCommandServerAuthentication",
  () => ({
    authenticateFounderCommandRequest:
      doubles.authenticate,
  }),
);

function authenticatedRequest(
  method: "GET" | "POST",
  body?: Record<string, unknown>,
): Request {
  return new Request(
    "http://localhost/api/nexus/controlled-pilot-recovery-gate",
    {
      method,
      headers: {
        authorization:
          "Bearer authenticated-owner-session",
        ...(body
          ? {
              "content-type": "application/json",
            }
          : {}),
      },
      ...(body
        ? {
            body: JSON.stringify(body),
          }
        : {}),
    },
  );
}

async function readBody(
  response: Response,
): Promise<Record<string, unknown>> {
  return await response.json() as
    Record<string, unknown>;
}

describe(
  "controlled pilot recovery gate API boundary",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      vi.stubEnv(
        "NEXUS_CONTROLLED_PILOT_RECOVERY_GATE_ENABLED",
        "true",
      );

      doubles.authenticate.mockResolvedValue({
        ok: true,
        tenantId: "tenant-a",
        actorId: "owner-a",
      });
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it(
      "fails closed while recovery evaluation is disabled",
      async () => {
        vi.stubEnv(
          "NEXUS_CONTROLLED_PILOT_RECOVERY_GATE_ENABLED",
          "false",
        );

        const response = await GET(
          authenticatedRequest("GET"),
        );
        const body = await readBody(response);

        expect(response.status).toBe(503);
        expect(
          response.headers.get("cache-control"),
        ).toBe("no-store");
        expect(doubles.authenticate)
          .not.toHaveBeenCalled();
        expect(body).toMatchObject({
          ok: false,
          automaticResumeAuthorized: false,
          pilotOperationPermitted: false,
          liveProviderExecutionAuthorized: false,
          publicLaunchAuthorized: false,
        });
      },
    );

    it(
      "rejects access without an authenticated founder owner session",
      async () => {
        doubles.authenticate.mockResolvedValue({
          ok: false,
          status: 401,
          reason: "authentication-failed",
        });

        const response = await POST(
          new Request(
            "http://localhost/api/nexus/controlled-pilot-recovery-gate",
            {
              method: "POST",
              headers: {
                "content-type":
                  "application/json",
              },
              body: JSON.stringify({
                healthStatus: "healthy",
                ownerAlertRequired: false,
                ownerAcknowledged: false,
                blockingFailureCount: 0,
                consecutiveHealthyChecks: 3,
              }),
            },
          ),
        );

        expect(response.status).toBe(401);
        expect(
          response.headers.get("cache-control"),
        ).toBe("no-store");
      },
    );

    it(
      "returns an authenticated decision without granting automatic or external authority",
      async () => {
        const response = await POST(
          authenticatedRequest(
            "POST",
            {
              healthStatus: "healthy",
              ownerAlertRequired: false,
              ownerAcknowledged: false,
              blockingFailureCount: 0,
              consecutiveHealthyChecks: 3,
              signalId: "signal-a",
            },
          ),
        );
        const body = await readBody(response);

        expect(response.status).toBe(200);
        expect(
          response.headers.get("cache-control"),
        ).toBe("no-store");
        expect(doubles.authenticate)
          .toHaveBeenCalledTimes(1);
        expect(body).toMatchObject({
          ok: true,
          decision: {
            code: "CONTROLLED_PILOT_HEALTHY",
            pilotOperationPermitted: true,
            automaticResumeAuthorized: false,
            liveProviderExecutionAuthorized: false,
            publicLaunchAuthorized: false,
          },
          automaticResumeAuthorized: false,
          pilotOperationPermitted: false,
          liveProviderExecutionAuthorized: false,
          publicLaunchAuthorized: false,
        });
      },
    );

    it(
      "fails closed on invalid recovery evidence",
      async () => {
        const response = await POST(
          authenticatedRequest(
            "POST",
            {
              healthStatus: "unknown",
            },
          ),
        );
        const body = await readBody(response);

        expect(response.status).toBe(400);
        expect(body).toMatchObject({
          ok: false,
          decision: {
            code: "INVALID_INPUT_FAIL_CLOSED",
            pilotOperationPermitted: false,
          },
          automaticResumeAuthorized: false,
          pilotOperationPermitted: false,
          liveProviderExecutionAuthorized: false,
          publicLaunchAuthorized: false,
        });
      },
    );
  },
);