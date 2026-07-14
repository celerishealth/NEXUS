import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  FounderEmergencyClientError,
  issueFounderEmergencySession,
  pauseFounderEmergency,
  readFounderEmergencyStatus,
} from "../founderEmergencyClient";

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "content-type":
          "application/json",
      },
    },
  );
}

const loginSuccess = {
  tokenType: "Bearer",
  accessToken:
    "authenticated-session-token",
  session: {
    sessionId: "session-a",
    tenantId: "tenant-a",
    actorId: "owner-a",
    role: "owner",
    issuedAt:
      "2026-07-14T05:00:00.000Z",
    expiresAt:
      "2026-07-14T13:00:00.000Z",
  },
  liveProviderExecutionAuthorized:
    false,
};

const statusSuccess = {
  mode:
    "authenticated-founder-emergency-status-v1",
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  operationStatus: "active",
  blockingSignalId: null,
  stateVersion: 4,
  lastTransitionAt:
    1_720_000_000_000,
  emergencyPauseAvailable: true,
  liveProviderExecutionAuthorized:
    false,
  resumeAuthorized: false,
};

const pauseSuccess = {
  mode:
    "authenticated-founder-emergency-pause-v1",
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  pauseStatus: "paused",
  operationStatus: "paused",
  blockingSignalId:
    "server-generated-signal",
  stateVersion: 5,
  lastTransitionAt:
    1_720_000_001_000,
  liveProviderExecutionAuthorized:
    false,
  resumeAuthorized: false,
};

describe(
  "founder emergency browser client",
  () => {
    it(
      "issues an authenticated session through the existing login boundary",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse(
              loginSuccess,
            ),
          );

        await expect(
          issueFounderEmergencySession(
            {
              tenantId:
                "tenant-a",
              email:
                "owner@example.com",
              password:
                "secret-password",
            },
            fetchMock,
          ),
        ).resolves.toEqual({
          accessToken:
            "authenticated-session-token",
          tenantId: "tenant-a",
          actorId: "owner-a",
          role: "owner",
          expiresAt:
            "2026-07-14T13:00:00.000Z",
        });

        expect(fetchMock)
          .toHaveBeenCalledTimes(1);

        const [
          url,
          init,
        ] =
          fetchMock.mock.calls[0] as [
            string,
            RequestInit,
          ];

        expect(url).toBe(
          "/api/nexus/auth/session",
        );
        expect(init.method)
          .toBe("POST");
        expect(
          JSON.parse(
            String(init.body),
          ),
        ).toEqual({
          tenantId: "tenant-a",
          email:
            "owner@example.com",
          password:
            "secret-password",
        });
      },
    );

    it(
      "maps authentication failure without exposing raw server detail",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse(
              {
                error:
                  "raw credential database detail",
              },
              401,
            ),
          );

        await expect(
          issueFounderEmergencySession(
            {
              tenantId:
                "tenant-a",
              email:
                "owner@example.com",
              password:
                "wrong-password",
            },
            fetchMock,
          ),
        ).rejects.toMatchObject({
          name:
            "FounderEmergencyClientError",
          status: 401,
          message:
            "Authentication failed or the session expired.",
        });
      },
    );

    it(
      "reads status with bearer authentication and no request body",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse(
              statusSuccess,
            ),
          );

        await expect(
          readFounderEmergencyStatus(
            "authenticated-session-token",
            fetchMock,
          ),
        ).resolves.toEqual(
          statusSuccess,
        );

        const [
          url,
          init,
        ] =
          fetchMock.mock.calls[0] as [
            string,
            RequestInit,
          ];

        expect(url).toBe(
          "/api/nexus/founder-emergency",
        );
        expect(init.method)
          .toBe("GET");
        expect(init.body)
          .toBeUndefined();
        expect(init.headers)
          .toMatchObject({
            authorization:
              "Bearer authenticated-session-token",
          });
      },
    );

    it(
      "rejects a status response that attempts to authorize resume",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse({
              ...statusSuccess,
              resumeAuthorized:
                true,
            }),
          );

        await expect(
          readFounderEmergencyStatus(
            "authenticated-session-token",
            fetchMock,
          ),
        ).rejects.toMatchObject({
          status: 502,
          message:
            "Founder emergency safety boundary could not be verified. No action was taken.",
        });
      },
    );

    it(
      "sends a pause request without browser identity or signal fields",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse(
              pauseSuccess,
            ),
          );

        await expect(
          pauseFounderEmergency(
            "authenticated-session-token",
            fetchMock,
          ),
        ).resolves.toEqual(
          pauseSuccess,
        );

        const [
          url,
          init,
        ] =
          fetchMock.mock.calls[0] as [
            string,
            RequestInit,
          ];

        expect(url).toBe(
          "/api/nexus/founder-emergency",
        );
        expect(init.method)
          .toBe("POST");
        expect(init.body)
          .toBeUndefined();
        expect(init.headers)
          .toMatchObject({
            authorization:
              "Bearer authenticated-session-token",
          });
      },
    );

    it(
      "maps a concurrent pause conflict to a safe owner message",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse(
              {
                error:
                  "raw concurrent database detail",
              },
              409,
            ),
          );

        await expect(
          pauseFounderEmergency(
            "authenticated-session-token",
            fetchMock,
          ),
        ).rejects.toMatchObject({
          status: 409,
          message:
            "Emergency pause was blocked by a concurrent state change. Refresh status before retrying.",
        });
      },
    );

    it(
      "fails closed on network failure without leaking the thrown error",
      async () => {
        const fetchMock =
          vi.fn().mockRejectedValue(
            new Error(
              "socket secret detail",
            ),
          );

        await expect(
          pauseFounderEmergency(
            "authenticated-session-token",
            fetchMock,
          ),
        ).rejects.toEqual(
          expect.objectContaining({
            name:
              "FounderEmergencyClientError",
            status: 0,
            message:
              "Founder emergency service could not be reached. No action was taken.",
          }),
        );
      },
    );

    it(
      "fails closed on a malformed successful pause response",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse({
              ...pauseSuccess,
              operationStatus:
                "active",
            }),
          );

        const promise =
          pauseFounderEmergency(
            "authenticated-session-token",
            fetchMock,
          );

        await expect(
          promise,
        ).rejects.toBeInstanceOf(
          FounderEmergencyClientError,
        );

        await expect(
          promise,
        ).rejects.toMatchObject({
          status: 502,
          message:
            "Founder emergency pause could not be safely verified.",
        });
      },
    );
  },
);