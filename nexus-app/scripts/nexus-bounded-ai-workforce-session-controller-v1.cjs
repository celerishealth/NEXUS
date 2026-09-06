"use strict";

const fs=require("node:fs");
const path=require("node:path");

const feeder=require(
  "../tools/nexus-autonomy-v1/autonomous-task-feeder.cjs"
);

const worker=require(
  "../tools/nexus-autonomy-v1/continuous-worker.cjs"
);

const bridge=require(
  "./nexus-owner-controlled-bounded-worker-start-bridge-v1.cjs"
);

const SCHEMA=
"nexus.autonomy.bounded-ai-workforce-session-controller.v1";

const MAX_TASKS=3;

function stop(reason,extra={}){
  return Object.freeze({
    schema:SCHEMA,
    status:"STOP",
    reason,
    sessionCompleted:false,
    workerExecutionAuthority:false,
    queueMutationAuthority:false,
    patchApplicationAuthority:false,
    patchPromotionAuthorized:false,
    databaseAuthority:false,
    productionAuthority:false,
    ...extra
  });
}

function isPlainRecord(value){
  return (
    value!==null &&
    typeof value==="object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value)===Object.prototype
  );
}

function safeNamespace(value){
  return (
    typeof value==="string" &&
    /^[a-z0-9][a-z0-9-]{2,48}$/.test(value)
  );
}

function queueParent(){
  if(
    typeof process.env.LOCALAPPDATA!=="string" ||
    process.env.LOCALAPPDATA.length<1
  ){
    return null;
  }

  return path.resolve(
    process.env.LOCALAPPDATA,
    "NEXUS",
    "autonomy-v1",
    "queues"
  );
}

async function runBoundedAiWorkforceSession(input){
  if(!isPlainRecord(input)){
    return stop("SESSION_INPUT_INVALID");
  }

  if(input.ownerControlEnabled!==true){
    return stop("SESSION_OWNER_CONTROL_REQUIRED");
  }

  if(input.ownerDecision!=="APPROVE"){
    return stop("SESSION_OWNER_APPROVAL_REQUIRED");
  }

  if(
    typeof input.repoRoot!=="string" ||
    !path.isAbsolute(input.repoRoot)
  ){
    return stop("SESSION_REPO_ROOT_INVALID");
  }

  if(!safeNamespace(input.queueNamespace)){
    return stop("SESSION_QUEUE_NAMESPACE_INVALID");
  }

  if(
    !Array.isArray(input.proposals) ||
    input.proposals.length<1 ||
    input.proposals.length>MAX_TASKS
  ){
    return stop("SESSION_PROPOSAL_COUNT_INVALID");
  }

  for(const proposal of input.proposals){
    if(!isPlainRecord(proposal)){
      return stop("SESSION_PROPOSAL_INVALID");
    }
  }

  const activationToken=
    worker.CONTINUOUS_ACTIVATION_TOKEN;

  if(
    typeof activationToken!=="string" ||
    activationToken.length<1
  ){
    return stop("SESSION_ACTIVATION_TOKEN_UNAVAILABLE");
  }

  const parent=queueParent();

  if(parent===null){
    return stop("SESSION_QUEUE_PARENT_UNAVAILABLE");
  }

  const results=[];

  for(
    let index=0;
    index<input.proposals.length;
    index++
  ){
    const proposal=input.proposals[index];

    const queueRoot=path.join(
      parent,
      input.queueNamespace+
      "-"+
      String(index+1)
    );

    if(fs.existsSync(queueRoot)){
      return stop(
        "SESSION_QUEUE_ALREADY_EXISTS",
        Object.freeze({
          failedIndex:index,
          results:Object.freeze([...results])
        })
      );
    }

    const feedResult=
      await feeder.feedPlannerProposal({
        proposal,
        queueRoot,
        repoRoot:input.repoRoot
      });

    if(
      !feedResult ||
      feedResult.status!=="ENQUEUED" ||
      feedResult.queued!==true
    ){
      return stop(
        "SESSION_FEED_REJECTED",
        Object.freeze({
          failedIndex:index,
          feedResult:feedResult ?? null,
          results:Object.freeze([...results])
        })
      );
    }

    const workerResult=
      await bridge.runOwnerControlledBoundedWorkerStart({
        activationToken,
        ownerControlEnabled:true,
        ownerDecision:"APPROVE",
        queueRoot,
        workerOptions:{
          activationToken,
          heartbeatMs:1000,
          intervalMs:250,
          leaseTimeoutMs:5000,
          repoRoot:input.repoRoot,
          stopOnTaskStop:true
        }
      });

    const resultRecord=Object.freeze({
      index,
      taskId:
        feedResult.taskId ?? null,
      queueRoot,
      feedStatus:
        feedResult.status ?? null,
      workerStatus:
        workerResult?.status ?? null,
      workerStarted:
        workerResult?.workerStarted ?? false,
      workerCycles:
        workerResult?.workerResult?.cycles ?? null,
      lastResultStatus:
        workerResult?.workerResult?.lastResult?.status ?? null,
      lastResultReason:
        workerResult?.workerResult?.lastResult?.reason ?? null,
      patchSha256:
        workerResult?.workerResult?.lastResult?.patchSha256 ?? null,
      evidenceSha256:
        workerResult?.workerResult?.lastResult?.evidenceSha256 ?? null
    });

    results.push(resultRecord);

    if(
      resultRecord.workerStarted!==true ||
      resultRecord.workerCycles!==1
    ){
      return stop(
        "SESSION_WORKER_BOUNDARY_FAILURE",
        Object.freeze({
          failedIndex:index,
          results:Object.freeze([...results])
        })
      );
    }

    if(
      resultRecord.lastResultStatus!=="PATCH_READY"
    ){
      return stop(
        "SESSION_TASK_NOT_PATCH_READY",
        Object.freeze({
          failedIndex:index,
          results:Object.freeze([...results])
        })
      );
    }
  }

  return Object.freeze({
    schema:SCHEMA,
    status:"SESSION_COMPLETE",
    reason:null,
    sessionCompleted:true,
    taskCount:results.length,
    results:Object.freeze(results),

    continuousModeAuthorized:false,
    maxTasksAuthorized:MAX_TASKS,

    workerExecutionAuthority:false,
    queueMutationAuthority:false,
    modelExecutionAuthority:false,
    patchApplicationAuthority:false,
    patchPromotionAuthorized:false,
    databaseAuthority:false,
    productionAuthority:false
  });
}

module.exports=Object.freeze({
  SCHEMA,
  MAX_TASKS,
  runBoundedAiWorkforceSession
});