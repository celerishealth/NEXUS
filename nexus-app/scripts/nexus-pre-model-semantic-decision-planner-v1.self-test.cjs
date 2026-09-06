'use strict';

const {
  PLANNER_SCHEMA,
  APPROVED_MISSION_ID,
  SEMANTIC_LANE,
  ALLOWED_FALLBACK_POLICIES,
  STATUS,
  AUTHORITY_BOUNDARY,
  exactOperatorCount,
  reconstructTrustedLine,
  planPreModelSemanticDecision,
} = require('./nexus-pre-model-semantic-decision-planner-v1.cjs');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION_FAILED:${message}`);
  }
}

function assertZeroAuthority(result, label) {
  const keys = [
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
    'sourceMutationAuthority',
    'materializerAuthority',
    'canonicalDelegationAuthority',
  ];

  for (const key of keys) {
    assert(
      result.authorityBoundary[key] === false,
      `${label}:FORBIDDEN_AUTHORITY_OPEN:${key}`
    );
  }
}

assert(
  PLANNER_SCHEMA ===
    'NEXUS_PRE_MODEL_SEMANTIC_DECISION_PLANNER_V1',
  'PLANNER_SCHEMA_MISMATCH'
);

assert(
  APPROVED_MISSION_ID ===
    'semantic-nullish-fallback-preserve-explicit-falsy-v1',
  'MISSION_ID_MISMATCH'
);

assert(
  SEMANTIC_LANE === 'fallback-policy-v1',
  'SEMANTIC_LANE_MISMATCH'
);

assert(
  JSON.stringify([...ALLOWED_FALLBACK_POLICIES]) ===
    JSON.stringify([
      'keep_existing',
      'nullish_only',
    ]),
  'POLICY_LIST_MISMATCH'
);

assert(
  exactOperatorCount('const x = supplied || fallback;') === 1,
  'EXACT_OPERATOR_COUNT_ONE_FAILED'
);

assert(
  exactOperatorCount('const x = a || b || c;') === 2,
  'EXACT_OPERATOR_COUNT_TWO_FAILED'
);

assert(
  exactOperatorCount('const x = supplied ?? fallback;') === 0,
  'EXACT_OPERATOR_COUNT_ZERO_FAILED'
);

const reconstruction =
  reconstructTrustedLine(
    'const value = supplied || fallback;',
    'nullish_only'
  );

assert(
  reconstruction.status === 'RECONSTRUCTED',
  'RECONSTRUCTION_NOT_READY'
);

assert(
  reconstruction.line ===
    'const value = supplied ?? fallback;',
  'RECONSTRUCTION_LINE_MISMATCH'
);

const objectiveResult = Object.freeze({
  status: 'OBJECTIVE_READY',
  ready: true,

  objective: Object.freeze({
    missionId:
      'semantic-nullish-fallback-preserve-explicit-falsy-v1',

    objective:
      'Preserve explicit falsy supplied values by using nullish fallback where semantically appropriate.',

    hostBounded: true,
    freeFormModelGenerated: false,

    semanticLane:
      'fallback-policy-v1',

    allowedFallbackPolicies:
      Object.freeze([
        'keep_existing',
        'nullish_only',
      ]),
  }),
});

const keepExisting =
  planPreModelSemanticDecision({
    objectiveResult,

    oldLine:
      'const value = supplied || fallback;',

    selectedFallbackPolicy:
      'keep_existing',
  });

assert(
  keepExisting.status === STATUS.NO_CHANGE,
  'KEEP_EXISTING_NOT_NO_CHANGE'
);

assert(
  keepExisting.ready === true,
  'KEEP_EXISTING_READY_FALSE'
);

assert(
  keepExisting.oldLine ===
    keepExisting.proposedLine,
  'KEEP_EXISTING_CHANGED_LINE'
);

assert(
  keepExisting.sourceChangeProposed === false,
  'KEEP_EXISTING_SOURCE_CHANGE_PROPOSED'
);

assert(
  keepExisting.modelRequired === false &&
    keepExisting.modelExecuted === false,
  'KEEP_EXISTING_MODEL_AUTHORITY_PRESENT'
);

assert(
  keepExisting.patchApplicationAuthorized === false,
  'KEEP_EXISTING_PATCH_AUTHORITY_PRESENT'
);

assert(
  keepExisting.materializerStatus === 'HOLD',
  'KEEP_EXISTING_MATERIALIZER_NOT_HELD'
);

assert(
  keepExisting.canonicalDelegationStatus === 'BLOCKED',
  'KEEP_EXISTING_CANONICAL_DELEGATION_NOT_BLOCKED'
);

assertZeroAuthority(
  keepExisting,
  'KEEP_EXISTING'
);

const nullishOnly =
  planPreModelSemanticDecision({
    objectiveResult,

    oldLine:
      'const value = supplied || fallback;',

    selectedFallbackPolicy:
      'nullish_only',
  });

assert(
  nullishOnly.status === STATUS.DECISION_READY,
  'NULLISH_ONLY_NOT_DECISION_READY'
);

assert(
  nullishOnly.ready === true,
  'NULLISH_ONLY_READY_FALSE'
);

assert(
  nullishOnly.selectedFallbackPolicy ===
    'nullish_only',
  'NULLISH_ONLY_POLICY_MISMATCH'
);

assert(
  nullishOnly.oldLine ===
    'const value = supplied || fallback;',
  'NULLISH_ONLY_OLD_LINE_MISMATCH'
);

assert(
  nullishOnly.proposedLine ===
    'const value = supplied ?? fallback;',
  'NULLISH_ONLY_PROPOSED_LINE_MISMATCH'
);

assert(
  nullishOnly.sourceChangeProposed === true,
  'NULLISH_ONLY_CHANGE_NOT_PROPOSED'
);

assert(
  nullishOnly.modelRequired === false &&
    nullishOnly.modelExecuted === false,
  'NULLISH_ONLY_MODEL_AUTHORITY_PRESENT'
);

assert(
  nullishOnly.patchApplicationAuthorized === false,
  'NULLISH_ONLY_PATCH_AUTHORITY_PRESENT'
);

assert(
  nullishOnly.materializerStatus === 'HOLD',
  'NULLISH_ONLY_MATERIALIZER_NOT_HELD'
);

assert(
  nullishOnly.canonicalDelegationStatus === 'BLOCKED',
  'NULLISH_ONLY_CANONICAL_DELEGATION_NOT_BLOCKED'
);

assertZeroAuthority(
  nullishOnly,
  'NULLISH_ONLY'
);

const zeroOperator =
  planPreModelSemanticDecision({
    objectiveResult,

    oldLine:
      'const value = supplied ?? fallback;',

    selectedFallbackPolicy:
      'nullish_only',
  });

assert(
  zeroOperator.status === STATUS.STOP,
  'ZERO_OPERATOR_NOT_STOP'
);

assert(
  zeroOperator.reason ===
    'PRE_MODEL_OLD_OPERATOR_CARDINALITY_NOT_ONE',
  'ZERO_OPERATOR_STOP_REASON_MISMATCH'
);

const multipleOperators =
  planPreModelSemanticDecision({
    objectiveResult,

    oldLine:
      'const value = a || b || c;',

    selectedFallbackPolicy:
      'nullish_only',
  });

assert(
  multipleOperators.status === STATUS.STOP,
  'MULTIPLE_OPERATORS_NOT_STOP'
);

assert(
  multipleOperators.reason ===
    'PRE_MODEL_OLD_OPERATOR_CARDINALITY_NOT_ONE',
  'MULTIPLE_OPERATORS_STOP_REASON_MISMATCH'
);

const unauthorizedPolicy =
  planPreModelSemanticDecision({
    objectiveResult,

    oldLine:
      'const value = supplied || fallback;',

    selectedFallbackPolicy:
      'truthy_or',
  });

assert(
  unauthorizedPolicy.status === STATUS.STOP,
  'UNAUTHORIZED_POLICY_NOT_STOP'
);

assert(
  unauthorizedPolicy.reason ===
    'PRE_MODEL_FALLBACK_POLICY_NOT_ALLOWED',
  'UNAUTHORIZED_POLICY_STOP_REASON_MISMATCH'
);

const wrongMission =
  planPreModelSemanticDecision({
    objectiveResult: Object.freeze({
      ...objectiveResult,

      objective: Object.freeze({
        ...objectiveResult.objective,
        missionId: 'invented-mission',
      }),
    }),

    oldLine:
      'const value = supplied || fallback;',

    selectedFallbackPolicy:
      'nullish_only',
  });

assert(
  wrongMission.status === STATUS.STOP,
  'WRONG_MISSION_NOT_STOP'
);

assert(
  wrongMission.reason ===
    'OBJECTIVE_MISSION_ID_MISMATCH',
  'WRONG_MISSION_STOP_REASON_MISMATCH'
);

for (const stopped of [
  zeroOperator,
  multipleOperators,
  unauthorizedPolicy,
  wrongMission,
]) {
  assert(
    stopped.materializerStatus === 'HOLD',
    `STOP_PATH_MATERIALIZER_NOT_HELD:${stopped.reason}`
  );

  assert(
    stopped.canonicalDelegationStatus === 'BLOCKED',
    `STOP_PATH_CANONICAL_NOT_BLOCKED:${stopped.reason}`
  );

  assertZeroAuthority(
    stopped,
    `STOP_PATH:${stopped.reason}`
  );
}

for (const key of Object.keys(AUTHORITY_BOUNDARY)) {
  assert(
    AUTHORITY_BOUNDARY[key] === false,
    `EXPORTED_AUTHORITY_OPEN:${key}`
  );
}

console.log('PLANNER_SCHEMA=PASS');
console.log('MISSION_ID_LOCK=PASS');
console.log('SEMANTIC_LANE_LOCK=PASS');
console.log('ALLOWED_POLICY_LIST=PASS');
console.log('KEEP_EXISTING_NO_CHANGE=PASS');
console.log('NULLISH_ONLY_DETERMINISTIC_RECONSTRUCTION=PASS');
console.log('NULLISH_ONLY_OPERATOR_TRANSFORM=||_TO_??_PASS');
console.log('ZERO_OPERATOR_FAIL_CLOSED=PASS');
console.log('MULTIPLE_OPERATOR_FAIL_CLOSED=PASS');
console.log('UNAUTHORIZED_POLICY_FAIL_CLOSED=PASS');
console.log('WRONG_MISSION_FAIL_CLOSED=PASS');
console.log('MODEL_REQUIRED_FALSE=PASS');
console.log('MODEL_EXECUTED_FALSE=PASS');
console.log('PATCH_APPLICATION_AUTHORIZED_FALSE=PASS');
console.log('MATERIALIZER_HOLD=PASS');
console.log('CANONICAL_DELEGATION_BLOCK=PASS');
console.log('ALL_EXECUTION_AND_WRITE_AUTHORITIES_ZERO=PASS');
console.log('FAST_SAFE_291B_PRE_MODEL_PLANNER_SYNTHETIC_SELF_TEST=PASS');