"use strict";

const {
  WORKFORCE_ENTRY_SCHEMA,
  runOwnerControlledAiWorkforceBuild,
}=require("./owner-controlled-ai-workforce-build-entry.cjs");

const ASSIGNMENT_SCHEMA=
  "nexus.autonomy.owner-ai-workforce-task-assignment.v1";

const DESIGN_SHA256=
  "c4d569d18a84e2ed14253cb6fd548b3d73b97d4d7f15059e1d66d425b206512f";

const EXPECTED_WORKFORCE_ENTRY_SHA256=
  "70eea45f106cb7945a6675afdb61334826188c74d188dc6577e8eb3a4b6cf9c6";

const SUPPORTED_EMPLOYEE_ROLES=
  Object.freeze([
    "build_engineer",
  ]);

const ROUTES=
  Object.freeze([
    "prepared_build",
    "semantic_build",
  ]);

const INPUT_KEYS=
  Object.freeze([
    "activationToken",
    "employeeRole",
    "executionAuthorized",
    "ownerControlEnabled",
    "request",
    "route",
    "schema",
    "taskId",
  ]);

const PREPARED_ROUTE_STATUSES=
  Object.freeze([
    "DUPLICATE_TASK_ID",
    "ENQUEUED",
    "STOP",
    "WAIT_OWNER",
  ]);

const SEMANTIC_ROUTE_STATUSES=
  Object.freeze([
    "PATCH_READY",
    "STOP",
  ]);

function isPlainRecord(value){
  if(
    value===null ||
    typeof value!=="object" ||
    Array.isArray(value)
  ){
    return false;
  }

  let prototype;

  try{
    prototype=
      Object.getPrototypeOf(value);
  }catch{
    return false;
  }

  return (
    prototype===Object.prototype ||
    prototype===null
  );
}

function exactKeys(
  value,
  expected
){
  if(!isPlainRecord(value)){
    return false;
  }

  let actual;

  try{
    actual=
      Object.keys(value).sort();
  }catch{
    return false;
  }

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

function authorityFields(){
  return {
    queueCreationAuthority:false,
    mutationConstructionAuthority:false,
    checkConstructionAuthority:false,
    semanticPolicyAuthority:false,
    replacementLineAuthority:false,
    modelExecutionAuthority:false,
    workerExecutionAuthority:false,
    patchApplicationAuthority:false,
    newFileAuthority:false,
    patchPromotionAuthorized:false,
    continuousModeAuthorized:false,
    scheduledModeAuthorized:false,
  };
}

function stop(
  reason,
  extra={}
){
  return Object.freeze({
    schema:ASSIGNMENT_SCHEMA,
    status:"STOP",
    reason,

    taskId:null,
    assignedRole:null,

    ownerAuthorized:false,
    executionAuthorized:false,
    delegated:false,

    workforceStatus:null,
    workforceReason:null,
    workforceResult:null,

    ...authorityFields(),
    ...extra,
  });
}

function allowedWorkforceStatus(
  route,
  status
){
  if(route==="prepared_build"){
    return PREPARED_ROUTE_STATUSES.includes(
      status
    );
  }

  if(route==="semantic_build"){
    return SEMANTIC_ROUTE_STATUSES.includes(
      status
    );
  }

  return false;
}

async function runOwnerControlledAiWorkforceTaskAssignment(
  input
){
  /*
    Assignment is a sidecar envelope above the
    existing owner-controlled workforce entry.

    It does not mutate nexus.autonomy.task.v1,
    choose a fallback route, create a queue,
    run a model/worker directly, or promote a patch.
  */

  if(!isPlainRecord(input)){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_INPUT_INVALID"
    );
  }

  if(
    !exactKeys(
      input,
      INPUT_KEYS
    )
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_INPUT_SHAPE_INVALID"
    );
  }

  if(input.schema!==ASSIGNMENT_SCHEMA){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_SCHEMA_INVALID"
    );
  }

  if(
    input.employeeRole!=="build_engineer"
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_ROLE_UNSUPPORTED"
    );
  }

  if(
    input.route!=="prepared_build" &&
    input.route!=="semantic_build"
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_ROUTE_INVALID",
      {
        assignedRole:input.employeeRole,
      }
    );
  }

  if(
    typeof input.taskId!=="string" ||
    input.taskId.length<1
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_TASK_ID_INVALID",
      {
        assignedRole:input.employeeRole,
      }
    );
  }

  if(!isPlainRecord(input.request)){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_REQUEST_INVALID",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
      }
    );
  }

  let requestTaskIdDescriptor;

  try{
    requestTaskIdDescriptor=
      Object.getOwnPropertyDescriptor(
        input.request,
        "taskId"
      );
  }catch{
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_REQUEST_TASK_ID_DESCRIPTOR_INVALID",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
      }
    );
  }

  if(!requestTaskIdDescriptor){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_REQUEST_TASK_ID_REQUIRED",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
      }
    );
  }

  if(
    !Object.prototype.hasOwnProperty.call(
      requestTaskIdDescriptor,
      "value"
    )
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_REQUEST_TASK_ID_ACCESSOR_FORBIDDEN",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
      }
    );
  }

  if(
    requestTaskIdDescriptor.value!==
      input.taskId
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_TASK_ID_MISMATCH",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
      }
    );
  }

  if(input.ownerControlEnabled!==true){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_OWNER_CONTROL_DISABLED",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
      }
    );
  }

  if(input.executionAuthorized!==true){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_EXECUTION_NOT_AUTHORIZED",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
      }
    );
  }

  if(
    typeof input.activationToken!=="string" ||
    input.activationToken.length<1
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_ACTIVATION_TOKEN_REQUIRED",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
      }
    );
  }

  /*
    Exact child request reference is retained.
    taskId is never injected, copied, normalized,
    enriched, or rewritten inside the child request.
  */
  const workforceInput=
    Object.freeze({
      activationToken:
        input.activationToken,

      executionAuthorized:
        input.executionAuthorized,

      ownerControlEnabled:
        input.ownerControlEnabled,

      request:
        input.request,

      route:
        input.route,

      schema:
        WORKFORCE_ENTRY_SCHEMA,
    });

  let workforceResult;

  try{
    /*
      Exactly one workforce delegation.
      No retry and no cross-route fallback.
    */
    workforceResult=
      await runOwnerControlledAiWorkforceBuild(
        workforceInput
      );
  }catch(error){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_WORKFORCE_THROW:"+
      String(
        error?.message ||
        error
      ),
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
        delegated:true,
      }
    );
  }

  if(!isPlainRecord(workforceResult)){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_WORKFORCE_RESULT_INVALID",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
        delegated:true,
      }
    );
  }

  if(
    workforceResult.schema!==
      WORKFORCE_ENTRY_SCHEMA
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_WORKFORCE_SCHEMA_INVALID",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
        delegated:true,
        workforceResult,
      }
    );
  }

  if(
    typeof workforceResult.status!=="string" ||
    workforceResult.status.length<1
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_WORKFORCE_STATUS_INVALID",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
        delegated:true,
        workforceResult,
      }
    );
  }

  if(
    !allowedWorkforceStatus(
      input.route,
      workforceResult.status
    )
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_WORKFORCE_ROUTE_STATUS_INVALID",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
        delegated:true,
        workforceStatus:
          workforceResult.status,

        workforceReason:
          workforceResult.reason ?? null,

        workforceResult,
      }
    );
  }

  if(
    workforceResult.patchPromotionAuthorized===
      true
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_PATCH_PROMOTION_BOUNDARY_VIOLATION",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
        delegated:true,

        workforceStatus:
          workforceResult.status,

        workforceReason:
          workforceResult.reason ?? null,

        workforceResult,
      }
    );
  }

  /*
    Any non-STOP result must prove that the
    existing workforce entry actually crossed
    its owner/execution gate and preserved
    the caller-selected route.

    STOP remains transparent because the
    existing workforce entry may legitimately
    stop before downstream delegation.
  */
  if(
    workforceResult.status!=="STOP" &&
    (
      workforceResult.ownerAuthorized!==true ||
      workforceResult.executionAuthorized!==true ||
      workforceResult.delegated!==true ||
      workforceResult.selectedRoute!==input.route
    )
  ){
    return stop(
      "AI_WORKFORCE_TASK_ASSIGNMENT_WORKFORCE_AUTHORITY_INCONSISTENT",
      {
        taskId:input.taskId,
        assignedRole:input.employeeRole,
        delegated:true,

        workforceStatus:
          workforceResult.status,

        workforceReason:
          workforceResult.reason ?? null,

        workforceResult,
      }
    );
  }

  return Object.freeze({
    schema:ASSIGNMENT_SCHEMA,

    status:
      workforceResult.status,

    reason:
      workforceResult.reason ?? null,

    taskId:
      input.taskId,

    assignedRole:
      input.employeeRole,

    ownerAuthorized:
      workforceResult.ownerAuthorized===true,

    executionAuthorized:
      workforceResult.executionAuthorized===true,

    delegated:true,

    workforceStatus:
      workforceResult.status,

    workforceReason:
      workforceResult.reason ?? null,

    workforceResult,

    ...authorityFields(),
  });
}

module.exports=
  Object.freeze({
    ASSIGNMENT_SCHEMA,
    DESIGN_SHA256,
    EXPECTED_WORKFORCE_ENTRY_SHA256,
    SUPPORTED_EMPLOYEE_ROLES,
    ROUTES,
    INPUT_KEYS,
    PREPARED_ROUTE_STATUSES,
    SEMANTIC_ROUTE_STATUSES,
    WORKFORCE_ENTRY_SCHEMA,
    runOwnerControlledAiWorkforceTaskAssignment,
  });