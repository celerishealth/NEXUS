import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  FounderCommandSnapshotClientError,
  readFounderCommandSnapshot,
} from "../founderCommandSnapshotClient";

function jsonResponse(
  body: unknown,
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

const safeSnapshotResponse = {
  schemaVersion:
    "nexus-founder-command-snapshot-v1",
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  requestId:
    "request-founder-command-a",
  executionBoundary:
    "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION",
  snapshot: {
    revision: 7,
    killSwitch: {
      engaged: false,
      reason: null,
    },
    actions: {
      "action-a": {
        tenantId: "tenant-a",
        status:
          "PENDING_OWNER_REVIEW",
      },
    },
    outbox: {
      "outbox-a": {
        tenantId: "tenant-a",
        status: "PENDING",
      },
    },
    audit: [
      {
        tenantId: "tenant-a",
        auditId: "audit-a",
      },
    ],
  },
  liveProviderExecutionAuthorized:
    false,
  providerMutationAuthorized: false,
  resumeAuthorized: false,
};

const readInput = {
  accessToken:
    "authenticated-session-token",
  expectedTenantId: "tenant-a",
  expectedOwnerActorId: "owner-a",
};

describe(
  "founder command snapshot browser client",
  () => {
    it(
      "reads the authenticated tenant snapshot with bearer authentication and no request body",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse(
              safeSnapshotResponse,
            ),
          );

        const result =
          await readFounderCommandSnapshot(
            readInput,
            fetchMock,
          );

        expect(result).toEqual(
          safeSnapshotResponse,
        );
        expect(fetchMock)
          .toHaveBeenCalledTimes(1);

        const [
          request,
          init,
        ] =
          fetchMock.mock.calls[0] as [
            RequestInfo | URL,
            RequestInit,
          ];

        expect(request).toBe(
          "/api/nexus/founder-command/snapshot",
        );
        expect(init.method).toBe("GET");
        expect(init.headers).toMatchObject({
          authorization:
            "Bearer authenticated-session-token",
          "cache-control":
            "no-store",
        });
        expect(init.cache).toBe(
          "no-store",
        );
        expect(init)
          .not.toHaveProperty("body");
      },
    );

    it(
      "rejects a missing bearer token before calling the service",
      async () => {
        const fetchMock = vi.fn();

        await expect(
          readFounderCommandSnapshot(
            {
              ...readInput,
              accessToken: " ",
            },
            fetchMock,
          ),
        ).rejects.toMatchObject({
          name:
            "FounderCommandSnapshotClientError",
          status: 401,
          message:
            "Authentication failed or the session expired.",
        });

        expect(fetchMock)
          .not.toHaveBeenCalled();
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
                  "raw token signature detail",
              },
              401,
            ),
          );

        await expect(
          readFounderCommandSnapshot(
            readInput,
            fetchMock,
          ),
        ).rejects.toMatchObject({
          name:
            "FounderCommandSnapshotClientError",
          status: 401,
          message:
            "Authentication failed or the session expired.",
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
          readFounderCommandSnapshot(
            readInput,
            fetchMock,
          ),
        ).rejects.toEqual(
          expect.objectContaining({
            name:
              "FounderCommandSnapshotClientError",
            status: 0,
            message:
              "Founder command snapshot service could not be reached. No action was taken.",
          }),
        );
      },
    );

    it(
      "fails closed when a successful response is not valid JSON",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            new Response(
              "not-json",
              {
                status: 200,
                headers: {
                  "content-type":
                    "application/json",
                },
              },
            ),
          );

        await expect(
          readFounderCommandSnapshot(
            readInput,
            fetchMock,
          ),
        ).rejects.toMatchObject({
          status: 502,
          message:
            "Founder command snapshot service returned an invalid response. No action was taken.",
        });
      },
    );

    it(
      "rejects a response that attempts to authorize provider mutation",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse({
              ...safeSnapshotResponse,
              providerMutationAuthorized:
                true,
            }),
          );

        await expect(
          readFounderCommandSnapshot(
            readInput,
            fetchMock,
          ),
        ).rejects.toMatchObject({
          status: 502,
          message:
            "Founder command snapshot safety boundary could not be verified. No action was taken.",
        });
      },
    );

    it(
      "rejects a foreign tenant or founder-owner identity response",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse({
              ...safeSnapshotResponse,
              tenantId:
                "foreign-tenant",
              ownerActorId:
                "foreign-owner",
            }),
          );

        await expect(
          readFounderCommandSnapshot(
            readInput,
            fetchMock,
          ),
        ).rejects.toMatchObject({
          status: 502,
          message:
            "Founder command snapshot identity boundary could not be verified.",
        });
      },
    );

    it(
      "rejects nested snapshot evidence belonging to another tenant",
      async () => {
        const fetchMock =
          vi.fn().mockResolvedValue(
            jsonResponse({
              ...safeSnapshotResponse,
              snapshot: {
                ...safeSnapshotResponse
                  .snapshot,
                actions: {
                  "action-a": {
                    tenantId:
                      "foreign-tenant",
                    status:
                      "PENDING_OWNER_REVIEW",
                  },
                },
              },
            }),
          );

        const resultPromise =
          readFounderCommandSnapshot(
            readInput,
            fetchMock,
          );

        await expect(
          resultPromise,
        ).rejects.toBeInstanceOf(
          FounderCommandSnapshotClientError,
        );

        await expect(
          resultPromise,
        ).rejects.toMatchObject({
          status: 502,
          message:
            "Founder command snapshot response could not be safely verified.",
        });

        expect(fetchMock)
          .toHaveBeenCalledTimes(1);
      },
    );
  },
);
