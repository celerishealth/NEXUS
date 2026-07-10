import assert from "node:assert/strict";
import test from "node:test";

import {
  TenantAccessDeniedError,
} from "../../lib/nexus/auth/tenantAccessContext";

import {
  observeAuthenticatedControlledPilotHealth,
  ControlledPilotHealthDeniedError,
  type ObserveAuthenticatedControlledPilotHealthInput,
  type PilotHealthAlertPersistenceInput,
} from "../../lib/nexus/pilot/authenticatedControlledPilotHealth";

function validInput(
  overrides:
    Partial<ObserveAuthenticatedControlledPilotHealthInput> = {},
): ObserveAuthenticatedControlledPilotHealthInput {
  return {
    principal: {
      userId: "owner-user-1",
      tenantId: "tenant-1",
      sessionId: "owner-session-1",
    },

    accessRepositories: {
      async findTenantById(tenantId) {
        return {
          id: tenantId,
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
        };
      },

      async findMembership(
        tenantId,
        userId,
      ) {
        return {
          tenantId,
          userId,
          role: "OWNER",
          status: "ACTIVE",
        };
      },
    },

    workspaceRepository: {
      async findWorkspaceByTenantId(
        tenantId,
      ) {
        return {
          tenantId,
          ownerUserId: "owner-user-1",
          businessName:
            "NEXUS Pilot Business",
          businessSlug:
            "nexus-pilot-business",
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
          timezone: "Europe/Amsterdam",
          locale: "en-NL",
        };
      },
    },

    pilotAccessRepository: {
      async findEnrollmentByTenantId(
        tenantId,
      ) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId:
            "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "ACTIVE",
          accessMode:
            "CONTROLLED_PILOT",
          executionMode:
            "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized:
            false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },

    healthRepository: {
      async findHealthSnapshot(
        tenantId,
        enrollmentId,
      ) {
        return {
          tenantId,
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: false,
          circuitStatus: "CLOSED",
          dailyOperationCount: 20,
          dailyOperationLimit: 100,
          activeOperationCount: 1,
          concurrentOperationLimit: 5,
          recentFailureCount: 0,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T18:00:00.000Z",
        };
      },
    },

    alertRepository: {
      async createOrGetAlert(
        input:
          PilotHealthAlertPersistenceInput,
      ) {
        return {
          outcome: "CREATED",
          alert: {
            id: "pilot-health-alert-1",
            ...input,
            createdAt: input.observedAt,
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    idempotencyKey:
      "pilot-health-0001",
    ...overrides,
  };
}

async function expectDenied(
  input:
    ObserveAuthenticatedControlledPilotHealthInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      observeAuthenticatedControlledPilotHealth(
        input,
      ),
    (error: unknown) => {
      assert.ok(
        error instanceof
          ControlledPilotHealthDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("healthy pilot returns owner health view without alert write", async () => {
  let alertWrites = 0;

  const base = validInput();

  const result =
    await observeAuthenticatedControlledPilotHealth({
      ...base,

      alertRepository: {
        async createOrGetAlert() {
          alertWrites += 1;

          throw new Error(
            "Healthy state must not create an alert.",
          );
        },
      },
    });

  assert.equal(result.health.status, "HEALTHY");
  assert.deepEqual(
    result.health.reasonCodes,
    [],
  );

  assert.equal(result.alert.required, false);

  assert.equal(
    result.alert.outcome,
    "NOT_REQUIRED",
  );

  assert.equal(result.alert.id, null);
  assert.equal(alertWrites, 0);

  assert.equal(
    result.safetyBoundary
      .internalAlertOnly,
    true,
  );

  assert.equal(Object.isFrozen(result), true);
});

test("daily and concurrency pressure create warning alert", async () => {
  let alertInput:
    | PilotHealthAlertPersistenceInput
    | undefined;

  const result =
    await observeAuthenticatedControlledPilotHealth(
      validInput({
        healthRepository: {
          async findHealthSnapshot(
            tenantId,
            enrollmentId,
          ) {
            return {
              tenantId,
              enrollmentId,
              enrollmentStatus: "ACTIVE",
              emergencyStop: false,
              circuitStatus: "CLOSED",
              dailyOperationCount: 85,
              dailyOperationLimit: 100,
              activeOperationCount: 4,
              concurrentOperationLimit: 5,
              recentFailureCount: 0,
              failureThreshold: 3,
              updatedAt:
                "2026-07-10T18:00:00.000Z",
            };
          },
        },

        alertRepository: {
          async createOrGetAlert(input) {
            alertInput = input;

            return {
              outcome: "CREATED",
              alert: {
                id: "pilot-health-alert-1",
                ...input,
                createdAt:
                  input.observedAt,
              },
            };
          },
        },
      }),
    );

  assert.equal(
    result.health.status,
    "WARNING",
  );

  assert.deepEqual(
    result.health.reasonCodes,
    [
      "DAILY_BUDGET_PRESSURE",
      "CONCURRENCY_PRESSURE",
    ],
  );

  assert.equal(
    result.health.dailyUsagePercent,
    85,
  );

  assert.equal(
    result.health.concurrencyUsagePercent,
    80,
  );

  assert.equal(
    result.alert.outcome,
    "CREATED",
  );

  assert.equal(
    alertInput?.externalNotificationSent,
    false,
  );

  assert.equal(
    alertInput?.executionTriggered,
    false,
  );
});

test("approaching failure threshold creates warning", async () => {
  const result =
    await observeAuthenticatedControlledPilotHealth(
      validInput({
        healthRepository: {
          async findHealthSnapshot(
            tenantId,
            enrollmentId,
          ) {
            return {
              tenantId,
              enrollmentId,
              enrollmentStatus: "ACTIVE",
              emergencyStop: false,
              circuitStatus: "CLOSED",
              dailyOperationCount: 1,
              dailyOperationLimit: 100,
              activeOperationCount: 0,
              concurrentOperationLimit: 5,
              recentFailureCount: 2,
              failureThreshold: 3,
              updatedAt:
                "2026-07-10T18:00:00.000Z",
            };
          },
        },
      }),
    );

  assert.equal(
    result.health.status,
    "WARNING",
  );

  assert.deepEqual(
    result.health.reasonCodes,
    ["FAILURE_THRESHOLD_APPROACHING"],
  );

  assert.equal(
    result.health.failureUsagePercent,
    66.67,
  );
});

test("open circuit creates blocked internal alert", async () => {
  const result =
    await observeAuthenticatedControlledPilotHealth(
      validInput({
        healthRepository: {
          async findHealthSnapshot(
            tenantId,
            enrollmentId,
          ) {
            return {
              tenantId,
              enrollmentId,
              enrollmentStatus: "ACTIVE",
              emergencyStop: false,
              circuitStatus: "OPEN",
              dailyOperationCount: 5,
              dailyOperationLimit: 100,
              activeOperationCount: 0,
              concurrentOperationLimit: 5,
              recentFailureCount: 3,
              failureThreshold: 3,
              updatedAt:
                "2026-07-10T18:00:00.000Z",
            };
          },
        },
      }),
    );

  assert.equal(
    result.health.status,
    "BLOCKED",
  );

  assert.deepEqual(
    result.health.reasonCodes,
    ["FAILURE_CIRCUIT_OPEN"],
  );

  assert.equal(result.alert.required, true);

  assert.equal(
    result.safetyBoundary
      .externalNotificationSent,
    false,
  );
});

test("suspended pilot remains visible as blocked", async () => {
  const result =
    await observeAuthenticatedControlledPilotHealth(
      validInput({
        pilotAccessRepository: {
          async findEnrollmentByTenantId(
            tenantId,
          ) {
            return {
              id: "pilot-enrollment-1",
              tenantId,
              invitationId:
                "pilot-invitation-1",
              ownerUserId:
                "owner-user-1",
              enrollmentStatus:
                "SUSPENDED",
              accessMode:
                "CONTROLLED_PILOT",
              executionMode:
                "SANDBOX_ONLY",
              publicSignupAuthorized:
                false,
              liveProviderExecutionAuthorized:
                false,
              enrolledAt:
                "2026-07-10T17:00:00.000Z",
              createdAt:
                "2026-07-10T17:00:01.000Z",
            };
          },
        },

        healthRepository: {
          async findHealthSnapshot(
            tenantId,
            enrollmentId,
          ) {
            return {
              tenantId,
              enrollmentId,
              enrollmentStatus:
                "SUSPENDED",
              emergencyStop: false,
              circuitStatus: "CLOSED",
              dailyOperationCount: 5,
              dailyOperationLimit: 100,
              activeOperationCount: 0,
              concurrentOperationLimit: 5,
              recentFailureCount: 0,
              failureThreshold: 3,
              updatedAt:
                "2026-07-10T18:00:00.000Z",
            };
          },
        },
      }),
    );

  assert.equal(
    result.health.status,
    "BLOCKED",
  );

  assert.deepEqual(
    result.health.reasonCodes,
    ["PILOT_SUSPENDED"],
  );
});

test("non-owner cannot inspect pilot health", async () => {
  let enrollmentReads = 0;
  let healthReads = 0;

  const input = validInput({
    principal: {
      userId: "operator-user-1",
      tenantId: "tenant-1",
      sessionId: "operator-session-1",
    },

    accessRepositories: {
      async findTenantById(tenantId) {
        return {
          id: tenantId,
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
        };
      },

      async findMembership(
        tenantId,
        userId,
      ) {
        return {
          tenantId,
          userId,
          role: "OPERATOR",
          status: "ACTIVE",
        };
      },
    },

    pilotAccessRepository: {
      async findEnrollmentByTenantId() {
        enrollmentReads += 1;
        return null;
      },
    },

    healthRepository: {
      async findHealthSnapshot() {
        healthReads += 1;
        return null;
      },
    },
  });

  await assert.rejects(
    () =>
      observeAuthenticatedControlledPilotHealth(
        input,
      ),
    (error: unknown) => {
      assert.ok(
        error instanceof TenantAccessDeniedError,
      );

      assert.equal(
        error.code,
        "OWNER_AUTHORITY_REQUIRED",
      );

      return true;
    },
  );

  assert.equal(enrollmentReads, 0);
  assert.equal(healthReads, 0);
});

test("cross-tenant health snapshot is blocked before alert write", async () => {
  let alertWrites = 0;

  const input = validInput({
    healthRepository: {
      async findHealthSnapshot(
        _tenantId,
        enrollmentId,
      ) {
        return {
          tenantId: "tenant-attacker",
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: false,
          circuitStatus: "CLOSED",
          dailyOperationCount: 90,
          dailyOperationLimit: 100,
          activeOperationCount: 0,
          concurrentOperationLimit: 5,
          recentFailureCount: 0,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T18:00:00.000Z",
        };
      },
    },

    alertRepository: {
      async createOrGetAlert() {
        alertWrites += 1;

        throw new Error(
          "Alert write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_HEALTH_SNAPSHOT_TENANT_MISMATCH",
  );

  assert.equal(alertWrites, 0);
});

test("active operation overflow fails closed", async () => {
  let alertWrites = 0;

  const input = validInput({
    healthRepository: {
      async findHealthSnapshot(
        tenantId,
        enrollmentId,
      ) {
        return {
          tenantId,
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: false,
          circuitStatus: "CLOSED",
          dailyOperationCount: 10,
          dailyOperationLimit: 100,
          activeOperationCount: 6,
          concurrentOperationLimit: 5,
          recentFailureCount: 0,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T18:00:00.000Z",
        };
      },
    },

    alertRepository: {
      async createOrGetAlert() {
        alertWrites += 1;

        throw new Error(
          "Alert write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_HEALTH_ACTIVE_OPERATION_OVERFLOW",
  );

  assert.equal(alertWrites, 0);
});

test("corrupted persisted fingerprint fails closed", async () => {
  const input = validInput({
    healthRepository: {
      async findHealthSnapshot(
        tenantId,
        enrollmentId,
      ) {
        return {
          tenantId,
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: true,
          circuitStatus: "CLOSED",
          dailyOperationCount: 0,
          dailyOperationLimit: 100,
          activeOperationCount: 0,
          concurrentOperationLimit: 5,
          recentFailureCount: 0,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T18:00:00.000Z",
        };
      },
    },

    alertRepository: {
      async createOrGetAlert(input) {
        return {
          outcome: "CREATED",
          alert: {
            id: "pilot-health-alert-1",
            ...input,
            stateFingerprint:
              "0".repeat(64),
            createdAt:
              input.observedAt,
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_HEALTH_ALERT_FINGERPRINT_INVALID",
  );
});

test("existing alert is returned idempotently", async () => {
  const result =
    await observeAuthenticatedControlledPilotHealth(
      validInput({
        healthRepository: {
          async findHealthSnapshot(
            tenantId,
            enrollmentId,
          ) {
            return {
              tenantId,
              enrollmentId,
              enrollmentStatus: "ACTIVE",
              emergencyStop: true,
              circuitStatus: "CLOSED",
              dailyOperationCount: 0,
              dailyOperationLimit: 100,
              activeOperationCount: 0,
              concurrentOperationLimit: 5,
              recentFailureCount: 0,
              failureThreshold: 3,
              updatedAt:
                "2026-07-10T18:00:00.000Z",
            };
          },
        },

        alertRepository: {
          async createOrGetAlert(input) {
            return {
              outcome: "EXISTING",
              alert: {
                id:
                  "pilot-health-alert-existing-1",
                ...input,
                createdAt:
                  input.observedAt,
              },
            };
          },
        },
      }),
    );

  assert.equal(
    result.alert.outcome,
    "EXISTING",
  );

  assert.equal(
    result.alert.id,
    "pilot-health-alert-existing-1",
  );
});

test("health monitoring never sends or executes external activity", async () => {
  const result =
    await observeAuthenticatedControlledPilotHealth(
      validInput(),
    );

  assert.equal(
    result.safetyBoundary.ownerOnly,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .immutableFingerprint,
    true,
  );

  assert.equal(
    result.safetyBoundary
      .externalNotificationSent,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .executionTriggered,
    false,
  );

  assert.equal(
    result.safetyBoundary.executionMode,
    "SANDBOX_ONLY",
  );

  assert.equal(
    result.safetyBoundary
      .publicSignupAuthorized,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    result.safetyBoundary
      .publicLaunchAuthorized,
    false,
  );
});
