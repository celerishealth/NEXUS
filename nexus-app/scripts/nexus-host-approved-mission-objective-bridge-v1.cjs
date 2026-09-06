'use strict';

const path = require('node:path');

const BRIDGE_SCHEMA =
  'NEXUS_HOST_APPROVED_MISSION_OBJECTIVE_BRIDGE_V1';

const APPROVED_MISSION_ID =
  'semantic-nullish-fallback-preserve-explicit-falsy-v1';

const OBJECTIVE_SOURCE_RELATIVE_PATH =
  'tools/nexus-autonomy-v1/owner-controlled-ai-workforce-autonomous-mission-objective-source.candidate.cjs';

const STATUS = Object.freeze({
  OBJECTIVE_READY: 'OBJECTIVE_READY',
  NO_WORK: 'NO_WORK',
  SKIPPED_NON_IDLE: 'SKIPPED_NON_IDLE',
});

const AUTHORITY_BOUNDARY = Object.freeze({
  ownerDecisionGenerated: false,
  ownerAuthorityGenerated: false,
  activationTokenGenerated: false,

  executionAuthorizationGenerated: false,
  executionAuthorityGenerated: false,

  reasoningExecutionAuthority: false,
  modelExecutionAuthority: false,

  queueMutationAuthority: false,
  workerExecutionAuthority: false,

  primaryRepoMutationAuthorized: false,
  newFileAuthority: false,

  patchApplicationAuthority: false,
  patchPromotionAuthorized: false,

  gitAuthority: false,
  databaseAuthority: false,
  productionAuthority: false,
  networkAuthority: false,

  freeFormMissionInventionAuthorized: false,
  freeFormObjectiveGenerationAuthorized: false,
  scopeWideningAuthorized: false,

  materializerAuthority: false,
  canonicalDelegationAuthority: false,
});

function failClosed(message) {
  throw new Error(
    `MISSION_OBJECTIVE_BRIDGE_FAIL_CLOSED:${message}`
  );
}

function exactKeys(value, expected) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();

  return (
    actual.length === wanted.length &&
    actual.every(
      (key, index) => key === wanted[index]
    )
  );
}

function validateSchedulerResult(result) {
  if(
    !result ||
    typeof result !== 'object' ||
    Array.isArray(result)
  ){
    failClosed('SCHEDULER_RESULT_REQUIRED');
  }

  if(result.discoveryResultAuthority !== 'NONE'){
    failClosed('DISCOVERY_RESULT_AUTHORITY_NOT_NONE');
  }

  if(result.missionAutonomouslyInvented !== false){
    failClosed('MISSION_INVENTION_CONTRACT_VIOLATION');
  }

  if(result.objectiveAutonomouslyInvented !== false){
    failClosed('OBJECTIVE_INVENTION_CONTRACT_VIOLATION');
  }

  if(result.freeFormModelGenerated !== false){
    failClosed('FREE_FORM_MODEL_GENERATION_CONTRACT_VIOLATION');
  }

  if(result.scopeWidened !== false){
    failClosed('SCOPE_WIDENING_CONTRACT_VIOLATION');
  }

  if(
    result.status !== 'MISSION_READY' &&
    result.status !== 'NO_WORK'
  ){
    failClosed(
      `UNSUPPORTED_SCHEDULER_STATUS:${String(result.status)}`
    );
  }
}

function prepareHostApprovedMissionObjective(input) {
  if(
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input)
  ){
    failClosed('INPUT_OBJECT_REQUIRED');
  }

  if(
    !exactKeys(
      input,
      [
        'repoRoot',
        'schedulerResult',
        'workerResult',
      ]
    )
  ){
    failClosed('EXACT_INPUT_KEYS_REQUIRED');
  }

  if(
    typeof input.repoRoot !== 'string' ||
    input.repoRoot.trim().length === 0
  ){
    failClosed('REPO_ROOT_REQUIRED');
  }

  if(
    !input.workerResult ||
    typeof input.workerResult !== 'object' ||
    Array.isArray(input.workerResult) ||
    typeof input.workerResult.status !== 'string' ||
    input.workerResult.status.length < 1
  ){
    failClosed('WORKER_RESULT_INVALID');
  }

  validateSchedulerResult(
    input.schedulerResult
  );

  if(input.schedulerResult.status === 'NO_WORK'){
    if(input.schedulerResult.mission !== null){
      failClosed('NO_WORK_WITH_NON_NULL_MISSION');
    }

    return Object.freeze({
      schema: BRIDGE_SCHEMA,

      status: STATUS.NO_WORK,

      reason:
        'MISSION_SCHEDULER_RETURNED_NO_WORK',

      ready: false,
      mission: null,
      objective: null,

      workerStatus:
        input.workerResult.status,

      objectiveSourceInvoked:
        false,

      materializerStatus:
        'HOLD',

      canonicalDelegationStatus:
        'BLOCKED',

      authorityBoundary:
        AUTHORITY_BOUNDARY,
    });
  }

  const mission =
    input.schedulerResult.mission;

  if(
    !mission ||
    typeof mission !== 'object' ||
    Array.isArray(mission)
  ){
    failClosed('MISSION_READY_WITHOUT_MISSION');
  }

  if(mission.missionId !== APPROVED_MISSION_ID){
    failClosed(
      `UNAPPROVED_MISSION_ID:${String(mission.missionId)}`
    );
  }

  if(mission.hostApproved !== true){
    failClosed('MISSION_NOT_HOST_APPROVED');
  }

  if(mission.hostBounded !== true){
    failClosed('MISSION_NOT_HOST_BOUNDED');
  }

  if(mission.freeFormModelGenerated !== false){
    failClosed('MISSION_FREE_FORM_MODEL_GENERATED');
  }

  const objectiveSourcePath =
    path.join(
      input.repoRoot,
      ...OBJECTIVE_SOURCE_RELATIVE_PATH.split('/')
    );

  const objectiveSource =
    require(objectiveSourcePath);

  if(
    objectiveSource.MISSION_ID !==
    APPROVED_MISSION_ID
  ){
    failClosed('OBJECTIVE_SOURCE_MISSION_ID_MISMATCH');
  }

  if(
    !Array.isArray(objectiveSource.INPUT_KEYS) ||
    objectiveSource.INPUT_KEYS.length !== 1 ||
    objectiveSource.INPUT_KEYS[0] !== 'workerResult'
  ){
    failClosed('OBJECTIVE_SOURCE_INPUT_CONTRACT_MISMATCH');
  }

  if(
    typeof objectiveSource.getAutonomousMissionObjective !==
    'function'
  ){
    failClosed('OBJECTIVE_SOURCE_FUNCTION_MISSING');
  }

  const objectiveResult =
    objectiveSource.getAutonomousMissionObjective({
      workerResult:
        input.workerResult,
    });

  if(
    !objectiveResult ||
    typeof objectiveResult !== 'object' ||
    Array.isArray(objectiveResult)
  ){
    failClosed('OBJECTIVE_SOURCE_RESULT_INVALID');
  }

  if(input.workerResult.status !== 'IDLE'){
    if(
      objectiveResult.status !== 'SKIPPED_NON_IDLE' ||
      objectiveResult.ready !== false ||
      objectiveResult.objective !== null
    ){
      failClosed('NON_IDLE_SOURCE_CONTRACT_MISMATCH');
    }

    return Object.freeze({
      schema: BRIDGE_SCHEMA,

      status:
        STATUS.SKIPPED_NON_IDLE,

      reason:
        objectiveResult.reason,

      ready: false,

      mission,
      objective: null,

      workerStatus:
        input.workerResult.status,

      objectiveSourceInvoked:
        true,

      objectiveSourceStatus:
        objectiveResult.status,

      materializerStatus:
        'HOLD',

      canonicalDelegationStatus:
        'BLOCKED',

      authorityBoundary:
        AUTHORITY_BOUNDARY,
    });
  }

  if(
    objectiveResult.status !== 'OBJECTIVE_READY' ||
    objectiveResult.ready !== true ||
    !objectiveResult.objective
  ){
    failClosed('IDLE_OBJECTIVE_NOT_READY');
  }

  if(
    objectiveResult.objective.missionId !==
    APPROVED_MISSION_ID
  ){
    failClosed('OBJECTIVE_MISSION_ID_MISMATCH');
  }

  if(
    objectiveResult.objective.hostBounded !== true ||
    objectiveResult.objective.freeFormModelGenerated !== false
  ){
    failClosed('OBJECTIVE_HOST_BOUNDARY_VIOLATION');
  }

  return Object.freeze({
    schema: BRIDGE_SCHEMA,

    status:
      STATUS.OBJECTIVE_READY,

    reason:
      'HOST_APPROVED_MISSION_OBJECTIVE_READY',

    ready: true,

    mission,
    objective:
      objectiveResult.objective,

    workerStatus:
      input.workerResult.status,

    objectiveSourceInvoked:
      true,

    objectiveSourceStatus:
      objectiveResult.status,

    objectiveAutonomouslyInvented:
      false,

    freeFormObjectiveGeneration:
      false,

    materializerStatus:
      'HOLD',

    canonicalDelegationStatus:
      'BLOCKED',

    authorityBoundary:
      AUTHORITY_BOUNDARY,
  });
}

module.exports = Object.freeze({
  BRIDGE_SCHEMA,
  APPROVED_MISSION_ID,
  OBJECTIVE_SOURCE_RELATIVE_PATH,
  STATUS,
  AUTHORITY_BOUNDARY,
  prepareHostApprovedMissionObjective,
});