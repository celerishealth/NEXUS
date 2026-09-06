"use strict";

const {
  ROUTER_SCHEMA,
  runOwnerControlledAiEmployeeBuildRouter,
}=require("./owner-controlled-ai-employee-build-router.cjs");

const {
  CONTINUOUS_ACTIVATION_TOKEN,
}=require("./continuous-worker.cjs");

const WORKFORCE_ENTRY_SCHEMA=
  "nexus.autonomy.owner-controlled-ai-workforce-build-entry.v1";

const DESIGN_SHA256=
  "ee1ff5206049912cfdb274d2757c59b793a4f0dae4e7019a8e0b8bc8a71d9183";

const EXPECTED_ROUTER_SHA256=
  "af15048e8931bb526ffe35b210fe030be1653a687c9ab18892af3991bce913b3";

const EXPECTED_CONTINUOUS_WORKER_SHA256=
  "7698be6f22b5a8a9266661bab1e0326973748ad13203ec9efa31db074afceb2a";

const INPUT_KEYS=Object.freeze([
  "activationToken",
  "executionAuthorized",
  "ownerControlEnabled",
  "request",
  "route",
  "schema",
]);

const ROUTES=Object.freeze([
  "prepared_build",
  "semantic_build",
]);

function isPlainRecord(value){
  return (
    value!==null &&
    typeof value==="object" &&
    !Array.isArray(value) &&
    (
      Object.getPrototypeOf(value)===Object.prototype ||
      Object.getPrototypeOf(value)===null
    )
  );
}

function exactKeys(value,expected){
  if(!isPlainRecord(value)){
    return false;
  }

  const actual=
    Object.keys(value).sort();

  const wanted=
    [...expected].sort();

  return (
    actual.length===wanted.length &&
    actual.every(
      (key,index)=>
        key===wanted[index]
    )
  );
}

function stop(
  reason,
  extra={}
){
  return Object.freeze({
    schema:WORKFORCE_ENTRY_SCHEMA,
    status:"STOP",
    reason,

    ownerAuthorized:false,
    executionAuthorized:false,

    selectedRoute:null,
    delegated:false,

    routerStatus:null,
    routerReason:null,
    routerResult:null,

    queueCreationAuthority:false,
    mutationConstructionAuthority:false,
    checkConstructionAuthority:false,
    semanticPolicyAuthority:false,
    replacementLineAuthority:false,
    modelExecutionAuthority:false,
    workerExecutionAuthority:false,
    patchApplicationAuthority:false,
    patchPromotionAuthorized:false,
    continuousModeAuthorized:false,
    scheduledModeAuthorized:false,

    ...extra,
  });
}

function authorizeOwnerAiWorkforceBuild(input){
  if(!isPlainRecord(input)){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_INPUT_INVALID"
    );
  }

  if(
    !exactKeys(
      input,
      INPUT_KEYS
    )
  ){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_INPUT_SHAPE_INVALID"
    );
  }

  if(
    input.schema!==
    WORKFORCE_ENTRY_SCHEMA
  ){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_SCHEMA_INVALID"
    );
  }

  if(
    input.route!=="prepared_build" &&
    input.route!=="semantic_build"
  ){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_ROUTE_INVALID"
    );
  }

  if(!isPlainRecord(input.request)){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_REQUEST_INVALID"
    );
  }

  if(input.ownerControlEnabled!==true){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_OWNER_CONTROL_DISABLED",
      {
        selectedRoute:input.route,
      }
    );
  }

  if(
    typeof CONTINUOUS_ACTIVATION_TOKEN!=="string" ||
    CONTINUOUS_ACTIVATION_TOKEN.length<1 ||
    typeof input.activationToken!=="string" ||
    input.activationToken!==
      CONTINUOUS_ACTIVATION_TOKEN
  ){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_ACTIVATION_TOKEN_REQUIRED",
      {
        selectedRoute:input.route,
      }
    );
  }

  if(input.executionAuthorized!==true){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_EXECUTION_NOT_AUTHORIZED",
      {
        ownerAuthorized:true,
        selectedRoute:input.route,
      }
    );
  }

  return Object.freeze({
    schema:WORKFORCE_ENTRY_SCHEMA,
    status:"AUTHORIZED",
    reason:"AI_WORKFORCE_BUILD_ENTRY_AUTHORIZED",

    ownerAuthorized:true,
    executionAuthorized:true,

    selectedRoute:input.route,
    delegated:false,

    queueCreationAuthority:false,
    mutationConstructionAuthority:false,
    checkConstructionAuthority:false,
    semanticPolicyAuthority:false,
    replacementLineAuthority:false,
    modelExecutionAuthority:false,
    workerExecutionAuthority:false,
    patchApplicationAuthority:false,
    patchPromotionAuthorized:false,
    continuousModeAuthorized:false,
    scheduledModeAuthorized:false,
  });
}

async function runOwnerControlledAiWorkforceBuild(input){
  const authorization=
    authorizeOwnerAiWorkforceBuild(input);

  if(authorization.status!=="AUTHORIZED"){
    return authorization;
  }

  /*
    Entry creates only the router envelope.

    Child request identity is preserved exactly.
    No owner token or execution authority is injected
    into the child request.
  */
  const routerInput=Object.freeze({
    schema:ROUTER_SCHEMA,
    route:input.route,
    request:input.request,
  });

  let routerResult;

  try{
    routerResult=
      await runOwnerControlledAiEmployeeBuildRouter(
        routerInput
      );
  }catch(error){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_ROUTER_THROW:"+
      String(
        error?.message ||
        error
      ),
      {
        ownerAuthorized:true,
        executionAuthorized:true,
        selectedRoute:input.route,
        delegated:true,
      }
    );
  }

  if(!isPlainRecord(routerResult)){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_ROUTER_RESULT_INVALID",
      {
        ownerAuthorized:true,
        executionAuthorized:true,
        selectedRoute:input.route,
        delegated:true,
      }
    );
  }

  if(
    typeof routerResult.status!=="string" ||
    routerResult.status.length<1
  ){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_ROUTER_STATUS_INVALID",
      {
        ownerAuthorized:true,
        executionAuthorized:true,
        selectedRoute:input.route,
        delegated:true,
        routerResult,
      }
    );
  }

  /*
    Even an unexpected downstream promotion claim
    cannot cross this owner/workforce boundary.
  */
  if(
    routerResult.patchPromotionAuthorized===true
  ){
    return stop(
      "AI_WORKFORCE_BUILD_ENTRY_PATCH_PROMOTION_BOUNDARY_VIOLATION",
      {
        ownerAuthorized:true,
        executionAuthorized:true,
        selectedRoute:input.route,
        delegated:true,

        routerStatus:
          routerResult.status,

        routerReason:
          routerResult.reason ?? null,

        routerResult,
      }
    );
  }

  return Object.freeze({
    schema:WORKFORCE_ENTRY_SCHEMA,

    status:
      routerResult.status,

    reason:
      routerResult.reason ?? null,

    ownerAuthorized:true,
    executionAuthorized:true,

    selectedRoute:
      input.route,

    delegated:true,

    routerStatus:
      routerResult.status,

    routerReason:
      routerResult.reason ?? null,

    routerResult,

    queueCreationAuthority:false,
    mutationConstructionAuthority:false,
    checkConstructionAuthority:false,
    semanticPolicyAuthority:false,
    replacementLineAuthority:false,
    modelExecutionAuthority:false,
    workerExecutionAuthority:false,
    patchApplicationAuthority:false,
    patchPromotionAuthorized:false,
    continuousModeAuthorized:false,
    scheduledModeAuthorized:false,
  });
}

module.exports=Object.freeze({
  WORKFORCE_ENTRY_SCHEMA,
  DESIGN_SHA256,
  EXPECTED_ROUTER_SHA256,
  EXPECTED_CONTINUOUS_WORKER_SHA256,
  ROUTES,
  ROUTER_SCHEMA,
  authorizeOwnerAiWorkforceBuild,
  runOwnerControlledAiWorkforceBuild,
});