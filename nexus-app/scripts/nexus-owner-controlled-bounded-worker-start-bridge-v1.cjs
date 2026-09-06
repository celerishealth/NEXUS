"use strict";

const crypto=require("crypto");
const fs=require("fs");
const path=require("path");

const SCHEMA=
"nexus.autonomy.owner-controlled-bounded-worker-start-bridge.v1";

const EXPECTED_WORKER_SHA256="7698be6f22b5a8a9266661bab1e0326973748ad13203ec9efa31db074afceb2a";

const WORKER_OPTION_KEYS=Object.freeze(["activationToken","heartbeatMs","intervalMs","leaseTimeoutMs","maxCycles","mode","queueRoot","repoRoot","stopOnTaskStop"]);

const WORKER_FILE=path.resolve(
  __dirname,
  "../tools/nexus-autonomy-v1/continuous-worker.cjs"
);

const INPUT_KEYS=Object.freeze([
  "activationToken",
  "ownerControlEnabled",
  "ownerDecision",
  "queueRoot",
  "workerOptions"
]);

function stop(reason){
  return Object.freeze({
    schema:SCHEMA,
    status:"STOP",
    reason,
    workerStarted:false,
    workerExecutionAuthority:false,
    queueMutationAuthority:false,
    modelExecutionAuthority:false,
    databaseAuthority:false,
    productionAuthority:false
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

function exactKeys(value,keys){
  if(!isPlainRecord(value)) return false;

  const actual=Object.keys(value).sort();
  const expected=[...keys].sort();

  return (
    actual.length===expected.length &&
    actual.every((key,index)=>key===expected[index])
  );
}

function sha256File(file){
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(file))
    .digest("hex");
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

function pathInside(parent,child){
  const relative=path.relative(parent,child);

  return (
    relative.length>0 &&
    !relative.startsWith(".."+path.sep) &&
    relative!==".." &&
    !path.isAbsolute(relative)
  );
}

async function runOwnerControlledBoundedWorkerStart(input){
  if(!exactKeys(input,INPUT_KEYS)){
    return stop("BOUNDED_WORKER_START_INPUT_SHAPE_INVALID");
  }

  if(input.ownerControlEnabled!==true){
    return stop("BOUNDED_WORKER_START_OWNER_CONTROL_REQUIRED");
  }

  if(input.ownerDecision!=="APPROVE"){
    return stop("BOUNDED_WORKER_START_OWNER_APPROVAL_REQUIRED");
  }

  if(
    typeof input.activationToken!=="string" ||
    input.activationToken.length<1
  ){
    return stop("BOUNDED_WORKER_START_ACTIVATION_TOKEN_REQUIRED");
  }

  if(
    typeof input.queueRoot!=="string" ||
    input.queueRoot.length<1
  ){
    return stop("BOUNDED_WORKER_START_QUEUE_ROOT_REQUIRED");
  }

  if(!isPlainRecord(input.workerOptions)){
    return stop("BOUNDED_WORKER_START_OPTIONS_INVALID");
  }

  const parent=queueParent();

  if(parent===null){
    return stop("BOUNDED_WORKER_START_LOCALAPPDATA_REQUIRED");
  }

  const resolvedQueue=path.resolve(input.queueRoot);

  if(!pathInside(parent,resolvedQueue)){
    return stop("BOUNDED_WORKER_START_QUEUE_OUTSIDE_RUNTIME_BOUNDARY");
  }

  if(sha256File(WORKER_FILE)!==EXPECTED_WORKER_SHA256){
    return stop("BOUNDED_WORKER_START_WORKER_HASH_DRIFT");
  }

  for(const key of Object.keys(input.workerOptions)){
    if(!WORKER_OPTION_KEYS.includes(key)){
      return stop("BOUNDED_WORKER_START_UNKNOWN_OPTION:"+key);
    }
  }

  if(
    Object.prototype.hasOwnProperty.call(
      input.workerOptions,
      "queueRoot"
    ) &&
    path.resolve(input.workerOptions.queueRoot)!==resolvedQueue
  ){
    return stop("BOUNDED_WORKER_START_QUEUE_ROOT_MISMATCH");
  }

  /*
    Caller may supply only options recognized by the committed worker.
    This bridge forcibly narrows execution to ONE bounded cycle.
  */
  const options={
    ...input.workerOptions,
    queueRoot:resolvedQueue,
    mode:"bounded",
    maxCycles:1
  };

  if(WORKER_OPTION_KEYS.includes("stopOnTaskStop")){
    options.stopOnTaskStop=true;
  }

  const worker=require(WORKER_FILE);

  if(
    worker===null ||
    typeof worker!=="object" ||
    typeof worker.runWorker!=="function"
  ){
    return stop("BOUNDED_WORKER_START_RUNWORKER_UNAVAILABLE");
  }

  let result;

  try{
    result=await worker.runWorker(
      Object.freeze(options)
    );
  }
  catch(error){
    return stop(
      "BOUNDED_WORKER_START_THROW:"+
      String(error && error.message ? error.message : error)
    );
  }

  if(
    result===null ||
    typeof result!=="object" ||
    typeof result.status!=="string"
  ){
    return stop("BOUNDED_WORKER_START_RESULT_INVALID");
  }

  return Object.freeze({
    schema:SCHEMA,
    status:result.status,
    reason:result.reason ?? null,
    workerResult:result,

    /*
      Capability is consumed only for this bounded invocation.
      It is never returned as reusable authority.
    */
    workerStarted:true,
    boundedCyclesAuthorized:1,
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
  INPUT_KEYS,
  EXPECTED_WORKER_SHA256,
  WORKER_OPTION_KEYS,
  runOwnerControlledBoundedWorkerStart
});