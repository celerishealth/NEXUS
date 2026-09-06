'use strict';

const path = require('node:path');

const {
  BRIDGE_SCHEMA,
  APPROVED_MISSION_ID,
  STATUS,
  AUTHORITY_BOUNDARY,
  prepareHostApprovedMissionObjective,
} = require('./nexus-host-approved-mission-objective-bridge-v1.cjs');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION_FAILED:${message}`);
  }
}

function expectFailClosed(fn, reason) {
  let passed = false;

  try {
    fn();
  } catch (error) {
    passed = String(error && error.message).includes(
      `MISSION_OBJECTIVE_BRIDGE_FAIL_CLOSED:${reason}`
    );
  }

  assert(
    passed,
    `EXPECTED_FAIL_CLOSED:${reason}`
  );
}

const repoRoot = path.resolve(__dirname, '..');

const forbiddenAuthorityKeys = [
  'ownerDecisionGenerated',
  'ownerAuthorityGenerated',
  'activationTokenGenerated',
  'executionAuthorizationGenerated',
  'executionAuthorityGenerated',
  'reasoningExecutionAuthority',
  'modelExecutionAuthority',
  'queueMutationAuthority',
  'workerExecutionAuthority',
  'primaryRepoMutationAuthorized',
  'newFileAuthority',
  'patchApplicationAuthority',
  'patchPromotionAuthorized',
  'gitAuthority',
  'databaseAuthority',
  'productionAuthority',
  'networkAuthority',
  'freeFormMissionInventionAuthorized',
  'freeFormObjectiveGenerationAuthorized',
  'scopeWideningAuthorized',
  'materializerAuthority',
  'canonicalDelegationAuthority',
];

for (const key of forbiddenAuthorityKeys) {
  assert(
    AUTHORITY_BOUNDARY[key] === false,
    `FORBIDDEN_AUTHORITY_OPEN:${key}`
  );
}

const approvedMission = Object.freeze({
  missionId:
    'semantic-nullish-fallback-preserve-explicit-falsy-v1',

  objective:
    'Preserve explicit falsy supplied values by using nullish fallback where semantically appropriate.',

  hostApproved: true,
  hostBounded: true,

  freeFormModelGenerated: false,
  objectiveAutonomouslyInvented: false,
  freeFormObjectiveGeneration: false,

  semanticLane:
    'fallback-policy-v1',
});

const readySchedulerResult = Object.freeze({
  status: 'MISSION_READY',

  discoveryResultAuthority: 'NONE',

  missionAutonomouslyInvented: false,
  objectiveAutonomouslyInvented: false,
  freeFormModelGenerated: false,
  scopeWidened: false,

  mission:
    approvedMission,
});

const noWorkSchedulerResult = Object.freeze({
  status: 'NO_WORK',

  discoveryResultAuthority: 'NONE',

  missionAutonomouslyInvented: false,
  objectiveAutonomouslyInvented: false,
  freeFormModelGenerated: false,
  scopeWidened: false,

  mission: null,
});

const noWork =
  prepareHostApprovedMissionObjective({
    repoRoot,
    schedulerResult:
      noWorkSchedulerResult,
    workerResult:
      Object.freeze({
        status: 'IDLE',
      }),
  });

assert(
  noWork.schema === BRIDGE_SCHEMA,
  'NO_WORK_SCHEMA_MISMATCH'
);

assert(
  noWork.status === STATUS.NO_WORK,
  'NO_WORK_STATUS_MISMATCH'
);

assert(
  noWork.ready === false &&
  noWork.mission === null &&
  noWork.objective === null,
  'NO_WORK_CONTENT_INVALID'
);

assert(
  noWork.objectiveSourceInvoked === false,
  'NO_WORK_INVOKED_OBJECTIVE_SOURCE'
);

assert(
  noWork.materializerStatus === 'HOLD',
  'NO_WORK_MATERIALIZER_NOT_HELD'
);

assert(
  noWork.canonicalDelegationStatus === 'BLOCKED',
  'NO_WORK_CANONICAL_DELEGATION_NOT_BLOCKED'
);

const nonIdle =
  prepareHostApprovedMissionObjective({
    repoRoot,
    schedulerResult:
      readySchedulerResult,
    workerResult:
      Object.freeze({
        status: 'BUSY',
      }),
  });

assert(
  nonIdle.status === STATUS.SKIPPED_NON_IDLE,
  'NON_IDLE_STATUS_MISMATCH'
);

assert(
  nonIdle.ready === false &&
  nonIdle.objective === null,
  'NON_IDLE_OBJECTIVE_PRESENT'
);

assert(
  nonIdle.workerStatus === 'BUSY',
  'NON_IDLE_WORKER_STATUS_MISMATCH'
);

assert(
  nonIdle.objectiveSourceInvoked === true,
  'NON_IDLE_SOURCE_NOT_INVOKED'
);

assert(
  nonIdle.objectiveSourceStatus === 'SKIPPED_NON_IDLE',
  'NON_IDLE_SOURCE_STATUS_MISMATCH'
);

assert(
  nonIdle.materializerStatus === 'HOLD',
  'NON_IDLE_MATERIALIZER_NOT_HELD'
);

assert(
  nonIdle.canonicalDelegationStatus === 'BLOCKED',
  'NON_IDLE_CANONICAL_DELEGATION_NOT_BLOCKED'
);

const idle =
  prepareHostApprovedMissionObjective({
    repoRoot,
    schedulerResult:
      readySchedulerResult,
    workerResult:
      Object.freeze({
        status: 'IDLE',
      }),
  });

assert(
  idle.status === STATUS.OBJECTIVE_READY,
  'IDLE_OBJECTIVE_NOT_READY'
);

assert(
  idle.ready === true,
  'IDLE_READY_FALSE'
);

assert(
  idle.workerStatus === 'IDLE',
  'IDLE_WORKER_STATUS_MISMATCH'
);

assert(
  idle.objectiveSourceInvoked === true,
  'IDLE_SOURCE_NOT_INVOKED'
);

assert(
  idle.objectiveSourceStatus === 'OBJECTIVE_READY',
  'IDLE_SOURCE_STATUS_MISMATCH'
);

assert(
  idle.mission.missionId === APPROVED_MISSION_ID,
  'IDLE_MISSION_ID_MISMATCH'
);

assert(
  idle.objective.missionId === APPROVED_MISSION_ID,
  'IDLE_OBJECTIVE_MISSION_ID_MISMATCH'
);

assert(
  idle.objective.hostBounded === true,
  'IDLE_OBJECTIVE_NOT_HOST_BOUNDED'
);

assert(
  idle.objective.freeFormModelGenerated === false,
  'IDLE_OBJECTIVE_FREE_FORM_MODEL_GENERATED'
);

assert(
  idle.objectiveAutonomouslyInvented === false &&
  idle.freeFormObjectiveGeneration === false,
  'IDLE_OBJECTIVE_INVENTION_AUTHORITY_PRESENT'
);

assert(
  idle.materializerStatus === 'HOLD',
  'IDLE_MATERIALIZER_NOT_HELD'
);

assert(
  idle.canonicalDelegationStatus === 'BLOCKED',
  'IDLE_CANONICAL_DELEGATION_NOT_BLOCKED'
);

for (const result of [noWork, nonIdle, idle]) {
  for (const key of forbiddenAuthorityKeys) {
    assert(
      result.authorityBoundary[key] === false,
      `OUTPUT_FORBIDDEN_AUTHORITY_OPEN:${result.status}:${key}`
    );
  }
}

expectFailClosed(
  () =>
    prepareHostApprovedMissionObjective({
      repoRoot,
      schedulerResult:
        readySchedulerResult,
    }),
  'EXACT_INPUT_KEYS_REQUIRED'
);

expectFailClosed(
  () =>
    prepareHostApprovedMissionObjective({
      repoRoot,
      schedulerResult:
        Object.freeze({
          ...readySchedulerResult,
          discoveryResultAuthority: 'WRITE',
        }),
      workerResult:
        Object.freeze({
          status: 'IDLE',
        }),
    }),
  'DISCOVERY_RESULT_AUTHORITY_NOT_NONE'
);

expectFailClosed(
  () =>
    prepareHostApprovedMissionObjective({
      repoRoot,
      schedulerResult:
        Object.freeze({
          ...readySchedulerResult,
          mission:
            Object.freeze({
              ...approvedMission,
              missionId: 'invented-mission',
            }),
        }),
      workerResult:
        Object.freeze({
          status: 'IDLE',
        }),
    }),
  'UNAPPROVED_MISSION_ID:invented-mission'
);

console.log('NO_WORK_PATH=PASS');
console.log('NO_WORK_OBJECTIVE_SOURCE_NOT_INVOKED=PASS');
console.log('NON_IDLE_SKIPPED_PATH=PASS');
console.log('IDLE_OBJECTIVE_READY_PATH=PASS');
console.log('APPROVED_MISSION_ID_LOCK=PASS');
console.log('HOST_BOUNDED_OBJECTIVE=PASS');
console.log('FREE_FORM_MISSION_INVENTION_BLOCKED=PASS');
console.log('FREE_FORM_OBJECTIVE_GENERATION_BLOCKED=PASS');
console.log('MATERIALIZER_HOLD=PASS');
console.log('CANONICAL_DELEGATION_BLOCK=PASS');
console.log('ALL_EXECUTION_AND_WRITE_AUTHORITIES_ZERO=PASS');
console.log('FAIL_CLOSED_NEGATIVE_CASES=PASS');
console.log('FAST_SAFE_289D_OBJECTIVE_BRIDGE_SYNTHETIC_SELF_TEST=PASS');