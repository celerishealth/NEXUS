import assert from "node:assert/strict";
import test from "node:test";

import {
  ControlledPilotAccessDeniedError,
} from "../../lib/nexus/pilot/authenticatedControlledPilotAccess";

import {
  admitAuthenticatedPilotOperation,
  PilotOperationAdmissionDeniedError,
  type AdmitAuthenticatedPilotOperationInput,
  type PilotOperationAdmissionPersistenceInput,
} from "../../lib/nexus/pilot/authenticatedControlledPilotOperationAdmission";

function validInput(
  overrides:
    Partial<AdmitAuthenticatedPilotOperationInput> = {},
): AdmitAuthenticatedPilotOperationInput {
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

      async findMembership(tenantId, userId) {
        return {
          tenantId,
          userId,
          role: "OWNER",
          status: "ACTIVE",
        };
      },
    },

    workspaceRepository: {
      async findWorkspaceByTenantId(tenantId) {
        return {
          tenantId,
          ownerUserId: "owner-user-1",
          businessName: "NEXUS Pilot Business",
          businessSlug: "nexus-pilot-business",
          status: "ACTIVE",
          onboardingStatus: "COMPLETE",
          timezone: "Europe/Amsterdam",
          locale: "en-NL",
        };
      },
    },

    pilotAccessRepository: {
      async findEnrollmentByTenantId(tenantId) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "ACTIVE",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },

    safetyRepository: {
      async findSafetySnapshot(
        tenantId,
        enrollmentId,
      ) {
        return {
          tenantId,
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: false,
          circuitStatus: "CLOSED",
          dailyWindowStartedAt:
            "2026-07-10T00:00:00.000Z",
          dailyOperationCount: 10,
          dailyOperationLimit: 100,
          activeOperationCount: 1,
          concurrentOperationLimit: 5,
          recentFailureCount: 0,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T17:20:00.000Z",
        };
      },
    },

    admissionRepository: {
      async claimOperationAtomically(
        input:
          PilotOperationAdmissionPersistenceInput,
      ) {
        return {
          outcome: "CLAIMED",
          admission: {
            id: "pilot-admission-1",
            tenantId: input.tenantId,
            enrollmentId: input.enrollmentId,
            invitationId: input.invitationId,
            capability: input.capability,
            operationKey: input.operationKey,
            actorUserId: input.actorUserId,
            sourceSessionId:
              input.sourceSessionId,
            actorRole: input.actorRole,
            idempotencyKey:
              input.idempotencyKey,
            status: "ADMITTED",
            executionMode: "SANDBOX_ONLY",
            executionTriggered: false,
            publicSignupAuthorized: false,
            liveProviderExecutionAuthorized:
              false,
            circuitStatus: "CLOSED",
            dailyOperationCountAtAdmission:
              input.expectedDailyOperationCount,
            dailyOperationLimit:
              input.dailyOperationLimit,
            activeOperationCountAtAdmission:
              input.expectedActiveOperationCount,
            concurrentOperationLimit:
              input.concurrentOperationLimit,
            recentFailureCountAtAdmission:
              input.expectedRecentFailureCount,
            failureThreshold:
              input.failureThreshold,
            admittedAt: input.admittedAt,
            createdAt: input.admittedAt,
          },
        };
      },
    },

    requestedTenantId: "tenant-1",
    capability: "SANDBOX_EXECUTION",
    operationKey:
      "pilot-operation-execution-0001",
    idempotencyKey:
      "pilot-admission-0001",
    ...overrides,
  };
}

async function expectDenied(
  input: AdmitAuthenticatedPilotOperationInput,
  expectedCode: string,
): Promise<void> {
  await assert.rejects(
    () =>
      admitAuthenticatedPilotOperation(input),
    (error: unknown) => {
      assert.ok(
        error instanceof
          PilotOperationAdmissionDeniedError,
      );

      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

test("owner operation is admitted within safety budget", async () => {
  let persistenceInput:
    | PilotOperationAdmissionPersistenceInput
    | undefined;

  const result =
    await admitAuthenticatedPilotOperation(
      validInput({
        admissionRepository: {
          async claimOperationAtomically(
            receivedInput,
          ) {
            persistenceInput = receivedInput;

            return {
              outcome: "CLAIMED",
              admission: {
                id: "pilot-admission-1",
                tenantId:
                  receivedInput.tenantId,
                enrollmentId:
                  receivedInput.enrollmentId,
                invitationId:
                  receivedInput.invitationId,
                capability:
                  receivedInput.capability,
                operationKey:
                  receivedInput.operationKey,
                actorUserId:
                  receivedInput.actorUserId,
                sourceSessionId:
                  receivedInput.sourceSessionId,
                actorRole:
                  receivedInput.actorRole,
                idempotencyKey:
                  receivedInput.idempotencyKey,
                status: "ADMITTED",
                executionMode:
                  "SANDBOX_ONLY",
                executionTriggered: false,
                publicSignupAuthorized:
                  false,
                liveProviderExecutionAuthorized:
                  false,
                circuitStatus: "CLOSED",
                dailyOperationCountAtAdmission:
                  receivedInput
                    .expectedDailyOperationCount,
                dailyOperationLimit:
                  receivedInput
                    .dailyOperationLimit,
                activeOperationCountAtAdmission:
                  receivedInput
                    .expectedActiveOperationCount,
                concurrentOperationLimit:
                  receivedInput
                    .concurrentOperationLimit,
                recentFailureCountAtAdmission:
                  receivedInput
                    .expectedRecentFailureCount,
                failureThreshold:
                  receivedInput.failureThreshold,
                admittedAt:
                  receivedInput.admittedAt,
                createdAt:
                  receivedInput.admittedAt,
              },
            };
          },
        },
      }),
    );

  assert.equal(
    persistenceInput?.expectedEnrollmentStatus,
    "ACTIVE",
  );

  assert.equal(
    persistenceInput?.expectedEmergencyStop,
    false,
  );

  assert.equal(
    persistenceInput?.expectedCircuitStatus,
    "CLOSED",
  );

  assert.equal(
    persistenceInput?.executionTriggered,
    false,
  );

  assert.equal(result.outcome, "CLAIMED");

  assert.equal(
    result.admission.capability,
    "SANDBOX_EXECUTION",
  );

  assert.equal(
    result.safetyBudget.dailyOperationsRemaining,
    89,
  );

  assert.equal(
    result.safetyBudget.concurrentSlotsRemaining,
    3,
  );

  assert.equal(
    result.safetyBoundary.executionTriggered,
    false,
  );

  assert.equal(
    result.safetyBoundary.atomicAdmission,
    true,
  );

  assert.equal(Object.isFrozen(result), true);
  assert.equal(
    Object.isFrozen(result.safetyBudget),
    true,
  );
});

test("operator can claim inquiry intake capacity", async () => {
  const result =
    await admitAuthenticatedPilotOperation(
      validInput({
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

          async findMembership(tenantId, userId) {
            return {
              tenantId,
              userId,
              role: "OPERATOR",
              status: "ACTIVE",
            };
          },
        },

        capability: "INQUIRY_INTAKE",
        operationKey:
          "pilot-operation-inquiry-0001",
      }),
    );

  assert.equal(
    result.admission.actorRole,
    "OPERATOR",
  );

  assert.equal(
    result.admission.capability,
    "INQUIRY_INTAKE",
  );
});

test("existing idempotent admission is returned", async () => {
  const result =
    await admitAuthenticatedPilotOperation(
      validInput({
        admissionRepository: {
          async claimOperationAtomically(
            receivedInput,
          ) {
            return {
              outcome: "EXISTING",
              admission: {
                id: "pilot-admission-existing-1",
                tenantId:
                  receivedInput.tenantId,
                enrollmentId:
                  receivedInput.enrollmentId,
                invitationId:
                  receivedInput.invitationId,
                capability:
                  receivedInput.capability,
                operationKey:
                  receivedInput.operationKey,
                actorUserId:
                  receivedInput.actorUserId,
                sourceSessionId:
                  receivedInput.sourceSessionId,
                actorRole:
                  receivedInput.actorRole,
                idempotencyKey:
                  receivedInput.idempotencyKey,
                status: "ADMITTED",
                executionMode:
                  "SANDBOX_ONLY",
                executionTriggered: false,
                publicSignupAuthorized:
                  false,
                liveProviderExecutionAuthorized:
                  false,
                circuitStatus: "CLOSED",
                dailyOperationCountAtAdmission:
                  receivedInput
                    .expectedDailyOperationCount,
                dailyOperationLimit:
                  receivedInput
                    .dailyOperationLimit,
                activeOperationCountAtAdmission:
                  receivedInput
                    .expectedActiveOperationCount,
                concurrentOperationLimit:
                  receivedInput
                    .concurrentOperationLimit,
                recentFailureCountAtAdmission:
                  receivedInput
                    .expectedRecentFailureCount,
                failureThreshold:
                  receivedInput.failureThreshold,
                admittedAt:
                  "2026-07-10T17:21:00.000Z",
                createdAt:
                  "2026-07-10T17:21:00.000Z",
              },
            };
          },
        },
      }),
    );

  assert.equal(result.outcome, "EXISTING");

  assert.equal(
    result.admission.id,
    "pilot-admission-existing-1",
  );
});

test("suspended pilot is blocked before safety read", async () => {
  let safetyReads = 0;
  let admissionWrites = 0;

  const input = validInput({
    pilotAccessRepository: {
      async findEnrollmentByTenantId(tenantId) {
        return {
          id: "pilot-enrollment-1",
          tenantId,
          invitationId: "pilot-invitation-1",
          ownerUserId: "owner-user-1",
          enrollmentStatus: "SUSPENDED",
          accessMode: "CONTROLLED_PILOT",
          executionMode: "SANDBOX_ONLY",
          publicSignupAuthorized: false,
          liveProviderExecutionAuthorized: false,
          enrolledAt:
            "2026-07-10T17:00:00.000Z",
          createdAt:
            "2026-07-10T17:00:01.000Z",
        };
      },
    },

    safetyRepository: {
      async findSafetySnapshot() {
        safetyReads += 1;
        return null;
      },
    },

    admissionRepository: {
      async claimOperationAtomically() {
        admissionWrites += 1;
        throw new Error(
          "Admission write must not run.",
        );
      },
    },
  });

  await assert.rejects(
    () =>
      admitAuthenticatedPilotOperation(input),
    (error: unknown) => {
      assert.ok(
        error instanceof
          ControlledPilotAccessDeniedError,
      );

      assert.equal(
        error.code,
        "PILOT_ENROLLMENT_NOT_ACTIVE",
      );

      return true;
    },
  );

  assert.equal(safetyReads, 0);
  assert.equal(admissionWrites, 0);
});

test("emergency stop blocks operation before atomic claim", async () => {
  let admissionWrites = 0;

  const input = validInput({
    safetyRepository: {
      async findSafetySnapshot(
        tenantId,
        enrollmentId,
      ) {
        return {
          tenantId,
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: true,
          circuitStatus: "CLOSED",
          dailyWindowStartedAt:
            "2026-07-10T00:00:00.000Z",
          dailyOperationCount: 0,
          dailyOperationLimit: 100,
          activeOperationCount: 0,
          concurrentOperationLimit: 5,
          recentFailureCount: 0,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T17:20:00.000Z",
        };
      },
    },

    admissionRepository: {
      async claimOperationAtomically() {
        admissionWrites += 1;
        throw new Error(
          "Admission write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_EMERGENCY_STOP_ACTIVE",
  );

  assert.equal(admissionWrites, 0);
});

test("daily operation budget exhaustion blocks claim", async () => {
  let admissionWrites = 0;

  const input = validInput({
    safetyRepository: {
      async findSafetySnapshot(
        tenantId,
        enrollmentId,
      ) {
        return {
          tenantId,
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: false,
          circuitStatus: "CLOSED",
          dailyWindowStartedAt:
            "2026-07-10T00:00:00.000Z",
          dailyOperationCount: 100,
          dailyOperationLimit: 100,
          activeOperationCount: 0,
          concurrentOperationLimit: 5,
          recentFailureCount: 0,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T17:20:00.000Z",
        };
      },
    },

    admissionRepository: {
      async claimOperationAtomically() {
        admissionWrites += 1;
        throw new Error(
          "Admission write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_DAILY_BUDGET_EXHAUSTED",
  );

  assert.equal(admissionWrites, 0);
});

test("concurrency exhaustion blocks claim", async () => {
  let admissionWrites = 0;

  const input = validInput({
    safetyRepository: {
      async findSafetySnapshot(
        tenantId,
        enrollmentId,
      ) {
        return {
          tenantId,
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: false,
          circuitStatus: "CLOSED",
          dailyWindowStartedAt:
            "2026-07-10T00:00:00.000Z",
          dailyOperationCount: 1,
          dailyOperationLimit: 100,
          activeOperationCount: 5,
          concurrentOperationLimit: 5,
          recentFailureCount: 0,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T17:20:00.000Z",
        };
      },
    },

    admissionRepository: {
      async claimOperationAtomically() {
        admissionWrites += 1;
        throw new Error(
          "Admission write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_CONCURRENCY_BUDGET_EXHAUSTED",
  );

  assert.equal(admissionWrites, 0);
});

test("open failure circuit blocks claim", async () => {
  let admissionWrites = 0;

  const input = validInput({
    safetyRepository: {
      async findSafetySnapshot(
        tenantId,
        enrollmentId,
      ) {
        return {
          tenantId,
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: false,
          circuitStatus: "OPEN",
          dailyWindowStartedAt:
            "2026-07-10T00:00:00.000Z",
          dailyOperationCount: 1,
          dailyOperationLimit: 100,
          activeOperationCount: 0,
          concurrentOperationLimit: 5,
          recentFailureCount: 3,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T17:20:00.000Z",
        };
      },
    },

    admissionRepository: {
      async claimOperationAtomically() {
        admissionWrites += 1;
        throw new Error(
          "Admission write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_FAILURE_CIRCUIT_OPEN",
  );

  assert.equal(admissionWrites, 0);
});

test("cross-tenant safety state is blocked", async () => {
  let admissionWrites = 0;

  const input = validInput({
    safetyRepository: {
      async findSafetySnapshot(
        _tenantId,
        enrollmentId,
      ) {
        return {
          tenantId: "tenant-attacker",
          enrollmentId,
          enrollmentStatus: "ACTIVE",
          emergencyStop: false,
          circuitStatus: "CLOSED",
          dailyWindowStartedAt:
            "2026-07-10T00:00:00.000Z",
          dailyOperationCount: 0,
          dailyOperationLimit: 100,
          activeOperationCount: 0,
          concurrentOperationLimit: 5,
          recentFailureCount: 0,
          failureThreshold: 3,
          updatedAt:
            "2026-07-10T17:20:00.000Z",
        };
      },
    },

    admissionRepository: {
      async claimOperationAtomically() {
        admissionWrites += 1;
        throw new Error(
          "Admission write must not run.",
        );
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_SAFETY_TENANT_MISMATCH",
  );

  assert.equal(admissionWrites, 0);
});

test("persisted admission identity mismatch fails closed", async () => {
  const input = validInput({
    admissionRepository: {
      async claimOperationAtomically(
        receivedInput,
      ) {
        return {
          outcome: "CLAIMED",
          admission: {
            id: "pilot-admission-attacker",
            tenantId: "tenant-attacker",
            enrollmentId:
              receivedInput.enrollmentId,
            invitationId:
              receivedInput.invitationId,
            capability:
              receivedInput.capability,
            operationKey:
              receivedInput.operationKey,
            actorUserId:
              receivedInput.actorUserId,
            sourceSessionId:
              receivedInput.sourceSessionId,
            actorRole:
              receivedInput.actorRole,
            idempotencyKey:
              receivedInput.idempotencyKey,
            status: "ADMITTED",
            executionMode: "SANDBOX_ONLY",
            executionTriggered: false,
            publicSignupAuthorized: false,
            liveProviderExecutionAuthorized:
              false,
            circuitStatus: "CLOSED",
            dailyOperationCountAtAdmission:
              receivedInput
                .expectedDailyOperationCount,
            dailyOperationLimit:
              receivedInput.dailyOperationLimit,
            activeOperationCountAtAdmission:
              receivedInput
                .expectedActiveOperationCount,
            concurrentOperationLimit:
              receivedInput
                .concurrentOperationLimit,
            recentFailureCountAtAdmission:
              receivedInput
                .expectedRecentFailureCount,
            failureThreshold:
              receivedInput.failureThreshold,
            admittedAt: receivedInput.admittedAt,
            createdAt: receivedInput.admittedAt,
          },
        };
      },
    },
  });

  await expectDenied(
    input,
    "PILOT_OPERATION_ADMISSION_IDENTITY_MISMATCH",
  );
});

test("operation admission never executes work or authorizes live activity", async () => {
  const result =
    await admitAuthenticatedPilotOperation(
      validInput(),
    );

  assert.equal(
    result.safetyBoundary.accessGateVerified,
    true,
  );

  assert.equal(
    result.safetyBoundary.pilotActive,
    true,
  );

  assert.equal(
    result.safetyBoundary.executionTriggered,
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
