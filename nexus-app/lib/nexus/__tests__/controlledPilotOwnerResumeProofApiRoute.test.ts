import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  POST,
} from "../../../app/api/nexus/controlled-pilot-owner-resume-proof/route";
import {
  evaluateControlledPilotRecovery,
} from "@/lib/nexus/controlledPilotRecoveryGate";
import {
  issueControlledPilotOwnerResumeProof,
} from "@/lib/nexus/controlledPilotOwnerResumeAuthorization";

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

const signingSecret =
  "test-owner-resume-signing-secret-at-least-32-characters";

function createProof(ownerId = "owner-a"): string {
  const recoveryDecision =
    evaluateControlledPilotRecovery({
      healthStatus: "healthy",
      ownerAlertRequired: true,
      ownerAcknowledged: true,
      blockingFailureCount: 0,
      consecutiveHealthyChecks: 3,
      signalId: "signal-a",
    });

  const result =
    issueControlledPilotOwnerResumeProof(
      {
        tenantId: "tenant-a",
        signalId: "signal-a",
        ownerId,
        ownerRole: "owner",
        ownerApproved: true,
        recoveryDecision,
      },
      signingSecret,
      Math.floor(Date.now() / 1000),
    );

  if (!result.ok) {
    throw new Error(
      "Test owner resume proof could not be issued.",
    );
  }

  return result.token;
}

function request(
  body: Record<string, unknown>,
  authenticated = true,
): Request {
  return new Request(
    "http://localhost/api/nexus/controlled-pilot-owner-resume-proof",
    {
      method: "POST",
      headers: authenticated
        ? {
            authorization:
              "Bearer authenticated-owner-session",
            "content-type": "application/json",
          }
        : {
            "content-type": "application/json",
          },
      body: JSON.stringify(body),
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
  "controlled pilot owner resume proof API boundary",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      vi.stubEnv(
        "NEXUS_CONTROLLED_PILOT_OWNER_RESUME_PROOF_ENABLED",
        "true",
      );
      vi.stubEnv(
        "NEXUS_PILOT_RESUME_SIGNING_SECRET",
        signingSecret,
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
      "fails closed while proof verification is disabled",
      async () => {
        vi.stubEnv(
          "NEXUS_CONTROLLED_PILOT_OWNER_RESUME_PROOF_ENABLED",
          "false",
        );

        const response = await POST(
          request({
            token: createProof(),
            tenantId: "tenant-a",
            signalId: "signal-a",
          }),
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
      "rejects access without an authenticated owner session",
      async () => {
        doubles.authenticate.mockResolvedValue({
          ok: false,
          status: 401,
          reason: "authentication-failed",
        });

        const response = await POST(
          request(
            {
              token: createProof(),
              tenantId: "tenant-a",
              signalId: "signal-a",
            },
            false,
          ),
        );

        expect(response.status).toBe(401);
        expect(
          response.headers.get("cache-control"),
        ).toBe("no-store");
      },
    );

    it(
      "uses the authenticated tenant instead of caller supplied tenant identity",
      async () => {
        const response = await POST(
          request({
            token: createProof(),
            tenantId: "foreign-tenant",
            signalId: "signal-a",
          }),
        );
        const body = await readBody(response);

        expect(response.status).toBe(200);
        expect(body).toMatchObject({
          ok: true,
          verification: {
            valid: true,
            payload: {
              tenantId: "tenant-a",
              ownerId: "owner-a",
              signalId: "signal-a",
            },
          },
          consumptionLedgerConnected: false,
          persistentConsumptionRequired: true,
          automaticResumeAuthorized: false,
          pilotOperationPermitted: false,
          liveProviderExecutionAuthorized: false,
          publicLaunchAuthorized: false,
        });
      },
    );

    it(
      "rejects a valid proof belonging to another owner",
      async () => {
        const response = await POST(
          request({
            token: createProof("owner-b"),
            tenantId: "tenant-a",
            signalId: "signal-a",
          }),
        );
        const body = await readBody(response);

        expect(response.status).toBe(403);
        expect(body).toMatchObject({
          ok: false,
          code: "OWNER_BINDING_MISMATCH",
          automaticResumeAuthorized: false,
          pilotOperationPermitted: false,
          liveProviderExecutionAuthorized: false,
          publicLaunchAuthorized: false,
        });
      },
    );
  },
);