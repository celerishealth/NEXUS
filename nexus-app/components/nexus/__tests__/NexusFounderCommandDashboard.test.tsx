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
import { FounderGrowthStatusSummaryClientError } from "@/lib/nexus/founderGrowthStatusSummaryClient";
import { FounderCommercialEvidenceSummaryClientError } from "@/lib/nexus/founderCommercialEvidenceSummaryClient";

import {
  FounderEmergencyClientError,
} from "@/lib/nexus/founderEmergencyClient";

const doubles = vi.hoisted(
  () => ({
    issueSession: vi.fn(),
    readSnapshot: vi.fn(),
    readGrowthSnapshot: vi.fn(),
    readGrowthStatusSummary: vi.fn(),
    readCommercialEvidence: vi.fn(),
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

vi.mock(
  "@/lib/nexus/founderGrowthStatusSummaryClient",
  async () => {
    const actual =
      await vi.importActual<
        typeof import("@/lib/nexus/founderGrowthStatusSummaryClient")
      >(
        "@/lib/nexus/founderGrowthStatusSummaryClient",
      );

    return {
      ...actual,
      readFounderGrowthStatusSummary:
        doubles.readGrowthStatusSummary,
    };
  },
);
vi.mock(
  "@/lib/nexus/founderCommercialEvidenceSummaryClient",
  async () => {
    const actual =
      await vi.importActual<
        typeof import("@/lib/nexus/founderCommercialEvidenceSummaryClient")
      >(
        "@/lib/nexus/founderCommercialEvidenceSummaryClient",
      );

    return {
      ...actual,
      readFounderCommercialEvidenceSummary:
        doubles.readCommercialEvidence,
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

const growthStatusSummaryResult = {
  schemaVersion:
    "nexus-founder-growth-status-summary-v1" as const,
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  summary: {
    tenantId: "tenant-a",
    generatedAt: "2026-07-28T00:00:00.000Z",
    evidenceBoundary:
      "VERIFIED_INQUIRY_STATUS_AGGREGATES_ONLY" as const,
    totalInquiries: 12,
    latestReceivedAt: 1722124800000,
    counts: { received: 2, recommendationPending: 2, ownerReview: 2, approved: 1, rejected: 1, sandboxExecuted: 1, completed: 2, failed: 1 },
    customerIdentityExposed: false as const,
    inquiryMessageExposed: false as const,
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
const commercialEvidenceSummaryResult = {
  schemaVersion:
    "nexus-founder-commercial-evidence-summary-v1" as const,
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  summary: {
    version:
      "nexus-founder-commercial-evidence-summary-v1" as const,
    tenantId: "tenant-a",
    ownerActorId: "owner-a",
    generatedAt: "2026-07-28T00:00:00.000Z",
    evidenceBoundary:
      "VERIFIED_OWNER_BOUND_COMMERCIAL_EVIDENCE_ONLY" as const,
    sourceRecordCount: 4,
    qualifiedLeadCount: 1,
    quotationCount: 1,
    orderCount: 1,
    paymentReceiptCount: 1,
    revenueByCurrencyMinor: { INR: 125000 },
    customerIdentityExposed: false as const,
    inquiryMessageExposed: false as const,
    customerContactAuthorized: false as const,
    quotationDeliveryAuthorized: false as const,
    orderExecutionAuthorized: false as const,
    paymentExecutionAuthorized: false as const,
    providerMutationAuthorized: false as const,
    publicLaunchAuthorized: false as const,
  },
  liveProviderExecutionAuthorized: false as const,
  providerMutationAuthorized: false as const,
  resumeAuthorized: false as const,
  customerContactAuthorized: false as const,
  quotationDeliveryAuthorized: false as const,
  orderExecutionAuthorized: false as const,
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
      doubles.readGrowthStatusSummary
        .mockResolvedValue(
          growthStatusSummaryResult,
        );
      doubles.readCommercialEvidence
        .mockResolvedValue(
          commercialEvidenceSummaryResult,
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
            "Commercial metrics are displayed separately only when verified owner-bound evidence exists.",
          ),
        ).toBeTruthy();
      },
    );


    it(
      "renders verified inquiry lifecycle status aggregates",
      async () => {
        render(<NexusFounderCommandDashboard />);
        await authenticateDashboard();
        expect((await screen.findByLabelText("Inquiry status ownerReview")).textContent).toBe("2");
        expect(doubles.readGrowthStatusSummary).toHaveBeenCalledWith({ accessToken: "authenticated-session-token", expectedTenantId: "tenant-a", expectedOwnerActorId: "owner-a" });
        expect(screen.getByText("Verified aggregate status labels")).toBeTruthy();
      },
    );

    it(
      "preserves the command snapshot and inquiry totals when status evidence is unavailable",
      async () => {
        doubles.readGrowthStatusSummary.mockRejectedValue(new FounderGrowthStatusSummaryClientError(503, "Founder growth status summary is unavailable. No action was taken."));
        render(<NexusFounderCommandDashboard />);
        await authenticateDashboard();
        await screen.findByText("Founder growth status summary is unavailable. No action was taken.");
        expect(screen.getByLabelText("Snapshot revision").textContent).toBe("7");
        expect(screen.getByLabelText("Growth total inquiries").textContent).toBe("12");
        expect(screen.getByLabelText("Growth unique customers").textContent).toBe("7");
      },
    );

    it(
      "preserves refreshed command and growth evidence when refreshed status evidence fails",
      async () => {
        doubles.readSnapshot.mockResolvedValueOnce(snapshotResult).mockResolvedValueOnce({ ...snapshotResult, requestId: "request-founder-command-status-refresh", snapshot: { ...snapshotResult.snapshot, revision: 8 } });
        doubles.readGrowthSnapshot.mockResolvedValueOnce(growthSnapshotResult).mockResolvedValueOnce({ ...growthSnapshotResult, snapshot: { ...growthSnapshotResult.snapshot, totalInquiries: 13, uniqueCustomers: 8 } });
        doubles.readGrowthStatusSummary.mockResolvedValueOnce(growthStatusSummaryResult).mockRejectedValueOnce(new FounderGrowthStatusSummaryClientError(503, "Founder growth status summary is unavailable. No action was taken."));
        render(<NexusFounderCommandDashboard />);
        const user = await authenticateDashboard();
        await screen.findByLabelText("Inquiry status ownerReview");
        await user.click(screen.getByRole("button", { name: "Refresh snapshot" }));
        await screen.findByText("Founder growth status summary is unavailable. No action was taken.");
        expect(screen.getByLabelText("Snapshot revision").textContent).toBe("8");
        expect(screen.getByLabelText("Growth total inquiries").textContent).toBe("13");
        expect(screen.getByLabelText("Growth unique customers").textContent).toBe("8");
        expect(screen.queryByLabelText("Inquiry status ownerReview")).toBeNull();
      },
    );

    it(
      "clears inquiry lifecycle evidence after authenticated logout",
      async () => {
        render(<NexusFounderCommandDashboard />);
        const user = await authenticateDashboard();
        await screen.findByLabelText("Inquiry status ownerReview");
        await user.click(screen.getByRole("button", { name: "Log out and revoke session" }));
        await screen.findByText("Authenticated logout verified. Browser-held access token cleared. No execution or resume action was performed.");
        expect(screen.queryByLabelText("Inquiry status ownerReview")).toBeNull();
        expect(screen.queryByLabelText("Inquiry lifecycle evidence")).toBeNull();
      },
    );

    it(
      "renders verified owner-bound commercial evidence without granting authority",
      async () => {
        render(<NexusFounderCommandDashboard />);
        await authenticateDashboard();

        expect(doubles.readCommercialEvidence).toHaveBeenCalledWith({
          accessToken: "authenticated-session-token",
          expectedTenantId: "tenant-a",
          expectedOwnerActorId: "owner-a",
        });
        expect((await screen.findByLabelText("Commercial qualified leads")).textContent).toBe("1");
        expect(screen.getByLabelText("Commercial quotations").textContent).toBe("1");
        expect(screen.getByLabelText("Commercial orders").textContent).toBe("1");
        expect(screen.getByLabelText("Commercial payment receipts").textContent).toBe("1");
        expect(screen.getByLabelText("Commercial source records").textContent).toBe("4");
        expect(screen.getByLabelText("Commercial revenue INR").textContent).toContain("125000");
        expect(screen.getByText("Verified owner-bound revenue chain")).toBeTruthy();
        expect(screen.queryByRole("button", { name: /execute|approve|resume|send|payment|pause/i })).toBeNull();
      },
    );

    it(
      "preserves command growth and lifecycle evidence when commercial evidence is unavailable",
      async () => {
        doubles.readCommercialEvidence.mockRejectedValue(
          new FounderCommercialEvidenceSummaryClientError(
            503,
            "Founder commercial evidence summary is unavailable. No action was taken.",
          ),
        );
        render(<NexusFounderCommandDashboard />);
        await authenticateDashboard();

        await screen.findByText(
          "Founder commercial evidence summary is unavailable. No action was taken.",
        );
        expect(screen.getByLabelText("Snapshot revision").textContent).toBe("7");
        expect(screen.getByLabelText("Growth total inquiries").textContent).toBe("12");
        expect(screen.getByLabelText("Inquiry status ownerReview").textContent).toBe("2");
        expect(screen.queryByLabelText("Commercial qualified leads")).toBeNull();
      },
    );

  },
);
