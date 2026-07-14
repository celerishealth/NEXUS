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

import NexusFounderEmergencyControl from "../NexusFounderEmergencyControl";
import {
  FounderEmergencyClientError,
} from "@/lib/nexus/founderEmergencyClient";

const doubles = vi.hoisted(
  () => ({
    issueSession: vi.fn(),
    readStatus: vi.fn(),
    pause: vi.fn(),
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
      readFounderEmergencyStatus:
        doubles.readStatus,
      pauseFounderEmergency:
        doubles.pause,
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
    "2026-07-14T13:00:00.000Z",
};

const activeStatus = {
  mode:
    "authenticated-founder-emergency-status-v1" as const,
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  operationStatus:
    "active" as const,
  blockingSignalId: null,
  stateVersion: 4,
  lastTransitionAt:
    1_720_000_000_000,
  emergencyPauseAvailable: true,
  liveProviderExecutionAuthorized:
    false as const,
  resumeAuthorized: false as const,
};

const pausedStatus = {
  mode:
    "authenticated-founder-emergency-status-v1" as const,
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  operationStatus:
    "paused" as const,
  blockingSignalId:
    "server-generated-signal",
  stateVersion: 5,
  lastTransitionAt:
    1_720_000_001_000,
  emergencyPauseAvailable: false,
  liveProviderExecutionAuthorized:
    false as const,
  resumeAuthorized: false as const,
};

const pauseResult = {
  mode:
    "authenticated-founder-emergency-pause-v1" as const,
  tenantId: "tenant-a",
  ownerActorId: "owner-a",
  pauseStatus: "paused" as const,
  operationStatus:
    "paused" as const,
  blockingSignalId:
    "server-generated-signal",
  stateVersion: 5,
  lastTransitionAt:
    1_720_000_001_000,
  liveProviderExecutionAuthorized:
    false as const,
  resumeAuthorized: false as const,
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

async function authenticateControl() {
  const user =
    await fillLoginForm();

  await user.click(
    screen.getByRole(
      "button",
      {
        name:
          "Authenticate and verify status",
      },
    ),
  );

  await screen.findByText(
    "Authenticated founder emergency status verified.",
  );

  return user;
}

describe(
  "NexusFounderEmergencyControl browser interaction",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      doubles.issueSession
        .mockResolvedValue(session);

      doubles.readStatus
        .mockResolvedValue(
          activeStatus,
        );

      doubles.pause
        .mockResolvedValue(
          pauseResult,
        );
    });

    afterEach(() => {
      cleanup();
      vi.restoreAllMocks();
    });

    it(
      "starts fail-closed with authentication required and no resume button",
      () => {
        render(
          <NexusFounderEmergencyControl />,
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Authenticate and verify status",
            },
          ),
        ).toBeTruthy();

        expect(
          screen.queryByRole(
            "button",
            {
              name: /resume/i,
            },
          ),
        ).toBeNull();

        expect(
          screen.queryByRole(
            "button",
            {
              name:
                /emergency-pause confirmation/i,
            },
          ),
        ).toBeNull();

        expect(
          screen.getByText(
            "Live provider execution: unauthorized",
          ),
        ).toBeTruthy();

        expect(
          screen.getByText(
            "Resume API/control: not available",
          ),
        ).toBeTruthy();
      },
    );

    it(
      "authenticates through the existing session client and reads server-bound status",
      async () => {
        render(
          <NexusFounderEmergencyControl />,
        );

        await authenticateControl();

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
          doubles.readStatus,
        ).toHaveBeenCalledWith(
          "authenticated-session-token",
        );

        expect(
          screen.getByText("ACTIVE"),
        ).toBeTruthy();

        expect(
          screen.getByText(
            "tenant-a",
          ),
        ).toBeTruthy();

        expect(
          screen.getByText(
            "Owner owner-a",
          ),
        ).toBeTruthy();

        expect(
          (
            screen.getByLabelText(
              "Password",
            ) as HTMLInputElement
          ).value,
        ).toBe("");
      },
    );

    it(
      "requires explicit confirmation and cancellation performs no pause",
      async () => {
        render(
          <NexusFounderEmergencyControl />,
        );

        const user =
          await authenticateControl();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Open emergency-pause confirmation",
            },
          ),
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Confirm emergency pause",
            },
          ),
        ).toBeTruthy();

        expect(
          doubles.pause,
        ).not.toHaveBeenCalled();

        await user.click(
          screen.getByRole(
            "button",
            {
              name: "Cancel",
            },
          ),
        );

        expect(
          doubles.pause,
        ).not.toHaveBeenCalled();

        expect(
          screen.queryByRole(
            "button",
            {
              name:
                "Confirm emergency pause",
            },
          ),
        ).toBeNull();
      },
    );

    it(
      "confirms one pause with the in-memory bearer token and locks the paused state",
      async () => {
        render(
          <NexusFounderEmergencyControl />,
        );

        const user =
          await authenticateControl();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Open emergency-pause confirmation",
            },
          ),
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Confirm emergency pause",
            },
          ),
        );

        await screen.findByText(
          "Emergency pause verified. Controlled operations are paused.",
        );

        expect(
          doubles.pause,
        ).toHaveBeenCalledTimes(1);

        expect(
          doubles.pause,
        ).toHaveBeenCalledWith(
          "authenticated-session-token",
        );

        expect(
          screen.getByText("PAUSED"),
        ).toBeTruthy();

        const pausedButton =
          screen.getByRole(
            "button",
            {
              name:
                "Operations already paused",
            },
          ) as HTMLButtonElement;

        expect(
          pausedButton.disabled,
        ).toBe(true);

        expect(
          screen.queryByRole(
            "button",
            {
              name: /resume/i,
            },
          ),
        ).toBeNull();
      },
    );

    it(
      "refreshes status with the active in-memory token",
      async () => {
        render(
          <NexusFounderEmergencyControl />,
        );

        const user =
          await authenticateControl();

        doubles.readStatus
          .mockResolvedValueOnce(
            pausedStatus,
          );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Refresh status",
            },
          ),
        );

        await screen.findByText(
          "Founder emergency status refreshed.",
        );

        expect(
          doubles.readStatus,
        ).toHaveBeenNthCalledWith(
          2,
          "authenticated-session-token",
        );

        expect(
          screen.getByText("PAUSED"),
        ).toBeTruthy();
      },
    );

    it(
      "shows a safe conflict message without raw service detail",
      async () => {
        render(
          <NexusFounderEmergencyControl />,
        );

        const user =
          await authenticateControl();

        doubles.pause
          .mockRejectedValueOnce(
            new FounderEmergencyClientError(
              409,
              "Emergency pause was blocked by a concurrent state change. Refresh status before retrying.",
            ),
          );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Open emergency-pause confirmation",
            },
          ),
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Confirm emergency pause",
            },
          ),
        );

        await screen.findByText(
          "Emergency pause was blocked by a concurrent state change. Refresh status before retrying.",
        );

        expect(
          document.body.textContent,
        ).not.toContain(
          "raw database detail",
        );
      },
    );

    it(
      "maps an unexpected authentication failure to a generic safe message",
      async () => {
        doubles.issueSession
          .mockRejectedValueOnce(
            new Error(
              "raw credential secret",
            ),
          );

        render(
          <NexusFounderEmergencyControl />,
        );

        const user =
          await fillLoginForm();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Authenticate and verify status",
            },
          ),
        );

        await screen.findByText(
          "Founder emergency control failed safely. No action was taken.",
        );

        expect(
          document.body.textContent,
        ).not.toContain(
          "raw credential secret",
        );

        expect(
          doubles.readStatus,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "never persists the token and clearing it returns to the locked login state",
      async () => {
        const storageWrite =
          vi.spyOn(
            Storage.prototype,
            "setItem",
          );

        render(
          <NexusFounderEmergencyControl />,
        );

        const user =
          await authenticateControl();

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Clear browser token",
            },
          ),
        );

        expect(
          storageWrite,
        ).not.toHaveBeenCalled();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Authenticate and verify status",
            },
          ),
        ).toBeTruthy();

        expect(
          screen.queryByRole(
            "button",
            {
              name:
                "Refresh status",
            },
          ),
        ).toBeNull();

        expect(
          screen.queryByRole(
            "button",
            {
              name: /resume/i,
            },
          ),
        ).toBeNull();

        expect(
          doubles.pause,
        ).not.toHaveBeenCalled();

        expect(
          screen.getByText(
            "Browser-held access token cleared. No resume action was performed.",
          ),
        ).toBeTruthy();
      },
    );
  },
);