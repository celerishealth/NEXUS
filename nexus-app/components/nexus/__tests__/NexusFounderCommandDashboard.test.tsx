// @vitest-environment jsdom

import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import NexusFounderCommandDashboard from "../NexusFounderCommandDashboard";
import {
  FounderCommandSnapshotClientError,
} from "@/lib/nexus/founderCommandSnapshotClient";
import { FounderGrowthSnapshotClientError } from "@/lib/nexus/founderGrowthSnapshotClient";

import {
  FounderEmergencyClientError,
} from "@/lib/nexus/founderEmergencyClient";

const doubles = vi.hoisted(
  () => ({
    issueSession: vi.fn(),
    readSnapshot: vi.fn(),
    readGrowthSnapshot: vi.fn(),
    revokeSession: vi.fn(),
  }),
);

vi.mock(
  "@/lib/nexus/founderEmergencyClient",
  async () => {
    const actual =
      await vi.importActual<
        typeof import("@/lib/nexus/founderEmergencyClient")
      >(
        "@/lib/nexus/founderEmergencyClient",
      );

    return {
      ...actual,
      issueFounderEmergencySession:
        doubles.issueSession,
      revokeFounderEmergencySession:
        doubles.revokeSession,
    };
  },
);

vi.mock(
  "@/lib/nexus/founderCommandSnapshotClient",
  async () => {
    const actual =
      await vi.importActual<
        typeof import("@/lib/nexus/founderCommandSnapshotClient")
      >(
        "@/lib/nexus/founderCommandSnapshotClient",
      );

    return {
      ...actual,
      readFounderCommandSnapshot:
        doubles.readSnapshot,
    };
  },
);

vi.mock(
  "@/lib/nexus/founderGrowthSnapshotClient",
  async () => {
    const actual =
      await vi.importActual<
        typeof import("@/lib/nexus/founderGrowthSnapshotClient")
      >(
        "@/lib/nexus/founderGrowthSnapshotClient",
      );

    return {
      ...actual,
      readFounderGrowthSnapshot:
        doubles.readGrowthSnapshot,
    };
  },
);

const session = {
  accessToken:
    "authenticated-session-token",
  tenantId: "tenant-a",
  actorId: "owner-a",
  role: "owner",
  expiresAt:
    "2026-07-27T12:00:00.000Z",
};

const snapshotResult = {
  schemaVersion:
    "nexus-founder-command-snapshot-v1" as const,
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  requestId:
    "request-founder-command-a",
  executionBoundary:
    "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION" as const,
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
      "action-b": {
        tenantId: "tenant-a",
        status: "BLOCKED",
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
    false as const,
  providerMutationAuthorized:
    false as const,
  resumeAuthorized: false as const,
};

const growthSnapshotResult = {
  schemaVersion:
    "nexus-founder-growth-snapshot-v1" as const,
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  snapshot: {
    tenantId: "tenant-a",
    generatedAt:
      "2026-07-28T00:00:00.000Z",
    evidenceBoundary:
      "VERIFIED_INQUIRY_EVIDENCE_ONLY" as const,
    totalInquiries: 12,
    uniqueCustomers: 7,
    qualifiedLeadCount: null,
    quotationCount: null,
    orderCount: null,
    revenueAmount: null,
    liveProviderExecutionAuthorized: false as const,
    customerContactAuthorized: false as const,
    paymentExecutionAuthorized: false as const,
    publicLaunchAuthorized: false as const,
  },
  liveProviderExecutionAuthorized: false as const,
  providerMutationAuthorized: false as const,
  resumeAuthorized: false as const,
  customerContactAuthorized: false as const,
  paymentExecutionAuthorized: false as const,
  publicLaunchAuthorized: false as const,
};

async function fillLoginForm() {
  const user = userEvent.setup();

  await user.type(
    screen.getByLabelText(
      "Workspace ID",
    ),
    "tenant-a",
  );
  await user.type(
    screen.getByLabelText(
      "Owner email",
    ),
    "owner@example.com",
  );
  await user.type(
    screen.getByLabelText(
      "Password",
    ),
    "secret-password",
  );

  return user;
}

async function authenticateDashboard() {
  const user =
    await fillLoginForm();

  await user.click(
    screen.getByRole(
      "button",
      {
        name:
          "Authenticate and load snapshot",
      },
    ),
  );

  await screen.findByText(
    "Authenticated founder command snapshot verified.",
  );

  return user;
}

describe(
  "NexusFounderCommandDashboard browser interaction",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      doubles.issueSession
        .mockResolvedValue(session);
      doubles.readSnapshot
        .mockResolvedValue(
          snapshotResult,
        );
      doubles.readGrowthSnapshot
        .mockResolvedValue(
          growthSnapshotResult,
        );
      doubles.revokeSession
        .mockResolvedValue({
          revoked: true,
          revokedAt:
            "2026-07-27T11:00:00.000Z",
          liveProviderExecutionAuthorized:
            false,
          resumeAuthorized: false,
        });
    });

    afterEach(() => {
      cleanup();
      vi.restoreAllMocks();
    });

    it(
      "starts fail-closed with authentication required and no mutation controls",
      () => {
        render(
          <NexusFounderCommandDashboard />,
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Authenticate and load snapshot",
            },
          ),
        ).toBeTruthy();

        expect(
          screen.queryByRole(
            "button",
            {
              name:
                /execute|approve|resume|send|payment|pause/i,
            },
          ),
        ).toBeNull();

        expect(
          screen.getByText(
            "Provider execution: unauthorized",
          ),
        ).toBeTruthy();
        expect(
          screen.getByText(
            "Provider mutation: unauthorized",
          ),
        ).toBeTruthy();
        expect(
          screen.getByText(
            "Resume control: unavailable",
          ),
        ).toBeTruthy();
      },
    );

    it(
      "authenticates and reads the exact tenant-owner snapshot",
      async () => {
        render(
          <NexusFounderCommandDashboard />,
        );

        await authenticateDashboard();

        expect(
          doubles.issueSession,
        ).toHaveBeenCalledWith({
          tenantId: "tenant-a",
          email:
            "owner@example.com",
          password:
            "secret-password",
        });

        expect(
          doubles.readSnapshot,
        ).toHaveBeenCalledWith({
          accessToken:
            "authenticated-session-token",
          expectedTenantId:
            "tenant-a",
          expectedOwnerActorId:
            "owner-a",
        });

        expect(
          screen.getByLabelText(
            "Snapshot revision",
          ).textContent,
        ).toBe("7");
        expect(
          screen.getByText(
            /PENDING_OWNER_REVIEW/,
          ),
        ).toBeTruthy();
        expect(
          screen.getByText(
            "audit-a",
          ),
        ).toBeTruthy();
      },
    );

    it(
      "refreshes through the same in-memory authenticated identity",
      async () => {
        doubles.readSnapshot
          .mockResolvedValueOnce(
            snapshotResult,
          )
          .mockResolvedValueOnce({
            ...snapshotResult,
            requestId:
              "request-founder-command-b",
            snapshot: {
              ...snapshotResult.snapshot,
              revision: 8,
            },
          });

        render(
          <NexusFounderCommandDashboard />,
        );

        const user =
          await authenticateDashboard();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Refresh snapshot",
            },
          ),
        );

        await screen.findByText(
          "Founder command snapshot refreshed.",
        );

        expect(
          doubles.readSnapshot,
        ).toHaveBeenCalledTimes(2);
        expect(
          screen.getByLabelText(
            "Snapshot revision",
          ).textContent,
        ).toBe("8");
      },
    );

    it(
      "fails closed when the initial snapshot cannot be verified",
      async () => {
        doubles.readSnapshot
          .mockRejectedValue(
            new FounderCommandSnapshotClientError(
              503,
              "Founder command snapshot is unavailable. No action was taken.",
            ),
          );

        render(
          <NexusFounderCommandDashboard />,
        );

        const user =
          await fillLoginForm();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Authenticate and load snapshot",
            },
          ),
        );

        await screen.findByText(
          "Founder command snapshot is unavailable. No action was taken.",
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Authenticate and load snapshot",
            },
          ),
        ).toBeTruthy();
        expect(
          screen.queryByRole(
            "button",
            {
              name:
                "Refresh snapshot",
            },
          ),
        ).toBeNull();
      },
    );

    it(
      "revokes the session and removes the verified snapshot",
      async () => {
        render(
          <NexusFounderCommandDashboard />,
        );

        const user =
          await authenticateDashboard();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Log out and revoke session",
            },
          ),
        );

        await screen.findByText(
          "Authenticated logout verified. Browser-held access token cleared. No execution or resume action was performed.",
        );

        expect(
          doubles.revokeSession,
        ).toHaveBeenCalledWith(
          "authenticated-session-token",
        );
        expect(
          screen.queryByLabelText(
            "Snapshot revision",
          ),
        ).toBeNull();
        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Authenticate and load snapshot",
            },
          ),
        ).toBeTruthy();
      },
    );

    it(
      "clears browser-held state when logout reports an already invalid session",
      async () => {
        doubles.revokeSession
          .mockRejectedValue(
            new FounderEmergencyClientError(
              401,
              "Authentication failed or the session expired.",
            ),
          );

        render(
          <NexusFounderCommandDashboard />,
        );

        const user =
          await authenticateDashboard();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Log out and revoke session",
            },
          ),
        );

        await screen.findByText(
          "Session was already invalid or revoked. Browser-held access token cleared safely.",
        );

        expect(
          screen.queryByLabelText(
            "Snapshot revision",
          ),
        ).toBeNull();
        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Authenticate and load snapshot",
            },
          ),
        ).toBeTruthy();
      },
    );
    it(
      "preserves the verified founder command snapshot when growth evidence is unavailable",
      async () => {
        doubles.readGrowthSnapshot
          .mockRejectedValue(
            new FounderGrowthSnapshotClientError(
              503,
              "Founder growth snapshot is unavailable. No action was taken.",
            ),
          );

        render(
          <NexusFounderCommandDashboard />,
        );

        await authenticateDashboard();

        await screen.findByText(
          "Founder growth snapshot is unavailable. No action was taken.",
        );

        expect(
          doubles.readGrowthSnapshot,
        ).toHaveBeenCalledWith({
          accessToken:
            "authenticated-session-token",
          expectedTenantId:
            "tenant-a",
          expectedOwnerActorId:
            "owner-a",
        });
        expect(
          screen.getByLabelText(
            "Snapshot revision",
          ).textContent,
        ).toBe("7");
        expect(
          screen.getByRole(
            "button",
            { name: "Refresh snapshot" },
          ),
        ).toBeTruthy();
      },
    );

    it(
      "renders verified exact-tenant growth totals without inventing commercial metrics",
      async () => {
        render(
          <NexusFounderCommandDashboard />,
        );

        await authenticateDashboard();

        expect(
          doubles.readGrowthSnapshot,
        ).toHaveBeenCalledWith({
          accessToken:
            "authenticated-session-token",
          expectedTenantId:
            "tenant-a",
          expectedOwnerActorId:
            "owner-a",
        });
        expect(
          screen.getByLabelText(
            "Growth total inquiries",
          ).textContent,
        ).toBe("12");
        expect(
          screen.getByLabelText(
            "Growth unique customers",
          ).textContent,
        ).toBe("7");
        expect(
          screen.getByText(
            "Qualified leads, quotations, orders, and revenue remain unavailable until separately verified evidence exists.",
          ),
        ).toBeTruthy();
      },
    );

  },
);
