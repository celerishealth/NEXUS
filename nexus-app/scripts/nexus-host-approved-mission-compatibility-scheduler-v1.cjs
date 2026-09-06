'use strict';

const SCHEDULER_SCHEMA =
  'NEXUS_HOST_APPROVED_MISSION_COMPATIBILITY_SCHEDULER_V1';

const CATALOG_SCHEMA =
  'NEXUS_HOST_APPROVED_MISSION_CATALOG_V1';

const SCHEDULER_STATUS = Object.freeze({
  READY: 'MISSION_READY',
  NO_WORK: 'NO_WORK',
});

const HOST_APPROVED_MISSION_CATALOG = Object.freeze([
  Object.freeze({
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

    discoveryPatterns:
      Object.freeze([
        '||',
      ]),

    supportedExtensions:
      Object.freeze([
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.mjs',
        '.cjs',
      ]),
  }),
]);

const AUTHORITY_BOUNDARY = Object.freeze({
  missionCatalogAuthority:
    'HOST_APPROVED_ONLY',

  freeFormAutonomousMissionInventionAuthorized:
    false,

  objectiveAutonomouslyInvented:
    false,

  freeFormObjectiveGeneration:
    false,

  scopeWideningAuthorized:
    false,

  reasoningExecutionAuthority:
    false,

  modelExecutionAuthority:
    false,

  queueMutationAuthority:
    false,

  workerExecutionAuthority:
    false,

  writeScopeExpanded:
    false,

  appWriteAuthority:
    false,

  componentsWriteAuthority:
    false,

  libWriteAuthority:
    false,

  toolsWriteAuthority:
    false,

  patchApplicationAuthority:
    false,

  gitMutationAuthority:
    false,

  databaseAuthority:
    false,

  productionAuthority:
    false,

  networkAuthority:
    false,
});

function failClosed(message) {
  throw new Error(
    `HOST_APPROVED_MISSION_SCHEDULER_FAIL_CLOSED:${message}`
  );
}

function getHostApprovedMissionCatalog() {
  return HOST_APPROVED_MISSION_CATALOG;
}

function getHostApprovedDiscoveryPatterns() {
  const patterns = [];

  for(const mission of HOST_APPROVED_MISSION_CATALOG){
    for(const pattern of mission.discoveryPatterns){
      if(!patterns.includes(pattern)){
        patterns.push(pattern);
      }
    }
  }

  return Object.freeze(patterns);
}

function validateDiscoveryResult(discoveryResult) {
  if(
    !discoveryResult ||
    typeof discoveryResult !== 'object' ||
    Array.isArray(discoveryResult)
  ){
    failClosed('DISCOVERY_RESULT_REQUIRED');
  }

  if(discoveryResult.version !== 2){
    failClosed('DISCOVERY_RESULT_VERSION_NOT_2');
  }

  if(discoveryResult.discoveryOnly !== true){
    failClosed('DISCOVERY_ONLY_CONTRACT_MISSING');
  }

  if(discoveryResult.discoveryResultAuthority !== 'NONE'){
    failClosed('DISCOVERY_RESULT_AUTHORITY_NOT_NONE');
  }

  if(!Array.isArray(discoveryResult.candidates)){
    failClosed('DISCOVERY_CANDIDATES_ARRAY_REQUIRED');
  }

  if(
    discoveryResult.candidateCount !==
    discoveryResult.candidates.length
  ){
    failClosed('DISCOVERY_CANDIDATE_COUNT_MISMATCH');
  }
}

function candidateCompatibleWithMission(
  candidate,
  mission
) {
  if(
    !candidate ||
    typeof candidate !== 'object' ||
    Array.isArray(candidate)
  ){
    return false;
  }

  if(candidate.candidateSourceInputVersion !== 2){
    return false;
  }

  if(candidate.discoveryResultAuthority !== 'NONE'){
    return false;
  }

  if(candidate.trackedOnly !== true){
    return false;
  }

  if(
    candidate.unchangedFromRuntimeBaseHeadOnly !== true
  ){
    return false;
  }

  if(candidate.regularFileOnly !== true){
    return false;
  }

  if(
    !mission.supportedExtensions.includes(
      candidate.extension
    )
  ){
    return false;
  }

  if(
    !Array.isArray(candidate.matchedPatterns) ||
    candidate.matchedPatterns.length === 0
  ){
    return false;
  }

  return mission.discoveryPatterns.some(
    (pattern) =>
      candidate.matchedPatterns.includes(pattern)
  );
}

function scheduleMissionForDiscovery(input) {
  if(
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input)
  ){
    failClosed('INPUT_OBJECT_REQUIRED');
  }

  const keys = Object.keys(input);

  if(
    keys.length !== 1 ||
    keys[0] !== 'discoveryResult'
  ){
    failClosed('EXACT_INPUT_KEYS_REQUIRED');
  }

  validateDiscoveryResult(
    input.discoveryResult
  );

  for(const mission of HOST_APPROVED_MISSION_CATALOG){
    const compatibleCandidates =
      input.discoveryResult.candidates.filter(
        (candidate) =>
          candidateCompatibleWithMission(
            candidate,
            mission
          )
      );

    if(compatibleCandidates.length > 0){
      return Object.freeze({
        schema:
          SCHEDULER_SCHEMA,

        catalogSchema:
          CATALOG_SCHEMA,

        status:
          SCHEDULER_STATUS.READY,

        reason:
          'HOST_APPROVED_COMPATIBLE_MISSION_AVAILABLE',

        mission:
          mission,

        compatibleCandidateCount:
          compatibleCandidates.length,

        compatibleCandidates:
          Object.freeze([
            ...compatibleCandidates,
          ]),

        missionAutonomouslyInvented:
          false,

        objectiveAutonomouslyInvented:
          false,

        freeFormModelGenerated:
          false,

        scopeWidened:
          false,

        discoveryResultAuthority:
          'NONE',

        authorityBoundary:
          AUTHORITY_BOUNDARY,
      });
    }
  }

  return Object.freeze({
    schema:
      SCHEDULER_SCHEMA,

    catalogSchema:
      CATALOG_SCHEMA,

    status:
      SCHEDULER_STATUS.NO_WORK,

    reason:
      'NO_HOST_APPROVED_MISSION_COMPATIBLE_WITH_AVAILABLE_DISCOVERY_SURFACE',

    mission:
      null,

    compatibleCandidateCount:
      0,

    compatibleCandidates:
      Object.freeze([]),

    noWorkIsError:
      false,

    missionAutonomouslyInvented:
      false,

    objectiveAutonomouslyInvented:
      false,

    freeFormModelGenerated:
      false,

    scopeWidened:
      false,

    discoveryResultAuthority:
      'NONE',

    authorityBoundary:
      AUTHORITY_BOUNDARY,
  });
}

module.exports = Object.freeze({
  SCHEDULER_SCHEMA,
  CATALOG_SCHEMA,
  SCHEDULER_STATUS,

  HOST_APPROVED_MISSION_CATALOG,
  AUTHORITY_BOUNDARY,

  getHostApprovedMissionCatalog,
  getHostApprovedDiscoveryPatterns,
  scheduleMissionForDiscovery,
});