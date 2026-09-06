'use strict';

const PLANNER_SCHEMA =
  'NEXUS_PRE_MODEL_SEMANTIC_DECISION_PLANNER_V1';

const APPROVED_MISSION_ID =
  'semantic-nullish-fallback-preserve-explicit-falsy-v1';

const SEMANTIC_LANE =
  'fallback-policy-v1';

const ALLOWED_FALLBACK_POLICIES = Object.freeze([
  'keep_existing',
  'nullish_only',
]);

const STATUS = Object.freeze({
  DECISION_READY: 'DECISION_READY',
  NO_CHANGE: 'NO_CHANGE',
  STOP: 'STOP',
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

  sourceMutationAuthority: false,
  materializerAuthority: false,
  canonicalDelegationAuthority: false,
});

function stop(reason, extra = {}) {
  return Object.freeze({
    schema: PLANNER_SCHEMA,
    status: STATUS.STOP,
    reason,
    ready: false,
    ...extra,
    materializerStatus: 'HOLD',
    canonicalDelegationStatus: 'BLOCKED',
    authorityBoundary: AUTHORITY_BOUNDARY,
  });
}

function isPlainRecord(value) {
  if(
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ){
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  return (
    proto === Object.prototype ||
    proto === null
  );
}

function exactKeys(value, expectedKeys) {
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();

  return (
    actual.length === expected.length &&
    actual.every(
      (key, index) => key === expected[index]
    )
  );
}

function exactOperatorCount(oldLine) {
  if(typeof oldLine !== 'string'){
    return 0;
  }

  let count = 0;
  let index = 0;

  while(true){
    const at = oldLine.indexOf('||', index);

    if(at < 0){
      break;
    }

    count += 1;
    index = at + 2;
  }

  return count;
}

function reconstructTrustedLine(
  oldLine,
  fallbackPolicy
) {
  if(exactOperatorCount(oldLine) !== 1){
    return stop(
      'PRE_MODEL_OLD_OPERATOR_CARDINALITY_NOT_ONE'
    );
  }

  const at = oldLine.indexOf('||');

  const prefix =
    oldLine.slice(0, at);

  const suffix =
    oldLine.slice(at + 2);

  const operator =
    fallbackPolicy === 'nullish_only'
      ? '??'
      : '||';

  return Object.freeze({
    schema: PLANNER_SCHEMA,
    status: 'RECONSTRUCTED',
    line:
      prefix +
      operator +
      suffix,
  });
}

function validateObjectiveResult(objectiveResult) {
  if(!isPlainRecord(objectiveResult)){
    return stop(
      'OBJECTIVE_RESULT_INVALID'
    );
  }

  if(
    objectiveResult.status !== 'OBJECTIVE_READY' ||
    objectiveResult.ready !== true
  ){
    return stop(
      'OBJECTIVE_NOT_READY'
    );
  }

  if(
    !isPlainRecord(objectiveResult.objective)
  ){
    return stop(
      'OBJECTIVE_PAYLOAD_INVALID'
    );
  }

  const objective =
    objectiveResult.objective;

  if(objective.missionId !== APPROVED_MISSION_ID){
    return stop(
      'OBJECTIVE_MISSION_ID_MISMATCH'
    );
  }

  if(objective.hostBounded !== true){
    return stop(
      'OBJECTIVE_NOT_HOST_BOUNDED'
    );
  }

  if(objective.freeFormModelGenerated !== false){
    return stop(
      'OBJECTIVE_FREE_FORM_MODEL_GENERATED'
    );
  }

  if(objective.semanticLane !== SEMANTIC_LANE){
    return stop(
      'OBJECTIVE_SEMANTIC_LANE_MISMATCH'
    );
  }

  if(
    !Array.isArray(
      objective.allowedFallbackPolicies
    ) ||
    objective.allowedFallbackPolicies.length !== 2 ||
    objective.allowedFallbackPolicies[0] !== 'keep_existing' ||
    objective.allowedFallbackPolicies[1] !== 'nullish_only'
  ){
    return stop(
      'OBJECTIVE_POLICY_CONTRACT_MISMATCH'
    );
  }

  return Object.freeze({
    status: 'VALID',
    objective,
  });
}

function planPreModelSemanticDecision(input) {
  if(
    !isPlainRecord(input) ||
    !exactKeys(
      input,
      [
        'objectiveResult',
        'oldLine',
        'selectedFallbackPolicy',
      ]
    )
  ){
    return stop(
      'PRE_MODEL_DECISION_INPUT_INVALID'
    );
  }

  const objectiveValidation =
    validateObjectiveResult(
      input.objectiveResult
    );

  if(objectiveValidation.status !== 'VALID'){
    return objectiveValidation;
  }

  if(
    typeof input.oldLine !== 'string' ||
    input.oldLine.length < 1
  ){
    return stop(
      'PRE_MODEL_OLD_LINE_INVALID'
    );
  }

  if(
    !ALLOWED_FALLBACK_POLICIES.includes(
      input.selectedFallbackPolicy
    )
  ){
    return stop(
      'PRE_MODEL_FALLBACK_POLICY_NOT_ALLOWED',
      {
        selectedFallbackPolicy:
          input.selectedFallbackPolicy,
      }
    );
  }

  if(
    input.selectedFallbackPolicy ===
    'keep_existing'
  ){
    return Object.freeze({
      schema: PLANNER_SCHEMA,

      status:
        STATUS.NO_CHANGE,

      reason:
        'HOST_APPROVED_KEEP_EXISTING_POLICY',

      ready: true,

      missionId:
        APPROVED_MISSION_ID,

      semanticLane:
        SEMANTIC_LANE,

      selectedFallbackPolicy:
        'keep_existing',

      oldLine:
        input.oldLine,

      proposedLine:
        input.oldLine,

      sourceChangeProposed:
        false,

      modelRequired:
        false,

      modelExecuted:
        false,

      patchApplicationAuthorized:
        false,

      materializerStatus:
        'HOLD',

      canonicalDelegationStatus:
        'BLOCKED',

      authorityBoundary:
        AUTHORITY_BOUNDARY,
    });
  }

  const reconstruction =
    reconstructTrustedLine(
      input.oldLine,
      input.selectedFallbackPolicy
    );

  if(reconstruction.status !== 'RECONSTRUCTED'){
    return reconstruction;
  }

  if(reconstruction.line === input.oldLine){
    return stop(
      'PRE_MODEL_RECONSTRUCTION_DID_NOT_CHANGE_OPERATOR'
    );
  }

  return Object.freeze({
    schema: PLANNER_SCHEMA,

    status:
      STATUS.DECISION_READY,

    reason:
      'HOST_APPROVED_NULLISH_ONLY_DETERMINISTIC_DECISION_READY',

    ready: true,

    missionId:
      APPROVED_MISSION_ID,

    semanticLane:
      SEMANTIC_LANE,

    selectedFallbackPolicy:
      'nullish_only',

    oldLine:
      input.oldLine,

    proposedLine:
      reconstruction.line,

    sourceChangeProposed:
      true,

    modelRequired:
      false,

    modelExecuted:
      false,

    patchApplicationAuthorized:
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
  PLANNER_SCHEMA,
  APPROVED_MISSION_ID,
  SEMANTIC_LANE,
  ALLOWED_FALLBACK_POLICIES,
  STATUS,
  AUTHORITY_BOUNDARY,
  exactOperatorCount,
  reconstructTrustedLine,
  planPreModelSemanticDecision,
});