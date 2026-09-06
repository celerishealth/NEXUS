'use strict';

const {
  SCHEDULER_SCHEMA,
  CATALOG_SCHEMA,
  SCHEDULER_STATUS,
  HOST_APPROVED_MISSION_CATALOG,
  AUTHORITY_BOUNDARY,
  getHostApprovedMissionCatalog,
  getHostApprovedDiscoveryPatterns,
  scheduleMissionForDiscovery,
} = require('./nexus-host-approved-mission-compatibility-scheduler-v1.cjs');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION_FAILED:${message}`);
  }
}

function expectFailClosed(fn, expectedReason) {
  let passed = false;

  try {
    fn();
  } catch (error) {
    passed = String(error && error.message).includes(
      `HOST_APPROVED_MISSION_SCHEDULER_FAIL_CLOSED:${expectedReason}`
    );
  }

  assert(
    passed,
    `EXPECTED_FAIL_CLOSED:${expectedReason}`
  );
}

assert(
  SCHEDULER_SCHEMA ===
    'NEXUS_HOST_APPROVED_MISSION_COMPATIBILITY_SCHEDULER_V1',
  'SCHEDULER_SCHEMA_MISMATCH'
);

assert(
  CATALOG_SCHEMA ===
    'NEXUS_HOST_APPROVED_MISSION_CATALOG_V1',
  'CATALOG_SCHEMA_MISMATCH'
);

const catalog = getHostApprovedMissionCatalog();

assert(
  catalog === HOST_APPROVED_MISSION_CATALOG,
  'CATALOG_EXPORT_IDENTITY_MISMATCH'
);

assert(
  catalog.length === 1,
  `EXPECTED_ONE_HOST_APPROVED_MISSION_GOT_${catalog.length}`
);

const mission = catalog[0];

assert(
  mission.missionId ===
    'semantic-nullish-fallback-preserve-explicit-falsy-v1',
  'MISSION_ID_MISMATCH'
);

assert(
  mission.objective ===
    'Preserve explicit falsy supplied values by using nullish fallback where semantically appropriate.',
  'MISSION_OBJECTIVE_MISMATCH'
);

assert(
  mission.hostApproved === true &&
    mission.hostBounded === true,
  'MISSION_NOT_HOST_BOUNDED'
);

assert(
  mission.freeFormModelGenerated === false &&
    mission.objectiveAutonomouslyInvented === false &&
    mission.freeFormObjectiveGeneration === false,
  'FREE_FORM_MISSION_AUTHORITY_PRESENT'
);

const approvedPatterns =
  getHostApprovedDiscoveryPatterns();

assert(
  approvedPatterns.length === 1 &&
    approvedPatterns[0] === '||',
  'HOST_APPROVED_DISCOVERY_PATTERN_MISMATCH'
);

const forbiddenAuthorityKeys = [
  'freeFormAutonomousMissionInventionAuthorized',
  'objectiveAutonomouslyInvented',
  'freeFormObjectiveGeneration',
  'scopeWideningAuthorized',
  'reasoningExecutionAuthority',
  'modelExecutionAuthority',
  'queueMutationAuthority',
  'workerExecutionAuthority',
  'writeScopeExpanded',
  'appWriteAuthority',
  'componentsWriteAuthority',
  'libWriteAuthority',
  'toolsWriteAuthority',
  'patchApplicationAuthority',
  'gitMutationAuthority',
  'databaseAuthority',
  'productionAuthority',
  'networkAuthority',
];

for (const key of forbiddenAuthorityKeys) {
  assert(
    AUTHORITY_BOUNDARY[key] === false,
    `FORBIDDEN_AUTHORITY_OPEN:${key}`
  );
}

const compatibleDiscovery = Object.freeze({
  version: 2,
  discoveryOnly: true,
  discoveryResultAuthority: 'NONE',
  candidateCount: 2,
  candidates: Object.freeze([
    Object.freeze({
      candidateSourceInputVersion: 2,
      relativePath: 'app/example.ts',
      extension: '.ts',
      matchedPatterns: Object.freeze([
        '||',
      ]),
      trackedOnly: true,
      unchangedFromRuntimeBaseHeadOnly: true,
      regularFileOnly: true,
      discoveryResultAuthority: 'NONE',
    }),

    Object.freeze({
      candidateSourceInputVersion: 2,
      relativePath: 'components/other.jsx',
      extension: '.jsx',
      matchedPatterns: Object.freeze([
        'export ',
      ]),
      trackedOnly: true,
      unchangedFromRuntimeBaseHeadOnly: true,
      regularFileOnly: true,
      discoveryResultAuthority: 'NONE',
    }),
  ]),
});

const ready = scheduleMissionForDiscovery({
  discoveryResult: compatibleDiscovery,
});

assert(
  ready.status === SCHEDULER_STATUS.READY,
  'COMPATIBLE_DISCOVERY_NOT_MISSION_READY'
);

assert(
  ready.reason ===
    'HOST_APPROVED_COMPATIBLE_MISSION_AVAILABLE',
  'MISSION_READY_REASON_MISMATCH'
);

assert(
  ready.mission.missionId ===
    'semantic-nullish-fallback-preserve-explicit-falsy-v1',
  'SELECTED_MISSION_ID_MISMATCH'
);

assert(
  ready.compatibleCandidateCount === 1,
  `EXPECTED_ONE_COMPATIBLE_CANDIDATE_GOT_${ready.compatibleCandidateCount}`
);

assert(
  ready.compatibleCandidates[0].relativePath ===
    'app/example.ts',
  'WRONG_COMPATIBLE_CANDIDATE_SELECTED'
);

assert(
  ready.missionAutonomouslyInvented === false &&
    ready.objectiveAutonomouslyInvented === false &&
    ready.freeFormModelGenerated === false &&
    ready.scopeWidened === false,
  'READY_PATH_INVENTED_OR_WIDENED_SCOPE'
);

assert(
  ready.discoveryResultAuthority === 'NONE',
  'READY_PATH_DISCOVERY_AUTHORITY_NOT_NONE'
);

const incompatibleDiscovery = Object.freeze({
  version: 2,
  discoveryOnly: true,
  discoveryResultAuthority: 'NONE',
  candidateCount: 1,
  candidates: Object.freeze([
    Object.freeze({
      candidateSourceInputVersion: 2,
      relativePath: 'lib/example.mjs',
      extension: '.mjs',
      matchedPatterns: Object.freeze([
        'import ',
      ]),
      trackedOnly: true,
      unchangedFromRuntimeBaseHeadOnly: true,
      regularFileOnly: true,
      discoveryResultAuthority: 'NONE',
    }),
  ]),
});

const noWork = scheduleMissionForDiscovery({
  discoveryResult: incompatibleDiscovery,
});

assert(
  noWork.status === SCHEDULER_STATUS.NO_WORK,
  'INCOMPATIBLE_DISCOVERY_NOT_NO_WORK'
);

assert(
  noWork.reason ===
    'NO_HOST_APPROVED_MISSION_COMPATIBLE_WITH_AVAILABLE_DISCOVERY_SURFACE',
  'NO_WORK_REASON_MISMATCH'
);

assert(
  noWork.mission === null &&
    noWork.compatibleCandidateCount === 0 &&
    noWork.compatibleCandidates.length === 0,
  'NO_WORK_CONTAINS_MISSION_OR_CANDIDATES'
);

assert(
  noWork.noWorkIsError === false,
  'NO_WORK_MARKED_AS_ERROR'
);

assert(
  noWork.missionAutonomouslyInvented === false &&
    noWork.objectiveAutonomouslyInvented === false &&
    noWork.freeFormModelGenerated === false &&
    noWork.scopeWidened === false,
  'NO_WORK_PATH_INVENTED_OR_WIDENED_SCOPE'
);

const emptyDiscovery = Object.freeze({
  version: 2,
  discoveryOnly: true,
  discoveryResultAuthority: 'NONE',
  candidateCount: 0,
  candidates: Object.freeze([]),
});

const emptyNoWork = scheduleMissionForDiscovery({
  discoveryResult: emptyDiscovery,
});

assert(
  emptyNoWork.status === 'NO_WORK' &&
    emptyNoWork.noWorkIsError === false,
  'EMPTY_DISCOVERY_NOT_CLEAN_NO_WORK'
);

expectFailClosed(
  () =>
    scheduleMissionForDiscovery({}),
  'EXACT_INPUT_KEYS_REQUIRED'
);

expectFailClosed(
  () =>
    scheduleMissionForDiscovery({
      discoveryResult: compatibleDiscovery,
      extra: true,
    }),
  'EXACT_INPUT_KEYS_REQUIRED'
);

expectFailClosed(
  () =>
    scheduleMissionForDiscovery({
      discoveryResult: {
        version: 2,
        discoveryOnly: true,
        discoveryResultAuthority: 'WRITE',
        candidateCount: 0,
        candidates: [],
      },
    }),
  'DISCOVERY_RESULT_AUTHORITY_NOT_NONE'
);

expectFailClosed(
  () =>
    scheduleMissionForDiscovery({
      discoveryResult: {
        version: 1,
        discoveryOnly: true,
        discoveryResultAuthority: 'NONE',
        candidateCount: 0,
        candidates: [],
      },
    }),
  'DISCOVERY_RESULT_VERSION_NOT_2'
);

for (const key of forbiddenAuthorityKeys) {
  assert(
    ready.authorityBoundary[key] === false,
    `READY_FORBIDDEN_AUTHORITY_OPEN:${key}`
  );

  assert(
    noWork.authorityBoundary[key] === false,
    `NO_WORK_FORBIDDEN_AUTHORITY_OPEN:${key}`
  );
}

console.log('HOST_APPROVED_CATALOG=PASS');
console.log('MISSION_ID_LOCK=PASS');
console.log('MISSION_OBJECTIVE_LOCK=PASS');
console.log('HOST_APPROVED_DISCOVERY_PATTERN=PASS');
console.log('MISSION_READY_COMPATIBLE_PATH=PASS');
console.log('COMPATIBLE_CANDIDATE_FILTER=PASS');
console.log('NO_WORK_INCOMPATIBLE_PATH=PASS');
console.log('NO_WORK_EMPTY_DISCOVERY_PATH=PASS');
console.log('NO_WORK_IS_ERROR_FALSE=PASS');
console.log('FREE_FORM_MISSION_INVENTION_BLOCKED=PASS');
console.log('SCOPE_WIDENING_BLOCKED=PASS');
console.log('ALL_EXECUTION_AND_WRITE_AUTHORITIES_ZERO=PASS');
console.log('FAIL_CLOSED_NEGATIVE_CASES=PASS');
console.log('FAST_SAFE_288B_MISSION_SCHEDULER_SYNTHETIC_SELF_TEST=PASS');