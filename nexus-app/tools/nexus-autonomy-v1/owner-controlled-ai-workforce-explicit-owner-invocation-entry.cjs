"use strict";

const {
  BRIDGE_SCHEMA,
  runOwnerControlledAiWorkforceCanonicalTaskAssignmentBridge,
}=require("./owner-controlled-ai-workforce-canonical-task-assignment-bridge.cjs");

const ENTRY_SCHEMA =
  "nexus.autonomy.owner-ai-workforce-explicit-owner-invocation-entry.v1";

const DESIGN_SHA256 =
  "306b269927ed997f7330912362c74a14291bbe66397cebddc88c49c3e59d1a00";

const EXPECTED_CANONICAL_BRIDGE_SHA256 =
  "fd0f0759da128ab07930463a3678784e856b9395faf41610d786a1e95bf9b3dc";

const INPUT_KEYS = Object.freeze([
  "activationToken",
  "employeeRole",
  "executionAuthorized",
  "ownerControlEnabled",
  "request",
  "route",
  "schema",
  "task",
]);

function isPlainRecord(value){
  if(
    !value ||
    typeof value!=="object" ||
    Array.isArray(value)
  ){
    return false;
  }

  const proto =
    Object.getPrototypeOf(value);

  return (
    proto===Object.prototype ||
    proto===null
  );
}

function exactKeys(
  value,
  expected
){
  if(!isPlainRecord(value)){
    return false;
  }

  const actual =
    Object.keys(value).sort();

  const wanted =
    [...expected].sort();

  if(actual.length!==wanted.length){
    return false;
  }

  return actual.every(
    (key,index)=>
      key===wanted[index]
  );
}

function stop(
  reason,
  extra={}
){
  return Object.freeze({
    schema:ENTRY_SCHEMA,
    status:"STOP",

    reason,

    delegated:false,

    ownerAuthorityGenerated:false,
    executionAuthorityGenerated:false,
    activationTokenGenerated:false,
    activationTokenInjected:false,

    continuousModeAuthorized:false,
    scheduledModeAuthorized:false,

    modelExecutionAuthority:false,
    workerExecutionAuthority:false,
    queueMutationAuthority:false,

    patchApplicationAuthority:false,
    patchPromotionAuthorized:false,

    databaseAuthority:false,
    productionAuthority:false,

    ...extra,
  });
}

async function runOwnerControlledAiWorkforceExplicitOwnerInvocationEntry(
  input
){
  if(!isPlainRecord(input)){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_INPUT_INVALID"
    );
  }

  if(
    !exactKeys(
      input,
      INPUT_KEYS
    )
  ){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_INPUT_SHAPE_INVALID"
    );
  }

  if(
    input.schema!==
    ENTRY_SCHEMA
  ){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_SCHEMA_INVALID"
    );
  }

  /*
    This boundary does not create owner authority.

    ownerControlEnabled must be explicitly supplied
    by the caller.
  */
  if(
    input.ownerControlEnabled!==true
  ){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_OWNER_CONTROL_REQUIRED"
    );
  }

  /*
    This boundary does not true-up or create
    execution authorization.

    executionAuthorized must already be true
    at the caller boundary.
  */
  if(
    input.executionAuthorized!==true
  ){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_EXECUTION_AUTHORIZATION_REQUIRED"
    );
  }

  /*
    Only structural presence is checked here.

    Token equality/acceptance remains downstream
    owner-controlled authority and is deliberately
    not duplicated at this entry boundary.
  */
  if(
    typeof input.activationToken!=="string"
  ){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_ACTIVATION_TOKEN_TYPE_INVALID"
    );
  }

  if(
    input.activationToken.length<1
  ){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_ACTIVATION_TOKEN_REQUIRED"
    );
  }

  /*
    No role inference.
    No route inference.
    No request construction/enrichment.
    No task construction.

    Request and task references are forwarded
    exactly as supplied by the caller.
  */
  const bridgeInput =
    Object.freeze({
      activationToken:
        input.activationToken,

      employeeRole:
        input.employeeRole,

      executionAuthorized:
        input.executionAuthorized,

      ownerControlEnabled:
        input.ownerControlEnabled,

      request:
        input.request,

      route:
        input.route,

      schema:
        BRIDGE_SCHEMA,

      task:
        input.task,
    });

  let bridgeResult;

  try{
    bridgeResult =
      await runOwnerControlledAiWorkforceCanonicalTaskAssignmentBridge(
        bridgeInput
      );
  }
  catch(error){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_BRIDGE_THROW:"+
      String(
        error?.message ||
        error
      ),
      {
        delegated:true,
      }
    );
  }

  if(!isPlainRecord(bridgeResult)){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_BRIDGE_RESULT_INVALID",
      {
        delegated:true,
      }
    );
  }

  if(
    bridgeResult.schema!==
    BRIDGE_SCHEMA ||
    typeof bridgeResult.status!=="string" ||
    bridgeResult.status.length<1
  ){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_BRIDGE_RESULT_INVALID",
      {
        delegated:true,
        bridgeResult,
      }
    );
  }

  /*
    This entry can never convert any downstream
    result into patch-promotion authority.
  */
  if(
    bridgeResult.patchPromotionAuthorized===true
  ){
    return stop(
      "EXPLICIT_OWNER_INVOCATION_BRIDGE_AUTHORITY_BOUNDARY_VIOLATION",
      {
        delegated:true,
        bridgeResult,
      }
    );
  }

  /*
    STOP and success-like statuses are both
    retained exactly from the canonical bridge.
    No synthetic success is created here.
  */
  return Object.freeze({
    schema:ENTRY_SCHEMA,

    status:
      bridgeResult.status,

    reason:
      typeof bridgeResult.reason==="string"
        ? bridgeResult.reason
        : null,

    delegated:true,

    ownerControlForwarded:
      input.ownerControlEnabled===true,

    executionAuthorizationForwarded:
      input.executionAuthorized===true,

    activationTokenForwarded:true,

    employeeRole:
      input.employeeRole,

    route:
      input.route,

    bridgeResult,

    ownerAuthorityGenerated:false,
    executionAuthorityGenerated:false,
    activationTokenGenerated:false,
    activationTokenInjected:false,

    continuousModeAuthorized:false,
    scheduledModeAuthorized:false,

    modelExecutionAuthority:false,
    workerExecutionAuthority:false,
    queueMutationAuthority:false,

    patchApplicationAuthority:false,
    patchPromotionAuthorized:false,

    databaseAuthority:false,
    productionAuthority:false,
  });
}

module.exports=Object.freeze({
  ENTRY_SCHEMA,
  DESIGN_SHA256,
  EXPECTED_CANONICAL_BRIDGE_SHA256,
  runOwnerControlledAiWorkforceExplicitOwnerInvocationEntry,
});