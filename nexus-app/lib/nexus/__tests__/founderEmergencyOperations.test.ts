import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  pauseFounderEmergencyOperations,
  readFounderEmergencyStatus,
} from "../founderEmergencyOperations";

import type {
  ControlledPilotAtomicHealthPauseStore,
} from "../supabaseControlledPilotAtomicHealthPauseStore";

import type {
  ControlledPilotOperationStateReader,
} from "../supabaseControlledPilotOperationStateReader";

const activeState = {
  tenantId: "tenant-a",
  operationStatus: "active" as const,
  blockingSignalId: null,
  stateVersion: 4,
  lastTransitionAt: 1_720_000_000_000,
};

const pausedState = {
  tenantId: "tenant-a",
  operationStatus: "paused" as const,
  blockingSignalId: "signal-one",
  stateVersion: 5,
  lastTransitionAt: 1_720_000_001_000,
};

describe(
  "founder emergency operations",
  () => {
    it(
      "reads a tenant-bound active operation state",
      async () => {
        const reader = {
          readTenantState:
            vi.fn().mockResolvedValue({
              status: "found",
              state: activeState,
            }),
        } satisfies ControlledPilotOperationStateReader;

        await expect(
          readFounderEmergencyStatus(
            "tenant-a",
            reader,
          ),
        ).resolves.toEqual({
          status: "ready",
          state: activeState,
        });
      },
    );

    it(
      "fails closed on a cross-tenant state response",
      async () => {
        const reader = {
          readTenantState:
            vi.fn().mockResolvedValue({
              status: "found",
              state: {
                ...activeState,
                tenantId: "tenant-b",
              },
            }),
        } satisfies ControlledPilotOperationStateReader;

        await expect(
          readFounderEmergencyStatus(
            "tenant-a",
            reader,
          ),
        ).resolves.toEqual({
          status: "state-unavailable",
        });
      },
    );

    it(
      "returns the existing pause without a second mutation",
      async () => {
        const reader = {
          readTenantState:
            vi.fn().mockResolvedValue({
              status: "found",
              state: pausedState,
            }),
        } satisfies ControlledPilotOperationStateReader;

        const pauseStore = {
          commitCriticalPause: vi.fn(),
        } satisfies ControlledPilotAtomicHealthPauseStore;

        const result =
          await pauseFounderEmergencyOperations(
            {
              tenantId: "tenant-a",
              signalId: "signal-new",
              observedAt:
                1_720_000_002_000,
            },
            {
              stateReader: reader,
              pauseStore,
            },
          );

        expect(result).toEqual({
          status: "already-paused",
          signalId: "signal-one",
          state: pausedState,
        });

        expect(
          pauseStore.commitCriticalPause,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "commits and verifies an atomic founder emergency pause",
      async () => {
        const reader = {
          readTenantState: vi
            .fn()
            .mockResolvedValueOnce({
              status: "found",
              state: activeState,
            })
            .mockResolvedValueOnce({
              status: "found",
              state: pausedState,
            }),
        } satisfies ControlledPilotOperationStateReader;

        const pauseStore = {
          commitCriticalPause:
            vi.fn().mockResolvedValue({
              status: "committed",
              operationStatus: "paused",
              blockingSignalId:
                "signal-one",
              stateVersion: 5,
            }),
        } satisfies ControlledPilotAtomicHealthPauseStore;

        const result =
          await pauseFounderEmergencyOperations(
            {
              tenantId: "tenant-a",
              signalId: "signal-one",
              observedAt:
                1_720_000_001_000,
            },
            {
              stateReader: reader,
              pauseStore,
            },
          );

        expect(result).toEqual({
          status: "paused",
          signalId: "signal-one",
          state: pausedState,
        });

        expect(
          pauseStore.commitCriticalPause,
        ).toHaveBeenCalledWith({
          tenantId: "tenant-a",
          signalId: "signal-one",
          signalSource:
            "founder-emergency-operations",
          severity: "critical",
          observedAt:
            1_720_000_001_000,
          expectedStateVersion: 4,
        });
      },
    );

    it(
      "fails closed on an atomic state-version conflict",
      async () => {
        const reader = {
          readTenantState:
            vi.fn().mockResolvedValue({
              status: "found",
              state: activeState,
            }),
        } satisfies ControlledPilotOperationStateReader;

        const pauseStore = {
          commitCriticalPause:
            vi.fn().mockResolvedValue({
              status:
                "state-version-conflict",
              currentOperationStatus:
                "active",
              currentStateVersion: 5,
            }),
        } satisfies ControlledPilotAtomicHealthPauseStore;

        await expect(
          pauseFounderEmergencyOperations(
            {
              tenantId: "tenant-a",
              signalId: "signal-one",
              observedAt:
                1_720_000_001_000,
            },
            {
              stateReader: reader,
              pauseStore,
            },
          ),
        ).resolves.toEqual({
          status: "state-conflict",
        });
      },
    );

    it(
      "fails closed when post-commit state cannot be verified",
      async () => {
        const reader = {
          readTenantState: vi
            .fn()
            .mockResolvedValueOnce({
              status: "found",
              state: activeState,
            })
            .mockResolvedValueOnce({
              status: "found",
              state: {
                ...pausedState,
                blockingSignalId:
                  "different-signal",
              },
            }),
        } satisfies ControlledPilotOperationStateReader;

        const pauseStore = {
          commitCriticalPause:
            vi.fn().mockResolvedValue({
              status: "committed",
              operationStatus: "paused",
              blockingSignalId:
                "signal-one",
              stateVersion: 5,
            }),
        } satisfies ControlledPilotAtomicHealthPauseStore;

        await expect(
          pauseFounderEmergencyOperations(
            {
              tenantId: "tenant-a",
              signalId: "signal-one",
              observedAt:
                1_720_000_001_000,
            },
            {
              stateReader: reader,
              pauseStore,
            },
          ),
        ).resolves.toEqual({
          status:
            "pause-verification-failed",
        });
      },
    );
  },
);